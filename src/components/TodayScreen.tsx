/**
 * Today — first-minute personal reading.
 */

import React, { useMemo, useState } from 'react';
import { ArrowRight, BookmarkPlus, BookMarked, Check } from 'lucide-react';
import { CompleteCalculationContext, CrucibleProfile, ReadingFocus } from '../types';
import { synthesizeDailyBearing } from '../engine/editorialSynthesis';
import { saveInsight } from '../engine/savedInsights';
import { AtmosphereTriad, FeaturedReadingCard, FocusSelector } from './cards/TodayCards';
import { ScrollCard } from './ui/ScrollCard';
import { EpistemicBadge } from './EpistemicBadge';

interface TodayScreenProps {
  ctx: CompleteCalculationContext;
  profile: CrucibleProfile | null;
  onOpenCodex: () => void;
  onOpenCompass: () => void;
  onOpenYou: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  ctx,
  profile,
  onOpenCodex,
  onOpenCompass,
  onOpenYou
}) => {
  const [focus, setFocus] = useState<ReadingFocus>('overview');
  const [whyOpen, setWhyOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const bearing = useMemo(() => synthesizeDailyBearing(ctx, focus, profile), [ctx, focus, profile]);

  return (
    <div className="space-y-5 md:space-y-6">
      <FocusSelector value={focus} onChange={setFocus} />
      <FeaturedReadingCard bearing={bearing} />
      <AtmosphereTriad bearing={bearing} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollCard label="Around you" accent="sage">
          <p className="font-semibold text-[color:var(--text-primary)]">{bearing.localContext.cityLabel}</p>
          <p className="mt-2">
            Approximate daylight {bearing.localContext.sunrise}–{bearing.localContext.sunset}. {bearing.localContext.moonPhase}. {bearing.localContext.seasonalNote}.
          </p>
          <p className="mt-3 text-[13px] text-[color:var(--text-muted)]">
            Changing city updates local clock, daylight, horizon, and hour-based timing. Global sky events stay the same.
          </p>
        </ScrollCard>

        <ScrollCard label="Your current cycle" accent="terracotta">
          {profile ? (
            <p>
              Saved as {profile.displayName || profile.querentName}. Birth-time confidence:{' '}
              {profile.birthTimeConfidence.replace('_', ' ')}. Houses and rising sign stay limited until time is exact.
            </p>
          ) : (
            <p>
              No birth chart yet. You are seeing the shared atmosphere for this date and place.{' '}
              <button type="button" className="underline text-[color:var(--temporal-deep)]" onClick={onOpenYou}>
                Add your pattern
              </button>
            </p>
          )}
        </ScrollCard>
      </div>

      <ScrollCard label="Watch for" accent="rose">
        <p className="font-garamond text-[18px] text-[color:var(--text-primary)]">{bearing.watchFor}</p>
      </ScrollCard>

      <div>
        <button
          type="button"
          onClick={() => setWhyOpen((v) => !v)}
          className="cta-ghost"
        >
          {whyOpen ? 'Hide contributing systems' : 'Why this reading?'}
        </button>
        {whyOpen && (
          <ul className="mt-4 space-y-3">
            {bearing.contributors.map((c) => (
              <li
                key={c.systemId}
                className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-raised)] px-4 py-3 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <p className="font-semibold text-[color:var(--text-primary)]">{c.label}</p>
                  <p className="text-sm text-[color:var(--text-secondary)] mt-0.5">{c.signal}</p>
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
        <button type="button" className="cta-ghost" onClick={onOpenCodex}>
          <BookMarked className="w-4 h-4" />
          Open Codex
        </button>
      </div>
    </div>
  );
};
