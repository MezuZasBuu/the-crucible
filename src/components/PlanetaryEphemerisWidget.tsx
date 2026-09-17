/**
 * The Crucible — Planetary Ephemeris Widget
 * Clean ecliptic wheel: element wedges, filtered bodies, selected-planet aspects only.
 */

import React, { useMemo, useState } from 'react';
import { calculateCelestialAspects, getPlanetaryNovelisticLore, ZODIAC_SIGNS } from '../engine/ephemeris';
import { CompleteCalculationContext } from '../types';
import { EpistemicBadge } from './EpistemicBadge';
import { ChartWheel } from './chart/ChartWheel';
import { buildChartLayout } from '../engine/chartWheel';

interface PlanetaryEphemerisWidgetProps {
  ctx: CompleteCalculationContext;
}

function planetColor(id: string) {
  switch (id) {
    case 'sun': return '#f59e0b';
    case 'moon': return '#e2e8f0';
    case 'mercury': return '#38bdf8';
    case 'venus': return '#ec4899';
    case 'mars': return '#ef4444';
    case 'jupiter': return '#a855f7';
    case 'saturn': return '#d97706';
    case 'uranus': return '#06b6d4';
    case 'neptune': return '#3b82f6';
    case 'pluto': return '#8b5cf6';
    case 'chiron': return '#10b981';
    case 'north_node': return '#eab308';
    default: return '#94a3b8';
  }
}

function elementChip(element: string) {
  switch (element) {
    case 'Fire': return 'chip-fire';
    case 'Earth': return 'chip-earth';
    case 'Air': return 'chip-air';
    case 'Water': return 'chip-water';
    default: return 'text-[color:var(--text-secondary)] border-[color:var(--line-medium)] bg-[color:var(--surface-well)]';
  }
}

