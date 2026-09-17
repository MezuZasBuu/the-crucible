/**
 * The Crucible — Dreamspell 13:20 Synchronometer Engine
 * José Argüelles 13-Moon 28-Day Synchronometer, 260 Galactic Signatures,
 * Wavespells, Castles, 5-Kin Fifth Force Oracle, and Radial Plasmas.
 * Written with smooth, luminous novel-like literary prose.
 */

import { DreamspellOracle, DreamspellResult, TemporalCoordinate } from '../types';

export interface SolarSealDef {
  number: number;
  name: string;
  mayaName: string;
  color: 'Red' | 'White' | 'Blue' | 'Yellow';
  action: string;
  power: string;
  essence: string;
  chakra: string;
  earthFamily: 'Polar' | 'Cardinal' | 'Core' | 'Signal' | 'Gateway';
}

export const SOLAR_SEALS: SolarSealDef[] = [
  { number: 1, name: 'Red Dragon', mayaName: 'Imix', color: 'Red', action: 'Nurtures', power: 'Birth', essence: 'Being', chakra: 'Throat', earthFamily: 'Cardinal' },
  { number: 2, name: 'White Wind', mayaName: 'Ik', color: 'White', action: 'Communicates', power: 'Spirit', essence: 'Breath', chakra: 'Heart', earthFamily: 'Core' },
  { number: 3, name: 'Blue Night', mayaName: 'Akbal', color: 'Blue', action: 'Dreams', power: 'Abundance', essence: 'Intuition', chakra: 'Solar Plexus', earthFamily: 'Signal' },
  { number: 4, name: 'Yellow Seed', mayaName: 'Kan', color: 'Yellow', action: 'Targets', power: 'Flowering', essence: 'Awareness', chakra: 'Root', earthFamily: 'Gateway' },
  { number: 5, name: 'Red Serpent', mayaName: 'Chicchan', color: 'Red', action: 'Survives', power: 'Life Force', essence: 'Instinct', chakra: 'Crown', earthFamily: 'Polar' },
  { number: 6, name: 'White Worldbridger', mayaName: 'Cimi', color: 'White', action: 'Equalizes', power: 'Death', essence: 'Opportunity', chakra: 'Throat', earthFamily: 'Cardinal' },
  { number: 7, name: 'Blue Hand', mayaName: 'Manik', color: 'Blue', action: 'Knows', power: 'Accomplishment', essence: 'Healing', chakra: 'Heart', earthFamily: 'Core' },
  { number: 8, name: 'Yellow Star', mayaName: 'Lamat', color: 'Yellow', action: 'Beautifies', power: 'Elegance', essence: 'Art', chakra: 'Solar Plexus', earthFamily: 'Signal' },
  { number: 9, name: 'Red Moon', mayaName: 'Muluc', color: 'Red', action: 'Purifies', power: 'Universal Water', essence: 'Flow', chakra: 'Root', earthFamily: 'Gateway' },
  { number: 10, name: 'White Dog', mayaName: 'Oc', color: 'White', action: 'Loves', power: 'Heart', essence: 'Loyalty', chakra: 'Crown', earthFamily: 'Polar' },
  { number: 11, name: 'Blue Monkey', mayaName: 'Chuen', color: 'Blue', action: 'Plays', power: 'Magic', essence: 'Illusion', chakra: 'Throat', earthFamily: 'Cardinal' },
  { number: 12, name: 'Yellow Human', mayaName: 'Eb', color: 'Yellow', action: 'Influences', power: 'Free Will', essence: 'Wisdom', chakra: 'Heart', earthFamily: 'Core' },
  { number: 13, name: 'Red Skywalker', mayaName: 'Ben', color: 'Red', action: 'Explores', power: 'Space', essence: 'Wakefulness', chakra: 'Solar Plexus', earthFamily: 'Signal' },
  { number: 14, name: 'White Wizard', mayaName: 'Ix', color: 'White', action: 'Enchants', power: 'Timelessness', essence: 'Receptivity', chakra: 'Root', earthFamily: 'Gateway' },
  { number: 15, name: 'Blue Eagle', mayaName: 'Men', color: 'Blue', action: 'Creates', power: 'Mind', essence: 'Vision', chakra: 'Crown', earthFamily: 'Polar' },
  { number: 16, name: 'Yellow Warrior', mayaName: 'Cib', color: 'Yellow', action: 'Questions', power: 'Intelligence', essence: 'Fearlessness', chakra: 'Throat', earthFamily: 'Cardinal' },
  { number: 17, name: 'Red Earth', mayaName: 'Caban', color: 'Red', action: 'Evolves', power: 'Navigation', essence: 'Synchronicity', chakra: 'Heart', earthFamily: 'Core' },
  { number: 18, name: 'White Mirror', mayaName: 'Etznab', color: 'White', action: 'Reflects', power: 'Endlessness', essence: 'Order', chakra: 'Solar Plexus', earthFamily: 'Signal' },
  { number: 19, name: 'Blue Storm', mayaName: 'Cauac', color: 'Blue', action: 'Catalyzes', power: 'Self-Generation', essence: 'Energy', chakra: 'Root', earthFamily: 'Gateway' },
  { number: 20, name: 'Yellow Sun', mayaName: 'Ahau', color: 'Yellow', action: 'Enlightens', power: 'Universal Fire', essence: 'Life', chakra: 'Crown', earthFamily: 'Polar' }
];

