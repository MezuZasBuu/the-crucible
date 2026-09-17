import React from 'react';
import { CelestialCoordinate } from '../../types';
import { CelestialAspect } from '../../engine/ephemeris';
import { FadeInText } from '../ui/FadeInText';

export const ChartDetailPopover: React.FC<{
  body?: CelestialCoordinate | null;
  aspect?: CelestialAspect | null;
  onClose: () => void;
}> = ({ body, aspect, onClose }) => {
  if (!body && !aspect) return null;

  return (
    <div className="detail-overlay" role="presentation" onClick={onClose}>
      <article className="detail-sheet gradient-card-base gradient-card-solar" onClick={(e) => e.stopPropagation()}>
        <div className="detail-sheet-header">
          <p className="scroll-label readable-muted">{body ? 'Placement' : 'Aspect'}</p>
          <button type="button" className="detail-close" onClick={onClose}>
            Close
          </button>
        </div>
        {body && (
          <>
            <h3 className="detail-title">
              {body.symbol} {body.name} · {body.zodiacSign} {body.signDegree.toFixed(1)}°
            </h3>
            <FadeInText
              text={`${body.name} in ${body.zodiacSign} at ${body.signDegree.toFixed(1)}° (${body.element} · ${body.modality}). Retrograde: ${body.isRetrograde ? 'yes' : 'no'}. This is a computed tropical longitude from the mean-motion model — a familiar wheel placement, not a prediction.`}
              className="detail-body"
            />
          </>
        )}
        {aspect && (
          <>
            <h3 className="detail-title">
              {aspect.bodyASymbol} {aspect.bodyA} {aspect.aspectType} {aspect.bodyBSymbol} {aspect.bodyB}
            </h3>
            <p className="readable-body text-[1rem] mt-2">
              {aspect.orbDeg.toFixed(1)}° orb · {aspect.harmony} · {aspect.isApplying ? 'applying' : 'separating'}
            </p>
            <FadeInText text={aspect.novelisticDescription} className="detail-body" delayMs={80} />
            <p className="readable-body mt-3 text-[0.98rem]">
              In chart practice, {aspect.aspectType.toLowerCase()}s describe how two functions speak — harmony, tension, or fusion — not fixed outcomes.
            </p>
          </>
        )}
      </article>
    </div>
  );
};
