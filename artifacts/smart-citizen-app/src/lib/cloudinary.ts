const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function uploadImageToCloudinary(file: File, firebaseIdToken: string) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, and WEBP images are supported.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Images must be 10 MB or smaller.");
  }

  const formData = new FormData();
  formData.append("image", file, file.name);

  const response = await fetch("/api/upload/image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${firebaseIdToken}`,
    },
    body: formData,
  });
  const data = await response.json().catch(() => ({})) as { url?: string; error?: string };
  if (!response.ok || !data.url || !data.url.startsWith("https://")) {
    throw new Error(data.error || "The image upload failed. Please try again.");
  }
  return data.url;
}