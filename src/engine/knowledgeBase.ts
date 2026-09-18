/**
 * The Crucible — Knowledge Base & Ruleset Registry
 * Canonical JSON schemas, rulesets, and JSONL claims archive.
 * Referenced by backend API and Conversational LLM Compass.
 */

export interface RulesetMetadata {
  id: string;
  name: string;
  tradition: string;
  category: 'calendar' | 'astronomy' | 'numerology' | 'archetype';
  version: string;
  epoch: string;
  sourceAuthority: string;
  description: string;
  gridlockedRules: string[];
}

export interface KnowledgeClaim {
  id: string;
  tradition: string;
  entity: string;
  relation: string;
  target: string;
  validityScope: string;
  sourceCitation: string;
  status: 'Authoritative' | 'Documented' | 'Disputed' | 'Reconstructed';
  confidenceScore: number;
}

export const CANONICAL_RULESETS: RulesetMetadata[] = [
  {
    id: 'RULES-MAYA-GMT584283',
    name: 'Maya Classical GMT Correlation (584283)',
    tradition: 'Maya Calendrical',
    category: 'calendar',
    version: '1.0.0',
    epoch: '3114 BCE (JD 584283.0)',
    sourceAuthority: 'Goodman-Martinez-Thompson; Thompson (1950); Sharer & Traxler',
    description: 'Astronomical and archaeological consensus correlation connecting Long Count days to Julian Day numbers.',
    gridlockedRules: [
      'JD = 584283 + daysSinceEpoch',
      'Tzolk\'in cycle length = 260 days (13 numbers * 20 day signs)',
      'Haab\' cycle length = 365 days (18 months * 20 days + 5 Wayeb\')',
      'Calendar Round period = LCM(260, 365) = 18,980 days'
    ]
  },
  {
    id: 'RULES-CHINESE-BAZI',
    name: 'Traditional Solar-Term BaZi Four Pillars',
    tradition: 'Chinese Sexagenary',
    category: 'calendar',
    version: '1.2.0',
    epoch: '2637 BCE (Huangdi Epoch) / 1984 Jia-Zi Modern Cycle',
    sourceAuthority: 'Sanming Tonghui; Di Tian Sui; Chinese Astronomical Almanac',
    description: 'Sexagenary stems and branches calculated from solar terms (Jieqi) with Five Tigers and Five Rats Dun derivations.',
    gridlockedRules: [
      'Year starts at Lichun (Start of Spring ~315° Solar Longitude)',
      '10 Heavenly Stems: Jia, Yi, Bing, Ding, Wu, Ji, Geng, Xin, Ren, Gui',
      '12 Earthly Branches: Zi, Chou, Yin, Mao, Chen, Si, Wu, Wei, Shen, You, Xu, Hai',
      'Wu Xing Elemental interactions governed by generating and overcoming cycles'
    ]
  },
  {
    id: 'RULES-EGYPT-SOTHIC',
    name: 'Egyptian Fixed Civil Calendar & Sothic Cycle',
    tradition: 'Ancient Egyptian',
    category: 'calendar',
    version: '1.0.0',
    epoch: '747 BCE (Nabonassar Epoch) / Heliacal Rising of Sopdet',
    sourceAuthority: 'Censorinus (De Die Natali); Claudius Ptolemy (Almagest); Parker (1950)',
    description: 'Fixed 365-day year without leap days, progressing through 3 seasons of four 30-day months plus 5 Epagomenae.',
    gridlockedRules: [
      'Year length = 365 days exactly (12 months * 30 days + 5 Epagomenal days)',
      'Sothic Great Year = 1,460 Julian years (1,461 Egyptian civil years)',
      'Three sacred seasons: Akhet (Inundation), Peret (Growth), Shemu (Harvest)'
    ]
  },
  {
    id: 'RULES-ETHIOPIAN-GEEZ',
    name: 'Ethiopian / Eritrean Ge\'ez Calendar',
    tradition: 'Ethiopian Orthodox / Ge\'ez',
    category: 'calendar',
    version: '1.1.0',
    epoch: '8 CE (Amete Mihret / Incarnation Era)',
    sourceAuthority: 'Abu Shaker; Ethiopian Computus (Bahre Hasab); Neugebauer (1979)',
    description: '13-month calendar with 12 months of 30 days and Pagume of 5 or 6 days, lagging Gregorian by 7-8 years.',
    gridlockedRules: [
      '12 months of 30 days + 1 intercalary month (Pagume) of 5 days (6 in leap year)',
      '7 to 8 year offset from Gregorian depending on New Year (Meskerem 1 / Sep 11)',
      'Continuous 4-year Evangelist cycle: Matthew, Mark, Luke, John'
    ]
  },
  {
    id: 'RULES-NUM-PYTHAGOREAN',
    name: 'Pythagorean Tetraktys Numerological System',
    tradition: 'Pythagorean Hermeticism',
    category: 'numerology',
    version: '1.0.0',
    epoch: 'Classical Antiquity (c. 530 BCE)',
    sourceAuthority: 'Iamblichus; Nicomachus of Gerasa; modern esoteric synthesis',
    description: 'Decadic reduction of alphabetic glyphs (1-9) with strict preservation of master numbers 11, 22, and 33.',
    gridlockedRules: [
      'Alphabetic table 1 to 9 sequentially mapped across Latin characters',
      'Preservation of master vibratory nodes (11, 22, 33) without secondary reduction',
      'Universal Day cycle = (Universal Year + Universal Month + Day) mod 9'
    ]
  },
  {
    id: 'RULES-TWELVE-TRIBES',
    name: 'Twelve Tribes of Israel Archetypal Correspondence Matrix',
    tradition: 'Hebraic Kabbalistic / Patriarchal',
    category: 'archetype',
    version: '1.0.0',
    epoch: 'Genesis 49 & Deuteronomy 33 blessings; Sefer Yetzirah',
    sourceAuthority: 'Sefer Yetzirah (Book of Creation); Midrash Rabbah; Ari Zal (Luria)',
    description: 'Twelvefold archetypal camp distribution aligned with cardinal directions, gemstones, and planetary signs.',
    gridlockedRules: [
      'Camp of Judah on East (Judah, Issachar, Zebulun)',
      'Camp of Reuben on South (Reuben, Simeon, Gad)',
      'Camp of Ephraim on West (Ephraim, Manasseh, Benjamin)',
      'Camp of Dan on North (Dan, Asher, Naphtali)'
    ]
  },
  {
    id: 'RULES-ENOCHIAN-364',
    name: 'Book of Enoch 364-Day Solar Calendar & Watcher Gates',
    tradition: 'Enochian / Ethiopian Astronomical Book',
    category: 'calendar',
    version: '1.0.0',
    epoch: '1 Enoch 72–82; spring-equinox New Year baseline',
    sourceAuthority: '1 Enoch (Ethiopic); Neugebauer & Parker; Ethiopian Bahre Hasab parallel',
    description: 'Fixed 364-day year (52 weeks) with four 91-day seasons, three 30-day months plus one intercalary day per quarter, and four directional sun portals.',
    gridlockedRules: [
      'Year length = 364 days exactly (52 × 7)',
      'Four seasons of 91 days = 3 months × 30 + 1 intercalary portal day',
      'East Gate of Light (Spring), South Gate of Heat (Summer), West Gate of Gathering (Autumn), North Gate of Stillness (Winter)',
      'Enochian compass flip: civil N↔S and E↔W for Watcher-gate triangulation'
    ]
  },
  {
    id: 'RULES-BIBLICAL-TEKUFOT',
    name: 'Biblical Tekufot Seasons & Verse Anchors',
    tradition: 'Hebraic / Biblical Agricultural Calendar',
    category: 'calendar',
    version: '1.0.0',
    epoch: 'Torah agricultural feasts; rabbinic tekufot',
    sourceAuthority: 'Genesis 8:22; Exodus 12; Exodus 23:16; Leviticus 23; Deuteronomy 16',
    description: 'Four tekufah seasons keyed to solar longitude with direct scriptural witnesses for seedtime, harvest, ingathering, and winter dedication.',
    gridlockedRules: [
      'Tekufat Nisan (0°–90°): seedtime / Passover — Gen 8:22, Ex 12:2, Song 2:11–12',
      'Tekufat Tammuz (90°–180°): firstfruits heat — Prov 10:5, Jer 8:20, Ex 23:16, Acts 2',
      'Tekufat Tishrei (180°–270°): ingathering — Ex 23:16, Lev 23:39, Deut 16:13',
      'Tekufat Tevet (270°–360°): winter / dedication — Gen 8:22, John 10:22, Job 37:6'
    ]
  },
  {
    id: 'RULES-ROMAN-DIES-HOURS',
    name: 'Roman Planetary Week & Chaldean Planetary Hours',
    tradition: 'Greco-Roman / Chaldean Horology',
    category: 'calendar',
    version: '1.0.0',
    epoch: 'Hellenistic planetary week; classical sunrise hour rulers',
    sourceAuthority: 'Dio Cassius; Vettius Valens; traditional Chaldean order',
    description: 'Seven Latin dies (Solis–Saturni) with Roman deities for Gregorian and Julian weekdays, plus 24 Chaldean planetary hours and half-hour crest/echo phases.',
    gridlockedRules: [
      'Weekday rulers: Sol, Luna, Mars, Mercurius, Iuppiter, Venus, Saturnus',
      'Chaldean hour order: Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon',
      'First hour after sunrise matches the weekday planetary ruler',
      'Half-hours: Ingress Crest (0–30m) and Mid-Hour Echo (30–60m)'
    ]
  },
  {
    id: 'RULES-TGOLD-RESEARCH',
    name: 'TGOLD Epistemic Research Layer',
    tradition: 'Cross-Tradition Research',
    category: 'archetype',
    version: '1.0.0',
    epoch: 'The Crucible TGOLD operational layer',
    sourceAuthority: 'The Crucible research methodology',
    description:
      'Evidence-vector triangulation, temporal accuracy gate, and ancient-practice nuance protocols for calendrical and spiritual claims without collapsing symbol into mechanism.',
    gridlockedRules: [
      'Symbol ≠ mechanism — recurring symbolism is not automatic proof of literal mechanism',
      'Phenomenological reports are data; theological interpretation is secondary framework',
      'Oral/indigenous knowledge: consult primary tradition accounts, not only academic summaries',
      'Time-sensitive claims require [TRAINING DATA — VERIFY] unless live-verified',
      'Structural paradox that exposes a gap is a valid research outcome'
    ]
  }
];

