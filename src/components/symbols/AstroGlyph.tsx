/**
 * Astrological glyphs — zodiac signs, planets and aspects.
 * Rendered from the open-source Noto Sans Symbols font (never as colour emoji),
 * so they look the same on every device and can be tinted like any text.
 */

import React from 'react';

/** Text-presentation selector: stops browsers swapping glyphs for emoji. */
const TEXT = '︎';

export const GLYPH_FONT = "'Noto Sans Symbols', 'Noto Sans Symbols 2', 'Segoe UI Symbol', serif";

export type ZodiacElement = 'Fire' | 'Earth' | 'Air' | 'Water';

export const SIGNS: Array<{ name: string; glyph: string; element: ZodiacElement; modality: string; ruler: string; keyword: string }> = [
  { name: 'Aries', glyph: '♈', element: 'Fire', modality: 'Cardinal', ruler: 'Mars', keyword: 'starting, courage' },
  { name: 'Taurus', glyph: '♉', element: 'Earth', modality: 'Fixed', ruler: 'Venus', keyword: 'steadiness, comfort' },
  { name: 'Gemini', glyph: '♊', element: 'Air', modality: 'Mutable', ruler: 'Mercury', keyword: 'curiosity, talk' },
  { name: 'Cancer', glyph: '♋', element: 'Water', modality: 'Cardinal', ruler: 'Moon', keyword: 'care, home' },
  { name: 'Leo', glyph: '♌', element: 'Fire', modality: 'Fixed', ruler: 'Sun', keyword: 'confidence, play' },
  { name: 'Virgo', glyph: '♍', element: 'Earth', modality: 'Mutable', ruler: 'Mercury', keyword: 'craft, service' },
  { name: 'Libra', glyph: '♎', element: 'Air', modality: 'Cardinal', ruler: 'Venus', keyword: 'balance, partnership' },
  { name: 'Scorpio', glyph: '♏', element: 'Water', modality: 'Fixed', ruler: 'Mars · Pluto', keyword: 'depth, intensity' },
  { name: 'Sagittarius', glyph: '♐', element: 'Fire', modality: 'Mutable', ruler: 'Jupiter', keyword: 'meaning, adventure' },
  { name: 'Capricorn', glyph: '♑', element: 'Earth', modality: 'Cardinal', ruler: 'Saturn', keyword: 'discipline, ambition' },
  { name: 'Aquarius', glyph: '♒', element: 'Air', modality: 'Fixed', ruler: 'Saturn · Uranus', keyword: 'ideas, community' },
  { name: 'Pisces', glyph: '♓', element: 'Water', modality: 'Mutable', ruler: 'Jupiter · Neptune', keyword: 'imagination, compassion' }
];

export const ELEMENT_COLOR: Record<ZodiacElement, string> = {
  Fire: '#b8483a',
  Earth: '#6f7a2c',
  Air: '#a8842a',
  Water: '#2f6f9a'
};

export const ELEMENT_TINT: Record<ZodiacElement, string> = {
  Fire: 'rgba(184, 72, 58, 0.13)',
  Earth: 'rgba(111, 122, 44, 0.14)',
  Air: 'rgba(196, 160, 60, 0.15)',
  Water: 'rgba(47, 111, 154, 0.13)'
};

