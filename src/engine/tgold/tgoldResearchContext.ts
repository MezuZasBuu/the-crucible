/**
 * TGOLD research context builder — enriches LLM prompts with evidence vectors and practice nuance.
 */

import { CompleteCalculationContext } from '../../types';
import { CANONICAL_RULESETS } from '../knowledgeBase';
import { vectorsForTraditions, TGOLD_CORE_PRINCIPLES } from './evidenceVectors';
import { nuanceBlockForTraditions } from './practiceNuance';
import { formatClassificationGuide } from './tgoldLegends';
import { TGOLD_TEMPORAL_EPISTEMIC_BLOCK, buildBiasTransparencyBlock } from './tgoldTemporalGuard';
import { buildMemoryContextBlock } from './tgoldMemory';

export type TgoldResearchMode = 'compass' | 'deep-reading' | 'research-dossier' | 'daily-report';

function activeTraditions(ctx?: CompleteCalculationContext): string[] {
  if (!ctx) return CANONICAL_RULESETS.slice(0, 6).map((r) => r.tradition);
  const out = new Set<string>();
  if (ctx.mayan) out.add('Maya Calendrical');
  if (ctx.chinese) out.add('Chinese Sexagenary');
  if (ctx.egyptian) out.add('Ancient Egyptian');
  if (ctx.ethiopian) out.add('Ethiopian Orthodox / Ge\'ez');
  if (ctx.enochianBiblical) {
    out.add('Enochian / Ethiopian Astronomical Book');
    out.add('Hebraic / Biblical Agricultural Calendar');
    out.add('Greco-Roman / Chaldean Horology');
  }
  if (ctx.numerology) out.add('Pythagorean Hermeticism');
  if (ctx.geneKeysSun) out.add('Gene Keys');
  if (ctx.synthesis?.topResonatingTribe) out.add('Hebraic Kabbalistic / Patriarchal');
  if (ctx.vedic) out.add('Vedic');
  return [...out];
}

function evidenceVectorBlock(traditions: string[]): string {
  const vectors = vectorsForTraditions(traditions);
  if (vectors.length === 0) return '';
  return vectors
    .map(
      (v) =>
        `Vector ${v.id} (${v.shortLabel}): ${v.expansionProtocol} Caution: ${v.caution}`
    )
    .join('\n');
}

export function buildTgoldResearchPromptBlock(opts: {
  mode: TgoldResearchMode;
  ctx?: CompleteCalculationContext;
  query?: string;
  compact?: boolean;
}): string {
  const traditions = activeTraditions(opts.ctx);
  const vectors = evidenceVectorBlock(traditions);
  const nuance = nuanceBlockForTraditions(traditions, opts.compact ? 3 : 5);
  const memory = opts.query ? buildMemoryContextBlock(opts.query) : '';
  const principles = TGOLD_CORE_PRINCIPLES.slice(0, opts.compact ? 3 : 5)
    .map((p) => `- ${p}`)
    .join('\n');

  const parts: string[] = [
    'TGOLD RESEARCH LAYER (The Crucible epistemic enrichment):',
    TGOLD_TEMPORAL_EPISTEMIC_BLOCK,
    '',
    'CORE PRINCIPLES:',
    principles,
    '',
    'CLASSIFICATION TAGS (use when labeling claims):',
    formatClassificationGuide(opts.compact ? 6 : 8),
    ''
  ];

  if (vectors) {
    parts.push('TGOLD EVIDENCE VECTORS FOR THIS READING:', vectors, '');
  }
  if (nuance) {
    parts.push('ANCIENT PRACTICE NUANCE (deterministic traditions active today):', nuance, '');
  }
  if (!opts.compact) {
    parts.push(buildBiasTransparencyBlock(), '');
  }
  if (memory) {
    parts.push(memory, '');
  }

  if (opts.mode === 'deep-reading') {
    parts.push(
      'DEEP READING MANDATE: Extend computed data with practice-level meaning from TGOLD vectors. Plain language first. Mark [INTERPRETED] vs [CONFIRMED]. End with 2–3 Investigation Hooks and 1–2 Intelligence Gaps.'
    );
  } else if (opts.mode === 'research-dossier') {
    parts.push(
      'DOSSIER MANDATE: Triangulate etymology, gematria, and field overlay across traditions. Name paradox nodes where systems disagree. Include Bias Transparency and Intelligence Gap markers.'
    );
  } else if (opts.mode === 'compass') {
    parts.push(
      'COMPASS MANDATE: Answer the user query using computed context + TGOLD practice nuance. Never invent citations. Preserve native terms with glosses.'
    );
  }

  return parts.filter(Boolean).join('\n');
}

export function getTgoldResearchMetadata(ctx?: CompleteCalculationContext) {
  const traditions = activeTraditions(ctx);
  return {
    layer: 'TGOLD',
    version: '1.0.0',
    traditionsConsulted: traditions,
    evidenceVectors: vectorsForTraditions(traditions).map((v) => ({ id: v.id, name: v.shortLabel })),
    practiceNuances: traditions.length,
    principles: TGOLD_CORE_PRINCIPLES.length
  };
}
