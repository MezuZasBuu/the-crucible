/**
 * My Crucible Profile + What Changed? instrument
 */

import React, { useEffect, useMemo, useState } from 'react';
import { CompleteCalculationContext, CrucibleProfile, TemporalInput } from '../types';
import { executeCrucibleCalculation } from '../engine/crucibleCore';
import {
  deleteProfile,
  getActiveProfileId,
  loadProfiles,
  setActiveProfileId,
  upsertProfile
} from '../engine/crucibleProfile';
import { birthTimeSensitivity, computeWhatChanged } from '../engine/whatChanged';
import { EpistemicBadge } from './EpistemicBadge';

interface Props {
  transitCtx: CompleteCalculationContext;
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
  onLoadBirthIntoTransit: (birth: TemporalInput, querentName: string) => void;
  onApplyDate: (dateString: string) => void;
  onProfilesChanged?: () => void;
}

export const ProfileWhatChangedPanel: React.FC<Props> = ({
  transitCtx,
  correlationKey,
  onLoadBirthIntoTransit,
  onApplyDate,
  onProfilesChanged
}) => {
  const [profiles, setProfiles] = useState<CrucibleProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('My Profile');
  const [querentName, setQuerentName] = useState(transitCtx.input.querentName || '');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [birthLat, setBirthLat] = useState('');
  const [birthLng, setBirthLng] = useState('');
  const [confidence, setConfidence] = useState<CrucibleProfile['birthTimeConfidence']>('approximate');
  const [windowStart, setWindowStart] = useState('14:00:00');
  const [windowEnd, setWindowEnd] = useState('16:00:00');
  const [compareDate, setCompareDate] = useState(transitCtx.input.dateString);
  const [mode, setMode] = useState<'profile' | 'changed' | 'sensitivity'>('profile');

  useEffect(() => {
    const list = loadProfiles();
    setProfiles(list);
    const aid = getActiveProfileId();
    setActiveId(aid);
    const active = list.find((p) => p.id === aid);
    if (active) {
      setDisplayName(active.displayName);
      setQuerentName(active.querentName);
      setBirthDate(active.birth.dateString);
      setBirthTime(active.birth.timeString);
      setBirthCity(active.birth.location.city || '');
      setBirthLat(String(active.birth.location.latitude));
      setBirthLng(String(active.birth.location.longitude));
      setConfidence(active.birthTimeConfidence);
      if (active.birthTimeWindowStart) setWindowStart(active.birthTimeWindowStart);
      if (active.birthTimeWindowEnd) setWindowEnd(active.birthTimeWindowEnd);
    }
  }, []);

  const birthInput: TemporalInput = useMemo(
    () => ({
      dateString: birthDate || transitCtx.input.dateString,
      timeString: birthTime || '12:00:00',
      timezoneOffsetMinutes: transitCtx.input.timezoneOffsetMinutes,
      isUTC: false,
      location: {
        latitude: parseFloat(birthLat) || transitCtx.input.location.latitude,
        longitude: parseFloat(birthLng) || transitCtx.input.location.longitude,
        city: birthCity || undefined
      },
      querentName: querentName || undefined,
      methodology: transitCtx.input.methodology
    }),
    [birthDate, birthTime, birthLat, birthLng, birthCity, querentName, transitCtx.input]
  );

  const natalReady = Boolean(birthDate);

  const natalCtx = useMemo(
    () => (natalReady ? executeCrucibleCalculation(birthInput, correlationKey) : null),
    [birthInput, correlationKey, natalReady]
  );

  const compareCtx = useMemo(() => {
    return executeCrucibleCalculation(
      {
        ...transitCtx.input,
        dateString: compareDate,
        timeString: '12:00:00'
      },
      correlationKey
    );
  }, [transitCtx.input, compareDate, correlationKey]);

  const changedReport = useMemo(
    () =>
      computeWhatChanged(transitCtx, compareCtx, {
        fromLabel: `${transitCtx.input.dateString} (current)`,
        toLabel: `${compareDate} (compare)`
      }),
    [transitCtx, compareCtx, compareDate]
  );

  const natalVsTransit = useMemo(() => {
    if (!natalCtx) return null;
    return computeWhatChanged(natalCtx, transitCtx, {
      fromLabel: `Natal ${birthDate}`,
      toLabel: `Transit ${transitCtx.input.dateString}`
    });
  }, [natalCtx, transitCtx, birthDate]);

  const sensitivity = useMemo(() => {
    if (confidence !== 'unknown_window') return null;
    const start = executeCrucibleCalculation(
      { ...birthInput, timeString: windowStart },
      correlationKey
    );
    const end = executeCrucibleCalculation({ ...birthInput, timeString: windowEnd }, correlationKey);
    return birthTimeSensitivity(start, end);
  }, [confidence, birthInput, windowStart, windowEnd, correlationKey]);

  const refreshList = () => setProfiles(loadProfiles());

  const save = () => {
    const p = upsertProfile({
      id: activeId || undefined,
      displayName,
      querentName,
      birth: birthInput,
      birthTimeConfidence: confidence,
      birthTimeWindowStart: confidence === 'unknown_window' ? windowStart : undefined,
      birthTimeWindowEnd: confidence === 'unknown_window' ? windowEnd : undefined
    });
    setActiveId(p.id);
    refreshList();
    onProfilesChanged?.();
  };

  return (
    <div className="instrument-panel instrument-panel-solar motion-enter space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--line-soft)] pb-4">
          <div>
            <p className="ui-eyebrow text-[color:var(--solar)]">Personal temporal archive</p>
            <h3 className="panel-title mt-1">My Crucible Profile · What Changed?</h3>
            <p className="font-garamond text-[16px] italic text-[color:var(--text-secondary)] mt-2">
              Person → time → systems → comparison — natal baseline vs transit
            </p>
          </div>
          <div className="flex flex-wrap gap-1 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-1">
            {(
              [
                { id: 'profile' as const, label: 'Profile' },
                { id: 'changed' as const, label: 'What Changed?' },
                { id: 'sensitivity' as const, label: 'Birth-Time Sensitivity' }
              ]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMode(t.id)}
                className={`nav-tab ${
                  mode === t.id ? 'nav-tab-active' : ''
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {mode === 'profile' && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setActiveProfileId(p.id);
                    setActiveId(p.id);
                    onProfilesChanged?.();
                    setDisplayName(p.displayName);
                    setQuerentName(p.querentName);
                    setBirthDate(p.birth.dateString);
                    setBirthTime(p.birth.timeString);
                    setBirthCity(p.birth.location.city || '');
                    setBirthLat(String(p.birth.location.latitude));
                    setBirthLng(String(p.birth.location.longitude));
                    setConfidence(p.birthTimeConfidence);
                  }}
                  className={`cta-ghost min-h-0 px-3 py-2 text-[11px] ${
                    activeId === p.id
                      ? 'border-cyan-400/50 text-[color:var(--temporal-bright)] bg-cyan-400/[0.08]'
                      : ''
                  }`}
                >
                  {p.displayName}
                </button>
              ))}
            </div>

            <div className="form-grid form-grid-3">
              <label className="space-y-1.5">
                <span className="ui-eyebrow">Display name</span>
                <input className="field-input w-full" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </label>
              <label className="space-y-1.5">
                <span className="ui-eyebrow">Querent / name</span>
                <input className="field-input w-full" value={querentName} onChange={(e) => setQuerentName(e.target.value)} />
              </label>
              <label className="space-y-1.5">
                <span className="ui-eyebrow">Birth-time confidence</span>
                <select
                  className="field-input w-full"
                  value={confidence}
                  onChange={(e) => setConfidence(e.target.value as CrucibleProfile['birthTimeConfidence'])}
                >
                  <option value="exact">Exact</option>
                  <option value="approximate">Approximate</option>
                  <option value="unknown_window">Unknown window</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="ui-eyebrow">Birth date</span>
                <input type="date" className="field-input w-full" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </label>
              <label className="space-y-1.5">
                <span className="ui-eyebrow">Birth time</span>
                <input type="time" step={1} className="field-input w-full" value={birthTime} onChange={(e) => setBirthTime(e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value)} />
              </label>
              <label className="space-y-1.5">
                <span className="ui-eyebrow">Birth place</span>
                <input className="field-input w-full" value={birthCity} onChange={(e) => setBirthCity(e.target.value)} />
              </label>
              <label className="space-y-1.5">
                <span className="ui-eyebrow">Latitude</span>
                <input className="field-input data-readout w-full" value={birthLat} onChange={(e) => setBirthLat(e.target.value)} />
              </label>
              <label className="space-y-1.5">
                <span className="ui-eyebrow">Longitude</span>
                <input className="field-input data-readout w-full" value={birthLng} onChange={(e) => setBirthLng(e.target.value)} />
              </label>
            </div>

            {confidence === 'unknown_window' && (
              <div className="flex flex-wrap gap-4 rounded-[var(--radius-md)] border border-amber-400/20 bg-amber-400/[0.04] p-4">
                <label className="space-y-1.5">
                  <span className="ui-eyebrow text-[color:var(--solar)]">Window start</span>
                  <input type="time" step={1} className="field-input data-readout" value={windowStart} onChange={(e) => setWindowStart(e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value)} />
                </label>
                <label className="space-y-1.5">
                  <span className="ui-eyebrow text-[color:var(--solar)]">Window end</span>
                  <input type="time" step={1} className="field-input data-readout" value={windowEnd} onChange={(e) => setWindowEnd(e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value)} />
                </label>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={save} className="cta-primary">
                Save Profile
              </button>
              <button
                type="button"
                onClick={() => onLoadBirthIntoTransit(birthInput, querentName)}
                className="cta-ghost"
              >
                Load Birth into Master Grid
              </button>
              {activeId && (
                <button
                  type="button"
                  onClick={() => {
                    deleteProfile(activeId);
                    setActiveId(null);
                    refreshList();
                    onProfilesChanged?.();
                  }}
                  className="cta-ghost border-rose-400/20 text-rose-300 hover:border-rose-400/50 hover:bg-rose-400/[0.06] hover:text-rose-200"
                >
                  Delete
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4">
                <div className="ui-eyebrow mb-2">Natal snapshot</div>
                {natalCtx ? (
                  <>
                    <p className="text-[color:var(--text-primary)]">Maya {natalCtx.mayan.tzolkin.formatted} · Chinese {natalCtx.chinese.dayPillar.stemPinYin}-{natalCtx.chinese.dayPillar.branchPinYin}</p>
                    <p className="mt-1 text-[color:var(--text-secondary)]">Life Path {natalCtx.numerology.lifePathNumber} · Tribe lens {natalCtx.synthesis.topResonatingTribe.tribe}</p>
                    <p className="font-garamond text-[15px] italic text-[color:var(--text-muted)] mt-2">Archetypal alignment under methodology — not identity.</p>
                  </>
                ) : (
                  <p className="font-garamond text-[15px] text-[color:var(--text-muted)] italic">Enter birth date to lock your natal baseline.</p>
                )}
              </div>
              <div className="rounded-[var(--radius-lg)] border border-cyan-400/15 bg-cyan-400/[0.035] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="ui-eyebrow text-[color:var(--temporal)]">Natal → Transit</span>
                  <EpistemicBadge epistemicClass="COMPARATIVE_ANALOGY" />
                </div>
                <pre className="whitespace-pre-wrap font-garamond text-[15px] leading-relaxed text-[color:var(--text-secondary)]">
                  {natalVsTransit?.summary || 'Lock birth data to compare natal vs today’s transit.'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {mode === 'changed' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <label className="space-y-1.5">
                <span className="ui-eyebrow">Compare to date</span>
                <input type="date" className="field-input data-readout" value={compareDate} onChange={(e) => setCompareDate(e.target.value)} />
              </label>
              <button type="button" onClick={() => onApplyDate(compareDate)} className="cta-ghost">
                Load Compare Date in Grid
              </button>
            </div>
            <pre className="whitespace-pre-wrap rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4 font-garamond text-[16px] leading-relaxed text-[color:var(--text-secondary)]">
              {changedReport.summary}
            </pre>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="rounded-[var(--radius-md)] border border-amber-400/20 bg-amber-400/[0.035] p-4">
                <div className="ui-eyebrow text-[color:var(--solar)] mb-2">Changed ({changedReport.changed.length})</div>
                <ul className="space-y-2 max-h-72 overflow-auto text-sm">
                  {changedReport.changed.map((c) => (
                    <li key={`${c.systemId}-${c.label}`}>
                      <span className="text-gray-500">{c.systemName} · {c.label}</span>
                      <br />
                      <span className="text-rose-800">{c.before}</span> → <span className="text-emerald-800">{c.after}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[var(--radius-md)] border border-cyan-400/20 bg-cyan-400/[0.035] p-4">
                <div className="ui-eyebrow text-[color:var(--temporal)] mb-2">Unchanged ({changedReport.unchanged.length})</div>
                <ul className="space-y-2 max-h-56 overflow-auto text-[color:var(--text-secondary)]">
                  {changedReport.unchanged.slice(0, 20).map((c) => (
                    <li key={`${c.systemId}-${c.label}`}>
                      {c.systemName} · {c.label}: {c.before}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4 space-y-3">
                <div>
                  <div className="ui-eyebrow text-emerald-300 mb-2">Convergence</div>
                  <ul className="text-[color:var(--text-secondary)] space-y-1">
                    {changedReport.convergenceNotes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                    {!changedReport.convergenceNotes.length && <li>None flagged</li>}
                  </ul>
                </div>
                <div>
                  <div className="ui-eyebrow text-rose-300 mb-2">Tension</div>
                  <ul className="text-[color:var(--text-secondary)] space-y-1">
                    {changedReport.tensionNotes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                    {!changedReport.tensionNotes.length && <li>None flagged</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'sensitivity' && (
          <div className="space-y-4 text-sm">
            <p className="font-garamond text-[16px] text-[color:var(--text-secondary)] italic">
              Sensitivity Analysis — results that remain unchanged across your stated birth-time range vs those that change substantially. Not authoritative chart rectification.
            </p>
            {confidence !== 'unknown_window' ? (
              <p className="text-amber-400">Set birth-time confidence to “Unknown window” and define start/end on the Profile tab.</p>
            ) : sensitivity ? (
              <>
                <pre className="whitespace-pre-wrap rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4 font-garamond text-[16px] text-[color:var(--text-secondary)]">{sensitivity.summary}</pre>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-[var(--radius-md)] border border-emerald-400/20 bg-emerald-400/[0.035] p-4">
                    <div className="ui-eyebrow text-emerald-300 mb-2">Stable ({sensitivity.stable.length})</div>
                    <ul className="space-y-2 max-h-48 overflow-auto text-[color:var(--text-secondary)]">
                      {sensitivity.stable.map((s) => (
                        <li key={`${s.systemId}-${s.label}`}>
                          {s.systemName} · {s.label}: {s.before}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[var(--radius-md)] border border-rose-400/20 bg-rose-400/[0.035] p-4">
                    <div className="ui-eyebrow text-rose-300 mb-2">Sensitive ({sensitivity.sensitive.length})</div>
                    <ul className="space-y-2 max-h-48 overflow-auto">
                      {sensitivity.sensitive.map((s) => (
                        <li key={`${s.systemId}-${s.label}`}>
                          <span className="text-gray-500">{s.systemName} · {s.label}</span>
                          <br />
                          <span className="text-rose-800">{s.before}</span> → <span className="text-amber-800">{s.after}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
    </div>
  );
};
