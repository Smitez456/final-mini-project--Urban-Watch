import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Filter } from 'lucide-react';
import { Link } from 'wouter';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type MapMarkerItem = {
  id: string;
  type: 'POTHOLE' | 'ROAD_HAZARD' | 'TRAFFIC' | 'FLOOD' | 'HEAVY_RAIN' | 'CIVIC' | 'USER_LOCATION' | string;
  title: string;
  issue: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  department?: string | null;
  status?: string | null;
  reportedTime: string;
  latitude: number;
  longitude: number;
  complaintId?: string | null;
};

export type CivicUnifiedMapProps = {
  items: MapMarkerItem[];
  userLocation?: { latitude: number; longitude: number } | null;
  className?: string;
};

type HazardCategory = 'TRAFFIC' | 'ROADS' | 'FLOOD';

// ─── KOCHI, KERALA DEMO DATA ───────────────────────────────────────────────────

const DEMO_TRAFFIC_ITEMS: MapMarkerItem[] = [
  {
    id: 'demo-traffic-1',
    type: 'TRAFFIC',
    title: '🚨 High Congestion — Vytila Junction',
    issue: 'Heavy Traffic Gridlock',
    severity: 'CRITICAL',
    location: 'Vytila Mobility Hub Junction, Kochi',
    department: 'Kochi Traffic Police',
    status: 'Active Congestion',
    reportedTime: '08:45 AM',
    latitude: 9.9664,
    longitude: 76.3188,
  },
  {
    id: 'demo-traffic-2',
    type: 'TRAFFIC',
    title: '🚨 Signal Malfunction — Kaloor Junction',
    issue: 'Signal Failure',
    severity: 'HIGH',
    location: 'Kaloor Junction, MG Road, Kochi',
    department: 'Kochi Traffic Police',
    status: 'Active Advisory',
    reportedTime: '09:12 AM',
    latitude: 9.9983,
    longitude: 76.2929,
  },
  {
    id: 'demo-traffic-3',
    type: 'TRAFFIC',
    title: '🚨 Slow Movement — Edappally Toll Bypass',
    issue: 'Bypass Bottleneck',
    severity: 'MEDIUM',
    location: 'NH 66 Bypass, Edappally, Kochi',
    department: 'Kochi Traffic Police',
    status: 'Active Slowdown',
    reportedTime: '10:30 AM',
    latitude: 10.0261,
    longitude: 76.3082,
  },
];

const DEMO_ROAD_ITEMS: MapMarkerItem[] = [
  {
    id: 'demo-road-1',
    type: 'ROAD_HAZARD',
    title: '⚠️ Deep Pothole — MG Road, Ernakulam',
    issue: 'Pothole',
    severity: 'HIGH',
    location: 'MG Road near Padma Junction, Kochi',
    department: 'Kochi Municipal Corp PWD',
    status: 'Active Hazard',
    reportedTime: '07:20 AM',
    latitude: 9.9723,
    longitude: 76.2801,
  },
  {
    id: 'demo-road-2',
    type: 'POTHOLE',
    title: '⚠️ Road Cave-in — Kakkanad InfoPark Road',
    issue: 'Asphalt Damage',
    severity: 'CRITICAL',
    location: 'InfoPark Expressway, Kakkanad, Kochi',
    department: 'Kochi Municipal Corp PWD',
    status: 'Active Hazard',
    reportedTime: '06:45 AM',
    latitude: 10.0090,
    longitude: 76.3620,
  },
  {
    id: 'demo-road-3',
    type: 'ROAD_HAZARD',
    title: '⚠️ Debris on Road — Marine Drive',
    issue: 'Road Obstruction',
    severity: 'MEDIUM',
    location: 'Shanmugham Road, Marine Drive, Kochi',
    department: 'Kochi Municipal Corp PWD',
    status: 'Active Hazard',
    reportedTime: '11:05 AM',
    latitude: 9.9784,
    longitude: 76.2760,
  },
];

