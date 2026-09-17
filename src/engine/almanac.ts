/**
 * Crucible Almanac — gridlocked life-impact patterns (Hypergram-inspired: data ≠ interpretation).
 * Deterministic lookup tables keyed by computed geometry; no LLM required for base layer.
 */

import { CompleteCalculationContext, CrucibleProfile } from '../types';
import { buildChartDynamicsReport, CrossChartAspect } from './chartDynamics';
import { executeCrucibleCalculation } from './crucibleCore';

export type AlmanacTier = 'CRITICAL' | 'IMPORTANT' | 'RELEVANT' | 'OPTIONAL';

export interface AlmanacEntry {
  id: string;
  tier: AlmanacTier;
  tradition: string;
  dataPoint: string;
  collectiveImpact: string;
  individualImpact: string;
  behavioralCue: string;
  epistemic: 'COMPUTED_GEOMETRY' | 'SYSTEM_INTERPRETATION' | 'COMPARATIVE_ANALOGY' | 'SPECULATIVE_SYNTHESIS';
}

const GALACTIC_TONE_LIFE: Record<number, { collective: string; individual: string; cue: string }> = {
  1: {
    collective: 'Collectives default to initiation — first movers set the tone whether or not anyone asked.',
    individual: 'Your agency reads louder than usual; unfinished starts surface for closure or commitment.',
    cue: 'Name one thing you are actually starting, not researching.'
  },
  2: {
    collective: 'Stabilization pressure — institutions resist novelty and reward repetition.',
    individual: 'You may feel pulled to consolidate rather than expand; structure is the medicine.',
    cue: 'Fortify one container (schedule, agreement, boundary) before adding load.'
  },
  3: {
    collective: 'Activation energy rises — discourse accelerates, hot takes multiply.',
    individual: 'Nervous system may run hot; channel into motion, not argument.',
    cue: 'Convert one insight into a physical or logistical action within 24h.'
  },
  4: {
    collective: 'Form-hunger — people crave clarity, roles, and legible rules.',
    individual: 'Ambiguity feels costly; you may over-plan to regain control.',
    cue: 'Define the minimum viable structure that lets work proceed.'
  },
  5: {
    collective: 'Centers of gravity emerge — leadership (formal or informal) consolidates.',
    individual: 'You are either holding space for others or resisting being held.',
    cue: 'Clarify whether you are radiating or receiving today — both are valid.'
  },
  6: {
    collective: 'Organicity — networks self-organize; organic collaboration beats hierarchy.',
    individual: 'Relationships become the medium; isolate and you miss the signal.',
    cue: 'One conversation may unlock more than solo analysis.'
  },
  7: {
    collective: 'Resonance spikes — emotional contagion runs high in groups.',
    individual: 'Mood is data; do not mistake atmospheric feeling for personal failure.',
    cue: 'Track what you absorb from rooms versus what is yours.'
  },
  8: {
    collective: 'Integrity tests surface — hypocrisy gets called, masks slip.',
    individual: 'Where you are misaligned internally, external friction finds you.',
    cue: 'Align one private truth with one public action.'
  },
  9: {
    collective: 'Completion pressure — cycles want endings; loose ends irritate the field.',
    individual: 'Grief, relief, or exhaustion from closing chapters may surface.',
    cue: 'Finish, release, or explicitly defer — do not leave ambiguous hangs.'
  },
  10: {
    collective: 'Manifestation window — what is seeded becomes visible quickly.',
    individual: 'Small choices compound; reputation and habit loops tighten.',
    cue: 'Act as if you are being watched — you are, by your future self.'
  },
  11: {
    collective: 'Liberation impulse — rules feel constraining; breakout narratives spread.',
    individual: 'Restlessness is structural, not personal defect.',
    cue: 'Liberate through design (systems change), not only rebellion.'
  },
  12: {
    collective: 'Cooperation field — collaboration outperforms competition when honored.',
    individual: 'Partnership dynamics clarify; who shows up matters more than talent alone.',
    cue: 'Invest in one alliance; audit one that drains.'
  },
  13: {
    collective: 'Dissolution and return — old forms decay; compost feeds what follows.',
    individual: 'Letting go is productive, not passive.',
    cue: 'Release one obligation that no longer matches your frequency.'
  }
};

