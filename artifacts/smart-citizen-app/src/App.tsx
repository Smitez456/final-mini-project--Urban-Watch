import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, type User } from 'firebase/auth';
import { ErrorBoundary } from '@/components/error-boundary';
import { firebaseAuth } from '@/lib/firebase';
import { COMPLAINT_STATUSES, createComplaint, getAllComplaints, getComplaint, getComplaintsForUser, isComplaintStatus, updateComplaintStatus, type ComplaintStatus, type StoredComplaint } from '@/lib/firestore';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { classifyImage, type AiClassification } from '@/lib/classification';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  ClipboardList,
  Clock3,
  FileText,
  Home,
  ImagePlus,
  Info,
  LocateFixed,
  LayoutDashboard,
  Lightbulb,
  ListFilter,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  UserRound,
  Upload,
  X,
  Car,
  AlertTriangle,
  Waves,
  ShieldAlert,
  Building2,
} from 'lucide-react';
import {
  Link,
  Route,
  Switch,
  useLocation,
  useParams,
  Router as WouterRouter,
} from 'wouter';
import { assignDepartment, DEPARTMENTS } from '@/lib/departmentConfig';
import { calculateTrafficRisk } from '@/lib/trafficRisk';
import { createAlert, getAlertsForUser } from '@/lib/firestore';
import { ComplaintTimeline } from '@/components/ComplaintTimeline';
import { WeatherAlertBanner } from '@/components/WeatherAlertBanner';
import { NearbyCivicAlerts } from '@/components/NearbyCivicAlerts';
import { NotificationPreferences } from '@/components/NotificationPreferences';
import { AdminDepartmentPanel } from '@/components/AdminDepartmentPanel';
import { DemoGuideModal } from '@/components/DemoGuideModal';
import { AlertsPage } from '@/pages/AlertsPage';
import { TrafficAlertsPage } from '@/pages/TrafficAlertsPage';
import type { StoredAlert } from '@/lib/alertTypes';

const queryClient = new QueryClient();
const CITIZEN_NAME_KEY = 'urbanwatch-citizen-name';

type CitizenUserContextValue = {
  name: string;
  email: string;
  user: User | null;
  authLoading: boolean;
  setName: (name: string) => void;
  logout: () => Promise<void>;
};

const CitizenUserContext = createContext<CitizenUserContextValue | null>(null);

function CitizenUserProvider({ children }: { children: ReactNode }) {
  const [name, setNameState] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      const nextName = nextUser?.displayName?.trim() ?? '';
      setNameState(nextName);
      if (nextName) {
        window.localStorage.setItem(CITIZEN_NAME_KEY, nextName);
      } else {
        window.localStorage.removeItem(CITIZEN_NAME_KEY);
      }
      setAuthLoading(false);
    });
  }, []);

  function setName(nextName: string) {
    const trimmedName = nextName.trim();
    setNameState(trimmedName);
    if (trimmedName) {
      window.localStorage.setItem(CITIZEN_NAME_KEY, trimmedName);
    } else {
      window.localStorage.removeItem(CITIZEN_NAME_KEY);
    }
  }

  async function logout() {
    setName('');
    await signOut(firebaseAuth);
  }

  return <CitizenUserContext.Provider value={{ name, email: user?.email ?? '', user, authLoading, setName, logout }}>{children}</CitizenUserContext.Provider>;
}

function useCitizenUser() {
  const context = useContext(CitizenUserContext);
  if (!context) throw new Error('useCitizenUser must be used inside CitizenUserProvider');
  return context;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'U';
}

type Status = ComplaintStatus;
type Complaint = {
  id: string;
  title: string;
  category: string;
  location: string;
  status: Status;
  date: string;
  description: string;
  updates: { date: string; title: string; detail: string; current?: boolean }[];
  color: string;
  priority?: string;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  userName?: string;
  userEmail?: string;
  aiCategory?: AiClassification['category'] | null;
  aiConfidence?: number | null;
  aiReason?: string | null;
  departmentId?: string | null;
  departmentName?: string | null;
  departmentStatus?: string | null;
  assignedAt?: string | null;
  assignedBy?: string | null;
  departmentRemarks?: string | null;
  estimatedResolutionTime?: string | null;
  trafficRisk?: string | null;
};

type GeoPoint = {
  latitude: number;
  longitude: number;
};

type ReportSubmitHandler = (event: FormEvent<HTMLFormElement>, imageFile: File | null) => void | Promise<void>;

function isValidGeoPoint(latitude: number, longitude: number): boolean {
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    && latitude >= -90 && latitude <= 90
    && longitude >= -180 && longitude <= 180;
}

function complaintHasGps(complaint: Complaint) {
  return complaint.latitude != null
    && complaint.longitude != null
    && isValidGeoPoint(complaint.latitude, complaint.longitude);
}

function getGeolocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return 'Location permission was denied. You can still enter the location manually.';
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return 'Your location is unavailable right now. Please check your device settings or enter it manually.';
  }
  if (error.code === error.TIMEOUT) {
    return 'Location lookup timed out. Please try again or enter the location manually.';
  }
  return 'We could not get your location. Please enter it manually.';
}

function OpenStreetMap({ point, className = '' }: { point: GeoPoint; className?: string }) {
  const delta = 0.015;
  const bbox = [
    point.longitude - delta,
    point.latitude - delta,
    point.longitude + delta,
    point.latitude + delta,
  ].join(',');
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${point.latitude}%2C${point.longitude}`;
  const largerMapUrl = `https://www.openstreetmap.org/?mlat=${point.latitude}&mlon=${point.longitude}#map=16/${point.latitude}/${point.longitude}`;

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-[#b8d0c9] bg-[#e7f3f0]', className)}>
      <iframe
        title={`OpenStreetMap location at ${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`}
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[220px] w-full border-0"
      />
      <div className="flex items-center justify-between gap-3 border-t border-[#c8d8d2] bg-[#f5faf6] px-3.5 py-2.5">
        <span className="text-[10px] font-semibold text-[#71807d]">
          {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}
        </span>
        <a href={largerMapUrl} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[#17675e] hover:underline">
          Open larger map
        </a>
      </div>
    </div>
  );
}

const complaints: Complaint[] = [
  {
    id: 'SC-1048',
    title: 'Streetlight out near Willow Park',
    category: 'Street lighting',
    location: 'Willow Park, North District',
    status: 'Under Review',
    date: '12 Jun 2024',
    description: 'The streetlight on the east path has been out for several nights. It makes the walk to the bus stop difficult after sunset.',
    color: 'teal',
    updates: [
      { date: '12 Jun', title: 'Report received', detail: 'Your report was sent to the Public Works team.' },
      { date: '13 Jun', title: 'Team assigned', detail: 'A field technician has been assigned to inspect the light.', current: true },
      { date: 'Expected 17 Jun', title: 'Repair visit', detail: 'The team will share an update after the site visit.' },
    ],
  },
  {
    id: 'SC-1039',
    title: 'Pothole on Cedar Avenue',
    category: 'Roads & sidewalks',
    location: 'Cedar Avenue, East Ward',
    status: 'Under Review',
    date: '10 Jun 2024',
    description: 'A deep pothole has opened in the right lane beside the community library. Drivers are swerving into oncoming traffic to avoid it.',
    color: 'coral',
    updates: [
      { date: '10 Jun', title: 'Report received', detail: 'Your report was sent to the Roads & Transport team.' },
      { date: '11 Jun', title: 'In review', detail: 'The team is checking the location and prioritising nearby repairs.', current: true },
      { date: 'Next', title: 'Site assessment', detail: 'A site assessment will be scheduled shortly.' },
    ],
  },
  {
    id: 'SC-1027',
    title: 'Overflowing recycling bins',
    category: 'Waste & recycling',
    location: 'Market Square, Central Ward',
    status: 'Resolved',
    date: '05 Jun 2024',
    description: 'The recycling bins beside Market Square were overflowing over the weekend and needed an extra collection.',
    color: 'amber',
    updates: [
      { date: '05 Jun', title: 'Report received', detail: 'Your report was sent to the Sanitation team.' },
      { date: '06 Jun', title: 'Collection scheduled', detail: 'An extra collection was added to the route.' },
      { date: '07 Jun', title: 'Resolved', detail: 'The bins were emptied and the area was cleaned.', current: true },
    ],
  },
  {
    id: 'SC-1012',
    title: 'Graffiti on the underpass wall',
    category: 'Public spaces',
    location: 'Harbour Road Underpass',
    status: 'Submitted',
    date: '02 Jun 2024',
    description: 'Fresh graffiti is visible on the south-facing wall of the underpass, close to the cycle route entrance.',
    color: 'indigo',
    updates: [
      { date: '02 Jun', title: 'Report received', detail: 'Your report was sent to the Public Spaces team.', current: true },
      { date: 'Next', title: 'Team review', detail: 'The team will review the report and confirm next steps.' },
    ],
  },
];

const categoryOptions = ['Pothole', 'Garbage/Waste', 'Damaged Streetlight', 'Water Leakage', 'Other/Unknown'];

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function complaintDate(createdAt: StoredComplaint['createdAt']) {
  if (!createdAt || typeof createdAt.toDate !== 'function') return 'Just now';
  return createdAt.toDate().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function complaintColor(issueType: string) {
  if (issueType.includes('Road')) return 'coral';
  if (issueType.includes('Waste')) return 'amber';
  if (issueType.includes('Park') || issueType.includes('Water')) return 'indigo';
  return 'teal';
}

function normalizedStatus(status: string): Status {
  if (isComplaintStatus(status)) return status;
  if (status === 'In review') return 'Under Review';
  if (status === 'Assigned') return 'In Progress';
  if (status === 'Received') return 'Submitted';
  return 'Submitted';
}

function complaintUpdates(status: Status, date: string) {
  const currentIndex = COMPLAINT_STATUSES.indexOf(status);
  const details = [
    'Your complaint was saved to the civic queue.',
    'The city team is reviewing the report and confirming next steps.',
    'The assigned team is working on the reported issue.',
    'The reported issue has been marked resolved.',
  ];
  return COMPLAINT_STATUSES.map((step, index) => ({
    date: index <= currentIndex ? date : 'Next',
    title: step,
    detail: details[index],
    current: index === currentIndex,
  }));
}

function toComplaint(record: StoredComplaint): Complaint {
  const status = normalizedStatus(record.status);
  const date = complaintDate(record.createdAt);
  return {
    id: record.complaintId,
    title: record.title || `${record.issueType} issue`,
    category: record.issueType,
    location: record.location || 'Location not provided',
    status,
    date,
    description: record.description,
    color: complaintColor(record.issueType),
    priority: record.priority,
    imageUrl: record.imageUrl,
    latitude: record.latitude,
    longitude: record.longitude,
    userName: record.userName,
    userEmail: record.userEmail,
    aiCategory: record.aiCategory,
    aiConfidence: record.aiConfidence,
    aiReason: record.aiReason,
    departmentId: record.departmentId ?? null,
    departmentName: record.departmentName ?? null,
    departmentStatus: record.departmentStatus ?? null,
    assignedAt: record.assignedAt ? complaintDate(record.assignedAt) : null,
    assignedBy: record.assignedBy ?? null,
    departmentRemarks: record.departmentRemarks ?? null,
    estimatedResolutionTime: record.estimatedResolutionTime ?? null,
    trafficRisk: record.trafficRisk ?? null,
    updates: complaintUpdates(status, date),
  };
}

function useFirestoreComplaints({ userId, all = false, enabled = true, refreshKey = 0 }: { userId?: string; all?: boolean; enabled?: boolean; refreshKey?: number }) {
  const [items, setItems] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    if (!enabled) return () => { active = false; };
    if (!all && !userId) {
      setItems([]);
      setLoading(false);
      return () => { active = false; };
    }

    setLoading(true);
    setError('');
    const load = all ? getAllComplaints() : getComplaintsForUser(userId!);
    load
      .then((records) => {
        if (active) setItems(records.map(toComplaint));
      })
      .catch(() => {
        if (active) setError('We could not load complaints from Firestore. Check the Firestore database and security rules, then try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [all, enabled, refreshKey, userId]);

  return { items, loading, error };
}

function useAdminAuthorization() {
  const { user } = useCitizenUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsAdmin(false);
    setAdminLoading(true);
    if (!user) {
      setAdminLoading(false);
      return () => { active = false; };
    }
    user.getIdTokenResult(true)
      .then(({ claims }) => {
        if (active) setIsAdmin(claims.admin === true || claims.role === 'admin');
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      })
      .finally(() => {
        if (active) setAdminLoading(false);
      });
    return () => { active = false; };
  }, [user]);

  return { isAdmin, adminLoading };
}

function ComplaintDataState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <Shell>
      <div className="min-h-[calc(100dvh-70px)] px-4 py-12 sm:px-7 sm:py-16 lg:px-10 flex items-center justify-center">
        <div className="mx-auto w-full max-w-[600px]">
          <div className="rounded-xl border-[3px] border-[#2c4950] bg-[#fffdf8] px-6 py-14 text-center coral-shadow animate-rise-in">
            <ClipboardList size={32} strokeWidth={2.5} className="mx-auto text-[#17675e]" />
            <h1 className="mt-5 font-mono text-2xl font-bold uppercase tracking-tight text-[#15353c]">{title}</h1>
            <p className="mx-auto mt-3 max-w-md text-sm font-medium text-[#52706d] text-balance">{message}</p>
            {action && <div className="mt-8 flex justify-center">{action}</div>}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const tones: Record<Status, string> = {
    Submitted: 'bg-[#e4dfd2] text-[#15353c] border-[#15353c]',
    'Under Review': 'bg-[#faedcf] text-[#99621b] border-[#99621b]',
    'In Progress': 'bg-[#d9eeea] text-[#17675e] border-[#17675e]',
    Resolved: 'bg-[#15353c] text-[#fffdf8] border-[#15353c]',
  };
  return (
    <span 
      data-testid={`status-${status.toLowerCase().replaceAll(' ', '-')}`} 
      className={cn('inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-[11px] font-bold uppercase tracking-wider', tones[status])}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function Logo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <Link href="/dashboard" data-testid="link-logo" className="flex items-center gap-2.5 group">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#ed735e] text-[#fffdf8] border-2 border-[#15353c] shadow-[2px_2px_0_#15353c] transition-transform group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0_#15353c]">
        <ShieldCheck size={22} strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className={cn('font-mono text-xl font-bold tracking-tight', inverse ? 'text-[#fffdf8]' : 'text-[#15353c]')}>
          URBAN<span className="text-[#ed735e]">WATCH</span>
        </span>
      )}
    </Link>
  );
}

