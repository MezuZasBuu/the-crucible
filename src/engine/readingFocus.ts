/**
 * Editorial weighting — focus modes reorder almanac entries without recalculating the sky.
 */

import { AlmanacEntry } from './almanac';
import { ReadingFocus } from '../types';

const FOCUS_PRIORITY: Record<ReadingFocus, string[]> = {
  overview: ['maya-tone', 'bazi-day', 'lunar-phase', 'maya-seal', 'gene-key-sun', 'tribe'],
  relationships: ['lunar-phase', 'gene-key-sun', 'maya-seal', 'bazi-day', 'maya-tone', 'tribe'],
  work: ['bazi-day', 'maya-tone', 'gene-key-sun', 'lunar-phase', 'maya-seal', 'tribe'],
  creativity: ['gene-key-sun', 'maya-seal', 'lunar-phase', 'maya-tone', 'bazi-day', 'tribe'],
  mood: ['lunar-phase', 'gene-key-sun', 'maya-seal', 'maya-tone', 'bazi-day', 'tribe'],
  travel: ['maya-seal', 'maya-tone', 'lunar-phase', 'bazi-day', 'gene-key-sun', 'tribe'],
  finance: ['bazi-day', 'gene-key-sun', 'maya-tone', 'lunar-phase', 'maya-seal', 'tribe'],
  tech: ['gene-key-sun', 'bazi-day', 'maya-tone', 'lunar-phase', 'maya-seal', 'tribe']
};

export function selectEntriesForFocus(entries: AlmanacEntry[], focus: ReadingFocus, limit = 4): AlmanacEntry[] {
  const order = FOCUS_PRIORITY[focus];
  const ranked = [...entries].sort((a, b) => {
    const ia = order.indexOf(a.id);
    const ib = order.indexOf(b.id);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  return ranked.slice(0, limit);
}
