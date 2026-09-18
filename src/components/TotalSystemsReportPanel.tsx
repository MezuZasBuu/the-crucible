/**
 * The Crucible — Total Systems Synthesis & Dialectical Forks Dossier
 * 
 * Encompasses:
 * - Natal & Significant Time Measurement Input Station
 * - Gaia's Daily Energetic Overcast Profile
 * - Multi-Cipher Gematria on Names & Letter-by-Letter Matrix
 * - Etymological Root Research & Linguistic Lineage
 * - Fused Name-Definition Numerology & Literary Monograph
 * - Cross-System Dialectical Contradictions presented as Forks in the Road of Opportunity
 * - Machine-Readable JSON & JSONL Live Ledger with Download/Copy
 * - Sourced Research Citations & Live Network Synthesis
 */

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Sparkles,
  GitFork,
  Globe,
  Compass,
  Download,
  Copy,
  Check,
  Search,
  Calendar,
  Clock,
  MapPin,
  Flame,
  Shield,
  BookOpen,
  Layers,
  RotateCcw,
  Zap,
  Sun
} from 'lucide-react';
import { CompleteCalculationContext, LocationCoordinates, TemporalInput } from '../types';
import { calculateGematriaEtymology, GematriaCipherResult } from '../engine/gematriaEtymology';
import { buildTotalSystemsReport } from '../engine/gaiaOvercastForks';
import { executeCrucibleCalculation } from '../engine/crucibleCore';
import { DailyEnergyReportModal } from './DailyEnergyReportModal';


interface TotalSystemsReportPanelProps {
  currentCtx: CompleteCalculationContext;
  onSelectTransitTime?: () => void;
}

