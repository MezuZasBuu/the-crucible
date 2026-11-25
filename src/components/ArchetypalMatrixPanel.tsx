/**
 * The Twelve Callings — today's calling, the compass of all twelve,
 * and (for the curious) how every system connects to the others.
 */

import React, { useState } from 'react';
import { CompleteCalculationContext } from '../types';
import { CALLING_QUARTERS } from '../engine/synthesis';
import { IntertwiningOverview, SystemCrossNoteCard } from './SystemCrossNoteCard';
import { CallingsWheel } from './CallingsWheel';
import { CallingEmblem, CultureHeader, QUARTER_COLOR } from './symbols/CultureSymbols';
import { SignGlyph } from './symbols/AstroGlyph';

interface ArchetypalMatrixPanelProps {
  ctx: CompleteCalculationContext;
}

export const ArchetypalMatrixPanel: React.FC<ArchetypalMatrixPanelProps> = ({ ctx }) => {
  const { synthesis, intertwining } = ctx;
  const top = synthesis.topCalling;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = synthesis.callingScores.find((c) => c.id === (selectedId ?? top.id)) ?? top;
  const life = selected.lifeConnotation;
  const quarter = CALLING_QUARTERS[selected.quarter];
  const color = QUARTER_COLOR[selected.quarter];
  const isTop = selected.id === top.id;

  return (
    <div className="space-y-5 motion-enter">
      <div className="instrument-panel space-y-5">
        <CultureHeader culture="callings" />

        <div className="callings-layout">
          <CallingsWheel
            callings={synthesis.callingScores}
            topId={top.id}
            selectedId={selected.id}
            onSelect={setSelectedId}
          />

          <div aria-live="polite">
            <p className="ui-eyebrow" style={{ color }}>
              {isTop ? 'Today’s calling' : 'One of the twelve'}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="grid place-items-center w-12 h-12 rounded-full" style={{ background: color, color: '#fffdf8' }}>
                <CallingEmblem emblemId={selected.emblemId} size={26} />
              </span>
              <div>
                <h4 className="calling-detail-name">{selected.calling}</h4>
                <p className="calling-detail-motto">“{selected.motto}”</p>
              </div>
            </div>

            <div className="calling-chips">
              <span className="calling-chip">
                <strong>{selected.quarter}</strong> · {quarter.phase}, {quarter.theme}
              </span>
              <span className="calling-chip">
                <SignGlyph sign={selected.zodiacCorrespondence} size={14} tinted /> {selected.zodiacCorrespondence}
              </span>
              <span className="calling-chip">Stone: {selected.gemstone}</span>
              <span className="calling-chip">Emblem: {selected.emblem}</span>
            </div>

            <dl className="calling-rows">
              <div className="calling-row">
                <dt>About</dt>
                <dd>{life?.lifeRepresents ?? selected.archetypeRole}</dd>
              </div>
              <div className="calling-row">
                <dt>Try today</dt>
                <dd>{life?.dayPractice}</dd>
              </div>
              <div className="calling-row">
                <dt>Its gift</dt>
                <dd>{life?.giftToEmbody}</dd>
              </div>
              <div className="calling-row">
                <dt>Watch for</dt>
                <dd>{life?.shadowToWatch}</dd>
              </div>
            </dl>

            <div className="calling-score">
              <span>Match with today</span>
              <div className="score-track">
                <div className="score-fill" style={{ width: `${selected.affinityScore}%`, background: color, boxShadow: 'none' }} />
              </div>
              <strong style={{ color: 'var(--text-primary)' }}>{selected.affinityScore}%</strong>
            </div>
            <p className="readable-muted mt-2">
              The match comes from today’s Maya direction ({ctx.mayan.tzolkin.direction}), the strongest Chinese element (
              {ctx.chinese.dominantElement}) and today’s number ({ctx.numerology.universalDay}). It changes daily — it is a
              role to try on, not a label for who you are.
              {!isTop && (
                <>
                  {' '}
                  <button type="button" className="app-footer-link" onClick={() => setSelectedId(null)}>
                    Back to today’s calling
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <details className="instrument-panel curious">
        <summary>
          <span className="panel-title">For the curious: how the traditions connect</span>
          <span className="readable-muted">Where they agree, where they disagree, and what to do about it</span>
        </summary>

        <div className="space-y-5 mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="curious-box">
              <p className="ui-eyebrow">Where the traditions agree today</p>
              <ul className="curious-list">
                {synthesis.crossSystemAgreements.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="curious-box">
              <p className="ui-eyebrow">Where they pull apart</p>
              <ul className="curious-list">
                {synthesis.creativeTensionsOrAnomalies.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="curious-box">
            <div className="flex items-baseline justify-between gap-3">
              <p className="ui-eyebrow">Overall agreement score</p>
              <p className="data-readout">{synthesis.harmonicResonanceIndex} / 100</p>
            </div>
            <div className="score-track mt-2">
              <div className="score-fill" style={{ width: `${synthesis.harmonicResonanceIndex}%` }} />
            </div>
            <p className="readable-muted mt-2">
              A rough measure of how many of the systems point the same way today. Overall tone: {synthesis.dominantPolarity}.
            </p>
          </div>

          <IntertwiningOverview
            notes={intertwining.systemNotes}
            narrative={intertwining.triangulationNarrative}
            threads={intertwining.intertwiningThreads}
          />

          <div>
            <p className="ui-eyebrow mb-1">Each tradition, one at a time</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {intertwining.systemNotes.map((n) => (
                <SystemCrossNoteCard key={n.systemId} note={n} />
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
};
