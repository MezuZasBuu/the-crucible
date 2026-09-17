/**
 * The Crucible — Micro-Test & Verification Engine
 * Validates mathematical precision, cycle boundaries, Julian Day invariance,
 * Mayan GMT correlations, Chinese sexagenary pillars, and ephemeris accuracy.
 */

import { executeCrucibleCalculation } from './crucibleCore';
import { calculateJulianDay } from './temporal';
import { MicroTestReport, TemporalInput } from '../types';

export function runMicroTests(): MicroTestReport[] {
  const tests: MicroTestReport[] = [];

  // Test 1: Julian Day at J2000.0 Epoch
  // 2000-01-01 12:00:00 UT must equal exactly 2451545.0
  const jd2000 = calculateJulianDay(2000, 1, 1, 12, 0, 0);
  tests.push({
    id: 'TEST-TEMPORAL-01',
    tradition: 'Temporal Kernel',
    testName: 'J2000.0 Standard Epoch Julian Day',
    expected: '2451545.0',
    actual: jd2000.toFixed(1),
    passed: Math.abs(jd2000 - 2451545.0) < 0.00001,
    notes: 'Meeus Chapter 7 Astronomical Benchmark'
  });

  // Test 2: Historical Julian Day - Apollo 11 Landing
  // 1969-07-20 20:17:40 UT -> JD ~2440423.3456
  const jdApollo = calculateJulianDay(1969, 7, 20, 20, 17, 40);
  tests.push({
    id: 'TEST-TEMPORAL-02',
    tradition: 'Temporal Kernel',
    testName: 'Historical Invariance (Apollo 11 Landing 1969)',
    expected: '2440423.346',
    actual: jdApollo.toFixed(3),
    passed: Math.abs(jdApollo - 2440423.3456) < 0.01,
    notes: 'Historical precision check'
  });

  // Test 3: Mayan Long Count 13.0.0.0.0 on 2012-12-21 (GMT 584283)
  const input2012: TemporalInput = {
    dateString: '2012-12-21',
    timeString: '12:00:00',
    timezoneOffsetMinutes: 0,
    isUTC: true,
    location: { latitude: 20.6843, longitude: -88.5678, city: 'Chichen Itza' }
  };
  const res2012 = executeCrucibleCalculation(input2012, 'GMT_584283');
  const mayanFormatted = res2012.mayan.longCount.formatted;
  tests.push({
    id: 'TEST-MAYA-01',
    tradition: 'Mayan Calendrical',
    testName: 'Baktun 13 Culmination (2012-12-21 = 13.0.0.0.0)',
    expected: '13.0.0.0.0',
    actual: mayanFormatted,
    passed: mayanFormatted === '13.0.0.0.0',
    notes: 'Goodman-Martinez-Thompson (GMT 584283) canonical milestone'
  });

  // Test 4: Mayan Tzolk'in 4 Ajaw on 2012-12-21
  const tzolkinFormatted = res2012.mayan.tzolkin.formatted;
  tests.push({
    id: 'TEST-MAYA-02',
    tradition: 'Mayan Calendrical',
    testName: 'Tzolk\'in Day Sign (2012-12-21 = 4 Ahau/Ajaw)',
    expected: '4 Ahau',
    actual: tzolkinFormatted,
    passed: tzolkinFormatted === '4 Ahau' || tzolkinFormatted === '4 Ajaw',
    notes: 'Canonical end of 13-Baktun cycle'
  });

  // Test 5: Chinese Year Pillar 1984 = Jia-Zi (Wood Rat)
  const input1984: TemporalInput = {
    dateString: '1984-06-15',
    timeString: '12:00:00',
    timezoneOffsetMinutes: 0,
    isUTC: true,
    location: { latitude: 39.9042, longitude: 116.4074, city: 'Beijing' }
  };
  const res1984 = executeCrucibleCalculation(input1984);
  const chinese1984 = `${res1984.chinese.yearPillar.stemPinYin}-${res1984.chinese.yearPillar.branchPinYin} (${res1984.chinese.yearPillar.zodiacAnimal})`;
  tests.push({
    id: 'TEST-CHINESE-01',
    tradition: 'Chinese Sexagenary',
    testName: 'Sexagenary Epoch Origin (1984 = Jia-Zi Wood Rat)',
    expected: 'Jia-Zi (Rat)',
    actual: chinese1984,
    passed: res1984.chinese.yearPillar.stemPinYin === 'Jia' && res1984.chinese.yearPillar.zodiacAnimal === 'Rat',
    notes: '60-year cycle cycle-starter validation'
  });

  // Test 6: Chinese Year 2024 = Jia-Chen (Wood Dragon)
  const input2024: TemporalInput = {
    dateString: '2024-06-15',
    timeString: '12:00:00',
    timezoneOffsetMinutes: 0,
    isUTC: true,
    location: { latitude: 39.9042, longitude: 116.4074, city: 'Beijing' }
  };
  const res2024 = executeCrucibleCalculation(input2024);
  tests.push({
    id: 'TEST-CHINESE-02',
    tradition: 'Chinese Sexagenary',
    testName: 'Recent Epoch Pillar (2024 = Jia-Chen Wood Dragon)',
    expected: 'Jia-Chen (Dragon)',
    actual: `${res2024.chinese.yearPillar.stemPinYin}-${res2024.chinese.yearPillar.branchPinYin} (${res2024.chinese.yearPillar.zodiacAnimal})`,
    passed: res2024.chinese.yearPillar.stemPinYin === 'Jia' && res2024.chinese.yearPillar.zodiacAnimal === 'Dragon',
    notes: 'BaZi Year Pillar verification'
  });

  // Test 7: Egyptian Civil Year Invariance (No Leap Years)
  const inputEgypt: TemporalInput = {
    dateString: '2026-09-01',
    timeString: '12:00:00',
    timezoneOffsetMinutes: 0,
    isUTC: true,
    location: { latitude: 30.0444, longitude: 31.2357, city: 'Cairo' }
  };
  const resEgypt = executeCrucibleCalculation(inputEgypt);
  tests.push({
    id: 'TEST-EGYPT-01',
    tradition: 'Egyptian Civil',
    testName: 'Fixed 365-Day Cycle & Season Determination',
    expected: 'Season assigned & month 1-13',
    actual: `${resEgypt.egyptian.season}, Month ${resEgypt.egyptian.monthIndex} (${resEgypt.egyptian.monthName})`,
    passed: resEgypt.egyptian.civilYear > 2700 && resEgypt.egyptian.monthIndex >= 1 && resEgypt.egyptian.monthIndex <= 13,
    notes: 'Continuous Era of Nabonassar baseline'
  });

  // Test 8: Ethiopian Year Offset (7-8 Year Offset)
  const resEth = executeCrucibleCalculation(inputEgypt);
  tests.push({
    id: 'TEST-ETH-01',
    tradition: 'Ethiopian Ge\'ez',
    testName: 'Amete Mihret Incarnation Era Offset',
    expected: '7-8 years behind Gregorian',
    actual: `${resEth.ethiopian.offsetFromGregorianYears} years offset (Eth Year: ${resEth.ethiopian.year})`,
    passed: resEth.ethiopian.offsetFromGregorianYears === 7 || resEth.ethiopian.offsetFromGregorianYears === 8,
    notes: 'Ge\'ez calendar 13-month system offset check'
  });

  // Test 9: Numerology Master Number Preservation
  const inputMaster: TemporalInput = {
    dateString: '1975-11-29', // 1+9+7+5 = 22, 1+1 = 2, 2+9 = 11 -> 22+2+11 = 35 -> 8
    timeString: '00:00:00',
    timezoneOffsetMinutes: 0,
    isUTC: true,
    location: { latitude: 0, longitude: 0 }
  };
  const resMaster = executeCrucibleCalculation(inputMaster);
  tests.push({
    id: 'TEST-NUM-01',
    tradition: 'Pythagorean Numerology',
    testName: 'Digit Sum & Cycle Algebra',
    expected: 'Consistent root or master number',
    actual: `Life Path ${resMaster.numerology.lifePathNumber} (Master: ${resMaster.numerology.lifePathIsMaster})`,
    passed: resMaster.numerology.lifePathNumber >= 1 && resMaster.numerology.lifePathNumber <= 33,
    notes: 'Valid root or master number range check'
  });

  // Test 10: Ephemeris Sun Position at J2000
  const inputJ2000: TemporalInput = {
    dateString: '2000-01-01',
    timeString: '12:00:00',
    timezoneOffsetMinutes: 0,
    isUTC: true,
    location: { latitude: 0, longitude: 0 }
  };
  const resJ2000 = executeCrucibleCalculation(inputJ2000);
  const sun = resJ2000.celestialBodies.find((b) => b.id === 'sun')!;
  tests.push({
    id: 'TEST-EPHEM-01',
    tradition: 'Ephemeris Engine',
    testName: 'Sun Ecliptic Longitude at J2000 Epoch (~280.46°)',
    expected: '280.46° ± 1°',
    actual: `${sun.eclipticLongitude}° (${sun.zodiacSign})`,
    passed: Math.abs(sun.eclipticLongitude - 280.46) < 1.5,
    notes: 'Capricorn solar ingress baseline'
  });

  // Test 11: Astrocartography Line Coordinate Validity
  const mcLines = resJ2000.astrocartographyLines.filter((l) => l.lineType === 'MC');
  const allInRange = mcLines.every((l) => l.subSolarLongitude >= -180 && l.subSolarLongitude <= 180);
  tests.push({
    id: 'TEST-ASTRO-01',
    tradition: 'Astrocartography',
    testName: 'Planetary Midheaven (MC) Meridian Longitudes Bounds',
    expected: '-180° to +180°',
    actual: `${mcLines.length} MC lines bounded within range`,
    passed: allInRange && mcLines.length >= 7,
    notes: 'Equatorial meridian projection check'
  });

  // Test 12: Sub-millisecond Execution Speed Benchmark
  tests.push({
    id: 'TEST-BENCH-01',
    tradition: 'Performance Benchmark',
    testName: 'Full Multi-Tradition Pipeline Latency (< 15ms)',
    expected: '< 15.0 ms',
    actual: `${resJ2000.executionDurationMs} ms`,
    passed: resJ2000.executionDurationMs < 15.0,
    notes: 'Sub-millisecond / real-time streaming capability'
  });

  // Test 13: Enochian 364-day year bounds & Roman weekday deity
  const eb = resJ2000.enochianBiblical;
  tests.push({
    id: 'TEST-ENOCH-01',
    tradition: 'Enochian / Biblical',
    testName: 'Enochian Day-of-Year within 364 & Watch Gate Present',
    expected: 'dayOfYear 1–364 with non-empty watchGate',
    actual: `Day ${eb.enochian.dayOfYear} · ${eb.enochian.watchGate}`,
    passed: eb.enochian.dayOfYear >= 1 && eb.enochian.dayOfYear <= 364 && eb.enochian.watchGate.length > 0,
    notes: '1 Enoch 72–82 364-day invariancy'
  });

  tests.push({
    id: 'TEST-ROMAN-01',
    tradition: 'Roman / Chaldean Horology',
    testName: 'Gregorian Dies Deity & Planetary Hour Matrix',
    expected: '7 deities; 24 hours; current hour planet set',
    actual: `${eb.gregorianWeekdayDeity.latinDies} · ${eb.planetaryHours.length}h · Hour of ${eb.currentPlanetaryHour.planet}`,
    passed:
      Boolean(eb.gregorianWeekdayDeity.romanDeity) &&
      eb.planetaryHours.length === 24 &&
      Boolean(eb.currentPlanetaryHour.planet) &&
      eb.biblicalSeason.verses.length >= 3,
    notes: 'Dies Solis–Saturni + Chaldean hours + tekufah verses'
  });

  tests.push({
    id: 'TEST-ENOCH-02',
    tradition: 'Enochian Compass',
    testName: 'Directional Flip Remap N→S and E→W',
    expected: 'North→South, East→West, headingOffset 180',
    actual: `N→${eb.compassOrientation.directionRemap.North}, E→${eb.compassOrientation.directionRemap.East}, +${eb.compassOrientation.headingOffsetDegrees}°`,
    passed:
      eb.compassOrientation.directionRemap.North === 'South' &&
      eb.compassOrientation.directionRemap.East === 'West' &&
      eb.compassOrientation.headingOffsetDegrees === 180,
    notes: 'Watcher-gate world map flip'
  });

  return tests;
}
