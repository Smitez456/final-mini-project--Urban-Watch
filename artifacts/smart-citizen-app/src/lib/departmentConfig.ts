// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENT CONFIGURATION — Central mapping of issue types to departments.
// Modify this file to change department assignments without touching other code.
// ─────────────────────────────────────────────────────────────────────────────

export const DEPARTMENT_STATUSES = [
  'Assigned',
  'Acknowledged',
  'In Progress',
  'Resolved',
  'Rejected',
  'Escalated',
] as const;
export type DepartmentStatus = (typeof DEPARTMENT_STATUSES)[number];

export function isDepartmentStatus(value: string): value is DepartmentStatus {
  return DEPARTMENT_STATUSES.includes(value as DepartmentStatus);
}

export type Department = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string; // For UI display
};

// ─── Master department list ───────────────────────────────────────────────────
export const DEPARTMENTS: Department[] = [
  {
    id: 'public-works',
    name: 'Public Works Department',
    shortName: 'Public Works',
    description: 'Roads, pavements, and general infrastructure repairs.',
    color: 'coral',
  },
  {
    id: 'waste-management',
    name: 'Waste Management & Sanitation Department',
    shortName: 'Sanitation',
    description: 'Garbage collection, recycling, and sanitation services.',
    color: 'amber',
  },
  {
    id: 'electrical',
    name: 'Electrical & Street Lighting Department',
    shortName: 'Electrical',
    description: 'Street lights, electrical hazards, and public lighting.',
    color: 'yellow',
  },
  {
    id: 'water-supply',
    name: 'Water Supply Department',
    shortName: 'Water Supply',
    description: 'Water pipes, leakages, and supply disruptions.',
    color: 'blue',
  },
  {
    id: 'drainage',
    name: 'Drainage & Disaster Management Department',
    shortName: 'Drainage',
    description: 'Flooding, drainage, and disaster response.',
    color: 'teal',
  },
  {
    id: 'municipal',
    name: 'Municipal Corporation — General Civic Department',
    shortName: 'Municipal',
    description: 'General civic matters not covered by other departments.',
    color: 'indigo',
  },
];

// ─── Issue-type → department mapping ─────────────────────────────────────────
// Keys are case-insensitive partial matches against issueType / aiCategory.
// More specific patterns should come first.
const ISSUE_DEPARTMENT_RULES: Array<{ keywords: string[]; departmentId: string }> = [
  {
    keywords: ['pothole', 'road damage', 'road block', 'road hazard', 'collapsed road', 'debris on road', 'road crack', 'sidewalk', 'pavement'],
    departmentId: 'public-works',
  },
  {
    keywords: ['garbage', 'waste', 'recycling', 'litter', 'trash', 'rubbish', 'dumping'],
    departmentId: 'waste-management',
  },
  {
    keywords: ['streetlight', 'street light', 'damaged streetlight', 'light out', 'electrical', 'power line', 'transformer'],
    departmentId: 'electrical',
  },
  {
    keywords: ['water leakage', 'water leak', 'pipe burst', 'water supply', 'sewage', 'sewer', 'waterline'],
    departmentId: 'water-supply',
  },
  {
    keywords: ['flood', 'flooding', 'waterlogging', 'drainage', 'drain block', 'storm water', 'heavy rain', 'overflowing drain'],
    departmentId: 'drainage',
  },
];

export function getDepartmentForIssue(issueType: string, aiCategory?: string | null): Department {
  const searchText = `${aiCategory ?? ''} ${issueType}`.toLowerCase();

  for (const rule of ISSUE_DEPARTMENT_RULES) {
    if (rule.keywords.some((keyword) => searchText.includes(keyword.toLowerCase()))) {
      const dept = DEPARTMENTS.find((d) => d.id === rule.departmentId);
      if (dept) return dept;
    }
  }

  // Default fallback
  return DEPARTMENTS.find((d) => d.id === 'municipal')!;
}

export function getDepartmentById(id: string): Department | null {
  return DEPARTMENTS.find((d) => d.id === id) ?? null;
}

// ─── Estimated resolution times by priority ───────────────────────────────────
export const ESTIMATED_RESOLUTION_BY_PRIORITY: Record<string, string> = {
  Critical: '24–48 hours',
  High: '3–5 business days',
  Medium: '7–14 business days',
  Low: '14–30 business days',
  'Pending assignment': '7–14 business days',
};

export function assignDepartment(
  issueType: string,
  aiCategory?: string | null,
  priority?: string,
  _location?: { latitude?: number | null; longitude?: number | null } | null
): Department & { slaHours: number } {
  const dept = getDepartmentForIssue(issueType, aiCategory);
  let slaHours = 48;
  if (priority === 'Critical') slaHours = 24;
  else if (priority === 'High') slaHours = 48;
  else if (priority === 'Medium') slaHours = 72;
  else slaHours = 120;
  return {
    ...dept,
    slaHours,
  };
}
