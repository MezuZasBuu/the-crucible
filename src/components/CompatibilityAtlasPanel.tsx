/**
 * Compatibility Atlas — compare two saved profiles across five life fields.
 */

import React, { useMemo, useState } from 'react';
import { CrucibleProfile } from '../types';
import { executeCrucibleCalculation } from '../engine/crucibleCore';
import { loadProfiles } from '../engine/crucibleProfile';
import { CompatibilityReport, computeCompatibility } from '../engine/compatibility';

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

const AREA_LABEL: Record<string, string> = {
  work: 'Work',
  life: 'Daily life',
  love: 'Love',
  business: 'Business',
  friendship: 'Friendship'
};

const AREA_PLAIN: Record<string, string> = {
  work: 'How your working styles and pace fit together.',
  life: 'How your everyday rhythms and long-term directions line up.',
  love: 'How your emotional pace and ways of giving fit together.',
  business: 'How well your strengths cover each other when building something.',
  friendship: 'How easy it is to enjoy each other’s company without an agenda.'
};

function scoreWord(score: number): string {
  if (score >= 75) return 'Strong match';
  if (score >= 55) return 'Good match';
  if (score >= 40) return 'Mixed';
  return 'Takes more effort';
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
  const labelFor = (axis: string, fallback: string) => AREA_LABEL[axis] || fallback;
  const strongest = report ? [...report.axes].sort((x, y) => y.score - x.score)[0] : null;
  const samePerson = Boolean(idA) && idA === idB;

  const personCard = (
    tag: string,
    name: string,
    profile: CrucibleProfile | undefined,
    color: string
  ) => (
    <div className="curious-box text-center lg:col-span-3">
      <p className="text-xs font-semibold" style={{ color }}>{tag}</p>
      <h3 className="text-lg font-semibold text-[color:var(--text-primary)] mt-1 break-words">{name}</h3>
      <dl className="trad-facts mt-3 text-left">
        <dt>Born</dt>
        <dd>{profile?.birth.dateString || 'Not set'}</dd>
        <dt>Place</dt>
        <dd>{profile?.birth.location.city || 'Not set'}</dd>
      </dl>
    </div>
  );

  return (
    <div className="instrument-panel motion-enter space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="ui-eyebrow">Compatibility</p>
          <h2 className="panel-title mt-1">Compare two people</h2>
          <p className="readable-body mt-2 max-w-2xl">
            Pick two saved people to see how their charts and calendars compare in five areas: work, daily life,
            love, business and friendship. A comparison for curiosity, not a verdict.
          </p>
        </div>
        <button type="button" onClick={refresh} className="cta-ghost">
          Reload saved people
        </button>
      </div>

      {list.length < 2 ? (
        <p className="chart-note">
          You need at least <strong>two saved people</strong> to compare. Add each person's name, birth date and
          birth place in the saved people section on this page, then come back here.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1.5 block">
              <span className="field-label">First person</span>
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
            <label className="space-y-1.5 block">
              <span className="field-label">Second person</span>
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

          {samePerson && (
            <p className="chart-note">You have picked the same person twice. Choose a different second person to compare.</p>
          )}

          {report && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {personCard('First person', report.profileALabel, profileA, 'var(--solar-deep)')}

              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <svg
                  viewBox="0 0 300 280"
                  className="w-full max-w-[340px]"
                  role="img"
                  aria-label={`Match scores by area: ${axisOrder
                    .map((ax) => `${labelFor(ax.axis, ax.label)} ${ax.score}`)
                    .join(', ')}`}
                >
                  {[0.25, 0.5, 0.75, 1].map((t) => (
                    <polygon
                      key={t}
                      points={radarPoints([100, 100, 100, 100, 100], 150, 140, 100 * t)}
                      fill="none"
                      stroke="rgba(27,31,59,0.12)"
                      strokeWidth="1"
                    />
                  ))}
                  {axisOrder.map((ax, i) => {
                    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                    const x = 150 + 118 * Math.cos(angle);
                    const y = 140 + 114 * Math.sin(angle);
                    return (
                      <g key={ax.axis}>
                        <line x1="150" y1="140" x2={150 + 100 * Math.cos(angle)} y2={140 + 100 * Math.sin(angle)} stroke="rgba(27,31,59,0.12)" />
                        <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="12" className="text-[color:var(--text-secondary)]">
                          {labelFor(ax.axis, ax.label)}
                        </text>
                      </g>
                    );
                  })}
                  <polygon points={polyA} fill="rgba(217,181,106,0.28)" stroke="#a9812f" strokeWidth="2" />
                </svg>
                <div className="mt-2 text-center">
                  <p className="text-xs text-[color:var(--text-muted)]">Overall match score</p>
                  <p className="text-4xl font-semibold text-[color:var(--text-primary)] leading-tight">
                    {report.overall}
                    <span className="text-base font-normal text-[color:var(--text-muted)]"> out of 100</span>
                  </p>
                  <p className="text-sm text-[color:var(--text-secondary)]">{scoreWord(report.overall)}</p>
                </div>
              </div>

              {personCard('Second person', report.profileBLabel, profileB, 'var(--temporal-deep)')}
            </div>
          )}

          {report && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {report.axes.map((ax) => (
                  <div key={ax.axis} className="curious-box">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-[color:var(--text-primary)]">{labelFor(ax.axis, ax.label)}</span>
                      <span className="text-xl font-semibold text-[color:var(--solar-deep)]">{ax.score}</span>
                    </div>
                    <div className="score-track mt-2" role="img" aria-label={`${ax.score} out of 100`}>
                      <div className="score-fill" style={{ width: `${ax.score}%` }} />
                    </div>
                    <p className="text-xs font-medium text-[color:var(--text-secondary)] mt-2">{scoreWord(ax.score)}</p>
                    <p className="text-xs text-[color:var(--text-muted)] mt-1 leading-snug">
                      {AREA_PLAIN[ax.axis] || ax.summary}
                    </p>
                    {ax.tensions.length > 0 && (
                      <p className="text-xs text-[color:var(--el-fire)] mt-2 leading-snug">
                        Worth talking about: {ax.tensions.join('; ').toLowerCase()}.
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <p className="trad-meaning">
                <strong>In plain words:</strong> {report.profileALabel} and {report.profileBLabel} score{' '}
                {report.overall} out of 100 overall
                {strongest ? `, and their strongest area is ${labelFor(strongest.axis, strongest.label).toLowerCase()}` : ''}.
                Scores are out of 100; higher means the two sets of calendar signs fit together more easily.
              </p>

              <details>
                <summary className="text-sm text-[color:var(--text-secondary)] cursor-pointer">
                  Technical details: what each score is based on
                </summary>
                <div className="mt-3 space-y-3">
                  {report.axes.map((ax) => (
                    <div key={ax.axis} className="text-sm text-[color:var(--text-secondary)]">
                      <p className="font-semibold text-[color:var(--text-primary)]">{labelFor(ax.axis, ax.label)}</p>
                      <p>{ax.summary}</p>
                      {ax.sharedSignals.length > 0 && (
                        <ul className="list-disc pl-5 mt-1">
                          {ax.sharedSignals.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </details>

              <p className="text-xs text-[color:var(--text-muted)]">
                These scores compare calendar signs, elements and numbers from several traditions. They are a
                starting point for conversation and do not predict how any relationship will go.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
};