const DEMO_FLOOD_ITEMS: MapMarkerItem[] = [
  {
    id: 'demo-flood-1',
    type: 'FLOOD',
    title: '🌊 Waterlogging — Ernakulam South Station',
    issue: 'Severe Flood Zone',
    severity: 'CRITICAL',
    location: 'Ernakulam South Station Road, Kochi',
    department: 'Drainage & Disaster Mgt',
    status: 'Active Flood Zone',
    reportedTime: '06:00 AM',
    latitude: 9.9678,
    longitude: 76.2889,
  },
  {
    id: 'demo-flood-2',
    type: 'HEAVY_RAIN',
    title: '🌧️ Heavy Rain Warning — Kaloor Underpass',
    issue: 'Heavy Rain',
    severity: 'HIGH',
    location: 'Kaloor Substation Road, Kochi',
    department: 'Drainage & Disaster Mgt',
    status: 'Active Warning',
    reportedTime: '07:30 AM',
    latitude: 9.9950,
    longitude: 76.2960,
  },
  {
    id: 'demo-flood-3',
    type: 'FLOOD',
    title: '🌊 Tidal Waterlogging — Fort Kochi Beach Road',
    issue: 'Coastal Inundation',
    severity: 'HIGH',
    location: 'Tower Road, Fort Kochi, Kerala',
    department: 'Coastal Hazard Mgt',
    status: 'Active Flood Zone',
    reportedTime: '08:15 AM',
    latitude: 9.9658,
    longitude: 76.2425,
  },
];

const ALL_DEMO_ITEMS: MapMarkerItem[] = [
  ...DEMO_TRAFFIC_ITEMS,
  ...DEMO_ROAD_ITEMS,
  ...DEMO_FLOOD_ITEMS,
];

// ─── KOCHI TRAFFIC ROUTE OVERLAYS ───────────────────────────────────────────────

type TrafficRoute = {
  id: string;
  name: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  coords: [number, number][];
};

const TRAFFIC_ROUTES: TrafficRoute[] = [
  {
    id: 'route-vytila',
    name: 'Vytila Flyover & NH 66 Stretch',
    severity: 'CRITICAL',
    coords: [
      [9.9600, 76.3150],
      [9.9630, 76.3170],
      [9.9664, 76.3188],
      [9.9710, 76.3195],
      [9.9780, 76.3170],
    ],
  },
  {
    id: 'route-mg-road',
    name: 'MG Road — Jose Junction to Kaloor',
    severity: 'HIGH',
    coords: [
      [9.9650, 76.2830],
      [9.9723, 76.2801],
      [9.9850, 76.2850],
      [9.9983, 76.2929],
    ],
  },
  {
    id: 'route-bypass',
    name: 'Edappally NH Bypass',
    severity: 'MEDIUM',
    coords: [
      [10.0150, 76.3070],
      [10.0200, 76.3075],
      [10.0261, 76.3082],
      [10.0330, 76.3090],
    ],
  },
];

// ─── KOCHI FLOOD ZONE OVERLAYS ─────────────────────────────────────────────────

type FloodZone = {
  id: string;
  name: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  center: [number, number];
  radius: number;
};

