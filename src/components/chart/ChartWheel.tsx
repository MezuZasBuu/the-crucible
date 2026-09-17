/**
 * Tropical chart wheel — ASC at left when known, vector-style unicode glyphs, house ring.
 */

import React, { useMemo } from 'react';
import { CelestialCoordinate } from '../../types';
import { CelestialAspect, ZODIAC_SIGNS } from '../../engine/ephemeris';
import { ChartLayout, polar, svgAngleForLongitude } from '../../engine/chartWheel';
import { ELEMENT_FILL } from '../../design/systemThemes';

interface ChartWheelProps {
  bodies: CelestialCoordinate[];
  aspects: CelestialAspect[];
  layout: ChartLayout;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

function planetColor(id: string) {
  switch (id) {
    case 'sun': return '#b8862e';
    case 'moon': return '#5c6b8a';
    case 'mercury': return '#4a7c8c';
    case 'venus': return '#c4715b';
    case 'mars': return '#9a4454';
    case 'jupiter': return '#6d8f6a';
    case 'saturn': return '#7a5a1a';
    case 'uranus': return '#3d5a8a';
    case 'neptune': return '#5c6b8a';
    case 'pluto': return '#5b3d8a';
    default: return '#6b6560';
  }
}

function wedgePath(cx: number, cy: number, rInner: number, rOuter: number, a0: number, a1: number) {
  const r0 = (a0 * Math.PI) / 180;
  const r1 = (a1 * Math.PI) / 180;
  const x0 = cx + rOuter * Math.cos(r0);
  const y0 = cy + rOuter * Math.sin(r0);
  const x1 = cx + rOuter * Math.cos(r1);
  const y1 = cy + rOuter * Math.sin(r1);
  const x2 = cx + rInner * Math.cos(r1);
  const y2 = cy + rInner * Math.sin(r1);
  const x3 = cx + rInner * Math.cos(r0);
  const y3 = cy + rInner * Math.sin(r0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${rOuter} ${rOuter} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${rInner} ${rInner} 0 ${large} 0 ${x3} ${y3} Z`;
}

export const ChartWheel: React.FC<ChartWheelProps> = ({ bodies, aspects, layout, selectedId, onSelect }) => {
  const cx = 220;
  const cy = 220;
  const asc = layout.angles?.ascendantDeg;
  const tightAspects = useMemo(() => {
    const selected = bodies.find((b) => b.id === selectedId);
    const tight = aspects.filter((a) => a.orbDeg <= 4);
    if (!selected) return tight.slice(0, 12);
    return tight.filter((a) => a.bodyA === selected.name || a.bodyB === selected.name);
  }, [aspects, bodies, selectedId]);

  const stacked = useMemo(() => {
    const sorted = [...bodies].sort((a, b) => a.eclipticLongitude - b.eclipticLongitude);
    const radius: Record<string, number> = {};
    sorted.forEach((body, idx) => {
      let cluster = 0;
      for (let i = idx - 1; i >= 0; i--) {
        const d = Math.abs(sorted[i].eclipticLongitude - body.eclipticLongitude);
        if (d < 7 || d > 353) cluster++;
        else break;
      }
      radius[body.id] = 118 - (cluster % 3) * 14;
    });
    return radius;
  }, [bodies]);

  return (
    <svg viewBox="0 0 440 440" className="w-full h-full max-w-[440px] select-none" role="img" aria-label={`${layout.mode} tropical chart wheel`}>
      <defs>
        <radialGradient id="chartPaper" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffdf9" />
          <stop offset="100%" stopColor="#ebe3d4" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="214" fill="url(#chartPaper)" stroke="#c9bfae" strokeWidth="1.2" />

      {ZODIAC_SIGNS.map((sign, index) => {
        const startLong = index * 30;
        const a0 = svgAngleForLongitude(startLong, asc);
        const a1 = svgAngleForLongitude(startLong + 30, asc);
        const mid = svgAngleForLongitude(startLong + 15, asc);
        const glyph = polar(cx, cy, 198, mid);
        return (
          <g key={sign.name}>
            <path d={wedgePath(cx, cy, 168, 210, a0, a1)} fill={ELEMENT_FILL[sign.element]} stroke="#c9bfae" strokeWidth="0.7" />
            <text x={glyph.x} y={glyph.y} textAnchor="middle" dominantBaseline="central" fill="#2c2419" fontSize="16" fontFamily="serif">
              {sign.symbol}
            </text>
          </g>
        );
      })}

      {Array.from({ length: 72 }, (_, i) => {
        const long = i * 5;
        const ang = svgAngleForLongitude(long, asc);
        const outer = polar(cx, cy, 168, ang);
        const inner = polar(cx, cy, i % 6 === 0 ? 158 : 163, ang);
        return <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#8a7b6a" strokeWidth={i % 6 === 0 ? 1 : 0.5} />;
      })}

      <circle cx={cx} cy={cy} r="168" fill="none" stroke="#c9bfae" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="102" fill="#faf6ef" stroke="#c9bfae" strokeWidth="1" />

      {layout.houses.map((house) => {
        const ang = svgAngleForLongitude(house.longitude, asc);
        const a = polar(cx, cy, 102, ang);
        const b = polar(cx, cy, 168, ang);
        const label = polar(cx, cy, 112, ang + 12);
        return (
          <g key={house.house}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#b8862e" strokeWidth={house.house % 3 === 1 ? 1.4 : 0.6} opacity="0.7" />
            <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="central" fill="#7a5a1a" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif">
              {house.house}
            </text>
          </g>
        );
      })}

      {tightAspects.map((asp, idx) => {
        const bodyA = bodies.find((b) => b.name === asp.bodyA);
        const bodyB = bodies.find((b) => b.name === asp.bodyB);
        if (!bodyA || !bodyB) return null;
        const pa = polar(cx, cy, 88, svgAngleForLongitude(bodyA.eclipticLongitude, asc));
        const pb = polar(cx, cy, 88, svgAngleForLongitude(bodyB.eclipticLongitude, asc));
        const stroke =
          asp.aspectType === 'Trine' || asp.aspectType === 'Sextile'
            ? '#4a7c8c'
            : asp.aspectType === 'Square' || asp.aspectType === 'Opposition'
              ? '#9a4454'
              : '#b8862e';
        return (
          <line
            key={idx}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke={stroke}
            strokeWidth={asp.orbDeg < 1.5 ? 1.6 : 0.8}
            strokeDasharray={asp.aspectType === 'Opposition' ? '4 3' : undefined}
            opacity="0.65"
          />
        );
      })}

      {bodies.map((body) => {
        const ang = svgAngleForLongitude(body.eclipticLongitude, asc);
        const p = polar(cx, cy, stacked[body.id] || 118, ang);
        const selected = body.id === selectedId;
        const color = planetColor(body.id);
        return (
          <g key={body.id} onClick={() => onSelect?.(body.id)} className="cursor-pointer">
            {selected && <circle cx={p.x} cy={p.y} r="14" fill="none" stroke={color} strokeDasharray="3 2" />}
            <circle cx={p.x} cy={p.y} r={selected ? 10 : 8} fill="#fffdf9" stroke={color} strokeWidth="1.5" />
            <text x={p.x} y={p.y + 0.5} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={selected ? 12 : 10} fontWeight="700">
              {body.symbol}
            </text>
          </g>
        );
      })}

      {layout.angles && (
        <>
          <text x="18" y="222" fill="#2c2419" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">
            ASC {layout.angles.ascendantDeg.toFixed(0)}°
          </text>
          <text x="300" y="28" fill="#2c2419" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">
            MC {layout.angles.midheavenDeg.toFixed(0)}°
          </text>
        </>
      )}
      <circle cx={cx} cy={cy} r="4" fill="#b8862e" />
    </svg>
  );
};
