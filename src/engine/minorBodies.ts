/**
 * Minor bodies — asteroids (mean-motion) + symbolic lunar telemetry
 */

import { CelestialCoordinate, TemporalCoordinate } from '../types';
import { ZODIAC_SIGNS } from './ephemeris';
import { MAJOR_ASTEROIDS, SOLAR_SYSTEM_MOONS } from './longTermResonance';

const ASTEROID_ORBITS = [
  { id: 'ceres', baseLong: 80.25, dailyMotion: 0.2141 },
  { id: 'pallas', baseLong: 173.1, dailyMotion: 0.2135 },
  { id: 'juno', baseLong: 248.6, dailyMotion: 0.2254 },
  { id: 'vesta', baseLong: 151.2, dailyMotion: 0.2715 },
  { id: 'chiron', baseLong: 108.2, dailyMotion: 0.01954 },
  { id: 'astraea', baseLong: 203.4, dailyMotion: 0.2618 }
];

function bodyFromLongitude(
  id: string,
  name: string,
  symbol: string,
  eclipticLong: number,
  speed: number,
  isRetrograde = false
): CelestialCoordinate {
  const lon = ((eclipticLong % 360) + 360) % 360;
  const signIndex = Math.floor(lon / 30);
  return {
    id,
    name,
    symbol,
    eclipticLongitude: Math.round(lon * 1000) / 1000,
    eclipticLatitude: 0,
    rightAscensionHours: 0,
    declinationDegrees: 0,
    zodiacSign: ZODIAC_SIGNS[signIndex].name,
    signDegree: Math.round((lon % 30) * 100) / 100,
    isRetrograde,
    speedDegreesPerDay: speed
  };
}

/** Asteroid positions — crucible mean-motion layer (not JPL Horizons). */
export function calculateMinorAsteroids(temporal: TemporalCoordinate): CelestialCoordinate[] {
  const d = temporal.julianDayUT - 2451545.0;
  return MAJOR_ASTEROIDS.filter((meta) => meta.id !== 'chiron').map((meta) => {
    const orbit = ASTEROID_ORBITS.find((o) => o.id === meta.id) || ASTEROID_ORBITS[0];
    const lon = (orbit.baseLong + orbit.dailyMotion * d) % 360;
    const rx = meta.id === 'chiron' && Math.sin(d / 120) > 0.85;
    return bodyFromLongitude(meta.id, meta.name, meta.symbol, lon, orbit.dailyMotion, rx);
  });
}

export interface SymbolicMoonTelemetry {
  parentBody: string;
  moonName: string;
  symbol: string;
  eclipticLongitude: number;
  zodiacSign: string;
  signDegree: number;
  note: string;
}

/** Symbolic moon longitudes anchored to parent planet + slow drift. */
export function calculateSymbolicMoons(
  temporal: TemporalCoordinate,
  majorBodies: CelestialCoordinate[]
): SymbolicMoonTelemetry[] {
  const d = temporal.julianDayUT - 2451545.0;
  const parentLong = (id: string) => majorBodies.find((b) => b.id === id)?.eclipticLongitude ?? 0;

  const anchors: Record<string, string> = {
    Jupiter: 'jupiter',
    Saturn: 'saturn',
    Earth: 'moon',
    Mars: 'mars'
  };

  return SOLAR_SYSTEM_MOONS.map((m, idx) => {
    const parentId = anchors[m.system] || 'sun';
    const base = parentLong(parentId);
    const lon = (base + idx * 17.3 + d * 0.04) % 360;
    const signIndex = Math.floor(lon / 30);
    return {
      parentBody: m.system,
      moonName: m.moon,
      symbol: m.symbol,
      eclipticLongitude: Math.round(lon * 100) / 100,
      zodiacSign: ZODIAC_SIGNS[signIndex].name,
      signDegree: Math.round((lon % 30) * 100) / 100,
      note: m.energeticQuality
    };
  });
}
