/**
 * The Crucible — Archetypal & Cross-System Synthesis Engine
 * Synthesizes Mayan, Chinese, Historical Calendars, Numerology,
 * Gene Keys, and the Twelve Callings circle.
 */

import {
  ChineseResult,
  CrossSystemSynthesis,
  GeneKeyGate,
  MayanResult,
  NumerologyResult,
  TemporalCoordinate,
  CallingAffinity
} from '../types';
import { enrichCallingWithLife } from './crossSystemBridge';

/**
 * The Twelve Callings — the Crucible's own twelvefold circle of human vocation.
 * Twelve roles stand around a shared centre, three in each compass quarter:
 * East (Dawn — those who begin), South (Noon — those who act),
 * West (Dusk — those who gather), North (Midnight — those who discern).
 * Each calling carries a stone, an emblem, a zodiac sign, a gift, a shadow and a daily practice.
 * It is an original comparative lens, not a claim about ancestry, religion or identity.
 */
export const CALLING_QUARTERS: Record<'East' | 'South' | 'West' | 'North', { phase: string; theme: string }> = {
  East: { phase: 'Dawn', theme: 'those who begin' },
  South: { phase: 'Noon', theme: 'those who act' },
  West: { phase: 'Dusk', theme: 'those who gather' },
  North: { phase: 'Midnight', theme: 'those who discern' }
};

export const TWELVE_CALLINGS: Array<Omit<CallingAffinity, 'affinityScore' | 'resonanceDescription'>> = [
  {
    id: 'trailblazer',
    calling: 'The Trailblazer',
    motto: 'Go first',
    gemstone: 'Garnet',
    emblem: 'Rising sun',
    emblemId: 'sunrise',
    zodiacCorrespondence: 'Leo',
    element: 'Fire',
    quarter: 'East',
    archetypeRole: 'Leads from the front and makes it safer for others to follow'
  },
  {
    id: 'stargazer',
    calling: 'The Stargazer',
    motto: 'Read the season',
    gemstone: 'Sapphire',
    emblem: 'Moon and stars',
    emblemId: 'stars',
    zodiacCorrespondence: 'Cancer',
    element: 'Water',
    quarter: 'East',
    archetypeRole: 'Understands timing — when to plant, wait, or harvest'
  },
  {
    id: 'wayfarer',
    calling: 'The Wayfarer',
    motto: 'Open the harbor',
    gemstone: 'Rock crystal',
    emblem: 'Ship under sail',
    emblemId: 'ship',
    zodiacCorrespondence: 'Gemini',
    element: 'Air',
    quarter: 'East',
    archetypeRole: 'Connects people, places and ideas through travel and trade'
  },
  {
    id: 'wellspring',
    calling: 'The Wellspring',
    motto: 'Begin again',
    gemstone: 'Ruby',
    emblem: 'Rising water',
    emblemId: 'water',
    zodiacCorrespondence: 'Aquarius',
    element: 'Air',
    quarter: 'South',
    archetypeRole: 'Brings raw vitality and the honesty to start over'
  },
  {
    id: 'listener',
    calling: 'The Listener',
    motto: 'Hear what is true',
    gemstone: 'Topaz',
    emblem: 'Open ear',
    emblemId: 'ear',
    zodiacCorrespondence: 'Pisces',
    element: 'Water',
    quarter: 'South',
    archetypeRole: 'Hears what is really being said and clears away false stories'
  },
  {
    id: 'sentinel',
    calling: 'The Sentinel',
    motto: 'Hold the line',
    gemstone: 'Agate',
    emblem: 'Shield',
    emblemId: 'shield',
    zodiacCorrespondence: 'Aries',
    element: 'Fire',
    quarter: 'South',
    archetypeRole: 'Protects what matters and stays steady in a crisis'
  },
  {
    id: 'cultivator',
    calling: 'The Cultivator',
    motto: 'Make it grow',
    gemstone: 'Onyx',
    emblem: 'Sprouting seed',
    emblemId: 'sprout',
    zodiacCorrespondence: 'Taurus',
    element: 'Earth',
    quarter: 'West',
    archetypeRole: 'Builds, provides, and turns scarcity into plenty'
  },
  {
    id: 'memory_keeper',
    calling: 'The Memory Keeper',
    motto: 'Recover what was lost',
    gemstone: 'Amethyst',
    emblem: 'Hourglass',
    emblemId: 'hourglass',
    zodiacCorrespondence: 'Sagittarius',
    element: 'Fire',
    quarter: 'West',
    archetypeRole: 'Restores forgotten knowledge and repairs the thread of lineage'
  },
  {
    id: 'flamekeeper',
    calling: 'The Flamekeeper',
    motto: 'Guard the flame',
    gemstone: 'Jasper',
    emblem: 'Hearth flame',
    emblemId: 'flame',
    zodiacCorrespondence: 'Scorpio',
    element: 'Water',
    quarter: 'West',
    archetypeRole: 'Guards sacred boundaries and keeps the written word alive'
  },
  {
    id: 'arbiter',
    calling: 'The Arbiter',
    motto: 'Weigh it fairly',
    gemstone: 'Opal',
    emblem: 'Balanced scales',
    emblemId: 'scales',
    zodiacCorrespondence: 'Libra',
    element: 'Air',
    quarter: 'North',
    archetypeRole: 'Judges fairly so the circle stays in balance'
  },
  {
    id: 'host',
    calling: 'The Host',
    motto: 'Set the table',
    gemstone: 'Peridot',
    emblem: 'Sheaf of grain',
    emblemId: 'grain',
    zodiacCorrespondence: 'Virgo',
    element: 'Earth',
    quarter: 'North',
    archetypeRole: 'Nourishes and heals; makes an ordinary table feel special'
  },
  {
    id: 'messenger',
    calling: 'The Messenger',
    motto: 'Carry good words',
    gemstone: 'Carnelian',
    emblem: 'Feather',
    emblemId: 'feather',
    zodiacCorrespondence: 'Capricorn',
    element: 'Earth',
    quarter: 'North',
    archetypeRole: 'Carries good news quickly and speaks with warmth'
  }
];

