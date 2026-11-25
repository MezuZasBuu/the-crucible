/**
 * The Crucible — Long-Term Energetic Resonance Engine
 * 14-Day Multi-Tradition Forecast calculating synchronic resonance between
 * Mayan Long Count, 60-Year Chinese Cycle, Planetary Transits, Vedic Jyotish,
 * Sidereal Cosmometry, Gene Keys / Human Design, Asteroids, Moons of the Solar System,
 * Eclipses, and Global Continental / Municipal Terrestrial Field Grids.
 */

import {
  CompleteCalculationContext,
  CrucibleProfile,
  FourteenDayForecastEntry,
  LongTermResonanceForecast,
  TemporalInput
} from '../types';
import { executeCrucibleCalculation } from './crucibleCore';
import { synthesizeDailyBearing } from './editorialSynthesis';
import { WORLD_DEFAULT_LOCATION } from './defaultLocation';

// Preset locations for City, Country, Continent, and Sanctuary analysis
export interface PresetLocation {
  id: string;
  name: string;
  type: 'CITY' | 'COUNTRY' | 'CONTINENT' | 'SANCTUARY';
  lat: number;
  lng: number;
  countryOrRegion: string;
  geodeticMeridian: string;
  leyLineNode: string;
}

export const PRESET_LOCATIONS: PresetLocation[] = [
  // Major Spiritual & Cultural World Hubs
  { id: 'jerusalem', name: 'Jerusalem', type: 'CITY', lat: 31.7683, lng: 35.2137, countryOrRegion: 'Israel', geodeticMeridian: '35°E Zion Axis', leyLineNode: 'Temple Mount / Mount of Olives Core' },
  { id: 'cairo', name: 'Cairo / Giza', type: 'CITY', lat: 29.9792, lng: 31.1342, countryOrRegion: 'Egypt', geodeticMeridian: '31°E Prime Meridian of Antiquity', leyLineNode: 'Great Pyramid Geodetic Anchor' },
  { id: 'rome', name: 'Rome', type: 'CITY', lat: 41.9028, lng: 12.4964, countryOrRegion: 'Italy', geodeticMeridian: '12°E Caput Mundi', leyLineNode: 'Vatican / Capitoline Triad' },
  { id: 'athens', name: 'Athens', type: 'CITY', lat: 37.9838, lng: 23.7275, countryOrRegion: 'Greece', geodeticMeridian: '23°E Hellenic Golden Mean', leyLineNode: 'Acropolis Athena Parthenos' },
  { id: 'beijing', name: 'Beijing', type: 'CITY', lat: 39.9042, lng: 116.4074, countryOrRegion: 'China', geodeticMeridian: '116°E Dragon Meridian', leyLineNode: 'Temple of Heaven Altar of Prayer' },
  { id: 'varanasi', name: 'Varanasi', type: 'CITY', lat: 25.3176, lng: 82.9739, countryOrRegion: 'India', geodeticMeridian: '82°E Kashi Shiva Axis', leyLineNode: 'Ganges Manikarnika Ghat' },
  { id: 'tokyo', name: 'Tokyo', type: 'CITY', lat: 35.6762, lng: 139.6503, countryOrRegion: 'Japan', geodeticMeridian: '139°E Rising Sun Gate', leyLineNode: 'Meiji Jingu / Mount Fuji Vortex' },
  { id: 'london', name: 'London', type: 'CITY', lat: 51.5074, lng: -0.1278, countryOrRegion: 'United Kingdom', geodeticMeridian: '0° Greenwich Prime Meridian', leyLineNode: 'St. Paul / Westminster Abbey' },
  { id: 'paris', name: 'Paris', type: 'CITY', lat: 48.8566, lng: 2.3522, countryOrRegion: 'France', geodeticMeridian: '2°E Historical Paris Rose Line', leyLineNode: 'Notre-Dame / Saint-Sulpice Axis' },
  { id: 'washington', name: 'Washington D.C.', type: 'CITY', lat: 38.9072, lng: -77.0369, countryOrRegion: 'United States', geodeticMeridian: '77°W Potomac Octagram', leyLineNode: 'National Mall Masonic Geometry' },
  { id: 'mexico_city', name: 'Mexico City / Teotihuacan', type: 'CITY', lat: 19.4326, lng: -99.1332, countryOrRegion: 'Mexico', geodeticMeridian: '99°W Fifth Sun Meridian', leyLineNode: 'Pyramid of the Sun / Tenochtitlan' },
  { id: 'cusco', name: 'Cusco / Machu Picchu', type: 'CITY', lat: -13.5319, lng: -71.9675, countryOrRegion: 'Peru', geodeticMeridian: '71°W Andean Ceque Grid', leyLineNode: 'Coricancha Sun Temple' },
  { id: 'lhasa', name: 'Lhasa', type: 'CITY', lat: 29.6525, lng: 91.1721, countryOrRegion: 'Tibet', geodeticMeridian: '91°E Roof of the World', leyLineNode: 'Potala Palace / Jokhang Temple' },
  { id: 'sydney', name: 'Sydney', type: 'CITY', lat: -33.8688, lng: 151.2093, countryOrRegion: 'Australia', geodeticMeridian: '151°E Pacific Austral Gate', leyLineNode: 'Sydney Harbour Songline Nexus' },
  
  // Sacred Earth Sanctuaries
  { id: 'stonehenge', name: 'Stonehenge', type: 'SANCTUARY', lat: 51.1789, lng: -1.8262, countryOrRegion: 'United Kingdom', geodeticMeridian: '1°W Solstitial Axis', leyLineNode: 'Michael-Mary Earth Energy Spine' },
  { id: 'shasta', name: 'Mount Shasta', type: 'SANCTUARY', lat: 41.4092, lng: -122.1949, countryOrRegion: 'United States', geodeticMeridian: '122°W Cascadia Crown', leyLineNode: 'Planetary Root-Crown Transmutation Vortex' },
  { id: 'kailash', name: 'Mount Kailash', type: 'SANCTUARY', lat: 31.0674, lng: 81.3119, countryOrRegion: 'Tibet', geodeticMeridian: '81°E Axis Mundi', leyLineNode: 'Planetary Crown Chakra / Meru Spire' },
  { id: 'lalibela', name: 'Lalibela Rock Churches', type: 'SANCTUARY', lat: 12.0319, lng: 39.0411, countryOrRegion: 'Ethiopia', geodeticMeridian: '39°E New Jerusalem of Africa', leyLineNode: 'Bete Giyorgis Monolithic Cross' },
  { id: 'uluru', name: 'Uluru', type: 'SANCTUARY', lat: -25.3444, lng: 131.0369, countryOrRegion: 'Australia', geodeticMeridian: '131°E Red Center Solar Plexus', leyLineNode: 'Anangu Tjukurpa Creation Spine' },

  // Continents
  { id: 'north_america', name: 'North America', type: 'CONTINENT', lat: 39.8283, lng: -98.5795, countryOrRegion: 'Continental Americas', geodeticMeridian: '98°W Great Plains Geo-Center', leyLineNode: 'Laurentian Shield & Rocky Spine' },
  { id: 'south_america', name: 'South America', type: 'CONTINENT', lat: -14.235, lng: -51.9253, countryOrRegion: 'Continental Americas', geodeticMeridian: '52°W Amazonian Basins', leyLineNode: 'Andean Kundalini Earth Current' },
  { id: 'europe', name: 'Europe', type: 'CONTINENT', lat: 54.526, lng: 15.2551, countryOrRegion: 'Continental Europe', geodeticMeridian: '15°E Central European Meridian', leyLineNode: 'Alpine-Hellenic Crystalline Grid' },
  { id: 'africa', name: 'Africa', type: 'CONTINENT', lat: -8.7832, lng: 34.5085, countryOrRegion: 'Continental Africa', geodeticMeridian: '34°E Great Rift Valley Line', leyLineNode: 'Cradle of Hominid Terrestrial Field' },
  { id: 'asia', name: 'Asia', type: 'CONTINENT', lat: 34.0479, lng: 100.6197, countryOrRegion: 'Continental Eurasia', geodeticMeridian: '100°E Kunlun-Himalayan Mantle', leyLineNode: 'Eurasian Tectonic Heart' },
  { id: 'oceania', name: 'Oceania', type: 'CONTINENT', lat: -22.7359, lng: 140.0188, countryOrRegion: 'Oceania & Pacific', geodeticMeridian: '140°E Coral Ring of Fire', leyLineNode: 'Polynesian Star-Path Navigational Network' },
  { id: 'antarctica', name: 'Antarctica', type: 'CONTINENT', lat: -82.8628, lng: 135.0, countryOrRegion: 'South Polar Shield', geodeticMeridian: 'South Geomagnetic Pole', leyLineNode: 'Cryospheric Magnetic Convergence Field' }
];

