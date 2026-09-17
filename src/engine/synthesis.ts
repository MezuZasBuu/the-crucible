/**
 * The Crucible — Archetypal & Cross-System Synthesis Engine
 * Synthesizes Mayan, Chinese, Historical Calendars, Numerology,
 * Gene Keys, and the Twelve Tribes Archetypal Matrix.
 */

import {
  ChineseResult,
  CrossSystemSynthesis,
  GeneKeyGate,
  MayanResult,
  NumerologyResult,
  TemporalCoordinate,
  TwelveTribeAffinity
} from '../types';
import { enrichTribeWithLife } from './crossSystemBridge';

export const TWELVE_TRIBES: Array<Omit<TwelveTribeAffinity, 'affinityScore' | 'resonanceDescription'>> = [
  {
    tribe: 'Judah (Yehudah)',
    hebrewName: 'יְהוּדָה',
    gemstone: 'Garnet / Carbuncle',
    bannerSymbol: 'Lion of Sovereign Strength',
    zodiacCorrespondence: 'Leo (Solar Fire)',
    directionInCamp: 'East',
    archetypeRole: 'The Sovereign King & Courageous Vanguard'
  },
  {
    tribe: 'Issachar (Yissakhar)',
    hebrewName: 'יִשָּׂשכָר',
    gemstone: 'Sapphire / Lapis Lazuli',
    bannerSymbol: 'Sun, Moon & Celestial Constellations',
    zodiacCorrespondence: 'Cancer (Lunar Intuition)',
    directionInCamp: 'East',
    archetypeRole: 'The Astronomical Scholar & Discerner of Epochs'
  },
  {
    tribe: 'Zebulun (Zevulun)',
    hebrewName: 'זְבוּלֻן',
    gemstone: 'Diamond / Rock Crystal',
    bannerSymbol: 'Merchant Ship upon Waters',
    zodiacCorrespondence: 'Gemini (Trade & Communication)',
    directionInCamp: 'East',
    archetypeRole: 'The Global Voyager, Patron & Harbor Builder'
  },
  {
    tribe: 'Reuben (Reuven)',
    hebrewName: 'רְאוּבֵן',
    gemstone: 'Ruby / Sardius',
    bannerSymbol: 'Mandrake Blossom & Rising Waters',
    zodiacCorrespondence: 'Aquarius (Water Bearer)',
    directionInCamp: 'South',
    archetypeRole: 'The Firstborn Passion, Human Potential & Awakening'
  },
  {
    tribe: 'Simeon (Shimon)',
    hebrewName: 'שִׁמְעוֹן',
    gemstone: 'Topaz / Chrysolite',
    bannerSymbol: 'Sword & City Gate of Shechem',
    zodiacCorrespondence: 'Pisces (Subconscious Depths)',
    directionInCamp: 'South',
    archetypeRole: 'The Intense Zealot, Hearer of Truth & Purifier'
  },
  {
    tribe: 'Gad (Gad)',
    hebrewName: 'גָּד',
    gemstone: 'Agate / Jacinth',
    bannerSymbol: 'Armed Troop / Tents of the Desert Camp',
    zodiacCorrespondence: 'Aries (Pioneering Warrior)',
    directionInCamp: 'South',
    archetypeRole: 'The Resolute Vanguard, Tactician & Overcomer'
  },
  {
    tribe: 'Ephraim / Joseph (Efrayim)',
    hebrewName: 'אֶפְרַיִם',
    gemstone: 'Onyx / Beryl',
    bannerSymbol: 'Fatted Bull & Fruitful Bough by Fountain',
    zodiacCorrespondence: 'Taurus (Material Manifestation)',
    directionInCamp: 'West',
    archetypeRole: 'The Prodigious Builder, Provider & Transmuter of Scarcity'
  },
  {
    tribe: 'Manasseh (Menashe)',
    hebrewName: 'מְנַשֶּׁה',
    gemstone: 'Amethyst',
    bannerSymbol: 'Wild Ox / Unicorn Horn',
    zodiacCorrespondence: 'Sagittarius (Expansive Horizon)',
    directionInCamp: 'West',
    archetypeRole: 'The Restorer of Forgotten Knowledge & Memory'
  },
  {
    tribe: 'Benjamin (Binyamin)',
    hebrewName: 'בִּנְיָמִין',
    gemstone: 'Jasper / Multicolored Agate',
    bannerSymbol: 'Ravenous Wolf of Morning Light',
    zodiacCorrespondence: 'Scorpio (Transformative Stealth)',
    directionInCamp: 'West',
    archetypeRole: 'The Fierce Protector, Scribe & Temple Keeper'
  },
  {
    tribe: 'Dan (Dan)',
    hebrewName: 'דָּן',
    gemstone: 'Opal / Jacinth',
    bannerSymbol: 'Horned Viper / Scales of Justice',
    zodiacCorrespondence: 'Libra (Equilibrium & Law)',
    directionInCamp: 'North',
    archetypeRole: 'The Arbiter of Cosmic Law, Judge & Discernment'
  },
  {
    tribe: 'Asher (Asher)',
    hebrewName: 'אָשֵׁר',
    gemstone: 'Peridot / Aquamarine',
    bannerSymbol: 'Olive Tree of Royal Dainties',
    zodiacCorrespondence: 'Virgo (Harvest & Healing)',
    directionInCamp: 'North',
    archetypeRole: 'The Gracious Host, Alchemist of Oil & Nourishment'
  },
  {
    tribe: 'Naphtali (Naftali)',
    hebrewName: 'נַפְתָּלִי',
    gemstone: 'Carnelian / Emerald',
    bannerSymbol: 'Swift Hind Giving Pleasant Words',
    zodiacCorrespondence: 'Capricorn (Agile Mountain Climber)',
    directionInCamp: 'North',
    archetypeRole: 'The Swift Messenger of Joy & Eloquent Poet'
  }
];

