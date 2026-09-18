/**
 * Cloudflare Pages Function — multi-pass Cursor deep reading (auth-gated when Cursor pool active).
 */

import {
  checkAndIncrementDeepReadingUsage,
  extractBearerToken,
  verifyFirebaseIdToken
} from '../_shared/authGate';

type DeepReadingBody = {
  domainKey: string;
  seedText: string;
  cardTitle: string;
  mode?: string;
  targetLocationName?: string;
  profile?: { displayName?: string; querentName?: string };
  forecastEntry?: {
    dateString: string;
    geographicalResonance?: { targetLocationName?: string };
    mayan?: { kinNumber?: number };
    chinese?: { dayPillar?: string };
    planetary?: { moonPhase?: string };
  };
  context?: {
    input?: { dateString?: string; location?: { city?: string } };
    mayan?: { kinNumber?: number };
    chinese?: { dayPillar?: { stemElement?: string; zodiacAnimal?: string } };
  };
};

const BRIEFING = `THE CRUCIBLE — Expert compass briefing. Preserve computed data. Explain HOW frequencies affect mood, people, travel, finance, and tech. Never stop at labeling.`;

function expandOffline(req: DeepReadingBody, note?: string): string {
  const location =
    req.targetLocationName || req.forecastEntry?.geographicalResonance?.targetLocationName || req.context?.input?.location?.city;
  return `${req.seedText.trim()}

${req.mode === 'personal' && req.profile ? `Personal overlay for ${req.profile.displayName || req.profile.querentName}.` : 'World-sky weather — shared backdrop for everyone.'}${location ? ` Regional overlay: ${location}.` : ''}

Hold the seed reading, then act on one concrete adjustment.${note ? ` ${note}` : ''}`;
}

function basicAuth(apiKey: string): string {
  return `Basic ${btoa(`${apiKey}:`)}`;
}

async function waitForRun(apiKey: string, agentId: string, runId: string, maxWaitMs: number): Promise<string> {
  const auth = basicAuth(apiKey);
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    const res = await fetch(`https://api.cursor.com/v1/agents/${agentId}/runs/${runId}`, {
      headers: { Authorization: auth }
    });
    if (!res.ok) throw new Error(`Cursor status ${res.status}`);
    const data = (await res.json()) as { status?: string; result?: string };
    if (data.status === 'FINISHED') return data.result?.trim() || '';
    if (data.status === 'ERROR' || data.status === 'CANCELLED' || data.status === 'EXPIRED') {
      throw new Error(`Cursor run ${data.status?.toLowerCase()}`);
    }
    await new Promise((r) => setTimeout(r, 2500));
  }
  throw new Error('Cursor run timed out');
}

function contextSnippet(req: DeepReadingBody): string {
  const e = req.forecastEntry;
  if (e) {
    return `Day ${e.dateString} · Kin ${e.mayan?.kinNumber} · ${e.chinese?.dayPillar} · ${e.planetary?.moonPhase}`;
  }
  const c = req.context;
  if (c) {
    return `${c.input?.dateString} · Kin ${c.mayan?.kinNumber} · ${c.chinese?.dayPillar?.stemElement} ${c.chinese?.dayPillar?.zodiacAnimal}`;
  }
  return 'computed context attached in seed';
}

export async function onRequestPost(context: {
  request: Request;
  env: {
    CURSOR_API_KEY?: string;
    CURSOR_MODEL?: string;
    FIREBASE_WEB_API_KEY?: string;
    VITE_FIREBASE_API_KEY?: string;
  };
}) {
  try {
    const req = (await context.request.json()) as DeepReadingBody;
    if (!req?.seedText || !req?.domainKey) {
      return Response.json({ error: 'seedText and domainKey are required' }, { status: 400 });
    }

    const cursorKey = context.env.CURSOR_API_KEY;
    if (!cursorKey) {
      return Response.json({
        expandedText: expandOffline(req, 'Sign in once Firebase is configured to unlock Cursor deep readings.'),
        source: 'Crucible deterministic deep reading (offline)',
        passesCompleted: 0
      });
    }

    const firebaseKey = context.env.FIREBASE_WEB_API_KEY || context.env.VITE_FIREBASE_API_KEY;
    const bearer = extractBearerToken(context.request.headers.get('Authorization'));
    if (!bearer) {
      return Response.json(
        { error: 'Sign in (guest or Google) to unlock Cursor deep readings.', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }
    if (!firebaseKey) {
      return Response.json({ error: 'Firebase auth verification is not configured.' }, { status: 503 });
    }

    const verified = await verifyFirebaseIdToken(bearer, firebaseKey);
    if (!verified) {
      return Response.json({ error: 'Invalid or expired session.', code: 'AUTH_INVALID' }, { status: 401 });
    }

    const quota = checkAndIncrementDeepReadingUsage(verified);
    if (!quota.allowed) {
      return Response.json(
        {
          error: `Daily deep reading limit reached (${quota.used}/${quota.limit}).`,
          code: 'QUOTA_EXCEEDED',
          quota
        },
        { status: 429 }
      );
    }

    const model = context.env.CURSOR_MODEL || 'composer-2.5';
    const auth = basicAuth(cursorKey);
    const snippet = contextSnippet(req);

    const pass1 = `${BRIEFING}

Pass 1 — analyze computed data for domain "${req.cardTitle}" (${req.domainKey}).
Mode: ${req.mode || 'world'}
Context: ${snippet}
Seed: ${req.seedText}
Explain why this domain reads this way. 250–400 words.`;

    const createRes = await fetch('https://api.cursor.com/v1/agents', {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: { text: pass1 }, model: { id: model }, name: 'Crucible Deep Reading' })
    });
    if (!createRes.ok) {
      return Response.json({
        expandedText: expandOffline(req, 'Cursor pool unavailable — showing deterministic reading.'),
        source: 'Crucible offline (Cursor unavailable)',
        passesCompleted: 0,
        quota
      });
    }

    const created = (await createRes.json()) as { agent?: { id?: string }; run?: { id?: string } };
    const agentId = created.agent?.id;
    const runId = created.run?.id;
    if (!agentId || !runId) {
      return Response.json({
        expandedText: expandOffline(req),
        source: 'Crucible offline',
        passesCompleted: 0,
        quota
      });
    }

    let text = await waitForRun(cursorKey, agentId, runId, 45000);

    const pass2 = `Pass 2 — translate into lived impact on mood, people, travel, finance, and tech for this domain. 250–350 words.`;
    const followRes = await fetch(`https://api.cursor.com/v1/agents/${agentId}/runs`, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: { text: pass2 } })
    });
    if (followRes.ok) {
      const follow = (await followRes.json()) as { run?: { id?: string } };
      if (follow.run?.id) {
        text = (await waitForRun(cursorKey, agentId, follow.run.id, 45000)) || text;
      }
    }

    return Response.json({
      expandedText: text || expandOffline(req),
      source: 'Cursor Cloud Agent (2-pass via Pages)',
      passesCompleted: 2,
      quota
    });
  } catch (err: any) {
    return Response.json({ error: err.message || 'Deep reading failed' }, { status: 500 });
  }
}
