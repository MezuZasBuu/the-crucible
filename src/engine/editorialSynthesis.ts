/**
 * Daily bearing — world energy first; personal overlay when a chart is active.
 */

import {
  CompleteCalculationContext,
  CrucibleProfile,
  DailyBearing,
  DailyBearingContributor,
  DomainImpacts,
  ReadingFocus,
  ReadingMode
} from '../types';
import { compileAlmanacEntries } from './almanac';
import { selectEntriesForFocus } from './readingFocus';
import { buildLocalReadingContext } from './localContext';
import { summarizePersonalAlignment } from './personalAlignment';

const SPECIALIST_RE = /\b(kin|tzolk|haab|bazi|enochian|nakshatra|tithi|schumann|kp\s*~|universal day|long count|gmt|spinden)\b/i;

function firstSentence(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const match = cleaned.match(/^(.+?[.!?])(?:\s|$)/);
  return (match?.[1] || cleaned).slice(0, 200);
}

function themeFrom(practice: string, cue: string, forkTitle: string): string {
  const seed = practice || cue || forkTitle;
  const clipped = firstSentence(seed)
    .replace(/\.$/, '')
    .replace(/^(Name|Fortify|Convert|Define|Clarify|Track|Align|Finish|Act|Liberate|Invest|Release)\s+/i, '');
  if (clipped.length > 8 && clipped.length < 72 && !SPECIALIST_RE.test(clipped)) {
    return clipped;
  }
  return forkTitle.replace(/^Fork:\s*/i, '').slice(0, 72) || 'Read the day before you react to it';
}

function atmospheresFor(focus: ReadingFocus, entries: ReturnType<typeof compileAlmanacEntries>): DailyBearing['atmospheres'] {
  const lunar = entries.find((e) => e.id === 'lunar-phase');
  const bazi = entries.find((e) => e.id === 'bazi-day');
  const gene = entries.find((e) => e.id === 'gene-key-sun');
  const maya = entries.find((e) => e.id === 'maya-seal');

  const emotional = firstSentence(
    lunar?.individualImpact?.replace(/\b(kin|tzolk|nakshatra|bazi)\b/gi, '') ||
      `*Feelings run closer to the surface* than usual — the kind of day where small slights land big if you're tired.`
  );
  const social = firstSentence(
    lunar?.collectiveImpact?.replace(/\b(kin|tzolk|nakshatra|bazi)\b/gi, '') ||
      `*Conversations carry weight* beyond small talk; people read tone before they read logic.`
  );
  const workCreative = firstSentence(
    (focus === 'creativity' || focus === 'tech'
      ? gene?.individualImpact || bazi?.individualImpact
      : bazi?.individualImpact || gene?.individualImpact)?.replace(/\b(kin|gene key|gate)\b/gi, '') ||
      `*One clear commitment* beats scattered effort — finish before you start something new.`
  );

  return { emotional, social, workCreative };
}

