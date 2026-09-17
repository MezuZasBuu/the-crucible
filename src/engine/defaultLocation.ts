/**
 * Neutral world default — sky math uses UTC meridian unless the user picks a region.
 */

import { LocationCoordinates } from '../types';

export const WORLD_DEFAULT_LOCATION: LocationCoordinates = {
  latitude: 51.4779,
  longitude: 0,
  city: 'World · UTC',
  country: 'Global'
};

export function nearestPresetLocationId(
  lat: number,
  lng: number,
  presets: Array<{ id: string; lat: number; lng: number }>
): string {
  let best = presets[0]?.id || 'london';
  let bestDist = Infinity;
  for (const p of presets) {
    const d = (p.lat - lat) ** 2 + (p.lng - lng) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = p.id;
    }
  }
  return best;
}
