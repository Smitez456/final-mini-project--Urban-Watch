import React from 'react';
import { Check, Clock, AlertTriangle, ShieldCheck, Cpu, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TimelineProps = {
  complaintStatus: string;
  departmentStatus?: string | null;
  departmentName?: string | null;
  submittedAt?: string | null;
  assignedAt?: string | null;
  aiCategory?: string | null;
};

type Step = {
  id: string;
  label: string;
  detail: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
};

const STEPS: Step[] = [
  { id: 'submitted', label: 'Submitted', detail: 'Report recorded in civic database', icon: Clock },
  { id: 'ai_analysis', label: 'AI/Issue Analysis', detail: 'Visual classification and severity evaluation', icon: Cpu },
  { id: 'dept_assigned', label: 'Department Assigned', detail: 'Routed to competent municipal department', icon: Building2 },
  { id: 'acknowledged', label: 'Acknowledged', detail: 'Department team acknowledged dispatch', icon: ShieldCheck },
  { id: 'in_progress', label: 'In Progress', detail: 'Field team mobilized on site', icon: AlertTriangle },
  { id: 'resolved', label: 'Resolved', detail: 'Work completed and verified', icon: Check },
];

export function ComplaintTimeline({
  complaintStatus,
  departmentStatus,
  departmentName,
  submittedAt,
  assignedAt,
  aiCategory,
}: TimelineProps) {
  // Determine current step index (0 to 5)
  let activeIndex = 0;

  if (complaintStatus === 'Resolved' || departmentStatus === 'Resolved') {
    activeIndex = 5;
  } else if (complaintStatus === 'In Progress' || departmentStatus === 'In Progress') {
    activeIndex = 4;
  } else if (departmentStatus === 'Acknowledged') {
    activeIndex = 3;
  } else if (departmentStatus === 'Assigned' || departmentName) {
    activeIndex = 2;
  } else if (aiCategory) {
    activeIndex = 1;
  } else {
    activeIndex = 0;
  }

  return (
    <div className="mt-4">
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#15353c]/20">
        {STEPS.map((step, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isPending = idx > activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex items-start gap-4">
              <span
                className={cn(
                  'absolute -left-6 sm:-left-8 grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-full border-2 transition-all',
                  isDone && 'border-[#17675e] bg-[#17675e] text-[#fffdf8]',
                  isCurrent && 'border-[#ed735e] bg-[#ed735e] text-[#fffdf8] shadow-[0_0_0_4px_rgba(237,115,94,0.2)]',
                  isPending && 'border-[#15353c]/30 bg-[#fffdf8] text-[#15353c]/40',
                )}
              >
                <Icon size={13} strokeWidth={2.5} />
              </span>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p
                    className={cn(
                      'font-mono text-xs sm:text-sm font-bold uppercase tracking-tight',
                      isCurrent && 'text-[#ed735e]',
                      isDone && 'text-[#15353c]',
                      isPending && 'text-[#15353c]/50',
                    )}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="rounded bg-[#ed735e]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#ed735e]">
                      Active Stage
                    </span>
                  )}
                  {isDone && idx === 0 && submittedAt && (
                    <span className="text-[10px] font-mono text-[#52706d]">{submittedAt}</span>
                  )}
                  {isDone && idx === 2 && assignedAt && (
                    <span className="text-[10px] font-mono text-[#52706d]">{assignedAt}</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[#52706d]">
                  {idx === 2 && departmentName ? `Assigned to: ${departmentName}` : step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
