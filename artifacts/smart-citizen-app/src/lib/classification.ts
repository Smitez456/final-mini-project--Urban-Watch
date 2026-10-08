export const AI_ISSUE_CATEGORIES = [
  "Pothole",
  "Garbage/Waste",
  "Damaged Streetlight",
  "Water Leakage",
  "Other/Unknown",
] as const;

export type AiClassification = {
  category: (typeof AI_ISSUE_CATEGORIES)[number];
  confidence: number;
  reason: string;
};

export async function classifyImage(imageUrl: string, firebaseIdToken: string): Promise<AiClassification> {
  const response = await fetch("/api/classify/image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${firebaseIdToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl }),
  });
  const data = await response.json().catch(() => ({})) as Partial<AiClassification> & { error?: string };
  if (!response.ok || typeof data.category !== "string" || typeof data.confidence !== "number" || typeof data.reason !== "string") {
    throw new Error(data.error || "AI image analysis failed. You can still choose the issue category manually.");
  }
  if (!AI_ISSUE_CATEGORIES.includes(data.category as AiClassification["category"]) || data.confidence < 0 || data.confidence > 1) {
    throw new Error("AI returned an invalid classification. You can still choose the issue category manually.");
  }
  return {
    category: data.category as AiClassification["category"],
    confidence: data.confidence,
    reason: data.reason,
  };
}