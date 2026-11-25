/**
 * Cloudflare Pages Function — Conversational Compass
 * Offline grounded synthesis when GEMINI_API_KEY is unset.
 */

import { tgoldBlockForMode } from '../_shared/tgoldPrompt';

export async function onRequestPost(context: { request: Request; env: { GEMINI_API_KEY?: string } }) {
  try {
    const body = await context.request.json() as { prompt?: string; context?: any };
    const { prompt, context: calc } = body;
    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = context.env.GEMINI_API_KEY;
    if (apiKey) {
      const systemInstruction = `${tgoldBlockForMode('compass')}

You answer questions about today for The Crucible. Write for someone new to astrology: everyday words, short sentences, explain any specialist term in a few words. Say what is measured (astronomy, calendar dates) and what is tradition (“traditionally…”). Do not predict events, invent citations, or give medical, legal or financial advice. Geomagnetic and Schumann figures are rough estimates, not measurements.
Date: ${calc?.input?.dateString} ${calc?.input?.timeString}
Maya: ${calc?.mayan?.tzolkin?.formatted} Kin ${calc?.mayan?.kinNumber}
Chinese: ${calc?.chinese?.yearPillar?.stemPinYin}-${calc?.chinese?.yearPillar?.branchPinYin}
Calling: ${calc?.synthesis?.topCalling?.calling}
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

    const topCalling = calc?.synthesis?.topCalling;
    const tzolkin = calc?.mayan?.tzolkin;
    const yearPillar = calc?.chinese?.yearPillar;
    const life = calc?.intertwining?.primaryCallingLife;
    const reply = [
      `Here is what the calendars say for ${calc?.input?.dateString}:`,
      '',
      `• Today’s calling is ${topCalling?.calling || 'The Trailblazer'} (“${topCalling?.motto || 'Go first'}”). Something to try: ${life?.dayPractice || 'Point one action toward the good of the whole.'}`,
      `• Maya day sign: ${tzolkin?.formatted || 'n/a'}${tzolkin?.meaning ? ` — ${tzolkin.meaning}` : ''}.`,
      `• Chinese calendar year: ${yearPillar?.stemElement || ''} ${yearPillar?.zodiacAnimal || ''}.`,
      `• Number of the day: ${calc?.numerology?.universalDay ?? 'n/a'}.`,
      '',
      'This is a summary of today’s calculations. Written answers to free-form questions are not switched on for this site yet.'
    ].join('\n');

    return Response.json({ reply });
  } catch (err: any) {
    return Response.json({ error: err.message || 'Compass error' }, { status: 500 });
  }
};
