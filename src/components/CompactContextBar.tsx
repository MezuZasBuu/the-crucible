/**
 * Compact date/place line with advanced calculation drawer.
 */

import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { CompleteCalculationContext, TemporalInput } from '../types';
import { TemporalControlBar } from './TemporalControlBar';
import { LocalReadingContext } from '../types';
import { FREE_SANCTUARY_PRESETS } from '../engine/freeGeocode';

interface CompactContextBarProps {
  ctx: CompleteCalculationContext;
  local: LocalReadingContext;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
  onCorrelationChange: (k: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384') => void;
  onInputChange: (input: TemporalInput, correlationKey?: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384') => void;
}

export const CompactContextBar: React.FC<CompactContextBarProps> = ({
  ctx,
  local,
  isStreaming,
  onToggleStreaming,
  correlationKey,
  onCorrelationChange,
  onInputChange
}) => {
  const [open, setOpen] = useState(false);

  const quickRegions = FREE_SANCTUARY_PRESETS.slice(0, 6);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {quickRegions.map((preset) => (
          <button
            key={preset.displayName}
            type="button"
            className="cta-ghost !min-h-9 text-[0.82rem]"
            onClick={() =>
              onInputChange({
                ...ctx.input,
                location: {
                  latitude: preset.latitude,
                  longitude: preset.longitude,
                  city: preset.city,
                  country: preset.country
                }
              })
            }
          >
            {preset.city.replace(' Sanctuary', '').replace(' Axis', '')}
          </button>
        ))}
        <button type="button" className="cta-explore !min-h-9" onClick={() => setOpen(true)}>
          <MapPin className="w-4 h-4" />
          Change region
        </button>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-raised)] px-4 py-3 text-left shadow-[var(--shadow-raised)]"
      >
        <div className="min-w-0 flex items-start gap-3">
          <MapPin className="w-4 h-4 mt-0.5 text-[color:var(--temporal)] shrink-0" />
          <div className="min-w-0">
            <p className="readable-body font-semibold truncate">{local.dateLabel}</p>
            <p className="readable-muted text-[0.98rem] mt-0.5">
              World sky · regional overlay: {local.cityLabel} · {local.localTime} local
            </p>
          </div>
        </div>
        <span className="cta-ghost !min-h-9 shrink-0">
          {open ? 'Hide' : 'Adjust'}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="advanced-drawer">
          <p className="ui-eyebrow mb-3">Date, time & region</p>
          <TemporalControlBar
            ctx={ctx}
            onInputChange={onInputChange}
            isStreaming={isStreaming}
            onToggleStreaming={onToggleStreaming}
            correlationKey={correlationKey}
            onCorrelationChange={onCorrelationChange}
          />
        </div>
      )}
    </div>
  );
};
