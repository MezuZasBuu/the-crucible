/**
 * The Crucible — "Gear of Gears" Interlocking Chronometric Visualizer
 * Grand Orrery of Universal Esoterism: A gear for every tradition and system.
 * High Density Theme: Sharp #222 borders, #0a0a0a surface, reticle brackets,
 * realistic involute-style gear teeth paths, and smooth novel-like literary lore.
 */

import React, { useMemo, useState } from 'react';
import { CompleteCalculationContext } from '../types';
import { MayanGlyphIcon } from './symbols/CrucibleGlyphs';

interface GearsVisualizerProps {
  ctx: CompleteCalculationContext;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

type GearSystemId =
  | 'tzolkin'
  | 'haab'
  | 'longcount'
  | 'dreamspell'
  | 'chinese'
  | 'egyptian'
  | 'greek'
  | 'ephemeris'
  | 'numerology'
  | 'tribes';

export const GearsVisualizer: React.FC<GearsVisualizerProps> = ({
  ctx,
  isPlaying = true,
  onTogglePlay
}) => {
  const [selectedGear, setSelectedGear] = useState<GearSystemId>('tzolkin');
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [viewMode, setViewMode] = useState<'ALL' | 'MESOAMERICAN' | 'MEDITERRANEAN' | 'SINITIC_CELESTIAL'>('ALL');

  // Compute rotational angles based on current time coordinates
  const tzolkinDeg = ((ctx.mayan.daysSinceEpoch % 260) / 260) * 360;
  const haabDeg = ((ctx.mayan.daysSinceEpoch % 365) / 365) * 360;
  const longCountDeg = (((ctx.mayan.longCount.kin + ctx.mayan.longCount.uinal * 20) % 360) / 360) * 360;
  const dreamspellDeg = ((ctx.dreamspell.kin % 260) / 260) * 360;
  const chineseDeg = ((ctx.chinese.sexagenaryCycleYear % 60) / 60) * 360;
  const egyptianDeg = ((ctx.egyptian.sothicYearInCycle % 1460) / 1460) * 360;
  const greekDeg = ((ctx.greek.metonicCycleYear % 19) / 19) * 360;
  const ephemerisDeg = (ctx.celestialBodies[0]?.eclipticLongitude || 0);
  const numDeg = ((ctx.numerology.universalDay % 9) / 9) * 360;
  const tribesDeg = ((ctx.synthesis.topResonatingTribe.affinityScore % 12) / 12) * 360;

  // Helper to generate SVG gear path with realistic involute teeth
  const generateGearPath = (cx: number, cy: number, rInner: number, rOuter: number, numTeeth: number) => {
    const points: string[] = [];
    const step = (Math.PI * 2) / numTeeth;

    for (let i = 0; i < numTeeth; i++) {
      const a0 = i * step;
      const a1 = a0 + step * 0.25;
      const a2 = a0 + step * 0.5;
      const a3 = a0 + step * 0.75;
      const a4 = a0 + step;

      const x0 = cx + Math.cos(a0) * rInner;
      const y0 = cy + Math.sin(a0) * rInner;
      const x1 = cx + Math.cos(a1) * rOuter;
      const y1 = cy + Math.sin(a1) * rOuter;
      const x2 = cx + Math.cos(a2) * rOuter;
      const y2 = cy + Math.sin(a2) * rOuter;
      const x3 = cx + Math.cos(a3) * rInner;
      const y3 = cy + Math.sin(a3) * rInner;
      const x4 = cx + Math.cos(a4) * rInner;
      const y4 = cy + Math.sin(a4) * rInner;

      if (i === 0) {
        points.push(`M ${x0} ${y0}`);
      }
      points.push(`L ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4}`);
    }
    points.push('Z');
    return points.join(' ');
  };

  // Rotation durations scaled to speed multiplier
  const animDurations = useMemo(() => {
    return {
      tzolkin: 60 / speedMultiplier,
      haab: (60 * (365 / 260)) / speedMultiplier,
      longcount: 90 / speedMultiplier,
      dreamspell: 52 / speedMultiplier,
      chinese: (60 * (60 / 260)) / speedMultiplier,
      egyptian: 120 / speedMultiplier,
      greek: 45 / speedMultiplier,
      ephemeris: 80 / speedMultiplier,
      numerology: 30 / speedMultiplier,
      tribes: 50 / speedMultiplier
    };
  }, [speedMultiplier]);

  return (
    <div className="relative w-full rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-raised)] p-4 md:p-5 shadow-[var(--shadow-panel)] overflow-hidden font-sans text-[color:var(--text-secondary)]">
      {/* Background conic gradient */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'conic-gradient(from 0deg, rgba(44,36,25,0.08), transparent, rgba(44,36,25,0.08))' }}
      />

      {/* Reticle Corner Brackets */}
      <div className="absolute top-2 left-2 p-1 border-l border-t border-[color:var(--temporal)]/50 z-20 pointer-events-none">
        <p className="text-[8px] uppercase tracking-tighter text-[color:var(--temporal-deep)] font-mono">CHRONOS MESH</p>
      </div>
      <div className="absolute top-2 right-2 p-1 border-r border-t border-[color:var(--temporal)]/50 z-20 pointer-events-none">
        <p className="text-[8px] uppercase tracking-tighter text-[color:var(--temporal-deep)] font-mono">10 GEAR SYNCHRONY</p>
      </div>

      {/* Top Header & High Density Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--line-soft)] pb-2.5 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isPlaying ? 'bg-cyan-400 opacity-75' : 'bg-orange-400 opacity-40'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isPlaying ? 'bg-cyan-500' : 'bg-orange-500'
              }`}
            />
          </div>
          <div>
            <h3 className="font-cinzel text-xs md:text-sm font-bold tracking-[0.15em] text-[color:var(--text-primary)] uppercase">
              The Grand Orrery — Gear of Gears
            </h3>
            <p className="text-[10px] text-[color:var(--text-muted)] font-sans italic">
              Where all traditions interlock in continuous mechanical harmony
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Modes */}
          <div className="flex items-center gap-1 bg-[color:var(--surface-well)] p-0.5 rounded-sm border border-[color:var(--line-soft)] text-[9px] uppercase">
            {[
              { id: 'ALL', label: 'All Gears' },
              { id: 'MESOAMERICAN', label: 'Maya & Dreamspell' },
              { id: 'MEDITERRANEAN', label: 'Egypt & Greece' },
              { id: 'SINITIC_CELESTIAL', label: 'China & Stars' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setViewMode(v.id as any)}
                className={`px-2 py-0.5 rounded-xs transition-colors ${
                  viewMode === v.id
                    ? 'bg-[color:var(--surface-raised)] text-[color:var(--temporal-deep)] font-bold border border-[color:var(--temporal)]/40'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => onTogglePlay && onTogglePlay()}
            className="px-2.5 py-1 rounded-sm bg-[color:var(--surface-well)] hover:bg-[color:var(--surface-raised)] text-[10px] font-mono uppercase text-[color:var(--text-secondary)] border border-[color:var(--line-medium)] transition-colors"
          >
            {isPlaying ? 'Pause Motion' : 'Engage Gears'}
          </button>

          <div className="flex items-center gap-1 bg-[color:var(--surface-well)] px-2 py-1 rounded-sm border border-[color:var(--line-soft)] text-[10px] font-mono">
            <span className="text-[color:var(--text-muted)] uppercase text-[9px]">Speed:</span>
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-1.5 py-0.5 rounded-sm ${
                  speedMultiplier === s
                    ? 'bg-[color:var(--surface-raised)] text-[color:var(--temporal-deep)] font-bold border border-[color:var(--temporal)]/40'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main SVG Gear Stage */}
      <div className="relative w-full aspect-[16/9] min-h-[380px] max-h-[520px] flex items-center justify-center bg-[color:var(--surface-well)] rounded-sm border border-[color:var(--line-soft)] overflow-hidden">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full select-none"
          style={{ filter: 'drop-shadow(0 0 18px rgba(184,134,46,0.08))' }}
        >
          <defs>
            <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="emeraldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="purpleGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Astronomical Ring Lines */}
          <circle cx="500" cy="300" r="260" stroke="#161616" strokeWidth="1" strokeDasharray="3 6" fill="none" />
          <circle cx="500" cy="300" r="180" stroke="#161616" strokeWidth="1" strokeDasharray="2 4" fill="none" />
          <line x1="50" y1="300" x2="950" y2="300" stroke="#141414" strokeWidth="0.75" strokeDasharray="2 8" />
          <line x1="500" y1="30" x2="500" y2="570" stroke="#141414" strokeWidth="0.75" strokeDasharray="2 8" />

          {/* GEAR 1: Maya Tzolk'in (Center-Left) */}
          <g
            transform="translate(350, 300)"
            className="cursor-pointer transition-opacity"
            onClick={() => setSelectedGear('tzolkin')}
            opacity={viewMode === 'ALL' || viewMode === 'MESOAMERICAN' ? 1 : 0.25}
          >
            <circle cx="0" cy="0" r="130" fill="url(#cyanGlow)" />
            <g
              style={{
                transform: `rotate(${tzolkinDeg}deg)`,
                animation: isPlaying ? `spin-slow ${animDurations.tzolkin}s linear infinite` : 'none',
                transformOrigin: '0 0'
              }}
            >
              <path
                d={generateGearPath(0, 0, 115, 130, 20)}
                fill="#f4ebe0"
                stroke="#00f0ff"
                strokeWidth={selectedGear === 'tzolkin' ? 2 : 1.2}
              />
              <circle cx="0" cy="0" r="95" stroke="#00f0ff" strokeWidth="0.75" strokeDasharray="3 3" strokeOpacity="0.3" fill="none" />
              <circle cx="0" cy="0" r="55" stroke="#00f0ff" strokeWidth="0.75" strokeOpacity="0.4" fill="#faf6ef" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <line
                  key={a}
                  x1={Math.cos((a * Math.PI) / 180) * 55}
                  y1={Math.sin((a * Math.PI) / 180) * 55}
                  x2={Math.cos((a * Math.PI) / 180) * 115}
                  y2={Math.sin((a * Math.PI) / 180) * 115}
                  stroke="#00f0ff"
                  strokeWidth="0.75"
                  strokeOpacity="0.2"
                />
              ))}
            </g>
            <circle cx="0" cy="0" r="40" fill="#faf6ef" stroke="#00f0ff" strokeWidth="1.2" />
            <text x="0" y="-7" textAnchor="middle" fill="#00f0ff" fontSize="8" letterSpacing="1">
              TZOLK'IN
            </text>
            <text x="0" y="8" textAnchor="middle" fill="#2c2419" fontSize="10" fontWeight="bold" fontFamily="Cinzel">
              {ctx.mayan.tzolkin.formatted}
            </text>
            <text x="0" y="20" textAnchor="middle" fill="#6b7280" fontSize="7">
              Kin {ctx.mayan.kinNumber}
            </text>
          </g>

          {/* GEAR 2: Maya Haab' (Center-Right) */}
          <g
            transform="translate(580, 300)"
            className="cursor-pointer transition-opacity"
            onClick={() => setSelectedGear('haab')}
            opacity={viewMode === 'ALL' || viewMode === 'MESOAMERICAN' ? 1 : 0.25}
          >
            <circle cx="0" cy="0" r="130" fill="url(#amberGlow)" />
            <g
              style={{
                transform: `rotate(${haabDeg}deg)`,
                animation: isPlaying ? `spin-reverse ${animDurations.haab}s linear infinite` : 'none',
                transformOrigin: '0 0'
              }}
            >
              <path
                d={generateGearPath(0, 0, 115, 130, 19)}
                fill="#f4ebe0"
                stroke="#f59e0b"
                strokeWidth={selectedGear === 'haab' ? 2 : 1.2}
              />
              <circle cx="0" cy="0" r="95" stroke="#f59e0b" strokeWidth="0.75" strokeDasharray="3 3" strokeOpacity="0.3" fill="none" />
              <circle cx="0" cy="0" r="55" stroke="#f59e0b" strokeWidth="0.75" strokeOpacity="0.4" fill="#faf6ef" />
            </g>
            <circle cx="0" cy="0" r="40" fill="#faf6ef" stroke="#f59e0b" strokeWidth="1.2" />
            <text x="0" y="-7" textAnchor="middle" fill="#f59e0b" fontSize="8" letterSpacing="1">
              HAAB' 365
            </text>
            <text x="0" y="8" textAnchor="middle" fill="#2c2419" fontSize="10" fontWeight="bold" fontFamily="Cinzel">
              {ctx.mayan.haab.formatted}
            </text>
            <text x="0" y="20" textAnchor="middle" fill="#6b7280" fontSize="7">
              Month {ctx.mayan.haab.monthIndex + 1}/19
            </text>
          </g>

          {/* GEAR 3: Maya Long Count / Baktun (Far Left) */}
          <g
            transform="translate(160, 300)"
            className="cursor-pointer transition-opacity"
            onClick={() => setSelectedGear('longcount')}
            opacity={viewMode === 'ALL' || viewMode === 'MESOAMERICAN' ? 1 : 0.25}
          >
            <g
              style={{
                transform: `rotate(${longCountDeg}deg)`,
                animation: isPlaying ? `spin-slow ${animDurations.longcount}s linear infinite` : 'none',
                transformOrigin: '0 0'
              }}
            >
              <path
                d={generateGearPath(0, 0, 75, 90, 13)}
                fill="#efe6d8"
                stroke="#38bdf8"
                strokeWidth={selectedGear === 'longcount' ? 2 : 1}
              />
              <circle cx="0" cy="0" r="45" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.3" fill="#faf6ef" />
            </g>
            <circle cx="0" cy="0" r="32" fill="#faf6ef" stroke="#38bdf8" strokeWidth="1" />
            <text x="0" y="-6" textAnchor="middle" fill="#38bdf8" fontSize="7">
              LONG COUNT
            </text>
            <text x="0" y="6" textAnchor="middle" fill="#2c2419" fontSize="8" fontWeight="bold">
              {ctx.mayan.longCount.baktun}.{ctx.mayan.longCount.katun}.{ctx.mayan.longCount.tun}
            </text>
            <text x="0" y="16" textAnchor="middle" fill="#6b7280" fontSize="6">
              13 Baktuns
            </text>
          </g>

          {/* GEAR 4: Dreamspell 13:20 (Top Left) */}
          <g
            transform="translate(240, 135)"
            className="cursor-pointer transition-opacity"
            onClick={() => setSelectedGear('dreamspell')}
            opacity={viewMode === 'ALL' || viewMode === 'MESOAMERICAN' ? 1 : 0.25}
          >
            <circle cx="0" cy="0" r="80" fill="url(#emeraldGlow)" />
            <g
              style={{
                transform: `rotate(${dreamspellDeg}deg)`,
                animation: isPlaying ? `spin-reverse ${animDurations.dreamspell}s linear infinite` : 'none',
                transformOrigin: '0 0'
              }}
            >
              <path
                d={generateGearPath(0, 0, 68, 80, 13)}
                fill="#efe6d8"
                stroke="#10b981"
                strokeWidth={selectedGear === 'dreamspell' ? 2 : 1}
              />
              <circle cx="0" cy="0" r="42" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.3" fill="#faf6ef" />
            </g>
            <circle cx="0" cy="0" r="30" fill="#faf6ef" stroke="#10b981" strokeWidth="1" />
            <text x="0" y="-6" textAnchor="middle" fill="#10b981" fontSize="6.5">
              DREAMSPELL
            </text>
            <text x="0" y="6" textAnchor="middle" fill="#2c2419" fontSize="8" fontWeight="bold">
              Kin {ctx.dreamspell.kin}
            </text>
            <text x="0" y="16" textAnchor="middle" fill="#6b7280" fontSize="6">
              Tone {ctx.dreamspell.galacticTone.number}
            </text>
          </g>

          {/* GEAR 5: Chinese Sexagenary (Top Center) */}
          <g
            transform="translate(465, 110)"
            className="cursor-pointer transition-opacity"
            onClick={() => setSelectedGear('chinese')}
            opacity={viewMode === 'ALL' || viewMode === 'SINITIC_CELESTIAL' ? 1 : 0.25}
          >
            <g
              style={{
                transform: `rotate(${chineseDeg}deg)`,
                animation: isPlaying ? `spin-slow ${animDurations.chinese}s linear infinite` : 'none',
                transformOrigin: '0 0'
              }}
            >
              <path
                d={generateGearPath(0, 0, 78, 92, 12)}
                fill="#efe6d8"
                stroke="#34d399"
                strokeWidth={selectedGear === 'chinese' ? 2 : 1}
              />
              <circle cx="0" cy="0" r="45" stroke="#34d399" strokeWidth="0.5" strokeOpacity="0.3" fill="#faf6ef" />
            </g>
            <circle cx="0" cy="0" r="32" fill="#faf6ef" stroke="#34d399" strokeWidth="1" />
            <text x="0" y="-6" textAnchor="middle" fill="#34d399" fontSize="6.5">
              SEXAGENARY
            </text>
            <text x="0" y="6" textAnchor="middle" fill="#2c2419" fontSize="8.5" fontWeight="bold">
              {ctx.chinese.yearPillar.stemPinYin}-{ctx.chinese.yearPillar.branchPinYin}
            </text>
            <text x="0" y="16" textAnchor="middle" fill="#6b7280" fontSize="6">
              {ctx.chinese.yearPillar.zodiacAnimal}
            </text>
          </g>

          {/* GEAR 6: Ancient Egyptian Sothic (Top Right) */}
          <g
            transform="translate(690, 135)"
            className="cursor-pointer transition-opacity"
            onClick={() => setSelectedGear('egyptian')}
            opacity={viewMode === 'ALL' || viewMode === 'MEDITERRANEAN' ? 1 : 0.25}
          >
            <g
              style={{
                transform: `rotate(${egyptianDeg}deg)`,
                animation: isPlaying ? `spin-reverse ${animDurations.egyptian}s linear infinite` : 'none',
                transformOrigin: '0 0'
              }}
            >
              <path
                d={generateGearPath(0, 0, 68, 80, 12)}
                fill="#efe6d8"
                stroke="#eab308"
                strokeWidth={selectedGear === 'egyptian' ? 2 : 1}
              />
              <circle cx="0" cy="0" r="42" stroke="#eab308" strokeWidth="0.5" strokeOpacity="0.3" fill="#faf6ef" />
            </g>
            <circle cx="0" cy="0" r="30" fill="#faf6ef" stroke="#eab308" strokeWidth="1" />
            <text x="0" y="-6" textAnchor="middle" fill="#eab308" fontSize="6.5">
              SOTHIC 1460
            </text>
            <text x="0" y="6" textAnchor="middle" fill="#2c2419" fontSize="8" fontWeight="bold">
              {ctx.egyptian.monthName}
            </text>
            <text x="0" y="16" textAnchor="middle" fill="#6b7280" fontSize="6">
              Year {ctx.egyptian.sothicYearInCycle}
            </text>
          </g>

          {/* GEAR 7: Attic Greek Lunisolar (Far Right) */}
          <g
            transform="translate(770, 300)"
            className="cursor-pointer transition-opacity"
            onClick={() => setSelectedGear('greek')}
            opacity={viewMode === 'ALL' || viewMode === 'MEDITERRANEAN' ? 1 : 0.25}
          >
            <g
              style={{
                transform: `rotate(${greekDeg}deg)`,
                animation: isPlaying ? `spin-slow ${animDurations.greek}s linear infinite` : 'none',
                transformOrigin: '0 0'
              }}
            >
              <path
                d={generateGearPath(0, 0, 75, 90, 19)}
                fill="#efe6d8"
                stroke="#6366f1"
                strokeWidth={selectedGear === 'greek' ? 2 : 1}
              />
              <circle cx="0" cy="0" r="45" stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.3" fill="#faf6ef" />
            </g>
            <circle cx="0" cy="0" r="32" fill="#faf6ef" stroke="#6366f1" strokeWidth="1" />
            <text x="0" y="-6" textAnchor="middle" fill="#818cf8" fontSize="6.5">
              METONIC 19
            </text>
            <text x="0" y="6" textAnchor="middle" fill="#2c2419" fontSize="8" fontWeight="bold">
              {ctx.greek.atticMonthName}
            </text>
            <text x="0" y="16" textAnchor="middle" fill="#6b7280" fontSize="6">
              Year {ctx.greek.metonicCycleYear}/19
            </text>
          </g>

          {/* GEAR 8: Celestial Ephemeris Zodiac Ring (Bottom Right) */}
          <g
            transform="translate(680, 465)"
            className="cursor-pointer transition-opacity"
            onClick={() => setSelectedGear('ephemeris')}
            opacity={viewMode === 'ALL' || viewMode === 'SINITIC_CELESTIAL' ? 1 : 0.25}
          >
            <g
              style={{
                transform: `rotate(${ephemerisDeg}deg)`,
                animation: isPlaying ? `spin-slow ${animDurations.ephemeris}s linear infinite` : 'none',
                transformOrigin: '0 0'
              }}
            >
              <path
                d={generateGearPath(0, 0, 68, 80, 12)}
                fill="#efe6d8"
                stroke="#f97316"
                strokeWidth={selectedGear === 'ephemeris' ? 2 : 1}
              />
              <circle cx="0" cy="0" r="42" stroke="#f97316" strokeWidth="0.5" strokeOpacity="0.3" fill="#faf6ef" />
            </g>
            <circle cx="0" cy="0" r="30" fill="#faf6ef" stroke="#f97316" strokeWidth="1" />
            <text x="0" y="-6" textAnchor="middle" fill="#fb923c" fontSize="6.5">
              EPHEMERIS
            </text>
            <text x="0" y="6" textAnchor="middle" fill="#2c2419" fontSize="8" fontWeight="bold">
              {ctx.celestialBodies[0]?.zodiacSign} {ctx.celestialBodies[0]?.signDegree.toFixed(0)}°
            </text>
            <text x="0" y="16" textAnchor="middle" fill="#6b7280" fontSize="6">
              Solar Transit
            </text>
          </g>

          {/* GEAR 9: Decad Numerology (Bottom Center) */}
          <g
            transform="translate(465, 480)"
            className="cursor-pointer transition-opacity"
            onClick={() => setSelectedGear('numerology')}
            opacity={viewMode === 'ALL' ? 1 : 0.25}
          >
            <circle cx="0" cy="0" r="85" fill="url(#purpleGlow)" />
            <g
              style={{
                transform: `rotate(${numDeg}deg)`,
                animation: isPlaying ? `spin-reverse ${animDurations.numerology}s linear infinite` : 'none',
                transformOrigin: '0 0'
              }}
            >
              <path
                d={generateGearPath(0, 0, 78, 92, 9)}
                fill="#efe6d8"
                stroke="#c084fc"
                strokeWidth={selectedGear === 'numerology' ? 2 : 1}
              />
              <circle cx="0" cy="0" r="45" stroke="#c084fc" strokeWidth="0.5" strokeOpacity="0.3" fill="#faf6ef" />
            </g>
            <circle cx="0" cy="0" r="32" fill="#faf6ef" stroke="#c084fc" strokeWidth="1" />
            <text x="0" y="-6" textAnchor="middle" fill="#c084fc" fontSize="6.5">
              DECAD VIBE
            </text>
            <text x="0" y="6" textAnchor="middle" fill="#2c2419" fontSize="8.5" fontWeight="bold">
              Life Path {ctx.numerology.lifePathNumber}
            </text>
            <text x="0" y="16" textAnchor="middle" fill="#6b7280" fontSize="6">
              Day {ctx.numerology.universalDay}
            </text>
          </g>

          {/* GEAR 10: Twelve Tribes Camp Wheel (Bottom Left) */}
          <g
            transform="translate(250, 465)"
            className="cursor-pointer transition-opacity"
            onClick={() => setSelectedGear('tribes')}
            opacity={viewMode === 'ALL' ? 1 : 0.25}
          >
            <g
              style={{
                transform: `rotate(${tribesDeg}deg)`,
                animation: isPlaying ? `spin-slow ${animDurations.tribes}s linear infinite` : 'none',
                transformOrigin: '0 0'
              }}
            >
              <path
                d={generateGearPath(0, 0, 68, 80, 12)}
                fill="#efe6d8"
                stroke="#f43f5e"
                strokeWidth={selectedGear === 'tribes' ? 2 : 1}
              />
              <circle cx="0" cy="0" r="42" stroke="#f43f5e" strokeWidth="0.5" strokeOpacity="0.3" fill="#faf6ef" />
            </g>
            <circle cx="0" cy="0" r="30" fill="#faf6ef" stroke="#f43f5e" strokeWidth="1" />
            <text x="0" y="-6" textAnchor="middle" fill="#fb7185" fontSize="6.5">
              12 TRIBES
            </text>
            <text x="0" y="6" textAnchor="middle" fill="#2c2419" fontSize="8" fontWeight="bold">
              {ctx.synthesis.topResonatingTribe.tribe}
            </text>
            <text x="0" y="16" textAnchor="middle" fill="#6b7280" fontSize="6">
              {ctx.synthesis.topResonatingTribe.directionInCamp} Camp
            </text>
          </g>

          {/* Central Crucible Hub */}
          <g transform="translate(465, 300)">
            <circle cx="0" cy="0" r="22" fill="#faf6ef" stroke="#333" strokeWidth="1" />
            <circle cx="0" cy="0" r="5" fill="#00f0ff" />
            <text x="0" y="3" textAnchor="middle" fill="#2c2419" fontSize="6.5">
              CRUX
            </text>
          </g>
        </svg>
      </div>

      {/* Selected Gear Dossier Card — Smooth, Novel-Like Literary Exposition */}
      <div className="mt-3 rounded-sm border border-[color:var(--line-soft)] bg-[color:var(--surface-well)] p-3 text-xs font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--line-soft)] pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase text-gray-500">Selected Orrery Gear:</span>
            <span className="font-bold text-[color:var(--temporal-deep)] uppercase tracking-wider text-xs">
              {selectedGear === 'tzolkin' && "Maya Tzolk'in 260-Day Sacred Loom"}
              {selectedGear === 'haab' && "Maya Haab' 365-Day Solar Count"}
              {selectedGear === 'longcount' && 'Maya Great Baktun Long Count'}
              {selectedGear === 'dreamspell' && 'Dreamspell 13:20 Synchronometer'}
              {selectedGear === 'chinese' && 'Chinese BaZi Sexagenary Gan-Zhi Wheel'}
              {selectedGear === 'egyptian' && 'Egyptian Sothic Great Year (1,460 Years)'}
              {selectedGear === 'greek' && 'Attic Greek Lunisolar Metonic Cycle (19 Years)'}
              {selectedGear === 'ephemeris' && 'Geocentric Celestial Ephemeris Ring'}
              {selectedGear === 'numerology' && 'Pythagorean & Chaldean Decad Vibration'}
              {selectedGear === 'tribes' && 'Twelve Tribes Cardinal Sanctuary Matrix'}
            </span>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-1 text-[9px] uppercase">
            {(
              [
                { id: 'tzolkin', label: "Tzolk'in" },
                { id: 'haab', label: "Haab'" },
                { id: 'longcount', label: 'Long Count' },
                { id: 'dreamspell', label: 'Dreamspell' },
                { id: 'chinese', label: 'China' },
                { id: 'egyptian', label: 'Egypt' },
                { id: 'greek', label: 'Greece' },
                { id: 'ephemeris', label: 'Ephemeris' },
                { id: 'numerology', label: 'Decad' },
                { id: 'tribes', label: 'Tribes' }
              ] as const
            ).map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedGear(b.id)}
                className={`px-1.5 py-0.5 rounded-xs border transition-colors ${
                  selectedGear === b.id
                    ? 'bg-[color:var(--surface-raised)] border-cyan-700 text-cyan-800 font-bold'
                    : 'border-[color:var(--rule)] text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Detail Card with Smooth Novel-Like Literary Prose */}
        {selectedGear === 'tzolkin' && (
          <div className="p-3 bg-[color:var(--surface-raised)] border-l-2 border-cyan-500 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <MayanGlyphIcon name={ctx.mayan.tzolkin.signName} size={32} />
                <div>
                  <span className="text-[9px] uppercase text-cyan-500 font-bold">Kin {ctx.mayan.kinNumber}</span>
                  <p className="text-xs font-serif italic text-[color:var(--text-primary)] font-bold">{ctx.mayan.tzolkin.formatted}</p>
                </div>
              </div>
              <div className="text-[11px] text-gray-400">
                Direction: <strong className="text-[color:var(--text-primary)]">{ctx.mayan.tzolkin.direction}</strong> • Element: <strong className="text-cyan-800">{ctx.mayan.tzolkin.element}</strong>
              </div>
            </div>
            <p className="font-serif text-[12px] leading-relaxed text-[color:var(--text-secondary)] italic">
              “As the 260-day sacred loom turns beneath the tropical canopy of the Petén, {ctx.mayan.tzolkin.signName} steps forward into the clearing. Representing {ctx.mayan.tzolkin.meaning}, it weaves mortal breath with galactic intention. Here, Tone {ctx.mayan.galacticTone.number} ({ctx.mayan.galacticTone.name}) breathes its sovereign power into the soil, inviting the listener to remember that time is not a measure of haste, but a tapestry of living presence.”
            </p>
          </div>
        )}

        {selectedGear === 'haab' && (
          <div className="p-3 bg-[color:var(--surface-raised)] border-l-2 border-amber-500 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase text-amber-500 font-bold">Solar Uinal {ctx.mayan.haab.monthIndex + 1} of 19</span>
                <p className="text-xs font-serif italic text-[color:var(--text-primary)] font-bold">{ctx.mayan.haab.formatted}</p>
              </div>
              <div className="text-xs font-cinzel text-amber-300 font-bold">
                Calendar Round: {ctx.mayan.calendarRound}
              </div>
            </div>
            <p className="font-serif text-[12px] leading-relaxed text-[color:var(--text-secondary)] italic">
              “Eighteen months of twenty solar dawns, anchored by the five quiet nameless days of Wayeb. The Haab' mirrors the sun’s journey across maize fields and stone pyramids, marking the physical seasons of planting, rains, and harvest. Meshed against the Tzolk'in, the two gears require fifty-two full solar circuits—18,980 individual dawns—before their teeth meet at the exact same tooth again.”
            </p>
          </div>
        )}

        {selectedGear === 'longcount' && (
          <div className="p-3 bg-[color:var(--surface-raised)] border-l-2 border-sky-500 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase text-sky-400 font-bold">The Great Baktun Loom</span>
                <p className="text-xs font-serif italic text-[color:var(--text-primary)] font-bold">{ctx.mayan.longCount.formatted}</p>
              </div>
              <div className="text-[11px] text-gray-400">
                Total Elapsed Days: <strong className="text-[color:var(--text-primary)]">{ctx.mayan.daysSinceEpoch.toLocaleString()} Kin</strong>
              </div>
            </div>
            <p className="font-serif text-[12px] leading-relaxed text-[color:var(--text-secondary)] italic">
              “From the mythical genesis epoch of August 11, 3114 BCE, the Maya scribes maintained an unbroken mathematical tally that never dropped a second. Five nested wheels of time—Kin, Uinal, Tun, Katun, and Baktun—whisper of vast planetary eras where civilizations rise, ripen, and surrender back to the forest, measuring human evolution in golden spans of five thousand years.”
            </p>
          </div>
        )}

        {selectedGear === 'dreamspell' && (
          <div className="p-3 bg-[color:var(--surface-raised)] border-l-2 border-emerald-500 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase text-emerald-400 font-bold">Argüelles 13:20 Matrix</span>
                <p className="text-xs font-serif italic text-[color:var(--text-primary)] font-bold">{ctx.dreamspell.signature}</p>
              </div>
              <div className="text-[11px] text-gray-400">
                Moon {ctx.dreamspell.thirteenMoon.moonNumber}: <strong className="text-emerald-300">{ctx.dreamspell.thirteenMoon.moonName}</strong> (Day {ctx.dreamspell.thirteenMoon.dayOfMoon}/28)
              </div>
            </div>
            <p className="font-serif text-[12px] leading-relaxed text-[color:var(--text-secondary)] italic">
              “Transmitted as a harmonic wake-up call for the planetary biosphere, the Dreamspell unbinds humanity from the artificial twelve-hour clock and irregular months. Operating on thirteen peaceful moons of twenty-eight days each, it guides the voyager through twenty solar seals and thirteen galactic rays, awakening telepathic remembrance of our place in the cosmic web.”
            </p>
          </div>
        )}

        {selectedGear === 'chinese' && (
          <div className="p-3 bg-[color:var(--surface-raised)] border-l-2 border-emerald-600 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase text-emerald-400 font-bold">Gan-Zhi Sexagenary Pillar</span>
                <p className="text-xs font-serif italic text-[color:var(--text-primary)] font-bold">
                  {ctx.chinese.yearPillar.stemPinYin}-{ctx.chinese.yearPillar.branchPinYin} ({ctx.chinese.yearPillar.stemElement} {ctx.chinese.yearPillar.zodiacAnimal})
                </p>
              </div>
              <div className="text-[11px] text-gray-400">
                Solar Term: <strong className="text-emerald-300">{ctx.chinese.solarTerm.name}</strong> • Wu Xing: <strong className="text-emerald-300">{ctx.chinese.dominantElement}</strong>
              </div>
            </div>
            <p className="font-serif text-[12px] leading-relaxed text-[color:var(--text-secondary)] italic">
              “Ten Heavenly Stems meet Twelve Earthly Branches, rotating in sixty harmonious pairings since the mythical reign of the Yellow Emperor. Here, the breath of the seasons is measured by twenty-four Jieqi solar terms, while Wood, Fire, Earth, Metal, and Water dance in perpetual balance, reminding the sage that internal virtue mirrors the celestial Dao.”
            </p>
          </div>
        )}

        {selectedGear === 'egyptian' && (
          <div className="p-3 bg-[color:var(--surface-raised)] border-l-2 border-amber-500 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase text-amber-500 font-bold">The Sothic Great Year of Sirius</span>
                <p className="text-xs font-serif italic text-[color:var(--text-primary)] font-bold">
                  Year {ctx.egyptian.civilYear}, Month of {ctx.egyptian.monthName} (Day {ctx.egyptian.dayOfMonth})
                </p>
              </div>
              <div className="text-[11px] text-gray-400">
                Season: <strong className="text-amber-300">{ctx.egyptian.season}</strong> • Sothic Year {ctx.egyptian.sothicYearInCycle}/1460
              </div>
            </div>
            <p className="font-serif text-[12px] leading-relaxed text-[color:var(--text-secondary)] italic">
              “Under the watchful eye of Thoth and Isis, the Nile flows through Akhet, Peret, and Shemu. Because the civil calendar counted exactly 365 days without a leap day, the calendar drifted one day every four years, embarking on an epic 1,460-year peregrination until the heliacal rising of Sirius once again greeted the summer solstice at dawn.”
            </p>
          </div>
        )}

        {selectedGear === 'greek' && (
          <div className="p-3 bg-[color:var(--surface-raised)] border-l-2 border-indigo-500 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase text-indigo-400 font-bold">Attic Lunisolar Metonic Wheel</span>
                <p className="text-xs font-serif italic text-[color:var(--text-primary)] font-bold">
                  Month of {ctx.greek.atticMonthName}, Day {ctx.greek.atticDay}
                </p>
              </div>
              <div className="text-[11px] text-gray-400">
                Metonic Year <strong className="text-indigo-300">{ctx.greek.metonicCycleYear} of 19</strong> • Olympiad {ctx.greek.olympiadNumber}, Year {ctx.greek.olympiadYear}
              </div>
            </div>
            <p className="font-serif text-[12px] leading-relaxed text-[color:var(--text-secondary)] italic">
              “In the shadow of the Acropolis, Meton discovered that nineteen solar circuits encompass exactly 235 synodic lunations. By interspersing seven intercalary months across this golden span, the ancient Greeks harmonized the nocturnal silver light of Selene with the diurnal golden splendor of Apollo.”
            </p>
          </div>
        )}

        {selectedGear === 'ephemeris' && (
          <div className="p-3 bg-[color:var(--surface-raised)] border-l-2 border-orange-500 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase text-orange-400 font-bold">Geocentric Celestial Sphere</span>
                <p className="text-xs font-serif italic text-[color:var(--text-primary)] font-bold">
                  Sun in {ctx.celestialBodies[0]?.zodiacSign} at {ctx.celestialBodies[0]?.signDegree.toFixed(1)}°
                </p>
              </div>
              <div className="text-[11px] text-gray-400">
                Tracking <strong className="text-orange-300">{ctx.celestialBodies.length} Wanderers</strong> across 360°
              </div>
            </div>
            <p className="font-serif text-[12px] leading-relaxed text-[color:var(--text-secondary)] italic">
              “The planets traverse the great circle of the ecliptic like actors upon a cosmic stage. As observed from our terrestrial vantage point, their speeds fluctuate, they turn backward in contemplative retrograde loops, and form geometric chords of trines and squares that mirror the shifting currents of the collective human soul.”
            </p>
          </div>
        )}

        {selectedGear === 'numerology' && (
          <div className="p-3 bg-[color:var(--surface-raised)] border-l-2 border-purple-500 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase text-purple-400 font-bold">The Pythagorean Decad</span>
                <p className="text-xs font-serif italic text-[color:var(--text-primary)] font-bold">
                  Life Path Vibration {ctx.numerology.lifePathNumber} {ctx.numerology.lifePathIsMaster ? '(Master)' : ''}
                </p>
              </div>
              <div className="text-[11px] text-gray-400">
                Universal Day <strong className="text-purple-300">{ctx.numerology.universalDay}</strong> • Chaldean Root <strong className="text-purple-300">{ctx.numerology.chaldeanVibration}</strong>
              </div>
            </div>
            <p className="font-serif text-[12px] leading-relaxed text-[color:var(--text-secondary)] italic">
              “‘All is number,’ declared Pythagoras in the quiet groves of Croton. Behind the veil of names and forms, the integers one through nine hold the essential vibrational archetypes of creation. From the primordial unity of One, through the tension of Two and the harmony of Three, each day vibrates with a distinct spiritual lesson.”
            </p>
          </div>
        )}

        {selectedGear === 'tribes' && (
          <div className="p-3 bg-[color:var(--surface-raised)] border-l-2 border-rose-500 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase text-rose-400 font-bold">The Camp in the Wilderness</span>
                <p className="text-xs font-serif italic text-[color:var(--text-primary)] font-bold">
                  Tribe of {ctx.synthesis.topResonatingTribe.tribe} ({ctx.synthesis.topResonatingTribe.hebrewName})
                </p>
              </div>
              <div className="text-[11px] text-gray-400">
                Camp Quadrant: <strong className="text-rose-300">{ctx.synthesis.topResonatingTribe.directionInCamp}</strong> • Gemstone: <strong className="text-rose-300">{ctx.synthesis.topResonatingTribe.gemstone}</strong>
              </div>
            </div>
            <p className="font-serif text-[12px] leading-relaxed text-[color:var(--text-secondary)] italic">
              “Arranged about the central sanctuary in strict cardinal symmetry, the Twelve Tribes represent the earthly reflection of the celestial sphere. Judah anchors the East like the morning lion, Reuben guards the South with flowing waters, Ephraim holds the West under the sign of the ox, and Dan keeps watch over the North with the vision of an eagle.”
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
