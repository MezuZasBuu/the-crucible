/**
 * Chart geometry — tropical wheel, Ascendant / Midheaven, and house cusps.
 * Planet longitudes come from calculateEphemeris; this module only places them.
 *
 * Houses: Placidus by default (the most widely used system in Western astrology),
 * with Whole Sign available and used as the fallback near the polar circles,
 * where Placidus is undefined.
 */

import { CelestialCoordinate, TemporalCoordinate } from '../types';
import { ZODIAC_SIGNS } from './ephemeris';

const OBLIQUITY = 23.4392911;
const RAD = Math.PI / 180;

export type HouseSystem = 'placidus' | 'whole_sign';

export interface ChartAngles {
  ascendantDeg: number;
  midheavenDeg: number;
  descendantDeg: number;
  imumCoeliDeg: number;
  ramcDeg: number;
}

export interface HouseCusp {
  house: number;
  longitude: number;
  sign: string;
}

export interface ChartLayout {
  mode: 'natal' | 'current-sky';
  hasAngles: boolean;
  angles?: ChartAngles;
  houses: HouseCusp[];
  houseSystem: HouseSystem | 'none';
  limitation?: string;
}

export function wrap360(n: number): number {
  return ((n % 360) + 360) % 360;
}

function signName(longitude: number): string {
  return ZODIAC_SIGNS[Math.floor(wrap360(longitude) / 30) % 12].name;
}

/** Ecliptic longitude of the ecliptic point with the given right ascension. */
function longitudeFromRA(raDeg: number): number {
  const ra = raDeg * RAD;
  return wrap360(Math.atan2(Math.sin(ra), Math.cos(ra) * Math.cos(OBLIQUITY * RAD)) / RAD);
}

/** RAMC / ASC / MC from local sidereal time and geographic latitude. */
export function computeChartAngles(temporal: TemporalCoordinate, latitudeDeg: number): ChartAngles {
  const ramcDeg = wrap360(temporal.localSiderealTimeHours * 15);
  const ramc = ramcDeg * RAD;
  const eps = OBLIQUITY * RAD;
  const lat = latitudeDeg * RAD;

  const mc = longitudeFromRA(ramcDeg);

  // Ascendant: the ecliptic degree rising on the eastern horizon.
  const asc = wrap360(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps))) / RAD);

  const round = (n: number) => Math.round(n * 100) / 100;
  return {
    ascendantDeg: round(asc),
    midheavenDeg: round(mc),
    descendantDeg: round(wrap360(asc + 180)),
    imumCoeliDeg: round(wrap360(mc + 180)),
    ramcDeg: round(ramcDeg)
  };
}

export function wholeSignHouses(ascendantDeg: number): HouseCusp[] {
  const h1 = Math.floor(wrap360(ascendantDeg) / 30) * 30;
  return Array.from({ length: 12 }, (_, i) => {
    const longitude = wrap360(h1 + i * 30);
    return { house: i + 1, longitude, sign: signName(longitude) };
  });
}

/**
 * Placidus cusps by iteration on the semi-arc: cusps 11 and 12 trisect the
 * diurnal semi-arc from the Midheaven; cusps 2 and 3 trisect the nocturnal
 * semi-arc toward the IC. Returns null where the system is undefined.
 */
