/**
 * The Crucible — Chinese Sexagenary & BaZi Engine
 * 10 Heavenly Stems, 12 Earthly Branches, 24 Solar Terms (Jieqi),
 * Four Pillars of Destiny, and Wu Xing (5 Elements) balance.
 */

import { ChineseResult, PillarData, TemporalCoordinate } from '../types';

export const HEAVENLY_STEMS = [
  { char: '甲', pinYin: 'Jia', element: 'Wood' as const, polarity: 'Yang' as const },
  { char: '乙', pinYin: 'Yi', element: 'Wood' as const, polarity: 'Yin' as const },
  { char: '丙', pinYin: 'Bing', element: 'Fire' as const, polarity: 'Yang' as const },
  { char: '丁', pinYin: 'Ding', element: 'Fire' as const, polarity: 'Yin' as const },
  { char: '戊', pinYin: 'Wu', element: 'Earth' as const, polarity: 'Yang' as const },
  { char: '己', pinYin: 'Ji', element: 'Earth' as const, polarity: 'Yin' as const },
  { char: '庚', pinYin: 'Geng', element: 'Metal' as const, polarity: 'Yang' as const },
  { char: '辛', pinYin: 'Xin', element: 'Metal' as const, polarity: 'Yin' as const },
  { char: '壬', pinYin: 'Ren', element: 'Water' as const, polarity: 'Yang' as const },
  { char: '癸', pinYin: 'Gui', element: 'Water' as const, polarity: 'Yin' as const }
];

export const EARTHLY_BRANCHES = [
  { char: '子', pinYin: 'Zi', animal: 'Rat', element: 'Water' as const, polarity: 'Yang' as const, hours: '23:00 - 01:00' },
  { char: '丑', pinYin: 'Chou', animal: 'Ox', element: 'Earth' as const, polarity: 'Yin' as const, hours: '01:00 - 03:00' },
  { char: '寅', pinYin: 'Yin', animal: 'Tiger', element: 'Wood' as const, polarity: 'Yang' as const, hours: '03:00 - 05:00' },
  { char: '卯', pinYin: 'Mao', animal: 'Rabbit', element: 'Wood' as const, polarity: 'Yin' as const, hours: '05:00 - 07:00' },
  { char: '辰', pinYin: 'Chen', animal: 'Dragon', element: 'Earth' as const, polarity: 'Yang' as const, hours: '07:00 - 09:00' },
  { char: '巳', pinYin: 'Si', animal: 'Snake', element: 'Fire' as const, polarity: 'Yin' as const, hours: '09:00 - 11:00' },
  { char: '午', pinYin: 'Wu', animal: 'Horse', element: 'Fire' as const, polarity: 'Yang' as const, hours: '11:00 - 13:00' },
  { char: '未', pinYin: 'Wei', animal: 'Goat', element: 'Earth' as const, polarity: 'Yin' as const, hours: '13:00 - 15:00' },
  { char: '申', pinYin: 'Shen', animal: 'Monkey', element: 'Metal' as const, polarity: 'Yang' as const, hours: '15:00 - 17:00' },
  { char: '酉', pinYin: 'You', animal: 'Rooster', element: 'Metal' as const, polarity: 'Yin' as const, hours: '17:00 - 19:00' },
  { char: '戌', pinYin: 'Xu', animal: 'Dog', element: 'Earth' as const, polarity: 'Yang' as const, hours: '19:00 - 21:00' },
  { char: '亥', pinYin: 'Hai', animal: 'Pig', element: 'Water' as const, polarity: 'Yin' as const, hours: '21:00 - 23:00' }
];