// 27 Vedic Nakshatras
export const VEDIC_NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashvins (Twin Divine Physicians)', shakti: 'Power to quickly manifest and heal', symbol: "Horse's Head" },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama (God of Righteous Duty & Death)', shakti: 'Power to cleanse and carry away life', symbol: 'Yoni / Triangle' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni (God of Sacred Fire)', shakti: 'Power to burn away impurities', symbol: 'Flame / Razor' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma (Creator Prajapati)', shakti: 'Power of growth, fertility and creation', symbol: 'Temple Cart / Chariot' },
  { name: 'Mrigashirsha', lord: 'Mars', deity: 'Soma (Moon God of Nectar)', shakti: 'Power to fulfill desire through searching', symbol: "Deer's Head" },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra (Storm God of Dissolution)', shakti: 'Power to achieve through effort and storms', symbol: 'Teardrop / Diamond' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi (Cosmic Mother of Light)', shakti: 'Power of renewal and return of light', symbol: 'Bow and Quiver' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati (Priest of the Gods)', shakti: 'Power of spiritual nourishment', symbol: 'Cow’s Udder / Lotus' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas (Serpent Kings of Wisdom)', shakti: 'Power to embrace and penetrate secrets', symbol: 'Coiled Serpent' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris (The Ancestral Fathers)', shakti: 'Power to leave the body and access roots', symbol: 'Royal Throne Room' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga (God of Prosperity & Fortune)', shakti: 'Power of creative union and affection', symbol: 'Front Legs of Bed' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman (God of Nobility & Honor)', shakti: 'Power of accumulation through prosperity', symbol: 'Back Legs of Bed' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitr (Solar Life-Giver of Awakening)', shakti: 'Power to place what is sought into the hands', symbol: 'Open Hand of Craft' },
  { name: 'Chitra', lord: 'Mars', deity: 'Tvashtar (Celestial Architect)', shakti: 'Power to fashion beauty and wondrous forms', symbol: 'Bright Jewel / Pearl' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu (Wind God of Breath)', shakti: 'Power to scatter and breathe divine freedom', symbol: 'Young Shoot in Wind' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indragni (Indra & Agni Unified)', shakti: 'Power to achieve harvest through focus', symbol: 'Triumphal Arch' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra (God of Compassionate Friendship)', shakti: 'Power of worship and devotion', symbol: 'Row of Offerings / Staff' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra (King of the Gods)', shakti: 'Power to rise above and conquer fear', symbol: 'Circular Amulet / Earring' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti (Goddess of the Root Foundation)', shakti: 'Power to ruin and uproot the false', symbol: 'Tied Bunch of Roots' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas (Cosmic Deified Waters)', shakti: 'Power of invigoration through oceanic purification', symbol: "Fan of Victory" },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvadevas (Universal Gods)', shakti: 'Power to grant unchallengeable victory', symbol: "Elephant's Tusk" },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu (Preserver of the Universe)', shakti: 'Power of deep listening and cosmic connection', symbol: 'Three Footprints / Ear' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Ashta Vasus (Eight Gods of Abundance)', shakti: 'Power to bestow wealth and fame', symbol: 'Drum / Flute' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna (God of Cosmic Waters & Truth)', shakti: 'Power of 100 physicians to heal', symbol: 'Empty Circle / 100 Stars' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada (One-Footed Cosmic Serpent)', shakti: 'Power of evolutionary fire to elevate', symbol: 'Sword / Front of Funeral Cot' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya (Serpent of the Deep)', shakti: 'Power to bring rain and stable sanctuary', symbol: 'Back of Funeral Cot' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan (Nourisher of Flocks & Wayfarer)', shakti: 'Power of nourishment and complete safe passage', symbol: 'Fish Swimming Together' }
];

