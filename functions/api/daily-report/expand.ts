/**
 * Cloudflare Pages Function — daily report expand (Hypergram-tiered context + life-impact voice)
 */

const BRIEFING_RULES = `THE CRUCIBLE — Expert compass briefing. Preserve all computed data. Explain HOW frequencies affect collective behavior, individual psychology, and natal charts when provided. Never stop at labeling — always land in lived impact. Name forks; do not average traditions. Mark speculative Gaia overlays [SPECULATIVE_SYNTHESIS].`;

export async function onRequestPost(context: { request: Request; env: { GEMINI_API_KEY?: string } }) {
  try {
    const body = await context.request.json() as { report?: any; context?: any; almanacPacket?: string };
    const { report, context: calc, almanacPacket } = body;
    const apiKey = context.env.GEMINI_API_KEY;

    const baseMonograph =
      report?.extendedMonograph ||
      `Energy compass briefing for ${calc?.input?.dateString || 'today'}.`;

    if (apiKey) {
      const prompt = `${BRIEFING_RULES}

Expand this daily energy compass into a full extensive briefing (target 3000+ words). Each tradition section must explain impact on collective mood, institutions, relationships, and the querent's natal derivative when birth data exists.

ALMANAC / COMPUTED CONTEXT:
${almanacPacket || `Maya Kin ${calc?.mayan?.kinNumber} (${calc?.mayan?.tzolkin?.formatted})
Chinese day ${calc?.chinese?.dayPillar?.stemElement} ${calc?.chinese?.dayPillar?.zodiacAnimal}
Gene Keys Sun Gate ${calc?.geneKeysSun?.gate}.${calc?.geneKeysSun?.line}
JD ${calc?.temporal?.julianDayUT}`}

CURRENT BRIEFING TO DEEPEN:
${baseMonograph}`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.65, maxOutputTokens: 8192 }
          })
        }
      );
      if (geminiRes.ok) {
        const data = await geminiRes.json() as any;
        const expandedMonograph = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
        if (expandedMonograph) {
          return Response.json({
            expandedMonograph,
            tokenEstimate: Math.round(expandedMonograph.length / 3.8),
            source: 'Gemini via Cloudflare Pages'
          });
        }
      }
    }

    return Response.json({
      expandedMonograph: baseMonograph,
      tokenEstimate: Math.round(String(baseMonograph).length / 3.8),
      source: 'The Crucible Almanac Engine (offline)'
    });
  } catch (err: any) {
    return Response.json({ error: err.message || 'Expansion failed' }, { status: 500 });
  }
}
