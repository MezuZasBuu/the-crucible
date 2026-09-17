/**
 * The Crucible — Astrocartography Engine
 * Computes geographic planetary power lines (MC, IC, ASC, DSC)
 * across world coordinates with geodesic curves and sacred sanctuary nodes.
 */

import { AstrocartographyLine, CelestialCoordinate, TemporalCoordinate, SanctuaryNode } from '../types';


export const SANCTUARY_NODES: SanctuaryNode[] = [
  {
    name: 'Giza Necropolis & Great Pyramid',
    lat: 29.9792,
    lng: 31.1342,
    elevationMeters: 60,
    tradition: 'Egyptian Sothic & Hermetic',
    archetype: 'Cardinal Orion-Sirius Meridian Anchor',
    description: 'Precision alignment with true cardinal directions and prime meridian of antiquity.',
    historicalSignificance: 'Aligns with the celestial pole and represents the primordial benben mound of creation.'
  },
  {
    name: 'Temple Mount & Western Wall, Jerusalem',
    lat: 31.778,
    lng: 35.2354,
    elevationMeters: 740,
    tradition: 'Twelve Tribes & Hebraic',
    archetype: 'Even Shetiya (Foundation Stone of the World)',
    description: 'Convergence point of the Twelve Camps and focal axis of ancient Semitic prayer.',
    historicalSignificance: 'Sacred center of the Solomonic temple and cosmic threshold of terrestrial-divine dialogue.'
  },
  {
    name: 'El Castillo, Chichen Itza',
    lat: 20.6843,
    lng: -88.5678,
    elevationMeters: 24,
    tradition: 'Maya Tzolk\'in & Haab\'',
    archetype: 'Solstitial Descent of Kukulkan (Feathered Serpent)',
    description: 'Pyramidal step calendar encoding 365 days and solar equinoctial serpent shadows.',
    historicalSignificance: 'Astronomical observatory tracking Venus synodic cycles and Pleiadian zenith passages.'
  },
  {
    name: 'Imperial Temple of Heaven, Beijing',
    lat: 39.8822,
    lng: 116.4066,
    elevationMeters: 45,
    tradition: 'Chinese Sexagenary & Wu Xing',
    archetype: 'Altar of Heaven & Winter Solstice Mandate',
    description: 'Circular Mound Altar symbolizing the round cosmos over square terrestrial foundation.',
    historicalSignificance: 'Emperors performed annual prayers at winter solstice to balance Yin and Yang in the empire.'
  },
  {
    name: 'Stonehenge Megaliths, Salisbury',
    lat: 51.1789,
    lng: -1.8262,
    elevationMeters: 102,
    tradition: 'Celtic & Megalithic Astronomy',
    archetype: 'Summer Solstice Sunrise Heel Stone Axis',
    description: 'Sarsen trilithon ring tracking summer and winter solstice sunrises and 18.6-year lunar nodal tides.',
    historicalSignificance: 'Prehistoric eclipse predictor and lunisolar calendar computus carved into monumental stone.'
  },
  {
    name: 'The Parthenon Acropolis, Athens',
    lat: 37.9715,
    lng: 23.7267,
    elevationMeters: 156,
    tradition: 'Classical Hellenic & Olympic',
    archetype: 'Golden Ratio Citadel of Pallas Athena',
    description: 'Sanctuary of sacred geometry, Attic Metonic cycles, and philosophical civic sovereignty.',
    historicalSignificance: 'Dedicated on the Panathenaic festival following the heliacal rising of the Pleiades.'
  },
  {
    name: 'Bete Giyorgis Monolithic Church, Lalibela',
    lat: 12.0319,
    lng: 39.0411,
    elevationMeters: 2500,
    tradition: 'Ethiopian Ge\'ez & Solomonic',
    archetype: 'Highlands Rock-Hewn Cross of Grace',
    description: 'Monolithic cruciform sanctuary carved from volcanic tuff according to heavenly patterns.',
    historicalSignificance: 'Center of Ge\'ez computus and preservation of the Book of Enoch\'s astronomical calendar.'
  },
  {
    name: 'Mount Shasta Summit, California',
    lat: 41.4092,
    lng: -122.1949,
    elevationMeters: 4322,
    tradition: 'Cascadian Indigenous & Modern Vortex',
    archetype: 'Volcanic Aetheric Pillar of Earth',
    description: 'Sacred mountain revered by Shasta, Wintu, and Pit River peoples as the focal crown of creation.',
    historicalSignificance: 'Geomagnetic anomaly and planetary crown chakra node in modern energetic gridwork.'
  },
  {
    name: 'Mount Kailash, Tibet',
    lat: 31.0667,
    lng: 81.3125,
    elevationMeters: 6638,
    tradition: 'Vedic, Buddhist, & Bon',
    archetype: 'Axis Mundi & Cosmic Mandala of Mount Meru',
    description: 'Pyramidal peak revered as the center of the world and source of four great Asian rivers.',
    historicalSignificance: 'Circumambulated in pilgrimage; aligned with cosmic cardinal directions.'
  },
  {
    name: 'Teotihuacan Avenue of the Dead, Mexico',
    lat: 19.6925,
    lng: -98.8436,
    elevationMeters: 2280,
    tradition: 'Mesoamerican Classic',
    archetype: 'Pyramid of the Sun Cosmic Axis',
    description: 'City laid out on a grid oriented 15.5° east of true north to track zenith solar passages.',
    historicalSignificance: 'Known as the "Place Where Gods Were Born", encoding sacred time-space measures.'
  }
];