export const GENE_KEYS_CATALOG: Record<number, { name: string; shadow: string; gift: string; siddhi: string; center: string }> = {
  1: { name: 'Entropy to Freshness', shadow: 'Entropy', gift: 'Freshness', siddhi: 'Beauty', center: 'G Center' },
  2: { name: 'Returning to Oneness', shadow: 'Dislocation', gift: 'Orientation', siddhi: 'Unity', center: 'G Center' },
  3: { name: 'Through the Eyes of a Child', shadow: 'Chaos', gift: 'Innovation', siddhi: 'Innocence', center: 'Sacral' },
  4: { name: 'A Panacea for Mind', shadow: 'Intolerance', gift: 'Understanding', siddhi: 'Forgiveness', center: 'Ajna' },
  5: { name: 'The Ending of Time', shadow: 'Impatience', gift: 'Patience', siddhi: 'Timelessness', center: 'Sacral' },
  6: { name: 'The Path to Peace', shadow: 'Conflict', gift: 'Diplomacy', siddhi: 'Peace', center: 'Solar Plexus' },
  7: { name: 'Virtue is its Own Reward', shadow: 'Division', gift: 'Guidance', siddhi: 'Virtue', center: 'G Center' },
  8: { name: 'Diamond of the Self', shadow: 'Mediocrity', gift: 'Style', siddhi: 'Exquisiteness', center: 'Throat' },
  9: { name: 'The Power of the Infinitesimal', shadow: 'Inertia', gift: 'Determination', siddhi: 'Invincibility', center: 'Sacral' },
  10: { name: 'Being at Ease', shadow: 'Self-Obsession', gift: 'Naturalness', siddhi: 'Being', center: 'G Center' },
  11: { name: 'The Light of Eden', shadow: 'Obscurity', gift: 'Idealism', siddhi: 'Light', center: 'Ajna' },
  12: { name: 'A Pure Heart', shadow: 'Vanity', gift: 'Discrimination', siddhi: 'Purity', center: 'Throat' },
  13: { name: 'The Listener', shadow: 'Discord', gift: 'Discernment', siddhi: 'Empathy', center: 'G Center' },
  14: { name: 'Bounteous Radiance', shadow: 'Compromise', gift: 'Competence', siddhi: 'Bounteousness', center: 'Sacral' },
  15: { name: 'An Unquenchable Spring', shadow: 'Dullness', gift: 'Magnetism', siddhi: 'Florescence', center: 'G Center' },
  16: { name: 'Magical Genius', shadow: 'Indifference', gift: 'Versatility', siddhi: 'Mastery', center: 'Throat' },
  25: { name: 'The Myth of the Sacred Wound', shadow: 'Constriction', gift: 'Acceptance', siddhi: 'Universal Love', center: 'G Center' },
  41: { name: 'The Prime Emanator', shadow: 'Fantasy', gift: 'Anticipation', siddhi: 'Emanation', center: 'Root' },
  64: { name: 'The Aurora', shadow: 'Confusion', gift: 'Imagination', siddhi: 'Illumination', center: 'Head' }
};

/**
 * Calculates Gene Key Gate from ecliptic longitude (each gate spans 5°37'30").
 */
export function getGeneKeyFromLongitude(longDeg: number): GeneKeyGate {
  // Gate 41 starts at 302° (approx 02° Aquarius)
  const offset = (longDeg - 302.0 + 360) % 360;
  const gateSpan = 360 / 64; // 5.625 degrees
  const gateIndex = Math.floor(offset / gateSpan);
  const line = Math.floor((offset % gateSpan) / (gateSpan / 6)) + 1;

  // Key sequence order in wheel starting at Gate 41
  const wheelGates = [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35,
    45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
    28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
  ];

  const gateNumber = wheelGates[gateIndex % 64] || 1;
  const catalog = GENE_KEYS_CATALOG[gateNumber] || {
    name: `Gate ${gateNumber}`,
    shadow: 'Limitation',
    gift: 'Awareness',
    siddhi: 'Transcendence',
    center: 'Sacral'
  };

  return {
    gate: gateNumber,
    name: catalog.name,
    iChingHexagram: `Hexagram ${gateNumber}`,
    shadow: catalog.shadow,
    gift: catalog.gift,
    siddhi: catalog.siddhi,
    center: catalog.center,
    line
  };
}

