/**
 * The Crucible — Enochian Time, Biblical Transits & Roman Diurnal Matrix
 *
 * Computes:
 * 1. Book of Enoch 364-day solar calendar (1 Enoch 72–82) with four seasons & watches
 * 2. Biblical agricultural / tekufah seasons with direct verse anchors
 * 3. Julian & Gregorian weekday Roman deities and diurnal energies
 * 4. Chaldean planetary hours + half-hour meanings
 * 5. Enochian compass / world-map directional flip (180° + East–West mirror)
 * 6. Triangulation dossier connotating Enochian, biblical, Roman, and civil frames
 */

import {
  BiblicalSeasonTransit,
  CardinalDirection,
  EnochianBiblicalResult,
  EnochianCompassOrientation,
  HalfHourMeaning,
  PlanetaryHourSlot,
  RomanWeekdayDeity,
  TemporalCoordinate,
  TemporalInput
} from '../types';

const ENOCHIAN_MONTHS = [
  { index: 1, name: 'Nisan / First Fruits Gate', season: 'Spring (Tekufat Nisan)' as const, watch: 'East Gate of Light' },
  { index: 2, name: 'Iyyar / Healing Ascent', season: 'Spring (Tekufat Nisan)' as const, watch: 'East Gate of Light' },
  { index: 3, name: 'Sivan / Covenant Fire', season: 'Spring (Tekufat Nisan)' as const, watch: 'East Gate of Light' },
  { index: 4, name: 'Tammuz / Midsummer Vigil', season: 'Summer (Tekufat Tammuz)' as const, watch: 'South Gate of Heat' },
  { index: 5, name: 'Av / Judgment Threshold', season: 'Summer (Tekufat Tammuz)' as const, watch: 'South Gate of Heat' },
  { index: 6, name: 'Elul / Return & Accounting', season: 'Summer (Tekufat Tammuz)' as const, watch: 'South Gate of Heat' },
  { index: 7, name: 'Tishrei / Ingathering Crown', season: 'Autumn (Tekufat Tishrei)' as const, watch: 'West Gate of Gathering' },
  { index: 8, name: 'Cheshvan / Hidden Rain', season: 'Autumn (Tekufat Tishrei)' as const, watch: 'West Gate of Gathering' },
  { index: 9, name: 'Kislev / Dedication Light', season: 'Autumn (Tekufat Tishrei)' as const, watch: 'West Gate of Gathering' },
  { index: 10, name: 'Tevet / Deep Waters', season: 'Winter (Tekufat Tevet)' as const, watch: 'North Gate of Stillness' },
  { index: 11, name: 'Shevat / Sap Rising', season: 'Winter (Tekufat Tevet)' as const, watch: 'North Gate of Stillness' },
  { index: 12, name: 'Adar / Hidden Joy', season: 'Winter (Tekufat Tevet)' as const, watch: 'North Gate of Stillness' }
];

/** Book of Enoch: 364-day year; epoch aligned to spring-equinox JD near Ethiopian Meskerem tradition */
const ENOCH_EPOCH_JD = 1721425.5; // 1 CE March 21 Julian approximation for Enochian New Year baseline