export const GALACTIC_TONES = [
  { number: 1, name: 'Magnetic', ray: 'First Ray of Unification', action: 'Unify', power: 'Purpose', essence: 'Attraction' },
  { number: 2, name: 'Lunar', ray: 'Second Ray of Polarity', action: 'Polarize', power: 'Challenge', essence: 'Stability' },
  { number: 3, name: 'Electric', ray: 'Third Ray of Activation', action: 'Activate', power: 'Service', essence: 'Bonding' },
  { number: 4, name: 'Self-Existing', ray: 'Fourth Ray of Order', action: 'Define', power: 'Form', essence: 'Measure' },
  { number: 5, name: 'Overtone', ray: 'Fifth Ray of Radiance', action: 'Empower', power: 'Radiance', essence: 'Command' },
  { number: 6, name: 'Rhythmic', ray: 'Sixth Ray of Equality', action: 'Organize', power: 'Equality', essence: 'Balance' },
  { number: 7, name: 'Resonant', ray: 'Seventh Ray of Attunement', action: 'Channel', power: 'Attunement', essence: 'Inspiration' },
  { number: 8, name: 'Galactic', ray: 'Eighth Ray of Integrity', action: 'Harmonize', power: 'Integrity', essence: 'Modeling' },
  { number: 9, name: 'Solar', ray: 'Ninth Ray of Intention', action: 'Mobilize', power: 'Intention', essence: 'Pulse' },
  { number: 10, name: 'Planetary', ray: 'Tenth Ray of Manifestation', action: 'Perfect', power: 'Manifestation', essence: 'Production' },
  { number: 11, name: 'Spectral', ray: 'Eleventh Ray of Liberation', action: 'Dissolve', power: 'Liberation', essence: 'Release' },
  { number: 12, name: 'Crystal', ray: 'Twelfth Ray of Cooperation', action: 'Dedicate', power: 'Cooperation', essence: 'Universalization' },
  { number: 13, name: 'Cosmic', ray: 'Thirteenth Ray of Transcendence', action: 'Endure', power: 'Presence', essence: 'Transcendence' }
];

export const THIRTEEN_MOONS = [
  { number: 1, name: 'Magnetic Bat Moon', animalTotem: 'Bat', question: 'What is my purpose?' },
  { number: 2, name: 'Lunar Scorpion Moon', animalTotem: 'Scorpion', question: 'What is my obstacle and challenge?' },
  { number: 3, name: 'Electric Deer Moon', animalTotem: 'Deer', question: 'How can I best serve?' },
  { number: 4, name: 'Self-Existing Owl Moon', animalTotem: 'Owl', question: 'What form will my service take?' },
  { number: 5, name: 'Overtone Peacock Moon', animalTotem: 'Peacock', question: 'How can I best empower myself?' },
  { number: 6, name: 'Rhythmic Lizard Moon', animalTotem: 'Lizard', question: 'How can I extend equality and balance to others?' },
  { number: 7, name: 'Resonant Monkey Moon', animalTotem: 'Monkey', question: 'How can I attune my service to greater harmony?' },
  { number: 8, name: 'Galactic Hawk Moon', animalTotem: 'Hawk', question: 'Do I live what I believe with integrity?' },
  { number: 9, name: 'Solar Jaguar Moon', animalTotem: 'Jaguar', question: 'How do I mobilize towards my highest intention?' },
  { number: 10, name: 'Planetary Dog Moon', animalTotem: 'Dog', question: 'How can I perfect what I produce?' },
  { number: 11, name: 'Spectral Serpent Moon', animalTotem: 'Serpent', question: 'How do I release, dissolve, and surrender?' },
  { number: 12, name: 'Crystal Rabbit Moon', animalTotem: 'Rabbit', question: 'How do I dedicate myself to universal cooperation?' },
  { number: 13, name: 'Cosmic Turtle Moon', animalTotem: 'Turtle', question: 'How can I expand my joy and presence?' }
];