const ELEMENT_LIFE: Record<string, { collective: string; individual: string }> = {
  Wood: {
    collective: 'Growth narratives dominate — expansion, startups, planting, argument for the new.',
    individual: 'You may feel pushed to grow, learn, or push boundaries; irritability if blocked.'
  },
  Fire: {
    collective: 'Visibility and conflict rise — publicity, passion projects, flare-ups in discourse.',
    individual: 'Charisma and impatience trade places; watch reactive speech.'
  },
  Earth: {
    collective: 'Pragmatism wins — markets and families favor stability, assets, food, land.',
    individual: 'Body and finances ask for grounding; anxiety if over-abstract.'
  },
  Metal: {
    collective: 'Discipline and cutting — audits, boundaries, precision tools, severing dead weight.',
    individual: 'Perfectionism or clarity — use Metal to refine, not to punish.'
  },
  Water: {
    collective: 'Fluidity and rumor — information flows underground; intuition and fear both amplify.',
    individual: 'Dreams, memory, and emotional depth surface; rest is strategic.'
  }
};

const MOON_PHASE_LIFE: Record<string, { collective: string; individual: string }> = {
  'New Moon': {
    collective: 'Collective attention turns inward; launches are quiet, seeds are private.',
    individual: 'Best for intention, not announcement — plant, do not perform.'
  },
  'Waxing Crescent': {
    collective: 'Momentum builds; early adopters commit while skeptics wait.',
    individual: 'Courage to act on yesterday\'s intention; small visible steps.'
  },
  'First Quarter': {
    collective: 'Friction between vision and reality — crisis of action in groups.',
    individual: 'Obstacles are course-correction, not stop signs.'
  },
  'Waxing Gibbous': {
    collective: 'Refinement culture — editing, polishing, pre-launch anxiety.',
    individual: 'Adjust the plan; perfection is preparation, not paralysis.'
  },
  'Full Moon': {
    collective: 'Emotional visibility peaks — revelations, protests, celebrations, exposure.',
    individual: 'What was hidden becomes legible; sleep and boundaries matter.'
  },
  'Waning Gibbous': {
    collective: 'Gratitude and teaching — sharing harvest, mentoring, distributing.',
    individual: 'Give knowledge away; receive feedback without defensiveness.'
  },
  'Last Quarter': {
    collective: 'Reorientation — institutions question direction; reform narratives.',
    individual: 'Release strategies that worked last season.'
  },
  'Waning Crescent': {
    collective: 'Exhaustion and surrender — collective burnout visible before renewal.',
    individual: 'Rest is epistemically valid; minimal viable day.'
  }
};

function aspectLifeImpact(
  body1: string,
  body2: string,
  aspect: string,
  nature: string
): string {
  const tense = nature === 'Dynamic Tension';
  if (aspect.includes('Square')) {
    return tense
      ? `Socially: ${body1}–${body2} square tends to surface conflict between ${body1}'s domain and ${body2}'s — meetings get productive when the tension is named, toxic when denied. Personally: irritability, forced decisions, growth through friction.`
      : `Harmonious square rare — treat as dynamic.`;
  }
  if (aspect.includes('Opposition')) {
    return `Collective polarization between ${body1} themes and ${body2} themes — projection rises. Individually: relationships mirror internal split; integrate both poles or oscillate.`;
  }
  if (aspect.includes('Trine') || aspect.includes('Sextile')) {
    return `Flow between ${body1} and ${body2} — cooperation comes easier; risk is complacency. Individually: use the ease to build, not to coast.`;
  }
  if (aspect.includes('Conjunction')) {
    return `Fusion of ${body1} and ${body2} frequencies — collective storylines merge; individually, blended drives feel urgent and singular.`;
  }
  return `${body1} ${aspect} ${body2} — read as behavioral weather, not fate.`;
}

