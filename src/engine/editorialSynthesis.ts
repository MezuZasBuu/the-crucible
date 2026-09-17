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

  const emotional = firstSentence(lunar?.individualImpact || maya?.individualImpact || 'Collective mood runs closer to the surface than usual.');
  const social = firstSentence(lunar?.collectiveImpact || bazi?.collectiveImpact || 'Conversations carry more weight than small talk.');
  const workCreative = firstSentence(
    focus === 'creativity' || focus === 'tech'
      ? gene?.individualImpact || bazi?.individualImpact || ''
      : bazi?.individualImpact || gene?.individualImpact || 'Work favors one clear commitment over scattered effort.'
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

  const mood = firstSentence(
    `${lunar?.individualImpact || ''} Typical collective mood: ${lunar?.collectiveImpact || 'mixed pacing'}. Most people meet the day with ${ctx.gaiaOvercast?.lunarPhaseName || 'changing lunar light'} — patience or irritability scales with sleep and overstimulation.`
  );

  const people = firstSentence(
    bazi?.collectiveImpact ||
      `${ctx.chinese.dayPillar.stemPinYin}-${ctx.chinese.dayPillar.branchPinYin} colors negotiations — alliances move at the day pillar’s pace, not yours alone.`
  );

  const travel = firstSentence(
    `${maya?.individualImpact || ''} Movement favors clarity over speed: ${tone?.behavioralCue || 'check timing twice before committing to departures'}. Delays often come from mood compression, not cosmic veto.`
  );

  const finance = firstSentence(
    `${bazi?.individualImpact || ''} Money energy: ${gene?.collectiveImpact || 'avoid impulsive commitments'}. Contracts and purchases benefit from a second read — especially when the day’s tone is ${ctx.mayan.galacticTone.name.toLowerCase()}.`
  );

  const tech = firstSentence(
    `${gene?.individualImpact || ''} Tools, networks, and messages inherit ${ctx.geneKeysSun.gift} as the growth edge and ${ctx.geneKeysSun.shadow} as the friction field — double-check automation, passwords, and assumptions before shipping.`
  );

  const whyToday = firstSentence(
    `${tone?.dataPoint || ctx.mayan.tzolkin.formatted} · ${ctx.chinese.solarTerm.name} · Sun ${ctx.celestialBodies.find((b) => b.id === 'sun')?.zodiacSign}. ${fork?.synthesis.summary || 'Multiple calendars agree on a theme even when they name it differently.'}`
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

  const summary = `${lead} ${second} ${who}`;

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
