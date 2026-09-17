/**
 * Dreamspell kin energy copy — what each node represents for the day.
 */

import { DreamspellDayCell } from './dreamspellCalendar';
import { GALACTIC_TONES, SOLAR_SEALS, THIRTEEN_MOONS, SolarSealDef } from './dreamspell';
import { GALACTIC_PORTAL_KINS } from './mayan';

export interface KinEnergyReading {
  title: string;
  sealHeadline: string;
  toneHeadline: string;
  dailyEnergy: string;
  sealDeep: string;
  toneDeep: string;
  combinedPractice: string;
  portalNote?: string;
  moonContext?: string;
}

function sealDailyCopy(seal: SolarSealDef): { headline: string; deep: string } {
  return {
    headline: `${seal.name} · ${seal.action} through ${seal.power}`,
    deep: `The ${seal.color.toLowerCase()} solar seal ${seal.name} (${seal.mayaName}) carries the essence of ${seal.essence.toLowerCase()}. Its action is to ${seal.action.toLowerCase()}; its power is ${seal.power.toLowerCase()}. In earth-family terms this kin sits with the ${seal.earthFamily} stream, opening ${seal.chakra.toLowerCase()} awareness for the day.`
  };
}

function toneDailyCopy(toneNumber: number): { headline: string; deep: string } {
  const tone = GALACTIC_TONES[toneNumber - 1];
  return {
    headline: `Tone ${tone.number} ${tone.name} · ${tone.action} ${tone.power}`,
    deep: `${tone.ray}. Today the galactic tone ${tone.name.toLowerCase()} asks you to ${tone.action.toLowerCase()} — working with ${tone.power.toLowerCase()} and the essence of ${tone.essence.toLowerCase()}. This is the rhythmic pulse beneath the solar seal: how the day moves, not just what it names.`
  };
}

export function describeKinEnergy(cell: DreamspellDayCell, moonName?: string): KinEnergyReading {
  const seal = cell.seal;
  const tone = GALACTIC_TONES[cell.toneNumber - 1];
  const sealCopy = sealDailyCopy(seal);
  const toneCopy = toneDailyCopy(cell.toneNumber);

  const dailyEnergy = `Kin ${cell.kin} weaves ${seal.essence.toLowerCase()} with ${tone.essence.toLowerCase()}. Expect the atmosphere to favor ${seal.action.toLowerCase()} that reveals ${seal.power.toLowerCase()}, paced by a ${tone.name.toLowerCase()} rhythm of ${tone.action.toLowerCase()} and ${tone.power.toLowerCase()}. This is practice language from the Dreamspell matrix — a lens for the day, not a fixed fate.`;

  const combinedPractice = `Practice: let ${seal.name.replace(/^(Red|White|Blue|Yellow) /, '').toLowerCase()} energy ${seal.action.toLowerCase()} through ${seal.power.toLowerCase()}, while Tone ${tone.number} ${tone.action.toLowerCase()}s your ${tone.essence.toLowerCase()}. Notice where ${seal.essence.toLowerCase()} and ${tone.essence.toLowerCase()} meet in one concrete choice before sunset.`;

  let moonContext: string | undefined;
  if (moonName) {
    const moon = THIRTEEN_MOONS.find((m) => m.name === moonName || moonName.startsWith(m.name.split(' ')[0]));
    if (moon) {
      moonContext = `${moon.name}: ${moon.question} Totem ${moon.animalTotem} colors the month-long backdrop for this kin.`;
    }
  }

  return {
    title: `Kin ${cell.kin}: ${seal.name} · Tone ${tone.number} ${tone.name}`,
    sealHeadline: sealCopy.headline,
    toneHeadline: toneCopy.headline,
    dailyEnergy,
    sealDeep: sealCopy.deep,
    toneDeep: toneCopy.deep,
    combinedPractice,
    portalNote: cell.isPortal
      ? 'Galactic Activation Portal (GAP) kin — a practice overlay for heightened synchronicity, deepened listening, and threshold crossings. Treat portal days as invitations to pause before acting.'
      : undefined,
    moonContext
  };
}

export function cellFromKin(kin: number): DreamspellDayCell {
  const seal = SOLAR_SEALS[(kin - 1) % 20];
  const tone = GALACTIC_TONES[(kin - 1) % 13];
  return {
    kin,
    seal,
    toneNumber: tone.number,
    toneName: tone.name,
    isPortal: GALACTIC_PORTAL_KINS.has(kin),
    isLeapSkip: false,
    isDayOutOfTime: false,
    year: 0,
    month: 0,
    day: 0
  };
}