function buildDomains(
  ctx: CompleteCalculationContext,
  entries: ReturnType<typeof compileAlmanacEntries>,
  profile: CrucibleProfile | null,
  mode: ReadingMode,
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384'
): DomainImpacts {
  const lunar = entries.find((e) => e.id === 'lunar-phase');
  const bazi = entries.find((e) => e.id === 'bazi-day');
  const gene = entries.find((e) => e.id === 'gene-key-sun');
  const maya = entries.find((e) => e.id === 'maya-seal');
  const tone = entries.find((e) => e.id === 'maya-tone');
  const fork = ctx.dialecticalForks?.[0];

  const sunSign = ctx.celestialBodies.find((b) => b.id === 'sun')?.zodiacSign || 'the current season';
  const moonPhase = ctx.gaiaOvercast?.lunarPhaseName || 'a shifting moon';

  const mood = firstSentence(
    `*${moonPhase}* keeps feelings closer to the surface. Most people meet the day with mixed pacing — sleep and overstimulation decide whether patience or irritability wins.`
  );

  const people = firstSentence(
    `Negotiations inherit today's social temperature — *alliances move at the day's pace*, not yours alone. Small misreads in tone carry extra weight.`
  );

  const travel = firstSentence(
    `Movement favors clarity over speed. *Check timing twice* before departures; delays usually come from compressed mood, not a cosmic veto.`
  );

  const finance = firstSentence(
    `Money decisions want a second read today. Avoid impulsive commitments — contracts and purchases benefit from patience, especially when the emotional weather is restless.`
  );

  const tech = firstSentence(
    `Messages, tools, and networks inherit today's friction field — *double-check automation, passwords, and assumptions* before you ship anything important.`
  );

  const whyToday = firstSentence(
    `The sky, season, and calendar weather converge on one atmospheric theme — *${sunSign} light*, ${ctx.chinese.solarTerm.name.toLowerCase()} pacing, and ${moonPhase.toLowerCase()} mood. ${fork?.synthesis.summary || 'Different lenses name the same pressure differently.'}`
  );

  let personalAlignment: string | undefined;
  if (mode === 'personal' && profile) {
    const align = summarizePersonalAlignment(ctx, profile, correlationKey);
    personalAlignment = `${align.headline} ${firstSentence(align.detail)}`;
  }

  return { mood, people, travel, finance, tech, whyToday, personalAlignment };
}

export function synthesizeDailyBearing(
  ctx: CompleteCalculationContext,
  focus: ReadingFocus = 'overview',
  profile: CrucibleProfile | null = null,
  mode: ReadingMode = 'world',
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384' = 'GMT_584283'
): DailyBearing {
  const entries = compileAlmanacEntries(ctx);
  const selected = selectEntriesForFocus(entries, focus);
  const fork = ctx.dialecticalForks?.[0];
  const localContext = buildLocalReadingContext(ctx, mode === 'personal' ? profile : null);

  const practice =
    selected[0]?.behavioralCue ||
    fork?.synthesis.leverage ||
    'Name one decision, then refuse both panic and perfectionism.';
  const watchFor = fork?.pathB.summary || selected[0]?.dataPoint || 'Urgency that pretends to be clarity.';
  const theme = themeFrom(practice, selected[0]?.behavioralCue || '', fork?.title || '');

  const lead = firstSentence(selected[0]?.collectiveImpact || selected[0]?.individualImpact || 'The day carries a readable atmospheric theme.');
  const second = firstSentence(selected[1]?.collectiveImpact || fork?.synthesis.summary || selected[1]?.individualImpact || '');

  const who =
    mode === 'personal' && profile
      ? `${profile.displayName || profile.querentName}: this layers today’s world sky against your saved chart.`
      : 'This is today’s world energy — the shared sky and calendar weather everyone moves through.';

  const summary = `*${lead.replace(/\.$/, '')}.* ${second ? `${second} ` : ''}${who}`;

  const contributors: DailyBearingContributor[] = selected
    .filter((e) => e.id !== 'tribe')
    .map((e) => ({
      systemId: e.id,
      label: e.tradition,
      signal: e.dataPoint,
      epistemic: e.epistemic
    }));

  if (fork) {
    contributors.push({
      systemId: fork.id,
      label: 'Fork of opportunity',
      signal: fork.title,
      epistemic: fork.epistemicClass
    });
  }

  return {
    theme,
    summary,
    practice,
    watchFor,
    atmospheres: atmospheresFor(focus, entries),
    domains: buildDomains(ctx, entries, profile, mode, correlationKey),
    localContext,
    contributors,
    focus,
    mode,
    generatedAtIso: ctx.calculationTimeIso,
    calculationId: ctx.calculationId
  };
}

export function bearingIsPlainLanguage(bearing: DailyBearing): boolean {
  return !SPECIALIST_RE.test(`${bearing.theme} ${bearing.summary}`);
}
