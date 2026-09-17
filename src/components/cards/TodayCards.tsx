import React from 'react';
import { Compass, Globe2, UserRound } from 'lucide-react';
import {
  CompleteCalculationContext,
  CrucibleProfile,
  DailyBearing,
  DomainImpacts,
  ReadingFocus,
  ReadingMode
} from '../../types';
import { synthesizeDailyBearing } from '../../engine/editorialSynthesis';
import { FadeInText } from '../ui/FadeInText';
import { SlideCard, SlidePanel } from '../ui/SlideCard';
import { ExpandableDetailCard } from '../ui/ExpandableDetailCard';

const FOCUSES: Array<{ id: ReadingFocus; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'mood', label: 'Mood' },
  { id: 'relationships', label: 'People' },
  { id: 'work', label: 'Work' },
  { id: 'travel', label: 'Travel' },
  { id: 'finance', label: 'Finance' },
  { id: 'tech', label: 'Tech' },
  { id: 'creativity', label: 'Creative' }
];

export const ReadingModeToggle: React.FC<{
  mode: ReadingMode;
  hasProfile: boolean;
  onChange: (mode: ReadingMode) => void;
}> = ({ mode, hasProfile, onChange }) => (
  <div className="flex flex-wrap gap-2" role="tablist" aria-label="Reading mode">
    <button
      type="button"
      role="tab"
      aria-selected={mode === 'world'}
      onClick={() => onChange('world')}
      className={`nav-tab border inline-flex items-center gap-1.5 ${mode === 'world' ? 'nav-tab-active border-[color:var(--line-medium)]' : 'border-transparent'}`}
    >
      <Globe2 className="w-4 h-4" />
      Today’s world energy
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={mode === 'personal'}
      disabled={!hasProfile}
      onClick={() => onChange('personal')}
      className={`nav-tab border inline-flex items-center gap-1.5 ${mode === 'personal' ? 'nav-tab-active border-[color:var(--line-medium)]' : 'border-transparent'} ${!hasProfile ? 'opacity-45 cursor-not-allowed' : ''}`}
    >
      <UserRound className="w-4 h-4" />
      Your chart energy
    </button>
  </div>
);

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
  mode: ReadingMode;
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
}> = ({ ctx, profile, focus, mode, correlationKey }) => {
  const bearings = React.useMemo(
    () =>
      FOCUSES.map((f) => ({
        id: f.id,
        bearing: synthesizeDailyBearing(ctx, f.id, profile, mode, correlationKey)
      })),
    [ctx, profile, mode, correlationKey]
  );
  const slideIndex = Math.max(0, FOCUSES.findIndex((f) => f.id === focus));

  return (
    <SlideCard index={slideIndex} className="card-featured gradient-card-solar">
      {bearings.map(({ id, bearing }) => (
        <SlidePanel key={id} className="card-featured-inner">
          <div className="card-featured-atmosphere" aria-hidden="true" />
          <p className="scroll-label readable-muted relative">
            {mode === 'world' ? 'World energy' : 'Your chart × today'} · {FOCUSES.find((f) => f.id === id)?.label}
          </p>
          <FadeInText text={bearing.theme} as="h2" className="detail-title text-[clamp(1.45rem,3vw,2.35rem)] uppercase tracking-[0.04em] mt-2 relative" />
          <FadeInText text={bearing.summary} className="readable-body text-[1.15rem] md:text-[1.22rem] leading-relaxed mt-4 max-w-3xl relative" delayMs={120} />
          <FadeInText text={`Practice: ${bearing.practice}`} className="readable-body text-[1.05rem] font-semibold mt-5 relative" delayMs={280} />
          {bearing.domains.personalAlignment && (
            <FadeInText text={bearing.domains.personalAlignment} className="readable-body text-[1.02rem] mt-4 relative" delayMs={360} />
          )}
        </SlidePanel>
      ))}
    </SlideCard>
  );
};

function DomainCards({ domains }: { domains: DomainImpacts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      <ExpandableDetailCard label="Why today feels this way" accent="solar" title="Why today" body={domains.whyToday} preview={<p className="readable-body font-semibold">{domains.whyToday}</p>} />
      <ExpandableDetailCard label="Collective mood" accent="rose" title="Mood" body={domains.mood} preview={<p className="readable-body font-semibold">{domains.mood}</p>} />
      <ExpandableDetailCard label="People & relationships" accent="indigo" title="People" body={domains.people} preview={<p className="readable-body font-semibold">{domains.people}</p>} />
      <ExpandableDetailCard label="Travel & movement" accent="sage" title="Travel" body={domains.travel} preview={<p className="readable-body font-semibold">{domains.travel}</p>} />
      <ExpandableDetailCard label="Money & resources" accent="ochre" title="Finance" body={domains.finance} preview={<p className="readable-body font-semibold">{domains.finance}</p>} />
      <ExpandableDetailCard label="Tech & messages" accent="slate" title="Technology" body={domains.tech} preview={<p className="readable-body font-semibold">{domains.tech}</p>} />
    </div>
  );
}

export const AtmosphereTriad: React.FC<{ bearing: DailyBearing }> = ({ bearing }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <ExpandableDetailCard label="Emotional atmosphere" accent="rose" title="Emotional atmosphere" body={bearing.atmospheres.emotional} preview={<p className="readable-body font-semibold">{bearing.atmospheres.emotional}</p>} />
      <ExpandableDetailCard label="Social atmosphere" accent="indigo" title="Social atmosphere" body={bearing.atmospheres.social} preview={<p className="readable-body font-semibold">{bearing.atmospheres.social}</p>} />
      <ExpandableDetailCard label="Work & creative" accent="ochre" title="Work & creative" body={bearing.atmospheres.workCreative} preview={<p className="readable-body font-semibold">{bearing.atmospheres.workCreative}</p>} />
    </div>
    <DomainCards domains={bearing.domains} />
  </>
);

export const ExploreFrontButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button type="button" onClick={onClick} className="cta-explore">
    <Compass className="w-5 h-5" />
    Explore systems
  </button>
);
