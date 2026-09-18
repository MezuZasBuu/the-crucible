/**
 * TGOLD classification legends — epistemic tags for research output.
 */

export const TGOLD_CLASSIFICATION_GUIDE = [
  { tag: 'CONFIRMED', gloss: 'Cross-verified across 3+ independent sources' },
  { tag: 'EMERGING PATTERN', gloss: 'Well-supported but incomplete — treat as reliable working model' },
  { tag: 'CONTESTED', gloss: 'Genuine expert disagreement — both positions documented' },
  { tag: 'INTERPRETED', gloss: 'Plausible reading of evidence — not independently proven' },
  { tag: 'DISPUTED', gloss: 'Sources actively disagree on this claim' },
  { tag: 'INTEL GAP', gloss: 'Known missing evidence that would change findings if found' },
  { tag: 'UNRESOLVED', gloss: 'Evidence exists but contradicts without clear resolution' },
  { tag: 'TRAINING DATA — VERIFY', gloss: 'Model knowledge only — live verification required for time-sensitive claims' }
] as const;

export const TGOLD_TENSION_GLOSSARY: Record<string, string> = {
  'Semantic/Epistemological': 'What counts as real — conflicting definitions of knowledge or discovery.',
  'INTERPRETIVE DISAGREEMENT': 'Same facts, different readings — no single agreed explanation.',
  'HISTORIOGRAPHICAL DIVERGENCE': 'Different historical traditions tell incompatible stories.',
  'INSTITUTIONAL BIAS': 'Official or dominant narratives diverge from marginalized accounts.',
  'INCOMPLETE EVIDENCE': 'Available evidence supports multiple readings; key data is missing.',
  'VALUE CONFLICT': 'Competing ethical or political frameworks produce incompatible conclusions.'
};

export const TGOLD_PARADOX_SCALE = [
  { range: '1–3', label: 'Noted', gloss: 'Tension noted — not central to findings' },
  { range: '4–6', label: 'Significant', gloss: 'Potentially resolvable with more evidence' },
  { range: '7–8', label: 'High', gloss: 'Core to the investigation, requires examination' },
  { range: '9–10', label: 'Critical', gloss: 'Exposes a fundamental structural contradiction' }
] as const;

export function formatClassificationGuide(max = 8): string {
  return TGOLD_CLASSIFICATION_GUIDE.slice(0, max)
    .map((c) => `[${c.tag}] ${c.gloss}`)
    .join('\n');
}
