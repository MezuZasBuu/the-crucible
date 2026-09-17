/**
 * The Crucible — Historical Calendrical Systems
 * Exact computational engines for:
 * 1. Egyptian Civil Calendar (365-day fixed, Sothic cycle, 3 seasons, 5 epagomenal days)
 * 2. Ethiopian / Eritrean Ge'ez Calendar (13-month system, Amete Mihret era, Evangelists)
 * 3. Ancient Greek Attic Lunisolar Calendar (Metonic 19-year cycle, Olympiad dating, sacred festivals)
 */

import { EgyptianResult, EthiopianResult, GreekResult, TemporalCoordinate } from '../types';

export const EGYPTIAN_MONTHS = [
  { index: 1, name: 'Thoth', season: 'Akhet (Inundation)', deity: 'Djehuty (Wisdom)' },
  { index: 2, name: 'Phaophi', season: 'Akhet (Inundation)', deity: 'Hathor & Opet' },
  { index: 3, name: 'Athyr', season: 'Akhet (Inundation)', deity: 'Hathor (Beauty & Joy)' },
  { index: 4, name: 'Choiak', season: 'Akhet (Inundation)', deity: 'Sokar & Osiris Resurrected' },
  { index: 5, name: 'Tybi', season: 'Peret (Growth)', deity: 'Min & Amun' },
  { index: 6, name: 'Mechir', season: 'Peret (Growth)', deity: 'Rekeh-wer (Great Fire)' },
  { index: 7, name: 'Phamenoth', season: 'Peret (Growth)', deity: 'Amenhotep / First Harvest' },
  { index: 8, name: 'Pharmouthi', season: 'Peret (Growth)', deity: 'Renenutet (Grain Guardian)' },
  { index: 9, name: 'Pachons', season: 'Shemu (Harvest)', deity: 'Khonsu (Moon traveler)' },
  { index: 10, name: 'Payni', season: 'Shemu (Harvest)', deity: 'Valley Festival' },
  { index: 11, name: 'Epiphi', season: 'Shemu (Harvest)', deity: 'Wepwawet / Joy' },
  { index: 12, name: 'Mesore', season: 'Shemu (Harvest)', deity: 'Birth of Ra' }
];

export const EPAGOMENAL_DEITIES = [
  'Mesut Asar (Birth of Osiris)',
  'Mesut Heru-ur (Birth of Horus the Elder)',
  'Mesut Setesh (Birth of Set)',
  'Mesut Aset (Birth of Isis)',
  'Mesut Nebthet (Birth of Nephthys)'
];

export const ETHIOPIAN_MONTHS = [
  'Meskerem (New Year / Flowers)',
  'Tikimt (Sowing)',
  'Hidar (Procession)',
  'Tahsas (Hearth)',
  'Tir (Light)',
  'Yakatit (Thaw)',
  'Magabit (Spring Harvest)',
  'Miyazya (Green Growth)',
  'Ginbot (Flourishing)',
  'Sene (Summer Rains)',
  'Hamle (Great Inundation)',
  'Nehase (Vigil)',
  'Pagume (Days of Grace)'
];

export const GREEK_ATTIC_MONTHS = [
  { name: 'Hekatombaion', deity: 'Apollo & Athena', festival: 'Panathenaia & Kronia' },
  { name: 'Metageitnion', deity: 'Apollo Metageitnios', festival: 'Metageitnia' },
  { name: 'Boedromion', deity: 'Apollo & Demeter', festival: 'Eleusinian Mysteries' },
  { name: 'Pyanepsion', deity: 'Apollo & Theseus', festival: 'Pyanepsia & Thesmophoria' },
  { name: 'Maimakterion', deity: 'Zeus Maimaktes', festival: 'Maimakteria' },
  { name: 'Poseideon', deity: 'Poseidon', festival: 'Poseidea & Haloa' },
  { name: 'Gamelion', deity: 'Hera & Zeus', festival: 'Gamelia (Sacred Marriage)' },
  { name: 'Anthesterion', deity: 'Dionysus', festival: 'Anthesteria (Flower Festival)' },
  { name: 'Elaphebolion', deity: 'Artemis & Dionysus', festival: 'City Dionysia' },
  { name: 'Mounichion', deity: 'Artemis Mounichia', festival: 'Mounichia' },
  { name: 'Thargelion', deity: 'Apollo & Artemis', festival: 'Thargelia (First Fruits)' },
  { name: 'Skirophorion', deity: 'Athena & Poseidon', festival: 'Skiraphoria' }
];

/**
 * Egyptian Civil Calendar calculation:
 * Epoch of Nabonassar = JD 1448638.0 (Feb 26, 747 BCE Julian).
 * 365 days constant length.
 */
