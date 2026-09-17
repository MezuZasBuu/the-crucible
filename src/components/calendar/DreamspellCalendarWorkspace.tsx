/**
 * Dreamspell calendar workspace — 13 Moon grid and Tzolkin matrix.
 */

import React, { useMemo, useState } from 'react';
import { CompleteCalculationContext } from '../../types';
import {
  ThirteenMoonCell,
  buildThirteenMoonYear,
  buildTzolkinMatrix,
  moonYearStart
} from '../../engine/dreamspellCalendar';
import { GALACTIC_TONES, SOLAR_SEALS } from '../../engine/dreamspell';
import { EpistemicBadge } from '../EpistemicBadge';

function sealTint(color: string): string {
  switch (color) {
    case 'Red': return 'bg-rose-50 text-rose-900 border-rose-200';
    case 'White': return 'bg-stone-50 text-stone-800 border-stone-300';
    case 'Blue': return 'bg-sky-50 text-sky-900 border-sky-200';
    case 'Yellow': return 'bg-amber-50 text-amber-900 border-amber-200';
    default: return 'bg-[color:var(--surface-well)]';
  }
}

export const DreamspellCalendarWorkspace: React.FC<{ ctx: CompleteCalculationContext }> = ({ ctx }) => {
  const [view, setView] = useState<'MOONS' | 'TZOLKIN'>('MOONS');
  const [selected, setSelected] = useState<ThirteenMoonCell | null>(null);

  const today = {
    year: Number(ctx.input.dateString.slice(0, 4)),
    month: Number(ctx.input.dateString.slice(5, 7)),
    day: Number(ctx.input.dateString.slice(8, 10))
  };
  const year = moonYearStart(today.year, today.month, today.day);
  const calendar = useMemo(() => buildThirteenMoonYear(year, today), [year, today.year, today.month, today.day]);
  const matrix = useMemo(() => buildTzolkinMatrix(), []);
  const detail = selected;

  return (
    <div className="instrument-panel instrument-panel-maya space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="ui-eyebrow text-[color:var(--accent-sage)]">Dreamspell practice calendar</p>
          <h3 className="panel-title mt-1">13 Moons and the 260-kin matrix</h3>
          <p className="font-garamond text-[16px] text-[color:var(--text-secondary)] mt-2 max-w-2xl">
            Modern Dreamspell (Argüelles), not classical Maya Long Count. Portal markers use the 52 Galactic Activation Portal kins as a practice overlay.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <EpistemicBadge epistemicClass="SYSTEM_INTERPRETATION" />
          <div className="flex rounded-[var(--radius-md)] border border-[color:var(--line-soft)] p-1">
            <button type="button" className={`nav-tab ${view === 'MOONS' ? 'nav-tab-active' : ''}`} onClick={() => setView('MOONS')}>
              13 Moons
            </button>
            <button type="button" className={`nav-tab ${view === 'TZOLKIN' ? 'nav-tab-active' : ''}`} onClick={() => setView('TZOLKIN')}>
              Tzolkin
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[12px] text-[color:var(--text-secondary)]">
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm border-2 border-[color:var(--solar)]" /> Today</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[color:var(--text-primary)]" /> Selected</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm border border-dashed border-[color:var(--accent-sage)]" /> Portal kin</span>
      </div>

      {view === 'MOONS' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-[11px]">
            <thead>
              <tr>
                <th className="text-left p-1 ui-eyebrow">Moon</th>
                {Array.from({ length: 28 }, (_, i) => (
                  <th key={i} className="p-1 text-[color:var(--text-muted)] font-normal">{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendar.moons.map((row) => (
                <tr key={row[0].moonNumber}>
                  <td className="p-1 pr-2 font-semibold text-[color:var(--text-primary)] whitespace-nowrap">{row[0].moonNumber}. {row[0].moonName.replace(' Moon', '')}</td>
                  {row.map((cell) => {
                    const isSel = detail?.year === cell.year && detail?.month === cell.month && detail?.day === cell.day;
                    return (
                      <td key={`${cell.moonNumber}-${cell.dayOfMoon}`} className="p-0.5">
                        <button
                          type="button"
                          onClick={() => setSelected(cell)}
                          className={`w-full min-h-9 rounded-sm border text-[10px] leading-tight ${sealTint(cell.seal.color)} ${
                            cell.isToday ? '!border-[color:var(--solar)] border-2' : ''
                          } ${isSel ? '!bg-[color:var(--text-primary)] !text-[color:var(--surface-raised)]' : ''} ${
                            cell.isPortal ? 'border-dashed' : ''
                          }`}
                          title={`${cell.kin} ${cell.seal.name}`}
                        >
                          {cell.kin}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => setSelected(calendar.dayOutOfTime)}
            className={`mt-3 cta-ghost ${calendar.dayOutOfTime.isToday ? '!border-[color:var(--solar)]' : ''}`}
          >
            Day Out of Time · 25 July {year + 1} · Kin {calendar.dayOutOfTime.kin}
          </button>
        </div>
      )}

      {view === 'TZOLKIN' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[11px]">
            <thead>
              <tr>
                <th className="p-1" />
                {GALACTIC_TONES.map((t) => (
                  <th key={t.number} className="p-1 font-normal text-[color:var(--text-muted)]">{t.number}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={SOLAR_SEALS[i].number}>
                  <td className="p-1 pr-2 whitespace-nowrap font-semibold text-[color:var(--text-primary)]">{SOLAR_SEALS[i].name}</td>
                  {row.map((cell) => (
                    <td key={cell.kin} className="p-0.5">
                      <div
                        className={`min-h-8 flex items-center justify-center rounded-sm border ${sealTint(cell.seal.color)} ${
                          cell.kin === ctx.dreamspell.kin ? '!border-[color:var(--solar)] border-2' : ''
                        } ${cell.isPortal ? 'border-dashed' : ''}`}
                      >
                        {cell.kin}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detail && (
        <div className="scroll-card scroll-accent-sage">
          <p className="scroll-label">Selected day</p>
          <p className="font-cinzel text-xl text-[color:var(--text-primary)]">
            Kin {detail.kin}: {detail.seal.name}
          </p>
          <p className="font-garamond text-[17px] text-[color:var(--text-secondary)] mt-2">
            Tone {detail.toneNumber} {detail.toneName}. {detail.seal.action} through the power of {detail.seal.power.toLowerCase()}.
            {detail.isPortal ? ' Marked as a Galactic Activation Portal kin in this practice overlay.' : ''}
            {detail.isDayOutOfTime ? ' Day Out of Time (25 July) — not a numbered moon day.' : ''}
            {detail.isLeapSkip ? ' Leap day is not counted in the 260-kin sequence.' : ''}
          </p>
          <p className="text-sm text-[color:var(--text-muted)] mt-2">
            {detail.year}-{String(detail.month).padStart(2, '0')}-{String(detail.day).padStart(2, '0')}
            {detail.moonName ? ` · ${detail.moonName}` : ''}
          </p>
        </div>
      )}
    </div>
  );
};
