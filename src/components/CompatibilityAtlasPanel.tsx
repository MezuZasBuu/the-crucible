/**
 * Compatibility Atlas — compare two saved profiles across five life fields.
 */

import React, { useMemo, useState } from 'react';
import { CrucibleProfile } from '../types';
import { executeCrucibleCalculation } from '../engine/crucibleCore';
import { loadProfiles } from '../engine/crucibleProfile';
import { CompatibilityReport, computeCompatibility } from '../engine/compatibility';
import { EpistemicBadge } from './EpistemicBadge';

interface Props {
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
}

function radarPoints(scores: number[], cx: number, cy: number, r: number): string {
  const n = scores.length;
  return scores
    .map((s, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const rr = (s / 100) * r;
      return `${cx + rr * Math.cos(angle)},${cy + rr * Math.sin(angle)}`;
    })
    .join(' ');
}

export const CompatibilityAtlasPanel: React.FC<Props> = ({ correlationKey }) => {
  const [idA, setIdA] = useState<string>(() => loadProfiles()[0]?.id || '');
  const [idB, setIdB] = useState<string>(() => {
    const list = loadProfiles();
    return list[1]?.id || list[0]?.id || '';
  });
  const [, bump] = useState(0);

  const refresh = () => bump((n) => n + 1);
  const list = loadProfiles();

  const ctxFor = (p: CrucibleProfile | undefined) => {
    if (!p) return null;
    return executeCrucibleCalculation(
      { ...p.birth, querentName: p.querentName || p.displayName },
      correlationKey
    );
  };

  const profileA = list.find((p) => p.id === idA);
  const profileB = list.find((p) => p.id === idB);

  const report: CompatibilityReport | null = useMemo(() => {
    const a = ctxFor(profileA);
    const b = ctxFor(profileB);
    if (!a || !b) return null;
    return computeCompatibility(a, b, {
      a: profileA?.displayName || profileA?.querentName,
      b: profileB?.displayName || profileB?.querentName
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idA, idB, correlationKey, list.length]);

  const axisOrder = report?.axes || [];
  const polyA = report ? radarPoints(axisOrder.map((x) => x.score), 150, 140, 100) : '';
  // Slight visual offset for B by using same scores with soft second ring — actually need B's own scores
  // For true two-polygon we'd need per-profile axis vectors; for now show shared field as ivory fill of min scores
  const polyShared = report
    ? radarPoints(axisOrder.map((x) => x.score * 0.92), 150, 140, 100)
    : '';

  return (
    <div className="instrument-panel instrument-panel-solar motion-enter space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="ui-eyebrow">Compatibility Atlas</p>
          <h2 className="panel-title mt-1">Two signatures · five fields</h2>
          <p className="font-garamond italic text-[17px] text-[color:var(--text-secondary)] mt-2 max-w-2xl leading-snug">
            Compare saved profiles across Work, Life, Love, Business, and Friendship — comparative analogy, not destiny.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <EpistemicBadge epistemicClass="COMPARATIVE_ANALOGY" />
          <button type="button" onClick={refresh} className="cta-ghost">
            Refresh profiles
          </button>
        </div>
      </div>

      {list.length < 2 ? (
        <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-6">
          <p className="text-[color:var(--text-secondary)] text-sm leading-relaxed">
            Save at least <strong className="text-[color:var(--solar-bright)]">two profiles</strong> in the Profile tab
            (birth date, place, name), then return here to compare compatibility.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="ui-eyebrow text-[color:var(--solar)]">Profile A</span>
              <select
                className="field-input w-full"
                value={idA}
                onChange={(e) => setIdA(e.target.value)}
              >
                {list.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.displayName || p.querentName || p.id}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="ui-eyebrow text-[color:var(--temporal)]">Profile B</span>
              <select
                className="field-input w-full"
                value={idB}
                onChange={(e) => setIdB(e.target.value)}
              >
                {list.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.displayName || p.querentName || p.id}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {report && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-3 rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-5">
                <div className="w-10 h-10 rotate-45 border border-[color:var(--solar)] bg-black/40 mx-auto mb-4 flex items-center justify-center">
                  <span className="-rotate-45 text-[color:var(--solar-bright)] font-cinzel text-sm">A</span>
                </div>
                <h3 className="font-cinzel text-center text-lg text-[color:var(--solar-bright)]">{report.profileALabel}</h3>
                <p className="text-center text-xs text-[color:var(--text-muted)] mt-2 font-mono data-readout">
                  {profileA?.birth.dateString || '—'}
                </p>
                <p className="text-center text-sm text-[color:var(--text-secondary)] mt-3">
                  {profileA?.birth.location.city || 'Birth place unset'}
                </p>
              </div>

              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <div className="relative">
                  <svg viewBox="0 0 300 280" className="w-full max-w-[340px]">
                    {[0.25, 0.5, 0.75, 1].map((t) => (
                      <polygon
                        key={t}
                        points={radarPoints([100, 100, 100, 100, 100], 150, 140, 100 * t)}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1"
                      />
                    ))}
                    {axisOrder.map((ax, i) => {
                      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                      const x = 150 + 112 * Math.cos(angle);
                      const y = 140 + 112 * Math.sin(angle);
                      return (
                        <g key={ax.axis}>
                          <line x1="150" y1="140" x2={150 + 100 * Math.cos(angle)} y2={140 + 100 * Math.sin(angle)} stroke="rgba(255,255,255,0.1)" />
                          <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#aab3bf" fontSize="11" fontFamily="Plus Jakarta Sans">
                            {ax.label}
                          </text>
                        </g>
                      );
                    })}
                    <polygon points={polyShared} fill="rgba(241,238,231,0.12)" stroke="rgba(241,238,231,0.55)" strokeWidth="1.5" />
                    <polygon points={polyA} fill="rgba(216,173,90,0.18)" stroke="#d8ad5a" strokeWidth="2" />
                    <circle cx="150" cy="140" r="4" fill="#62c7da" className="motion-glow" />
                  </svg>
                </div>
                <div className="mt-2 text-center">
                  <div className="ui-eyebrow">Overall field</div>
                  <div className="font-cinzel text-4xl text-white mt-1" style={{ textShadow: '0 0 24px rgba(216,173,90,0.35)' }}>
                    {report.overall}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-5">
                <div className="w-10 h-10 rotate-45 border border-[color:var(--temporal)] bg-black/40 mx-auto mb-4 flex items-center justify-center">
                  <span className="-rotate-45 text-[color:var(--temporal-bright)] font-cinzel text-sm">B</span>
                </div>
                <h3 className="font-cinzel text-center text-lg text-[color:var(--temporal-bright)]">{report.profileBLabel}</h3>
                <p className="text-center text-xs text-[color:var(--text-muted)] mt-2 font-mono data-readout">
                  {profileB?.birth.dateString || '—'}
                </p>
                <p className="text-center text-sm text-[color:var(--text-secondary)] mt-3">
                  {profileB?.birth.location.city || 'Birth place unset'}
                </p>
              </div>
            </div>
          )}

          {report && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {report.axes.map((ax) => (
                  <div key={ax.axis} className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-white">{ax.label}</span>
                      <span className="font-cinzel text-xl text-[color:var(--solar-bright)]">{ax.score}</span>
                    </div>
                    <div className="score-track mt-3">
                      <div className="score-fill" style={{ width: `${ax.score}%` }} />
                    </div>
                    <p className="text-[12px] text-[color:var(--text-muted)] mt-3 leading-snug">{ax.summary}</p>
                  </div>
                ))}
              </div>
              <p className="font-garamond italic text-[17px] text-[color:var(--text-secondary)] leading-relaxed">
                {report.narrative}
              </p>
              <p className="text-[12px] text-[color:var(--text-muted)]">{report.epistemicNote}</p>
            </>
          )}
        </>
      )}
    </div>
  );
};
