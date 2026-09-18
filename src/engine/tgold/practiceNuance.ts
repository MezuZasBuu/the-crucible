/**
 * Ancient practice nuance — TGOLD interpretive lenses per tradition.
 */

export interface PracticeNuance {
  tradition: string;
  practiceFrame: string;
  meaningLayer: string;
  nuanceNote: string;
  vectorIds: number[];
}

export const PRACTICE_NUANCES: PracticeNuance[] = [
  {
    tradition: 'Maya Calendrical',
    practiceFrame: 'Tzolk\'in as lived rhythm, not decoration',
    meaningLayer:
      'Each Kin carries a day-sign personality and galactic tone — together they prescribe how attention, speech, and action should be paced for that solar day.',
    nuanceNote:
      'Mesoamerican sources treat the calendar as agricultural and ceremonial timing; Dreamspell is a modern harmonic overlay — distinguish lineage when speaking.',
    vectorIds: [1, 7, 10]
  },
  {
    tradition: 'Chinese Sexagenary',
    practiceFrame: 'Four Pillars as seasonal conduct',
    meaningLayer:
      'Stem-element and branch-animal of the day describe the quality of qi in motion — when to push, when to consolidate, when to negotiate.',
    nuanceNote:
      'BaZi day pillar is one pillar among four; day-only readings are weather snapshots, not full destiny charts.',
    vectorIds: [1, 4, 10]
  },
  {
    tradition: 'Hebraic Kabbalistic / Patriarchal',
    practiceFrame: 'Tribe camp as daily archetype',
    meaningLayer:
      'Twelvefold camp distribution assigns a leadership archetype, gemstone resonance, and directional bearing — a practice of embodying one gift while watching one shadow.',
    nuanceNote:
      'Patriarchal blessings (Genesis 49, Deuteronomy 33) are textual tradition; camp order from Numbers 2 is calendrical-archetypal, not genealogical prescription.',
    vectorIds: [6, 7]
  },
  {
    tradition: 'Enochian / Ethiopian Astronomical Book',
    practiceFrame: '364-day solar gates and watcher hours',
    meaningLayer:
      'Seasonal portals (East/South/West/North gates) mark when light, heat, gathering, and stillness dominate — planetary hours refine the hour-level tone.',
    nuanceNote:
      '1 Enoch astronomical book parallels Ethiopian Bahre Hasab computus; tekufah seasons bridge biblical agriculture and solar longitude.',
    vectorIds: [6, 8, 10]
  },
  {
    tradition: 'Ancient Egyptian',
    practiceFrame: 'Akhet–Peret–Shemu seasonal devotion',
    meaningLayer:
      'Fixed civil calendar seasons align temple rhythm with Nile inundation, growth, and harvest — epagomenal days as liminal renewal.',
    nuanceNote:
      'Sothic cycle ties heliacal rising of Sopdet to Julian drift — a 1460-year great year, not a yearly festival.',
    vectorIds: [1, 7, 8]
  },
  {
    tradition: 'Vedic',
    practiceFrame: 'Nakshatra and tithi as lunar conduct',
    meaningLayer:
      'Moon mansion and lunar day prescribe auspicious action windows — some hours favor beginnings, others favor completion or rest.',
    nuanceNote:
      'Sidereal ayanamsha choice (Lahiri here) shifts nakshatra boundaries — state methodology when comparing to tropical astrology.',
    vectorIds: [1, 4, 6]
  },
  {
    tradition: 'Pythagorean Hermeticism',
    practiceFrame: 'Number as vibratory conduct',
    meaningLayer:
      'Life Path and Universal Day numbers describe recurring motifs in choice-making — patterns to notice, not commands to obey.',
    nuanceNote:
      'Master numbers 11, 22, 33 are preserved without reduction in this engine — a deliberate methodological choice.',
    vectorIds: [7]
  },
  {
    tradition: 'Gene Keys',
    practiceFrame: 'Shadow → gift contemplative practice',
    meaningLayer:
      'Each gate line names a shadow pattern and its potential gift — daily practice is witnessing the shadow without feeding it.',
    nuanceNote:
      'Gene Keys synthesizes I Ching hexagrams with modern contemplative framing — treat as system interpretation, not ancient primary text.',
    vectorIds: [6, 9]
  }
];

export function nuanceForTradition(tradition: string): PracticeNuance | undefined {
  return PRACTICE_NUANCES.find((n) => n.tradition === tradition);
}

export function nuanceBlockForTraditions(traditions: string[], max = 5): string {
  const lines: string[] = [];
  for (const t of traditions) {
    const n = nuanceForTradition(t);
    if (!n) continue;
    lines.push(
      `• ${n.tradition}: ${n.practiceFrame}\n  Meaning: ${n.meaningLayer}\n  Nuance: ${n.nuanceNote}`
    );
    if (lines.length >= max) break;
  }
  return lines.join('\n\n');
}
