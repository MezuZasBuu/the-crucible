/**
 * Transits, progressions, returns, asteroids & symbolic moons — natal vs live sky
 */

import React, { useMemo, useState } from 'react';
import { CompleteCalculationContext } from '../types';
import { executeCrucibleCalculation } from '../engine/crucibleCore';
import { getActiveProfile, loadProfiles } from '../engine/crucibleProfile';
import { buildChartDynamicsReport, ChartDynamicsReport, CrossChartAspect } from '../engine/chartDynamics';
import { EpistemicBadge } from './EpistemicBadge';
import { ScrollCard, ScrollMetric, ScrollProse } from './ui/ScrollCard';

interface Props {
  transitCtx: CompleteCalculationContext;
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
  refreshKey?: number;
}

type Tab = 'transits' | 'progressions' | 'returns' | 'asteroids' | 'moons';

function AspectRow({ hit }: { hit: CrossChartAspect }) {
  const tone =
    hit.harmony === 'Harmonious'
      ? 'text-emerald-600'
      : hit.harmony === 'Dynamic Tension'
        ? 'text-rose-700'
        : 'text-indigo-700';
  return (
    <div className="scroll-sheet py-3 px-3 space-y-1">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold text-[color:var(--text-primary)]">
          {hit.transitingSymbol} {hit.transitingName} {hit.aspectType} {hit.natalSymbol} {hit.natalName}
        </span>
        <span className={`text-[11px] font-mono uppercase ${tone}`}>
          {hit.orbDeg}° · {hit.isApplying ? 'applying' : 'separating'}
        </span>
      </div>
      <p className="font-garamond text-[15px] text-[color:var(--text-secondary)] leading-snug">{hit.briefing}</p>
    </div>
  );
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
      <div className="instrument-panel instrument-panel-lunar motion-enter space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="ui-eyebrow">Chart Dynamics</p>
            <h2 className="panel-title mt-1">Transits · progressions · returns</h2>
            <p className="font-garamond italic text-[17px] text-[color:var(--text-secondary)] mt-2 max-w-2xl">
              Save and activate a profile below to compare the live sky against your natal baseline.
            </p>
          </div>
          <EpistemicBadge epistemicClass="COMPARATIVE_ANALOGY" />
        </div>
        <p className="text-sm text-[color:var(--text-muted)]">
          {profiles.length === 0
            ? 'No profiles yet — use My Crucible Profile to add birth data.'
            : `${profiles.length} profile(s) on file — select one as active in the profile panel.`}
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

  return (
    <div className="instrument-panel instrument-panel-lunar motion-enter space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="ui-eyebrow">Chart Dynamics</p>
          <h2 className="panel-title mt-1">{report.natalLabel} · age {report.ageYears}y</h2>
          <ScrollProse className="mt-3 max-w-3xl text-[16px]">{report.openingBriefing}</ScrollProse>
        </div>
        <div className="flex items-center gap-2">
          <EpistemicBadge epistemicClass="COMPARATIVE_ANALOGY" />
          <button type="button" onClick={() => bump((n) => n + 1)} className="cta-ghost">
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ScrollMetric label="Transit hits" value={String(report.transitToNatal.length)} sub="to natal" accent="indigo" />
        <ScrollMetric
          label="Progressed hits"
          value={String(report.progressedToNatal.length)}
          sub="secondary"
          accent="sage"
        />
        <ScrollMetric label="Asteroid hits" value={String(report.asteroidTransits.length)} sub="minor bodies" accent="ochre" />
        <ScrollMetric
          label="Returns"
          value={String(report.returns.filter((r) => r.applicable).length)}
          sub="active windows"
          accent="rose"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${
              tab === t.id
                ? 'bg-[color:var(--void-900)] border-[color:var(--line-strong)] text-[color:var(--text-primary)]'
                : 'border-[color:var(--line-soft)] text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(tab === 'transits' || tab === 'progressions' || tab === 'asteroids') && (
        <ScrollCard
          label={
            tab === 'transits'
              ? 'Transit-to-natal aspects'
              : tab === 'progressions'
                ? 'Secondary progressed-to-natal'
                : 'Asteroid transits to natal'
          }
          accent={tab === 'progressions' ? 'sage' : tab === 'asteroids' ? 'ochre' : 'indigo'}
        >
          {aspectList.length === 0 ? (
            <p className="text-sm text-[color:var(--text-muted)]">No major aspects inside orb for this layer.</p>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {aspectList.slice(0, 24).map((hit, i) => (
                <div key={`${hit.transitingId}-${hit.natalId}-${hit.aspectType}-${i}`}>
                  <AspectRow hit={hit} />
                </div>
              ))}
            </div>
          )}
        </ScrollCard>
      )}

      {tab === 'returns' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.returns.map((ret) => (
            <ScrollCard
              key={ret.kind}
              label={ret.label}
              accent={ret.kind === 'saturn' ? 'slate' : ret.kind === 'lunar' ? 'indigo' : 'terracotta'}
              className={ret.applicable ? '' : 'opacity-75'}
            >
              <p className="text-xs font-mono text-[color:var(--text-muted)] mb-2">
                {ret.momentIso.slice(0, 19).replace('T', ' ')} UTC
              </p>
              <p className="font-garamond text-[15px] text-[color:var(--text-secondary)] leading-snug">{ret.briefing}</p>
              {ret.context && ret.applicable && (
                <div className="mt-3 pt-3 border-t border-[color:var(--line-soft)] text-xs space-y-1">
                  <div>
                    Sun: {ret.context.celestialBodies.find((b) => b.id === 'sun')?.zodiacSign}{' '}
                    {ret.context.celestialBodies.find((b) => b.id === 'sun')?.signDegree.toFixed(1)}°
                  </div>
                  <div>
                    Moon: {ret.context.celestialBodies.find((b) => b.id === 'moon')?.zodiacSign}{' '}
                    {ret.context.celestialBodies.find((b) => b.id === 'moon')?.signDegree.toFixed(1)}°
                  </div>
                  <div>
                    Dreamspell: {ret.context.dreamspell.signature}
                  </div>
                </div>
              )}
            </ScrollCard>
          ))}
        </div>
      )}

      {tab === 'asteroids' && (
        <ScrollCard label="Minor body positions (transit sky)" accent="ochre">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {report.minorAsteroids.map((a) => (
              <div key={a.id} className="scroll-sheet px-3 py-2">
                <span className="font-semibold">{a.symbol} {a.name}</span>
                <span className="text-[color:var(--text-muted)] ml-2">
                  {a.zodiacSign} {a.signDegree.toFixed(1)}°{a.isRetrograde ? ' Rx' : ''}
                </span>
              </div>
            ))}
          </div>
        </ScrollCard>
      )}

      {tab === 'moons' && (
        <ScrollCard label="Symbolic lunar telemetry" accent="indigo">
          <p className="text-xs text-[color:var(--text-muted)] mb-3">
            Anchored to parent planet longitudes — interpretive layer, not JPL ephemeris.
          </p>
          <div className="space-y-2 max-h-[480px] overflow-y-auto">
            {report.symbolicMoons.map((m) => (
              <div key={`${m.parentBody}-${m.moonName}`} className="scroll-sheet px-3 py-2">
                <div className="flex flex-wrap gap-2 text-sm font-semibold">
                  <span>{m.symbol} {m.moonName}</span>
                  <span className="text-[color:var(--text-muted)] font-normal">({m.parentBody})</span>
                  <span className="text-indigo-700 font-mono text-xs">
                    {m.zodiacSign} {m.signDegree.toFixed(1)}°
                  </span>
                </div>
                <p className="font-garamond text-[14px] text-[color:var(--text-secondary)] mt-1">{m.note}</p>
              </div>
            ))}
          </div>
        </ScrollCard>
      )}

      {tab === 'progressions' && (
        <ScrollCard label="Progressed chart snapshot" accent="sage">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {report.progressedCtx.celestialBodies
              .filter((b) => ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].includes(b.id))
              .map((b) => (
                <div key={b.id} className="scroll-sheet px-2 py-2">
                  <div className="text-[color:var(--text-muted)] uppercase">{b.name}</div>
                  <div className="text-[color:var(--text-primary)]">
                    {b.zodiacSign} {b.signDegree.toFixed(1)}°
                  </div>
                </div>
              ))}
          </div>
          <p className="text-xs text-[color:var(--text-muted)] mt-3">
            Secondary progression date: {report.progressedCtx.input.dateString} (1 day ≈ 1 year).
          </p>
        </ScrollCard>
      )}
    </div>
  );
};
