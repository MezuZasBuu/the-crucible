/**
 * Extensive life-impact briefing — expert delivery, full depth (not dumbed down).
 */

import { CompleteCalculationContext, CrucibleProfile } from '../types';
import { BriefingInputs, buildExecutiveBriefing } from './dailyEnergyBriefing';
import {
  almanacAspectMeaning,
  compileAlmanacEntries,
  compileNatalDerivative,
  AlmanacEntry
} from './almanac';
import { BRIEFING_VOICE_PROMPT } from './voiceStyle';

function section(title: string, body: string): string {
  return `\n---\n\n## ${title}\n\n${body.trim()}`;
}

function renderAlmanacBlock(entries: AlmanacEntry[]): string {
  return entries
    .map(
      (e) =>
        `**${e.tradition}** — ${e.dataPoint} [${e.epistemic}]\n\nCollective field: ${e.collectiveImpact}\n\nIndividual frequency: ${e.individualImpact}\n\nPractical cue: ${e.behavioralCue}`
    )
    .join('\n\n');
}

function skyBehaviorSection(ctx: CompleteCalculationContext, b: BriefingInputs): string {
  const sun = ctx.celestialBodies.find((x) => x.id === 'sun');
  const moon = ctx.celestialBodies.find((x) => x.id === 'moon');
  const merc = ctx.celestialBodies.find((x) => x.id === 'mercury');
  const mars = ctx.celestialBodies.find((x) => x.id === 'mars');
  const sat = ctx.celestialBodies.find((x) => x.id === 'saturn');

  const aspectLines = b.activeAspects.slice(0, 6).map(
    (a) =>
      `• ${a.body1} ${a.aspect} ${a.body2} (${a.orb}°, ${a.nature}) — ${almanacAspectMeaning(a.body1, a.body2, a.aspect, a.nature)}`
  );

  const retro =
    b.retrogradeBodies[0] === 'None (All Major Celestial Spheres Direct)'
      ? 'All major bodies direct — outward execution is structurally supported if inner alignment exists.'
      : `Retrograde: ${b.retrogradeBodies.join(', ')}. Collectively this favors review cycles, delayed announcements, and revision of contracts. Individually: do not interpret slowness as failure — re-enter unfinished business before launching new fronts.`;

  return `Sun ${sun?.zodiacSign} ${sun?.signDegree.toFixed(2)}° — collective ego-tone, visibility, and "what we're willing to be seen doing." Moon ${moon?.zodiacSign} ${moon?.signDegree.toFixed(2)}° at ${b.lunarIllumPercent}% (${b.lunarPhaseName}): ${b.lunarTone}. This is the emotional weather people absorb without naming it.

${retro}

Mercury ${merc?.isRetrograde ? 'Rx' : 'direct'} in ${merc?.zodiacSign}: discourse, logistics, and nervous-system pacing. Mars ${mars?.zodiacSign}, Saturn ${sat?.zodiacSign}${sat?.isRetrograde ? ' Rx' : ''}: conflict structure and constraint — societies tighten rules when Saturn is emphasized; individuals feel it as duty or oppression depending on alignment.

**Active aspects (behavioral, not fatalistic):**
${aspectLines.join('\n') || '• No major aspects inside tight orb — ambient sky.'}

Field overlay [SPECULATIVE_SYNTHESIS]: Kp ~${b.kpEstimated}, Schumann ${b.schumannHarmonic} Hz, tension ${b.tensionScore}/100. Read as ${b.geomagneticStatus.toLowerCase()} — irritability and sleep disruption scale with geomagnetic noise; this is population-level statistics, not your personal verdict.`;
}

function collectivePsychology(ctx: CompleteCalculationContext, b: BriefingInputs): string {
  const eb = ctx.enochianBiblical;
  return `Universal Day ${b.universalDayNumber} (${b.universalDayVibration}) sets the numerological pulse — how the collective counts and categorizes experience today. Combined with ${eb.gregorianWeekdayDeity.latinDies} / ${eb.gregorianWeekdayDeity.romanDeity}, civil time pushes toward ${eb.gregorianWeekdayDeity.planetaryRuler || eb.gregorianWeekdayDeity.romanDeity} themes in institutions (workweek rhythm, markets, ritual calendars).

Enochian counter-frame: ${eb.enochian.formatted}, watch ${eb.enochian.watchGate}, compass offset ${eb.compassOrientation.headingOffsetDegrees}°. Societies running on civil time and those attending Enochian gates will **feel like different days** — that is the fork, not an error.

Dominant synthesis polarity: ${ctx.synthesis.dominantPolarity}. Wu Xing vector: ${ctx.chinese.dominantElement}. When these agree, collective mood feels "obvious"; when they diverge, you get the edgy days — subcultures pull opposite directions.`;
}

function relationalField(profile: CrucibleProfile | null): string {
  if (!profile) {
    return `No active natal profile — relational read is collective-only. Save a birth chart in PROFILE to derivative-match partners, teams, and transits to **your** wiring.`;
  }
  return `Active profile: **${profile.displayName || profile.querentName}**. All transit and calendar reads below should be cross-checked against this natal baseline — not as destiny, but as resonance map. For multi-person reads, compare charts in Compatibility Atlas; look for where today's tone hits shared gates or opposing elements.`;
}

