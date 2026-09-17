/**
 * Editorial weighting — focus modes reorder almanac entries without recalculating the sky.
 */

import { AlmanacEntry } from './almanac';
import { ReadingFocus } from '../types';

const FOCUS_PRIORITY: Record<ReadingFocus, string[]> = {
  overview: ['maya-tone', 'bazi-day', 'lunar-phase', 'tribe', 'maya-seal', 'gene-key-sun'],
  relationships: ['lunar-phase', 'tribe', 'gene-key-sun', 'maya-seal', 'bazi-day', 'maya-tone'],
  work: ['bazi-day', 'maya-tone', 'tribe', 'gene-key-sun', 'lunar-phase', 'maya-seal'],
  creativity: ['gene-key-sun', 'maya-seal', 'lunar-phase', 'maya-tone', 'tribe', 'bazi-day']
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
