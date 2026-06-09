import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword as fbSignIn, createUserWithEmailAndPassword as fbCreateUser, signOut as fbSignOut, onAuthStateChanged as fbOnAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const metaEnv = (import.meta as any).env || {};
const hasFirebaseConfig = !!(metaEnv.VITE_FIREBASE_API_KEY && metaEnv.VITE_FIREBASE_API_KEY.startsWith('AIza'));

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "mock-key",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "mock-domain",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "mock-bucket",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "mock-sender",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "mock-app-id"
};

export const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null as any;
export const auth = hasFirebaseConfig ? getAuth(app) : null as any;
export const db = hasFirebaseConfig ? getFirestore(app) : null as any;

export const signInWithEmailAndPassword = async (authObj: any, email: string, pass: string) => {
  if (hasFirebaseConfig) return fbSignIn(authObj, email, pass);
  if (email && pass) {
    localStorage.setItem('mock_user', JSON.stringify({ email }));
    window.dispatchEvent(new Event('mock-auth-change'));
    return { user: { email } };
  }
  throw new Error('auth/invalid-credential');
};

export const createUserWithEmailAndPassword = async (authObj: any, email: string, pass: string) => {
  if (hasFirebaseConfig) return fbCreateUser(authObj, email, pass);
  if (email && pass) {
    localStorage.setItem('mock_user', JSON.stringify({ email }));
    window.dispatchEvent(new Event('mock-auth-change'));
    return { user: { email } };
  }
  throw new Error('auth/invalid-credential');
};

export const signOut = async (authObj: any) => {
  if (hasFirebaseConfig) return fbSignOut(authObj);
  localStorage.removeItem('mock_user');
  window.dispatchEvent(new Event('mock-auth-change'));
};

export const onAuthStateChanged = (authObj: any, callback: (user: any) => void) => {
  if (hasFirebaseConfig) return fbOnAuthStateChanged(authObj, callback);
  
  const checkAuth = () => {
    const userStr = localStorage.getItem('mock_user');
    if (userStr) {
      try { callback(JSON.parse(userStr)); } catch (e) { callback(null); }
    } else {
      callback(null);
    }
  };
  
  checkAuth();
  window.addEventListener('mock-auth-change', checkAuth);
  
  return () => {
    window.removeEventListener('mock-auth-change', checkAuth);
  };
};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
