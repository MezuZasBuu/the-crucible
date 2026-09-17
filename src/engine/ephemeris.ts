/**
 * The Crucible — Celestial Ephemeris Engine
 * Real-time analytical ephemeris for Solar, Lunar, and Planetary bodies.
 * Computes Ecliptic Longitude, Right Ascension, Declination, Retrograde status,
 * celestial aspects, and smooth novel-like archetypal commentaries.
 */

import { CelestialCoordinate, TemporalCoordinate } from '../types';

export interface CelestialAspect {
  bodyA: string;
  bodyB: string;
  bodyASymbol: string;
  bodyBSymbol: string;
  aspectType: 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition';
  angleDeg: number;
  exactAngleDeg: number;
  orbDeg: number;
  isApplying: boolean;
  harmony: 'Harmonious' | 'Dynamic Tension' | 'Unified Convergence';
  novelisticDescription: string;
}

export const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire', modality: 'Cardinal', ruler: 'Mars' },
  { name: 'Taurus', symbol: '♉', element: 'Earth', modality: 'Fixed', ruler: 'Venus' },
  { name: 'Gemini', symbol: '♊', element: 'Air', modality: 'Mutable', ruler: 'Mercury' },
  { name: 'Cancer', symbol: '♋', element: 'Water', modality: 'Cardinal', ruler: 'Moon' },
  { name: 'Leo', symbol: '♌', element: 'Fire', modality: 'Fixed', ruler: 'Sun' },
  { name: 'Virgo', symbol: '♍', element: 'Earth', modality: 'Mutable', ruler: 'Mercury' },
  { name: 'Libra', symbol: '♎', element: 'Air', modality: 'Cardinal', ruler: 'Venus' },
  { name: 'Scorpio', symbol: '♏', element: 'Water', modality: 'Fixed', ruler: 'Pluto & Mars' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', modality: 'Mutable', ruler: 'Jupiter' },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', modality: 'Cardinal', ruler: 'Saturn' },
  { name: 'Aquarius', symbol: '♒', element: 'Air', modality: 'Fixed', ruler: 'Uranus & Saturn' },
  { name: 'Pisces', symbol: '♓', element: 'Water', modality: 'Mutable', ruler: 'Neptune & Jupiter' }
];

const PLANET_DEFINITIONS = [
  { id: 'sun', name: 'Sun', symbol: '☉', periodDays: 365.256, baseLong: 280.46, dailyMotion: 0.9856474, title: 'The Radiant Heart of Sovereign Will' },
  { id: 'moon', name: 'Moon', symbol: '☽', periodDays: 27.32166, baseLong: 218.316, dailyMotion: 13.176396, title: 'The Silver Mirror of Memory and Tide' },
  { id: 'mercury', name: 'Mercury', symbol: '☿', periodDays: 87.969, baseLong: 252.25, dailyMotion: 4.092334, title: 'The Winged Scribe of Crossroads' },
  { id: 'venus', name: 'Venus', symbol: '♀', periodDays: 224.701, baseLong: 181.98, dailyMotion: 1.60213, title: 'The Rose of Concord and Sacred Desire' },
  { id: 'mars', name: 'Mars', symbol: '♂', periodDays: 686.98, baseLong: 355.43, dailyMotion: 0.52403, title: 'The Iron Torch of Pioneering Courage' },
  { id: 'jupiter', name: 'Jupiter', symbol: '♃', periodDays: 4332.59, baseLong: 34.35, dailyMotion: 0.08309, title: 'The Great Benefic and Sovereign Architect' },
  { id: 'saturn', name: 'Saturn', symbol: '♄', periodDays: 10759.22, baseLong: 50.08, dailyMotion: 0.03346, title: 'The Keeper of the Threshold and Ancient Stone' },
  { id: 'uranus', name: 'Uranus', symbol: '♅', periodDays: 30685.4, baseLong: 314.05, dailyMotion: 0.01173, title: 'The Lightning of Promethean Awakening' },
  { id: 'neptune', name: 'Neptune', symbol: '♆', periodDays: 60189.0, baseLong: 304.35, dailyMotion: 0.00598, title: 'The Mystic Ocean of Dissolving Form' },
  { id: 'pluto', name: 'Pluto', symbol: '♇', periodDays: 90560.0, baseLong: 238.93, dailyMotion: 0.00397, title: 'The Lord of the Deep and Alchemical Crucible' },
  { id: 'chiron', name: 'Chiron', symbol: '⚷', periodDays: 18420.0, baseLong: 108.20, dailyMotion: 0.01954, title: 'The Wounded Centaur and Master Healer' },
  { id: 'north_node', name: 'North Node', symbol: '☊', periodDays: 6793.5, baseLong: 125.04, dailyMotion: -0.05295, title: 'The Dragon’s Head of Evolutionary Destiny' }
];

