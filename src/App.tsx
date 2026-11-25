/**
 * The Crucible — Master Application Root
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ArchetypalMatrixPanel } from './components/ArchetypalMatrixPanel';
import { AstrocartographyMap } from './components/AstrocartographyMap';
import { CalendarComparisonGrid } from './components/CalendarComparisonGrid';
import { ConversationalCompass } from './components/ConversationalCompass';
import { GuideModal } from './components/shell/GuideModal';
import { DiagnosticMicroTestsModal } from './components/DiagnosticMicroTestsModal';
import { DreamspellSynchronometerPanel } from './components/DreamspellSynchronometerPanel';
import { GearsVisualizer } from './components/GearsVisualizer';
import { PlanetaryEphemerisWidget } from './components/PlanetaryEphemerisWidget';
import { ReportExportModal } from './components/ReportExportModal';
import { SecureDashboardHeader } from './components/SecureDashboardHeader';
import { CompactContextBar } from './components/CompactContextBar';
import { TotalSystemsReportPanel } from './components/TotalSystemsReportPanel';
import { LongTermResonancePanel } from './components/LongTermResonancePanel';
import { EnochianBiblicalPanel } from './components/EnochianBiblicalPanel';
import { ProfileWhatChangedPanel } from './components/ProfileWhatChangedPanel';
import { CompatibilityAtlasPanel } from './components/CompatibilityAtlasPanel';
import { TransitsProgressionsPanel } from './components/TransitsProgressionsPanel';
import { executeCrucibleCalculation } from './engine/crucibleCore';
import { CompleteCalculationContext, LocationCoordinates, TemporalInput } from './types';
import { TodayScreen } from './components/TodayScreen';
import { AppNavRail, MobileTabBar } from './components/navigation/AppNavigation';
import { EXPLORE_TABS, ExploreTab, PrimaryDestination } from './app/viewModel';
import { getActiveProfile } from './engine/crucibleProfile';
import { synthesizeDailyBearing } from './engine/editorialSynthesis';
import { loadInsights } from './engine/savedInsights';
import { resolveInitialLocation, saveLocation } from './engine/locationStorage';
import { NatalChartPanel } from './components/chart/NatalChartPanel';
import { DreamspellCalendarWorkspace } from './components/calendar/DreamspellCalendarWorkspace';
import { AccountPanel } from './components/auth/AccountPanel';
import { useAuth } from './firebase/AuthProvider';

export default function App() {
  const { user, ready: authReady } = useAuth();
  const [primary, setPrimary] = useState<PrimaryDestination>('TODAY');
  const [exploreTab, setExploreTab] = useState<ExploreTab>('SYSTEMS');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isGearSpinning, setIsGearSpinning] = useState<boolean>(true);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [enochianMapFlip, setEnochianMapFlip] = useState<boolean>(false);
  const [profileTick, setProfileTick] = useState(0);

  const [correlationKey, setCorrelationKey] = useState<'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384'>('GMT_584283');

  const [temporalInput, setTemporalInput] = useState<TemporalInput>(() => {
    const now = new Date();
    const loc = resolveInitialLocation();
    return {
      dateString: now.toISOString().slice(0, 10),
      timeString: now.toTimeString().slice(0, 8),
      timezoneOffsetMinutes: -now.getTimezoneOffset(),
      isUTC: false,
      location: loc,
      querentName: '',
      methodology: {
        includeVedic: true,
        includeGaiaOverlay: true
      }
    };
  });

  const calculationContext = useMemo<CompleteCalculationContext>(() => {
    return executeCrucibleCalculation(temporalInput, correlationKey);
  }, [temporalInput, correlationKey]);

  const profile = useMemo(() => {
    void profileTick;
    return typeof window === 'undefined' ? null : getActiveProfile();
  }, [profileTick]);

  const localPreview = useMemo(
    () => synthesizeDailyBearing(calculationContext, 'overview', profile, 'world', correlationKey).localContext,
    [calculationContext, profile, correlationKey]
  );

  useEffect(() => {
    if (authReady) setProfileTick((n) => n + 1);
  }, [user?.uid, authReady]);

  useEffect(() => {
    if (!isStreaming) return;
    const timer = setInterval(() => {
      const now = new Date();
      setTemporalInput((prev) => ({
        ...prev,
        dateString: now.toISOString().slice(0, 10),
        timeString: now.toTimeString().slice(0, 8)
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [isStreaming]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [primary, exploreTab]);

  const handleLocationSelect = (loc: LocationCoordinates) => {
    saveLocation(loc);
    setTemporalInput((prev) => ({
      ...prev,
      location: loc
    }));
  };

  const goExplore = (tab: ExploreTab) => {
    setExploreTab(tab);
    setPrimary('EXPLORE');
  };

  const savedCount = typeof window === 'undefined' ? 0 : loadInsights().length;

  return (
    <div className="min-h-screen app-shell flex relative">
      <AppNavRail current={primary} onChange={setPrimary} />

      <div className="flex-1 min-w-0 flex flex-col pb-20 lg:pb-0">
        <SecureDashboardHeader
          ctx={calculationContext}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
        />

        <main className="app-main flex-1 w-full px-4 md:px-6 lg:px-8 py-5 md:py-8 space-y-6 md:space-y-8">
          <CompactContextBar
            ctx={calculationContext}
            local={localPreview}
            isStreaming={isStreaming}
            onToggleStreaming={() => setIsStreaming((prev) => !prev)}
            correlationKey={correlationKey}
            onCorrelationChange={setCorrelationKey}
            onInputChange={(newInput, newCorr) => {
              setTemporalInput(newInput);
              if (newCorr) setCorrelationKey(newCorr);
            }}
          />

          {primary === 'TODAY' && (
            <TodayScreen
              ctx={calculationContext}
              profile={profile}
              correlationKey={correlationKey}
              onOpenCodex={() => setIsExportOpen(true)}
              onOpenCompass={() => goExplore('COMPASS')}
              onOpenYou={() => setPrimary('YOU')}
              onOpenExplore={() => goExplore('SYSTEMS')}
              dateLabel={localPreview.dateLabel}
              placeLabel={`${localPreview.cityLabel} · ${localPreview.localTime}`}
            />
          )}

          {primary === 'YOU' && (
            <div className="space-y-5">
              <div className="page-intro">
                <p className="ui-eyebrow">My chart</p>
                <h2 className="page-title">Your birth chart and how today compares</h2>
                <p className="page-lead">
                  {profile
                    ? `Showing ${profile.displayName || profile.querentName}. If the birth time is missing or approximate, the rising sign and houses are left out or marked tentative.`
                    : 'Add your birth date and place below to see your chart. Everything else in the app works without it.'}
                  {savedCount > 0 ? ` You have ${savedCount} saved insight${savedCount === 1 ? '' : 's'} on this device.` : ''}
                </p>
              </div>
              <NatalChartPanel profile={profile} correlationKey={correlationKey} />
              <ProfileWhatChangedPanel
                transitCtx={calculationContext}
                correlationKey={correlationKey}
                onLoadBirthIntoTransit={(birth, name) => {
                  setIsStreaming(false);
                  setTemporalInput({ ...birth, querentName: name });
                  setProfileTick((n) => n + 1);
                }}
                onApplyDate={(dateStr) => {
                  setIsStreaming(false);
                  setTemporalInput((prev) => ({ ...prev, dateString: dateStr }));
                }}
                onProfilesChanged={() => setProfileTick((n) => n + 1)}
              />
              {profile && (
              <TransitsProgressionsPanel
                transitCtx={calculationContext}
                correlationKey={correlationKey}
                refreshKey={profileTick}
              />
              )}
              {profile && <CompatibilityAtlasPanel correlationKey={correlationKey} />}
              <AccountPanel />
            </div>
          )}

          {primary === 'TIMELINE' && (
            <div className="space-y-4">
              <div className="page-intro">
                <p className="ui-eyebrow">Next 14 days</p>
                <h2 className="page-title">The two weeks ahead, day by day</h2>
                <p className="page-lead">
                  Each day gets a score for how strongly the different calendars line up. Tap a day to read it; add a
                  birth date to see how each day fits you personally.
                </p>
              </div>
              <LongTermResonancePanel
                ctx={calculationContext}
                onDateSelect={(dateStr) => {
                  setTemporalInput((prev) => ({ ...prev, dateString: dateStr }));
                  setPrimary('TODAY');
                }}
              />
            </div>
          )}

          {primary === 'EXPLORE' && (
            <div className="space-y-5">
              <div className="page-intro">
                <p className="ui-eyebrow">Traditions</p>
                <h2 className="page-title">The detail behind the reading</h2>
              </div>
              <nav className="explore-tabs" aria-label="Explore">
                {EXPLORE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setExploreTab(tab.id)}
                    aria-current={exploreTab === tab.id ? 'page' : undefined}
                    className={`explore-tab ${exploreTab === tab.id ? 'explore-tab-active' : ''}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
              <p className="explore-tab-desc">{EXPLORE_TABS.find((t) => t.id === exploreTab)?.description}</p>

              {exploreTab === 'SYSTEMS' && (
                <div className="space-y-6 md:space-y-8">
                  <PlanetaryEphemerisWidget ctx={calculationContext} />
                  <CalendarComparisonGrid ctx={calculationContext} />
                  <ArchetypalMatrixPanel ctx={calculationContext} />
                </div>
              )}

              {exploreTab === 'CALENDARS' && (
                <div className="space-y-6">
                  <DreamspellCalendarWorkspace ctx={calculationContext} />
                  <DreamspellSynchronometerPanel ctx={calculationContext} />
                </div>
              )}

              {exploreTab === 'REPORT' && <TotalSystemsReportPanel currentCtx={calculationContext} />}

              {exploreTab === 'GEARS' && (
                <div className="space-y-4">
                  <GearsVisualizer
                    ctx={calculationContext}
                    isPlaying={isGearSpinning}
                    onTogglePlay={() => setIsGearSpinning((prev) => !prev)}
                  />
                </div>
              )}

              {exploreTab === 'MAP' && (
                <AstrocartographyMap
                  lines={calculationContext.astrocartographyLines}
                  bodies={calculationContext.celestialBodies}
                  currentLocation={temporalInput.location}
                  onLocationSelect={handleLocationSelect}
                  enochianFlip={enochianMapFlip}
                  onEnochianFlipChange={setEnochianMapFlip}
                  enochianOrientation={calculationContext.enochianBiblical.compassOrientation}
                />
              )}

              {exploreTab === 'ENOCHIAN' && (
                <EnochianBiblicalPanel
                  ctx={calculationContext}
                  mapFlipEnabled={enochianMapFlip}
                  onEnableMapFlip={(enabled) => {
                    setEnochianMapFlip(enabled);
                    if (enabled) goExplore('MAP');
                  }}
                />
              )}

              {exploreTab === 'COMPASS' && <ConversationalCompass ctx={calculationContext} />}
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>
            For reflection and curiosity — not medical, legal or financial advice. Planet positions by the open-source
            astronomy-engine library.
          </p>
          <div className="app-footer-meta">
            <button type="button" onClick={() => setIsDiagnosticsOpen(true)} className="app-footer-link">
              Run accuracy self-check
            </button>
            <span title={`Calculation ${calculationContext.calculationId} · ruleset ${calculationContext.rulesetHash}`}>
              Calculated in {calculationContext.executionDurationMs} ms
            </span>
          </div>
        </footer>
      </div>

      <MobileTabBar current={primary} onChange={setPrimary} />

      <ReportExportModal
        ctx={calculationContext}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      <DiagnosticMicroTestsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />
    </div>
  );
}
