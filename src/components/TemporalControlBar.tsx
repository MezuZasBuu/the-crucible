/**
 * The Crucible — date, time, name and place form
 * (opens from the "Change date or place" bar).
 */

import React, { useEffect, useState } from 'react';
import { CompleteCalculationContext, TemporalInput } from '../types';
import { FREE_SANCTUARY_PRESETS, geocodeNominatim, GeocodeResult } from '../engine/freeGeocode';
import { LocationPicker } from './location/LocationPicker';

interface TemporalControlBarProps {
  ctx: CompleteCalculationContext;
  onInputChange: (input: TemporalInput, correlationKey?: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384') => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
  onCorrelationChange: (k: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384') => void;
}

export const TemporalControlBar: React.FC<TemporalControlBarProps> = ({
  ctx,
  onInputChange,
  isStreaming,
  onToggleStreaming,
  correlationKey,
  onCorrelationChange
}) => {
  const [dateStr, setDateStr] = useState(ctx.input.dateString);
  const [timeStr, setTimeStr] = useState(ctx.input.timeString);
  const [isUtc, setIsUtc] = useState(ctx.input.isUTC);
  const [placeQuery, setPlaceQuery] = useState(ctx.input.location.city || '');
  const [geoResults, setGeoResults] = useState<GeocodeResult[]>([]);
  const [geoStatus, setGeoStatus] = useState<string>('');

  useEffect(() => {
    if (isStreaming) {
      setDateStr(ctx.input.dateString);
      setTimeStr(ctx.input.timeString);
    }
  }, [ctx.input.dateString, ctx.input.timeString, isStreaming]);

  const handleApply = (newDate = dateStr, newTime = timeStr, newUtc = isUtc) => {
    onInputChange(
      {
        ...ctx.input,
        dateString: newDate,
        timeString: newTime,
        isUTC: newUtc
      },
      correlationKey
    );
  };

  const applyLocation = (loc: GeocodeResult) => {
    setPlaceQuery(loc.city);
    setGeoResults([]);
    setGeoStatus('');
    onInputChange(
      {
        ...ctx.input,
        dateString: dateStr,
        timeString: timeStr,
        isUTC: isUtc,
        location: {
          latitude: loc.latitude,
          longitude: loc.longitude,
          city: loc.city
        }
      },
      correlationKey
    );
  };

  const searchPlace = async () => {
    setGeoStatus('Searching…');
    try {
      const hits = await geocodeNominatim(placeQuery);
      if (!hits.length) {
        setGeoStatus('No places found. Try a different spelling, or pick one of the notable places below.');
        setGeoResults([]);
        return;
      }
      setGeoResults(hits);
      setGeoStatus(hits.length === 1 ? '1 place found. Choose it from the list.' : `${hits.length} places found. Choose one from the list.`);
    } catch {
      setGeoStatus('Place search is not available right now. Pick one of the notable places below instead.');
      setGeoResults([]);
    }
  };

  const setNow = () => {
    const now = new Date();
    const d = now.toISOString().slice(0, 10);
    const t = now.toTimeString().slice(0, 8);
    setDateStr(d);
    setTimeStr(t);
    handleApply(d, t, false);
  };

  const setPresetEpoch = (date: string, time = '12:00:00') => {
    setDateStr(date);
    setTimeStr(time);
    handleApply(date, time, true);
  };

  const famousDates: Array<{ label: string; date: string; time?: string }> = [
    { label: '21 Dec 2012 (end of a Maya great cycle)', date: '2012-12-21' },
    { label: '1 Jan 2000', date: '2000-01-01' },
    { label: '2 Feb 1984 (start of a Chinese 60-year cycle)', date: '1984-02-02' },
    { label: '20 Jul 1969 (Apollo 11 Moon landing)', date: '1969-07-20', time: '20:17:40' },
    { label: '20 Jul 139 AD (Egyptian calendar and Sirius line up)', date: '0139-07-20' }
  ];

  return (
    <div className="instrument-panel !p-5 md:!p-6 motion-enter space-y-5">
      {/* Date and time */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            role="switch"
            checked={isStreaming}
            onChange={onToggleStreaming}
            className="mt-1 h-4 w-4 accent-[color:var(--temporal-deep)]"
          />
          <span>
            <span className="field-label">Use the current time</span>
            <span className="field-help">
              {isStreaming
                ? 'On: the date and time below follow the clock. Turn this off to choose your own.'
                : 'Off: the app shows the date and time you choose below.'}
            </span>
          </span>
        </label>

        <div className="control-bar-section">
          <label className="space-y-1">
            <span className="field-label">Date</span>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => {
                setDateStr(e.target.value);
                handleApply(e.target.value, timeStr, isUtc);
              }}
              className="field-input"
            />
          </label>

          <label className="space-y-1">
            <span className="field-label">Time</span>
            <input
              type="time"
              step="1"
              value={timeStr}
              onChange={(e) => {
                setTimeStr(e.target.value);
                handleApply(dateStr, e.target.value, isUtc);
              }}
              className="field-input"
            />
          </label>

          <div className="space-y-1">
            <span className="field-label">This time is in</span>
            <div className="seg" role="group" aria-label="Time zone for the time above">
              <button
                type="button"
                aria-pressed={!isUtc}
                onClick={() => {
                  if (!isUtc) return;
                  setIsUtc(false);
                  handleApply(dateStr, timeStr, false);
                }}
                className={`seg-btn ${!isUtc ? 'seg-btn-active' : ''}`}
              >
                My local time
              </button>
              <button
                type="button"
                aria-pressed={isUtc}
                onClick={() => {
                  if (isUtc) return;
                  setIsUtc(true);
                  handleApply(dateStr, timeStr, true);
                }}
                className={`seg-btn ${isUtc ? 'seg-btn-active' : ''}`}
              >
                World time (UTC)
              </button>
            </div>
          </div>

          <button type="button" onClick={setNow} className="cta-ghost">
            Set to right now
          </button>
        </div>
      </div>

      {/* Name */}
      <label className="block space-y-1">
        <span className="field-label">Name (optional, used for numerology)</span>
        <input
          type="text"
          value={ctx.input.querentName || ''}
          onChange={(e) => {
            onInputChange(
              {
                ...ctx.input,
                dateString: dateStr,
                timeString: timeStr,
                isUTC: isUtc,
                querentName: e.target.value
              },
              correlationKey
            );
          }}
          placeholder="Your name"
          className="field-input field-input-wide"
        />
        <span className="field-help">Numerology turns the letters of a name into numbers. Leave this empty to skip it.</span>
      </label>

      {/* Place */}
      <div className="space-y-3">
        <div>
          <span className="field-label">Place</span>
          <span className="field-help">
            Now set to {ctx.input.location.city || 'a point on the map'} ({ctx.input.location.latitude.toFixed(2)}°,{' '}
            {ctx.input.location.longitude.toFixed(2)}°).
          </span>
        </div>

        <LocationPicker
          compact
          value={ctx.input.location}
          onChange={(location) =>
            onInputChange(
              { ...ctx.input, dateString: dateStr, timeString: timeStr, isUTC: isUtc, location },
              correlationKey
            )
          }
        />

        <label className="block space-y-1 relative">
          <span className="field-label">Search for another place</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={placeQuery}
              onChange={(e) => setPlaceQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') searchPlace();
              }}
              placeholder="City or landmark"
              className="field-input field-input-wide min-w-[11rem]"
            />
            <button type="button" onClick={searchPlace} className="cta-ghost">
              Search
            </button>
          </div>
          {geoStatus && <span className="field-help" role="status">{geoStatus}</span>}
          {geoResults.length > 0 && (
            <div className="absolute left-0 top-full mt-1 z-30 w-80 max-w-full max-h-48 overflow-auto rounded-[var(--radius-md)] border border-[color:var(--line-medium)] bg-white shadow-[var(--shadow-raised)]">
              {geoResults.map((r) => (
                <button
                  key={`${r.latitude}-${r.longitude}-${r.displayName}`}
                  type="button"
                  onClick={() => applyLocation(r)}
                  className="block w-full text-left px-3 py-2 text-sm text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-well)] hover:text-[color:var(--temporal-deep)] border-b border-[color:var(--line-soft)]"
                >
                  {r.displayName}
                </button>
              ))}
            </div>
          )}
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <span className="field-label mr-1">Notable places</span>
          {FREE_SANCTUARY_PRESETS.map((s) => (
            <button
              key={s.displayName}
              type="button"
              onClick={() => applyLocation(s)}
              className="cta-ghost !min-h-[34px] !text-xs !px-2.5"
            >
              {s.city}
            </button>
          ))}
        </div>
      </div>

      {/* Famous dates */}
      <div className="pt-4 border-t border-[color:var(--line-soft)] flex flex-wrap items-center gap-2">
        <span className="field-label mr-1">Jump to a famous date</span>
        {famousDates.map((ep) => (
          <button
            key={ep.label}
            type="button"
            onClick={() => setPresetEpoch(ep.date, ep.time)}
            className="cta-ghost !min-h-[34px] !text-xs !px-2.5"
          >
            {ep.label}
          </button>
        ))}
      </div>

      {/* Expert-only setting */}
      <details className="pt-4 border-t border-[color:var(--line-soft)]">
        <summary className="cursor-pointer text-sm font-semibold text-[color:var(--text-primary)]">
          Advanced: Maya calendar alignment
        </summary>
        <div className="mt-3 space-y-2">
          <p className="field-help">
            Scholars use slightly different start dates for the Maya count, which shifts the Maya dates by a day or two
            (or, for the oldest proposal, by centuries). The first option is the standard one; most people never need to
            change it.
          </p>
          <label className="block space-y-1">
            <span className="field-label">Start date used for the Maya count</span>
            <select
              value={correlationKey}
              onChange={(e) => onCorrelationChange(e.target.value as any)}
              className="field-input"
            >
              <option value="GMT_584283">Standard (GMT 584283)</option>
              <option value="GMT_584285">Two days later (GMT 584285)</option>
              <option value="SPINDEN_489384">Older Spinden proposal (489384)</option>
            </select>
          </label>
          <p className="field-help">Last calculation took {ctx.executionDurationMs} ms.</p>
        </div>
      </details>
    </div>
  );
};
