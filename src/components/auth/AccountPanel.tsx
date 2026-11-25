/**
 * Account sign-in — anonymous guest or Google. Required for in-depth AI readings.
 */

import React, { useState } from 'react';
import { Loader2, LogIn, LogOut, Shield, UserRound } from 'lucide-react';
import { useAuth } from '../../firebase/AuthProvider';
import { DEEP_READING_DAILY_LIMITS } from '../../engine/authGate';

export const AccountPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { configured, ready, user, tier, isAnonymous, signInGuest, signInGoogle, signOut } = useAuth();
  const [busy, setBusy] = useState<'guest' | 'google' | 'out' | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!configured) {
    if (compact) {
      return (
        <span className="guest-chip" title="You are using The Crucible as a guest. Your details stay on this device.">
          <UserRound className="w-4 h-4" />
          Guest
        </span>
      );
    }
    return (
      <div className="instrument-panel empty-state">
        <span className="empty-state-icon">
          <Shield className="w-6 h-6" />
        </span>
        <div>
          <p className="ui-eyebrow">Account</p>
          <h3 className="panel-title mt-1">You’re browsing as a guest</h3>
          <p className="readable-body mt-2">
            Everything works without an account. Any birth details you save are kept on this device only and are never
            sent anywhere.
          </p>
          {import.meta.env.DEV && (
            <p className="readable-muted text-[0.85rem] mt-2">
              Developer note: sign-in is switched off because no Firebase keys are set. See{' '}
              <code className="text-[0.9em]">docs/FIREBASE_SETUP.md</code>.
            </p>
          )}
        </div>
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
            Your charts and in-depth readings belong to your account and are not shared with anyone. A guest session is anonymous; signing in with Google keeps your charts across devices.
          </p>
        </div>
        <Shield className="w-5 h-5 text-[color:var(--accent-sage)] shrink-0 mt-1" />
      </div>

      <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] px-4 py-3 readable-body">
        <p>
          Plan: <strong>{tier}</strong> · In-depth readings available today: <strong>{limit}</strong>
        </p>
        {isAnonymous && user && (
          <p className="readable-muted text-[0.95rem] mt-2">
            Sign in with Google to keep this session and get more in-depth readings per day.
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

    </div>
  );
};
