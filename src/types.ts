/**
 * The Crucible — Core Architectural Types & Schema Contracts
 * Strictly typed definitions for Universal Esoterism and Temporal Resonance Engine
 */

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  city?: string;
  country?: string;
}

/** Epistemic class — do not collapse these categories. */
export type EpistemicClass =
  | 'HISTORICAL_FACT'
  | 'TEXTUAL_TRADITION'
  | 'SCHOLARLY_INTERPRETATION'
  | 'COMPARATIVE_ANALOGY'
  | 'SYSTEM_INTERPRETATION'
  | 'SPECULATIVE_SYNTHESIS'
  | 'EMPIRICAL_EVIDENCE'
  | 'COMPUTED_GEOMETRY';

export type OutputRegister = 'accessible' | 'practitioner' | 'technical' | 'academic' | 'comparative';

export type ReadingFocus =
  | 'overview'
  | 'relationships'
  | 'work'
  | 'creativity'
  | 'mood'
  | 'travel'
  | 'finance'
  | 'tech';

export type ReadingMode = 'world' | 'personal';

export interface DomainImpacts {
  mood: string;
  people: string;
  travel: string;
  finance: string;
  tech: string;
  whyToday: string;
  personalAlignment?: string;
}

export type DeepReadingDomainKey =
  | keyof DomainImpacts
  | 'emotional'
  | 'social'
  | 'workCreative'
  | 'watchFor'
  | 'regional';

export interface DeepReadingRequestBase {
  context?: CompleteCalculationContext;
  profile?: CrucibleProfile | null;
  mode?: ReadingMode;
  forecastEntry?: FourteenDayForecastEntry;
  targetLocationName?: string;
}

export interface DeepReadingRequest extends DeepReadingRequestBase {
  domainKey: DeepReadingDomainKey;
  seedText: string;
  cardTitle: string;
}

export interface DeepReadingResponse {
  expandedText: string;
  source: string;
  passesCompleted: number;
}

export interface DailyBearingContributor {
  systemId: string;
  label: string;
  signal: string;
  epistemic: EpistemicClass;
}

export interface LocalReadingContext {
  cityLabel: string;
  localTime: string;
  dateLabel: string;
  sunrise: string;
  sunset: string;
  moonPhase: string;
  seasonalNote: string;
  locationDependentInputs: string[];
  personal: boolean;
  personalName?: string;
}

export interface DailyBearing {
  theme: string;
  summary: string;
  practice: string;
  watchFor: string;
  atmospheres: {
    emotional: string;
    social: string;
    workCreative: string;
  };
  domains: DomainImpacts;
  localContext: LocalReadingContext;
  contributors: DailyBearingContributor[];
  focus: ReadingFocus;
  mode: ReadingMode;
  generatedAtIso: string;
  calculationId: string;
}

export interface MethodologyBundle {
  calendarCorrelation: 'GMT_584283' | 'GMT_584285' | 'SPINDEN_489384';
  ayanamsha: 'lahiri' | 'raman' | 'fagan_bradley' | 'none';
  ephemerisModel: string;
  houseSystem: 'none' | 'placidus' | 'whole_sign' | 'equal';
  chineseDayBoundary: 'solar_terms' | 'midnight' | 'sunrise';
  zodiac: 'tropical_primary' | 'sidereal_primary';
  includeVedic: boolean;
  includeGaiaOverlay: boolean;
  epistemicStrictMode: boolean;
  version: string;
}

export interface SharedDialecticalFork {
  id: string;
  title: string;
  traditionsInvolved: string[];
  apparentContradictionDescription: string;
  whyThisIsAForkInTheRoad: string;
  pathA: { label: string; title: string; summary: string; strategy: string };
  pathB: { label: string; title: string; summary: string; strategy: string };
  synthesis: { title: string; summary: string; leverage: string };
  epistemicClass: EpistemicClass;
  confidence: number;
}

export interface VedicResult {
  nakshatraName: string;
  nakshatraNumber: number;
  nakshatraPada: number;
  nakshatraLord: string;
  nakshatraDeity: string;
  nakshatraShakti: string;
  nakshatraSymbol: string;
  tithiName: string;
  paksha: string;
  tithiNumber: number;
  yogaName: string;
  karanaName: string;
  lahiriAyanamshaDeg: number;
  siderealSunDeg: number;
  siderealMoonDeg: number;
  epistemicClass: EpistemicClass;
}

