/**
 * The Crucible — Maya Calendrical Engine
 * Deterministic Mayan Long Count, Tzolk'in (260-day), Haab' (365-day),
 * and Calendar Round (18,980-day) calculations with GMT 584283 baseline.
 */

import { MayanGlyph, MayanResult, TemporalCoordinate } from '../types';

export const MAYAN_CORRELATIONS: Record<string, { name: string; jdn: number }> = {
  GMT_584283: { name: 'Goodman-Martinez-Thompson (584283)', jdn: 584283 },
  GMT_584285: { name: 'GMT Alternative (584285)', jdn: 584285 },
  SPINDEN_489384: { name: 'Spinden Correlation (489384)', jdn: 489384 }
};

export const TZOLKIN_SIGNS: MayanGlyph[] = [
  { id: 0, name: 'Imix', mayaName: "Imix'", yucatecName: 'Imix', meaning: 'Water Lily / Primal Source / Alligator', direction: 'East', color: '#dc2626', action: 'Initiates Birth & Nurturance', element: 'Water' },
  { id: 1, name: 'Ik', mayaName: "Ik'", yucatecName: "Ik'", meaning: 'Wind / Breath / Spirit / Communication', direction: 'North', color: '#ffffff', action: 'Inspires Truth & Velocity', element: 'Air' },
  { id: 2, name: 'Akbal', mayaName: "Ak'b'al", yucatecName: "Ak'b'al", meaning: 'Night / Hearth / Darkness / Dream Sanctuary', direction: 'West', color: '#2563eb', action: 'Encloses Introspection & Stillness', element: 'Earth' },
  { id: 3, name: 'Kan', mayaName: "K'an", yucatecName: "K'an", meaning: 'Corn / Seed / Ripeness / Abundance', direction: 'South', color: '#eab308', action: 'Targets Fertility & Potential', element: 'Fire' },
  { id: 4, name: 'Chicchan', mayaName: 'Chikchan', yucatecName: 'Chicchan', meaning: 'Serpent / Kundalini / Vital Force', direction: 'East', color: '#dc2626', action: 'Sheds Skin & Catalyzes Instinct', element: 'Water' },
  { id: 5, name: 'Cimi', mayaName: 'Kimi', yucatecName: 'Cimi', meaning: 'Death / Rebirth / Ancestral Transition', direction: 'North', color: '#ffffff', action: 'Surrenders Temporal Attachments', element: 'Air' },
  { id: 6, name: 'Manik', mayaName: "Manik'", yucatecName: 'Manik', meaning: 'Deer / Hand / Healing / Grasp', direction: 'West', color: '#2563eb', action: 'Accomplishes Realization & Gateways', element: 'Earth' },
  { id: 7, name: 'Lamat', mayaName: 'Lamat', yucatecName: 'Lamat', meaning: 'Star / Venus / Harmony / Seed of Light', direction: 'South', color: '#eab308', action: 'Beautifies Creation & Geometric Order', element: 'Fire' },
  { id: 8, name: 'Muluc', mayaName: 'Muluk', yucatecName: 'Muluc', meaning: 'Offering / Rain / Purification / Jade droplet', direction: 'East', color: '#dc2626', action: 'Purifies Universal Water & Flow', element: 'Water' },
  { id: 9, name: 'Oc', mayaName: 'Ok', yucatecName: 'Oc', meaning: 'Dog / Loyalty / Heart Guide / Companion', direction: 'North', color: '#ffffff', action: 'Protects Emotional Fidelity & Kinship', element: 'Air' },
  { id: 10, name: 'Chuen', mayaName: 'Chuwen', yucatecName: 'Chuen', meaning: 'Monkey / Weaver / Artistry / Magic', direction: 'West', color: '#2563eb', action: 'Plays with Illusion & Crafts Reality', element: 'Earth' },
  { id: 11, name: 'Eb', mayaName: 'Eb', yucatecName: 'Eb', meaning: 'Road / Human Chalice / Harvest', direction: 'South', color: '#eab308', action: 'Ascends Higher Frequency & Service', element: 'Fire' },
  { id: 12, name: 'Ben', mayaName: "B'en", yucatecName: 'Ben', meaning: 'Reed / Skywalker / Pillars of Heaven', direction: 'East', color: '#dc2626', action: 'Explores Unknown Spatial Corridors', element: 'Water' },
  { id: 13, name: 'Ix', mayaName: 'Ix', yucatecName: 'Ix', meaning: 'Jaguar / Shaman / Timeless Presence', direction: 'North', color: '#ffffff', action: 'Enchants Night Vision & Integrity', element: 'Air' },
  { id: 14, name: 'Men', mayaName: 'Men', yucatecName: 'Men', meaning: 'Eagle / Visionary / Planetary Mind', direction: 'West', color: '#2563eb', action: 'Elevates Cosmic Overview & Creation', element: 'Earth' },
  { id: 15, name: 'Cib', mayaName: "K'ib'", yucatecName: 'Cib', meaning: 'Owl / Vulture / Cosmic Memory / Warrior', direction: 'South', color: '#eab308', action: 'Questions Fear & Attunes Forgiveness', element: 'Fire' },
  { id: 16, name: 'Caban', mayaName: "Kab'an", yucatecName: 'Caban', meaning: 'Earth / Earthquake / Synchronization', direction: 'East', color: '#dc2626', action: 'Evolves Navigation & Gaia Heartbeat', element: 'Water' },
  { id: 17, name: 'Etznab', mayaName: "Etz'nab'", yucatecName: 'Etznab', meaning: 'Flint / Obsidian Mirror / Discernment', direction: 'North', color: '#ffffff', action: 'Reflects Truth & Cleaves Illusion', element: 'Air' },
  { id: 18, name: 'Cauac', mayaName: 'Kawak', yucatecName: 'Cauac', meaning: 'Storm / Lightning / Superconductor', direction: 'West', color: '#2563eb', action: 'Catalyzes Self-Generation & Ecstasy', element: 'Earth' },
  { id: 19, name: 'Ahau', mayaName: 'Ajaw', yucatecName: 'Ahau', meaning: 'Sun / Lord / Christ Light / Enlightenment', direction: 'South', color: '#eab308', action: 'Radiates Universal Unconditional Love', element: 'Fire' }
];

