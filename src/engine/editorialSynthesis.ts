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
import { SIGN_KEYWORDS } from './ephemeris';
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

  const body = (id: string) => ctx.celestialBodies.find((b) => b.id === id);
  const sun = body('sun');
  const moon = body('moon');
  const mercury = body('mercury');
  const venus = body('venus');
  const mars = body('mars');
  const jupiter = body('jupiter');
  const sunSign = sun?.zodiacSign || 'the current season';
  const moonPhase = ctx.gaiaOvercast?.lunarPhaseName || 'a shifting moon';
  const kw = (sign?: string) => (sign && SIGN_KEYWORDS[sign]) || 'its own themes';
  const phaseNote = /Full/.test(moonPhase)
    ? 'feelings tend to run high and things come to a head'
    : /New/.test(moonPhase)
      ? 'energy is low and inward — good for quiet starts'
      : /Waxing/.test(moonPhase)
        ? 'momentum is building, so it is easier to push things forward'
        : 'things are winding down, which favours finishing and letting go';
  const term = ctx.chinese.solarTerm.name.match(/\(([^)]+)\)/)?.[1] || ctx.chinese.solarTerm.name;

  const mood = `*${moonPhase} in ${moon?.zodiacSign ?? 'the sky'}.* Traditionally ${phaseNote}. The Moon in ${moon?.zodiacSign ?? 'this sign'} colours the mood with ${kw(moon?.zodiacSign)}.`;

  const people = `*Venus is in ${venus?.zodiacSign ?? 'transit'}*, the planet linked with relationships, so connection leans toward ${kw(venus?.zodiacSign)}.${
    venus?.isRetrograde ? ' Venus is retrograde, traditionally a time to revisit old ties rather than start new ones.' : ''
  } Mars in ${mars?.zodiacSign ?? 'transit'} shapes how people push and argue: ${kw(mars?.zodiacSign)}.`;

  const travel = mercury?.isRetrograde
    ? `*Mercury is retrograde in ${mercury.zodiacSign}* — it appears to move backward in the sky. Astrologers treat this as a time to *double-check bookings, routes and timings* and to leave extra margin.`
    : `*Mercury is moving forward in ${mercury?.zodiacSign ?? 'transit'}*, which astrologers read as plain sailing for trips and plans. Journeys suit ${kw(mercury?.zodiacSign)}.`;

  const finance = `*Jupiter in ${jupiter?.zodiacSign ?? 'transit'}* is the traditional marker for growth and luck — right now it favours ${kw(jupiter?.zodiacSign)}.${
    jupiter?.isRetrograde ? ' It is retrograde, which suggests reviewing plans rather than expanding them.' : ''
  } In the Chinese calendar the strongest element today is ${ctx.chinese.dominantElement.toLowerCase()}.`;

  const tech = mercury?.isRetrograde
    ? `*Mercury retrograde* is the classic time for crossed wires. *Back things up, re-read before you send*, and expect to revisit earlier conversations.`
    : `With Mercury moving forward, messages and tools are traditionally expected to run smoothly. Mercury in ${mercury?.zodiacSign ?? 'this sign'} gives communication a tone of ${kw(mercury?.zodiacSign)}.`;

  const whyToday = `Three things set today’s tone: the Sun in *${sunSign}* (${kw(sunSign)}), a *${moonPhase}*, and the Chinese season marker *${term}*. The Maya day sign is ${ctx.mayan.tzolkin.formatted} (${ctx.mayan.tzolkin.meaning.split('/')[0].trim().toLowerCase()}).`;

  void lunar;
  void bazi;
  void gene;
  void maya;
  void tone;
  void fork;

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
  const callingLife = ctx.intertwining.primaryCallingLife;
  const watchFor = `*${ctx.geneKeysSun.shadow}* is today’s pressure point in the Gene Keys — try answering it with ${ctx.geneKeysSun.gift.toLowerCase()}. Also keep an eye on this: ${callingLife.shadowToWatch.replace(/\.$/, '').toLowerCase()}.`;
  const theme = themeFrom(practice, selected[0]?.behavioralCue || '', fork?.title || '');

  const lead = firstSentence(selected[0]?.collectiveImpact || selected[0]?.individualImpact || 'The day carries a readable atmospheric theme.');
  const second = firstSentence(selected[1]?.collectiveImpact || fork?.synthesis.summary || selected[1]?.individualImpact || '');

  const who =
    mode === 'personal' && profile
      ? `${profile.displayName || profile.querentName}: this compares today’s sky with your own birth chart.`
      : 'This reading is for everyone — it describes the day itself, not you personally.';

  const summary = `*${lead.replace(/\.$/, '')}.* ${second ? `${second} ` : ''}${who}`;

  const contributors: DailyBearingContributor[] = selected
    .filter((e) => e.id !== 'calling')
    .map((e) => ({
      systemId: e.id,
      label: e.tradition,
      signal: e.dataPoint,
      epistemic: e.epistemic
    }));

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
