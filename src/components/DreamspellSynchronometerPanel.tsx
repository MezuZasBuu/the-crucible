/**
 * The Crucible — Dreamspell 13:20 Synchronometer Panel
 * José Argüelles 13-Moon 28-Day Synchronometer, 260 Galactic Signatures,
 * Wavespell, Castle of Time, Radial Plasmas, and Fifth Force 5-Kin Oracle.
 * Rendered with smooth novel-like prose and High Density styling.
 */

import React, { useState } from 'react';
import { CompleteCalculationContext } from '../types';

interface DreamspellSynchronometerPanelProps {
  ctx: CompleteCalculationContext;
}

export const DreamspellSynchronometerPanel: React.FC<DreamspellSynchronometerPanelProps> = ({ ctx }) => {
  const [activeTab, setActiveTab] = useState<'ORACLE' | 'THIRTEEN_MOON' | 'WAVESPELL' | 'CASTLE'>('ORACLE');
  const ds = ctx.dreamspell;

  const getSealColor = (color: string) => {
    switch (color) {
      case 'Red': return { text: 'text-red-400', border: 'border-red-500/60', bg: 'bg-red-950/30', hex: '#ef4444' };
      case 'White': return { text: 'text-slate-100', border: 'border-slate-400/60', bg: 'bg-slate-900/40', hex: '#f8fafc' };
      case 'Blue': return { text: 'text-blue-400', border: 'border-blue-500/60', bg: 'bg-blue-950/30', hex: '#3b82f6' };
      case 'Yellow': return { text: 'text-amber-300', border: 'border-amber-500/60', bg: 'bg-amber-950/30', hex: '#f59e0b' };
      default: return { text: 'text-cyan-400', border: 'border-cyan-500/60', bg: 'bg-cyan-950/30', hex: '#06b6d4' };
    }
  };

  const sealStyle = getSealColor(ds.solarSeal.color);

  return (
    <div className="instrument-panel instrument-panel-maya motion-enter text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between border-b border-[color:var(--line-soft)] pb-4 mb-5 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rotate-45 border border-emerald-300 bg-emerald-300/15 shadow-[0_0_16px_rgba(85,184,168,0.45)]" />
          <div>
            <h3 className="panel-title">
              Dreamspell 13:20 Galactic Synchronometer
            </h3>
            <p className="font-garamond text-[15px] text-[color:var(--text-secondary)] italic mt-1">
              Argüelles 13-Moon 28-Day Harmonic Matrix & The Fifth Force Oracle
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-1">
          {(
            [
              { id: 'ORACLE', label: '5-Kin Oracle' },
              { id: 'THIRTEEN_MOON', label: '13 Moons & Plasmas' },
              { id: 'WAVESPELL', label: 'Wavespell & Family' },
              { id: 'CASTLE', label: 'Castle of Time' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab border ${
                activeTab === tab.id
                  ? 'nav-tab-active border-emerald-300/30 bg-emerald-300/[0.06] text-emerald-200'
                  : 'border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Banner: Galactic Signature & Novel-like Tale */}
      <div className="p-4 rounded-[var(--radius-lg)] bg-emerald-300/[0.035] border border-emerald-300/15 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--line-soft)] pb-3 mb-3">
          <div>
            <span className="ui-eyebrow text-emerald-300">
              Galactic Signature of the Coordinate
            </span>
            <h4 className="font-cinzel text-lg font-semibold text-white tracking-wide mt-1">
              {ds.signature}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10px]">
            <span className={`px-2 py-0.5 rounded-xs border uppercase font-medium ${sealStyle.bg} ${sealStyle.border} ${sealStyle.text}`}>
              {ds.solarSeal.color} Seal #{ds.solarSeal.number} ({ds.solarSeal.mayaName})
            </span>
            <span className="px-2 py-0.5 rounded-xs border border-cyan-800 bg-cyan-950/30 text-cyan-300 uppercase font-medium">
              Tone {ds.galacticTone.number} ({ds.galacticTone.name})
            </span>
            <span className="px-2 py-0.5 rounded-xs border border-purple-800 bg-purple-950/30 text-purple-300 uppercase font-medium">
              {ds.earthFamily.name} Family
            </span>
          </div>
        </div>

        {/* Smooth Novel-Like Literary Narrative */}
        <p className="font-garamond text-[17px] leading-relaxed text-[color:var(--text-secondary)] italic">
          “{ds.poeticNarrative}”
        </p>
      </div>

      {/* TAB 1: FIFTH FORCE 5-KIN ORACLE */}
      {activeTab === 'ORACLE' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Visual 5-Kin Cross Layout (7 cols) */}
          <div className="md:col-span-7 rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4 flex flex-col items-center justify-center">
            <div className="ui-eyebrow mb-3 text-center">
              The Sacred Cross of the Fifth Force
            </div>

            {/* Cross Grid */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-[340px] text-center my-1">
              {/* Row 1: Empty - Guide - Empty */}
              <div />
              <div className="p-3 rounded-[var(--radius-md)] border border-cyan-300/15 bg-cyan-300/[0.035] flex flex-col items-center">
                <span className="text-[9px] uppercase text-cyan-400 font-bold">Guide Kin</span>
                <span className="text-white font-garamond text-[14px] font-semibold mt-0.5">{ds.oracle.guide.name}</span>
                <span className="text-[9px] text-gray-500">Kin {ds.oracle.guide.kin} • Tone {ds.oracle.guide.tone}</span>
                <span className="text-[8px] text-gray-400 italic">Higher Self</span>
              </div>
              <div />

              {/* Row 2: Antipode - Destiny - Analog */}
              <div className="p-3 rounded-[var(--radius-md)] border border-red-400/20 bg-red-400/[0.035] flex flex-col items-center">
                <span className="text-[9px] uppercase text-red-400 font-bold">Antipode</span>
                <span className="text-white font-garamond text-[14px] font-semibold mt-0.5">{ds.oracle.antipode.name}</span>
                <span className="text-[9px] text-gray-500">Kin {ds.oracle.antipode.kin} • Tone {ds.oracle.antipode.tone}</span>
                <span className="text-[8px] text-gray-400 italic">Challenge / Strength</span>
              </div>

              <div className="p-3 rounded-[var(--radius-md)] border border-emerald-300/50 bg-emerald-300/[0.08] flex flex-col items-center shadow-[0_0_28px_rgba(85,184,168,0.12)]">
                <span className="text-[9px] uppercase text-emerald-400 font-bold">Destiny Kin</span>
                <span className="text-white font-garamond text-[15px] font-semibold mt-0.5">{ds.oracle.destiny.name}</span>
                <span className="data-readout text-emerald-300">Kin {ds.oracle.destiny.kin}</span>
                <span className="text-[8px] text-emerald-400 uppercase">Center Presence</span>
              </div>

              <div className="p-3 rounded-[var(--radius-md)] border border-amber-300/20 bg-amber-300/[0.035] flex flex-col items-center">
                <span className="text-[9px] uppercase text-amber-400 font-bold">Analog Kin</span>
                <span className="text-white font-garamond text-[14px] font-semibold mt-0.5">{ds.oracle.analog.name}</span>
                <span className="text-[9px] text-gray-500">Kin {ds.oracle.analog.kin} • Tone {ds.oracle.analog.tone}</span>
                <span className="text-[8px] text-gray-400 italic">Solar Twin / Ally</span>
              </div>

              {/* Row 3: Empty - Occult - Empty */}
              <div />
              <div className="p-3 rounded-[var(--radius-md)] border border-cyan-300/20 bg-cyan-300/[0.035] flex flex-col items-center">
                <span className="text-[9px] uppercase text-cyan-300 font-bold">Occult Kin</span>
                <span className="text-white font-garamond text-[14px] font-semibold mt-0.5">{ds.oracle.occult.name}</span>
                <span className="text-[9px] text-gray-500">Kin {ds.oracle.occult.kin} • Tone {ds.oracle.occult.tone}</span>
                <span className="text-[8px] text-gray-400 italic">Hidden Mystic Power</span>
              </div>
              <div />
            </div>
          </div>

          {/* Oracle Meanings & Actions (5 cols) */}
          <div className="md:col-span-5 rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="ui-eyebrow text-white border-b border-[color:var(--line-soft)] pb-2 mb-3">
                Oracle Matrix Dynamics
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div>
                  <span className="text-gray-500 uppercase text-[9px]">Solar Tribe Essence:</span>{' '}
                  <span className="text-white font-medium">{ds.solarSeal.essence}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase text-[9px]">Primary Action:</span>{' '}
                  <span className="text-white font-medium">{ds.solarSeal.action} through {ds.solarSeal.power}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase text-[9px]">Chakra Anchor:</span>{' '}
                  <span className="text-cyan-400 font-medium">{ds.solarSeal.chakra} Chakra</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase text-[9px]">Galactic Ray:</span>{' '}
                  <span className="text-amber-300 font-medium">{ds.galacticTone.ray}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-[var(--radius-md)] bg-white/[0.025] border border-[color:var(--line-soft)] font-garamond text-[15px] text-[color:var(--text-secondary)] italic">
              “The Fifth Force reconciles dualities: the visible path guided from above, comforted from the right, sharpened from the left, and deeply rooted from the unseen depths.”
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 13 MOONS & 7 RADIAL PLASMAS */}
      {activeTab === 'THIRTEEN_MOON' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 13 Moon Synchronometer Card */}
          <div className="p-4 rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] space-y-3">
            <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-3">
              <div>
                <span className="text-[9px] uppercase text-emerald-400 font-bold">Current Moon Cycle</span>
                <h4 className="font-cinzel text-xs font-bold text-white">
                  Moon {ds.thirteenMoon.moonNumber}: {ds.thirteenMoon.moonName}
                </h4>
              </div>
              <span className="data-readout">
                Day {ds.thirteenMoon.dayOfMoon} of 28
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-gray-500 uppercase text-[9px]">Animal Totem:</span>{' '}
                <strong className="text-white">{ds.thirteenMoon.animalTotem}</strong>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[9px]">Service Question:</span>{' '}
                <span className="text-amber-300 italic">“{ds.thirteenMoon.serviceQuestion}”</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[9px]">Heptad Week:</span>{' '}
                <span className="text-white font-medium">Week {ds.thirteenMoon.weekNumber} of 4</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[9px]">Day Out of Time:</span>{' '}
                <span className={ds.thirteenMoon.isDayOutOfTime ? 'text-green-400 font-bold' : 'text-gray-400'}>
                  {ds.thirteenMoon.isDayOutOfTime ? 'YES (July 25 Green Day)' : 'Standard Moon Heptad'}
                </span>
              </div>
            </div>

            {/* 28 Day Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-[9px] text-gray-500 mb-1">
                <span>Moon Progress</span>
                <span>{Math.round((ds.thirteenMoon.dayOfMoon / 28) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#141414] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(ds.thirteenMoon.dayOfMoon / 28) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 7 Radial Plasmas Card */}
          <div className="p-4 rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] space-y-3">
            <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-3">
              <div>
                <span className="text-[9px] uppercase text-cyan-400 font-bold">Active Radial Plasma</span>
                <h4 className="font-cinzel text-xs font-bold text-white">
                  Plasma {ds.thirteenMoon.radialPlasma.name}
                </h4>
              </div>
              <span className="text-[10px] text-cyan-300 font-bold">
                {ds.thirteenMoon.radialPlasma.chakra} Chakra
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-gray-500 uppercase text-[9px]">Quantum Function:</span>{' '}
                <strong className="text-white">{ds.thirteenMoon.radialPlasma.quantumFunction}</strong>
              </div>
              <div className="p-3 rounded-[var(--radius-md)] bg-white/[0.025] border border-[color:var(--line-soft)] font-garamond text-[15px] text-[color:var(--text-secondary)] italic mt-2">
                “{ds.thirteenMoon.radialPlasma.mantra}”
              </div>
            </div>

            {/* 7 Plasmas Ticker */}
            <div className="grid grid-cols-7 gap-1 pt-1 text-center text-[8px] uppercase">
              {['Dali', 'Seli', 'Gamma', 'Kali', 'Alfa', 'Limi', 'Silio'].map((plasma, idx) => (
                <div
                  key={plasma}
                  className={`py-1 rounded-xs border ${
                    ds.thirteenMoon.radialPlasma.name === plasma
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-white/[0.02] border-[color:var(--line-soft)] text-[color:var(--text-muted)]'
                  }`}
                >
                  {plasma}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WAVESPELL & EARTH FAMILY */}
      {activeTab === 'WAVESPELL' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] space-y-3">
            <div className="border-b border-[color:var(--line-soft)] pb-3">
              <span className="text-[9px] uppercase text-amber-400 font-bold">13-Day Cosmic Wavespell</span>
              <h4 className="font-cinzel text-xs font-bold text-white">
                {ds.wavespell.name} (Kins {ds.wavespell.kinStart}–{ds.wavespell.kinEnd})
              </h4>
            </div>

            <p className="font-garamond text-[15px] text-[color:var(--text-secondary)] italic leading-relaxed">
              {ds.wavespell.teachings}
            </p>

            <div className="pt-2 text-[11px] space-y-1">
              <div>
                <span className="text-gray-500 uppercase text-[9px]">Position in Wavespell:</span>{' '}
                <strong className="text-amber-300">Tone {ds.wavespell.positionInWavespell} of 13</strong>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[9px]">Tone Quality:</span>{' '}
                <span className="text-gray-300">{ds.galacticTone.power} • {ds.galacticTone.action}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] space-y-3">
            <div className="border-b border-[color:var(--line-soft)] pb-3">
              <span className="text-[9px] uppercase text-cyan-300 font-bold">Earth Family & Planetary Chakra</span>
              <h4 className="font-cinzel text-xs font-bold text-white">
                {ds.earthFamily.name} Earth Family
              </h4>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-gray-500 uppercase text-[9px]">Planetary Role:</span>{' '}
                <span className="text-gray-200">{ds.earthFamily.role}</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[9px]">Chakric Alignment:</span>{' '}
                <span className="text-cyan-200 font-bold">{ds.earthFamily.chakras} Center</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[9px]">Color Clan:</span>{' '}
                <span className="text-white font-medium">{ds.colorFamily.name}</span>
              </div>
            </div>

            <div className="p-3 rounded-[var(--radius-md)] bg-white/[0.025] border border-[color:var(--line-soft)] font-garamond text-[15px] text-[color:var(--text-secondary)] italic">
              {ds.colorFamily.role}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CASTLE OF TIME */}
      {activeTab === 'CASTLE' && (
        <div className="p-4 rounded-[var(--radius-lg)] border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-[color:var(--line-soft)] pb-3">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold">
                Great Cycle of Five Castles
              </span>
              <h4 className="font-cinzel text-sm font-bold text-white">
                {ds.castle.name} ({ds.castle.court})
              </h4>
            </div>

            <span
              className="px-2.5 py-0.5 rounded-xs border text-[10px] uppercase font-bold"
              style={{ borderColor: ds.castle.color, color: ds.castle.color, backgroundColor: `${ds.castle.color}15` }}
            >
              Kins {ds.kin <= 52 ? '1-52' : ds.kin <= 104 ? '53-104' : ds.kin <= 156 ? '105-156' : ds.kin <= 208 ? '157-208' : '209-260'}
            </span>
          </div>

          <p className="font-garamond text-[16px] leading-relaxed text-[color:var(--text-secondary)] italic bg-white/[0.025] p-3 rounded-[var(--radius-md)] border border-[color:var(--line-soft)]">
            “{ds.castle.meaning}”
          </p>

          {/* 5 Castles Progress Strip */}
          <div className="grid grid-cols-5 gap-2 pt-1 text-center text-[9px] uppercase">
            {[
              { name: 'Red East', court: 'Turning', range: '1-52', color: '#ef4444' },
              { name: 'White North', court: 'Crossing', range: '53-104', color: '#f8fafc' },
              { name: 'Blue West', court: 'Burning', range: '105-156', color: '#3b82f6' },
              { name: 'Yellow South', court: 'Giving', range: '157-208', color: '#eab308' },
              { name: 'Green Matrix', court: 'Enchantment', range: '209-260', color: '#10b981' }
            ].map((c, idx) => {
              const isActive =
                (idx === 0 && ds.kin <= 52) ||
                (idx === 1 && ds.kin > 52 && ds.kin <= 104) ||
                (idx === 2 && ds.kin > 104 && ds.kin <= 156) ||
                (idx === 3 && ds.kin > 156 && ds.kin <= 208) ||
                (idx === 4 && ds.kin > 208);

              return (
                <div
                  key={c.name}
                  className={`p-2 rounded-xs border ${
                    isActive
                      ? 'border-cyan-300/50 bg-cyan-300/[0.07] font-bold text-white shadow-[0_0_20px_rgba(98,199,218,0.1)]'
                      : 'border-[color:var(--line-soft)] bg-white/[0.02] text-[color:var(--text-muted)]'
                  }`}
                  style={{ borderTopColor: isActive ? c.color : undefined, borderTopWidth: isActive ? '2px' : '1px' }}
                >
                  <div style={{ color: c.color }} className="font-bold">{c.name}</div>
                  <div className="text-[8px] text-gray-400">{c.court}</div>
                  <div className="text-[8px] text-gray-500">{c.range}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
