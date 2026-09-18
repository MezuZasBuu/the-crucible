import { DailyBearing } from '../types';

const KEY = 'crucible.savedInsights.v1';

export type ResearchHook = { text: string; source?: string };

export interface SavedInsight {
  id: string;
  savedAtIso: string;
  note?: string;
  bearing: DailyBearing;
  /** Investigation hooks extracted from expanded readings */
  investigationHooks?: ResearchHook[];
  /** Open questions for follow-up research */
  intelligenceGaps?: ResearchHook[];
  /** TGOLD evidence vector ids consulted when this insight was saved */
  tgoldVectorsConsulted?: number[];
}

export function loadInsights(): SavedInsight[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedInsight[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInsight(
  bearing: DailyBearing,
  note?: string,
  extras?: Pick<SavedInsight, 'investigationHooks' | 'intelligenceGaps' | 'tgoldVectorsConsulted'>
): SavedInsight {
  const item: SavedInsight = {
    id: `insight-${Date.now().toString(36)}`,
    savedAtIso: new Date().toISOString(),
    note,
    bearing,
    ...extras
  };
  if (typeof localStorage === 'undefined') return item;
  const next = [item, ...loadInsights()].slice(0, 40);
  localStorage.setItem(KEY, JSON.stringify(next));
  return item;
}
