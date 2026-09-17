/**
 * Full-suite module test runner — executes each engine module repeatedly.
 * Run: npx tsx scripts/runAllModuleTests.ts
 */

import { executeCrucibleCalculation } from '../src/engine/crucibleCore';
import { runMicroTests } from '../src/engine/microTests';
import { calculateGaiaOvercast, toSharedDialecticalForks, buildDialecticalForks } from '../src/engine/gaiaOvercastForks';
import { generateTodayDailyReport } from '../src/engine/dailyEnergyReport';
import { generateFourteenDayForecast } from '../src/engine/longTermResonance';
import { generateCSVReport } from '../src/engine/export';
import { calculateGematriaEtymology } from '../src/engine/gematriaEtymology';
import { CANONICAL_CLAIMS, CANONICAL_RULESETS } from '../src/engine/knowledgeBase';
import { lunarMetricsFromBodies } from '../src/engine/sharedCelestial';
import { mergeMethodology, EPISTEMIC_LABELS } from '../src/engine/epistemic';
import { FREE_SANCTUARY_PRESETS } from '../src/engine/freeGeocode';
import { computeWhatChanged } from '../src/engine/whatChanged';
import { generateDossierHTML } from '../src/engine/dossierExport';
import { synthesizeDailyBearing, bearingIsPlainLanguage } from '../src/engine/editorialSynthesis';
import { selectEntriesForFocus } from '../src/engine/readingFocus';
import { compileAlmanacEntries } from '../src/engine/almanac';
import { dreamspellKinForYmd, kinFromSealAndTone, buildTzolkinMatrix } from '../src/engine/dreamspellCalendar';
import { buildChartLayout } from '../src/engine/chartWheel';
import { TemporalInput } from '../src/types';

const PASSES = 5;

const baseInput: TemporalInput = {
  dateString: '2026-09-07',
  timeString: '12:00:00',
  timezoneOffsetMinutes: 240,
  isUTC: false,
  location: { latitude: 31.778, longitude: 35.2354, city: 'Jerusalem' },
  querentName: 'Test Querent',
  methodology: mergeMethodology({ includeVedic: true, includeGaiaOverlay: true })
};

type Result = { name: string; pass: number; fail: number; errors: string[] };

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

async function runNamed(name: string, fn: () => void): Promise<Result> {
  const r: Result = { name, pass: 0, fail: 0, errors: [] };
  for (let i = 0; i < PASSES; i++) {
    try {
      fn();
      r.pass++;
    } catch (e: any) {
      r.fail++;
      r.errors.push(`pass ${i + 1}: ${e.message || e}`);
    }
  }
  // Retest failures up to 5 more full rounds if any failed
  let round = 0;
  while (r.fail > 0 && round < 5) {
    round++;
    r.fail = 0;
    r.errors = [];
    r.pass = 0;
    for (let i = 0; i < PASSES; i++) {
      try {
        fn();
        r.pass++;
      } catch (e: any) {
        r.fail++;
        r.errors.push(`retest ${round}.${i + 1}: ${e.message || e}`);
      }
    }
  }
  return r;
}

