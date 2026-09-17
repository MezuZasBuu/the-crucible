/**
 * Persist last selected region locally (device-only until auth ships).
 */

import { LocationCoordinates } from '../types';
import { WORLD_DEFAULT_LOCATION } from './defaultLocation';

const KEY = 'crucible.lastLocation.v1';

export function loadSavedLocation(): LocationCoordinates | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocationCoordinates;
    if (typeof parsed.latitude !== 'number' || typeof parsed.longitude !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveLocation(loc: LocationCoordinates): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(loc));
}

export function resolveInitialLocation(): LocationCoordinates {
  return loadSavedLocation() || WORLD_DEFAULT_LOCATION;
}
