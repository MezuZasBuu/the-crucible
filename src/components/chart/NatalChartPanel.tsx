import React, { useMemo, useState } from 'react';
import { CrucibleProfile } from '../../types';
import { executeCrucibleCalculation } from '../../engine/crucibleCore';
import { calculateCelestialAspects } from '../../engine/ephemeris';
import { buildChartLayout, luminarySummary } from '../../engine/chartWheel';
import { ChartWheel } from './ChartWheel';
import { ChartDetailPanel } from './ChartDetailPanel';
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
      <div className="instrument-panel">
        <p className="ui-eyebrow">Your chart</p>
        <h3 className="panel-title mt-1">The wheel appears after you save a profile</h3>
        <p className="readable-body text-[1rem] mt-2">
          Add birth date and place below. Without birth time, Sun and Moon still show; rising sign waits for a time.
        </p>
      </div>
    );
  }

  const selectedBody = natal.ctx.celestialBodies.find((b) => b.id === selectedId);

  return (
    <div className="instrument-panel space-y-3">
      <div>
        <p className="ui-eyebrow">Your chart</p>
        <h3 className="panel-title mt-1">{profile.displayName || profile.querentName}</h3>
        <p className="readable-body text-[1rem] mt-1">
          {profile.birth.dateString} · {profile.birth.location.city || 'Birth place'}
        </p>
      </div>
      {natal.layout.limitation && (
        <p className="readable-body text-[color:var(--solar-deep)] text-[0.98rem]">{natal.layout.limitation}</p>
      )}
      <p className="readable-muted text-[0.95rem]">
        Sun {natal.luminaries.sun?.zodiacSign} · Moon {natal.luminaries.moon?.zodiacSign}
        {natal.layout.angles ? ` · Rising ${natal.layout.houses[0]?.sign}` : ''}
      </p>
      <div className="chart-workspace">
        <div className="chart-wheel-wrap">
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
        </div>
        <ChartDetailPanel body={selectedBody} aspect={selectedAspect} />
      </div>
    </div>
  );
};