export interface TemporalInput {
  dateString: string; // YYYY-MM-DD
  timeString: string; // HH:MM:SS
  timezoneOffsetMinutes: number; // e.g. -420 for UTC-7
  isUTC: boolean;
  location: LocationCoordinates;
  methodology?: Partial<MethodologyBundle>;
  querentName?: string;
}

export interface TemporalCoordinate {
  isoString: string;
  utcDateString: string;
  utcTimeString: string;
  julianDayUT: number;
  julianDayTT: number;
  deltaTSeconds: number;
  greenwichMeanSiderealTimeHours: number;
  localSiderealTimeHours: number;
  isGregorianLeapYear: boolean;
  julianCalendarDate: {
    year: number;
    month: number;
    day: number;
  };
  dayOfWeek: string;
  dayOfYear: number;
}

export interface MayanGlyph {
  id: number;
  name: string;
  mayaName: string;
  yucatecName: string;
  meaning: string;
  direction: 'East' | 'North' | 'West' | 'South';
  color: string;
  action: string;
  element: string;
}

export interface MayanResult {
  correlationId: string;
  correlationJDN: number; // 584283 (GMT)
  daysSinceEpoch: number;
  longCount: {
    baktun: number;
    katun: number;
    tun: number;
    uinal: number;
    kin: number;
    formatted: string; // e.g. 13.0.13.15.2
  };
  tzolkin: {
    number: number; // 1-13
    signName: string;
    yucatecName: string;
    glyphIndex: number; // 0-19
    meaning: string;
    direction: string;
    element: string;
    formatted: string; // e.g. 4 Ajaw
  };
  haab: {
    day: number; // 0-19 (or 0-4 for Wayeb)
    monthName: string;
    monthIndex: number; // 0-18
    isWayeb: boolean;
    meaning: string;
    formatted: string; // e.g. 3 K'ank'in
  };
  calendarRound: string;
  kinNumber: number; // 1-260 (Dreamspell / Kin index)
  isGalacticPortalDay: boolean;
  galacticTone: {
    number: number;
    name: string;
    quality: string;
    power: string;
  };
}

export interface PillarData {
  stem: string;
  stemPinYin: string;
  stemElement: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  stemPolarity: 'Yang' | 'Yin';
  branch: string;
  branchPinYin: string;
  zodiacAnimal: string;
  branchElement: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  branchPolarity: 'Yang' | 'Yin';
  combinedNaYin?: string;
}

export interface ChineseResult {
  sexagenaryCycleYear: number; // 1-60
  yearPillar: PillarData;
  monthPillar: PillarData;
  dayPillar: PillarData;
  hourPillar: PillarData;
  solarTerm: {
    name: string;
    chineseName: string;
    solarLongitudeDeg: number;
    approximateDate: string;
  };
  elementDistribution: {
    Wood: number;
    Fire: number;
    Earth: number;
    Metal: number;
    Water: number;
  };
  dominantElement: string;
  lunarPhaseName: string;
  lunarDay: number;
}

export interface EgyptianResult {
  epochName: string;
  civilYear: number;
  season: 'Akhet (Inundation)' | 'Peret (Growth)' | 'Shemu (Harvest)' | 'Epagomenae';
  monthIndex: number;
  monthName: string;
  dayOfMonth: number;
  isEpagomenal: boolean;
  epagomenalDeity?: string;
  sothicGreatYearCycle: number; // 1460-year cycle
  sothicYearInCycle: number;
}

export interface EthiopianResult {
  era: 'Amete Mihret (Year of Grace)';
  year: number;
  monthIndex: number; // 1-13
  monthName: string;
  dayOfMonth: number;
  isPagume: boolean;
  evangelist: 'Matthew' | 'Mark' | 'Luke' | 'John';
  offsetFromGregorianYears: number;
}

export interface GreekResult {
  atticMonthName: string;
  monthIndex: number;
  atticDay: number;
  metonicCycleYear: number; // 1-19
  olympiadNumber: number;
  olympiadYear: number; // 1-4
  patronDeity: string;
  historicFestival: string;
}

