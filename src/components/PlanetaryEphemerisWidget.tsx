/**
 * The sky right now — a standard chart wheel for the selected moment and place.
 */

import React from 'react';
import { CompleteCalculationContext } from '../types';
import { ChartSuite } from './chart/ChartSuite';
import { CultureHeader } from './symbols/CultureSymbols';

interface PlanetaryEphemerisWidgetProps {
  ctx: CompleteCalculationContext;
}

export const PlanetaryEphemerisWidget: React.FC<PlanetaryEphemerisWidgetProps> = ({ ctx }) => {
  const celestialBodies = ctx.celestialBodies || [];
  return (
    <div className="instrument-panel motion-enter space-y-4">
      <CultureHeader culture="western" title="The sky right now" />
      <ChartSuite
        bodies={celestialBodies}
        temporal={ctx.temporal}
        latitude={ctx.input.location.latitude}
        mode="current-sky"
      />
    </div>
  );
};
