/**
 * The Crucible — Temporal Input & Real-Time Stream Controller
 * Luminous instrument bar: glass surface, UI fonts, soft glows.
 */

import React, { useEffect, useState } from 'react';
import { CompleteCalculationContext, TemporalInput } from '../types';
import { FREE_SANCTUARY_PRESETS, geocodeNominatim, GeocodeResult } from '../engine/freeGeocode';

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
        setGeoStatus('No hits — try a sanctuary');
        setGeoResults([]);
        return;
      }
      setGeoResults(hits);
      setGeoStatus(`${hits.length} place(s)`);
    } catch {
      setGeoStatus('Geocode unavailable — use sanctuaries');
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

  return (
    <div className="instrument-panel !p-5 md:!p-6 motion-enter space-y-4">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="control-bar-section flex-1">
          <button
            type="button"
            onClick={onToggleStreaming}
            className={`cta-ghost ${isStreaming ? '!border-[color:var(--temporal)] !text-[color:var(--temporal-bright)]' : ''}`}
          >
            <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-[color:var(--temporal)] motion-live' : 'bg-[color:var(--text-muted)]'}`} />
            {isStreaming ? 'Live stream' : 'Stream paused'}
          </button>

          <button type="button" onClick={setNow} className="cta-ghost">
            Now
          </button>

          <label className="space-y-1">
            <span className="ui-eyebrow block">Date</span>
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
            <span className="ui-eyebrow block">Time</span>
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

          <button
            type="button"
            onClick={() => {
              const next = !isUtc;
              setIsUtc(next);
              handleApply(dateStr, timeStr, next);
            }}
            className={`cta-ghost ${isUtc ? '!text-[color:var(--solar-bright)] !border-[color:var(--solar)]/50' : ''}`}
          >
            {isUtc ? 'UTC' : 'Local'}
          </button>

          <label className="space-y-1">
            <span className="ui-eyebrow block">Name</span>
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
          </label>

          <label className="space-y-1 relative">
            <span className="ui-eyebrow block">Place</span>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={placeQuery}
                onChange={(e) => setPlaceQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') searchPlace();
                }}
                placeholder="City / sanctuary"
                className="field-input field-input-wide min-w-[11rem]"
              />
              <button type="button" onClick={searchPlace} className="cta-ghost !min-h-[38px] !px-3">
                Find
              </button>
            </div>
            {geoResults.length > 0 && (
              <div className="absolute left-0 top-full mt-1 z-30 w-80 max-h-48 overflow-auto rounded-[var(--radius-md)] border border-[color:var(--line-medium)] bg-[color:var(--void-900)] shadow-[var(--shadow-raised)]">
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
        </div>

        <div className="control-bar-section shrink-0">
          <div className="hidden md:block text-right">
            <div className="ui-eyebrow">{ctx.input.location.city || 'Coordinates'}</div>
            <div className="data-readout mt-0.5">
              {ctx.input.location.latitude.toFixed(2)}°, {ctx.input.location.longitude.toFixed(2)}°
            </div>
            {geoStatus && <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{geoStatus}</div>}
          </div>

          <label className="space-y-1">
            <span className="ui-eyebrow block">Maya correlation</span>
            <select
              value={correlationKey}
              onChange={(e) => onCorrelationChange(e.target.value as any)}
              className="field-input"
            >
              <option value="GMT_584283">GMT 584283</option>
              <option value="GMT_584285">GMT 584285</option>
              <option value="SPINDEN_489384">Spinden 489384</option>
            </select>
          </label>

          <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] px-3 py-2">
            <div className="ui-eyebrow">Latency</div>
            <div className="text-sm font-semibold text-[color:var(--accent-sage)] mt-0.5">{ctx.executionDurationMs} ms</div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[color:var(--line-soft)] flex flex-wrap items-center gap-2">
        <span className="ui-eyebrow mr-1">Epochs</span>
        {[
          { label: '2012 Baktun', date: '2012-12-21' },
          { label: 'J2000', date: '2000-01-01' },
          { label: 'Jia-Zi 1984', date: '1984-02-02' },
          { label: 'Apollo 11', date: '1969-07-20', time: '20:17:40' },
          { label: 'Sothic 139', date: '0139-07-20' }
        ].map((ep) => (
          <button
            key={ep.label}
            type="button"
            onClick={() => setPresetEpoch(ep.date, ep.time)}
            className="cta-ghost !min-h-[32px] !text-[11px] !px-2.5"
          >
            {ep.label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="ui-eyebrow mr-1">Sanctuaries</span>
        {FREE_SANCTUARY_PRESETS.map((s) => (
          <button
            key={s.displayName}
            type="button"
            onClick={() => applyLocation(s)}
            className="cta-ghost !min-h-[32px] !text-[11px] !px-2.5"
          >
            {s.city}
          </button>
        ))}
      </div>
    </div>
  );
};
