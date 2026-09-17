/**
 * Persistent My Crucible Profile — localStorage natal baseline.
 */

import { CrucibleProfile, TemporalInput } from '../types';

const STORAGE_KEY = 'crucible.profiles.v1';
const ACTIVE_KEY = 'crucible.activeProfileId.v1';

function uid(): string {
  return `profile-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadProfiles(): CrucibleProfile[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CrucibleProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProfiles(profiles: CrucibleProfile[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function getActiveProfileId(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveProfileId(id: string | null): void {
  if (typeof localStorage === 'undefined') return;
  if (!id) localStorage.removeItem(ACTIVE_KEY);
  else localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveProfile(): CrucibleProfile | null {
  const id = getActiveProfileId();
  if (!id) return null;
  return loadProfiles().find((p) => p.id === id) || null;
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
  }
): CrucibleProfile {
  const now = new Date().toISOString();
  const profiles = loadProfiles();
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

  saveProfiles(profiles);
  setActiveProfileId(profile.id);
  return profile;
}

export function deleteProfile(id: string): void {
  const next = loadProfiles().filter((p) => p.id !== id);
  saveProfiles(next);
  if (getActiveProfileId() === id) setActiveProfileId(next[0]?.id || null);
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