// Active Major Asteroids & Minor Spheres
export const MAJOR_ASTEROIDS = [
  { id: 'ceres', name: 'Ceres', symbol: '⚳', theme: 'Nourishment and care for the land', counsel: 'Feed something that needs it — a person, a project, a garden.' },
  { id: 'pallas', name: 'Pallas Athena', symbol: '⚴', theme: 'Strategy, fairness and seeing patterns', counsel: 'Step back and think a few moves ahead.' },
  { id: 'juno', name: 'Juno', symbol: '⚵', theme: 'Commitment and loyal partnership', counsel: 'Honour an agreement that protects both sides.' },
  { id: 'vesta', name: 'Vesta', symbol: '⚶', theme: 'Devotion and focus', counsel: 'Protect time for the one thing you care most about.' },
  { id: 'chiron', name: 'Chiron', symbol: '⚷', theme: 'Healing through an old hurt', counsel: 'Share something you learned the hard way.' },
  { id: 'astraea', name: 'Astraea', symbol: '⚖', theme: 'Honesty and fair dealing', counsel: 'Keep your standards even when others let theirs slip.' }
];

// Other Moons of the Solar System Telemetry
export const SOLAR_SYSTEM_MOONS = [
  { system: 'Jupiter', moon: 'Io', symbol: '🌋', energeticQuality: 'The most volcanic world known — an image of pressure breaking through.' },
  { system: 'Jupiter', moon: 'Europa', symbol: '❄️', energeticQuality: 'An ocean hidden under ice — an image of depth beneath a calm surface.' },
  { system: 'Jupiter', moon: 'Ganymede', symbol: '🛡️', energeticQuality: 'The largest moon, with its own magnetic field — an image of quiet strength.' },
  { system: 'Jupiter', moon: 'Callisto', symbol: '☄️', energeticQuality: 'An ancient, heavily cratered surface — an image of endurance.' },
  { system: 'Saturn', moon: 'Titan', symbol: '🌫️', energeticQuality: 'A thick orange haze over lakes — an image of things still forming.' },
  { system: 'Saturn', moon: 'Enceladus', symbol: '💧', energeticQuality: 'Geysers of ice spraying into space — an image of something fresh breaking out.' },
  { system: 'Earth', moon: 'Kamoʻoalewa (Quasi-Moon)', symbol: '🛰️', energeticQuality: 'A small asteroid that keeps pace with Earth — an image of a steady companion.' },
  { system: 'Mars', moon: 'Phobos & Deimos', symbol: '⚔️', energeticQuality: 'Named “fear” and “dread” — an image of nerves turned into alertness.' }
];

