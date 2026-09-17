/**
 * The Crucible — Export Engine
 * Generates structured CSV, JSON, and interactive printable PDF/HTML reports
 * with modern clean e-book typography and calculation ledger audit hashes.
 */

import { CompleteCalculationContext } from '../types';

/**
 * Generates an extensive CSV data stream from a complete calculation context.
 */
export function generateCSVReport(ctx: CompleteCalculationContext): string {
  const rows: Array<[string, string, string, string, string]> = [
    ['Category', 'Parameter', 'Value', 'Details', 'Audit Signature'],
    ['Metadata', 'Calculation ID', ctx.calculationId, `Execution Duration: ${ctx.executionDurationMs} ms`, ctx.rulesetHash],
    ['Metadata', 'Timestamp (UTC)', ctx.temporal.isoString, `Julian Day UT: ${ctx.temporal.julianDayUT}`, ctx.rulesetHash],
    ['Temporal', 'Julian Day TT', ctx.temporal.julianDayTT.toString(), `Delta T: ${ctx.temporal.deltaTSeconds} s`, ctx.rulesetHash],
    ['Temporal', 'GMST', `${ctx.temporal.greenwichMeanSiderealTimeHours} hrs`, 'Greenwich Mean Sidereal Time', ctx.rulesetHash],
    ['Temporal', 'LST', `${ctx.temporal.localSiderealTimeHours} hrs`, `Longitude: ${ctx.input.location.longitude}°`, ctx.rulesetHash],
    ['Temporal', 'Julian Calendar Date', `${ctx.temporal.julianCalendarDate.year}-${ctx.temporal.julianCalendarDate.month}-${ctx.temporal.julianCalendarDate.day}`, 'Historical Julian count', ctx.rulesetHash],

    // Mayan
    ['Mayan', 'Long Count', ctx.mayan.longCount.formatted, `Correlation: ${ctx.mayan.correlationId}`, ctx.rulesetHash],
    ['Mayan', 'Tzolk\'in', ctx.mayan.tzolkin.formatted, `${ctx.mayan.tzolkin.meaning} (${ctx.mayan.tzolkin.direction})`, ctx.rulesetHash],
    ['Mayan', 'Haab\'', ctx.mayan.haab.formatted, ctx.mayan.haab.meaning, ctx.rulesetHash],
    ['Mayan', 'Calendar Round', ctx.mayan.calendarRound, '52-year synchronized cycle', ctx.rulesetHash],
    ['Mayan', 'Kin Index', ctx.mayan.kinNumber.toString(), ctx.mayan.isGalacticPortalDay ? 'GALACTIC ACTIVATION PORTAL DAY' : 'Standard Kin', ctx.rulesetHash],

    // Chinese
    ['Chinese', 'Year Pillar', `${ctx.chinese.yearPillar.stemPinYin}-${ctx.chinese.yearPillar.branchPinYin} (${ctx.chinese.yearPillar.stem}${ctx.chinese.yearPillar.branch})`, `${ctx.chinese.yearPillar.stemElement} ${ctx.chinese.yearPillar.zodiacAnimal}`, ctx.rulesetHash],
    ['Chinese', 'Month Pillar', `${ctx.chinese.monthPillar.stemPinYin}-${ctx.chinese.monthPillar.branchPinYin}`, `${ctx.chinese.monthPillar.stemElement} ${ctx.chinese.monthPillar.zodiacAnimal}`, ctx.rulesetHash],
    ['Chinese', 'Day Pillar', `${ctx.chinese.dayPillar.stemPinYin}-${ctx.chinese.dayPillar.branchPinYin}`, `${ctx.chinese.dayPillar.stemElement} ${ctx.chinese.dayPillar.zodiacAnimal}`, ctx.rulesetHash],
    ['Chinese', 'Hour Pillar', `${ctx.chinese.hourPillar.stemPinYin}-${ctx.chinese.hourPillar.branchPinYin}`, `${ctx.chinese.hourPillar.stemElement} ${ctx.chinese.hourPillar.zodiacAnimal}`, ctx.rulesetHash],
    ['Chinese', 'Solar Term (Jieqi)', ctx.chinese.solarTerm.name, `Solar Longitude: ${ctx.chinese.solarTerm.solarLongitudeDeg}°`, ctx.rulesetHash],
    ['Chinese', 'Dominant Wu Xing', ctx.chinese.dominantElement, JSON.stringify(ctx.chinese.elementDistribution), ctx.rulesetHash],

    // Historical
    ['Egyptian', 'Civil Date', `Year ${ctx.egyptian.civilYear}, ${ctx.egyptian.monthName} Day ${ctx.egyptian.dayOfMonth}`, ctx.egyptian.season, ctx.rulesetHash],
    ['Egyptian', 'Sothic Great Year', `Cycle ${ctx.egyptian.sothicGreatYearCycle}, Year ${ctx.egyptian.sothicYearInCycle} / 1460`, 'Heliacal rising of Sirius cycle', ctx.rulesetHash],
    ['Ethiopian', 'Ge\'ez Date', `Year ${ctx.ethiopian.year}, ${ctx.ethiopian.monthName} Day ${ctx.ethiopian.dayOfMonth}`, `Evangelist: ${ctx.ethiopian.evangelist}`, ctx.rulesetHash],
    ['Greek', 'Attic Lunisolar', `${ctx.greek.atticMonthName}, Day ${ctx.greek.atticDay}`, `Metonic Year: ${ctx.greek.metonicCycleYear} / 19 | Olympiad ${ctx.greek.olympiadNumber}`, ctx.rulesetHash],

    // Enochian / Biblical / Roman
    ['Enochian', '364-Day Date', ctx.enochianBiblical.enochian.formatted, ctx.enochianBiblical.enochian.watchGate, ctx.rulesetHash],
    ['Enochian', 'Season / Intercalary', ctx.enochianBiblical.enochian.seasonName, ctx.enochianBiblical.enochian.isIntercalaryDay ? 'INTERCALARY PORTAL' : 'Standard day', ctx.rulesetHash],
    ['Biblical', 'Tekufah Transit', ctx.enochianBiblical.biblicalSeason.name, ctx.enochianBiblical.biblicalTransits.seasonVerseAnchors.join('; '), ctx.rulesetHash],
    ['Biblical', 'Season Counsel', ctx.enochianBiblical.biblicalSeason.energeticCounsel, ctx.enochianBiblical.biblicalSeason.liturgicalEcho, ctx.rulesetHash],
    ['Roman', 'Gregorian Dies', ctx.enochianBiblical.gregorianWeekdayDeity.latinDies, `${ctx.enochianBiblical.gregorianWeekdayDeity.romanDeity} | ${ctx.enochianBiblical.gregorianWeekdayDeity.energy}`, ctx.rulesetHash],
    ['Roman', 'Julian Dies', ctx.enochianBiblical.julianWeekdayDeity.latinDies, `${ctx.enochianBiblical.julianWeekdayDeity.romanDeity} | Julian ${ctx.temporal.julianCalendarDate.year}-${ctx.temporal.julianCalendarDate.month}-${ctx.temporal.julianCalendarDate.day}`, ctx.rulesetHash],
    ['Roman', 'Planetary Hour', `Hour ${ctx.enochianBiblical.currentPlanetaryHour.index} of ${ctx.enochianBiblical.currentPlanetaryHour.planet}`, ctx.enochianBiblical.currentPlanetaryHour.formattedWindow, ctx.rulesetHash],
    ['Roman', 'Half-Hour Phase', ctx.enochianBiblical.currentHalfHour.phase, ctx.enochianBiblical.currentHalfHour.meaning, ctx.rulesetHash],
    ['Enochian', 'Compass Flip', `+${ctx.enochianBiblical.compassOrientation.headingOffsetDegrees}° mirror E↔W`, `N→${ctx.enochianBiblical.compassOrientation.directionRemap.North}; E→${ctx.enochianBiblical.compassOrientation.directionRemap.East}`, ctx.rulesetHash],
    ['Synthesis', 'Enochian Triangulation', 'Civil × Enochian × Biblical × Roman', ctx.enochianBiblical.abPeek.synthesis.summary.slice(0, 200), ctx.rulesetHash],

    // Numerology
    ['Numerology', 'Life Path', ctx.numerology.lifePathNumber.toString(), ctx.numerology.lifePathIsMaster ? 'MASTER NUMBER' : 'Root', ctx.rulesetHash],
    ['Numerology', 'Universal Day', ctx.numerology.universalDay.toString(), `Universal Year: ${ctx.numerology.universalYear}`, ctx.rulesetHash],
    ['Numerology', 'Chaldean Vibration', ctx.numerology.chaldeanVibration.toString(), 'Ancient vibrational root', ctx.rulesetHash],

    // Archetype
    ['Archetype', 'Top Resonating Tribe', ctx.synthesis.topResonatingTribe.tribe, `Affinity: ${ctx.synthesis.topResonatingTribe.affinityScore}% | ${ctx.synthesis.topResonatingTribe.archetypeRole}`, ctx.rulesetHash],
    ['Archetype', 'Tribe Life Meaning', ctx.intertwining.primaryTribeLife.lifeRepresents.slice(0, 180), ctx.intertwining.primaryTribeLife.dayPractice, ctx.rulesetHash],
    ['Archetype', 'Tribe Gift / Shadow', ctx.intertwining.primaryTribeLife.giftToEmbody, ctx.intertwining.primaryTribeLife.shadowToWatch, ctx.rulesetHash],
    ['Intertwining', 'Direction Thread', ctx.intertwining.intertwiningThreads[0]?.nodes.join(' → ') || '', ctx.intertwining.intertwiningThreads[0]?.meaning || '', ctx.rulesetHash],
    ['Intertwining', 'Season Thread', ctx.intertwining.intertwiningThreads[1]?.nodes.join(' → ') || '', ctx.intertwining.intertwiningThreads[1]?.meaning || '', ctx.rulesetHash],
    ['Archetype', 'Dominant Polarity', ctx.synthesis.dominantPolarity, `Harmonic Index: ${ctx.synthesis.harmonicResonanceIndex}/100`, ctx.rulesetHash]
  ];

  // Add celestial bodies
  for (const b of ctx.celestialBodies) {
    rows.push([
      'Celestial',
      b.name,
      `${b.eclipticLongitude}° (${b.zodiacSign} ${b.signDegree}°)`,
      `RA: ${b.rightAscensionHours}h | Dec: ${b.declinationDegrees}° | Retrograde: ${b.isRetrograde}`,
      ctx.rulesetHash
    ]);
  }

  // Add Astrocartography lines
  for (const line of ctx.astrocartographyLines) {
    rows.push([
      'Astrocartography',
      line.lineTypeName,
      `${line.subSolarLongitude}° Longitude`,
      line.description,
      ctx.rulesetHash
    ]);
  }

  const csvContent = rows
    .map((row) =>
      row.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  return csvContent;
}

/**
 * Initiates download of a text blob (CSV or JSON).
 */
export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Triggers clean e-book style print dialog for PDF export.
 */
export function openPrintDialog() {
  window.print();
}
