/**
 * The Crucible — "Cycle wheels"
 * An animated picture of interlocking wheels, one per calendar cycle.
 * Click a wheel (or a name below) to read what the cycle is and today's value.
 */

import React, { useMemo, useState } from 'react';
import { CompleteCalculationContext } from '../types';
import { MayanGlyphIcon } from './symbols/CrucibleGlyphs';
import { SignGlyph } from './symbols/AstroGlyph';
import { CallingEmblem } from './symbols/CultureSymbols';

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
  | 'callings';

type ViewMode = 'ALL' | 'MESOAMERICAN' | 'MEDITERRANEAN' | 'SINITIC_CELESTIAL';

/** Palette: one ink colour per tradition. */
const COLOR: Record<GearSystemId, string> = {
  tzolkin: '#25706a',
  haab: '#25706a',
  longcount: '#25706a',
  dreamspell: '#6a4a9c',
  chinese: '#b8483a',
  egyptian: '#b0771a',
  greek: '#2c6494',
  ephemeris: '#a9812f',
  numerology: '#565b70',
  callings: '#2c7458'
};

const PLAIN_NAME: Record<GearSystemId, string> = {
  tzolkin: 'Maya 260-day count',
  haab: 'Maya 365-day year',
  longcount: 'Maya Long Count',
  dreamspell: 'Dreamspell',
  chinese: 'Chinese 60-year cycle',
  egyptian: 'Egyptian year',
  greek: 'Athenian months',
  ephemeris: 'Sun’s position',
  numerology: 'Day number',
  callings: 'Callings'
};

const GEAR_ORDER: GearSystemId[] = [
  'tzolkin',
  'haab',
  'longcount',
  'dreamspell',
  'chinese',
  'egyptian',
  'greek',
  'ephemeris',
  'numerology',
  'callings'
];

const INK = '#1b1f3b';
const INK_MUTED = '#5b6076';
const HUB_FILL = '#fffdf8';

/** Shrink a font size so `text` fits inside `width` SVG units. */
const fitFont = (text: string, base: number, width: number) =>
  Math.max(7, Math.min(base, width / (Math.max(1, text.length) * 0.56)));

