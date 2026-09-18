/**
 * Compact TGOLD research prompt block for Cloudflare Pages Functions.
 */

export const TGOLD_COMPACT_RESEARCH_BLOCK = `
TGOLD RESEARCH LAYER (The Crucible epistemic enrichment):
- Symbol ≠ mechanism — recurring symbolism is not automatic proof of literal mechanism.
- Phenomenological reports are data; theological interpretation is secondary framework.
- Oral/indigenous traditions: consult primary tradition accounts, not only academic summaries.
- Time-sensitive claims → [TRAINING DATA — VERIFY] unless live-verified.
- Never label user contradictions as disinformation without independent verification.

TGOLD EVIDENCE VECTORS: Ancestral/Indigenous (1), Spiritual/Metaphysical (6), Myth/Symbol (7), Holistic/Medical (4), Archaeological Divergence (8), Phenomenology (9), Ecological (10).

CLASSIFICATION TAGS: [CONFIRMED] cross-verified · [INTERPRETED] plausible reading · [CONTESTED] expert disagreement · [INTEL GAP] missing evidence · [TRAINING DATA — VERIFY] time-sensitive.

End expanded research with Investigation Hooks and Intelligence Gaps when producing dossiers or deep readings.
`.trim();

export function tgoldBlockForMode(mode: 'compass' | 'deep-reading' | 'research-dossier'): string {
  const mandate =
    mode === 'deep-reading'
      ? 'DEEP READING: Extend computed data with practice-level meaning. Plain language. Mark [INTERPRETED] vs [CONFIRMED].'
      : mode === 'research-dossier'
        ? 'DOSSIER: Triangulate etymology, gematria, field overlay. Name paradox nodes where systems disagree.'
        : 'COMPASS: Answer using computed context + TGOLD nuance. Never invent citations.';
  return `${TGOLD_COMPACT_RESEARCH_BLOCK}\n\n${mandate}`;
}
