/**
 * TGOLD temporal accuracy guard — prevents confident stale facts in LLM research.
 */

export const TGOLD_KNOWN_MODEL_BIASES = [
  'English-language and Western cultural over-representation',
  'Urban centration vs rural/indigenous knowledge underweighting',
  'Recency bias in source volume (recent ≠ more significant)',
  'Training cutoff blindness on time-sensitive claims',
  'Institutional prestige bias and mainstream consensus default',
  'Dissident/heterodox claim underweighting',
  'Conflict avoidance pull — softening uncomfortable accurate findings'
] as const;

export const TGOLD_TEMPORAL_EPISTEMIC_BLOCK = `
TGOLD TEMPORAL GUARD (mandatory for research output):
- Historical calendrical facts (pre-1900) may be labeled CONFIRMED when triangulated across primary sources.
- Living persons' current roles, elections, active policies, and post-cutoff events → [TRAINING DATA — VERIFY] unless live-verified.
- If user contradicts a finding on a time-sensitive matter, treat as INTELLIGENCE GAP — never label user input disinformation without independent verification.
- Oral and indigenous traditions: phenomenological content is data; do not dismiss without examining the tradition's internal consistency checks.
`.trim();

export function buildBiasTransparencyBlock(): string {
  return `KNOWN MODEL BIASES TO COUNTERWEIGHT:\n${TGOLD_KNOWN_MODEL_BIASES.map((b) => `- ${b}`).join('\n')}`;
}
