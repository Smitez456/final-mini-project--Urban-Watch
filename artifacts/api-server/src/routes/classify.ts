import { Router, type IRouter } from "express";

const router: IRouter = Router();
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const CLOUDINARY_TIMEOUT_MS = 10_000;
const OPENAI_TIMEOUT_MS = 30_000;
const FIREBASE_TIMEOUT_MS = 10_000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_USER = 5;
const MAX_REQUESTS_PER_IP = 20;
const MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const CATEGORIES = new Set([
  "Pothole",
  "Garbage/Waste",
  "Damaged Streetlight",
  "Water Leakage",
  "Other/Unknown",
]);

type ClassificationResult = {
  category: string;
  confidence: number;
  reason: string;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

class UpstreamTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UpstreamTimeoutError";
  }
}

const userRateLimits = new Map<string, RateLimitBucket>();
const ipRateLimits = new Map<string, RateLimitBucket>();

const rateLimitCleanup = setInterval(() => {
  const now = Date.now();
  for (const limits of [userRateLimits, ipRateLimits]) {
    for (const [key, bucket] of limits) {
      if (bucket.resetAt <= now) limits.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW_MS);
rateLimitCleanup.unref();

async function withAbortTimeout<T>(
  timeoutMs: number,
  timeoutMessage: string,
  operation: (signal: AbortSignal) => Promise<T>,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await operation(controller.signal);
  } catch (error) {
    if (controller.signal.aborted) {
      throw new UpstreamTimeoutError(timeoutMessage);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function getFirebaseUserId(authorization: string | undefined) {
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  const firebaseApiKey = process.env["VITE_FIREBASE_API_KEY"];
  if (!token || !firebaseApiKey) return null;

  try {
    return await withAbortTimeout(FIREBASE_TIMEOUT_MS, "Firebase session validation timed out.", async (signal) => {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
        signal,
      });
      if (!response.ok) return null;
      const data = await response.json() as { users?: Array<{ localId?: string }> };
      return data.users?.[0]?.localId ?? null;
    });
  } catch {
    return null;
  }
}

function getValidatedCloudinaryUrl(value: unknown) {
  const cloudName = process.env["CLOUDINARY_CLOUD_NAME"];
  if (!cloudName || typeof value !== "string" || value.length > 2048) return null;
  try {
    const parsed = new URL(value);
    const expectedPath = `/${cloudName}/image/upload/`;
    if (
      parsed.protocol !== "https:"
      || parsed.hostname !== "res.cloudinary.com"
      || parsed.port
      || parsed.username
      || parsed.password
      || !parsed.pathname.startsWith(expectedPath)
    ) {
      return null;
    }
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return null;
  }
}

async function imageUrlToDataUrl(imageUrl: string) {
  return withAbortTimeout(CLOUDINARY_TIMEOUT_MS, "Cloudinary took too long to return the image.", async (signal) => {
    const response = await fetch(imageUrl, { signal });
    if (!response.ok) throw new Error("The uploaded image could not be retrieved from Cloudinary.");

    const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (!MIME_TYPES.has(contentType) || (declaredLength > 0 && declaredLength > MAX_IMAGE_BYTES)) {
      throw new Error("The uploaded Cloudinary asset is not a supported image.");
    }

    const image = Buffer.from(await response.arrayBuffer());
    if (image.length === 0 || image.length > MAX_IMAGE_BYTES) {
      throw new Error("The uploaded image is too large to classify.");
    }
    return `data:${contentType};base64,${image.toString("base64")}`;
  });
}

function parseClassification(value: unknown): ClassificationResult | null {
  if (!value || typeof value !== "object") return null;
  const result = value as Record<string, unknown>;
  if (
    typeof result.category !== "string"
    || !CATEGORIES.has(result.category)
    || typeof result.confidence !== "number"
    || !Number.isFinite(result.confidence)
    || result.confidence < 0
    || result.confidence > 1
    || typeof result.reason !== "string"
    || result.reason.trim().length === 0
    || result.reason.length > 500
  ) {
    return null;
  }
  return {
    category: result.category,
    confidence: result.confidence,
    reason: result.reason.trim(),
  };
}

function parseModelJson(content: unknown) {
  if (typeof content !== "string") return null;
  const normalized = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return parseClassification(JSON.parse(normalized));
  } catch {
    return null;
  }
}

async function classifyWithOpenAI(imageDataUrl: string) {
  const baseUrl = process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"];
  const apiKey = process.env["AI_INTEGRATIONS_OPENAI_API_KEY"];
  if (!baseUrl || !apiKey) throw new Error("The managed OpenAI integration is not configured on the server.");

  return withAbortTimeout(OPENAI_TIMEOUT_MS, "The vision model took too long to respond.", async (signal) => {
    const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are an AI assistant for a civic issue reporting application. Analyze the provided image and classify the visible civic issue into exactly one of: Pothole, Garbage/Waste, Damaged Streetlight, Water Leakage, Other/Unknown. Only select a category when there is reasonable visual evidence. If the image does not clearly match one of the first four categories, select Other/Unknown. Return only JSON with category, confidence, and reason. The confidence must be a number from 0 to 1 and is a model estimate, not a calibrated probability. Do not return any other category.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Classify this civic issue image." },
              { type: "image_url", image_url: { url: imageDataUrl } },
            ],
          },
        ],
      }),
      signal,
    });

    if (!response.ok) throw new Error("The vision model could not analyze this image.");
    const payload = await response.json() as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    return parseModelJson(payload.choices?.[0]?.message?.content);
  });
}