export const GearsVisualizer: React.FC<GearsVisualizerProps> = ({
  ctx,
  isPlaying = true,
  onTogglePlay
}) => {
  const [selectedGear, setSelectedGear] = useState<GearSystemId>('tzolkin');
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('ALL');

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
  const callingsDeg = ((ctx.synthesis.topCalling.affinityScore % 12) / 12) * 360;

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
      callings: 50 / speedMultiplier
    };
  }, [speedMultiplier]);

  const sun = ctx.celestialBodies[0];
  const calling = ctx.synthesis.topCalling;

  /** Geometry and labels for each wheel. Positions, radii and tooth counts are unchanged. */
  const gears: Array<{
    id: GearSystemId;
    x: number;
    y: number;
    rInner: number;
    rOuter: number;
    teeth: number;
    ring: number;
    hub: number;
    deg: number;
    spin: 'spin-slow' | 'spin-reverse';
    groups: ViewMode[];
    spokes?: boolean;
    label: string;
    value: string;
    sub: string;
  }> = [
    {
      id: 'tzolkin', x: 350, y: 300, rInner: 115, rOuter: 130, teeth: 20, ring: 95, hub: 56,
      deg: tzolkinDeg, spin: 'spin-slow', groups: ['MESOAMERICAN'], spokes: true,
      label: 'Maya 260 days', value: ctx.mayan.tzolkin.formatted, sub: `Day ${ctx.mayan.kinNumber} of 260`
    },
    {
      id: 'haab', x: 580, y: 300, rInner: 115, rOuter: 130, teeth: 19, ring: 95, hub: 56,
      deg: haabDeg, spin: 'spin-reverse', groups: ['MESOAMERICAN'],
      label: 'Maya 365 days', value: ctx.mayan.haab.formatted, sub: `Month ${ctx.mayan.haab.monthIndex + 1} of 19`
    },
    {
      id: 'longcount', x: 160, y: 300, rInner: 75, rOuter: 90, teeth: 13, ring: 0, hub: 46,
      deg: longCountDeg, spin: 'spin-slow', groups: ['MESOAMERICAN'],
      label: 'Long Count',
      value: `${ctx.mayan.longCount.baktun}.${ctx.mayan.longCount.katun}.${ctx.mayan.longCount.tun}`,
      sub: 'Day tally'
    },
    {
      id: 'dreamspell', x: 240, y: 135, rInner: 68, rOuter: 80, teeth: 13, ring: 0, hub: 44,
      deg: dreamspellDeg, spin: 'spin-reverse', groups: ['MESOAMERICAN'],
      label: 'Dreamspell', value: `Day ${ctx.dreamspell.kin}`, sub: `Number ${ctx.dreamspell.galacticTone.number} of 13`
    },
    {
      id: 'chinese', x: 465, y: 110, rInner: 78, rOuter: 92, teeth: 12, ring: 0, hub: 46,
      deg: chineseDeg, spin: 'spin-slow', groups: ['SINITIC_CELESTIAL'],
      label: 'Chinese year',
      value: `${ctx.chinese.yearPillar.stemElement} ${ctx.chinese.yearPillar.zodiacAnimal}`,
      sub: `Year ${ctx.chinese.sexagenaryCycleYear} of 60`
    },
    {
      id: 'egyptian', x: 690, y: 135, rInner: 68, rOuter: 80, teeth: 12, ring: 0, hub: 44,
      deg: egyptianDeg, spin: 'spin-reverse', groups: ['MEDITERRANEAN'],
      label: 'Egyptian', value: ctx.egyptian.monthName, sub: `Day ${ctx.egyptian.dayOfMonth}`
    },
    {
      id: 'greek', x: 770, y: 300, rInner: 75, rOuter: 90, teeth: 19, ring: 0, hub: 46,
      deg: greekDeg, spin: 'spin-slow', groups: ['MEDITERRANEAN'],
      label: 'Athenian', value: ctx.greek.atticMonthName, sub: `Year ${ctx.greek.metonicCycleYear} of 19`
    },
    {
      id: 'ephemeris', x: 680, y: 465, rInner: 68, rOuter: 80, teeth: 12, ring: 0, hub: 44,
      deg: ephemerisDeg, spin: 'spin-slow', groups: ['SINITIC_CELESTIAL'],
      label: 'Sun', value: `${sun?.zodiacSign ?? ''} ${sun ? sun.signDegree.toFixed(0) : ''}°`, sub: 'Zodiac sign'
    },
    {
      id: 'numerology', x: 465, y: 480, rInner: 78, rOuter: 92, teeth: 9, ring: 0, hub: 46,
      deg: numDeg, spin: 'spin-reverse', groups: [],
      label: 'Number', value: `Day ${ctx.numerology.universalDay}`, sub: 'of 9'
    },
    {
      id: 'callings', x: 250, y: 465, rInner: 68, rOuter: 80, teeth: 12, ring: 0, hub: 44,
      deg: callingsDeg, spin: 'spin-slow', groups: [],
      label: 'Calling', value: calling.calling, sub: `${calling.quarter} quarter`
    }
  ];

  const selectedColor = COLOR[selectedGear];
  const pill = (active: boolean) => `explore-tab ${active ? 'explore-tab-active' : ''}`;

  return (
    <div className="instrument-panel relative w-full overflow-hidden text-[color:var(--text-secondary)]">
      {/* Header and controls */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[color:var(--line-soft)] pb-3 mb-3">
        <div className="min-w-0">
          <h3 className="panel-title">How the cycles turn together</h3>
          <p className="readable-body mt-1">
            Each wheel is one calendar cycle. They turn at different speeds and only line up again after many years.
          </p>
          <p className="readable-muted text-xs mt-1">
            Tap a wheel to read about it. The turning is for illustration; the numbers in the middle are today’s real
            values.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => onTogglePlay && onTogglePlay()} className="cta-ghost" aria-pressed={!isPlaying}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <div className="flex items-center gap-2">
            <span className="field-label">Speed</span>
            <div className="seg" role="group" aria-label="Speed">
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeedMultiplier(s)}
                  aria-pressed={speedMultiplier === s}
                  className={`seg-btn ${speedMultiplier === s ? 'seg-btn-active' : ''}`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Which wheels to highlight */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="field-label">Highlight</span>
        {(
          [
            { id: 'ALL', label: 'All wheels' },
            { id: 'MESOAMERICAN', label: 'Maya and Dreamspell' },
            { id: 'MEDITERRANEAN', label: 'Egypt and Greece' },
            { id: 'SINITIC_CELESTIAL', label: 'China and the sun' }
          ] as Array<{ id: ViewMode; label: string }>
        ).map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setViewMode(v.id)}
            aria-pressed={viewMode === v.id}
            className={pill(viewMode === v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Main SVG stage */}
      <div className="relative w-full aspect-[16/9] min-h-[380px] max-h-[600px] flex items-center justify-center bg-[color:var(--surface-well)] rounded-[var(--radius-md)] border border-[color:var(--line-soft)] overflow-hidden">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full select-none"
          role="img"
          aria-label="Ten interlocking wheels, one for each calendar cycle, each showing today’s value"
        >
          {/* Background guide lines */}
          <circle cx="500" cy="300" r="260" stroke={INK} strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 6" fill="none" />
          <circle cx="500" cy="300" r="180" stroke={INK} strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 4" fill="none" />
          <line x1="50" y1="300" x2="950" y2="300" stroke={INK} strokeOpacity="0.1" strokeWidth="0.75" strokeDasharray="2 8" />
          <line x1="500" y1="30" x2="500" y2="570" stroke={INK} strokeOpacity="0.1" strokeWidth="0.75" strokeDasharray="2 8" />

          {gears.map((g) => {
            const c = COLOR[g.id];
            const isSelected = selectedGear === g.id;
            const lit = viewMode === 'ALL' || g.groups.includes(viewMode);
            const big = g.hub > 50;
            const textWidth = g.hub * 2 - 12;
            const labelSize = fitFont(g.label, big ? 12 : 10.5, textWidth - 8);
            const valueSize = fitFont(g.value, big ? 16 : 13, textWidth);
            const subSize = fitFont(g.sub, big ? 11.5 : 10, textWidth - 10);
            return (
              <g
                key={g.id}
                transform={`translate(${g.x}, ${g.y})`}
                className="cursor-pointer transition-opacity"
                onClick={() => setSelectedGear(g.id)}
                opacity={lit ? 1 : 0.25}
                role="button"
                tabIndex={0}
                aria-label={`${PLAIN_NAME[g.id]}: ${g.value}, ${g.sub}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedGear(g.id);
                  }
                }}
              >
                <g
                  style={{
                    transform: `rotate(${g.deg}deg)`,
                    animation: isPlaying ? `${g.spin} ${animDurations[g.id]}s linear infinite` : 'none',
                    transformOrigin: '0 0'
                  }}
                >
                  <path
                    d={generateGearPath(0, 0, g.rInner, g.rOuter, g.teeth)}
                    fill={HUB_FILL}
                    stroke={c}
                    strokeWidth={isSelected ? 3 : 1.4}
                  />
                  <path
                    d={generateGearPath(0, 0, g.rInner, g.rOuter, g.teeth)}
                    fill={c}
                    fillOpacity={isSelected ? 0.2 : 0.1}
                    stroke="none"
                  />
                  {g.ring > 0 && (
                    <circle cx="0" cy="0" r={g.ring} stroke={c} strokeWidth="0.75" strokeDasharray="3 3" strokeOpacity="0.4" fill="none" />
                  )}
                  {g.spokes &&
                    [0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                      <line
                        key={a}
                        x1={Math.cos((a * Math.PI) / 180) * g.hub}
                        y1={Math.sin((a * Math.PI) / 180) * g.hub}
                        x2={Math.cos((a * Math.PI) / 180) * g.rInner}
                        y2={Math.sin((a * Math.PI) / 180) * g.rInner}
                        stroke={c}
                        strokeWidth="0.75"
                        strokeOpacity="0.3"
                      />
                    ))}
                </g>
                <circle cx="0" cy="0" r={g.hub} fill={HUB_FILL} stroke={c} strokeWidth={isSelected ? 2.2 : 1.2} />
                <text x="0" y={big ? -15 : -12} textAnchor="middle" fill={c} fontSize={labelSize} fontWeight="600">
                  {g.label}
                </text>
                <text x="0" y={big ? 5 : 4} textAnchor="middle" fill={INK} fontSize={valueSize} fontWeight="700">
                  {g.value}
                </text>
                <text x="0" y={big ? 22 : 18} textAnchor="middle" fill={INK_MUTED} fontSize={subSize}>
                  {g.sub}
                </text>
              </g>
            );
          })}

          {/* Central hub: today */}
          <g transform="translate(465, 300)">
            <circle cx="0" cy="0" r="22" fill={HUB_FILL} stroke={INK} strokeOpacity="0.35" strokeWidth="1" />
            <text x="0" y="4" textAnchor="middle" fill={INK} fontSize="11" fontWeight="600">
              Today
            </text>
          </g>
        </svg>
      </div>

      {/* Selected wheel */}
      <div className="mt-4">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="ui-eyebrow">Selected wheel</span>
          <span className="panel-title" style={{ color: selectedColor }}>
            {PLAIN_NAME[selectedGear]}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="Choose a wheel">
          {GEAR_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedGear(id)}
              aria-pressed={selectedGear === id}
              className={pill(selectedGear === id)}
            >
              {PLAIN_NAME[id]}
            </button>
          ))}
        </div>

        <div className="curious-box mt-3" style={{ borderLeft: `3px solid ${selectedColor}` }}>
          {selectedGear === 'tzolkin' && (
            <>
              <div className="trad-hero">
                <span className="trad-hero-symbol">
                  <MayanGlyphIcon name={ctx.mayan.tzolkin.signName} size={32} />
                </span>
                <div>
                  <p className="trad-hero-value">{ctx.mayan.tzolkin.formatted}</p>
                  <p className="trad-hero-sub">Day {ctx.mayan.kinNumber} of 260</p>
                </div>
              </div>
              <p className="readable-body mt-2">
                The Maya 260-day count pairs a number from 1 to 13 with one of 20 day names, so every pairing comes
                round once in 260 days. Today is {ctx.mayan.tzolkin.formatted}, day {ctx.mayan.kinNumber} of the count.
                The day name {ctx.mayan.tzolkin.signName} is traditionally linked with: {ctx.mayan.tzolkin.meaning}.
              </p>
              <dl className="trad-facts mt-2">
                <dt>Today’s number</dt>
                <dd>
                  {ctx.mayan.galacticTone.number} of 13 ({ctx.mayan.galacticTone.name})
                </dd>
                <dt>Direction linked to this day</dt>
                <dd>{ctx.mayan.tzolkin.direction}</dd>
                <dt>Element linked to this day</dt>
                <dd>{ctx.mayan.tzolkin.element}</dd>
              </dl>
            </>
          )}

          {selectedGear === 'haab' && (
            <>
              <p className="trad-hero-value">{ctx.mayan.haab.formatted}</p>
              <p className="trad-hero-sub">Month {ctx.mayan.haab.monthIndex + 1} of 19</p>
              <p className="readable-body mt-2">
                The Maya 365-day year follows the sun and the farming seasons. It has 18 months of 20 days, plus a
                short 5-day period at the end. Today is {ctx.mayan.haab.formatted}. This wheel and the 260-day count
                only show the same pair of dates again after 52 years (18,980 days).
              </p>
              <dl className="trad-facts mt-2">
                <dt>Both Maya counts together</dt>
                <dd>{ctx.mayan.calendarRound}</dd>
              </dl>
            </>
          )}

          {selectedGear === 'longcount' && (
            <>
              <p className="trad-hero-value">{ctx.mayan.longCount.formatted}</p>
              <p className="trad-hero-sub">{ctx.mayan.daysSinceEpoch.toLocaleString()} days counted</p>
              <p className="readable-body mt-2">
                The Long Count is a running tally of days from a starting date in 3114 BCE, written as five numbers
                that roll over like a car’s mileage counter. Today reads {ctx.mayan.longCount.formatted}, which is{' '}
                {ctx.mayan.daysSinceEpoch.toLocaleString()} days since that start. The first number changes only about
                once every 394 years, so this is the slowest Maya wheel.
              </p>
            </>
          )}

          {selectedGear === 'dreamspell' && (
            <>
              <p className="trad-hero-value">{ctx.dreamspell.signature}</p>
              <p className="trad-hero-sub">Day {ctx.dreamspell.kin} of 260</p>
              <p className="readable-body mt-2">
                Dreamspell is a modern calendar created by José Argüelles in 1987. It borrows the Maya idea of a
                260-day cycle but counts it differently, and it also divides the year into 13 months of 28 days. Today
                is day {ctx.dreamspell.kin} of 260, carrying number {ctx.dreamspell.galacticTone.number} of 13.
              </p>
              <dl className="trad-facts mt-2">
                <dt>28-day month</dt>
                <dd>
                  Month {ctx.dreamspell.thirteenMoon.moonNumber} of 13 ({ctx.dreamspell.thirteenMoon.moonName}), day{' '}
                  {ctx.dreamspell.thirteenMoon.dayOfMoon} of 28
                </dd>
              </dl>
            </>
          )}

          {selectedGear === 'chinese' && (
            <>
              <p className="trad-hero-value">
                {ctx.chinese.yearPillar.stemElement} {ctx.chinese.yearPillar.zodiacAnimal} year
              </p>
              <p className="trad-hero-sub">
                Year {ctx.chinese.sexagenaryCycleYear} of 60 · {ctx.chinese.yearPillar.stemPinYin}-
                {ctx.chinese.yearPillar.branchPinYin}
              </p>
              <p className="readable-body mt-2">
                The Chinese calendar names each year by pairing one of 10 “stems” (which carry the five elements) with
                one of 12 animals. The pairs repeat every 60 years. This is year {ctx.chinese.sexagenaryCycleYear} of
                the cycle: the year of the {ctx.chinese.yearPillar.stemElement} {ctx.chinese.yearPillar.zodiacAnimal}.
              </p>
              <dl className="trad-facts mt-2">
                <dt>Solar term (one of 24 seasonal markers)</dt>
                <dd>{ctx.chinese.solarTerm.name}</dd>
                <dt>Strongest element today</dt>
                <dd>{ctx.chinese.dominantElement}</dd>
              </dl>
            </>
          )}

          {selectedGear === 'egyptian' && (
            <>
              <p className="trad-hero-value">
                {ctx.egyptian.monthName}, day {ctx.egyptian.dayOfMonth}
              </p>
              <p className="trad-hero-sub">Season: {ctx.egyptian.season}</p>
              <p className="readable-body mt-2">
                The ancient Egyptian year had exactly 365 days and no leap day, so it slipped one day against the
                seasons every four years. It took about 1,460 years for the calendar to come back in line with the
                yearly return of the star Sirius. Today is day {ctx.egyptian.dayOfMonth} of the month{' '}
                {ctx.egyptian.monthName}, in year {ctx.egyptian.sothicYearInCycle.toLocaleString()} of that 1,460-year
                cycle.
              </p>
              <dl className="trad-facts mt-2">
                <dt>Egyptian year number</dt>
                <dd>{ctx.egyptian.civilYear}</dd>
              </dl>
            </>
          )}

          {selectedGear === 'greek' && (
            <>
              <p className="trad-hero-value">
                {ctx.greek.atticMonthName}, day {ctx.greek.atticDay}
              </p>
              <p className="trad-hero-sub">Year {ctx.greek.metonicCycleYear} of 19</p>
              <p className="readable-body mt-2">
                Ancient Athens used months that began with each new moon. Twelve such months fall short of a full
                year, so an extra month was added in 7 years out of every 19; after 19 years the moon’s phases land on
                the same dates again. Today is day {ctx.greek.atticDay} of {ctx.greek.atticMonthName}, in year{' '}
                {ctx.greek.metonicCycleYear} of the 19-year cycle.
              </p>
              <dl className="trad-facts mt-2">
                <dt>Olympiad (the four years between Olympic Games)</dt>
                <dd>
                  Number {ctx.greek.olympiadNumber}, year {ctx.greek.olympiadYear} of 4
                </dd>
              </dl>
            </>
          )}

          {selectedGear === 'ephemeris' && (
            <>
              <div className="trad-hero">
                <span className="trad-hero-symbol">
                  <SignGlyph sign={sun?.zodiacSign ?? ''} size={30} tinted />
                </span>
                <div>
                  <p className="trad-hero-value">
                    Sun in {sun?.zodiacSign} at {sun?.signDegree.toFixed(1)}°
                  </p>
                  <p className="trad-hero-sub">Each sign spans 30°</p>
                </div>
              </div>
              <p className="readable-body mt-2">
                Seen from Earth, the sun appears to move once around the sky each year, passing through the twelve
                zodiac signs in turn. One full turn of this wheel is one year. Today the sun is{' '}
                {sun?.signDegree.toFixed(1)}° into {sun?.zodiacSign}.
              </p>
              <dl className="trad-facts mt-2">
                <dt>Sun, moon and planets tracked</dt>
                <dd>{ctx.celestialBodies.length}</dd>
              </dl>
            </>
          )}

          {selectedGear === 'numerology' && (
            <>
              <p className="trad-hero-value">Day number {ctx.numerology.universalDay}</p>
              <p className="trad-hero-sub">One of nine, repeating</p>
              <p className="readable-body mt-2">
                Numerology adds up the digits of a date until a single digit from 1 to 9 is left. The result steps
                through a nine-day cycle. Today’s day number is {ctx.numerology.universalDay}.
              </p>
              <dl className="trad-facts mt-2">
                <dt>Life path number (from the full date)</dt>
                <dd>
                  {ctx.numerology.lifePathNumber}
                  {ctx.numerology.lifePathIsMaster ? ' (a “master number”: 11, 22 and 33 are kept as they are)' : ''}
                </dd>
                <dt>Name number (older Chaldean method)</dt>
                <dd>{ctx.numerology.chaldeanVibration}</dd>
              </dl>
            </>
          )}

          {selectedGear === 'callings' && (
            <>
              <div className="trad-hero">
                <span className="trad-hero-symbol">
                  <CallingEmblem emblemId={calling.emblemId} size={30} color={selectedColor} />
                </span>
                <div>
                  <p className="trad-hero-value">{calling.calling}</p>
                  <p className="trad-hero-sub">“{calling.motto}”</p>
                </div>
              </div>
              <p className="readable-body mt-2">
                The Twelve Callings are twelve roles arranged in a circle, three in each quarter: east for beginning,
                south for acting, west for gathering and north for resting. This wheel points to the calling that
                today’s cycles suggest most strongly. Today that is {calling.calling}, in the {calling.quarter}{' '}
                quarter. Treat it as a lens to try on, not a label.
              </p>
              <dl className="trad-facts mt-2">
                <dt>Quarter</dt>
                <dd>{calling.quarter}</dd>
                <dt>Gemstone</dt>
                <dd>{calling.gemstone}</dd>
              </dl>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
