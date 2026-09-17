/**
 * Honest regional context: daylight, season, and what location actually changes.
 */

import { CompleteCalculationContext, CrucibleProfile, LocalReadingContext } from '../types';
import { WORLD_DEFAULT_LOCATION } from './defaultLocation';

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function formatClock(hours: number): string {
  const wrapped = ((hours % 24) + 24) % 24;
  const h = Math.floor(wrapped);
  const m = Math.round((wrapped - h) * 60);
  const hh = String(h + (m === 60 ? 1 : 0)).padStart(2, '0');
  const mm = String(m === 60 ? 0 : m).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function approximateSolarTimes(
  dayOfYear: number,
  latitude: number,
  _longitude: number
): { sunrise: string; sunset: string } {
  const decl = 23.44 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);
  const latRad = (latitude * Math.PI) / 180;
  const declRad = (decl * Math.PI) / 180;
  const cosHa = clamp(-Math.tan(latRad) * Math.tan(declRad), -1, 1);
  const haHours = (Math.acos(cosHa) * 180) / Math.PI / 15;
  const solarNoon = 12;
  return {
    sunrise: formatClock(solarNoon - haHours),
    sunset: formatClock(solarNoon + haHours)
  };
}

function formatDateLabel(dateString: string, dayOfWeek: string): string {
  const [y, m, d] = dateString.split('-').map(Number);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${dayOfWeek}, ${months[(m || 1) - 1]} ${d}, ${y}`;
}

export function buildLocalReadingContext(
  ctx: CompleteCalculationContext,
  profile: CrucibleProfile | null
): LocalReadingContext {
  const loc = ctx.input.location;
  const cityLabel =
    loc.city?.trim() ||
    `${Math.abs(loc.latitude).toFixed(2)}°${loc.latitude >= 0 ? 'N' : 'S'}, ${Math.abs(loc.longitude).toFixed(2)}°${loc.longitude >= 0 ? 'E' : 'W'}`;

  const { sunrise, sunset } = approximateSolarTimes(ctx.temporal.dayOfYear, loc.latitude, loc.longitude);
  const moonPhase = ctx.gaiaOvercast?.lunarPhaseName || 'Moon phase unavailable';
  const seasonalNote = `${ctx.chinese.solarTerm.name} · ${ctx.egyptian.season}`;
  const isWorldDefault =
    Math.abs(loc.latitude - WORLD_DEFAULT_LOCATION.latitude) < 0.01 &&
    Math.abs(loc.longitude - WORLD_DEFAULT_LOCATION.longitude) < 0.01;

  return {
    cityLabel: isWorldDefault ? 'World · UTC (no regional overlay)' : cityLabel,
    localTime: ctx.input.timeString.slice(0, 5),
    dateLabel: formatDateLabel(ctx.input.dateString, ctx.temporal.dayOfWeek),
    sunrise,
    sunset,
    moonPhase,
    seasonalNote,
    locationDependentInputs: [
      'Local clock and weekday',
      'Approximate sunrise and sunset',
      'Horizon and sidereal time for the map',
      'Chinese hour pillar (when time is set)'
    ],
    personal: Boolean(profile),
    personalName: profile?.displayName || profile?.querentName || undefined
  };
}
