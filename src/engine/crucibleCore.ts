/**
 * The Crucible — Master Engine Orchestrator
 * Pure, deterministic calculation executing all temporal, calendrical,
 * celestial, and syntheses layers with sub-millisecond benchmarked latency.
 */

import { calculateAstrocartography } from './astrocartography';
import { calculateChinese } from './chinese';
import { buildCrossSystemIntertwining } from './crossSystemBridge';
import { calculateDreamspell } from './dreamspell';
import { mergeMethodology } from './epistemic';
import { calculateEnochianBiblical } from './enochianBiblical';
import { calculateEphemeris } from './ephemeris';
import {
  buildDialecticalForks,
  calculateGaiaOvercast,
  toSharedDialecticalForks
} from './gaiaOvercastForks';
import { calculateEgyptian, calculateEthiopian, calculateGreek } from './historicalCalendars';
import { calculateVedicDetails } from './longTermResonance';
import { calculateMayan } from './mayan';
import { calculateNumerology } from './numerology';
import { calculateSynthesis, getGeneKeyFromLongitude } from './synthesis';
import { hashString, normalizeTemporal } from './temporal';
import { CompleteCalculationContext, TemporalInput, VedicResult } from '../types';

export function executeCrucibleCalculation(
  input: TemporalInput,
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384' = 'GMT_584283'
): CompleteCalculationContext {
  const calculationTimeIso = new Date().toISOString();
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  const methodology = mergeMethodology({
    ...input.methodology,
    calendarCorrelation: input.methodology?.calendarCorrelation || correlationKey
  });

  const temporal = normalizeTemporal(input);
  const mayan = calculateMayan(temporal, methodology.calendarCorrelation);
  const dreamspell = calculateDreamspell(temporal);
  const chinese = calculateChinese(temporal);
  const egyptian = calculateEgyptian(temporal);
  const ethiopian = calculateEthiopian(temporal);
  const greek = calculateGreek(temporal);
  const enochianBiblical = calculateEnochianBiblical(temporal, input);
  const numerology = calculateNumerology(temporal, input.querentName || 'THE CRUCIBLE');
  const celestialBodies = calculateEphemeris(temporal);
  const astrocartographyLines = calculateAstrocartography(temporal, celestialBodies);

  const sunBody = celestialBodies.find((b) => b.id === 'sun') || celestialBodies[0];
  const moonBody = celestialBodies.find((b) => b.id === 'moon') || celestialBodies[1] || sunBody;
  const earthLong = (sunBody.eclipticLongitude + 180) % 360;
  const geneKeysSun = getGeneKeyFromLongitude(sunBody.eclipticLongitude);
  const geneKeysEarth = getGeneKeyFromLongitude(earthLong);

  let vedic: VedicResult | undefined;
  if (methodology.includeVedic) {
    const raw = calculateVedicDetails(
      moonBody.eclipticLongitude,
      sunBody.eclipticLongitude,
      temporal.julianDayUT
    );
    vedic = raw as VedicResult;
  }

  const synthesis = calculateSynthesis(temporal, mayan, chinese, numerology);

  const intertwining = buildCrossSystemIntertwining({
    temporal,
    mayan,
    dreamspell,
    chinese,
    egyptian,
    ethiopian,
    greek,
    enochianBiblical,
    numerology,
    geneKeysSun,
    geneKeysEarth,
    celestialBodies,
    twelveTribesScores: synthesis.twelveTribesScores,
    topTribe: synthesis.topResonatingTribe
  });

  synthesis.twelveTribesScores = intertwining.twelveTribesEnriched;
  synthesis.topResonatingTribe = intertwining.twelveTribesEnriched[0] || synthesis.topResonatingTribe;
  const life = intertwining.primaryTribeLife;
  synthesis.recommendedFocus = `Strongest archetypal alignment under this methodology: ${life.tribe}. Explore: ${life.giftToEmbody} Today: ${life.dayPractice} Refuse: ${life.shadowToWatch}`;

  // Partial context for Gaia (needs celestial + chinese + numerology minimum)
  const partialForGaia = {
    input,
    temporal,
    mayan,
    dreamspell,
    chinese,
    egyptian,
    ethiopian,
    greek,
    numerology,
    celestialBodies,
    astrocartographyLines,
    geneKeysSun,
    geneKeysEarth,
    synthesis,
    enochianBiblical,
    intertwining,
    methodology,
    vedic,
    eventTimeIso: temporal.isoString,
    calculationTimeIso,
    calculationId: 'PENDING',
    timestamp: calculationTimeIso,
    executionDurationMs: 0,
    rulesetHash: 'PENDING'
  } as CompleteCalculationContext;

  let gaiaOvercast: CompleteCalculationContext['gaiaOvercast'];
  let dialecticalForks: CompleteCalculationContext['dialecticalForks'];
  if (methodology.includeGaiaOverlay) {
    const gaia = calculateGaiaOvercast(partialForGaia);
    gaiaOvercast = {
      geomagneticStatus: gaia.geomagneticStatus,
      geomagneticKpEstimated: gaia.geomagneticKpEstimated,
      schumannFrequencyHz: gaia.schumannFrequencyHz,
      lunarIlluminationPercent: gaia.lunarIlluminationPercent,
      lunarPhaseName: gaia.lunarPhaseName,
      aspectTensionScore: gaia.celestialAspectTensionScore,
      collectiveFieldPolarity: gaia.collectiveFieldPolarity,
      dominantElementalAtmosphere: gaia.dominantElementalAtmosphere,
      literaryOvercastDossier: gaia.literaryOvercastDossier,
      epistemicClass: gaia.epistemicClass
    };
    dialecticalForks = toSharedDialecticalForks(
      buildDialecticalForks(partialForGaia, gaia, input.querentName || 'Querent')
    );
  }

  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const executionDurationMs = Math.round((endTime - startTime) * 1000) / 1000;

  const canonicalString = `${temporal.julianDayUT}|${methodology.version}|${mayan.longCount.formatted}|${dreamspell.signature}|${chinese.yearPillar.stemPinYin}-${chinese.yearPillar.branchPinYin}|${numerology.lifePathNumber}|${enochianBiblical.enochian.formatted}|${synthesis.topResonatingTribe.tribe}|${vedic?.nakshatraName || 'none'}`;
  const rulesetHash = hashString(canonicalString);
  const calculationId = `CRUCIBLE-${rulesetHash.toUpperCase()}-${Math.floor(temporal.julianDayUT)}`;

  return {
    calculationId,
    timestamp: calculationTimeIso,
    executionDurationMs,
    input,
    temporal,
    mayan,
    dreamspell,
    chinese,
    egyptian,
    ethiopian,
    greek,
    numerology,
    celestialBodies,
    astrocartographyLines,
    geneKeysSun,
    geneKeysEarth,
    synthesis,
    enochianBiblical,
    intertwining,
    methodology,
    vedic,
    gaiaOvercast,
    dialecticalForks,
    eventTimeIso: temporal.isoString,
    calculationTimeIso,
    rulesetHash
  };
}
