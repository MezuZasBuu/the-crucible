/**
 * Transits, progressions, returns, asteroids & symbolic moons — natal vs live sky
 */

import React, { useMemo, useState } from 'react';
import { CompleteCalculationContext } from '../types';
import { executeCrucibleCalculation } from '../engine/crucibleCore';
import { getActiveProfile, loadProfiles } from '../engine/crucibleProfile';
import { buildChartDynamicsReport, ChartDynamicsReport, CrossChartAspect } from '../engine/chartDynamics';
import { ASPECTS, AspectGlyph, PLANETS, PlanetGlyph, SignGlyph } from './symbols/AstroGlyph';

interface Props {
  transitCtx: CompleteCalculationContext;
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
  refreshKey?: number;
}

type Tab = 'transits' | 'progressions' | 'returns' | 'asteroids' | 'moons';

const TAB_EXPLAIN: Record<Tab, string> = {
  transits:
    'Transits: where the planets are today compared with where they were when you were born.',
  progressions:
    'Progressions: a slow symbolic clock — one day after birth stands for one year of life.',
  returns:
    'Returns: when the Sun or Moon comes back to the exact spot it held at your birth (a solar return is your astrological birthday).',
  asteroids:
    'Asteroids: a few large space rocks between Mars and Jupiter that some astrologers read alongside the planets. Positions here are approximate.',
  moons:
    'Moons: the moons of other planets, given a symbolic place in the zodiac. This layer is purely interpretive, not a measured position.'
};