export const PlanetaryEphemerisWidget: React.FC<PlanetaryEphemerisWidgetProps> = ({ ctx }) => {
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('sun');
  const [filterType, setFilterType] = useState<'ALL' | 'RETROGRADE' | 'LUMINARIES' | 'OUTER'>('ALL');

  const celestialBodies = ctx.celestialBodies || [];

  const aspects = useMemo(() => calculateCelestialAspects(celestialBodies), [celestialBodies]);

  const filteredBodies = useMemo(() => {
    if (filterType === 'RETROGRADE') return celestialBodies.filter((b) => b.isRetrograde);
    if (filterType === 'LUMINARIES') return celestialBodies.filter((b) => b.id === 'sun' || b.id === 'moon');
    if (filterType === 'OUTER')
      return celestialBodies.filter((b) =>
        ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron'].includes(b.id)
      );
    return celestialBodies;
  }, [celestialBodies, filterType]);

  const selectedPlanet =
    celestialBodies.find((b) => b.id === selectedPlanetId) || filteredBodies[0] || celestialBodies[0];

  const ribbonAspects = useMemo(() => {
    if (!selectedPlanet) return aspects.filter((a) => a.orbDeg <= 4).slice(0, 6);
    return aspects
      .filter((a) => a.bodyA === selectedPlanet.name || a.bodyB === selectedPlanet.name)
      .slice(0, 6);
  }, [aspects, selectedPlanet]);

  const skyLayout = useMemo(
    () =>
      buildChartLayout({
        temporal: ctx.temporal,
        latitude: ctx.input.location.latitude,
        mode: 'current-sky'
      }),
    [ctx.temporal, ctx.input.location.latitude]
  );

  return (
    <div className="instrument-panel instrument-panel-solar motion-enter text-xs">
      <div className="flex flex-wrap items-start justify-between border-b border-[color:var(--line-soft)] pb-4 mb-5 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rotate-45 border border-[color:var(--solar-bright)] bg-amber-300/20 shadow-[0_0_16px_rgba(216,173,90,0.45)]" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="panel-title">Ecliptic Instrument</h3>
              <EpistemicBadge epistemicClass="COMPUTED_GEOMETRY" />
            </div>
            <p className="font-garamond text-[15px] text-[color:var(--text-secondary)] italic mt-1">
              Current-sky tropical positions · Crucible mean-motion model (not VSOP87) · aspect chords for the selected body
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(['ALL', 'LUMINARIES', 'OUTER', 'RETROGRADE'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`nav-tab border ${
                filterType === filter
                  ? 'nav-tab-active border-amber-300/30 bg-amber-300/[0.06] text-[color:var(--solar-bright)]'
                  : 'border-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-6 rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between ui-eyebrow mb-2">
            <span>Current-sky chart · ASC at left</span>
            <span className="text-[color:var(--solar)]">{filteredBodies.length} shown</span>
          </div>
          <div className="relative w-full max-w-[440px] aspect-square my-1">
            <ChartWheel
              bodies={filteredBodies}
              aspects={aspects}
              layout={skyLayout}
              selectedId={selectedPlanet?.id}
              onSelect={setSelectedPlanetId}
            />
          </div>
          <p className="text-[12px] text-[color:var(--text-muted)] mt-2 text-center">
            Whole-sign houses from local sidereal time. Mean-motion model.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-[11px] text-[color:var(--text-muted)] pt-2">
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[color:var(--temporal)] inline-block" /> Soft</span>
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[color:var(--accent-rose)] inline-block" /> Hard</span>
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[color:var(--solar)] inline-block" /> Conjunction</span>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] overflow-hidden">
            <div className="p-3 border-b border-[color:var(--line-soft)] bg-white/[0.025] flex items-center justify-between">
              <span className="ui-eyebrow text-[color:var(--text-primary)]">Celestial Ledger</span>
              <span className="text-[11px] text-[color:var(--text-muted)]">Select a body · chords follow selection</span>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-[color:var(--line-soft)] bg-black/10 ui-eyebrow">
                    <th className="py-1 px-2.5">Body</th>
                    <th className="py-1 px-2">Sign</th>
                    <th className="py-1 px-2 text-right">°</th>
                    <th className="py-1 px-2 text-right">Motion</th>
                    <th className="py-1 px-2 text-right">RA</th>
                    <th className="py-1 px-2.5 text-right">Dec</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.045]">
                  {filteredBodies.map((body) => {
                    const isSelected = body.id === selectedPlanet?.id;
                    const sign = ZODIAC_SIGNS.find((s) => s.name === body.zodiacSign);
                    const color = planetColor(body.id);
                    return (
                      <tr
                        key={body.id}
                        onClick={() => setSelectedPlanetId(body.id)}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-cyan-400/[0.07]' : 'hover:bg-white/[0.035]'}`}
                        style={{ borderLeft: isSelected ? `2px solid ${color}` : '2px solid transparent' }}
                      >
                        <td className="py-1 px-2.5 font-bold" style={{ color }}>
                          <span className="mr-1">{body.symbol}</span>
                          {body.name}
                        </td>
                        <td className="py-1 px-2">
                          <span className={`inline-block px-1.5 py-0.2 rounded-xs border text-[9px] uppercase ${sign ? elementChip(sign.element) : ''}`}>
                            {body.zodiacSign} {sign?.symbol}
                          </span>
                        </td>
                        <td className="py-1 px-2 text-right data-readout text-[color:var(--text-primary)]">{body.signDegree.toFixed(1)}°</td>
                        <td className="py-1 px-2 text-right">
                          {body.isRetrograde ? (
                            <span className="text-red-400 text-[9px] font-bold">℞</span>
                          ) : (
                            <span className="text-emerald-500 text-[9px]">D</span>
                          )}
                        </td>
                        <td className="py-1 px-2 text-right data-readout">{body.rightAscensionHours.toFixed(2)}h</td>
                        <td className="py-1 px-2.5 text-right data-readout">
                          {body.declinationDegrees > 0 ? `+${body.declinationDegrees.toFixed(1)}°` : `${body.declinationDegrees.toFixed(1)}°`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {selectedPlanet && (
            <div className="rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4">
              <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold" style={{ color: planetColor(selectedPlanet.id) }}>
                    {selectedPlanet.symbol}
                  </span>
                  <div>
                    <span className="font-cinzel text-sm font-semibold text-[color:var(--text-primary)] tracking-wide">
                      {selectedPlanet.name} in {selectedPlanet.zodiacSign} ({selectedPlanet.signDegree.toFixed(1)}°)
                    </span>
                    <span className="text-[9px] text-gray-500 uppercase ml-2">
                      {selectedPlanet.isRetrograde ? 'Retrograde' : 'Direct'}
                    </span>
                  </div>
                </div>
                <div className="data-readout text-[color:var(--solar-bright)]">
                  λ {selectedPlanet.eclipticLongitude.toFixed(2)}°
                </div>
              </div>
              <p className="font-garamond text-[16px] leading-relaxed text-[color:var(--text-secondary)] italic bg-white/[0.025] p-3 rounded-[var(--radius-md)] border border-[color:var(--line-soft)]">
                “{getPlanetaryNovelisticLore(selectedPlanet)}”
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[color:var(--line-soft)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 ui-eyebrow text-[color:var(--text-primary)]">
            <div className="w-1.5 h-1.5 rotate-45 bg-[color:var(--solar)] shadow-[0_0_10px_rgba(216,173,90,0.55)]" />
            <span>
              Aspects for {selectedPlanet?.name || '—'} ({ribbonAspects.length})
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {ribbonAspects.map((asp, index) => {
            const isTrine = asp.aspectType === 'Trine' || asp.aspectType === 'Sextile';
            const isSquare = asp.aspectType === 'Square' || asp.aspectType === 'Opposition';
            return (
              <div
                key={index}
                className={`p-3 rounded-[var(--radius-md)] bg-[color:var(--surface-well)] border border-[color:var(--line-soft)] border-l-2 ${
                  isTrine ? 'border-l-cyan-500' : isSquare ? 'border-l-red-500' : 'border-l-amber-500'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="font-bold text-[color:var(--text-primary)]">
                    {asp.bodyA} ↔ {asp.bodyB}
                  </div>
                  <span className="text-[9px] uppercase text-gray-400">
                    {asp.aspectType} · orb {asp.orbDeg}°
                  </span>
                </div>
                <p className="font-garamond text-[14px] text-[color:var(--text-secondary)] italic mt-1 leading-snug">
                  {asp.novelisticDescription}
                </p>
              </div>
            );
          })}
          {!ribbonAspects.length && (
            <p className="text-[10px] text-gray-500 italic col-span-full">No tight aspects for this body under current orb.</p>
          )}
        </div>
      </div>
    </div>
  );
};
