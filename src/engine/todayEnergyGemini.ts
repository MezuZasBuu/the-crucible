/**
 * Gemini today-energy generation — server-side prompt and parsing.
 */

import { GoogleGenAI } from '@google/genai';
import {
  CompleteCalculationContext,
  CrucibleProfile,
  ReadingMode
} from '../types';
import { BRIEFING_VOICE_PROMPT } from './voiceStyle';
import { buildTgoldResearchPromptBlock } from './tgold';
import { deterministicTodayEnergy, type GeneratedTodayEnergy } from './todayEnergyService';

function contextDigest(ctx: CompleteCalculationContext): string {
  return [
    `Date ${ctx.input.dateString} ${ctx.input.timeString} · ${ctx.input.location?.city || 'World'}`,
    `Maya Kin ${ctx.mayan.kinNumber} ${ctx.mayan.tzolkin.formatted} · Tone ${ctx.mayan.galacticTone.name}`,
    `Chinese day ${ctx.chinese.dayPillar.stemElement} ${ctx.chinese.dayPillar.zodiacAnimal} · ${ctx.chinese.solarTerm.name}`,
    `Moon ${ctx.gaiaOvercast?.lunarPhaseName} · Sun ${ctx.celestialBodies.find((b) => b.id === 'sun')?.zodiacSign}`,
    `Gene Key Sun ${ctx.geneKeysSun.gate}.${ctx.geneKeysSun.line} (${ctx.geneKeysSun.gift})`,
    `Top tribe ${ctx.synthesis?.topResonatingTribe?.tribe} · Harmonic ${ctx.synthesis?.harmonicResonanceIndex}/100`,
    `Fork: ${ctx.dialecticalForks?.[0]?.title || 'none'}`
  ].join('\n');
}

export function buildTodayEnergyPrompt(
  ctx: CompleteCalculationContext,
  profile: CrucibleProfile | null,
  mode: ReadingMode
): string {
  const tgold = buildTgoldResearchPromptBlock({
    mode: 'daily-report',
    ctx,
    query: `today energy ${ctx.input.dateString}`,
    compact: true
  });
  const profileLine = profile
    ? `Natal: ${profile.displayName || profile.querentName} · birth ${profile.birth.dateString}`
    : 'No natal profile — world/collective copy only.';

  return `${BRIEFING_VOICE_PROMPT}

${tgold}

You write the public-facing Today screen for The Crucible — informative, warm, consumer-facing. NOT an encyclopedia. NO jargon (no Kin, BaZi, nakshatra in main text). Use plain English. Separate words with spaces. Use *asterisks* around poetic emphasis only.

COMPUTED DATA (ground truth — do not invent numbers):
${contextDigest(ctx)}
Mode: ${mode}
${profileLine}

Return ONLY valid JSON (no markdown fences) with this exact shape:
{
  "theme": "short headline under 72 chars",
  "summary": "3-5 sentences opening the day",
  "practice": "one concrete practice for today",
  "watchFor": "primary friction cue",
  "fullReport": "900-1400 words plain-language report with section headers: Today's Atmosphere, Emotional Weather, Social Weather, Work and Creative, Collective Mood, People, Travel, Finance, Technology, Why Today Feels This Way, Watch For. Each section 2-4 sentences minimum.",
  "atmospheres": {
    "emotional": "4-6 sentences emotional atmosphere",
    "social": "4-6 sentences social atmosphere",
    "workCreative": "4-6 sentences work and creative energy"
  },
  "domains": {
    "mood": "5-7 sentences collective mood",
    "people": "5-7 sentences people and relationships",
    "travel": "5-7 sentences travel and movement",
    "finance": "5-7 sentences money and resources",
    "tech": "5-7 sentences technology and messages",
    "whyToday": "5-7 sentences why today feels this way"
  }
}`;
}

export function parseTodayEnergyJson(raw: string): Partial<GeneratedTodayEnergy> | null {
  const trimmed = raw.trim();
  const jsonStart = trimmed.indexOf('{');
  const jsonEnd = trimmed.lastIndexOf('}');
  if (jsonStart < 0 || jsonEnd <= jsonStart) return null;
  try {
    return JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as Partial<GeneratedTodayEnergy>;
  } catch {
    return null;
  }
}

export async function generateTodayEnergyWithGemini(
  apiKey: string,
  ctx: CompleteCalculationContext,
  profile: CrucibleProfile | null,
  mode: ReadingMode,
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384'
): Promise<GeneratedTodayEnergy> {
  const fallback = deterministicTodayEnergy(ctx, profile, mode, correlationKey);
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: buildTodayEnergyPrompt(ctx, profile, mode),
      config: {
        temperature: 0.72,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json'
      }
    });
    const parsed = parseTodayEnergyJson(response.text || '');
    if (!parsed?.summary || !parsed.fullReport) return { ...fallback, source: 'deterministic' };
    return {
      theme: parsed.theme || fallback.theme,
      summary: parsed.summary || fallback.summary,
      practice: parsed.practice || fallback.practice,
      watchFor: parsed.watchFor || fallback.watchFor,
      fullReport: parsed.fullReport || fallback.fullReport,
      atmospheres: { ...fallback.atmospheres, ...parsed.atmospheres },
      domains: { ...fallback.domains, ...parsed.domains },
      focusSlides: parsed.focusSlides,
      source: 'gemini'
    };
  } catch {
    return { ...fallback, source: 'deterministic' };
  }
}