export const PLANETS: Record<string, { glyph: string; name: string; color: string; meaning: string }> = {
  sun: { glyph: '☉', name: 'Sun', color: '#b0771a', meaning: 'Your core self and vitality' },
  moon: { glyph: '☽', name: 'Moon', color: '#5a6690', meaning: 'Feelings, needs and instincts' },
  mercury: { glyph: '☿', name: 'Mercury', color: '#2f7284', meaning: 'Thinking and communication' },
  venus: { glyph: '♀', name: 'Venus', color: '#b05a78', meaning: 'Love, taste and what you value' },
  mars: { glyph: '♂', name: 'Mars', color: '#b8483a', meaning: 'Drive, anger and action' },
  jupiter: { glyph: '♃', name: 'Jupiter', color: '#6a5aa8', meaning: 'Growth, luck and belief' },
  saturn: { glyph: '♄', name: 'Saturn', color: '#6b5a3a', meaning: 'Limits, duty and maturity' },
  uranus: { glyph: '♅', name: 'Uranus', color: '#2f8a8a', meaning: 'Change, freedom and surprise' },
  neptune: { glyph: '♆', name: 'Neptune', color: '#3f66b0', meaning: 'Dreams, ideals and confusion' },
  pluto: { glyph: '♇', name: 'Pluto', color: '#7a3f6a', meaning: 'Power and deep transformation' },
  chiron: { glyph: '⚷', name: 'Chiron', color: '#5c8663', meaning: 'An old wound that becomes a gift' },
  north_node: { glyph: '☊', name: 'North Node', color: '#565b70', meaning: 'The direction you are growing toward' }
};

export const ASPECTS: Record<string, { glyph: string; angle: number; color: string; tone: 'easy' | 'hard' | 'blend'; plain: string }> = {
  Conjunction: { glyph: '☌', angle: 0, color: '#a9812f', tone: 'blend', plain: 'side by side — the two blend into one' },
  Sextile: { glyph: '⚹', angle: 60, color: '#2f7284', tone: 'easy', plain: '60° apart — a helpful opening' },
  Square: { glyph: '□', angle: 90, color: '#b8483a', tone: 'hard', plain: '90° apart — friction that pushes you to act' },
  Trine: { glyph: '△', angle: 120, color: '#2c7458', tone: 'easy', plain: '120° apart — an easy, natural flow' },
  Opposition: { glyph: '☍', angle: 180, color: '#b8483a', tone: 'hard', plain: 'directly opposite — a tug-of-war to balance' }
};

export function signGlyph(name: string): string {
  const s = SIGNS.find((x) => x.name.toLowerCase() === name.toLowerCase());
  return s ? s.glyph + TEXT : '';
}

export function planetGlyph(id: string): string {
  const p = PLANETS[id];
  return p ? p.glyph + TEXT : '';
}

export function withTextPresentation(char: string): string {
  return char.replace(/️/g, '') + (char.endsWith(TEXT) ? '' : TEXT);
}

/** Degrees → "12°34′" */
export function formatDegMin(deg: number): string {
  let d = Math.floor(deg);
  let m = Math.round((deg - d) * 60);
  if (m === 60) {
    d += 1;
    m = 0;
  }
  return `${d}°${String(m).padStart(2, '0')}′`;
}

interface GlyphProps {
  size?: number | string;
  color?: string;
  className?: string;
  title?: string;
}

const Glyph: React.FC<GlyphProps & { char: string }> = ({ char, size = '1em', color, className = '', title }) => (
  <span
    className={`astro-glyph ${className}`}
    style={{ fontSize: size, color }}
    role={title ? 'img' : undefined}
    aria-label={title}
    aria-hidden={title ? undefined : true}
    title={title}
  >
    {char}
  </span>
);

export const SignGlyph: React.FC<GlyphProps & { sign: string; tinted?: boolean }> = ({ sign, tinted, color, ...rest }) => {
  const s = SIGNS.find((x) => x.name.toLowerCase() === sign.toLowerCase());
  if (!s) return null;
  return <Glyph char={s.glyph + TEXT} color={color ?? (tinted ? ELEMENT_COLOR[s.element] : undefined)} title={s.name} {...rest} />;
};

export const PlanetGlyph: React.FC<GlyphProps & { planet: string; tinted?: boolean }> = ({ planet, tinted, color, ...rest }) => {
  const p = PLANETS[planet];
  if (!p) return null;
  return <Glyph char={p.glyph + TEXT} color={color ?? (tinted ? p.color : undefined)} title={p.name} {...rest} />;
};

export const AspectGlyph: React.FC<GlyphProps & { aspect: string }> = ({ aspect, color, ...rest }) => {
  const a = ASPECTS[aspect];
  if (!a) return null;
  return <Glyph char={a.glyph + TEXT} color={color ?? a.color} title={aspect} {...rest} />;
};
