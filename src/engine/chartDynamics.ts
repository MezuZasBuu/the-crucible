/**
 * Transits, secondary progressions, returns — natal vs moment sky
 */

import { CelestialCoordinate, CompleteCalculationContext, TemporalInput } from '../types';
import { calculateEphemeris, ZODIAC_SIGNS } from './ephemeris';
import { aspectAngle } from './sharedCelestial';
import { executeCrucibleCalculation } from './crucibleCore';
import { normalizeTemporal, temporalInputFromJulianDay } from './temporal';
import { calculateMinorAsteroids, calculateSymbolicMoons, SymbolicMoonTelemetry } from './minorBodies';

export type AspectType = 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition';

export interface CrossChartAspect {
  transitingId: string;
  transitingName: string;
  transitingSymbol: string;
  natalId: string;
  natalName: string;
  natalSymbol: string;
  aspectType: AspectType;
  orbDeg: number;
  isApplying: boolean;
  harmony: 'Harmonious' | 'Dynamic Tension' | 'Unified';
  briefing: string;
  layer: 'transit' | 'progressed' | 'asteroid';
}

export interface ReturnEvent {
  kind: 'solar' | 'lunar' | 'saturn';
  label: string;
  momentIso: string;
  julianDayUT: number;
  applicable: boolean;
  briefing: string;
  context?: CompleteCalculationContext;
}

export interface ChartDynamicsReport {
  natalLabel: string;
  transitLabel: string;
  ageYears: number;
  transitToNatal: CrossChartAspect[];
  progressedToNatal: CrossChartAspect[];
  asteroidTransits: CrossChartAspect[];
  returns: ReturnEvent[];
  progressedCtx: CompleteCalculationContext;
  minorAsteroids: CelestialCoordinate[];
  symbolicMoons: SymbolicMoonTelemetry[];
  openingBriefing: string;
}

const ASPECT_RULES: Array<{ type: AspectType; angle: number; orb: number; harmony: CrossChartAspect['harmony'] }> = [
  { type: 'Conjunction', angle: 0, orb: 8, harmony: 'Unified' },
  { type: 'Sextile', angle: 60, orb: 5, harmony: 'Harmonious' },
  { type: 'Square', angle: 90, orb: 7, harmony: 'Dynamic Tension' },
  { type: 'Trine', angle: 120, orb: 8, harmony: 'Harmonious' },
  { type: 'Opposition', angle: 180, orb: 8, harmony: 'Dynamic Tension' }
];

function aspectBrief(
  tName: string,
  nName: string,
  type: AspectType,
  orb: number,
  applying: boolean,
  layer: string
): string {
  const app = applying ? 'applying' : 'separating';
  return `${layer}: transiting ${tName} ${type} natal ${nName} (${orb.toFixed(1)}° orb, ${app}). I'd read that as active ${layer} weather — not destiny.`;
}

function crossAspects(
  transitBodies: CelestialCoordinate[],
  natalBodies: CelestialCoordinate[],
  layer: CrossChartAspect['layer']
): CrossChartAspect[] {
  const out: CrossChartAspect[] = [];
  for (const t of transitBodies) {
    for (const n of natalBodies) {
      if (t.id === n.id && layer === 'transit') continue;
      const sep = aspectAngle(t.eclipticLongitude, n.eclipticLongitude);
      for (const rule of ASPECT_RULES) {
        const orb = Math.abs(sep - rule.angle);
        if (orb <= rule.orb) {
          const relSpeed = (t.speedDegreesPerDay || 0) - (n.speedDegreesPerDay || 0);
          const isApplying = relSpeed !== 0 ? relSpeed * (sep - rule.angle) < 0 : true;
          out.push({
            transitingId: t.id,
            transitingName: t.name,
            transitingSymbol: t.symbol,
            natalId: n.id,
            natalName: n.name,
            natalSymbol: n.symbol,
            aspectType: rule.type,
            orbDeg: Math.round(orb * 100) / 100,
            isApplying,
            harmony: rule.harmony,
            briefing: aspectBrief(t.name, n.name, rule.type, orb, isApplying, layer),
            layer
          });
          break;
        }
      }
    }
  }
  return out.sort((a, b) => a.orbDeg - b.orbDeg);
}

function findLongitudeReturnJD(
  bodyId: string,
  targetLong: number,
  startJD: number,
  spanDays: number,
  template: TemporalInput,
  stepHours = 6
): number {
  let bestJD = startJD;
  let bestOrb = 360;
  const steps = Math.ceil((spanDays * 24) / stepHours);
  for (let i = 0; i <= steps; i++) {
    const jd = startJD + (i * stepHours) / 24;
    const temp = normalizeTemporal(temporalInputFromJulianDay(jd, template));
    const body = calculateEphemeris(temp).find((b) => b.id === bodyId);
    if (!body) continue;
    const orb = aspectAngle(body.eclipticLongitude, targetLong);
    if (orb < bestOrb) {
      bestOrb = orb;
      bestJD = jd;
    }
  }
  return bestJD;
}

/** Secondary progressions: 1 day after birth ≈ 1 year of life. */
function secondaryProgressionJD(birthJD: number, targetJD: number): number {
  const ageYears = (targetJD - birthJD) / 365.25;
  return birthJD + ageYears;
}

