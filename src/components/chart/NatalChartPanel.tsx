import React, { useMemo } from 'react';
import { CrucibleProfile } from '../../types';
import { executeCrucibleCalculation } from '../../engine/crucibleCore';
import { calculateCelestialAspects } from '../../engine/ephemeris';
import { buildChartLayout, luminarySummary } from '../../engine/chartWheel';
import { ChartWheel } from './ChartWheel';
import { EpistemicBadge } from '../EpistemicBadge';

export const NatalChartPanel: React.FC<{
  profile: CrucibleProfile | null;
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
}> = ({ profile, correlationKey }) => {
  const natal = useMemo(() => {
    if (!profile) return null;
    const ctx = executeCrucibleCalculation(
      { ...profile.birth, querentName: profile.querentName || profile.displayName },
      correlationKey
    );
    const layout = buildChartLayout({
      temporal: ctx.temporal,
      latitude: profile.birth.location.latitude,
      mode: 'natal',
      birthTimeConfidence: profile.birthTimeConfidence
    });
    return {
      ctx,
      layout,
      aspects: calculateCelestialAspects(ctx.celestialBodies),
      luminaries: luminarySummary(ctx.celestialBodies)
    };
  }, [profile, correlationKey]);

  if (!profile || !natal) {
    return (
      <div className="instrument-panel instrument-panel-solar">
        <p className="ui-eyebrow">Natal chart</p>
        <h3 className="panel-title mt-1">Your wheel appears after a profile is saved</h3>
        <p className="font-garamond text-[16px] text-[color:var(--text-secondary)] mt-2">
          Add a birth date below. Without a birth time, the chart still shows the Sun and Moon; houses and rising sign stay off.
        </p>
      </div>
    );
  }

  return (
    <div className="instrument-panel instrument-panel-solar space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-eyebrow">Natal chart</p>
          <h3 className="panel-title mt-1">{profile.displayName || profile.querentName}</h3>
          <p className="text-sm text-[color:var(--text-secondary)] mt-1">
            {profile.birth.dateString} · {profile.birth.location.city || 'Birth place'} · whole-sign houses
          </p>
        </div>
        <EpistemicBadge epistemicClass="COMPUTED_GEOMETRY" />
      </div>
      {natal.layout.limitation && (
        <p className="text-sm text-[color:var(--solar-deep)]">{natal.layout.limitation}</p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
        <ChartWheel bodies={natal.ctx.celestialBodies} aspects={natal.aspects} layout={natal.layout} />
        <div className="space-y-3">
          <p className="font-garamond text-[17px] text-[color:var(--text-secondary)]">
            Sun {natal.luminaries.sun?.zodiacSign} {natal.luminaries.sun?.signDegree.toFixed(1)}° · Moon{' '}
            {natal.luminaries.moon?.zodiacSign} {natal.luminaries.moon?.signDegree.toFixed(1)}°
            {natal.layout.angles
              ? ` · Rising ${natal.layout.houses[0]?.sign}`
              : ' · Rising unavailable'}
          </p>
          <p className="text-sm text-[color:var(--text-muted)]">
            Tropical mean-motion model. This is a natal snapshot from saved birth data, separate from today’s sky on Explore.
          </p>
        </div>
      </div>
    </div>
  );
};