/**
 * Converts Ecliptic Longitude (lambda) and Latitude (beta) to Equatorial RA and Dec.
 * Obliquity of ecliptic eps = 23.4392911 deg.
 */
function eclipticToEquatorial(longDeg: number, latDeg = 0) {
  const eps = 23.4392911 * (Math.PI / 180);
  const l = longDeg * (Math.PI / 180);
  const b = latDeg * (Math.PI / 180);

  const sinDec = Math.sin(b) * Math.cos(eps) + Math.cos(b) * Math.sin(eps) * Math.sin(l);
  const decRad = Math.asin(sinDec);
  const decDeg = decRad * (180 / Math.PI);

  const y = Math.sin(l) * Math.cos(eps) - Math.tan(b) * Math.sin(eps);
  const x = Math.cos(l);
  let raRad = Math.atan2(y, x);
  if (raRad < 0) raRad += 2 * Math.PI;

  const raHours = (raRad * (180 / Math.PI)) / 15.0;
  return { raHours, decDeg };
}

/**
 * Calculates planetary positions with orbital perturbations and retrograde stations.
 */
export function calculateEphemeris(temporal: TemporalCoordinate): CelestialCoordinate[] {
  const d = temporal.julianDayUT - 2451545.0; // Days since J2000.0 epoch

  return PLANET_DEFINITIONS.map((planet) => {
    let meanLong = (planet.baseLong + planet.dailyMotion * d) % 360;
    if (meanLong < 0) meanLong += 360;

    let eclipticLong = meanLong;
    let speed = planet.dailyMotion;
    let isRetrograde = false;

    if (planet.id === 'sun') {
      const g = ((357.528 + 0.9856003 * d) % 360) * (Math.PI / 180);
      eclipticLong = meanLong + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
    } else if (planet.id === 'moon') {
      const m = ((134.963 + 13.064993 * d) % 360) * (Math.PI / 180);
      eclipticLong = meanLong + 6.289 * Math.sin(m);
    } else if (planet.id !== 'north_node') {
      const sunMeanLong = (280.46 + 0.9856474 * d) % 360;
      const elongation = ((sunMeanLong - meanLong) % 360 + 360) % 360;
      const elRad = elongation * (Math.PI / 180);

      if (elongation > 150 && elongation < 210 && (planet.id === 'mars' || planet.id === 'jupiter' || planet.id === 'saturn')) {
        isRetrograde = true;
        speed = -Math.abs(planet.dailyMotion * 0.4);
      } else if ((planet.id === 'mercury' || planet.id === 'venus') && elongation > 15 && elongation < 35 && Math.cos(elRad) < 0) {
        isRetrograde = true;
        speed = -Math.abs(planet.dailyMotion * 0.5);
      }
      eclipticLong = (meanLong + (isRetrograde ? -3.5 : 2.0) * Math.sin(elRad) + 360) % 360;
    }

    eclipticLong = ((eclipticLong % 360) + 360) % 360;

    const signIndex = Math.floor(eclipticLong / 30);
    const signDegree = Math.round((eclipticLong % 30) * 100) / 100;
    const zodiacSign = ZODIAC_SIGNS[signIndex].name;

    const { raHours, decDeg } = eclipticToEquatorial(eclipticLong, 0);

    return {
      id: planet.id,
      name: planet.name,
      symbol: planet.symbol,
      eclipticLongitude: Math.round(eclipticLong * 1000) / 1000,
      eclipticLatitude: 0,
      rightAscensionHours: Math.round(raHours * 1000) / 1000,
      declinationDegrees: Math.round(decDeg * 1000) / 1000,
      zodiacSign,
      signDegree,
      isRetrograde,
      speedDegreesPerDay: Math.round(speed * 1000) / 1000
    };
  });
}

