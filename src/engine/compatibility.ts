/**
 * Profile compatibility — work / life / love / business / friendship
 * Deterministic scores from two natal calculation contexts.
 */

import { CompleteCalculationContext } from '../types';

export type CompatibilityAxis = 'work' | 'life' | 'love' | 'business' | 'friendship';

export interface CompatibilityAxisScore {
  axis: CompatibilityAxis;
  label: string;
  score: number; // 0-100
  summary: string;
  sharedSignals: string[];
  tensions: string[];
}

export interface CompatibilityReport {
  profileALabel: string;
  profileBLabel: string;
  overall: number;
  axes: CompatibilityAxisScore[];
  narrative: string;
  epistemicNote: string;
}

const AXIS_LABELS: Record<CompatibilityAxis, string> = {
  work: 'Work',
  life: 'Life',
  love: 'Love',
  business: 'Business',
  friendship: 'Friendship'
};

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function elementAffinity(a: string, b: string): number {
  if (a === b) return 28;
  const cycles: Record<string, string> = {
    Wood: 'Fire',
    Fire: 'Earth',
    Earth: 'Metal',
    Metal: 'Water',
    Water: 'Wood'
  };
  if (cycles[a] === b || cycles[b] === a) return 18;
  return 6;
}

function directionAffinity(a: string, b: string): number {
  if (a === b) return 22;
  const opposite: Record<string, string> = { East: 'West', West: 'East', North: 'South', South: 'North' };
  if (opposite[a] === b) return 8;
  return 14;
}

function numberHarmony(a: number, b: number): number {
  if (a === b) return 24;
  if (Math.abs(a - b) === 1 || Math.abs(a - b) === 8) return 16;
  if (Math.abs(a - b) % 3 === 0) return 12;
  return 7;
}

function gateProximity(a: number, b: number): number {
  const d = Math.min(Math.abs(a - b), 64 - Math.abs(a - b));
  if (d === 0) return 20;
  if (d <= 3) return 14;
  if (d <= 8) return 9;
  return 4;
}

/**
 * Compare two complete contexts (typically natal profiles).
 */
export function computeCompatibility(
  a: CompleteCalculationContext,
  b: CompleteCalculationContext,
  labels?: { a?: string; b?: string }
): CompatibilityReport {
  const aEl = a.chinese.dominantElement;
  const bEl = b.chinese.dominantElement;
  const aDir = a.mayan.tzolkin.direction;
  const bDir = b.mayan.tzolkin.direction;
  const aTribe = a.synthesis.topResonatingTribe;
  const bTribe = b.synthesis.topResonatingTribe;
  const aPath = a.numerology.lifePathNumber;
  const bPath = b.numerology.lifePathNumber;
  const aGate = a.geneKeysSun.gate;
  const bGate = b.geneKeysSun.gate;
  const aTone = a.dreamspell.galacticTone.number;
  const bTone = b.dreamspell.galacticTone.number;

  const el = elementAffinity(aEl, bEl);
  const dir = directionAffinity(aDir, bDir);
  const num = numberHarmony(aPath, bPath);
  const gate = gateProximity(aGate, bGate);
  const tribeSame = aTribe.tribe === bTribe.tribe;
  const tribeDir = directionAffinity(aTribe.directionInCamp, bTribe.directionInCamp);
  const toneDelta = Math.abs(aTone - bTone);

  const work = clamp(38 + el + (tribeSame ? 8 : tribeDir) + (toneDelta <= 2 ? 10 : 4) + gate * 0.35);
  const life = clamp(36 + num + dir + el * 0.5 + (a.numerology.universalDay === b.numerology.universalDay ? 6 : 0));
  const love = clamp(34 + gate + num * 0.7 + (toneDelta <= 3 ? 14 : 5) + (dir >= 14 ? 10 : 4));
  const business = clamp(40 + el + tribeDir + (aPath % 2 === bPath % 2 ? 8 : 3) + gate * 0.4);
  const friendship = clamp(42 + dir + (toneDelta <= 4 ? 12 : 6) + num * 0.5 + (tribeSame ? 6 : 10));

  const axes: CompatibilityAxisScore[] = [
    {
      axis: 'work',
      label: AXIS_LABELS.work,
      score: work,
      summary: `Elemental work-style ${aEl} × ${bEl}; Dreamspell tone distance ${toneDelta}.`,
      sharedSignals: [
        el >= 18 ? `Generative elemental link (${aEl}→${bEl})` : `Distinct elemental weather (${aEl} / ${bEl})`,
        `Gene Key gates ${aGate} & ${bGate}`
      ],
      tensions: toneDelta > 5 ? ['Tone pacing may clash under deadline pressure'] : []
    },
    {
      axis: 'life',
      label: AXIS_LABELS.life,
      score: life,
      summary: `Life Path ${aPath} × ${bPath}; Maya directions ${aDir} / ${bDir}.`,
      sharedSignals: [
        num >= 16 ? 'Numerological near-resonance' : 'Complementary life-path arcs',
        `Camp lenses ${aTribe.tribe} / ${bTribe.tribe}`
      ],
      tensions: dir < 12 ? ['Directional orientation pulls opposite ways'] : []
    },
    {
      axis: 'love',
      label: AXIS_LABELS.love,
      score: love,
      summary: `Gift continuum ${a.geneKeysSun.gift} × ${b.geneKeysSun.gift}.`,
      sharedSignals: [
        gate >= 14 ? 'Close solar-gate proximity' : 'Distinct solar teachings',
        `Tone ${a.dreamspell.galacticTone.name} × ${b.dreamspell.galacticTone.name}`
      ],
      tensions: gate < 9 ? ['Emotional pacing may need explicit negotiation'] : []
    },
    {
      axis: 'business',
      label: AXIS_LABELS.business,
      score: business,
      summary: `Stewardship banners ${aTribe.tribe} × ${bTribe.tribe} under ${aEl}/${bEl} weather.`,
      sharedSignals: [
        tribeSame ? 'Same archetypal camp language' : 'Cross-camp complementarity',
        `Wu Xing ${aEl} / ${bEl}`
      ],
      tensions: el < 10 ? ['Elemental strategy may require a third mediating role'] : []
    },
    {
      axis: 'friendship',
      label: AXIS_LABELS.friendship,
      score: friendship,
      summary: `Shared play of tone and direction without forcing vocation identity.`,
      sharedSignals: [
        dir >= 14 ? 'Compatible cardinal orientation' : 'Stimulating directional difference',
        `Universal Day weather ${a.numerology.universalDay} / ${b.numerology.universalDay}`
      ],
      tensions: []
    }
  ];

  const overall = clamp(axes.reduce((s, x) => s + x.score, 0) / axes.length);

  const profileALabel = labels?.a || a.input.querentName || 'Profile A';
  const profileBLabel = labels?.b || b.input.querentName || 'Profile B';

  return {
    profileALabel,
    profileBLabel,
    overall,
    axes,
    narrative: `${profileALabel} × ${profileBLabel} — overall field ${overall}/100 under the active methodology. Highest axis: ${[...axes].sort((x, y) => y.score - x.score)[0].label}. These scores are comparative analogies from calendrical, elemental, and gate geometry—not destiny claims.`,
    epistemicNote:
      'COMPARATIVE_ANALOGY — Compatibility is a navigation aid across Work, Life, Love, Business, and Friendship. It does not assert objective identity or guaranteed outcomes.'
  };
}
