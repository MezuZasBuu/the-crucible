/**
 * The Crucible — Numerological Systems
 * Pythagorean, Chaldean vibrational systems, Master Numbers (11, 22, 33),
 * Universal & Personal temporal cycles.
 */

import { NumerologyResult, TemporalCoordinate } from '../types';

export const PYTHAGOREAN_TABLE: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

export const CHALDEAN_TABLE: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

export const NUMBER_MEANINGS: Record<number, string> = {
  1: 'The Monad: Prime Initiator, Leadership, Independent Will, Creative Pioneer',
  2: 'The Dyad: Receptive Polarity, Diplomatic Balance, Synthesis, Intuitive Mirror',
  3: 'The Triad: Creative Trinity, Expression, Joyful Radiance, Synthesizing Bridge',
  4: 'The Tetrad: Foundation of Form, Sacred Geometry, Earthly Order, Builder of Temples',
  5: 'The Pentad: Dynamic Velocity, Freedom, Expansion, Fivefold Elemental Gateway',
  6: 'The Hexad: Cosmic Harmony, Nurturance, Sacred Equilibrium, Heart-Centered Service',
  7: 'The Heptad: Mystical Introspection, Truth Seeking, Inner Temple, Esoteric Alchemy',
  8: 'The Ogdoad: Infinite Manifestation, Power, Karmic Equilibrium, Material Mastery',
  9: 'The Ennead: Universal Completion, Humanitarian Grace, Transcendence, Wisdom',
  11: 'Master Number 11: Spiritual Illumination, Visionary Intuition, Lightning Bridge',
  22: 'Master Number 22: Master Architect, Grounding Vision into Physical Reality',
  33: 'Master Number 33: Master Teacher, Christ Consciousness, Unconditional Avatar'
};

/**
 * Digit sum reduction with Master Number preservation (11, 22, 33).
 */
export function reduceToRootNumber(num: number, preserveMaster = true): number {
  let current = Math.abs(num);
  while (current > 9) {
    if (preserveMaster && (current === 11 || current === 22 || current === 33)) {
      return current;
    }
    const digits = current.toString().split('').map(Number);
    current = digits.reduce((sum, d) => sum + d, 0);
  }
  return current;
}

/**
 * Calculates Pythagorean name vibration
 */
export function calculateNameNumber(name: string, table = PYTHAGOREAN_TABLE): number {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  for (const char of clean) {
    sum += table[char] || 0;
  }
  return reduceToRootNumber(sum);
}

/**
 * Calculates complete Numerological profile from temporal date.
 */
export function calculateNumerology(temporal: TemporalCoordinate, name = 'THE CRUCIBLE'): NumerologyResult {
  const [yearStr, monthStr, dayStr] = temporal.utcDateString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Life Path Number
  const reducedYear = reduceToRootNumber(year);
  const reducedMonth = reduceToRootNumber(month);
  const reducedDay = reduceToRootNumber(day);
  const lifePathRaw = reducedYear + reducedMonth + reducedDay;
  const lifePathNumber = reduceToRootNumber(lifePathRaw);
  const lifePathIsMaster = lifePathNumber === 11 || lifePathNumber === 22 || lifePathNumber === 33;

  // Universal cycles for the day
  const universalYear = reduceToRootNumber(year);
  const universalMonth = reduceToRootNumber(universalYear + month);
  const universalDay = reduceToRootNumber(universalMonth + day);

  // Expression Number (all letters in name)
  const expressionNumber = calculateNameNumber(name, PYTHAGOREAN_TABLE);

  // Soul Urge (vowels only: A, E, I, O, U)
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  const vowels = new Set(['A', 'E', 'I', 'O', 'U']);
  let vowelSum = 0;
  let consonantSum = 0;
  for (const char of cleanName) {
    const val = PYTHAGOREAN_TABLE[char] || 0;
    if (vowels.has(char)) {
      vowelSum += val;
    } else {
      consonantSum += val;
    }
  }
  const soulUrgeNumber = reduceToRootNumber(vowelSum);
  const personalityNumber = reduceToRootNumber(consonantSum);

  // Chaldean Vibration for the name
  const chaldeanVibration = calculateNameNumber(name, CHALDEAN_TABLE);

  // Personal Year based on Life Path and current year
  const personalYear = reduceToRootNumber(reducedDay + reducedMonth + universalYear);

  const meaning = NUMBER_MEANINGS[lifePathNumber] || NUMBER_MEANINGS[reduceToRootNumber(lifePathNumber, false)];
  const compositeVibrationSummary = `Life Path ${lifePathNumber} | Universal Day ${universalDay} | Chaldean Vibrational Root ${chaldeanVibration}`;

  return {
    lifePathNumber,
    lifePathIsMaster,
    expressionNumber,
    soulUrgeNumber,
    personalityNumber,
    universalYear,
    universalMonth,
    universalDay,
    personalYear,
    chaldeanVibration,
    numberMeanings: NUMBER_MEANINGS,
    compositeVibrationSummary
  };
}
