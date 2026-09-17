/**
 * The Crucible — Report & Export Modal
 * High Density Theme: #0a0a0a surfaces, #222 borders, sharp corners,
 * e-book typography, and one-click PDF / CSV / JSON export pipelines.
 */

import React from 'react';
import { downloadFile, generateCSVReport, openPrintDialog } from '../engine/export';
import { DOSSIER_TIER_META, downloadDossierHTML, openDossierPrintWindow } from '../engine/dossierExport';
import { getClaimsJSONL } from '../engine/knowledgeBase';
import { CompleteCalculationContext, DossierTier } from '../types';

interface ReportExportModalProps {
  ctx: CompleteCalculationContext;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ ctx, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const csv = generateCSVReport(ctx);
    downloadFile(`Crucible_Report_${ctx.input.dateString}.csv`, csv, 'text/csv');
  };

  const handleDownloadJSON = () => {
    const json = JSON.stringify(ctx, null, 2);
    downloadFile(`Crucible_Context_${ctx.input.dateString}.json`, json, 'application/json');
  };

  const handleDownloadJSONL = () => {
    const jsonl = getClaimsJSONL();
    downloadFile(`Crucible_Claims_KnowledgeBase.jsonl`, jsonl, 'application/x-ndjson');
  };

  const openTier = (tier: DossierTier) => {
    openDossierPrintWindow(ctx, tier, {
      querentName: ctx.input.querentName,
      birthDate: ctx.input.dateString,
      birthTime: ctx.input.timeString
    });
  };

  const downloadTier = (tier: DossierTier) => {
    downloadDossierHTML(ctx, tier, {
      querentName: ctx.input.querentName,
      birthDate: ctx.input.dateString,
      birthTime: ctx.input.timeString
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-sm border border-[#222] bg-[#0a0a0a] shadow-2xl overflow-hidden font-mono">
        <div className="flex items-center justify-between border-b border-[#222] p-3 bg-[#070707] no-print">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rotate-45 border border-cyan-400 bg-cyan-950/80" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-cinzel">
                Master Report & Personal Systems Dossier
              </h3>
              <p className="text-[9px] text-gray-500 uppercase">
                Mathematical Hash: {ctx.rulesetHash}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={openPrintDialog}
              className="px-2.5 py-1 rounded-sm bg-[#161616] hover:bg-[#222] border border-cyan-800 text-cyan-400 text-[10px] uppercase font-bold transition-colors shadow-sm"
            >
              Print Shell
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-2 py-1 rounded-sm bg-[#111] hover:bg-[#1a1a1a] text-gray-300 border border-[#222] text-[10px] uppercase transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-2 py-1 rounded-sm bg-[#111] hover:bg-[#1a1a1a] text-gray-300 border border-[#222] text-[10px] uppercase transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={handleDownloadJSONL}
              className="px-2 py-1 rounded-sm bg-[#111] hover:bg-[#1a1a1a] text-cyan-500 border border-[#222] text-[10px] uppercase transition-colors"
            >
              JSONL Claims
            </button>
            <button
              onClick={onClose}
              className="px-2 py-0.5 text-gray-400 hover:text-white rounded-sm bg-[#111] border border-[#222] text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Commercial dossier tiers */}
        <div className="no-print border-b border-[#222] bg-[#080808] p-3 grid grid-cols-1 md:grid-cols-3 gap-2">
          {(['FREE_PREVIEW', 'FULL_READING', 'DEEP_REPORT'] as DossierTier[]).map((tier) => {
            const m = DOSSIER_TIER_META[tier];
            const accent =
              tier === 'FREE_PREVIEW'
                ? 'border-[#333] text-gray-300'
                : tier === 'FULL_READING'
                  ? 'border-amber-700 text-amber-300'
                  : 'border-cyan-700 text-cyan-300';
            return (
              <div key={tier} className={`border ${accent} bg-[#0d0d0d] p-2.5 rounded-sm space-y-2`}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold font-cinzel tracking-wider">{m.label}</span>
                  <span className="text-[10px] font-mono">{m.priceHint}</span>
                </div>
                <p className="text-[9px] text-gray-500 font-serif italic leading-snug">{m.blurb}</p>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => openTier(tier)}
                    className="flex-1 px-2 py-1 text-[9px] uppercase font-bold border border-current/40 hover:bg-white/5"
                  >
                    Open · Print PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadTier(tier)}
                    className="px-2 py-1 text-[9px] uppercase font-bold border border-[#333] text-gray-400 hover:text-white"
                  >
                    HTML
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0d0d0d] text-gray-200 printable-report space-y-6 font-serif leading-relaxed">
          {/* Cover Header */}
          <div className="border-b border-[#333] pb-5 text-center">
            <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
              The Universal Synchronic Matrix
            </div>
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-white mt-1 tracking-wider">
              THE CRUCIBLE DOSSIER
            </h1>
            <p className="text-xs italic text-gray-400 mt-1">
              Deterministic Convergence of Mesoamerican, Sinitic, Mediterranean & Archetypal Computus
            </p>
            <div className="mt-2.5 inline-block font-mono text-[10px] bg-[#111] px-2.5 py-1 rounded-sm border border-[#222] text-gray-400">
              Temporal Coordinate: {ctx.input.dateString} {ctx.input.timeString} ({ctx.input.isUTC ? 'UTC' : 'Local'}) • JD {ctx.temporal.julianDayUT.toFixed(4)}
            </div>
          </div>

          {/* Chapter I: Chronological Coordinates */}
          <section className="space-y-2.5">
            <h2 className="font-cinzel text-lg font-bold text-cyan-400 border-b border-[#222] pb-1">
              I. Chronological & Calendrical Convergence
            </h2>
            <p className="text-xs text-gray-300 font-sans">
              At the designated coordinate, the planetary temporal framework locks into the following simultaneous cyclical positions:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
              <div className="p-3 rounded-sm border border-[#222] bg-[#080808] border-l-2 border-l-cyan-500">
                <div className="font-cinzel font-bold text-cyan-400 text-xs mb-1 uppercase">Mesoamerican Maya</div>
                <div><span className="text-gray-500">Long Count:</span> <strong className="text-white">{ctx.mayan.longCount.formatted}</strong></div>
                <div><span className="text-gray-500">Tzolk'in:</span> <strong className="text-white">{ctx.mayan.tzolkin.formatted}</strong> (Kin {ctx.mayan.kinNumber}, {ctx.mayan.tzolkin.direction})</div>
                <div><span className="text-gray-500">Haab':</span> <strong className="text-white">{ctx.mayan.haab.formatted}</strong></div>
                <div><span className="text-gray-500">Calendar Round:</span> <strong className="text-amber-300">{ctx.mayan.calendarRound}</strong></div>
                <div><span className="text-gray-500">Correlation:</span> GMT 584283 Canonical</div>
              </div>

              <div className="p-3 rounded-sm border border-[#222] bg-[#080808] border-l-2 border-l-green-500">
                <div className="font-cinzel font-bold text-green-400 text-xs mb-1 uppercase">Chinese Sexagenary</div>
                <div><span className="text-gray-500">Year Pillar:</span> <strong className="text-white">{ctx.chinese.yearPillar.stemPinYin}-{ctx.chinese.yearPillar.branchPinYin} ({ctx.chinese.yearPillar.stemElement} {ctx.chinese.yearPillar.zodiacAnimal})</strong></div>
                <div><span className="text-gray-500">Solar Term:</span> <strong className="text-white">{ctx.chinese.solarTerm.name} ({ctx.chinese.solarTerm.chineseName})</strong></div>
                <div><span className="text-gray-500">Dominant Wu Xing:</span> <strong className="text-green-400">{ctx.chinese.dominantElement}</strong></div>
                <div><span className="text-gray-500">Lunar Phase:</span> {ctx.chinese.lunarPhaseName} (Day {ctx.chinese.lunarDay})</div>
              </div>

              <div className="p-3 rounded-sm border border-[#222] bg-[#080808] border-l-2 border-l-amber-500">
                <div className="font-cinzel font-bold text-amber-400 text-xs mb-1 uppercase">Ancient Mediterranean & Ge'ez</div>
                <div><span className="text-gray-500">Egyptian Civil:</span> Year {ctx.egyptian.civilYear}, {ctx.egyptian.monthName} Day {ctx.egyptian.dayOfMonth}</div>
                <div><span className="text-gray-500">Season:</span> {ctx.egyptian.season} ({ctx.egyptian.seasonNameTrans})</div>
                <div><span className="text-gray-500">Sothic Great Cycle:</span> Cycle {ctx.egyptian.sothicGreatYearCycle}, Year {ctx.egyptian.sothicYearInCycle}/1460</div>
                <div><span className="text-gray-500">Ethiopian Ge'ez:</span> {ctx.ethiopian.monthName} {ctx.ethiopian.dayOfMonth}, {ctx.ethiopian.year} A.M.</div>
                <div><span className="text-gray-500">Attic Greek:</span> {ctx.greek.atticMonthName}, Day {ctx.greek.atticDay}</div>
              </div>

              <div className="p-3 rounded-sm border border-[#222] bg-[#080808] border-l-2 border-l-purple-500">
                <div className="font-cinzel font-bold text-purple-400 text-xs mb-1 uppercase">Pythagorean & Chaldean Decad</div>
                <div><span className="text-gray-500">Life Path Vibration:</span> <strong className="text-purple-300">{ctx.numerology.lifePathNumber}</strong> {ctx.numerology.lifePathIsMaster ? '(Master)' : ''}</div>
                <div><span className="text-gray-500">Universal Cycle:</span> Day {ctx.numerology.universalDay} | Month {ctx.numerology.universalMonth} | Year {ctx.numerology.universalYear}</div>
                <div><span className="text-gray-500">Chaldean Key:</span> Sound Root {ctx.numerology.chaldeanVibration}</div>
              </div>
            </div>
          </section>

          {/* Chapter II: Archetypal Matrix */}
          <section className="space-y-2.5">
            <h2 className="font-cinzel text-lg font-bold text-cyan-400 border-b border-[#222] pb-1">
              II. Archetypal Resonance & Twelve Tribes Alignment
            </h2>
            <div className="p-3 rounded-sm border border-[#222] bg-[#080808] font-sans text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1a1a1a] pb-1.5">
                <div>
                  <span className="text-gray-500">Primary Resonating Tribe:</span>{' '}
                  <strong className="text-white text-sm">{ctx.synthesis.topResonatingTribe.tribe}</strong> ({ctx.synthesis.topResonatingTribe.hebrewName})
                </div>
                <div className="text-green-400 font-mono font-bold">
                  Affinity: {ctx.synthesis.topResonatingTribe.affinityScore}% ({ctx.synthesis.topResonatingTribe.directionInCamp} Camp)
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Breastplate Gemstone:</span>{' '}
                  <span className="text-white font-medium">{ctx.synthesis.topResonatingTribe.gemstone}</span>
                </div>
                <div>
                  <span className="text-gray-500">Zodiac Alignment:</span>{' '}
                  <span className="text-white font-medium">{ctx.synthesis.topResonatingTribe.zodiacCorrespondence}</span>
                </div>
              </div>
              <div className="text-gray-400 italic mt-1">
                Role: {ctx.synthesis.topResonatingTribe.archetypeRole}
              </div>
            </div>
          </section>

          {/* Chapter III: Gene Keys Golden Path */}
          <section className="space-y-2.5">
            <h2 className="font-cinzel text-lg font-bold text-cyan-400 border-b border-[#222] pb-1">
              III. Gene Keys Transit Spectrum
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
              <div className="p-3 rounded-sm border border-[#222] bg-[#080808] border-l-2 border-l-amber-500">
                <div className="font-bold text-amber-400 uppercase text-xs">Conscious Sun Gate {ctx.geneKeysSun.gate}.{ctx.geneKeysSun.line}</div>
                <div className="text-white font-medium my-1">{ctx.geneKeysSun.name}</div>
                <div className="text-[11px] text-gray-400">
                  Shadow: <strong className="text-red-300">{ctx.geneKeysSun.shadow}</strong> → Gift: <strong className="text-cyan-300">{ctx.geneKeysSun.gift}</strong> → Siddhi: <strong className="text-amber-300">{ctx.geneKeysSun.siddhi}</strong>
                </div>
              </div>

              <div className="p-3 rounded-sm border border-[#222] bg-[#080808] border-l-2 border-l-green-500">
                <div className="font-bold text-green-400 uppercase text-xs">Design Earth Gate {ctx.geneKeysEarth.gate}.{ctx.geneKeysEarth.line}</div>
                <div className="text-white font-medium my-1">{ctx.geneKeysEarth.name}</div>
                <div className="text-[11px] text-gray-400">
                  Shadow: <strong className="text-red-300">{ctx.geneKeysEarth.shadow}</strong> → Gift: <strong className="text-cyan-300">{ctx.geneKeysEarth.gift}</strong> → Siddhi: <strong className="text-amber-300">{ctx.geneKeysEarth.siddhi}</strong>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
