/**
 * Zodiac chart wheel, drawn to the standard Western layout:
 *
 *   • Ascendant on the left (9 o'clock), signs running counter-clockwise
 *   • outer band: the twelve signs, tinted by element
 *   • degree scale with 1° / 5° / 10° ticks
 *   • planets with glyph, degree and retrograde mark, spread apart where they crowd
 *   • house cusps and numbers, with the AC–DC and MC–IC axes emphasised
 *   • aspect lines across the centre, coloured by aspect type
 */

import React, { useMemo, useState } from 'react';
import { CelestialCoordinate } from '../../types';
import { CelestialAspect } from '../../engine/ephemeris';
import { ChartLayout, polar, svgAngleForLongitude, wrap360 } from '../../engine/chartWheel';
import { ASPECTS, ELEMENT_COLOR, ELEMENT_TINT, GLYPH_FONT, PLANETS, SIGNS, planetGlyph } from '../symbols/AstroGlyph';

interface ChartWheelProps {
  bodies: CelestialCoordinate[];
  aspects: CelestialAspect[];
  layout: ChartLayout;
  selectedId?: string;
  onSelect?: (id: string) => void;
  onAspectSelect?: (aspect: CelestialAspect) => void;
  /** Largest orb (degrees) of aspect lines to draw */
  maxOrb?: number;
}

const SIZE = 640;
const C = SIZE / 2;
const PAD = 30;
const R = {
  outer: 306,
  zodiacOuter: 300,
  zodiacInner: 258,
  scaleInner: 246,
  planet: 216,
  degree: 187,
  houseOuter: 164,
  houseInner: 140,
  aspect: 140
};

const INK = '#1b1f3b';
const LINE = '#b9b3a4';
const GOLD = '#a9812f';
const UI_FONT = "'Inter Variable', Inter, system-ui, sans-serif";

function ringSegment(rInner: number, rOuter: number, a0: number, a1: number) {
  // a0 → a1 runs counter-clockwise on screen (decreasing SVG angle)
  const p0 = polar(C, C, rOuter, a0);
  const p1 = polar(C, C, rOuter, a1);
  const p2 = polar(C, C, rInner, a1);
  const p3 = polar(C, C, rInner, a0);
  return `M ${p0.x} ${p0.y} A ${rOuter} ${rOuter} 0 0 0 ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${rInner} ${rInner} 0 0 1 ${p3.x} ${p3.y} Z`;
}

/** Push crowded glyphs apart along the ring so none overlap. */
function spreadLongitudes(items: Array<{ id: string; lon: number }>, minGap: number): Record<string, number> {
  const sorted = [...items].sort((a, b) => a.lon - b.lon).map((x) => ({ ...x, pos: x.lon }));
  const n = sorted.length;
  if (n < 2) return Object.fromEntries(sorted.map((s) => [s.id, s.pos]));
  for (let iter = 0; iter < 200; iter++) {
    let moved = false;
    for (let i = 0; i < n; i++) {
      const a = sorted[i];
      const b = sorted[(i + 1) % n];
      const gap = wrap360(b.pos - a.pos);
      if (gap < minGap && gap < 180) {
        const push = (minGap - gap) / 2 + 0.01;
        a.pos -= push;
        b.pos += push;
        moved = true;
      }
    }
    if (!moved) break;
  }
  // keep each glyph within reach of its true position
  return Object.fromEntries(sorted.map((s) => [s.id, s.lon + Math.max(-28, Math.min(28, s.pos - s.lon))]));
}

