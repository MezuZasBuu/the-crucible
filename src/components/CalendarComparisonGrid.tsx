/**
 * The Crucible — Multi-Tradition Calendar Comparison Grid
 * Comparative Chronological Ledger across Mayan, Dreamspell, Chinese BaZi,
 * Egyptian Sothic, Ethiopian Ge'ez, Attic Metonic, and Pythagorean systems.
 * Luminous comparative surfaces with restrained, novel-like literary prose.
 */

import React, { useState } from 'react';
import { CompleteCalculationContext } from '../types';
import { ChineseZodiacIcon, MayanGlyphIcon, WuXingElementIcon } from './symbols/CrucibleGlyphs';
import { SystemCrossNoteCard } from './SystemCrossNoteCard';
import { VedicPanel } from './VedicPanel';

interface CalendarComparisonGridProps {
  ctx: CompleteCalculationContext;
}

export const CalendarComparisonGrid: React.FC<CalendarComparisonGridProps> = ({ ctx }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'MAYA' | 'DREAMSPELL' | 'CHINESE' | 'HISTORICAL' | 'ENOCHIAN' | 'VEDIC' | 'EPHEMERIS'>('ALL');
  const note = (id: string) => ctx.intertwining.systemNotes.find((n) => n.systemId === id);

  return (
    <div className="space-y-4 motion-enter">
      {/* High Density Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-[color:var(--surface-glass)] p-1 overflow-x-auto backdrop-blur-md">
          {(['ALL', 'MAYA', 'DREAMSPELL', 'CHINESE', 'HISTORICAL', 'ENOCHIAN', 'VEDIC', 'EPHEMERIS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`nav-tab whitespace-nowrap ${
                activeTab === tab ? 'nav-tab-active' : ''
              }`}
            >
              {tab === 'ALL' && 'All Traditions'}
              {tab === 'MAYA' && 'Classical Maya'}
              {tab === 'DREAMSPELL' && 'Dreamspell 13:20'}
              {tab === 'CHINESE' && 'Chinese BaZi'}
              {tab === 'HISTORICAL' && 'Sothic & Attic'}
              {tab === 'ENOCHIAN' && 'Enochian / Biblical'}
              {tab === 'VEDIC' && 'Vedic Jyotish'}
              {tab === 'EPHEMERIS' && 'Ephemeris Ledgers'}
            </button>
          ))}
        </div>

        <div className="data-readout text-right">
          Synchronic interlock · JD {ctx.temporal.julianDayUT.toFixed(4)}
        </div>
      </div>

      {/* Grid of Micro Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* PANEL 1: CLASSICAL MAYAN TRADITION */}
        {(activeTab === 'ALL' || activeTab === 'MAYA') && (
          <div className="instrument-panel instrument-panel-maya !p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-1.5 mb-2.5">
                <h4 className="ui-eyebrow text-cyan-300">
                  Classical Maya Chronology
                </h4>
                <span className="data-readout">
                  GMT 584283
                </span>
              </div>

              <div className="space-y-3 text-sm">
                {/* Long Count */}
                <div className="rounded-[var(--radius-md)] border border-cyan-300/15 bg-cyan-300/[0.035] p-3">
                  <p className="ui-eyebrow text-cyan-300">The Great Baktun Loom</p>
                  <p className="data-readout text-base text-[color:var(--text-primary)] py-1">
                    {ctx.mayan.longCount.formatted}
                  </p>
                  <p className="font-garamond text-[15px] text-[color:var(--text-secondary)] italic mt-1 leading-snug">
                    An unbroken river of {ctx.mayan.daysSinceEpoch.toLocaleString()} dawns since the primordial creation epoch in 3114 BCE.
                  </p>
                </div>

                {/* Tzolkin & Haab */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-[var(--radius-md)] border border-cyan-300/15 bg-cyan-300/[0.025] p-3">
                    <div className="flex items-center gap-1.5">
                      <MayanGlyphIcon name={ctx.mayan.tzolkin.signName} size={24} />
                      <div>
                        <p className="ui-eyebrow text-cyan-300">Tzolk'in Loom</p>
                        <p className="font-garamond text-[15px] italic text-[color:var(--text-primary)]">{ctx.mayan.tzolkin.formatted}</p>
                      </div>
                    </div>
                    <p className="text-[9px] text-[color:var(--text-muted)] mt-1">
                      {ctx.mayan.tzolkin.direction} • {ctx.mayan.tzolkin.element}
                    </p>
                  </div>

                  <div className="rounded-[var(--radius-md)] border border-amber-300/15 bg-amber-300/[0.025] p-3">
                    <p className="ui-eyebrow text-[color:var(--solar)]">Haab' Solar</p>
                    <p className="font-garamond text-[15px] italic text-[color:var(--text-primary)]">{ctx.mayan.haab.formatted}</p>
                    <p className="text-[9px] text-[color:var(--text-muted)] mt-1">
                      Month {ctx.mayan.haab.monthIndex + 1} ({ctx.mayan.haab.meaning})
                    </p>
                  </div>
                </div>

                {/* Calendar Round */}
                <div className="p-3 bg-white/[0.02] border border-[color:var(--line-soft)] flex items-center justify-between text-xs rounded-[var(--radius-md)]">
                  <span className="ui-eyebrow">Calendar Round</span>
                  <span className="font-cinzel text-amber-200 font-bold">{ctx.mayan.calendarRound}</span>
                </div>

                <div className="p-3 bg-white/[0.02] border border-[color:var(--line-soft)] flex items-center justify-between text-xs rounded-[var(--radius-md)]">
                  <span className="ui-eyebrow">Galactic Gateway</span>
                  <span className={`font-bold uppercase ${ctx.mayan.isGalacticPortalDay ? 'text-cyan-400' : 'text-[color:var(--text-muted)]'}`}>
                    {ctx.mayan.isGalacticPortalDay ? 'ACTIVE (GAP PORTAL)' : 'Standard Kin'}
                  </span>
                </div>
                {note('mayan') && <SystemCrossNoteCard note={note('mayan')!} accentClass="border-cyan-800 text-cyan-400" />}
              </div>
            </div>
          </div>
        )}

        {/* PANEL 2: DREAMSPELL 13:20 SYNCHRONOMETER */}
        {(activeTab === 'ALL' || activeTab === 'DREAMSPELL') && (
          <div className="instrument-panel instrument-panel-maya !p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-1.5 mb-2.5">
                <h4 className="ui-eyebrow text-emerald-300">
                  Dreamspell 13:20 Synchronometer
                </h4>
                <span className="text-[10px] text-emerald-500">
                  Argüelles Harmonic
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="rounded-[var(--radius-md)] border border-emerald-300/15 bg-emerald-300/[0.035] p-3">
                  <p className="ui-eyebrow text-emerald-300">Galactic Signature</p>
                  <p className="text-base font-cinzel text-[color:var(--text-primary)] py-1">
                    {ctx.dreamspell.signature}
                  </p>
                  <p className="font-garamond text-[15px] text-[color:var(--text-secondary)] italic mt-1 leading-snug">
                    Kin {ctx.dreamspell.kin}: Seal #{ctx.dreamspell.solarSeal.number} ({ctx.dreamspell.solarSeal.name}) with Tone {ctx.dreamspell.galacticTone.number} ({ctx.dreamspell.galacticTone.name}).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-[var(--radius-md)] border border-cyan-300/15 bg-cyan-300/[0.025] p-3">
                    <p className="ui-eyebrow text-cyan-300">13-Moon Orbit</p>
                    <p className="text-[11px] font-medium text-[color:var(--text-primary)]">{ctx.dreamspell.thirteenMoon.moonName}</p>
                    <p className="text-[9px] text-[color:var(--text-muted)]">Day {ctx.dreamspell.thirteenMoon.dayOfMoon} of 28</p>
                  </div>
                  <div className="rounded-[var(--radius-md)] border border-amber-300/15 bg-amber-300/[0.025] p-3">
                    <p className="ui-eyebrow text-[color:var(--solar)]">Radial Plasma</p>
                    <p className="text-[11px] font-medium text-[color:var(--text-primary)]">{ctx.dreamspell.thirteenMoon.radialPlasma.name}</p>
                    <p className="text-[9px] text-[color:var(--text-muted)]">{ctx.dreamspell.thirteenMoon.radialPlasma.chakra} Chakra</p>
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-[color:var(--line-soft)] flex items-center justify-between text-xs rounded-[var(--radius-md)]">
                  <span className="ui-eyebrow">Time Castle</span>
                  <span className="font-cinzel text-emerald-300 font-bold">{ctx.dreamspell.castle.name}</span>
                </div>

                <div className="p-3 bg-white/[0.02] border border-[color:var(--line-soft)] flex items-center justify-between text-xs rounded-[var(--radius-md)]">
                  <span className="ui-eyebrow">Earth Family</span>
                  <span className="text-amber-300 font-medium">{ctx.dreamspell.earthFamily.name} ({ctx.dreamspell.earthFamily.chakras})</span>
                </div>
                {note('dreamspell') && <SystemCrossNoteCard note={note('dreamspell')!} accentClass="border-emerald-800 text-emerald-400" />}
              </div>
            </div>
          </div>
        )}

        {/* PANEL 3: CHINESE SEXAGENARY (BAZI) */}
        {(activeTab === 'ALL' || activeTab === 'CHINESE') && (
          <div className="instrument-panel instrument-panel-maya !p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-1.5 mb-2.5">
                <h4 className="ui-eyebrow text-emerald-300">
                  Chinese BaZi & Gan-Zhi
                </h4>
                <span className="text-[10px] text-emerald-500">
                  60-Pillar Computus
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="rounded-[var(--radius-md)] border border-emerald-300/15 bg-emerald-300/[0.035] p-3 flex items-center justify-between">
                  <div>
                    <p className="ui-eyebrow text-emerald-300">Year Pillar (Sui)</p>
                    <p className="font-garamond text-[15px] italic text-[color:var(--text-primary)] py-1">
                      {ctx.chinese.yearPillar.stemPinYin}-{ctx.chinese.yearPillar.branchPinYin} ({ctx.chinese.yearPillar.stem}{ctx.chinese.yearPillar.branch})
                    </p>
                    <p className="text-[9px] text-[color:var(--text-muted)]">
                      {ctx.chinese.yearPillar.stemPolarity} {ctx.chinese.yearPillar.stemElement} {ctx.chinese.yearPillar.zodiacAnimal}
                    </p>
                  </div>
                  <ChineseZodiacIcon name={ctx.chinese.yearPillar.zodiacAnimal} size={32} />
                </div>

                {/* 4 Pillars Table */}
                <div className="grid grid-cols-4 gap-1.5 text-center data-readout">
                  <div className="p-2 bg-white/[0.025] border border-[color:var(--line-soft)] rounded-[var(--radius-sm)]">
                    <p className="text-[10px] text-[color:var(--text-muted)] uppercase">YEAR</p>
                    <p className="font-bold text-[color:var(--text-primary)] text-[10px] mt-0.5">{ctx.chinese.yearPillar.stemPinYin}</p>
                    <p className="text-[8px] text-[color:var(--text-muted)]">{ctx.chinese.yearPillar.branchPinYin}</p>
                  </div>
                  <div className="p-2 bg-white/[0.025] border border-[color:var(--line-soft)] rounded-[var(--radius-sm)]">
                    <p className="text-[10px] text-[color:var(--text-muted)] uppercase">MONTH</p>
                    <p className="font-bold text-[color:var(--text-primary)] text-[10px] mt-0.5">{ctx.chinese.monthPillar.stemPinYin}</p>
                    <p className="text-[8px] text-[color:var(--text-muted)]">{ctx.chinese.monthPillar.branchPinYin}</p>
                  </div>
                  <div className="p-2 bg-white/[0.025] border border-[color:var(--line-soft)] rounded-[var(--radius-sm)]">
                    <p className="text-[10px] text-[color:var(--text-muted)] uppercase">DAY</p>
                    <p className="font-bold text-[color:var(--text-primary)] text-[10px] mt-0.5">{ctx.chinese.dayPillar.stemPinYin}</p>
                    <p className="text-[8px] text-[color:var(--text-muted)]">{ctx.chinese.dayPillar.branchPinYin}</p>
                  </div>
                  <div className="p-2 bg-white/[0.025] border border-[color:var(--line-soft)] rounded-[var(--radius-sm)]">
                    <p className="text-[10px] text-[color:var(--text-muted)] uppercase">HOUR</p>
                    <p className="font-bold text-[color:var(--text-primary)] text-[10px] mt-0.5">{ctx.chinese.hourPillar.stemPinYin}</p>
                    <p className="text-[8px] text-[color:var(--text-muted)]">{ctx.chinese.hourPillar.branchPinYin}</p>
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-[color:var(--line-soft)] flex items-center justify-between text-xs rounded-[var(--radius-md)]">
                  <span className="ui-eyebrow">Solar Term</span>
                  <span className="font-medium text-green-300">
                    {ctx.chinese.solarTerm.name} ({ctx.chinese.solarTerm.chineseName})
                  </span>
                </div>

                <div className="p-3 bg-white/[0.02] border border-[color:var(--line-soft)] flex items-center justify-between text-xs rounded-[var(--radius-md)]">
                  <span className="ui-eyebrow">Wu Xing Harmony</span>
                  <span className="font-medium text-emerald-400">{ctx.chinese.dominantElement} Element</span>
                </div>
                {note('chinese') && <SystemCrossNoteCard note={note('chinese')!} accentClass="border-green-800 text-green-400" />}
              </div>
            </div>
          </div>
        )}

        {/* PANEL 4: MEDITERRANEAN & HELLENIC */}
        {(activeTab === 'ALL' || activeTab === 'HISTORICAL') && (
          <div className="instrument-panel instrument-panel-solar !p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-1.5 mb-2.5">
                <h4 className="ui-eyebrow text-[color:var(--solar)]">
                  Sothic & Attic Traditions
                </h4>
                <span className="text-[10px] text-amber-500">
                  Nile & Athens
                </span>
              </div>

              <div className="space-y-3 text-sm">
                {/* Egyptian */}
                <div className="rounded-[var(--radius-md)] border border-amber-300/15 bg-amber-300/[0.035] p-3">
                  <p className="ui-eyebrow text-[color:var(--solar)]">Ancient Egyptian Sothic Civil</p>
                  <p className="font-garamond text-[15px] italic text-[color:var(--text-primary)] py-1">
                    Year {ctx.egyptian.civilYear}, {ctx.egyptian.monthName} (Day {ctx.egyptian.dayOfMonth})
                  </p>
                  <p className="text-[9px] text-[color:var(--text-muted)]">
                    Season: {ctx.egyptian.season} • Sothic Year {ctx.egyptian.sothicYearInCycle}/1460
                  </p>
                </div>

                {/* Greek */}
                <div className="rounded-[var(--radius-md)] border border-cyan-300/15 bg-cyan-300/[0.025] p-3">
                  <p className="ui-eyebrow text-cyan-300">Attic Lunisolar Metonic</p>
                  <p className="font-garamond text-[15px] italic text-[color:var(--text-primary)] py-1">
                    Month of {ctx.greek.atticMonthName}, Day {ctx.greek.atticDay}
                  </p>
                  <p className="text-[9px] text-[color:var(--text-muted)]">
                    Metonic Year {ctx.greek.metonicCycleYear} of 19 • Olympiad {ctx.greek.olympiadNumber}
                  </p>
                </div>

                {/* Ethiopian */}
                <div className="p-3 bg-white/[0.02] border border-[color:var(--line-soft)] flex items-center justify-between text-xs rounded-[var(--radius-md)]">
                  <span className="ui-eyebrow">Ethiopian Ge'ez</span>
                  <span className="font-medium text-cyan-300">{ctx.ethiopian.monthName} {ctx.ethiopian.dayOfMonth}, {ctx.ethiopian.year} A.M.</span>
                </div>
                {note('egyptian') && <SystemCrossNoteCard note={note('egyptian')!} accentClass="border-amber-800 text-amber-400" />}
                {note('greek') && <SystemCrossNoteCard note={note('greek')!} accentClass="border-indigo-800 text-indigo-400" />}
              </div>
            </div>
          </div>
        )}

        {/* PANEL 5: PYTHAGOREAN DECAD */}
        {(activeTab === 'ALL' || activeTab === 'HISTORICAL') && (
          <div className="instrument-panel instrument-panel-solar !p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-1.5 mb-2.5">
                <h4 className="ui-eyebrow text-[color:var(--solar)]">
                  Pythagorean & Chaldean Decad
                </h4>
                <span className="text-[10px] text-amber-500">
                  Vibrational Roots
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="rounded-[var(--radius-md)] border border-amber-300/15 bg-amber-300/[0.035] p-3">
                  <p className="ui-eyebrow text-[color:var(--solar)]">Life Path Vibration</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-garamond italic text-xl font-semibold text-[color:var(--solar-bright)]">
                      Life Path {ctx.numerology.lifePathNumber}
                    </span>
                    {ctx.numerology.lifePathIsMaster && (
                      <span className="px-2 py-1 rounded-full border border-amber-300/20 bg-amber-300/[0.05] text-amber-200 text-[8px] uppercase font-bold">
                        MASTER
                      </span>
                    )}
                  </div>
                  <p className="font-garamond text-[14px] text-[color:var(--text-secondary)] mt-1 leading-snug">
                    {ctx.numerology.numberMeanings[ctx.numerology.lifePathNumber]}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center data-readout">
                  <div className="p-2 bg-white/[0.025] border border-[color:var(--line-soft)] rounded-[var(--radius-sm)]">
                    <p className="text-[10px] text-[color:var(--text-muted)] uppercase">YEAR</p>
                    <p className="font-bold text-[color:var(--text-primary)] text-[10px] mt-0.5">{ctx.numerology.universalYear}</p>
                  </div>
                  <div className="p-2 bg-white/[0.025] border border-[color:var(--line-soft)] rounded-[var(--radius-sm)]">
                    <p className="text-[10px] text-[color:var(--text-muted)] uppercase">MONTH</p>
                    <p className="font-bold text-[color:var(--text-primary)] text-[10px] mt-0.5">{ctx.numerology.universalMonth}</p>
                  </div>
                  <div className="p-2 bg-white/[0.025] border border-[color:var(--line-soft)] rounded-[var(--radius-sm)]">
                    <p className="text-[10px] text-[color:var(--text-muted)] uppercase">DAY</p>
                    <p className="font-bold text-cyan-300 text-[10px] mt-0.5">{ctx.numerology.universalDay}</p>
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-[color:var(--line-soft)] flex items-center justify-between text-xs rounded-[var(--radius-md)]">
                  <span className="ui-eyebrow">Chaldean Sound Root</span>
                  <span className="data-readout text-[color:var(--solar-bright)]">{ctx.numerology.chaldeanVibration}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: ENOCHIAN / BIBLICAL / ROMAN */}
        {(activeTab === 'ALL' || activeTab === 'ENOCHIAN') && (
          <div className="instrument-panel instrument-panel-solar !p-4 flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-1.5 mb-2.5">
                <h4 className="ui-eyebrow text-[color:var(--solar)]">
                  Enochian · Biblical · Roman Dies
                </h4>
                <span className="text-[10px] text-amber-500">
                  364-Day / Tekufot
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="rounded-[var(--radius-md)] border border-amber-300/15 bg-amber-300/[0.035] p-3">
                  <p className="ui-eyebrow text-[color:var(--solar)]">Enochian Date</p>
                  <p className="font-garamond text-[15px] italic text-[color:var(--text-primary)] mt-1">
                    {ctx.enochianBiblical.enochian.formatted}
                  </p>
                  <p className="text-[9px] text-[color:var(--text-muted)] mt-1">
                    {ctx.enochianBiblical.enochian.watchGate} · {ctx.enochianBiblical.enochian.seasonName}
                  </p>
                </div>

                <div className="rounded-[var(--radius-md)] border border-emerald-300/15 bg-emerald-300/[0.025] p-3">
                  <p className="ui-eyebrow text-emerald-300">Biblical Tekufah</p>
                  <p className="text-[11px] text-[color:var(--text-primary)]">{ctx.enochianBiblical.biblicalSeason.hebrewTekufah}</p>
                  <p className="text-[9px] text-[color:var(--text-muted)] mt-1">
                    Verses: {ctx.enochianBiblical.biblicalTransits.seasonVerseAnchors.join(' · ')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-[var(--radius-md)] border border-amber-300/15 bg-amber-300/[0.025] p-3">
                    <p className="ui-eyebrow text-amber-300">Gregorian Dies</p>
                    <p className="text-[10px] text-[color:var(--text-primary)]">{ctx.enochianBiblical.gregorianWeekdayDeity.latinDies}</p>
                    <p className="text-[9px] text-[color:var(--text-muted)]">{ctx.enochianBiblical.gregorianWeekdayDeity.romanDeity}</p>
                  </div>
                  <div className="rounded-[var(--radius-md)] border border-cyan-300/15 bg-cyan-300/[0.025] p-3">
                    <p className="ui-eyebrow text-cyan-300">Hour Now</p>
                    <p className="text-[10px] text-[color:var(--text-primary)]">{ctx.enochianBiblical.currentPlanetaryHour.planet}</p>
                    <p className="text-[9px] text-[color:var(--text-muted)]">{ctx.enochianBiblical.currentPlanetaryHour.formattedWindow}</p>
                  </div>
                </div>

                <div className="data-readout p-3 bg-white/[0.02] border border-[color:var(--line-soft)] rounded-[var(--radius-md)]">
                  Flip: Civil N→{ctx.enochianBiblical.compassOrientation.directionRemap.North} · E→{ctx.enochianBiblical.compassOrientation.directionRemap.East}
                </div>
                {note('enochian_biblical') && (
                  <SystemCrossNoteCard note={note('enochian_biblical')!} accentClass="border-amber-800 text-amber-400" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* PANEL: VEDIC */}
        {(activeTab === 'ALL' || activeTab === 'VEDIC') && (
          <div className="md:col-span-2 lg:col-span-3">
            <VedicPanel ctx={ctx} />
          </div>
        )}

        {/* PANEL 6: CELESTIAL EPHEMERIS SUMMARY */}
        {(activeTab === 'ALL' || activeTab === 'EPHEMERIS') && (
          <div className="instrument-panel !p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-1.5 mb-2.5">
                <h4 className="ui-eyebrow text-[color:var(--temporal-deep)]">
                  Celestial Coordinates Summary
                </h4>
                <span className="data-readout">
                  Mean-motion model
                </span>
              </div>

              <div className="space-y-2 text-sm">
                {ctx.celestialBodies.slice(0, 5).map((b) => (
                  <div
                    key={b.id}
                    className="p-3 bg-white/[0.02] border border-[color:var(--line-soft)] rounded-[var(--radius-md)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[color:var(--text-primary)]">
                      <span className="text-cyan-400 text-sm font-sans">{b.symbol}</span>
                      <span>{b.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="data-readout text-[color:var(--solar-bright)]">{b.zodiacSign} {b.signDegree.toFixed(1)}°</span>
                      <span className={`text-[8px] uppercase ${b.isRetrograde ? 'text-red-400' : 'text-emerald-400'}`}>
                        {b.isRetrograde ? '℞' : 'Dir'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