// Active Constellations & Deep Sky Portals
export const ACTIVE_CONSTELLATIONS = [
  { name: 'Orion the Hunter', pivotalStar: 'Betelgeuse / Rigel', magnitude: 0.45, mythology: 'The Celestial Sentinel rising above the winter horizon', resonanceWithGaia: 'Activates solar courage and spiritual warrior archetypes.' },
  { name: 'The Pleiades (Seven Sisters)', pivotalStar: 'Alcyone', magnitude: 2.85, mythology: 'The Central Sun of the local cluster and matrix of seed memory', resonanceWithGaia: 'Induces rapid DNA harmonic calibration and emotional attunement.' },
  { name: 'Sirius / Canis Major', pivotalStar: 'Sirius A (The Blazing Dog Star)', magnitude: -1.46, mythology: 'The Golden Eye of Isis, harbinger of the Sothic Nile inundation', resonanceWithGaia: 'Beams sovereign royal frequency and supreme spiritual illumination.' },
  { name: 'Ursa Major (The Great Bear / Saptarishi)', pivotalStar: 'Dubhe & Merak (The Pointers to Polaris)', magnitude: 1.8, mythology: 'The Seven Sages anchoring the Northern Celestial Pole', resonanceWithGaia: 'Stabilizes terrestrial axis precession and karmic lineage anchors.' },
  { name: 'Scorpius & Antares', pivotalStar: 'Antares (Heart of the Scorpion, Watcher of the West)', magnitude: 1.05, mythology: 'The Guardian of the Gateway of Metamorphosis and Rebirth', resonanceWithGaia: 'Tests integrity through the forge of intense alchemical purification.' },
  { name: 'Cygnus the Northern Cross', pivotalStar: 'Deneb', magnitude: 1.25, mythology: 'The Celestial Swan flying along the Milky Way river of souls', resonanceWithGaia: 'Connects the earthly journey to the hyper-dimensional cosmic spine.' },
  { name: 'Galactic Center (27° Sagittarius)', pivotalStar: 'Sagittarius A*', magnitude: 0.0, mythology: 'The Supermassive Cosmic Heart and Origin Point of our Galaxy', resonanceWithGaia: 'Emits intense gravitational and radio waves instigating evolutionary leaps.' }
];

/**
 * Calculates Vedic Nakshatra from tropical Moon Longitude by applying Lahiri Ayanamsha.
 */
export function calculateVedicDetails(tropicalMoonDeg: number, tropicalSunDeg: number, jd: number) {
  // Lahiri Ayanamsha: approx 23.85° at J2000 + 50.29 arcsec per year
  const t = (jd - 2451545.0) / 36525;
  const lahiriAyanamsha = 23.85 + (50.29 / 3600) * (jd - 2451545.0) / 365.25;

  let siderealMoon = (tropicalMoonDeg - lahiriAyanamsha) % 360;
  if (siderealMoon < 0) siderealMoon += 360;

  let siderealSun = (tropicalSunDeg - lahiriAyanamsha) % 360;
  if (siderealSun < 0) siderealSun += 360;

  // 1 Nakshatra = 13° 20' = 13.333333°
  const nakshatraSpan = 360 / 27;
  const nakshatraIndex = Math.floor(siderealMoon / nakshatraSpan);
  const degreeInNakshatra = siderealMoon % nakshatraSpan;
  const pada = Math.floor(degreeInNakshatra / (nakshatraSpan / 4)) + 1;

  const nakshatra = VEDIC_NAKSHATRAS[nakshatraIndex % 27];

  // Tithi: Each Tithi is 12° difference between Moon and Sun
  let angleDiff = (siderealMoon - siderealSun + 360) % 360;
  const tithiNumber = Math.floor(angleDiff / 12) + 1;
  const paksha = tithiNumber <= 15 ? 'Shukla (Waxing)' : 'Krishna (Waning)';

  const TITHI_NAMES = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shasthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima / Amavasya'
  ];
  const tithiNameIndex = ((tithiNumber - 1) % 15);
  const tithiName = `${paksha.split(' ')[0]} ${TITHI_NAMES[tithiNameIndex]}`;

  // Yoga: Sum of Sun and Moon / 13°20'
  const yogaSum = (siderealSun + siderealMoon) % 360;
  const yogaIndex = Math.floor(yogaSum / (360 / 27));
  const YOGA_NAMES = [
    'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
    'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata',
    'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
  ];
  const yogaName = YOGA_NAMES[yogaIndex % 27];

  // Karana: Half-tithi = 6°
  const karanaIndex = Math.floor(angleDiff / 6) + 1;
  const KARANA_NAMES = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)',
    'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
  ];
  const karanaName = KARANA_NAMES[karanaIndex % 11];

  return {
    nakshatraName: nakshatra.name,
    nakshatraNumber: (nakshatraIndex % 27) + 1,
    nakshatraPada: pada,
    nakshatraLord: nakshatra.lord,
    nakshatraDeity: nakshatra.deity,
    nakshatraShakti: nakshatra.shakti,
    nakshatraSymbol: nakshatra.symbol,
    tithiName,
    paksha,
    tithiNumber,
    yogaName,
    karanaName,
    lahiriAyanamshaDeg: Math.round(lahiriAyanamsha * 100) / 100,
    siderealSunDeg: Math.round(siderealSun * 100) / 100,
    siderealMoonDeg: Math.round(siderealMoon * 100) / 100,
    epistemicClass: 'SYSTEM_INTERPRETATION' as const
  };
}

/**
 * Calculates Sidereal IAU Constellations from degrees.
 */
export function getSiderealZodiacAndConstellation(deg: number) {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signIdx = Math.floor(deg / 30);
  const sign = signs[signIdx % 12];

  // IAU astronomical constellation boundaries (approximate)
  let constellation = sign;
  if (deg >= 29 && deg < 54) constellation = 'Aries';
  else if (deg >= 54 && deg < 90) constellation = 'Taurus';
  else if (deg >= 90 && deg < 118) constellation = 'Gemini';
  else if (deg >= 118 && deg < 138) constellation = 'Cancer';
  else if (deg >= 138 && deg < 174) constellation = 'Leo';
  else if (deg >= 174 && deg < 218) constellation = 'Virgo';
  else if (deg >= 218 && deg < 241) constellation = 'Libra';
  else if (deg >= 241 && deg < 248) constellation = 'Scorpius';
  else if (deg >= 248 && deg < 266) constellation = 'Ophiuchus (The Serpent Bearer)';
  else if (deg >= 266 && deg < 299) constellation = 'Sagittarius';
  else if (deg >= 299 && deg < 327) constellation = 'Capricornus';
  else if (deg >= 327 && deg < 351) constellation = 'Aquarius';
  else constellation = 'Pisces';

  return { sign, constellation };
}