export interface NumerologyResult {
  lifePathNumber: number;
  lifePathIsMaster: boolean;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  universalYear: number;
  universalMonth: number;
  universalDay: number;
  personalYear: number;
  chaldeanVibration: number;
  numberMeanings: Record<number, string>;
  compositeVibrationSummary: string;
}

export interface CelestialCoordinate {
  id: string;
  name: string;
  symbol: string;
  eclipticLongitude: number; // 0-360 degrees
  eclipticLatitude: number;
  rightAscensionHours: number;
  declinationDegrees: number;
  zodiacSign: string;
  signDegree: number; // 0-30 degrees
  isRetrograde: boolean;
  speedDegreesPerDay: number;
}

export interface AstrocartographyLine {
  planetId: string;
  planetName: string;
  lineType: 'MC' | 'IC' | 'ASC' | 'DSC';
  lineTypeName: string;
  color: string;
  subSolarLongitude: number; // geographic meridian longitude degrees (-180 to 180)
  description: string;
  themes: string[];
  declinationDegrees?: number;
  rightAscensionHours?: number;
  pathPoints?: Array<{ lat: number; lng: number }>;
  paranCrossings?: Array<{
    lat: number;
    lng: number;
    intersectingPlanet: string;
    intersectingLineType: 'MC' | 'IC' | 'ASC' | 'DSC';
    title: string;
    interpretation: string;
  }>;
}

export interface SanctuaryNode {
  name: string;
  lat: number;
  lng: number;
  elevationMeters: number;
  tradition: string;
  archetype: string;
  description: string;
  historicalSignificance: string;
}

export interface DailyEnergyReport {
  dateString: string;
  julianDayUT: number;
  gregorianFormatted: string;
  executiveSynthesis: string;
  dominantTone: string;
  universalDayNumber: number;
  universalDayVibration: string;
  gaiaOvercast: {
    geomagneticStatus: string;
    geomagneticKp: number;
    schumannFrequencyHz: number;
    aspectTensionScore: number;
    collectivePolarity: string;
    dominantElement: string;
    solarTerm: string;
    lunarIlluminationPercent: number;
    lunarPhaseName: string;
    lunarTone: string;
    atmosphericNarrative: string;
  };
  celestialWeather: {
    sunPosition: string;
    moonPosition: string;
    activeAspects: Array<{
      body1: string;
      body2: string;
      aspect: string;
      orb: number;
      nature: 'Harmonious' | 'Dynamic Tension' | 'Neutral';
      meaning: string;
    }>;
    retrogradeBodies: string[];
    cosmicCounsel: string;
  };
  mayanProfile: {
    longCount: string;
    kinNumber: number;
    tzolkinFormatted: string;
    solarTone: string;
    haabFormatted: string;
    isGalacticPortalDay: boolean;
    wavespellName: string;
    fifthForceGuide: string;
    spiritualProtocol: string;
  };
  chineseProfile: {
    yearPillar: string;
    monthPillar: string;
    dayPillar: string;
    stemElement: string;
    branchAnimal: string;
    solarTerm: string;
    wuXingDynamic: string;
  };
  ancientCalendars: {
    egyptian: string;
    ethiopian: string;
    greekAttic: string;
    julianEquivalent: string;
    enochian?: string;
    biblicalTekufah?: string;
    romanDies?: string;
    planetaryHour?: string;
  };
  geneKeyTransit: {
    sunGate: number;
    line: number;
    name: string;
    shadow: string;
    gift: string;
    siddhi: string;
    earthGate: number;
    earthGift: string;
  };
  twelveTribesResonance: {
    primaryTribe: string;
    campDirection: string;
    gemstone: string;
    guidance: string;
  };
  dailyStrategicActionPlan: {
    goldenThread: string;
    whatToHarness: string[];
    whatToAvoid: string[];
    peakPowerWindow: string;
    dialecticalFork: {
      title: string;
      choiceA: string;
      choiceB: string;
      syntheticResolution: string;
    };
  };
  extendedMonograph?: string;
  wordCountEstimate?: number;
  vedicProfile?: {
    nakshatra: {
      name: string;
      number: number; // 1-27
      pada: number; // 1-4
      rulingPlanet: string;
      deity: string;
      shakti: string;
      symbol: string;
    };
    tithi: {
      number: number;
      name: string;
      paksha: 'Shukla (Waxing)' | 'Krishna (Waning)';
      nature: string;
    };
    yoga: {
      name: string;
      meaning: string;
      quality: 'Auspicious' | 'Challenging' | 'Neutral';
    };
    karana: {
      name: string;
      lord: string;
    };
    lahiriAyanamshaDeg: number;
  };
  siderealProfile?: {
    sunSign: string;
    sunDegree: number;
    moonSign: string;
    moonDegree: number;
    ayanamshaOffsetDeg: number;
    iauConstellationSun: string;
    iauConstellationMoon: string;
  };
  asteroidsAndOtherMoons?: {
    asteroids: Array<{
      id: string;
      name: string;
      symbol: string;
      zodiacSign: string;
      signDegree: number;
      isRetrograde: boolean;
      archetype: string;
      cosmicCounsel: string;
    }>;
    solarMoons: Array<{
      parentBody: string;
      moonName: string;
      symbol: string;
      mythologicalArchetype: string;
      tidalResonance: string;
    }>;
  };
  activeConstellations?: Array<{
    name: string;
    pivotalStar: string;
    magnitude: number;
    mythology: string;
    resonanceWithGaia: string;
  }>;
  eclipseStatus?: {
    isNearEclipseSeason: boolean;
    daysToNearestEclipse: number;
    nearestEclipseType: 'Total Solar' | 'Annular Solar' | 'Partial Lunar' | 'Total Lunar' | 'Penumbrial Lunar';
    approximateDate: string;
    nodalAxisSign: string;
    esotericImpact: string;
  };
  continentalAndCityOvercast?: {
    continents: Array<{
      name: string;
      fieldStatus: string;
      geomagneticFlux: string;
      leyLineTension: string;
      sovereigntyVector: string;
    }>;
    anchorCities: Array<{
      city: string;
      country: string;
      lat: number;
      lng: number;
      dominantTransitLine: string;
      geodeticZenith: string;
      regionalGuidance: string;
    }>;
  };
}

