/**
 * TGOLD evidence vector taxonomy — Crucible research enrichment layer.
 */

export type TgoldVectorId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface TgoldVector {
  id: TgoldVectorId;
  name: string;
  shortLabel: string;
  expansionProtocol: string;
  caution: string;
  traditions: string[];
}

export const TGOLD_VECTORS: TgoldVector[] = [
  {
    id: 1,
    name: 'Ancestral and Indigenous Knowledge Systems',
    shortLabel: 'Ancestral / Indigenous',
    expansionProtocol:
      'Locate accounts within the tradition itself — not only academic summaries. Cross-tribal convergence elevates signal. Distinguish preserved knowledge from colonial filtering.',
    caution: 'Subject to cultural drift and internal manipulation like all knowledge systems.',
    traditions: ['Maya Calendrical', 'Chinese Sexagenary', 'Ethiopian Orthodox / Ge\'ez', 'Ancient Egyptian', 'Vedic']
  },
  {
    id: 6,
    name: 'Religious, Spiritual, and Metaphysical Knowledge Systems',
    shortLabel: 'Spiritual / Metaphysical',
    expansionProtocol:
      'Treat phenomenological reports as data; theological interpretation as secondary framework. Cross-cultural convergence of reported experience is the highest-value signal.',
    caution: 'Symbol and mechanism must not be collapsed without historical evidence.',
    traditions: ['Hebraic Kabbalistic / Patriarchal', 'Enochian / Ethiopian Astronomical Book', 'Gene Keys', 'Twelve Tribes Matrix']
  },
  {
    id: 7,
    name: 'Mythological and Symbolic Knowledge Systems',
    shortLabel: 'Myth / Symbol',
    expansionProtocol:
      'Read mythology as compressed observational storage — recurring structural elements across independent traditions carry weight. Symbol ≠ literal mechanism.',
    caution: 'Do not project modern overlays backward without cultural evidence.',
    traditions: ['Maya Calendrical', 'Ancient Egyptian', 'Greco-Roman / Chaldean Horology', 'Pythagorean Hermeticism']
  },
  {
    id: 4,
    name: 'Traditional, Holistic, and Indigenous Medical Systems',
    shortLabel: 'Holistic / Medical',
    expansionProtocol:
      'Centuries of patient outcome data constitute legitimate evidence even when RCT mechanism is unknown. Ayurveda, TCM, African and Indigenous healing, pre-industrial herbalism.',
    caution: 'Efficacy claims require documented outcome patterns, not anecdote alone.',
    traditions: ['Chinese Sexagenary', 'Vedic', 'Huangdi Neijing']
  },
  {
    id: 8,
    name: 'Anthropological and Archaeological Divergence',
    shortLabel: 'Archaeological Divergence',
    expansionProtocol:
      'Anomalous dating, genetic population movements, artifact contexts that strain dominant historical frameworks — evaluate on primary record, not comfort.',
    caution: 'Single anomalous finds do not rewrite consensus without replication.',
    traditions: ['Maya Calendrical', 'Ancient Egyptian', 'Ethiopian Orthodox / Ge\'ez']
  },
  {
    id: 9,
    name: 'Phenomenological Convergence',
    shortLabel: 'Phenomenology',
    expansionProtocol:
      'Recurring first-person reports across independent cultures — evaluated by convergence documentation, not single-instance proof.',
    caution: 'Experience is data about what was experienced; not automatic external verification.',
    traditions: ['Gene Keys', 'Astrocartography', 'Gaia overlay']
  },
  {
    id: 10,
    name: 'Ecological and Environmental Intelligence',
    shortLabel: 'Ecological',
    expansionProtocol:
      'Generational ecological observation — seasonal indicators, plant-animal relationship libraries, climate pattern memory in oral tradition.',
    caution: 'Local ecology does not universalize without geographic scope check.',
    traditions: ['Hebraic / Biblical Agricultural Calendar', 'Chinese Sexagenary', 'Ancient Egyptian']
  }
];

export const TGOLD_CORE_PRINCIPLES = [
  'Symbol ≠ mechanism — recurring symbolism is evidence of symbolism, not automatic proof of the literal mechanism depicted.',
  'Phenomenology: reported experience is data about what was experienced or believed — not automatic verification of the mechanism claimed.',
  'Separate testable claims from unfalsifiable narrative — weight follows evidence, not comfort.',
  'Equal dignity ≠ equal weight — all vectors deserve consultation; weights follow evidence.',
  'The framework produces better questions, not believers — structural paradox that exposes a gap is a success state.'
];

export function vectorsForTradition(tradition: string): TgoldVector[] {
  return TGOLD_VECTORS.filter((b) => b.traditions.some((t) => t === tradition || tradition.includes(t.split(' ')[0])));
}

export function vectorsForTraditions(traditions: string[]): TgoldVector[] {
  const seen = new Set<number>();
  const out: TgoldVector[] = [];
  for (const t of traditions) {
    for (const b of vectorsForTradition(t)) {
      if (!seen.has(b.id)) {
        seen.add(b.id);
        out.push(b);
      }
    }
  }
  return out.sort((a, b) => a.id - b.id);
}
