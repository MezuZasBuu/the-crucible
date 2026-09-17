/**
 * Epistemic class badge — labels fact vs analogy vs speculative overlay.
 */

import React from 'react';
import { EpistemicClass } from '../types';
import { EPISTEMIC_LABELS } from '../engine/epistemic';

export const EpistemicBadge: React.FC<{ epistemicClass: EpistemicClass; className?: string }> = ({
  epistemicClass,
  className = ''
}) => {
  const meta = EPISTEMIC_LABELS[epistemicClass];
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-[8px] uppercase font-mono font-bold tracking-wider border rounded-sm ${className}`}
      style={{ color: meta.color, borderColor: `${meta.color}66`, background: `${meta.color}14` }}
      title={meta.label}
    >
      {meta.short}
    </span>
  );
};
