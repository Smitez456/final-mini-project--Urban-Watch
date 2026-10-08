// ─────────────────────────────────────────────────────────────────────────────
// WEATHER ROUTE — Backend proxy for OpenWeatherMap.
// The API key is stored in OPENWEATHER_API_KEY env var and NEVER sent to the frontend.
// ─────────────────────────────────────────────────────────────────────────────

import { Router, type IRouter } from "express";

const router: IRouter = Router();

// Weather risk thresholds (configurable here without touching other code)
const THRESHOLDS = {
  HEAVY_RAIN_MM_PER_HOUR: 7.6,        // mm/hr for heavy rain warning
  VERY_HEAVY_RAIN_MM_PER_HOUR: 15.6,  // mm/hr for very heavy rain
  FLOOD_RAIN_MM_PER_HOUR: 25,         // mm/hr for flood risk
  // OpenWeatherMap condition codes for rain/flood/thunderstorm
  RAIN_CODES: new Set([200, 201, 202, 210, 211, 212, 221, 230, 231, 232, 300, 301, 302, 310, 311, 312, 313, 314, 321, 500, 501, 502, 503, 504, 511, 520, 521, 522, 531]),
  STORM_CODES: new Set([200, 201, 202, 210, 211, 212, 221, 230, 231, 232]),
  DRIZZLE_CODES: new Set([300, 301, 302, 310, 311, 312, 313, 314, 321]),
  FLOOD_CODES: new Set([502, 503, 504, 511, 522, 531]),
};

type OWMResponse = {
  weather?: Array<{ id?: number; main?: string; description?: string; icon?: string }>;
  main?: { temp?: number; feels_like?: number; humidity?: number };
  wind?: { speed?: number };
  clouds?: { all?: number };
  rain?: { "1h"?: number; "3h"?: number };
  dt?: number;
  cod?: number | string;
  message?: string;
};

function assessRisk(rainfall1h: number, conditionId: number): {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  alerts: Array<{ type: "HEAVY_RAIN" | "FLOOD"; title: string; message: string; severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" }>;
} {
  const alerts: Array<{ type: "HEAVY_RAIN" | "FLOOD"; title: string; message: string; severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" }> = [];
  let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";

  const isFloodCode = THRESHOLDS.FLOOD_CODES.has(conditionId);
  const isStorm = THRESHOLDS.STORM_CODES.has(conditionId);

  if (rainfall1h >= THRESHOLDS.FLOOD_RAIN_MM_PER_HOUR || isFloodCode) {
    riskLevel = "CRITICAL";
    alerts.push({
      type: "FLOOD",
      title: "🌊 Flood / Waterlogging Alert",
      message: "Possible flooding reported near your location. Avoid affected roads and consider an alternate route.",
      severity: "CRITICAL",
    });
  } else if (rainfall1h >= THRESHOLDS.VERY_HEAVY_RAIN_MM_PER_HOUR || isStorm) {
    riskLevel = "HIGH";
    alerts.push({
      type: "HEAVY_RAIN",
      title: "🌧️ Heavy Rain Alert",
      message: "Very heavy rainfall detected near your location. Road flooding may occur. Please use caution while travelling.",
      severity: "HIGH",
    });
  } else if (rainfall1h >= THRESHOLDS.HEAVY_RAIN_MM_PER_HOUR) {
    riskLevel = "MEDIUM";
    alerts.push({
      type: "HEAVY_RAIN",
      title: "🌧️ Rain Alert",
      message: "Heavy rainfall detected near your location. Road conditions may be hazardous. Drive carefully.",
      severity: "MEDIUM",
    });
  } else if (THRESHOLDS.RAIN_CODES.has(conditionId)) {
    riskLevel = "LOW";
  }

  return { riskLevel, alerts };
}

router.get("/weather/current", async (req, res) => {
  const apiKey = process.env["OPENWEATHER_API_KEY"];
  const lat = parseFloat(String(req.query.lat ?? ""));
  const lng = parseFloat(String(req.query.lng ?? ""));

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    res.status(400).json({ error: "Provide valid latitude and longitude query parameters." });
    return;
  }

  if (!apiKey) {
    res.json({
      weather: {
        condition: "Partly Cloudy",
        conditionId: 802,
        description: "Scattered clouds (offline baseline)",
        temperature: 28,
        feelsLike: 30,
        humidity: 68,
        rainfall1h: 0,
        rainfall3h: 0,
        windSpeed: 4.2,
        cloudiness: 40,
        icon: "03d",
        timestamp: Date.now(),
      },
      riskLevel: "LOW",
      alerts: [],
      mode: "baseline_offline",
      notice: "Set OPENWEATHER_API_KEY in environment for live satellite weather feeds.",
    });
    return;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as OWMResponse;
      res.status(502).json({ error: errorData.message ?? "Weather API returned an error." });
      return;
    }

    const data = await response.json() as OWMResponse;
    const conditionId = data.weather?.[0]?.id ?? 800;
    const rainfall1h = data.rain?.["1h"] ?? 0;
    const rainfall3h = data.rain?.["3h"] ?? 0;
    const { riskLevel, alerts } = assessRisk(rainfall1h, conditionId);

    res.json({
      weather: {
        condition: data.weather?.[0]?.main ?? "Clear",
        conditionId,
        description: data.weather?.[0]?.description ?? "",
        temperature: data.main?.temp ?? 0,
        feelsLike: data.main?.feels_like ?? 0,
        humidity: data.main?.humidity ?? 0,
        rainfall1h,
        rainfall3h,
        windSpeed: data.wind?.speed ?? 0,
        cloudiness: data.clouds?.all ?? 0,
        icon: data.weather?.[0]?.icon ?? "01d",
        timestamp: (data.dt ?? 0) * 1000,
      },
      riskLevel,
      alerts,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Weather service error.";
    if (message.includes("TimeoutError") || message.includes("timeout")) {
      res.status(504).json({ error: "Weather service timed out. Please try again." });
      return;
    }
    res.status(502).json({ error: message });
  }
});

router.get("/weather/alerts", async (req, res) => {
  const apiKey = process.env["OPENWEATHER_API_KEY"];
  const lat = parseFloat(String(req.query.lat ?? ""));
  const lng = parseFloat(String(req.query.lng ?? ""));

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    res.status(400).json({ error: "Provide valid latitude and longitude query parameters." });
    return;
  }

  if (!apiKey) {
    res.json({
      alerts: [],
      riskLevel: "LOW",
      hasActiveAlerts: false,
      mode: "baseline_offline",
    });
    return;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as OWMResponse;
      res.status(502).json({ error: errorData.message ?? "Weather API returned an error." });
      return;
    }

    const data = await response.json() as OWMResponse;
    const conditionId = data.weather?.[0]?.id ?? 800;
    const rainfall1h = data.rain?.["1h"] ?? 0;
    const { riskLevel, alerts } = assessRisk(rainfall1h, conditionId);

    res.json({
      alerts,
      riskLevel,
      hasActiveAlerts: alerts.length > 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Weather service error.";
    res.status(502).json({ error: message });
  }
});

export default router;
