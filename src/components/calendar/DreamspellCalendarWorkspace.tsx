/**
 * Dreamspell calendar — the 13-month year grid and the 260-day grid.
 */

import React, { useMemo, useState } from 'react';
import { CompleteCalculationContext } from '../../types';
import {
  DreamspellDayCell,
  ThirteenMoonCell,
  buildThirteenMoonYear,
  buildTzolkinMatrix,
  dreamspellKinForYmd,
  moonYearStart
} from '../../engine/dreamspellCalendar';
import { GALACTIC_TONES, SOLAR_SEALS, THIRTEEN_MOONS } from '../../engine/dreamspell';
import { cellFromKin } from '../../engine/kinEnergy';
import { CultureHeader, MayaNumeral } from '../symbols/CultureSymbols';

function kinGradientClass(color: string, isPortal: boolean, isSelected: boolean, isToday: boolean): string {
  const base =
    color === 'Red'
      ? 'kin-cell-red'
      : color === 'White'
        ? 'kin-cell-white'
        : color === 'Blue'
          ? 'kin-cell-blue'
          : 'kin-cell-yellow';
  return [
    'kin-cell',
    base,
    isPortal ? 'kin-cell-portal' : '',
    isSelected ? 'kin-cell-selected' : '',
    isToday ? 'kin-cell-today' : ''
  ]
    .filter(Boolean)
    .join(' ');
}

interface PlainKinReading {
  title: string;
  summary: string;
  symbolHeadline: string;
  symbolText: string;
  toneNumber: number;
  toneHeadline: string;
  toneText: string;
  tryThis: string;
  monthNote?: string;
  portalNote?: string;
}

/** Plain-language description of one Dreamspell day, built from the same day data the grids use. */
function describeKinPlainly(cell: DreamspellDayCell, moonName?: string): PlainKinReading {
  const seal = cell.seal;
  const tone = GALACTIC_TONES[cell.toneNumber - 1];
  const essence = seal.essence.toLowerCase();
  const power = seal.power.toLowerCase();

  let monthNote: string | undefined;
  if (moonName) {
    const moon = THIRTEEN_MOONS.find((m) => m.name === moonName || moonName.startsWith(m.name.split(' ')[0]));
    if (moon) {
      monthNote = `${moon.name}. Its animal is the ${moon.animalTotem.toLowerCase()} and its question for the month is “${moon.question}”`;
    }
  }

  return {
    title: `Kin ${cell.kin}: ${seal.name}, tone ${tone.number} (${tone.name})`,
    summary: `This day pairs the symbol ${seal.name} with number tone ${tone.number}, called ${tone.name}. Dreamspell links the symbol with ${essence} and ${power}, and the tone with ${tone.power.toLowerCase()}. Treat it as a theme to think about, not a prediction.`,
    symbolHeadline: seal.name,
    symbolText: `One of the 20 symbols (Maya day name: ${seal.mayaName}). Its key words are ${essence}, ${power} and “${seal.action.toLowerCase()}”.`,
    toneNumber: tone.number,
    toneHeadline: `${tone.number} of 13 · ${tone.name}`,
    toneText: `The tone says where the day falls in its 13-day cycle. Its key words are ${tone.action.toLowerCase()}, ${tone.power.toLowerCase()} and ${tone.essence.toLowerCase()}.`,
    tryThis: `Something to try: notice where ${essence} and ${tone.power.toLowerCase()} show up in one real choice today.`,
    monthNote,
    portalNote: cell.isPortal
      ? 'This is one of the 52 portal days marked in the Dreamspell calendar. People who follow it treat these as days to slow down and pay closer attention.'
      : undefined
  };
}

