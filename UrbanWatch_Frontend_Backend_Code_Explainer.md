# UrbanWatch
## Frontend and Backend Code Explainer

**Project:** Smart Citizen Assistant for Civic Issue Reporting  
**Purpose:** A simple guide for explaining the code used in the UrbanWatch prototype  
**Current scope:** Firebase Email/Password Authentication, protected complaint reporting, Firestore persistence, and secure Cloudinary image uploads

> This document contains selected, presentation-ready code from the current implementation. The complete source remains in the UrbanWatch application folders. Secret values are intentionally not included.

---

## 1. Explain the project in one minute

UrbanWatch is a web application that lets a citizen create an account, sign in, report a civic issue, optionally attach an image, and view saved complaints. Firebase Authentication identifies the citizen, Firestore stores the complaint record, and Cloudinary stores the complaint image.

The important design decision is that the browser does **not** upload directly to Cloudinary with a secret key. Instead:

1. The citizen signs in with Firebase Email/Password.
2. The frontend receives a Firebase ID token.
3. The frontend sends the image and token to the Express backend.
4. The backend validates the token, file type, file signature, and file size.
5. The backend uploads the image to Cloudinary.
6. The frontend receives a secure HTTPS image URL.
7. Firestore saves the complaint only after the upload succeeds.

### Simple architecture

```text
Citizen browser
     |
     | React + Wouter
     | Firebase Email/Password
     v
Firebase Authentication
     |
     | Firebase ID token
     v
Express API server ---- validates session and image ----> Cloudinary
     |
     | complaint fields + secure image URL
     v
Firestore complaints collection
```

---

## 2. Technology used

### Frontend

- React with TypeScript
- Vite
- Wouter for client-side routing
- Firebase Web SDK for Authentication and Firestore
- Tailwind CSS utility classes for the interface
- Lucide React for interface icons

### Backend

- Node.js
- Express
- TypeScript
- CORS
- Pino HTTP logging
- Cloudinary Node SDK

### Services

- **Firebase Authentication:** Email/password accounts and user sessions
- **Cloud Firestore:** Complaint records
- **Cloudinary:** Complaint image storage

Firebase Storage is not used in this implementation.

---

# 3. Frontend code

The main frontend source is:

```text
artifacts/smart-citizen-app/src/App.tsx
```

Supporting frontend service modules are:

```text
artifacts/smart-citizen-app/src/lib/firebase.ts
artifacts/smart-citizen-app/src/lib/cloudinary.ts
artifacts/smart-citizen-app/src/lib/firestore.ts
artifacts/smart-citizen-app/src/main.tsx
```

## 3.1 Frontend entry point

File: `src/main.tsx`

```tsx
import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
```

### How to explain it

`main.tsx` is the entry point of the React application. It finds the HTML element with the id `root`, renders the `App` component, and wraps the application in an error boundary so unexpected UI errors can be logged safely.

---

## 3.2 Firebase client initialization

File: `src/lib/firebase.ts`

```ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingConfig.length > 0) {
  throw new Error(`Missing Firebase configuration: ${missingConfig.join(', ')}`);
}

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
```

### How to explain it

The Firebase configuration is read from environment variables instead of being hardcoded in the source. The `getApps()` check prevents Firebase from being initialized more than once during development. `firebaseAuth` is the shared Authentication instance used by the login, registration, and session-management code.

The Firebase web configuration is not the same as a server secret. The sensitive Cloudinary API secret stays only on the backend.

---

## 3.3 Keeping track of the signed-in citizen

File: `src/App.tsx`

```tsx
type CitizenUserContextValue = {
  name: string;
  email: string;
  user: User | null;
  authLoading: boolean;
  setName: (name: string) => void;
  logout: () => Promise<void>;
};

const CitizenUserContext =
  createContext<CitizenUserContextValue | null>(null);

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

  async function logout() {
    setName('');
    await signOut(firebaseAuth);
  }

  return (
    <CitizenUserContext.Provider
      value={{
        name,
        email: user?.email ?? '',
        user,
        authLoading,
        setName,
        logout,
      }}
    >
      {children}
    </CitizenUserContext.Provider>
  );
}
```

### How to explain it

