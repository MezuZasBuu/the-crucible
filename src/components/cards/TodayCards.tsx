import React from 'react';
import { Compass, Globe2, UserRound } from 'lucide-react';
import {
  CompleteCalculationContext,
  CrucibleProfile,
  DailyBearing,
  DeepReadingRequestBase,
  ReadingFocus,
  ReadingMode
} from '../../types';
import { synthesizeDailyBearing } from '../../engine/editorialSynthesis';
import { FadeInText } from '../ui/FadeInText';
import { SlideCard, SlidePanel } from '../ui/SlideCard';
import { ExpandableDetailCard } from '../ui/ExpandableDetailCard';
import { DomainImpactCards } from './DomainImpactCards';

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

function DomainCards({
  domains,
  deepReadingBase
}: {
  domains: DailyBearing['domains'];
  deepReadingBase?: DeepReadingRequestBase;
}) {
  return <DomainImpactCards domains={domains} deepReadingBase={deepReadingBase} />;
}

export const AtmosphereTriad: React.FC<{
  bearing: DailyBearing;
  deepReadingBase?: DeepReadingRequestBase;
}> = ({ bearing, deepReadingBase }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <ExpandableDetailCard
        label="Emotional atmosphere"
        accent="rose"
        title="Emotional atmosphere"
        body={bearing.atmospheres.emotional}
        preview={<p className="readable-body font-semibold">{bearing.atmospheres.emotional}</p>}
        deepReading={
          deepReadingBase
            ? {
                ...deepReadingBase,
                domainKey: 'emotional',
                seedText: bearing.atmospheres.emotional,
                cardTitle: 'Emotional atmosphere'
              }
            : undefined
        }
      />
      <ExpandableDetailCard
        label="Social atmosphere"
        accent="indigo"
        title="Social atmosphere"
        body={bearing.atmospheres.social}
        preview={<p className="readable-body font-semibold">{bearing.atmospheres.social}</p>}
        deepReading={
          deepReadingBase
            ? {
                ...deepReadingBase,
                domainKey: 'social',
                seedText: bearing.atmospheres.social,
                cardTitle: 'Social atmosphere'
              }
            : undefined
        }
      />
      <ExpandableDetailCard
        label="Work & creative"
        accent="ochre"
        title="Work & creative"
        body={bearing.atmospheres.workCreative}
        preview={<p className="readable-body font-semibold">{bearing.atmospheres.workCreative}</p>}
        deepReading={
          deepReadingBase
            ? {
                ...deepReadingBase,
                domainKey: 'workCreative',
                seedText: bearing.atmospheres.workCreative,
                cardTitle: 'Work & creative'
              }
            : undefined
        }
      />
    </div>
    <DomainCards domains={bearing.domains} deepReadingBase={deepReadingBase} />
  </>
);

export const ExploreFrontButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button type="button" onClick={onClick} className="cta-explore">
    <Compass className="w-5 h-5" />
    Explore systems
  </button>
);
