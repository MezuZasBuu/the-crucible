/**
 * Header: brand + secondary actions. Primary destinations live in the rail / tab bar.
 */

import React from 'react';
import { BookMarked, ShieldCheck } from 'lucide-react';
import { CompleteCalculationContext } from '../types';

interface SecureDashboardHeaderProps {
  ctx: CompleteCalculationContext;
  onOpenExport: () => void;
  onOpenDiagnostics: () => void;
}

export const SecureDashboardHeader: React.FC<SecureDashboardHeaderProps> = ({
  ctx,
  onOpenExport,
  onOpenDiagnostics
}) => {
  return (
    <header className="instrument-header">
      <div className="w-full px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rotate-45 border border-[color:var(--solar)]/50 bg-[color:var(--surface-well)] flex items-center justify-center shadow-[var(--glow-solar)]">
              <div className="w-3.5 h-3.5 -rotate-45 rounded-full bg-[color:var(--temporal)] motion-live" />
            </div>
          </div>
          <div className="min-w-0">
            <h1
              className="font-cinzel text-lg md:text-xl tracking-[0.18em] uppercase text-[color:var(--text-primary)] truncate"
            >
              The Crucible
            </h1>
            <p className="ui-eyebrow mt-1 text-[color:var(--temporal)]">
              Today&apos;s world energy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={onOpenDiagnostics} className="cta-ghost" title="Verify algorithms">
            <ShieldCheck className="w-4 h-4 text-[color:var(--accent-sage)]" />
            <span className="hidden md:inline">Verify</span>
          </button>
          <button type="button" onClick={onOpenExport} className="cta-primary">
            <BookMarked className="w-4 h-4" />
            <span>Codex</span>
          </button>
        </div>
      </div>
    </header>
  );
};
