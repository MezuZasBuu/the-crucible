/**
 * Compact cross-note callout — navigation ladder through each system.
 * Why → Independent → Intersect → Disagree → Act
 */

import React, { useState } from 'react';
import { SystemCrossNote } from '../types';
import { ChevronDown, ChevronRight, Link2 } from 'lucide-react';

interface SystemCrossNoteCardProps {
  note: SystemCrossNote;
  compact?: boolean;
  accentClass?: string;
}

const LADDER: Array<{
  key: keyof SystemCrossNote;
  step: string;
  label: string;
  tone: string;
}> = [
  { key: 'whyPresent', step: '1', label: 'Why is this here?', tone: 'text-gray-500' },
  { key: 'independentlySays', step: '2', label: 'What does it independently say?', tone: 'text-cyan-600' },
  { key: 'intersectsWith', step: '3', label: 'Where does it intersect?', tone: 'text-emerald-600' },
  { key: 'disagreesWith', step: '4', label: 'Where does it disagree?', tone: 'text-amber-600' },
  { key: 'doWithDisagreement', step: '5', label: 'What do you do with that?', tone: 'text-rose-500' }
];

export const SystemCrossNoteCard: React.FC<SystemCrossNoteCardProps> = ({
  note,
  compact = true,
  accentClass = 'border-cyan-800 text-cyan-400'
}) => {
  const [open, setOpen] = useState(!compact);

  return (
    <div className={`mt-3 rounded-[var(--radius-md)] border bg-white/[0.02] ${accentClass.split(' ')[0]} border-opacity-60 overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-start gap-2 px-3 py-2.5 text-left hover:bg-white/[0.035] transition-colors"
      >
        {open ? <ChevronDown className="w-3.5 h-3.5 mt-0.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
        <div className="min-w-0 flex-1">
          <div className={`ui-eyebrow flex items-center gap-1.5 ${accentClass.split(' ').slice(1).join(' ') || 'text-cyan-400'}`}>
            <Link2 className="w-3 h-3" />
            Why is this here? · Navigation ladder
          </div>
          <p className="font-garamond text-[14px] text-[color:var(--text-secondary)] italic leading-snug mt-1 line-clamp-2">
            {note.crossNote}
          </p>
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 border-t border-[color:var(--line-soft)] pt-3 text-xs">
          {LADDER.map((row) => (
            <div key={row.key} className="bg-[color:var(--surface-well)] border border-[color:var(--line-soft)] p-3 rounded-[var(--radius-sm)]">
              <div className={`ui-eyebrow ${row.tone}`}>
                {row.step}. {row.label}
              </div>
              <p className="text-[color:var(--text-secondary)] mt-1 leading-snug">{String(note[row.key] || '')}</p>
            </div>
          ))}
          <div className="pt-3 border-t border-[color:var(--line-soft)] space-y-2">
            <p className="text-[color:var(--text-secondary)]"><span className="ui-eyebrow">Archetypal relevance · </span>{note.lifeRelevance}</p>
            <p className="text-[color:var(--solar-bright)]/80"><span className="ui-eyebrow text-[color:var(--solar)]">Name · </span>{note.connectsToName}</p>
            <p className="text-emerald-200/80"><span className="ui-eyebrow text-emerald-500">Birth chart · </span>{note.connectsToBirthChart}</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface IntertwiningPanelProps {
  notes: SystemCrossNote[];
  narrative: string;
  threads: Array<{ id: string; title: string; nodes: string[]; meaning: string }>;
}

export const IntertwiningOverview: React.FC<IntertwiningPanelProps> = ({ notes, narrative, threads }) => {
  return (
    <div className="instrument-panel instrument-panel-solar space-y-4">
      <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-3">
        <h4 className="panel-title">
          Cross-System Intertwining · Triangulation
        </h4>
        <span className="ui-eyebrow">{notes.length} system notes</span>
      </div>
      <pre className="whitespace-pre-wrap font-garamond text-[16px] text-[color:var(--text-secondary)] leading-relaxed max-h-48 overflow-y-auto">
        {narrative}
      </pre>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {threads.map((t) => (
          <div key={t.id} className="bg-[color:var(--surface-well)] border border-[color:var(--line-soft)] p-4 rounded-[var(--radius-md)]">
            <p className="ui-eyebrow text-cyan-300">{t.title}</p>
            <p className="text-xs text-[color:var(--text-secondary)] mt-2">{t.nodes.join(' → ')}</p>
            <p className="font-garamond text-[14px] text-[color:var(--text-muted)] italic mt-2">{t.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
