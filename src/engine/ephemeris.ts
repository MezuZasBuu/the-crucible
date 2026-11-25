/**
 * The Crucible — Celestial Ephemeris Engine
 * Real-time analytical ephemeris for Solar, Lunar, and Planetary bodies.
 * Computes Ecliptic Longitude, Right Ascension, Declination, Retrograde status,
 * celestial aspects, and smooth novel-like archetypal commentaries.
 */

import * as Astronomy from 'astronomy-engine';
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
  { name: 'Aries', symbol: '♈\uFE0E', element: 'Fire', modality: 'Cardinal', ruler: 'Mars' },
  { name: 'Taurus', symbol: '♉\uFE0E', element: 'Earth', modality: 'Fixed', ruler: 'Venus' },
  { name: 'Gemini', symbol: '♊\uFE0E', element: 'Air', modality: 'Mutable', ruler: 'Mercury' },
  { name: 'Cancer', symbol: '♋\uFE0E', element: 'Water', modality: 'Cardinal', ruler: 'Moon' },
  { name: 'Leo', symbol: '♌\uFE0E', element: 'Fire', modality: 'Fixed', ruler: 'Sun' },
  { name: 'Virgo', symbol: '♍\uFE0E', element: 'Earth', modality: 'Mutable', ruler: 'Mercury' },
  { name: 'Libra', symbol: '♎\uFE0E', element: 'Air', modality: 'Cardinal', ruler: 'Venus' },
  { name: 'Scorpio', symbol: '♏\uFE0E', element: 'Water', modality: 'Fixed', ruler: 'Pluto & Mars' },
  { name: 'Sagittarius', symbol: '♐\uFE0E', element: 'Fire', modality: 'Mutable', ruler: 'Jupiter' },
  { name: 'Capricorn', symbol: '♑\uFE0E', element: 'Earth', modality: 'Cardinal', ruler: 'Saturn' },
  { name: 'Aquarius', symbol: '♒\uFE0E', element: 'Air', modality: 'Fixed', ruler: 'Uranus & Saturn' },
  { name: 'Pisces', symbol: '♓\uFE0E', element: 'Water', modality: 'Mutable', ruler: 'Neptune & Jupiter' }
];

const PLANET_DEFINITIONS: Array<{ id: string; name: string; symbol: string; body?: Astronomy.Body; title: string }> = [
  { id: 'sun', name: 'Sun', symbol: '☉\uFE0E', body: Astronomy.Body.Sun, title: 'The Radiant Heart of Sovereign Will' },
  { id: 'moon', name: 'Moon', symbol: '☽\uFE0E', body: Astronomy.Body.Moon, title: 'The Silver Mirror of Memory and Tide' },
  { id: 'mercury', name: 'Mercury', symbol: '☿\uFE0E', body: Astronomy.Body.Mercury, title: 'The Winged Scribe of Crossroads' },
  { id: 'venus', name: 'Venus', symbol: '♀\uFE0E', body: Astronomy.Body.Venus, title: 'The Rose of Concord and Sacred Desire' },
  { id: 'mars', name: 'Mars', symbol: '♂\uFE0E', body: Astronomy.Body.Mars, title: 'The Iron Torch of Pioneering Courage' },
  { id: 'jupiter', name: 'Jupiter', symbol: '♃\uFE0E', body: Astronomy.Body.Jupiter, title: 'The Great Benefic and Sovereign Architect' },
  { id: 'saturn', name: 'Saturn', symbol: '♄\uFE0E', body: Astronomy.Body.Saturn, title: 'The Keeper of the Threshold and Ancient Stone' },
  { id: 'uranus', name: 'Uranus', symbol: '♅\uFE0E', body: Astronomy.Body.Uranus, title: 'The Lightning of Promethean Awakening' },
  { id: 'neptune', name: 'Neptune', symbol: '♆\uFE0E', body: Astronomy.Body.Neptune, title: 'The Mystic Ocean of Dissolving Form' },
  { id: 'pluto', name: 'Pluto', symbol: '♇\uFE0E', body: Astronomy.Body.Pluto, title: 'The Lord of the Deep and Alchemical Crucible' },
  { id: 'chiron', name: 'Chiron', symbol: '⚷\uFE0E', title: 'The Wounded Centaur and Master Healer' },
  { id: 'north_node', name: 'North Node', symbol: '☊\uFE0E', title: 'The Dragon’s Head of Evolutionary Destiny' }
];

const DEG = Math.PI / 180;
const J2000 = 2451545.0;

function wrap360(n: number): number {
  return ((n % 360) + 360) % 360;
}

/**
 * Converts Ecliptic Longitude (lambda) and Latitude (beta) to Equatorial RA and Dec.
 * Obliquity of ecliptic eps = 23.4392911 deg.
 */
function eclipticToEquatorial(longDeg: number, latDeg = 0) {
  const eps = 23.4392911 * DEG;
  const l = longDeg * DEG;
  const b = latDeg * DEG;

  const sinDec = Math.sin(b) * Math.cos(eps) + Math.cos(b) * Math.sin(eps) * Math.sin(l);
  const decDeg = Math.asin(sinDec) / DEG;

  const y = Math.sin(l) * Math.cos(eps) - Math.tan(b) * Math.sin(eps);
  const x = Math.cos(l);
  let raRad = Math.atan2(y, x);
  if (raRad < 0) raRad += 2 * Math.PI;

  return { raHours: raRad / DEG / 15.0, decDeg };
}