export function calculateEgyptian(temporal: TemporalCoordinate): EgyptianResult {
  const jd = temporal.julianDayUT;
  const nabonassarJD = 1448638.0;
  const daysSinceEpoch = Math.floor(jd - nabonassarJD);

  const civilYear = Math.floor(daysSinceEpoch / 365) + 1;
  const dayOfYear = ((daysSinceEpoch % 365) + 365) % 365; // 0..364

  let season: EgyptianResult['season'] = 'Akhet (Inundation)';
  let monthIndex = 1;
  let monthName = 'Thoth';
  let dayOfMonth = 1;
  let isEpagomenal = false;
  let epagomenalDeity: string | undefined = undefined;

  if (dayOfYear >= 360) {
    season = 'Epagomenae';
    monthIndex = 13;
    monthName = 'Epagomenae (The 5 Heriu Renpet)';
    dayOfMonth = dayOfYear - 360 + 1; // 1..5
    isEpagomenal = true;
    epagomenalDeity = EPAGOMENAL_DEITIES[dayOfMonth - 1];
  } else {
    monthIndex = Math.floor(dayOfYear / 30) + 1;
    dayOfMonth = (dayOfYear % 30) + 1;
    const mData = EGYPTIAN_MONTHS[monthIndex - 1];
    monthName = mData.name;
    season = mData.season as EgyptianResult['season'];
  }

  // Sothic cycle is 1,460 years
  const sothicGreatYearCycle = Math.floor(civilYear / 1460) + 1;
  const sothicYearInCycle = civilYear % 1460;

  return {
    epochName: 'Era of Nabonassar (747 BCE Baseline)',
    civilYear,
    season,
    monthIndex,
    monthName,
    dayOfMonth,
    isEpagomenal,
    epagomenalDeity,
    sothicGreatYearCycle,
    sothicYearInCycle
  };
}

/**
 * Ethiopian / Eritrean Ge'ez Calendar calculation:
 * Epoch: Amete Mihret = Aug 29, 8 CE (Julian) -> JD 1724220.5
 * 12 months of 30 days + Pagume (5 or 6 days).
 */
export function calculateEthiopian(temporal: TemporalCoordinate): EthiopianResult {
  const jd = temporal.julianDayUT;
  // Ethiopian epoch JD
  const ethiopianEpochJD = 1723856.0;
  const daysSinceEpoch = Math.floor(jd - ethiopianEpochJD);

  // 4-year Julian cycle = 1461 days (365*3 + 366)
  const fourYearCycles = Math.floor(daysSinceEpoch / 1461);
  const remainingDays = daysSinceEpoch % 1461;

  let yearInCycle = Math.floor(remainingDays / 365);
  if (yearInCycle === 4) yearInCycle = 3; // Leap year is 4th year

  const ethYear = fourYearCycles * 4 + yearInCycle + 1;

  // Day in the Ethiopian year (0..365)
  const dayInYear = remainingDays - yearInCycle * 365;

  let monthIndex = 1;
  let dayOfMonth = 1;
  let isPagume = false;

  if (dayInYear >= 360) {
    monthIndex = 13;
    dayOfMonth = dayInYear - 360 + 1;
    isPagume = true;
  } else {
    monthIndex = Math.floor(dayInYear / 30) + 1;
    dayOfMonth = (dayInYear % 30) + 1;
  }

  const evangelists: Array<'Matthew' | 'Mark' | 'Luke' | 'John'> = ['John', 'Matthew', 'Mark', 'Luke'];
  const evangelist = evangelists[ethYear % 4];

  const monthName = ETHIOPIAN_MONTHS[monthIndex - 1];

  const [gregYearStr] = temporal.utcDateString.split('-');
  const gregYear = parseInt(gregYearStr, 10);
  const offsetFromGregorianYears = gregYear - ethYear;

  return {
    era: 'Amete Mihret (Year of Grace)',
    year: ethYear,
    monthIndex,
    monthName,
    dayOfMonth,
    isPagume,
    evangelist,
    offsetFromGregorianYears
  };
}

/**
 * Ancient Greek Attic Lunisolar Calendar:
 * Based on 19-year Metonic cycle and 4-year Olympiad cycle.
 * First Olympiad begins 776 BCE (JD 1438171.5).
 */
export function calculateGreek(temporal: TemporalCoordinate): GreekResult {
  const jd = temporal.julianDayUT;
  const firstOlympiadJD = 1438171.5;
  const daysSinceOlympiad = jd - firstOlympiadJD;

  // 4-year Olympiad = 1461 days approx
  const olympiadNumber = Math.floor(daysSinceOlympiad / 1461) + 1;
  const olympiadYear = (Math.floor((daysSinceOlympiad % 1461) / 365.25) % 4) + 1;

  // 19-year Metonic cycle (6939.6 days)
  const metonicCycleYear = (Math.floor((daysSinceOlympiad % 6939.6) / 365.242) % 19) + 1;

  // Approximate lunar month relative to Summer Solstice
  // In attic calendar, year began around Hekatombaion (late June/July)
  const [yearStr, monthStr, dayStr] = temporal.utcDateString.split('-');
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Map Gregorian month offset to Attic lunisolar month approximation
  // July ~ Hekatombaion (index 0)
  const atticMonthOffset = (month - 7 + 12) % 12;
  const atticMonth = GREEK_ATTIC_MONTHS[atticMonthOffset];

  // Lunar day within attic month (1..30)
  // Synodic month ~ 29.53 days
  const lunarDay = Math.floor(((jd - 2451550.26) % 29.530588 + 29.530588) % 29.530588) + 1;

  return {
    atticMonthName: atticMonth.name,
    monthIndex: atticMonthOffset + 1,
    atticDay: lunarDay,
    metonicCycleYear,
    olympiadNumber,
    olympiadYear,
    patronDeity: atticMonth.deity,
    historicFestival: atticMonth.festival
  };
}
