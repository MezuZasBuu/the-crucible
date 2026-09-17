/**
 * Cloudflare Pages Function — Conversational Compass
 * Offline grounded synthesis when GEMINI_API_KEY is unset.
 */

export async function onRequestPost(context: { request: Request; env: { GEMINI_API_KEY?: string } }) {
  try {
    const body = await context.request.json() as { prompt?: string; context?: any };
    const { prompt, context: calc } = body;
    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = context.env.GEMINI_API_KEY;
    if (apiKey) {
      const systemInstruction = `You are the Conversational Compass of The Crucible.
Distinguish HISTORICAL_FACT, TEXTUAL_TRADITION, SCHOLARLY_INTERPRETATION, COMPARATIVE_ANALOGY, SYSTEM_INTERPRETATION, SPECULATIVE_SYNTHESIS.
Do NOT invent academic citations. Gaia Kp/Schumann are SPECULATIVE proxies.
Date: ${calc?.input?.dateString} ${calc?.input?.timeString}
Maya: ${calc?.mayan?.tzolkin?.formatted} Kin ${calc?.mayan?.kinNumber}
Chinese: ${calc?.chinese?.yearPillar?.stemPinYin}-${calc?.chinese?.yearPillar?.branchPinYin}
Tribe: ${calc?.synthesis?.topResonatingTribe?.tribe}
Harmonic: ${calc?.synthesis?.harmonicResonanceIndex}/100`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7 }
          })
        }
      );
      if (geminiRes.ok) {
        const data = await geminiRes.json() as any;
        const reply = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
        if (reply) return Response.json({ reply });
      }
    }

    const topTribe = calc?.synthesis?.topResonatingTribe;
    const tzolkin = calc?.mayan?.tzolkin;
    const yearPillar = calc?.chinese?.yearPillar;
    const life = calc?.intertwining?.primaryTribeLife;
    const reply = `[Crucible Grounded Synthesis for ${calc?.input?.dateString}]:
[Epistemic: SYSTEM_INTERPRETATION + COMPARATIVE_ANALOGY — Pages offline fallback]

The inquiry activates ${topTribe?.tribe || 'Judah'} (${topTribe?.affinityScore || 90}% affinity).
Life practice: ${life?.dayPractice || 'Orient one act toward service of the whole.'}
Maya ${tzolkin?.formatted || 'Ahau'} × Chinese ${yearPillar?.zodiacAnimal || 'Dragon'} × Life Path ${calc?.numerology?.lifePathNumber || 7}.
(Configure GEMINI_API_KEY in Cloudflare Pages for open dialogue.)`;

    return Response.json({ reply });
  } catch (err: any) {
    return Response.json({ error: err.message || 'Compass error' }, { status: 500 });
  }
};
