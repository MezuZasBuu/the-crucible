/**
 * Dreamspell calendar workspace — 13 Moon grid and Tzolkin harmonic module.
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
import { GALACTIC_TONES, SOLAR_SEALS } from '../../engine/dreamspell';
import { describeKinEnergy, cellFromKin } from '../../engine/kinEnergy';
import { EpistemicBadge } from '../EpistemicBadge';
import { FadeInText } from '../ui/FadeInText';

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

const KinDetailSheet: React.FC<{
  cell: DreamspellDayCell | ThirteenMoonCell;
  onClose: () => void;
}> = ({ cell, onClose }) => {
  const moonName = 'moonName' in cell ? cell.moonName : undefined;
  const energy = describeKinEnergy(cell, moonName);

  return (
    <div className="detail-overlay" role="presentation" onClick={onClose}>
      <article className="detail-sheet gradient-card-base gradient-card-sage kin-detail-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="detail-sheet-header">
          <p className="scroll-label readable-muted">Kin energy for this day</p>
          <button type="button" className="detail-close" onClick={onClose}>
            Close
          </button>
        </div>
        <FadeInText text={energy.title} as="h3" className="detail-title" />
        <FadeInText text={energy.dailyEnergy} className="detail-body" delayMs={100} />
        <div className="kin-energy-blocks motion-fade-in">
          <div className="kin-energy-block gradient-card-ochre">
            <p className="scroll-label readable-muted">Solar seal</p>
            <p className="readable-body font-semibold text-[1.05rem]">{energy.sealHeadline}</p>
            <p className="readable-body mt-2">{energy.sealDeep}</p>
          </div>
          <div className="kin-energy-block gradient-card-indigo">
            <p className="scroll-label readable-muted">Galactic tone</p>
            <p className="readable-body font-semibold text-[1.05rem]">{energy.toneHeadline}</p>
            <p className="readable-body mt-2">{energy.toneDeep}</p>
          </div>
          {energy.moonContext && (
            <div className="kin-energy-block gradient-card-sage">
              <p className="scroll-label readable-muted">13 Moon context</p>
              <p className="readable-body">{energy.moonContext}</p>
            </div>
          )}
          {energy.portalNote && (
            <div className="kin-energy-block gradient-card-portal">
              <p className="scroll-label readable-muted">Portal kin</p>
              <p className="readable-body">{energy.portalNote}</p>
            </div>
          )}
          <FadeInText text={energy.combinedPractice} className="readable-body font-semibold text-[1.08rem]" delayMs={400} />
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
  const todayEnergy = useMemo(() => describeKinEnergy(todayKin), [todayKin]);
  const detail = focused;
  const detailEnergy = detail
    ? describeKinEnergy(detail, 'moonName' in detail ? detail.moonName : undefined)
    : null;

  const openCell = (cell: DreamspellDayCell | ThirteenMoonCell) => {
    setFocused(cell);
    setSheetOpen(true);
  };

  return (
    <div className="instrument-panel instrument-panel-maya space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="ui-eyebrow readable-muted">Dreamspell practice calendar</p>
          <h3 className="panel-title mt-1 readable-body">13 Moons and the 260-kin matrix</h3>
          <p className="readable-body text-[1.08rem] mt-2 max-w-2xl">
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

      <div className="scroll-card gradient-card-solar kin-today-banner">
        <p className="scroll-label readable-muted">Today’s kin energy</p>
        <FadeInText text={todayEnergy.title} as="h3" className="readable-body font-semibold text-[1.25rem]" />
        <FadeInText text={todayEnergy.dailyEnergy} className="readable-body text-[1.05rem] mt-2" delayMs={80} />
        <p className="readable-body text-[1rem] mt-3 font-medium">{todayEnergy.combinedPractice}</p>
      </div>

      <div className="flex flex-wrap gap-3 text-[0.95rem] readable-muted">
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm border-2 border-[color:var(--solar)]" /> Today</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[color:var(--text-primary)]" /> Selected</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm border border-dashed border-emerald-600" /> Portal kin</span>
      </div>

      {view === 'MOONS' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <th className="text-left p-1 scroll-label">Moon</th>
                {Array.from({ length: 28 }, (_, i) => (
                  <th key={i} className="p-1 readable-muted font-normal text-[0.85rem]">{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendar.moons.map((row) => (
                <tr key={row[0].moonNumber}>
                  <td className="p-1 pr-2 font-semibold readable-body whitespace-nowrap text-[0.95rem]">
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
                          title={`Kin ${cell.kin} ${cell.seal.name}`}
                        >
                          <span className="kin-cell-number">{cell.kin}</span>
                          <span className="kin-cell-tone">{cell.toneNumber}</span>
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
            Day Out of Time · 25 July {year + 1} · Kin {calendar.dayOutOfTime.kin}
          </button>
        </div>
      )}

      {view === 'TZOLKIN' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse tzolkin-matrix">
            <thead>
              <tr>
                <th className="p-1 scroll-label">Solar seal</th>
                {GALACTIC_TONES.map((t) => (
                  <th key={t.number} className="p-1 font-normal readable-muted text-[0.85rem]">{t.number}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={SOLAR_SEALS[i].number}>
                  <td className="p-1 pr-2 whitespace-nowrap readable-body font-semibold text-[0.92rem]">{SOLAR_SEALS[i].name}</td>
                  {row.map((cell) => {
                    const isTodayKin = cell.kin === ctx.dreamspell.kinNumber;
                    const isSel = focused?.kin === cell.kin;
                    return (
                      <td key={cell.kin} className="p-0.5 align-top">
                        <button
                          type="button"
                          onClick={() => openCell(cellFromKin(cell.kin))}
                          className={kinGradientClass(cell.seal.color, cell.isPortal, isSel, isTodayKin)}
                        >
                          <span className="kin-cell-number">{cell.kin}</span>
                          <span className="kin-cell-tone">{cell.toneNumber}</span>
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

      {detail && detailEnergy && (
        <div className="scroll-card gradient-card-base gradient-card-sage kin-node-reading">
          <p className="scroll-label readable-muted">Selected node · energy for the day</p>
          <FadeInText text={detailEnergy.title} as="h3" className="readable-body font-semibold text-[1.2rem]" />
          <FadeInText text={detailEnergy.dailyEnergy} className="readable-body text-[1.05rem] mt-2" delayMs={60} />
          <p className="readable-body mt-3">{detailEnergy.sealDeep}</p>
          <p className="readable-body mt-2">{detailEnergy.toneDeep}</p>
          <p className="readable-body mt-3 font-semibold">{detailEnergy.combinedPractice}</p>
          <button type="button" className="cta-ghost mt-4" onClick={() => setSheetOpen(true)}>
            Open full kin reading
          </button>
        </div>
      )}

      {sheetOpen && focused && <KinDetailSheet cell={focused} onClose={() => setSheetOpen(false)} />}
    </div>
  );
};
