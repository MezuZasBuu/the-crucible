/**
 * Today — first-minute personal reading.
 */

import React, { useMemo, useState } from 'react';
import { ArrowRight, BookmarkPlus, BookMarked, Check } from 'lucide-react';
import { CompleteCalculationContext, CrucibleProfile, ReadingFocus } from '../types';
import { synthesizeDailyBearing } from '../engine/editorialSynthesis';
import { saveInsight } from '../engine/savedInsights';
import { AtmosphereTriad, ExploreFrontButton, FocusSelector, OverviewSlideCard } from './cards/TodayCards';
import { ExpandableDetailCard } from './ui/ExpandableDetailCard';
import { EpistemicBadge } from './EpistemicBadge';

interface TodayScreenProps {
  ctx: CompleteCalculationContext;
  profile: CrucibleProfile | null;
  onOpenCodex: () => void;
  onOpenCompass: () => void;
  onOpenYou: () => void;
  onOpenExplore: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  ctx,
  profile,
  onOpenCodex,
  onOpenCompass,
  onOpenYou,
  onOpenExplore
}) => {
  const [focus, setFocus] = useState<ReadingFocus>('overview');
  const [whyOpen, setWhyOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const bearing = useMemo(() => synthesizeDailyBearing(ctx, focus, profile), [ctx, focus, profile]);

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FocusSelector value={focus} onChange={setFocus} />
        <ExploreFrontButton onClick={onOpenExplore} />
      </div>

      <OverviewSlideCard ctx={ctx} profile={profile} focus={focus} />
      <AtmosphereTriad bearing={bearing} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpandableDetailCard
          label="Around you"
          accent="sage"
          title={`Around you · ${bearing.localContext.cityLabel}`}
          body={`Approximate daylight ${bearing.localContext.sunrise}–${bearing.localContext.sunset}. ${bearing.localContext.moonPhase}. ${bearing.localContext.seasonalNote}. Changing city updates local clock, daylight, horizon, and hour-based timing. Global sky events stay the same.`}
          preview={
            <>
              <p className="readable-body font-semibold">{bearing.localContext.cityLabel}</p>
              <p className="readable-body mt-2">
                Approximate daylight {bearing.localContext.sunrise}–{bearing.localContext.sunset}. {bearing.localContext.moonPhase}.{' '}
                {bearing.localContext.seasonalNote}.
              </p>
            </>
          }
        />

        <ExpandableDetailCard
          label="Your current cycle"
          accent="terracotta"
          title="Your current cycle"
          body={
            profile
              ? `Saved as ${profile.displayName || profile.querentName}. Birth-time confidence: ${profile.birthTimeConfidence.replace('_', ' ')}. Houses and rising sign stay limited until time is exact. Your personal pattern weights today's reading when a profile is active.`
              : 'No birth chart yet. You are seeing the shared atmosphere for this date and place. Add your pattern on the You tab to personalize houses, transits, and daily weighting.'
          }
          preview={
            profile ? (
              <p className="readable-body">
                Saved as {profile.displayName || profile.querentName}. Birth-time confidence:{' '}
                {profile.birthTimeConfidence.replace('_', ' ')}.
              </p>
            ) : (
              <p className="readable-body">No birth chart yet. You are seeing the shared atmosphere for this date and place.</p>
            )
          }
        />
      </div>

      <ExpandableDetailCard
        label="Watch for"
        accent="rose"
        title="Watch for"
        body={bearing.watchFor}
        preview={<p className="readable-body text-[1.15rem] font-semibold">{bearing.watchFor}</p>}
      />

      <div>
        <button type="button" onClick={() => setWhyOpen((v) => !v)} className="cta-ghost">
          {whyOpen ? 'Hide contributing systems' : 'Why this reading?'}
        </button>
        {whyOpen && (
          <ul className="mt-4 space-y-3">
            {bearing.contributors.map((c) => (
              <li
                key={c.systemId}
                className="scroll-card gradient-card-base readable-body flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <p className="font-semibold readable-body">{c.label}</p>
                  <p className="readable-body mt-0.5 opacity-90">{c.signal}</p>
                </div>
                <EpistemicBadge epistemicClass={c.epistemic} />
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