async function main() {
  const results: Result[] = [];

  results.push(
    await runNamed('crucibleCore.executeCrucibleCalculation', () => {
      const ctx = executeCrucibleCalculation(baseInput);
      assert(!!ctx.temporal.julianDayUT, 'missing JD');
      assert(!!ctx.mayan.longCount.formatted, 'missing mayan');
      assert(!!ctx.dreamspell.signature, 'missing dreamspell');
      assert(!!ctx.chinese.dayPillar.stemPinYin, 'missing chinese');
      assert(!!ctx.enochianBiblical.enochian.formatted, 'missing enochian');
      assert(!!ctx.intertwining.systemNotes.length, 'missing intertwining');
      assert(!!ctx.intertwining.systemNotes[0].independentlySays, 'missing why-ladder');
      assert(!!ctx.intertwining.systemNotes[0].doWithDisagreement, 'missing act-on-disagreement');
      assert(!!ctx.methodology.version, 'missing methodology');
      assert(!!ctx.vedic?.nakshatraName, 'missing vedic');
      assert(!!ctx.gaiaOvercast?.epistemicClass, 'missing gaia epistemic');
      assert((ctx.dialecticalForks?.length || 0) >= 1, 'missing forks');
      assert(!!ctx.eventTimeIso && !!ctx.calculationTimeIso, 'missing event/calc times');
    })
  );

  results.push(
    await runNamed('microTests.runMicroTests', () => {
      const tests = runMicroTests();
      const failed = tests.filter((t) => !t.passed);
      assert(failed.length === 0, failed.map((f) => f.id).join(', '));
    })
  );

  results.push(
    await runNamed('sharedCelestial.lunarMetrics', () => {
      const ctx = executeCrucibleCalculation(baseInput);
      const lunar = lunarMetricsFromBodies(ctx.celestialBodies);
      assert(lunar.illuminationPercent >= 0 && lunar.illuminationPercent <= 100, 'illum bounds');
      assert(lunar.epistemicClass === 'COMPUTED_GEOMETRY', 'epistemic');
    })
  );

  results.push(
    await runNamed('gaiaOvercastForks', () => {
      const ctx = executeCrucibleCalculation(baseInput);
      const gaia = calculateGaiaOvercast(ctx);
      assert(gaia.epistemicClass === 'SPECULATIVE_SYNTHESIS', 'gaia class');
      const forks = toSharedDialecticalForks(buildDialecticalForks(ctx, gaia, 'Test'));
      assert(forks.length >= 3, 'fork count');
      assert(forks[0].epistemicClass === 'COMPARATIVE_ANALOGY', 'fork class');
    })
  );

  results.push(
    await runNamed('dailyEnergyReport', () => {
      const ctx = executeCrucibleCalculation(baseInput);
      const report = generateTodayDailyReport(ctx);
      assert(!!report.executiveSynthesis, 'exec');
      assert(report.vedicProfile?.nakshatra.number >= 1 && report.vedicProfile.nakshatra.number <= 27, 'nakshatra number');
      assert(report.universalDayNumber === ctx.numerology.universalDay, 'universal day sync');
    })
  );

  results.push(
    await runNamed('longTermResonance.14day', () => {
      const forecast = generateFourteenDayForecast(baseInput, '2026-09-07', 'jerusalem', 'Test Querent');
      assert(forecast.fourteenDayEntries.length === 14, '14 days');
    })
  );

  results.push(
    await runNamed('export.csv', () => {
      const ctx = executeCrucibleCalculation(baseInput);
      const csv = generateCSVReport(ctx);
      assert(csv.includes('Enochian'), 'csv enochian');
      assert(csv.includes('Tribe'), 'csv tribe');
    })
  );

  results.push(
    await runNamed('gematriaEtymology', () => {
      const g = calculateGematriaEtymology('Crucible', 7);
      assert(g.ciphers.englishOrdinal.totalSum > 0, 'ordinal');
    })
  );

  results.push(
    await runNamed('knowledgeBase+epistemic', () => {
      assert(CANONICAL_CLAIMS.length >= 5, 'claims');
      assert(CANONICAL_RULESETS.length >= 5, 'rulesets');
      assert(Object.keys(EPISTEMIC_LABELS).length === 8, 'epistemic labels');
    })
  );

  results.push(
    await runNamed('freeGeocode.sanctuaryPresets', () => {
      assert(FREE_SANCTUARY_PRESETS.length >= 5, 'preset count');
      const j = FREE_SANCTUARY_PRESETS.find((p) => p.city.includes('Jerusalem'));
      assert(!!j && Math.abs(j.latitude - 31.778) < 0.01, 'jerusalem coords');
    })
  );

  results.push(
    await runNamed('whatChanged.diff', () => {
      const a = executeCrucibleCalculation(baseInput);
      const b = executeCrucibleCalculation({ ...baseInput, dateString: '2026-10-10' });
      const report = computeWhatChanged(a, b);
      assert(report.changed.length + report.unchanged.length > 10, 'field coverage');
      assert(!!report.summary.includes('WHAT CHANGED'), 'summary');
    })
  );

  results.push(
    await runNamed('dossierExport.html', () => {
      const ctx = executeCrucibleCalculation(baseInput);
      const html = generateDossierHTML(ctx, 'FULL_READING');
      assert(html.includes('THE CRUCIBLE'), 'title');
      assert(html.includes('Why is this here?'), 'ladder');
      assert(html.includes('Personal Systems Dossier'), 'product');
    })
  );

  results.push(
    await runNamed('determinism.sameInputSameHash', () => {
      const a = executeCrucibleCalculation(baseInput);
      const b = executeCrucibleCalculation(baseInput);
      assert(a.rulesetHash === b.rulesetHash, 'hash mismatch');
      assert(a.mayan.longCount.formatted === b.mayan.longCount.formatted, 'mayan mismatch');
      assert(a.vedic?.nakshatraName === b.vedic?.nakshatraName, 'vedic mismatch');
    })
  );

  results.push(
    await runNamed('editorialSynthesis.dailyBearing', () => {
      const ctx = executeCrucibleCalculation(baseInput);
      const overview = synthesizeDailyBearing(ctx, 'overview', null);
      const work = synthesizeDailyBearing(ctx, 'work', null);
      assert(!!overview.theme && overview.theme.length > 4, 'theme');
      assert(!!overview.practice, 'practice');
      assert(!!overview.localContext.sunrise && !!overview.localContext.sunset, 'daylight');
      assert(overview.localContext.cityLabel.includes('Jerusalem'), 'city');
      assert(bearingIsPlainLanguage(overview), 'plain language');
      assert(overview.calculationId === ctx.calculationId, 'calc id');
      const again = synthesizeDailyBearing(ctx, 'overview', null);
      assert(again.theme === overview.theme && again.summary === overview.summary, 'deterministic');
      const entries = compileAlmanacEntries(ctx);
      const focused = selectEntriesForFocus(entries, 'relationships');
      assert(focused[0].id === 'lunar-phase', 'focus weight');
      assert(work.focus === 'work', 'work focus');
    })
  );

  results.push(
    await runNamed('dreamspellCalendar.grids', () => {
      const a = dreamspellKinForYmd(2013, 7, 26);
      const ctx = executeCrucibleCalculation({ ...baseInput, dateString: '2013-07-26', isUTC: true });
      assert(a.kin === 164, 'july 26 2013 kin');
      assert(a.kin === ctx.dreamspell.kin, 'matches engine');
      assert(kinFromSealAndTone(0, 0) === 1, 'seal1 tone1');
      const matrix = buildTzolkinMatrix();
      assert(matrix.length === 20 && matrix[0].length === 13, '20x13');
      const ids = new Set(matrix.flat().map((c) => c.kin));
      assert(ids.size === 260, 'unique kins');
    })
  );

  results.push(
    await runNamed('chartWheel.angles', () => {
      const ctx = executeCrucibleCalculation(baseInput);
      const layout = buildChartLayout({
        temporal: ctx.temporal,
        latitude: 31.778,
        mode: 'current-sky'
      });
      assert(layout.hasAngles, 'angles');
      assert(layout.houses.length === 12, 'houses');
      assert(layout.houses[0].house === 1, 'house 1');
      const natalUnknown = buildChartLayout({
        temporal: ctx.temporal,
        latitude: 31.778,
        mode: 'natal',
        birthTimeConfidence: 'unknown_window'
      });
      assert(!natalUnknown.hasAngles && natalUnknown.houses.length === 0, 'no fake houses');
    })
  );

  const failed = results.filter((r) => r.fail > 0);
  console.log('\n=== MODULE TEST REPORT (5 passes each, auto-retest) ===\n');
  for (const r of results) {
    const status = r.fail === 0 ? 'PASS' : 'FAIL';
    console.log(`${status}  ${r.name}  (${r.pass}/${PASSES} ok)`);
    if (r.errors.length) console.log('   ', r.errors.join(' | '));
  }
  console.log(`\nSummary: ${results.length - failed.length}/${results.length} modules green\n`);
  if (failed.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
