// ─────────────────────────────────────────────────────────────────────────────
// TRAFFIC RISK EVALUATION ROUTE
// POST /api/traffic/evaluate
// Evaluates traffic risk for a complaint and returns the risk level.
// Mirrors the frontend trafficRisk.ts logic on the server side.
// ─────────────────────────────────────────────────────────────────────────────

import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ROAD_RELATED_KEYWORDS = [
  "pothole", "road damage", "road block", "road hazard", "collapsed road",
  "debris on road", "flooded road", "flooding", "waterlogging", "road crack",
  "sidewalk", "pavement", "accident", "landslide", "fallen tree",
];

const PRIORITY_SCORE: Record<string, number> = {
  Critical: 4, High: 3, Medium: 2, Low: 1, "Pending assignment": 1,
};

const ALERT_RADIUS_BY_RISK: Record<string, number> = {
  Low: 250, Medium: 500, High: 1000, Critical: 2000,
};

function isRoadRelated(issueType: string, aiCategory?: string | null): boolean {
  const text = `${aiCategory ?? ""} ${issueType}`.toLowerCase();
  return ROAD_RELATED_KEYWORDS.some((kw) => text.includes(kw));
}

function issueBaseScore(issueType: string, aiCategory?: string | null): number {
  const text = `${aiCategory ?? ""} ${issueType}`.toLowerCase();
  if (text.includes("collapsed road") || text.includes("flooded road") || text.includes("road block")) return 4;
  if (text.includes("flood") || text.includes("waterlogging")) return 3;
  if (text.includes("pothole") || text.includes("road damage")) return 2;
  if (text.includes("road") || text.includes("sidewalk") || text.includes("pavement")) return 2;
  if (text.includes("debris") || text.includes("fallen tree") || text.includes("landslide")) return 3;
  return 0;
}

function calculateRisk(params: {
  issueType: string;
  priority: string;
  aiCategory?: string | null;
  description?: string;
}): string | null {
  if (!isRoadRelated(params.issueType, params.aiCategory)) return null;
  const base = issueBaseScore(params.issueType, params.aiCategory);
  const prio = PRIORITY_SCORE[params.priority] ?? 1;
  const desc = (params.description ?? "").toLowerCase();
  const boost = desc.includes("major") || desc.includes("large") || desc.includes("critical") || desc.includes("dangerous") ? 1 : 0;
  const total = base + prio + boost;
  if (total >= 7) return "Critical";
  if (total >= 5) return "High";
  if (total >= 3) return "Medium";
  return "Low";
}

router.post("/traffic/evaluate", (req, res) => {
  const { issueType, priority, aiCategory, description } = req.body ?? {};

  if (typeof issueType !== "string" || typeof priority !== "string") {
    res.status(400).json({ error: "issueType and priority are required." });
    return;
  }

  const risk = calculateRisk({ issueType, priority, aiCategory, description });

  res.json({
    trafficRisk: risk,
    isRoadRelated: risk !== null,
    alertRadius: risk ? ALERT_RADIUS_BY_RISK[risk] ?? 1000 : null,
    shouldCreateAlert: risk === "High" || risk === "Critical",
  });
});

export default router;
