/**
 * How today's sky interacts with a saved natal chart — comparative, not destiny.
 */

import { CompleteCalculationContext, CrucibleProfile } from '../types';
import { executeCrucibleCalculation } from './crucibleCore';
import { buildChartDynamicsReport } from './chartDynamics';

export function summarizePersonalAlignment(
  transitCtx: CompleteCalculationContext,
  profile: CrucibleProfile,
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384'
): { headline: string; detail: string; supportive: boolean } {
  const natalCtx = executeCrucibleCalculation(
    { ...profile.birth, querentName: profile.querentName || profile.displayName },
    correlationKey
  );
  const report = buildChartDynamicsReport(natalCtx, transitCtx, correlationKey);
  const hits = report.transitToNatal.slice(0, 6);
  const harmonious = hits.filter((h) => h.harmony === 'Harmonious').length;
  const tense = hits.filter((h) => h.harmony === 'Dynamic Tension').length;
  const supportive = harmonious >= tense;

  const headline = supportive
    ? 'Today’s sky mostly backs your natal pattern — you have usable wind at your back.'
    : 'Today’s sky mostly presses against your natal pattern — plan for friction, not failure.';

  const detail =
    hits.length > 0
      ? hits.map((h) => h.briefing).join(' ')
      : 'No tight transit-to-natal hits in this model window — the day reads as ambient weather rather than a direct natal trigger.';

  return { headline, detail, supportive };
}
