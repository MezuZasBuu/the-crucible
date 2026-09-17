/**
 * Compact date/place line with advanced calculation drawer.
 */

import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { CompleteCalculationContext, TemporalInput } from '../types';
import { TemporalControlBar } from './TemporalControlBar';
import { LocalReadingContext } from '../types';

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
        className="w-full flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-raised)] px-4 py-3 text-left shadow-[var(--shadow-raised)]"
      >
        <div className="min-w-0 flex items-start gap-3">
          <MapPin className="w-4 h-4 mt-0.5 text-[color:var(--temporal)] shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-[color:var(--text-primary)] truncate">
              {local.dateLabel} · {local.cityLabel}
            </p>
            <p className="text-sm text-[color:var(--text-secondary)] mt-0.5">
              {local.localTime} local · {local.personal ? `Personal reading${local.personalName ? ` for ${local.personalName}` : ''}` : 'Shared daily reading'}
            </p>
          </div>
        </div>
        <span className="cta-ghost !min-h-9 shrink-0">
          Adjust
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="advanced-drawer">
          <p className="ui-eyebrow mb-3">Calculation settings</p>
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
