import React, { useMemo, useState } from 'react';
import { CrucibleProfile } from '../../types';
import { executeCrucibleCalculation } from '../../engine/crucibleCore';
import { calculateCelestialAspects } from '../../engine/ephemeris';
import { buildChartLayout, luminarySummary } from '../../engine/chartWheel';
import { ChartWheel } from './ChartWheel';
import { ChartDetailPopover } from './ChartDetailPopover';
import { EpistemicBadge } from '../EpistemicBadge';
import { CelestialAspect } from '../../engine/ephemeris';

export const NatalChartPanel: React.FC<{
  profile: CrucibleProfile | null;
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
}> = ({ profile, correlationKey }) => {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [selectedAspect, setSelectedAspect] = useState<CelestialAspect | null>(null);

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
        <p className="readable-body text-[1.05rem] mt-2">
          Add a birth date below. Without a birth time, the chart still shows the Sun and Moon; houses and rising sign stay off.
        </p>
      </div>
    );
  }

  const selectedBody = natal.ctx.celestialBodies.find((b) => b.id === selectedId);

  return (
    <div className="instrument-panel instrument-panel-solar space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-eyebrow">Natal chart</p>
          <h3 className="panel-title mt-1">{profile.displayName || profile.querentName}</h3>
          <p className="readable-body text-[1rem] mt-1">
            {profile.birth.dateString} · {profile.birth.location.city || 'Birth place'} · whole-sign houses
          </p>
        </div>
        <EpistemicBadge epistemicClass="COMPUTED_GEOMETRY" />
      </div>
      {natal.layout.limitation && (
        <p className="readable-body text-[color:var(--solar-deep)]">{natal.layout.limitation}</p>
      )}
      <p className="readable-muted text-[0.95rem]">Tap a planet or aspect line for a plain-language readout.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
        <ChartWheel
          bodies={natal.ctx.celestialBodies}
          aspects={natal.aspects}
          layout={natal.layout}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedAspect(null);
            setSelectedId((prev) => (prev === id ? undefined : id));
          }}
          onAspectSelect={setSelectedAspect}
        />
        <div className="space-y-3">
          <p className="readable-body text-[1.08rem]">
            Sun {natal.luminaries.sun?.zodiacSign} {natal.luminaries.sun?.signDegree.toFixed(1)}° · Moon{' '}
            {natal.luminaries.moon?.zodiacSign} {natal.luminaries.moon?.signDegree.toFixed(1)}°
            {natal.layout.angles ? ` · Rising ${natal.layout.houses[0]?.sign}` : ' · Rising unavailable'}
          </p>
          <p className="readable-muted text-[0.98rem]">
            Tropical mean-motion model. Familiar wheel layout — ASC on the left when birth time is known.
          </p>
        </div>
      </div>
      <ChartDetailPopover body={selectedBody} aspect={selectedAspect} onClose={() => { setSelectedId(undefined); setSelectedAspect(null); }} />
    </div>
  );
};
