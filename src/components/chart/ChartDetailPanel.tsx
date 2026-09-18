import React from 'react';
import { CelestialCoordinate } from '../../types';
import { CelestialAspect } from '../../engine/ephemeris';
import { StoryProse } from '../ui/StoryProse';

export const ChartDetailPanel: React.FC<{
  body?: CelestialCoordinate | null;
  aspect?: CelestialAspect | null;
}> = ({ body, aspect }) => {
  if (!body && !aspect) {
    return (
      <div className="chart-detail-panel">
        <p className="ui-eyebrow absolute top-3 right-3">Chart readout</p>
        <p className="readable-body text-[1rem] mt-6">
          Tap a planet or aspect line on the wheel. The readout stays here — no scrolling away from the chart.
        </p>
      </div>
    );
  }

  if (body) {
    return (
      <div className="chart-detail-panel">
        <p className="ladder-category">{body.name}</p>
        <h4 className="detail-title text-[1.35rem] mt-1">
          {body.symbol} {body.zodiacSign} {body.signDegree.toFixed(1)}°
        </h4>
        <StoryProse
          className="mt-3"
          text={`*${body.name}* sits in ${body.zodiacSign} — ${body.element.toLowerCase()}, ${body.modality.toLowerCase()} tone. Retrograde: ${body.isRetrograde ? 'yes' : 'no'}. This is where the sky places it today, not a verdict on you.`}
        />
      </div>
    );
  }

  return (
    <div className="chart-detail-panel">
      <p className="ladder-category">Aspect</p>
      <h4 className="detail-title text-[1.35rem] mt-1">
        {aspect!.bodyASymbol} {aspect!.bodyA} {aspect!.aspectType} {aspect!.bodyBSymbol} {aspect!.bodyB}
      </h4>
      <p className="readable-body text-[1rem] mt-2">
        {aspect!.orbDeg.toFixed(1)}° orb · {aspect!.harmony} · {aspect!.isApplying ? 'building' : 'easing'}
      </p>
      <StoryProse className="mt-3" text={aspect!.novelisticDescription} />
    </div>
  );
};
