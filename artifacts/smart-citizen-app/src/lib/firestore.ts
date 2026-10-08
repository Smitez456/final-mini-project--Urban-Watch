import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';

import { firebaseApp } from './firebase';
import { AI_ISSUE_CATEGORIES, type AiClassification } from './classification';
import type { StoredAlert, UserPreferences } from './alertTypes';

export const firestoreDb = getFirestore(firebaseApp);
const complaintsCollection = collection(firestoreDb, 'complaints');
const alertsCollection = collection(firestoreDb, 'alerts');

export const COMPLAINT_STATUSES = ['Submitted', 'Under Review', 'In Progress', 'Resolved'] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export type StoredComplaint = {
  complaintId: string;
  userId: string;
  userName: string;
  userEmail: string;
  issueType: string;
  description: string;
  priority: string;
  status: string;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  aiCategory: AiClassification['category'] | null;
  aiConfidence: number | null;
  aiReason: string | null;
  createdAt: Timestamp | null;
  title?: string;
  location?: string;
  // Feature 1: Department Assignment (safe defaults for old docs)
  departmentId?: string | null;
  departmentName?: string | null;
  departmentStatus?: string | null;
  assignedAt?: Timestamp | null;
  assignedBy?: string | null;
  departmentRemarks?: string | null;
  estimatedResolutionTime?: string | null;
  // Feature 2: Traffic Risk
  trafficRisk?: string | null;
  trafficAlertId?: string | null;
};

type NewComplaint = Omit<StoredComplaint, 'complaintId' | 'createdAt' | 'aiCategory' | 'aiConfidence' | 'aiReason'> & {
  aiCategory?: AiClassification['category'] | null;
  aiConfidence?: number | null;
  aiReason?: string | null;
};

function fromSnapshot(snapshot: { id: string; data: () => Record<string, unknown> | undefined }): StoredComplaint {
  const data = snapshot.data() ?? {};
  return {
    complaintId: typeof data.complaintId === 'string' ? data.complaintId : snapshot.id,
    userId: typeof data.userId === 'string' ? data.userId : '',
    userName: typeof data.userName === 'string' ? data.userName : '',
    userEmail: typeof data.userEmail === 'string' ? data.userEmail : '',
    issueType: typeof data.issueType === 'string' ? data.issueType : 'Civic issue',
    description: typeof data.description === 'string' ? data.description : '',
    priority: typeof data.priority === 'string' ? data.priority : 'Pending assignment',
    status: typeof data.status === 'string' ? data.status : 'Submitted',
    imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : null,
    latitude: typeof data.latitude === 'number' ? data.latitude : null,
    longitude: typeof data.longitude === 'number' ? data.longitude : null,
    aiCategory: AI_ISSUE_CATEGORIES.includes(data.aiCategory as AiClassification['category']) ? data.aiCategory as AiClassification['category'] : null,
    aiConfidence: typeof data.aiConfidence === 'number' && data.aiConfidence >= 0 && data.aiConfidence <= 1 ? data.aiConfidence : null,
    aiReason: typeof data.aiReason === 'string' ? data.aiReason : null,
    createdAt: data.createdAt as Timestamp | null,
    title: typeof data.title === 'string' ? data.title : undefined,
    location: typeof data.location === 'string' ? data.location : undefined,
    // New department fields — safe defaults for old documents
    departmentId: typeof data.departmentId === 'string' ? data.departmentId : null,
    departmentName: typeof data.departmentName === 'string' ? data.departmentName : null,
    departmentStatus: typeof data.departmentStatus === 'string' ? data.departmentStatus : null,
    assignedAt: (data.assignedAt as Timestamp | null) ?? null,
    assignedBy: typeof data.assignedBy === 'string' ? data.assignedBy : null,
    departmentRemarks: typeof data.departmentRemarks === 'string' ? data.departmentRemarks : null,
    estimatedResolutionTime: typeof data.estimatedResolutionTime === 'string' ? data.estimatedResolutionTime : null,
    // Traffic risk fields
    trafficRisk: typeof data.trafficRisk === 'string' ? data.trafficRisk : null,
    trafficAlertId: typeof data.trafficAlertId === 'string' ? data.trafficAlertId : null,
  };
}

