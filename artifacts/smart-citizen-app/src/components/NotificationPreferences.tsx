import { useEffect, useState } from 'react';
import { Bell, Navigation, Check, Shield } from 'lucide-react';
import { getUserPreferences, saveUserPreferences } from '@/lib/firestore';
import type { UserPreferences } from '@/lib/alertTypes';

export type NotificationPreferencesProps = {
  userId: string;
};

export function NotificationPreferences({ userId }: NotificationPreferencesProps) {
  const [prefs, setPrefs] = useState<UserPreferences>({
    userId,
    civicAlerts: true,
    trafficAlerts: true,
    floodAlerts: true,
    rainAlerts: true,
    nearbyRadius: 1000,
    locationGranted: false,
  });
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locMessage, setLocMessage] = useState('');

  useEffect(() => {
    let active = true;
    getUserPreferences(userId)
      .then((data) => {
        if (active) setPrefs(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  async function handleToggle(key: keyof Omit<UserPreferences, 'userId' | 'nearbyRadius'>) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    await saveUserPreferences(next);
    triggerSaved();
  }

  async function handleRadiusChange(radius: number) {
    const next = { ...prefs, nearbyRadius: radius };
    setPrefs(next);
    await saveUserPreferences(next);
    triggerSaved();
  }

  function triggerSaved() {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  }

  function requestLocationPermission() {
    setLocMessage('');
    if (!('geolocation' in navigator)) {
      setLocMessage('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async () => {
        setLocating(false);
        const next = { ...prefs, locationGranted: true };
        setPrefs(next);
        await saveUserPreferences(next);
        setLocMessage('Location access confirmed! Nearby alerts active.');
        triggerSaved();
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocMessage('Permission denied. Location-based alerts will remain disabled.');
        } else {
          setLocMessage('Could not retrieve location. Please check browser settings.');
        }
      },
    );
  }

  if (loading) {
    return <div className="p-4 text-center text-xs text-[#71807d]">Loading alert preferences...</div>;
  }

  return (
    <div className="rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-6 shadow-[6px_6px_0_#15353c]">
      <div className="flex items-center justify-between border-b-2 border-[#15353c]/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded border-2 border-[#15353c] bg-[#faedcf] text-[#99621b]">
            <Bell size={18} strokeWidth={2.5} />
          </span>
          <div>
            <h3 className="font-mono text-lg font-bold uppercase tracking-tight text-[#15353c]">
              Alert Subscriptions
            </h3>
            <p className="text-xs text-[#52706d]">Configure notifications for civic safety</p>
          </div>
        </div>
        {savedMessage && (
          <span className="inline-flex items-center gap-1 rounded bg-[#d9eeea] px-2.5 py-1 text-[10px] font-bold uppercase text-[#17675e] animate-pulse">
            <Check size={12} strokeWidth={3} /> Saved
          </span>
        )}
      </div>

      {/* Alert Toggles */}
      <div className="mt-5 space-y-3.5">
        {[
          { key: 'civicAlerts', label: 'Civic Alerts', desc: 'General municipal warnings and maintenance disruptions' },
          { key: 'trafficAlerts', label: 'Traffic Alerts', desc: 'Pothole hazards, road cave-ins, and lane blockages' },
          { key: 'floodAlerts', label: 'Flood & Waterlogging Alerts', desc: 'High-water conditions, drain overflows, and street flooding' },
          { key: 'rainAlerts', label: 'Heavy Rain Alerts', desc: 'Downpour warnings and localized storm risk' },
        ].map((item) => {
          const isEnabled = Boolean(prefs[item.key as keyof UserPreferences]);
          return (
            <div key={item.key} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-[#15353c]/15 bg-[#f8f5ed]">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-bold uppercase text-[#15353c]">{item.label}</p>
                <p className="text-[11px] text-[#52706d]">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(item.key as any)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-[#15353c] transition-colors ${
                  isEnabled ? 'bg-[#17675e]' : 'bg-[#e4dfd2]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ${
                    isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Nearby Alert Radius Slider / Options */}
      <div className="mt-6 border-t-2 border-[#15353c]/15 pt-5">
        <label className="block">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-[#15353c]">
              Nearby Hazard Radius
            </span>
            <span className="font-mono text-xs font-bold text-[#ed735e]">
              {prefs.nearbyRadius < 1000 ? `${prefs.nearbyRadius}m` : `${prefs.nearbyRadius / 1000}km`}
            </span>
          </div>
          <p className="text-[11px] text-[#52706d] mt-0.5">
            Only issues reported within this geographic radius will trigger proximity radar alerts.
          </p>
        </label>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[250, 500, 1000, 2000].map((radius) => (
            <button
              key={radius}
              type="button"
              onClick={() => handleRadiusChange(radius)}
              className={`rounded border-2 py-2 text-xs font-bold uppercase transition-all ${
                prefs.nearbyRadius === radius
                  ? 'border-[#15353c] bg-[#ed735e] text-white shadow-[2px_2px_0_#15353c]'
                  : 'border-[#15353c]/30 bg-white text-[#15353c] hover:border-[#15353c]'
              }`}
            >
              {radius < 1000 ? `${radius}m` : `${radius / 1000}km`}
            </button>
          ))}
        </div>
      </div>

      {/* Location Permission Status */}
      <div className="mt-6 border-t-2 border-[#15353c]/15 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Navigation size={16} className="text-[#17675e]" />
            <span className="text-xs font-bold uppercase text-[#15353c]">
              Proximity Geolocation
            </span>
          </div>
          <button
            type="button"
            onClick={requestLocationPermission}
            disabled={locating}
            className="rounded border border-[#15353c] bg-[#fffdf8] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#15353c] hover:bg-[#15353c] hover:text-white transition-colors"
          >
            {locating ? 'Requesting...' : prefs.locationGranted ? 'Re-verify GPS' : 'Enable GPS'}
          </button>
        </div>
        {locMessage && (
          <p className="mt-2 text-[11px] font-semibold text-[#17675e]">{locMessage}</p>
        )}
        <div className="mt-3 flex items-start gap-2 text-[10px] text-[#71807d]">
          <Shield size={13} className="shrink-0 mt-0.5 text-[#17675e]" />
          <span>
            Privacy protected: Exact GPS coordinates are never broadcast to other users. Only relative distance is calculated.
          </span>
        </div>
      </div>
    </div>
  );
}
