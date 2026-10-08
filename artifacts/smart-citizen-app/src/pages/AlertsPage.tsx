import { useEffect, useState } from 'react';
import {
  Bell,
  CheckCheck,
  Check,
  AlertTriangle,
  Waves,
  CloudRain,
  Car,
  Shield,
  ArrowRight,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'wouter';
import { getAlertsForUser, markAlertRead, markAllAlertsRead } from '@/lib/firestore';
import type { StoredAlert } from '@/lib/alertTypes';

export type AlertsPageProps = {
  userId: string;
  Shell: React.ComponentType<{ children: React.ReactNode }>;
};

export function AlertsPage({ userId, Shell }: AlertsPageProps) {
  const [alerts, setAlerts] = useState<StoredAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    let active = true;
    loadAlerts(active);
    return () => {
      active = false;
    };
  }, [userId]);

  async function loadAlerts(active = true) {
    setLoading(true);
    try {
      const data = await getAlertsForUser(userId);
      if (active) setAlerts(data);
    } catch {
      // In case Firestore is fresh or empty
      if (active) setAlerts([]);
    } finally {
      if (active) setLoading(false);
    }
  }

  async function handleMarkRead(alertId: string) {
    try {
      await markAlertRead(alertId);
      setAlerts((prev) =>
        prev.map((a) => (a.alertId === alertId ? { ...a, isRead: true } : a)),
      );
    } catch (err) {
      console.error('Error marking alert as read:', err);
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllAlertsRead(userId);
      setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    } catch (err) {
      console.error('Error marking all alerts as read:', err);
    }
  }

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const filteredAlerts = alerts.filter((alert) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'UNREAD') return !alert.isRead;
    if (filterType === 'TRAFFIC') return alert.type === 'TRAFFIC' || alert.type === 'ROAD_HAZARD';
    if (filterType === 'WEATHER') return alert.type === 'FLOOD' || alert.type === 'HEAVY_RAIN';
    if (filterType === 'CIVIC') return alert.type === 'CIVIC' || alert.type === 'SYSTEM';
    return true;
  });

  function getAlertIcon(type: StoredAlert['type']) {
    switch (type) {
      case 'FLOOD':
        return <Waves size={20} strokeWidth={2.5} className="text-[#17675e]" />;
      case 'HEAVY_RAIN':
        return <CloudRain size={20} strokeWidth={2.5} className="text-[#3b82f6]" />;
      case 'TRAFFIC':
      case 'ROAD_HAZARD':
        return <Car size={20} strokeWidth={2.5} className="text-[#b54c3c]" />;
      default:
        return <AlertTriangle size={20} strokeWidth={2.5} className="text-[#99621b]" />;
    }
  }

  function getSeverityBadge(severity: StoredAlert['severity']) {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-600 text-white';
      case 'HIGH':
        return 'bg-orange-500 text-white';
      case 'MEDIUM':
        return 'bg-amber-400 text-black';
      case 'LOW':
      default:
        return 'bg-emerald-600 text-white';
    }
  }

  return (
    <Shell>
      <div className="civic-dot-grid min-h-[calc(100dvh-80px)] px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-[1080px]">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-[#15353c] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded bg-[#15353c] text-white">
                  <Bell size={16} strokeWidth={2.5} />
                </span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">
                  Notifications
                </p>
              </div>
              <h1 className="mt-2 font-mono text-3xl font-bold uppercase tracking-tight text-[#15353c] sm:text-4xl">
                Civic Alert Center
              </h1>
              <p className="mt-1 text-xs text-[#52706d]">
                Live alerts for road conditions, flood risks, traffic disruptions, and civic updates.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-2 rounded border-2 border-[#15353c] bg-[#fffdf8] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[#15353c] shadow-[2px_2px_0_#15353c] hover:bg-[#d9eeea] transition-all"
              >
                <CheckCheck size={16} /> Mark All Read ({unreadCount})
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'ALL', label: `All Alerts (${alerts.length})` },
                { id: 'UNREAD', label: `Unread (${unreadCount})` },
                { id: 'TRAFFIC', label: 'Traffic & Roads' },
                { id: 'WEATHER', label: 'Flood & Rain' },
                { id: 'CIVIC', label: 'Civic' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id)}
                  className={`rounded-lg border-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    filterType === tab.id
                      ? 'border-[#15353c] bg-[#15353c] text-white shadow-[2px_2px_0_#ed735e]'
                      : 'border-[#15353c]/20 bg-white text-[#15353c] hover:border-[#15353c]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Link
              href="/traffic-alerts"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ed735e] hover:underline"
            >
              View Traffic Map <ArrowRight size={14} />
            </Link>
          </div>

          {/* Alerts List */}
          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-xl border-2 border-dashed border-[#15353c]/30 p-12 text-center text-xs font-bold uppercase tracking-widest text-[#52706d]">
                Scanning civic alert feeds...
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-12 text-center shadow-[6px_6px_0_#15353c]">
                <Shield size={36} className="mx-auto text-[#17675e]" strokeWidth={2} />
                <h3 className="mt-3 font-mono text-xl font-bold uppercase text-[#15353c]">
                  All Clear
                </h3>
                <p className="mt-1 text-xs text-[#52706d]">
                  No active alerts currently match your selected filter.
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const dateStr = new Date(alert.createdAt).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <article
                    key={alert.alertId}
                    className={`rounded-xl border-[3px] p-5 shadow-[5px_5px_0_#15353c] transition-all ${
                      !alert.isRead
                        ? 'border-[#15353c] bg-[#fffaf5] ring-2 ring-[#ed735e]/30'
                        : 'border-[#15353c]/30 bg-[#fffdf8]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border-2 border-[#15353c] bg-[#f8f5ed]">
                          {getAlertIcon(alert.type)}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${getSeverityBadge(
                                alert.severity,
                              )}`}
                            >
                              {alert.severity} Severity
                            </span>
                            <span className="rounded bg-[#15353c]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#15353c]">
                              {alert.type}
                            </span>
                            {!alert.isRead && (
                              <span className="rounded bg-[#ed735e] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white animate-pulse">
                                Unread
                              </span>
                            )}
                            <span className="font-mono text-[10px] text-[#52706d]">{dateStr}</span>
                          </div>

                          <h3 className="mt-2 font-mono text-base font-bold uppercase tracking-tight text-[#15353c]">
                            {alert.title}
                          </h3>
                          <p className="mt-1 text-xs text-[#52706d] leading-relaxed">
                            {alert.message}
                          </p>

                          {alert.location && (
                            <p className="mt-2 font-mono text-[11px] font-semibold text-[#17675e]">
                              📍 Location: {alert.location}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                        {!alert.isRead && (
                          <button
                            type="button"
                            onClick={() => handleMarkRead(alert.alertId)}
                            className="inline-flex items-center gap-1 rounded border border-[#15353c] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#15353c] hover:bg-[#d9eeea]"
                          >
                            <Check size={12} /> Mark Read
                          </button>
                        )}

                        {alert.complaintId && (
                          <Link
                            href={`/complaints/${alert.complaintId}`}
                            className="inline-flex items-center gap-1 rounded border-2 border-[#15353c] bg-[#ed735e] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-[2px_2px_0_#15353c] hover:-translate-y-0.5 transition-all"
                          >
                            View Case <ArrowRight size={13} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