export const TotalSystemsReportPanel: React.FC<TotalSystemsReportPanelProps> = ({
  currentCtx
}) => {
  // Querent / Significant time input state
  const [subjectName, setSubjectName] = useState<string>('');
  const [measurementReason, setMeasurementReason] = useState<string>('');
  const [inputDate, setInputDate] = useState<string>('');
  const [inputTime, setInputTime] = useState<string>('12:00:00');
  const [inputCity, setInputCity] = useState<string>('');
  const [inputLat, setInputLat] = useState<number>(31.778);
  const [inputLng, setInputLng] = useState<number>(35.2354);

  // Active sub-tab within report
  const [activeSection, setActiveSection] = useState<'OVERVIEW' | 'GAIA' | 'GEMATRIA' | 'FORKS' | 'SYSTEMS' | 'JSON_DATA'>('OVERVIEW');
  const [jsonFormat, setJsonFormat] = useState<'JSON' | 'JSONL'>('JSON');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [networkResearchOutput, setNetworkResearchOutput] = useState<string | null>(null);
  const [isDailyReportModalOpen, setIsDailyReportModalOpen] = useState<boolean>(false);

  // Calculate the measured coordinate context (e.g. natal / event)
  const measuredContext = useMemo<CompleteCalculationContext>(() => {
    if (!inputDate) return currentCtx;
    const temporalInput: TemporalInput = {
      dateString: inputDate,
      timeString: inputTime || '12:00:00',
      timezoneOffsetMinutes: 0,
      isUTC: true,
      location: {
        latitude: inputLat,
        longitude: inputLng,
        city: inputCity || undefined
      },
      querentName: subjectName || undefined
    };
    return executeCrucibleCalculation(temporalInput, 'GMT_584283');
  }, [inputDate, inputTime, inputLat, inputLng, inputCity, subjectName, currentCtx]);

  // Gematria & Etymology calculation
  const gematriaEtymology = useMemo(() => {
    return calculateGematriaEtymology(subjectName || 'Querent', measuredContext.numerology.lifePathNumber);
  }, [subjectName, measuredContext.numerology.lifePathNumber]);

  // Total Systems Report with Gaia Overcast & Dialectical Forks
  const totalReport = useMemo(() => {
    return buildTotalSystemsReport(currentCtx, subjectName, measurementReason, measuredContext);
  }, [currentCtx, subjectName, measurementReason, measuredContext]);

  // JSON & JSONL representations
  const formattedJSON = useMemo(() => {
    const payload = {
      dossierMetadata: {
        title: 'The Crucible Total Systems Synthesis & Dialectical Forks Dossier',
        timestamp: new Date().toISOString(),
        calculationId: measuredContext.calculationId,
        querentName: subjectName,
        measurementReason: measurementReason,
        natalTemporalCoordinate: {
          date: inputDate,
          time: inputTime,
          location: { city: inputCity, latitude: inputLat, longitude: inputLng },
          julianDayUT: measuredContext.temporal.julianDayUT
        },
        transitTemporalCoordinate: {
          date: currentCtx.input.dateString,
          time: currentCtx.input.timeString,
          julianDayUT: currentCtx.temporal.julianDayUT
        }
      },
      gaiaDailyEnergeticOvercast: totalReport.gaiaOvercast,
      gematriaAndEtymology: {
        ciphers: gematriaEtymology.ciphers,
        etymology: gematriaEtymology.etymology,
        fusedNumerology: gematriaEtymology.fusedNumerology,
        letterMatrix: gematriaEtymology.letterBreakdowns
      },
      dialecticalContradictionForks: totalReport.dialecticalForks,
      totalSystemsLedger: {
        mayan: measuredContext.mayan,
        dreamspell: measuredContext.dreamspell,
        chinese: measuredContext.chinese,
        egyptian: measuredContext.egyptian,
        ethiopian: measuredContext.ethiopian,
        greek: measuredContext.greek,
        enochianBiblical: measuredContext.enochianBiblical,
        numerology: measuredContext.numerology,
        geneKeysSun: measuredContext.geneKeysSun,
        twelveTribesTop: measuredContext.synthesis.topResonatingTribe,
        intertwining: {
          primaryTribeLife: measuredContext.intertwining.primaryTribeLife,
          threads: measuredContext.intertwining.intertwiningThreads,
          systemNoteIds: measuredContext.intertwining.systemNotes.map((n) => n.systemId)
        }
      },
      researchCitations: totalReport.researchNetworkingCitations
    };
    return JSON.stringify(payload, null, 2);
  }, [measuredContext, currentCtx, subjectName, measurementReason, inputDate, inputTime, inputCity, inputLat, inputLng, totalReport, gematriaEtymology]);

  const formattedJSONL = useMemo(() => {
    const lines = [
      JSON.stringify({ recordType: 'METADATA', querent: subjectName, reason: measurementReason, date: inputDate, time: inputTime, city: inputCity, jd: measuredContext.temporal.julianDayUT }),
      JSON.stringify({ recordType: 'GAIA_OVERCAST', date: totalReport.gaiaOvercast.date, geomagnetic: totalReport.gaiaOvercast.geomagneticStatus, schumannHz: totalReport.gaiaOvercast.schumannFrequencyHz, aspectTension: totalReport.gaiaOvercast.celestialAspectTensionScore, polarity: totalReport.gaiaOvercast.collectiveFieldPolarity, dominantElement: totalReport.gaiaOvercast.dominantElementalAtmosphere }),
      JSON.stringify({ recordType: 'GEMATRIA_CIPHERS', hebrew: gematriaEtymology.ciphers.hebrewStandard.totalSum, ordinal: gematriaEtymology.ciphers.englishOrdinal.totalSum, reduction: gematriaEtymology.ciphers.englishReduction.totalSum, sumerian: gematriaEtymology.ciphers.englishSumerian.totalSum, chaldean: gematriaEtymology.ciphers.chaldean.totalSum, greek: gematriaEtymology.ciphers.greekIsopsephy.totalSum }),
      JSON.stringify({ recordType: 'ETYMOLOGY', name: subjectName, origin: gematriaEtymology.etymology.originalLanguage, root: gematriaEtymology.etymology.rootWord, definition: gematriaEtymology.etymology.literalDefinition, archetype: gematriaEtymology.etymology.archetype }),
      JSON.stringify({ recordType: 'FUSED_NUMEROLOGY', lifePath: measuredContext.numerology.lifePathNumber, expression: gematriaEtymology.fusedNumerology.expressionNumber, soulUrge: gematriaEtymology.fusedNumerology.soulUrgeNumber, personality: gematriaEtymology.fusedNumerology.personalityNumber, karmicLessons: gematriaEtymology.fusedNumerology.karmicLessons }),
      JSON.stringify({ recordType: 'DIALECTICAL_FORKS', forks: totalReport.dialecticalForks.map((f) => ({ id: f.id, title: f.title, alpha: f.forkPathAlpha.title, beta: f.forkPathBeta.title, synthesis: f.alchemicalSynthesis.title })) }),
      JSON.stringify({ recordType: 'MAYAN_CHRONO', longCount: measuredContext.mayan.longCount.formatted, tzolkin: measuredContext.mayan.tzolkin.formatted, haab: measuredContext.mayan.haab.formatted, kin: measuredContext.mayan.kinNumber }),
      JSON.stringify({ recordType: 'CHINESE_BAZI', year: `${measuredContext.chinese.yearPillar.stemPinYin}-${measuredContext.chinese.yearPillar.branchPinYin}`, element: measuredContext.chinese.yearPillar.stemElement, animal: measuredContext.chinese.yearPillar.zodiacAnimal, solarTerm: measuredContext.chinese.solarTerm.name }),
      JSON.stringify({
        recordType: 'ENOCHIAN_BIBLICAL_ROMAN',
        enochian: measuredContext.enochianBiblical.enochian.formatted,
        tekufah: measuredContext.enochianBiblical.biblicalSeason.hebrewTekufah,
        verses: measuredContext.enochianBiblical.biblicalTransits.seasonVerseAnchors,
        gregorianDies: measuredContext.enochianBiblical.gregorianWeekdayDeity.latinDies,
        julianDies: measuredContext.enochianBiblical.julianWeekdayDeity.latinDies,
        planetaryHour: measuredContext.enochianBiblical.currentPlanetaryHour.planet,
        halfHour: measuredContext.enochianBiblical.currentHalfHour.phase,
        compassFlip: measuredContext.enochianBiblical.compassOrientation.directionRemap,
        triangulation: measuredContext.enochianBiblical.abPeek.synthesis.summary
      }),
      JSON.stringify({ recordType: 'RESEARCH_CITATIONS', citations: totalReport.researchNetworkingCitations })
    ];
    return lines.join('\n');
  }, [subjectName, measurementReason, inputDate, inputTime, inputCity, measuredContext, totalReport, gematriaEtymology]);

  const handleCopy = () => {
    const textToCopy = jsonFormat === 'JSON' ? formattedJSON : formattedJSONL;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = jsonFormat === 'JSON' ? formattedJSON : formattedJSONL;
    const filename = `${subjectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_total_systems_report.${jsonFormat === 'JSON' ? 'json' : 'jsonl'}`;
    const blob = new Blob([textToDownload], { type: jsonFormat === 'JSON' ? 'application/json' : 'application/x-ndjson' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSyncToCurrent = () => {
    setInputDate(currentCtx.input.dateString);
    setInputTime(currentCtx.input.timeString);
    setInputCity(currentCtx.input.location.city || 'World · UTC');
    setInputLat(currentCtx.input.location.latitude);
    setInputLng(currentCtx.input.location.longitude);
  };

  const handlePresetSelect = (presetName: string, date: string, city: string, lat: number, lng: number, reason: string) => {
    setSubjectName(presetName);
    setInputDate(date);
    setInputCity(city);
    setInputLat(lat);
    setInputLng(lng);
    setMeasurementReason(reason);
  };

  const handleInitiateDeepResearch = async () => {
    setIsResearching(true);
    setNetworkResearchOutput(null);
    try {
      const res = await fetch('/api/research/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: subjectName,
          date: `${inputDate} ${inputTime}`,
          reason: measurementReason,
          context: {
            gaiaOvercast: totalReport.gaiaOvercast,
            gematria: gematriaEtymology.ciphers,
            etymology: gematriaEtymology.etymology
          }
        })
      });
      const data = await res.json();
      if (data.researchReport) {
        setNetworkResearchOutput(data.researchReport);
      } else {
        setNetworkResearchOutput('Research synthesis successfully completed and incorporated into local ledger.');
      }
    } catch (err: any) {
      console.error('Research networking error:', err);
      setNetworkResearchOutput(`Archival research fallback engaged: ${gematriaEtymology.etymology.etymologicalNarrative}`);
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div className="space-y-5 motion-enter text-[color:var(--text-secondary)] parchment-surface">
      {/* Top Banner & Orientation */}
      <div className="instrument-panel">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[color:var(--line-soft)] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 rotate-45 items-center justify-center rounded-[var(--radius-sm)] border border-cyan-300/25 bg-cyan-300/[0.07] shadow-[var(--glow-temporal)]">
              <Sparkles className="w-5 h-5 text-cyan-400 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="panel-title">
                  Total Systems Synthesis & Dialectical Forks Dossier
                </h2>
                <span className="ui-eyebrow rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-2 py-1 text-[color:var(--temporal-bright)]">
                  Speculative Field Overlay Synced
                </span>
              </div>
              <p className="text-xs text-gray-400 font-serif italic mt-0.5">
                Measuring personal and event temporal coordinates against Earth's daily energetic canopy, transforming systemic contradictions into sovereign forks of opportunity.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill & Daily Report Trigger */}
          <div className="flex flex-wrap items-center gap-2 text-[10px]">
            <button
              onClick={() => setIsDailyReportModalOpen(true)}
              className="cta-primary min-h-0 px-3 py-2 text-[10px] group"
              title="Open full comprehensive analysis on the energy of the day in full"
            >
              <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span>Today's Daily Report</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            </button>

            <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-white/[0.025] px-3 py-2">
              <span className="text-gray-500 uppercase mr-1">Speculative overlay:</span>
              <span className="font-bold text-cyan-400">{totalReport.gaiaOvercast.geomagneticStatus}</span>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-white/[0.025] px-3 py-2">
              <span className="text-gray-500 uppercase mr-1">Schumann:</span>
              <span className="font-bold text-emerald-400">{totalReport.gaiaOvercast.schumannFrequencyHz} Hz</span>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-white/[0.025] px-3 py-2">
              <span className="text-gray-500 uppercase mr-1">Aspect Tension:</span>
              <span className="font-bold text-amber-400">{totalReport.gaiaOvercast.celestialAspectTensionScore}/100</span>
            </div>
          </div>

        </div>

        {/* INPUT STATION: Birthdata & Significant Time */}
        <div className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-4">
          <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <h3 className="ui-eyebrow text-[color:var(--temporal)]">
                Temporal Measurement Station (Birthdata / Significant Coordinate)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[9px]">
              <button
                onClick={handleSyncToCurrent}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 underline underline-offset-2"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Load Real-Time Transit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            {/* Subject Name */}
            <div>
              <label className="ui-eyebrow block mb-1">
                Name / Subject
              </label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Alexander"
                className="field-input w-full"
              />
            </div>

            {/* Date */}
            <div>
              <label className="ui-eyebrow block mb-1">
                Date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="field-input w-full"
              />
            </div>

            {/* Time */}
            <div>
              <label className="ui-eyebrow block mb-1">
                Time (HH:MM:SS)
              </label>
              <input
                type="time"
                step="1"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="field-input w-full"
              />
            </div>

            {/* City / Landmark */}
            <div>
              <label className="ui-eyebrow block mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={inputCity}
                onChange={(e) => setInputCity(e.target.value)}
                placeholder="e.g. Alexandria"
                className="field-input w-full"
              />
            </div>

            {/* Latitude / Longitude */}
            <div>
              <label className="ui-eyebrow block mb-1">
                Coordinates (Lat / Lng)
              </label>
              <div className="grid grid-cols-2 gap-1">
                <input
                  type="number"
                  step="0.001"
                  value={inputLat}
                  onChange={(e) => setInputLat(parseFloat(e.target.value) || 0)}
                  className="field-input w-full px-1.5 text-center"
                />
                <input
                  type="number"
                  step="0.001"
                  value={inputLng}
                  onChange={(e) => setInputLng(parseFloat(e.target.value) || 0)}
                  className="field-input w-full px-1.5 text-center"
                />
              </div>
            </div>

            {/* Reason / Designation */}
            <div>
              <label className="ui-eyebrow block mb-1">
                Measurement Focus
              </label>
              <input
                type="text"
                value={measurementReason}
                onChange={(e) => setMeasurementReason(e.target.value)}
                placeholder="e.g. Natal Chart"
                className="field-input w-full"
              />
            </div>
          </div>

          {/* Preset Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-[color:var(--line-soft)] text-[9px]">
            <span className="ui-eyebrow mr-1">Archetypal Presets:</span>
            <button
              onClick={() => handlePresetSelect('Alexander', '1988-08-08', 'Alexandria', 31.2001, 29.9187, 'Sovereign Guardian & Defender')}
              className="nav-tab border border-[color:var(--line-soft)] !px-2 !py-1 text-[color:var(--temporal-bright)]"
            >
              Alexander (356 BCE Archetype)
            </button>
            <button
              onClick={() => handlePresetSelect('Sophia', '1995-03-21', 'Athens', 37.9838, 23.7275, 'Sacred Wisdom & Gnosis')}
              className="nav-tab border border-[color:var(--line-soft)] !px-2 !py-1 text-[color:var(--solar-bright)]"
            >
              Sophia (Gnostic Wisdom)
            </button>
            <button
              onClick={() => handlePresetSelect('Leonardo', '1452-04-15', 'Vinci', 43.7874, 10.9265, 'Polymathic Renaissance Ignition')}
              className="nav-tab border border-[color:var(--line-soft)] !px-2 !py-1 text-[color:var(--solar-bright)]"
            >
              Leonardo da Vinci
            </button>
            <button
              onClick={() => handlePresetSelect('Hermes', '2000-01-01', 'Giza Sanctuary', 29.9792, 31.1342, 'Hermetic Threshold Master')}
              className="nav-tab border border-[color:var(--line-soft)] !px-2 !py-1 text-emerald-300"
            >
              Hermes Trismegistus
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-[color:var(--line-soft)]">
          <div className="flex flex-wrap items-center gap-1">
            {(
              [
                { id: 'OVERVIEW', label: 'Executive Synthesis', icon: FileText },
                { id: 'GAIA', label: 'Speculative Field Overlay', icon: Globe },
                { id: 'GEMATRIA', label: 'Gematria & Etymology', icon: BookOpen },
                { id: 'FORKS', label: 'Dialectical Forks', icon: GitFork },
                { id: 'SYSTEMS', label: 'All Systems Ledger', icon: Layers },
                { id: 'JSON_DATA', label: 'JSON / JSONL Ledger', icon: Download }
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`nav-tab flex items-center gap-1.5 text-[10px] uppercase ${
                    activeSection === tab.id
                      ? 'nav-tab-active bg-cyan-300/[0.06]'
                      : ''
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInitiateDeepResearch}
              disabled={isResearching}
              className="cta-ghost min-h-0 px-3 py-2 text-[10px] uppercase"
              title="Query Live Web Grounding & Network Sourced Scholarly Corpus"
            >
              <Zap className={`w-3 h-3 ${isResearching ? 'animate-spin text-amber-400' : 'text-cyan-400'}`} />
              <span>{isResearching ? 'Synthesizing...' : 'Deep Network Research'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Network Research Output Banner (if triggered) */}
      {networkResearchOutput && (
        <div className="instrument-panel motion-enter !p-4 text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase text-[10px]">
              <Search className="w-3.5 h-3.5" />
              <span>Network Sourced Research Dossier</span>
            </div>
            <button
              onClick={() => setNetworkResearchOutput(null)}
              className="text-gray-400 hover:text-white text-[10px]"
            >
              Dismiss
            </button>
          </div>
          <p className="font-serif italic text-gray-200 text-xs leading-relaxed whitespace-pre-line">
            {networkResearchOutput}
          </p>
        </div>
      )}

      {/* SECTION 1: EXECUTIVE SYNTHESIS & PROFILE SUMMARY */}
      {activeSection === 'OVERVIEW' && (
        <div className="space-y-3">
          <div className="instrument-panel instrument-panel-solar space-y-4">
            <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-3">
              <div>
                <span className="ui-eyebrow text-[color:var(--temporal)]">
                  Executive Monograph
                </span>
                <h3 className="text-base font-cinzel font-bold text-white">
                  {subjectName} — {measurementReason}
                </h3>
              </div>
              <div className="text-right text-[10px] text-gray-400">
                <span>JD {measuredContext.temporal.julianDayUT.toFixed(4)}</span>
                <p className="text-gray-500">{inputCity} ({inputLat.toFixed(2)}°, {inputLng.toFixed(2)}°)</p>
              </div>
            </div>

            {/* Prose Narrative */}
            <div className="rounded-[var(--radius-md)] border border-cyan-300/10 border-l-2 border-l-[color:var(--temporal)] bg-cyan-300/[0.025] p-4">
              <p className="font-serif text-xs md:text-sm text-gray-200 leading-relaxed italic whitespace-pre-line">
                {totalReport.executiveSynthesizedTreatise}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="rounded-[var(--radius-md)] border border-amber-300/10 bg-amber-300/[0.025] p-3">
                <span className="text-[8px] uppercase text-gray-500 block">Life Path Number</span>
                <span className="text-lg font-cinzel font-bold text-[color:var(--solar-bright)]">
                  {measuredContext.numerology.lifePathNumber}
                </span>
                <span className="text-[8px] text-gray-400 block mt-0.5">
                  {measuredContext.numerology.lifePathIsMaster ? 'Master Ray' : 'Pythagorean Root'}
                </span>
              </div>

              <div className="rounded-[var(--radius-md)] border border-cyan-300/10 bg-cyan-300/[0.025] p-3">
                <span className="text-[8px] uppercase text-gray-500 block">Name Expression</span>
                <span className="text-lg font-cinzel font-bold text-cyan-300">
                  {gematriaEtymology.fusedNumerology.expressionNumber}
                </span>
                <span className="text-[8px] text-gray-400 block mt-0.5">Destiny Archetype</span>
              </div>

              <div className="rounded-[var(--radius-md)] border border-emerald-300/10 bg-emerald-300/[0.025] p-3">
                <span className="text-[8px] uppercase text-gray-500 block">Soul Urge (Vowels)</span>
                <span className="text-lg font-cinzel font-bold text-emerald-300">
                  {gematriaEtymology.fusedNumerology.soulUrgeNumber}
                </span>
                <span className="text-[8px] text-gray-400 block mt-0.5">Heart's Inner Thirst</span>
              </div>

              <div className="rounded-[var(--radius-md)] border border-amber-300/10 bg-amber-300/[0.025] p-3">
                <span className="text-[8px] uppercase text-gray-500 block">Hebrew Gematria</span>
                <span className="text-lg font-cinzel font-bold text-amber-300">
                  {gematriaEtymology.ciphers.hebrewStandard.totalSum}
                </span>
                <span className="text-[8px] text-gray-400 block mt-0.5">Mispar Hechrachi</span>
              </div>
            </div>

            {/* Fused Etymological & Numerological Monograph */}
            <div className="rounded-[var(--radius-md)] border border-amber-300/10 border-l-2 border-l-[color:var(--solar)] bg-amber-300/[0.025] p-4 space-y-1">
              <span className="ui-eyebrow text-[color:var(--solar)]">
                Fused Name-Definition & Life Path Monograph
              </span>
              <p className="font-serif text-xs text-gray-300 leading-relaxed italic">
                {gematriaEtymology.fusedNumerology.fusedLiteraryMonograph}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: GAIA'S ENERGETIC OVERCAST */}
      {activeSection === 'GAIA' && (
        <div className="space-y-3">
          <div className="instrument-panel instrument-panel-maya space-y-4">
            <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm uppercase tracking-wider font-bold text-white">
                  Speculative Field Overlay (Proxy Baseline)
                </h3>
              </div>
              <span className="text-[10px] text-gray-400">
                Date of Observation: <strong className="text-white">{totalReport.gaiaOvercast.date}</strong>
              </span>
            </div>

            {/* Overcast Literary Narrative */}
            <div className="rounded-[var(--radius-md)] border border-cyan-300/10 border-l-2 border-l-[color:var(--temporal)] bg-cyan-300/[0.025] p-4">
              <p className="font-serif text-xs md:text-sm text-gray-200 leading-relaxed italic">
                {totalReport.gaiaOvercast.literaryOvercastDossier}
              </p>
            </div>

            {/* Geophysical & Atmospheric Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-[var(--radius-md)] border border-cyan-300/10 bg-cyan-300/[0.025] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-bold text-cyan-400">Geomagnetic Tension</span>
                  <span className="text-xs font-bold text-white">Kp {totalReport.gaiaOvercast.geomagneticKpEstimated}</span>
                </div>
                <p className="text-xs font-cinzel text-white font-bold">{totalReport.gaiaOvercast.geomagneticStatus}</p>
                <p className="text-[10px] text-gray-400 leading-snug">
                  Solar wind particle flux interacting with Earth's magnetosphere, modulating the collective nervous system.
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] border border-emerald-300/10 bg-emerald-300/[0.025] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-bold text-emerald-400">Schumann Cavity</span>
                  <span className="text-xs font-bold text-white">{totalReport.gaiaOvercast.schumannFrequencyHz} Hz</span>
                </div>
                <p className="text-xs font-cinzel text-white font-bold">{totalReport.gaiaOvercast.schumannResonanceMode}</p>
                <p className="text-[10px] text-gray-400 leading-snug">
                  Fundamental terrestrial electromagnetic resonance between Earth's surface and conductive ionosphere.
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] border border-amber-300/10 bg-amber-300/[0.025] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-bold text-amber-400">Aspect Friction Index</span>
                  <span className="text-xs font-bold text-white">{totalReport.gaiaOvercast.celestialAspectTensionScore}/100</span>
                </div>
                <p className="text-xs font-cinzel text-white font-bold">{totalReport.gaiaOvercast.collectiveFieldPolarity}</p>
                <p className="text-[10px] text-gray-400 leading-snug">
                  Geometric quadrature and opposition angles between celestial bodies generating atmospheric pressure.
                </p>
              </div>
            </div>

            {/* Atmospheric Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 border-t border-[color:var(--line-soft)] text-xs">
              <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
                <span className="text-[8px] uppercase text-gray-500 block">Lunar Illumination</span>
                <span className="font-bold text-white">{totalReport.gaiaOvercast.lunarIlluminationPercent}%</span>
                <span className="text-[8px] text-gray-400 block">{totalReport.gaiaOvercast.lunarTone}</span>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
                <span className="text-[8px] uppercase text-gray-500 block">Dominant Element</span>
                <span className="font-bold text-emerald-400">{totalReport.gaiaOvercast.dominantElementalAtmosphere}</span>
                <span className="text-[8px] text-gray-400 block">Wu Xing Vector</span>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
                <span className="text-[8px] uppercase text-gray-500 block">Solar Term</span>
                <span className="font-bold text-amber-400">{totalReport.gaiaOvercast.solarTermPhase}</span>
                <span className="text-[8px] text-gray-400 block">Season Ingress</span>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
                <span className="text-[8px] uppercase text-gray-500 block">Polarity Balance</span>
                <span className="font-bold text-cyan-400">{totalReport.gaiaOvercast.collectiveFieldPolarity.split(' ')[0]}</span>
                <span className="text-[8px] text-gray-400 block">Energetic Vector</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: GEMATRIA ON NAMES & ETYMOLOGY */}
      {activeSection === 'GEMATRIA' && (
        <div className="space-y-3">
          {/* Ciphers Strip */}
          <div className="instrument-panel space-y-4">
            <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm uppercase tracking-wider font-bold text-white">
                  Multi-Tradition Gematria & Cipher Ledgers for "{subjectName}"
                </h3>
              </div>
              <span className="ui-eyebrow">
                Acoustic & Sacred Letter Values
              </span>
            </div>

            {/* Cipher Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.entries(gematriaEtymology.ciphers).slice(0, 6).map(([key, rawCipher]) => {
                const c = rawCipher as GematriaCipherResult;
                return (
                  <div key={key} className="rounded-[var(--radius-md)] border border-cyan-300/10 bg-cyan-300/[0.025] p-3 space-y-1">
                    <span className="text-[8px] uppercase font-bold text-gray-400 block truncate" title={c.cipherName}>
                      {c.cipherName.split('(')[0]}
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-cinzel font-bold text-cyan-300">{c.totalSum}</span>
                      <span className="data-readout text-[9px] text-gray-500">Root {c.reducedRoot}</span>
                    </div>
                    <p className="text-[8px] text-gray-400 italic line-clamp-1">
                      {c.resonantKeywords[0] || 'Harmonic'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Letter by Letter Matrix Table */}
            <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[color:var(--line-soft)]">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-white/[0.035] text-gray-400 text-[9px] uppercase border-b border-[color:var(--line-soft)]">
                  <tr>
                    <th className="p-2">Char</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Hebrew Letter</th>
                    <th className="p-2">Hebrew (Mispar)</th>
                    <th className="p-2">Ordinal (1-26)</th>
                    <th className="p-2">Reduction (1-9)</th>
                    <th className="p-2">Sumerian (×6)</th>
                    <th className="p-2">Chaldean Sound</th>
                    <th className="p-2">Greek Isopsephy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#151515]">
                  {gematriaEtymology.letterBreakdowns.map((b, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.025]">
                      <td className="p-2 font-bold text-white text-xs">{b.char}</td>
                      <td className="p-2">
                        <span className={`rounded-full px-2 py-0.5 text-[8px] ${b.isVowel ? 'bg-amber-300/[0.08] text-[color:var(--solar-bright)]' : 'bg-white/[0.05] text-gray-300'}`}>
                          {b.isVowel ? 'Vowel (Soul)' : 'Consonant'}
                        </span>
                      </td>
                      <td className="p-2 font-serif text-amber-200">{b.hebrewLetter}</td>
                      <td className="p-2 text-cyan-300">{b.hebrewValue}</td>
                      <td className="p-2 text-white">{b.ordinalValue}</td>
                      <td className="p-2 text-[color:var(--solar-bright)]">{b.reductionValue}</td>
                      <td className="p-2 text-emerald-300">{b.sumerianValue}</td>
                      <td className="p-2 text-amber-300">{b.chaldeanValue}</td>
                      <td className="p-2 text-sky-300">{b.greekValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Etymological Dossier */}
            <div className="rounded-[var(--radius-md)] border border-emerald-300/10 border-l-2 border-l-emerald-500 bg-emerald-300/[0.025] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold text-emerald-400">
                  Linguistic Etymology & Historical Root Research
                </span>
                <span className="text-[9px] text-gray-500 uppercase">
                  Language: <strong className="text-gray-300">{gematriaEtymology.etymology.originalLanguage}</strong>
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[9px] uppercase text-gray-500">Root Morpheme:</p>
                  <p className="font-serif text-white italic text-sm">{gematriaEtymology.etymology.rootWord}</p>
                  <p className="text-[9px] uppercase text-gray-500 mt-2">Literal Definition:</p>
                  <p className="font-serif text-cyan-300 italic">{gematriaEtymology.etymology.literalDefinition}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase text-gray-500">Living Mythic Archetype:</p>
                  <p className="font-serif text-amber-300 italic">{gematriaEtymology.etymology.archetype}</p>
                  <p className="text-[9px] uppercase text-gray-500 mt-2">Elemental Affinity:</p>
                  <p className="text-gray-300">{gematriaEtymology.etymology.elementalAffinity} Element</p>
                </div>
              </div>
              <p className="font-serif text-xs text-gray-300 italic leading-relaxed pt-2 border-t border-[color:var(--line-soft)]">
                {gematriaEtymology.etymology.etymologicalNarrative}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: DIALECTICAL FORKS IN THE ROAD */}
      {activeSection === 'FORKS' && (
        <div className="space-y-3">
          <div className="instrument-panel instrument-panel-solar space-y-4">
            <div className="border-b border-[color:var(--line-soft)] pb-3">
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm uppercase tracking-wider font-bold text-white">
                  Dialectical Contradictions Mapped as Forks in the Road of Opportunity
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-serif italic mt-0.5">
                The Crucible rejects artificial homogenization. When traditions point in opposing directions, they are mapped here as explicit branches of opportunity, evaluated directly against Gaia's daily energetic overcast.
              </p>
            </div>

            {/* List of Forks */}
            <div className="space-y-4">
              {totalReport.dialecticalForks.map((fork, idx) => (
                <div key={fork.id} className="rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-4 space-y-3">
                  {/* Fork Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[color:var(--line-soft)] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] border border-cyan-300/20 bg-cyan-300/[0.07] text-[10px] font-bold text-[color:var(--temporal-bright)]">
                        0{idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-white font-cinzel">
                        {fork.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
                      {fork.traditionsInvolved.map((trad, tIdx) => (
                        <span key={tIdx} className="rounded-full border border-[color:var(--line-soft)] bg-white/[0.035] px-2 py-0.5">
                          {trad}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* The Apparent Paradox */}
                  <div className="rounded-[var(--radius-sm)] border border-amber-300/10 border-l-2 border-l-[color:var(--solar)] bg-amber-300/[0.025] p-3">
                    <span className="text-[9px] uppercase font-bold text-amber-500 block">The Apparent Contradiction</span>
                    <p className="font-serif text-xs text-gray-300 italic leading-snug mt-0.5">
                      {fork.apparentContradictionDescription}
                    </p>
                  </div>

                  {/* Bifurcated Paths: Alpha vs Beta */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Path Alpha */}
                    <div className="rounded-[var(--radius-md)] border border-cyan-300/15 bg-cyan-300/[0.035] p-4 space-y-2">
                      <div className="flex items-center justify-between border-b border-cyan-300/10 pb-2">
                        <span className="text-[9px] uppercase font-bold text-cyan-400">{fork.forkPathAlpha.pathLabel}</span>
                        <span className="ui-eyebrow text-[color:var(--temporal)]">SOLAR/ACTIVE</span>
                      </div>
                      <h5 className="text-xs font-bold text-white font-cinzel">{fork.forkPathAlpha.title}</h5>
                      <p className="text-[11px] text-gray-300 font-serif italic leading-snug">{fork.forkPathAlpha.leaningStrategy}</p>
                      <div>
                        <span className="text-[8px] uppercase font-bold text-gray-500 block">Prospective Outcomes:</span>
                        <ul className="text-[10px] text-gray-400 list-disc list-inside space-y-0.5 mt-0.5">
                          {fork.forkPathAlpha.potentialOutcomes.map((out, oIdx) => (
                            <li key={oIdx}>{out}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-1 border-t border-cyan-900/40 text-[9px]">
                        <span className="text-amber-400 font-bold uppercase">Speculative Overlay Synergy: </span>
                        <span className="text-gray-400">{fork.forkPathAlpha.resonanceAgainstGaiaOvercast}</span>
                      </div>
                    </div>

                    {/* Path Beta */}
                    <div className="rounded-[var(--radius-md)] border border-amber-300/15 bg-amber-300/[0.035] p-4 space-y-2">
                      <div className="flex items-center justify-between border-b border-amber-300/10 pb-2">
                        <span className="ui-eyebrow text-[color:var(--solar)]">{fork.forkPathBeta.pathLabel}</span>
                        <span className="ui-eyebrow text-[color:var(--solar)]">LUNAR/RECEPTIVE</span>
                      </div>
                      <h5 className="text-xs font-bold text-white font-cinzel">{fork.forkPathBeta.title}</h5>
                      <p className="text-[11px] text-gray-300 font-serif italic leading-snug">{fork.forkPathBeta.leaningStrategy}</p>
                      <div>
                        <span className="text-[8px] uppercase font-bold text-gray-500 block">Prospective Outcomes:</span>
                        <ul className="text-[10px] text-gray-400 list-disc list-inside space-y-0.5 mt-0.5">
                          {fork.forkPathBeta.potentialOutcomes.map((out, oIdx) => (
                            <li key={oIdx}>{out}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t border-amber-300/10 text-[9px]">
                        <span className="text-emerald-400 font-bold uppercase">Speculative Overlay Synergy: </span>
                        <span className="text-gray-400">{fork.forkPathBeta.resonanceAgainstGaiaOvercast}</span>
                      </div>
                    </div>
                  </div>

                  {/* Alchemical Synthesis (Third Way) */}
                  <div className="rounded-[var(--radius-sm)] border border-emerald-300/10 border-l-2 border-l-emerald-500 bg-emerald-300/[0.025] p-3 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-emerald-400">
                      The Higher Alchemical Synthesis (The Middle Pillar)
                    </span>
                    <p className="text-xs font-cinzel font-bold text-white">
                      {fork.alchemicalSynthesis.title}
                    </p>
                    <p className="font-serif text-xs text-gray-300 italic leading-snug">
                      {fork.alchemicalSynthesis.description}
                    </p>
                    <p className="data-readout pt-2 text-[10px]">
                      <strong className="text-gray-400 uppercase text-[9px]">Sovereign Leverage Point:</strong> {fork.alchemicalSynthesis.transcendentLeveragePoint}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: ALL SYSTEMS COMPARATIVE LEDGER */}
      {activeSection === 'SYSTEMS' && (
        <div className="space-y-3">
          <div className="instrument-panel instrument-panel-maya space-y-4">
            <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm uppercase tracking-wider font-bold text-white">
                  Total Multi-Tradition Ledger for Measured Coordinate
                </h3>
              </div>
              <span className="text-[10px] text-gray-400">
                JD {measuredContext.temporal.julianDayUT.toFixed(4)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {/* Maya Long Count */}
              <div className="rounded-[var(--radius-md)] border border-cyan-300/10 border-l-2 border-l-[color:var(--temporal)] bg-cyan-300/[0.025] p-4 space-y-1">
                <span className="text-[9px] uppercase font-bold text-cyan-400">Classical Maya Long Count</span>
                <p className="text-sm font-cinzel font-bold text-white">{measuredContext.mayan.longCount.formatted}</p>
                <p className="text-[10px] text-gray-300">Tzolk'in: {measuredContext.mayan.tzolkin.formatted} (Kin {measuredContext.mayan.kinNumber})</p>
                <p className="text-[10px] text-gray-400">Haab': {measuredContext.mayan.haab.formatted} ({measuredContext.mayan.calendarRound})</p>
              </div>

              {/* Chinese BaZi */}
              <div className="rounded-[var(--radius-md)] border border-emerald-300/10 border-l-2 border-l-emerald-500 bg-emerald-300/[0.025] p-4 space-y-1">
                <span className="text-[9px] uppercase font-bold text-green-400">Chinese BaZi Four Pillars</span>
                <p className="text-sm font-cinzel font-bold text-white">
                  {measuredContext.chinese.yearPillar.stemPinYin}-{measuredContext.chinese.yearPillar.branchPinYin} ({measuredContext.chinese.yearPillar.zodiacAnimal})
                </p>
                <p className="text-[10px] text-gray-300">Dominant Wu Xing: {measuredContext.chinese.dominantElement} Element</p>
                <p className="text-[10px] text-gray-400">Solar Term: {measuredContext.chinese.solarTerm.name}</p>
              </div>

              {/* Dreamspell 13:20 */}
              <div className="rounded-[var(--radius-md)] border border-emerald-300/10 border-l-2 border-l-emerald-500 bg-emerald-300/[0.025] p-4 space-y-1">
                <span className="text-[9px] uppercase font-bold text-emerald-400">Dreamspell 13:20 Galactic Signature</span>
                <p className="text-xs font-cinzel font-bold text-white">{measuredContext.dreamspell.signature}</p>
                <p className="text-[10px] text-gray-300">{measuredContext.dreamspell.thirteenMoon.moonName} (Day {measuredContext.dreamspell.thirteenMoon.dayOfMoon}/28)</p>
                <p className="text-[10px] text-gray-400">Radial Plasma: {measuredContext.dreamspell.thirteenMoon.radialPlasma.name}</p>
              </div>

              {/* Egyptian Sothic */}
              <div className="rounded-[var(--radius-md)] border border-amber-300/10 border-l-2 border-l-[color:var(--solar)] bg-amber-300/[0.025] p-4 space-y-1">
                <span className="text-[9px] uppercase font-bold text-amber-400">Ancient Egyptian Sothic Civil</span>
                <p className="text-sm font-cinzel font-bold text-white">Year {measuredContext.egyptian.civilYear}, {measuredContext.egyptian.monthName}</p>
                <p className="text-[10px] text-gray-300">Season of {measuredContext.egyptian.season} (Day {measuredContext.egyptian.dayOfMonth})</p>
                <p className="text-[10px] text-gray-400">Sothic Great Year: {measuredContext.egyptian.sothicYearInCycle}/1460</p>
              </div>

              {/* Greek Attic */}
              <div className="rounded-[var(--radius-md)] border border-cyan-300/10 border-l-2 border-l-[color:var(--temporal)] bg-cyan-300/[0.025] p-4 space-y-1">
                <span className="text-[9px] uppercase font-bold text-indigo-400">Attic Lunisolar Metonic</span>
                <p className="text-sm font-cinzel font-bold text-white">Month of {measuredContext.greek.atticMonthName}</p>
                <p className="text-[10px] text-gray-300">Metonic Cycle Year {measuredContext.greek.metonicCycleYear}/19</p>
                <p className="text-[10px] text-gray-400">Patron Deity: {measuredContext.greek.patronDeity}</p>
              </div>

              {/* Enochian / Biblical / Roman */}
              <div className="rounded-[var(--radius-md)] border border-amber-300/10 border-l-2 border-l-[color:var(--solar)] bg-amber-300/[0.025] p-4 space-y-1 md:col-span-2">
                <span className="text-[9px] uppercase font-bold text-amber-400">Enochian · Biblical Tekufot · Roman Dies</span>
                <p className="text-sm font-cinzel font-bold text-white">{measuredContext.enochianBiblical.enochian.formatted}</p>
                <p className="text-[10px] text-gray-300">
                  {measuredContext.enochianBiblical.biblicalSeason.hebrewTekufah} · Verses: {measuredContext.enochianBiblical.biblicalTransits.seasonVerseAnchors.join(', ')}
                </p>
                <p className="text-[10px] text-gray-400">
                  {measuredContext.enochianBiblical.gregorianWeekdayDeity.latinDies} ({measuredContext.enochianBiblical.gregorianWeekdayDeity.romanDeity}) · Hour of {measuredContext.enochianBiblical.currentPlanetaryHour.planet} · Flip N→{measuredContext.enochianBiblical.compassOrientation.directionRemap.North}
                </p>
                <p className="font-serif text-[10px] text-gray-400 italic mt-1 leading-snug">
                  {measuredContext.enochianBiblical.abPeek.synthesis.summary}
                </p>
              </div>

              {/* Twelve Tribes Matrix */}
              <div className="rounded-[var(--radius-md)] border border-cyan-300/10 border-l-2 border-l-[color:var(--temporal)] bg-cyan-300/[0.025] p-4 space-y-1">
                <span className="ui-eyebrow text-[color:var(--temporal)]">Twelve Tribes Sanctuary Affinity</span>
                <p className="text-sm font-cinzel font-bold text-white">
                  {measuredContext.synthesis.topResonatingTribe.tribe}
                </p>
                <p className="text-[10px] text-gray-300">Direction: {measuredContext.synthesis.topResonatingTribe.directionInCamp} Camp ({measuredContext.synthesis.topResonatingTribe.affinityScore}% affinity)</p>
                <p className="text-[10px] text-gray-400">Stone: {measuredContext.synthesis.topResonatingTribe.gemstone}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: LIVE MACHINE-READABLE JSON & JSONL LEDGER */}
      {activeSection === 'JSON_DATA' && (
        <div className="space-y-3">
          <div className="instrument-panel space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--line-soft)] pb-3">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm uppercase tracking-wider font-bold text-white">
                  Encoded Machine-Readable Interchange Ledger (JSON & JSONL)
                </h3>
              </div>

              {/* Format Selector & Actions */}
              <div className="flex items-center gap-2 text-[10px]">
                <div className="flex items-center rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-white/[0.025] p-1">
                  <button
                    onClick={() => setJsonFormat('JSON')}
                    className={`nav-tab !px-2 !py-1 text-[10px] uppercase ${
                      jsonFormat === 'JSON' ? 'nav-tab-active bg-cyan-300/[0.06]' : ''
                    }`}
                  >
                    Structured JSON
                  </button>
                  <button
                    onClick={() => setJsonFormat('JSONL')}
                    className={`nav-tab !px-2 !py-1 text-[10px] uppercase ${
                      jsonFormat === 'JSONL' ? 'nav-tab-active bg-cyan-300/[0.06]' : ''
                    }`}
                  >
                    Streaming JSONL
                  </button>
                </div>

                <button
                  onClick={handleCopy}
                  className="cta-ghost min-h-0 px-3 py-2 text-[10px]"
                >
                  {copiedNotification ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedNotification ? 'Copied!' : `Copy ${jsonFormat}`}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="cta-primary min-h-0 px-3 py-2 text-[10px]"
                >
                  <Download className="w-3 h-3" />
                  <span>Download .{jsonFormat.toLowerCase()}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-serif italic">
              Full serialization of querent birthdata, Gaia overcast profile, multi-cipher Gematria, etymological trees, fused numerology, dialectical contradiction branches, and total cross-system ledgers.
            </p>

            {/* Code Display Area */}
            <div className="relative">
              <pre className="data-readout max-h-[500px] overflow-x-auto rounded-[var(--radius-md)] border border-[color:var(--line-soft)] bg-black/25 p-4 text-[10px] leading-tight text-cyan-200 selection:bg-cyan-900 selection:text-white">
                {jsonFormat === 'JSON' ? formattedJSON : formattedJSONL}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Sourced Research Citations Ledger */}
      <div className="instrument-panel instrument-panel-solar !p-4 space-y-3">
        <div className="flex items-center gap-2 border-b border-[color:var(--line-soft)] pb-2">
          <BookOpen className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Sourced Research Citations & Academic Network Ledgers
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-[10px]">
          {totalReport.researchNetworkingCitations.map((cit, idx) => (
            <div key={idx} className="rounded-[var(--radius-sm)] border border-[color:var(--line-soft)] bg-white/[0.025] p-3">
              <span className="text-cyan-400 font-bold block">{cit.source}</span>
              <span className="text-gray-500 uppercase text-[8px] block">{cit.domain}</span>
              <span className="text-gray-400 italic text-[9px] block mt-0.5">{cit.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Today's Daily Energy Report Modal */}
      <DailyEnergyReportModal
        ctx={currentCtx}
        isOpen={isDailyReportModalOpen}
        onClose={() => setIsDailyReportModalOpen(false)}
      />
    </div>
  );
};

