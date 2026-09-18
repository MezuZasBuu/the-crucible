/**
 * Cloudflare Pages Function — Gemini today energy for Today screen.
 */

import { TGOLD_COMPACT_RESEARCH_BLOCK } from '../_shared/tgoldPrompt';

type TodayEnergyBody = {
  context?: {
    input?: { dateString?: string; timeString?: string; location?: { city?: string } };
    calculationId?: string;
    mayan?: { kinNumber?: number; tzolkin?: { formatted?: string }; galacticTone?: { name?: string } };
    chinese?: { dayPillar?: { stemElement?: string; zodiacAnimal?: string }; solarTerm?: { name?: string } };
    gaiaOvercast?: { lunarPhaseName?: string };
    celestialBodies?: Array<{ id?: string; zodiacSign?: string }>;
    geneKeysSun?: { gate?: number; line?: number; gift?: string };
    synthesis?: { topResonatingTribe?: { tribe?: string }; harmonicResonanceIndex?: number };
    dialecticalForks?: Array<{ title?: string }>;
    methodology?: { calendarCorrelation?: string };
  };
  profile?: { displayName?: string; querentName?: string; birth?: { dateString?: string } } | null;
  mode?: string;
};

function fallbackReport(ctx: TodayEnergyBody['context']): string {
  const date = ctx?.input?.dateString || 'today';
  const city = ctx?.input?.location?.city || 'your region';
  return `Today's atmosphere for ${date} over ${city}: the sky and season carry a readable mood — move with patience, name one clear intention, and let small frictions pass without turning them into verdicts.`;
}

export async function onRequestPost(context: { request: Request; env: { GEMINI_API_KEY?: string } }) {
  try {
    const body = (await context.request.json()) as TodayEnergyBody;
    const calc = body.context;
    if (!calc?.input?.dateString) {
      return Response.json({ error: 'context required' }, { status: 400 });
    }

    const apiKey = context.env.GEMINI_API_KEY;
    const digest = [
      `Date ${calc.input.dateString} ${calc.input.timeString || ''} · ${calc.input.location?.city || 'World'}`,
      `Maya ${calc.mayan?.tzolkin?.formatted} Kin ${calc.mayan?.kinNumber}`,
      `Chinese ${calc.chinese?.dayPillar?.stemElement} ${calc.chinese?.dayPillar?.zodiacAnimal}`,
      `Moon ${calc.gaiaOvercast?.lunarPhaseName}`,
      `Harmonic ${calc.synthesis?.harmonicResonanceIndex}/100`
    ].join('\n');

    if (apiKey) {
      const prompt = `${TGOLD_COMPACT_RESEARCH_BLOCK}

Write consumer-facing Today copy. Plain English only — no calendrical jargon. Separate all words with spaces.
Return ONLY JSON:
{"theme":"","summary":"","practice":"","watchFor":"","fullReport":"900+ words with sections","atmospheres":{"emotional":"","social":"","workCreative":""},"domains":{"mood":"","people":"","travel":"","finance":"","tech":"","whyToday":""}}

DATA:
${digest}
Mode: ${body.mode || 'world'}`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.72, maxOutputTokens: 8192, responseMimeType: 'application/json' }
          })
        }
      );
      if (geminiRes.ok) {
        const data = (await geminiRes.json()) as any;
        const raw = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
        const start = raw.indexOf('{');
        const end = raw.lastIndexOf('}');
        if (start >= 0 && end > start) {
          const parsed = JSON.parse(raw.slice(start, end + 1));
          return Response.json({ ...parsed, source: 'gemini' });
        }
      }
    }

    return Response.json({
      theme: 'Read the day before you react',
      summary: fallbackReport(calc),
      practice: 'Name one decision, then act on it before noon.',
      watchFor: 'Urgency that pretends to be clarity.',
      fullReport: fallbackReport(calc),
      atmospheres: {
        emotional: 'Feelings sit closer to the surface than usual.',
        social: 'Conversations carry weight beyond small talk.',
        workCreative: 'One clear commitment beats scattered effort.'
      },
      domains: {
        mood: 'Collective mood favors patience over speed.',
        people: 'Tone is read before logic in negotiations today.',
        travel: 'Check timing twice before departures.',
        finance: 'Money decisions benefit from a second read.',
        tech: 'Verify messages and automation before shipping.',
        whyToday: 'Season, moon, and calendar weather converge on one atmospheric theme.'
      },
      source: 'deterministic'
    });
  } catch (err: any) {
    return Response.json({ error: err.message || 'Today energy failed' }, { status: 500 });
  }
}
