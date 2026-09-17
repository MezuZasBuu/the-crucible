/**
 * Epistemic taxonomy + methodology defaults for The Crucible.
 * Distinguishes computed facts from tradition claims, analogies, and speculative overlays.
 */

import { EpistemicClass, MethodologyBundle, OutputRegister } from '../types';

export const EPISTEMIC_LABELS: Record<EpistemicClass, { label: string; short: string; color: string }> = {
  HISTORICAL_FACT: { label: 'Historical / calendrical fact', short: 'FACT', color: '#0e6a7a' },
  TEXTUAL_TRADITION: { label: 'Textual / traditional claim', short: 'TEXT', color: '#5b3d8a' },
  SCHOLARLY_INTERPRETATION: { label: 'Scholarly interpretation', short: 'SCHOLAR', color: '#3d5a8a' },
  COMPARATIVE_ANALOGY: { label: 'Comparative analogy', short: 'ANALOGY', color: '#7a5a1a' },
  SYSTEM_INTERPRETATION: { label: 'System-specific interpretation', short: 'SYSTEM', color: '#3f6b3c' },
  SPECULATIVE_SYNTHESIS: { label: 'Speculative synthesis', short: 'SPECULATIVE', color: '#9a4454' },
  EMPIRICAL_EVIDENCE: { label: 'Empirical / observational', short: 'EMPIRICAL', color: '#2f6b45' },
  COMPUTED_GEOMETRY: { label: 'Computed geometry', short: 'COMPUTED', color: '#2f4f5c' }
};

export const DEFAULT_METHODOLOGY: MethodologyBundle = {
  calendarCorrelation: 'GMT_584283',
  ayanamsha: 'lahiri',
  ephemerisModel: 'crucible_mean_motion_v1',
  houseSystem: 'none',
  chineseDayBoundary: 'solar_terms',
  zodiac: 'tropical_primary',
  includeVedic: true,
  includeGaiaOverlay: true,
  epistemicStrictMode: false,
  version: '1.0.0'
};

export function mergeMethodology(
  partial?: Partial<MethodologyBundle>
): MethodologyBundle {
  return { ...DEFAULT_METHODOLOGY, ...partial };
}

export function registerPromptHint(register: OutputRegister): string {
  switch (register) {
    case 'accessible':
      return 'Speak plainly for a general audience; define every specialized term once.';
    case 'practitioner':
      return 'Speak as to a working practitioner; keep original terminology with brief glosses.';
    case 'technical':
      return 'Prefer formulas, JD, degrees, and engine identifiers; minimize poetry.';
    case 'academic':
      return 'Cite traditions carefully; distinguish fact, text, interpretation, and analogy; never invent sources.';
    case 'comparative':
      return 'Compare systems without forcing equivalence; flag non-translatable concepts.';
    default:
      return '';
  }
}
