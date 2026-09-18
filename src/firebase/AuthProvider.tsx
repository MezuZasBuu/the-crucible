/**
 * Firebase auth — anonymous guest or Google sign-in. Profiles stay private per uid.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  User,
  GoogleAuthProvider,
  linkWithPopup,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from './config';
import { migrateLegacyProfilesToUid, setProfileStorageUid } from '../engine/crucibleProfile';
import { CrucibleAccountTier } from '../types';

export interface AuthContextValue {
  configured: boolean;
  ready: boolean;
  user: User | null;
  tier: CrucibleAccountTier;
  isAnonymous: boolean;
  signInGuest: () => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function tierForUser(user: User | null): CrucibleAccountTier {
  if (!user) return 'visitor';
  if (user.isAnonymous) return 'guest';
  const hasGoogle = user.providerData.some((p) => p.providerId === 'google.com');
  return hasGoogle ? 'member' : 'guest';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const configured = isFirebaseConfigured();
  const [ready, setReady] = useState(!configured);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!configured) return;
    const auth = getFirebaseAuth();
    if (!auth) {
      setReady(true);
      return;
    }

    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      if (next) {
        migrateLegacyProfilesToUid(next.uid);
        setProfileStorageUid(next.uid);
      } else {
        setProfileStorageUid(null);
      }
      setReady(true);
    });
    return unsub;
  }, [configured]);

  const signInGuest = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase is not configured');
    if (auth.currentUser && !auth.currentUser.isAnonymous) return;
    if (auth.currentUser?.isAnonymous) return;
    await signInAnonymously(auth);
  }, []);

  const signInGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase is not configured');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    if (auth.currentUser?.isAnonymous) {
      await linkWithPopup(auth.currentUser, provider);
      return;
    }
    await signInWithPopup(auth, provider);
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await firebaseSignOut(auth);
    setProfileStorageUid(null);
  }, []);

  const getIdToken = useCallback(async (forceRefresh = false) => {
    const auth = getFirebaseAuth();
    const current = auth?.currentUser;
    if (!current) return null;
    return current.getIdToken(forceRefresh);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured,
      ready,
      user,
      tier: tierForUser(user),
      isAnonymous: Boolean(user?.isAnonymous),
      signInGuest,
      signInGoogle,
      signOut,
      getIdToken
    }),
    [configured, ready, user, signInGuest, signInGoogle, signOut, getIdToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
