/**
 * Primary destinations — four plain-language sections.
 */

import React from 'react';
import { CalendarRange, Compass, Sparkles, UserRound } from 'lucide-react';
import { PrimaryDestination } from '../../app/viewModel';
import { BrandMark } from '../shell/BrandMark';

const ITEMS: Array<{ id: PrimaryDestination; label: string; short: string; hint: string; icon: React.ReactNode }> = [
  { id: 'TODAY', label: 'Today', short: 'Today', hint: 'The reading for today', icon: <Sparkles className="w-[18px] h-[18px]" /> },
  { id: 'YOU', label: 'My chart', short: 'My chart', hint: 'Your birth chart', icon: <UserRound className="w-[18px] h-[18px]" /> },
  { id: 'TIMELINE', label: 'Next 14 days', short: '14 days', hint: 'Day-by-day outlook', icon: <CalendarRange className="w-[18px] h-[18px]" /> },
  { id: 'EXPLORE', label: 'Traditions', short: 'Traditions', hint: 'Calendars, map, questions', icon: <Compass className="w-[18px] h-[18px]" /> }
];

interface AppNavigationProps {
  current: PrimaryDestination;
  onChange: (id: PrimaryDestination) => void;
}

export const AppNavRail: React.FC<AppNavigationProps> = ({ current, onChange }) => (
  <nav aria-label="Primary" className="app-rail hidden lg:flex">
    <div className="app-rail-brand">
      <BrandMark size={40} />
      <div className="hidden xl:block min-w-0">
        <p className="brand-wordmark brand-wordmark-ink">The Crucible</p>
        <p className="app-rail-tag">Many calendars, one day</p>
      </div>
    </div>
    <div className="app-rail-items">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          aria-current={current === item.id ? 'page' : undefined}
          title={item.hint}
          className={`app-rail-item ${current === item.id ? 'app-rail-item-active' : ''}`}
        >
          <span className="app-rail-icon">{item.icon}</span>
          <span className="hidden xl:block min-w-0 text-left">
            <span className="app-rail-label">{item.label}</span>
            <span className="app-rail-hint">{item.hint}</span>
          </span>
        </button>
      ))}
    </div>
    <p className="app-rail-foot hidden xl:block">For reflection, not prediction.</p>
  </nav>
);

export const MobileTabBar: React.FC<AppNavigationProps> = ({ current, onChange }) => (
  <nav aria-label="Primary" className="mobile-tabbar lg:hidden">
    <div className="grid grid-cols-4 gap-1">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          aria-current={current === item.id ? 'page' : undefined}
          className={`mobile-tab ${current === item.id ? 'mobile-tab-active' : ''}`}
        >
          {item.icon}
          {item.short}
        </button>
      ))}
    </div>
  </nav>
);
