/**
 * Primary destinations — Pattern-style destinations, not a systems ledger.
 */

import React from 'react';
import { CalendarRange, Compass, Sparkles, UserRound } from 'lucide-react';
import { PrimaryDestination } from '../../app/viewModel';

const ITEMS: Array<{ id: PrimaryDestination; label: string; icon: React.ReactNode }> = [
  { id: 'TODAY', label: 'Today', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'YOU', label: 'You', icon: <UserRound className="w-4 h-4" /> },
  { id: 'TIMELINE', label: 'Timeline', icon: <CalendarRange className="w-4 h-4" /> },
  { id: 'EXPLORE', label: 'Explore', icon: <Compass className="w-4 h-4" /> }
];

interface AppNavigationProps {
  current: PrimaryDestination;
  onChange: (id: PrimaryDestination) => void;
}

export const AppNavRail: React.FC<AppNavigationProps> = ({ current, onChange }) => (
  <nav
    aria-label="Primary"
    className="hidden lg:flex flex-col w-[4.75rem] xl:w-48 shrink-0 border-r border-[color:var(--line-soft)] bg-[color:var(--void-900)]/80 py-5 px-2 xl:px-3 gap-1 sticky top-0 h-screen"
  >
    {ITEMS.map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => onChange(item.id)}
        className={`flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 min-h-11 text-left transition-colors ${
          current === item.id
            ? 'bg-[color:var(--surface-raised)] text-[color:var(--text-primary)] shadow-[var(--shadow-raised)]'
            : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--surface-well)]'
        }`}
      >
        {item.icon}
        <span className="hidden xl:inline font-semibold text-sm">{item.label}</span>
      </button>
    ))}
  </nav>
);

export const MobileTabBar: React.FC<AppNavigationProps> = ({ current, onChange }) => (
  <nav
    aria-label="Primary"
    className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[color:var(--line-soft)] bg-[color:var(--void-850)]/95 backdrop-blur-md px-2 py-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))]"
  >
    <div className="grid grid-cols-4 gap-1">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`flex flex-col items-center gap-1 rounded-[var(--radius-sm)] py-2 text-[11px] font-semibold ${
            current === item.id ? 'text-[color:var(--text-primary)]' : 'text-[color:var(--text-muted)]'
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  </nav>
);
