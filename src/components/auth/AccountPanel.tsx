/**
 * Account sign-in — anonymous guest or Google. Required for Cursor deep readings.
 */

import React, { useState } from 'react';
import { Loader2, LogIn, LogOut, Shield, UserRound } from 'lucide-react';
import { useAuth } from '../../firebase/AuthProvider';
import { DEEP_READING_DAILY_LIMITS } from '../../engine/authGate';
import { isFirebaseConfigured } from '../../firebase/config';

export const AccountPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { configured, ready, user, tier, isAnonymous, signInGuest, signInGoogle, signOut } = useAuth();
  const [busy, setBusy] = useState<'guest' | 'google' | 'out' | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!configured) {
    return (
      <div className="instrument-panel">
        <p className="ui-eyebrow">Account</p>
        <h3 className="panel-title mt-1">Sign-in not configured yet</h3>
        <p className="readable-body mt-3">
          Add Firebase keys to enable private accounts and Cursor deep readings. Today&apos;s deterministic readings still work without auth.
        </p>
          <p className="readable-muted text-[0.95rem] mt-2">
            Setup guide: <code className="text-[0.9em]">docs/FIREBASE_SETUP.md</code> (owner: mezuai000@gmail.com)
          </p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="instrument-panel flex items-center gap-2 readable-body">
        <Loader2 className="w-4 h-4 animate-spin" />
        Checking account…
      </div>
    );
  }

  const limit = DEEP_READING_DAILY_LIMITS[tier];
  const label = user
    ? isAnonymous
      ? 'Guest session'
      : user.email || user.displayName || 'Signed in'
    : 'Not signed in';

  const handle = async (action: 'guest' | 'google' | 'out') => {
    setError(null);
    setBusy(action);
    try {
      if (action === 'guest') await signInGuest();
      else if (action === 'google') await signInGoogle();
      else await signOut();
    } catch (e: any) {
      setError(e?.message || 'Sign-in failed');
    } finally {
      setBusy(null);
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="cta-ghost !min-h-9 !px-3 text-[0.82rem] inline-flex items-center gap-1.5">
          <UserRound className="w-4 h-4" />
          {user ? label : 'Guest'}
        </span>
        {!user && (
          <>
            <button type="button" className="cta-ghost !min-h-9" disabled={busy !== null} onClick={() => handle('guest')}>
              {busy === 'guest' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue as guest'}
            </button>
            <button type="button" className="cta-explore !min-h-9" disabled={busy !== null} onClick={() => handle('google')}>
              Google
            </button>
          </>
        )}
        {user && (
          <button type="button" className="cta-ghost !min-h-9" disabled={busy !== null} onClick={() => handle('out')}>
            Sign out
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="instrument-panel space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="ui-eyebrow">Your account</p>
          <h3 className="panel-title mt-1">{user ? label : 'Sign in for private readings'}</h3>
          <p className="readable-body mt-3 max-w-2xl">
            Charts and deep Cursor readings are tied to your account — not shared across users. Guest sessions are anonymous; Google sign-in saves your identity across devices.
          </p>
        </div>
        <Shield className="w-5 h-5 text-[color:var(--accent-sage)] shrink-0 mt-1" />
      </div>

      <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] px-4 py-3 readable-body">
        <p>
          Tier: <strong>{tier}</strong> · Deep readings today: up to <strong>{limit}</strong>
          {user ? ` · UID ${user.uid.slice(0, 8)}…` : ''}
        </p>
        {isAnonymous && user && (
          <p className="readable-muted text-[0.95rem] mt-2">
            Link Google to keep this session and raise your daily deep-reading pool.
          </p>
        )}
      </div>

      {error && <p className="readable-body text-[color:var(--solar-bright)]">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {!user && (
          <>
            <button type="button" className="cta-primary" disabled={busy !== null} onClick={() => handle('guest')}>
              {busy === 'guest' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              Continue as guest
            </button>
            <button type="button" className="cta-explore" disabled={busy !== null} onClick={() => handle('google')}>
              {busy === 'google' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in with Google'}
            </button>
          </>
        )}
        {user && isAnonymous && (
          <button type="button" className="cta-explore" disabled={busy !== null} onClick={() => handle('google')}>
            {busy === 'google' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Link Google account'}
          </button>
        )}
        {user && (
          <button type="button" className="cta-ghost" disabled={busy !== null} onClick={() => handle('out')}>
            {busy === 'out' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Sign out
          </button>
        )}
      </div>

      {!isFirebaseConfigured() && (
        <p className="readable-muted text-[0.95rem]">Firebase env vars missing at build time.</p>
      )}
    </div>
  );
};
