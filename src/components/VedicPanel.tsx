/**
 * Vedic Jyotish module — nakshatra, tithi, yoga, karana from core context.
 */

import React from 'react';
import { CompleteCalculationContext } from '../types';
import { EpistemicBadge } from './EpistemicBadge';

export const VedicPanel: React.FC<{ ctx: CompleteCalculationContext }> = ({ ctx }) => {
  const v = ctx.vedic;

  if (!v) {
    return (
      <div className="instrument-panel instrument-panel-vedic motion-enter">
        <p className="ui-eyebrow">Vedic · Jyotish</p>
        <p className="font-garamond italic text-[16px] text-[color:var(--text-secondary)] mt-2">
          Vedic layer disabled in methodology. Enable <span className="text-[color:var(--solar-bright)]">includeVedic</span> to compute Lahiri nakshatra / tithi.
        </p>
      </div>
    );
  }

  return (
    <div className="instrument-panel instrument-panel-vedic motion-enter space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="ui-eyebrow text-[color:var(--solar)]">Vedic · Jyotish (Lahiri)</p>
          <h4 className="panel-title mt-1">Sidereal luminaries</h4>
        </div>
        <div className="flex items-center gap-3">
          <EpistemicBadge epistemicClass={v.epistemicClass || 'SYSTEM_INTERPRETATION'} />
          <span className="data-readout">Ayanamsha {v.lahiriAyanamshaDeg.toFixed(2)}°</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4">
          <p className="ui-eyebrow text-[color:var(--solar)]">Nakshatra</p>
          <div className="font-cinzel text-xl text-[color:var(--text-primary)] mt-2">
            {v.nakshatraName} · #{v.nakshatraNumber}
          </div>
          <p className="text-sm text-[color:var(--text-secondary)] mt-1">
            Pada {v.nakshatraPada} · Lord {v.nakshatraLord}
          </p>
          <p className="font-garamond italic text-[15px] text-[color:var(--text-muted)] mt-2">
            {v.nakshatraDeity} · {v.nakshatraShakti}
          </p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4">
          <p className="ui-eyebrow text-[color:var(--solar)]">Tithi · Yoga · Karana</p>
          <div className="text-[color:var(--text-primary)] mt-2 text-lg">{v.tithiName} (#{v.tithiNumber})</div>
          <p className="text-sm text-[color:var(--text-secondary)]">{v.paksha}</p>
          <p className="text-sm text-[color:var(--text-secondary)] mt-2">Yoga {v.yogaName}</p>
          <p className="text-sm text-[color:var(--text-secondary)]">Karana {v.karanaName}</p>
        </div>
        <div className="md:col-span-2 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4">
          <p className="ui-eyebrow mb-2">Sidereal luminaries</p>
          <p className="data-readout">
            Sun {v.siderealSunDeg.toFixed(2)}° · Moon {v.siderealMoonDeg.toFixed(2)}°
          </p>
          <p className="font-garamond italic text-[15px] text-[color:var(--text-muted)] mt-2">
            Symbol: {v.nakshatraSymbol}. Sidereal reading sits beside tropical ephemeris—do not collapse them.
          </p>
        </div>
      </div>
    </div>
  );
};