const FLOOD_ZONES: FloodZone[] = [
  { id: 'fzone-south', name: 'Ernakulam South Station', severity: 'CRITICAL', center: [9.9678, 76.2889], radius: 320 },
  { id: 'fzone-kaloor', name: 'Kaloor Lowlands', severity: 'HIGH', center: [9.9950, 76.2960], radius: 260 },
  { id: 'fzone-fortkochi', name: 'Fort Kochi Waterfront', severity: 'HIGH', center: [9.9658, 76.2425], radius: 280 },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function getHazardCategory(item: MapMarkerItem): HazardCategory {
  const t = (item.type || '').toUpperCase();
  const issue = (item.issue || '').toUpperCase();
  const title = (item.title || '').toUpperCase();

  if (
    t === 'FLOOD' || t === 'HEAVY_RAIN' ||
    issue.includes('FLOOD') || issue.includes('RAIN') ||
    title.includes('FLOOD') || title.includes('RAIN')
  ) return 'FLOOD';
  if (
    t === 'POTHOLE' || t === 'ROAD_HAZARD' ||
    issue.includes('POTHOLE') || issue.includes('ROAD') ||
    title.includes('POTHOLE') || title.includes('ROAD')
  ) return 'ROADS';
  return 'TRAFFIC';
}

function createHazardIcon(category: HazardCategory, isSelected: boolean) {
  let color: string, borderColor: string, badgeSvg: string;

  if (category === 'TRAFFIC') {
    color = '#dc2626'; borderColor = '#991b1b';
    badgeSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`;
  } else if (category === 'ROADS') {
    color = '#f59e0b'; borderColor = '#b45309';
    badgeSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#15353c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else {
    color = '#2563eb'; borderColor = '#1d4ed8';
    badgeSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 14.06c1.32 0 2.44-1.1 2.44-2.44 0-.7-.34-1.36-1.03-1.92-.48-.4-1.02-.82-1.41-1.4-.39.58-.93 1-1.41 1.4-.69.56-1.03 1.22-1.03 1.92 0 1.34 1.12 2.44 2.44 2.44z"/></svg>`;
  }

  const selectedStyle = isSelected
    ? 'filter: drop-shadow(0 0 10px rgba(21,53,60,0.95)); transform: scale(1.3); z-index: 1000;'
    : 'filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));';

  const html = `
    <div style="position:relative;width:32px;height:40px;${selectedStyle}transition:transform .2s cubic-bezier(.34,1.56,.64,1);cursor:pointer;">
      <svg width="32" height="40" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 41C17 41 32 26.5 32 16.5C32 8.216 25.284 1.5 17 1.5C8.716 1.5 2 8.216 2 16.5C2 26.5 17 41 17 41Z" fill="${color}" stroke="${borderColor}" stroke-width="2.5"/>
        <circle cx="17" cy="16" r="10.5" fill="${category === 'ROADS' ? '#fffdf8' : '#fff'}" />
      </svg>
      <div style="position:absolute;top:9px;left:9.5px;width:13px;height:13px;display:flex;align-items:center;justify-content:center;">${badgeSvg}</div>
    </div>`;

  return L.divIcon({ className: 'urbanwatch-hazard-pin', html, iconSize: [32, 40], iconAnchor: [16, 40], popupAnchor: [0, -40] });
}

function createUserLocationIcon() {
  const html = `
    <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:24px;height:24px;border-radius:50%;background:#059669;opacity:.35;animation:ping 1.5s cubic-bezier(0,0,.2,1) infinite;"></div>
      <div style="position:relative;width:14px;height:14px;border-radius:50%;background:#059669;border:2.5px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.3);"></div>
    </div>`;
  return L.divIcon({ className: 'urbanwatch-user-pin', html, iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -12] });
}

// ─── MAP CONTROLLER ────────────────────────────────────────────────────────────

function MapController({ targetLocation }: { targetLocation: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (targetLocation && !isNaN(targetLocation[0]) && !isNaN(targetLocation[1])) {
      map.flyTo(targetLocation, 14, { duration: 0.8 });
    }
  }, [targetLocation, map]);

  return null;
}

function trafficColor(severity: string): string {
  if (severity === 'CRITICAL') return '#dc2626';
  if (severity === 'HIGH') return '#ef4444';
  return '#f97316';
}

function floodColor(severity: string): string {
  if (severity === 'CRITICAL') return '#1d4ed8';
  if (severity === 'HIGH') return '#2563eb';
  return '#60a5fa';
}

function floodFillColor(severity: string): string {
  if (severity === 'CRITICAL') return '#3b82f6';
  if (severity === 'HIGH') return '#60a5fa';
  return '#93c5fd';
}

// ─── KOCHI DEFAULT CENTER ──────────────────────────────────────────────────────
const DEFAULT_KOCHI_CENTER: [number, number] = [9.9312, 76.2673];