export const HAAB_MONTHS = [
  { id: 0, name: 'Pop', meaning: 'Mat / Leadership / Beginning' },
  { id: 1, name: 'Wo', meaning: 'Black Conjunction / Night Frog' },
  { id: 2, name: 'Sip', meaning: 'Red Conjunction / Storm' },
  { id: 3, name: 'Sotz', meaning: 'Bat / Cave of Shadows' },
  { id: 4, name: 'Sek', meaning: 'Death / Purification / Skull' },
  { id: 5, name: 'Xul', meaning: 'End / Winged Dog' },
  { id: 6, name: 'Yaxkin', meaning: 'New Sun / First Green' },
  { id: 7, name: 'Mol', meaning: 'Water Gathering / Conjunction' },
  { id: 8, name: 'Chen', meaning: 'Black Storm / Well of Depths' },
  { id: 9, name: 'Yax', meaning: 'Green Storm / First Blossom' },
  { id: 10, name: 'Zac', meaning: 'White Storm / Purity' },
  { id: 11, name: 'Keh', meaning: 'Red Storm / Stag' },
  { id: 12, name: 'Mak', meaning: 'Covered / Secret Closure' },
  { id: 13, name: 'Kankin', meaning: 'Yellow Sun / Autumnal Fire' },
  { id: 14, name: 'Muwan', meaning: 'Moaning Bird / Rains' },
  { id: 15, name: 'Pax', meaning: 'Music / Planting Drums' },
  { id: 16, name: 'Kayab', meaning: 'Turtle / Singer of Earth' },
  { id: 17, name: 'Kumku', meaning: 'Granary / Gods in Corn' },
  { id: 18, name: 'Wayeb', meaning: 'The 5 Nameless / Threshold Days' }
];

export const GALACTIC_TONES = [
  { number: 1, name: 'Magnetic', quality: 'Unity', power: 'Attracts Purpose' },
  { number: 2, name: 'Lunar', quality: 'Polarity', power: 'Stabilizes Challenge' },
  { number: 3, name: 'Electric', quality: 'Rhythm', power: 'Activates Service' },
  { number: 4, name: 'Self-Existing', quality: 'Measure', power: 'Defines Form' },
  { number: 5, name: 'Overtone', quality: 'Radiance', power: 'Commands Radiance' },
  { number: 6, name: 'Rhythmic', quality: 'Equality', power: 'Organizes Balance' },
  { number: 7, name: 'Resonant', quality: 'Attunement', power: 'Channels Inspire' },
  { number: 8, name: 'Galactic', quality: 'Integrity', power: 'Harmonizes Model' },
  { number: 9, name: 'Solar', quality: 'Intention', power: 'Pulses Realization' },
  { number: 10, name: 'Planetary', quality: 'Manifestation', power: 'Produces Perfection' },
  { number: 11, name: 'Spectral', quality: 'Liberation', power: 'Dissolves Release' },
  { number: 12, name: 'Crystal', quality: 'Cooperation', power: 'Dedicates Universal Court' },
  { number: 13, name: 'Cosmic', quality: 'Presence', power: 'Endures Transcendence' }
];

// Fixed 52 Galactic Activation Portal days in 260-kin matrix
export const GALACTIC_PORTAL_KINS = new Set([
  1, 20, 22, 39, 43, 50, 51, 58, 64, 69, 72, 77, 85, 88, 93, 96,
  106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
  146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
  165, 168, 173, 176, 184, 189, 192, 197, 203, 210, 211, 218, 222, 239, 241, 260
]);