function DemoPill({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="status-demo-mode"
      className="hidden sm:inline-flex items-center gap-1.5 rounded-md border-2 border-[#17675e] bg-[#d9eeea] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#17675e] hover:bg-[#c4e3dc] transition-colors cursor-pointer"
      title="Open 10-Step Evaluation & Demo Guide"
    >
      <span className="h-2 w-2 animate-pulse-civic rounded-full bg-[#ed735e]" />
      Live demo • Walkthrough
    </button>
  );
}

function getAuthErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/email-already-in-use': return 'An account with this email already exists. Try signing in instead.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password': return 'The email or password is incorrect.';
    case 'auth/invalid-email': return 'Enter a valid email address.';
    case 'auth/weak-password': return 'Choose a stronger password with at least 6 characters.';
    case 'auth/too-many-requests': return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed': return 'A network error interrupted the request. Check your connection and try again.';
    default: return 'We could not complete that request. Please try again.';
  }
}

function LogoutButton({ testId, className, onLoggedOut }: { testId: string; className: string; onLoggedOut?: () => void }) {
  const [, setLocation] = useLocation();
  const { logout } = useCitizenUser();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      onLoggedOut?.();
      setLocation('/login');
    } catch {
      setLoggingOut(false);
      window.alert('We could not log you out. Please try again.');
    }
  }

  return (
    <button type="button" disabled={loggingOut} onClick={handleLogout} data-testid={testId} className={cn(className, loggingOut && 'cursor-wait opacity-60')} aria-label="Logout">
      <LogOut size={18} strokeWidth={2.5} />
      <span className={cn("font-bold tracking-tight", className.includes('sr-only') ? 'sr-only' : '')}>{loggingOut ? 'Logging out' : 'Logout'}</span>
    </button>
  );
}