const KinDetailSheet: React.FC<{
  cell: DreamspellDayCell | ThirteenMoonCell;
  onClose: () => void;
}> = ({ cell, onClose }) => {
  const moonName = 'moonName' in cell ? cell.moonName : undefined;
  const reading = describeKinPlainly(cell, moonName);

  return (
    <div className="detail-overlay" role="presentation" onClick={onClose}>
      <article className="detail-sheet gradient-card-base kin-detail-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="detail-sheet-header">
          <p className="ui-eyebrow">About this day</p>
          <button type="button" className="detail-close" onClick={onClose}>
            Close
          </button>
        </div>
        <h3 className="panel-title">{reading.title}</h3>
        <p className="readable-body mt-2">{reading.summary}</p>
        <div className="space-y-3 mt-4">
          <div className="curious-box">
            <p className="ui-eyebrow">Symbol</p>
            <p className="readable-body font-semibold mt-1">{reading.symbolHeadline}</p>
            <p className="readable-body mt-1">{reading.symbolText}</p>
          </div>
          <div className="curious-box">
            <p className="ui-eyebrow">Number tone (1–13)</p>
            <p className="readable-body font-semibold mt-1 flex items-center gap-2">
              <MayaNumeral value={reading.toneNumber} size={24} title={`Number tone ${reading.toneNumber}`} />
              {reading.toneHeadline}
            </p>
            <p className="readable-body mt-1">{reading.toneText}</p>
          </div>
          {reading.monthNote && (
            <div className="curious-box">
              <p className="ui-eyebrow">Month</p>
              <p className="readable-body mt-1">{reading.monthNote}</p>
            </div>
          )}
          {reading.portalNote && (
            <div className="chart-note">
              <strong>Portal day.</strong> {reading.portalNote}
            </div>
          )}
          <p className="trad-meaning">{reading.tryThis}</p>
        </div>
      </article>
    </div>
  );
};

