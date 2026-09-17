/**
 * Daily bearing — meaning first, machinery second.
 * Deterministic: same context + focus → same bearing.
 */

import { CompleteCalculationContext, CrucibleProfile, DailyBearing, DailyBearingContributor, ReadingFocus } from '../types';
import { compileAlmanacEntries } from './almanac';
import { selectEntriesForFocus } from './readingFocus';
import { buildLocalReadingContext } from './localContext';

const SPECIALIST_RE = /\b(kin|tzolk|haab|bazi|enochian|nakshatra|tithi|schumann|kp\s*~|universal day|long count|gmt|spinden)\b/i;

function firstSentence(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const match = cleaned.match(/^(.+?[.!?])(?:\s|$)/);
  return (match?.[1] || cleaned).slice(0, 180);
}

function themeFrom(practice: string, cue: string, forkTitle: string): string {
  const seed = practice || cue || forkTitle;
  const clipped = firstSentence(seed)
    .replace(/\.$/, '')
    .replace(/^(Name|Fortify|Convert|Define|Clarify|Track|Align|Finish|Act|Liberate|Invest|Release)\s+/i, '');
  if (clipped.length > 8 && clipped.length < 72 && !SPECIALIST_RE.test(clipped)) {
    return clipped;
  }
  return forkTitle.replace(/^Fork:\s*/i, '').slice(0, 72) || 'Make room before you move forward';
}

function atmospheresFor(focus: ReadingFocus, entries: ReturnType<typeof compileAlmanacEntries>): DailyBearing['atmospheres'] {
  const lunar = entries.find((e) => e.id === 'lunar-phase');
  const tribe = entries.find((e) => e.id === 'tribe');
  const bazi = entries.find((e) => e.id === 'bazi-day');
  const gene = entries.find((e) => e.id === 'gene-key-sun');

  const emotional = firstSentence(lunar?.individualImpact || tribe?.individualImpact || 'Feelings may run closer to the surface than usual.');
  const social = firstSentence(tribe?.collectiveImpact || lunar?.collectiveImpact || 'Conversations carry more weight than small talk.');
  const workCreative = firstSentence(
    focus === 'creativity'
      ? gene?.individualImpact || bazi?.individualImpact || ''
      : bazi?.individualImpact || gene?.individualImpact || 'Work favors one clear commitment over scattered effort.'
  );

  return { emotional, social, workCreative };
}

export function synthesizeDailyBearing(
  ctx: CompleteCalculationContext,
  focus: ReadingFocus = 'overview',
  profile: CrucibleProfile | null = null
): DailyBearing {
  const entries = compileAlmanacEntries(ctx);
  const selected = selectEntriesForFocus(entries, focus);
  const tribe = ctx.intertwining.primaryTribeLife;
  const fork = ctx.dialecticalForks?.[0];
  const localContext = buildLocalReadingContext(ctx, profile);

  const practice = tribe.dayPractice || selected[0]?.behavioralCue || 'Choose one obligation to simplify before adding another.';
  const watchFor = tribe.shadowToWatch || fork?.pathB.summary || 'Urgency that pretends to be clarity.';
  const theme = themeFrom(practice, selected[0]?.behavioralCue || '', fork?.title || '');

  const lead = firstSentence(selected[0]?.individualImpact || tribe.lifeRepresents);
  const second = firstSentence(selected[1]?.individualImpact || fork?.synthesis.summary || tribe.giftToEmbody);
  const place = localContext.cityLabel;
  const who = localContext.personal
    ? `${localContext.personalName}, this reading is weighted to your saved pattern.`
    : 'This is a shared reading for the selected date and place. Add birth details for a personal overlay.';

  const summary = `${lead} In ${place}, ${second} ${who}`;

  const contributors: DailyBearingContributor[] = selected.map((e) => ({
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
    localContext,
    contributors,
    focus,
    generatedAtIso: ctx.calculationTimeIso,
    calculationId: ctx.calculationId
  };
}

export function bearingIsPlainLanguage(bearing: DailyBearing): boolean {
  return !SPECIALIST_RE.test(`${bearing.theme} ${bearing.summary}`);
}
