/**
 * Today — story-first world energy; galleries auto-advance every 4 seconds.
 */

import React, { useMemo, useState } from 'react';
import { ArrowRight, BookmarkPlus, BookMarked, Check } from 'lucide-react';
import { CompleteCalculationContext, CrucibleProfile, ReadingMode } from '../types';
import { synthesizeDailyBearing } from '../engine/editorialSynthesis';
import { saveInsight } from '../engine/savedInsights';
import { AtmosphereTriad, ExploreFrontButton, OverviewSlideCard, ReadingModeToggle } from './cards/TodayCards';
import { ExpandableDetailCard } from './ui/ExpandableDetailCard';
import { StoryProse } from './ui/StoryProse';

interface TodayScreenProps {
  ctx: CompleteCalculationContext;
  profile: CrucibleProfile | null;
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
  onOpenCodex: () => void;
  onOpenCompass: () => void;
  onOpenYou: () => void;
  onOpenExplore: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  ctx,
  profile,
  correlationKey,
  onOpenCodex,
  onOpenCompass,
  onOpenYou,
  onOpenExplore
}) => {
  const [overviewIndex, setOverviewIndex] = useState(0);
  const [atmosphereIndex, setAtmosphereIndex] = useState(0);
  const [domainIndex, setDomainIndex] = useState(0);
  const [mode, setMode] = useState<ReadingMode>('world');
  const [whyOpen, setWhyOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const bearing = useMemo(
    () => synthesizeDailyBearing(ctx, 'overview', profile, mode, correlationKey),
    [ctx, profile, mode, correlationKey]
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <ReadingModeToggle mode={mode} hasProfile={Boolean(profile)} onChange={setMode} />

      <div className="flex flex-wrap items-center justify-end gap-3">
        <ExploreFrontButton onClick={onOpenExplore} />
      </div>

      <OverviewSlideCard
        ctx={ctx}
        profile={profile}
        slideIndex={overviewIndex}
        onSlideIndexChange={setOverviewIndex}
        mode={mode}
        correlationKey={correlationKey}
      />

      <AtmosphereTriad
        bearing={bearing}
        deepReadingBase={{ context: ctx, profile, mode }}
        atmosphereIndex={atmosphereIndex}
        onAtmosphereIndexChange={setAtmosphereIndex}
        domainIndex={domainIndex}
        onDomainIndexChange={setDomainIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpandableDetailCard
          label="Local overlay"
          title={`How the day lands · ${bearing.localContext.cityLabel}`}
          body={`Local clock ${bearing.localContext.localTime}. Daylight ${bearing.localContext.sunrise}–${bearing.localContext.sunset}. The global sky stays the same — this only shifts *how it feels on the ground*. Moon: ${bearing.localContext.moonPhase}.`}
          deepReading={{
            domainKey: 'regional',
            seedText: `Regional overlay: ${bearing.localContext.cityLabel}.`,
            cardTitle: 'Local overlay',
            context: ctx,
            profile,
            mode
          }}
          preview={
            <StoryProse
              text={`*${bearing.localContext.cityLabel}* · ${bearing.localContext.localTime} · daylight ${bearing.localContext.sunrise}–${bearing.localContext.sunset}`}
            />
          }
        />

        <ExpandableDetailCard
          label={mode === 'personal' ? 'Your lens' : 'Your chart'}
          title={mode === 'personal' ? 'Your pattern × today' : 'Add your chart'}
          body={
            profile
              ? mode === 'personal'
                ? bearing.domains.personalAlignment ||
                  'Your saved chart is wide to today’s sky — nothing tight is pressing; treat it as ambient weather.'
                : 'Switch to *Your chart energy* above to compare today’s sky with your saved pattern.'
              : 'Save birth data on the You tab to compare world energy with your personal chart.'
          }
          preview={
            profile ? (
              <p className="readable-body text-[1.0625rem]">
                {profile.displayName || profile.querentName}
              </p>
            ) : (
              <p className="readable-body text-[1.0625rem]">World energy only — no chart saved.</p>
            )
          }
          extra={
            !profile ? (
              <button type="button" className="cta-ghost mt-3" onClick={onOpenYou}>
                Add your chart
              </button>
            ) : undefined
          }
        />
      </div>

      <ExpandableDetailCard
        label="Watch for"
        title="The friction cue"
        body={bearing.watchFor}
        deepReading={{
          domainKey: 'watchFor',
          seedText: bearing.watchFor,
          cardTitle: 'Watch for',
          context: ctx,
          profile,
          mode
        }}
        preview={<StoryProse text={bearing.watchFor} className="text-[1.0625rem]" />}
      />

      <div>
        <button type="button" onClick={() => setWhyOpen((v) => !v)} className="cta-ghost">
          {whyOpen ? 'Hide the weave' : 'See what shaped this read'}
        </button>
        {whyOpen && (
          <ul className="mt-4 space-y-3">
            {bearing.contributors.map((c) => (
              <li key={c.systemId} className="ladder-card">
                <span className="ladder-category">{c.label}</span>
                <p className="ladder-answer">{c.signal}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="cta-primary"
          onClick={() => {
            saveInsight(bearing);
            setSaved(true);
          }}
        >
          {saved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
          {saved ? 'Saved' : 'Save insight'}
        </button>
        <button type="button" className="cta-ghost" onClick={onOpenCompass}>
          Ask about this
          <ArrowRight className="w-4 h-4" />
        </button>
        <button type="button" className="cta-explore" onClick={onOpenExplore}>
          Explore
        </button>
        <button type="button" className="cta-ghost" onClick={onOpenCodex}>
          <BookMarked className="w-4 h-4" />
          Open Codex
        </button>
      </div>
    </div>
  );
};