export const DreamspellCalendarWorkspace: React.FC<{ ctx: CompleteCalculationContext }> = ({ ctx }) => {
  const [view, setView] = useState<'MOONS' | 'TZOLKIN'>('MOONS');
  const [focused, setFocused] = useState<DreamspellDayCell | ThirteenMoonCell | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const today = {
    year: Number(ctx.input.dateString.slice(0, 4)),
    month: Number(ctx.input.dateString.slice(5, 7)),
    day: Number(ctx.input.dateString.slice(8, 10))
  };
  const year = moonYearStart(today.year, today.month, today.day);
  const calendar = useMemo(() => buildThirteenMoonYear(year, today), [year, today.year, today.month, today.day]);
  const matrix = useMemo(() => buildTzolkinMatrix(), []);
  const todayKin = useMemo(() => dreamspellKinForYmd(today.year, today.month, today.day), [today.year, today.month, today.day]);
  const todayReading = useMemo(() => describeKinPlainly(todayKin), [todayKin]);
  const detail = focused;
  const detailReading = detail
    ? describeKinPlainly(detail, 'moonName' in detail ? detail.moonName : undefined)
    : null;

  const openCell = (cell: DreamspellDayCell | ThirteenMoonCell) => {
    setFocused(cell);
    setSheetOpen(true);
  };

  return (
    <div className="instrument-panel space-y-5">
      <CultureHeader culture="dreamspell" />

      <p className="readable-body max-w-3xl">
        Dreamspell is a modern system created in 1987 by José Argüelles; it was inspired by the traditional Maya count
        but numbers its days differently, so the two do not match. Each day has a day number (kin) from 1 to 260, a
        symbol and a number tone (1–13). Choose any day in the grid to read about it.
      </p>

      <div className="trad-hero">
        <span className="trad-hero-symbol">
          <MayaNumeral value={todayReading.toneNumber} size={30} title={`Number tone ${todayReading.toneNumber}`} />
        </span>
        <div className="min-w-0">
          <p className="ui-eyebrow">Today’s signature</p>
          <p className="trad-hero-value">{todayReading.title}</p>
          <p className="trad-hero-sub">{todayReading.summary}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="seg" role="tablist" aria-label="Calendar view">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'MOONS'}
            className={`seg-btn ${view === 'MOONS' ? 'seg-btn-active' : ''}`}
            onClick={() => setView('MOONS')}
          >
            This year: 13 months
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'TZOLKIN'}
            className={`seg-btn ${view === 'TZOLKIN' ? 'seg-btn-active' : ''}`}
            onClick={() => setView('TZOLKIN')}
          >
            All 260 days
          </button>
        </div>
        <p className="readable-muted text-sm">
          {view === 'MOONS'
            ? 'Each row is a 28-day month. The big number is the kin; the bars and dots are the number tone.'
            : 'Each row is one of the 20 symbols; each column is a number tone from 1 to 13.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm readable-muted">
        <span className="inline-flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-sm border-2 border-[color:var(--solar)]" /> Today</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-sm border-2 border-[color:var(--text-primary)]" /> Selected</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-sm kin-cell-portal border border-dashed" /> Portal day</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-sm kin-cell-red border border-[color:var(--line-soft)]" /> Red</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-sm kin-cell-white border border-[color:var(--line-soft)]" /> White</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-sm kin-cell-blue border border-[color:var(--line-soft)]" /> Blue</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-sm kin-cell-yellow border border-[color:var(--line-soft)]" /> Yellow</span>
      </div>

      {view === 'MOONS' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <th className="text-left p-1 text-sm font-semibold text-[color:var(--text-muted)]">Month</th>
                {Array.from({ length: 28 }, (_, i) => (
                  <th key={i} className="p-1 readable-muted font-normal text-sm">{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendar.moons.map((row) => (
                <tr key={row[0].moonNumber}>
                  <td className="p-1 pr-2 font-semibold readable-body whitespace-nowrap text-sm">
                    {row[0].moonNumber}. {row[0].moonName.replace(' Moon', '')}
                  </td>
                  {row.map((cell) => {
                    const isSel = focused?.kin === cell.kin && focused?.year === cell.year && focused?.month === cell.month && focused?.day === cell.day;
                    return (
                      <td key={`${cell.moonNumber}-${cell.dayOfMoon}`} className="p-0.5 align-top">
                        <button
                          type="button"
                          onClick={() => openCell(cell)}
                          className={kinGradientClass(cell.seal.color, cell.isPortal, isSel, cell.isToday)}
                          title={`Kin ${cell.kin}: ${cell.seal.name}, tone ${cell.toneNumber}${cell.isPortal ? ' (portal day)' : ''}`}
                        >
                          <span className="kin-cell-number">{cell.kin}</span>
                          <span className="kin-cell-tone">
                            <MayaNumeral value={cell.toneNumber} size={14} />
                          </span>
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
            onClick={() => openCell(calendar.dayOutOfTime)}
            className={`mt-3 cta-ghost readable-body ${calendar.dayOutOfTime.isToday ? '!border-[color:var(--solar)]' : ''}`}
          >
            Day Out of Time (the one extra day outside the 13 months) · 25 July {year + 1} · kin {calendar.dayOutOfTime.kin}
          </button>
        </div>
      )}

      {view === 'TZOLKIN' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse tzolkin-matrix">
            <thead>
              <tr>
                <th className="text-left p-1 text-sm font-semibold text-[color:var(--text-muted)]">Symbol</th>
                {GALACTIC_TONES.map((t) => (
                  <th key={t.number} className="p-1 font-normal readable-muted text-sm" title={`Number tone ${t.number}: ${t.name}`}>
                    {t.number}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={SOLAR_SEALS[i].number}>
                  <td className="p-1 pr-2 whitespace-nowrap readable-body font-semibold text-sm">{SOLAR_SEALS[i].name}</td>
                  {row.map((cell) => {
                    const isTodayKin = cell.kin === ctx.dreamspell.kin;
                    const isSel = focused?.kin === cell.kin;
                    return (
                      <td key={cell.kin} className="p-0.5 align-top">
                        <button
                          type="button"
                          onClick={() => openCell(cellFromKin(cell.kin))}
                          className={kinGradientClass(cell.seal.color, cell.isPortal, isSel, isTodayKin)}
                          title={`Kin ${cell.kin}: ${cell.seal.name}, tone ${cell.toneNumber}${cell.isPortal ? ' (portal day)' : ''}`}
                        >
                          <span className="kin-cell-number">{cell.kin}</span>
                          <span className="kin-cell-tone">
                            <MayaNumeral value={cell.toneNumber} size={14} />
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detail && detailReading && (
        <div className="curious-box">
          <p className="ui-eyebrow">Selected day</p>
          <h3 className="panel-title mt-1">{detailReading.title}</h3>
          <p className="readable-body mt-2">{detailReading.summary}</p>
          {detailReading.portalNote && <p className="chart-note mt-3">{detailReading.portalNote}</p>}
          <p className="trad-meaning mt-3">{detailReading.tryThis}</p>
          <button type="button" className="cta-ghost mt-4" onClick={() => setSheetOpen(true)}>
            Read more about this day
          </button>
        </div>
      )}

      {sheetOpen && focused && <KinDetailSheet cell={focused} onClose={() => setSheetOpen(false)} />}
    </div>
  );
};