const ROMAN_WEEKDAYS: RomanWeekdayDeity[] = [
  {
    gregorianName: 'Sunday',
    latinDies: 'Dies Solis',
    romanDeity: 'Sol Invictus / Apollo',
    greekEcho: 'Helios',
    planetaryRuler: 'Sun',
    energy: 'Sovereignty, visibility, vital fire, public covenant',
    ritualTone: 'Illuminate intention; crown the day with clear vow',
    colorRay: 'Gold'
  },
  {
    gregorianName: 'Monday',
    latinDies: 'Dies Lunae',
    romanDeity: 'Luna / Diana',
    greekEcho: 'Selene / Artemis',
    planetaryRuler: 'Moon',
    energy: 'Reflection, memory, tides of feeling, protective vigilance',
    ritualTone: 'Listen inward; tend thresholds and household waters',
    colorRay: 'Silver'
  },
  {
    gregorianName: 'Tuesday',
    latinDies: 'Dies Martis',
    romanDeity: 'Mars',
    greekEcho: 'Ares',
    planetaryRuler: 'Mars',
    energy: 'Courage, decisive action, boundary defense, iron will',
    ritualTone: 'Cut away the obsolete; advance with measured force',
    colorRay: 'Crimson'
  },
  {
    gregorianName: 'Wednesday',
    latinDies: 'Dies Mercurii',
    romanDeity: 'Mercurius',
    greekEcho: 'Hermes',
    planetaryRuler: 'Mercury',
    energy: 'Commerce of ideas, speech, travel, cunning synthesis',
    ritualTone: 'Write, negotiate, encode; cross roads with wit',
    colorRay: 'Quicksilver'
  },
  {
    gregorianName: 'Thursday',
    latinDies: 'Dies Iovis',
    romanDeity: 'Iuppiter',
    greekEcho: 'Zeus',
    planetaryRuler: 'Jupiter',
    energy: 'Expansion, law, blessing, magnanimous judgment',
    ritualTone: 'Enlarge the covenant; teach and bestow',
    colorRay: 'Royal Blue'
  },
  {
    gregorianName: 'Friday',
    latinDies: 'Dies Veneris',
    romanDeity: 'Venus',
    greekEcho: 'Aphrodite',
    planetaryRuler: 'Venus',
    energy: 'Harmony, attraction, artistry, relational alchemy',
    ritualTone: 'Beautify bonds; reconcile and create',
    colorRay: 'Emerald'
  },
  {
    gregorianName: 'Saturday',
    latinDies: 'Dies Saturni',
    romanDeity: 'Saturnus',
    greekEcho: 'Kronos',
    planetaryRuler: 'Saturn',
    energy: 'Structure, harvest accounting, time\'s gravity, sacred rest',
    ritualTone: 'Seal, prune, endure; honor the Sabbath of form',
    colorRay: 'Lead / Indigo'
  }
];

const CHALDEAN_HOUR_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'] as const;

const PLANET_HOUR_MEANINGS: Record<string, { quality: string; counsel: string }> = {
  Saturn: { quality: 'Constraint & architecture', counsel: 'Build lasting form; audit debts; prune excess.' },
  Jupiter: { quality: 'Expansion & blessing', counsel: 'Teach, grant favor, enlarge righteous scope.' },
  Mars: { quality: 'Initiative & fortitude', counsel: 'Act decisively; defend boundaries; cut delay.' },
  Sun: { quality: 'Vital sovereignty', counsel: 'Lead publicly; seal covenants; radiate clarity.' },
  Venus: { quality: 'Attraction & accord', counsel: 'Reconcile, create beauty, refine alliances.' },
  Mercury: { quality: 'Speech & transit', counsel: 'Write, trade, encode, travel between frames.' },
  Moon: { quality: 'Tide & incubation', counsel: 'Dream, remember, protect the soft interior.' }
};

const HALF_HOUR_ARCHETYPES: Array<{ offsetMin: number; name: string; meaning: string }> = [
  { offsetMin: 0, name: 'Ingress Crest', meaning: 'Hour\'s ruling planet fully seats; initiate aligned acts.' },
  { offsetMin: 30, name: 'Mid-Hour Echo', meaning: 'Secondary resonance; refine, correct, or deepen the first impulse.' }
];

function weekdayIndex(name: string): number {
  const map: Record<string, number> = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6
  };
  return map[name] ?? 0;
}

