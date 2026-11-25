/**
 * Header: brand, guide, account and export. Primary destinations live in the rail / tab bar.
 */

import React from 'react';
import { Download, HelpCircle } from 'lucide-react';
import { CompleteCalculationContext } from '../types';
import { AccountPanel } from './auth/AccountPanel';
import { BrandMark } from './shell/BrandMark';

interface SecureDashboardHeaderProps {
  ctx: CompleteCalculationContext;
  onOpenExport: () => void;
  onOpenGuide: () => void;
}

export const SecureDashboardHeader: React.FC<SecureDashboardHeaderProps> = ({ onOpenExport, onOpenGuide }) => {
  return (
    <header className="instrument-header">
      <div className="w-full px-4 md:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 lg:hidden">
          <BrandMark size={36} />
          <div className="min-w-0">
            <p className="brand-wordmark truncate">The Crucible</p>
          </div>
        </div>
        <p className="hidden lg:block header-tagline">Today’s sky, read through the world’s calendars</p>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:block">
            <AccountPanel compact />
          </div>
          <button type="button" onClick={onOpenGuide} className="cta-ghost" title="How this works">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">How it works</span>
          </button>
          <button type="button" onClick={onOpenExport} className="cta-primary" title="Save or print today’s full report">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Save report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
