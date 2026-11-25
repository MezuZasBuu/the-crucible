/**
 * Shared celestial / field helpers — single source of truth for lunar phase,
 * illumination, and related metrics used by Gaia, daily report, and forks.
 * Epistemic class: SPECULATIVE_SYNTHESIS for Gaia proxies; COMPUTED for lunar geometry.
 */

import { CelestialCoordinate, EpistemicClass } from '../types';

export function lunarPhaseFromLongitudes(
  sunLong: number,
  moonLong: number
): {
  phaseAngle: number;
  illuminationPercent: number;
  phaseName: string;
  epistemicClass: EpistemicClass;
} {
  // Elongation: how far the Moon is ahead of the Sun (0° new, 180° full, 360° new again).
  const elongation = (((moonLong - sunLong) % 360) + 360) % 360;
  const phaseAngle = elongation > 180 ? 360 - elongation : elongation;
  const illuminationPercent = Math.round(((1 - Math.cos((phaseAngle * Math.PI) / 180)) / 2) * 100);

  let phaseName = 'New Moon';
  if (elongation < 10 || elongation >= 350) phaseName = 'New Moon';
  else if (elongation < 80) phaseName = 'Waxing Crescent';
  else if (elongation < 100) phaseName = 'First Quarter';
  else if (elongation < 170) phaseName = 'Waxing Gibbous';
  else if (elongation < 190) phaseName = 'Full Moon';
  else if (elongation < 260) phaseName = 'Waning Gibbous';
  else if (elongation < 280) phaseName = 'Last Quarter';
  else phaseName = 'Waning Crescent';

  return {
    phaseAngle,
    illuminationPercent,
    phaseName,
    epistemicClass: 'COMPUTED_GEOMETRY'
  };
}

export function lunarMetricsFromBodies(bodies: CelestialCoordinate[]) {
  const sun = bodies.find((b) => b.id === 'sun') || { eclipticLongitude: 0 };
  const moon = bodies.find((b) => b.id === 'moon') || { eclipticLongitude: 0 };
  return lunarPhaseFromLongitudes(sun.eclipticLongitude, moon.eclipticLongitude);
}

export function aspectAngle(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export function isHardAspect(angle: number, orb = 8): boolean {
  return (
    Math.abs(angle - 0) < orb ||
    Math.abs(angle - 90) < orb ||
    Math.abs(angle - 180) < orb
  );
}