export const CANONICAL_CLAIMS: KnowledgeClaim[] = [
  {
    id: 'CLAIM-001',
    tradition: 'Maya Calendrical',
    entity: 'tzolkin.sign.ahau',
    relation: 'corresponds_to',
    target: 'archetype.solar_enlightenment',
    validityScope: 'Historical & Classical Mesoamerica',
    sourceCitation: 'Dresden Codex; Popol Vuh; Thompson Maya Hieroglyphic Writing (1950)',
    status: 'Authoritative',
    confidenceScore: 0.98
  },
  {
    id: 'CLAIM-002',
    tradition: 'Chinese Sexagenary',
    entity: 'branch.zi.rat',
    relation: 'associated_with',
    target: 'element.water.yang',
    validityScope: 'Universal Sinitic Computus',
    sourceCitation: 'Huangdi Neijing; I Ching (Book of Changes)',
    status: 'Authoritative',
    confidenceScore: 0.99
  },
  {
    id: 'CLAIM-003',
    tradition: 'Ancient Egyptian',
    entity: 'month.thoth',
    relation: 'initiates',
    target: 'season.akhet',
    validityScope: 'Pharaonic Egypt (Old through Ptolemaic Kingdoms)',
    sourceCitation: 'Temple of Dendera Inscriptions; Papyrus Ebers',
    status: 'Authoritative',
    confidenceScore: 0.96
  },
  {
    id: 'CLAIM-004',
    tradition: 'Twelve Tribes Matrix',
    entity: 'tribe.judah',
    relation: 'governs_direction',
    target: 'direction.east',
    validityScope: 'Biblical Camp Order (Numbers 2)',
    sourceCitation: 'Torah (Numbers 2:3); Midrash Bemidbar Rabbah',
    status: 'Authoritative',
    confidenceScore: 0.99
  },
  {
    id: 'CLAIM-005',
    tradition: 'Astrocartography',
    entity: 'astrocartography.line.sun_mc',
    relation: 'manifests_as',
    target: 'career_vitality_and_visibility',
    validityScope: 'Modern Celestial Astrocartography',
    sourceCitation: 'Jim Lewis, The Psychology of Astro*Carto*Graphy (1981)',
    status: 'Documented',
    confidenceScore: 0.92
  },
  {
    id: 'CLAIM-006',
    tradition: 'Enochian / Ethiopian Astronomical Book',
    entity: 'enoch.season.east_gate',
    relation: 'governs',
    target: 'tekufah.nisan.spring_light',
    validityScope: '1 Enoch 72 sun portals; biblical spring seedtime',
    sourceCitation: '1 Enoch 72:2–5; Genesis 8:22; Exodus 12:2',
    status: 'Documented',
    confidenceScore: 0.94
  },
  {
    id: 'CLAIM-007',
    tradition: 'Greco-Roman / Chaldean Horology',
    entity: 'dies.solis',
    relation: 'ruled_by',
    target: 'planet.sun.roman_sol',
    validityScope: 'Planetary week (Gregorian & Julian weekday mapping)',
    sourceCitation: 'Dio Cassius Roman History 37.18; traditional planetary week',
    status: 'Authoritative',
    confidenceScore: 0.97
  },
  {
    id: 'CLAIM-008',
    tradition: 'Cross-Tradition Research',
    entity: 'mythology.recurring_motif',
    relation: 'encodes_as',
    target: 'compressed_observational_storage',
    validityScope: 'Cross-cultural mythological analysis',
    sourceCitation: 'Comparative mythology; structural motif studies',
    status: 'Documented',
    confidenceScore: 0.88
  },
  {
    id: 'CLAIM-009',
    tradition: 'Cross-Tradition Research',
    entity: 'indigenous.oral_tradition',
    relation: 'preserves',
    target: 'multi_generational_observational_database',
    validityScope: 'Indigenous and ancestral knowledge systems',
    sourceCitation: 'Ethnographic primary sources; oral history methodology',
    status: 'Documented',
    confidenceScore: 0.9
  },
  {
    id: 'CLAIM-010',
    tradition: 'Cross-Tradition Research',
    entity: 'spiritual.practice_report',
    relation: 'constitutes',
    target: 'phenomenological_data',
    validityScope: 'Religious and metaphysical knowledge as evidence source',
    sourceCitation: 'Phenomenology of religion; comparative spiritual studies',
    status: 'Documented',
    confidenceScore: 0.87
  },
  {
    id: 'CLAIM-011',
    tradition: 'Maya Calendrical',
    entity: 'tzolkin.day_sign',
    relation: 'prescribes',
    target: 'daily_conduct_and_ceremonial_timing',
    validityScope: 'Classical Mesoamerica; distinguish from modern Dreamspell overlay',
    sourceCitation: 'Dresden Codex; Linda Schele & David Freidel',
    status: 'Documented',
    confidenceScore: 0.91
  },
  {
    id: 'CLAIM-012',
    tradition: 'Chinese Sexagenary',
    entity: 'day_pillar.stem_branch',
    relation: 'describes',
    target: 'daily_qi_quality_and_conduct_window',
    validityScope: 'Traditional BaZi day-level reading (one pillar of four)',
    sourceCitation: 'Sanming Tonghui; Di Tian Sui',
    status: 'Documented',
    confidenceScore: 0.89
  }
];

/**
 * Returns claims formatted as newline-delimited JSON (JSONL)
 */
export function getClaimsJSONL(): string {
  return CANONICAL_CLAIMS.map((claim) => JSON.stringify(claim)).join('\n');
}

/**
 * Returns complete ruleset registry as formatted JSON
 */
export function getRulesetsJSON(): string {
  return JSON.stringify(CANONICAL_RULESETS, null, 2);
}
