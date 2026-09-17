/**
 * Dreamspell calendar grids — 13 Moon year and 20×13 Tzolkin matrix.
 * Portal highlighting uses the same 52 GAP kin list as the Maya engine,
 * labeled as a Dreamspell practice overlay, not classical Maya chronology.
 */

import { GALACTIC_PORTAL_KINS } from './mayan';
import { GALACTIC_TONES, SOLAR_SEALS, THIRTEEN_MOONS, SolarSealDef } from './dreamspell';

export interface DreamspellDayCell {
  kin: number;
  seal: SolarSealDef;
  toneNumber: number;
  toneName: string;
  isPortal: boolean;
  isLeapSkip: boolean;
  isDayOutOfTime: boolean;
  year: number;
  month: number;
  day: number;
}

export interface ThirteenMoonCell extends DreamspellDayCell {
  moonNumber: number;
  moonName: string;
  dayOfMoon: number;
  isToday: boolean;
}

/** Same elapsed-day math as calculateDreamspell, without the full narrative payload. */
export function dreamspellKinForYmd(year: number, month: number, day: number): DreamspellDayCell {
  const isLeapSkip = month === 2 && day === 29;
  const isDayOutOfTime = month === 7 && day === 25;
  const anchorDate = Date.UTC(2013, 6, 26);
  const targetDate = Date.UTC(year, month - 1, day);
  const diffDays = Math.floor((targetDate - anchorDate) / 86400000);

  let leapDaysCount = 0;
  const startYr = Math.min(2013, year);
  const endYr = Math.max(2013, year);
  for (let y = startYr; y <= endYr; y++) {
    const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    if (!isLeap) continue;
    const feb29 = Date.UTC(y, 1, 29);
    if (diffDays >= 0) {
      if (feb29 > anchorDate && feb29 <= targetDate) leapDaysCount++;
    } else if (feb29 < anchorDate && feb29 >= targetDate) {
      leapDaysCount--;
    }
  }

  if (isLeapSkip) {
    const prev = dreamspellKinForYmd(year, 2, 28);
    return { ...prev, isLeapSkip: true, year, month, day, isDayOutOfTime: false };
  }

  const dreamspellDays = diffDays - leapDaysCount;
  let rawKin = (164 + dreamspellDays) % 260;
  while (rawKin <= 0) rawKin += 260;
  const kin = rawKin;
  const seal = SOLAR_SEALS[(kin - 1) % 20];
  const tone = GALACTIC_TONES[(kin - 1) % 13];

  return {
    kin,
    seal,
    toneNumber: tone.number,
    toneName: tone.name,
    isPortal: GALACTIC_PORTAL_KINS.has(kin),
    isLeapSkip: false,
    isDayOutOfTime,
    year,
    month,
    day
  };
}

export function kinFromSealAndTone(sealIndex0: number, toneIndex0: number): number {
  for (let k = 1; k <= 260; k++) {
    if ((k - 1) % 20 === sealIndex0 && (k - 1) % 13 === toneIndex0) return k;
  }
  return 1;
}

export function buildTzolkinMatrix(): Array<Array<{ kin: number; seal: SolarSealDef; toneNumber: number; isPortal: boolean }>> {
  return SOLAR_SEALS.map((seal, sealIndex) =>
    GALACTIC_TONES.map((tone, toneIndex) => {
      const kin = kinFromSealAndTone(sealIndex, toneIndex);
      return { kin, seal, toneNumber: tone.number, isPortal: GALACTIC_PORTAL_KINS.has(kin) };
    })
  );
}

function addUtcDays(y: number, m: number, d: number, add: number): { year: number; month: number; day: number } {
  const dt = new Date(Date.UTC(y, m - 1, d + add));
  return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate() };
}

export function moonYearStart(gregorianYear: number, month: number, day: number): number {
  const july26 = Date.UTC(gregorianYear, 6, 26);
  const target = Date.UTC(gregorianYear, month - 1, day);
  return target < july26 ? gregorianYear - 1 : gregorianYear;
}

export function buildThirteenMoonYear(
  moonYear: number,
  today: { year: number; month: number; day: number }
): { moons: ThirteenMoonCell[][]; dayOutOfTime: ThirteenMoonCell } {
  const start = { year: moonYear, month: 7, day: 26 };
  const moons: ThirteenMoonCell[][] = THIRTEEN_MOONS.map((moon, moonIndex) => {
    return Array.from({ length: 28 }, (_, i) => {
      const g = addUtcDays(start.year, start.month, start.day, moonIndex * 28 + i);
      const cell = dreamspellKinForYmd(g.year, g.month, g.day);
      return {
        ...cell,
        moonNumber: moon.number,
        moonName: moon.name,
        dayOfMoon: i + 1,
        isToday: g.year === today.year && g.month === today.month && g.day === today.day
      };
    });
  });

  const dot = dreamspellKinForYmd(moonYear + 1, 7, 25);
  const dayOutOfTime: ThirteenMoonCell = {
    ...dot,
    moonNumber: 13,
    moonName: 'Day Out of Time',
    dayOfMoon: 29,
    isToday: today.year === moonYear + 1 && today.month === 7 && today.day === 25
  };

  return { moons, dayOutOfTime };
}