function newComplaintId() {
  const suffix = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()
    : `${Date.now()}${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
  return `SC-${suffix}`;
}

export async function createComplaint(input: NewComplaint) {
  if (input.imageUrl !== null && !input.imageUrl.startsWith('https://')) {
    throw new Error('Complaint images must use a secure HTTPS URL.');
  }
  if (!isComplaintStatus(input.status)) {
    throw new Error('Complaint status must be one of the supported lifecycle statuses.');
  }
  if (input.aiCategory !== undefined && input.aiCategory !== null && !AI_ISSUE_CATEGORIES.includes(input.aiCategory)) {
    throw new Error('Complaint AI category is invalid.');
  }
  if (input.aiConfidence !== undefined && input.aiConfidence !== null && (!Number.isFinite(input.aiConfidence) || input.aiConfidence < 0 || input.aiConfidence > 1)) {
    throw new Error('Complaint AI confidence must be between 0 and 1.');
  }
  const complaintId = newComplaintId();
  await setDoc(doc(firestoreDb, 'complaints', complaintId), {
    ...input,
    complaintId,
    createdAt: serverTimestamp(),
  });
  return complaintId;
}

export async function updateComplaintStatus(complaintId: string, status: string) {
  if (!isComplaintStatus(status)) {
    throw new Error('Choose a valid complaint status.');
  }
  await updateDoc(doc(firestoreDb, 'complaints', complaintId), { status });
}

/** Admin: update department assignment */
export async function updateComplaintDepartment(
  complaintId: string,
  params: {
    departmentId: string;
    departmentName: string;
    departmentStatus: string;
    assignedBy: string;
    departmentRemarks?: string | null;
    estimatedResolutionTime?: string | null;
  },
) {
  await updateDoc(doc(firestoreDb, 'complaints', complaintId), {
    ...params,
    assignedAt: serverTimestamp(),
  });
}

/** Admin: update department status + remarks only */
export async function updateDepartmentStatus(
  complaintId: string,
  departmentStatus: string,
  departmentRemarks?: string | null,
) {
  const update: Record<string, unknown> = { departmentStatus };
  if (departmentRemarks !== undefined) update.departmentRemarks = departmentRemarks;
  await updateDoc(doc(firestoreDb, 'complaints', complaintId), update);
}

/** Admin: update traffic risk level */
export async function updateTrafficRisk(complaintId: string, trafficRisk: string | null) {
  await updateDoc(doc(firestoreDb, 'complaints', complaintId), { trafficRisk });
}

/** Admin: update traffic alert id link */
export async function setTrafficAlertId(complaintId: string, alertId: string | null) {
  await updateDoc(doc(firestoreDb, 'complaints', complaintId), { trafficAlertId: alertId });
}

export async function getComplaintsForUser(userId: string) {
  const snapshot = await getDocs(query(complaintsCollection, where('userId', '==', userId)));
  return snapshot.docs
    .map(fromSnapshot)
    .sort((a, b) => timestampMillis(b.createdAt) - timestampMillis(a.createdAt));
}

export async function getAllComplaints() {
  const snapshot = await getDocs(complaintsCollection);
  return snapshot.docs
    .map(fromSnapshot)
    .sort((a, b) => timestampMillis(b.createdAt) - timestampMillis(a.createdAt));
}

export async function getComplaint(complaintId: string) {
  const snapshot = await getDoc(doc(firestoreDb, 'complaints', complaintId));
  return snapshot.exists() ? fromSnapshot(snapshot) : null;
}

function timestampMillis(value: Timestamp | null) {
  return value && typeof value.toMillis === 'function' ? value.toMillis() : 0;
}

export function isComplaintStatus(value: string): value is ComplaintStatus {
  return COMPLAINT_STATUSES.includes(value as ComplaintStatus);
}

// ─── ALERTS COLLECTION ────────────────────────────────────────────────────────

function alertFromSnapshot(snapshot: { id: string; data: () => Record<string, unknown> | undefined }): StoredAlert {
  const d = snapshot.data() ?? {};
  return {
    alertId: typeof d.alertId === 'string' ? d.alertId : snapshot.id,
    userId: typeof d.userId === 'string' ? d.userId : null,
    type: (d.type as StoredAlert['type']) ?? 'CIVIC',
    title: typeof d.title === 'string' ? d.title : 'Alert',
    message: typeof d.message === 'string' ? d.message : '',
    severity: (d.severity as StoredAlert['severity']) ?? 'LOW',
    complaintId: typeof d.complaintId === 'string' ? d.complaintId : null,
    latitude: typeof d.latitude === 'number' ? d.latitude : null,
    longitude: typeof d.longitude === 'number' ? d.longitude : null,
    location: typeof d.location === 'string' ? d.location : null,
    radius: typeof d.radius === 'number' ? d.radius : null,
    createdAt: typeof d.createdAt === 'number' ? d.createdAt : Date.now(),
    expiresAt: typeof d.expiresAt === 'number' ? d.expiresAt : null,
    isRead: d.isRead === true,
    isActive: d.isActive !== false,
    trafficRisk: typeof d.trafficRisk === 'string' ? d.trafficRisk : null,
    issueType: typeof d.issueType === 'string' ? d.issueType : null,
  };
}

function newAlertId() {
  const suffix = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase()
    : `${Date.now()}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  return `ALT-${suffix}`;
}

