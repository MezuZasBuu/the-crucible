/**
 * Compact date/place line with world location dropdowns.
 */

import React, { useState } from 'react';
import { CalendarDays, ChevronDown, Clock, MapPin } from 'lucide-react';
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
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="context-bar"
      >
        <span className="context-bar-item">
          <CalendarDays className="w-4 h-4" />
          {local.dateLabel}
        </span>
        <span className="context-bar-item">
          <Clock className="w-4 h-4" />
          {local.localTime}
        </span>
        <span className="context-bar-item">
          <MapPin className="w-4 h-4" />
          {local.cityLabel}
        </span>
        <span className="context-bar-action">
          {open ? 'Done' : 'Change date or place'}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="advanced-drawer space-y-4">
          <LocationPicker
            value={ctx.input.location}
            onChange={(location) => onInputChange({ ...ctx.input, location })}
          />
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
