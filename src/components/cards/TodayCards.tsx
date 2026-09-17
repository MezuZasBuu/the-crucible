import React from 'react';
import { DailyBearing, ReadingFocus } from '../../types';
import { ScrollMetric } from '../ui/ScrollCard';

const FOCUSES: Array<{ id: ReadingFocus; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'work', label: 'Work' },
  { id: 'creativity', label: 'Creativity' }
];

export const FocusSelector: React.FC<{
  value: ReadingFocus;
  onChange: (focus: ReadingFocus) => void;
}> = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-2" role="tablist" aria-label="Reading focus">
    {FOCUSES.map((item) => (
      <button
        key={item.id}
        type="button"
        role="tab"
        aria-selected={value === item.id}
        onClick={() => onChange(item.id)}
        className={`nav-tab border ${value === item.id ? 'nav-tab-active border-[color:var(--line-medium)]' : 'border-transparent'}`}
      >
        {item.label}
      </button>
    ))}
  </div>
);

export const FeaturedReadingCard: React.FC<{ bearing: DailyBearing }> = ({ bearing }) => (
  <article className="card-featured">
    <div className="card-featured-atmosphere" aria-hidden="true" />
    <p className="ui-eyebrow text-[color:var(--solar-deep)] relative">Today’s energy</p>
    <h2 className="font-cinzel text-2xl sm:text-3xl md:text-[2.15rem] tracking-[0.04em] uppercase text-[color:var(--text-primary)] mt-2 leading-tight relative">
      {bearing.theme}
    </h2>
    <p className="font-garamond text-[18px] md:text-[19px] leading-relaxed text-[color:var(--text-secondary)] mt-4 max-w-3xl relative">
      {bearing.summary}
    </p>
    <p className="relative mt-5 text-[15px] text-[color:var(--text-primary)] font-medium">
      Practice: {bearing.practice}
    </p>
  </article>
);

export const AtmosphereTriad: React.FC<{ bearing: DailyBearing }> = ({ bearing }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    <ScrollMetric label="Emotional atmosphere" value={bearing.atmospheres.emotional} accent="rose" />
    <ScrollMetric label="Social atmosphere" value={bearing.atmospheres.social} accent="indigo" />
    <ScrollMetric label="Work & creative" value={bearing.atmospheres.workCreative} accent="ochre" />
  </div>
);