/**
 * Calculates complete Mayan temporal coordinates from a given Julian Day UT.
 */
export function calculateMayan(
  temporal: TemporalCoordinate,
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384' = 'GMT_584283'
): MayanResult {
  const correlation = MAYAN_CORRELATIONS[correlationKey] || MAYAN_CORRELATIONS.GMT_584283;
  const correlationJDN = correlation.jdn;

  // Day count (integral Julian Day at noon)
  const daysSinceEpoch = Math.floor(temporal.julianDayUT - correlationJDN + 0.5);

  // Long Count Math
  // 1 kin = 1 day
  // 1 uinal = 20 kin
  // 1 tun = 18 uinal = 360 kin
  // 1 katun = 20 tun = 7,200 kin
  // 1 baktun = 20 katun = 144,000 kin
  let remaining = daysSinceEpoch;
  const baktun = Math.floor(remaining / 144000);
  remaining -= baktun * 144000;

  const katun = Math.floor(remaining / 7200);
  remaining -= katun * 7200;

  const tun = Math.floor(remaining / 360);
  remaining -= tun * 360;

  const uinal = Math.floor(remaining / 20);
  remaining -= uinal * 20;

  const kin = remaining;

  // Tzolk'in calculation (260-day cycle)
  // At epoch 0.0.0.0.0, the Tzolk'in was 4 Ajaw (Ahau)
  // Number: ((daysSinceEpoch + 3) % 13) + 1 => range 1..13
  let tzolkinNumber = ((daysSinceEpoch % 13) + 4) % 13;
  if (tzolkinNumber <= 0) tzolkinNumber += 13;

  // Glyph index: ((daysSinceEpoch + 19) % 20) => 0=Imix, 19=Ahau
  // At epoch 0.0.0.0.0, Ahau is index 19
  let glyphIndex = ((daysSinceEpoch % 20) + 19) % 20;
  if (glyphIndex < 0) glyphIndex += 20;
  const tzolkinGlyph = TZOLKIN_SIGNS[glyphIndex];

  // Haab' calculation (365-day cycle)
  // At epoch 0.0.0.0.0, the Haab' date was 8 Kumk'u
  // 8 Kumk'u is month index 17 (Kumk'u), day 8.
  // 17 * 20 + 8 = 348 days from 0 Pop.
  let haabDayOfCycle = ((daysSinceEpoch + 348) % 365 + 365) % 365;

  let haabMonthIndex = 0;
  let haabDayNumber = 0;
  let isWayeb = false;

  if (haabDayOfCycle >= 360) {
    haabMonthIndex = 18; // Wayeb'
    haabDayNumber = haabDayOfCycle - 360; // 0..4
    isWayeb = true;
  } else {
    haabMonthIndex = Math.floor(haabDayOfCycle / 20);
    haabDayNumber = haabDayOfCycle % 20; // 0..19
  }
  const haabMonth = HAAB_MONTHS[haabMonthIndex];

  // Dreamspell / Kin number calculation (1 to 260)
  // Kin = ((glyphIndex - (tzolkinNumber - 1)) % 20 ...) standard matrix lookup
  // Formula: kin = (daysSinceEpoch + 58) % 260 + 1 (aligned with modern Dreamspell 13:20 matrix)
  const kinNumber = ((daysSinceEpoch + 58) % 260 + 260) % 260 + 1;
  const isGalacticPortalDay = GALACTIC_PORTAL_KINS.has(kinNumber);

  const tone = GALACTIC_TONES[(tzolkinNumber - 1) % 13];

  const longCountFormatted = `${baktun}.${katun}.${tun}.${uinal}.${kin}`;
  const tzolkinFormatted = `${tzolkinNumber} ${tzolkinGlyph.yucatecName}`;
  const haabFormatted = `${haabDayNumber} ${haabMonth.name}`;
  const calendarRound = `${tzolkinFormatted} ${haabFormatted}`;

  return {
    correlationId: correlationKey,
    correlationJDN,
    daysSinceEpoch,
    longCount: {
      baktun,
      katun,
      tun,
      uinal,
      kin,
      formatted: longCountFormatted
    },
    tzolkin: {
      number: tzolkinNumber,
      signName: tzolkinGlyph.name,
      yucatecName: tzolkinGlyph.yucatecName,
      glyphIndex,
      meaning: tzolkinGlyph.meaning,
      direction: tzolkinGlyph.direction,
      element: tzolkinGlyph.element,
      formatted: tzolkinFormatted
    },
    haab: {
      day: haabDayNumber,
      monthName: haabMonth.name,
      monthIndex: haabMonthIndex,
      isWayeb,
      meaning: haabMonth.meaning,
      formatted: haabFormatted
    },
    calendarRound,
    kinNumber,
    isGalacticPortalDay,
    galacticTone: tone
  };
}