function natalDerivativeParagraph(
  natalCtx: CompleteCalculationContext,
  transitCtx: CompleteCalculationContext,
  hits: CrossChartAspect[]
): string {
  const natalKin = natalCtx.dreamspell.signature;
  const transitKin = transitCtx.dreamspell.signature;
  const natalSun = natalCtx.celestialBodies.find((b) => b.id === 'sun');
  const transitSun = transitCtx.celestialBodies.find((b) => b.id === 'sun');

  const lines: string[] = [
    `Natal baseline [COMPUTED]: ${natalCtx.input.querentName || 'Querent'} — ${natalKin}; Sun ${natalSun?.zodiacSign} ${natalSun?.signDegree.toFixed(1)}°.`,
    `Today's sky against that chart: ${transitKin}; transit Sun ${transitSun?.zodiacSign} ${transitSun?.signDegree.toFixed(1)}°.`
  ];

  if (hits.length) {
    const top = hits.slice(0, 4);
    lines.push(
      'Active transit-to-natal hits [COMPARATIVE_ANALOGY]:',
      ...top.map(
        (h) =>
          `• ${h.transitingName} ${h.aspectType} natal ${h.natalName} (${h.orbDeg}°) — ${h.isApplying ? 'building' : 'releasing'}. In lived terms: outer ${h.transitingName} activates your natal ${h.natalName} pattern; watch where that domain already runs your life script.`
      )
    );
  } else {
    lines.push('No major transit-to-natal aspects inside orb — today is more ambient field than personal trigger.');
  }

  const toneNatal = natalCtx.mayan.galacticTone.number;
  const toneTransit = transitCtx.mayan.galacticTone.number;
  if (toneNatal !== toneTransit) {
    const n = GALACTIC_TONE_LIFE[toneNatal];
    const t = GALACTIC_TONE_LIFE[toneTransit];
    if (n && t) {
      lines.push(
        `Tone cross: your birth tone ${toneNatal} (${natalCtx.mayan.galacticTone.name}) meets today's tone ${toneTransit} (${transitCtx.mayan.galacticTone.name}). Collective today: ${t.collective} Your natal wiring: ${n.individual}`
      );
    }
  }

  return lines.join('\n');
}

/** Gridlocked almanac entries for a moment — tiered for context compilation. */
export function compileAlmanacEntries(ctx: CompleteCalculationContext): AlmanacEntry[] {
  const entries: AlmanacEntry[] = [];
  const tone = ctx.mayan.galacticTone.number;
  const toneLife = GALACTIC_TONE_LIFE[tone] || GALACTIC_TONE_LIFE[1];
  const dayEl = ctx.chinese.dayPillar.stemElement;
  const elLife = ELEMENT_LIFE[dayEl] || ELEMENT_LIFE.Wood;
  const phase = ctx.gaiaOvercast?.lunarPhaseName || 'Waxing Crescent';
  const phaseLife = MOON_PHASE_LIFE[phase] || MOON_PHASE_LIFE['Waxing Crescent'];

  entries.push({
    id: 'maya-tone',
    tier: 'CRITICAL',
    tradition: 'Maya Galactic Tone',
    dataPoint: `Tone ${tone} ${ctx.mayan.galacticTone.name} · Kin ${ctx.mayan.kinNumber} ${ctx.mayan.tzolkin.formatted}`,
    collectiveImpact: toneLife.collective,
    individualImpact: toneLife.individual,
    behavioralCue: toneLife.cue,
    epistemic: 'SYSTEM_INTERPRETATION'
  });

  entries.push({
    id: 'maya-seal',
    tier: 'IMPORTANT',
    tradition: 'Tzolk\'in Solar Seal',
    dataPoint: ctx.mayan.tzolkin.formatted,
    collectiveImpact: `Collective attention tilts toward ${ctx.mayan.tzolkin.meaning} themes — media, conflict, and ritual echo this archetype whether people name it or not.`,
    individualImpact: `If this seal matches your birth kin, today is a return pulse — identity themes amplify. If not, you are guesting in its mythology; borrow its gift without claiming it as core self.`,
    behavioralCue: `Work with ${ctx.mayan.tzolkin.meaning} as today's actionable archetype.`,
    epistemic: 'COMPARATIVE_ANALOGY'
  });

  entries.push({
    id: 'bazi-day',
    tier: 'CRITICAL',
    tradition: 'BaZi Day Pillar',
    dataPoint: `${ctx.chinese.dayPillar.stemPinYin}-${ctx.chinese.dayPillar.branchPinYin} (${dayEl} ${ctx.chinese.dayPillar.zodiacAnimal})`,
    collectiveImpact: elLife.collective,
    individualImpact: `${elLife.individual} Branch animal ${ctx.chinese.dayPillar.zodiacAnimal} adds relational texture — negotiations and alliances carry this creature's pacing.`,
    behavioralCue: `Honor ${ctx.chinese.solarTerm.name} — seasonal qi supports ${ctx.chinese.dominantElement} vector today.`,
    epistemic: 'SYSTEM_INTERPRETATION'
  });

  entries.push({
    id: 'lunar-phase',
    tier: 'IMPORTANT',
    tradition: 'Lunar Phase',
    dataPoint: `${phase} · ${ctx.gaiaOvercast?.lunarIlluminationPercent ?? 50}% illumination`,
    collectiveImpact: phaseLife.collective,
    individualImpact: phaseLife.individual,
    behavioralCue: 'Match public vs private output to lunar visibility.',
    epistemic: 'COMPUTED_GEOMETRY'
  });

  entries.push({
    id: 'gene-key-sun',
    tier: 'RELEVANT',
    tradition: 'Gene Keys Sun Transit',
    dataPoint: `Gate ${ctx.geneKeysSun.gate}.${ctx.geneKeysSun.line} ${ctx.geneKeysSun.name}`,
    collectiveImpact: `Collective shadow field: ${ctx.geneKeysSun.shadow} — societies scapegoat this pattern when stressed.`,
    individualImpact: `Personal growth edge: move ${ctx.geneKeysSun.shadow} → ${ctx.geneKeysSun.gift}; siddhi ${ctx.geneKeysSun.siddhi} is the long arc, not today's homework.`,
    behavioralCue: `When triggered, pause before embodying ${ctx.geneKeysSun.shadow} in speech.`,
    epistemic: 'COMPARATIVE_ANALOGY'
  });

  const tribe = ctx.intertwining.primaryTribeLife;
  const topTribe = ctx.synthesis.topResonatingTribe;
  entries.push({
    id: 'tribe',
    tier: 'RELEVANT',
    tradition: 'Twelve Tribes',
    dataPoint: `${tribe.tribe} · ${topTribe.directionInCamp} camp · ${topTribe.gemstone}`,
    collectiveImpact: `Group dynamics favor ${tribe.giftToEmbody} — teams that ignore this gift fracture.`,
    individualImpact: `${tribe.dayPractice} Shadow watch: ${tribe.shadowToWatch}.`,
    behavioralCue: tribe.giftToEmbody,
    epistemic: 'COMPARATIVE_ANALOGY'
  });

  return entries;
}

