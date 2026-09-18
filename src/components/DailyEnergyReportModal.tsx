/**
 * The Crucible — Today's Daily Report & Energy of the Day Dossier
 * Comprehensive, novel-like analysis of Gaia's energetic overcast and celestial transits.
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Sun,
  Moon,
  Compass,
  Copy,
  Check,
  Download,
  Calendar,
  Sparkles,
  Flame,
  Globe,
  Radio,
  Share2,
  ShieldCheck,
  ChevronRight,
  GitFork,
  BookOpen,
  Zap
} from 'lucide-react';
import { DailyEnergyReport, CompleteCalculationContext } from '../types';
import { generateTodayDailyReport } from '../engine/dailyEnergyReport';
import { getActiveProfile } from '../engine/crucibleProfile';
import { executeCrucibleCalculation } from '../engine/crucibleCore';
import { buildChartDynamicsReport } from '../engine/chartDynamics';
import { buildCompassContextPacket } from '../engine/almanac';
import { ScrollCard, ScrollMetric, ScrollProse } from './ui/ScrollCard';

interface DailyEnergyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: DailyEnergyReport;
  ctx?: CompleteCalculationContext;
  onSyncToday?: () => void;
}

export const DailyEnergyReportModal: React.FC<DailyEnergyReportModalProps> = ({
  isOpen,
  onClose,
  report: passedReport,
  ctx,
  onSyncToday
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'MONOGRAPH' | 'VEDIC_SIDEREAL_ASTEROIDS' | 'GAIA' | 'TRANSITS' | 'CALENDRICS' | 'STRATEGY'
  >('OVERVIEW');
  const [expandedMonograph, setExpandedMonograph] = useState<string | null>(null);
  const [isExpanding, setIsExpanding] = useState<boolean>(false);
  const [expansionError, setExpansionError] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string>('ALL');

  const report = useMemo<DailyEnergyReport | null>(() => {
    if (passedReport) return passedReport;
    try {
      return generateTodayDailyReport(ctx);
    } catch (err) {
      console.error('Failed to generate daily report:', err);
      return null;
    }
  }, [passedReport, ctx]);

  const chartDynamics = useMemo(() => {
    if (!ctx) return null;
    const profile = getActiveProfile();
    if (!profile) return null;
    try {
      const natalCtx = executeCrucibleCalculation(
        { ...profile.birth, querentName: profile.querentName || profile.displayName },
        'GMT_584283'
      );
      return buildChartDynamicsReport(natalCtx, ctx, 'GMT_584283');
    } catch {
      return null;
    }
  }, [ctx]);

  if (!isOpen || !report) return null;


  const handleCopy = () => {
    const text = `THE CRUCIBLE — DAILY BRIEFING
${report.gregorianFormatted} (JD ${report.julianDayUT})
Universal Day ${report.universalDayNumber} · ${report.dominantTone}

${report.executiveSynthesis}

---
FIELD [speculative overlay]
- Geomagnetic Field: ${report.gaiaOvercast.geomagneticStatus} (Kp: ${report.gaiaOvercast.geomagneticKp})
- Schumann Resonance: ${report.gaiaOvercast.schumannFrequencyHz} Hz
- Cosmic Tension Score: ${report.gaiaOvercast.aspectTensionScore}/100
- Collective Polarity: ${report.gaiaOvercast.collectivePolarity}
- Lunar Illumination: ${report.gaiaOvercast.lunarIlluminationPercent}% (${report.gaiaOvercast.lunarPhaseName})
- Solar Term: ${report.gaiaOvercast.solarTerm}

SKY
- Sun: ${report.celestialWeather.sunPosition}
- Moon: ${report.celestialWeather.moonPosition}
- Retrograde Spheres: ${report.celestialWeather.retrogradeBodies.join(', ')}

CALENDARS
- Mayan: Long Count ${report.mayanProfile.longCount} | Kin ${report.mayanProfile.kinNumber} (${report.mayanProfile.tzolkinFormatted}) | Tone ${report.mayanProfile.solarTone} | Haab' ${report.mayanProfile.haabFormatted}
- Chinese BaZi: Day ${report.chineseProfile.dayPillar} | Month ${report.chineseProfile.monthPillar} | Year ${report.chineseProfile.yearPillar}
- Egyptian Civil: ${report.ancientCalendars.egyptian}
- Ethiopian Ge'ez: ${report.ancientCalendars.ethiopian}
- Greek Attic: ${report.ancientCalendars.greekAttic}

GENE KEYS & TRIBE LENS
- Solar Transit: Gate ${report.geneKeyTransit.sunGate}.${report.geneKeyTransit.line} (${report.geneKeyTransit.name})
  Shadow: ${report.geneKeyTransit.shadow} -> Gift: ${report.geneKeyTransit.gift} -> Siddhi: ${report.geneKeyTransit.siddhi}
- Twelve Tribes Alignment: ${report.twelveTribesResonance.primaryTribe} (${report.twelveTribesResonance.campDirection} Camp, Stone: ${report.twelveTribesResonance.gemstone})

TODAY'S MOVE
${report.dailyStrategicActionPlan.goldenThread}
- Peak Power Window: ${report.dailyStrategicActionPlan.peakPowerWindow}
- What to Harness:
${report.dailyStrategicActionPlan.whatToHarness.map((h) => `  * ${h}`).join('\n')}
- What to Avoid:
${report.dailyStrategicActionPlan.whatToAvoid.map((a) => `  * ${a}`).join('\n')}

THE FORK
${report.dailyStrategicActionPlan.dialecticalFork.title}
A: ${report.dailyStrategicActionPlan.dialecticalFork.choiceA}
B: ${report.dailyStrategicActionPlan.dialecticalFork.choiceB}
Third read: ${report.dailyStrategicActionPlan.dialecticalFork.syntheticResolution}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `Crucible-Daily-Energy-Report-${report.dateString}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExpandMonograph = async () => {
    setIsExpanding(true);
    setExpansionError(null);
    try {
      const res = await fetch('/api/daily-report/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report,
          context: ctx,
          almanacPacket: ctx ? buildCompassContextPacket(ctx, getActiveProfile()) : undefined
        })
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      if (data.expandedMonograph) {
        setExpandedMonograph(data.expandedMonograph);
      }
    } catch (err: any) {
      console.error('Monograph expansion failed:', err);
      setExpansionError(err.message || 'Expansion request timed out.');
    } finally {
      setIsExpanding(false);
    }
  };

  const currentMonographText = expandedMonograph || report.extendedMonograph || report.executiveSynthesis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(44,36,25,0.45)] backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl scroll-sheet parchment-surface rounded-[var(--radius-lg)] flex flex-col max-h-[92vh] overflow-hidden motion-enter">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--line-soft)] bg-[color:var(--surface-raised)]">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[color:var(--line-medium)] text-[color:var(--accent-ochre)] bg-[color:var(--surface-well)] rounded-[var(--radius-sm)]">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="scroll-label !mb-0">Daily briefing</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 border border-[color:var(--line-medium)] text-[color:var(--text-secondary)] rounded-full">
                  UD {report.universalDayNumber}
                </span>
                {report.mayanProfile.isGalacticPortalDay && (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    GALACTIC PORTAL
                  </span>
                )}
              </div>
              <h2 className="text-xl font-cinzel text-[color:var(--text-primary)] tracking-wide mt-1">
                {report.gregorianFormatted}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSyncToday && (
              <button
                onClick={onSyncToday}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono cta-ghost"
                title="Synchronize Crucible to Current Moment"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Sync Anchor</span>
              </button>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono cta-ghost"
              title="Copy formatted dossier to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono cta-ghost"
              title="Download raw report JSON"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-report-muted hover:text-[color:var(--text-primary)] hover:bg-[color:var(--surface-well)] transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 py-2 border-b border-[color:var(--line-soft)] bg-[color:var(--void-900)] overflow-x-auto">
          <button
            onClick={() => setActiveTab('MONOGRAPH')}
            className={`nav-tab whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'MONOGRAPH' ? 'nav-tab-active' : ''}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Full briefing</span>
          </button>
          <button
            onClick={() => setActiveTab('VEDIC_SIDEREAL_ASTEROIDS')}
            className={`px-3 py-1.5 transition-colors uppercase whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'VEDIC_SIDEREAL_ASTEROIDS'
                ? 'bg-amber-500/15 text-amber-300 border-b-2 border-amber-400 font-bold'
                : 'text-report-muted hover:text-gray-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vedic, Sidereal & Global Grid</span>
          </button>
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 transition-colors uppercase whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'bg-amber-500/10 text-amber-300 border-b-2 border-amber-400 font-bold'
                : 'text-report-muted hover:text-gray-200'
            }`}
          >
            Synthesis & Tone
          </button>
          <button
            onClick={() => setActiveTab('GAIA')}
            className={`px-3 py-1.5 transition-colors uppercase whitespace-nowrap ${
              activeTab === 'GAIA'
                ? 'bg-amber-500/10 text-amber-300 border-b-2 border-amber-400 font-bold'
                : 'text-report-muted hover:text-gray-200'
            }`}
          >
            Speculative Field Overlay
          </button>
          <button
            onClick={() => setActiveTab('TRANSITS')}
            className={`px-3 py-1.5 transition-colors uppercase whitespace-nowrap ${
              activeTab === 'TRANSITS'
                ? 'bg-amber-500/10 text-amber-300 border-b-2 border-amber-400 font-bold'
                : 'text-report-muted hover:text-gray-200'
            }`}
          >
            Celestial Transits ({report.celestialWeather.activeAspects.length})
          </button>
          <button
            onClick={() => setActiveTab('CALENDRICS')}
            className={`px-3 py-1.5 transition-colors uppercase whitespace-nowrap ${
              activeTab === 'CALENDRICS'
                ? 'bg-amber-500/10 text-amber-300 border-b-2 border-amber-400 font-bold'
                : 'text-report-muted hover:text-gray-200'
            }`}
          >
            Sacred Calendars
          </button>
          <button
            onClick={() => setActiveTab('STRATEGY')}
            className={`px-3 py-1.5 transition-colors uppercase whitespace-nowrap ${
              activeTab === 'STRATEGY'
                ? 'bg-amber-500/10 text-amber-300 border-b-2 border-amber-400 font-bold'
                : 'text-report-muted hover:text-gray-200'
            }`}
          >
            Forks & Strategic Action
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-[color:var(--void-900)]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ScrollMetric
              label="Maya"
              value={report.mayanProfile.tzolkinFormatted}
              sub={`Kin ${report.mayanProfile.kinNumber} · ${report.mayanProfile.solarTone}`}
              accent="ochre"
            />
            <ScrollMetric
              label="BaZi day"
              value={report.chineseProfile.dayPillar}
              sub={report.chineseProfile.solarTerm}
              accent="sage"
            />

            <ScrollMetric
              label="Field"
              value={`${report.gaiaOvercast.schumannFrequencyHz} Hz`}
              sub={`Kp ${report.gaiaOvercast.geomagneticKp} · ${report.gaiaOvercast.geomagneticStatus}`}
              accent="indigo"
            />
            <ScrollMetric
              label="Moon"
              value={`${report.gaiaOvercast.lunarIlluminationPercent}%`}
              sub={`${report.gaiaOvercast.lunarPhaseName} · ${report.celestialWeather.moonPosition}`}
              accent="rose"
            />
          </div>

          {/* TAB: EXTENDED MONOGRAPH (~20k TOKEN TARGET) */}
          {activeTab === 'MONOGRAPH' && (
            <div className="space-y-6">
              <div className="report-well border border-[#262833] p-5 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#20222c] pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300/50 text-[9px] font-mono font-bold uppercase rounded-sm flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-amber-700" />
                        Energy Compass Briefing
                      </span>
                      <span className="px-2 py-0.5 bg-[color:var(--surface-well)] text-[color:var(--temporal-deep)] border border-[color:var(--line-medium)] text-[9px] font-mono uppercase rounded-sm">
                        ~{Math.round((report.extendedMonograph || '').split(/\s+/).length).toLocaleString()} words · 12 sections
                      </span>
                    </div>
                    <h3 className="panel-title">Full briefing · {report.gregorianFormatted}</h3>
                    <p className="text-sm text-[color:var(--text-muted)] mt-1">
                      Expert-to-expert read — all systems, connected observations, explicit forks.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExpandMonograph}
                      disabled={isExpanding}
                      className="px-3 py-1.5 cta-ghost text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                      title="Expand monograph to maximum literary volume with Gemini 3.8 Flash"
                    >
                      <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isExpanding ? 'animate-spin' : ''}`} />
                      <span>{isExpanding ? 'Deepening with Gemini...' : expandedMonograph ? 'Re-expand briefing' : 'Expand via Gemini'}</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentMonographText);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="cta-ghost !min-h-[36px] font-mono text-xs uppercase"
                      title="Copy full treatise text"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Volume & Token Depth Indicator Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono">
                  <div className="report-well-nested p-2.5 rounded-sm border border-[#1e2029]">
                    <span className="text-report-muted text-[9px] uppercase">Word Count Depth</span>
                    <div className="text-[color:var(--text-primary)] font-bold text-sm mt-0.5">
                      ~{Math.round(currentMonographText.split(/\s+/).length).toLocaleString()} Words
                    </div>
                  </div>
                  <div className="report-well-nested p-2.5 rounded-sm border border-[#1e2029]">
                    <span className="text-report-muted text-[9px] uppercase">Calculated Token Volume</span>
                    <div className="text-amber-300 font-bold text-sm mt-0.5">
                      ~{Math.round(currentMonographText.length / 3.8).toLocaleString()} Tokens
                    </div>
                  </div>
                  <div className="report-well-nested p-2.5 rounded-sm border border-[#1e2029]">
                    <span className="text-report-muted text-[9px] uppercase">Structural Chapters</span>
                    <div className="text-[color:var(--temporal-deep)] font-bold text-sm mt-0.5">
                      XII structured sections
                    </div>
                  </div>
                  <div className="report-well-nested p-2.5 rounded-sm border border-[color:var(--line-soft)]">
                    <span className="text-report-muted text-[9px] uppercase">Voice</span>
                    <div className="text-[color:var(--accent-sage)] font-bold text-sm mt-0.5">
                      Expert compass · life impact
                    </div>
                  </div>
                </div>

                {expansionError && (
                  <div className="mt-3 p-2 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono">
                    {expansionError}
                  </div>
                )}
              </div>

              {/* The Novel-Like Monograph Text Reader */}
              <div className="bg-[#101218] border border-[#222530] p-6 sm:p-8 rounded-sm space-y-6">
                <div className="prose prose-invert max-w-none font-serif text-gray-200 text-sm sm:text-base leading-relaxed space-y-4">
                  {currentMonographText.split('\n\n').map((paragraph, pIdx) => {
                    const isChapterHeader = paragraph.trim().startsWith('Chapter') || 
                                           paragraph.trim().startsWith('I.') ||
                                           paragraph.trim().startsWith('II.') ||
                                           paragraph.trim().startsWith('III.') ||
                                           paragraph.trim().startsWith('IV.') ||
                                           paragraph.trim().startsWith('V.') ||
                                           paragraph.trim().startsWith('VI.') ||
                                           paragraph.trim().startsWith('VII.') ||
                                           paragraph.trim().startsWith('VIII.') ||
                                           paragraph.trim().startsWith('IX.') ||
                                           paragraph.trim().startsWith('X.') ||
                                           paragraph.trim().startsWith('XI.') ||
                                           paragraph.trim().startsWith('XII.') ||
                                           paragraph.trim().startsWith('XIII.');

                    if (isChapterHeader) {
                      return (
                        <div key={pIdx} className="pt-6 pb-2 border-b border-[#242733] my-4">
                          <h4 className="text-lg sm:text-xl font-serif text-amber-300 tracking-wide font-normal">
                            {paragraph}
                          </h4>
                        </div>
                      );
                    }

                    return (
                      <p key={pIdx} className="leading-relaxed text-report text-justify">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: VEDIC, SIDEREAL, ASTEROIDS & GLOBAL CONTINENTAL GRID */}
          {activeTab === 'VEDIC_SIDEREAL_ASTEROIDS' && (
            <div className="space-y-6">
              {/* Vedic Jyotish Profile */}
              {report.vedicProfile && (
                <div className="report-well border border-[#262833] p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#20222c] pb-3">
                    <span className="text-amber-400 font-bold text-xs uppercase font-mono flex items-center gap-1.5">
                      <Moon className="w-4 h-4" />
                      Vedic Jyotish & 27 Nakshatras Panchanga
                    </span>
                    <span className="text-xs text-report-muted font-mono">
                      Lahiri Ayanamsha: -{report.vedicProfile.lahiriAyanamshaDeg}°
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                    <div className="report-well-nested p-3 rounded-sm border border-[#1e2029] space-y-1.5">
                      <span className="text-report-muted text-[10px] uppercase block">Active Nakshatra</span>
                      <div className="text-amber-300 font-bold text-sm font-serif">
                        {report.vedicProfile.nakshatra.name} (Pada {report.vedicProfile.nakshatra.pada})
                      </div>
                      <div className="text-report-muted text-[11px]">Planetary Lord: {report.vedicProfile.nakshatra.rulingPlanet}</div>
                      <div className="text-report-muted text-[11px]">Deity: {report.vedicProfile.nakshatra.deity}</div>
                      <div className="text-report-muted text-[11px]">Shakti: {report.vedicProfile.nakshatra.shakti}</div>
                      <div className="text-report-muted text-[11px]">Symbol: {report.vedicProfile.nakshatra.symbol}</div>
                    </div>

                    <div className="report-well-nested p-3 rounded-sm border border-[#1e2029] space-y-1.5">
                      <span className="text-report-muted text-[10px] uppercase block">Tithi & Lunar Phase</span>
                      <div className="text-[color:var(--text-primary)] font-bold text-sm">
                        {report.vedicProfile.tithi.name} (Tithi #{report.vedicProfile.tithi.number})
                      </div>
                      <div className="text-cyan-400 text-[11px]">Paksha: {report.vedicProfile.tithi.paksha}</div>
                      <div className="text-report-muted text-[11px]">Nature: {report.vedicProfile.tithi.nature}</div>
                    </div>

                    <div className="report-well-nested p-3 rounded-sm border border-[#1e2029] space-y-1.5">
                      <span className="text-report-muted text-[10px] uppercase block">Yoga & Karana</span>
                      <div className="text-emerald-400 font-bold text-sm">
                        Yoga: {report.vedicProfile.yoga.name}
                      </div>
                      <div className="text-report-muted text-[11px]">Karana: {report.vedicProfile.karana.name}</div>
                      <div className="text-report-muted text-[11px]">Quality: {report.vedicProfile.yoga.quality}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sidereal Astronomical IAU Constellations */}
              {report.siderealProfile && (
                <div className="report-well border border-[#262833] p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#20222c] pb-3">
                    <span className="text-cyan-400 font-bold text-xs uppercase font-mono flex items-center gap-1.5">
                      <Compass className="w-4 h-4" />
                      True Sidereal Constellations (IAU Astronomical Sky)
                    </span>
                    <span className="text-xs text-cyan-300 font-mono">
                      Precessional Shift: ~{report.siderealProfile.ayanamshaOffsetDeg}°
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="report-well-nested p-3 rounded-sm border border-[#1e2029] space-y-1">
                      <span className="text-report-muted text-[10px] uppercase">Sidereal Sun Coordinate</span>
                      <div className="text-amber-300 font-bold text-sm">
                        {report.siderealProfile.sunSign} ({report.siderealProfile.sunDegree}°)
                      </div>
                      <div className="text-report-muted text-[11px]">
                        Physical Constellation: <strong className="text-[color:var(--text-primary)]">{report.siderealProfile.iauConstellationSun}</strong>
                      </div>
                    </div>

                    <div className="report-well-nested p-3 rounded-sm border border-[#1e2029] space-y-1">
                      <span className="text-report-muted text-[10px] uppercase">Sidereal Moon Coordinate</span>
                      <div className="text-cyan-300 font-bold text-sm">
                        {report.siderealProfile.moonSign} ({report.siderealProfile.moonDegree}°)
                      </div>
                      <div className="text-report-muted text-[11px]">
                        Physical Constellation: <strong className="text-[color:var(--text-primary)]">{report.siderealProfile.iauConstellationMoon}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Asteroids & Moons of the Solar System */}
              {report.asteroidsAndOtherMoons && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="report-well border border-[#262833] p-5 space-y-3 font-mono text-xs">
                    <span className="text-amber-400 font-bold text-xs uppercase flex items-center gap-1.5 border-b border-[#20222c] pb-2">
                      <Zap className="w-4 h-4" />
                      Major Asteroids & Centaurs Telemetry
                    </span>
                    <div className="space-y-2">
                      {report.asteroidsAndOtherMoons.asteroids.map((ast) => (
                        <div key={ast.name} className="p-2 report-well-nested rounded-sm border border-[#1e2029] flex items-center justify-between">
                          <div>
                            <span className="text-[color:var(--text-primary)] font-bold">{ast.name}</span>
                            <span className="text-report-muted text-[11px] block">{ast.theme}</span>
                          </div>
                          <span className="text-amber-300 font-bold text-xs">{ast.sign} {ast.degree}°</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="report-well border border-[#262833] p-5 space-y-3 font-mono text-xs">
                    <span className="text-cyan-400 font-bold text-xs uppercase flex items-center gap-1.5 border-b border-[#20222c] pb-2">
                      <Moon className="w-4 h-4" />
                      Planetary Moons of the Solar System
                    </span>
                    <div className="space-y-2">
                      {report.asteroidsAndOtherMoons.solarMoons.map((m) => (
                        <div key={m.name} className="p-2 report-well-nested rounded-sm border border-[#1e2029] flex items-center justify-between">
                          <div>
                            <span className="text-[color:var(--text-primary)] font-bold">{m.name} ({m.parentPlanet})</span>
                            <span className="text-report-muted text-[11px] block">{m.astrologicalQuality}</span>
                          </div>
                          <span className="text-cyan-300 text-[11px]">{m.tidalStress}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Eclipse Status */}
              {report.eclipseStatus && (
                <div className="report-well border border-[#262833] p-4 font-mono text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-report-muted uppercase block">Eclipse Season Proximity</span>
                    <div className="text-[color:var(--text-primary)] font-bold text-sm mt-0.5">
                      {report.eclipseStatus.isNearEclipseSeason ? 'Active Eclipse Window' : 'Intersession Interval'} · {report.eclipseStatus.daysToNearestEclipse} Days to {report.eclipseStatus.nearestEclipseType}
                    </div>
                    <div className="text-report-muted text-[11px] mt-0.5">
                      Nodal Axis: <strong className="text-amber-300">{report.eclipseStatus.nodalAxisSign}</strong> · {report.eclipseStatus.esotericImpact}
                    </div>
                  </div>
                  <div className={`px-3 py-1 text-xs font-bold uppercase rounded-sm border ${
                    report.eclipseStatus.isNearEclipseSeason
                      ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                      : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  }`}>
                    {report.eclipseStatus.nearestEclipseType}
                  </div>
                </div>
              )}

              {/* Continental & Global Geodetic Overcast Grid */}
              {report.continentalAndCityOvercast && (
                <div className="report-well border border-[#262833] p-5 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-[#20222c] pb-3">
                    <span className="text-emerald-400 font-bold text-xs uppercase flex items-center gap-1.5">
                      <Globe className="w-4 h-4" />
                      Continental & Global Terrestrial Geodetic Overcast
                    </span>
                    <span className="text-report-muted text-[10px]">All 7 Continents Monitored</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {report.continentalAndCityOvercast.continents.map((cont) => (
                      <div key={cont.continent} className="p-3 report-well-nested rounded-sm border border-[#1e2029] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[color:var(--text-primary)] font-bold text-sm font-serif">{cont.continent}</span>
                          <span className="px-1.5 py-0.5 bg-[#181a22] text-emerald-300 border border-[#282b38] text-[9px]">
                            {cont.dominantElement}
                          </span>
                        </div>
                        <div className="text-[11px] text-report-muted">
                          Geomagnetic: <strong className="text-cyan-300">{cont.geomagneticCurrent}</strong>
                        </div>
                        <p className="text-[11px] text-report leading-tight pt-1 border-t border-[#1a1c24]">
                          {cont.esotericOvercast}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Anchor Cities Table */}
                  <div className="pt-3 border-t border-[#20222c]">
                    <span className="text-[10px] text-report-muted uppercase block mb-2 font-bold">
                      Key Terrestrial Anchor Cities & Resonance Affinities
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-[11px]">
                      {report.continentalAndCityOvercast.anchorCities.map((city) => (
                        <div key={city.name} className="p-2 bg-[#0d0e13] rounded-sm border border-[#1e2029]">
                          <div className="text-[color:var(--text-primary)] font-medium">{city.name}</div>
                          <div className="text-report-muted text-[10px]">{city.country}</div>
                          <div className="text-emerald-400 font-bold text-[10px] mt-1">
                            {city.resonanceAffinityScore}% Affinity
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: OVERVIEW & NOVEL-LIKE NOVEL SYNTHESIS */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-5">
              <ScrollCard label="Opening read" accent="ochre">
                <ScrollProse>{report.executiveSynthesis}</ScrollProse>
                <div className="scroll-divider" />
                <p className="text-xs text-[color:var(--text-muted)] data-readout">
                  UD {report.universalDayNumber} ({report.universalDayVibration}) · JD {report.julianDayUT}
                </p>
              </ScrollCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ScrollCard label="Today's thread" accent="terracotta">
                  <p className="font-garamond text-[1.05rem] leading-relaxed text-[color:var(--text-secondary)]">
                    {report.dailyStrategicActionPlan.goldenThread}
                  </p>
                </ScrollCard>

                <ScrollCard label="Tribe lens" accent="sage">
                  <p className="font-garamond text-[1.05rem] leading-relaxed text-[color:var(--text-secondary)]">
                    {report.twelveTribesResonance.guidance}
                  </p>
                </ScrollCard>
              </div>

              {/* Gene Keys Evolutionary Transit */}
              <div className="report-well border border-[#222633] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-purple-300 uppercase">
                    Gene Keys Current Solar Gate Transit
                  </div>
                  <span className="text-xs font-mono text-report-muted">
                    Gate {report.geneKeyTransit.sunGate}.{report.geneKeyTransit.line} ({report.geneKeyTransit.name})
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs font-mono">
                  <div className="bg-[#181a24] p-2 border border-red-500/20">
                    <div className="text-[10px] text-red-400 uppercase">Shadow Frequency</div>
                    <div className="font-bold text-gray-200 mt-0.5">{report.geneKeyTransit.shadow}</div>
                  </div>
                  <div className="bg-[#181a24] p-2 border border-emerald-500/20">
                    <div className="text-[10px] text-emerald-400 uppercase">Gift Frequency</div>
                    <div className="font-bold text-gray-200 mt-0.5">{report.geneKeyTransit.gift}</div>
                  </div>
                  <div className="bg-[#181a24] p-2 border border-purple-500/20">
                    <div className="text-[10px] text-purple-400 uppercase">Siddhi (Divine)</div>
                    <div className="font-bold text-gray-200 mt-0.5">{report.geneKeyTransit.siddhi}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GAIA'S OVERCAST & TERRESTRIAL FIELD */}
          {activeTab === 'GAIA' && (
            <div className="space-y-5">
              <div className="report-well border border-[#222633] p-4">
                <div className="text-xs font-mono font-bold text-sky-400 uppercase mb-2">
                  Planetary Magnetospheric & Atmospheric Resonance
                </div>
                <p className="text-xs sm:text-sm text-report leading-relaxed">
                  {report.gaiaOvercast.atmosphericNarrative}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="report-well border border-[#222633] p-4 space-y-3">
                  <div className="text-xs font-mono text-report-muted uppercase">Geomagnetic Tension & Kp Index</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-200">{report.gaiaOvercast.geomagneticStatus}</span>
                    <span className="text-lg font-mono font-bold text-amber-400">Kp {report.gaiaOvercast.geomagneticKp}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2">
                    <div
                      className="bg-amber-400 h-2 transition-all"
                      style={{ width: `${Math.min(100, (report.gaiaOvercast.geomagneticKp / 9) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="report-well border border-[#222633] p-4 space-y-3">
                  <div className="text-xs font-mono text-report-muted uppercase">Schumann Cavity Frequency</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-200">Fundamental Ionospheric Peak</span>
                    <span className="text-lg font-mono font-bold text-sky-400">{report.gaiaOvercast.schumannFrequencyHz} Hz</span>
                  </div>
                  <div className="text-xs text-report-muted">
                    Base standard: 7.83 Hz. Current deviation: {(report.gaiaOvercast.schumannFrequencyHz - 7.83).toFixed(2)} Hz.
                  </div>
                </div>

                <div className="report-well border border-[#222633] p-4 space-y-3">
                  <div className="text-xs font-mono text-report-muted uppercase">Aspect Tension Score</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-200">Collective Astrological Friction</span>
                    <span className="text-lg font-mono font-bold text-red-400">{report.gaiaOvercast.aspectTensionScore} / 100</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2">
                    <div
                      className="bg-red-400 h-2 transition-all"
                      style={{ width: `${report.gaiaOvercast.aspectTensionScore}%` }}
                    />
                  </div>
                </div>

                <div className="report-well border border-[#222633] p-4 space-y-3">
                  <div className="text-xs font-mono text-report-muted uppercase">Dominant Elemental Vector</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-200">Five Element (Wu Xing) Direction</span>
                    <span className="text-lg font-serif font-bold text-emerald-400">{report.gaiaOvercast.dominantElement}</span>
                  </div>
                  <div className="text-xs text-report-muted">
                    Collective Polarity: {report.gaiaOvercast.collectivePolarity}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CELESTIAL TRANSITS & ASPECTS */}
          {activeTab === 'TRANSITS' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="report-well border border-[#222633] p-4">
                  <div className="text-[10px] font-mono text-report-muted uppercase">Sun Current Coordinate</div>
                  <div className="text-base font-serif font-bold text-amber-300 mt-1">
                    {report.celestialWeather.sunPosition}
                  </div>
                </div>
                <div className="report-well border border-[#222633] p-4">
                  <div className="text-[10px] font-mono text-report-muted uppercase">Moon Current Coordinate & Tone</div>
                  <div className="text-base font-serif font-bold text-purple-300 mt-1">
                    {report.celestialWeather.moonPosition}
                  </div>
                  <div className="text-xs text-report-muted mt-0.5">{report.gaiaOvercast.lunarTone}</div>
                </div>
              </div>

              {/* Active Aspects Table */}
              <div className="report-well border border-[#222633] p-4 space-y-3">
                <div className="text-xs font-mono font-bold text-report uppercase">
                  Active Major Interplanetary Aspects Today
                </div>
                <div className="space-y-2">
                  {report.celestialWeather.activeAspects.map((asp, idx) => (
                    <div key={idx} className="report-well-nested border border-[#212430] p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-200">
                          {asp.body1} {asp.aspect} {asp.body2}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 ${
                            asp.nature === 'Harmonious'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {asp.nature} (Orb: {asp.orb}°)
                        </span>
                      </div>
                      <div className="text-report-muted text-xs sm:max-w-md sm:text-right">
                        {asp.meaning}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="report-well border border-[#222633] p-4 space-y-2">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase">Cosmic Counsel for Retrograde Spheres</div>
                <p className="text-xs sm:text-sm text-report leading-relaxed">
                  {report.celestialWeather.cosmicCounsel}
                </p>
                <div className="text-xs font-mono text-report-muted pt-1">
                  Active Retrogrades: {report.celestialWeather.retrogradeBodies.join(', ')}
                </div>
              </div>

              {chartDynamics && (
                <div className="space-y-3">
                  <ScrollCard label="Your natal overlay (active profile)" accent="indigo">
                    <ScrollProse className="text-sm">{chartDynamics.openingBriefing}</ScrollProse>
                  </ScrollCard>
                  {chartDynamics.transitToNatal.length > 0 && (
                    <div className="report-well border border-indigo-500/30 p-4 space-y-2">
                      <div className="text-xs font-mono font-bold text-indigo-300 uppercase">
                        Transit-to-natal hits
                      </div>
                      {chartDynamics.transitToNatal.slice(0, 8).map((hit, idx) => (
                        <div key={idx} className="text-xs text-report border-b border-[#1e212c] pb-2 last:border-0">
                          <span className="text-gray-100 font-semibold">
                            {hit.transitingName} {hit.aspectType} {hit.natalName}
                          </span>
                          <span className="text-report-muted ml-2">({hit.orbDeg}°)</span>
                          <p className="text-report-muted mt-0.5">{hit.briefing}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {chartDynamics.returns.some((r) => r.applicable) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {chartDynamics.returns
                        .filter((r) => r.applicable)
                        .map((r) => (
                          <ScrollMetric
                            key={r.kind}
                            label={r.label}
                            value={r.momentIso.slice(0, 10)}
                            sub={r.briefing.slice(0, 80)}
                            accent="rose"
                          />
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SACRED CALENDRICS */}
          {activeTab === 'CALENDRICS' && (
            <div className="space-y-4">
              {/* Mayan */}
              <div className="report-well border border-[#222633] p-4 space-y-2">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Maya Classical & Dreamspell Computus
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>Long Count: <strong className="text-gray-200">{report.mayanProfile.longCount}</strong></div>
                  <div>Tzolk'in Kin: <strong className="text-amber-300">Kin {report.mayanProfile.kinNumber} ({report.mayanProfile.tzolkinFormatted})</strong></div>
                  <div>Galactic Tone: <strong className="text-gray-200">{report.mayanProfile.solarTone}</strong></div>
                  <div>Haab' Solar Date: <strong className="text-gray-200">{report.mayanProfile.haabFormatted}</strong></div>
                  <div>Wavespell Architecture: <strong className="text-gray-200">{report.mayanProfile.wavespellName}</strong></div>
                  <div>Fifth Force Guide: <strong className="text-emerald-300">{report.mayanProfile.fifthForceGuide}</strong></div>
                </div>
                <p className="text-xs text-report-muted pt-2 border-t border-[#1e212c]">
                  Spiritual Protocol: {report.mayanProfile.spiritualProtocol}
                </p>
              </div>

              {/* Chinese */}
              <div className="report-well border border-[#222633] p-4 space-y-2">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  Chinese Sexagenary Computus (Four Pillars / BaZi)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div>Day Pillar: <strong className="text-emerald-300">{report.chineseProfile.dayPillar}</strong></div>
                  <div>Month Pillar: <strong className="text-gray-200">{report.chineseProfile.monthPillar}</strong></div>
                  <div>Year Pillar: <strong className="text-gray-200">{report.chineseProfile.yearPillar}</strong></div>
                </div>
                <div className="text-xs text-report pt-1">
                  Solar Term: {report.chineseProfile.solarTerm} · {report.chineseProfile.wuXingDynamic}
                </div>
              </div>

              {/* Ancient Mediterranean */}
              <div className="report-well border border-[#222633] p-4 space-y-2">
                <div className="text-xs font-mono font-bold text-sky-400 uppercase">
                  Classical Ancient Civilizations
                </div>
                <div className="space-y-1.5 text-xs text-report font-serif">
                  <div><strong>Egyptian Civil 365-Day:</strong> {report.ancientCalendars.egyptian}</div>
                  <div><strong>Ethiopian Ge'ez:</strong> {report.ancientCalendars.ethiopian}</div>
                  <div><strong>Classical Greek Attic:</strong> {report.ancientCalendars.greekAttic}</div>
                  <div className="font-mono text-[11px] text-report-muted">{report.ancientCalendars.julianEquivalent}</div>
                </div>
              </div>

              {/* Enochian / Biblical / Roman */}
              {(report.ancientCalendars.enochian || report.ancientCalendars.biblicalTekufah) && (
                <div className="report-well border border-amber-500/30 p-4 space-y-2">
                  <div className="text-xs font-mono font-bold text-amber-400 uppercase">
                    Enochian Time · Biblical Tekufot · Roman Dies
                  </div>
                  <div className="space-y-1.5 text-xs text-report font-serif">
                    {report.ancientCalendars.enochian && (
                      <div><strong>Enochian:</strong> {report.ancientCalendars.enochian}</div>
                    )}
                    {report.ancientCalendars.biblicalTekufah && (
                      <div><strong>Biblical Transit:</strong> {report.ancientCalendars.biblicalTekufah}</div>
                    )}
                    {report.ancientCalendars.romanDies && (
                      <div><strong>Roman Dies:</strong> {report.ancientCalendars.romanDies}</div>
                    )}
                    {report.ancientCalendars.planetaryHour && (
                      <div><strong>Planetary Hour:</strong> {report.ancientCalendars.planetaryHour}</div>
                    )}
                  </div>
                  {ctx?.enochianBiblical && (
                    <div className="pt-2 border-t border-[#1e212c] grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="report-well-nested p-2 border border-cyan-900/40">
                        <div className="text-[9px] uppercase text-cyan-400 font-bold font-mono">Peek A · Civil</div>
                        <p className="text-[10px] text-report-muted mt-1 leading-snug">{ctx.enochianBiblical.abPeek.pathA.summary}</p>
                      </div>
                      <div className="report-well-nested p-2 border border-amber-900/40">
                        <div className="text-[9px] uppercase text-amber-400 font-bold font-mono">Peek B · Enochian</div>
                        <p className="text-[10px] text-report-muted mt-1 leading-snug">{ctx.enochianBiblical.abPeek.pathB.summary}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: STRATEGY & FORKS */}
          {activeTab === 'STRATEGY' && (
            <div className="space-y-5">
              {/* Dialectical Fork */}
              <div className="report-well border border-amber-500/30 p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
                  <GitFork className="w-4 h-4" />
                  <span>{report.dailyStrategicActionPlan.dialecticalFork.title}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="report-well-nested border border-[#252838] p-3 space-y-1.5">
                    <div className="text-[10px] font-mono text-amber-300 uppercase font-bold">Branch A: Solar Manifestation</div>
                    <p className="text-xs text-report leading-relaxed">
                      {report.dailyStrategicActionPlan.dialecticalFork.choiceA}
                    </p>
                  </div>
                  <div className="report-well-nested border border-[#252838] p-3 space-y-1.5">
                    <div className="text-[10px] font-mono text-sky-300 uppercase font-bold">Branch B: Receptive Sanctuary</div>
                    <p className="text-xs text-report leading-relaxed">
                      {report.dailyStrategicActionPlan.dialecticalFork.choiceB}
                    </p>
                  </div>
                </div>
                <div className="bg-[#161922] border border-emerald-500/30 p-3 mt-3">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold mb-1">
                    The Synthetic Resolution (The Third Way)
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    {report.dailyStrategicActionPlan.dialecticalFork.syntheticResolution}
                  </p>
                </div>
              </div>

              {/* What to Harness vs What to Avoid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="report-well border border-emerald-500/20 p-4 space-y-3">
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>What to Harness Today</span>
                  </div>
                  <ul className="space-y-2 text-xs text-report">
                    {report.dailyStrategicActionPlan.whatToHarness.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="report-well border border-red-500/20 p-4 space-y-3">
                  <div className="text-xs font-mono font-bold text-red-400 uppercase flex items-center gap-1.5">
                    <X className="w-4 h-4" />
                    <span>What to Guard Against Today</span>
                  </div>
                  <ul className="space-y-2 text-xs text-report">
                    {report.dailyStrategicActionPlan.whatToAvoid.map((a, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Peak Power Window */}
              <div className="report-well border border-[#222633] p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-report-muted uppercase">Peak Power Window of Today</div>
                  <div className="text-sm font-semibold text-amber-300 mt-0.5">
                    {report.dailyStrategicActionPlan.peakPowerWindow}
                  </div>
                </div>
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#20222c] bg-[#101217] text-xs font-mono text-report-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>The Crucible Daily Computus Service</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors font-bold uppercase"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
