import { useState } from 'react';
import { Building2, ShieldAlert, Check, RefreshCw, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { DEPARTMENTS, DEPARTMENT_STATUSES, type DepartmentStatus } from '@/lib/departmentConfig';
import { TRAFFIC_RISK_LEVELS, type TrafficRiskLevel } from '@/lib/trafficRisk';
import { updateComplaintDepartment, updateDepartmentStatus, updateTrafficRisk, deactivateAlertForComplaint } from '@/lib/firestore';

export type AdminDepartmentPanelProps = {
  complaintId: string;
  currentDepartmentId?: string | null;
  currentDepartmentName?: string | null;
  currentDepartmentStatus?: string | null;
  currentRemarks?: string | null;
  currentTrafficRisk?: string | null;
  assignedAt?: string | null;
  assignedBy?: string | null;
  estimatedResolutionTime?: string | null;
  onUpdated?: () => void;
};

export function AdminDepartmentPanel({
  complaintId,
  currentDepartmentId,
  currentDepartmentName,
  currentDepartmentStatus,
  currentRemarks,
  currentTrafficRisk,
  assignedAt,
  assignedBy,
  estimatedResolutionTime,
  onUpdated,
}: AdminDepartmentPanelProps) {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(currentDepartmentId ?? 'public-works');
  const [status, setStatus] = useState<string>(currentDepartmentStatus ?? 'Assigned');
  const [remarks, setRemarks] = useState<string>(currentRemarks ?? '');
  const [trafficRisk, setTrafficRisk] = useState<string>(currentTrafficRisk ?? 'Medium');
  const [estimatedHours, setEstimatedHours] = useState<string>('48');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSave() {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const dept = DEPARTMENTS.find((d) => d.id === selectedDeptId);
      const deptName = dept?.name ?? 'Public Works Department';
      const hoursNum = parseInt(estimatedHours, 10) || 48;
      const estimatedTime = new Date(Date.now() + hoursNum * 3600 * 1000).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      await updateComplaintDepartment(complaintId, {
        departmentId: selectedDeptId,
        departmentName: deptName,
        departmentStatus: status,
        assignedBy: 'Administrator',
        departmentRemarks: remarks.trim() || null,
        estimatedResolutionTime: estimatedTime,
      });

      // Update traffic risk as well
      await updateTrafficRisk(complaintId, trafficRisk);

      // If status is resolved, automatically deactivate traffic alert
      if (status === 'Resolved') {
        await deactivateAlertForComplaint(complaintId);
      }

      setSuccessMessage('Department routing & risk updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      onUpdated?.();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update department assignment.');
    } finally {
      setSaving(false);
    }
  }

  async function handleQuickEscalate() {
    setSaving(true);
    setErrorMessage('');
    try {
      await updateDepartmentStatus(complaintId, 'Escalated', 'Escalated by supervisor for urgent civic intervention.');
      setStatus('Escalated');
      setSuccessMessage('Complaint escalated to emergency priority.');
      setTimeout(() => setSuccessMessage(''), 3000);
      onUpdated?.();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Escalation failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-6 shadow-[6px_6px_0_#15353c]">
      <div className="flex items-center justify-between border-b-2 border-[#15353c]/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded border-2 border-[#15353c] bg-[#d9eeea] text-[#17675e]">
            <Building2 size={18} strokeWidth={2.5} />
          </span>
          <div>
            <h3 className="font-mono text-base font-bold uppercase tracking-tight text-[#15353c]">
              Municipal Dispatch & Assignment
            </h3>
            <p className="text-[11px] text-[#52706d]">
              Assign department, update workflow status, and set road hazard risk
            </p>
          </div>
        </div>
      </div>

      {successMessage && (
        <p className="mt-4 border-2 border-[#17675e] bg-[#d9eeea] p-3 text-xs font-bold text-[#17675e]">
          ✓ {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="mt-4 border-2 border-[#b54c3c] bg-[#fff1ed] p-3 text-xs font-bold text-[#b54c3c]">
          {errorMessage}
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {/* Department Selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#15353c]">
            Assigned Department
          </label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="mt-1.5 h-11 w-full rounded border-2 border-[#15353c] bg-white px-3 text-xs font-bold uppercase text-[#15353c] outline-none focus:border-[#ed735e]"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department Workflow Status */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#15353c]">
            Department Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1.5 h-11 w-full rounded border-2 border-[#15353c] bg-white px-3 text-xs font-bold uppercase text-[#15353c] outline-none focus:border-[#ed735e]"
          >
            {DEPARTMENT_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Traffic Risk Level */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#15353c]">
            Traffic / Safety Risk Level
          </label>
          <select
            value={trafficRisk}
            onChange={(e) => setTrafficRisk(e.target.value)}
            className="mt-1.5 h-11 w-full rounded border-2 border-[#15353c] bg-white px-3 text-xs font-bold uppercase text-[#15353c] outline-none focus:border-[#ed735e]"
          >
            {TRAFFIC_RISK_LEVELS.map((risk) => (
              <option key={risk} value={risk}>
                {risk} Risk
              </option>
            ))}
          </select>
        </div>

        {/* Estimated SLA / Resolution */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#15353c]">
            Resolution SLA (Hours)
          </label>
          <select
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            className="mt-1.5 h-11 w-full rounded border-2 border-[#15353c] bg-white px-3 text-xs font-bold uppercase text-[#15353c] outline-none focus:border-[#ed735e]"
          >
            <option value="12">12 Hours (Emergency)</option>
            <option value="24">24 Hours (Urgent)</option>
            <option value="48">48 Hours (Standard)</option>
            <option value="72">72 Hours (Routine)</option>
          </select>
        </div>
      </div>

      {/* Department Remarks */}
      <div className="mt-4">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#15353c]">
          Department Remarks & Operational Notes
        </label>
        <textarea
          rows={2}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="E.g. Road inspection team dispatched. Temporary barricades installed on site."
          className="mt-1.5 w-full rounded border-2 border-[#15353c] bg-white p-3 text-xs font-medium text-[#15353c] outline-none focus:border-[#ed735e]"
        />
      </div>

      {/* Meta info: Assigned At / By */}
      {assignedAt && (
        <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-mono text-[#52706d]">
          <span>Assigned: {assignedAt}</span>
          {assignedBy && <span>By: {assignedBy}</span>}
          {estimatedResolutionTime && <span>ETA: {estimatedResolutionTime}</span>}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-[#15353c]/15 pt-4">
        <button
          type="button"
          onClick={handleQuickEscalate}
          disabled={saving || status === 'Escalated'}
          className="inline-flex items-center gap-1.5 rounded border border-[#b54c3c] bg-[#fff1ed] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#b54c3c] hover:bg-[#b54c3c] hover:text-white transition-colors disabled:opacity-50"
        >
          <ArrowUpRight size={14} /> Escalate Issue
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded border-2 border-[#15353c] bg-[#ed735e] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-[2px_2px_0_#15353c] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all"
        >
          {saving ? 'Updating...' : 'Save Department Updates'}
        </button>
      </div>
    </section>
  );
}