export function almanacAspectMeaning(
  body1: string,
  body2: string,
  aspect: string,
  nature: string
): string {
  return aspectLifeImpact(body1, body2, aspect, nature);
}

export interface NatalDerivative {
  hasNatal: boolean;
  profileName: string;
  paragraph: string;
  transitHits: CrossChartAspect[];
}

export function compileNatalDerivative(
  transitCtx: CompleteCalculationContext,
  profile: CrucibleProfile | null,
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384' = 'GMT_584283'
): NatalDerivative {
  if (!profile) {
    return { hasNatal: false, profileName: '', paragraph: '', transitHits: [] };
  }
  const natalCtx = executeCrucibleCalculation(
    { ...profile.birth, querentName: profile.querentName || profile.displayName },
    correlationKey
  );
  const dynamics = buildChartDynamicsReport(natalCtx, transitCtx, correlationKey);
  return {
    hasNatal: true,
    profileName: profile.displayName || profile.querentName,
    paragraph: natalDerivativeParagraph(natalCtx, transitCtx, dynamics.transitToNatal),
    transitHits: dynamics.transitToNatal
  };
}

/** Hypergram-style tiered context packet for LLM / export. */
export function buildCompassContextPacket(
  ctx: CompleteCalculationContext,
  profile: CrucibleProfile | null,
  focus = 'daily energy compass'
): string {
  const entries = compileAlmanacEntries(ctx);
  const natal = compileNatalDerivative(ctx, profile);
  const tierOrder: AlmanacTier[] = ['CRITICAL', 'IMPORTANT', 'RELEVANT', 'OPTIONAL'];

  const sections: string[] = [
    `FOCUS: ${focus}`,
    `RULES: Distinguish data vs interpretation. Explain HOW frequencies affect collective behavior and individual psychology. Do not collapse forks. Preserve all computed numbers.`,
    `MOMENT: ${ctx.input.dateString} ${ctx.input.timeString} · JD ${ctx.temporal.julianDayUT.toFixed(4)}`
  ];

  for (const tier of tierOrder) {
    const group = entries.filter((e) => e.tier === tier);
    if (!group.length) continue;
    sections.push(`\n[${tier}]`);
    for (const e of group) {
      sections.push(
        `${e.tradition} | ${e.dataPoint} [${e.epistemic}]\nCollective: ${e.collectiveImpact}\nIndividual: ${e.individualImpact}\nCue: ${e.behavioralCue}`
      );
    }
  }

  if (natal.hasNatal) {
    sections.push(`\n[NATAL_DERIVATIVE — ${natal.profileName}]\n${natal.paragraph}`);
  }

  return sections.join('\n');
}
