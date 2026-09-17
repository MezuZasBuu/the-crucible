/**
 * The Crucible — Enochian Time, Biblical Transits & Roman Diurnal Panel
 * Dedicated view with A/B peek (Civil vs Enochian/Biblical) and hour matrix.
 */

import React, { useState } from 'react';
import { CompleteCalculationContext } from '../types';
import { Compass, FlipHorizontal2, BookOpen, Clock, GitFork, Eye } from 'lucide-react';
import { EpistemicBadge } from './EpistemicBadge';

interface EnochianBiblicalPanelProps {
  ctx: CompleteCalculationContext;
  onEnableMapFlip?: (enabled: boolean) => void;
  mapFlipEnabled?: boolean;
}

export const EnochianBiblicalPanel: React.FC<EnochianBiblicalPanelProps> = ({
  ctx,
  onEnableMapFlip,
  mapFlipEnabled = false
}) => {
  const eb = ctx.enochianBiblical;
  const [peekMode, setPeekMode] = useState<'A' | 'B' | 'COMPARE'>('COMPARE');
  const [showHourMatrix, setShowHourMatrix] = useState(false);
  const [showHalfHours, setShowHalfHours] = useState(false);

  return (
    <div className="space-y-5 motion-enter text-[color:var(--text-secondary)]">
      {/* Header + A/B Peek Toggle */}
      <div className="instrument-panel instrument-panel-solar">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--line-soft)] pb-4 mb-4">
          <div className="flex items-start gap-2.5">
            <div className="rounded-[var(--radius-md)] border border-amber-300/20 bg-amber-300/[0.06] p-2 text-[color:var(--solar-bright)] shadow-[var(--glow-solar)]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="panel-title">
                  Enochian Time · Biblical Transits · Roman Dies
                </h3>
                <EpistemicBadge epistemicClass="TEXTUAL_TRADITION" />
                <EpistemicBadge epistemicClass="SYSTEM_INTERPRETATION" />
              </div>
              <p className="ui-eyebrow mt-1">
                1 Enoch 72–82 · Tekufot verses · Chaldean hours · Compass flip triangulation
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-1">
              {(
                [
                  { id: 'A' as const, label: 'Peek A · Civil' },
                  { id: 'B' as const, label: 'Peek B · Enochian' },
                  { id: 'COMPARE' as const, label: 'A/B Compare' }
                ]
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPeekMode(m.id)}
                  className={`nav-tab ${
                    peekMode === m.id
                      ? 'nav-tab-active bg-amber-300/[0.06] text-[color:var(--solar-bright)]'
                      : ''
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {onEnableMapFlip && (
              <button
                onClick={() => onEnableMapFlip(!mapFlipEnabled)}
                className={`cta-ghost min-h-0 px-3 py-2 text-[10px] uppercase ${
                  mapFlipEnabled
                    ? 'border-amber-300/40 bg-amber-300/[0.08] text-[color:var(--solar-bright)]'
                    : ''
                }`}
                title="Toggle Enochian compass & world-map flip"
              >
                <FlipHorizontal2 className="w-3 h-3" />
                Map Flip {mapFlipEnabled ? 'ON' : 'OFF'}
              </button>
            )}
          </div>
        </div>

        {/* A/B Peek Frames */}
        <div className={`grid gap-3 ${peekMode === 'COMPARE' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {(peekMode === 'A' || peekMode === 'COMPARE') && (
            <div className="rounded-[var(--radius-md)] border border-cyan-300/15 border-l-2 border-l-[color:var(--temporal)] bg-cyan-300/[0.035] p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Eye className="w-3 h-3 text-cyan-400" />
                <span className="ui-eyebrow text-[color:var(--temporal)]">{eb.abPeek.pathA.label}</span>
              </div>
              <h4 className="font-cinzel text-sm text-white font-bold">{eb.abPeek.pathA.title}</h4>
              <p className="font-serif text-[11px] text-gray-300 italic mt-1.5 leading-relaxed">
                {eb.abPeek.pathA.summary}
              </p>
              <ul className="mt-2 space-y-1">
                {eb.abPeek.pathA.keySignals.map((s, i) => (
                  <li key={i} className="text-[10px] text-gray-400 pl-2 border-l border-cyan-800">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(peekMode === 'B' || peekMode === 'COMPARE') && (
            <div className="rounded-[var(--radius-md)] border border-amber-300/15 border-l-2 border-l-[color:var(--solar)] bg-amber-300/[0.035] p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <GitFork className="w-3 h-3 text-amber-400" />
                <span className="ui-eyebrow text-[color:var(--solar)]">{eb.abPeek.pathB.label}</span>
              </div>
              <h4 className="font-cinzel text-sm text-white font-bold">{eb.abPeek.pathB.title}</h4>
              <p className="font-serif text-[11px] text-gray-300 italic mt-1.5 leading-relaxed">
                {eb.abPeek.pathB.summary}
              </p>
              <ul className="mt-2 space-y-1">
                {eb.abPeek.pathB.keySignals.map((s, i) => (
                  <li key={i} className="text-[10px] text-gray-400 pl-2 border-l border-amber-800">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {peekMode === 'COMPARE' && (
          <div className="mt-4 rounded-[var(--radius-md)] border border-emerald-300/15 bg-emerald-300/[0.035] p-3">
            <p className="ui-eyebrow text-emerald-400 mb-1">{eb.abPeek.synthesis.title}</p>
            <p className="font-serif text-[11px] text-gray-300 leading-relaxed">{eb.abPeek.synthesis.summary}</p>
          </div>
        )}
      </div>

      {/* Core telemetry grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Enochian Calendar */}
        <div className="instrument-panel instrument-panel-solar !p-4">
          <h4 className="ui-eyebrow text-[color:var(--solar)] border-b border-[color:var(--line-soft)] pb-2 mb-3">
            Enochian 364-Day Computus
          </h4>
          <p className="font-cinzel text-sm text-white font-bold">{eb.enochian.formatted}</p>
          <div className="mt-3 space-y-1.5 text-[11px]">
            <div className="flex justify-between"><span className="text-gray-500">Season</span><span className="text-amber-200">{eb.enochian.seasonName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Watch Gate</span><span className="text-cyan-300">{eb.enochian.watchGate}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Week of Year</span><span>{eb.enochian.weekOfYear} / 52</span></div>
            <div className="flex justify-between">
              <span className="text-gray-500">Intercalary</span>
              <span className={eb.enochian.isIntercalaryDay ? 'text-amber-400 font-bold' : 'text-gray-500'}>
                {eb.enochian.isIntercalaryDay ? 'PORTAL DAY' : 'Standard'}
              </span>
            </div>
          </div>
          <p className="text-[9px] text-gray-600 mt-2 italic">{eb.enochian.sourceAuthority}</p>
        </div>

        {/* Biblical Season + Verses */}
        <div className="instrument-panel instrument-panel-maya !p-4 md:col-span-1 lg:col-span-2">
          <h4 className="ui-eyebrow text-emerald-400 border-b border-[color:var(--line-soft)] pb-2 mb-3">
            Biblical Tekufah Transit & Season Verses
          </h4>
          <p className="font-cinzel text-sm text-white font-bold">{eb.biblicalSeason.name}</p>
          <p className="text-[10px] text-gray-400 mt-1">
            {eb.biblicalSeason.hebrewTekufah} · {eb.biblicalSeason.agriculturalPhase}
          </p>
          <p className="font-serif text-[11px] text-gray-300 italic mt-2 leading-snug">
            {eb.biblicalTransits.narrative}
          </p>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {eb.biblicalSeason.verses.map((v) => (
              <div key={v.ref} className="rounded-[var(--radius-md)] border border-emerald-300/10 border-l-2 border-l-emerald-500 bg-emerald-300/[0.025] p-3">
                <p className="text-[9px] font-bold text-emerald-400 uppercase">{v.ref}</p>
                <p className="font-serif text-[10px] text-gray-400 italic mt-0.5 leading-snug">{v.text}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-amber-200/80 mt-2">
            Liturgical echo: {eb.biblicalSeason.liturgicalEcho}
          </p>
        </div>

        {/* Roman Day Deities */}
        <div className="instrument-panel instrument-panel-solar !p-4">
          <h4 className="ui-eyebrow text-orange-400 border-b border-[color:var(--line-soft)] pb-2 mb-3">
            Gregorian Dies & Deity
          </h4>
          <p className="font-cinzel text-base text-white font-bold">{eb.gregorianWeekdayDeity.latinDies}</p>
          <p className="text-xs text-orange-300 mt-0.5">{eb.gregorianWeekdayDeity.romanDeity}</p>
          <p className="text-[10px] text-gray-400 mt-2">{eb.gregorianWeekdayDeity.energy}</p>
          <p className="text-[9px] text-cyan-500 mt-1.5">{eb.gregorianWeekdayDeity.ritualTone}</p>
          <div className="mt-2 flex justify-between text-[9px] text-gray-500">
            <span>Ruler: {eb.gregorianWeekdayDeity.planetaryRuler}</span>
            <span>Ray: {eb.gregorianWeekdayDeity.colorRay}</span>
          </div>
        </div>

        <div className="instrument-panel !p-4">
          <h4 className="ui-eyebrow text-[color:var(--temporal)] border-b border-[color:var(--line-soft)] pb-2 mb-3">
            Julian Dies & Deity
          </h4>
          <p className="font-cinzel text-base text-white font-bold">{eb.julianWeekdayDeity.latinDies}</p>
          <p className="text-xs text-[color:var(--temporal-bright)] mt-0.5">{eb.julianWeekdayDeity.romanDeity}</p>
          <p className="text-[10px] text-gray-400 mt-2">
            Julian calendar {ctx.temporal.julianCalendarDate.year}-{ctx.temporal.julianCalendarDate.month}-{ctx.temporal.julianCalendarDate.day} · {eb.julianWeekdayDeity.gregorianName}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">{eb.julianWeekdayDeity.energy}</p>
          <p className="text-[9px] text-[color:var(--temporal)] mt-1.5">Greek echo: {eb.julianWeekdayDeity.greekEcho}</p>
        </div>

        {/* Current Hour */}
        <div className="instrument-panel !p-4">
          <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2 mb-3">
            <h4 className="ui-eyebrow text-[color:var(--temporal)]">
              Planetary Hour / Half-Hour
            </h4>
            <Clock className="w-3 h-3 text-cyan-500" />
          </div>
          <p className="font-cinzel text-sm text-white font-bold">
            Hour of {eb.currentPlanetaryHour.planet}
          </p>
          <p className="data-readout mt-1">{eb.currentPlanetaryHour.formattedWindow}</p>
          <p className="text-[10px] text-gray-400 mt-1.5">{eb.currentPlanetaryHour.quality}</p>
          <p className="font-serif text-[11px] text-gray-300 italic mt-1">{eb.currentPlanetaryHour.counsel}</p>
          <div className="mt-3 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
            <p className="text-[8px] uppercase text-amber-500 font-bold">Half-Hour Phase</p>
            <p className="text-[10px] text-white mt-0.5">{eb.currentHalfHour.phase}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{eb.currentHalfHour.meaning}</p>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowHourMatrix((p) => !p)}
              className="cta-ghost min-h-0 px-3 py-2 text-[9px] uppercase"
            >
              {showHourMatrix ? 'Hide' : 'Show'} 24h Matrix
            </button>
            <button
              onClick={() => setShowHalfHours((p) => !p)}
              className="cta-ghost min-h-0 px-3 py-2 text-[9px] uppercase"
            >
              {showHalfHours ? 'Hide' : 'Show'} Half-Hours
            </button>
          </div>
        </div>
      </div>

      {/* Compass Flip Connotation */}
      <div className="instrument-panel instrument-panel-solar">
        <div className="flex items-center gap-2 mb-3 border-b border-[color:var(--line-soft)] pb-2">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <h4 className="ui-eyebrow text-[color:var(--solar)]">
            Enochian Compass Directional Flip
          </h4>
          <span className="text-[8px] px-1.5 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-800 uppercase font-bold">
            +{eb.compassOrientation.headingOffsetDegrees}° · Mirror E↔W
          </span>
        </div>
        <p className="font-serif text-[11px] text-gray-300 italic leading-relaxed">
          {eb.compassOrientation.connotation}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-center text-[10px]">
          {(['North', 'East', 'South', 'West'] as const).map((d) => (
            <div key={d} className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
              <p className="text-gray-500 uppercase text-[8px]">Civil {d}</p>
              <p className="text-amber-300 font-bold mt-0.5">→ {eb.compassOrientation.directionRemap[d]}</p>
            </div>
          ))}
        </div>
        <ul className="mt-3 space-y-1">
          {eb.compassOrientation.triangulationNotes.map((n, i) => (
            <li key={i} className="text-[10px] text-gray-400 pl-2 border-l border-amber-900">
              {n}
            </li>
          ))}
        </ul>
      </div>

      {/* Hour matrices (toggleable) */}
      {showHourMatrix && (
        <div className="instrument-panel overflow-x-auto">
          <h4 className="ui-eyebrow text-[color:var(--temporal)] mb-3">
            24 Planetary Hours (Chaldean Sequence)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
            {eb.planetaryHours.map((h) => (
              <div
                key={h.index}
                className={`rounded-[var(--radius-sm)] border p-2 text-[9px] ${
                  h.index === eb.currentPlanetaryHour.index
                    ? 'border-cyan-300/40 bg-cyan-300/[0.08] shadow-[var(--glow-temporal)]'
                    : 'border-[color:var(--line-soft)] bg-white/[0.025]'
                }`}
              >
                <p className="text-gray-500">H{h.index} {h.isDayHour ? '☀' : '☾'}</p>
                <p className="text-white font-bold">{h.planet}</p>
                <p className="text-gray-400">{h.formattedWindow}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showHalfHours && (
        <div className="instrument-panel instrument-panel-solar max-h-64 overflow-y-auto">
          <h4 className="ui-eyebrow text-[color:var(--solar)] mb-3 sticky top-0 bg-[color:var(--void-850)]/95 py-2 backdrop-blur-md">
            Half-Hour Meanings (Ingress Crest / Mid-Hour Echo)
          </h4>
          <div className="space-y-1">
            {eb.halfHourMeanings.map((h, i) => (
              <div
                key={i}
                className={`flex flex-wrap gap-2 border-b border-[color:var(--line-soft)] p-2 text-[9px] ${
                  h.formattedWindow === eb.currentHalfHour.formattedWindow ? 'bg-amber-300/[0.06]' : ''
                }`}
              >
                <span className="text-amber-400 font-bold w-28">{h.formattedWindow}</span>
                <span className="text-white w-16">{h.planet}</span>
                <span className="text-cyan-500 w-24">{h.phase}</span>
                <span className="text-gray-400 flex-1">{h.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Triangulation dossier */}
      <div className="instrument-panel instrument-panel-solar">
        <h4 className="ui-eyebrow text-[color:var(--solar)] mb-3">
          Final-Output Triangulation Dossier
        </h4>
        <pre className="whitespace-pre-wrap font-serif text-[11px] text-gray-300 leading-relaxed">
          {eb.triangulationDossier}
        </pre>
      </div>
    </div>
  );
};
