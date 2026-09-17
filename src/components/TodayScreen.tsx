/**
 * Today — world energy first; personal chart overlay when saved.
 */

import React, { useMemo, useState } from 'react';
import { ArrowRight, BookmarkPlus, BookMarked, Check } from 'lucide-react';
import { CompleteCalculationContext, CrucibleProfile, ReadingFocus, ReadingMode } from '../types';
import { synthesizeDailyBearing } from '../engine/editorialSynthesis';
import { saveInsight } from '../engine/savedInsights';
import {
  AtmosphereTriad,
  ExploreFrontButton,
  FocusSelector,
  OverviewSlideCard,
  ReadingModeToggle
} from './cards/TodayCards';
import { ExpandableDetailCard } from './ui/ExpandableDetailCard';
import { EpistemicBadge } from './EpistemicBadge';

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
  const [focus, setFocus] = useState<ReadingFocus>('overview');
  const [mode, setMode] = useState<ReadingMode>('world');
  const [whyOpen, setWhyOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const bearing = useMemo(
    () => synthesizeDailyBearing(ctx, focus, profile, mode, correlationKey),
    [ctx, focus, profile, mode, correlationKey]
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <ReadingModeToggle mode={mode} hasProfile={Boolean(profile)} onChange={setMode} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FocusSelector value={focus} onChange={setFocus} />
        <ExploreFrontButton onClick={onOpenExplore} />
      </div>

      <OverviewSlideCard ctx={ctx} profile={profile} focus={focus} mode={mode} correlationKey={correlationKey} />
      <AtmosphereTriad bearing={bearing} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpandableDetailCard
          label="Regional overlay (optional)"
          accent="sage"
          title={`Regional timing · ${bearing.localContext.cityLabel}`}
          body={`This region adjusts local clock, approximate daylight (${bearing.localContext.sunrise}–${bearing.localContext.sunset}), and horizon math. It does not change the world sky — only how the day lands where you are. Moon: ${bearing.localContext.moonPhase}. Seasonal note: ${bearing.localContext.seasonalNote}.`}
          preview={
            <>
              <p className="readable-body font-semibold">{bearing.localContext.cityLabel}</p>
              <p className="readable-body mt-2">
                Local {bearing.localContext.localTime} · daylight {bearing.localContext.sunrise}–{bearing.localContext.sunset}
              </p>
            </>
          }
        />

        <ExpandableDetailCard
          label={mode === 'personal' ? 'Your chart lens' : 'Personal chart'}
          accent="terracotta"
          title={mode === 'personal' ? 'Your chart × today' : 'Add your chart'}
          body={
            profile
              ? mode === 'personal'
                ? bearing.domains.personalAlignment ||
                  'Personal alignment copy unavailable — transit hits may be wide today.'
                : 'Switch to “Your chart energy” above to compare today’s sky with your saved natal pattern.'
              : 'Save birth data on the You tab to toggle between world energy and your personal chart overlay.'
          }
          preview={
            profile ? (
              <p className="readable-body">
                {profile.displayName || profile.querentName} saved · confidence {profile.birthTimeConfidence.replace('_', ' ')}
              </p>
            ) : (
              <p className="readable-body">No chart saved yet — world energy only.</p>
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
              <li key={c.systemId} className="scroll-card gradient-card-base readable-body flex flex-wrap items-center justify-between gap-2">
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
        <button type="button" className="cta-primary" onClick={() => { saveInsight(bearing); setSaved(true); }}>
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