function julianWeekdayName(julianYear: number, julianMonth: number, julianDay: number): string {
  // Zeller-like for Julian calendar: weekday from Julian Y/M/D
  let y = julianYear;
  let m = julianMonth;
  if (m < 3) {
    m += 12;
    y -= 1;
  }
  const k = y % 100;
  const j = Math.floor(y / 100);
  const h = (julianDay + Math.floor((13 * (m + 1)) / 5) + k + Math.floor(k / 4) + Math.floor(j / 4) + 5 * j) % 7;
  // Zeller: 0=Sat ... for Gregorian; Julian variant uses +5*j without -2*j
  // Convert: 0 Sat, 1 Sun, 2 Mon... → our Sunday=0 index
  const names = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return names[((h % 7) + 7) % 7];
}

function approximateSolarLongitude(jd: number): number {
  // Low-precision mean solar longitude (degrees) for season gating
  const T = (jd - 2451545.0) / 36525;
  const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;
  return ((L0 % 360) + 360) % 360;
}

function approximateSunriseHour(latitude: number, dayOfYear: number): number {
  const latRad = (latitude * Math.PI) / 180;
  const decl = 23.44 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81));
  const declRad = (decl * Math.PI) / 180;
  const cosHA = -Math.tan(latRad) * Math.tan(declRad);
  const clamped = Math.max(-1, Math.min(1, cosHA));
  const ha = (Math.acos(clamped) * 180) / Math.PI;
  const sunrise = 12 - ha / 15;
  return Math.max(4.5, Math.min(8.5, sunrise));
}

function approximateSunsetHour(sunrise: number): number {
  return Math.min(21.5, Math.max(15.5, 24 - sunrise));
}

