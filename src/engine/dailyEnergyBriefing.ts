/**
 * Conversational expert briefing copy for Daily Energy Report
 */

import { CompleteCalculationContext } from '../types';

export interface BriefingInputs {
  gregorianFormatted: string;
  timeStr: string;
  universalDayNumber: number;
  universalDayVibration: string;
  dominantTone: string;
  kpEstimated: number;
  schumannHarmonic: number;
  tensionScore: number;
  geomagneticStatus: string;
  lunarIllumPercent: number;
  lunarPhaseName: string;
  lunarTone: string;
  retrogradeBodies: string[];
  activeAspects: Array<{ body1: string; body2: string; aspect: string; orb: number; nature: string }>;
  forkTitle: string;
  choiceA: string;
  choiceB: string;
  syntheticResolution: string;
  goldenThread: string;
  peakPowerWindow: string;
  whatToHarness: string[];
  whatToAvoid: string[];
  peekA: string;
  peekB: string;
  triangulation: string;
}

function aspectBrief(
  aspects: BriefingInputs['activeAspects'],
  retrogrades: string[]
): string {
  const tense = aspects.filter((a) => a.nature === 'Dynamic Tension').slice(0, 3);
  const easy = aspects.filter((a) => a.nature === 'Harmonious').slice(0, 3);
  const parts: string[] = [];
  if (tense.length) {
    parts.push(
      `The sharper geometry is ${tense.map((a) => `${a.body1} ${a.aspect.split(' ')[0]} ${a.body2} (${a.orb}°)`).join('; ')} — useful friction, not noise.`
    );
  }
  if (easy.length) {
    parts.push(
      `There's also clean flow: ${easy.map((a) => `${a.body1}–${a.body2}`).join(', ')}.`
    );
  }
  if (retrogrades.length && retrogrades[0] !== 'None (All Major Celestial Spheres Direct)') {
    parts.push(`Retrograde: ${retrogrades.join(', ')} — build/review before you broadcast.`);
  }
  return parts.join(' ');
}

export function buildExecutiveBriefing(ctx: CompleteCalculationContext, b: BriefingInputs): string {
  const eb = ctx.enochianBiblical;
  const tz = ctx.mayan.tzolkin;
  const day = ctx.chinese.dayPillar;
  const tribe = ctx.intertwining.primaryTribeLife;
  const gk = ctx.geneKeysSun;

  return `Look — for ${b.gregorianFormatted} we're on Universal ${b.universalDayNumber} (${b.universalDayVibration}) with Kin ${ctx.mayan.kinNumber} (${tz.formatted}, Tone ${ctx.mayan.galacticTone.number} ${ctx.mayan.galacticTone.name}). BaZi day pillar is ${day.stemPinYin}-${day.branchPinYin} (${day.stemElement} ${day.zodiacAnimal}).

Field overlay [speculative]: Kp ~${b.kpEstimated}, Schumann ${b.schumannHarmonic} Hz, tension score ${b.tensionScore}/100 — read as ${b.geomagneticStatus.toLowerCase()}, not catastrophe. Moon at ${b.lunarIllumPercent}% (${b.lunarPhaseName}): ${b.lunarIllumPercent < 8 ? 'underground New Moon vibe — setup beats announcement' : 'more visible lunar phase — expression is fair game'}.

Enochian layer: ${eb.enochian.formatted}, ${eb.biblicalSeason.hebrewTekufah}. Civil clock: ${eb.gregorianWeekdayDeity.latinDies} / ${eb.gregorianWeekdayDeity.romanDeity}; planetary hour ${eb.currentPlanetaryHour.planet} (${eb.currentPlanetaryHour.formattedWindow}).

Tribe lens [comparative analogy]: ${tribe.tribe} — ${tribe.giftToEmbody}. Gate ${gk.gate}.${gk.line}: ${gk.shadow} → ${gk.gift}. Today's move: ${tribe.dayPractice}`;
}

export function buildStrategicBriefing(b: BriefingInputs): {
  goldenThread: string;
  whatToHarness: string[];
  whatToAvoid: string[];
  peakPowerWindow: string;
  dialecticalFork: { title: string; choiceA: string; choiceB: string; syntheticResolution: string };
} {
  return {
    goldenThread: b.goldenThread.replace(/^Unify the/, 'Thread today: unify the').replace(/—/g, ' —'),
    whatToHarness: b.whatToHarness.map((h) => h.replace(/^Harness the archetype of/, 'Use').replace(/^Direct the/, 'Channel')),
    whatToAvoid: b.whatToAvoid.map((a) => a.replace(/^Avoid impetuous/, "Don't get reactive").replace(/^Do not surrender/, "Watch for")),
    peakPowerWindow: `Best window: ${b.peakPowerWindow}`,
    dialecticalFork: {
      title: b.forkTitle,
      choiceA: `${b.choiceA}\n\n[Civil / Peek A] ${b.peekA}`,
      choiceB: `${b.choiceB}\n\n[Enochian / Peek B] ${b.peekB}`,
      syntheticResolution: `${b.syntheticResolution}\n\n[Triangulation] ${b.triangulation}`
    }
  };
}

