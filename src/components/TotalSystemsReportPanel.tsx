/**
 * The Crucible — Full report
 *
 * Enter a name and a date to get one long written report:
 * summary, Earth and sky conditions, name analysis, places where
 * traditions disagree, each tradition's reading, and a data file.
 */

import React, { useState, useMemo, useRef } from 'react';
import { Download, Copy, Check, Search, RotateCcw, Sun } from 'lucide-react';
import { CompleteCalculationContext, LocationCoordinates, TemporalInput } from '../types';
import { calculateGematriaEtymology, GematriaCipherResult } from '../engine/gematriaEtymology';
import { buildTotalSystemsReport } from '../engine/gaiaOvercastForks';
import { executeCrucibleCalculation } from '../engine/crucibleCore';
import { DailyEnergyReportModal } from './DailyEnergyReportModal';
import { PlanetGlyph } from './symbols/AstroGlyph';
import { CultureHeader, CallingEmblem, Script, HANZI_ANIMALS } from './symbols/CultureSymbols';


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
  const reportRef = useRef<HTMLDivElement>(null);

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
        title: 'The Crucible — full report',
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
        topCalling: measuredContext.synthesis.topCalling,
        intertwining: {
          primaryCallingLife: measuredContext.intertwining.primaryCallingLife,
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
        setNetworkResearchOutput('The online research finished, but no text came back. Please try again.');
      }
    } catch (err: any) {
      console.error('Research networking error:', err);
      setNetworkResearchOutput(`Online research is not available right now. Here is what the built-in notes say about the name: ${gematriaEtymology.etymology.etymologicalNarrative}`);
    } finally {
      setIsResearching(false);
    }
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSection('OVERVIEW');
    reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const gaia = totalReport.gaiaOvercast;
  const eb = measuredContext.enochianBiblical;
  const calling = measuredContext.synthesis.topCalling;
  const reportHeading = `${subjectName || 'No name entered yet'}${measurementReason ? ` — ${measurementReason}` : ''}`;
  const yearAnimal = measuredContext.chinese.yearPillar.zodiacAnimal;

  const sectionTabs = [
    { id: 'OVERVIEW', label: 'Summary' },
    { id: 'GAIA', label: 'Earth and sky conditions' },
    { id: 'GEMATRIA', label: 'Name analysis' },
    { id: 'FORKS', label: 'Where traditions disagree' },
    { id: 'SYSTEMS', label: 'Each tradition' },
    { id: 'JSON_DATA', label: 'Data file' }
  ] as const;

  return (
    <div className="space-y-5 motion-enter">
      {/* Input form */}
      <form className="instrument-panel space-y-4" onSubmit={handleCreateReport}>
        <div>
          <p className="ui-eyebrow">Who and when</p>
          <p className="readable-muted mt-1">
            Enter a name and a date, such as a birthday or the day of an event. Leave the date empty to use the
            day shown in Today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="block space-y-1">
            <span className="field-label">Name</span>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="For example, Alexander"
              className="field-input w-full"
            />
            <span className="field-help">Used for the name analysis. Optional.</span>
          </label>

          <label className="block space-y-1">
            <span className="field-label">Date</span>
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="field-input w-full"
            />
            <span className="field-help">A birthday or any other day that matters to you.</span>
          </label>

          <label className="block space-y-1">
            <span className="field-label">Time</span>
            <input
              type="time"
              step="1"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              className="field-input w-full"
            />
            <span className="field-help">In universal time (UTC). Leave at noon if you do not know it.</span>
          </label>

          <label className="block space-y-1">
            <span className="field-label">Place</span>
            <input
              type="text"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              placeholder="For example, Alexandria"
              className="field-input w-full"
            />
            <span className="field-help">The town or city. This is a label only.</span>
          </label>

          <div className="space-y-1">
            <span className="field-label">Map position of the place</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.001"
                value={inputLat}
                onChange={(e) => setInputLat(parseFloat(e.target.value) || 0)}
                className="field-input w-full"
                aria-label="Latitude"
                title="Latitude"
              />
              <input
                type="number"
                step="0.001"
                value={inputLng}
                onChange={(e) => setInputLng(parseFloat(e.target.value) || 0)}
                className="field-input w-full"
                aria-label="Longitude"
                title="Longitude"
              />
            </div>
            <span className="field-help">Latitude, then longitude, in degrees. The calculations use these numbers.</span>
          </div>

          <label className="block space-y-1">
            <span className="field-label">What this date is</span>
            <input
              type="text"
              value={measurementReason}
              onChange={(e) => setMeasurementReason(e.target.value)}
              placeholder="For example, my birthday"
              className="field-input w-full"
            />
            <span className="field-help">A short note shown in the report title. Optional.</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="cta-primary">
            Create report
          </button>
          <button type="button" onClick={handleSyncToCurrent} className="cta-ghost">
            <RotateCcw className="w-4 h-4" />
            <span>Use the day shown in Today</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDailyReportModalOpen(true)}
            className="cta-ghost"
            title="Open the detailed report for the day shown in Today"
          >
            <Sun className="w-4 h-4" />
            <span>Open today's detailed report</span>
          </button>
        </div>
        <p className="field-help">The report below updates as you type.</p>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[color:var(--line-soft)]">
          <span className="readable-muted">Or try an example:</span>
          <button
            type="button"
            onClick={() => handlePresetSelect('Alexander', '1988-08-08', 'Alexandria', 31.2001, 29.9187, 'Example: a protector')}
            className="explore-tab"
          >
            Alexander
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect('Sophia', '1995-03-21', 'Athens', 37.9838, 23.7275, 'Example: wisdom')}
            className="explore-tab"
          >
            Sophia
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect('Leonardo', '1452-04-15', 'Vinci', 43.7874, 10.9265, 'Example: Leonardo da Vinci\'s birthday')}
            className="explore-tab"
          >
            Leonardo da Vinci
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect('Hermes', '2000-01-01', 'Giza', 29.9792, 31.1342, 'Example: a legendary teacher')}
            className="explore-tab"
          >
            Hermes
          </button>
        </div>
      </form>

      {/* Report header + section choice */}
      <div ref={reportRef} className="instrument-panel space-y-4 scroll-mt-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="ui-eyebrow">Report for</p>
            <h3 className="panel-title">{reportHeading}</h3>
            <p className="readable-muted mt-1">
              {inputDate
                ? `${inputDate} at ${inputTime || '12:00:00'} UTC${inputCity ? `, ${inputCity}` : ''}`
                : `No date entered, so this uses the day shown in Today (${currentCtx.input.dateString}).`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleInitiateDeepResearch}
            disabled={isResearching}
            className="cta-ghost"
            title="Look up the name and date online and add a written summary"
          >
            <Search className={`w-4 h-4 ${isResearching ? 'animate-pulse' : ''}`} />
            <span>{isResearching ? 'Researching…' : 'Add online research'}</span>
          </button>
        </div>

        <div className="explore-tabs" role="tablist" aria-label="Report sections">
          {sectionTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeSection === tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`explore-tab ${activeSection === tab.id ? 'explore-tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Online research result */}
      {networkResearchOutput && (
        <div className="instrument-panel motion-enter space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="ui-eyebrow">Online research</p>
            <button type="button" onClick={() => setNetworkResearchOutput(null)} className="cta-ghost">
              Hide
            </button>
          </div>
          <p className="readable-body whitespace-pre-line">{networkResearchOutput}</p>
        </div>
      )}

      {/* Summary */}
      {activeSection === 'OVERVIEW' && (
        <div className="instrument-panel space-y-5">
          <div>
            <p className="ui-eyebrow">Summary</p>
            <p className="readable-body whitespace-pre-line mt-2">{totalReport.executiveSynthesizedTreatise}</p>
          </div>

          <div>
            <p className="ui-eyebrow">Key numbers</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
              <div className="curious-box">
                <p className="readable-muted">Life path number</p>
                <p className="trad-hero-value">{measuredContext.numerology.lifePathNumber}</p>
                <p className="readable-muted">
                  The digits of the date added together
                  {measuredContext.numerology.lifePathIsMaster ? '. 11, 22 and 33 are called master numbers.' : '.'}
                </p>
              </div>
              <div className="curious-box">
                <p className="readable-muted">Name number</p>
                <p className="trad-hero-value">{gematriaEtymology.fusedNumerology.expressionNumber}</p>
                <p className="readable-muted">All the letters of the name added together.</p>
              </div>
              <div className="curious-box">
                <p className="readable-muted">Heart's desire number</p>
                <p className="trad-hero-value">{gematriaEtymology.fusedNumerology.soulUrgeNumber}</p>
                <p className="readable-muted">Only the vowels of the name added together.</p>
              </div>
              <div className="curious-box">
                <p className="readable-muted">Hebrew letter total</p>
                <p className="trad-hero-value">{gematriaEtymology.ciphers.hebrewStandard.totalSum}</p>
                <p className="readable-muted">
                  From gematria (adding up the number values of letters), using the Hebrew alphabet.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="ui-eyebrow">The name and the date together</p>
            <p className="readable-body mt-2">{gematriaEtymology.fusedNumerology.fusedLiteraryMonograph}</p>
          </div>

          <p className="chart-note">
            These readings come from traditions and are offered for reflection. They are not predictions.
          </p>
        </div>
      )}

      {/* Earth and sky conditions */}
      {activeSection === 'GAIA' && (
        <div className="instrument-panel space-y-5">
          <div>
            <p className="ui-eyebrow">Earth and sky conditions on {gaia.date}</p>
            <p className="chart-note mt-2">
              These figures are estimates worked out from the date. They are not live measurements.
            </p>
            <p className="readable-body mt-3">{gaia.literaryOvercastDossier}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="curious-box space-y-1">
              <p className="readable-muted">Magnetic activity around the Earth</p>
              <p className="trad-hero-value">{gaia.geomagneticStatus}</p>
              <p className="readable-muted">
                Kp index {gaia.geomagneticKpEstimated} on a scale of 0 (calm) to 9 (severe storm). It rises when the
                solar wind disturbs the Earth's magnetic field.
              </p>
            </div>

            <div className="curious-box space-y-1">
              <p className="readable-muted">Earth's background hum</p>
              <p className="trad-hero-value">{gaia.schumannFrequencyHz} Hz</p>
              <p className="readable-muted">
                {gaia.schumannResonanceMode}. This is the Schumann resonance, a natural radio hum between the ground
                and the upper atmosphere, usually near 7.83 Hz.
              </p>
            </div>

            <div className="curious-box space-y-1">
              <p className="readable-muted">Tension between the planets</p>
              <p className="trad-hero-value">{gaia.celestialAspectTensionScore} out of 100</p>
              <div className="score-track">
                <div
                  className="score-fill"
                  style={{ width: `${Math.max(0, Math.min(100, gaia.celestialAspectTensionScore))}%` }}
                />
              </div>
              <p className="readable-muted">
                {gaia.collectiveFieldPolarity}. Higher means more planets sit at angles astrologers read as
                difficult.
              </p>
            </div>
          </div>

          <dl className="trad-facts">
            <dt>Moon</dt>
            <dd>
              {gaia.lunarIlluminationPercent}% lit ({gaia.lunarTone})
            </dd>
            <dt>Leading element</dt>
            <dd>{gaia.dominantElementalAtmosphere} (one of the five Chinese elements)</dd>
            <dt>Solar term</dt>
            <dd>{gaia.solarTermPhase} (one of 24 Chinese season markers)</dd>
            <dt>Overall mood</dt>
            <dd>{gaia.collectiveFieldPolarity.split(' ')[0]}</dd>
          </dl>
        </div>
      )}

      {/* Name analysis */}
      {activeSection === 'GEMATRIA' && (
        <div className="instrument-panel space-y-5">
          <CultureHeader culture="numerology" title={`Name analysis for “${subjectName || 'no name yet'}”`} />
          <p className="trad-meaning">
            <strong>In plain words:</strong> gematria (adding up the number values of letters) gives each letter a
            number and adds them up. Different traditions number the letters differently, so the same name gets
            several totals. Each total is then reduced to a single digit by adding its own digits.
          </p>

          <div>
            <p className="ui-eyebrow">Totals by method</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
              {Object.entries(gematriaEtymology.ciphers).slice(0, 6).map(([key, rawCipher]) => {
                const c = rawCipher as GematriaCipherResult;
                return (
                  <div key={key} className="curious-box space-y-1">
                    <p className="readable-muted" title={c.cipherName}>
                      {c.cipherName.split('(')[0]}
                    </p>
                    <p className="trad-hero-value">{c.totalSum}</p>
                    <p className="readable-muted">
                      Reduces to {c.reducedRoot}
                      {c.resonantKeywords[0] ? `. Theme: ${c.resonantKeywords[0]}` : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="ui-eyebrow">Letter by letter</p>
            <div className="overflow-x-auto rounded-xl border border-[color:var(--line-soft)] bg-white mt-2">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[color:var(--line-soft)] text-[color:var(--text-muted)]">
                  <tr>
                    <th className="p-2 font-semibold">Letter</th>
                    <th className="p-2 font-semibold">Kind</th>
                    <th className="p-2 font-semibold">Hebrew letter</th>
                    <th className="p-2 font-semibold">Hebrew value</th>
                    <th className="p-2 font-semibold">Place in alphabet (1–26)</th>
                    <th className="p-2 font-semibold">Single digit (1–9)</th>
                    <th className="p-2 font-semibold">Place × 6 (Sumerian)</th>
                    <th className="p-2 font-semibold">Chaldean value</th>
                    <th className="p-2 font-semibold">Greek value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--line-soft)] text-[color:var(--text-secondary)]">
                  {gematriaEtymology.letterBreakdowns.map((b, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-semibold text-[color:var(--text-primary)]">{b.char}</td>
                      <td className="p-2">{b.isVowel ? 'Vowel' : 'Consonant'}</td>
                      <td className="p-2">
                        <Script lang="he">{b.hebrewLetter}</Script>
                      </td>
                      <td className="p-2">{b.hebrewValue}</td>
                      <td className="p-2">{b.ordinalValue}</td>
                      <td className="p-2">{b.reductionValue}</td>
                      <td className="p-2">{b.sumerianValue}</td>
                      <td className="p-2">{b.chaldeanValue}</td>
                      <td className="p-2">{b.greekValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="ui-eyebrow">Where the name comes from</p>
            <dl className="trad-facts mt-2">
              <dt>Language</dt>
              <dd>{gematriaEtymology.etymology.originalLanguage}</dd>
              <dt>Root word</dt>
              <dd>{gematriaEtymology.etymology.rootWord}</dd>
              <dt>Literal meaning</dt>
              <dd>{gematriaEtymology.etymology.literalDefinition}</dd>
              <dt>Character type</dt>
              <dd>{gematriaEtymology.etymology.archetype}</dd>
              <dt>Linked element</dt>
              <dd>{gematriaEtymology.etymology.elementalAffinity}</dd>
            </dl>
            <p className="readable-body mt-3">{gematriaEtymology.etymology.etymologicalNarrative}</p>
          </div>
        </div>
      )}

      {/* Where traditions disagree */}
      {activeSection === 'FORKS' && (
        <div className="space-y-4">
          <div className="instrument-panel">
            <p className="ui-eyebrow">Where traditions disagree</p>
            <p className="readable-body mt-2">
              The traditions do not always point the same way. When they disagree, this report does not blend them
              into one answer. It shows both options side by side, plus a middle way, so you can choose.
            </p>
          </div>

          {totalReport.dialecticalForks.map((fork, idx) => (
            <div key={fork.id} className="instrument-panel space-y-4">
              <div>
                <p className="ui-eyebrow">Choice {idx + 1}</p>
                <h4 className="panel-title">{fork.title}</h4>
                <p className="readable-muted mt-1">Traditions involved: {fork.traditionsInvolved.join(', ')}</p>
              </div>

              <div className="chart-note">
                <strong>The disagreement:</strong> {fork.apparentContradictionDescription}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {([
                  { path: fork.forkPathAlpha, label: 'Option A: the active approach' },
                  { path: fork.forkPathBeta, label: 'Option B: the receptive approach' }
                ] as const).map(({ path, label }) => (
                  <div key={label} className="curious-box space-y-2">
                    <p className="ui-eyebrow">{label}</p>
                    <p className="trad-hero-value">{path.title}</p>
                    <p className="readable-body">{path.leaningStrategy}</p>
                    <div>
                      <p className="readable-muted">What might follow</p>
                      <ul className="curious-list">
                        {path.potentialOutcomes.map((out, oIdx) => (
                          <li key={oIdx}>{out}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="readable-muted">
                      <strong>How it fits the day's conditions:</strong> {path.resonanceAgainstGaiaOvercast}
                    </p>
                  </div>
                ))}
              </div>

              <div className="trad-meaning">
                <strong>A middle way: {fork.alchemicalSynthesis.title}.</strong> {fork.alchemicalSynthesis.description}
                <br />
                <strong>Where to put your effort:</strong> {fork.alchemicalSynthesis.transcendentLeveragePoint}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Each tradition */}
      {activeSection === 'SYSTEMS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="instrument-panel space-y-3">
              <CultureHeader culture="maya" />
              <dl className="trad-facts">
                <dt>Long Count</dt>
                <dd>{measuredContext.mayan.longCount.formatted} (a running count of days)</dd>
                <dt>Tzolk'in</dt>
                <dd>
                  {measuredContext.mayan.tzolkin.formatted}, day {measuredContext.mayan.kinNumber} of the 260-day sacred count
                </dd>
                <dt>Haab'</dt>
                <dd>{measuredContext.mayan.haab.formatted} (the 365-day year)</dd>
                <dt>Both together</dt>
                <dd>{measuredContext.mayan.calendarRound}</dd>
              </dl>
            </div>

            <div className="instrument-panel space-y-3">
              <CultureHeader culture="chinese" />
              <dl className="trad-facts">
                <dt>Year</dt>
                <dd>
                  {HANZI_ANIMALS[yearAnimal] && (
                    <>
                      <Script lang="zh">{HANZI_ANIMALS[yearAnimal]}</Script>{' '}
                    </>
                  )}
                  {yearAnimal} ({measuredContext.chinese.yearPillar.stemPinYin}-
                  {measuredContext.chinese.yearPillar.branchPinYin})
                </dd>
                <dt>Strongest element</dt>
                <dd>{measuredContext.chinese.dominantElement} (of the five Chinese elements)</dd>
                <dt>Solar term</dt>
                <dd>{measuredContext.chinese.solarTerm.name} (a season marker)</dd>
              </dl>
            </div>

            <div className="instrument-panel space-y-3">
              <CultureHeader culture="dreamspell" />
              <dl className="trad-facts">
                <dt>Day name</dt>
                <dd>{measuredContext.dreamspell.signature}</dd>
                <dt>Month</dt>
                <dd>
                  {measuredContext.dreamspell.thirteenMoon.moonName}, day{' '}
                  {measuredContext.dreamspell.thirteenMoon.dayOfMoon} of 28 (the year has 13 such months)
                </dd>
                <dt>Weekday</dt>
                <dd>{measuredContext.dreamspell.thirteenMoon.radialPlasma.name} (Dreamspell calls weekdays “plasmas”)</dd>
              </dl>
            </div>

            <div className="instrument-panel space-y-3">
              <CultureHeader culture="egyptian" />
              <dl className="trad-facts">
                <dt>Date</dt>
                <dd>
                  Year {measuredContext.egyptian.civilYear}, {measuredContext.egyptian.monthName}, day{' '}
                  {measuredContext.egyptian.dayOfMonth}
                </dd>
                <dt>Season</dt>
                <dd>{measuredContext.egyptian.season}</dd>
                <dt>Sirius cycle</dt>
                <dd>Year {measuredContext.egyptian.sothicYearInCycle} of 1,460 (how long the calendar takes to realign with the star Sirius)</dd>
              </dl>
            </div>

            <div className="instrument-panel space-y-3">
              <CultureHeader culture="greek" />
              <dl className="trad-facts">
                <dt>Athenian month</dt>
                <dd>{measuredContext.greek.atticMonthName}</dd>
                <dt>Cycle year</dt>
                <dd>{measuredContext.greek.metonicCycleYear} of 19 (the cycle that lines up Sun and Moon)</dd>
                <dt>Month's god</dt>
                <dd>{measuredContext.greek.patronDeity}</dd>
              </dl>
            </div>

            <div className="instrument-panel space-y-3">
              <CultureHeader culture="callings" title="Today's calling" />
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
                <dt>Match score</dt>
                <dd>{calling.affinityScore}%</dd>
              </dl>
            </div>
          </div>

          <div className="instrument-panel space-y-3">
            <CultureHeader culture="hebrew" title="Seasons, the 364-day calendar and the Roman weekday" />
            <dl className="trad-facts">
              <dt>Enoch calendar</dt>
              <dd>{eb.enochian.formatted} (an ancient 364-day year)</dd>
              <dt>Season</dt>
              <dd>{eb.biblicalSeason.hebrewTekufah}</dd>
              <dt>Bible verses</dt>
              <dd>{eb.biblicalTransits.seasonVerseAnchors.join(', ')}</dd>
              <dt>Latin weekday</dt>
              <dd>
                {eb.gregorianWeekdayDeity.latinDies}, named for {eb.gregorianWeekdayDeity.romanDeity}
              </dd>
              <dt>Planet of the hour</dt>
              <dd>
                <PlanetGlyph planet={String(eb.currentPlanetaryHour.planet).toLowerCase()} size={16} tinted />{' '}
                {eb.currentPlanetaryHour.planet} (an old custom gives each hour to a planet)
              </dd>
            </dl>
            <p className="readable-body">{eb.abPeek.synthesis.summary}</p>
            <details>
              <summary className="readable-muted cursor-pointer">Technical details</summary>
              <dl className="trad-facts mt-2">
                <dt>Compass</dt>
                <dd>In the Enoch reading, north is read as {eb.compassOrientation.directionRemap.North}</dd>
                <dt>Julian day</dt>
                <dd>{measuredContext.temporal.julianDayUT.toFixed(4)} (astronomers' running day count)</dd>
                <dt>Map position</dt>
                <dd>
                  {inputLat.toFixed(2)}°, {inputLng.toFixed(2)}°
                </dd>
              </dl>
            </details>
          </div>
        </div>
      )}

      {/* Data file */}
      {activeSection === 'JSON_DATA' && (
        <div className="instrument-panel space-y-4">
          <div>
            <p className="ui-eyebrow">Data file</p>
            <p className="readable-body mt-2">
              Everything in this report as raw data, for use in a spreadsheet or another program. You do not need
              this to read the report.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="seg">
              <button
                type="button"
                onClick={() => setJsonFormat('JSON')}
                className={`seg-btn ${jsonFormat === 'JSON' ? 'seg-btn-active' : ''}`}
                title="One structured document"
              >
                JSON
              </button>
              <button
                type="button"
                onClick={() => setJsonFormat('JSONL')}
                className={`seg-btn ${jsonFormat === 'JSONL' ? 'seg-btn-active' : ''}`}
                title="One record per line"
              >
                JSON Lines
              </button>
            </div>

            <button type="button" onClick={handleCopy} className="cta-ghost">
              {copiedNotification ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedNotification ? 'Copied' : 'Copy to clipboard'}</span>
            </button>

            <button type="button" onClick={handleDownload} className="cta-ghost">
              <Download className="w-4 h-4" />
              <span>Download as file (.{jsonFormat.toLowerCase()})</span>
            </button>
          </div>

          <pre className="max-h-[500px] overflow-auto rounded-xl border border-[color:var(--line-soft)] bg-white p-4 text-xs leading-snug text-[color:var(--text-secondary)]">
            {jsonFormat === 'JSON' ? formattedJSON : formattedJSONL}
          </pre>
        </div>
      )}

      {/* Sources */}
      <div className="instrument-panel space-y-3">
        <p className="ui-eyebrow">Sources and further reading</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {totalReport.researchNetworkingCitations.map((cit, idx) => (
            <div key={idx} className="curious-box">
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">{cit.source}</p>
              <p className="readable-muted">{cit.domain}</p>
              <p className="text-sm text-[color:var(--text-secondary)] mt-1">{cit.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed report for the day shown in Today */}
      <DailyEnergyReportModal
        ctx={currentCtx}
        isOpen={isDailyReportModalOpen}
        onClose={() => setIsDailyReportModalOpen(false)}
      />
    </div>
  );
};
