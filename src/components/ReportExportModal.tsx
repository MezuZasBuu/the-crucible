/**
 * The Crucible — "Save or print this report" modal.
 * Print, download as CSV / JSON, or open one of the three report versions.
 */

import React from 'react';
import { downloadFile, generateCSVReport, openPrintDialog } from '../engine/export';
import { DOSSIER_TIER_META, downloadDossierHTML, openDossierPrintWindow } from '../engine/dossierExport';
import { getClaimsJSONL } from '../engine/knowledgeBase';
import { CompleteCalculationContext, DossierTier } from '../types';
import { X, Printer, Download } from 'lucide-react';
import { SignGlyph } from './symbols/AstroGlyph';
import { CultureHeader, CallingEmblem } from './symbols/CultureSymbols';

/** Plain-language names for the three report versions. */
const TIER_PLAIN: Record<DossierTier, { label: string; blurb: string }> = {
  FREE_PREVIEW: { label: 'Short version', blurb: 'The basics from the main traditions, enough to see what this day holds.' },
  FULL_READING: {
    label: 'Full version',
    blurb: 'Every tradition in full, how they connect, the calculations behind them, and name analysis.'
  },
  DEEP_REPORT: {
    label: 'Longest version',
    blurb: 'Everything in the full version, plus a longer written summary, the world map reading and the next 14 days.'
  }
};

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

  const calling = ctx.synthesis.topCalling;
  const tiers: DossierTier[] = ['FREE_PREVIEW', 'FULL_READING', 'DEEP_REPORT'];

  return (
    <div className="guide-overlay overflow-y-auto" role="dialog" aria-modal="true" aria-label="Save or print this report">
      <div className="guide-sheet">
        <div className="guide-head no-print">
          <div>
            <p className="ui-eyebrow">
              {ctx.input.dateString} at {ctx.input.timeString} {ctx.input.isUTC ? 'UTC' : 'local time'}
            </p>
            <h3 className="guide-title">Save or print this report</h3>
          </div>
          <button type="button" onClick={onClose} className="guide-close" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="guide-body space-y-6">
          {/* Actions */}
          <div className="no-print space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={openPrintDialog} className="cta-primary">
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button type="button" onClick={handleDownloadCSV} className="cta-ghost" title="A table you can open in a spreadsheet">
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
              <button type="button" onClick={handleDownloadJSON} className="cta-ghost" title="All the calculated data, for use in other programs">
                <Download className="w-4 h-4" />
                <span>Download JSON</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadJSONL}
                className="cta-ghost"
                title="The reference notes the app draws on, one record per line"
              >
                <Download className="w-4 h-4" />
                <span>Download reference notes (JSONL)</span>
              </button>
            </div>
            <p className="field-help">
              Print opens your browser’s print window; choose “Save as PDF” there to keep a PDF. CSV opens in a
              spreadsheet. JSON and JSONL are data files for other programs.
            </p>
          </div>

          {/* Report versions */}
          <div className="no-print space-y-2">
            <p className="ui-eyebrow">Or open a longer written report</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tiers.map((tier) => {
                const m = DOSSIER_TIER_META[tier];
                const plain = TIER_PLAIN[tier];
                return (
                  <div key={tier} className="curious-box flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-base font-semibold text-[color:var(--text-primary)]">{plain.label}</span>
                      <span className="readable-muted">{m.priceHint}</span>
                    </div>
                    <p className="text-sm text-[color:var(--text-secondary)] flex-1">{plain.blurb}</p>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => openTier(tier)} className="cta-ghost">
                        Open to print or save as PDF
                      </button>
                      <button type="button" onClick={() => downloadTier(tier)} className="cta-ghost">
                        Download as web page
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Printable summary */}
          <div className="printable-report space-y-6 text-[color:var(--text-secondary)]">
            <div className="border-b border-[color:var(--line-soft)] pb-4">
              <p className="ui-eyebrow">The Crucible</p>
              <h1 className="panel-title">Report for {ctx.input.dateString}</h1>
              <p className="readable-muted mt-1">
                One day as seen by several calendar and astrology traditions. {ctx.input.dateString} at{' '}
                {ctx.input.timeString} {ctx.input.isUTC ? 'UTC' : 'local time'}.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="panel-title">The date in each calendar</h2>
              <p className="readable-muted">The same moment, written the way each tradition counts time.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="curious-box space-y-3">
                  <CultureHeader culture="maya" />
                  <dl className="trad-facts">
                    <dt>Long Count</dt>
                    <dd>{ctx.mayan.longCount.formatted} (a running count of days)</dd>
                    <dt>Tzolk'in</dt>
                    <dd>
                      {ctx.mayan.tzolkin.formatted}, day {ctx.mayan.kinNumber} of the 260-day sacred count (direction:{' '}
                      {ctx.mayan.tzolkin.direction})
                    </dd>
                    <dt>Haab'</dt>
                    <dd>{ctx.mayan.haab.formatted} (the 365-day year)</dd>
                    <dt>Both together</dt>
                    <dd>{ctx.mayan.calendarRound}</dd>
                  </dl>
                </div>

                <div className="curious-box space-y-3">
                  <CultureHeader culture="chinese" />
                  <dl className="trad-facts">
                    <dt>Year</dt>
                    <dd>
                      {ctx.chinese.yearPillar.stemElement} {ctx.chinese.yearPillar.zodiacAnimal} (
                      {ctx.chinese.yearPillar.stemPinYin}-{ctx.chinese.yearPillar.branchPinYin})
                    </dd>
                    <dt>Solar term</dt>
                    <dd>
                      {ctx.chinese.solarTerm.name} ({ctx.chinese.solarTerm.chineseName}), a season marker
                    </dd>
                    <dt>Strongest element</dt>
                    <dd>{ctx.chinese.dominantElement} (of the five Chinese elements)</dd>
                    <dt>Moon</dt>
                    <dd>
                      {ctx.chinese.lunarPhaseName}, day {ctx.chinese.lunarDay} of the lunar month
                    </dd>
                  </dl>
                </div>

                <div className="curious-box space-y-3">
                  <CultureHeader culture="egyptian" title="Egyptian, Ethiopian and Athenian calendars" explain={false} />
                  <dl className="trad-facts">
                    <dt>Egyptian</dt>
                    <dd>
                      Year {ctx.egyptian.civilYear}, {ctx.egyptian.monthName}, day {ctx.egyptian.dayOfMonth}
                    </dd>
                    <dt>Egyptian season</dt>
                    <dd>
                      {ctx.egyptian.season} ({ctx.egyptian.seasonNameTrans})
                    </dd>
                    <dt>Sirius cycle</dt>
                    <dd>
                      Cycle {ctx.egyptian.sothicGreatYearCycle}, year {ctx.egyptian.sothicYearInCycle} of 1,460 (how long
                      the calendar takes to realign with the star Sirius)
                    </dd>
                    <dt>Ethiopian</dt>
                    <dd>
                      {ctx.ethiopian.monthName} {ctx.ethiopian.dayOfMonth}, year {ctx.ethiopian.year}
                    </dd>
                    <dt>Athenian</dt>
                    <dd>
                      {ctx.greek.atticMonthName}, day {ctx.greek.atticDay}
                    </dd>
                  </dl>
                </div>

                <div className="curious-box space-y-3">
                  <CultureHeader culture="numerology" />
                  <dl className="trad-facts">
                    <dt>Life path number</dt>
                    <dd>
                      {ctx.numerology.lifePathNumber}
                      {ctx.numerology.lifePathIsMaster ? ' (a “master number”)' : ''}, the digits of the date added
                      together
                    </dd>
                    <dt>Day number</dt>
                    <dd>{ctx.numerology.universalDay}</dd>
                    <dt>Month number</dt>
                    <dd>{ctx.numerology.universalMonth}</dd>
                    <dt>Year number</dt>
                    <dd>{ctx.numerology.universalYear}</dd>
                    <dt>Chaldean number</dt>
                    <dd>{ctx.numerology.chaldeanVibration} (an older Babylonian way of numbering)</dd>
                  </dl>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="panel-title">Today's calling</h2>
              <div className="curious-box space-y-3">
                <CultureHeader culture="callings" />
                <div className="trad-hero">
                  <span className="trad-hero-symbol">
                    <CallingEmblem emblemId={calling.emblemId} size={26} />
                  </span>
                  <div className="min-w-0">
                    <p className="trad-hero-value">{calling.calling}</p>
                    <p className="trad-hero-sub">{calling.motto}</p>
                  </div>
                </div>
                <dl className="trad-facts">
                  <dt>Quarter</dt>
                  <dd>{calling.quarter}</dd>
                  <dt>Gemstone</dt>
                  <dd>{calling.gemstone}</dd>
                  <dt>Zodiac sign</dt>
                  <dd>
                    <SignGlyph sign={calling.zodiacCorrespondence} size={16} tinted /> {calling.zodiacCorrespondence}
                  </dd>
                  <dt>Match score</dt>
                  <dd>{calling.affinityScore}%</dd>
                  <dt>Role</dt>
                  <dd>{calling.archetypeRole}</dd>
                </dl>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="panel-title">Gene Keys for today</h2>
              <div className="curious-box space-y-3">
                <CultureHeader culture="gene_keys" />
                <p className="readable-muted">
                  Each key names a difficulty (“shadow”), the strength it can turn into (“gift”) and its highest form
                  (“siddhi”).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {([
                    { label: 'From the Sun’s position', key: ctx.geneKeysSun },
                    { label: 'From the point opposite the Sun (the Earth point)', key: ctx.geneKeysEarth }
                  ] as const).map(({ label, key }) => (
                    <div key={label} className="space-y-2">
                      <p className="readable-muted">{label}</p>
                      <p className="trad-hero-value">
                        Key {key.gate}, line {key.line}: {key.name}
                      </p>
                      <dl className="trad-facts">
                        <dt>Difficulty</dt>
                        <dd>{key.shadow}</dd>
                        <dt>Strength</dt>
                        <dd>{key.gift}</dd>
                        <dt>Highest form</dt>
                        <dd>{key.siddhi}</dd>
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <p className="chart-note">
              These readings come from traditions and are offered for reflection. They are not predictions.
            </p>

            <details className="no-print">
              <summary className="readable-muted cursor-pointer">Technical details</summary>
              <dl className="trad-facts mt-2">
                <dt>Julian day</dt>
                <dd>{ctx.temporal.julianDayUT.toFixed(4)} (astronomers' running day count)</dd>
                <dt>Maya date matching</dt>
                <dd>GMT 584283, the standard way of lining up Maya and modern dates</dd>
                <dt>Calculation version code</dt>
                <dd className="break-all">{ctx.rulesetHash}</dd>
              </dl>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};
