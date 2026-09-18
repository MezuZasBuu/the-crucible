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
import { SlideGallery, SlidePanel } from '../ui/SlideGallery';
import { ExpandableDetailCard } from '../ui/ExpandableDetailCard';
import { DomainImpactCards } from './DomainImpactCards';
import { StoryProse } from '../ui/StoryProse';

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
  onNeedAccount?: () => void;
}> = ({ mode, hasProfile, onChange, onNeedAccount }) => (
  <div className="flex flex-wrap gap-2" role="tablist" aria-label="Reading mode">
    <button
      type="button"
      role="tab"
      aria-selected={mode === 'world'}
      onClick={() => onChange('world')}
      className={`nav-tab border inline-flex items-center gap-1.5 ${mode === 'world' ? 'nav-tab-active border-[color:var(--line-medium)]' : 'border-transparent'}`}
    >
      <Globe2 className="w-4 h-4" />
      Today&apos;s world energy
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={mode === 'personal'}
      disabled={!hasProfile}
      onClick={() => {
        if (!hasProfile) {
          onNeedAccount?.();
          return;
        }
        onChange('personal');
      }}
      className={`nav-tab border inline-flex items-center gap-1.5 ${mode === 'personal' ? 'nav-tab-active border-[color:var(--line-medium)]' : 'border-transparent'} ${!hasProfile ? 'opacity-55' : ''}`}
    >
      <UserRound className="w-4 h-4" />
      Your chart energy
    </button>
  </div>
);

export const OverviewSlideCard: React.FC<{
  ctx: CompleteCalculationContext;
  profile: CrucibleProfile | null;
  slideIndex: number;
  onSlideIndexChange: (i: number) => void;
  mode: ReadingMode;
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
  heroBearing?: DailyBearing;
}> = ({ ctx, profile, slideIndex, onSlideIndexChange, mode, correlationKey, heroBearing }) => {
  const bearings = React.useMemo(
    () =>
      FOCUSES.map((f) => ({
        id: f.id,
        bearing: synthesizeDailyBearing(ctx, f.id, profile, mode, correlationKey)
      })),
    [ctx, profile, mode, correlationKey]
  );

  return (
    <SlideGallery
      index={slideIndex}
      onIndexChange={onSlideIndexChange}
      panelCount={FOCUSES.length}
      labels={FOCUSES.map((f) => f.label)}
      autoAdvanceMs={6000}
    >
      {bearings.map(({ id, bearing }) => {
        const theme = id === 'overview' && heroBearing ? heroBearing.theme : bearing.theme;
        const summary = id === 'overview' && heroBearing ? heroBearing.summary : bearing.summary;
        const practice = id === 'overview' && heroBearing ? heroBearing.practice : bearing.practice;
        return (
        <SlidePanel key={id} className="card-featured-inner">
          <p className="scroll-label readable-muted">
            {mode === 'world' ? 'World energy' : 'Your chart × today'}
          </p>
          <FadeInText
            text={theme}
            as="h2"
            className="detail-title text-[clamp(1.35rem,2.8vw,2.1rem)] tracking-[0.02em] mt-2"
          />
          <StoryProse text={summary} className="mt-4 text-[1.0625rem] leading-relaxed max-w-3xl" />
          <StoryProse text={`*Practice:* ${practice}`} className="mt-5 text-[1rem] font-medium" />
          {bearing.domains.personalAlignment && (
            <StoryProse text={bearing.domains.personalAlignment} className="mt-4 text-[1rem]" />
          )}
        </SlidePanel>
        );
      })}
    </SlideGallery>
  );
};

const ATMOSPHERE_META = [
  { key: 'emotional' as const, label: 'Emotional atmosphere', domainKey: 'emotional' as const },
  { key: 'social' as const, label: 'Social atmosphere', domainKey: 'social' as const },
  { key: 'workCreative' as const, label: 'Work & creative', domainKey: 'workCreative' as const }
];

export const AtmosphereTriad: React.FC<{
  bearing: DailyBearing;
  deepReadingBase?: DeepReadingRequestBase;
  atmosphereIndex: number;
  onAtmosphereIndexChange: (i: number) => void;
  domainIndex: number;
  onDomainIndexChange: (i: number) => void;
}> = ({
  bearing,
  deepReadingBase,
  atmosphereIndex,
  onAtmosphereIndexChange,
  domainIndex,
  onDomainIndexChange
}) => (
  <>
    <SlideGallery
      index={atmosphereIndex}
      onIndexChange={onAtmosphereIndexChange}
      panelCount={ATMOSPHERE_META.length}
      labels={ATMOSPHERE_META.map((m) => m.label)}
      autoAdvanceMs={4000}
    >
      {ATMOSPHERE_META.map(({ key, label, domainKey }) => (
        <SlidePanel key={key}>
          <ExpandableDetailCard
            label={label}
            title={label}
            body={bearing.atmospheres[key]}
            preview={<StoryProse text={bearing.atmospheres[key]} className="text-[1.0625rem]" />}
            deepReading={
              deepReadingBase
                ? {
                    ...deepReadingBase,
                    domainKey,
                    seedText: bearing.atmospheres[key],
                    cardTitle: label
                  }
                : undefined
            }
          />
        </SlidePanel>
      ))}
    </SlideGallery>

    <DomainImpactCards
      domains={bearing.domains}
      deepReadingBase={deepReadingBase}
      slideIndex={domainIndex}
      onSlideIndexChange={onDomainIndexChange}
    />
  </>
);

export const ExploreFrontButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button type="button" onClick={onClick} className="cta-explore">
    <Compass className="w-5 h-5" />
    Explore systems
  </button>
);