export const RADIAL_PLASMAS = [
  { name: 'Dali', chakra: 'Crown', quantumFunction: 'Thermal Force', mantra: 'My father is intrinsic awareness. I feel the heat.' },
  { name: 'Seli', chakra: 'Root', quantumFunction: 'Electro-thermal Force', mantra: 'My mother is the sphere. I shed light.' },
  { name: 'Gamma', chakra: 'Third Eye', quantumFunction: 'Thermic-Luminic', mantra: 'My lineage is the spiral of light. I attain peace.' },
  { name: 'Kali', chakra: 'Sacral', quantumFunction: 'Catalytic Agent', mantra: 'My name is the glorious secret. I ignite clarity.' },
  { name: 'Alfa', chakra: 'Throat', quantumFunction: 'Double Electron', mantra: 'I release the double-extended electron at the south pole.' },
  { name: 'Limi', chakra: 'Solar Plexus', quantumFunction: 'Mental Electron', mantra: 'I consume dualistic thoughts as nourishment.' },
  { name: 'Silio', chakra: 'Heart', quantumFunction: 'Crystal Plasma', mantra: 'I discharge the rainbow bridge at the center of the earth.' }
];

/**
 * Calculates Dreamspell Kin for any given Gregorian Date.
 * In the Dreamspell system:
 * - July 26 is the New Year (e.g. July 26, 1990 was Kin 144)
 * - Leap Days (Feb 29) are treated as 0.0 Hunab Ku (do not advance the 260 kin count).
 */
