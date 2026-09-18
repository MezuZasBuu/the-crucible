/**
 * TGOLD epistemic bridge — maps Crucible EpistemicClass to TGOLD classification tags.
 */

import { EpistemicClass } from '../../types';
import { TGOLD_CLASSIFICATION_GUIDE } from './tgoldLegends';

export type TgoldClassificationTag = (typeof TGOLD_CLASSIFICATION_GUIDE)[number]['tag'];

const BRIDGE: Partial<Record<EpistemicClass, TgoldClassificationTag>> = {
  HISTORICAL_FACT: 'CONFIRMED',
  TEXTUAL_TRADITION: 'INTERPRETED',
  SCHOLARLY_INTERPRETATION: 'EMERGING PATTERN',
  COMPARATIVE_ANALOGY: 'INTERPRETED',
  SYSTEM_INTERPRETATION: 'EMERGING PATTERN',
  SPECULATIVE_SYNTHESIS: 'INTERPRETED',
  EMPIRICAL_EVIDENCE: 'CONFIRMED',
  COMPUTED_GEOMETRY: 'CONFIRMED'
};

export function tgoldTagForEpistemicClass(cls: EpistemicClass): TgoldClassificationTag {
  return BRIDGE[cls] || 'INTERPRETED';
}

export function tgoldGlossForEpistemicClass(cls: EpistemicClass): string {
  const tag = tgoldTagForEpistemicClass(cls);
  const entry = TGOLD_CLASSIFICATION_GUIDE.find((c) => c.tag === tag);
  return entry?.gloss || 'Plausible reading — verify scope.';
}