/** Geocentric apparent ecliptic position (true ecliptic of date) via astronomy-engine. */
function geocentricEcliptic(body: Astronomy.Body, time: Astronomy.AstroTime): { lon: number; lat: number } {
  const ecl = Astronomy.Ecliptic(Astronomy.GeoVector(body, time, true));
  return { lon: wrap360(ecl.elon), lat: ecl.elat };
}

/**
 * Chiron (2060) — two-body Kepler orbit from osculating elements (J2000 ecliptic),
 * reduced to a geocentric longitude of date. Good to roughly a degree across
 * 1950–2100; astronomy-engine does not ship minor-body ephemerides.
 */
const CHIRON = {
  a: 13.6922, // AU
  e: 0.37911,
  i: 6.9299,
  node: 209.2984,
  peri: 339.2537,
  perihelionJD: 2450128.1, // 1996-02-14
  periodDays: 18505.7
};

function chironGeocentric(time: Astronomy.AstroTime, jd: number): { lon: number; lat: number } {
  const M = wrap360(((jd - CHIRON.perihelionJD) / CHIRON.periodDays) * 360) * DEG;
  let E = M;
  for (let k = 0; k < 12; k++) E = E - (E - CHIRON.e * Math.sin(E) - M) / (1 - CHIRON.e * Math.cos(E));
  const xv = CHIRON.a * (Math.cos(E) - CHIRON.e);
  const yv = CHIRON.a * Math.sqrt(1 - CHIRON.e * CHIRON.e) * Math.sin(E);
  const v = Math.atan2(yv, xv);
  const r = Math.hypot(xv, yv);
  const N = CHIRON.node * DEG;
  const w = CHIRON.peri * DEG;
  const inc = CHIRON.i * DEG;
  // Heliocentric ecliptic (J2000) rectangular
  const hx = r * (Math.cos(N) * Math.cos(v + w) - Math.sin(N) * Math.sin(v + w) * Math.cos(inc));
  const hy = r * (Math.sin(N) * Math.cos(v + w) + Math.cos(N) * Math.sin(v + w) * Math.cos(inc));
  const hz = r * Math.sin(v + w) * Math.sin(inc);
  // Earth heliocentric: astronomy-engine gives J2000 equatorial → rotate to J2000 ecliptic
  const earth = Astronomy.HelioVector(Astronomy.Body.Earth, time);
  const eps = 23.4392911 * DEG;
  const ex = earth.x;
  const ey = earth.y * Math.cos(eps) + earth.z * Math.sin(eps);
  const ez = -earth.y * Math.sin(eps) + earth.z * Math.cos(eps);
  const gx = hx - ex;
  const gy = hy - ey;
  const gz = hz - ez;
  const lonJ2000 = Math.atan2(gy, gx) / DEG;
  const lat = Math.atan2(gz, Math.hypot(gx, gy)) / DEG;
  // General precession in longitude, J2000 → date
  const precession = ((jd - J2000) / 36525) * 1.39697;
  return { lon: wrap360(lonJ2000 + precession), lat };
}

/** Mean lunar ascending node (Meeus), the standard "Mean Node". */
function meanNorthNode(jd: number): number {
  const T = (jd - J2000) / 36525;
  return wrap360(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T);
}

function positionFor(def: (typeof PLANET_DEFINITIONS)[number], jd: number): { lon: number; lat: number } {
  const time = Astronomy.MakeTime(jd - J2000);
  if (def.id === 'chiron') return chironGeocentric(time, jd);
  if (def.id === 'north_node') return { lon: meanNorthNode(jd), lat: 0 };
  return geocentricEcliptic(def.body as Astronomy.Body, time);
}

function signedDelta(a: number, b: number): number {
  return ((a - b + 540) % 360) - 180;
}

/**
 * Calculates geocentric tropical positions for the Sun, Moon, planets, Chiron and
 * the mean lunar node. Planet positions come from the open-source astronomy-engine
 * library (arc-minute accuracy); retrograde status is measured from actual motion.
 */
export function calculateEphemeris(temporal: TemporalCoordinate): CelestialCoordinate[] {
  const jd = temporal.julianDayUT;

  return PLANET_DEFINITIONS.map((planet) => {
    const now = positionFor(planet, jd);
    const before = positionFor(planet, jd - 0.5);
    const after = positionFor(planet, jd + 0.5);
    const speed = signedDelta(after.lon, before.lon);
    const isRetrograde = planet.id !== 'north_node' && planet.id !== 'sun' && planet.id !== 'moon' && speed < 0;

    const eclipticLong = now.lon;
    const signIndex = Math.floor(eclipticLong / 30) % 12;
    const signDegree = Math.round((eclipticLong % 30) * 100) / 100;
    const zodiacSign = ZODIAC_SIGNS[signIndex].name;

    const { raHours, decDeg } = eclipticToEquatorial(eclipticLong, now.lat);

    return {
      id: planet.id,
      name: planet.name,
      symbol: planet.symbol,
      eclipticLongitude: Math.round(eclipticLong * 1000) / 1000,
      eclipticLatitude: Math.round(now.lat * 1000) / 1000,
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
