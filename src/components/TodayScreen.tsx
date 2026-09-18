/**
 * Today — Gemini-enriched world energy; 6s galleries with swipe arrows.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookmarkPlus, BookMarked, Check, Loader2 } from 'lucide-react';
import { CompleteCalculationContext, CrucibleProfile, ReadingMode } from '../types';
import { synthesizeDailyBearing } from '../engine/editorialSynthesis';
import {
  fetchTodayEnergy,
  mergeBearingWithGenerated,
  type GeneratedTodayEnergy
} from '../engine/todayEnergyService';
import { saveInsight } from '../engine/savedInsights';
import { getTgoldResearchMetadata } from '../engine/tgold';
import { useAuth } from '../firebase/AuthProvider';
import { ExploreFrontButton, OverviewSlideCard, ReadingModeToggle } from './cards/TodayCards';
import { WorldEnergyGallery } from './cards/WorldEnergyGallery';
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
  const { tier } = useAuth();
  const [overviewIndex, setOverviewIndex] = useState(0);
  const [energyIndex, setEnergyIndex] = useState(0);
  const [mode, setMode] = useState<ReadingMode>('world');
  const [whyOpen, setWhyOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generated, setGenerated] = useState<GeneratedTodayEnergy | null>(null);
  const [loadingEnergy, setLoadingEnergy] = useState(true);

  const canUsePersonal = Boolean(profile) && tier !== 'visitor' && tier !== 'guest';

  useEffect(() => {
    if (mode === 'personal' && !canUsePersonal) {
      setMode('world');
    }
  }, [mode, canUsePersonal]);

  useEffect(() => {
    let cancelled = false;
    setLoadingEnergy(true);
    fetchTodayEnergy({ ctx, profile: canUsePersonal ? profile : null, mode, correlationKey })
      .then((data) => {
        if (!cancelled) setGenerated(data);
      })
      .finally(() => {
        if (!cancelled) setLoadingEnergy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ctx, profile, mode, correlationKey, canUsePersonal]);

  const baseBearing = useMemo(
    () => synthesizeDailyBearing(ctx, 'overview', canUsePersonal ? profile : null, mode, correlationKey),
    [ctx, profile, mode, correlationKey, canUsePersonal]
  );

  const bearing = useMemo(
    () => mergeBearingWithGenerated(baseBearing, generated),
    [baseBearing, generated]
  );

  const fullReport =
    bearing.fullReport ||
    [
      bearing.summary,
      bearing.atmospheres.emotional,
      bearing.atmospheres.social,
      bearing.atmospheres.workCreative,
      bearing.domains.mood,
      bearing.domains.people,
      bearing.domains.travel,
      bearing.domains.finance,
      bearing.domains.tech,
      bearing.domains.whyToday,
      bearing.watchFor
    ].join('\n\n');

  const deepBase = { context: ctx, profile: canUsePersonal ? profile : null, mode };

  return (
    <div className="space-y-5 md:space-y-6 parchment-surface">
      <ReadingModeToggle
        mode={mode}
        hasProfile={canUsePersonal}
        onChange={setMode}
        onNeedAccount={onOpenYou}
      />

      {loadingEnergy && (
        <p className="readable-muted text-sm inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Composing today&apos;s reading…
        </p>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <ExploreFrontButton onClick={onOpenExplore} />
      </div>

      <ExpandableDetailCard
        label="Today's report"
        title={`Full reading · ${ctx.input.dateString}`}
        body={fullReport}
        preview={
          <StoryProse
            text={bearing.summary}
            className="text-[1.0625rem] leading-relaxed line-clamp-6"
          />
        }
        deepReading={{
          domainKey: 'whyToday',
          seedText: fullReport,
          cardTitle: "Today's full report",
          ...deepBase
        }}
        className="card-featured"
      />

      <OverviewSlideCard
        ctx={ctx}
        profile={canUsePersonal ? profile : null}
        slideIndex={overviewIndex}
        onSlideIndexChange={setOverviewIndex}
        mode={mode}
        correlationKey={correlationKey}
        heroBearing={bearing}
      />

      <WorldEnergyGallery
        bearing={bearing}
        deepReadingBase={deepBase}
        slideIndex={energyIndex}
        onSlideIndexChange={setEnergyIndex}
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
            ...deepBase
          }}
          preview={
            <StoryProse
              text={`*${bearing.localContext.cityLabel}* · ${bearing.localContext.localTime} · daylight ${bearing.localContext.sunrise}–${bearing.localContext.sunset}`}
            />
          }
        />

        <ExpandableDetailCard
          label={canUsePersonal ? 'Your lens' : 'Member charts'}
          title={canUsePersonal ? 'Your pattern × today' : 'Personal chart (members)'}
          body={
            canUsePersonal
              ? mode === 'personal'
                ? bearing.domains.personalAlignment ||
                  'Your saved chart is wide to today’s sky — nothing tight is pressing; treat it as ambient weather.'
                : 'Switch to *Your chart energy* above to compare today’s sky with your saved pattern.'
              : 'Sign in with Google on the You tab to unlock personal chart overlays, natal wheel, and astrocartography.'
          }
          preview={
            canUsePersonal ? (
              <p className="readable-body text-[1.0625rem]">
                {profile?.displayName || profile?.querentName}
              </p>
            ) : (
              <p className="readable-body text-[1.0625rem]">World energy — member charts available when signed in.</p>
            )
          }
          extra={
            !canUsePersonal ? (
              <button type="button" className="cta-ghost mt-3" onClick={onOpenYou}>
                Sign in for your chart
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
          ...deepBase
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
            const tgold = getTgoldResearchMetadata(ctx);
            saveInsight(bearing, undefined, {
              tgoldVectorsConsulted: tgold.evidenceVectors.map((b) => b.id)
            });
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