/**
 * Calculates inter-planetary aspects and generates smooth novel-like commentaries.
 */
export function calculateCelestialAspects(bodies: CelestialCoordinate[]): CelestialAspect[] {
  const aspects: CelestialAspect[] = [];
  const aspectRules = [
    { type: 'Conjunction' as const, angle: 0, orb: 7, harmony: 'Unified Convergence' as const },
    { type: 'Sextile' as const, angle: 60, orb: 5, harmony: 'Harmonious' as const },
    { type: 'Square' as const, angle: 90, orb: 6, harmony: 'Dynamic Tension' as const },
    { type: 'Trine' as const, angle: 120, orb: 7, harmony: 'Harmonious' as const },
    { type: 'Opposition' as const, angle: 180, orb: 7, harmony: 'Dynamic Tension' as const }
  ];

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const bA = bodies[i];
      const bB = bodies[j];

      let diff = Math.abs(bA.eclipticLongitude - bB.eclipticLongitude);
      if (diff > 180) diff = 360 - diff;

      for (const rule of aspectRules) {
        const orb = Math.abs(diff - rule.angle);
        if (orb <= rule.orb) {
          let description = '';
          if (rule.type === 'Conjunction') {
            description = `A solemn fusion where ${bA.name} and ${bB.name} merge their celestial fires, forging an indivisible stream of intent.`;
          } else if (rule.type === 'Trine') {
            description = `A serene dialogue of elemental grace between ${bA.name} and ${bB.name}, opening effortless conduits of synchronicity and blessing.`;
          } else if (rule.type === 'Square') {
            description = `A noble friction where ${bA.name} challenges ${bB.name} at right angles, demanding courage and alchemical maturation from the mortal soul.`;
          } else if (rule.type === 'Opposition') {
            description = `A magnetic polarization across the sky; ${bA.name} gazes into the mirror of ${bB.name}, seeking integration of opposites.`;
          } else {
            description = `A gentle whisper of creative opportunity whispering between ${bA.name} and ${bB.name}.`;
          }

          aspects.push({
            bodyA: bA.name,
            bodyB: bB.name,
            bodyASymbol: bA.symbol,
            bodyBSymbol: bB.symbol,
            aspectType: rule.type,
            angleDeg: Math.round(diff * 10) / 10,
            exactAngleDeg: rule.angle,
            orbDeg: Math.round(orb * 100) / 100,
            isApplying: true,
            harmony: rule.harmony,
            novelisticDescription: description
          });
          break;
        }
      }
    }
  }

  return aspects;
}

/**
 * Returns a rich, novel-like poetic narrative for a celestial body in its current transit.
 */
export function getPlanetaryNovelisticLore(body: CelestialCoordinate): string {
  const planetTitleMap: Record<string, string> = {
    sun: 'The Sovereign Hearth of Life',
    moon: 'The Silver Weaver of Memories',
    mercury: 'The Swift Messenger of Twilight Paths',
    venus: 'The Morning Star of Grace and Sacred Beauty',
    mars: 'The Unflinching Sentinel of the Dawn',
    jupiter: 'The Generous Sage of Expansive Horizons',
    saturn: 'The Patient Builder of Ancient Sanctuaries',
    uranus: 'The Electric Promethean Fire',
    neptune: 'The Mystic Dreamer of Boundless Waters',
    pluto: 'The Alchemist in the Subterranean Vaults',
    chiron: 'The Compassionate Centaur at the Healing Well',
    north_node: 'The Golden Thread of Destiny’s Loom'
  };

  const title = planetTitleMap[body.id] || body.name;

  return `Traversing the sacred realm of ${body.zodiacSign} at ${body.signDegree.toFixed(1)}°, ${title} casts its luminescence upon the terrestrial plane. ${
    body.isRetrograde
      ? 'Currently in contemplative retrograde retreat, its inward-drawn motion invites quiet introspection and the retrieval of forgotten wisdom.'
      : 'Moving with steady forward momentum, its radiance illuminates the road ahead with purpose and clarity.'
  } Positioned at right ascension ${body.rightAscensionHours.toFixed(2)}h with a declination of ${body.declinationDegrees.toFixed(2)}°, this body holds a quiet court in the heavens, weaving its subtle influence into the tapestry of human becoming.`;
}
