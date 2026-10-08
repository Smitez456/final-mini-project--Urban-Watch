// ─────────────────────────────────────────────────────────────────────────────
// TRAFFIC RISK CONFIG — Central configuration for traffic risk calculation.
// Modify thresholds here without changing application logic elsewhere.
// ─────────────────────────────────────────────────────────────────────────────

export const TRAFFIC_RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'] as const;
export type TrafficRiskLevel = (typeof TRAFFIC_RISK_LEVELS)[number];

export function isTrafficRiskLevel(value: string): value is TrafficRiskLevel {
  return TRAFFIC_RISK_LEVELS.includes(value as TrafficRiskLevel);
}

// Issue types that qualify as road-related (could cause traffic risk)
const ROAD_RELATED_KEYWORDS = [
  'pothole',
  'road damage',
  'road block',
  'road hazard',
  'collapsed road',
  'debris on road',
  'flooded road',
  'flooding',
  'waterlogging',
  'road crack',
  'sidewalk',
  'pavement',
  'accident',
  'landslide',
  'fallen tree',
];

// Alert radius config by risk level (meters)
export const ALERT_RADIUS_BY_RISK: Record<TrafficRiskLevel, number> = {
  Low: 250,
  Medium: 500,
  High: 1000,
  Critical: 2000,
};

// Minimum risk level that creates a traffic alert
export const TRAFFIC_ALERT_THRESHOLD: TrafficRiskLevel = 'High';

// Priority → numeric score
const PRIORITY_SCORE: Record<string, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
  'Pending assignment': 1,
};

// Issue type → base risk score (0–4)
function issueBaseScore(issueType: string, aiCategory?: string | null): number {
  const text = `${aiCategory ?? ''} ${issueType}`.toLowerCase();
  if (text.includes('collapsed road') || text.includes('flooded road') || text.includes('road block')) return 4;
  if (text.includes('flood') || text.includes('waterlogging')) return 3;
  if (text.includes('pothole') || text.includes('road damage')) return 2;
  if (text.includes('road') || text.includes('sidewalk') || text.includes('pavement')) return 2;
  if (text.includes('debris') || text.includes('fallen tree') || text.includes('landslide')) return 3;
  return 0; // Not road-related
}

export function isRoadRelated(issueType: string, aiCategory?: string | null): boolean {
  const text = `${aiCategory ?? ''} ${issueType}`.toLowerCase();
  return ROAD_RELATED_KEYWORDS.some((kw) => text.includes(kw));
}

/**
 * Calculates the traffic risk level for a given complaint.
 * Returns null if the issue is not road-related.
 */
export function calculateTrafficRisk(params: {
  issueType: string;
  priority: string;
  aiCategory?: string | null;
  description?: string;
}): TrafficRiskLevel | null {
  const { issueType, priority, aiCategory, description } = params;

  if (!isRoadRelated(issueType, aiCategory)) return null;

  const baseScore = issueBaseScore(issueType, aiCategory);
  const priorityScore = PRIORITY_SCORE[priority] ?? 1;

  // Check description for severity amplifiers
  const desc = (description ?? '').toLowerCase();
  const severityBoost =
    desc.includes('major') || desc.includes('large') || desc.includes('critical') || desc.includes('dangerous') ? 1 : 0;

  const totalScore = baseScore + priorityScore + severityBoost;

  // Map score to risk level
  if (totalScore >= 7) return 'Critical';
  if (totalScore >= 5) return 'High';
  if (totalScore >= 3) return 'Medium';
  return 'Low';
}

export function trafficRiskColor(risk: TrafficRiskLevel): string {
  switch (risk) {
    case 'Critical': return '#b54c3c';
    case 'High': return '#ed735e';
    case 'Medium': return '#99621b';
    case 'Low': return '#17675e';
  }
}

export function trafficRiskBadgeClass(risk: TrafficRiskLevel): string {
  switch (risk) {
    case 'Critical': return 'bg-[#fff1ed] text-[#b54c3c] border-[#b54c3c]';
    case 'High': return 'bg-[#fbe1d9] text-[#ed735e] border-[#ed735e]';
    case 'Medium': return 'bg-[#faedcf] text-[#99621b] border-[#99621b]';
    case 'Low': return 'bg-[#d9eeea] text-[#17675e] border-[#17675e]';
  }
}

// ─── Haversine distance (returns meters) ──────────────────────────────────────
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export const haversineDistanceMeters = haversineDistance;