export const SOLAR_TERMS = [
  { name: 'Chunfen (Spring Equinox)', chineseName: '春分', deg: 0, monthBranchIndex: 3 }, // Mao
  { name: 'Qingming (Pure Brightness)', chineseName: '清明', deg: 15, monthBranchIndex: 4 }, // Chen
  { name: 'Guyu (Grain Rain)', chineseName: '谷雨', deg: 30, monthBranchIndex: 4 },
  { name: 'Lixia (Start of Summer)', chineseName: '立夏', deg: 45, monthBranchIndex: 5 }, // Si
  { name: 'Xiaoman (Grain Buds)', chineseName: '小满', deg: 60, monthBranchIndex: 5 },
  { name: 'Mangzhong (Grain in Ear)', chineseName: '芒种', deg: 75, monthBranchIndex: 6 }, // Wu
  { name: 'Xiazhi (Summer Solstice)', chineseName: '夏至', deg: 90, monthBranchIndex: 6 },
  { name: 'Xiaoshu (Minor Heat)', chineseName: '小暑', deg: 105, monthBranchIndex: 7 }, // Wei
  { name: 'Dashu (Major Heat)', chineseName: '大暑', deg: 120, monthBranchIndex: 7 },
  { name: 'Liqiu (Start of Autumn)', chineseName: '立秋', deg: 135, monthBranchIndex: 8 }, // Shen
  { name: 'Chushu (End of Heat)', chineseName: '处暑', deg: 150, monthBranchIndex: 8 },
  { name: 'Bailu (White Dew)', chineseName: '白露', deg: 165, monthBranchIndex: 9 }, // You
  { name: 'Qiufen (Autumn Equinox)', chineseName: '秋分', deg: 180, monthBranchIndex: 9 },
  { name: 'Hanlu (Cold Dew)', chineseName: '寒露', deg: 195, monthBranchIndex: 10 }, // Xu
  { name: 'Shuangjiang (Frost Descent)', chineseName: '霜降', deg: 210, monthBranchIndex: 10 },
  { name: 'Lidong (Start of Winter)', chineseName: '立冬', deg: 225, monthBranchIndex: 11 }, // Hai
  { name: 'Xiaoxue (Minor Snow)', chineseName: '小雪', deg: 240, monthBranchIndex: 11 },
  { name: 'Daxue (Major Snow)', chineseName: '大雪', deg: 255, monthBranchIndex: 0 }, // Zi
  { name: 'Dongzhi (Winter Solstice)', chineseName: '冬至', deg: 270, monthBranchIndex: 0 },
  { name: 'Xiaohan (Minor Cold)', chineseName: '小寒', deg: 285, monthBranchIndex: 1 }, // Chou
  { name: 'Dahan (Major Cold)', chineseName: '大寒', deg: 300, monthBranchIndex: 1 },
  { name: 'Lichun (Start of Spring)', chineseName: '立春', deg: 315, monthBranchIndex: 2 }, // Yin
  { name: 'Yushui (Rain Water)', chineseName: '雨水', deg: 330, monthBranchIndex: 2 },
  { name: 'Jingzhe (Awakening of Insects)', chineseName: '惊蛰', deg: 345, monthBranchIndex: 3 }
];

/**
 * Calculates Sun's apparent ecliptic longitude in degrees (0..360) for Solar Term determination.
 */
function calculateSunLongitude(jdUT: number): number {
  const n = jdUT - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * (Math.PI / 180);
  let lambda = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  lambda = ((lambda % 360) + 360) % 360;
  return lambda;
}

function makePillar(stemIndex: number, branchIndex: number): PillarData {
  const stem = HEAVENLY_STEMS[(stemIndex % 10 + 10) % 10];
  const branch = EARTHLY_BRANCHES[(branchIndex % 12 + 12) % 12];
  return {
    stem: stem.char,
    stemPinYin: stem.pinYin,
    stemElement: stem.element,
    stemPolarity: stem.polarity,
    branch: branch.char,
    branchPinYin: branch.pinYin,
    zodiacAnimal: branch.animal,
    branchElement: branch.element,
    branchPolarity: branch.polarity
  };
}

/**
 * Calculates complete Chinese Calendar and Four Pillars (BaZi).
 */
