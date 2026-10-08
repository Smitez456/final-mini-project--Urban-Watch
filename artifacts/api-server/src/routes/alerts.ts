// ─────────────────────────────────────────────────────────────────────────────
// ALERTS ROUTES — Server-side alert management, Haversine nearby filtering,
// and validation endpoints.
// ─────────────────────────────────────────────────────────────────────────────

import { Router, type IRouter } from "express";

const router: IRouter = Router();

export type ServerAlert = {
  alertId: string;
  userId?: string | null;
  type: "TRAFFIC" | "ROAD_HAZARD" | "FLOOD" | "HEAVY_RAIN" | "CIVIC" | "SYSTEM";
  title: string;
  message: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  complaintId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location?: string | null;
  radius?: number | null; // In meters
  createdAt: string;
  expiresAt?: string | null;
  isRead: boolean;
  isActive: boolean;
};

// In-memory alert store for backend-generated or demo alerts
const activeAlerts: Map<string, ServerAlert> = new Map();

function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/alerts - list alerts with optional filters
router.get("/alerts", (req, res) => {
  const { userId, type, isActive } = req.query;
  const alerts = Array.from(activeAlerts.values()).filter((alert) => {
    if (userId && alert.userId && alert.userId !== userId) return false;
    if (type && alert.type !== type) return false;
    if (isActive !== undefined && alert.isActive !== (isActive === "true")) return false;
    return true;
  });
  res.json({ alerts, count: alerts.length });
});

// GET /api/alerts/nearby?lat=...&lng=...&radius=...
router.get("/alerts/nearby", (req, res) => {
  const lat = parseFloat(String(req.query.lat ?? ""));
  const lng = parseFloat(String(req.query.lng ?? ""));
  const radius = parseFloat(String(req.query.radius ?? "1000")); // default 1km

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    res.status(400).json({ error: "lat and lng query parameters are required numbers." });
    return;
  }

  const nearby = Array.from(activeAlerts.values())
    .filter((alert) => {
      if (!alert.isActive) return false;
      if (typeof alert.latitude !== "number" || typeof alert.longitude !== "number") return false;
      const distance = haversineDistanceMeters(lat, lng, alert.latitude, alert.longitude);
      const effectiveRadius = alert.radius ?? radius;
      return distance <= effectiveRadius;
    })
    .map((alert) => {
      const distance = haversineDistanceMeters(lat, lng, alert.latitude!, alert.longitude!);
      return {
        ...alert,
        distanceMeters: Math.round(distance),
      };
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  res.json({ alerts: nearby, count: nearby.length });
});

// POST /api/alerts - create a new alert
router.post("/alerts", (req, res) => {
  const {
    type,
    title,
    message,
    severity,
    complaintId,
    latitude,
    longitude,
    location,
    radius,
    expiresAt,
    userId,
  } = req.body ?? {};

  const validTypes = new Set(["TRAFFIC", "ROAD_HAZARD", "FLOOD", "HEAVY_RAIN", "CIVIC", "SYSTEM"]);
  const validSeverities = new Set(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

  if (!type || !validTypes.has(type)) {
    res.status(400).json({ error: "Invalid alert type." });
    return;
  }

  if (!title || typeof title !== "string" || !message || typeof message !== "string") {
    res.status(400).json({ error: "Title and message are required strings." });
    return;
  }

  if (!severity || !validSeverities.has(severity)) {
    res.status(400).json({ error: "Invalid severity." });
    return;
  }

  const alertId = `alert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const newAlert: ServerAlert = {
    alertId,
    userId: typeof userId === "string" ? userId : null,
    type,
    title,
    message,
    severity,
    complaintId: typeof complaintId === "string" ? complaintId : null,
    latitude: typeof latitude === "number" ? latitude : null,
    longitude: typeof longitude === "number" ? longitude : null,
    location: typeof location === "string" ? location : null,
    radius: typeof radius === "number" ? radius : 1000,
    createdAt: new Date().toISOString(),
    expiresAt: typeof expiresAt === "string" ? expiresAt : null,
    isRead: false,
    isActive: true,
  };

  activeAlerts.set(alertId, newAlert);
  res.status(201).json({ alert: newAlert });
});

// PATCH /api/alerts/:id/read - mark alert as read
router.patch("/alerts/:id/read", (req, res) => {
  const { id } = req.params;
  const alert = activeAlerts.get(id);

  if (alert) {
    alert.isRead = true;
    res.json({ success: true, alert });
    return;
  }

  // Even if not in local memory, return ok for Firestore-backed client tracking
  res.json({ success: true, alertId: id, isRead: true });
});

export default router;
