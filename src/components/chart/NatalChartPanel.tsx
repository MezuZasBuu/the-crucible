import React, { useMemo } from 'react';
import { CrucibleProfile } from '../../types';
import { executeCrucibleCalculation } from '../../engine/crucibleCore';
import { ChartSuite } from './ChartSuite';
import { CultureEmblem } from '../symbols/CultureSymbols';

export const NatalChartPanel: React.FC<{
  profile: CrucibleProfile | null;
  correlationKey: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
}> = ({ profile, correlationKey }) => {
  const natal = useMemo(() => {
    if (!profile) return null;
    return executeCrucibleCalculation(
      { ...profile.birth, querentName: profile.querentName || profile.displayName },
      correlationKey
    );
  }, [profile, correlationKey]);

  if (!profile || !natal) {
    return (
      <div className="instrument-panel empty-state">
        <CultureEmblem culture="western" size={56} />
        <div>
          <p className="ui-eyebrow">Your birth chart</p>
          <h3 className="panel-title mt-1">Your chart appears once you add your birth details</h3>
          <p className="readable-body mt-2">
            Fill in the form below with your birth date and place. A birth time is optional — without it you still get
            your Sun and Moon signs, but not your rising sign or houses.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="instrument-panel space-y-4">
      <div className="flex items-start gap-3">
        <CultureEmblem culture="western" size={46} />
        <div>
          <p className="ui-eyebrow">Your birth chart</p>
          <h3 className="panel-title mt-1">{profile.displayName || profile.querentName}</h3>
          <p className="readable-muted mt-1">
            Born {profile.birth.dateString}
            {profile.birthTimeConfidence !== 'unknown_window' ? ` at ${profile.birth.timeString.slice(0, 5)}` : ''} ·{' '}
            {profile.birth.location.city || 'birth place'}
          </p>
        </div>
      </div>
      <ChartSuite
        bodies={natal.celestialBodies}
        temporal={natal.temporal}
        latitude={profile.birth.location.latitude}
        mode="natal"
        birthTimeConfidence={profile.birthTimeConfidence}
      />
    </div>
  );
};