`onAuthStateChanged` listens for Firebase session changes. When a citizen signs in or signs out, the provider updates the rest of the React application automatically. This avoids passing the user object through every component manually.

`authLoading` is important because the application must wait for Firebase to check the existing session before deciding whether the citizen is signed in.

---

## 3.4 Firebase Email/Password login

File: `src/App.tsx`

```tsx
function Login() {
  const [, setLocation] = useLocation();
  const { user, authLoading } = useCitizenUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) setLocation('/dashboard');
  }, [authLoading, setLocation, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await signInWithEmailAndPassword(
        firebaseAuth,
        email.trim(),
        password,
      );
      setLocation('/dashboard');
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />

        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
```

### What happens during login

1. The user enters an email and password.
2. `signInWithEmailAndPassword` sends the credentials to Firebase.
3. Firebase returns an authenticated user session.
4. `onAuthStateChanged` updates `CitizenUserProvider`.
5. The user is redirected to `/dashboard`.

The password is handled by Firebase Authentication. It is not saved in the UrbanWatch Firestore complaint record.

---

## 3.5 Firebase account registration

File: `src/App.tsx`

```tsx
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setError('');

  const trimmedName = enteredName.trim();

  if (password !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  if (password.length < 6) {
    setError('Choose a stronger password with at least 6 characters.');
    return;
  }

  setSubmitting(true);

  try {
    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email.trim(),
      password,
    );

    await updateProfile(credential.user, {
      displayName: trimmedName,
    });

    setName(trimmedName);
    setLocation('/dashboard');
  } catch (authError) {
    setError(getAuthErrorMessage(authError));
  } finally {
    setSubmitting(false);
  }
}
```

### How to explain it

The registration flow performs basic client-side checks before calling Firebase. After Firebase creates the account, `updateProfile` stores the citizen’s display name in the Firebase user profile. The application then navigates to the dashboard.

---

## 3.6 Client-side routes and the protected report route

File: `src/App.tsx`

```tsx
function Router() {
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
        <Route path="/profile" component={Profile} />
        <Route path="/admin" component={FirestoreAdmin} />
        <Route path="/admin/reports" component={AdminReports} />
        <Route component={NotFoundPage} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CitizenUserProvider>
          <WouterRouter
            base={import.meta.env.BASE_URL.replace(/\/$/, '')}
          >
            <Router />
          </WouterRouter>
        </CitizenUserProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
```

The current `/report` route is rendered by `FirestoreReport`. Its authentication gate is:

```tsx
if (authLoading) {
  return (
    <ComplaintDataState
      title="Checking your account"
      message="Confirming your Firebase session before opening the report form."
    />
  );
}

if (!user) {
  return (
    <ComplaintDataState
      title="Sign in to submit a complaint"
      message="UrbanWatch uses your Firebase UID, name, and email when it saves a complaint."
      action={
        <Link href="/login">Go to login</Link>
      }
    />
  );
}
```

### How to explain the protected route

The route exists in the client router, but the report form is not shown until Firebase finishes checking the session. If there is no authenticated user, the application shows a sign-in message instead of allowing a complaint submission.

The backend applies a second, independent check before accepting an image upload. This is important because a browser-side check alone is not sufficient security.

---

## 3.7 Report submission and Firestore persistence

File: `src/App.tsx`

```tsx
async function submit(
  event: FormEvent<HTMLFormElement>,
  imageFile: File | null,
) {
  event.preventDefault();

  if (saving) return;

  if (!user) {
    setError(
      'Please sign in with your Firebase account before submitting a complaint.',
    );
    return;
  }

  const form = event.currentTarget;
  const value = (selector: string) =>
    (
      form.querySelector(selector) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | null
    )?.value.trim() || '';

  setSaving(true);
  setError('');

  try {
    const imageUrl = imageFile
      ? await uploadImageToCloudinary(
          imageFile,
          await user.getIdToken(),
        )
      : null;

    const complaintId = await createComplaint({
      userId: user.uid,
      userName: name || user.displayName || 'Citizen',
      userEmail: email || user.email || '',
      title: value('[data-testid="input-report-title"]'),
      issueType: value('[data-testid="select-report-category"]'),
      description: value('[data-testid="textarea-report-description"]'),
      location: value('[data-testid="input-report-location"]'),
      priority: 'Pending assignment',
      status: 'Submitted',
      imageUrl,
      latitude: null,
      longitude: null,
    });

    setSubmittedId(complaintId);
  } catch (caughtError) {
    setError(
      caughtError instanceof Error
        ? caughtError.message
        : 'Your complaint could not be submitted. Please try again.',
    );
  } finally {
    setSaving(false);
  }
}
```