export function resolveBiblicalSeason(solarLongitudeDeg: number): BiblicalSeasonTransit {
  const L = ((solarLongitudeDeg % 360) + 360) % 360;

  if (L < 90) {
    return {
      id: 'TEKUFAH-NISAN',
      name: 'Spring — Tekufat Nisan / Seedtime & Exodus Gate',
      hebrewTekufah: 'Tekufat Nisan',
      agriculturalPhase: 'Seedtime, barley ripening, Passover liberation',
      enochianWatch: 'East Gate of Light (1 Enoch 72)',
      solarLongitudeRange: '0°–90° (Aries → Cancer)',
      verses: [
        { ref: 'Genesis 8:22', text: 'While the earth remaineth, seedtime and harvest, and cold and heat, and summer and winter, and day and night shall not cease.' },
        { ref: 'Exodus 12:2', text: 'This month shall be unto you the beginning of months: it shall be the first month of the year to you.' },
        { ref: 'Song of Songs 2:11–12', text: 'For, lo, the winter is past, the rain is over and gone; the flowers appear on the earth; the time of the singing of birds is come.' },
        { ref: 'Deuteronomy 16:1', text: 'Observe the month of Abib, and keep the passover unto the LORD thy God.' }
      ],
      liturgicalEcho: 'Passover / Unleavened Bread — liberation from bondage into covenant walk',
      energeticCounsel: 'Plant covenants; leave Egypt-patterns; walk by newly risen light.'
    };
  }
  if (L < 180) {
    return {
      id: 'TEKUFAH-TAMMUZ',
      name: 'Summer — Tekufat Tammuz / Firstfruits Heat',
      hebrewTekufah: 'Tekufat Tammuz',
      agriculturalPhase: 'Wheat harvest, firstfruits, midsummer vigilance',
      enochianWatch: 'South Gate of Heat (1 Enoch 72)',
      solarLongitudeRange: '90°–180° (Cancer → Libra)',
      verses: [
        { ref: 'Proverbs 10:5', text: 'He that gathereth in summer is a wise son: but he that sleepeth in harvest is a son that causeth shame.' },
        { ref: 'Jeremiah 8:20', text: 'The harvest is past, the summer is ended, and we are not saved.' },
        { ref: 'Exodus 23:16', text: 'And the feast of harvest, the firstfruits of thy labours, which thou hast sown in the field.' },
        { ref: 'Acts 2:1–4', text: 'And when the day of Pentecost was fully come… they were all filled with the Holy Ghost.' }
      ],
      liturgicalEcho: 'Shavuot / Pentecost — Torah fire and gathered firstfruits',
      energeticCounsel: 'Labor while light is long; gather wisdom before the heat turns to judgment.'
    };
  }
  if (L < 270) {
    return {
      id: 'TEKUFAH-TISHREI',
      name: 'Autumn — Tekufat Tishrei / Ingathering Crown',
      hebrewTekufah: 'Tekufat Tishrei',
      agriculturalPhase: 'Ingathering, vintage, booths, accounting of the year',
      enochianWatch: 'West Gate of Gathering (1 Enoch 72)',
      solarLongitudeRange: '180°–270° (Libra → Capricorn)',
      verses: [
        { ref: 'Exodus 23:16', text: 'And the feast of ingathering, which is in the end of the year, when thou hast gathered in thy labours out of the field.' },
        { ref: 'Leviticus 23:39', text: 'Also in the fifteenth day of the seventh month, when ye have gathered in the fruit of the land, ye shall keep a feast unto the LORD seven days.' },
        { ref: 'Deuteronomy 16:13', text: 'Thou shalt observe the feast of tabernacles seven days, after that thou hast gathered in thy corn and thy wine.' },
        { ref: 'Ruth 2:23', text: 'So she kept fast by the maidens of Boaz to glean unto the end of barley harvest and of wheat harvest.' }
      ],
      liturgicalEcho: 'Sukkot / Tabernacles — dwell under temporary covering; rejoice in gathered fruit',
      energeticCounsel: 'Ingather the year\'s labor; dwell lightly; seal accounts with gratitude.'
    };
  }
  return {
    id: 'TEKUFAH-TEVET',
    name: 'Winter — Tekufat Tevet / Hidden Rain & Dedication',
    hebrewTekufah: 'Tekufat Tevet',
    agriculturalPhase: 'Dormancy, early rains, deep roots, dedicatory light',
    enochianWatch: 'North Gate of Stillness (1 Enoch 72)',
    solarLongitudeRange: '270°–360° (Capricorn → Aries)',
    verses: [
      { ref: 'Genesis 8:22', text: '…cold and heat, and summer and winter, and day and night shall not cease.' },
      { ref: 'Song of Songs 2:11', text: 'For, lo, the winter is past, the rain is over and gone.' },
      { ref: 'John 10:22–23', text: 'And it was at Jerusalem the feast of the dedication, and it was winter. And Jesus walked in the temple in Solomon\'s porch.' },
      { ref: 'Job 37:6', text: 'For he saith to the snow, Be thou on the earth; likewise to the small rain, and to the great rain of his strength.' }
    ],
    liturgicalEcho: 'Hanukkah / Dedication — light within winter\'s enclosure',
    energeticCounsel: 'Root downward; keep inner flame; let rain remake the soil of intention.'
  };
}

export function buildEnochianCompassFlip(civilNorthUp: boolean = true): EnochianCompassOrientation {
  // Enochian / southern-temple orientation: primary axis flips 180°; East–West mirror for Watcher gates
  const flipMap: Record<CardinalDirection, CardinalDirection> = {
    North: 'South',
    East: 'West',
    South: 'North',
    West: 'East'
  };
  return {
    mode: 'ENOCHIAN_FLIP',
    civilPrimary: civilNorthUp ? 'North' : 'South',
    enochianPrimary: 'South',
    headingOffsetDegrees: 180,
    mirrorEastWest: true,
    directionRemap: flipMap,
    worldMapTransform: {
      rotateHeadingBy: 180,
      scaleX: -1,
      label: 'Enochian World Flip — South-primary + East–West mirror'
    },
    connotation: '1 Enoch 72 describes the sun\'s portals by season-gates (East of light, South of heat, West of gathering, North of stillness). The ceremonial flip turns civil north-up cartography into Watcher-gate orientation so biblical camp directions, tribal banners, and geodetic lines can be triangulated against inverted cardinals.',
    triangulationNotes: [
      'Civil North becomes Enochian South (heat / Tammuz watch)',
      'Civil East becomes Enochian West (ingathering / Tishrei watch)',
      'Twelve Tribes camp East (Judah) reads as West-gate under flip — dialectical A/B required',
      'Astrocartography heading +180° and scaleX(-1) mirrors the world map to Watcher orientation'
    ]
  };
}

