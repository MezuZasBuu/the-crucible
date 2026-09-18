/**
 * Cloudflare Pages Function — research synthesize
 */

import { tgoldBlockForMode } from '../../_shared/tgoldPrompt';

export async function onRequestPost(context: { request: Request; env: { GEMINI_API_KEY?: string } }) {
  try {
    const body = await context.request.json() as {
      name?: string;
      date?: string;
      reason?: string;
      context?: any;
    };
    const { name, date, reason, context: calc } = body;
    const apiKey = context.env.GEMINI_API_KEY;

    if (apiKey) {
      const systemInstruction = `${tgoldBlockForMode('research-dossier')}

You are the Scholarly Research Archivist of The Crucible. Provide etymology, gematria, and field overlay as comparative analogy—not destiny. End with Investigation Hooks and Intelligence Gaps.`;
      const prompt = `Research Dossier for "${name || 'Querent'}" on ${date || 'current'}. Reason: ${reason || 'natal measurement'}. Gaia: ${calc?.gaiaOvercast?.geomagneticStatus || 'n/a'}. Provide etymology, gematria notes, and field overlay.`;
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.6 }
          })
        }
      );
      if (geminiRes.ok) {
        const data = await geminiRes.json() as any;
        const researchReport = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
        if (researchReport) {
          return Response.json({
            researchReport,
            networkSource: 'Gemini via Cloudflare Pages'
          });
        }
      }
    }

    return Response.json({
      researchReport: `[Archival Research Dossier for "${name || 'Querent'}"]:
Linguistic and calendrical cross-reference under The Crucible offline ledger.
Measured against Gaia's daily overcast proxies, the signature activates bifurcation between Yang manifestation and Yin sanctuary.
(Configure GEMINI_API_KEY on Cloudflare Pages for live research.)`,
      networkSource: 'The Crucible Archival Research Corpus (Offline)'
    });
  } catch (err: any) {
    return Response.json({ error: err.message || 'Research failure' }, { status: 500 });
  }
};