const PLANET_COLORS: Record<string, string> = {
  sun: '#f59e0b', // Amber / Gold
  moon: '#38bdf8', // Light Blue / Silver
  mercury: '#a855f7', // Violet
  venus: '#ec4899', // Rose Pink
  mars: '#ef4444', // Red
  jupiter: '#10b981', // Emerald
  saturn: '#64748b', // Slate
  uranus: '#06b6d4', // Cyan
  neptune: '#3b82f6', // Indigo Blue
  pluto: '#881337', // Deep Crimson
  north_node: '#eab308' // Golden Node
};

const THEMES: Record<string, Record<string, { desc: string; keywords: string[] }>> = {
  sun: {
    MC: { desc: 'Pinnacle of solar authority, career distinction, public radiance and leadership.', keywords: ['Authority', 'Visibility', 'Fame', 'Core Vitality'] },
    IC: { desc: 'Deep ancestral grounding, sacred sanctuary, inner sovereign peace.', keywords: ['Roots', 'Home', 'Soul Foundation', 'Sanctuary'] },
    ASC: { desc: 'Charismatic personal projection, radiant health, decisive individuality.', keywords: ['Presence', 'Vitality', 'First Impressions', 'Self-Actualization'] },
    DSC: { desc: 'Drawing luminous partners, prestigious alliances, noble public relations.', keywords: ['Partnership', 'Contract', 'Mirror of Self', 'Public Bond'] }
  },
  jupiter: {
    MC: { desc: 'Culmination of fortune, institutional elevation, philosophical honor.', keywords: ['Prosperity', 'Mentorship', 'Expansion', 'Acclaim'] },
    IC: { desc: 'Abundant and peaceful home, expansive real estate, emotional tranquility.', keywords: ['Generosity', 'Abundance', 'Inner Peace', 'Sanctuary'] },
    ASC: { desc: 'Infectious benevolence, philosophical worldview, spontaneous luck.', keywords: ['Good Fortune', 'Optimism', 'Wisdom', 'Travel'] },
    DSC: { desc: 'Encountering benefactors, wealthy and virtuous collaborators.', keywords: ['Benefactors', 'Harmonious Union', 'Alliance', 'Growth'] }
  },
  venus: {
    MC: { desc: 'Aesthetic renown, artistic recognition, graceful professional diplomacy.', keywords: ['Artistry', 'Charm', 'Elegance', 'Diplomacy'] },
    IC: { desc: 'Harmonious domestic bliss, aesthetic living spaces, loving ancestral memory.', keywords: ['Devotion', 'Beauty', 'Peaceful Hearth', 'Comfort'] },
    ASC: { desc: 'Personal beauty, magnetic attraction, graceful and affectionate disposition.', keywords: ['Attractiveness', 'Gentleness', 'Love', 'Pleasure'] },
    DSC: { desc: 'Magnetic romantic rendezvous, artistic and mutually supportive covenants.', keywords: ['Romance', 'Soulmate', 'Mutual Delight', 'Harmony'] }
  },
  mars: {
    MC: { desc: 'Unstoppable ambition, athletic or military prowess, decisive executive action.', keywords: ['Ambition', 'Drive', 'Conquest', 'Command'] },
    IC: { desc: 'Stirring restless subterranean energies, ancestral courage, dynamic domestic drive.', keywords: ['Fierce Roots', 'Courage', 'Inner Fire', 'Renovation'] },
    ASC: { desc: 'High physical stamina, bold initiative, pioneering bravery.', keywords: ['Stamina', 'Courage', 'Pioneer', 'Bold Action'] },
    DSC: { desc: 'Fiery interactions, passionate or challenging partnerships, dynamic competition.', keywords: ['Passion', 'Encounter', 'Rivalry', 'Intense Bond'] }
  },
  mercury: {
    MC: { desc: 'Public intellectual voice, publication success, commerce and fast communication.', keywords: ['Publishing', 'Speaking', 'Trade', 'Intellect'] },
    IC: { desc: 'Vibrant home library, rapid mental reflection, continuous domestic study.', keywords: ['Study', 'Archive', 'Mental Peace', 'Genealogy'] },
    ASC: { desc: 'Quick wit, youthful adaptability, expressive articulation.', keywords: ['Curiosity', 'Perception', 'Agility', 'Writing'] },
    DSC: { desc: 'Engaging conversational partners, intellectual collaborations, negotiations.', keywords: ['Dialogue', 'Commerce', 'Network', 'Contract'] }
  },
  moon: {
    MC: { desc: 'Public recognition of emotional depth, nurturing institutions, intuitive reputation.', keywords: ['Intuition', 'Public Resonance', 'Nurture', 'Emotional Stature'] },
    IC: { desc: 'Profound emotional sanctuary, maternal lineage remembrance, psychic harbor.', keywords: ['Ancestral Harbor', 'Emotional Wellspring', 'Sacred Hearth', 'Instinct'] },
    ASC: { desc: 'Heightened empathetic sensitivity, fluctuating receptivity, deeply feeling aura.', keywords: ['Empathy', 'Sensory Acuity', 'Adaptability', 'Mirroring'] },
    DSC: { desc: 'Attracting nurturing kin, emotional vulnerability in partnerships, soul bonds.', keywords: ['Soul Ties', 'Mutual Care', 'Empathy', 'Deep Bonding'] }
  },
  saturn: {
    MC: { desc: 'Enduring architectural authority, high discipline, institutional mastership.', keywords: ['Discipline', 'Mastery', 'Endurance', 'Structural Acclaim'] },
    IC: { desc: 'Dense ancestral bedrock, patient foundation building, sober solitude.', keywords: ['Bedrock', 'Solitude', 'Heritage', 'Karmic Roots'] },
    ASC: { desc: 'Gravitas, solemn self-reliance, methodical and mature demeanour.', keywords: ['Gravitas', 'Sobriety', 'Self-Mastery', 'Prudence'] },
    DSC: { desc: 'Solemn contractual bonds, partnerships forged through time and duty.', keywords: ['Commitment', 'Duty', 'Enduring Pacts', 'Loyalty'] }
  },
  uranus: {
    MC: { desc: 'Sudden innovative breakthroughs, revolutionary career distinction, techno-intellect.', keywords: ['Innovation', 'Revolution', 'Brilliance', 'Unconventional Power'] },
    IC: { desc: 'Non-conformist domestic sanctuary, unexpected relocation, electrical vitality.', keywords: ['Awakening', 'Liberation', 'Dynamic Hearth', 'Electric Roots'] },
    ASC: { desc: 'Radical individuality, magnetic eccentric genius, unchained freedom.', keywords: ['Visionary', 'Lightning', 'Uniqueness', 'Individuation'] },
    DSC: { desc: 'Unusual, electrifying relationships, partnership awakenings, catalysts.', keywords: ['Catalysts', 'Excitement', 'Awakening Ties', 'Freedom in Union'] }
  }
};

