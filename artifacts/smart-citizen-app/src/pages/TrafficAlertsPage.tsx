import { useEffect, useState } from 'react';
import { Car, AlertTriangle, MapPin, Navigation, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { Link } from 'wouter';
import { getActiveTrafficAlerts } from '@/lib/firestore';
import { haversineDistanceMeters } from '@/lib/trafficRisk';
import { CivicUnifiedMap, type MapMarkerItem } from '@/components/CivicUnifiedMap';
import type { StoredAlert } from '@/lib/alertTypes';

export type TrafficAlertsPageProps = {
  Shell: React.ComponentType<{ children: React.ReactNode }>;
};

export function TrafficAlertsPage({ Shell }: TrafficAlertsPageProps) {
  const [alerts, setAlerts] = useState<StoredAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  useEffect(() => {
    let active = true;
    loadTrafficAlerts(active);
    return () => {
      active = false;
    };
  }, []);

  async function loadTrafficAlerts(active = true) {
    setLoading(true);
    try {
      const data = await getActiveTrafficAlerts();
      if (active) setAlerts(data);
    } catch {
      if (active) setAlerts([]);
    } finally {
      if (active) setLoading(false);
    }
  }

  function handleLocate() {
    if (!('geolocation' in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  const mapItems: MapMarkerItem[] = alerts
    .filter((a) => a.latitude != null && a.longitude != null)
    .map((a) => ({
      id: a.alertId,
      type: (a.type as MapMarkerItem['type']) || 'TRAFFIC',
      title: a.title,
      issue: a.issueType || 'Road Hazard',
      severity: a.severity,
      location: a.location || 'Unknown Roadway',
      department: 'Public Works Department',
      status: a.isActive ? 'Active Hazard' : 'Resolved',
      reportedTime: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latitude: a.latitude!,
      longitude: a.longitude!,
      complaintId: a.complaintId,
    }));

  const filteredAlerts = alerts.filter((item) => {
    if (severityFilter === 'ALL') return true;
    return item.severity === severityFilter;
  });

  return (
    <Shell>
      <div className="civic-dot-grid min-h-[calc(100dvh-80px)] px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-[1100px] space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-[#15353c] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded bg-[#15353c] text-white">
                  <Car size={16} strokeWidth={2.5} />
                </span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">
                  Transit Safety
                </p>
              </div>
              <h1 className="mt-2 font-mono text-3xl font-bold uppercase tracking-tight text-[#15353c] sm:text-4xl">
                Active Traffic Alerts
              </h1>
              <p className="mt-1 text-xs text-[#52706d]">
                Live road hazards, potholes, cave-ins, and flood obstructions impacting city transit.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLocate}
              disabled={locating}
              className="inline-flex items-center gap-2 rounded border-2 border-[#15353c] bg-[#fffdf8] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[#15353c] shadow-[2px_2px_0_#15353c] hover:bg-[#d9eeea] transition-all disabled:opacity-50"
            >
              <Navigation size={15} />
              {locating ? 'Locating...' : userLocation ? 'GPS Calibrated' : 'Check My Route'}
            </button>
          </div>

          {/* Unified Civic Map showing all hazards */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-lg font-bold uppercase text-[#15353c]">
                City Road Hazard Map
              </h2>
              <span className="text-[11px] font-bold uppercase text-[#52706d]">
                {mapItems.length} active geolocated pin{mapItems.length !== 1 ? 's' : ''}
              </span>
            </div>
            <CivicUnifiedMap items={mapItems} userLocation={userLocation} />
          </section>

          {/* Hazard Feed */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#15353c]/15 pb-3">
              <h2 className="font-mono text-lg font-bold uppercase text-[#15353c]">
                Hazard Feed & Impact Radar
              </h2>
              <div className="flex gap-1.5">
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverityFilter(sev)}
                    className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      severityFilter === sev
                        ? 'bg-[#15353c] text-white'
                        : 'bg-white border border-[#15353c]/30 text-[#15353c] hover:bg-[#eee9de]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="rounded-xl border-2 border-dashed border-[#15353c]/30 p-10 text-center text-xs font-bold uppercase tracking-widest text-[#52706d]">
                Loading active road safety advisories...
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-10 text-center shadow-[4px_4px_0_#15353c]">
                <ShieldCheck size={36} className="mx-auto text-[#17675e]" />
                <h3 className="mt-2 font-mono text-base font-bold uppercase text-[#15353c]">
                  No High-Risk Traffic Hazards
                </h3>
                <p className="text-xs text-[#52706d]">All monitored routes are operating under normal conditions.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredAlerts.map((item) => {
                  const dist =
                    userLocation && item.latitude != null && item.longitude != null
                      ? Math.round(
                          haversineDistanceMeters(
                            userLocation.latitude,
                            userLocation.longitude,
                            item.latitude,
                            item.longitude,
                          ),
                        )
                      : null;

                  return (
                    <article
                      key={item.alertId}
                      className="rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-5 shadow-[4px_4px_0_#15353c] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 border-b border-[#15353c]/15 pb-3">
                          <span
                            className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                              item.severity === 'CRITICAL'
                                ? 'bg-red-600 text-white'
                                : item.severity === 'HIGH'
                                ? 'bg-orange-500 text-white'
                                : 'bg-amber-400 text-black'
                            }`}
                          >
                            {item.severity} Risk
                          </span>
                          {dist != null && (
                            <span className="font-mono text-xs font-bold text-[#17675e]">
                              {dist < 1000 ? `${dist} m away` : `${(dist / 1000).toFixed(1)} km away`}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-[#52706d]">
                            {new Date(item.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </span>
                        </div>

                        <h3 className="mt-3 font-mono text-base font-bold uppercase text-[#15353c]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#52706d] leading-relaxed">{item.message}</p>

                        {item.location && (
                          <p className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#15353c]">
                            <MapPin size={13} className="text-[#ed735e] shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </p>
                        )}
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-[#15353c]/15 pt-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#17675e]">
                          ● Active Advisory
                        </span>
                        {item.complaintId && (
                          <Link
                            href={`/complaints/${item.complaintId}`}
                            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#ed735e] hover:underline"
                          >
                            View Case <ArrowRight size={13} />
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </Shell>
  );
}
