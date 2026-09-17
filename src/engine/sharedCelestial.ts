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
  const sunMoonDiff = Math.abs(sunLong - moonLong) % 360;
  const phaseAngle = sunMoonDiff > 180 ? 360 - sunMoonDiff : sunMoonDiff;
  const illuminationPercent = Math.round(((1 - Math.cos((phaseAngle * Math.PI) / 180)) / 2) * 100);

  let phaseName = 'Waxing Crescent';
  if (phaseAngle < 10) phaseName = 'New Moon';
  else if (phaseAngle < 80) phaseName = 'Waxing Crescent';
  else if (phaseAngle < 100) phaseName = 'First Quarter';
  else if (phaseAngle < 170) phaseName = 'Waxing Gibbous';
  else if (phaseAngle < 190) phaseName = 'Full Moon';
  else if (phaseAngle < 260) phaseName = 'Waning Gibbous';
  else if (phaseAngle < 280) phaseName = 'Last Quarter';
  else if (phaseAngle < 350) phaseName = 'Waning Crescent';
  else phaseName = 'New Moon';

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
