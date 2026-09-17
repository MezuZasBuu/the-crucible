/**
 * The Crucible — Archetypal Synthesis & Twelve Tribes Matrix Panel
 * Explains tribal life meaning and cross-system intertwining notes.
 */

import React, { useState } from 'react';
import { CompleteCalculationContext } from '../types';
import { IntertwiningOverview, SystemCrossNoteCard } from './SystemCrossNoteCard';
import { EpistemicBadge } from './EpistemicBadge';

interface ArchetypalMatrixPanelProps {
  ctx: CompleteCalculationContext;
}

export const ArchetypalMatrixPanel: React.FC<ArchetypalMatrixPanelProps> = ({ ctx }) => {
  const { synthesis, geneKeysSun, geneKeysEarth, intertwining } = ctx;
  const primary = intertwining.primaryTribeLife;
  const [selectedTribeIdx, setSelectedTribeIdx] = useState(0);
  const selected = synthesis.twelveTribesScores[selectedTribeIdx] || synthesis.topResonatingTribe;
  const tribeNote = intertwining.systemNotes.find((n) => n.systemId === 'twelve_tribes');

  return (
    <div className="space-y-5 motion-enter">
      <div className="instrument-panel instrument-panel-maya">
        <div className="flex flex-wrap items-center gap-2">
          <p className="ui-eyebrow text-emerald-400">Why the Twelve Tribes sit beside every system</p>
          <EpistemicBadge epistemicClass="COMPARATIVE_ANALOGY" />
          <EpistemicBadge epistemicClass="SYSTEM_INTERPRETATION" />
        </div>
        <p className="font-garamond italic text-[16px] text-[color:var(--text-secondary)] mt-3 leading-relaxed">
          {primary.whyBesideOtherSystems}
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-[var(--radius-md)] border border-emerald-500/25 bg-[color:var(--surface-well)] p-4">
            <p className="ui-eyebrow text-emerald-400">Archetypal alignment · {primary.tribe}</p>
            <p className="text-sm text-[color:var(--text-secondary)] mt-2 leading-snug">{primary.lifeRepresents}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[color:var(--solar)]/25 bg-[color:var(--surface-well)] p-4 space-y-2 text-sm">
            <p><span className="text-[color:var(--solar-bright)] font-semibold">Today · </span>{primary.dayPractice}</p>
            <p><span className="text-rose-300 font-semibold">Refuse · </span>{primary.shadowToWatch}</p>
            <p><span className="text-[color:var(--temporal-bright)] font-semibold">Embody · </span>{primary.giftToEmbody}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] p-3"><span className="ui-eyebrow text-[color:var(--temporal)]">Day</span><p className="text-[color:var(--text-muted)] mt-1 leading-snug">{primary.dayLink}</p></div>
          <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] p-3"><span className="ui-eyebrow text-[color:var(--solar)]">Month</span><p className="text-[color:var(--text-muted)] mt-1 leading-snug">{primary.monthLink}</p></div>
          <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] p-3"><span className="ui-eyebrow text-emerald-400">Birth chart</span><p className="text-[color:var(--text-muted)] mt-1 leading-snug">{primary.birthChartLink}</p></div>
          <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] p-3"><span className="ui-eyebrow">Name</span><p className="text-[color:var(--text-muted)] mt-1 leading-snug">{primary.nameLink}</p></div>
        </div>
        {tribeNote && <SystemCrossNoteCard note={tribeNote} compact accentClass="border-emerald-700 text-emerald-400" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="instrument-panel !p-5">
          <p className="ui-eyebrow">Harmonic Resonance Index</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-cinzel text-3xl text-white" style={{ textShadow: '0 0 20px rgba(98,199,218,0.35)' }}>{synthesis.harmonicResonanceIndex}</span>
            <span className="text-sm text-[color:var(--text-muted)]">/ 100</span>
          </div>
          <div className="score-track mt-3">
            <div className="score-fill" style={{ width: `${synthesis.harmonicResonanceIndex}%` }} />
          </div>
          <p className="font-garamond italic text-[14px] text-[color:var(--text-muted)] mt-3">Convergence across Maya, Chinese, Gene Keys, Enochian, and Hebraic camp streams.</p>
        </div>

        <div className="instrument-panel instrument-panel-solar !p-5">
          <p className="ui-eyebrow">Composite Polarity & Element</p>
          <div className="mt-2 font-cinzel text-2xl text-[color:var(--solar-bright)]">{synthesis.dominantPolarity}</div>
          <div className="mt-2 text-sm text-white">Element: <span className="text-[color:var(--temporal-bright)] font-semibold">{synthesis.compositeElement}</span></div>
          <p className="font-garamond italic text-[14px] text-[color:var(--text-muted)] mt-3">Governed by {ctx.chinese.dominantElement} × Maya {ctx.mayan.tzolkin.element}.</p>
        </div>

        <div className="instrument-panel instrument-panel-maya !p-5">
          <p className="ui-eyebrow">Strongest Archetypal Alignment</p>
          <div className="mt-2 font-cinzel text-2xl text-emerald-300">{synthesis.topResonatingTribe.tribe}</div>
          <div className="mt-1 text-sm text-[color:var(--text-muted)]">{synthesis.topResonatingTribe.hebrewName} · {synthesis.topResonatingTribe.gemstone}</div>
          <div className="mt-3 text-sm text-emerald-400 font-semibold">
            Affinity {synthesis.topResonatingTribe.affinityScore}% · {synthesis.topResonatingTribe.directionInCamp} Camp
          </div>
          <p className="text-sm text-[color:var(--text-secondary)] mt-2">{synthesis.recommendedFocus}</p>
        </div>
      </div>

      <div className="instrument-panel instrument-panel-solar">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <p className="ui-eyebrow text-[color:var(--solar)]">Gene Keys · Solar / Earth Transit</p>
            <h4 className="panel-title mt-1">Intertwined with tribal gift practice</h4>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4">
            <div className="flex items-center justify-between">
              <span className="ui-eyebrow text-[color:var(--solar)]">☉ Conscious Sun</span>
              <span className="data-readout">Gate {geneKeysSun.gate}.{geneKeysSun.line}</span>
            </div>
            <div className="mt-2 font-cinzel text-lg text-white">{geneKeysSun.name}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-[var(--radius-sm)] border border-rose-500/30 bg-rose-950/20 text-rose-300"><div className="ui-eyebrow mb-1">Shadow</div><div className="font-semibold">{geneKeysSun.shadow}</div></div>
              <div className="p-2 rounded-[var(--radius-sm)] border border-[color:var(--temporal)]/30 bg-cyan-950/20 text-[color:var(--temporal-bright)]"><div className="ui-eyebrow mb-1">Gift</div><div className="font-semibold">{geneKeysSun.gift}</div></div>
              <div className="p-2 rounded-[var(--radius-sm)] border border-[color:var(--solar)]/30 bg-amber-950/20 text-[color:var(--solar-bright)]"><div className="ui-eyebrow mb-1">Siddhi</div><div className="font-semibold">{geneKeysSun.siddhi}</div></div>
            </div>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4">
            <div className="flex items-center justify-between">
              <span className="ui-eyebrow text-emerald-400">♁ Design Earth</span>
              <span className="data-readout">Gate {geneKeysEarth.gate}.{geneKeysEarth.line}</span>
            </div>
            <div className="mt-2 font-cinzel text-lg text-white">{geneKeysEarth.name}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-[var(--radius-sm)] border border-rose-500/30 bg-rose-950/20 text-rose-300"><div className="ui-eyebrow mb-1">Shadow</div><div className="font-semibold">{geneKeysEarth.shadow}</div></div>
              <div className="p-2 rounded-[var(--radius-sm)] border border-[color:var(--temporal)]/30 bg-cyan-950/20 text-[color:var(--temporal-bright)]"><div className="ui-eyebrow mb-1">Gift</div><div className="font-semibold">{geneKeysEarth.gift}</div></div>
              <div className="p-2 rounded-[var(--radius-sm)] border border-[color:var(--solar)]/30 bg-amber-950/20 text-[color:var(--solar-bright)]"><div className="ui-eyebrow mb-1">Siddhi</div><div className="font-semibold">{geneKeysEarth.siddhi}</div></div>
            </div>
          </div>
        </div>
        {intertwining.systemNotes.find((n) => n.systemId === 'gene_keys') && (
          <SystemCrossNoteCard
            note={intertwining.systemNotes.find((n) => n.systemId === 'gene_keys')!}
            accentClass="border-amber-800 text-amber-400"
          />
        )}
      </div>

      <div className="instrument-panel instrument-panel-maya">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <p className="ui-eyebrow">Twelve Tribes Camp Matrix</p>
            <h4 className="panel-title mt-1">Click a tribe</h4>
          </div>
          <span className="text-xs text-[color:var(--text-muted)]">Numbers 2 · Life connotations</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {synthesis.twelveTribesScores.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedTribeIdx(idx)}
              className={`p-3 rounded-[var(--radius-md)] border text-left transition-all ${
                idx === selectedTribeIdx
                  ? 'border-emerald-400/60 bg-emerald-950/25 shadow-[0_0_20px_rgba(52,211,153,0.12)]'
                  : 'border-[color:var(--line-soft)] bg-[color:var(--surface-well)] hover:border-[color:var(--line-medium)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white text-sm">{t.tribe.split('(')[0].trim()}</span>
                <span className="text-sm font-semibold text-emerald-400">{t.affinityScore}%</span>
              </div>
              <div className="text-xs text-[color:var(--text-muted)] mt-1">{t.hebrewName}</div>
              <div className="text-xs text-[color:var(--text-secondary)] mt-2 line-clamp-2">{t.lifeConnotation?.giftToEmbody || t.archetypeRole}</div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-[color:var(--text-muted)] pt-2 border-t border-[color:var(--line-soft)]">
                <span>CAMP {t.directionInCamp}</span>
                <span>{t.zodiacCorrespondence.split('(')[0]}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-[var(--radius-lg)] border border-emerald-500/25 bg-[color:var(--surface-well)] p-5 space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="font-cinzel text-lg text-white">{selected.tribe}</h4>
            <span className="text-sm text-emerald-400">{selected.bannerSymbol}</span>
          </div>
          <p className="font-garamond italic text-[16px] text-[color:var(--text-secondary)] leading-relaxed">
            {selected.lifeConnotation?.lifeRepresents || selected.resonanceDescription}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] p-3"><span className="ui-eyebrow text-[color:var(--solar)]">Day practice</span><p className="mt-2 text-[color:var(--text-secondary)]">{selected.lifeConnotation?.dayPractice}</p></div>
            <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] p-3"><span className="ui-eyebrow text-rose-300">Shadow</span><p className="mt-2 text-[color:var(--text-secondary)]">{selected.lifeConnotation?.shadowToWatch}</p></div>
            <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] p-3"><span className="ui-eyebrow text-[color:var(--temporal)]">Gift</span><p className="mt-2 text-[color:var(--text-secondary)]">{selected.lifeConnotation?.giftToEmbody}</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[color:var(--text-muted)]">
            <p><span className="text-[color:var(--temporal)] font-semibold">↔ Day · </span>{selected.dayConnection}</p>
            <p><span className="text-[color:var(--solar)] font-semibold">↔ Month · </span>{selected.monthConnection}</p>
            <p><span className="text-emerald-400 font-semibold">↔ Birth · </span>{selected.birthChartConnection}</p>
            <p><span className="font-semibold">↔ Name · </span>{selected.nameConnection}</p>
          </div>
        </div>
      </div>

      <IntertwiningOverview
        notes={intertwining.systemNotes}
        narrative={intertwining.triangulationNarrative}
        threads={intertwining.intertwiningThreads}
      />

      <div className="instrument-panel">
        <p className="ui-eyebrow mb-1">Cross-notes</p>
        <h4 className="panel-title mb-4">Beside every spiritual system</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {intertwining.systemNotes.filter((n) => n.systemId !== 'twelve_tribes').map((n) => (
            <SystemCrossNoteCard
              key={n.systemId}
              note={n}
              accentClass={
                n.systemId === 'mayan' || n.systemId === 'dreamspell'
                  ? 'border-cyan-800 text-cyan-400'
                  : n.systemId === 'chinese'
                    ? 'border-green-800 text-green-400'
                    : n.systemId === 'enochian_biblical'
                      ? 'border-amber-800 text-amber-400'
                      : 'border-[color:var(--line-medium)] text-[color:var(--text-muted)]'
              }
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="instrument-panel">
          <p className="ui-eyebrow text-[color:var(--temporal)] mb-3">Framework Agreements</p>
          <div className="space-y-2 font-garamond italic text-[15px] text-[color:var(--temporal-bright)]/90">
            {synthesis.crossSystemAgreements.map((a, idx) => (
              <p key={idx} className="border-l-2 border-[color:var(--temporal)]/40 pl-3">{a}</p>
            ))}
          </div>
        </div>
        <div className="instrument-panel instrument-panel-solar">
          <p className="ui-eyebrow text-[color:var(--solar)] mb-3">Dialectical Tensions</p>
          <div className="space-y-2 font-garamond italic text-[15px] text-[color:var(--solar-bright)]/90">
            {synthesis.creativeTensionsOrAnomalies.map((t, idx) => (
              <p key={idx} className="border-l-2 border-[color:var(--solar)]/40 pl-3">{t}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