export function CivicUnifiedMap({ items, userLocation, className = '' }: CivicUnifiedMapProps) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState<[number, number] | null>(null);

  const allItems = useMemo(() => {
    if (items.length > 0) return items;
    return ALL_DEMO_ITEMS;
  }, [items]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      if (isNaN(lat) || isNaN(lng)) return false;

      if (filterType === 'ALL') return true;

      const category = getHazardCategory(item);
      if (filterType === 'ROADS') return category === 'ROADS';
      if (filterType === 'TRAFFIC') return category === 'TRAFFIC';
      if (filterType === 'FLOOD') return category === 'FLOOD';
      return true;
    });
  }, [allItems, filterType]);

  const showTrafficLines = filterType === 'ALL' || filterType === 'TRAFFIC';
  const showFloodZones = filterType === 'ALL' || filterType === 'FLOOD';

  const activeFocus = useMemo(() => {
    if (filteredItems.length === 0) return null;
    const match = filteredItems.find((item) => item.id === selectedId);
    return match ?? filteredItems[0];
  }, [filteredItems, selectedId]);

  useEffect(() => {
    if (filteredItems.length === 0) {
      setSelectedId(null);
    } else if (!selectedId || !filteredItems.some((item) => item.id === selectedId)) {
      const nextItem = filteredItems[0];
      setSelectedId(nextItem.id);
      const lat = Number(nextItem.latitude);
      const lng = Number(nextItem.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setTargetLocation([lat, lng]);
      }
    }
  }, [filteredItems, selectedId]);

  const handleSelectPin = (item: MapMarkerItem) => {
    setSelectedId(item.id);
    const lat = Number(item.latitude);
    const lng = Number(item.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setTargetLocation([lat, lng]);
    }
  };

  const initialCenter: [number, number] = useMemo(() => {
    if (activeFocus) {
      const lat = Number(activeFocus.latitude);
      const lng = Number(activeFocus.longitude);
      if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
    }
    if (userLocation && !isNaN(Number(userLocation.latitude)) && !isNaN(Number(userLocation.longitude))) {
      return [Number(userLocation.latitude), Number(userLocation.longitude)];
    }
    return DEFAULT_KOCHI_CENTER;
  }, [activeFocus, userLocation]);

  const largerMapUrl = activeFocus
    ? `https://www.openstreetmap.org/?mlat=${Number(activeFocus.latitude)}&mlon=${Number(activeFocus.longitude)}#map=15/${Number(activeFocus.latitude)}/${Number(activeFocus.longitude)}`
    : `https://www.openstreetmap.org/#map=13/${DEFAULT_KOCHI_CENTER[0]}/${DEFAULT_KOCHI_CENTER[1]}`;

  const countByCategory = useMemo(() => {
    let traffic = 0, roads = 0, flood = 0;
    for (const item of allItems) {
      const cat = getHazardCategory(item);
      if (cat === 'TRAFFIC') traffic++;
      else if (cat === 'ROADS') roads++;
      else flood++;
    }
    return { traffic, roads, flood };
  }, [allItems]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ── FILTER TOOLBAR ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f8f5ed] border-2 border-[#15353c] p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#ed735e]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#15353c]">
            Display Layer (Kochi, Kerala):
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: `All (${allItems.length})`, dot: '#15353c' },
            { id: 'ROADS', label: `Potholes & Roads (${countByCategory.roads})`, dot: '#f59e0b' },
            { id: 'TRAFFIC', label: `Traffic Alerts (${countByCategory.traffic})`, dot: '#dc2626' },
            { id: 'FLOOD', label: `Flood & Rain (${countByCategory.flood})`, dot: '#2563eb' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 ${
                filterType === tab.id
                  ? 'bg-[#15353c] text-[#fffdf8]'
                  : 'bg-[#fffdf8] text-[#15353c] border border-[#15353c]/30 hover:bg-[#eee9de]'
              }`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: filterType === tab.id ? '#fffdf8' : tab.dot }}
              />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── LEGEND ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#52706d]">
        {(filterType === 'ALL' || filterType === 'TRAFFIC') && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-5 h-[3px] rounded-full bg-[#dc2626]" /> Traffic Congestion
          </span>
        )}
        {(filterType === 'ALL' || filterType === 'FLOOD') && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[#3b82f6]/40 border-2 border-[#2563eb]" /> Flood Zone
          </span>
        )}
        {(filterType === 'ALL' || filterType === 'ROADS') && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[#f59e0b]" /> Road Hazard
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* ── LEAFLET MAP ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-xl border-[3px] border-[#15353c] bg-[#e7f3f0] shadow-[6px_6px_0_#15353c]">
          <div className="h-[360px] sm:h-[420px] w-full">
            <MapContainer
              center={initialCenter}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController targetLocation={targetLocation} />

              {/* ── TRAFFIC ROUTE LINES ───────────────────────────────── */}
              {showTrafficLines &&
                TRAFFIC_ROUTES.map((route) => (
                  <Polyline
                    key={route.id}
                    positions={route.coords}
                    pathOptions={{
                      color: trafficColor(route.severity),
                      weight: route.severity === 'CRITICAL' ? 6 : 4,
                      opacity: 0.75,
                      dashArray: route.severity === 'MEDIUM' ? '8 6' : undefined,
                      lineCap: 'round',
                      lineJoin: 'round',
                    }}
                  />
                ))}

              {/* ── FLOOD ZONE CIRCLES ───────────────────────────────── */}
              {showFloodZones &&
                FLOOD_ZONES.map((zone) => (
                  <Circle
                    key={zone.id}
                    center={zone.center}
                    radius={zone.radius}
                    pathOptions={{
                      color: floodColor(zone.severity),
                      fillColor: floodFillColor(zone.severity),
                      fillOpacity: 0.30,
                      weight: 2.5,
                      dashArray: zone.severity === 'MEDIUM' ? '5 4' : undefined,
                    }}
                  />
                ))}

              {/* ── HAZARD PIN MARKERS ────────────────────────────────── */}
              {filteredItems.map((item) => {
                const lat = Number(item.latitude);
                const lng = Number(item.longitude);
                if (isNaN(lat) || isNaN(lng)) return null;

                const category = getHazardCategory(item);
                const isSelected = activeFocus?.id === item.id;

                return (
                  <Marker
                    key={item.id}
                    position={[lat, lng]}
                    icon={createHazardIcon(category, isSelected)}
                    eventHandlers={{
                      click: () => {
                        setSelectedId(item.id);
                        setTargetLocation([lat, lng]);
                      },
                    }}
                  >
                    <Popup>
                      <div className="p-0.5 text-xs font-sans min-w-[160px]">
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: category === 'TRAFFIC' ? '#dc2626' : category === 'ROADS' ? '#b45309' : '#2563eb' }}>
                          {category === 'TRAFFIC' ? '🚨 Traffic Alert' : category === 'ROADS' ? '⚠️ Road / Pothole' : '🌊 Flood / Rain'}
                        </p>
                        <h5 className="font-bold text-[#15353c] text-xs mt-0.5">{item.title}</h5>
                        <p className="text-[#52706d] text-[11px] mt-0.5">{item.issue} — {item.location}</p>
                        <div className="mt-1.5 flex items-center justify-between border-t border-[#15353c]/20 pt-1 text-[10px]">
                          <span className="font-bold text-[#15353c]">{item.severity}</span>
                          <span className="font-mono text-[#52706d]">{item.reportedTime}</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* ── USER LOCATION ──────────────────────────────────────── */}
              {userLocation &&
                !isNaN(Number(userLocation.latitude)) &&
                !isNaN(Number(userLocation.longitude)) && (
                  <Marker
                    position={[Number(userLocation.latitude), Number(userLocation.longitude)]}
                    icon={createUserLocationIcon()}
                  >
                    <Popup>
                      <div className="p-0.5 text-xs font-sans">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#059669]">Your Location</p>
                        <h5 className="font-bold text-[#15353c] text-xs mt-0.5">Current GPS Position</h5>
                      </div>
                    </Popup>
                  </Marker>
                )}
            </MapContainer>
          </div>

          {/* Bottom Coordinate Bar */}
          <div className="flex items-center justify-between border-t-2 border-[#15353c] bg-[#fffdf8] px-4 py-2.5">
            <span className="text-[10px] font-mono font-bold text-[#15353c] truncate pr-2">
              {activeFocus
                ? `Pinned: ${activeFocus.title} (${Number(activeFocus.latitude).toFixed(4)}, ${Number(activeFocus.longitude).toFixed(4)})`
                : 'No hazards available in this category.'}
            </span>
            <a
              href={largerMapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#17675e] hover:underline shrink-0"
            >
              Expand Map <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* ── SELECTED MARKER INTEL + PIN LIST ─────────────────────────── */}
        <div className="space-y-4">
          {activeFocus ? (
            <div className="rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-5 shadow-[4px_4px_0_#15353c]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">
                Selected Marker Intel
              </p>
              <h4 className="mt-1 font-mono text-lg font-bold uppercase tracking-tight text-[#15353c]">
                {activeFocus.title}
              </h4>

              <dl className="mt-4 space-y-2 border-t-2 border-[#15353c]/15 pt-3 text-xs">
                <div className="flex justify-between">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#52706d]">Issue:</dt>
                  <dd className="font-bold text-[#15353c]">{activeFocus.issue}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#52706d]">Severity:</dt>
                  <dd>
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                      activeFocus.severity === 'CRITICAL' ? 'bg-red-600 text-white'
                        : activeFocus.severity === 'HIGH' ? 'bg-orange-500 text-white'
                        : activeFocus.severity === 'MEDIUM' ? 'bg-amber-400 text-black'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {activeFocus.severity}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#52706d]">Department:</dt>
                  <dd className="font-bold text-[#17675e]">{activeFocus.department || 'Public Works'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#52706d]">Status:</dt>
                  <dd className="font-bold text-[#15353c]">{activeFocus.status || 'Active'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#52706d]">Reported:</dt>
                  <dd className="font-mono text-[#52706d]">{activeFocus.reportedTime}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#52706d]">Location:</dt>
                  <dd className="text-right font-medium text-[#15353c] max-w-[170px] truncate">
                    {activeFocus.location}
                  </dd>
                </div>
              </dl>

              {activeFocus.complaintId && (
                <Link
                  href={`/complaints/${activeFocus.complaintId}`}
                  className="mt-4 block w-full text-center rounded border-2 border-[#15353c] bg-[#ed735e] py-2 text-xs font-bold uppercase tracking-widest text-[#fffdf8] hover:bg-[#15353c] transition-colors"
                >
                  Inspect Report
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-5 shadow-[4px_4px_0_#15353c]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">
                Selected Marker Intel
              </p>
              <h4 className="mt-1 font-mono text-base font-bold uppercase tracking-tight text-[#15353c]">
                No Hazard Selected
              </h4>
              <div className="mt-4 border-t-2 border-[#15353c]/15 pt-3">
                <p className="text-xs text-[#52706d] italic">
                  No hazards available in this category.
                </p>
              </div>
            </div>
          )}

          {/* Active Map Pins List */}
          <div className="rounded-xl border-[2px] border-[#15353c] bg-[#f8f5ed] p-3 max-h-[190px] overflow-y-auto space-y-1.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#52706d] mb-1">
              Active Map Pins ({filteredItems.length}):
            </p>
            {filteredItems.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#52706d] italic">
                No hazards available in this category.
              </div>
            ) : (
              filteredItems.map((item) => {
                const cat = getHazardCategory(item);
                const dotColor = cat === 'TRAFFIC' ? '#dc2626' : cat === 'ROADS' ? '#f59e0b' : '#2563eb';
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectPin(item)}
                    className={`w-full text-left rounded p-2 text-xs transition-colors flex items-center justify-between border ${
                      activeFocus?.id === item.id
                        ? 'border-[#15353c] bg-[#fffdf8] font-bold text-[#15353c] shadow-sm'
                        : 'border-transparent hover:bg-white/60 text-[#52706d]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 truncate pr-2">
                      <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                      {item.title}
                    </span>
                    <span className="text-[9px] font-mono shrink-0 uppercase tracking-wider">
                      {item.severity}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
