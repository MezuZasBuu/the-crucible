export { TGOLD_VECTORS, TGOLD_CORE_PRINCIPLES, vectorsForTradition, vectorsForTraditions } from './evidenceVectors';
export type { TgoldVector, TgoldVectorId } from './evidenceVectors';
export {
  TGOLD_CLASSIFICATION_GUIDE,
  TGOLD_TENSION_GLOSSARY,
  TGOLD_PARADOX_SCALE,
  formatClassificationGuide
} from './tgoldLegends';
export {
  TGOLD_KNOWN_MODEL_BIASES,
  TGOLD_TEMPORAL_EPISTEMIC_BLOCK,
  buildBiasTransparencyBlock
} from './tgoldTemporalGuard';
export { PRACTICE_NUANCES, nuanceForTradition, nuanceBlockForTraditions } from './practiceNuance';
export { extractResearchArtifacts, selectRelatedInsights, buildMemoryContextBlock, scoreInsightRelevance } from './tgoldMemory';
export type { ResearchHook } from '../savedInsights';
export { tgoldTagForEpistemicClass, tgoldGlossForEpistemicClass } from './tgoldEpistemicBridge';
export type { TgoldClassificationTag } from './tgoldEpistemicBridge';
export { buildTgoldResearchPromptBlock, getTgoldResearchMetadata } from './tgoldResearchContext';
export type { TgoldResearchMode } from './tgoldResearchContext';