export function buildChartDynamicsReport(
  natalCtx: CompleteCalculationContext,
  transitCtx: CompleteCalculationContext,
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384' = 'GMT_584283'
): ChartDynamicsReport {
  const birthJD = natalCtx.temporal.julianDayUT;
  const nowJD = transitCtx.temporal.julianDayUT;
  const ageYears = Math.round(((nowJD - birthJD) / 365.25) * 10) / 10;

  const progJD = secondaryProgressionJD(birthJD, nowJD);
  const progInput = temporalInputFromJulianDay(progJD, natalCtx.input);
  const progressedCtx = executeCrucibleCalculation(progInput, correlationKey);

  const natalSun = natalCtx.celestialBodies.find((b) => b.id === 'sun')!;
  const natalMoon = natalCtx.celestialBodies.find((b) => b.id === 'moon')!;
  const natalSaturn = natalCtx.celestialBodies.find((b) => b.id === 'saturn')!;

  const birthParts = natalCtx.input.dateString.split('-');
  const returnYear = parseInt(transitCtx.input.dateString.slice(0, 4), 10);
  const solarSearchJD = normalizeTemporal({
    ...natalCtx.input,
    dateString: `${returnYear}-${birthParts[1]}-${birthParts[2]}`,
    isUTC: natalCtx.input.isUTC
  }).julianDayUT;

  const solarReturnJD = findLongitudeReturnJD(
    'sun',
    natalSun.eclipticLongitude,
    solarSearchJD - 15,
    30,
    natalCtx.input,
    3
  );
  const lunarReturnJD = findLongitudeReturnJD(
    'moon',
    natalMoon.eclipticLongitude,
    nowJD - 2,
    28,
    natalCtx.input,
    2
  );

  const saturnCycle = 29.457;
  const saturnReturnNum = Math.round(ageYears / saturnCycle);
  const saturnNear = saturnReturnNum > 0 && Math.abs(ageYears - saturnReturnNum * saturnCycle) < 2.2;

  const solarReturnInput = temporalInputFromJulianDay(solarReturnJD, natalCtx.input);
  const lunarReturnInput = temporalInputFromJulianDay(lunarReturnJD, natalCtx.input);

  const returns: ReturnEvent[] = [
    {
      kind: 'solar',
      label: `Solar return ${returnYear}`,
      momentIso: normalizeTemporal(solarReturnInput).isoString,
      julianDayUT: solarReturnJD,
      applicable: true,
      briefing: `Sun back to natal ${natalSun.zodiacSign} ${natalSun.signDegree.toFixed(1)}° — annual reset chart for ${returnYear}.`,
      context: executeCrucibleCalculation(solarReturnInput, correlationKey)
    },
    {
      kind: 'lunar',
      label: 'Nearest lunar return',
      momentIso: normalizeTemporal(lunarReturnInput).isoString,
      julianDayUT: lunarReturnJD,
      applicable: true,
      briefing: `Moon returns to natal ${natalMoon.zodiacSign} ${natalMoon.signDegree.toFixed(1)}° — emotional/monthly pulse reset.`,
      context: executeCrucibleCalculation(lunarReturnInput, correlationKey)
    },
    {
      kind: 'saturn',
      label: saturnNear ? `Saturn return (~${saturnReturnNum})` : 'Saturn return',
      momentIso: transitCtx.temporal.isoString,
      julianDayUT: nowJD,
      applicable: saturnNear,
      briefing: saturnNear
        ? `Age ${ageYears} — within Saturn return window (cycle ~29.5y). Natal Saturn ${natalSaturn.zodiacSign} ${natalSaturn.signDegree.toFixed(1)}°${natalSaturn.isRetrograde ? ' Rx' : ''}; transit Saturn ${transitCtx.celestialBodies.find((b) => b.id === 'saturn')?.zodiacSign} ${transitCtx.celestialBodies.find((b) => b.id === 'saturn')?.signDegree.toFixed(1)}°.`
        : `Not in a tight Saturn return window (age ${ageYears}). Next major gate ~${Math.ceil(ageYears / saturnCycle) * saturnCycle} years.`
    }
  ];

  const minorAsteroids = calculateMinorAsteroids(transitCtx.temporal);
  const symbolicMoons = calculateSymbolicMoons(transitCtx.temporal, transitCtx.celestialBodies);

  const transitToNatal = crossAspects(transitCtx.celestialBodies, natalCtx.celestialBodies, 'transit');
  const progressedToNatal = crossAspects(progressedCtx.celestialBodies, natalCtx.celestialBodies, 'progressed');
  const asteroidTransits = crossAspects(minorAsteroids, natalCtx.celestialBodies, 'asteroid');

  const topTransit = transitToNatal[0];
  const topProg = progressedToNatal[0];
  const openingBriefing = `Chart dynamics for age ${ageYears}y — transit sky ${transitCtx.input.dateString} vs natal ${natalCtx.input.dateString}.
${topTransit ? `Strongest transit: ${topTransit.briefing}` : 'No major transit-to-natal aspects inside orb.'}
${topProg ? `Progressed lead: ${topProg.briefing}` : 'Progressed layer quiet inside orb.'}
Returns: solar ${returns[0].momentIso.slice(0, 10)}; lunar ${returns[1].momentIso.slice(0, 10)}${returns[2].applicable ? '; Saturn return active' : ''}.`;

  return {
    natalLabel: natalCtx.input.querentName || natalCtx.input.dateString,
    transitLabel: transitCtx.input.dateString,
    ageYears,
    transitToNatal,
    progressedToNatal,
    asteroidTransits,
    returns,
    progressedCtx,
    minorAsteroids,
    symbolicMoons,
    openingBriefing
  };
}