### The most important line of the workflow

```tsx
const imageUrl = imageFile
  ? await uploadImageToCloudinary(imageFile, await user.getIdToken())
  : null;
```

The complaint is created only after this upload call finishes successfully. Therefore, Firestore receives either a validated secure URL or `null` when the citizen did not attach an image. It does not receive a failed or incomplete upload reference.

---

## 3.8 Frontend image-upload helper

File: `src/lib/cloudinary.ts`

```ts
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export async function uploadImageToCloudinary(
  file: File,
  firebaseIdToken: string,
) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Only JPG, PNG, and WEBP images are supported.');
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Images must be 10 MB or smaller.');
  }

  const formData = new FormData();
  formData.append('image', file, file.name);

  const response = await fetch('/api/upload/image', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${firebaseIdToken}`,
    },
    body: formData,
  });

  const data = (await response.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };

  if (!response.ok || !data.url || !data.url.startsWith('https://')) {
    throw new Error(
      data.error || 'The image upload failed. Please try again.',
    );
  }

  return data.url;
}
```

### How to explain it

The helper performs an early type and size check in the browser, creates a multipart request, and sends the Firebase ID token in the `Authorization` header. It only returns a URL when the backend responds successfully with an HTTPS URL.

The backend repeats the validation because client-side validation can be bypassed.

---

## 3.9 Firestore complaint module

File: `src/lib/firestore.ts`

```ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';

import { firebaseApp } from './firebase';

export const firestoreDb = getFirestore(firebaseApp);
const complaintsCollection = collection(firestoreDb, 'complaints');

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
  createdAt: Timestamp | null;
  title?: string;
  location?: string;
};

type NewComplaint = Omit<
  StoredComplaint,
  'complaintId' | 'createdAt'
>;

function newComplaintId() {
  const suffix =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()
      : `${Date.now()}${Math.random().toString(36).slice(2, 8)}`
          .toUpperCase();

  return `SC-${suffix}`;
}

export async function createComplaint(input: NewComplaint) {
  if (
    input.imageUrl !== null &&
    !input.imageUrl.startsWith('https://')
  ) {
    throw new Error('Complaint images must use a secure HTTPS URL.');
  }

  const complaintId = newComplaintId();

  await setDoc(doc(firestoreDb, 'complaints', complaintId), {
    ...input,
    complaintId,
    createdAt: serverTimestamp(),
  });

  return complaintId;
}

export async function getComplaintsForUser(userId: string) {
  const snapshot = await getDocs(
    query(complaintsCollection, where('userId', '==', userId)),
  );

  return snapshot.docs
    .map(fromSnapshot)
    .sort(
      (a, b) =>
        timestampMillis(b.createdAt) - timestampMillis(a.createdAt),
    );
}

export async function getAllComplaints() {
  const snapshot = await getDocs(complaintsCollection);

  return snapshot.docs
    .map(fromSnapshot)
    .sort(
      (a, b) =>
        timestampMillis(b.createdAt) - timestampMillis(a.createdAt),
    );
}
```

### How to explain it

Each complaint receives an id such as `SC-ABC123...`. The `createComplaint` function rejects non-HTTPS image URLs before writing to Firestore. It then adds a server timestamp so records can be sorted by creation time.

The citizen dashboard uses `getComplaintsForUser`, while the admin view uses `getAllComplaints`.

---

# 4. Backend code

The backend source is:

```text
artifacts/api-server/src/app.ts
artifacts/api-server/src/index.ts
artifacts/api-server/src/routes/index.ts
artifacts/api-server/src/routes/health.ts
artifacts/api-server/src/routes/upload.ts
```

## 4.1 Starting the Express server

File: `src/index.ts`

```ts
import app from './app';
import { logger } from './lib/logger';

