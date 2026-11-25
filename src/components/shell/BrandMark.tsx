import React from 'react';

/** The Crucible mark: an astrolabe ring with four cardinal ticks and a central flame-point. */
export const BrandMark: React.FC<{ size?: number; onInk?: boolean }> = ({ size = 36, onInk = true }) => {
  const gold = '#d9b56a';
  const bg = onInk ? '#171a33' : '#fffdf8';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="The Crucible">
      <rect width="64" height="64" rx="16" fill={bg} />
      <circle cx="32" cy="32" r="19" fill="none" stroke={gold} strokeWidth="2.2" />
      <circle cx="32" cy="32" r="11.5" fill="none" stroke={gold} strokeWidth="1.2" opacity="0.7" strokeDasharray="2 3" />
      <path d="M32 8v9M32 47v9M8 32h9M47 32h9" stroke={gold} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M32 24l2.4 5.6L40 32l-5.6 2.4L32 40l-2.4-5.6L24 32l5.6-2.4z" fill="#f3e3b5" />
    </svg>
  );
};

/** Moon drawn at its real phase. `elongation` is Moon − Sun longitude in degrees (0 new, 180 full). */
export const MoonPhaseIcon: React.FC<{ elongation: number; size?: number; lit?: string; dark?: string }> = ({
  elongation,
  size = 40,
  lit = '#f3e3b5',
  dark = 'rgba(255,255,255,0.1)'
}) => {
  const e = ((elongation % 360) + 360) % 360;
  const r = 18;
  const waxing = e <= 180;
  // Terminator is an ellipse whose x-radius follows cos(elongation).
  const k = Math.cos((e * Math.PI) / 180);
  const rx = Math.abs(k) * r;
  const litSweep = waxing ? 1 : 0; // lit limb on the right when waxing (northern-hemisphere view)
  const termSweep = k > 0 ? (waxing ? 0 : 1) : waxing ? 1 : 0;
  const d = `M 20 ${20 - r} A ${r} ${r} 0 0 ${litSweep} 20 ${20 + r} A ${rx} ${r} 0 0 ${termSweep} 20 ${20 - r} Z`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r={r} fill={dark} />
      <path d={d} fill={lit} />
      <circle cx="20" cy="20" r={r} fill="none" stroke={lit} strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
};
