import React, { useMemo } from 'react';
import { Compass } from 'lucide-react';
import { CompleteCalculationContext, CrucibleProfile, DailyBearing, ReadingFocus } from '../../types';
import { synthesizeDailyBearing } from '../../engine/editorialSynthesis';
import { FadeInText } from '../ui/FadeInText';
import { SlideCard, SlidePanel } from '../ui/SlideCard';
import { ExpandableDetailCard } from '../ui/ExpandableDetailCard';

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

export const OverviewSlideCard: React.FC<{
  ctx: CompleteCalculationContext;
  profile: CrucibleProfile | null;
  focus: ReadingFocus;
}> = ({ ctx, profile, focus }) => {
  const bearings = useMemo(
    () =>
      FOCUSES.map((f) => ({
        id: f.id,
        bearing: synthesizeDailyBearing(ctx, f.id, profile)
      })),
    [ctx, profile]
  );
  const slideIndex = FOCUSES.findIndex((f) => f.id === focus);

  return (
    <SlideCard index={slideIndex} className="card-featured gradient-card-solar">
      {bearings.map(({ id, bearing }) => (
        <SlidePanel key={id} className="card-featured-inner">
          <div className="card-featured-atmosphere" aria-hidden="true" />
          <p className="scroll-label readable-muted relative">Today’s energy · {FOCUSES.find((f) => f.id === id)?.label}</p>
          <FadeInText
            text={bearing.theme}
            as="h2"
            className="detail-title text-[clamp(1.45rem,3vw,2.35rem)] uppercase tracking-[0.04em] mt-2 relative"
            delayMs={0}
          />
          <FadeInText text={bearing.summary} className="readable-body text-[1.15rem] md:text-[1.22rem] leading-relaxed mt-4 max-w-3xl relative" delayMs={120} />
          <FadeInText
            text={`Practice: ${bearing.practice}`}
            className="readable-body text-[1.05rem] font-semibold mt-5 relative"
            delayMs={280}
          />
        </SlidePanel>
      ))}
    </SlideCard>
  );
};

export const AtmosphereTriad: React.FC<{ bearing: DailyBearing }> = ({ bearing }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    <ExpandableDetailCard
      label="Emotional atmosphere"
      accent="rose"
      title="Emotional atmosphere"
      body={bearing.atmospheres.emotional}
      preview={<p className="readable-body font-semibold">{bearing.atmospheres.emotional}</p>}
    />
    <ExpandableDetailCard
      label="Social atmosphere"
      accent="indigo"
      title="Social atmosphere"
      body={bearing.atmospheres.social}
      preview={<p className="readable-body font-semibold">{bearing.atmospheres.social}</p>}
    />
    <ExpandableDetailCard
      label="Work & creative"
      accent="ochre"
      title="Work & creative atmosphere"
      body={bearing.atmospheres.workCreative}
      preview={<p className="readable-body font-semibold">{bearing.atmospheres.workCreative}</p>}
    />
  </div>
);

export const ExploreFrontButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button type="button" onClick={onClick} className="cta-explore">
    <Compass className="w-5 h-5" />
    Explore calendars & systems
  </button>
);