export function calculateDreamspell(temporal: TemporalCoordinate): DreamspellResult {
  // Parse year, month, day
  const d = new Date(temporal.isoString);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1; // 1-12
  const day = d.getUTCDate();

  // Canonical base anchor: July 26, 2013 was Kin 164 (Yellow Galactic Seed)
  const anchorDate = new Date(Date.UTC(2013, 6, 26)); // Month 6 = July
  const targetDate = new Date(Date.UTC(year, month - 1, day));

  // Compute elapsed real days
  const diffTime = targetDate.getTime() - anchorDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Count leap days (Feb 29) between anchor and target to subtract them
  let leapDaysCount = 0;
  const startYr = Math.min(2013, year);
  const endYr = Math.max(2013, year);
  for (let y = startYr; y <= endYr; y++) {
    const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    if (isLeap) {
      const feb29 = new Date(Date.UTC(y, 1, 29)).getTime();
      if (diffDays >= 0) {
        if (feb29 > anchorDate.getTime() && feb29 <= targetDate.getTime()) {
          leapDaysCount++;
        }
      } else {
        if (feb29 < anchorDate.getTime() && feb29 >= targetDate.getTime()) {
          leapDaysCount--;
        }
      }
    }
  }

  const dreamspellDays = diffDays - leapDaysCount;
  let rawKin = (164 + dreamspellDays) % 260;
  while (rawKin <= 0) rawKin += 260;
  const kin = rawKin;

  // Derive Solar Seal and Galactic Tone
  const sealIndex = ((kin - 1) % 20); // 0-19
  const seal = SOLAR_SEALS[sealIndex];
  const toneIndex = ((kin - 1) % 13); // 0-12
  const tone = GALACTIC_TONES[toneIndex];

  // Signature
  const signature = `Kin ${kin}: ${seal.name} (Tone ${tone.number} ${tone.name})`;

  // Color Family
  const colorFamilies = {
    Red: { name: 'Red Initiator Family', essence: 'Creation and Primordial Force', role: 'Ignites the spark of genesis and sets the cosmic cycle into motion.' },
    White: { name: 'White Refiner Family', essence: 'Clarity, Discipline, and Breath', role: 'Purifies raw experience and clarifies intentions into transcendent stillness.' },
    Blue: { name: 'Blue Transformer Family', essence: 'Alchemical Magic and Mutation', role: 'Dissolves rigid structures and channels metamorphic growth through the deep waters.' },
    Yellow: { name: 'Yellow Ripener Family', essence: 'Wisdom, Illumination, and Fruit', role: 'Brings seeds to blossom and distributes harvest to the planetary mind.' }
  };
  const colorFamily = colorFamilies[seal.color];

  // Earth Family
  const earthFamilies = {
    Polar: { name: 'Polar' as const, role: 'Receives the Galactic Sound Bar-Dot spectrum', chakras: 'Crown' },
    Cardinal: { name: 'Cardinal' as const, role: 'Transmits genesis force into physical manifestation', chakras: 'Throat' },
    Core: { name: 'Core' as const, role: 'Transmutes heart wisdom and magnetic anchors', chakras: 'Heart' },
    Signal: { name: 'Signal' as const, role: 'Unravels future potentials and intuitions', chakras: 'Solar Plexus' },
    Gateway: { name: 'Gateway' as const, role: 'Opens dimensional inter-galactic portals', chakras: 'Root' }
  };
  const earthFamily = earthFamilies[seal.earthFamily];

  // Castle of Time (52 Kins each = 260)
  let castle: { name: string; court: string; color: string; meaning: string };
  if (kin <= 52) {
    castle = { name: 'Red Eastern Castle of Turning', court: 'Court of Birth', color: '#ef4444', meaning: 'Initiation of evolutionary consciousness, where the soul awakens to galactic destiny.' };
  } else if (kin <= 104) {
    castle = { name: 'White Northern Castle of Crossing', court: 'Court of Death', color: '#f8fafc', meaning: 'The sanctuary of refinement and surrender, where old karmic masks fall away in quiet lucidity.' };
  } else if (kin <= 156) {
    castle = { name: 'Blue Western Castle of Burning', court: 'Court of Magic', color: '#3b82f6', meaning: 'The crucible of transfiguration, where intense alchemical friction melts illusion into authentic presence.' };
  } else if (kin <= 208) {
    castle = { name: 'Yellow Southern Castle of Giving', court: 'Court of Intelligence', color: '#eab308', meaning: 'The pavilion of enlightened maturity, where wisdom is poured out freely to sustain creation.' };
  } else {
    castle = { name: 'Green Central Castle of Enchantment', court: 'Court of the Matrix', color: '#10b981', meaning: 'The axis mundi of Hunab Ku, where all polarities synchronize in timeless galactic celebration.' };
  }

  // Wavespell (13-Kin cycle)
  const wavespellNumber = Math.floor((kin - 1) / 13) + 1;
  const wavespellStartKin = (wavespellNumber - 1) * 13 + 1;
  const wavespellEndKin = wavespellStartKin + 12;
  const wavespellSeal = SOLAR_SEALS[((wavespellStartKin - 1) % 20)];
  const positionInWavespell = tone.number;

  // Fifth Force Oracle:
  // 1. Destiny Kin: Current kin
  // 2. Guide Kin: Higher guidance
  let guideSealIndex = sealIndex;
  if (tone.number === 1 || tone.number === 6 || tone.number === 11) {
    guideSealIndex = sealIndex;
  } else if (tone.number === 2 || tone.number === 7 || tone.number === 12) {
    guideSealIndex = (sealIndex + 12) % 20;
  } else if (tone.number === 3 || tone.number === 8 || tone.number === 13) {
    guideSealIndex = (sealIndex + 4) % 20;
  } else if (tone.number === 4 || tone.number === 9) {
    guideSealIndex = (sealIndex + 16) % 20;
  } else if (tone.number === 5 || tone.number === 10) {
    guideSealIndex = (sealIndex + 8) % 20;
  }
  const guideKin = ((guideSealIndex + (tone.number - 1) * 20) % 260) + 1;

  // 3. Analog Kin (Solar Twin / Support): (19 - sealIndex) % 20
  const analogSealIndex = (19 - sealIndex + 20) % 20;
  const analogKin = ((analogSealIndex + (tone.number - 1) * 20) % 260) + 1;

  // 4. Antipode Kin (Challenge / Strengthening): (sealIndex + 10) % 20
  const antipodeSealIndex = (sealIndex + 10) % 20;
  const antipodeKin = ((antipodeSealIndex + (tone.number - 1) * 20) % 260) + 1;

  // 5. Occult Kin (Hidden Power / Ally):
  const occultSealIndex = (20 - sealIndex) % 20;
  const occultToneNumber = 14 - tone.number;
  const occultKin = ((occultSealIndex + (occultToneNumber - 1) * 20) % 260) + 1;

  const oracle: DreamspellOracle = {
    destiny: { kin, name: seal.name, seal: seal.mayaName, tone: tone.number },
    guide: { kin: guideKin, name: SOLAR_SEALS[guideSealIndex].name, seal: SOLAR_SEALS[guideSealIndex].mayaName, tone: tone.number },
    analog: { kin: analogKin, name: SOLAR_SEALS[analogSealIndex].name, seal: SOLAR_SEALS[analogSealIndex].mayaName, tone: tone.number },
    antipode: { kin: antipodeKin, name: SOLAR_SEALS[antipodeSealIndex].name, seal: SOLAR_SEALS[antipodeSealIndex].mayaName, tone: tone.number },
    occult: { kin: occultKin, name: SOLAR_SEALS[occultSealIndex].name, seal: SOLAR_SEALS[occultSealIndex].mayaName, tone: occultToneNumber }
  };

  // 13 Moon Position
  // Year start: July 26
  let moonYear = year;
  const thisYearJuly26 = new Date(Date.UTC(year, 6, 26)).getTime();
  if (targetDate.getTime() < thisYearJuly26) {
    moonYear = year - 1;
  }
  const currentYearStart = new Date(Date.UTC(moonYear, 6, 26));
  const diffFromJuly26 = Math.floor((targetDate.getTime() - currentYearStart.getTime()) / (1000 * 60 * 60 * 24));

  const isDayOutOfTime = month === 7 && day === 25;
  let moonNumber = 1;
  let dayOfMoon = 1;
  let weekNumber = 1;

  if (isDayOutOfTime) {
    moonNumber = 13;
    dayOfMoon = 29; // Transcendent Day Out of Time
    weekNumber = 4;
  } else {
    let dayIndex = diffFromJuly26;
    if (dayIndex < 0) dayIndex += 365;
    moonNumber = Math.min(13, Math.floor(dayIndex / 28) + 1);
    dayOfMoon = (dayIndex % 28) + 1;
    weekNumber = Math.min(4, Math.floor((dayOfMoon - 1) / 7) + 1);
  }

  const moonInfo = THIRTEEN_MOONS[moonNumber - 1];
  const plasmaIndex = (dayOfMoon - 1) % 7;
  const radialPlasma = RADIAL_PLASMAS[plasmaIndex >= 0 && plasmaIndex < 7 ? plasmaIndex : 0];

  // Smooth, novel-like poetic narrative
  const poeticNarrative = `In the quiet architecture of the cosmos, Kin ${kin} awakens as the ${seal.name} vibrating at the frequency of Tone ${tone.number} (${tone.name}). It moves as an emissary of the ${colorFamily.name}, whose timeless purpose is to ${seal.action.toLowerCase()} reality through the radiant power of ${seal.power.toLowerCase()}. Situated within the sacred precincts of the ${castle.name}, the traveler journeys through the ${wavespellSeal.name} Wavespell, holding the question of the ${moonInfo.name}: “${moonInfo.question}” Guided by ${SOLAR_SEALS[guideSealIndex].name}, anchored by the twin light of ${SOLAR_SEALS[analogSealIndex].name}, fortified by the noble friction of ${SOLAR_SEALS[antipodeSealIndex].name}, and protected from beneath by the mystic occult whisper of ${SOLAR_SEALS[occultSealIndex].name}, the day unfolds not as a cold timestamp, but as a living verse in the planetary romance of time.`;

  return {
    kin,
    solarSeal: {
      number: seal.number,
      name: seal.name,
      mayaName: seal.mayaName,
      action: seal.action,
      power: seal.power,
      essence: seal.essence,
      color: seal.color,
      chakra: seal.chakra
    },
    galacticTone: {
      number: tone.number,
      name: tone.name,
      ray: tone.ray,
      action: tone.action,
      power: tone.power,
      essence: tone.essence
    },
    signature,
    colorFamily,
    earthFamily,
    castle,
    wavespell: {
      name: `${wavespellSeal.name} Wavespell`,
      kinStart: wavespellStartKin,
      kinEnd: wavespellEndKin,
      positionInWavespell,
      teachings: `The path of ${wavespellSeal.action} unfolds across thirteen days, inviting the spirit to ${wavespellSeal.essence.toLowerCase()} with devotion.`
    },
    oracle,
    thirteenMoon: {
      moonNumber,
      moonName: moonInfo.name,
      animalTotem: moonInfo.animalTotem,
      serviceQuestion: moonInfo.question,
      dayOfMoon,
      isDayOutOfTime,
      weekNumber,
      radialPlasma
    },
    poeticNarrative
  };
}
