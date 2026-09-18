/**
 * Multi-pass deep readings via Cursor Cloud Agents API (no-repo Q&A agents).
 * Falls back to deterministic expansion when CURSOR_API_KEY is unset.
 */

import {
  CompleteCalculationContext,
  CrucibleProfile,
  DeepReadingRequest,
  FourteenDayForecastEntry,
  ReadingMode
} from '../types';
import { BRIEFING_VOICE_PROMPT } from './voiceStyle';

const CURSOR_API = 'https://api.cursor.com';

function basicAuth(apiKey: string): string {
  if (typeof btoa === 'function') {
    return `Basic ${btoa(`${apiKey}:`)}`;
  }
  return `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
}

async function waitForRun(
  apiKey: string,
  agentId: string,
  runId: string,
  maxWaitMs: number,
  pollMs: number
): Promise<string> {
  const auth = basicAuth(apiKey);
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const res = await fetch(`${CURSOR_API}/v1/agents/${agentId}/runs/${runId}`, {
      headers: { Authorization: auth }
    });
    if (!res.ok) {
      throw new Error(`Cursor run status ${res.status}`);
    }
    const data = (await res.json()) as { status?: string; result?: string };
    const status = data.status || '';
    if (status === 'FINISHED') {
      return data.result?.trim() || '';
    }
    if (status === 'ERROR' || status === 'CANCELLED' || status === 'EXPIRED') {
      throw new Error(`Cursor run ${status.toLowerCase()}`);
    }
    await new Promise((r) => setTimeout(r, pollMs));
  }
  throw new Error('Cursor run timed out');
}

async function createAgentRun(apiKey: string, prompt: string, model: string): Promise<{ agentId: string; runId: string }> {
  const auth = basicAuth(apiKey);
  const res = await fetch(`${CURSOR_API}/v1/agents`, {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: { text: prompt },
      model: { id: model },
      name: 'Crucible Deep Reading'
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cursor agent create ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = (await res.json()) as { agent?: { id?: string }; run?: { id?: string } };
  const agentId = data.agent?.id;
  const runId = data.run?.id;
  if (!agentId || !runId) throw new Error('Cursor agent create missing ids');
  return { agentId, runId };
}

async function followUpRun(apiKey: string, agentId: string, prompt: string): Promise<string> {
  const auth = basicAuth(apiKey);
  const res = await fetch(`${CURSOR_API}/v1/agents/${agentId}/runs`, {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: { text: prompt } })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cursor follow-up ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = (await res.json()) as { run?: { id?: string } };
  const runId = data.run?.id;
  if (!runId) throw new Error('Cursor follow-up missing run id');
  return runId;
}

function contextBlock(ctx?: CompleteCalculationContext, entry?: FourteenDayForecastEntry, location?: string): string {
  if (entry) {
    return `FORECAST DAY ${entry.dateString} (${entry.dayOfWeek})
Location overlay: ${location || entry.geographicalResonance.targetLocationName}
Resonance: ${entry.synchronicResonanceScore}% · ${entry.resonanceArchetype}
Maya Kin ${entry.mayan.kinNumber} ${entry.mayan.tzolkinFormatted} · Tone ${entry.mayan.galacticTone.name}
Chinese day: ${entry.chinese.dayPillar} · ${entry.chinese.solarTerm}
Moon: ${entry.planetary.moonPhase} · Sun ${entry.planetary.sunZodiac}
Gene Key Sun ${entry.geneKeys.sunGate}.${entry.geneKeys.line} gift ${entry.geneKeys.gift}
Fork: ${entry.dialecticalFork.title}`;
  }
  if (!ctx) return 'No full calculation context supplied.';
  return `DATE ${ctx.input.dateString} ${ctx.input.timeString} · ${ctx.input.location?.city || 'World'}
Maya Kin ${ctx.mayan.kinNumber} ${ctx.mayan.tzolkin.formatted} · Tone ${ctx.mayan.galacticTone.name}
Chinese day ${ctx.chinese.dayPillar.stemElement} ${ctx.chinese.dayPillar.zodiacAnimal} · ${ctx.chinese.solarTerm.name}
Moon phase ${ctx.gaiaOvercast?.lunarPhaseName} · Sun ${ctx.celestialBodies.find((b) => b.id === 'sun')?.zodiacSign}
Gene Keys Sun ${ctx.geneKeysSun.gate}.${ctx.geneKeysSun.line} (${ctx.geneKeysSun.gift} / shadow ${ctx.geneKeysSun.shadow})
Harmonic index ${ctx.synthesis?.harmonicResonanceIndex}/100`;
}

function profileBlock(profile?: CrucibleProfile | null): string {
  if (!profile) return 'No saved natal profile — explain collective/world impact only.';
  return `NATAL PROFILE: ${profile.displayName || profile.querentName}
Birth ${profile.birth.dateString} ${profile.birth.timeString} · ${profile.birth.location?.city || 'unknown place'}
Time confidence: ${profile.birthTimeConfidence}`;
}

export function buildDeepReadingPasses(req: DeepReadingRequest): string[] {
  const mode: ReadingMode = req.mode || 'world';
  const block = contextBlock(req.context, req.forecastEntry, req.targetLocationName);
  const profile = profileBlock(req.profile);
  const domainLabel = req.cardTitle || req.domainKey;

  const pass1 = `${BRIEFING_VOICE_PROMPT}

You are The Crucible deep-reading engine. Pass 1 of 3 — analyze computed data only; do not invent citations.

DOMAIN: ${domainLabel} (${req.domainKey})
READING MODE: ${mode === 'personal' ? 'personal chart × sky' : 'world / collective energy'}
SEED (deterministic baseline — extend, do not repeat verbatim):
${req.seedText}

COMPUTED CONTEXT:
${block}

${profile}

Explain WHY this domain reads the way it does today using the supplied numbers. Name epistemic limits. 250–400 words.`;

  const pass2 = `Pass 2 of 3 — translate into lived impact.

Using your prior analysis, explain how this ${domainLabel} energy affects:
- collective mood and typical friction everyone meets
- people, negotiations, and social pacing
- travel and movement (if relevant to this domain)
- money, contracts, and resource decisions (if relevant)
- technology, messages, and tools (if relevant)

Stay practical. No destiny claims. 300–450 words.`;

  const pass3 =
    mode === 'personal' && req.profile
      ? `Pass 3 of 3 — personal chart alignment.

Given the natal profile above, does today's sky mostly aid or press against this person's pattern for ${domainLabel}? Give concrete behavioral guidance — what to lean into, what to double-check. 200–350 words.`
      : `Pass 3 of 3 — weekly arc hook.

Briefly connect this ${domainLabel} reading to how the next 7 days might echo or soften the same theme (without inventing new ephemeris). 150–250 words.`;

  return [pass1, pass2, pass3];
}

export function expandDeepReadingOffline(req: DeepReadingRequest): string {
  const base = req.seedText.trim();
  const location = req.targetLocationName || req.forecastEntry?.geographicalResonance.targetLocationName || req.context?.input.location?.city;
  const modeNote =
    req.mode === 'personal' && req.profile
      ? `For ${req.profile.displayName || req.profile.querentName}, treat this as a personal overlay — compare today's transit tone with saved birth timing before acting.`
      : `This is world-sky weather — everyone shares the backdrop; personal charts modulate how sharply it lands.`;

  const domainNotes: Record<string, string> = {
    mood: 'Collective mood is the ambient pressure — sleep, caffeine, and overstimulation amplify it more than the chart alone.',
    people: 'Social pacing follows the day pillar and lunar tone — agreements need explicit timing, not assumed rapport.',
    travel: 'Movement friction usually comes from compressed mood and rushed timing, not a cosmic veto on departure.',
    finance: 'Money decisions benefit from a second read when the day tone is impulsive or contract-heavy.',
    tech: 'Tools and messages inherit the day\'s friction field — verify automation, credentials, and assumptions before shipping.',
    whyToday: 'Multiple calendars name the same atmospheric theme differently — that convergence is the signal.',
    personalAlignment: 'Transit-to-natal hits describe weather against your natal pattern, not fixed fate.',
    emotional: 'Emotional atmosphere is the felt backdrop — it scales with rest and sensory load.',
    social: 'Social atmosphere colors negotiations and tone — small misreads carry extra weight.',
    workCreative: 'Work and creative energy favor one clear commitment over scattered effort.',
    watchFor: 'This is the day\'s primary friction cue — notice it early to avoid reactive decisions.',
    regional: 'Regional overlay adjusts daylight and local clock — not the world sky itself.'
  };

  const extra = domainNotes[req.domainKey] || 'Hold the seed reading, then act on one concrete adjustment.';

  return `${base}

${modeNote}${location ? ` Regional overlay: ${location}.` : ''}

${extra}

(Configure CURSOR_API_KEY on the service to unlock multi-pass Cursor deep readings.)`;
}

