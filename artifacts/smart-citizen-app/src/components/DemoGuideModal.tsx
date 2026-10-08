import { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, X, Play, ShieldAlert, Waves, Car, Building2 } from 'lucide-react';
import { Link } from 'wouter';

export function DemoGuideModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const STEPS = [
    {
      num: 1,
      title: 'Submit a Pothole Report',
      desc: 'Go to Report Issue. Select "Pothole" category and enter description. Attach photo or use GPS.',
      link: '/report',
      linkText: 'Go to Report Form',
      badge: 'Citizen Action',
    },
    {
      num: 2,
      title: 'Auto-Department Assignment',
      desc: 'System assigns Public Works Department automatically using central rule configuration.',
      link: '/complaints',
      linkText: 'View My Complaints',
      badge: 'Feature 1',
    },
    {
      num: 3,
      title: 'High Traffic Risk Evaluation',
      desc: 'Because of pothole category & road impact, system evaluates Traffic Risk as HIGH.',
      link: '/traffic-alerts',
      linkText: 'Check Traffic Risk',
      badge: 'Feature 2',
    },
    {
      num: 4,
      title: 'Traffic Alert Generation',
      desc: 'A public traffic advisory appears on the Traffic Alerts page & unified interactive hazard map.',
      link: '/traffic-alerts',
      linkText: 'View Traffic Alerts Map',
      badge: 'Feature 2',
    },
    {
      num: 5,
      title: 'Nearby Civic Hazard Radar',
      desc: 'Users located within configurable radius (e.g. 1km) receive proximity warning on their Dashboard.',
      link: '/dashboard',
      linkText: 'View Citizen Dashboard',
      badge: 'Feature 3',
    },
    {
      num: 6,
      title: 'Admin Operations Review',
      desc: 'Admin views the new complaint in city queue with assigned department and traffic risk.',
      link: '/admin/reports',
      linkText: 'Go to Admin Queue',
      badge: 'Admin Panel',
    },
    {
      num: 7,
      title: 'Admin Updates Status & Remarks',
      desc: 'Admin changes status to "In Progress" and adds field team inspection remarks.',
      link: '/admin/reports',
      linkText: 'Manage in Admin',
      badge: 'Feature 1',
    },
    {
      num: 8,
      title: 'Citizen Real-time Timeline',
      desc: 'Citizen opens complaint details to see 6-stage visual timeline and updated department status.',
      link: '/complaints',
      linkText: 'View Case Timeline',
      badge: 'Feature 1',
    },
    {
      num: 9,
      title: 'Simulate Heavy Rain / Flood',
      desc: 'Use the "Evaluation Simulator" on the Citizen Dashboard to trigger a flood condition.',
      link: '/dashboard',
      linkText: 'Simulate on Dashboard',
      badge: 'Feature 4',
    },
    {
      num: 10,
      title: 'Flood Alert on Dashboard & Map',
      desc: 'Severe weather advisory banner appears across dashboard, notifications, and transit hazard radar.',
      link: '/alerts',
      linkText: 'Check Alert Center',
      badge: 'Feature 4',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#15353c]/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-[3px] border-[#15353c] bg-[#fffdf8] p-6 sm:p-8 shadow-[8px_8px_0_#15353c] animate-rise-in">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-[#15353c] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded bg-[#ed735e] text-white">
                <Sparkles size={16} />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">
                College Evaluation Mode
              </span>
            </div>
            <h2 className="mt-2 font-mono text-2xl font-bold uppercase tracking-tight text-[#15353c]">
              UrbanWatch 10-Step Demonstration Walkthrough
            </h2>
            <p className="mt-1 text-xs text-[#52706d]">
              Follow this verified sequence to demonstrate all 4 major features to evaluators.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border-2 border-[#15353c] p-1.5 hover:bg-[#eee9de]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Steps List */}
        <div className="mt-6 space-y-3">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className={`rounded-xl border-2 p-3.5 transition-all ${
                activeStep === s.num
                  ? 'border-[#15353c] bg-[#fffaf5] shadow-[3px_3px_0_#15353c]'
                  : 'border-[#15353c]/20 bg-white hover:border-[#15353c]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded font-mono text-xs font-bold ${
                      activeStep === s.num
                        ? 'bg-[#15353c] text-white'
                        : 'bg-[#f0ece2] text-[#15353c]'
                    }`}
                  >
                    {s.num}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-mono text-sm font-bold uppercase text-[#15353c]">
                        {s.title}
                      </h4>
                      <span className="rounded bg-[#17675e]/15 px-2 py-0.5 text-[8px] font-bold uppercase text-[#17675e]">
                        {s.badge}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#52706d]">{s.desc}</p>
                  </div>
                </div>

                <Link
                  href={s.link}
                  onClick={onClose}
                  className="shrink-0 inline-flex items-center gap-1 rounded border border-[#15353c] bg-[#f8f5ed] px-2.5 py-1 text-[10px] font-bold uppercase text-[#15353c] hover:bg-[#ed735e] hover:text-white transition-colors"
                >
                  {s.linkText} <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t-2 border-[#15353c] pt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#52706d]">
            UrbanWatch AI • Department Dispatch • Traffic Radar • Weather Alerting
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded border-2 border-[#15353c] bg-[#15353c] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ed735e]"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
