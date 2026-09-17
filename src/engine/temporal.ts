/**
 * The Crucible — Temporal Kernel
 * Pure deterministic calendrical & sidereal calculations.
 * Adheres to IAU standards, astronomical Julian Day algorithms (Meeus), and deterministic hashing.
 */

import { LocationCoordinates, TemporalCoordinate, TemporalInput } from '../types';

/**
 * Calculates Julian Day number from Year, Month, Day and decimal Day fraction (UT).
 * Algorithm from Jean Meeus, Astronomical Algorithms (Chapter 7).
 */
export function calculateJulianDay(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0
): number {
  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const d = day + (hour + minute / 60 + second / 3600) / 24;

  // Gregorian calendar reform adopted 1582-10-15
  const isGregorian = year > 1582 || (year === 1582 && (month > 10 || (month === 10 && day >= 15)));

  let b = 0;
  if (isGregorian) {
    const a = Math.floor(y / 100);
    b = 2 - a + Math.floor(a / 4);
  }

  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
  return jd;
}

/**
 * Approximate Delta T (TT - UT) in seconds based on Espenak & Meeus (NASA/GSFC polynomial).
 */
export function approximateDeltaT(year: number): number {
  const t = (year - 2000) / 100;
  if (year >= 2000 && year <= 2100) {
    return 62.92 + 0.32217 * (year - 2000) + 0.005589 * Math.pow(year - 2000, 2);
  } else if (year >= 1800 && year < 2000) {
    return -20 + 32 * Math.pow(t, 2);
  } else if (year >= 1700 && year < 1800) {
    const y = year - 1700;
    return 8.83 + 0.1603 * y - 0.0059285 * Math.pow(y, 2) + 0.00013336 * Math.pow(y, 3);
  }
  return 69.184; // Standard contemporary epoch constant
}

/**
 * Calculates Greenwich Mean Sidereal Time in hours (0 to 24) from Julian Day UT.
 */
