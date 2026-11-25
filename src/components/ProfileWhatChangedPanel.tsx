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
import { PlaceSearch } from './location/PlaceSearch';
import { formatUtcOffset, offsetMinutesForLocalTime, zoneForPlace } from '../engine/timezone';

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
  const [displayName, setDisplayName] = useState('');
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

  const birthZone = useMemo(() => {
    const lat = parseFloat(birthLat);
    const lng = parseFloat(birthLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    const zone = zoneForPlace(lat, lng);
    if (!zone) return null;
    const offset = offsetMinutesForLocalTime(zone, birthDate || transitCtx.input.dateString, birthTime || '12:00:00');
    return offset === null ? null : { zone, offset };
  }, [birthLat, birthLng, birthDate, birthTime, transitCtx.input.dateString]);

  const birthInput: TemporalInput = useMemo(
    () => ({
      dateString: birthDate || transitCtx.input.dateString,
      timeString: birthTime || '12:00:00',
      // Local birth time → UTC using the birth place's own time zone on that date.
      timezoneOffsetMinutes: birthZone ? birthZone.offset : transitCtx.input.timezoneOffsetMinutes,
      isUTC: false,
      location: {
        latitude: parseFloat(birthLat) || transitCtx.input.location.latitude,
        longitude: parseFloat(birthLng) || transitCtx.input.location.longitude,
        city: birthCity || undefined
      },
      querentName: querentName || undefined,
      methodology: transitCtx.input.methodology
    }),
    [birthDate, birthTime, birthLat, birthLng, birthCity, querentName, transitCtx.input, birthZone]
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
      displayName: displayName || querentName || 'My chart',
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
            <p className="ui-eyebrow">Your details</p>
            <h3 className="panel-title mt-1">{activeId ? 'Edit your birth details' : 'Add your birth details'}</h3>
            <p className="readable-muted mt-1">Saved on this device only. You can add more than one person.</p>
          </div>
          <div className="seg">
            {(
              [
                { id: 'profile' as const, label: 'Birth details' },
                { id: 'changed' as const, label: 'Compare two dates' },
                { id: 'sensitivity' as const, label: 'Unsure of birth time?' }
              ]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMode(t.id)}
                className={`seg-btn ${mode === t.id ? 'seg-btn-active' : ''}`}
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
                  className={`explore-tab ${activeId === p.id ? 'explore-tab-active' : ''}`}
                >
                  {p.displayName}
                </button>
              ))}
            </div>

            <div className="form-grid form-grid-3">
              <label className="space-y-1.5">
                <span className="field-label">Name</span>
                <input
                  className="field-input w-full"
                  value={querentName}
                  placeholder="e.g. Alex Morgan"
                  onChange={(e) => {
                    setQuerentName(e.target.value);
                    setDisplayName(e.target.value);
                  }}
                />
                <span className="field-help">Used for numerology. A full birth name works best.</span>
              </label>
              <label className="space-y-1.5">
                <span className="field-label">Birth date</span>
                <input type="date" className="field-input w-full" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </label>
              <label className="space-y-1.5">
                <span className="field-label">Birth time (local clock time)</span>
                <input
                  type="time"
                  className="field-input w-full"
                  value={birthTime.slice(0, 5)}
                  disabled={confidence === 'unknown_window'}
                  onChange={(e) => setBirthTime(e.target.value ? `${e.target.value}:00` : '')}
                />
                <span className="field-help">Usually on a birth certificate.</span>
              </label>
              <div className="space-y-1.5 md:col-span-2">
                <label className="field-label" htmlFor="birth-place">Birth place</label>
                <PlaceSearch
                  inputId="birth-place"
                  value={birthCity}
                  onPick={(place) => {
                    setBirthCity(place.label);
                    setBirthLat(place.latitude.toFixed(4));
                    setBirthLng(place.longitude.toFixed(4));
                  }}
                />
                <span className="field-help">
                  {birthLat && birthLng
                    ? `Found: ${Number(birthLat).toFixed(2)}°, ${Number(birthLng).toFixed(2)}°${
                        birthZone ? ` · time zone ${birthZone.zone.replace(/_/g, ' ')} (${formatUtcOffset(birthZone.offset)} on that date)` : ''
                      }`
                    : 'Pick a place from the list so the time zone can be worked out automatically.'}
                </span>
              </div>
              <label className="space-y-1.5">
                <span className="field-label">How sure are you of the time?</span>
                <select
                  className="field-input w-full"
                  value={confidence}
                  onChange={(e) => setConfidence(e.target.value as CrucibleProfile['birthTimeConfidence'])}
                >
                  <option value="exact">Exact (from a record)</option>
                  <option value="approximate">Roughly right</option>
                  <option value="unknown_window">I don’t know the time</option>
                </select>
              </label>
            </div>

            {confidence === 'unknown_window' && (
              <div className="chart-note flex flex-wrap items-end gap-4">
                <p className="basis-full">
                  No problem — your chart will leave out the rising sign and houses. If you know a rough range, enter it to
                  see which results stay the same across it.
                </p>
                <label className="space-y-1.5">
                  <span className="field-label">Earliest possible</span>
                  <input type="time" className="field-input" value={windowStart.slice(0, 5)} onChange={(e) => setWindowStart(`${e.target.value}:00`)} />
                </label>
                <label className="space-y-1.5">
                  <span className="field-label">Latest possible</span>
                  <input type="time" className="field-input" value={windowEnd.slice(0, 5)} onChange={(e) => setWindowEnd(`${e.target.value}:00`)} />
                </label>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={save} className="cta-primary" disabled={!birthDate}>
                {activeId ? 'Save changes' : 'Save and show my chart'}
              </button>
              {activeId && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(null);
                    setDisplayName('');
                    setQuerentName('');
                    setBirthDate('');
                    setBirthTime('');
                    setBirthCity('');
                    setBirthLat('');
                    setBirthLng('');
                  }}
                  className="cta-ghost"
                >
                  Add another person
                </button>
              )}
              <button
                type="button"
                onClick={() => onLoadBirthIntoTransit(birthInput, querentName)}
                className="cta-ghost"
                disabled={!birthDate}
                title="Open the Today reading for the birth date itself"
              >
                See the reading for this birth date
              </button>
              {activeId && (
                <button
                  type="button"
                  onClick={() => {
                    if (!window.confirm('Delete this saved person from this device?')) return;
                    deleteProfile(activeId);
                    setActiveId(null);
                    refreshList();
                    onProfilesChanged?.();
                  }}
                  className="cta-ghost cta-danger"
                >
                  Delete
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4">
                <div className="ui-eyebrow mb-2">Born on this day</div>
                {natalCtx ? (
                  <>
                    <p className="text-[color:var(--text-primary)]">Maya {natalCtx.mayan.tzolkin.formatted} · Chinese {natalCtx.chinese.dayPillar.stemPinYin}-{natalCtx.chinese.dayPillar.branchPinYin}</p>
                    <p className="mt-1 text-[color:var(--text-secondary)]">Life Path {natalCtx.numerology.lifePathNumber} · Calling {natalCtx.synthesis.topCalling.calling}</p>
                    <p className="readable-muted mt-2">What the calendars said on the birth date.</p>
                  </>
                ) : (
                  <p className="font-garamond text-[15px] text-[color:var(--text-muted)] italic">Enter a birth date to see what the calendars said that day.</p>
                )}
              </div>
              <div className="rounded-[var(--radius-lg)] border border-cyan-400/15 bg-cyan-400/[0.035] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="ui-eyebrow">Birth day compared with today</span>
                </div>
                <pre className="whitespace-pre-wrap font-garamond text-[15px] leading-relaxed text-[color:var(--text-secondary)]">
                  {natalVsTransit?.summary || 'Enter a birth date to compare it with today.'}
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
                Open this date in Today
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
                  <div className="ui-eyebrow mb-2">In agreement</div>
                  <ul className="text-[color:var(--text-secondary)] space-y-1">
                    {changedReport.convergenceNotes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                    {!changedReport.convergenceNotes.length && <li>None flagged</li>}
                  </ul>
                </div>
                <div>
                  <div className="ui-eyebrow mb-2">Pulling apart</div>
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
              If you only know roughly when you were born, this shows which results stay the same across your time range and which depend on the exact minute.
            </p>
            {confidence !== 'unknown_window' ? (
              <p className="text-amber-400">On the Birth details tab, choose “I don’t know the time” and enter the earliest and latest possible times.</p>
            ) : sensitivity ? (
              <>
                <pre className="whitespace-pre-wrap rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4 font-garamond text-[16px] text-[color:var(--text-secondary)]">{sensitivity.summary}</pre>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-[var(--radius-md)] border border-emerald-400/20 bg-emerald-400/[0.035] p-4">
                    <div className="ui-eyebrow text-emerald-300 mb-2">Same either way ({sensitivity.stable.length})</div>
                    <ul className="space-y-2 max-h-48 overflow-auto text-[color:var(--text-secondary)]">
                      {sensitivity.stable.map((s) => (
                        <li key={`${s.systemId}-${s.label}`}>
                          {s.systemName} · {s.label}: {s.before}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[var(--radius-md)] border border-rose-400/20 bg-rose-400/[0.035] p-4">
                    <div className="ui-eyebrow text-rose-300 mb-2">Depends on the exact time ({sensitivity.sensitive.length})</div>
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
