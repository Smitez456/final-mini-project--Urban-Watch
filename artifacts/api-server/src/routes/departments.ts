// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENT ROUTES — Validation and management for department assignments.
// ─────────────────────────────────────────────────────────────────────────────

import { Router, type IRouter } from "express";

const router: IRouter = Router();

export const DEPARTMENTS = [
  {
    id: "public-works",
    name: "Public Works Department",
    shortName: "Public Works",
    description: "Roads, pavements, and general infrastructure repairs.",
    slaHours: 48,
  },
  {
    id: "waste-management",
    name: "Waste Management & Sanitation Department",
    shortName: "Sanitation",
    description: "Garbage collection, recycling, and sanitation services.",
    slaHours: 24,
  },
  {
    id: "electrical",
    name: "Electrical & Street Lighting Department",
    shortName: "Electrical",
    description: "Street lights, electrical hazards, and public lighting.",
    slaHours: 24,
  },
  {
    id: "water-supply",
    name: "Water Supply Department",
    shortName: "Water Supply",
    description: "Water pipes, leakages, and supply disruptions.",
    slaHours: 36,
  },
  {
    id: "drainage",
    name: "Drainage & Disaster Management Department",
    shortName: "Drainage",
    description: "Flooding, drainage, and disaster response.",
    slaHours: 12,
  },
  {
    id: "municipal",
    name: "Municipal Corporation — General Civic Department",
    shortName: "Municipal",
    description: "General civic matters not covered by other departments.",
    slaHours: 72,
  },
];

const VALID_STATUSES = new Set([
  "Assigned",
  "Acknowledged",
  "In Progress",
  "Resolved",
  "Rejected",
  "Escalated",
]);

// GET /api/departments - list all departments
router.get("/departments", (_req, res) => {
  res.json({ departments: DEPARTMENTS });
});

// POST /api/complaints/:id/assign-department
router.post("/complaints/:id/assign-department", (req, res) => {
  const { id } = req.params;
  const { departmentId, assignedBy, departmentRemarks, estimatedResolutionTime } = req.body ?? {};

  if (!id || typeof id !== "string") {
    res.status(400).json({ error: "Invalid complaint ID." });
    return;
  }

  const dept = DEPARTMENTS.find((d) => d.id === departmentId);
  if (!dept) {
    res.status(400).json({ error: `Invalid departmentId: ${departmentId}` });
    return;
  }

  const assignedAt = new Date().toISOString();
  const estimatedHours = dept.slaHours;
  const defaultEstimate = new Date(Date.now() + estimatedHours * 3600 * 1000).toISOString();

  res.json({
    success: true,
    complaintId: id,
    department: {
      departmentId: dept.id,
      departmentName: dept.name,
      departmentStatus: "Assigned",
      assignedAt,
      assignedBy: typeof assignedBy === "string" ? assignedBy : "System Dispatcher",
      departmentRemarks: typeof departmentRemarks === "string" ? departmentRemarks : null,
      estimatedResolutionTime: typeof estimatedResolutionTime === "string" ? estimatedResolutionTime : defaultEstimate,
    },
  });
});

// PATCH /api/complaints/:id/department-status
router.patch("/complaints/:id/department-status", (req, res) => {
  const { id } = req.params;
  const { departmentStatus, departmentRemarks, updatedBy } = req.body ?? {};

  if (!id || typeof id !== "string") {
    res.status(400).json({ error: "Invalid complaint ID." });
    return;
  }

  if (!departmentStatus || !VALID_STATUSES.has(departmentStatus)) {
    res.status(400).json({
      error: `Invalid departmentStatus. Must be one of: ${Array.from(VALID_STATUSES).join(", ")}`,
    });
    return;
  }

  res.json({
    success: true,
    complaintId: id,
    updatedStatus: departmentStatus,
    departmentRemarks: typeof departmentRemarks === "string" ? departmentRemarks : null,
    updatedBy: typeof updatedBy === "string" ? updatedBy : "Admin",
    updatedAt: new Date().toISOString(),
  });
});

export default router;