/**
 * Calculates proximity to Eclipse Seasons based on Sun's proximity to Lunar Nodes.
 */
export function calculateEclipseStatus(sunLongDeg: number, northNodeLongDeg: number) {
  // Solar/Lunar eclipses happen when the Sun is within ~18° of the North or South Lunar Node
  const southNodeLongDeg = (northNodeLongDeg + 180) % 360;

  const distToNorth = Math.min(
    Math.abs(sunLongDeg - northNodeLongDeg),
    360 - Math.abs(sunLongDeg - northNodeLongDeg)
  );
  const distToSouth = Math.min(
    Math.abs(sunLongDeg - southNodeLongDeg),
    360 - Math.abs(sunLongDeg - southNodeLongDeg)
  );

  const minDistToNode = Math.min(distToNorth, distToSouth);
  const isNearEclipse = minDistToNode <= 18.5;

  // Approx days until exact conjunction/opposition (Sun moves ~0.9856°/day, Node moves ~ -0.053°/day => ~1.038°/day relative)
  const daysToNearestEclipse = Math.max(0, Math.round(minDistToNode / 1.038));

  let nearestEclipseType = 'Total Solar';
  if (minDistToNode > 12) nearestEclipseType = 'Penumbral Lunar';
  else if (minDistToNode > 6) nearestEclipseType = 'Partial Lunar';
  else nearestEclipseType = 'Total Solar';

  const nodalAxisSign = northNodeLongDeg >= 0 && northNodeLongDeg < 30 ? 'Aries-Libra Axis' :
    northNodeLongDeg < 60 ? 'Taurus-Scorpio Axis' :
    northNodeLongDeg < 90 ? 'Gemini-Sagittarius Axis' :
    northNodeLongDeg < 120 ? 'Cancer-Capricorn Axis' :
    northNodeLongDeg < 150 ? 'Leo-Aquarius Axis' :
    northNodeLongDeg < 180 ? 'Virgo-Pisces Axis' :
    northNodeLongDeg < 210 ? 'Libra-Aries Axis' :
    northNodeLongDeg < 240 ? 'Scorpio-Taurus Axis' :
    northNodeLongDeg < 270 ? 'Sagittarius-Gemini Axis' :
    northNodeLongDeg < 300 ? 'Capricorn-Cancer Axis' :
    northNodeLongDeg < 330 ? 'Aquarius-Leo Axis' : 'Pisces-Virgo Axis';

  return {
    isNearEclipse,
    daysToNearestEclipse,
    nearestEclipseType,
    nodalAxisSign
  };
}

/**
 * Calculates Synchronic 14-Day Forecast with multi-tradition algorithms
 * for a user's birth data across any chosen geographical city, country, or continent.
 */