export async function createAlert(
  input: Omit<StoredAlert, 'alertId' | 'isRead' | 'createdAt' | 'expiresAt'> & {
    createdAt?: number;
    expiresAt?: number | null;
  }
): Promise<string> {
  const alertId = newAlertId();
  await setDoc(doc(firestoreDb, 'alerts', alertId), {
    ...input,
    alertId,
    isRead: false,
    createdAt: input.createdAt ?? Date.now(),
  });
  return alertId;
}

/** Get active alerts for a user (their own + broadcast alerts with null userId) */
export async function getAlertsForUser(userId: string): Promise<StoredAlert[]> {
  const [userAlerts, broadcastAlerts] = await Promise.all([
    getDocs(query(alertsCollection, where('userId', '==', userId), where('isActive', '==', true))),
    getDocs(query(alertsCollection, where('userId', '==', null), where('isActive', '==', true))),
  ]);
  const all = [...userAlerts.docs, ...broadcastAlerts.docs].map(alertFromSnapshot);
  const seen = new Set<string>();
  return all.filter((a) => {
    if (seen.has(a.alertId)) return false;
    seen.add(a.alertId);
    // Filter expired
    if (a.expiresAt && a.expiresAt < Date.now()) return false;
    return true;
  }).sort((a, b) => b.createdAt - a.createdAt);
}

/** Get ALL active traffic/road/flood alerts (for the Traffic Alerts page) */
export async function getActiveTrafficAlerts(): Promise<StoredAlert[]> {
  const snapshot = await getDocs(query(alertsCollection, where('isActive', '==', true)));
  const now = Date.now();
  return snapshot.docs
    .map(alertFromSnapshot)
    .filter((a) => {
      if (a.expiresAt && a.expiresAt < now) return false;
      return a.type === 'TRAFFIC' || a.type === 'ROAD_HAZARD' || a.type === 'FLOOD' || a.type === 'HEAVY_RAIN';
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function markAlertRead(alertId: string) {
  await updateDoc(doc(firestoreDb, 'alerts', alertId), { isRead: true });
}

export async function markAllAlertsRead(userId: string) {
  const snapshot = await getDocs(
    query(alertsCollection, where('userId', '==', userId), where('isRead', '==', false)),
  );
  await Promise.all(snapshot.docs.map((d) => updateDoc(d.ref, { isRead: true })));
}

export async function deactivateAlertForComplaint(complaintId: string) {
  const snapshot = await getDocs(
    query(alertsCollection, where('complaintId', '==', complaintId), where('isActive', '==', true)),
  );
  await Promise.all(snapshot.docs.map((d) => updateDoc(d.ref, { isActive: false })));
}

/** Admin: toggle alert active status */
export async function setAlertActive(alertId: string, isActive: boolean) {
  await updateDoc(doc(firestoreDb, 'alerts', alertId), { isActive });
}

// ─── USER PREFERENCES ─────────────────────────────────────────────────────────

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  const snapshot = await getDoc(doc(firestoreDb, 'userPreferences', userId));
  if (!snapshot.exists()) {
    return {
      userId,
      civicAlerts: true,
      trafficAlerts: true,
      floodAlerts: true,
      rainAlerts: true,
      nearbyRadius: 1000,
      locationGranted: false,
    };
  }
  const d = snapshot.data();
  return {
    userId,
    civicAlerts: d.civicAlerts !== false,
    trafficAlerts: d.trafficAlerts !== false,
    floodAlerts: d.floodAlerts !== false,
    rainAlerts: d.rainAlerts !== false,
    nearbyRadius: typeof d.nearbyRadius === 'number' ? d.nearbyRadius : 1000,
    locationGranted: d.locationGranted === true,
  };
}

export async function saveUserPreferences(prefs: UserPreferences) {
  await setDoc(doc(firestoreDb, 'userPreferences', prefs.userId), prefs, { merge: true });
}