const rawPort = process.env['PORT'];

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, 'Error listening on port');
    process.exit(1);
  }

  logger.info({ port }, 'Server listening');
});
```

### How to explain it

The server reads its port from the environment, validates it, and starts listening. Replit supplies the port through the workflow environment.

---

## 4.2 Express application setup

File: `src/app.ts`

```ts
import express, { type Express } from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import router from './routes';
import { logger } from './lib/logger';

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split('?')[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if ((error as { type?: string })?.type === 'entity.too.large') {
      res
        .status(413)
        .json({ error: 'Images must be 10 MB or smaller.' });
      return;
    }

    next(error);
  },
);

export default app;
```

### How to explain it

The Express app adds logging, CORS, JSON parsing, URL-encoded parsing, and the `/api` route prefix. The oversized-request handler returns a clear `413` response instead of allowing a large upload to fail without an explanation.

---

## 4.3 Registering the API routes

File: `src/routes/index.ts`

```ts
import { Router, type IRouter } from 'express';
import healthRouter from './health';
import uploadRouter from './upload';

const router: IRouter = Router();

router.use(healthRouter);
router.use(uploadRouter);

export default router;
```

The available endpoints include:

```text
GET  /api/healthz
POST /api/upload/image
```

---

## 4.4 Health endpoint

File: `src/routes/health.ts`

```ts
import { Router, type IRouter } from 'express';
import { HealthCheckResponse } from '@workspace/api-zod';

const router: IRouter = Router();

router.get('/healthz', (_req, res) => {
  const data = HealthCheckResponse.parse({ status: 'ok' });
  res.json(data);
});

export default router;
```

### How to explain it

The health endpoint is a small operational check. It confirms that the API server is running and returns a validated `{ status: "ok" }` response.

---

## 4.5 Secure image upload endpoint

File: `src/routes/upload.ts`

```ts
import express, { Router, type IRouter } from 'express';
import { v2 as cloudinary } from 'cloudinary';

const router: IRouter = Router();
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_MULTIPART_BYTES = MAX_IMAGE_BYTES + 1024 * 1024;
const MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

function hasValidSignature(buffer: Buffer, contentType: string) {
  if (contentType === 'image/jpeg') {
    return buffer
      .subarray(0, 3)
      .equals(Buffer.from([0xff, 0xd8, 0xff]));
  }

  if (contentType === 'image/png') {
    return buffer
      .subarray(0, 8)
      .equals(
        Buffer.from([
          0x89, 0x50, 0x4e, 0x47,
          0x0d, 0x0a, 0x1a, 0x0a,
        ]),
      );
  }

  if (contentType === 'image/webp') {
    return (
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    );
  }

  return false;
}

async function hasValidFirebaseSession(
  authorization: string | undefined,
) {
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : '';

  const firebaseApiKey = process.env['VITE_FIREBASE_API_KEY'];

  if (!token || !firebaseApiKey) return false;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(
      firebaseApiKey,
    )}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: token }),
    },
  );

  if (!response.ok) return false;

  const data = (await response.json()) as {
    users?: Array<{ localId?: string }>;
  };

  return Boolean(data.users?.[0]?.localId);
}

function getMultipartImage(
  body: Buffer,
  contentTypeHeader: string,
) {
  const boundaryMatch = contentTypeHeader.match(
    /boundary=(?:"([^"]+)"|([^;]+))/i,
  );
  const boundary =
    boundaryMatch?.[1] ?? boundaryMatch?.[2]?.trim();

  if (!boundary) return null;

  const separator = Buffer.from(`--${boundary}`);
  let partStart = body.indexOf(separator);

  while (partStart !== -1) {
    const headersStart = partStart + separator.length + 2;
    const headersEnd = body.indexOf(
      Buffer.from('\r\n\r\n'),
      headersStart,
    );

    if (headersEnd === -1) break;

    const headers = body
      .subarray(headersStart, headersEnd)
      .toString('utf8');
    const nextPart = body.indexOf(
      separator,
      headersEnd + 4,
    );

    if (nextPart === -1) break;

    if (
      /content-disposition:[^\r\n]*\bname="image"/i.test(
        headers,
      )
    ) {
      const typeMatch = headers.match(
        /content-type:\s*([^\r\n]+)/i,
      );
      const image = body.subarray(
        headersEnd + 4,
        Math.max(headersEnd + 4, nextPart - 2),
      );

      return {
        image,
        contentType:
          typeMatch?.[1]?.trim().toLowerCase() ?? '',
      };
    }

    partStart = nextPart;
  }

  return null;
}

