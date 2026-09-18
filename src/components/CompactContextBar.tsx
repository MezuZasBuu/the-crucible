/**
 * Compact date/place line with world location dropdowns.
 */

import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { CompleteCalculationContext, TemporalInput } from '../types';
import { TemporalControlBar } from './TemporalControlBar';
import { LocalReadingContext } from '../types';
import { LocationPicker } from './location/LocationPicker';

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

  return (
    <div className="space-y-3">
      <LocationPicker
        value={ctx.input.location}
        onChange={(location) => onInputChange({ ...ctx.input, location })}
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-raised)] px-4 py-3 text-left shadow-[var(--shadow-raised)]"
      >
        <div className="min-w-0 flex items-start gap-3">
          <MapPin className="w-4 h-4 mt-0.5 text-[color:var(--temporal)] shrink-0" />
          <div className="min-w-0">
            <p className="readable-body font-semibold">{local.dateLabel}</p>
            <p className="readable-muted text-[0.98rem] mt-0.5">
              Global sky · local overlay: {local.cityLabel} · {local.localTime}
            </p>
          </div>
        </div>
        <span className="cta-ghost !min-h-9 shrink-0">
          {open ? 'Hide' : 'Time & date'}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="advanced-drawer">
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
