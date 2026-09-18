/**
 * TGOLD memory layer — investigation hooks and related prior insights.
 */

import { SavedInsight, loadInsights, type ResearchHook } from '../savedInsights';

const STOP = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'are',
  'was', 'were', 'be', 'been', 'with', 'as', 'by', 'from', 'that', 'this', 'it', 'its',
  'you', 'your', 'we', 'our', 'they', 'their', 'what', 'which', 'who', 'how', 'why',
  'when', 'where', 'can', 'could', 'would', 'should', 'about', 'into', 'than', 'then'
]);

function tokenize(text: string): string[] {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !STOP.has(t));
}

function sectionBullets(text: string, headerRe: RegExp): string[] {
  const lines = String(text || '').split(/\n/);
  const out: string[] = [];
  let inSection = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^\*\*[^*]+\*\*:?\s*$/.test(trimmed) || /^#{1,3}\s+/.test(trimmed)) {
      inSection = headerRe.test(trimmed);
      continue;
    }
    if (!inSection) continue;
    if (/^\*\*[^*]+\*\*:?\s*$/.test(trimmed)) break;
    const bullet = trimmed.replace(/^[-•*]\s+/, '').replace(/^\d+[.)]\s+/, '').trim();
    if (bullet.length >= 12) out.push(bullet.slice(0, 320));
    if (out.length >= 8) break;
  }
  return out;
}

export function extractResearchArtifacts(answer: string): {
  investigationHooks: ResearchHook[];
  intelligenceGaps: ResearchHook[];
} {
  const hooks = sectionBullets(answer, /investigation\s*hooks|next\s*questions|hooks\s*for|deeper\s*questions/i).map(
    (text) => ({ text, source: 'answer' as const })
  );
  const gaps = sectionBullets(answer, /intelligence\s*gaps|vector\s*gaps|open\s*gaps|known\s*gaps|what\s*remains\s*unknown/i).map(
    (text) => ({ text, source: 'answer' as const })
  );
  return { investigationHooks: hooks, intelligenceGaps: gaps };
}

function insightBlob(insight: SavedInsight): string {
  const b = insight.bearing;
  const hooks = (insight.investigationHooks || []).map((h) => h.text).join(' ');
  const gaps = (insight.intelligenceGaps || []).map((g) => g.text).join(' ');
  return `${b.theme} ${b.summary} ${b.practice} ${b.watchFor} ${insight.note || ''} ${hooks} ${gaps}`;
}

export function scoreInsightRelevance(query: string, insight: SavedInsight): number {
  const qTokens = new Set(tokenize(query));
  if (qTokens.size === 0) return 0;
  const eTokens = tokenize(insightBlob(insight));
  if (eTokens.length === 0) return 0;
  let hits = 0;
  for (const t of eTokens) {
    if (qTokens.has(t)) hits += 1;
  }
  const uniqueHits = new Set(eTokens.filter((t) => qTokens.has(t))).size;
  return uniqueHits * 2 + hits / Math.sqrt(eTokens.length);
}

export function selectRelatedInsights(
  query: string,
  opts?: { excludeId?: string; limit?: number; minScore?: number }
): SavedInsight[] {
  const excludeId = opts?.excludeId || '';
  const limit = opts?.limit ?? 3;
  const minScore = opts?.minScore ?? 2.5;
  return loadInsights()
    .filter((e) => e.id !== excludeId)
    .map((e) => ({ e, score: scoreInsightRelevance(query, e) }))
    .filter((row) => row.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.e);
}

export function buildMemoryContextBlock(query: string): string {
  const related = selectRelatedInsights(query);
  if (related.length === 0) return '';
  const lines = related.map((r) => {
    const hooks = (r.investigationHooks || []).slice(0, 2).map((h) => h.text).join('; ');
    return `- ${r.bearing.theme} (${r.savedAtIso.slice(0, 10)}): ${r.bearing.summary.slice(0, 180)}${hooks ? ` | Open: ${hooks}` : ''}`;
  });
  return `PRIOR CRUCIBLE RESEARCH MEMORY (related saved readings):\n${lines.join('\n')}`;
}
