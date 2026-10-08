// ─────────────────────────────────────────────────────────────────────────────
// WEATHER SERVICE — Frontend proxy calls to the backend weather endpoint.
// API key is NEVER exposed here. All weather data is fetched via our backend.
// ─────────────────────────────────────────────────────────────────────────────

export type WeatherCondition = {
  condition: string;         // e.g., "Heavy Rain", "Thunderstorm"
  conditionId: number;       // OpenWeatherMap condition code
  description: string;
  temperature: number;       // Celsius
  feelsLike: number;
  humidity: number;          // %
  rainfall1h: number;        // mm/hr
  rainfall3h: number;        // mm/3hr
  windSpeed: number;         // m/s
  cloudiness: number;        // %
  icon: string;
  timestamp: number;         // Unix ms
};

export type WeatherRiskAssessment = {
  weather: WeatherCondition;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  alerts: WeatherRiskAlert[];
};

export type WeatherRiskAlert = {
  type: 'HEAVY_RAIN' | 'FLOOD';
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
};

export async function fetchWeatherConditions(lat: number, lng: number): Promise<WeatherRiskAssessment> {
  const url = `/api/weather/current?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;
  const response = await fetch(url);
  if (!response.ok) {
    const data = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error ?? 'Weather service unavailable.');
  }
  return response.json() as Promise<WeatherRiskAssessment>;
}

export type WeatherResponse = WeatherRiskAssessment;
export const fetchCurrentWeather = fetchWeatherConditions;
