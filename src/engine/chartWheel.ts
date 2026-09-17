/**
 * Chart geometry — tropical wheel, optional ASC/MC, whole-sign houses.
 * Mean-motion longitudes come from calculateEphemeris; this module only places them.
 */

import { CelestialCoordinate, TemporalCoordinate } from '../types';
import { ZODIAC_SIGNS } from './ephemeris';

const OBLIQUITY = 23.4392911;

export interface ChartAngles {
  ascendantDeg: number;
  midheavenDeg: number;
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
  houseSystem: 'whole_sign' | 'none';
  limitation?: string;
}

function wrap360(n: number): number {
  return ((n % 360) + 360) % 360;
}

function signName(longitude: number): string {
  return ZODIAC_SIGNS[Math.floor(wrap360(longitude) / 30)].name;
}

/** RAMC / ASC / MC from local sidereal time and geographic latitude. */
export function computeChartAngles(temporal: TemporalCoordinate, latitudeDeg: number): ChartAngles {
  const ramcDeg = wrap360(temporal.localSiderealTimeHours * 15);
  const ramc = (ramcDeg * Math.PI) / 180;
  const eps = (OBLIQUITY * Math.PI) / 180;
  const lat = (latitudeDeg * Math.PI) / 180;

  const mc = wrap360((Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps)) * 180) / Math.PI);

  const y = -Math.cos(ramc);
  const x = Math.sin(ramc) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps);
  const asc = wrap360((Math.atan2(y, x) * 180) / Math.PI);

  return { ascendantDeg: Math.round(asc * 100) / 100, midheavenDeg: Math.round(mc * 100) / 100, ramcDeg: Math.round(ramcDeg * 100) / 100 };
}

export function wholeSignHouses(ascendantDeg: number): HouseCusp[] {
  const h1 = Math.floor(wrap360(ascendantDeg) / 30) * 30;
  return Array.from({ length: 12 }, (_, i) => {
    const longitude = wrap360(h1 + i * 30);
    return { house: i + 1, longitude, sign: signName(longitude) };
  });
}

export function buildChartLayout(args: {
  temporal: TemporalCoordinate;
  latitude: number;
  mode: 'natal' | 'current-sky';
  birthTimeConfidence?: 'exact' | 'approximate' | 'unknown_window';
}): ChartLayout {
  const { temporal, latitude, mode, birthTimeConfidence } = args;
  if (mode === 'natal' && birthTimeConfidence === 'unknown_window') {
    return {
      mode,
      hasAngles: false,
      houses: [],
      houseSystem: 'none',
      limitation: 'Houses, rising sign, and Midheaven need a birth time. Sun and Moon positions are still shown.'
    };
  }

  const angles = computeChartAngles(temporal, latitude);
  return {
    mode,
    hasAngles: true,
    angles,
    houses: wholeSignHouses(angles.ascendantDeg),
    houseSystem: 'whole_sign',
    limitation:
      mode === 'natal' && birthTimeConfidence === 'approximate'
        ? 'Birth time is approximate — houses and angles are tentative.'
        : undefined
  };
}

export function svgAngleForLongitude(longitude: number, ascendantDeg?: number): number {
  const origin = ascendantDeg ?? 0;
  return 180 - (wrap360(longitude) - wrap360(origin));
}

export function polar(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function luminarySummary(bodies: CelestialCoordinate[]): { sun?: CelestialCoordinate; moon?: CelestialCoordinate } {
  return {
    sun: bodies.find((b) => b.id === 'sun'),
    moon: bodies.find((b) => b.id === 'moon')
  };
}