/**
 * Normalizes longitude into -180 to +180 degrees
 */
function normalizeLon(deg: number): number {
  let lon = deg % 360;
  if (lon > 180) lon -= 360;
  if (lon < -180) lon += 360;
  return Math.round(lon * 1000) / 1000;
}

/**
 * Calculates geographic coordinates for planetary lines with exact geodesic paths.
 */
export function calculateAstrocartography(
  temporal: TemporalCoordinate,
  bodies: CelestialCoordinate[]
): AstrocartographyLine[] {
  const gmst = temporal.greenwichMeanSiderealTimeHours;
  const lines: AstrocartographyLine[] = [];

  for (const body of bodies) {
    if (!['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus'].includes(body.id)) {
      continue;
    }

    const ra = body.rightAscensionHours;
    const decDeg = body.declinationDegrees || 0;
    const color = PLANET_COLORS[body.id] || '#00f0ff';

    // MC Longitude: geographic longitude where RA equals LST
    // LST = GMST + Longitude / 15 => Longitude = (RA - GMST) * 15
    const mcLong = normalizeLon((ra - gmst) * 15.0);
    const icLong = normalizeLon(mcLong + 180);
    const ascLong = normalizeLon(mcLong + 90);
    const dscLong = normalizeLon(mcLong - 90);

    const bodyThemes = THEMES[body.id] || {
      MC: { desc: `${body.name} zenith culmination on Midheaven`, keywords: ['Elevation', 'Career', 'Focus'] },
      IC: { desc: `${body.name} nadir on Imum Coeli`, keywords: ['Roots', 'Foundation', 'Subconscious'] },
      ASC: { desc: `${body.name} rising on Ascendant`, keywords: ['Personality', 'Body', 'Initiative'] },
      DSC: { desc: `${body.name} setting on Descendant`, keywords: ['Relationship', 'Public', 'Others'] }
    };

    // Calculate Geodesic Path Points for MC (North to South meridian)
    const mcPoints: Array<{ lat: number; lng: number }> = [];
    for (let lat = -85; lat <= 85; lat += 5) {
      mcPoints.push({ lat, lng: mcLong });
    }

    // Calculate Geodesic Path Points for IC (North to South meridian opposite)
    const icPoints: Array<{ lat: number; lng: number }> = [];
    for (let lat = -85; lat <= 85; lat += 5) {
      icPoints.push({ lat, lng: icLong });
    }

    // Calculate Exact Spherical Horizon Curves for Ascendant and Descendant:
    // Altitude = 0 => sin(lat)*sin(dec) + cos(lat)*cos(dec)*cos(H) = 0
    // => cos(H) = -tan(lat)*tan(dec)
    const decRad = (decDeg * Math.PI) / 180;
    const ascPoints: Array<{ lat: number; lng: number }> = [];
    const dscPoints: Array<{ lat: number; lng: number }> = [];

    // Valid latitude range where |tan(lat)*tan(dec)| <= 1
    const maxLatDeg = Math.abs(decDeg) < 0.1 ? 85 : Math.min(85, Math.floor(Math.atan(1 / Math.abs(Math.tan(decRad))) * (180 / Math.PI)));

    for (let lat = -maxLatDeg; lat <= maxLatDeg; lat += 2) {
      const latRad = (lat * Math.PI) / 180;
      const cosH = -Math.tan(latRad) * Math.tan(decRad);
      if (Math.abs(cosH) <= 1.0) {
        const hRad = Math.acos(cosH);
        const hDeg = (hRad * 180) / Math.PI;

        // Ascendant: planet is rising in the east, Hour Angle is negative (-H)
        // Local Sidereal Time = RA - H => Longitude = (RA - H - GMST) * 15 = mcLong - hDeg
        const ascLng = normalizeLon(mcLong - hDeg);
        ascPoints.push({ lat, lng: ascLng });

        // Descendant: planet is setting in the west, Hour Angle is positive (+H)
        // Longitude = mcLong + hDeg
        const dscLng = normalizeLon(mcLong + hDeg);
        dscPoints.push({ lat, lng: dscLng });
      }
    }

    lines.push(
      {
        planetId: body.id,
        planetName: body.name,
        lineType: 'MC',
        lineTypeName: `${body.name} Midheaven (MC)`,
        color,
        subSolarLongitude: mcLong,
        declinationDegrees: decDeg,
        rightAscensionHours: ra,
        pathPoints: mcPoints,
        description: bodyThemes.MC.desc,
        themes: bodyThemes.MC.keywords
      },
      {
        planetId: body.id,
        planetName: body.name,
        lineType: 'IC',
        lineTypeName: `${body.name} Imum Coeli (IC)`,
        color,
        subSolarLongitude: icLong,
        declinationDegrees: decDeg,
        rightAscensionHours: ra,
        pathPoints: icPoints,
        description: bodyThemes.IC.desc,
        themes: bodyThemes.IC.keywords
      },
      {
        planetId: body.id,
        planetName: body.name,
        lineType: 'ASC',
        lineTypeName: `${body.name} Ascendant (ASC)`,
        color,
        subSolarLongitude: ascLong,
        declinationDegrees: decDeg,
        rightAscensionHours: ra,
        pathPoints: ascPoints,
        description: bodyThemes.ASC.desc,
        themes: bodyThemes.ASC.keywords
      },
      {
        planetId: body.id,
        planetName: body.name,
        lineType: 'DSC',
        lineTypeName: `${body.name} Descendant (DSC)`,
        color,
        subSolarLongitude: dscLong,
        declinationDegrees: decDeg,
        rightAscensionHours: ra,
        pathPoints: dscPoints,
        description: bodyThemes.DSC.desc,
        themes: bodyThemes.DSC.keywords
      }
    );
  }

  // Calculate Paran Intersections (where horizon lines intersect meridian lines)
  for (let i = 0; i < lines.length; i++) {
    const l1 = lines[i];
    if (l1.lineType === 'ASC' || l1.lineType === 'DSC') {
      const parans: Array<{
        lat: number;
        lng: number;
        intersectingPlanet: string;
        intersectingLineType: 'MC' | 'IC' | 'ASC' | 'DSC';
        title: string;
        interpretation: string;
      }> = [];

      for (let j = 0; j < lines.length; j++) {
        if (i === j) continue;
        const l2 = lines[j];
        if (l2.lineType === 'MC' || l2.lineType === 'IC') {
          // Find point on l1 closest to l2.subSolarLongitude
          const crossingPt = l1.pathPoints?.find((pt) => Math.abs(normalizeLon(pt.lng - l2.subSolarLongitude)) < 2.5);
          if (crossingPt) {
            parans.push({
              lat: crossingPt.lat,
              lng: l2.subSolarLongitude,
              intersectingPlanet: l2.planetName,
              intersectingLineType: l2.lineType,
              title: `${l1.planetName} ${l1.lineType} × ${l2.planetName} ${l2.lineType}`,
              interpretation: `Potent crossing: ${l1.planetName}'s horizon gateway meshes with ${l2.planetName}'s meridian power at latitude ${crossingPt.lat.toFixed(1)}°.`
            });
          }
        }
      }

      l1.paranCrossings = parans.slice(0, 4);
    }
  }

  return lines;
}