function CitizenBottomNav() {
  const [location] = useLocation();
  const items = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/complaints', label: 'Reports', icon: ClipboardList },
    { href: '/report', label: 'Add New', icon: Plus },
    { href: '/alerts', label: 'Alerts', icon: Bell },
    { href: '/profile', label: 'Profile', icon: UserRound },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-20 items-center justify-around border-t-2 border-[#15353c] bg-[#fffdf8] px-2 pb-safe pt-2 md:hidden">
      {items.map(({ href, label, icon: Icon }) => {
        const active = location === href || (href === '/complaints' && location.startsWith('/complaints/'));
        if (label === 'Add New') {
          return (
            <Link key={href} href={href} className="group relative -top-5 flex flex-col items-center gap-1">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#ed735e] text-[#fffdf8] border-2 border-[#15353c] shadow-[0_4px_0_#15353c] transition-transform active:translate-y-1 active:shadow-none">
                <Icon size={24} strokeWidth={3} />
              </span>
            </Link>
          );
        }
        return (
          <Link key={href} href={href} className={cn('flex flex-col items-center gap-1 px-3 py-2 transition-colors', active ? 'text-[#ed735e]' : 'text-[#52706d] hover:text-[#15353c]')}>
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Sidebar({ admin = false, mobileOpen, closeMobile }: { admin?: boolean; mobileOpen: boolean; closeMobile: () => void }) {
  const [location] = useLocation();
  const { name } = useCitizenUser();
  const initials = getInitials(name);
  const items = admin
    ? [
        { href: '/admin', label: 'Overview', icon: LayoutDashboard },
        { href: '/admin/reports', label: 'All reports', icon: ClipboardList },
        { href: '/traffic-alerts', label: 'Traffic Alerts', icon: Car },
        { href: '/alerts', label: 'Civic Alerts', icon: Bell },
        { href: '/dashboard', label: 'Citizen view', icon: Home },
        { href: '/login', label: 'Logout', icon: LogOut },
      ]
    : [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/report', label: 'Report Issue', icon: Plus },
        { href: '/complaints', label: 'My complaints', icon: ClipboardList },
        { href: '/traffic-alerts', label: 'Traffic Alerts', icon: Car },
        { href: '/alerts', label: 'Alerts', icon: Bell },
        { href: '/profile', label: 'Profile', icon: UserRound },
        { href: '/login', label: 'Logout', icon: LogOut },
      ];
      
  const sidebarClasses = admin
    ? "fixed inset-y-0 left-0 z-50 flex w-[260px] -translate-x-full flex-col border-r-2 border-[#15353c] bg-[#15353c] px-5 py-6 text-[#f8f5ed] transition-transform duration-200 md:translate-x-0"
    : "fixed inset-y-0 left-0 z-50 hidden w-[260px] flex-col border-r-2 border-[#15353c] bg-[#fffdf8] px-5 py-6 text-[#15353c] transition-transform duration-200 md:flex";

  return (
    <>
      {mobileOpen && admin && <button aria-label="Close navigation" data-testid="button-close-navigation" onClick={closeMobile} className="fixed inset-0 z-40 bg-[#15353c]/50 backdrop-blur-sm md:hidden" />}
      <aside className={cn(sidebarClasses, mobileOpen && admin && 'translate-x-0')}>
        <div className="flex items-center justify-between">
          <Logo />
          {admin && <button aria-label="Close navigation" data-testid="button-close-sidebar" onClick={closeMobile} className="rounded-lg p-2 hover:bg-[#2c4950] md:hidden"><X size={20} /></button>}
        </div>
        <div className={cn("mt-10 mb-4 px-2 text-[10px] font-bold uppercase tracking-widest", admin ? "text-[#ed735e]" : "text-[#17675e]")}>
          {admin ? 'Administration' : 'Citizen Menu'}
        </div>
        <nav className="space-y-2" aria-label="Primary navigation">
          {items.map(({ href, label, icon: Icon }) => {
             const active = label !== 'Logout' && (location === href || (href === '/complaints' && location.startsWith('/complaints/')));
             if (label === 'Logout') {
               return <LogoutButton key={href} testId="link-nav-logout" onLoggedOut={closeMobile} className={cn("group flex w-full items-center gap-4 rounded-xl border-2 border-transparent px-4 py-3 text-left font-bold transition-all", admin ? "text-[#b5c8c2] hover:bg-[#2c4950]" : "text-[#52706d] hover:bg-[#f8f5ed] hover:border-[#15353c]")} />;
             }
             return (
               <Link key={href} href={href} onClick={closeMobile} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`} className={cn('group flex items-center gap-4 rounded-xl border-2 px-4 py-3 font-bold transition-all', active ? (admin ? 'border-[#ed735e] bg-[#2c4950] text-[#fffdf8]' : 'border-[#15353c] bg-[#15353c] text-[#fffdf8] shadow-[4px_4px_0_#ed735e]') : (admin ? 'border-transparent text-[#b5c8c2] hover:bg-[#2c4950]' : 'border-transparent text-[#52706d] hover:bg-[#f8f5ed] hover:border-[#15353c]'))}>
                 <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                 <span>{label}</span>
                 {label === 'Report Issue' && <span className="ml-auto h-2 w-2 animate-pulse-civic rounded-full bg-[#ed735e]" />}
               </Link>
             );
          })}
        </nav>
        <div className="mt-auto pt-6 border-t-2 border-current opacity-20" />
        <div className="mt-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg border-2 border-[#15353c] bg-[#ed735e] text-sm font-bold text-[#fffdf8] shadow-[2px_2px_0_#15353c]">
              {initials}
            </span>
            <div>
              <p className="max-w-[130px] truncate text-sm font-bold leading-tight">{name || 'Citizen'}</p>
              <p className={cn("text-[10px] uppercase tracking-wider font-bold", admin ? "text-[#b5c8c2]" : "text-[#52706d]")}>{admin ? 'Admin' : 'Account'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ admin = false, openMobile, onOpenDemoGuide }: { admin?: boolean; openMobile: () => void; onOpenDemoGuide?: () => void }) {
  const [location] = useLocation();
  const { name } = useCitizenUser();
  const initials = getInitials(name);
  const pageLabel = admin
    ? (location === '/admin/reports' ? 'All reports' : location === '/traffic-alerts' ? 'Traffic Alerts' : location === '/alerts' ? 'Civic Alerts' : 'Overview')
    : location === '/profile'
    ? 'Profile'
    : location === '/report'
    ? 'Report Issue'
    : location === '/traffic-alerts'
    ? 'Traffic Alerts'
    : location === '/alerts'
    ? 'Civic Alerts'
    : location.startsWith('/complaints')
    ? 'My complaints'
    : 'Dashboard';
  
  return (
    <header className="sticky top-0 z-30 flex h-[80px] items-center justify-between border-b-2 border-[#15353c] bg-[#fffdf8] px-4 md:ml-[260px] md:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        {admin && (
          <button aria-label="Open navigation" data-testid="button-open-navigation" onClick={openMobile} className="rounded-lg border-2 border-[#15353c] p-2 text-[#15353c] hover:bg-[#f8f5ed] md:hidden">
            <Menu size={20} strokeWidth={2.5} />
          </button>
        )}
        {!admin && (
          <div className="md:hidden pt-2">
            <Logo compact />
          </div>
        )}
        <div className="hidden items-center gap-3 text-sm font-bold md:flex">
          <span className="uppercase tracking-widest text-[#15353c]">{admin ? 'Operations' : 'UrbanWatch'}</span>
          <span className="text-[#ed735e]">/</span>
          <span className="text-[#52706d]">{pageLabel}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <DemoPill onClick={onOpenDemoGuide} />
        <Link
          href="/alerts"
          data-testid="button-notifications"
          aria-label="Alerts"
          className="relative grid h-10 w-10 place-items-center rounded-lg border-2 border-[#15353c] bg-[#f8f5ed] text-[#15353c] transition-transform hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#15353c]"
        >
          <Bell size={18} strokeWidth={2.5} />
          <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse-civic rounded-full border-2 border-[#fffdf8] bg-[#ed735e]" />
        </Link>
        {!admin && (
          <div className="hidden md:flex items-center gap-3 border-l-2 border-[#15353c] pl-4">
             <span className="grid h-10 w-10 place-items-center rounded-lg border-2 border-[#15353c] bg-[#ed735e] text-sm font-bold text-[#fffdf8] shadow-[2px_2px_0_#15353c]">
               {initials}
             </span>
          </div>
        )}
      </div>
    </header>
  );
}

function Shell({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoGuideOpen, setDemoGuideOpen] = useState(false);
  return (
    <div className="min-h-[100dvh] bg-[#f8f5ed] font-sans selection:bg-[#ed735e] selection:text-white">
      <Sidebar admin={admin} mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} />
      <Topbar admin={admin} openMobile={() => setMobileOpen(true)} onOpenDemoGuide={() => setDemoGuideOpen(true)} />
      <main className={cn('min-h-[calc(100dvh-80px)] md:ml-[260px]', !admin && 'pb-24 md:pb-0')}>
        {children}
      </main>
      {!admin && <CitizenBottomNav />}
      <DemoGuideModal isOpen={demoGuideOpen} onClose={() => setDemoGuideOpen(false)} />
    </div>
  );
}

function PageHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end mb-8 animate-slide-in">
      <div>
        {eyebrow && <div className="mb-2 inline-block rounded bg-[#15353c] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#fffdf8]">{eyebrow}</div>}
        <h1 data-testid="text-page-title" className="font-mono text-3xl font-bold uppercase tracking-tight text-[#15353c] sm:text-4xl md:text-5xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}

function MetricCard({ label, value, note, icon: Icon, accent }: { label: string; value: string; note: string; icon: typeof TrendingUp; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-[#15353c] bg-[#fffdf8] p-5 shadow-[4px_4px_0_#15353c] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_#15353c]">
      <div className={cn('mb-4 grid h-12 w-12 place-items-center rounded-lg border-2 border-[#15353c]', accent)}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-[#52706d]">{label}</p>
      <p data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`} className="mt-1 font-mono text-4xl font-bold tracking-tight text-[#15353c]">{value}</p>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#b54c3c]">{note}</p>
    </div>
  );
}

function InteractiveComplaintCard({ complaint, compact = false }: { complaint: Complaint; compact?: boolean }) {
  return (
    <Link 
      href={`/complaints/${complaint.id}`} 
      data-testid={`card-complaint-${complaint.id}`} 
      aria-label={`View details for ${complaint.title}`} 
      className={cn('group block rounded-xl border-2 border-[#15353c] bg-[#fffdf8] p-5 shadow-[4px_4px_0_#15353c] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_#ed735e]', compact ? 'sm:p-5' : 'p-6')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-lg border-2 border-[#15353c]', complaint.color === 'teal' && 'bg-[#17675e] text-white', complaint.color === 'coral' && 'bg-[#ed735e] text-white', complaint.color === 'amber' && 'bg-[#facc15] text-[#15353c]', complaint.color === 'indigo' && 'bg-[#4f46e5] text-white')}>
          <Tag size={20} strokeWidth={2.5} />
        </div>
        <StatusBadge status={complaint.status} />
      </div>
      <div className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 data-testid={`text-complaint-title-${complaint.id}`} className="font-mono text-lg font-bold uppercase leading-tight tracking-tight text-[#15353c] group-hover:text-[#ed735e]">{complaint.title}</h3>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#52706d]"><MapPin size={14} strokeWidth={2.5} className="text-[#17675e]" />{complaint.location}</p>
        <p className="mt-3 line-clamp-2 text-sm font-medium leading-relaxed text-[#52706d]">{complaint.description}</p>
      </div>
      <div className="mt-5 flex items-center justify-between border-t-2 border-[#e4dfd2] pt-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#15353c]">{complaint.id} <span className="text-[#ed735e]">/</span> {complaint.date}</span>
        <span data-testid={`link-view-details-${complaint.id}`} className="flex items-center gap-1.5 rounded bg-[#15353c] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#fffdf8] group-hover:bg-[#ed735e]">View <ArrowRight size={14} /></span>
      </div>
    </Link>
  );
}

function ComplaintCard({ complaint, compact = false }: { complaint: Complaint; compact?: boolean }) {
  const hasGps = complaint.latitude != null && complaint.longitude != null && isValidGeoPoint(complaint.latitude, complaint.longitude);
  return (
    <div className="relative group flex flex-col h-full animate-rise-in">
      <InteractiveComplaintCard complaint={complaint} compact={compact} />
      {complaint.imageUrl && (
        <a href={`/complaints/${complaint.id}`} data-testid={`image-complaint-card-${complaint.id}`} aria-label={`View image for ${complaint.title}`} className="mt-3 block overflow-hidden rounded-xl border-2 border-[#15353c] bg-[#fffdf8] shadow-[2px_2px_0_#15353c] transition-transform hover:-translate-y-0.5">
          <img src={complaint.imageUrl} alt="" className={cn('w-full object-cover', compact ? 'h-32' : 'h-40')} />
        </a>
      )}
    </div>
  );
}

function ComplaintStatusTimeline({ status }: { status: Status }) {
  const currentIndex = COMPLAINT_STATUSES.indexOf(status);
  return (
    <div data-testid="status-timeline" className="mt-8">
      {COMPLAINT_STATUSES.map((step, index) => { 
        const complete = index < currentIndex; 
        const current = index === currentIndex; 
        return (
          <div key={step} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <span data-testid={`timeline-step-${step.toLowerCase().replaceAll(' ', '-')}`} className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2 font-bold transition-all', current ? 'bg-[#ed735e] border-[#15353c] text-white shadow-[2px_2px_0_#15353c] scale-110' : complete ? 'bg-[#15353c] border-[#15353c] text-white' : 'bg-[#fffdf8] border-[#e4dfd2] text-[#9ba5a1]')}>
                {complete ? <Check size={18} strokeWidth={3} /> : index + 1}
              </span>
              {index < COMPLAINT_STATUSES.length - 1 && <span className={cn('my-2 w-1 grow transition-colors', index < currentIndex ? 'bg-[#15353c]' : 'bg-[#e4dfd2]')} />}
            </div>
            <div className="pb-8 pt-1">
              <p className={cn('font-mono text-sm font-bold uppercase tracking-tight', current ? 'text-[#ed735e]' : complete ? 'text-[#15353c]' : 'text-[#9ba5a1]')}>{step}</p>
              <p className="mt-1 text-xs font-medium text-[#52706d]">{current ? 'Current Status' : complete ? 'Completed' : 'Pending'}</p>
            </div>
          </div>
        ); 
      })}
    </div>
  );
}

function Dashboard() {
  const { name, user, authLoading } = useCitizenUser();
  const { items: complaints, loading, error } = useFirestoreComplaints({ userId: user?.uid, enabled: !authLoading });
  const [userAlerts, setUserAlerts] = useState<StoredAlert[]>([]);
  const [userGeo, setUserGeo] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      getAlertsForUser(user.uid).then(setUserAlerts).catch(() => setUserAlerts([]));
    }
  }, [user?.uid]);

  function handleRequestLocation() {
    if (!('geolocation' in navigator)) {
      setLocationDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserGeo({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocationDenied(false);
      },
      () => setLocationDenied(true),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }
  
  if (authLoading || loading) return <ComplaintDataState title="Syncing City Pulse" message="Connecting to civic database..." />;
  if (!user) return <ComplaintDataState title="Identify Yourself" message="Sign in to view your civic actions." action={<Link href="/login" className="rounded-xl border-2 border-[#15353c] bg-[#ed735e] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#fffdf8] shadow-[4px_4px_0_#15353c] hover:-translate-y-0.5">Login</Link>} />;
  if (error) return <ComplaintDataState title="Connection Error" message={error} action={<Link href="/dashboard" className="rounded-xl border-2 border-[#15353c] bg-[#fffdf8] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#15353c] shadow-[4px_4px_0_#15353c]">Retry</Link>} />;
  
  if (complaints.length === 0) return (
    <ComplaintDataState 
      title="No Civic Actions Yet" 
      message="Your voice shapes where you live. Start by reporting a local issue." 
      action={<Link href="/report" className="flex items-center gap-2 rounded-xl border-2 border-[#15353c] bg-[#ed735e] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#fffdf8] shadow-[4px_4px_0_#15353c] hover:-translate-y-0.5"><Plus size={18} strokeWidth={2.5}/> Report Issue</Link>} 
    />
  );
  
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter((c) => c.status === 'Under Review' || c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;
  const activeAlertsCount = userAlerts.filter((a) => a.isActive).length;

  return (
    <Shell>
      <div className="civic-grid min-h-[calc(100dvh-80px)] px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-[1200px] space-y-8">
          
          {/* Active Alerts Announcement Banner */}
          {activeAlertsCount > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border-[3px] border-[#15353c] bg-[#faedcf] p-4 shadow-[4px_4px_0_#15353c]">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-[#99621b] text-white">
                  <Bell size={16} strokeWidth={2.5} />
                </span>
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-[#15353c]">
                    🚨 {activeAlertsCount} Active Civic Advisory Alert{activeAlertsCount > 1 ? 's' : ''} in Your Region
                  </p>
                  <p className="text-[11px] text-[#52706d]">
                    Monitored hazards include high-risk potholes, road disruptions, and localized rain/flooding.
                  </p>
                </div>
              </div>
              <Link
                href="/alerts"
                className="shrink-0 rounded border-2 border-[#15353c] bg-[#15353c] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#ed735e] transition-colors"
              >
                Inspect Alerts
              </Link>
            </div>
          )}

          {/* Hero Section */}
          <div className="animate-rise-in relative flex flex-col justify-between gap-8 rounded-2xl border-[3px] border-[#15353c] bg-[#fffdf8] p-8 shadow-[8px_8px_0_#15353c] lg:flex-row lg:items-center overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full border-4 border-[#ed735e] opacity-10 animate-pulse-civic pointer-events-none" />
            <div className="relative z-10 max-w-[600px]">
              <div className="mb-4 inline-flex items-center gap-2 rounded border-2 border-[#15353c] bg-[#d9eeea] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#15353c]">
                <Sparkles size={14} strokeWidth={2.5} /> Welcome, {name || 'Citizen'}
              </div>
              <h1 data-testid="text-dashboard-welcome" className="font-mono text-4xl font-bold uppercase leading-[0.95] tracking-tighter text-[#15353c] sm:text-6xl">
                Small Actions.<br />
                <span className="text-[#ed735e]">Real Impact.</span>
              </h1>
              <p className="mt-5 max-w-[480px] text-base font-medium leading-relaxed text-[#52706d]">
                You are the pulse of the city. Report local issues, track progress, and hold teams accountable.
              </p>
            </div>
            <Link 
              href="/report" 
              data-testid="link-report-hero" 
              className="relative z-10 group flex shrink-0 items-center justify-between gap-6 rounded-xl border-[3px] border-[#15353c] bg-[#ed735e] px-6 py-5 shadow-[6px_6px_0_#15353c] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_#15353c] sm:w-[260px]"
            >
              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#15353c]">Take Action</span>
                <span className="font-mono text-lg font-bold uppercase tracking-tight text-[#fffdf8]">Report Issue</span>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-lg border-2 border-[#15353c] bg-[#fffdf8] text-[#15353c] group-hover:bg-[#15353c] group-hover:text-[#fffdf8] transition-colors">
                <Plus size={22} strokeWidth={3} />
              </span>
            </Link>
          </div>

          {/* Feature 4: Live Meteorological Watch & Evaluation Simulator */}
          <WeatherAlertBanner latitude={userGeo?.latitude} longitude={userGeo?.longitude} />

          {/* Feature 3: Proximity Hazard Radar */}
          <NearbyCivicAlerts
            userLocation={userGeo}
            locationPermissionDenied={locationDenied}
            onRequestLocation={handleRequestLocation}
            alerts={userAlerts}
          />

          {/* Metrics */}
          <div className="grid gap-5 sm:grid-cols-3">
            <MetricCard label="Total Impact" value={totalComplaints.toString().padStart(2, '0')} note="Reports submitted" icon={ClipboardList} accent="bg-[#d9eeea] text-[#17675e]" />
            <MetricCard label="In Motion" value={pendingComplaints.toString().padStart(2, '0')} note="Awaiting resolution" icon={Clock3} accent="bg-[#faedcf] text-[#99621b]" />
            <MetricCard label="Resolved" value={resolvedComplaints.toString().padStart(2, '0')} note="Completed actions" icon={Check} accent="bg-[#ed735e] border-[#15353c] text-white" />
          </div>

          {/* Activity */}
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <section className="animate-rise-in delay-2">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Activity</p>
                  <h2 className="mt-1 font-mono text-2xl font-bold uppercase tracking-tight text-[#15353c]">Recent Reports</h2>
                </div>
                <Link href="/complaints" data-testid="link-view-all-complaints" className="group flex items-center gap-1.5 border-b-2 border-[#15353c] pb-0.5 text-xs font-bold uppercase tracking-widest text-[#15353c] transition-colors hover:text-[#ed735e] hover:border-[#ed735e]">
                  View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {complaints.slice(0, 4).map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} compact />
                ))}
              </div>
            </section>
            
            <aside className="animate-rise-in delay-3">
              <div className="rounded-xl border-[3px] border-[#15353c] bg-[#15353c] p-6 text-[#fffdf8] shadow-[6px_6px_0_#ed735e]">
                <div className="flex items-center gap-3 border-b-2 border-[#2c4950] pb-4">
                  <Lightbulb size={24} className="text-[#ed735e]" strokeWidth={2.5}/>
                  <h2 className="font-mono text-xl font-bold uppercase tracking-tight">How It Works</h2>
                </div>
                <div className="mt-6 space-y-6">
                  {[
                    ['01', 'Report', 'Pin a location, describe the issue, snap a photo.'], 
                    ['02', 'Analyze', 'Our AI tags it. City teams verify and assign.'], 
                    ['03', 'Resolve', 'Track progress until the work is done.']
                  ].map(([num, title, detail]) => (
                    <div key={num} className="flex gap-4">
                      <span className="font-mono text-xl font-bold text-[#ed735e]">{num}</span>
                      <div>
                        <p className="font-bold uppercase tracking-widest">{title}</p>
                        <p className="mt-1 text-xs font-medium text-[#b5c8c2]">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Complaints() {
  const { user, authLoading } = useCitizenUser();
  const { items: complaints, loading, error } = useFirestoreComplaints({ userId: user?.uid, enabled: !authLoading });
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All statuses');
  const filtered = useMemo(() => complaints.filter((item) => (filter === 'All statuses' || item.status === filter) && `${item.title} ${item.location} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [complaints, query, filter]);
  
  if (authLoading || loading) return <ComplaintDataState title="Loading Logs" message="Retrieving your reports from the database." />;
  if (!user) return <ComplaintDataState title="Access Denied" message="Please sign in to view your reports." action={<Link href="/login" className="rounded-xl border-2 border-[#15353c] bg-[#ed735e] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#fffdf8] shadow-[4px_4px_0_#15353c]">Login</Link>} />;
  if (error) return <ComplaintDataState title="Error Loading" message={error} action={<Link href="/complaints" className="rounded-xl border-2 border-[#15353c] bg-[#fffdf8] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#15353c]">Retry</Link>} />;
  
  return (
    <Shell>
      <div className="civic-dot-grid min-h-[calc(100dvh-80px)] px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-[1080px]">
          <PageHeading eyebrow="Log" title="My Reports">
            <Link href="/report" data-testid="link-report-from-complaints" className="flex items-center gap-2 rounded-xl border-[3px] border-[#15353c] bg-[#ed735e] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#fffdf8] shadow-[4px_4px_0_#15353c] transition-transform hover:-translate-y-1">
              <Plus size={18} strokeWidth={2.5}/> New Report
            </Link>
          </PageHeading>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#15353c]" strokeWidth={2.5}/>
              <input 
                data-testid="input-search-complaints" 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Search reports..." 
                className="h-14 w-full rounded-xl border-2 border-[#15353c] bg-[#fffdf8] pl-12 pr-4 text-sm font-bold text-[#15353c] placeholder-[#9ba5a1] shadow-[2px_2px_0_#15353c] outline-none focus:border-[#ed735e] focus:shadow-[4px_4px_0_#ed735e] transition-all" 
              />
            </div>
            <div className="relative sm:w-64">
              <ListFilter size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#15353c]" strokeWidth={2.5}/>
              <select 
                data-testid="select-complaint-status" 
                value={filter} 
                onChange={(event) => setFilter(event.target.value)} 
                className="h-14 w-full appearance-none rounded-xl border-2 border-[#15353c] bg-[#fffdf8] pl-12 pr-10 text-xs font-bold uppercase tracking-widest text-[#15353c] shadow-[2px_2px_0_#15353c] outline-none focus:border-[#ed735e] focus:shadow-[4px_4px_0_#ed735e] transition-all cursor-pointer"
              >
                <option>All statuses</option>
                {COMPLAINT_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
              <ChevronDown size={20} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#15353c]" strokeWidth={2.5}/>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between border-b-2 border-[#15353c] pb-2">
            <p data-testid="text-complaint-count" className="text-xs font-bold uppercase tracking-widest text-[#15353c]">
              {filtered.length} {filtered.length === 1 ? 'Result' : 'Results'}
            </p>
          </div>

          {filtered.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((complaint, index) => (
                <div key={complaint.id} className={cn('animate-rise-in', `delay-${Math.min(index + 1, 5)}`)}>
                  <ComplaintCard complaint={complaint} />
                </div>
              ))}
            </div>
          ) : (
            <div data-testid="empty-complaints" className="mt-8 rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] px-6 py-16 text-center shadow-[6px_6px_0_#15353c]">
              <Search size={40} strokeWidth={2} className="mx-auto text-[#ed735e]" />
              <h2 className="mt-4 font-mono text-2xl font-bold uppercase tracking-tight text-[#15353c]">No Reports Found</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-[#52706d]">Adjust your search or status filter to see more results.</p>
              <button data-testid="button-clear-complaint-filters" onClick={() => { setQuery(''); setFilter('All statuses'); }} className="mt-6 inline-flex items-center gap-2 rounded bg-[#15353c] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#fffdf8] hover:bg-[#ed735e] transition-colors">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

function FirestoreComplaintDetailsPage({ complaint, onBack, isAdmin = false, onStatusChange, statusUpdating = false, statusError = '' }: { complaint: Complaint; onBack: () => void; isAdmin?: boolean; onStatusChange?: (status: string) => void; statusUpdating?: boolean; statusError?: string }) {
  const point = complaint.latitude != null && complaint.longitude != null && isValidGeoPoint(complaint.latitude, complaint.longitude)
    ? { latitude: complaint.latitude, longitude: complaint.longitude } : null;

  return (
    <Shell admin={isAdmin}>
      <div className="civic-dot-grid min-h-[calc(100dvh-80px)] px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-[1100px]">
          <button data-testid="button-back-complaints" onClick={onBack} className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#15353c] hover:text-[#ed735e] transition-colors">
            <ChevronLeft size={18} strokeWidth={2.5} /> {isAdmin ? 'Back to Queue' : 'Back to Log'}
          </button>
          
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <article className="animate-rise-in rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-6 shadow-[8px_8px_0_#15353c] sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-[#15353c] pb-6">
                <div>
                  <div className="mb-3 inline-block bg-[#15353c] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#fffdf8]">
                    {complaint.id} <span className="text-[#ed735e]">/</span> {complaint.category}
                  </div>
                  <h1 data-testid="text-complaint-detail-title" className="font-mono text-3xl font-bold uppercase leading-tight tracking-tight text-[#15353c] sm:text-4xl">
                    {complaint.title}
                  </h1>
                </div>
                <div className="flex flex-col sm:items-end gap-3 shrink-0">
                  <StatusBadge status={complaint.status} />
                  {isAdmin && onStatusChange && (
                    <div className="mt-2 w-full sm:w-auto">
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#15353c]">Update Status</label>
                      <select aria-label={`Change status for ${complaint.id}`} data-testid="select-admin-detail-status" value={complaint.status} disabled={statusUpdating} onChange={(event) => onStatusChange(event.target.value)} className="w-full h-10 rounded border-2 border-[#15353c] bg-[#fffdf8] px-3 text-xs font-bold uppercase tracking-wider text-[#15353c] shadow-[2px_2px_0_#15353c] outline-none focus:border-[#ed735e] disabled:opacity-50 cursor-pointer">
                        {COMPLAINT_STATUSES.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              {statusError && <p role="alert" data-testid="status-admin-detail-update-error" className="mt-6 border-2 border-[#b54c3c] bg-[#fff1ed] p-4 text-xs font-bold text-[#b54c3c]">{statusError}</p>}
              
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 border-b-2 border-[#15353c] pb-6">
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">ID</p><p data-testid="text-complaint-id" className="mt-1 font-mono text-sm font-bold text-[#15353c]">{complaint.id}</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">Type</p><p data-testid="text-complaint-issue-type" className="mt-1 font-mono text-sm font-bold text-[#15353c]">{complaint.category}</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">Priority</p><p className="mt-1 font-mono text-sm font-bold text-[#15353c]">{complaint.priority || 'Pending'}</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">Date</p><p className="mt-1 font-mono text-sm font-bold text-[#15353c]">{complaint.date}</p></div>
              </div>

              {/* Feature 1 & 2: Department Routing & Safety Assessment */}
              <div className="mt-6 rounded-xl border-2 border-[#15353c] bg-[#f8f5ed] p-5 shadow-[4px_4px_0_#15353c]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">
                  Department Routing & Safety Assessment
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">
                      Assigned Department
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold text-[#17675e]">
                      {complaint.departmentName || 'Public Works Department'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">
                      Department Status
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold text-[#15353c]">
                      {complaint.departmentStatus || 'Assigned'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">
                      Traffic / Road Risk
                    </p>
                    <div className="mt-1">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                          complaint.trafficRisk === 'Critical'
                            ? 'bg-red-600 text-white'
                            : complaint.trafficRisk === 'High'
                            ? 'bg-orange-500 text-white'
                            : complaint.trafficRisk === 'Medium'
                            ? 'bg-amber-400 text-black'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {complaint.trafficRisk || 'Low'} Risk
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">
                      Resolution ETA
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold text-[#15353c]">
                      {complaint.estimatedResolutionTime || '48 Hours'}
                    </p>
                  </div>
                </div>

                {complaint.departmentRemarks && (
                  <div className="mt-4 border-t border-[#15353c]/20 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">
                      Official Remarks:
                    </p>
                    <p className="mt-1 text-xs italic text-[#15353c]">{complaint.departmentRemarks}</p>
                  </div>
                )}
              </div>

              {isAdmin && (
                <section className="mt-8 border-2 border-[#15353c] bg-[#f8f5ed] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Citizen Intel</p>
                  <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div><dt className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">Name</dt><dd data-testid="text-admin-citizen-name" className="mt-1 font-bold text-[#15353c]">{complaint.userName || 'Not provided'}</dd></div>
                    <div><dt className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">Email</dt><dd data-testid="text-admin-citizen-email" className="mt-1 font-bold text-[#15353c]">{complaint.userEmail || 'Not provided'}</dd></div>
                  </dl>
                </section>
              )}

              <section className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Analysis</p>
                {complaint.aiCategory && complaint.aiConfidence != null ? (
                  <div data-testid="status-complaint-ai-analysis" className="mt-3 flex flex-col sm:flex-row gap-4 border-2 border-[#15353c] bg-[#15353c] p-5 text-[#fffdf8]">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Detection</p>
                      <p className="mt-1 font-mono text-lg font-bold uppercase tracking-tight">{complaint.aiCategory}</p>
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#b5c8c2]">Reasoning</p>
                      <p className="mt-1 text-xs font-medium text-[#f8f5ed]">{complaint.aiReason}</p>
                    </div>
                    <div className="sm:border-l-2 border-[#2c4950] sm:pl-4 sm:w-32 flex flex-col justify-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">Confidence</p>
                      <p className="mt-1 font-mono text-3xl font-bold text-[#ed735e]">{Math.round(complaint.aiConfidence * 100)}%</p>
                    </div>
                  </div>
                ) : (
                  <div data-testid="status-complaint-no-ai" className="mt-3 border-2 border-dashed border-[#15353c] p-5 text-center font-bold uppercase tracking-widest text-[#52706d] text-[10px]">No AI analysis available</div>
                )}
              </section>

              <section className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Description</p>
                <p data-testid="text-complaint-description" className="mt-3 text-sm font-medium leading-relaxed text-[#15353c] border-l-4 border-[#ed735e] pl-4">{complaint.description}</p>
              </section>

              <section className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Evidence</p>
                {complaint.imageUrl ? (
                  <a href={complaint.imageUrl} target="_blank" rel="noreferrer" data-testid="link-complaint-image" className="group mt-3 block overflow-hidden border-2 border-[#15353c] shadow-[4px_4px_0_#15353c] transition-transform hover:-translate-y-1">
                    <img src={complaint.imageUrl} alt="Evidence" data-testid="image-complaint" className="max-h-[400px] w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="block border-t-2 border-[#15353c] bg-[#15353c] px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-[#fffdf8]">View Full Resolution</span>
                  </a>
                ) : (
                  <div data-testid="status-complaint-no-image" className="mt-3 border-2 border-dashed border-[#15353c] p-10 text-center font-bold uppercase tracking-widest text-[#52706d] text-[10px]">No visual evidence attached</div>
                )}
              </section>

              <section className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Location</p>
                <div className="mt-3 border-2 border-[#15353c] bg-[#f8f5ed] p-4 shadow-[4px_4px_0_#15353c]">
                  <div className="flex items-center gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#15353c] text-[#fffdf8]"><MapPin size={20} strokeWidth={2.5} /></span>
                    <div>
                      <p className="font-mono text-sm font-bold text-[#15353c]">{complaint.location}</p>
                      <p data-testid="status-complaint-gps" className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#52706d]">{point ? `GPS ${point.latitude.toFixed(4)}, ${point.longitude.toFixed(4)}` : 'Manual Entry'}</p>
                    </div>
                  </div>
                </div>
                {point && <div className="mt-4 border-2 border-[#15353c] shadow-[4px_4px_0_#15353c]"><OpenStreetMap point={point} /></div>}
              </section>
            </article>
            
            <aside className="space-y-6 animate-rise-in delay-1">
              <section className="rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-6 shadow-[6px_6px_0_#15353c]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Workflow</p>
                <h2 className="mt-1 font-mono text-xl font-bold uppercase tracking-tight text-[#15353c]">Lifecycle Timeline</h2>
                <ComplaintTimeline
                  complaintStatus={complaint.status}
                  departmentStatus={complaint.departmentStatus}
                  departmentName={complaint.departmentName}
                  submittedAt={complaint.date}
                  assignedAt={complaint.assignedAt}
                  aiCategory={complaint.aiCategory}
                />
              </section>

              {isAdmin && (
                <AdminDepartmentPanel
                  complaintId={complaint.id}
                  currentDepartmentId={complaint.departmentId}
                  currentDepartmentName={complaint.departmentName}
                  currentDepartmentStatus={complaint.departmentStatus}
                  currentRemarks={complaint.departmentRemarks}
                  currentTrafficRisk={complaint.trafficRisk}
                  assignedAt={complaint.assignedAt}
                  assignedBy={complaint.assignedBy}
                  estimatedResolutionTime={complaint.estimatedResolutionTime}
                  onUpdated={() => window.location.reload()}
                />
              )}

              <section className="rounded-xl border-[3px] border-[#15353c] bg-[#17675e] p-6 text-[#fffdf8] shadow-[6px_6px_0_#15353c]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#d9eeea]">Verification</p>
                <h2 className="mt-2 font-mono text-xl font-bold uppercase tracking-tight">Secured Data</h2>
                <p className="mt-3 text-xs font-medium leading-relaxed text-[#d9eeea]">This report is securely recorded in the civic database. Immutable and traceable.</p>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ReportLocationField() {
  const [point, setPoint] = useState<GeoPoint | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  function requestCurrentLocation() {
    setLocationError('');
    if (!('geolocation' in navigator)) {
      setLocationError('Browser does not support GPS.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        if (!isValidGeoPoint(latitude, longitude)) {
          setLocationError('Invalid coordinates received.');
          setLocating(false);
          return;
        }
        setPoint({ latitude, longitude });
        setLocating(false);
      },
      (error) => {
        setLocationError(getGeolocationErrorMessage(error));
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Location</span>
        <span className="h-0.5 flex-1 bg-[#15353c]" />
      </div>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-[#15353c]">Where is it? <span className="text-[#ed735e]">*</span></span>
        <div className="relative mt-2">
          <MapPin size={20} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#15353c]" />
          <input required data-testid="input-report-location" placeholder="Address or landmark..." className="h-14 w-full rounded border-2 border-[#15353c] bg-[#fffdf8] pl-12 pr-4 text-sm font-bold text-[#15353c] placeholder-[#9ba5a1] outline-none focus:border-[#ed735e] focus:shadow-[4px_4px_0_#ed735e] transition-all" />
        </div>
      </label>
      <div className="mt-4 border-2 border-[#15353c] bg-[#f8f5ed] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#15353c]"><LocateFixed size={16} strokeWidth={2.5} className="text-[#ed735e]" /> Verify via GPS</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#52706d]">Optional accuracy boost</p>
          </div>
          <button type="button" data-testid="button-use-current-location" onClick={requestCurrentLocation} disabled={locating} className="inline-flex shrink-0 items-center justify-center gap-2 rounded bg-[#15353c] px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#fffdf8] shadow-[2px_2px_0_#ed735e] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-50">
            <LocateFixed size={16} strokeWidth={2.5} />
            {locating ? 'Scanning...' : point ? 'Refresh GPS' : 'Get Location'}
          </button>
        </div>
        {point && <p data-testid="status-location-success" className="mt-4 inline-block bg-[#17675e] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#fffdf8]">Coordinates: {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}</p>}
        {locationError && <p role="alert" data-testid="status-location-error" className="mt-4 inline-block border-2 border-[#b54c3c] bg-[#fff1ed] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#b54c3c]">{locationError}</p>}
      </div>
      {point && <div className="mt-4 border-2 border-[#15353c]"><OpenStreetMap point={point} /></div>}
      <input type="hidden" data-testid="input-report-latitude" value={point?.latitude ?? ''} readOnly />
      <input type="hidden" data-testid="input-report-longitude" value={point?.longitude ?? ''} readOnly />
    </section>
  );
}

function GpsReportForm({ onSubmit, aiResult, aiAnalyzing, aiError, onImageSelected }: { onSubmit: ReportSubmitHandler; aiResult: AiClassification | null; aiAnalyzing: boolean; aiError: string; onImageSelected: (file: File | null) => void }) {
  const [selectedImage, setSelectedImage] = useState<{ name: string; url: string; file: File } | null>(null);
  const [category, setCategory] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => { if (selectedImage?.url) URL.revokeObjectURL(selectedImage.url); };
  }, [selectedImage?.url]);

  function selectImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedImage({ name: file.name, url: URL.createObjectURL(file), file });
    setCategory('');
    onImageSelected(file);
    event.target.value = '';
  }

  function removeImage() {
    setSelectedImage(null);
    setCategory('');
    onImageSelected(null);
    inputRef.current?.focus();
  }

  useEffect(() => { if (aiResult && !category) setCategory(aiResult.category); }, [aiResult, category]);

  return (
    <Shell>
      <div className="civic-grid min-h-[calc(100dvh-80px)] px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-[1100px]">
          <PageHeading eyebrow="Action" title="Report Issue">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#15353c]">
              <span className="grid h-8 w-8 place-items-center rounded bg-[#15353c] text-white">1</span>
              <span className="hidden sm:inline">Details</span>
              <span className="h-0.5 w-6 bg-[#15353c]" />
              <span className="grid h-8 w-8 place-items-center rounded border-2 border-[#15353c] bg-[#fffdf8]">2</span>
              <span className="hidden sm:inline">Submit</span>
            </div>
          </PageHeading>
          
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <form onSubmit={(event) => onSubmit(event, selectedImage?.file ?? null)} className="animate-rise-in rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-6 shadow-[8px_8px_0_#15353c] sm:p-10">
              <div className="mb-8 border-b-2 border-[#15353c] pb-6">
                <h2 className="font-mono text-2xl font-bold uppercase tracking-tight text-[#15353c]">Incident Report</h2>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#52706d]">Log the details for immediate processing.</p>
              </div>
              
              <div className="space-y-10">
                <section>
                  <div className="mb-4 flex items-center gap-3"><span className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Basics</span><span className="h-0.5 flex-1 bg-[#15353c]" /></div>
                  <div className="space-y-6">
                    <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#15353c]">Title <span className="text-[#ed735e]">*</span></span><input required data-testid="input-report-title" placeholder="Short, descriptive title..." className="mt-2 h-14 w-full rounded border-2 border-[#15353c] bg-[#fffdf8] px-4 text-sm font-bold text-[#15353c] placeholder-[#9ba5a1] outline-none focus:border-[#ed735e] focus:shadow-[4px_4px_0_#ed735e] transition-all" /></label>
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#15353c]">Category <span className="text-[#ed735e]">*</span></span>
                      <select value={category} onChange={(event) => setCategory(event.target.value)} data-testid="select-report-category" className="mt-2 h-14 w-full rounded border-2 border-[#15353c] bg-[#fffdf8] px-4 text-sm font-bold uppercase tracking-wider text-[#15353c] outline-none focus:border-[#ed735e] focus:shadow-[4px_4px_0_#ed735e] transition-all cursor-pointer">
                        <option value="">Select Category</option>
                        {categoryOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </label>
                    
                    {aiAnalyzing && <div data-testid="status-ai-analyzing" className="border-2 border-[#15353c] bg-[#15353c] p-4 text-[#fffdf8] animate-pulse"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Sparkles size={16} className="text-[#ed735e]" /> Processing Image...</p></div>}
                    {aiResult && <div data-testid="status-ai-result" className="border-2 border-[#15353c] bg-[#d9eeea] p-5 shadow-[4px_4px_0_#15353c]"><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#15353c]"><Sparkles size={16} className="text-[#ed735e]" /> AI Inference</p><p data-testid="text-ai-category" className="mt-2 font-mono text-2xl font-bold uppercase tracking-tight text-[#15353c]">{aiResult.category}</p><p data-testid="text-ai-confidence" className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#17675e]">Confidence: {Math.round(aiResult.confidence * 100)}%</p><p data-testid="text-ai-reason" className="mt-3 border-t-2 border-[#15353c] pt-3 text-xs font-medium text-[#15353c]">{aiResult.reason}</p></div>}
                    {aiError && <div role="alert" data-testid="status-ai-error" className="border-2 border-[#b54c3c] bg-[#fff1ed] p-4"><p className="text-xs font-bold uppercase tracking-widest text-[#b54c3c]">Inference Failed</p><p className="mt-1 text-xs font-medium text-[#b54c3c]">{aiError}</p></div>}
                    
                    <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#15353c]">Description <span className="text-[#ed735e]">*</span></span><textarea required data-testid="textarea-report-description" rows={5} placeholder="Provide necessary details..." className="mt-2 w-full resize-none rounded border-2 border-[#15353c] bg-[#fffdf8] p-4 text-sm font-medium text-[#15353c] placeholder-[#9ba5a1] outline-none focus:border-[#ed735e] focus:shadow-[4px_4px_0_#ed735e] transition-all" /></label>
                  </div>
                </section>
                
                <ReportLocationField />
                
                <section>
                  <div className="mb-4 flex items-center gap-3"><span className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Visuals</span><span className="h-0.5 flex-1 bg-[#15353c]" /></div>
                  {selectedImage ? (
                    <div data-testid="image-preview-card" className="border-2 border-[#15353c] bg-[#f8f5ed] p-4 shadow-[4px_4px_0_#15353c]">
                      <div className="flex flex-col sm:flex-row gap-5">
                        <div className="h-32 w-full sm:w-40 shrink-0 border-2 border-[#15353c]"><img src={selectedImage.url} alt="Selected" className="h-full w-full object-cover" /></div>
                        <div className="flex flex-col justify-center">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">Ready to upload</p>
                          <p data-testid="text-selected-filename" className="mt-1 font-mono text-sm font-bold text-[#15353c] truncate">{selectedImage.name}</p>
                          <div className="mt-4 flex gap-3">
                            <button type="button" data-testid="button-replace-image" onClick={() => inputRef.current?.click()} className="border-b-2 border-[#15353c] pb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#15353c] hover:text-[#ed735e] hover:border-[#ed735e]">Replace</button>
                            <button type="button" data-testid="button-remove-image" onClick={removeImage} className="border-b-2 border-[#b54c3c] pb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#b54c3c] hover:text-[#15353c] hover:border-[#15353c]">Remove</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button type="button" data-testid="label-upload-photo" onClick={() => inputRef.current?.click()} className="w-full group flex flex-col items-center justify-center border-2 border-dashed border-[#15353c] bg-[#fffdf8] py-12 transition-colors hover:bg-[#f8f5ed] hover:border-solid hover:shadow-[4px_4px_0_#15353c]">
                      <ImagePlus size={32} strokeWidth={2} className="text-[#15353c] group-hover:text-[#ed735e] transition-colors" />
                      <p className="mt-4 font-mono text-sm font-bold uppercase tracking-tight text-[#15353c]">Attach Evidence</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#52706d]">JPG, PNG / Max 10MB</p>
                    </button>
                  )}
                  <input ref={inputRef} id="report-photo-input" data-testid="input-report-photo" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={selectImage} />
                </section>
              </div>
              
              <div className="mt-10 flex flex-col-reverse sm:flex-row gap-4 border-t-2 border-[#15353c] pt-6">
                <Link href="/dashboard" data-testid="link-cancel-report" className="flex items-center justify-center rounded border-2 border-[#15353c] bg-[#fffdf8] px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#15353c] hover:bg-[#f8f5ed]">Cancel</Link>
                <button type="submit" disabled={aiAnalyzing} data-testid="button-submit-report" className="flex flex-1 items-center justify-center gap-3 rounded border-2 border-[#15353c] bg-[#ed735e] px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#fffdf8] shadow-[4px_4px_0_#15353c] transition-transform hover:-translate-y-1 active:translate-y-0 active:shadow-none disabled:opacity-50">
                  {selectedImage && !aiResult && !aiError ? 'Analyze & Submit' : 'Submit Report'} <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </form>
            
            <aside className="space-y-6 animate-rise-in delay-1">
              <div className="rounded-xl border-[3px] border-[#15353c] bg-[#15353c] p-6 text-[#fffdf8] shadow-[6px_6px_0_#ed735e]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Protocol</p>
                <h2 className="mt-1 font-mono text-xl font-bold uppercase tracking-tight">Accuracy Matters</h2>
                <ul className="mt-5 space-y-4 text-xs font-medium">
                  <li className="flex gap-3"><Check size={16} className="shrink-0 text-[#ed735e]" strokeWidth={3}/> One issue per report.</li>
                  <li className="flex gap-3"><Check size={16} className="shrink-0 text-[#ed735e]" strokeWidth={3}/> Use precise locations.</li>
                  <li className="flex gap-3"><Check size={16} className="shrink-0 text-[#ed735e]" strokeWidth={3}/> No sensitive personal info.</li>
                </ul>
              </div>
              <div className="rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-6 shadow-[6px_6px_0_#15353c]">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#15353c]"><ShieldCheck size={18} strokeWidth={2.5}/> Secure Upload</p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#52706d] leading-relaxed">Media is processed securely via Cloudinary and stored immutably in Firestore.</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function EnhancedReportForm({ onSubmit, aiResult = null, aiAnalyzing = false, aiError = '', onImageSelected = () => undefined }: { onSubmit: ReportSubmitHandler; aiResult?: AiClassification | null; aiAnalyzing?: boolean; aiError?: string; onImageSelected?: (file: File | null) => void }) {
  return <GpsReportForm onSubmit={onSubmit} aiResult={aiResult} aiAnalyzing={aiAnalyzing} aiError={aiError} onImageSelected={onImageSelected} />;
}

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] bg-[#f8f5ed] font-sans">
      <div className="hidden w-1/2 flex-col justify-between border-r-[3px] border-[#15353c] bg-[#15353c] p-12 text-[#fffdf8] lg:flex relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] rounded-full border-[10px] border-[#ed735e] opacity-10 animate-pulse-civic pointer-events-none" />
        <Logo inverse />
        <div className="max-w-[440px] z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded bg-[#ed735e] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#15353c]">
            <ShieldCheck size={14} strokeWidth={3} /> Secure Civic Platform
          </div>
          <h1 className="font-mono text-5xl font-bold uppercase leading-[0.9] tracking-tighter text-[#fffdf8]">
            Your Voice.<br />
            <span className="text-[#ed735e]">Your City.</span>
          </h1>
          <p className="mt-6 text-base font-medium leading-relaxed text-[#b5c8c2]">
            Report issues, demand action, and track progress. Direct to the teams that matter.
          </p>
        </div>
        <p className="z-10 text-[10px] font-bold uppercase tracking-widest text-[#7d9892]">Firebase-protected citizen access</p>
      </div>
      <div className="flex flex-1 items-center justify-center bg-[#fffdf8] px-6 py-12 civic-dot-grid relative">
        <div className="w-full max-w-[440px] animate-rise-in">
          <div className="mb-10 lg:hidden flex justify-center"><Logo /></div>
          {children}
        </div>
      </div>
    </div>
  );
}

function Login() {
  const [, setLocation] = useLocation();
  const { user, authLoading } = useCitizenUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!authLoading && user) setLocation('/dashboard'); }, [authLoading, setLocation, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      setLocation('/dashboard');
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="rounded-2xl border-[3px] border-[#15353c] bg-[#fffdf8] p-8 shadow-[8px_8px_0_#15353c]">
        <h1 data-testid="text-login-title" className="font-mono text-3xl font-bold uppercase tracking-tight text-[#15353c]">Access Point</h1>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#52706d]">Identify to continue.</p>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-[#15353c]">Email Address</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-login-email" placeholder="citizen@example.com" autoComplete="email" className="mt-2 h-14 w-full rounded border-2 border-[#15353c] bg-[#f8f5ed] px-4 text-sm font-bold text-[#15353c] outline-none focus:border-[#ed735e] focus:shadow-[4px_4px_0_#ed735e] transition-all" />
          </label>
          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#15353c]">Password</span>
            </div>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="input-login-password" placeholder="••••••••" autoComplete="current-password" className="mt-2 h-14 w-full rounded border-2 border-[#15353c] bg-[#f8f5ed] px-4 text-sm font-bold text-[#15353c] outline-none focus:border-[#ed735e] focus:shadow-[4px_4px_0_#ed735e] transition-all" />
          </label>
          {error && <p role="alert" data-testid="status-login-error" className="border-2 border-[#b54c3c] bg-[#fff1ed] p-3 text-xs font-bold text-[#b54c3c]">{error}</p>}
          <button type="submit" disabled={submitting} data-testid="button-login-submit" className="flex h-14 w-full items-center justify-center gap-3 rounded border-2 border-[#15353c] bg-[#ed735e] text-sm font-bold uppercase tracking-widest text-[#fffdf8] shadow-[4px_4px_0_#15353c] transition-transform hover:-translate-y-1 active:translate-y-0 active:shadow-none disabled:opacity-50">
            {submitting ? 'Authenticating...' : 'Authenticate'} <LogIn size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>
      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#15353c]">New Citizen? <Link href="/register" data-testid="link-register" className="text-[#ed735e] border-b-2 border-[#ed735e] pb-0.5 hover:text-[#15353c] hover:border-[#15353c] transition-colors">Register</Link></p>
      </div>
    </AuthLayout>
  );
}

function Register() {
  const [, setLocation] = useLocation();
  const { setName } = useCitizenUser();
  const [enteredName, setEnteredName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const trimmedName = enteredName.trim();
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    
    setSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      await updateProfile(credential.user, { displayName: trimmedName });
      setName(trimmedName);
      setLocation('/dashboard');
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="rounded-2xl border-[3px] border-[#15353c] bg-[#fffdf8] p-8 shadow-[8px_8px_0_#15353c]">
        <h1 data-testid="text-register-title" className="font-mono text-3xl font-bold uppercase tracking-tight text-[#15353c]">Enroll</h1>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#52706d]">Join the civic network.</p>
        
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#15353c]">Full Name</span><input required value={enteredName} onChange={(e) => setEnteredName(e.target.value)} data-testid="input-register-name" placeholder="Jane Doe" autoComplete="name" className="mt-2 h-14 w-full rounded border-2 border-[#15353c] bg-[#f8f5ed] px-4 text-sm font-bold text-[#15353c] outline-none focus:border-[#ed735e] focus:shadow-[4px_4px_0_#ed735e] transition-all" /></label>
          <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#15353c]">Email Address</span><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-register-email" placeholder="citizen@example.com" autoComplete="email" className="mt-2 h-14 w-full rounded border-2 border-[#15353c] bg-[#f8f5ed] px-4 text-sm font-bold text-[#15353c] outline-none focus:border-[#ed735e] focus:shadow-[4px_4px_0_#ed735e] transition-all" /></label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#15353c]">Password</span><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="input-register-password" placeholder="••••••••" autoComplete="new-password" className="mt-2 h-14 w-full rounded border-2 border-[#15353c] bg-[#f8f5ed] px-4 text-sm font-bold text-[#15353c] outline-none focus:border-[#ed735e] focus:shadow-[4px_4px_0_#ed735e] transition-all" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#15353c]">Confirm</span><input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} data-testid="input-register-confirm-password" placeholder="••••••••" autoComplete="new-password" className="mt-2 h-14 w-full rounded border-2 border-[#15353c] bg-[#f8f5ed] px-4 text-sm font-bold text-[#15353c] outline-none focus:border-[#ed735e] focus:shadow-[4px_4px_0_#ed735e] transition-all" /></label>
          </div>
          {error && <p role="alert" data-testid="status-register-error" className="border-2 border-[#b54c3c] bg-[#fff1ed] p-3 text-xs font-bold text-[#b54c3c]">{error}</p>}
          <button type="submit" disabled={submitting} data-testid="button-register-submit" className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded border-2 border-[#15353c] bg-[#ed735e] text-sm font-bold uppercase tracking-widest text-[#fffdf8] shadow-[4px_4px_0_#15353c] transition-transform hover:-translate-y-1 active:translate-y-0 active:shadow-none disabled:opacity-50">
            {submitting ? 'Registering...' : 'Register'} <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>
      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#15353c]">Already Enrolled? <Link href="/login" data-testid="link-login" className="text-[#ed735e] border-b-2 border-[#ed735e] pb-0.5 hover:text-[#15353c] hover:border-[#15353c] transition-colors">Authenticate</Link></p>
      </div>
    </AuthLayout>
  );
}



function Profile() {
  const { name, email, user } = useCitizenUser();
  const initials = getInitials(name);
  return (
    <Shell>
      <div className="civic-dot-grid min-h-[calc(100dvh-80px)] px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-[1000px]">
          <PageHeading eyebrow="Identity" title="Citizen Profile">
            <LogoutButton testId="link-profile-logout" className="flex items-center justify-center gap-2 rounded border-2 border-[#15353c] bg-[#fffdf8] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#15353c] hover:bg-[#ed735e] hover:text-[#fffdf8] hover:shadow-[4px_4px_0_#15353c] transition-all" />
          </PageHeading>
          
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8 animate-rise-in">
              <section className="rounded-xl border-[3px] border-[#15353c] bg-[#fffdf8] p-6 shadow-[8px_8px_0_#15353c] sm:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b-2 border-[#15353c] pb-8">
                  <span className="grid h-24 w-24 shrink-0 place-items-center rounded border-4 border-[#15353c] bg-[#ed735e] font-mono text-4xl font-bold text-[#fffdf8] shadow-[4px_4px_0_#15353c]">{initials}</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Verified Citizen</p>
                    <h2 className="mt-2 font-mono text-3xl font-bold uppercase tracking-tight text-[#15353c]">{name || 'Your Profile'}</h2>
                    <p className="mt-2 text-sm font-bold tracking-wider text-[#52706d]">{email || 'No email provided'}</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-mono text-xl font-bold uppercase tracking-tight text-[#15353c]">Account Details</h3>
                  <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div className="rounded border-2 border-[#15353c] p-4 bg-[#f8f5ed]">
                      <dt className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">Platform Role</dt>
                      <dd className="mt-2 font-mono text-sm font-bold text-[#15353c]">Resident</dd>
                    </div>
                    <div className="rounded border-2 border-[#15353c] p-4 bg-[#f8f5ed]">
                      <dt className="text-[10px] font-bold uppercase tracking-widest text-[#52706d]">Status</dt>
                      <dd className="mt-2 font-mono text-sm font-bold text-[#15353c] text-[#17675e]">Active & Verified</dd>
                    </div>
                  </dl>
                </div>
              </section>

              {/* Feature 3: Notification and Proximity Radius Preferences */}
              <NotificationPreferences userId={user?.uid ?? 'guest'} />
            </div>
            
            <aside className="animate-rise-in delay-1 flex flex-col gap-6">
              <div className="rounded-xl border-[3px] border-[#15353c] bg-[#15353c] p-6 text-[#fffdf8] shadow-[6px_6px_0_#ed735e]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ed735e]">Civic Impact</p>
                <h2 className="mt-2 font-mono text-xl font-bold uppercase tracking-tight">Your Pulse</h2>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded border-2 border-[#2c4950] p-4">
                    <p className="font-mono text-3xl font-bold">4</p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#b5c8c2]">Reports</p>
                  </div>
                  <div className="rounded border-2 border-[#ed735e] p-4 bg-[#ed735e]">
                    <p className="font-mono text-3xl font-bold text-[#15353c]">1</p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#15353c]">Resolved</p>
                  </div>
                </div>
                <p className="mt-6 text-xs font-medium leading-relaxed text-[#b5c8c2]">Ensure your details are current so city teams can reach out if needed.</p>
                <Link href="/complaints" data-testid="link-profile-complaints" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ed735e] hover:text-[#fffdf8] transition-colors">View Activity <ArrowRight size={16} strokeWidth={2.5} /></Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Shell>
  );
}


function ComplaintDetailsView() {
  const params = useParams<{ id: string }>();
  const [location, setLocation] = useLocation();
  const { user, authLoading } = useCitizenUser();
  const { isAdmin, adminLoading } = useAdminAuthorization();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState('');

  useEffect(() => {
    let active = true;
    if (authLoading || adminLoading) return () => { active = false; };
    if (!user) {
      setComplaint(null);
      setLoading(false);
      return () => { active = false; };
    }
    setLoading(true);
    setError('');
    getComplaint(params.id!)
      .then((record) => {
        if (active) setComplaint(record && (isAdmin || record.userId === user.uid) ? toComplaint(record) : null);
      })
      .catch(() => {
        if (active) setError('We could not load this complaint from the database.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [adminLoading, authLoading, isAdmin, params.id, user]);

  async function changeStatus(nextStatus: string) {
    if (!isAdmin || statusUpdating) return;
    if (!isComplaintStatus(nextStatus)) {
      setStatusError('Invalid status.');
      return;
    }
    setStatusUpdating(true);
    setStatusError('');
    try {
      await updateComplaintStatus(params.id!, nextStatus);
      setComplaint((current) => current ? {
        ...current,
        status: nextStatus,
        updates: complaintUpdates(nextStatus, current.date),
      } : current);
    } catch (caughtError) {
      setStatusError(caughtError instanceof Error ? caughtError.message : 'Could not update status.');
    } finally {
      setStatusUpdating(false);
    }
  }

  if (authLoading || adminLoading || loading) return <ComplaintDataState title="Retrieving Intel" message="Fetching data..." />;
  if (!user) return <ComplaintDataState title="Access Denied" message="Must be signed in." action={<Link href="/login" className="rounded border-2 border-[#15353c] bg-[#ed735e] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#fffdf8]">Login</Link>} />;
  if (error) return <ComplaintDataState title="Error" message={error} action={<Link href="/complaints" className="rounded border-2 border-[#15353c] bg-[#fffdf8] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#15353c]">Back</Link>} />;
  if (!complaint) return <ComplaintDataState title="Not Found" message="Record missing or restricted." action={<Link href="/complaints" className="rounded border-2 border-[#15353c] bg-[#fffdf8] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#15353c]">Back</Link>} />;
  
  const priority = complaint.priority || 'Pending';
  return <FirestoreComplaintDetailsPage complaint={{ ...complaint, priority }} isAdmin={isAdmin} onStatusChange={changeStatus} statusUpdating={statusUpdating} statusError={statusError} onBack={() => setLocation(isAdmin ? '/admin/reports' : '/complaints')} />;
}

function ComplaintDetails() {
  return <ComplaintDetailsView />;
}

function FirestoreReport() {
  const { user, authLoading } = useCitizenUser();
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AiClassification | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiError, setAiError] = useState('');

  function handleImageSelected() {
    setUploadedImageUrl(null);
    setAiResult(null);
    setAiError('');
    setError('');
  }

  async function submit(event: FormEvent<HTMLFormElement>, imageFile: File | null) {
    event.preventDefault();
    if (saving || aiAnalyzing) return;
    if (!user) {
      setError('Must be signed in to submit.');
      return;
    }
    const form = event.currentTarget;
    const value = (selector: string) => (form.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)?.value.trim() || '';
    const coordinateValue = (selector: string) => {
      const raw = value(selector);
      if (!raw) return null;
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : null;
    };
    
    const latitude = coordinateValue('[data-testid="input-report-latitude"]');
    const longitude = coordinateValue('[data-testid="input-report-longitude"]');
    if ((latitude == null) !== (longitude == null) || (latitude != null && longitude != null && !isValidGeoPoint(latitude, longitude))) {
      setError('Invalid GPS coordinates. Please refresh location.');
      return;
    }
    const issueType = value('[data-testid="select-report-category"]');

    let imageUrl = uploadedImageUrl;
    if (imageFile && !imageUrl) {
      setSaving(true);
      setError('');
      setAiError('');
      try {
        const firebaseIdToken = await user.getIdToken();
        imageUrl = await uploadImageToCloudinary(imageFile, firebaseIdToken);
        setUploadedImageUrl(imageUrl);
        setAiAnalyzing(true);
        try {
          const result = await classifyImage(imageUrl, firebaseIdToken);
          setAiResult(result);
        } catch (classificationError) {
          setAiError(classificationError instanceof Error ? classificationError.message : 'AI classification failed.');
        } finally {
          setAiAnalyzing(false);
          setSaving(false);
        }
        return; 
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
        setSaving(false);
        return;
      }
    }

    if (!issueType) {
      setError('Please select a category.');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const assignedDept = assignDepartment(issueType, aiResult?.category, 'High', { latitude, longitude });
      const initialTrafficRisk = calculateTrafficRisk({
        issueType,
        priority: 'High',
        aiCategory: aiResult?.category,
        description: value('[data-testid="textarea-report-description"]'),
      });

      const complaintId = await createComplaint({
        userId: user.uid,
        userName: user.displayName || '',
        userEmail: user.email || '',
        title: value('[data-testid="input-report-title"]'),
        issueType,
        description: value('[data-testid="textarea-report-description"]'),
        location: value('[data-testid="input-report-location"]'),
        latitude,
        longitude,
        imageUrl: imageUrl || null,
        priority: 'High',
        status: 'Submitted',
        aiCategory: aiResult?.category || null,
        aiConfidence: aiResult?.confidence || null,
        aiReason: aiResult?.reason || null,
        departmentId: assignedDept.id,
        departmentName: assignedDept.name,
        departmentStatus: 'Assigned',
        assignedBy: 'AI Auto-Dispatcher',
        trafficRisk: initialTrafficRisk,
        estimatedResolutionTime: `${assignedDept.slaHours} Hours`,
      });

      // Feature 2: Auto-generate traffic alert if issue is High or Critical traffic risk
      if (initialTrafficRisk === 'High' || initialTrafficRisk === 'Critical') {
        try {
          await createAlert({
            userId: user.uid,
            type: 'TRAFFIC',
            title: `🚨 ${initialTrafficRisk}-Risk Hazard: ${issueType}`,
            message: `Road hazard reported at ${value('[data-testid="input-report-location"]')}. Risk level: ${initialTrafficRisk}. Caution advised.`,
            severity: initialTrafficRisk.toUpperCase() as any,
            complaintId,
            latitude,
            longitude,
            location: value('[data-testid="input-report-location"]'),
            radius: initialTrafficRisk === 'Critical' ? 2000 : 1000,
            isActive: true,
            trafficRisk: initialTrafficRisk,
            issueType,
          });
        } catch (alertErr) {
          console.warn('Could not auto-generate traffic alert:', alertErr);
        }
      }

      setLocation('/complaints');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Submit failed.');
      setSaving(false);
    }
  }

  if (authLoading) return <ComplaintDataState title="Authenticating" message="Verifying session..." />;
  if (!user) return <ComplaintDataState title="Access Denied" message="Must be signed in to submit reports." action={<Link href="/login" className="rounded border-2 border-[#15353c] bg-[#ed735e] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#fffdf8]">Login</Link>} />;
  if (saving) return <ComplaintDataState title="Transmitting" message="Submitting report securely..." />;
  if (error) return <ComplaintDataState title="Transmission Failed" message={error} action={<button onClick={() => setError('')} className="rounded border-2 border-[#15353c] bg-[#fffdf8] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#15353c]">Back</button>} />;

  return <EnhancedReportForm onSubmit={submit} aiResult={aiResult} aiAnalyzing={aiAnalyzing} aiError={aiError} onImageSelected={handleImageSelected} />;
}

function AdminReportRow({ complaint, updatingId = '', onStatusChange }: { complaint: Complaint; updatingId?: string; onStatusChange?: (complaintId: string, status: string) => void }) {
  const hasGps = complaintHasGps(complaint);
  const deptName = complaint.departmentName || 'Public Works Department';
  const risk = complaint.trafficRisk || 'Low';
  const isHighRisk = risk === 'High' || risk === 'Critical';

  return (
    <div data-testid={`row-admin-report-${complaint.id}`} className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center">
      <Link href={`/complaints/${complaint.id}`} className="group flex min-w-0 flex-1 items-start gap-3">
        {complaint.imageUrl ? (
          <img src={complaint.imageUrl} alt="" className="h-16 w-20 shrink-0 rounded-xl border border-[#d7e2dd] bg-[#f5faf6] object-cover" />
        ) : (
          <span className="grid h-16 w-20 shrink-0 place-items-center rounded-xl border border-dashed border-[#b8d0c9] bg-[#f5faf6] text-[#8b9895]">
            <ImagePlus size={18} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-xs font-bold text-[#35575a] group-hover:text-[#17675e]">{complaint.title}</p>
            <StatusBadge status={complaint.status} />
            {isHighRisk && (
              <span className="rounded bg-[#b54c3c] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                🚨 {risk} Risk
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-[10px] text-[#8b9895]">
            {complaint.id} · {complaint.category} · <strong className="text-[#17675e]">{deptName}</strong>
          </p>
          <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-[#71807d]">
            <MapPin size={11} />{complaint.location}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-[.08em]">
            <span className={cn('rounded-full px-2 py-1', hasGps ? 'bg-[#d9eeea] text-[#17675e]' : 'bg-[#f0ece2] text-[#8b9895]')}>
              {hasGps ? 'GPS available' : 'No GPS'}
            </span>
            <span className="rounded-full bg-[#faedcf] px-2 py-1 text-[#99621b]">
              {deptName}
            </span>
            <span className={cn('rounded-full px-2 py-1', risk === 'Critical' ? 'bg-[#fbe1d9] text-[#b54c3c]' : risk === 'High' ? 'bg-[#faedcf] text-[#99621b]' : 'bg-[#e4e6f3] text-[#46517f]')}>
              {risk} Risk
            </span>
            {complaint.aiCategory && (
              <span className="rounded-full bg-[#e7e9f4] px-2 py-1 text-[#46517f]">AI: {complaint.aiCategory}</span>
            )}
          </div>
        </div>
        <span className="hidden shrink-0 text-[10px] text-[#9ba5a1] sm:block">{complaint.date}</span>
        <ChevronDown size={15} className="-rotate-90 text-[#9ba5a1]" />
      </Link>
      {onStatusChange && (
        <label className="shrink-0 text-[10px] font-bold uppercase tracking-[.1em] text-[#8b9895]">
          <span className="sr-only">Change status for {complaint.id}</span>
          <select
            aria-label={`Change status for ${complaint.id}`}
            data-testid={`select-admin-status-${complaint.id}`}
            value={complaint.status}
            disabled={updatingId === complaint.id}
            onChange={(event) => onStatusChange(complaint.id, event.target.value)}
            className="h-10 w-full rounded-xl border border-[#b8d0c9] bg-[#f5faf6] px-3 text-xs font-bold normal-case tracking-normal text-[#35575a] outline-none focus:border-[#69a99e] focus:ring-2 focus:ring-[#d9eeea] disabled:cursor-wait disabled:opacity-60 lg:w-auto cursor-pointer"
          >
            {COMPLAINT_STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
      )}
    </div>
  );
}

function AdminReportsContent({ complaints, activeTab, setActiveTab, updatingId, statusError, onStatusChange }: { complaints: Complaint[]; activeTab: string; setActiveTab: (tab: string) => void; updatingId: string; statusError: string; onStatusChange: (complaintId: string, status: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [departmentFilter, setDepartmentFilter] = useState('All departments');
  const [riskFilter, setRiskFilter] = useState('All risks');
  const categories = useMemo(() => [...new Set(complaints.map((item) => item.category))].sort(), [complaints]);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const visible = useMemo(() => complaints.filter((item) => {
    const statusMatches = activeTab === 'All reports' || item.status === activeTab;
    const categoryMatches = categoryFilter === 'All categories' || item.category === categoryFilter;
    const deptMatches = departmentFilter === 'All departments' || (item.departmentName || 'Public Works Department') === departmentFilter;
    const riskMatches = riskFilter === 'All risks' || (item.trafficRisk || 'Low') === riskFilter;
    const searchMatches = !normalizedQuery || `${item.title} ${item.id} ${item.location}`.toLowerCase().includes(normalizedQuery);
    return statusMatches && categoryMatches && deptMatches && riskMatches && searchMatches;
  }), [activeTab, categoryFilter, departmentFilter, riskFilter, complaints, normalizedQuery]);

  return (
    <Shell admin>
      <div className="min-h-[calc(100dvh-70px)] px-4 py-8 sm:px-7 sm:py-10 lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          <PageHeading eyebrow="City operations" title="All reports">
            <div className="flex gap-2">
              <Link href="/traffic-alerts" className="flex items-center gap-1.5 rounded-xl border border-[#15353c] bg-[#faedcf] px-3.5 py-2 text-xs font-bold text-[#15353c] hover:bg-[#ed735e] hover:text-white transition-colors">
                <Car size={14} /> Traffic Alerts
              </Link>
              <Link href="/admin" data-testid="link-admin-overview" className="flex items-center justify-center gap-2 rounded-xl border border-[#b8d0c9] bg-[#fffdf8] px-4 py-2.5 text-xs font-bold text-[#17675e] hover:bg-[#e7f3f0]">
                <LayoutDashboard size={15} /> Overview
              </Link>
            </div>
          </PageHeading>

          <section className="mt-7 rounded-2xl border border-[#e4dfd2] bg-[#fffdf8] p-5 soft-shadow sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91a09c]" />
                <input data-testid="input-admin-report-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search title, ID, location" className="h-10 w-full rounded-xl bg-[#f5f1e8] pl-9 pr-3 text-sm text-[#15353c] outline-none placeholder:text-[#9ba5a1] focus:ring-2 focus:ring-[#a9c8c1]" />
              </label>

              <label className="relative flex items-center">
                <Tag size={15} className="pointer-events-none absolute left-3 text-[#71807d]" />
                <select data-testid="select-admin-report-category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-10 w-full appearance-none rounded-xl bg-[#f5f1e8] pl-9 pr-8 text-xs font-semibold text-[#35575a] outline-none focus:ring-2 focus:ring-[#a9c8c1]">
                  <option>All categories</option>
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 text-[#71807d]" />
              </label>

              <label className="relative flex items-center">
                <Building2 size={15} className="pointer-events-none absolute left-3 text-[#71807d]" />
                <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="h-10 w-full appearance-none rounded-xl bg-[#f5f1e8] pl-9 pr-8 text-xs font-semibold text-[#35575a] outline-none focus:ring-2 focus:ring-[#a9c8c1]">
                  <option>All departments</option>
                  {DEPARTMENTS.map((dept) => <option key={dept.id} value={dept.name}>{dept.shortName}</option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 text-[#71807d]" />
              </label>

              <label className="relative flex items-center">
                <AlertTriangle size={15} className="pointer-events-none absolute left-3 text-[#71807d]" />
                <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="h-10 w-full appearance-none rounded-xl bg-[#f5f1e8] pl-9 pr-8 text-xs font-semibold text-[#35575a] outline-none focus:ring-2 focus:ring-[#a9c8c1]">
                  <option>All risks</option>
                  <option value="Critical">Critical Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 text-[#71807d]" />
              </label>
            </div>

            <div className="mt-5 flex gap-1 overflow-x-auto border-b border-[#eee9de]">
              <span className="mr-3 self-center text-[10px] font-bold uppercase tracking-[.15em] text-[#8b9895]">Status</span>
              {['All reports', ...COMPLAINT_STATUSES].map((tab) => (
                <button key={tab} data-testid={`button-all-reports-tab-${tab.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setActiveTab(tab)} className={cn('whitespace-nowrap border-b-2 px-3 py-2.5 text-[11px] font-bold transition-colors', activeTab === tab ? 'border-[#ed735e] text-[#15353c]' : 'border-transparent text-[#9ba5a1] hover:text-[#52706d]')}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p data-testid="text-admin-report-count" className="text-[10px] font-bold uppercase tracking-[.12em] text-[#8b9895]">
                {visible.length} {visible.length === 1 ? 'report' : 'reports'}
              </p>
              {(searchQuery || categoryFilter !== 'All categories' || departmentFilter !== 'All departments' || riskFilter !== 'All risks' || activeTab !== 'All reports') && (
                <button onClick={() => { setSearchQuery(''); setCategoryFilter('All categories'); setDepartmentFilter('All departments'); setRiskFilter('All risks'); setActiveTab('All reports'); }} className="text-[10px] font-bold text-[#17675e] hover:underline">
                  Clear all filters
                </button>
              )}
            </div>

            {statusError && <p role="alert" data-testid="status-admin-update-error" className="mt-4 rounded-xl border border-[#f2c4bb] bg-[#fff1ed] px-3.5 py-3 text-xs font-semibold text-[#b54c3c]">{statusError}</p>}
            <div className="mt-2 divide-y divide-[#eee9de]">
              {visible.map((item) => (
                <AdminReportRow key={item.id} complaint={item} updatingId={updatingId} onStatusChange={onStatusChange} />
              ))}
            </div>
            {visible.length === 0 && <div data-testid="empty-all-reports" className="py-12 text-center text-xs text-[#71807d]">No reports match these filters.</div>}
          </section>
        </div>
      </div>
    </Shell>
  );
}

function AdminDashboardContent({ complaints }: { complaints: Complaint[] }) {
  const awaitingReview = complaints.filter((item) => item.status === 'Submitted' || item.status === 'Under Review').length;
  const inProgress = complaints.filter((item) => item.status === 'In Progress').length;
  const resolved = complaints.filter((item) => item.status === 'Resolved').length;
  const highRiskRoads = complaints.filter((item) => item.trafficRisk === 'High' || item.trafficRisk === 'Critical').length;
  const attention = complaints.filter((item) => item.status === 'Submitted' || item.status === 'Under Review');

  // Breakdown by department
  const deptCounts = DEPARTMENTS.map((dept) => ({
    name: dept.shortName,
    count: complaints.filter((c) => (c.departmentName || '').includes(dept.shortName) || c.departmentId === dept.id).length,
  }));

  return (
    <Shell admin>
      <div className="min-h-[calc(100dvh-70px)] px-4 py-8 sm:px-7 sm:py-10 lg:px-10">
        <div className="mx-auto max-w-[1180px] space-y-8">
          <PageHeading eyebrow="City operations" title="Municipal Control Deck">
            <div className="flex gap-2">
              <Link href="/traffic-alerts" className="flex items-center gap-1.5 rounded-xl border border-[#15353c] bg-[#faedcf] px-4 py-2.5 text-xs font-bold text-[#15353c] hover:bg-[#ed735e] hover:text-white transition-colors">
                <Car size={15} /> Traffic Radar
              </Link>
              <Link href="/admin/reports" data-testid="link-admin-all-reports" className="rounded-xl border border-[#b8d0c9] bg-[#fffdf8] px-4 py-2.5 text-xs font-bold text-[#17675e] hover:bg-[#e7f3f0]">
                View all reports
              </Link>
            </div>
          </PageHeading>

          {/* Operational Metrics Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Total complaints" value={String(complaints.length)} note="All Firestore complaints" icon={BarChart3} accent="bg-[#d9eeea] text-[#17675e]" />
            <MetricCard label="Awaiting review" value={String(awaitingReview)} note="Submitted or under review" icon={Clock3} accent="bg-[#faedcf] text-[#99621b]" />
            <MetricCard label="In progress" value={String(inProgress)} note="Active field operations" icon={TrendingUp} accent="bg-[#e4e6f3] text-[#46517f]" />
            <MetricCard label="Traffic Hazard Alerts" value={String(highRiskRoads)} note="High / Critical traffic risk" icon={Car} accent="bg-[#fbe1d9] text-[#b54c3c]" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_.6fr]">
            {/* Attention Queue */}
            <section className="rounded-2xl border border-[#e4dfd2] bg-[#fffdf8] p-5 soft-shadow sm:p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#ef775f]">Queue</p>
                  <h2 className="mt-1 font-display text-xl font-bold tracking-[-.04em] text-[#15353c]">
                    Reports Needing Dispatch & Attention
                  </h2>
                  <p className="mt-1 text-xs text-[#71807d]">Ordered by submission date and priority.</p>
                </div>
                <Link href="/admin/reports" className="text-xs font-bold text-[#17675e] hover:underline">
                  Filter all reports
                </Link>
              </div>
              <div className="mt-4 divide-y divide-[#eee9de]">
                {attention.map((item) => (
                  <AdminReportRow key={item.id} complaint={item} />
                ))}
              </div>
              {attention.length === 0 && (
                <div data-testid="empty-admin-attention" className="py-12 text-center text-xs text-[#71807d]">
                  No reports currently require review.
                </div>
              )}
            </section>

            {/* Department Breakdown & Insights */}
            <aside className="space-y-6">
              <div className="rounded-2xl border border-[#e4dfd2] bg-[#fffdf8] p-6 soft-shadow">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#ef775f]">Routing Matrix</p>
                <h3 className="mt-1 font-display text-lg font-bold text-[#15353c]">Complaints by Department</h3>
                <div className="mt-4 space-y-3">
                  {deptCounts.map((dept) => (
                    <div key={dept.name} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#52706d]">{dept.name}</span>
                      <span className="font-mono font-bold text-[#15353c] bg-[#f8f5ed] px-2 py-0.5 rounded border">
                        {dept.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border-[3px] border-[#15353c] bg-[#15353c] p-6 text-[#fffdf8] shadow-[4px_4px_0_#ed735e]">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#ed735e]">Safety Radar</p>
                <h3 className="mt-2 font-mono text-xl font-bold uppercase text-white">Road & Flood Risk</h3>
                <p className="mt-2 text-xs text-[#b5c8c2] leading-relaxed">
                  {highRiskRoads} critical or high-risk road hazard reports logged. Automatic traffic alerts active on public map.
                </p>
                <Link href="/traffic-alerts" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ed735e] hover:underline">
                  Open Transit Hazard Map <ArrowRight size={14} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function AdminReportsView({ complaints, activeTab, setActiveTab, isAdmin, updatingId, statusError, onStatusChange }: { complaints: Complaint[]; activeTab: string; setActiveTab: (tab: string) => void; isAdmin: boolean; updatingId: string; statusError: string; onStatusChange: (complaintId: string, status: string) => void }) {
  return <AdminReportsContent complaints={complaints} activeTab={activeTab} setActiveTab={setActiveTab} updatingId={updatingId} statusError={statusError} onStatusChange={onStatusChange} />;
}

function AdminReports() {
  const [activeTab, setActiveTab] = useState('All reports');
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingId, setUpdatingId] = useState('');
  const [statusError, setStatusError] = useState('');
  const { user, authLoading } = useCitizenUser();
  const { isAdmin, adminLoading } = useAdminAuthorization();
  const adminAuthorized = !authLoading && !adminLoading && Boolean(user) && isAdmin;
  const { items: complaints, loading, error } = useFirestoreComplaints({ all: true, refreshKey, enabled: adminAuthorized });
  const adminComplaints = complaints;
  async function onStatusChange(complaintId: string, nextStatus: string) {
    if (!isAdmin || updatingId) return;
    if (!isComplaintStatus(nextStatus)) {
      setStatusError('Choose one of the supported complaint statuses.');
      return;
    }
    setUpdatingId(complaintId);
    setStatusError('');
    try {
      await updateComplaintStatus(complaintId, nextStatus);
      setRefreshKey((current) => current + 1);
    } catch (caughtError) {
      setStatusError(caughtError instanceof Error ? caughtError.message : 'We could not update this complaint status.');
    } finally {
      setUpdatingId('');
    }
  }
  if (authLoading || adminLoading) return <ComplaintDataState title="Checking administrator access" message="Confirming your Firebase administrator authorization." />;
  if (!user) return <ComplaintDataState title="Sign in as an administrator" message="The city operations queue is available only to authorized administrators." action={<Link href="/login" className="rounded-xl bg-[#ed735e] px-4 py-3 text-xs font-bold text-[#fffaf0] shadow-[3px_3px_0_#c95747]">Go to login</Link>} />;
  if (!isAdmin) return <ComplaintDataState title="Administrator access required" message="Your Firebase account is signed in, but it does not have permission to manage complaint statuses." action={<Link href="/dashboard" className="rounded-xl border border-[#b8d0c9] bg-[#fffdf8] px-4 py-3 text-xs font-bold text-[#17675e]">Return to dashboard</Link>} />;
  if (loading) return <ComplaintDataState title="Loading all reports" message="Fetching the city queue from Firestore." />;
  if (error) return <ComplaintDataState title="Could not load admin reports" message={error} />;
  return <AdminReportsView complaints={adminComplaints} activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} updatingId={updatingId} statusError={statusError} onStatusChange={onStatusChange} />;
}

function Admin() {
  const [activeTab, setActiveTab] = useState('All reports');
  const { items: complaints, loading, error } = useFirestoreComplaints({ all: true });
  if (loading) return <ComplaintDataState title="Loading admin dashboard" message="Fetching all complaints from Firestore." />;
  if (error) return <ComplaintDataState title="Could not load admin dashboard" message={error} />;
  return <AdminDashboardContent complaints={complaints} />;
}

function HomeRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation('/dashboard'); }, [setLocation]);
  return null;
}

function FirestoreAdmin() {
  const { user, authLoading } = useCitizenUser();
  const { isAdmin, adminLoading } = useAdminAuthorization();
  const adminAuthorized = !authLoading && !adminLoading && Boolean(user) && isAdmin;
  const { items, loading, error } = useFirestoreComplaints({ all: true, enabled: adminAuthorized });
  if (authLoading || adminLoading) return <ComplaintDataState title="Checking administrator access" message="Confirming your Firebase administrator authorization." />;
  if (!user) return <ComplaintDataState title="Sign in as an administrator" message="The city operations dashboard is available only to authorized administrators." action={<Link href="/login" className="rounded-xl bg-[#ed735e] px-4 py-3 text-xs font-bold text-[#fffaf0] shadow-[3px_3px_0_#c95747]">Go to login</Link>} />;
  if (!isAdmin) return <ComplaintDataState title="Administrator access required" message="Your Firebase account is signed in, but it does not have permission to view or manage all complaints." action={<Link href="/dashboard" className="rounded-xl border border-[#b8d0c9] bg-[#fffdf8] px-4 py-3 text-xs font-bold text-[#17675e]">Return to dashboard</Link>} />;
  if (loading) return <ComplaintDataState title="Loading admin dashboard" message="Fetching all complaints from Firestore." />;
  if (error) return <ComplaintDataState title="Could not load admin dashboard" message={error} />;
  return <AdminDashboardContent complaints={items} />;
}

function Router() {
  const { user } = useCitizenUser();
  return (
    <ErrorBoundary resetKey={window.location.pathname}>
      <Switch>
        <Route path="/" component={HomeRedirect} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/report" component={FirestoreReport} />
        <Route path="/complaints" component={Complaints} />
        <Route path="/complaints/:id" component={ComplaintDetails} />
        <Route path="/traffic-alerts" component={() => <TrafficAlertsPage Shell={Shell} />} />
        <Route path="/alerts" component={() => <AlertsPage userId={user?.uid ?? ''} Shell={Shell} />} />
        <Route path="/profile" component={Profile} />
        <Route path="/admin" component={FirestoreAdmin} />
        <Route path="/admin/reports" component={AdminReports} />
        <Route component={() => (
          <div className="grid min-h-[100dvh] place-items-center bg-[#f8f5ed] p-6 text-center">
            <div>
              <h1 className="font-display text-4xl font-bold text-[#15353c]">Page not found</h1>
              <p className="mt-2 text-sm text-[#71807d]">That civic corner does not exist.</p>
              <Link href="/dashboard" data-testid="link-not-found-home" className="mt-5 inline-flex rounded-xl bg-[#ed735e] px-4 py-3 text-xs font-bold text-[#fffaf0]">
                Return home
              </Link>
            </div>
          </div>
        )} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><CitizenUserProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter></CitizenUserProvider><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;