export async function executeDeepReading(
  req: DeepReadingRequest,
  apiKey: string | undefined,
  opts?: { model?: string; maxWaitMs?: number; pollMs?: number; passCount?: number }
): Promise<{ text: string; source: string; passesCompleted: number }> {
  const passes = buildDeepReadingPasses(req);
  const passCount = Math.min(opts?.passCount ?? passes.length, passes.length);
  const model = opts?.model || 'composer-2.5';
  const maxWaitMs = opts?.maxWaitMs ?? 120000;
  const pollMs = opts?.pollMs ?? 2500;

  if (!apiKey) {
    return {
      text: expandDeepReadingOffline(req),
      source: 'Crucible deterministic deep reading (offline)',
      passesCompleted: 0
    };
  }

  const { agentId, runId } = await createAgentRun(apiKey, passes[0], model);
  let result = await waitForRun(apiKey, agentId, runId, maxWaitMs, pollMs);
  let completed = 1;

  for (let i = 1; i < passCount; i++) {
    const nextRunId = await followUpRun(apiKey, agentId, passes[i]);
    result = await waitForRun(apiKey, agentId, nextRunId, maxWaitMs, pollMs);
    completed++;
  }

  return {
    text: result || expandDeepReadingOffline(req),
    source: `Cursor Cloud Agent (${completed}-pass)`,
    passesCompleted: completed
  };
}