/** All 64 Gene Keys: shadow → gift → siddhi (Richard Rudd, The Gene Keys). */
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
  17: { name: 'From Opinion to Far-Sightedness', shadow: 'Opinion', gift: 'Far-Sightedness', siddhi: 'Omniscience', center: '' },
  18: { name: 'From Judgement to Integrity', shadow: 'Judgement', gift: 'Integrity', siddhi: 'Perfection', center: '' },
  19: { name: 'From Co-Dependence to Sensitivity', shadow: 'Co-Dependence', gift: 'Sensitivity', siddhi: 'Sacrifice', center: '' },
  20: { name: 'From Superficiality to Self-Assurance', shadow: 'Superficiality', gift: 'Self-Assurance', siddhi: 'Presence', center: '' },
  21: { name: 'From Control to Authority', shadow: 'Control', gift: 'Authority', siddhi: 'Valour', center: '' },
  22: { name: 'From Dishonour to Graciousness', shadow: 'Dishonour', gift: 'Graciousness', siddhi: 'Grace', center: '' },
  23: { name: 'From Complexity to Simplicity', shadow: 'Complexity', gift: 'Simplicity', siddhi: 'Quintessence', center: '' },
  24: { name: 'From Addiction to Invention', shadow: 'Addiction', gift: 'Invention', siddhi: 'Silence', center: '' },
  25: { name: 'The Myth of the Sacred Wound', shadow: 'Constriction', gift: 'Acceptance', siddhi: 'Universal Love', center: 'G Center' },
  26: { name: 'From Pride to Artfulness', shadow: 'Pride', gift: 'Artfulness', siddhi: 'Invisibility', center: '' },
  27: { name: 'From Selfishness to Altruism', shadow: 'Selfishness', gift: 'Altruism', siddhi: 'Selflessness', center: '' },
  28: { name: 'From Purposelessness to Totality', shadow: 'Purposelessness', gift: 'Totality', siddhi: 'Immortality', center: '' },
  29: { name: 'From Half-Heartedness to Commitment', shadow: 'Half-Heartedness', gift: 'Commitment', siddhi: 'Devotion', center: '' },
  30: { name: 'From Desire to Lightness', shadow: 'Desire', gift: 'Lightness', siddhi: 'Rapture', center: '' },
  31: { name: 'From Arrogance to Leadership', shadow: 'Arrogance', gift: 'Leadership', siddhi: 'Humility', center: '' },
  32: { name: 'From Failure to Preservation', shadow: 'Failure', gift: 'Preservation', siddhi: 'Veneration', center: '' },
  33: { name: 'From Forgetting to Mindfulness', shadow: 'Forgetting', gift: 'Mindfulness', siddhi: 'Revelation', center: '' },
  34: { name: 'From Force to Strength', shadow: 'Force', gift: 'Strength', siddhi: 'Majesty', center: '' },
  35: { name: 'From Hunger to Adventure', shadow: 'Hunger', gift: 'Adventure', siddhi: 'Boundlessness', center: '' },
  36: { name: 'From Turbulence to Humanity', shadow: 'Turbulence', gift: 'Humanity', siddhi: 'Compassion', center: '' },
  37: { name: 'From Weakness to Equality', shadow: 'Weakness', gift: 'Equality', siddhi: 'Tenderness', center: '' },
  38: { name: 'From Struggle to Perseverance', shadow: 'Struggle', gift: 'Perseverance', siddhi: 'Honour', center: '' },
  39: { name: 'From Provocation to Dynamism', shadow: 'Provocation', gift: 'Dynamism', siddhi: 'Liberation', center: '' },
  40: { name: 'From Exhaustion to Resolve', shadow: 'Exhaustion', gift: 'Resolve', siddhi: 'Divine Will', center: '' },
  41: { name: 'The Prime Emanator', shadow: 'Fantasy', gift: 'Anticipation', siddhi: 'Emanation', center: 'Root' },
  42: { name: 'From Expectation to Detachment', shadow: 'Expectation', gift: 'Detachment', siddhi: 'Celebration', center: '' },
  43: { name: 'From Deafness to Insight', shadow: 'Deafness', gift: 'Insight', siddhi: 'Epiphany', center: '' },
  44: { name: 'From Interference to Teamwork', shadow: 'Interference', gift: 'Teamwork', siddhi: 'Synarchy', center: '' },
  45: { name: 'From Dominance to Synergy', shadow: 'Dominance', gift: 'Synergy', siddhi: 'Communion', center: '' },
  46: { name: 'From Seriousness to Delight', shadow: 'Seriousness', gift: 'Delight', siddhi: 'Ecstasy', center: '' },
  47: { name: 'From Oppression to Transmutation', shadow: 'Oppression', gift: 'Transmutation', siddhi: 'Transfiguration', center: '' },
  48: { name: 'From Inadequacy to Resourcefulness', shadow: 'Inadequacy', gift: 'Resourcefulness', siddhi: 'Wisdom', center: '' },
  49: { name: 'From Reaction to Revolution', shadow: 'Reaction', gift: 'Revolution', siddhi: 'Rebirth', center: '' },
  50: { name: 'From Corruption to Equilibrium', shadow: 'Corruption', gift: 'Equilibrium', siddhi: 'Harmony', center: '' },
  51: { name: 'From Agitation to Initiative', shadow: 'Agitation', gift: 'Initiative', siddhi: 'Awakening', center: '' },
  52: { name: 'From Stress to Restraint', shadow: 'Stress', gift: 'Restraint', siddhi: 'Stillness', center: '' },
  53: { name: 'From Immaturity to Expansion', shadow: 'Immaturity', gift: 'Expansion', siddhi: 'Superabundance', center: '' },
  54: { name: 'From Greed to Aspiration', shadow: 'Greed', gift: 'Aspiration', siddhi: 'Ascension', center: '' },
  55: { name: 'From Victimisation to Freedom', shadow: 'Victimisation', gift: 'Freedom', siddhi: 'Freedom', center: '' },
  56: { name: 'From Distraction to Enrichment', shadow: 'Distraction', gift: 'Enrichment', siddhi: 'Intoxication', center: '' },
  57: { name: 'From Unease to Intuition', shadow: 'Unease', gift: 'Intuition', siddhi: 'Clarity', center: '' },
  58: { name: 'From Dissatisfaction to Vitality', shadow: 'Dissatisfaction', gift: 'Vitality', siddhi: 'Bliss', center: '' },
  59: { name: 'From Dishonesty to Intimacy', shadow: 'Dishonesty', gift: 'Intimacy', siddhi: 'Transparency', center: '' },
  60: { name: 'From Limitation to Realism', shadow: 'Limitation', gift: 'Realism', siddhi: 'Justice', center: '' },
  61: { name: 'From Psychosis to Inspiration', shadow: 'Psychosis', gift: 'Inspiration', siddhi: 'Sanctity', center: '' },
  62: { name: 'From Intellect to Precision', shadow: 'Intellect', gift: 'Precision', siddhi: 'Impeccability', center: '' },
  63: { name: 'From Doubt to Inquiry', shadow: 'Doubt', gift: 'Inquiry', siddhi: 'Truth', center: '' },
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
 * Synthesizes cross-system data into agreements, creative tensions, and Twelve Callings affinities.
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

  // Twelve Callings affinity scoring
  const scores: CallingAffinity[] = TWELVE_CALLINGS.map((t, idx) => {
    let score = 50; // baseline

    // Direction match with Mayan
    if (t.quarter === mayan.tzolkin.direction) {
      score += 25;
    }

    // Element match with Chinese (Western Air is read against Chinese Metal; Wood leans Earth)
    const chineseAsWestern: Record<string, string> = { Fire: 'Fire', Water: 'Water', Earth: 'Earth', Metal: 'Air', Wood: 'Earth' };
    // Uses the day's own element (not the hour's) so the calling stays the same all day.
    if (chineseAsWestern[chinese.dayPillar.stemElement] === t.element) {
      score += 20;
    }

    // Number affinity with Life Path
    if ((idx + 1) === numerology.lifePathNumber || (idx + 1) % 9 === numerology.universalDay) {
      score += 15;
    }

    // Cap at 98
    score = Math.min(98, Math.max(30, score));

    return enrichCallingWithLife({
      ...t,
      affinityScore: score,
      resonanceDescription: `${t.calling} scores ${score}% today: ${t.quarter} quarter, ${t.gemstone}, ${t.zodiacCorrespondence}. ${t.archetypeRole}.`
    });
  });

  scores.sort((a, b) => b.affinityScore - a.affinityScore);
  const topCalling = scores[0];

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
    callingScores: scores,
    topCalling: topCalling,
    recommendedFocus: `Practice the way of ${topCalling.calling} through ${mayan.galacticTone.power.toLowerCase()} and grounding the ${chineseElement} matrix.`
  };
}