export function calculateGMST(jdUT: number): number {
  const T = (jdUT - 2451545.0) / 36525.0;
  // GMST at 0h UT in seconds
  let gmstSeconds = 280.46061837 + 360.98564736629 * (jdUT - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000;
  gmstSeconds = ((gmstSeconds % 360) + 360) % 360;
  // Convert degrees to hours (1 hour = 15 degrees)
  return gmstSeconds / 15.0;
}

/**
 * Calculates Local Sidereal Time in hours (0 to 24).
 */
export function calculateLST(gmstHours: number, longitudeDegrees: number): number {
  const longitudeHours = longitudeDegrees / 15.0;
  let lst = (gmstHours + longitudeHours) % 24;
  if (lst < 0) lst += 24;
  return lst;
}

/**
 * Check if Gregorian year is leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Convert Gregorian date to Julian calendar date
 */
export function gregorianToJulianCalendar(year: number, month: number, day: number): { year: number; month: number; day: number } {
  // Compute Julian Day from Gregorian
  const jd = calculateJulianDay(year, month, day, 12, 0, 0);
  const z = Math.floor(jd + 0.5);
  const b = z;
  const c = b + 1524;
  const d = Math.floor((c - 122.1) / 365.25);
  const e = Math.floor(365.25 * d);
  const g = Math.floor((c - e) / 30.6001);
  const jDay = c - e - Math.floor(30.6001 * g);
  const jMonth = g < 14 ? g - 1 : g - 13;
  const jYear = jMonth > 2 ? d - 4716 : d - 4715;
  return { year: jYear, month: jMonth, day: jDay };
}

/**
 * Normalizes user input into a canonical TemporalCoordinate structure.
 */
export function normalizeTemporal(input: TemporalInput): TemporalCoordinate {
  const [yearStr, monthStr, dayStr] = input.dateString.split('-');
  const [hourStr, minStr, secStr] = input.timeString.split(':');

  const localYear = parseInt(yearStr, 10);
  const localMonth = parseInt(monthStr, 10);
  const localDay = parseInt(dayStr, 10);
  const localHour = parseInt(hourStr || '0', 10);
  const localMin = parseInt(minStr || '0', 10);
  const localSec = parseInt(secStr || '0', 10);

  // Apply timezone offset to get UTC
  // timezoneOffsetMinutes is minutes to subtract from local to get UTC (e.g. UTC-7 is -420, so local - (-420) => local + 7h)
  const localMs = Date.UTC(localYear, localMonth - 1, localDay, localHour, localMin, localSec);
  const utcMs = input.isUTC ? localMs : localMs - input.timezoneOffsetMinutes * 60000;
  const utcDate = new Date(utcMs);

  const utcYear = utcDate.getUTCFullYear();
  const utcMonth = utcDate.getUTCMonth() + 1;
  const utcDay = utcDate.getUTCDate();
  const utcHour = utcDate.getUTCHours();
  const utcMin = utcDate.getUTCMinutes();
  const utcSec = utcDate.getUTCSeconds();

  const jdUT = calculateJulianDay(utcYear, utcMonth, utcDay, utcHour, utcMin, utcSec);
  const deltaT = approximateDeltaT(utcYear);
  const jdTT = jdUT + deltaT / 86400;

  const gmst = calculateGMST(jdUT);
  const lst = calculateLST(gmst, input.location.longitude);

  const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = dayOfWeekNames[utcDate.getUTCDay()];

  // Day of year
  const startOfYear = Date.UTC(utcYear, 0, 1);
  const dayOfYear = Math.floor((utcMs - startOfYear) / 86400000) + 1;

  const julianCal = gregorianToJulianCalendar(utcYear, utcMonth, utcDay);

  return {
    isoString: utcDate.toISOString(),
    utcDateString: `${utcYear.toString().padStart(4, '0')}-${utcMonth.toString().padStart(2, '0')}-${utcDay.toString().padStart(2, '0')}`,
    utcTimeString: `${utcHour.toString().padStart(2, '0')}:${utcMin.toString().padStart(2, '0')}:${utcSec.toString().padStart(2, '0')}`,
    julianDayUT: Math.round(jdUT * 1000000) / 1000000,
    julianDayTT: Math.round(jdTT * 1000000) / 1000000,
    deltaTSeconds: Math.round(deltaT * 1000) / 1000,
    greenwichMeanSiderealTimeHours: Math.round(gmst * 10000) / 10000,
    localSiderealTimeHours: Math.round(lst * 10000) / 10000,
    isGregorianLeapYear: isLeapYear(utcYear),
    julianCalendarDate: julianCal,
    dayOfWeek,
    dayOfYear
  };
}

/** Inverse Julian Day → UTC calendar (Meeus Ch. 7). */
export function julianDayToUtcParts(jd: number): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const jd0 = jd + 0.5;
  const Z = Math.floor(jd0);
  const F = jd0 - Z;
  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const dayFrac = B - D - Math.floor(30.6001 * E) + F;
  const day = Math.floor(dayFrac);
  const frac = dayFrac - day;
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;
  const totalSec = Math.round(frac * 86400);
  const hour = Math.floor(totalSec / 3600);
  const minute = Math.floor((totalSec % 3600) / 60);
  const second = totalSec % 60;
  return { year, month, day, hour, minute, second };
}

export function temporalInputFromJulianDay(jd: number, template: TemporalInput): TemporalInput {
  const p = julianDayToUtcParts(jd);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    ...template,
    dateString: `${String(p.year).padStart(4, '0')}-${pad(p.month)}-${pad(p.day)}`,
    timeString: `${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}`,
    isUTC: true
  };
}

/**
 * Fast deterministic string hash (32-bit FNV-1a converted to hex string)
 */
export function hashString(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return ('0000000' + (hash >>> 0).toString(16)).slice(-8);
}