export function buildExtendedBriefing(ctx: CompleteCalculationContext, b: BriefingInputs): string {
  const sun = ctx.celestialBodies.find((x) => x.id === 'sun');
  const moon = ctx.celestialBodies.find((x) => x.id === 'moon');
  const merc = ctx.celestialBodies.find((x) => x.id === 'mercury');
  const sat = ctx.celestialBodies.find((x) => x.id === 'saturn');
  const eb = ctx.enochianBiblical;
  const vedic = ctx.vedic;
  const top = ctx.synthesis.topResonatingTribe;

  const sky = aspectBrief(b.activeAspects, b.retrogradeBodies);

  return `THE CRUCIBLE — DAILY BRIEFING
${b.gregorianFormatted} · ${b.timeStr} UT · JD ${ctx.temporal.julianDayUT.toFixed(4)}
${b.dominantTone}

---

OPENING

${buildExecutiveBriefing(ctx, b)}

---

FIELD & MOON

Kp ${b.kpEstimated}, Schumann ${b.schumannHarmonic} Hz, tension ${b.tensionScore}/100. Within this framework that's ${b.geomagneticStatus.toLowerCase()} — creative pressure you can work with if you don't treat it like weather prophecy.

Sun ${sun?.zodiacSign ?? '—'} ${sun?.signDegree.toFixed(2) ?? '—'}°, Moon ${moon?.zodiacSign ?? '—'} ${moon?.signDegree.toFixed(2) ?? '—'}° (${moon?.isRetrograde ? 'Rx' : 'direct'}), ${b.lunarIllumPercent}% lit. ${sky}

---

CALENDARS (quick cross-read)

Maya: LC ${ctx.mayan.longCount.formatted} · ${ctx.mayan.tzolkin.formatted} · Haab' ${ctx.mayan.haab.formatted}
Chinese: day ${ctx.chinese.dayPillar.stemPinYin}-${ctx.chinese.dayPillar.branchPinYin} · month ${ctx.chinese.monthPillar.stemPinYin}-${ctx.chinese.monthPillar.branchPinYin} · year ${ctx.chinese.yearPillar.stemPinYin}-${ctx.chinese.yearPillar.branchPinYin} · ${ctx.chinese.solarTerm.name}
Egyptian: ${ctx.egyptian.monthName} ${ctx.egyptian.dayOfMonth} (${ctx.egyptian.season}) · Ge'ez ${ctx.ethiopian.monthName} ${ctx.ethiopian.dayOfMonth}
Attic: ${ctx.greek.atticMonthName} ${ctx.greek.atticDay} · Olympiad ${ctx.greek.olympiadNumber}.${ctx.greek.olympiadYear}

What's interesting: ${ctx.mayan.galacticTone.name} tone wants to dissolve and release; Universal ${b.universalDayNumber} wants expression and bridge-building; ${ctx.chinese.dayPillar.stemElement} day stem adds ${ctx.chinese.dayPillar.stemElement.toLowerCase()} pacing. I wouldn't force one calendar to "win."

---

GENE KEYS & TRIBE

Sun Gate ${ctx.geneKeysSun.gate}.${ctx.geneKeysSun.line} (${ctx.geneKeysSun.name}): ${ctx.geneKeysSun.shadow} → ${ctx.geneKeysSun.gift} → ${ctx.geneKeysSun.siddhi}.
Earth Gate ${ctx.geneKeysEarth.gate}.${ctx.geneKeysEarth.line} grounds the same spectrum.

Tribe alignment [methodology]: ${top.tribe}, ${top.directionInCamp} camp, ${top.gemstone}. ${top.lifeConnotation?.dayPractice || top.resonanceDescription}

---

VEDIC (if you're tracking sidereal)

${vedic ? `${vedic.nakshatraName} pada ${vedic.nakshatraPada} · ${vedic.tithiName} · yoga ${vedic.yogaName}. Sidereal Sun ${vedic.siderealSunDeg.toFixed(1)}°, Moon ${vedic.siderealMoonDeg.toFixed(1)}°. Lahiri ${vedic.lahiriAyanamshaDeg.toFixed(2)}°.` : 'Vedic layer off in methodology.'}

---

THE FORK

${b.forkTitle}

Path A — push / manifest: ${b.choiceA}
[Civil] ${b.peekA}

Path B — hold / gather: ${b.choiceB}
[Enochian] ${b.peekB}

I wouldn't average these. Civil frame: ${eb.gregorianWeekdayDeity.latinDies} under ${eb.gregorianWeekdayDeity.romanDeity}. Enochian frame: ${eb.enochian.watchGate}, compass flipped — ${eb.compassOrientation.headingOffsetDegrees}° with E–W mirror.

Third read: ${b.syntheticResolution}
${b.triangulation}

---

TACTICAL

Peak: ${b.peakPowerWindow}

Do:
${b.whatToHarness.map((x) => `• ${x}`).join('\n')}

Don't:
${b.whatToAvoid.map((x) => `• ${x}`).join('\n')}

---

BOTTOM LINE

${b.goldenThread}

${merc && sat ? `Mercury ${merc.isRetrograde ? 'Rx' : 'direct'} in ${merc.zodiacSign}; Saturn ${sat.isRetrograde ? 'Rx' : 'direct'} in ${sat.zodiacSign} — ${sat.isRetrograde ? 'structure audit beats acceleration' : 'lock forms while communication stays flexible'}.` : ''}`;
}
