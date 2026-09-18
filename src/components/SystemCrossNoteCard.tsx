/**
 * Cross-system note — direct answers, category tag top-right.
 */

import React, { useState } from 'react';
import { SystemCrossNote } from '../types';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { StoryProse } from './ui/StoryProse';

interface SystemCrossNoteCardProps {
  note: SystemCrossNote;
  compact?: boolean;
}

const LADDER: Array<{ key: keyof SystemCrossNote; category: string }> = [
  { key: 'independentlySays', category: 'On its own' },
  { key: 'intersectsWith', category: 'Where it meets the day' },
  { key: 'disagreesWith', category: 'Where it pushes back' },
  { key: 'doWithDisagreement', category: 'What to do' }
];

export const SystemCrossNoteCard: React.FC<SystemCrossNoteCardProps> = ({ note, compact = true }) => {
  const [open, setOpen] = useState(!compact);

  return (
    <div className="mt-3 rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-white/40 overflow-hidden shadow-[var(--shadow-raised)]">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-start gap-2 px-4 py-3 text-left hover:bg-white/30 transition-colors"
      >
        {open ? <ChevronDown className="w-4 h-4 mt-1 shrink-0" /> : <ChevronRight className="w-4 h-4 mt-1 shrink-0" />}
        <div className="min-w-0 flex-1">
          <p className="ui-eyebrow">How this fits today</p>
          <StoryProse text={note.crossNote} className="mt-2 text-[1.05rem]" />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2.5 border-t border-[color:var(--line-soft)] pt-3">
          {LADDER.map((row) => {
            const answer = String(note[row.key] || '').trim();
            if (!answer) return null;
            return (
              <div key={row.key} className="ladder-card">
                <span className="ladder-category">{row.category}</span>
                <p className="ladder-answer">{answer}</p>
              </div>
            );
          })}
          <div className="ladder-card">
            <span className="ladder-category">Life field</span>
            <p className="ladder-answer">{note.lifeRelevance}</p>
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
  const plainNarrative = narrative
    .replace(/\b(Kin|Tzolk'in|BaZi|Nakshatra|Gene Key|Enochian)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return (
    <div className="instrument-panel space-y-4">
      <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-3">
        <h4 className="panel-title">The day in one weave</h4>
        <span className="ui-eyebrow">{notes.length} threads</span>
      </div>
      <StoryProse text={plainNarrative} className="text-[1.08rem] leading-relaxed max-h-56 overflow-y-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {threads.map((t) => (
          <div key={t.id} className="ladder-card">
            <span className="ladder-category">{t.title}</span>
            <p className="ladder-answer mt-4">{t.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