export const ChartWheel: React.FC<ChartWheelProps> = ({
  bodies,
  aspects,
  layout,
  selectedId,
  onSelect,
  onAspectSelect,
  maxOrb = 6
}) => {
  const [hoverId, setHoverId] = useState<string | undefined>();
  const asc = layout.angles?.ascendantDeg;
  const ang = (lon: number) => svgAngleForLongitude(lon, asc);
  const focusId = hoverId ?? selectedId;
  const focusName = bodies.find((b) => b.id === focusId)?.name;

  const display = useMemo(
    () => spreadLongitudes(bodies.map((b) => ({ id: b.id, lon: b.eclipticLongitude })), 9.2),
    [bodies]
  );

  const visibleAspects = useMemo(() => {
    const names = new Set(bodies.map((b) => b.name));
    return aspects
      .filter((a) => a.orbDeg <= maxOrb && names.has(a.bodyA) && names.has(a.bodyB))
      .sort((a, b) => b.orbDeg - a.orbDeg);
  }, [aspects, bodies, maxOrb]);

  const byName = useMemo(() => Object.fromEntries(bodies.map((b) => [b.name, b])), [bodies]);
  const angular = layout.angles
    ? [
        { key: 'AC', lon: layout.angles.ascendantDeg, label: 'AC', full: 'Ascendant (rising sign)' },
        { key: 'DC', lon: layout.angles.descendantDeg, label: 'DC', full: 'Descendant' },
        { key: 'MC', lon: layout.angles.midheavenDeg, label: 'MC', full: 'Midheaven' },
        { key: 'IC', lon: layout.angles.imumCoeliDeg, label: 'IC', full: 'Imum Coeli' }
      ]
    : [];

  return (
    <svg
      viewBox={`${-PAD} ${-PAD} ${SIZE + PAD * 2} ${SIZE + PAD * 2}`}
      className="chart-wheel select-none"
      role="img"
      aria-label={`${layout.mode === 'natal' ? 'Birth' : 'Current sky'} chart wheel showing ${bodies.length} bodies across the zodiac`}
    >
      <defs>
        <radialGradient id="cw-paper" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#fffdf8" />
          <stop offset="100%" stopColor="#f6f1e6" />
        </radialGradient>
        <radialGradient id="cw-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8f5ee" />
        </radialGradient>
        <filter id="cw-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#1b1f3b" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Base disc */}
      <circle cx={C} cy={C} r={R.outer} fill="url(#cw-paper)" stroke={INK} strokeWidth="1.4" filter="url(#cw-shadow)" />

      {/* Zodiac band */}
      {SIGNS.map((sign, i) => {
        const a0 = ang(i * 30);
        const a1 = ang(i * 30 + 30);
        const g = polar(C, C, (R.zodiacOuter + R.zodiacInner) / 2, ang(i * 30 + 15));
        const edge0 = polar(C, C, R.zodiacInner, a0);
        const edge1 = polar(C, C, R.zodiacOuter, a0);
        return (
          <g key={sign.name}>
            <path d={ringSegment(R.zodiacInner, R.zodiacOuter, a0, a1)} fill={ELEMENT_TINT[sign.element]} />
            <line x1={edge0.x} y1={edge0.y} x2={edge1.x} y2={edge1.y} stroke={INK} strokeWidth="0.9" opacity="0.55" />
            <text
              x={g.x}
              y={g.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={ELEMENT_COLOR[sign.element]}
              fontSize="25"
              style={{ fontFamily: GLYPH_FONT }}
            >
              {sign.glyph + '︎'}
              <title>{`${sign.name} — ${sign.element.toLowerCase()} sign (${sign.keyword})`}</title>
            </text>
          </g>
        );
      })}
      <circle cx={C} cy={C} r={R.zodiacOuter} fill="none" stroke={INK} strokeWidth="0.9" opacity="0.55" />
      <circle cx={C} cy={C} r={R.zodiacInner} fill="none" stroke={INK} strokeWidth="1.1" />

      {/* Degree scale */}
      {Array.from({ length: 360 }, (_, d) => {
        const len = d % 10 === 0 ? 12 : d % 5 === 0 ? 8 : 4;
        const a = ang(d);
        const p0 = polar(C, C, R.zodiacInner, a);
        const p1 = polar(C, C, R.zodiacInner - len, a);
        return (
          <line
            key={d}
            x1={p0.x}
            y1={p0.y}
            x2={p1.x}
            y2={p1.y}
            stroke={INK}
            strokeWidth={d % 10 === 0 ? 0.9 : 0.5}
            opacity={d % 5 === 0 ? 0.7 : 0.4}
          />
        );
      })}

      {/* House ring */}
      <circle cx={C} cy={C} r={R.houseOuter} fill="none" stroke={LINE} strokeWidth="0.9" />
      <circle cx={C} cy={C} r={R.aspect} fill="url(#cw-core)" stroke={INK} strokeWidth="1" />

      {layout.houses.map((house, i) => {
        const next = layout.houses[(i + 1) % layout.houses.length];
        const span = wrap360(next.longitude - house.longitude);
        const a = ang(house.longitude);
        const isAngle = house.house === 1 || house.house === 4 || house.house === 7 || house.house === 10;
        const inner = polar(C, C, R.aspect, a);
        const outer = polar(C, C, R.zodiacInner, a);
        const label = polar(C, C, (R.houseOuter + R.houseInner) / 2, ang(house.longitude + span / 2));
        return (
          <g key={house.house}>
            {!isAngle && <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={LINE} strokeWidth="0.9" />}
            <text
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#747991"
              fontSize="13"
              fontWeight="600"
              style={{ fontFamily: UI_FONT }}
            >
              {house.house}
              <title>{`House ${house.house} begins at ${Math.floor(house.longitude % 30)}° ${house.sign}`}</title>
            </text>
          </g>
        );
      })}

      {/* Aspect lines */}
      <g>
        {visibleAspects.map((asp, idx) => {
          const a = byName[asp.bodyA];
          const b = byName[asp.bodyB];
          const def = ASPECTS[asp.aspectType];
          if (!a || !b || !def || asp.aspectType === 'Conjunction') return null;
          const pa = polar(C, C, R.aspect - 1, ang(a.eclipticLongitude));
          const pb = polar(C, C, R.aspect - 1, ang(b.eclipticLongitude));
          const involved = focusName ? asp.bodyA === focusName || asp.bodyB === focusName : true;
          const tight = asp.orbDeg <= 2;
          return (
            <line
              key={`${asp.bodyA}-${asp.bodyB}-${idx}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={def.color}
              strokeWidth={tight ? 1.9 : 1.1}
              strokeDasharray={asp.aspectType === 'Sextile' ? '5 4' : undefined}
              opacity={involved ? (tight ? 0.95 : 0.7) : 0.12}
              className={onAspectSelect ? 'cursor-pointer' : undefined}
              onClick={(e) => {
                e.stopPropagation();
                onAspectSelect?.(asp);
              }}
            >
              <title>{`${asp.bodyA} ${asp.aspectType.toLowerCase()} ${asp.bodyB} — ${def.plain} (orb ${asp.orbDeg.toFixed(1)}°)`}</title>
            </line>
          );
        })}
        {/* True-position dots on the aspect circle */}
        {bodies.map((b) => {
          const p = polar(C, C, R.aspect, ang(b.eclipticLongitude));
          return <circle key={b.id} cx={p.x} cy={p.y} r="2.4" fill={PLANETS[b.id]?.color ?? INK} />;
        })}
      </g>

      {/* Angles: AC–DC and MC–IC axes */}
      {angular.map((ax) => {
        const a = ang(ax.lon);
        const inner = polar(C, C, R.aspect, a);
        const outer = polar(C, C, R.zodiacInner, a);
        const tip = polar(C, C, R.outer + 1, a);
        const lab = polar(C, C, R.outer + 19, a);
        const major = ax.key === 'AC' || ax.key === 'MC';
        return (
          <g key={ax.key}>
            <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={INK} strokeWidth={major ? 2.4 : 1.5} />
            <line x1={outer.x} y1={outer.y} x2={tip.x} y2={tip.y} stroke={INK} strokeWidth={major ? 2.4 : 1.5} opacity="0.35" />
            <text
              x={lab.x}
              y={lab.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={major ? INK : '#747991'}
              fontSize="14"
              fontWeight="700"
              letterSpacing="0.04em"
              style={{ fontFamily: UI_FONT }}
            >
              {ax.label}
              <title>{`${ax.full}: ${Math.floor(ax.lon % 30)}° ${SIGNS[Math.floor(wrap360(ax.lon) / 30) % 12].name}`}</title>
            </text>
          </g>
        );
      })}

      {/* Planets */}
      {bodies.map((body) => {
        const info = PLANETS[body.id];
        const color = info?.color ?? INK;
        const trueA = ang(body.eclipticLongitude);
        const dispA = ang(display[body.id] ?? body.eclipticLongitude);
        const tick0 = polar(C, C, R.zodiacInner, trueA);
        const tick1 = polar(C, C, R.zodiacInner - 14, trueA);
        const lead = polar(C, C, R.planet + 17, dispA);
        const p = polar(C, C, R.planet, dispA);
        const d = polar(C, C, R.degree, dispA);
        const isFocus = body.id === focusId;
        const dim = focusId && !isFocus;
        return (
          <g
            key={body.id}
            className={onSelect ? 'cursor-pointer' : undefined}
            opacity={dim ? 0.55 : 1}
            onClick={() => onSelect?.(body.id)}
            onMouseEnter={() => setHoverId(body.id)}
            onMouseLeave={() => setHoverId(undefined)}
            tabIndex={onSelect ? 0 : undefined}
            role={onSelect ? 'button' : undefined}
            aria-label={`${body.name} at ${Math.floor(body.signDegree)}° ${body.zodiacSign}${body.isRetrograde ? ', retrograde' : ''}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(body.id);
              }
            }}
          >
            <title>{`${body.name} — ${Math.floor(body.signDegree)}° ${body.zodiacSign}${body.isRetrograde ? ' (retrograde)' : ''}. ${info?.meaning ?? ''}`}</title>
            <line x1={tick0.x} y1={tick0.y} x2={tick1.x} y2={tick1.y} stroke={color} strokeWidth="1.6" />
            <line x1={tick1.x} y1={tick1.y} x2={lead.x} y2={lead.y} stroke={color} strokeWidth="0.8" opacity="0.6" />
            <circle
              cx={p.x}
              cy={p.y}
              r="17"
              fill={isFocus ? color : '#fffdf8'}
              stroke={color}
              strokeWidth={isFocus ? 2 : 1.2}
            />
            <text
              x={p.x}
              y={p.y + 0.5}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isFocus ? '#fffdf8' : color}
              fontSize="21"
              style={{ fontFamily: GLYPH_FONT }}
            >
              {planetGlyph(body.id) || body.symbol}
            </text>
            <text
              x={d.x}
              y={d.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={INK}
              fontSize="12"
              fontWeight="600"
              style={{ fontFamily: UI_FONT }}
            >
              {Math.floor(body.signDegree)}°
              {body.isRetrograde && (
                <tspan fill="#b8483a" fontSize="10.5" dx="1.5" style={{ fontFamily: GLYPH_FONT }}>
                  ℞
                </tspan>
              )}
            </text>
          </g>
        );
      })}

      {/* Centre mark */}
      <circle cx={C} cy={C} r="3" fill={GOLD} />
      <circle cx={C} cy={C} r="7" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
};