export interface FourteenDayForecastEntry {
  dayOffset: number; // 0 (today) to 13 (day 14)
  dateString: string;
  gregorianFormatted: string;
  dayOfWeek: string;
  julianDayUT: number;
  synchronicResonanceScore: number; // 0 - 100
  resonanceArchetype: string;
  isPeakResonanceDay: boolean;
  mayan: {
    longCount: string;
    kinNumber: number;
    tzolkinFormatted: string;
    signName: string;
    galacticTone: {
      number: number;
      name: string;
      power: string;
    };
    haabFormatted: string;
    wavespellName: string;
    isGalacticPortalDay: boolean;
  };
  chinese: {
    yearPillar: string;
    monthPillar: string;
    dayPillar: string;
    stemElement: string;
    branchAnimal: string;
    solarTerm: string;
    dominantWuXing: string;
    naYin: string;
  };
  planetary: {
    sunZodiac: string;
    sunDegree: number;
    moonZodiac: string;
    moonDegree: number;
    moonPhase: string;
    moonIlluminationPercent: number;
    retrogradeCount: number;
    retrogradeBodies: string[];
    dominantAspect: string;
    activeAspectCount: number;
  };
  vedic: {
    nakshatraName: string;
    nakshatraPada: number;
    nakshatraLord: string;
    tithiName: string;
    paksha: string;
    yogaName: string;
    karanaName: string;
    lahiriAyanamshaDeg: number;
  };
  sidereal: {
    sunSign: string;
    moonSign: string;
    constellationSun: string;
    constellationMoon: string;
  };
  geneKeys: {
    sunGate: number;
    line: number;
    name: string;
    shadow: string;
    gift: string;
    siddhi: string;
    earthGate: number;
    earthGift: string;
  };
  eclipses: {
    isEclipseWindow: boolean;
    daysToNearestEclipse: number;
    nearestEclipseType: string;
    nodalAxis: string;
  };
  celestialMoonsAndAsteroids: {
    activeAsteroids: Array<{ name: string; sign: string; theme: string }>;
    otherMoonsTelemetry: Array<{ system: string; moon: string; energeticQuality: string }>;
    activeConstellations: string[];
  };
  geographicalResonance: {
    targetLocationName: string;
    locationType: 'CITY' | 'COUNTRY' | 'CONTINENT' | 'SANCTUARY';
    coordinates: { lat: number; lng: number };
    localGeodeticZenith: string;
    powerLinesIntersecting: string[];
    regionalOvercastVector: string;
    resonanceAffinity: number; // 0-100
  };
  birthSynastry: {
    resonanceWithBirthScore: number; // 0-100
    harmoniousInteractions: string[];
    karmicTensionWindows: string[];
    actionableOpportunities: string[];
  };
  dailyNovelisticForecast: string;
  dialecticalFork: {
    title: string;
    pathA: string;
    pathB: string;
    synthesis: string;
  };
  domains: DomainImpacts;
  dailyTheme: string;
  dailyPractice: string;
}