function consumeRateLimit(
  limits: Map<string, RateLimitBucket>,
  key: string,
  maxRequests: number,
) {
  const now = Date.now();
  const existing = limits.get(key);
  if (!existing || existing.resetAt <= now) {
    const bucket = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    limits.set(key, bucket);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function getClientIp(req: { ip?: string; socket: { remoteAddress?: string } }) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function sendRateLimitResponse(
  res: { setHeader(name: string, value: string | number): void; status(code: number): { json(body: unknown): void } },
  scope: "account" | "network",
  retryAfterSeconds: number,
) {
  res.setHeader("Retry-After", retryAfterSeconds);
  res.status(429).json({
    error: scope === "account"
      ? `You've reached the image classification limit for your account. Please try again in ${retryAfterSeconds} seconds.`
      : `Too many image classification requests from this network. Please try again in ${retryAfterSeconds} seconds.`,
  });
}

router.post("/classify/image", async (req, res) => {
  const userId = await getFirebaseUserId(req.headers.authorization);
  if (!userId) {
    res.status(401).json({ error: "Please sign in before classifying an image." });
    return;
  }

  const accountLimit = consumeRateLimit(userRateLimits, userId, MAX_REQUESTS_PER_USER);
  if (!accountLimit.allowed) {
    sendRateLimitResponse(res, "account", accountLimit.retryAfterSeconds);
    return;
  }

  const networkLimit = consumeRateLimit(ipRateLimits, getClientIp(req), MAX_REQUESTS_PER_IP);
  if (!networkLimit.allowed) {
    sendRateLimitResponse(res, "network", networkLimit.retryAfterSeconds);
    return;
  }

  const imageUrl = getValidatedCloudinaryUrl(req.body?.imageUrl);
  if (!imageUrl) {
    res.status(400).json({ error: "Provide a valid HTTPS Cloudinary image URL." });
    return;
  }

  try {
    const imageDataUrl = await imageUrlToDataUrl(imageUrl);
    const result = await classifyWithOpenAI(imageDataUrl);
    if (!result) {
      res.status(502).json({ error: "The vision model returned an invalid classification. Please try again or choose a category manually." });
      return;
    }
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image classification failed.";
    if (error instanceof UpstreamTimeoutError) {
      res.status(504).json({ error: `${message} Please try again.` });
      return;
    }
    if (message.includes("managed OpenAI integration is not configured")) {
      res.status(503).json({ error: message });
      return;
    }
    res.status(502).json({ error: message });
  }
});

export default router;