/** Full extensive briefing — target 2000+ words of structured depth. */
export function buildLifeImpactBriefing(
  ctx: CompleteCalculationContext,
  b: BriefingInputs,
  profile: CrucibleProfile | null = null
): string {
  const entries = compileAlmanacEntries(ctx);
  const natal = compileNatalDerivative(ctx, profile);
  const critical = entries.filter((e) => e.tier === 'CRITICAL');
  const important = entries.filter((e) => e.tier === 'IMPORTANT');
  const relevant = entries.filter((e) => e.tier === 'RELEVANT');
  const vedic = ctx.vedic;
  const eb = ctx.enochianBiblical;
  const strat = b;

  const chapters = [
    `THE CRUCIBLE — ENERGY COMPASS\n${b.gregorianFormatted} · ${b.timeStr} UT · JD ${ctx.temporal.julianDayUT.toFixed(4)}\n${b.dominantTone}\n\n${BRIEFING_VOICE_PROMPT.split('\n').slice(0, 3).join('\n')}`,
    section('I. Opening vector', buildExecutiveBriefing(ctx, b)),
    section('II. Collective psychology & civil time', collectivePsychology(ctx, b)),
    section('III. Sky as behavioral weather', skyBehaviorSection(ctx, b)),
    section('IV. Maya — how today moves through people', renderAlmanacBlock(critical.filter((e) => e.tradition.includes('Maya')))),
    section('V. Chinese sexagenary — how qi lands in bodies and markets', renderAlmanacBlock(critical.filter((e) => e.tradition.includes('BaZi')))),
    section('VI. Lunar & Gene Keys frequency', renderAlmanacBlock([...important, ...relevant])),
    section('VII. Sacred calendars cross-impact', `Long Count ${ctx.mayan.longCount.formatted} — macro mythic container; most people won't name it, but "late-cycle" psychology (institutional fatigue, desire for reset) tracks these larger gears.

Haab' ${ctx.mayan.haab.formatted}: seasonal ritual timing — communities with agricultural or liturgical memory feel this in appetite for feast or fast.

Egyptian ${ctx.egyptian.monthName} day ${ctx.egyptian.dayOfMonth} (${ctx.egyptian.season}): season affect — collective focus on ${ctx.egyptian.season.includes('Akhet') ? 'inundation and possibility' : ctx.egyptian.season.includes('Peret') ? 'growth and emergence' : 'harvest and accounting'}.

Ge'ez ${ctx.ethiopian.monthName} ${ctx.ethiopian.dayOfMonth}: liturgical rhythm for Ethiopian communities; globally, a reminder that "today" is not one story.

Attic ${ctx.greek.atticMonthName} ${ctx.greek.atticDay}, Olympiad ${ctx.greek.olympiadNumber}.${ctx.greek.olympiadYear}: Hellenic civic time — debate, competition, public virtue narratives.

**How to use this stack:** Don't average. Notice which calendar your environment actually runs on (payroll, liturgy, social media cycle) and let the others be secondary lenses.`),
    section('VIII. Vedic sidereal layer', vedic
      ? `${vedic.nakshatraName} pada ${vedic.nakshatraPada} — collective mood picks up ${vedic.nakshatraName} shakti: emotional contagion through mythic images tied to this lunar mansion. Tithi ${vedic.tithiName}: ritual eligibility and appetite; yoga ${vedic.yogaName}: subtle bias toward union or severance themes.

Sidereal Sun ${vedic.siderealSunDeg.toFixed(1)}°, Moon ${vedic.siderealMoonDeg.toFixed(1)}° (Lahiri ${vedic.lahiriAyanamshaDeg.toFixed(2)}°). For practitioners: muhurta-sensitive work should reference this layer; for others: treat as parallel sky, not correction of tropical.`
      : 'Vedic layer disabled in methodology — enable in temporal settings for nakshatra/tithi behavioral read.'),
    section('IX. The fork — do not collapse', `${strat.forkTitle}\n\n**Path A (push / manifest):** ${strat.choiceA}\n[Civil peek] ${strat.peekA}\n\n**Path B (hold / gather):** ${strat.choiceB}\n[Enochian peek] ${strat.peekB}\n\n**Synthetic third:** ${strat.syntheticResolution}\n\nTriangulation: ${strat.triangulation}\n\nIn lived terms: teams split when half the room runs A and half runs B. Name the fork in meetings. Couples argue when partners unconsciously choose opposite paths.`),
    section('X. Natal derivative — your chart in today\'s field', natal.hasNatal ? natal.paragraph : relationalField(profile)),
    section('XI. Tactical choreography', `**Peak window:** ${strat.peakPowerWindow}\nPlanetary hour ${eb.currentPlanetaryHour.planet} (${eb.currentPlanetaryHour.formattedWindow}) — schedule ${eb.currentPlanetaryHour.planet === 'Saturn' ? 'structure, boundaries, serious talk' : eb.currentPlanetaryHour.planet === 'Jupiter' ? 'expansion, teaching, risk-aware growth' : eb.currentPlanetaryHour.planet === 'Mars' ? 'decisive action, avoid petty conflict' : eb.currentPlanetaryHour.planet === 'Venus' ? 'relationship repair, aesthetics, negotiation' : eb.currentPlanetaryHour.planet === 'Mercury' ? 'writing, logistics, messages' : eb.currentPlanetaryHour.planet === 'Moon' ? 'care, rest, domestic work' : 'visibility and leadership'} here if you can.

**Harness:**
${strat.whatToHarness.map((x) => `• ${x}`).join('\n')}

**Avoid:**
${strat.whatToAvoid.map((x) => `• ${x}`).join('\n')}`),
    section('XII. Bottom line — compass bearing', `${strat.goldenThread}\n\nToday is not an index entry. It is a frequency you move through — collectively whether you consent or not, individually by how you align habit, speech, and attention. Return tonight and note what matched; that feedback tunes your chart sense.`)
  ];

  return chapters.join('\n');
}

export function estimateBriefingWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