export interface LongTermResonanceForecast {
  generatedAt: string;
  startDateString: string;
  endDateString: string;
  birthProfile: {
    dateString: string;
    timeString: string;
    name: string;
    city: string;
    coordinates: { lat: number; lng: number };
    sunSign: string;
    mayanKin: number;
    chineseDayPillar: string;
    lifePathNumber: number;
    geneKeySunGate: number;
  };
  targetLocation: {
    name: string;
    type: 'CITY' | 'COUNTRY' | 'CONTINENT' | 'SANCTUARY';
    coordinates: { lat: number; lng: number };
  };
  fourteenDayEntries: FourteenDayForecastEntry[];
  macroFourteenDaySynthesis: {
    harmonicArcTheme: string;
    peakTransmutationDayIndex: number;
    mostHarmoniousDayIndex: number;
    mostIntenseDayIndex: number;
    portalDayIndices: number[];
    wavespellPassage: string;
    strategicSummary: string;
  };
}


export interface GeneKeyGate {
  gate: number;
  name: string;
  iChingHexagram: string;
  shadow: string;
  gift: string;
  siddhi: string;
  center: string;
  line: number;
}

export interface TwelveTribeLifeConnotation {
  lifeRepresents: string;
  dayPractice: string;
  shadowToWatch: string;
  giftToEmbody: string;
}

export interface TwelveTribeAffinity {
  tribe: string;
  hebrewName: string;
  gemstone: string;
  bannerSymbol: string;
  zodiacCorrespondence: string;
  directionInCamp: 'East' | 'South' | 'West' | 'North';
  affinityScore: number; // 0 - 100
  archetypeRole: string;
  resonanceDescription: string;
  lifeConnotation?: TwelveTribeLifeConnotation;
  dayConnection?: string;
  monthConnection?: string;
  birthChartConnection?: string;
  nameConnection?: string;
}

export interface SystemCrossNote {
  systemId: string;
  systemName: string;
  /** 1. Why is this calculation included? */
  whyPresent: string;
  /** 2. What does it independently say? */
  independentlySays: string;
  /** 3. Where does it intersect with other systems? */
  intersectsWith: string;
  /** 4. Where does it disagree / tension? */
  disagreesWith: string;
  /** 5. What should you do with that disagreement? */
  doWithDisagreement: string;
  lifeRelevance: string;
  connectsToDay: string;
  connectsToMonth: string;
  connectsToBirthChart: string;
  connectsToName: string;
  triangulatesWith: string[];
  crossNote: string;
}

/** Commercial dossier tier — maps to one-time purchase psychology */
export type DossierTier = 'FREE_PREVIEW' | 'FULL_READING' | 'DEEP_REPORT';

/** Persistent natal / querent baseline for transit comparison */
export interface CrucibleProfile {
  id: string;
  displayName: string;
  querentName: string;
  birth: TemporalInput;
  birthTimeConfidence: 'exact' | 'approximate' | 'unknown_window';
  birthTimeWindowStart?: string; // HH:MM:SS
  birthTimeWindowEnd?: string;
  notes?: string;
  createdAtIso: string;
  updatedAtIso: string;
}

export interface WhatChangedField {
  systemId: string;
  systemName: string;
  label: string;
  before: string;
  after: string;
  status: 'changed' | 'unchanged' | 'methodology_dependent';
}