function buildPlanetaryHours(
  temporal: TemporalCoordinate,
  input: TemporalInput,
  dayRulerIndex: number
): { hours: PlanetaryHourSlot[]; halfHours: HalfHourMeaning[]; current: PlanetaryHourSlot; currentHalf: HalfHourMeaning } {
  const [hStr, mStr] = (input.isUTC ? temporal.utcTimeString : input.timeString).split(':');
  const localHour = parseInt(hStr || '12', 10) + parseInt(mStr || '0', 10) / 60;
  const sunrise = approximateSunriseHour(input.location.latitude, temporal.dayOfYear);
  const sunset = approximateSunsetHour(sunrise);
  const dayLength = sunset - sunrise;
  const nightLength = 24 - dayLength;
  const dayHourLen = dayLength / 12;
  const nightHourLen = nightLength / 12;

  // Day ruler starts Chaldean sequence: Sun=3, Moon=6, Mars=2, Mercury=5, Jupiter=1, Venus=4, Saturn=0
  const dayRulerToChaldeanStart: Record<number, number> = {
    0: 3, // Sunday → Sun
    1: 6, // Monday → Moon
    2: 2, // Tuesday → Mars
    3: 5, // Wednesday → Mercury
    4: 1, // Thursday → Jupiter
    5: 4, // Friday → Venus
    6: 0 // Saturday → Saturn
  };
  let seq = dayRulerToChaldeanStart[dayRulerIndex] ?? 3;

  const hours: PlanetaryHourSlot[] = [];
  for (let i = 0; i < 24; i++) {
    const isDay = i < 12;
    const len = isDay ? dayHourLen : nightHourLen;
    const start = isDay ? sunrise + i * dayHourLen : sunset + (i - 12) * nightHourLen;
    const end = start + len;
    const planet = CHALDEAN_HOUR_ORDER[seq % 7];
    const lore = PLANET_HOUR_MEANINGS[planet];
    hours.push({
      index: i + 1,
      isDayHour: isDay,
      startHourLocal: Math.round(start * 100) / 100,
      endHourLocal: Math.round(end * 100) / 100,
      planet,
      quality: lore.quality,
      counsel: lore.counsel,
      formattedWindow: `${formatHour(start)} – ${formatHour(end)}`
    });
    seq++;
  }

  const halfHours: HalfHourMeaning[] = [];
  for (const hr of hours) {
    for (const arch of HALF_HOUR_ARCHETYPES) {
      const start = hr.startHourLocal + arch.offsetMin / 60;
      const end = Math.min(hr.endHourLocal, start + 0.5);
      halfHours.push({
        hourIndex: hr.index,
        planet: hr.planet,
        phase: arch.name,
        startHourLocal: Math.round(start * 100) / 100,
        endHourLocal: Math.round(end * 100) / 100,
        meaning: `${hr.planet} · ${arch.meaning} (${hr.quality})`,
        formattedWindow: `${formatHour(start)} – ${formatHour(end)}`
      });
    }
  }

  const normalizedLocal = ((localHour % 24) + 24) % 24;
  const current =
    hours.find((h) => normalizedLocal >= h.startHourLocal && normalizedLocal < h.endHourLocal) ||
    hours[0];
  const currentHalf =
    halfHours.find((h) => normalizedLocal >= h.startHourLocal && normalizedLocal < h.endHourLocal) ||
    halfHours[0];

  return { hours, halfHours, current, currentHalf };
}

