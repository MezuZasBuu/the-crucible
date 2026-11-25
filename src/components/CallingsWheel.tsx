/**
 * The Twelve Callings compass — twelve roles around a shared centre,
 * three in each quarter. Bar length shows how strongly today points to each.
 */

import React from 'react';
import { CallingAffinity } from '../types';
import { CallingEmblem, QUARTER_COLOR } from './symbols/CultureSymbols';

const ORDER = [
  'messenger', 'trailblazer', 'stargazer', 'wayfarer', // wraps so each quarter is centred on its compass point
  'wellspring', 'listener', 'sentinel',
  'cultivator', 'memory_keeper', 'flamekeeper',
  'arbiter', 'host'
];
// Angles in SVG degrees (0 = east/right, 90 = south/down). Each quarter spans 90° centred on its point.
const ANGLE: Record<string, number> = {
  trailblazer: -30, stargazer: 0, wayfarer: 30,
  wellspring: 60, listener: 90, sentinel: 120,
  cultivator: 150, memory_keeper: 180, flamekeeper: 210,
  arbiter: 240, host: 270, messenger: 300
};
const QUARTERS: Array<{ name: 'East' | 'South' | 'West' | 'North'; phase: string; mid: number }> = [
  { name: 'East', phase: 'Dawn · begin', mid: 0 },
  { name: 'South', phase: 'Noon · act', mid: 90 },
  { name: 'West', phase: 'Dusk · gather', mid: 180 },
  { name: 'North', phase: 'Midnight · discern', mid: 270 }
];

const S = 560;
const C = S / 2;
const pt = (r: number, deg: number) => ({ x: C + r * Math.cos((deg * Math.PI) / 180), y: C + r * Math.sin((deg * Math.PI) / 180) });

function arc(rInner: number, rOuter: number, a0: number, a1: number) {
  const p0 = pt(rOuter, a0), p1 = pt(rOuter, a1), p2 = pt(rInner, a1), p3 = pt(rInner, a0);
  return `M ${p0.x} ${p0.y} A ${rOuter} ${rOuter} 0 0 1 ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${rInner} ${rInner} 0 0 0 ${p3.x} ${p3.y} Z`;
}

export const CallingsWheel: React.FC<{
  callings: CallingAffinity[];
  topId: string;
  selectedId: string;
  onSelect: (id: string) => void;
}> = ({ callings, topId, selectedId, onSelect }) => {
  const byId = Object.fromEntries(callings.map((c) => [c.id, c]));

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="callings-wheel" role="img" aria-label="Compass of the Twelve Callings">
      <defs>
        <radialGradient id="cal-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f6f1e6" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r="268" fill="url(#cal-core)" stroke="#1b1f3b" strokeWidth="1.2" />

      {/* Quarter bands */}
      {QUARTERS.map((q) => {
        const color = QUARTER_COLOR[q.name];
        const labelR = 252;
        const id = `cal-arc-${q.name}`;
        const flip = q.name === 'South';
        const a0 = q.mid - 40, a1 = q.mid + 40;
        const s = pt(labelR, flip ? a1 : a0), e = pt(labelR, flip ? a0 : a1);
        return (
          <g key={q.name}>
            <path d={arc(238, 266, q.mid - 44, q.mid + 44)} fill={color} opacity="0.13" />
            <path id={id} d={`M ${s.x} ${s.y} A ${labelR} ${labelR} 0 0 ${flip ? 0 : 1} ${e.x} ${e.y}`} fill="none" />
            <text fill={color} fontSize="12.5" fontWeight="700" letterSpacing="2.2" style={{ fontFamily: "'Inter Variable', Inter, sans-serif" }}>
              <textPath href={`#${id}`} startOffset="50%" textAnchor="middle" dominantBaseline="central">
                {q.name.toUpperCase()} · {q.phase.toUpperCase()}
              </textPath>
            </text>
          </g>
        );
      })}
      <circle cx={C} cy={C} r="238" fill="none" stroke="#b9b3a4" strokeWidth="0.9" />

      {/* Quarter dividers */}
      {[45, 135, 225, 315].map((a) => {
        const p0 = pt(64, a), p1 = pt(266, a);
        return <line key={a} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#b9b3a4" strokeWidth="0.9" strokeDasharray="2 5" />;
      })}

      {/* Score track rings */}
      {[110, 150].map((r) => (
        <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="#1b1f3b" strokeWidth="0.5" opacity="0.14" />
      ))}

      {/* Callings */}
      {ORDER.map((id) => {
        const c = byId[id];
        if (!c) return null;
        const a = ANGLE[id];
        const color = QUARTER_COLOR[c.quarter];
        const isTop = id === topId;
        const isSel = id === selectedId;
        const node = pt(196, a);
        const barStart = pt(70, a);
        const barEnd = pt(70 + (c.affinityScore / 100) * 92, a);
        const lab = pt(196, a);
        const first = c.calling.replace(/^The /, '');
        return (
          <g
            key={id}
            role="button"
            tabIndex={0}
            aria-label={`${c.calling}: ${c.affinityScore}% match today`}
            aria-pressed={isSel}
            onClick={() => onSelect(id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(id);
              }
            }}
          >
            <title>{`${c.calling} — ${c.archetypeRole}. ${c.affinityScore}% match today.`}</title>
            <line x1={barStart.x} y1={barStart.y} x2={barEnd.x} y2={barEnd.y} stroke={color} strokeWidth={isSel ? 9 : 7} strokeLinecap="round" opacity={isSel || isTop ? 0.95 : 0.4} />
            {isTop && <circle cx={node.x} cy={node.y} r="33" fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="3 4" />}
            <circle cx={node.x} cy={node.y} r="26" fill={isSel ? color : '#fffdf8'} stroke={color} strokeWidth={isSel ? 2 : 1.3} />
            <g transform={`translate(${node.x - 12} ${node.y - 12})`}>
              <CallingEmblem emblemId={c.emblemId} size={24} color={isSel ? '#fffdf8' : color} />
            </g>
            <text
              x={lab.x}
              y={lab.y + 40}
              textAnchor="middle"
              fill="#1b1f3b"
              fontSize="11.5"
              fontWeight={isSel || isTop ? 700 : 500}
              style={{ fontFamily: "'Inter Variable', Inter, sans-serif", paintOrder: 'stroke' }}
              stroke="#fbf8f1"
              strokeWidth="3.5"
            >
              {first}
            </text>
          </g>
        );
      })}

      {/* Centre */}
      <circle cx={C} cy={C} r="62" fill="#171a33" />
      <circle cx={C} cy={C} r="56" fill="none" stroke="#d9b56a" strokeWidth="0.8" opacity="0.6" />
      <path d={`M ${C} ${C - 44} l 7 37 l 37 7 l -37 7 l -7 37 l -7 -37 l -37 -7 l 37 -7 z`} fill="#d9b56a" opacity="0.9" />
      <circle cx={C} cy={C} r="5" fill="#171a33" />
    </svg>
  );
};