export interface WhatChangedReport {
  fromLabel: string;
  toLabel: string;
  fromCalculationId: string;
  toCalculationId: string;
  changed: WhatChangedField[];
  unchanged: WhatChangedField[];
  convergenceNotes: string[];
  tensionNotes: string[];
  stabilityNotes: string[];
  summary: string;
}

export interface IntertwiningThread {
  id: string;
  title: string;
  nodes: string[];
  meaning: string;
}

export interface CrossSystemIntertwining {
  systemNotes: SystemCrossNote[];
  twelveTribesEnriched: TwelveTribeAffinity[];
  primaryTribeLife: {
    tribe: string;
    lifeRepresents: string;
    dayPractice: string;
    shadowToWatch: string;
    giftToEmbody: string;
    whyBesideOtherSystems: string;
    dayLink: string;
    monthLink: string;
    birthChartLink: string;
    nameLink: string;
  };
  triangulationNarrative: string;
  intertwiningThreads: IntertwiningThread[];
}

export interface CrossSystemSynthesis {
  compositeElement: 'Wood/Fire' | 'Fire/Metal' | 'Earth/Water' | 'Water/Wood' | 'Air/Metal' | 'Aether' | string;
  dominantPolarity: 'Active (Yang/Solar)' | 'Receptive (Yin/Lunar)' | 'Dynamic Equilibrium';
  harmonicResonanceIndex: number; // 0 - 100
  keyArchetypalThemes: string[];
  crossSystemAgreements: string[];
  creativeTensionsOrAnomalies: string[];
  twelveTribesScores: TwelveTribeAffinity[];
  topResonatingTribe: TwelveTribeAffinity;
  recommendedFocus: string;
}

export interface DreamspellOracle {
  destiny: { kin: number; name: string; seal: string; tone: number };
  guide: { kin: number; name: string; seal: string; tone: number };
  analog: { kin: number; name: string; seal: string; tone: number };
  antipode: { kin: number; name: string; seal: string; tone: number };
  occult: { kin: number; name: string; seal: string; tone: number };
}

export interface DreamspellResult {
  kin: number; // 1-260
  solarSeal: {
    number: number; // 1-20
    name: string;
    mayaName: string;
    action: string;
    power: string;
    essence: string;
    color: 'Red' | 'White' | 'Blue' | 'Yellow';
    chakra: string;
  };
  galacticTone: {
    number: number; // 1-13
    name: string;
    ray: string;
    action: string;
    power: string;
    essence: string;
  };
  signature: string; // e.g. "Kin 108: Red Self-Existing Skywalker"
  colorFamily: {
    name: string;
    essence: string;
    role: string;
  };
  earthFamily: {
    name: 'Polar' | 'Cardinal' | 'Core' | 'Signal' | 'Gateway';
    role: string;
    chakras: string;
  };
  castle: {
    name: string;
    court: string;
    color: string;
    meaning: string;
  };
  wavespell: {
    name: string;
    kinStart: number;
    kinEnd: number;
    positionInWavespell: number; // 1-13
    teachings: string;
  };
  oracle: DreamspellOracle;
  thirteenMoon: {
    moonNumber: number; // 1-13
    moonName: string;
    animalTotem: string;
    serviceQuestion: string;
    dayOfMoon: number; // 1-28
    isDayOutOfTime: boolean;
    weekNumber: number; // 1-4
    radialPlasma: {
      name: string;
      chakra: string;
      quantumFunction: string;
      mantra: string;
    };
  };
  poeticNarrative: string;
}

export type CardinalDirection = 'North' | 'East' | 'South' | 'West';

export interface BiblicalVerseAnchor {
  ref: string;
  text: string;
}

export interface BiblicalSeasonTransit {
  id: string;
  name: string;
  hebrewTekufah: string;
  agriculturalPhase: string;
  enochianWatch: string;
  solarLongitudeRange: string;
  verses: BiblicalVerseAnchor[];
  liturgicalEcho: string;
  energeticCounsel: string;
}

export interface RomanWeekdayDeity {
  gregorianName: string;
  latinDies: string;
  romanDeity: string;
  greekEcho: string;
  planetaryRuler: string;
  energy: string;
  ritualTone: string;
  colorRay: string;
}

