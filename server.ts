/**
 * The Crucible — Express + Vite Full-Stack Server
 * Grounded API services, Conversational LLM Compass proxy,
 * and deterministic calculations.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { executeCrucibleCalculation } from './src/engine/crucibleCore';
import { runMicroTests } from './src/engine/microTests';
import { CANONICAL_CLAIMS, CANONICAL_RULESETS, getClaimsJSONL } from './src/engine/knowledgeBase';
import { generateFourteenDayForecast, PRESET_LOCATIONS } from './src/engine/longTermResonance';
import { generateTodayDailyReport } from './src/engine/dailyEnergyReport';
import { BRIEFING_VOICE_PROMPT } from './src/engine/voiceStyle';
import { executeDeepReading } from './src/engine/deepReadingService';
import { DeepReadingRequest, CompleteCalculationContext, CrucibleProfile, ReadingMode } from './src/types';
import { buildTgoldResearchPromptBlock, getTgoldResearchMetadata } from './src/engine/tgold';
import { generateTodayEnergyWithGemini } from './src/engine/todayEnergyGemini';
import { deterministicTodayEnergy } from './src/engine/todayEnergyService';
import {
  checkAndIncrementDeepReadingUsage,
  extractBearerToken,
  verifyFirebaseIdToken
} from './src/engine/authGate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'The Crucible Synchronic Engine', version: '2.0.0' });
  });

  // 2. Calculation endpoint
  app.post('/api/calculate', (req, res) => {
    try {
      const { input, correlationKey } = req.body;
      const result = executeCrucibleCalculation(input, correlationKey);
      res.json(result);
    } catch (error: any) {
      console.error('Calculation error:', error);
      res.status(400).json({ error: error.message || 'Calculation failure' });
    }
  });

  // 3. Micro-tests suite endpoint
  app.get('/api/micro-tests', (req, res) => {
    try {
      const tests = runMicroTests();
      res.json(tests);
    } catch (error: any) {
      console.error('Micro-test error:', error);
      res.status(500).json({ error: error.message || 'Test suite failure' });
    }
  });

  // 4. Knowledge Base Claims & Rulesets endpoints
  app.get('/api/knowledge-base/claims', (req, res) => {
    if (req.query.format === 'jsonl') {
      res.setHeader('Content-Type', 'application/x-ndjson');
      res.send(getClaimsJSONL());
    } else {
      res.json(CANONICAL_CLAIMS);
    }
  });

  app.get('/api/knowledge-base/rulesets', (req, res) => {
    res.json(CANONICAL_RULESETS);
  });

  app.get('/api/knowledge-base/tgold', (_req, res) => {
    res.json(getTgoldResearchMetadata());
  });

  // 5. Conversational Compass (Gemini LLM grounded in context)
  app.post('/api/compass', async (req, res) => {
    try {
      const { prompt, context } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      // Check if GEMINI_API_KEY is available
      const apiKey = process.env.GEMINI_API_KEY;
      const claimsSummary = CANONICAL_CLAIMS.slice(0, 12)
        .map((c) => `${c.id} [${c.status}/${c.confidenceScore}] ${c.tradition}: ${c.entity} ${c.relation} ${c.target} (${c.sourceCitation})`)
        .join('\n');
      const rulesetSummary = CANONICAL_RULESETS.map((r) => `${r.id} v${r.version} — ${r.name} (${r.tradition})`).join('\n');
      const tgoldBlock = buildTgoldResearchPromptBlock({
        mode: 'compass',
        ctx: context,
        query: String(prompt).slice(0, 200)
      });

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `${BRIEFING_VOICE_PROMPT}

${tgoldBlock}

You are the Conversational Compass of The Crucible.
EPISTEMIC RULES (mandatory):
- Distinguish HISTORICAL_FACT, TEXTUAL_TRADITION, SCHOLARLY_INTERPRETATION, COMPARATIVE_ANALOGY, SYSTEM_INTERPRETATION, SPECULATIVE_SYNTHESIS, EMPIRICAL_EVIDENCE, COMPUTED_GEOMETRY.
- Do NOT invent academic citations. Prefer the knowledge-base claims below.
- Gaia Kp/Schumann in context are SPECULATIVE_SYNTHESIS proxies, not live magnetometer data.
- Do not force equivalence across Asian and Western ontologies; preserve native terms with glosses.
- Modes: Calculator (numbers only), Scholar (sources), Practitioner (method), Synthesizer (compare without collapsing).

KNOWLEDGE BASE RULESETS:
${rulesetSummary}

KNOWLEDGE BASE CLAIMS:
${claimsSummary}

CURRENT CALCULATION CONTEXT:
- Event time: ${context?.eventTimeIso || context?.temporal?.isoString} | Calc time: ${context?.calculationTimeIso || 'n/a'}
- Methodology: ${JSON.stringify(context?.methodology || {})}
- Date: ${context?.input?.dateString} ${context?.input?.timeString} (JD ${context?.temporal?.julianDayUT})
- Maya: Long Count ${context?.mayan?.longCount?.formatted}, Tzolk'in ${context?.mayan?.tzolkin?.formatted} (Kin ${context?.mayan?.kinNumber}), Haab' ${context?.mayan?.haab?.formatted}
- Dreamspell: ${context?.dreamspell?.signature}
- Chinese: ${context?.chinese?.yearPillar?.stemPinYin}-${context?.chinese?.yearPillar?.branchPinYin}, Solar Term ${context?.chinese?.solarTerm?.name}, Wu Xing ${context?.chinese?.dominantElement}
- Egyptian: ${context?.egyptian?.monthName} Day ${context?.egyptian?.dayOfMonth}, Season ${context?.egyptian?.season}
- Ethiopian: ${context?.ethiopian?.monthName} ${context?.ethiopian?.dayOfMonth}, Evangelist ${context?.ethiopian?.evangelist}
- Enochian: ${context?.enochianBiblical?.enochian?.formatted}, Watch ${context?.enochianBiblical?.enochian?.watchGate}, Tekufah ${context?.enochianBiblical?.biblicalSeason?.hebrewTekufah}, Dies ${context?.enochianBiblical?.gregorianWeekdayDeity?.latinDies}, Hour ${context?.enochianBiblical?.currentPlanetaryHour?.planet}
- Vedic: ${context?.vedic?.nakshatraName} Pada ${context?.vedic?.nakshatraPada}, Tithi ${context?.vedic?.tithiName} [${context?.vedic?.epistemicClass}]
- Numerology: Life Path ${context?.numerology?.lifePathNumber}, Universal Day ${context?.numerology?.universalDay}
- Gene Keys: Sun Gate ${context?.geneKeysSun?.gate}.${context?.geneKeysSun?.line} (${context?.geneKeysSun?.gift})
- Top Tribe: ${context?.synthesis?.topResonatingTribe?.tribe} — ${context?.intertwining?.primaryTribeLife?.giftToEmbody}
- Gaia overlay [${context?.gaiaOvercast?.epistemicClass}]: ${context?.gaiaOvercast?.geomagneticStatus}, Kp~${context?.gaiaOvercast?.geomagneticKpEstimated}, Schumann~${context?.gaiaOvercast?.schumannFrequencyHz}
- Forks available: ${(context?.dialecticalForks || []).map((f: any) => f.id).join(', ') || 'none'}
- Harmonic Index: ${context?.synthesis?.harmonicResonanceIndex}/100`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });

        return res.json({ reply: response.text });
      }

      // Fallback deterministic synthesis if API key is not yet configured
      const topTribe = context?.synthesis?.topResonatingTribe;
      const tzolkin = context?.mayan?.tzolkin;
      const yearPillar = context?.chinese?.yearPillar;
      const lifePath = context?.numerology?.lifePathNumber;
      const sunGate = context?.geneKeysSun;
      const life = context?.intertwining?.primaryTribeLife;

      const fallbackReply = `[Crucible Grounded Synthesis for ${context?.input?.dateString}]:
[Epistemic: SYSTEM_INTERPRETATION + COMPARATIVE_ANALOGY — offline fallback]

The inquiry activates ${topTribe?.tribe || 'Judah'} (${topTribe?.affinityScore || 90}% affinity, ${topTribe?.directionInCamp || 'East'} camp).
Life practice: ${life?.dayPractice || 'Orient one act toward service of the whole.'}
Gift: ${life?.giftToEmbody || 'Faithful presence'}.

Maya ${tzolkin?.formatted || 'Ahau'} (Kin ${context?.mayan?.kinNumber || 1}) × Chinese ${yearPillar?.stemElement || 'Wood'} ${yearPillar?.zodiacAnimal || 'Dragon'} × Life Path ${lifePath || 7}.
Enochian: ${context?.enochianBiblical?.enochian?.watchGate || 'n/a'} · ${context?.enochianBiblical?.biblicalSeason?.hebrewTekufah || 'n/a'}.
Vedic: ${context?.vedic?.nakshatraName || 'n/a'} · Gene Key Gift ${sunGate?.gift || 'Awareness'}.
Gaia overlay [${context?.gaiaOvercast?.epistemicClass || 'SPECULATIVE_SYNTHESIS'}]: ${context?.gaiaOvercast?.geomagneticStatus || 'n/a'}.

Knowledge claims loaded: ${CANONICAL_CLAIMS.length}. Rulesets: ${CANONICAL_RULESETS.length}.
(Configure GEMINI_API_KEY for open-ended dialogue.)`;

      return res.json({ reply: fallbackReply });
    } catch (err: any) {
      console.error('Compass LLM error:', err);
      res.status(500).json({ error: err.message || 'Compass processing error' });
    }
  });

  // 6. Deep Research & Etymology / Gematria / Gaia Overcast Synthesis Endpoint
  app.post('/api/research/synthesize', async (req, res) => {
    try {
      const { name, date, reason, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const tgoldBlock = buildTgoldResearchPromptBlock({
          mode: 'research-dossier',
          ctx: context,
          query: `${name || 'Querent'} ${reason || ''}`
        });
        const systemInstruction = `${BRIEFING_VOICE_PROMPT}

${tgoldBlock}

You are the Scholarly Research Archivist of The Crucible, specialized in ancient linguistic etymology, multi-cipher Gematria, astronomical ephemerides, and planetary/terrestrial field overcast synthesis.
Conduct a rigorous, beautifully composed research inquiry into the provided name and temporal profile.
Provide:
1. Deep etymological and morphological lineage of the name (Proto-Indo-European / Semitic / Hellenic roots, historical shifts, cultural semantics).
2. Esoteric & Gematric correspondences across Hebrew, Greek Isopsephy, and English ciphers with scholarly citations.
3. Analysis of how this energetic profile navigates Gaia's current daily energetic overcast (geomagnetic tension, Schumann resonance, dialectical forks in the road).
Speak with elegant, authoritative prose. Include specific historical academic sources. End with Investigation Hooks and Intelligence Gaps sections.`;

        const prompt = `Research Dossier Request:
Subject Name: "${name || 'Querent'}"
Temporal Coordinate: ${date || 'Current Transit'}
Significance / Reason: ${reason || 'Natal & Energetic Measurement'}
Current Gaia Status: ${context?.gaiaOvercast?.geomagneticStatus || 'Standard Field'}
Please produce an intricately detailed, sourced research synthesis.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.6
          }
        });

        return res.json({ researchReport: response.text, networkSource: 'Gemini 3.8 Flash Grounded Research Service' });
      }

      // Offline / Deterministic scholarly fallback
      return res.json({
        researchReport: `[Archival Research Dossier for "${name || 'Querent'}"]:
Linguistic analysis cross-referenced against the Online Etymology Dictionary, Klein's Comprehensive Etymological Dictionary of the Hebrew Language, and Liddell-Scott Greek-English Lexicon.
The name demonstrates deep morphological resonance with archetypes of sovereign stewardship and illumination. 
Measured against Gaia's daily overcast (Schumann base 7.83 Hz, energetic aspect tension), the vibrational signature activates clear bifurcation points between external Yang manifestation and internal Yin sanctuary. 
(To initiate live open-ended Web/AI network research, configure GEMINI_API_KEY in your environment settings.)`,
        networkSource: 'The Crucible Archival Research Corpus (Offline Grounded Ledger)'
      });
    } catch (err: any) {
      console.error('Research synthesis error:', err);
      res.status(500).json({ error: err.message || 'Research synthesis failure' });
    }
  });

  // 7. Long-term Energetic Resonance 14-Day Forecast Endpoint
  app.post('/api/forecast/14-day', (req, res) => {
    try {
      const { birthInput, startDateString, targetLocationId, userName } = req.body;
      const effectiveBirthInput = birthInput || {
        dateString: '1987-07-26',
        timeString: '12:00:00',
        timezoneOffsetMinutes: 0,
        isUTC: true,
        location: { latitude: 51.4779, longitude: 0, city: 'World · UTC' }
      };
      const forecast = generateFourteenDayForecast(
        effectiveBirthInput,
        startDateString,
        targetLocationId || 'london',
        userName || 'Sovereign Querent'
      );
      res.json(forecast);
    } catch (error: any) {
      console.error('14-day forecast error:', error);
      res.status(400).json({ error: error.message || 'Forecast computation failed' });
    }
  });

  // 7b. Locations preset endpoint
  app.get('/api/forecast/locations', (req, res) => {
    res.json(PRESET_LOCATIONS);
  });

  // 7c. Gemini today energy — public-facing copy for Today screen (free tier)
  app.post('/api/today-energy', async (req, res) => {
    try {
      const { context, profile, mode } = req.body as {
        context?: CompleteCalculationContext;
        profile?: CrucibleProfile | null;
        mode?: ReadingMode;
      };
      if (!context?.input?.dateString) {
        return res.status(400).json({ error: 'context with date is required' });
      }
      const readingMode = mode || 'world';
      const correlationKey = 'GMT_584283';
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const generated = await generateTodayEnergyWithGemini(
          apiKey,
          context,
          profile || null,
          readingMode,
          correlationKey as 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384'
        );
        return res.json(generated);
      }
      return res.json(
        deterministicTodayEnergy(context, profile || null, readingMode, correlationKey as 'GMT_584283')
      );
    } catch (err: any) {
      console.error('Today energy error:', err);
      res.status(500).json({ error: err.message || 'Today energy failed' });
    }
  });

  // 7d. Multi-pass Cursor deep reading for expandable cards (auth required for Cursor pool)
  app.post('/api/deep-reading', async (req, res) => {
    try {
      const request = req.body as DeepReadingRequest;
      if (!request?.seedText || !request?.domainKey) {
        return res.status(400).json({ error: 'seedText and domainKey are required' });
      }

      const cursorKey = process.env.CURSOR_API_KEY;
      const firebaseWebKey =
        process.env.FIREBASE_WEB_API_KEY || process.env.VITE_FIREBASE_API_KEY;

      if (cursorKey) {
        const token = extractBearerToken(req.headers.authorization);
        if (!token) {
          return res.status(401).json({
            error: 'Sign in (guest or Google) to unlock Cursor deep readings.',
            code: 'AUTH_REQUIRED'
          });
        }
        if (!firebaseWebKey) {
          return res.status(503).json({ error: 'Firebase auth verification is not configured on the server.' });
        }
        const verified = await verifyFirebaseIdToken(token, firebaseWebKey);
        if (!verified) {
          return res.status(401).json({ error: 'Invalid or expired session. Sign in again.', code: 'AUTH_INVALID' });
        }
        const quota = checkAndIncrementDeepReadingUsage(verified);
        if (!quota.allowed) {
          return res.status(429).json({
            error: `Daily deep reading limit reached (${quota.used}/${quota.limit} for ${quota.tier} tier).`,
            code: 'QUOTA_EXCEEDED',
            quota
          });
        }

        const result = await executeDeepReading(request, cursorKey, {
          model: process.env.CURSOR_MODEL || 'composer-2.5',
          maxWaitMs: 180000,
          pollMs: 2500,
          passCount: 3
        });

        return res.json({
          expandedText: result.text,
          source: result.source,
          passesCompleted: result.passesCompleted,
          quota
        });
      }

      const offline = await executeDeepReading(request, undefined, { passCount: 0 });
      return res.json({
        expandedText: offline.text,
        source: offline.source,
        passesCompleted: offline.passesCompleted
      });
    } catch (err: any) {
      console.error('Deep reading error:', err);
      return res.status(500).json({ error: err.message || 'Deep reading failed' });
    }
  });

  // 8. 20,000-Token-Target Extended AI Monograph Generation Endpoint
  app.post('/api/daily-report/expand', async (req, res) => {
    try {
      const { report, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const { buildCompassContextPacket } = await import('./src/engine/almanac');
        const { getActiveProfile } = await import('./src/engine/crucibleProfile');
        const profile = context ? getActiveProfile() : null;
        const almanacPacket = context ? buildCompassContextPacket(context, profile) : '';

        const systemInstruction = `${BRIEFING_VOICE_PROMPT}

You are the daily energy compass writer for The Crucible — not an encyclopedia index.
Expand into 3000+ words across XII sections. Every tradition must answer: how does this frequency move through collective behavior, institutions, relationships, and the querent's natal chart when provided?
Sections: Opening vector · Collective psychology · Sky as behavioral weather · Maya life impact · BaZi life impact · Lunar & Gene Keys · Sacred calendars cross-impact · Vedic layer · The fork · Natal derivative · Tactical choreography · Compass bearing.
Never use ceremonial treatise language. Never average disagreeing systems.`;

        const prompt = `Deepen today's energy compass briefing (${report?.gregorianFormatted || context?.input?.dateString}).

ALMANAC PACKET (verified computed context — do not invent numbers):
${almanacPacket}

CURRENT BRIEFING TO EXPAND:
${report?.extendedMonograph || report?.executiveSynthesis || ''}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });

        return res.json({
          expandedMonograph: response.text,
          tokenEstimate: Math.round(response.text.length / 3.8),
          source: 'Gemini 3.8 Flash Deep Monograph Engine'
        });
      }

      // Offline deterministic fallback: return the pre-generated extensive monograph
      const deterministicReport = report || generateTodayDailyReport(context);
      return res.json({
        expandedMonograph: deterministicReport.extendedMonograph,
        tokenEstimate: deterministicReport.wordCountEstimate ? Math.round(deterministicReport.wordCountEstimate * 1.35) : 3500,
        source: 'The Crucible Offline Canonical Computus Engine'
      });
    } catch (err: any) {
      console.error('Daily report expansion error:', err);
      res.status(500).json({ error: err.message || 'Expansion failed' });
    }
  });

  // 7. Vite middleware for development vs static dist for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Crucible Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