/**
 * Synthesizes cross-system data into agreements, creative tensions, and 12-Tribe affinities.
 */
export function calculateSynthesis(
  temporal: TemporalCoordinate,
  mayan: MayanResult,
  chinese: ChineseResult,
  numerology: NumerologyResult
): CrossSystemSynthesis {
  // Determine composite element
  const mayanElement = mayan.tzolkin.element; // Water, Air, Earth, Fire
  const chineseElement = chinese.dominantElement; // Wood, Fire, Earth, Metal, Water
  const compositeElement = `${chineseElement}/${mayanElement}`;

  // Dominant polarity
  const isSolar = numerology.universalDay % 2 !== 0 || chinese.yearPillar.stemPolarity === 'Yang';
  const dominantPolarity = isSolar ? 'Active (Yang/Solar)' : 'Receptive (Yin/Lunar)';

  // Key Archetypal Themes
  const themes: string[] = [
    `Mayan ${mayan.tzolkin.signName}: ${mayan.tzolkin.meaning.split('/')[0].trim()}`,
    `Chinese ${chinese.yearPillar.stemPinYin} ${chinese.yearPillar.branchPinYin} (${chinese.yearPillar.zodiacAnimal})`,
    `Wu Xing Core: Dominant ${chineseElement}`,
    `Numerology Life Path ${numerology.lifePathNumber}: ${numerology.numberMeanings[numerology.lifePathNumber]?.split(':')[1]?.trim() || 'Illumination'}`
  ];

  // Agreements across systems
  const agreements: string[] = [];
  if ((chineseElement === 'Water' && mayanElement === 'Water') || (chineseElement === 'Fire' && mayanElement === 'Fire') || (chineseElement === 'Earth' && mayanElement === 'Earth')) {
    agreements.push(`Direct elemental convergence: Both Maya (${mayan.tzolkin.signName}) and Chinese BaZi confirm strong ${mayanElement} dominance.`);
  } else {
    agreements.push(`Complementary elemental bridge: Maya ${mayanElement} acts as the vessel for Chinese ${chineseElement} manifestation.`);
  }

  if (mayan.isGalacticPortalDay) {
    agreements.push(`High Galactic Resonance: Kin ${mayan.kinNumber} is an active Galactic Activation Portal Day, amplifying synchronicity.`);
  }

  agreements.push(`Numerological cycle harmony: Life Path ${numerology.lifePathNumber} operates in lockstep with Universal Day ${numerology.universalDay}.`);

  // Creative tensions / anomalies
  const anomalies: string[] = [];
  if (chinese.yearPillar.stemPolarity === 'Yang' && mayan.tzolkin.direction === 'North') {
    anomalies.push('Dynamic tension between Yang solar outward drive and North introspective ancestral stillness.');
  }
  if (numerology.lifePathIsMaster) {
    anomalies.push(`Master vibration ${numerology.lifePathNumber} imposes elevated sensitivity and demands conscious grounding into daily civil routine.`);
  }
  if (anomalies.length === 0) {
    anomalies.push('Equilibrium state: Harmonic resonance between seasonal ingress and solar term.');
  }

  // Twelve Tribes affinity scoring
  const scores: TwelveTribeAffinity[] = TWELVE_TRIBES.map((t, idx) => {
    let score = 50; // baseline

    // Direction match with Mayan
    if (t.directionInCamp === mayan.tzolkin.direction) {
      score += 25;
    }

    // Element match with Chinese
    if (
      (t.zodiacCorrespondence.includes('Fire') && chineseElement === 'Fire') ||
      (t.zodiacCorrespondence.includes('Water') && chineseElement === 'Water') ||
      (t.zodiacCorrespondence.includes('Earth') && chineseElement === 'Earth') ||
      (t.zodiacCorrespondence.includes('Air') && chineseElement === 'Metal')
    ) {
      score += 20;
    }

    // Number affinity with Life Path
    if ((idx + 1) === numerology.lifePathNumber || (idx + 1) % 9 === numerology.universalDay) {
      score += 15;
    }

    // Cap at 98
    score = Math.min(98, Math.max(30, score));

    return enrichTribeWithLife({
      ...t,
      affinityScore: score,
      resonanceDescription: `Resonates at ${score}% affinity via ${t.directionInCamp} orientation, ${t.gemstone} mineral frequency, and ${t.archetypeRole}.`
    });
  });

  scores.sort((a, b) => b.affinityScore - a.affinityScore);
  const topTribe = scores[0];

  const harmonicResonanceIndex = Math.round(
    (scores[0].affinityScore + (mayan.isGalacticPortalDay ? 95 : 75) + (numerology.lifePathIsMaster ? 90 : 80)) / 3
  );

  return {
    compositeElement,
    dominantPolarity,
    harmonicResonanceIndex,
    keyArchetypalThemes: themes,
    crossSystemAgreements: agreements,
    creativeTensionsOrAnomalies: anomalies,
    twelveTribesScores: scores,
    topResonatingTribe: topTribe,
    recommendedFocus: `Integrate ${topTribe.tribe} stewardship through ${mayan.galacticTone.power.toLowerCase()} and grounding the ${chineseElement} matrix.`
  };
}
