/**
 * Gemini-generated today energy — consumer-facing copy for the free Today experience.
 */

import {
  CompleteCalculationContext,
  CrucibleProfile,
  DailyBearing,
  DomainImpacts,
  ReadingFocus,
  ReadingMode
} from '../types';
import { synthesizeDailyBearing } from './editorialSynthesis';

export interface GeneratedTodayEnergy {
  theme: string;
  summary: string;
  practice: string;
  watchFor: string;
  fullReport: string;
  atmospheres: DailyBearing['atmospheres'];
  domains: DomainImpacts;
  focusSlides?: Partial<
    Record<ReadingFocus, { theme: string; summary: string; practice: string }>
  >;
  source: 'gemini' | 'deterministic';
}

const CACHE_PREFIX = 'crucible.todayEnergy.v1';

function cacheKey(ctx: CompleteCalculationContext, mode: ReadingMode): string {
  const city = ctx.input.location?.city || 'world';
  return `${CACHE_PREFIX}:${ctx.input.dateString}:${ctx.input.timeString.slice(0, 5)}:${city}:${mode}:${ctx.calculationId}`;
}

export function readCachedTodayEnergy(
  ctx: CompleteCalculationContext,
  mode: ReadingMode
): GeneratedTodayEnergy | null {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    const raw = sessionStorage.getItem(cacheKey(ctx, mode));
    if (!raw) return null;
    return JSON.parse(raw) as GeneratedTodayEnergy;
  } catch {
    return null;
  }
}

export function writeCachedTodayEnergy(
  ctx: CompleteCalculationContext,
  mode: ReadingMode,
  data: GeneratedTodayEnergy
): void {
  try {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(cacheKey(ctx, mode), JSON.stringify(data));
  } catch {
    /* quota */
  }
}

export function deterministicTodayEnergy(
  ctx: CompleteCalculationContext,
  profile: CrucibleProfile | null,
  mode: ReadingMode,
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384'
): GeneratedTodayEnergy {
  const bearing = synthesizeDailyBearing(ctx, 'overview', profile, mode, correlationKey);
  const sections = [
    `**Today's atmosphere**\n\n${bearing.summary}\n\n*Practice:* ${bearing.practice}`,
    `**Emotional weather**\n\n${bearing.atmospheres.emotional}`,
    `**Social weather**\n\n${bearing.atmospheres.social}`,
    `**Work & creative**\n\n${bearing.atmospheres.workCreative}`,
    `**Collective mood**\n\n${bearing.domains.mood}`,
    `**People & relationships**\n\n${bearing.domains.people}`,
    `**Travel & movement**\n\n${bearing.domains.travel}`,
    `**Money & resources**\n\n${bearing.domains.finance}`,
    `**Technology & messages**\n\n${bearing.domains.tech}`,
    `**Why today feels this way**\n\n${bearing.domains.whyToday}`,
    bearing.domains.personalAlignment
      ? `**Your chart overlay**\n\n${bearing.domains.personalAlignment}`
      : '',
    `**Watch for**\n\n${bearing.watchFor}`
  ].filter(Boolean);

  return {
    theme: bearing.theme,
    summary: bearing.summary,
    practice: bearing.practice,
    watchFor: bearing.watchFor,
    fullReport: sections.join('\n\n'),
    atmospheres: bearing.atmospheres,
    domains: bearing.domains,
    source: 'deterministic'
  };
}

export function mergeBearingWithGenerated(
  base: DailyBearing,
  generated: GeneratedTodayEnergy | null
): DailyBearing {
  if (!generated) return base;
  return {
    ...base,
    theme: generated.theme || base.theme,
    summary: generated.summary || base.summary,
    practice: generated.practice || base.practice,
    watchFor: generated.watchFor || base.watchFor,
    atmospheres: { ...base.atmospheres, ...generated.atmospheres },
    domains: { ...base.domains, ...generated.domains },
    fullReport: generated.fullReport,
    enrichedBy: generated.source
  };
}

export async function fetchTodayEnergy(opts: {
  ctx: CompleteCalculationContext;
  profile: CrucibleProfile | null;
  mode: ReadingMode;
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
}): Promise<GeneratedTodayEnergy> {
  const cached = readCachedTodayEnergy(opts.ctx, opts.mode);
  if (cached) return cached;

  const fallback = deterministicTodayEnergy(
    opts.ctx,
    opts.profile,
    opts.mode,
    opts.correlationKey
  );

  try {
    const res = await fetch('/api/today-energy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: opts.ctx,
        profile: opts.profile,
        mode: opts.mode
      })
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as GeneratedTodayEnergy;
    if (!data?.summary || !data?.fullReport) return fallback;
    const merged: GeneratedTodayEnergy = {
      ...fallback,
      ...data,
      atmospheres: { ...fallback.atmospheres, ...data.atmospheres },
      domains: { ...fallback.domains, ...data.domains },
      source: data.source || 'gemini'
    };
    writeCachedTodayEnergy(opts.ctx, opts.mode, merged);
    return merged;
  } catch {
    return fallback;
  }
}
