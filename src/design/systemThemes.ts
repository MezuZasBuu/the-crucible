/**
 * The Crucible — design tokens / tradition visual identities
 * Monochrome shell + restrained per-system accents (not rainbow cards).
 */

export const CRUCIBLE_SHELL = {
  void: '#050505',
  panel: '#0a0a0a',
  well: '#0d0d0d',
  border: '#222222',
  text: '#d1d5db',
  silver: '#c4c4c4'
} as const;

export type TraditionId =
  | 'maya'
  | 'chinese'
  | 'egyptian'
  | 'ethiopian'
  | 'greek'
  | 'enochian'
  | 'roman'
  | 'dreamspell'
  | 'vedic'
  | 'gene_keys'
  | 'astrocartography'
  | 'gaia'
  | 'numerology'
  | 'tribes';

export const SYSTEM_VISUAL: Record<
  TraditionId,
  { accent: string; label: string; borderClass: string; textClass: string }
> = {
  maya: { accent: '#2dd4bf', label: 'Maya', borderClass: 'border-teal-700', textClass: 'text-teal-300' },
  chinese: { accent: '#f59e0b', label: 'Chinese', borderClass: 'border-amber-700', textClass: 'text-amber-300' },
  egyptian: { accent: '#d4a574', label: 'Egyptian', borderClass: 'border-yellow-800', textClass: 'text-yellow-200' },
  ethiopian: { accent: '#b91c1c', label: 'Ethiopian', borderClass: 'border-red-800', textClass: 'text-red-300' },
  greek: { accent: '#e7e5e4', label: 'Greek', borderClass: 'border-stone-500', textClass: 'text-stone-200' },
  enochian: { accent: '#818cf8', label: 'Enochian', borderClass: 'border-indigo-700', textClass: 'text-indigo-300' },
  roman: { accent: '#9f1239', label: 'Roman', borderClass: 'border-rose-900', textClass: 'text-rose-300' },
  dreamspell: { accent: '#a78bfa', label: 'Dreamspell', borderClass: 'border-violet-700', textClass: 'text-violet-300' },
  vedic: { accent: '#fbbf24', label: 'Vedic', borderClass: 'border-amber-600', textClass: 'text-amber-200' },
  gene_keys: { accent: '#c084fc', label: 'Gene Keys', borderClass: 'border-purple-700', textClass: 'text-purple-300' },
  astrocartography: { accent: '#38bdf8', label: 'Astrocartography', borderClass: 'border-sky-700', textClass: 'text-sky-300' },
  gaia: { accent: '#34d399', label: 'Field Overlay', borderClass: 'border-emerald-700', textClass: 'text-emerald-300' },
  numerology: { accent: '#d6d3d1', label: 'Numerology', borderClass: 'border-stone-600', textClass: 'text-stone-300' },
  tribes: { accent: '#4ade80', label: 'Tribes', borderClass: 'border-green-700', textClass: 'text-green-300' }
};

export const ELEMENT_FILL: Record<string, string> = {
  Fire: 'rgba(239, 68, 68, 0.12)',
  Earth: 'rgba(245, 158, 11, 0.12)',
  Air: 'rgba(34, 211, 238, 0.10)',
  Water: 'rgba(59, 130, 246, 0.12)'
};
