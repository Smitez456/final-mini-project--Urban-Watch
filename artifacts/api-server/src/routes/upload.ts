import express, { Router, type IRouter } from "express";
import { v2 as cloudinary } from "cloudinary";

const router: IRouter = Router();
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_MULTIPART_BYTES = MAX_IMAGE_BYTES + 1024 * 1024;
const MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function hasValidSignature(buffer: Buffer, contentType: string) {
  if (contentType === "image/jpeg") return buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (contentType === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (contentType === "image/webp") return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

async function hasValidFirebaseSession(authorization: string | undefined) {
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  const firebaseApiKey = process.env["VITE_FIREBASE_API_KEY"];
  if (!token || !firebaseApiKey) return false;
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });
  if (!response.ok) return false;
  const data = await response.json() as { users?: Array<{ localId?: string }> };
  return Boolean(data.users?.[0]?.localId);
}

function getMultipartImage(body: Buffer, contentTypeHeader: string) {
  const boundaryMatch = contentTypeHeader.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  const boundary = boundaryMatch?.[1] ?? boundaryMatch?.[2]?.trim();
  if (!boundary) return null;

  const separator = Buffer.from(`--${boundary}`);
  let partStart = body.indexOf(separator);
  while (partStart !== -1) {
    const headersStart = partStart + separator.length + 2;
    const headersEnd = body.indexOf(Buffer.from("\r\n\r\n"), headersStart);
    if (headersEnd === -1) break;
    const headers = body.subarray(headersStart, headersEnd).toString("utf8");
    const nextPart = body.indexOf(separator, headersEnd + 4);
    if (nextPart === -1) break;
    if (/content-disposition:[^\r\n]*\bname="image"/i.test(headers)) {
      const typeMatch = headers.match(/content-type:\s*([^\r\n]+)/i);
      const image = body.subarray(headersEnd + 4, Math.max(headersEnd + 4, nextPart - 2));
      return { image, contentType: typeMatch?.[1]?.trim().toLowerCase() ?? "" };
    }
    partStart = nextPart;
  }
  return null;
}

router.post("/upload/image", express.raw({ type: "multipart/form-data", limit: MAX_MULTIPART_BYTES }), async (req, res) => {
  const multipart = Buffer.isBuffer(req.body)
    ? getMultipartImage(req.body, String(req.headers["content-type"] ?? ""))
    : null;
  if (!multipart) {
    res.status(400).json({ error: "Attach the image using the multipart field named image." });
    return;
  }

  const { image, contentType } = multipart;

  if (!MIME_TYPES.has(contentType) || !hasValidSignature(image, contentType)) {
    res.status(400).json({ error: "Only valid JPG, PNG, and WEBP images are supported." });
    return;
  }
  if (image.length === 0 || image.length > MAX_IMAGE_BYTES) {
    res.status(413).json({ error: "Images must be 10 MB or smaller." });
    return;
  }

  if (!process.env["VITE_FIREBASE_API_KEY"]) {
    res.status(503).json({ error: "Firebase upload authorization is not configured on the server." });
    return;
  }
  if (!(await hasValidFirebaseSession(req.headers.authorization))) {
    res.status(401).json({ error: "Please sign in before uploading an image." });
    return;
  }

  const cloudName = process.env["CLOUDINARY_CLOUD_NAME"];
  const apiKey = process.env["CLOUDINARY_API_KEY"];
  const apiSecret = process.env["CLOUDINARY_API_SECRET"];
  if (!cloudName || !apiKey || !apiSecret) {
    res.status(503).json({ error: "Image uploads are not configured on the server." });
    return;
  }

  try {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
    const result = await cloudinary.uploader.upload(
      `data:${contentType};base64,${image.toString("base64")}`,
      { folder: "urbanwatch/complaints", resource_type: "image", unique_filename: true },
    );
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Cloudinary upload failed:", message);
    res.status(502).json({ error: `Cloudinary could not store this image: ${message}` });
  }
});

export default router;