function formatHour(h: number): string {
  const wrapped = ((h % 24) + 24) % 24;
  const hh = Math.floor(wrapped);
  const mm = Math.round((wrapped - hh) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm % 60).padStart(2, '0')}`;
}

function buildPeekFrames(
  enochianDate: string,
  biblical: BiblicalSeasonTransit,
  gregorianDeity: RomanWeekdayDeity,
  julianDeity: RomanWeekdayDeity,
  currentHour: PlanetaryHourSlot,
  compass: EnochianCompassOrientation
): EnochianBiblicalResult['abPeek'] {
  return {
    pathA: {
      label: 'Path A — Civil / Gregorian Frame',
      title: 'North-up Chronometry & Public Calendar',
      summary: `Civil weekday ${gregorianDeity.gregorianName} (${gregorianDeity.latinDies}) under ${gregorianDeity.romanDeity}. Read directions north-up; honor civic clocks and marketplace covenants.`,
      keySignals: [
        `${gregorianDeity.energy}`,
        `Planetary hour of ${currentHour.planet}: ${currentHour.counsel}`,
        'Compass: True North primary'
      ]
    },
    pathB: {
      label: 'Path B — Enochian / Biblical Frame',
      title: 'Watcher Gates & Tekufah Transits',
      summary: `${enochianDate} within ${biblical.name}. Season watch: ${biblical.enochianWatch}. Julian dies ${julianDeity.latinDies} (${julianDeity.romanDeity}). Compass flipped ${compass.headingOffsetDegrees}° with East–West mirror.`,
      keySignals: [
        biblical.energeticCounsel,
        `Anchor verses: ${biblical.verses.map((v) => v.ref).join('; ')}`,
        `Enochian primary: ${compass.enochianPrimary} Gate`
      ]
    },
    synthesis: {
      title: 'Triangulated Third Path',
      summary: `Hold both frames without collapse: execute civic duties under ${gregorianDeity.romanDeity} while orienting contemplative practice to the ${biblical.enochianWatch}, remapping tribal/camp bearings through the Enochian flip so contradictions become explicit forks rather than silent error.`
    }
  };
}

/**
 * Primary calculator — Enochian time, biblical season transits, Roman day/hour matrix, compass flip.
 */
export function calculateEnochianBiblical(
  temporal: TemporalCoordinate,
  input: TemporalInput
): EnochianBiblicalResult {
  const jd = temporal.julianDayUT;
  const daysSinceEpoch = Math.floor(jd - ENOCH_EPOCH_JD);
  const enochYear = Math.floor(daysSinceEpoch / 364) + 1;
  const dayInYear = ((daysSinceEpoch % 364) + 364) % 364; // 0..363

  // 4 seasons × 91 days; each season = 3×30 + 1 intercalary
  const seasonIndex = Math.floor(dayInYear / 91); // 0..3
  const dayInSeason = dayInYear % 91;
  const isIntercalary = dayInSeason === 90;
  let monthInSeason = Math.min(2, Math.floor(dayInSeason / 30));
  let dayOfMonth = isIntercalary ? 31 : (dayInSeason % 30) + 1;
  if (isIntercalary) {
    monthInSeason = 2;
    dayOfMonth = 31;
  }
  const monthIndex = seasonIndex * 3 + monthInSeason + 1;
  const monthMeta = ENOCHIAN_MONTHS[monthIndex - 1];

  const solarLong = approximateSolarLongitude(jd);
  const biblicalSeason = resolveBiblicalSeason(solarLong);

  // Align displayed Enochian season/watch with tropical tekufah (364-day month count may drift)
  const seasonName = biblicalSeason.name.includes('Spring')
    ? ('Spring (Tekufat Nisan)' as const)
    : biblicalSeason.name.includes('Summer')
      ? ('Summer (Tekufat Tammuz)' as const)
      : biblicalSeason.name.includes('Autumn')
        ? ('Autumn (Tekufat Tishrei)' as const)
        : ('Winter (Tekufat Tevet)' as const);
  const watchGate = biblicalSeason.enochianWatch;

  const gregIdx = weekdayIndex(temporal.dayOfWeek);
  const gregorianDeity = ROMAN_WEEKDAYS[gregIdx];
  const julianWd = julianWeekdayName(
    temporal.julianCalendarDate.year,
    temporal.julianCalendarDate.month,
    temporal.julianCalendarDate.day
  );
  const julianDeity = ROMAN_WEEKDAYS[weekdayIndex(julianWd)];

  const { hours, halfHours, current, currentHalf } = buildPlanetaryHours(temporal, input, gregIdx);
  const compass = buildEnochianCompassFlip(true);

  const enochianDateFormatted = `Enoch Year ${enochYear}, Month ${monthIndex} (${monthMeta.name}), Day ${dayOfMonth}${
    isIntercalary ? ' [Intercalary Portal]' : ''
  }`;

  const triangulationDossier = `TRIANGULATION — Enochian × Biblical × Roman × Civil