export function calculateChinese(temporal: TemporalCoordinate): ChineseResult {
  const [yearStr, monthStr, dayStr] = temporal.utcDateString.split('-');
  const [hourStr] = temporal.utcTimeString.split(':');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);

  // Approximate Sun longitude to find Solar Term
  const sunLong = calculateSunLongitude(temporal.julianDayUT);

  // Lichun occurs around ~315 deg (approx Feb 4).
  // Solar year begins at Lichun.
  let solarYear = year;
  // If date is before Lichun (e.g. Jan or early Feb), belongs to previous solar year
  if (month === 1 || (month === 2 && day < 4)) {
    solarYear = year - 1;
  }

  // Year Pillar:
  // Base: 1984 is Jia-Zi (Stem 0, Branch 0)
  // Formula: (year - 4) % 60
  const yearOffset = (solarYear - 4) % 60;
  const yearStemIdx = (yearOffset % 10 + 10) % 10;
  const yearBranchIdx = (yearOffset % 12 + 12) % 12;
  const yearPillar = makePillar(yearStemIdx, yearBranchIdx);

  // Find active Solar Term
  let activeTermIndex = 0;
  let termDeg = 0;
  for (let i = 0; i < SOLAR_TERMS.length; i++) {
    const term = SOLAR_TERMS[i];
    const nextTerm = SOLAR_TERMS[(i + 1) % SOLAR_TERMS.length];
    if (term.deg <= nextTerm.deg) {
      if (sunLong >= term.deg && sunLong < nextTerm.deg) {
        activeTermIndex = i;
        termDeg = term.deg;
        break;
      }
    } else {
      // Wraparound at 360 / 0 deg (between Jingzhe 345 and Chunfen 0)
      if (sunLong >= term.deg || sunLong < nextTerm.deg) {
        activeTermIndex = i;
        termDeg = term.deg;
        break;
      }
    }
  }
  const solarTerm = SOLAR_TERMS[activeTermIndex];

  // Month Pillar:
  // Month Branch is derived from the solar term month branch.
  const monthBranchIdx = solarTerm.monthBranchIndex;
  // "Five Tigers Dun" Formula for Month Stem:
  // Derived from year stem:
  // Jia/Ji (0, 5) -> starts Bing-Yin (2)
  // Yi/Geng (1, 6) -> starts Wu-Yin (4)
  // Bing/Xin (2, 7) -> starts Geng-Yin (6)
  // Ding/Ren (3, 8) -> starts Ren-Yin (8)
  // Wu/Gui (4, 9) -> starts Jia-Yin (0)
  const tigerBaseStem = ((yearStemIdx % 5) * 2 + 2) % 10;
  // Branch offset from Yin (which is index 2 in 12 branches):
  const branchFromYin = (monthBranchIdx - 2 + 12) % 12;
  const monthStemIdx = (tigerBaseStem + branchFromYin) % 10;
  const monthPillar = makePillar(monthStemIdx, monthBranchIdx);

  // Day Pillar:
  // Astronomical continuous sexagenary count.
  // Benchmark reference: 2000-01-01 (JD 2451545.0) was Wu-Wu (Stem 4: Wu, Branch 6: Wu)
  // Formula:
  const dayIndex = Math.floor(temporal.julianDayUT + 0.5 - 2451545.0);
  const dayStemIdx = (((dayIndex + 4) % 10) + 10) % 10;
  const dayBranchIdx = (((dayIndex + 6) % 12) + 12) % 12;
  const dayPillar = makePillar(dayStemIdx, dayBranchIdx);

  // Hour Pillar:
  // 12 Shichen branches based on solar time:
  // Zi: 23:00 - 01:00 (index 0)
  // Chou: 01:00 - 03:00 (index 1) ...
  let hourBranchIdx = Math.floor(((hour + 1) % 24) / 2);
  // "Five Rats Dun" Formula for Hour Stem from Day Stem:
  // Jia/Ji (0, 5) -> Jia-Zi (0)
  // Yi/Geng (1, 6) -> Bing-Zi (2)
  // Bing/Xin (2, 7) -> Wu-Zi (4)
  // Ding/Ren (3, 8) -> Geng-Zi (6)
  // Wu/Gui (4, 9) -> Ren-Zi (8)
  const ratBaseStem = ((dayStemIdx % 5) * 2) % 10;
  const hourStemIdx = (ratBaseStem + hourBranchIdx) % 10;
  const hourPillar = makePillar(hourStemIdx, hourBranchIdx);

  // Element distribution count across all 8 characters (4 stems + 4 branches)
  const elementDistribution = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };

  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  for (const p of pillars) {
    elementDistribution[p.stemElement]++;
    elementDistribution[p.branchElement]++;
  }

  // Find dominant element
  let dominantElement = 'Earth';
  let maxCount = -1;
  (Object.keys(elementDistribution) as Array<keyof typeof elementDistribution>).forEach((el) => {
    if (elementDistribution[el] > maxCount) {
      maxCount = elementDistribution[el];
      dominantElement = el;
    }
  });

  // Approximate lunar phase day (synodic month = 29.530588 days)
  // Known new moon: 2000-01-06 18:14 UTC (JD 2451550.26)
  const synodicMonth = 29.53058867;
  const daysSinceNew = (temporal.julianDayUT - 2451550.26) % synodicMonth;
  const lunarDay = Math.floor((daysSinceNew + synodicMonth) % synodicMonth) + 1;

  let lunarPhaseName = 'Waxing Crescent';
  if (lunarDay === 1) lunarPhaseName = 'New Moon (Shuo)';
  else if (lunarDay >= 2 && lunarDay <= 6) lunarPhaseName = 'Waxing Crescent';
  else if (lunarDay >= 7 && lunarDay <= 9) lunarPhaseName = 'First Quarter (Shangxian)';
  else if (lunarDay >= 10 && lunarDay <= 14) lunarPhaseName = 'Waxing Gibbous';
  else if (lunarDay === 15 || lunarDay === 16) lunarPhaseName = 'Full Moon (Wang)';
  else if (lunarDay >= 17 && lunarDay <= 21) lunarPhaseName = 'Waning Gibbous';
  else if (lunarDay >= 22 && lunarDay <= 24) lunarPhaseName = 'Last Quarter (Xiaxian)';
  else lunarPhaseName = 'Waning Crescent';

  const sexagenaryCycleYear = yearOffset + 1;

  return {
    sexagenaryCycleYear,
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    solarTerm: {
      name: solarTerm.name,
      chineseName: solarTerm.chineseName,
      solarLongitudeDeg: Math.round(sunLong * 100) / 100,
      approximateDate: `Sun Longitude ~${termDeg}°`
    },
    elementDistribution,
    dominantElement,
    lunarPhaseName,
    lunarDay
  };
}