export interface PlanetaryHourSlot {
  index: number;
  isDayHour: boolean;
  startHourLocal: number;
  endHourLocal: number;
  planet: string;
  quality: string;
  counsel: string;
  formattedWindow: string;
}

export interface HalfHourMeaning {
  hourIndex: number;
  planet: string;
  phase: string;
  startHourLocal: number;
  endHourLocal: number;
  meaning: string;
  formattedWindow: string;
}

export interface EnochianCompassOrientation {
  mode: 'CIVIL' | 'ENOCHIAN_FLIP';
  civilPrimary: CardinalDirection;
  enochianPrimary: CardinalDirection;
  headingOffsetDegrees: number;
  mirrorEastWest: boolean;
  directionRemap: Record<CardinalDirection, CardinalDirection>;
  worldMapTransform: {
    rotateHeadingBy: number;
    scaleX: number;
    label: string;
  };
  connotation: string;
  triangulationNotes: string[];
}

export interface EnochianBiblicalResult {
  enochian: {
    year: number;
    dayOfYear: number;
    monthIndex: number;
    monthName: string;
    dayOfMonth: number;
    isIntercalaryDay: boolean;
    seasonName: string;
    watchGate: string;
    weekOfYear: number;
    formatted: string;
    sourceAuthority: string;
  };
  biblicalSeason: BiblicalSeasonTransit;
  biblicalTransits: {
    solarLongitudeDeg: number;
    tekufahId: string;
    seasonVerseAnchors: string[];
    liturgicalEcho: string;
    narrative: string;
  };
  gregorianWeekdayDeity: RomanWeekdayDeity;
  julianWeekdayDeity: RomanWeekdayDeity;
  planetaryHours: PlanetaryHourSlot[];
  halfHourMeanings: HalfHourMeaning[];
  currentPlanetaryHour: PlanetaryHourSlot;
  currentHalfHour: HalfHourMeaning;
  compassOrientation: EnochianCompassOrientation;
  triangulationDossier: string;
  abPeek: {
    pathA: { label: string; title: string; summary: string; keySignals: string[] };
    pathB: { label: string; title: string; summary: string; keySignals: string[] };
    synthesis: { title: string; summary: string };
  };
}

export interface CompleteCalculationContext {
  calculationId: string;
  timestamp: string;
  executionDurationMs: number;
  input: TemporalInput;
  temporal: TemporalCoordinate;
  mayan: MayanResult;
  dreamspell: DreamspellResult;
  chinese: ChineseResult;
  egyptian: EgyptianResult;
  ethiopian: EthiopianResult;
  greek: GreekResult;
  numerology: NumerologyResult;
  celestialBodies: CelestialCoordinate[];
  astrocartographyLines: AstrocartographyLine[];
  geneKeysSun: GeneKeyGate;
  geneKeysEarth: GeneKeyGate;
  synthesis: CrossSystemSynthesis;
  enochianBiblical: EnochianBiblicalResult;
  intertwining: CrossSystemIntertwining;
  methodology: MethodologyBundle;
  vedic?: VedicResult;
  gaiaOvercast?: {
    geomagneticStatus: string;
    geomagneticKpEstimated: number;
    schumannFrequencyHz: number;
    lunarIlluminationPercent: number;
    lunarPhaseName: string;
    aspectTensionScore: number;
    collectiveFieldPolarity: string;
    dominantElementalAtmosphere: string;
    literaryOvercastDossier: string;
    epistemicClass: EpistemicClass;
  };
  dialecticalForks?: SharedDialecticalFork[];
  eventTimeIso: string;
  calculationTimeIso: string;
  rulesetHash: string;
}

export interface MicroTestReport {
  id: string;
  tradition: string;
  testName: string;
  expected: string;
  actual: string;
  passed: boolean;
  tolerance?: string;
  notes?: string;
}

export interface CompassQueryRequest {
  prompt: string;
  mode: 'Scholar' | 'Calculator' | 'Practitioner' | 'Synthesizer';
  contextSnapshot?: Partial<CompleteCalculationContext>;
}

export interface CompassQueryResponse {
  answer: string;
  mode: string;
  guidingCompassPoints: string[];
  referencedTraditions: string[];
}
