import { useEffect, useState } from 'react';
import { AlertTriangle, Navigation, MapPin, ChevronRight, ShieldAlert } from 'lucide-react';
import { Link } from 'wouter';
import { haversineDistanceMeters } from '@/lib/trafficRisk';
import type { StoredAlert } from '@/lib/alertTypes';

export type NearbyCivicAlertsProps = {
  userLocation: { latitude: number; longitude: number } | null;
  locationPermissionDenied: boolean;
  onRequestLocation: () => void;
  radiusMeters?: number;
  alerts: StoredAlert[];
};

export function NearbyCivicAlerts({
  userLocation,
  locationPermissionDenied,
  onRequestLocation,
  radiusMeters = 1000,
  alerts,
}: NearbyCivicAlertsProps) {
  const [nearbyAlerts, setNearbyAlerts] = useState<Array<StoredAlert & { distanceMeters: number }>>([]);

  useEffect(() => {
    if (!userLocation) {
      setNearbyAlerts([]);
      return;
    }

    const filtered = alerts
      .filter((alert) => {
        if (!alert.isActive) return false;
        if (alert.latitude == null || alert.longitude == null) return false;
        const dist = haversineDistanceMeters(
          userLocation.latitude,
          userLocation.longitude,
          alert.latitude,
          alert.longitude,
        );
        const maxDist = alert.radius ?? radiusMeters;
        return dist <= maxDist;
      })
      .map((alert) => {
        const distanceMeters = Math.round(
          haversineDistanceMeters(
            userLocation.latitude,
            userLocation.longitude,
            alert.latitude!,
            alert.longitude!,
          ),
        );
        return { ...alert, distanceMeters };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    setNearbyAlerts(filtered);
  }, [userLocation, alerts, radiusMeters]);

  if (locationPermissionDenied) {
    return (
      <div className="rounded-xl border-2 border-dashed border-[#15353c]/40 bg-[#f8f5ed] p-5 text-center">
        <ShieldAlert size={28} className="mx-auto text-[#52706d]" />
        <h4 className="mt-2 font-mono text-sm font-bold uppercase tracking-wide text-[#15353c]">
          Location Access Restricted
        </h4>
        <p className="mt-1 text-xs text-[#52706d] max-w-md mx-auto">
          Location permission is disabled in your browser. Nearby hazard proximity alerts are unavailable,
          but city-wide alerts remain accessible.
        </p>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-5 shadow-[4px_4px_0_#15353c]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded border-2 border-[#15353c] bg-[#d9eeea] text-[#17675e]">
              <Navigation size={20} strokeWidth={2.5} />
            </span>
            <div>
              <h4 className="font-mono text-sm font-bold uppercase text-[#15353c]">
                Enable Proximity Alerts
              </h4>
              <p className="text-xs text-[#52706d]">
                Scan for active road hazards, potholes, and waterlogging within {radiusMeters}m of your commute.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRequestLocation}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded border-2 border-[#15353c] bg-[#15353c] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[#fffdf8] hover:bg-[#ed735e] transition-colors"
          >
            <Navigation size={14} /> Scan Nearby
          </button>
        </div>
      </div>
    );
  }

  if (nearbyAlerts.length === 0) {
    return (
      <div className="rounded-xl border-2 border-[#15353c]/20 bg-[#fffdf8] p-5 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#17675e]">
          ✓ Clear Route • No Hazards Detected within {radiusMeters}m
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">
          ⚠️ Proximity Radar: {nearbyAlerts.length} Hazard{nearbyAlerts.length > 1 ? 's' : ''} Detected
        </p>
        <span className="text-[10px] font-mono text-[#52706d]">Radius: {radiusMeters}m</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {nearbyAlerts.map((hazard) => {
          const isCritical = hazard.severity === 'CRITICAL';
          const isHigh = hazard.severity === 'HIGH';

          return (
            <div
              key={hazard.alertId}
              className={`rounded-xl border-[2.5px] p-4 shadow-[4px_4px_0_#15353c] transition-all hover:-translate-y-0.5 ${
                isCritical
                  ? 'border-[#15353c] bg-[#fff1ed]'
                  : isHigh
                  ? 'border-[#15353c] bg-[#fffaf0]'
                  : 'border-[#15353c] bg-[#fffdf8]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`grid h-7 w-7 place-items-center rounded border text-xs font-bold ${
                      isCritical
                        ? 'border-[#b54c3c] bg-[#fbe1d9] text-[#b54c3c]'
                        : 'border-[#99621b] bg-[#faedcf] text-[#99621b]'
                    }`}
                  >
                    <AlertTriangle size={15} strokeWidth={2.5} />
                  </span>
                  <div>
                    <span className="rounded bg-[#15353c] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-[#fffdf8]">
                      {hazard.severity} Risk
                    </span>
                    <span className="ml-2 font-mono text-xs font-bold text-[#17675e]">
                      {hazard.distanceMeters < 1000
                        ? `${hazard.distanceMeters} m away`
                        : `${(hazard.distanceMeters / 1000).toFixed(1)} km away`}
                    </span>
                  </div>
                </div>

                {hazard.complaintId && (
                  <Link
                    href={`/complaints/${hazard.complaintId}`}
                    className="text-[#15353c] hover:text-[#ed735e]"
                    title="View details"
                  >
                    <ChevronRight size={18} />
                  </Link>
                )}
              </div>

              <h5 className="mt-2.5 font-mono text-sm font-bold uppercase tracking-tight text-[#15353c]">
                {hazard.title}
              </h5>
              <p className="mt-1 text-xs text-[#52706d] line-clamp-2">{hazard.message}</p>

              {hazard.location && (
                <p className="mt-2 flex items-center gap-1 text-[10px] font-bold uppercase text-[#71807d]">
                  <MapPin size={12} className="text-[#ed735e]" /> {hazard.location}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
