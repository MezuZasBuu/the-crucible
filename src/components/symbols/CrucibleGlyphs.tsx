/**
 * The Crucible — Vector Glyph & Symbol Component
 * High-resolution SVG vector emblems for Maya Tzolk'in signs,
 * Chinese Zodiac animals, Wu Xing elements, and Sacred Tribe emblems.
 */

import React from 'react';

interface GlyphProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export const MayanGlyphIcon: React.FC<GlyphProps> = ({ name, size = 32, className = '', color = '#00f0ff' }) => {
  const normalized = name.toLowerCase();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block transition-transform hover:scale-110 ${className}`}
    >
      {/* Outer rounded cartouche */}
      <rect x="3" y="3" width="42" height="42" rx="10" stroke={color} strokeWidth="2" strokeOpacity="0.8" fill="#0d111a" fillOpacity="0.8" />
      <circle cx="24" cy="24" r="16" stroke={color} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />

      {/* Distinct vector patterns based on Mayan glyph name */}
      {normalized.includes('imix') && (
        <path d="M16 28C16 22 20 16 24 16C28 16 32 22 32 28C32 32 28 34 24 34C20 34 16 32 16 28ZM24 19V31" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      )}
      {normalized.includes('ik') && (
        <path d="M16 18H32M24 18V32M18 24H30M18 32H30" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      )}
      {normalized.includes('akbal') && (
        <path d="M18 18C24 18 24 30 30 30M18 30C24 30 24 18 30 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      )}
      {normalized.includes('kan') && (
        <g stroke={color} strokeWidth="2">
          <circle cx="24" cy="24" r="5" fill={color} fillOpacity="0.3" />
          <path d="M24 14V17M24 31V34M14 24H17M31 24H34" strokeLinecap="round" />
        </g>
      )}
      {normalized.includes('chicchan') && (
        <path d="M17 32C17 26 23 26 23 20C23 15 31 15 31 20C31 26 25 26 25 32" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      )}
      {normalized.includes('cimi') && (
        <g stroke={color} strokeWidth="2" strokeLinecap="round">
          <circle cx="20" cy="21" r="2.5" fill={color} />
          <circle cx="28" cy="21" r="2.5" fill={color} />
          <path d="M18 30C21 32 27 32 30 30" />
        </g>
      )}
      {normalized.includes('manik') && (
        <path d="M16 28V20C16 17 19 17 19 20V26M19 20C19 16 23 16 23 20V26M23 20C23 16 27 16 27 20V26M27 22C27 18 31 18 31 22V28C31 33 16 33 16 28Z" stroke={color} strokeWidth="1.8" />
      )}
      {normalized.includes('lamat') && (
        <g stroke={color} strokeWidth="2">
          <circle cx="20" cy="20" r="2" fill={color} />
          <circle cx="28" cy="20" r="2" fill={color} />
          <circle cx="20" cy="28" r="2" fill={color} />
          <circle cx="28" cy="28" r="2" fill={color} />
          <path d="M24 14V34M14 24H34" strokeWidth="1.2" strokeOpacity="0.6" />
        </g>
      )}
      {normalized.includes('muluc') && (
        <g stroke={color} strokeWidth="2">
          <circle cx="24" cy="24" r="7" />
          <circle cx="24" cy="24" r="2.5" fill={color} />
        </g>
      )}
      {normalized.includes('oc') && (
        <path d="M17 18L21 27L24 24L27 27L31 18M18 31H30" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {normalized.includes('chuen') && (
        <path d="M18 18H30V26C30 30 26 32 24 32C22 32 18 30 18 26V18ZM18 22H30" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {normalized.includes('eb') && (
        <path d="M17 32L24 16L31 32M20 27H28" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      )}
      {normalized.includes('ben') && (
        <g stroke={color} strokeWidth="2" strokeLinecap="round">
          <path d="M19 16V32M29 16V32M16 21H32M16 27H32" />
        </g>
      )}
      {normalized.includes('ix') && (
        <g stroke={color} strokeWidth="2">
          <circle cx="19" cy="21" r="2" fill={color} />
          <circle cx="29" cy="21" r="2" fill={color} />
          <circle cx="24" cy="28" r="2" fill={color} />
        </g>
      )}
      {normalized.includes('men') && (
        <path d="M15 24C19 20 22 17 24 22C26 17 29 20 33 24M20 28C22 31 26 31 28 28" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {normalized.includes('cib') && (
        <path d="M18 19C24 16 30 19 30 25C30 30 24 33 24 33M18 25H27" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {normalized.includes('caban') && (
        <path d="M17 20C21 20 21 28 27 28C30 28 31 26 31 24M20 32L28 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {normalized.includes('etznab') && (
        <path d="M16 16L32 32M32 16L16 32M24 14V34M14 24H34" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      )}
      {normalized.includes('cauac') && (
        <path d="M26 15L17 26H25L21 34L31 22H23L26 15Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" strokeLinejoin="round" />
      )}
      {((normalized.includes('ahau') || normalized.includes('ajaw')) && (
        <g stroke={color} strokeWidth="2">
          <circle cx="24" cy="24" r="8" fill={color} fillOpacity="0.2" />
          <circle cx="21" cy="22" r="1.5" fill={color} />
          <circle cx="27" cy="22" r="1.5" fill={color} />
          <path d="M21 27H27" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
};

export const ChineseZodiacIcon: React.FC<GlyphProps> = ({ name, size = 28, className = '', color = '#f59e0b' }) => {
  const n = name.toLowerCase();

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={`inline-block ${className}`}>
      <rect width="36" height="36" rx="8" fill="#11141e" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
      {n.includes('rat') && (
        <path d="M12 24C12 18 16 14 21 14C24 14 26 16 26 19C26 23 21 26 15 26M22 13C24 10 27 12 26 15M24 23L29 25" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {n.includes('ox') && (
        <path d="M10 14C12 18 16 18 18 24C20 18 24 18 26 14M13 22H23M18 20V26" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {n.includes('tiger') && (
        <path d="M11 16L15 13L17 17H19L21 13L25 16M14 22H22M18 22V27M13 26H23" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {n.includes('rabbit') && (
        <path d="M14 26C14 21 17 18 19 18C21 18 23 20 23 23M15 11C15 16 17 18 17 18M21 11C21 16 19 18 19 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {n.includes('dragon') && (
        <path d="M11 26C13 18 23 18 21 13M16 15L25 21C26 23 24 26 20 26M13 18H18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {n.includes('snake') && (
        <path d="M14 24C14 20 22 20 22 15C22 12 17 12 17 15" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      )}
      {n.includes('horse') && (
        <path d="M12 25L16 14L23 16L24 25M16 19H23" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {n.includes('goat') && (
        <path d="M13 13C16 15 17 19 17 25M23 13C20 15 19 19 19 25M14 20H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {n.includes('monkey') && (
        <g stroke={color} strokeWidth="2" strokeLinecap="round">
          <circle cx="18" cy="18" r="6" />
          <path d="M12 18C10 18 10 15 12 15M24 18C26 18 26 15 24 15M16 21C17 22 19 22 20 21" />
        </g>
      )}
      {n.includes('rooster') && (
        <path d="M13 25C13 18 17 15 22 15M16 13C18 11 20 11 21 13M22 17L25 19L22 21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {n.includes('dog') && (
        <path d="M12 15L16 19V25M24 15L20 19M16 21H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
      {n.includes('pig') && (
        <g stroke={color} strokeWidth="2" strokeLinecap="round">
          <circle cx="18" cy="19" r="6.5" />
          <circle cx="18" cy="19" r="2.5" fill={color} fillOpacity="0.2" />
        </g>
      )}
    </svg>
  );
};

export const WuXingElementIcon: React.FC<GlyphProps> = ({ name, size = 20, className = '' }) => {
  const el = name.toLowerCase();

  let color = '#10b981'; // Wood (green)
  if (el.includes('fire')) color = '#ef4444';
  else if (el.includes('earth')) color = '#eab308';
  else if (el.includes('metal')) color = '#cbd5e1';
  else if (el.includes('water')) color = '#06b6d4';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-mono text-xs font-bold px-2 py-0.5 border ${className}`}
      style={{
        borderColor: `${color}40`,
        backgroundColor: `${color}15`,
        color
      }}
    >
      {name}
    </span>
  );
};