router.post(
  '/upload/image',
  express.raw({
    type: 'multipart/form-data',
    limit: MAX_MULTIPART_BYTES,
  }),
  async (req, res) => {
    const multipart = Buffer.isBuffer(req.body)
      ? getMultipartImage(
          req.body,
          String(req.headers['content-type'] ?? ''),
        )
      : null;

    if (!multipart) {
      res.status(400).json({
        error:
          'Attach the image using the multipart field named image.',
      });
      return;
    }

    const { image, contentType } = multipart;

    if (
      !MIME_TYPES.has(contentType) ||
      !hasValidSignature(image, contentType)
    ) {
      res.status(400).json({
        error:
          'Only valid JPG, PNG, and WEBP images are supported.',
      });
      return;
    }

    if (
      image.length === 0 ||
      image.length > MAX_IMAGE_BYTES
    ) {
      res.status(413).json({
        error: 'Images must be 10 MB or smaller.',
      });
      return;
    }

    if (!process.env['VITE_FIREBASE_API_KEY']) {
      res.status(503).json({
        error:
          'Firebase upload authorization is not configured on the server.',
      });
      return;
    }

    if (
      !(await hasValidFirebaseSession(
        req.headers.authorization,
      ))
    ) {
      res.status(401).json({
        error: 'Please sign in before uploading an image.',
      });
      return;
    }

    const cloudName = process.env['CLOUDINARY_CLOUD_NAME'];
    const apiKey = process.env['CLOUDINARY_API_KEY'];
    const apiSecret = process.env['CLOUDINARY_API_SECRET'];

    if (!cloudName || !apiKey || !apiSecret) {
      res.status(503).json({
        error: 'Image uploads are not configured on the server.',
      });
      return;
    }

    try {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      const result = await cloudinary.uploader.upload(
        `data:${contentType};base64,${image.toString('base64')}`,
        {
          folder: 'urbanwatch/complaints',
          resource_type: 'image',
          unique_filename: true,
        },
      );

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch {
      res.status(502).json({
        error:
          'Cloudinary could not store this image. Please try again.',
      });
    }
  },
);

export default router;
```

### What the backend validates

| Check | Reason |
|---|---|
| Multipart field is named `image` | Ensures the expected upload exists |
| MIME type is JPEG, PNG, or WEBP | Rejects unsupported formats |
| File signature matches the MIME type | Helps prevent renamed or disguised files |
| File is no larger than 10 MB | Controls resource usage |
| Firebase ID token is valid | Prevents unauthenticated image uploads |
| Cloudinary configuration exists | Fails clearly if server setup is incomplete |
| Cloudinary returns a secure URL | Ensures Firestore receives an HTTPS image URL |

### Why Cloudinary credentials are server-side

The browser needs to send an image, but it should never receive the Cloudinary API secret. The backend reads the Cloudinary values from environment variables, configures the Cloudinary SDK, and performs the upload on behalf of the authenticated citizen.

---

# 5. Complete request sequence

## A. Login

```text
Login form
  -> signInWithEmailAndPassword()
  -> Firebase Authentication
  -> Firebase session
  -> onAuthStateChanged()
  -> /dashboard
```

## B. Open the report page

```text
/report
  -> CitizenUserProvider checks Firebase session
  -> if loading: show "Checking your account"
  -> if no user: show "Sign in to submit a complaint"
  -> if user exists: show report form
```

## C. Submit a complaint with an image

```text
Report form
  -> read title, category, description, and location
  -> get Firebase ID token
  -> POST /api/upload/image
  -> backend validates token and image
  -> Cloudinary stores image
  -> backend returns secure_url
  -> frontend calls createComplaint()
  -> Firestore stores complaint + image URL
  -> show complaint id and saved state
```

## D. View complaints

```text
Dashboard
  -> getComplaintsForUser(user.uid)
  -> query complaints where userId equals the signed-in UID
  -> sort by createdAt
  -> display cards and status
```

---

# 6. What is implemented versus planned

## Implemented in the current prototype

- Firebase Email/Password registration
- Firebase Email/Password login
- Firebase session tracking
- Protected report submission experience
- Firestore complaint creation
- Citizen-specific complaint listing
- Admin complaint listing
- Secure backend image upload route
- Cloudinary image storage
- HTTPS image URL validation
- JPEG, PNG, and WEBP validation
- 10 MB image size limit
- Actual login and protected report screenshots for the presentation

## Planned or preview-only items

- Automatic GPS location pinning
- AI issue-type detection
- Automatic priority assignment
- Live municipal department routing
- Password reset connection
- Live notification system
- Production analytics and export

These limitations should be described honestly during the presentation. The current application demonstrates the authentication, reporting, upload, and persistence foundation; the AI and GPS features are future extensions.

---

# 7. Short presentation script

## Frontend explanation

“The frontend is a React and TypeScript application. Firebase Authentication handles registration and login. The user session is stored in a shared React context, so every page can know whether the citizen is authenticated. The `/report` route checks the Firebase session before displaying the complaint form. When the form is submitted, the frontend obtains a Firebase ID token, sends an optional image to the backend, and then saves the complaint in Firestore.”

## Backend explanation

“The backend is an Express API. Its main responsibility is secure image handling. It receives a multipart image and a Firebase bearer token, validates the session through Firebase, checks the file type and binary signature, enforces a 10 MB limit, and uploads the image to Cloudinary. The Cloudinary secret is never exposed to the browser. Only the secure image URL is returned to the frontend.”

## Database explanation

“Firestore stores the complaint fields, the Firebase user id, the user’s name and email, the complaint status, coordinates, and the secure Cloudinary image URL. The complaint is written only after the image upload succeeds, which prevents records from pointing to failed uploads.”

---

# 8. File map for the viva or demonstration

| Area | File | What to show |
|---|---|---|
| React entry | `artifacts/smart-citizen-app/src/main.tsx` | React bootstrapping and error boundary |
| Main frontend | `artifacts/smart-citizen-app/src/App.tsx` | Auth context, routes, login, report flow, dashboard |
| Firebase setup | `artifacts/smart-citizen-app/src/lib/firebase.ts` | Firebase initialization and environment configuration |
| Image client | `artifacts/smart-citizen-app/src/lib/cloudinary.ts` | Multipart request and bearer token |
| Firestore client | `artifacts/smart-citizen-app/src/lib/firestore.ts` | Complaint schema and persistence |
| API setup | `artifacts/api-server/src/app.ts` | Express middleware and `/api` prefix |
| API routes | `artifacts/api-server/src/routes/index.ts` | Route registration |
| Upload security | `artifacts/api-server/src/routes/upload.ts` | Token, MIME, signature, and size checks |
| Server start | `artifacts/api-server/src/index.ts` | Port validation and server startup |

---

# 9. Key terms to remember

- **Firebase UID:** The unique id of the authenticated citizen.
- **Firebase ID token:** A short-lived token sent by the frontend to prove the current session.
- **Firestore:** Firebase’s document database used for complaint records.
- **Multipart form data:** The HTTP format used to send a file and other request parts.
- **Cloudinary secure URL:** The HTTPS URL returned after Cloudinary stores the image.
- **Protected route:** A route that requires an authenticated user before allowing a protected action.
- **Server-side validation:** Validation performed by the backend, where the browser cannot bypass the rules.

---

## Final summary

UrbanWatch separates responsibilities clearly:

```text
Firebase Authentication -> Who is the citizen?
Firestore                -> What complaint was submitted?
Cloudinary               -> Where is the complaint image stored?
Express API              -> Is the upload authenticated and valid?
React frontend           -> How does the citizen use the system?
```

The strongest point to emphasize is the upload order:

```text
Authenticate
  -> validate image
  -> upload to Cloudinary
  -> receive secure URL
  -> save complaint to Firestore
```

That order is what prevents complaints from being saved with invalid image references.