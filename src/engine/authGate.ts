/**
 * Verify Firebase ID tokens and enforce per-account deep-reading quotas.
 */

import { CrucibleAccountTier } from '../types';

export interface VerifiedFirebaseUser {
  uid: string;
  email?: string;
  providerId: string;
  tier: CrucibleAccountTier;
}

export const DEEP_READING_DAILY_LIMITS: Record<CrucibleAccountTier, number> = {
  visitor: 0,
  guest: 8,
  member: 40,
  subscriber: 500
};

type UsageStore = Map<string, number>;

const memoryUsage: UsageStore = new Map();

function usageKey(uid: string): string {
  return `${uid}:${new Date().toISOString().slice(0, 10)}`;
}

function tierFromProvider(providerId: string, isAnonymous: boolean): CrucibleAccountTier {
  if (isAnonymous || providerId === 'anonymous') return 'guest';
  if (providerId === 'google.com') return 'member';
  return 'guest';
}

export async function verifyFirebaseIdToken(
  idToken: string,
  webApiKey: string
): Promise<VerifiedFirebaseUser | null> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(webApiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    users?: Array<{
      localId?: string;
      email?: string;
      providerUserInfo?: Array<{ providerId?: string }>;
    }>;
  };
  const user = data.users?.[0];
  if (!user?.localId) return null;
  const providerId = user.providerUserInfo?.[0]?.providerId || 'anonymous';
  const isAnonymous = providerId === 'anonymous' || !user.email;
  const tier = tierFromProvider(providerId, isAnonymous);
  return {
    uid: user.localId,
    email: user.email,
    providerId,
    tier
  };
}

export function extractBearerToken(header?: string | null): string | null {
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export interface RateLimitResult {
  allowed: boolean;
  used: number;
  limit: number;
  tier: CrucibleAccountTier;
  resetDate: string;
}

export function checkAndIncrementDeepReadingUsage(user: VerifiedFirebaseUser): RateLimitResult {
  const limit = DEEP_READING_DAILY_LIMITS[user.tier];
  const key = usageKey(user.uid);
  const resetDate = key.split(':')[1]!;
  const used = memoryUsage.get(key) || 0;

  if (used >= limit) {
    return { allowed: false, used, limit, tier: user.tier, resetDate };
  }

  memoryUsage.set(key, used + 1);
  return { allowed: true, used: used + 1, limit, tier: user.tier, resetDate };
}

export function peekDeepReadingUsage(uid: string, tier: CrucibleAccountTier): RateLimitResult {
  const limit = DEEP_READING_DAILY_LIMITS[tier];
  const key = usageKey(uid);
  const resetDate = key.split(':')[1]!;
  const used = memoryUsage.get(key) || 0;
  return { allowed: used < limit, used, limit, tier, resetDate };
}
