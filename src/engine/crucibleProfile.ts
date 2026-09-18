/**
 * Persistent My Crucible Profile — scoped to signed-in Firebase uid when available.
 */

import { CrucibleProfile, TemporalInput } from '../types';

const LEGACY_STORAGE_KEY = 'crucible.profiles.v1';
const LEGACY_ACTIVE_KEY = 'crucible.activeProfileId.v1';

let activeUid: string | null = null;

function profilesKey(uid?: string | null): string {
  return uid ? `crucible.profiles.v1.${uid}` : LEGACY_STORAGE_KEY;
}

function activeKey(uid?: string | null): string {
  return uid ? `crucible.activeProfileId.v1.${uid}` : LEGACY_ACTIVE_KEY;
}

export function setProfileStorageUid(uid: string | null): void {
  activeUid = uid;
}

function uid(): string {
  return `profile-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function migrateLegacyProfilesToUid(firebaseUid: string): void {
  if (typeof localStorage === 'undefined') return;
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  const scopedKey = profilesKey(firebaseUid);
  if (!legacy || localStorage.getItem(scopedKey)) return;

  localStorage.setItem(scopedKey, legacy);
  const legacyActive = localStorage.getItem(LEGACY_ACTIVE_KEY);
  if (legacyActive) localStorage.setItem(activeKey(firebaseUid), legacyActive);
}

export function loadProfiles(forUid?: string | null): CrucibleProfile[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(profilesKey(forUid ?? activeUid));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CrucibleProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProfiles(profiles: CrucibleProfile[], forUid?: string | null): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(profilesKey(forUid ?? activeUid), JSON.stringify(profiles));
}

export function getActiveProfileId(forUid?: string | null): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(activeKey(forUid ?? activeUid));
}

export function setActiveProfileId(id: string | null, forUid?: string | null): void {
  if (typeof localStorage === 'undefined') return;
  const key = activeKey(forUid ?? activeUid);
  if (!id) localStorage.removeItem(key);
  else localStorage.setItem(key, id);
}

export function getActiveProfile(forUid?: string | null): CrucibleProfile | null {
  const id = getActiveProfileId(forUid);
  if (!id) return null;
  return loadProfiles(forUid).find((p) => p.id === id) || null;
}

export function upsertProfile(
  partial: {
    id?: string;
    displayName: string;
    querentName: string;
    birth: TemporalInput;
    birthTimeConfidence?: CrucibleProfile['birthTimeConfidence'];
    birthTimeWindowStart?: string;
    birthTimeWindowEnd?: string;
    notes?: string;
  },
  forUid?: string | null
): CrucibleProfile {
  const now = new Date().toISOString();
  const uidScope = forUid ?? activeUid;
  const profiles = loadProfiles(uidScope);
  const existingIdx = partial.id ? profiles.findIndex((p) => p.id === partial.id) : -1;

  const profile: CrucibleProfile = {
    id: partial.id || (existingIdx >= 0 ? profiles[existingIdx].id : uid()),
    displayName: partial.displayName,
    querentName: partial.querentName,
    birth: partial.birth,
    birthTimeConfidence: partial.birthTimeConfidence || 'approximate',
    birthTimeWindowStart: partial.birthTimeWindowStart,
    birthTimeWindowEnd: partial.birthTimeWindowEnd,
    notes: partial.notes,
    createdAtIso: existingIdx >= 0 ? profiles[existingIdx].createdAtIso : now,
    updatedAtIso: now
  };

  if (existingIdx >= 0) profiles[existingIdx] = profile;
  else profiles.push(profile);

  saveProfiles(profiles, uidScope);
  setActiveProfileId(profile.id, uidScope);
  return profile;
}

export function deleteProfile(id: string, forUid?: string | null): void {
  const uidScope = forUid ?? activeUid;
  const next = loadProfiles(uidScope).filter((p) => p.id !== id);
  saveProfiles(next, uidScope);
  if (getActiveProfileId(uidScope) === id) setActiveProfileId(next[0]?.id || null, uidScope);
}

/** Birth-time sensitivity: compare contexts at window edges */
export function birthTimeWindowInputs(
  birth: TemporalInput,
  startTime: string,
  endTime: string
): { start: TemporalInput; end: TemporalInput } {
  return {
    start: { ...birth, timeString: startTime },
    end: { ...birth, timeString: endTime }
  };
}
