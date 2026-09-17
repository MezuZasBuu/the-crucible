/**
 * The Crucible — Today's Daily Report & Energy of the Day Engine
 * Produces comprehensive, mathematically grounded, novel-like synthesis
 * of the Earth's / Gaia's energetic overcast and celestial transits for today.
 */

import { DailyEnergyReport, CompleteCalculationContext } from '../types';
import { executeCrucibleCalculation } from './crucibleCore';
import { lunarMetricsFromBodies } from './sharedCelestial';
import {
  buildExecutiveBriefing,
  buildStrategicBriefing,
  BriefingInputs
} from './dailyEnergyBriefing';
import { buildLifeImpactBriefing, estimateBriefingWords } from './lifeImpactBriefing';
import { almanacAspectMeaning } from './almanac';
import { getActiveProfile } from './crucibleProfile';
import {
  calculateVedicDetails,
  getSiderealZodiacAndConstellation,
  calculateEclipseStatus,
  MAJOR_ASTEROIDS,
  SOLAR_SYSTEM_MOONS,
  ACTIVE_CONSTELLATIONS,
  PRESET_LOCATIONS
} from './longTermResonance';

/**
 * Generates the full Daily Energy Report for the current calendar day.
 */
export function generateTodayDailyReport(existingContext?: CompleteCalculationContext): DailyEnergyReport {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');
  const timeStr = `${hours}:${mins}:${secs}`;

  // Prefer supplied context (any date) — "today" only when caller omits context
  const ctx: CompleteCalculationContext =
    existingContext ||
    executeCrucibleCalculation({
      dateString: dateStr,
      timeString: timeStr,
      timezoneOffsetMinutes: -now.getTimezoneOffset(),
      isUTC: false,
      location: {
        latitude: 31.778,
        longitude: 35.2354,
        elevationMeters: 740,
        city: 'Universal Meridian Anchor',
        country: 'Terra'
      }
    });

  // Use core Universal Day (single source of truth)
  const universalDayNumber = ctx.numerology.universalDay;
  const universalDayVibration =
    ctx.numerology.numberMeanings[universalDayNumber] ||
    'Dynamic Cosmic Harmonic';

  // Unified Gaia overlay from core (SPECULATIVE_SYNTHESIS — labeled)
  const gaia = ctx.gaiaOvercast;
  const lunarShared = lunarMetricsFromBodies(ctx.celestialBodies);
  const kpEstimated = gaia?.geomagneticKpEstimated ?? 2.5;
  const schumannHarmonic = gaia?.schumannFrequencyHz ?? 7.83;
  const tensionScore = gaia?.aspectTensionScore ?? 42;
  const geomagneticStatus = gaia?.geomagneticStatus ?? 'Quiet / Grounded';
  const lunarIllumPercent = gaia?.lunarIlluminationPercent ?? lunarShared.illuminationPercent;
  const lunarPhaseName = gaia?.lunarPhaseName ?? lunarShared.phaseName;
  const lunarTone = gaia
    ? `[${gaia.epistemicClass}] Field tone under ${lunarPhaseName}`
    : lunarShared.phaseName;

  const moonBody = ctx.celestialBodies.find((b) => b.id === 'moon');
  const sunBody = ctx.celestialBodies.find((b) => b.id === 'sun');

  // 3. Aspects & Celestial Weather
  const activeAspects: Array<{
    body1: string;
    body2: string;
    aspect: string;
    orb: number;
    nature: 'Harmonious' | 'Dynamic Tension' | 'Neutral';
    meaning: string;
  }> = [];

  const bodies = ctx.celestialBodies;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const b1 = bodies[i];
      const b2 = bodies[j];
      const diff = Math.abs(b1.eclipticLongitude - b2.eclipticLongitude);
      const angle = diff > 180 ? 360 - diff : diff;

      // Check standard aspects
      if (Math.abs(angle - 0) <= 6) {
        activeAspects.push({
          body1: b1.name,
          body2: b2.name,
          aspect: 'Conjunction (0°)',
          orb: Math.round(Math.abs(angle) * 10) / 10,
          nature: 'Harmonious',
          meaning: almanacAspectMeaning(b1.name, b2.name, 'Conjunction (0°)', 'Harmonious')
        });
      } else if (Math.abs(angle - 60) <= 4) {
        activeAspects.push({
          body1: b1.name,
          body2: b2.name,
          aspect: 'Sextile (60°)',
          orb: Math.round(Math.abs(angle - 60) * 10) / 10,
          nature: 'Harmonious',
          meaning: almanacAspectMeaning(b1.name, b2.name, 'Sextile (60°)', 'Harmonious')
        });
      } else if (Math.abs(angle - 90) <= 5) {
        activeAspects.push({
          body1: b1.name,
          body2: b2.name,
          aspect: 'Square (90°)',
          orb: Math.round(Math.abs(angle - 90) * 10) / 10,
          nature: 'Dynamic Tension',
          meaning: almanacAspectMeaning(b1.name, b2.name, 'Square (90°)', 'Dynamic Tension')
        });
      } else if (Math.abs(angle - 120) <= 6) {
        activeAspects.push({
          body1: b1.name,
          body2: b2.name,
          aspect: 'Trine (120°)',
          orb: Math.round(Math.abs(angle - 120) * 10) / 10,
          nature: 'Harmonious',
          meaning: almanacAspectMeaning(b1.name, b2.name, 'Trine (120°)', 'Harmonious')
        });
      } else if (Math.abs(angle - 180) <= 6) {
        activeAspects.push({
          body1: b1.name,
          body2: b2.name,
          aspect: 'Opposition (180°)',
          orb: Math.round(Math.abs(angle - 180) * 10) / 10,
          nature: 'Dynamic Tension',
          meaning: almanacAspectMeaning(b1.name, b2.name, 'Opposition (180°)', 'Dynamic Tension')
        });
      }
    }
  }

  const retrogradeBodies = bodies.filter((b) => b.isRetrograde).map((b) => `${b.name} (${b.zodiacSign} ${b.signDegree.toFixed(1)}°)`);

  // 4. Dialectical Fork for Today
  const topTribe = ctx.synthesis.topResonatingTribe;
  const tzolkin = ctx.mayan.tzolkin;
  const yearPillar = ctx.chinese.yearPillar;
  const dayPillar = ctx.chinese.dayPillar;
  const geneKeySun = ctx.geneKeysSun;

  const forkTitle = `${tzolkin.signName} vs. ${dayPillar.stemElement} ${dayPillar.zodiacAnimal} — push or hold`;
  const choiceA = `Move on ${tzolkin.formatted} (${tzolkin.meaning}): visible initiative, faster decisions — watch for bluntness if empathy lags.`;
  const choiceB = `Stay with ${dayPillar.branchPolarity} ${dayPillar.branchElement} currents: gather leverage, let external noise settle before you commit.`;
  const syntheticResolution = `Hold ${topTribe.directionInCamp} camp (${topTribe.tribe}, ${topTribe.gemstone}): act, but only after you've named the ${geneKeySun.shadow} constraint and pivoted toward ${geneKeySun.gift}.`;

  // Calculate Vedic Details
  const sunLong = sunBody ? sunBody.eclipticLongitude : 0;
  const moonLong = moonBody ? moonBody.eclipticLongitude : 0;
  const vedic = ctx.vedic
    ? ctx.vedic
    : calculateVedicDetails(moonLong, sunLong, ctx.temporal.julianDayUT);
  const nakshatraNumber = ctx.vedic?.nakshatraNumber ?? Math.floor(((moonLong - (ctx.vedic?.lahiriAyanamshaDeg || 24) + 360) % 360) / (360 / 27)) + 1;
  const siderealSun = getSiderealZodiacAndConstellation(vedic.siderealSunDeg);
  const siderealMoon = getSiderealZodiacAndConstellation(vedic.siderealMoonDeg);

  // Calculate Lunar Node & Eclipse status
  const northNode = ctx.celestialBodies.find((b) => b.id === 'north_node') || { eclipticLongitude: 120 };
  const eclipse = calculateEclipseStatus(sunLong, northNode.eclipticLongitude);

  // Active Asteroids
  const asteroids = MAJOR_ASTEROIDS.map((ast, idx) => {
    const astDeg = (sunLong + idx * 62.4) % 360;
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const sign = signs[Math.floor(astDeg / 30)];
    return {
      id: ast.id,
      name: ast.name,
      symbol: ast.symbol,
      zodiacSign: sign,
      signDegree: Math.round((astDeg % 30) * 100) / 100,
      isRetrograde: (idx % 3 === 0),
      archetype: ast.theme,
      cosmicCounsel: ast.counsel
    };
  });

  // Moons of Solar System
  const solarMoons = SOLAR_SYSTEM_MOONS.map((m) => ({
    parentBody: m.system,
    moonName: m.moon,
    symbol: m.symbol,
    mythologicalArchetype: m.system === 'Jupiter' ? 'Sovereign Expansion Guard' : m.system === 'Saturn' ? 'Threshold Crystallization Sentinel' : 'Terrestrial Vigil',
    tidalResonance: m.energeticQuality
  }));

  // Active Constellations
  const constellations = ACTIVE_CONSTELLATIONS;

  // Continental Overcast
  const continentalOvercast = [
    { name: 'North America', fieldStatus: 'High Ionospheric Coherence', geomagneticFlux: 'Moderate Quiet (24 nT/hr)', leyLineTension: 'Active along Cascadia & Appalachian Spine', sovereigntyVector: 'Initiative, Technological Convergence & Grounded Truth' },
    { name: 'Europe', fieldStatus: 'Subtle Harmonic Resonance', geomagneticFlux: 'Stable Base (18 nT/hr)', leyLineTension: 'Aligned along St. Michael & Rose Line Axis', sovereigntyVector: 'Cultural Reconciliation, Institutional Reflection & Restraint' },
    { name: 'Asia', fieldStatus: 'Intense Tectonic & Auroral Flux', geomagneticFlux: 'Dynamic Expansion (32 nT/hr)', leyLineTension: 'Kunlun-Himalayan Mantle Pulse Active', sovereigntyVector: 'Strategic Long-Term Patience, Sovereignty & Ancient Memory' },
    { name: 'Africa', fieldStatus: 'High Terrestrial Foundation Pulse', geomagneticFlux: 'Balanced Meridian Flow (15 nT/hr)', leyLineTension: 'Great Rift Valley Core Unwinding', sovereigntyVector: 'Primordial Vitality, Root Grounding & Sacred Lineage' },
    { name: 'South America', fieldStatus: 'Vibrant Kundalini Spine Elevation', geomagneticFlux: 'Elevated Equatorial Wave (28 nT/hr)', leyLineTension: 'Andean Mountain Spine Radiating', sovereigntyVector: 'Shamanic Intuition, Regenerative Forest Alchemy & Heart Wisdom' },
    { name: 'Oceania', fieldStatus: 'Primal Songline Activation', geomagneticFlux: 'Gentle Pacific Ocean Pulse (12 nT/hr)', leyLineTension: 'Uluru Solar Plexus Radiating Eastward', sovereigntyVector: 'Dreamtime Alignment, Water Harmony & Celestial Navigation' },
    { name: 'Antarctica', fieldStatus: 'Cryospheric Magnetic Polar Anchor', geomagneticFlux: 'Extreme Field Density (45 nT/hr)', leyLineTension: 'Zero Precession Polar Nexus', sovereigntyVector: 'Absolute Stoic Stillness, Deep Geothermal Reservoir Containment' }
  ];

  // Anchor Cities
  const anchorCities = PRESET_LOCATIONS.slice(0, 8).map((loc) => ({
    city: loc.name,
    country: loc.countryOrRegion,
    lat: loc.lat,
    lng: loc.lng,
    dominantTransitLine: `${loc.geodeticMeridian} Meridian`,
    geodeticZenith: loc.leyLineNode,
    regionalGuidance: `Maintain integrity within the local terrestrial field; focus upon contemplative clarity during solar noon.`
  }));

  const gregorianFormatted = `${now.toLocaleString('en-US', { month: 'long' })} ${day}, ${year}`;
  const dominantTone = `${ctx.mayan.galacticTone.name} (Tone ${ctx.mayan.galacticTone.number}) · Universal ${universalDayNumber}`;
  const eb = ctx.enochianBiblical;
  const briefingInputs: BriefingInputs = {
    gregorianFormatted,
    timeStr,
    universalDayNumber,
    universalDayVibration,
    dominantTone,
    kpEstimated,
    schumannHarmonic,
    tensionScore,
    geomagneticStatus,
    lunarIllumPercent,
    lunarPhaseName,
    lunarTone,
    retrogradeBodies: retrogradeBodies.length > 0 ? retrogradeBodies : ['None (All Major Celestial Spheres Direct)'],
    activeAspects: activeAspects.slice(0, 8),
    forkTitle: `${forkTitle} · ${eb.abPeek.pathA.label} vs ${eb.abPeek.pathB.label}`,
    choiceA,
    choiceB,
    syntheticResolution,
    goldenThread: `Unify ${ctx.mayan.galacticTone.name} (Tone ${ctx.mayan.galacticTone.number}) with Universal Day ${universalDayNumber} by grounding ideas into one tangible act — and keep civil ${eb.gregorianWeekdayDeity.latinDies} and Enochian ${eb.enochian.watchGate} as separate layers, not one blended instruction.`,
    peakPowerWindow: `${eb.currentPlanetaryHour.planet} hour (${eb.currentPlanetaryHour.formattedWindow}) · ${eb.currentHalfHour.phase}`,
    whatToHarness: [
      `Use ${tzolkin.formatted} (${tzolkin.meaning}) for one high-integrity initiative.`,
      `Channel ${dayPillar.stemElement} energy into research, synthesis, or a single negotiation.`,
      `Orient to ${topTribe.directionInCamp} camp (${topTribe.tribe}); Enochian remap → ${eb.compassOrientation.directionRemap[topTribe.directionInCamp]}.`,
      `Anchor ${eb.biblicalSeason.hebrewTekufah} with ${eb.biblicalTransits.seasonVerseAnchors[0]} / ${eb.biblicalTransits.seasonVerseAnchors[1]}.`
    ],
    whatToAvoid: [
      `Don't react into squares blindly — read the aspect, then respond.`,
      `Watch for ${geneKeySun.shadow}; pivot to ${geneKeySun.gift} before you commit publicly.`,
      `Don't scatter focus during ${eb.currentPlanetaryHour.planet} hour.`,
      `Don't average Civil Peek A and Enochian Peek B into mush — hold the fork.`
    ],
    peekA: eb.abPeek.pathA.summary,
    peekB: eb.abPeek.pathB.summary,
    triangulation: eb.abPeek.synthesis.summary
  };

  const executiveSynthesis = buildExecutiveBriefing(ctx, briefingInputs);

  const dailyStrategicActionPlan = buildStrategicBriefing(briefingInputs);

  const activeProfile = getActiveProfile();
  const extendedMonograph = buildLifeImpactBriefing(ctx, briefingInputs, activeProfile);

  const wordCountEstimate = estimateBriefingWords(extendedMonograph);




  return {
    dateString: dateStr,
    julianDayUT: Math.round(ctx.temporal.julianDayUT * 1000) / 1000,
    gregorianFormatted,
    executiveSynthesis,
    dominantTone,
    universalDayNumber,
    universalDayVibration,
    gaiaOvercast: {
      geomagneticStatus,
      geomagneticKp: kpEstimated,
      schumannFrequencyHz: schumannHarmonic,
      aspectTensionScore: tensionScore,
      collectivePolarity: ctx.synthesis.dominantPolarity,
      dominantElement: ctx.chinese.dominantElement,
      solarTerm: ctx.chinese.solarTerm.name,
      lunarIlluminationPercent: lunarIllumPercent,
      lunarPhaseName,
      lunarTone,
      atmosphericNarrative: `Schumann ${schumannHarmonic} Hz, tension ${tensionScore}/100 — within this framework the field reads as workable ${geomagneticStatus.toLowerCase()}, with ${ctx.chinese.dominantElement} as the dominant Wu Xing vector today.`
    },
    celestialWeather: {
      sunPosition: sunBody ? `${sunBody.zodiacSign} ${sunBody.signDegree.toFixed(2)}°` : 'Aries 0°',
      moonPosition: moonBody ? `${moonBody.zodiacSign} ${moonBody.signDegree.toFixed(2)}° (${moonBody.isRetrograde ? 'Rx' : 'Direct'})` : 'Taurus 15°',
      activeAspects: activeAspects.slice(0, 6),
      retrogradeBodies: retrogradeBodies.length > 0 ? retrogradeBodies : ['None (All Major Celestial Spheres Direct)'],
      cosmicCounsel: retrogradeBodies.length
        ? `${retrogradeBodies.length} body/bodies retrograde — review and restructure before you broadcast outward.`
        : `All major bodies direct — execution is fair game if the fork is clear.`
    },
    mayanProfile: {
      longCount: ctx.mayan.longCount.formatted,
      kinNumber: ctx.mayan.kinNumber,
      tzolkinFormatted: ctx.mayan.tzolkin.formatted,
      solarTone: `${ctx.mayan.galacticTone.number} (${ctx.mayan.galacticTone.name})`,
      haabFormatted: ctx.mayan.haab.formatted,
      isGalacticPortalDay: ctx.mayan.isGalacticPortalDay,
      wavespellName: ctx.dreamspell.wavespell.name,
      fifthForceGuide: ctx.dreamspell.oracle.guide.name,
      spiritualProtocol: `Kin ${ctx.mayan.kinNumber} initiates through ${ctx.mayan.tzolkin.meaning} powered by ${ctx.mayan.galacticTone.power}. Maintain clear awareness at solar noon.`
    },
    chineseProfile: {
      yearPillar: `${ctx.chinese.yearPillar.stemPinYin}-${ctx.chinese.yearPillar.branchPinYin} (${ctx.chinese.yearPillar.stemElement} ${ctx.chinese.yearPillar.zodiacAnimal})`,
      monthPillar: `${ctx.chinese.monthPillar.stemPinYin}-${ctx.chinese.monthPillar.branchPinYin} (${ctx.chinese.monthPillar.stemElement} ${ctx.chinese.monthPillar.zodiacAnimal})`,
      dayPillar: `${ctx.chinese.dayPillar.stemPinYin}-${ctx.chinese.dayPillar.branchPinYin} (${ctx.chinese.dayPillar.stemElement} ${ctx.chinese.dayPillar.zodiacAnimal})`,
      stemElement: ctx.chinese.dayPillar.stemElement,
      branchAnimal: ctx.chinese.dayPillar.zodiacAnimal,
      solarTerm: `${ctx.chinese.solarTerm.name} (${ctx.chinese.solarTerm.chineseName})`,
      wuXingDynamic: `Day element ${ctx.chinese.dayPillar.stemElement} harmonizes with the year's ${ctx.chinese.yearPillar.stemElement}, producing an elemental vector of ${ctx.chinese.dominantElement}.`
    },
    ancientCalendars: {
      egyptian: `Year ${ctx.egyptian.civilYear}, ${ctx.egyptian.monthName} Day ${ctx.egyptian.dayOfMonth} (${ctx.egyptian.season}) · Sothic Great Cycle Year ${ctx.egyptian.sothicYearInCycle}/1460`,
      ethiopian: `${ctx.ethiopian.monthName} ${ctx.ethiopian.dayOfMonth}, Year of Grace ${ctx.ethiopian.year} (${ctx.ethiopian.evangelist} Evangelist Cycle)`,
      greekAttic: `${ctx.greek.atticMonthName} Day ${ctx.greek.atticDay} · Olympiad ${ctx.greek.olympiadNumber}.${ctx.greek.olympiadYear} · Metonic Year ${ctx.greek.metonicCycleYear}/19`,
      julianEquivalent: `Julian Calendar Date: Year ${ctx.temporal.julianCalendarDate.year}, Month ${ctx.temporal.julianCalendarDate.month}, Day ${ctx.temporal.julianCalendarDate.day}`,
      enochian: eb.enochian.formatted,
      biblicalTekufah: `${eb.biblicalSeason.name} · ${eb.biblicalTransits.seasonVerseAnchors.join('; ')}`,
      romanDies: `${eb.gregorianWeekdayDeity.latinDies} (${eb.gregorianWeekdayDeity.romanDeity}) · Julian ${eb.julianWeekdayDeity.latinDies}`,
      planetaryHour: `Hour of ${eb.currentPlanetaryHour.planet} (${eb.currentPlanetaryHour.formattedWindow}) · ${eb.currentHalfHour.phase}`
    },
    geneKeyTransit: {
      sunGate: ctx.geneKeysSun.gate,
      line: ctx.geneKeysSun.line,
      name: ctx.geneKeysSun.name,
      shadow: ctx.geneKeysSun.shadow,
      gift: ctx.geneKeysSun.gift,
      siddhi: ctx.geneKeysSun.siddhi,
      earthGate: ctx.geneKeysEarth.gate,
      earthGift: ctx.geneKeysEarth.gift
    },
    twelveTribesResonance: {
      primaryTribe: topTribe.tribe,
      campDirection: topTribe.directionInCamp,
      gemstone: topTribe.gemstone,
      guidance: `Align with the ${topTribe.directionInCamp} camp of ${topTribe.tribe} (${topTribe.bannerSymbol}). ${topTribe.resonanceDescription}`
    },
    dailyStrategicActionPlan,
    extendedMonograph,
    wordCountEstimate,
    vedicProfile: {
      nakshatra: {
        name: vedic.nakshatraName,
        number: nakshatraNumber,
        pada: vedic.nakshatraPada,
        rulingPlanet: vedic.nakshatraLord,
        deity: vedic.nakshatraDeity,
        shakti: vedic.nakshatraShakti,
        symbol: vedic.nakshatraSymbol
      },
      tithi: {
        number: vedic.tithiNumber,
        name: vedic.tithiName,
        paksha: vedic.paksha as any,
        nature: vedic.paksha.includes('Shukla') ? 'Expanding / Auspicious' : 'Inward / Restorative'
      },
      yoga: {
        name: vedic.yogaName,
        meaning: 'Celestial Angular Solar-Lunar Union',
        quality: 'Auspicious'
      },
      karana: {
        name: vedic.karanaName,
        lord: 'Lunar Half-Tithi'
      },
      lahiriAyanamshaDeg: vedic.lahiriAyanamshaDeg
    },
    siderealProfile: {
      sunSign: siderealSun.sign,
      sunDegree: vedic.siderealSunDeg,
      moonSign: siderealMoon.sign,
      moonDegree: vedic.siderealMoonDeg,
      ayanamshaOffsetDeg: vedic.lahiriAyanamshaDeg,
      iauConstellationSun: siderealSun.constellation,
      iauConstellationMoon: siderealMoon.constellation
    },
    asteroidsAndOtherMoons: {
      asteroids,
      solarMoons
    },
    activeConstellations: constellations,
    eclipseStatus: {
      isNearEclipseSeason: eclipse.isNearEclipse,
      daysToNearestEclipse: eclipse.daysToNearestEclipse,
      nearestEclipseType: eclipse.nearestEclipseType as any,
      approximateDate: `${eclipse.daysToNearestEclipse} days from current transit`,
      nodalAxisSign: eclipse.nodalAxisSign,
      esotericImpact: 'Metabolic systemic reset of societal and personal karmic scripts.'
    },
    continentalAndCityOvercast: {
      continents: continentalOvercast,
      anchorCities
    }
  };
}
