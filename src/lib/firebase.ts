import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBB5m5DlRnx0Eqx8KDjbYrhRRn9xhGMwig',
  authDomain: 'graphic-designer-portfol-baf47.firebaseapp.com',
  projectId: 'graphic-designer-portfol-baf47',
  storageBucket: 'graphic-designer-portfol-baf47.firebasestorage.app',
  messagingSenderId: '389761768693',
  appId: '1:389761768693:web:47dcf0a2fcca809b17b9bc',
  measurementId: 'G-PZ13W9HN8X',
} satisfies FirebaseOptions;

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const isFirebaseConfigured = true;
export const archiveCollectionName = import.meta.env.VITE_FIREBASE_ARCHIVE_COLLECTION || 'archiveProjects';

let analyticsPromise: Promise<Analytics | null> | null = null;

export const getFirebaseAnalytics = () => {
  if (analyticsPromise) {
    return analyticsPromise;
  }

  analyticsPromise = typeof window === 'undefined'
    ? Promise.resolve(null)
    : isSupported()
        .then((supported) => (supported ? getAnalytics(app) : null))
        .catch(() => null);

  return analyticsPromise;
};

void getFirebaseAnalytics();