export function placidusHouses(angles: ChartAngles, latitudeDeg: number): HouseCusp[] | null {
  if (Math.abs(latitudeDeg) > 66) return null;
  const eps = OBLIQUITY * RAD;
  const tanLat = Math.tan(latitudeDeg * RAD);

  const cusp = (fraction: number, nocturnal: boolean): number | null => {
    let ra = angles.ramcDeg + (nocturnal ? 180 - fraction * 90 : fraction * 90);
    for (let i = 0; i < 30; i++) {
      const decl = Math.atan(Math.tan(eps) * Math.sin(ra * RAD));
      const x = tanLat * Math.tan(decl);
      if (Math.abs(x) >= 1) return null;
      const ascDiff = Math.asin(x) / RAD;
      const next = nocturnal
        ? angles.ramcDeg + 180 - fraction * (90 - ascDiff)
        : angles.ramcDeg + fraction * (90 + ascDiff);
      if (Math.abs(next - ra) < 1e-6) {
        ra = next;
        break;
      }
      ra = next;
    }
    return longitudeFromRA(ra);
  };

  const c11 = cusp(1 / 3, false);
  const c12 = cusp(2 / 3, false);
  const c2 = cusp(2 / 3, true);
  const c3 = cusp(1 / 3, true);
  if (c11 === null || c12 === null || c2 === null || c3 === null) return null;

  const longitudes = [
    angles.ascendantDeg,
    c2,
    c3,
    angles.imumCoeliDeg,
    wrap360(c11 + 180),
    wrap360(c12 + 180),
    angles.descendantDeg,
    wrap360(c2 + 180),
    wrap360(c3 + 180),
    angles.midheavenDeg,
    c11,
    c12
  ];

  // Cusps must advance through the zodiac; if not, the result is unusable.
  for (let i = 0; i < 12; i++) {
    const step = wrap360(longitudes[(i + 1) % 12] - longitudes[i]);
    if (step <= 0 || step >= 180) return null;
  }

  return longitudes.map((longitude, i) => ({
    house: i + 1,
    longitude: Math.round(longitude * 100) / 100,
    sign: signName(longitude)
  }));
}

/** Which house (1–12) a longitude falls in, for any cusp list. */
export function houseOf(longitude: number, houses: HouseCusp[]): number | undefined {
  if (houses.length !== 12) return undefined;
  const lon = wrap360(longitude);
  for (let i = 0; i < 12; i++) {
    const start = houses[i].longitude;
    const span = wrap360(houses[(i + 1) % 12].longitude - start);
    if (wrap360(lon - start) < span) return houses[i].house;
  }
  return undefined;
}

export function buildChartLayout(args: {
  temporal: TemporalCoordinate;
  latitude: number;
  mode: 'natal' | 'current-sky';
  birthTimeConfidence?: 'exact' | 'approximate' | 'unknown_window';
  houseSystem?: HouseSystem;
}): ChartLayout {
  const { temporal, latitude, mode, birthTimeConfidence, houseSystem = 'placidus' } = args;
  if (mode === 'natal' && birthTimeConfidence === 'unknown_window') {
    return {
      mode,
      hasAngles: false,
      houses: [],
      houseSystem: 'none',
      limitation: 'Houses, rising sign, and Midheaven need a birth time. Planet positions are still shown.'
    };
  }

  const angles = computeChartAngles(temporal, latitude);
  const placidus = houseSystem === 'placidus' ? placidusHouses(angles, latitude) : null;
  const notes: string[] = [];
  if (houseSystem === 'placidus' && !placidus) {
    notes.push('Placidus houses are not defined this far north or south, so Whole Sign houses are shown.');
  }
  if (mode === 'natal' && birthTimeConfidence === 'approximate') {
    notes.push('Birth time is approximate — houses and rising sign are tentative.');
  }

  return {
    mode,
    hasAngles: true,
    angles,
    houses: placidus ?? wholeSignHouses(angles.ascendantDeg),
    houseSystem: placidus ? 'placidus' : 'whole_sign',
    limitation: notes.length ? notes.join(' ') : undefined
  };
}

/** SVG angle (degrees, clockwise from 3 o'clock) with the Ascendant at 9 o'clock. */
export function svgAngleForLongitude(longitude: number, ascendantDeg?: number): number {
  const origin = ascendantDeg ?? 0;
  return 180 - (wrap360(longitude) - wrap360(origin));
}

export function polar(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
  const rad = angleDeg * RAD;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function luminarySummary(bodies: CelestialCoordinate[]): { sun?: CelestialCoordinate; moon?: CelestialCoordinate } {
  return {
    sun: bodies.find((b) => b.id === 'sun'),
    moon: bodies.find((b) => b.id === 'moon')
  };
}
