// ─────────────────────────────────────────────────────────────────────────────
// ALERT TYPES — Unified alert model for all alert types.
// ─────────────────────────────────────────────────────────────────────────────

export const ALERT_TYPES = ['TRAFFIC', 'ROAD_HAZARD', 'FLOOD', 'HEAVY_RAIN', 'CIVIC', 'SYSTEM'] as const;
export type AlertType = (typeof ALERT_TYPES)[number];

export const ALERT_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export type StoredAlert = {
  alertId: string;
  userId: string | null;       // null = broadcast to all
  type: AlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  complaintId: string | null;
  latitude: number | null;
  longitude: number | null;
  location: string | null;
  radius: number | null;       // meters, null = global
  createdAt: number;           // Unix ms
  expiresAt: number | null;    // Unix ms, null = no expiry
  isRead: boolean;
  isActive: boolean;
  trafficRisk: string | null;
  issueType: string | null;
};

export type UserPreferences = {
  userId: string;
  civicAlerts: boolean;
  trafficAlerts: boolean;
  floodAlerts: boolean;
  rainAlerts: boolean;
  nearbyRadius: number; // meters: 250, 500, 1000, 2000
  locationGranted: boolean;
};

export type WeatherAlert = {
  alertId: string;
  latitude: number;
  longitude: number;
  type: 'HEAVY_RAIN' | 'FLOOD';
  title: string;
  message: string;
  severity: AlertSeverity;
  createdAt: number;
  expiresAt: number;
  isActive: boolean;
  locationKey: string; // e.g., "lat_lng" rounded to 2 decimal places for dedup
};

export function alertSeverityToTrafficRisk(severity: AlertSeverity): string {
  const map: Record<AlertSeverity, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical',
  };
  return map[severity];
}

export function alertSeverityBadgeClass(severity: AlertSeverity): string {
  switch (severity) {
    case 'CRITICAL': return 'bg-[#fff1ed] text-[#b54c3c] border-[#b54c3c]';
    case 'HIGH': return 'bg-[#fbe1d9] text-[#ed735e] border-[#ed735e]';
    case 'MEDIUM': return 'bg-[#faedcf] text-[#99621b] border-[#99621b]';
    case 'LOW': return 'bg-[#d9eeea] text-[#17675e] border-[#17675e]';
  }
}

export function alertTypeEmoji(type: AlertType): string {
  switch (type) {
    case 'TRAFFIC': return '🚨';
    case 'ROAD_HAZARD': return '⚠️';
    case 'FLOOD': return '🌊';
    case 'HEAVY_RAIN': return '🌧️';
    case 'CIVIC': return '🏙️';
    case 'SYSTEM': return 'ℹ️';
  }
}

export const DEFAULT_USER_PREFERENCES: Omit<UserPreferences, 'userId'> = {
  civicAlerts: true,
  trafficAlerts: true,
  floodAlerts: true,
  rainAlerts: true,
  nearbyRadius: 1000,
  locationGranted: false,
};