Enochian: ${enochianDateFormatted} · Watch ${watchGate} · 364-day invariancy (1 Enoch 72–82).
Biblical Transit: ${biblicalSeason.name}. Verses: ${biblicalSeason.verses.map((v) => v.ref).join(', ')}. Counsel: ${biblicalSeason.energeticCounsel}
Gregorian Dies: ${gregorianDeity.latinDies} — ${gregorianDeity.romanDeity} (${gregorianDeity.energy}).
Julian Dies: ${julianDeity.latinDies} — ${julianDeity.romanDeity} on Julian ${temporal.julianCalendarDate.year}-${temporal.julianCalendarDate.month}-${temporal.julianCalendarDate.day}.
Hour Matrix: Planetary Hour ${current.index} of ${current.planet} (${current.formattedWindow}); Half-hour phase "${currentHalf.phase}" — ${currentHalf.meaning}.
Compass Flip: heading +${compass.headingOffsetDegrees}°, scaleX ${compass.worldMapTransform.scaleX}. Civil North→${compass.directionRemap.North}, East→${compass.directionRemap.East}.
Connotation: Civil clocks measure marketplace obligation; Enochian watches measure portal light; biblical tekufot measure agricultural covenant; Roman dies measure planetary temperament. Final outputs must present these as mutually illuminating bearings, not a single collapsed average.`;

  const abPeek = buildPeekFrames(
    enochianDateFormatted,
    biblicalSeason,
    gregorianDeity,
    julianDeity,
    current,
    compass
  );

  return {
    enochian: {
      year: enochYear,
      dayOfYear: dayInYear + 1,
      monthIndex,
      monthName: monthMeta.name,
      dayOfMonth,
      isIntercalaryDay: isIntercalary,
      seasonName,
      watchGate,
      weekOfYear: Math.floor(dayInYear / 7) + 1,
      formatted: enochianDateFormatted,
      sourceAuthority: '1 Enoch 72–82 (Astronomical Book); Ethiopian Orthodox computus parallel'
    },
    biblicalSeason,
    biblicalTransits: {
      solarLongitudeDeg: Math.round(solarLong * 1000) / 1000,
      tekufahId: biblicalSeason.id,
      seasonVerseAnchors: biblicalSeason.verses.map((v) => v.ref),
      liturgicalEcho: biblicalSeason.liturgicalEcho,
      narrative: `At solar longitude ${solarLong.toFixed(2)}°, the covenant year stands in ${biblicalSeason.hebrewTekufah}. ${biblicalSeason.agriculturalPhase}. Primary witnesses: ${biblicalSeason.verses[0].ref} and ${biblicalSeason.verses[1].ref}.`
    },
    gregorianWeekdayDeity: gregorianDeity,
    julianWeekdayDeity: julianDeity,
    planetaryHours: hours,
    halfHourMeanings: halfHours,
    currentPlanetaryHour: current,
    currentHalfHour: currentHalf,
    compassOrientation: compass,
    triangulationDossier,
    abPeek
  };
}
