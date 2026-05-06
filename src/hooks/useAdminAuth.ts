import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';

import { getFirebaseAuth } from '../lib/firebase';

const createGoogleProvider = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
};

const resolveAuthErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return 'Firebase Authentication could not complete the request.';
  }

  switch (error.code) {
    case 'auth/popup-blocked':
      return 'The Google sign-in popup was blocked. Allow popups for this site and try again.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was canceled before it completed.';
    case 'auth/operation-not-allowed':
      return 'Enable Google as a sign-in provider in Firebase Authentication before using the admin dashboard.';
    case 'auth/unauthorized-domain':
      return 'Add this domain to the authorized domains list in Firebase Authentication.';
    default:
      return 'Firebase Authentication could not complete the request.';
  }
};

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Authentication is only available in the browser.');
    }

    try {
      const result = await signInWithPopup(auth, createGoogleProvider());
      return result.user;
    } catch (error) {
      throw new Error(resolveAuthErrorMessage(error));
    }
  };

  const signOutUser = async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      return;
    }

    await signOut(auth);
  };

  const getIdToken = async () => {
    const auth = getFirebaseAuth();
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      return null;
    }

    return currentUser.getIdToken(true);
  };

  return {
    user,
    loading,
    signIn: signInWithGoogle,
    signOut: signOutUser,
    getIdToken,
  };
}