export function generateFourteenDayForecast(
  birthDateInput: TemporalInput,
  startDateString?: string,
  targetLocationId: string = 'london',
  userName: string = 'you'
): LongTermResonanceForecast {
  // Normalize base start date
  let baseDate: Date;
  if (startDateString) {
    const parts = startDateString.split('-');
    baseDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
  } else {
    baseDate = new Date();
  }

  // Find target location
  const location = PRESET_LOCATIONS.find((l) => l.id === targetLocationId) || PRESET_LOCATIONS[0];

  // Calculate Natal Birth Context
  const birthCtx = executeCrucibleCalculation(birthDateInput);

  const birthProfile: CrucibleProfile = {
    id: 'forecast-birth',
    displayName: userName,
    querentName: userName,
    birth: birthDateInput,
    birthTimeConfidence: 'approximate',
    createdAtIso: new Date().toISOString(),
    updatedAtIso: new Date().toISOString()
  };

  const entries: FourteenDayForecastEntry[] = [];
  const portalDayIndices: number[] = [];

  for (let offset = 0; offset < 14; offset++) {
    const dayDate = new Date(baseDate.getTime() + offset * 24 * 60 * 60 * 1000);
    const year = dayDate.getFullYear();
    const month = String(dayDate.getMonth() + 1).padStart(2, '0');
    const day = String(dayDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    // Execute full Crucible calculation for this specific day & location
    const dayCtx = executeCrucibleCalculation({
      dateString: dateStr,
      timeString: '12:00:00',
      timezoneOffsetMinutes: -dayDate.getTimezoneOffset(),
      isUTC: false,
      location: {
        latitude: location.lat,
        longitude: location.lng,
        elevationMeters: 500,
        city: location.name,
        country: location.countryOrRegion
      }
    });

    const julianDay = dayCtx.temporal.julianDayUT;
    const gregorianFormatted = dayDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const dayOfWeek = dayDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Planetary positions
    const sun = dayCtx.celestialBodies.find((b) => b.id === 'sun') || dayCtx.celestialBodies[0];
    const moon = dayCtx.celestialBodies.find((b) => b.id === 'moon') || dayCtx.celestialBodies[1];
    const northNode = dayCtx.celestialBodies.find((b) => b.id === 'north_node') || { eclipticLongitude: 120 };

    const retrogrades = dayCtx.celestialBodies.filter((b) => b.isRetrograde).map((b) => b.name);

    // Moon phase & illumination
    const moonSunElongation = (moon.eclipticLongitude - sun.eclipticLongitude + 360) % 360;
    const moonIllumPercent = Math.round((1 - Math.cos((moonSunElongation * Math.PI) / 180)) * 50);
    let moonPhase = 'New Moon';
    if (moonSunElongation > 15 && moonSunElongation < 75) moonPhase = 'Waxing Crescent';
    else if (moonSunElongation >= 75 && moonSunElongation < 105) moonPhase = 'First Quarter';
    else if (moonSunElongation >= 105 && moonSunElongation < 165) moonPhase = 'Waxing Gibbous';
    else if (moonSunElongation >= 165 && moonSunElongation < 195) moonPhase = 'Full Moon';
    else if (moonSunElongation >= 195 && moonSunElongation < 255) moonPhase = 'Waning Gibbous';
    else if (moonSunElongation >= 255 && moonSunElongation < 285) moonPhase = 'Third Quarter';
    else if (moonSunElongation >= 285 && moonSunElongation < 345) moonPhase = 'Waning Crescent';

    // Vedic computations
    const vedic = calculateVedicDetails(moon.eclipticLongitude, sun.eclipticLongitude, julianDay);
    const siderealSun = getSiderealZodiacAndConstellation(vedic.siderealSunDeg);
    const siderealMoon = getSiderealZodiacAndConstellation(vedic.siderealMoonDeg);

    // Eclipse status
    const eclipse = calculateEclipseStatus(sun.eclipticLongitude, northNode.eclipticLongitude);

    // Active Asteroids with daily perturbations
    const activeAsteroids = MAJOR_ASTEROIDS.map((ast, idx) => {
      const asteroidAngle = (sun.eclipticLongitude + idx * 58.7 + offset * 0.4) % 360;
      const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      const sign = signs[Math.floor(asteroidAngle / 30)];
      return {
        name: ast.name,
        sign,
        theme: ast.theme
      };
    });

    // Other Moons of the Solar System telemetry for the day
    const otherMoonsTelemetry = SOLAR_SYSTEM_MOONS.slice(0, 4 + (offset % 4));

    // Active Constellations
    const activeConstellations = ACTIVE_CONSTELLATIONS.slice(0, 4).map((c) => c.name);

    // Calculate Synchronic Resonance Score (0 - 100) between Birth Data and Transit Day
    // Compares Mayan Kin distance, Chinese pillar compatibility, Gene Keys harmonics, and Aspect Harmony
    let resonanceScore = 72;

    // Harmonic kinship in Maya
    const kinDiff = Math.abs(birthCtx.mayan.kinNumber - dayCtx.mayan.kinNumber);
    if (kinDiff % 5 === 0 || kinDiff % 13 === 0) resonanceScore += 8;
    if (dayCtx.mayan.isGalacticPortalDay) {
      resonanceScore += 10;
      portalDayIndices.push(offset);
    }

    // Chinese Element Harmony
    const birthStemElem = birthCtx.chinese.dayPillar.stemElement;
    const transitStemElem = dayCtx.chinese.dayPillar.stemElement;
    if (birthStemElem === transitStemElem) resonanceScore += 5;
    else if (
      (birthStemElem === 'Wood' && transitStemElem === 'Fire') ||
      (birthStemElem === 'Fire' && transitStemElem === 'Earth') ||
      (birthStemElem === 'Earth' && transitStemElem === 'Metal') ||
      (birthStemElem === 'Metal' && transitStemElem === 'Water') ||
      (birthStemElem === 'Water' && transitStemElem === 'Wood')
    ) {
      resonanceScore += 9; // Generating Cycle
    }

    // Gene Keys harmony
    if (birthCtx.geneKeysSun.gate === dayCtx.geneKeysSun.gate) resonanceScore += 12;
    else if (Math.abs(birthCtx.geneKeysSun.gate - dayCtx.geneKeysSun.gate) === 32) resonanceScore += 7; // Polar opposite gate

    // Retrograde impact
    if (retrogrades.length >= 4) resonanceScore -= 4; // High friction, inward turning
    resonanceScore = Math.min(99, Math.max(48, resonanceScore));

    const isPeakResonanceDay = resonanceScore >= 88 || dayCtx.mayan.isGalacticPortalDay;

    // Resonance Archetype
    let resonanceArchetype = 'A mixed day';
    if (resonanceScore >= 90) resonanceArchetype = 'A stand-out day — good for acting on plans';
    else if (resonanceScore >= 82) resonanceArchetype = 'A supportive day — things come together';
    else if (resonanceScore >= 72) resonanceArchetype = 'A steady day — good for review and tidying up';
    else resonanceArchetype = 'A demanding day — go gently and clear what is in the way';

    // Geographical Resonance with the selected City/Country/Continent
    const localLines = dayCtx.astrocartographyLines
      .filter((l) => Math.abs(l.subSolarLongitude - location.lng) < 45)
      .map((l) => `${l.planetName} ${l.lineType}`);

    const regionalVector = `Seen from ${location.name}; the strongest Chinese element that day is ${dayCtx.chinese.dominantElement.toLowerCase()}.`;

    // Birth Synastry
    const harmoniousInteractions: string[] = [
      `The Sun in ${sun.zodiacSign} that day supports your birth calling, ${birthCtx.synthesis.topCalling.calling}.`,
      `The day’s Chinese element (${dayCtx.chinese.dayPillar.stemElement.toLowerCase()}) works alongside your birth element (${String(birthStemElem).toLowerCase()}).`,
      `The Maya day sign (${dayCtx.mayan.tzolkin.formatted}) sits comfortably with your birth day sign (${birthCtx.mayan.tzolkin.formatted}).`
    ];

    const karmicTensionWindows: string[] = [
      retrogrades.length > 0
        ? `${retrogrades.join(', ')} ${retrogrades.length === 1 ? 'appears' : 'appear'} to move backward (retrograde) — traditionally a reason to double-check before signing or announcing anything.`
        : 'No planets are retrograde, which astrologers read as a clear run for new announcements.',
      `The Vedic lunar day (${vedic.tithiName}) traditionally calls for careful speech.`
    ];

    const actionableOpportunities: string[] = [
      `The Maya day number ${dayCtx.mayan.galacticTone.number} is linked with “${dayCtx.mayan.galacticTone.power.toLowerCase()}” — a good theme for focused work.`,
      `Gene Key ${dayCtx.geneKeysSun.gate}: practise ${dayCtx.geneKeysSun.gift.toLowerCase()} when you notice ${dayCtx.geneKeysSun.shadow.toLowerCase()}.`,
      `Take a quiet moment somewhere that matters to you in ${location.name}.`
    ];

    // Novelistic Forecast Narrative for the day
    const dailyNovelisticForecast = `${dayOfWeek} is ${dayCtx.mayan.tzolkin.formatted} in the Maya calendar (${dayCtx.mayan.tzolkin.meaning.split('/')[0].trim().toLowerCase()}) and a ${dayCtx.chinese.dayPillar.stemElement} ${dayCtx.chinese.dayPillar.zodiacAnimal} day in the Chinese calendar.
The Sun is in ${sun.zodiacSign} and the Moon is in ${moon.zodiacSign} (${moonPhase.toLowerCase()}). In Indian astrology the Moon sits in the lunar mansion ${vedic.nakshatraName}, linked with ${String(vedic.nakshatraShakti).toLowerCase()}.
For ${userName}, the match score is ${resonanceScore}%.
${isPeakResonanceDay ? 'This is one of the stronger days in the fortnight — a good candidate for something you want to go well.' : 'This is an ordinary working day — better for steady progress than for big launches.'}`;

    // Two ways to approach the day
    const dialecticalFork = {
      title: `Two ways to use ${dayOfWeek}`,
      pathA: `Act: the Maya day sign ${dayCtx.mayan.tzolkin.formatted} favours taking the initiative and stating plainly what you want.`,
      pathB: `Wait: the Chinese ${dayCtx.chinese.dayPillar.stemElement} ${dayCtx.chinese.dayPillar.zodiacAnimal} day favours watching how things settle before you move.`,
      synthesis: `A middle path: act on the one thing that really matters and let the rest wait.`
    };

    const dayBearing = synthesizeDailyBearing(dayCtx, 'overview', birthProfile, 'personal');

    entries.push({
      dayOffset: offset,
      dateString: dateStr,
      gregorianFormatted,
      dayOfWeek,
      julianDayUT: Math.round(julianDay * 100) / 100,
      synchronicResonanceScore: resonanceScore,
      resonanceArchetype,
      isPeakResonanceDay,
      mayan: {
        longCount: dayCtx.mayan.longCount.formatted,
        kinNumber: dayCtx.mayan.kinNumber,
        tzolkinFormatted: dayCtx.mayan.tzolkin.formatted,
        signName: dayCtx.mayan.tzolkin.signName,
        galacticTone: {
          number: dayCtx.mayan.galacticTone.number,
          name: dayCtx.mayan.galacticTone.name,
          power: dayCtx.mayan.galacticTone.power
        },
        haabFormatted: dayCtx.mayan.haab.formatted,
        wavespellName: dayCtx.dreamspell.wavespell.name,
        isGalacticPortalDay: dayCtx.mayan.isGalacticPortalDay
      },
      chinese: {
        yearPillar: `${dayCtx.chinese.yearPillar.stemPinYin} ${dayCtx.chinese.yearPillar.branchPinYin} (${dayCtx.chinese.yearPillar.stemElement} ${dayCtx.chinese.yearPillar.zodiacAnimal})`,
        monthPillar: `${dayCtx.chinese.monthPillar.stemPinYin} ${dayCtx.chinese.monthPillar.branchPinYin} (${dayCtx.chinese.monthPillar.stemElement} ${dayCtx.chinese.monthPillar.zodiacAnimal})`,
        dayPillar: `${dayCtx.chinese.dayPillar.stemPinYin} ${dayCtx.chinese.dayPillar.branchPinYin} (${dayCtx.chinese.dayPillar.stemElement} ${dayCtx.chinese.dayPillar.zodiacAnimal})`,
        stemElement: dayCtx.chinese.dayPillar.stemElement,
        branchAnimal: dayCtx.chinese.dayPillar.zodiacAnimal,
        solarTerm: dayCtx.chinese.solarTerm.name,
        dominantWuXing: dayCtx.chinese.dominantElement,
        naYin: dayCtx.chinese.dayPillar.combinedNaYin || 'Great Sea Water'
      },
      planetary: {
        sunZodiac: `${sun.zodiacSign} ${sun.signDegree.toFixed(1)}°`,
        sunDegree: Math.round(sun.eclipticLongitude * 10) / 10,
        moonZodiac: `${moon.zodiacSign} ${moon.signDegree.toFixed(1)}°`,
        moonDegree: Math.round(moon.eclipticLongitude * 10) / 10,
        moonPhase,
        moonIlluminationPercent: moonIllumPercent,
        retrogradeCount: retrogrades.length,
        retrogradeBodies: retrogrades.length > 0 ? retrogrades : ['None (All Direct)'],
        dominantAspect: `${sun.zodiacSign} Sun sextile ${moon.zodiacSign} Moon`,
        activeAspectCount: dayCtx.celestialBodies.length
      },
      vedic: {
        nakshatraName: vedic.nakshatraName,
        nakshatraPada: vedic.nakshatraPada,
        nakshatraLord: vedic.nakshatraLord,
        tithiName: vedic.tithiName,
        paksha: vedic.paksha,
        yogaName: vedic.yogaName,
        karanaName: vedic.karanaName,
        lahiriAyanamshaDeg: vedic.lahiriAyanamshaDeg
      },
      sidereal: {
        sunSign: siderealSun.sign,
        moonSign: siderealMoon.sign,
        constellationSun: siderealSun.constellation,
        constellationMoon: siderealMoon.constellation
      },
      geneKeys: {
        sunGate: dayCtx.geneKeysSun.gate,
        line: dayCtx.geneKeysSun.line,
        name: dayCtx.geneKeysSun.name,
        shadow: dayCtx.geneKeysSun.shadow,
        gift: dayCtx.geneKeysSun.gift,
        siddhi: dayCtx.geneKeysSun.siddhi,
        earthGate: dayCtx.geneKeysEarth.gate,
        earthGift: dayCtx.geneKeysEarth.gift
      },
      eclipses: {
        isEclipseWindow: eclipse.isNearEclipse,
        daysToNearestEclipse: eclipse.daysToNearestEclipse,
        nearestEclipseType: eclipse.nearestEclipseType,
        nodalAxis: eclipse.nodalAxisSign
      },
      celestialMoonsAndAsteroids: {
        activeAsteroids,
        otherMoonsTelemetry,
        activeConstellations
      },
      geographicalResonance: {
        targetLocationName: location.name,
        locationType: location.type,
        coordinates: { lat: location.lat, lng: location.lng },
        localGeodeticZenith: `${location.name} · ${location.leyLineNode}`,
        powerLinesIntersecting: localLines.length > 0 ? localLines : [],
        regionalOvercastVector: regionalVector,
        resonanceAffinity: Math.round((resonanceScore + 15) % 30 + 70)
      },
      birthSynastry: {
        resonanceWithBirthScore: resonanceScore,
        harmoniousInteractions,
        karmicTensionWindows,
        actionableOpportunities
      },
      dailyNovelisticForecast,
      dialecticalFork,
      domains: dayBearing.domains,
      dailyTheme: dayBearing.theme,
      dailyPractice: dayBearing.practice
    });
  }

  // Find peak day, most harmonious day, and intense day
  let peakIndex = 0;
  let maxScore = -1;
  let minScore = 999;
  let minIndex = 0;

  entries.forEach((entry, idx) => {
    if (entry.synchronicResonanceScore > maxScore) {
      maxScore = entry.synchronicResonanceScore;
      peakIndex = idx;
    }
    if (entry.synchronicResonanceScore < minScore) {
      minScore = entry.synchronicResonanceScore;
      minIndex = idx;
    }
  });

  const macroFourteenDaySynthesis = {
    harmonicArcTheme: `The 14-day passage begins in consolidation, ascends to a peak alchemical crescendo on Day ${peakIndex + 1} (${entries[peakIndex].gregorianFormatted}), and settles into an integrated manifestation cycle grounded in ${location.name}'s geodetic field.`,
    peakTransmutationDayIndex: peakIndex,
    mostHarmoniousDayIndex: peakIndex,
    mostIntenseDayIndex: minIndex,
    portalDayIndices,
    wavespellPassage: `Transits traverse Kin ${entries[0].mayan.kinNumber} through Kin ${entries[13].mayan.kinNumber} across the Dreamspell matrix.`,
    strategicSummary: `Over these two weeks the strongest day is day ${peakIndex + 1} — a good choice for anything you want to go well. The quietest is day ${minIndex + 1}, better kept for rest and review. Scores are for ${userName}, seen from ${location.name}.`
  };

  return {
    generatedAt: new Date().toISOString(),
    startDateString: entries[0].dateString,
    endDateString: entries[13].dateString,
    birthProfile: {
      dateString: birthCtx.input.dateString,
      timeString: birthCtx.input.timeString,
      name: userName,
      city: birthCtx.input.location?.city || 'Universal Meridian',
      coordinates: {
        lat: birthCtx.input.location?.latitude ?? WORLD_DEFAULT_LOCATION.latitude,
        lng: birthCtx.input.location?.longitude ?? WORLD_DEFAULT_LOCATION.longitude
      },
      sunSign: birthCtx.celestialBodies[0]?.zodiacSign || 'Aries',
      mayanKin: birthCtx.mayan.kinNumber,
      chineseDayPillar: `${birthCtx.chinese.dayPillar.stemElement} ${birthCtx.chinese.dayPillar.zodiacAnimal}`,
      lifePathNumber: birthCtx.numerology.lifePathNumber,
      geneKeySunGate: birthCtx.geneKeysSun.gate
    },
    targetLocation: {
      name: location.name,
      type: location.type,
      coordinates: { lat: location.lat, lng: location.lng }
    },
    fourteenDayEntries: entries,
    macroFourteenDaySynthesis
  };
}