/** Emoji and engine boilerplate we never show raw. */
const BOILERPLATE = /\s*I['’]d read that as[^.]*(?:not destiny)?\.?/gi;
const stripBoilerplate = (text: string) => text.replace(BOILERPLATE, '').trim();

function orbNote(orbDeg: number): string {
  if (orbDeg < 0.05) return 'exact';
  return `${orbDeg.toFixed(1)}° from exact`;
}

/** Glyph for a body; falls back to nothing for bodies without a drawn glyph. */
function BodyGlyph({ id }: { id: string }) {
  if (!PLANETS[id]) return null;
  return <PlanetGlyph planet={id} size={18} tinted />;
}

function AspectRow({ hit }: { hit: CrossChartAspect }) {
  const aspect = ASPECTS[hit.aspectType];
  const movingLabel =
    hit.layer === 'progressed' ? `Progressed ${hit.transitingName}` : `${hit.transitingName} today`;
  return (
    <li className="curious-box !py-3 space-y-1">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[color:var(--text-primary)]">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <BodyGlyph id={hit.transitingId} />
          {movingLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[color:var(--text-secondary)]">
          <AspectGlyph aspect={hit.aspectType} size={16} />
          {aspect ? aspect.plain : hit.aspectType.toLowerCase()}
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <BodyGlyph id={hit.natalId} />
          {hit.natalName} in your birth chart
        </span>
      </div>
      <p className="text-xs text-[color:var(--text-muted)]">
        {orbNote(hit.orbDeg)} · {hit.isApplying ? 'getting stronger' : 'fading'}
      </p>
    </li>
  );
}

function describeHit(hit: CrossChartAspect): string {
  const aspect = ASPECTS[hit.aspectType];
  const moving = hit.layer === 'progressed' ? `progressed ${hit.transitingName}` : `${hit.transitingName} today`;
  return `${moving} is ${aspect ? aspect.plain.split(' — ')[0] : hit.aspectType.toLowerCase()} ${
    hit.aspectType === 'Conjunction' ? 'with' : 'from'
  } ${hit.natalName} in your birth chart`;
}

function formatMoment(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 16).replace('T', ' ');
  return d.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' });
}

export const TransitsProgressionsPanel: React.FC<Props> = ({ transitCtx, correlationKey, refreshKey = 0 }) => {
  const [tab, setTab] = useState<Tab>('transits');
  const [, bump] = useState(0);

  void refreshKey;
  const active = getActiveProfile();
  const profiles = loadProfiles();

  const report: ChartDynamicsReport | null = useMemo(() => {
    if (!active) return null;
    const natalCtx = executeCrucibleCalculation(
      { ...active.birth, querentName: active.querentName || active.displayName },
      correlationKey
    );
    return buildChartDynamicsReport(natalCtx, transitCtx, correlationKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id, active?.updatedAtIso, transitCtx.calculationId, correlationKey, refreshKey]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'transits', label: 'Transits' },
    { id: 'progressions', label: 'Progressions' },
    { id: 'returns', label: 'Returns' },
    { id: 'asteroids', label: 'Asteroids' },
    { id: 'moons', label: 'Moons' }
  ];

  if (!active) {
    return (
      <div className="instrument-panel motion-enter space-y-3">
        <p className="ui-eyebrow">Today and you</p>
        <h2 className="panel-title">How today's sky touches your chart</h2>
        <p className="readable-body max-w-2xl">
          Once you have saved your birth details, this section compares where the planets are today with where they
          were when you were born.
        </p>
        <p className="readable-muted">
          {profiles.length === 0
            ? 'No one is saved yet. Add your birth date, time and place in the saved people section on this page.'
            : `${profiles.length} ${profiles.length === 1 ? 'person is' : 'people are'} saved. Choose one as the active person in the saved people section on this page.`}
        </p>
      </div>
    );
  }

  if (!report) return null;

  const aspectList =
    tab === 'transits'
      ? report.transitToNatal
      : tab === 'progressions'
        ? report.progressedToNatal
        : tab === 'asteroids'
          ? report.asteroidTransits
          : [];

  const activeReturns = report.returns.filter((r) => r.applicable).length;
  const topTransit = report.transitToNatal[0];
  const topProgressed = report.progressedToNatal[0];

  const counts: { label: string; value: number; help: string }[] = [
    { label: 'Transit links', value: report.transitToNatal.length, help: "today's planets to your birth chart" },
    { label: 'Progression links', value: report.progressedToNatal.length, help: 'the slow symbolic clock' },
    { label: 'Asteroid links', value: report.asteroidTransits.length, help: 'smaller bodies' },
    { label: 'Returns', value: activeReturns, help: 'in effect now' }
  ];

  const listTitle =
    tab === 'transits'
      ? "Today's planets and your birth chart"
      : tab === 'progressions'
        ? 'Progressed planets and your birth chart'
        : "Today's asteroids and your birth chart";

  return (
    <div className="instrument-panel motion-enter space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="ui-eyebrow">Today and you</p>
          <h2 className="panel-title mt-1">How today's sky touches your chart</h2>
          <p className="readable-body mt-2 max-w-3xl">
            For {report.natalLabel}, age {report.ageYears}. Comparing the sky on {transitCtx.input.dateString} with
            the sky at birth.
          </p>
          <p className="readable-muted mt-1 max-w-3xl">
            {topTransit
              ? `Closest link right now: ${describeHit(topTransit)}.`
              : 'No close links between today’s planets and your birth chart right now.'}{' '}
            {topProgressed
              ? `On the slow clock: ${describeHit(topProgressed)}.`
              : 'The slow symbolic clock is quiet at the moment.'}
          </p>
        </div>
        <button type="button" onClick={() => bump((n) => n + 1)} className="cta-ghost">
          Refresh
        </button>
      </div>

      <p className="chart-note">These describe timing and mood, not fate.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {counts.map((c) => (
          <div key={c.label} className="curious-box !py-3">
            <p className="text-xs text-[color:var(--text-muted)]">{c.label}</p>
            <p className="text-2xl font-semibold text-[color:var(--text-primary)] leading-tight mt-0.5">{c.value}</p>
            <p className="text-xs text-[color:var(--text-muted)]">{c.help}</p>
          </div>
        ))}
      </div>

      <div className="explore-tabs" role="tablist" aria-label="Ways of comparing today with your birth chart">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`explore-tab ${tab === t.id ? 'explore-tab-active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="explore-tab-desc">{TAB_EXPLAIN[tab]}</p>

      {(tab === 'transits' || tab === 'progressions' || tab === 'asteroids') && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">{listTitle}</h3>
          {aspectList.length === 0 ? (
            <p className="readable-muted">Nothing is close enough to count right now.</p>
          ) : (
            <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {aspectList.slice(0, 24).map((hit, i) => (
                <React.Fragment key={`${hit.transitingId}-${hit.natalId}-${hit.aspectType}-${i}`}>
                  <AspectRow hit={hit} />
                </React.Fragment>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === 'returns' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.returns.map((ret) => {
            const title =
              ret.kind === 'solar'
                ? ret.label.replace(/^Solar return/, 'Solar return (astrological birthday)')
                : ret.kind === 'lunar'
                  ? 'Nearest lunar return'
                  : 'Saturn return';
            const nextSaturnAge = Math.round(Math.ceil(report.ageYears / 29.5) * 29.5);
            const plain =
              ret.kind === 'solar'
                ? 'The Sun comes back to the exact spot it held when you were born. Many people treat it as the start of a personal new year.'
                : ret.kind === 'lunar'
                  ? 'The Moon comes back to its birth position about every 27 days. It is often read as a monthly emotional reset.'
                  : ret.applicable
                    ? 'Saturn takes about 29½ years to circle the sky, and you are within about two years of it reaching its birth position. Traditionally a time for taking stock and growing up.'
                    : `Saturn takes about 29½ years to circle the sky. You are not close to a return right now; the next one is around age ${nextSaturnAge}.`;
            const sun = ret.context?.celestialBodies.find((b) => b.id === 'sun');
            const moon = ret.context?.celestialBodies.find((b) => b.id === 'moon');
            return (
              <div key={ret.kind} className={`curious-box space-y-2 ${ret.applicable ? '' : 'opacity-75'}`}>
                <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--text-primary)]">
                  <PlanetGlyph planet={ret.kind === 'solar' ? 'sun' : ret.kind === 'lunar' ? 'moon' : 'saturn'} size={18} tinted />
                  {title}
                </h3>
                {(ret.kind !== 'saturn') && (
                  <p className="text-xs text-[color:var(--text-muted)]">{formatMoment(ret.momentIso)} (your local time)</p>
                )}
                <p className="text-sm text-[color:var(--text-secondary)] leading-snug">{plain}</p>
                {ret.context && ret.applicable && (
                  <details>
                    <summary className="text-xs text-[color:var(--text-muted)] cursor-pointer">The sky at that moment</summary>
                    <dl className="trad-facts mt-2">
                      <dt>Sun</dt>
                      <dd className="inline-flex items-center gap-1.5">
                        {sun && <SignGlyph sign={sun.zodiacSign} size={16} tinted />}
                        {sun?.zodiacSign} {sun?.signDegree.toFixed(1)}°
                      </dd>
                      <dt>Moon</dt>
                      <dd className="inline-flex items-center gap-1.5">
                        {moon && <SignGlyph sign={moon.zodiacSign} size={16} tinted />}
                        {moon?.zodiacSign} {moon?.signDegree.toFixed(1)}°
                      </dd>
                      <dt>Dreamspell day</dt>
                      <dd>{ret.context.dreamspell.signature}</dd>
                    </dl>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'asteroids' && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Where the asteroids are today</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {report.minorAsteroids.map((a) => (
              <div key={a.id} className="curious-box !py-2 flex flex-wrap items-center gap-x-2">
                <span className="font-semibold text-[color:var(--text-primary)]">{a.name}</span>
                <span className="inline-flex items-center gap-1 text-[color:var(--text-secondary)]">
                  <SignGlyph sign={a.zodiacSign} size={16} tinted />
                  {a.zodiacSign} {a.signDegree.toFixed(1)}°{a.isRetrograde ? ' (appears to move backward)' : ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'moons' && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Moons of other planets</h3>
          <p className="readable-muted">
            Each moon is placed near its parent planet in the zodiac. Treat these as images to reflect on, not
            astronomical measurements.
          </p>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {report.symbolicMoons.map((m) => (
              <div key={`${m.parentBody}-${m.moonName}`} className="curious-box !py-2">
                <div className="flex flex-wrap items-center gap-x-2 text-sm">
                  <span className="font-semibold text-[color:var(--text-primary)]">{m.moonName}</span>
                  <span className="text-[color:var(--text-muted)]">moon of {m.parentBody}</span>
                  <span className="inline-flex items-center gap-1 text-[color:var(--text-secondary)]">
                    <SignGlyph sign={m.zodiacSign} size={16} tinted />
                    {m.zodiacSign} {m.signDegree.toFixed(1)}°
                  </span>
                </div>
                <p className="text-sm text-[color:var(--text-secondary)] mt-1">{stripBoilerplate(m.note)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'progressions' && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Where your progressed planets are</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {report.progressedCtx.celestialBodies
              .filter((b) => ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].includes(b.id))
              .map((b) => (
                <div key={b.id} className="curious-box !py-2">
                  <div className="inline-flex items-center gap-1.5 text-xs text-[color:var(--text-muted)]">
                    <PlanetGlyph planet={b.id} size={16} tinted />
                    {b.name}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-[color:var(--text-primary)]">
                    <SignGlyph sign={b.zodiacSign} size={16} tinted />
                    {b.zodiacSign} {b.signDegree.toFixed(1)}°
                  </div>
                </div>
              ))}
          </div>
          <p className="text-xs text-[color:var(--text-muted)]">
            At age {report.ageYears}, the symbolic clock points to the sky of {report.progressedCtx.input.dateString}{' '}
            (one day after birth for each year of life).
          </p>
        </section>
      )}
    </div>
  );
};
