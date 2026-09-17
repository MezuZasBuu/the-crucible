/**
 * The Crucible — Cross-System Bridge & Life Connotation Engine
 *
 * Explains why each spiritual/calendrical system is present, how it
 * connects to the living day, month, birth chart, and name vibration,
 * and how all streams triangulate through the Twelve Tribes camp matrix.
 */

import {
  CelestialCoordinate,
  ChineseResult,
  CrossSystemIntertwining,
  DreamspellResult,
  EgyptianResult,
  EnochianBiblicalResult,
  EthiopianResult,
  GeneKeyGate,
  GreekResult,
  MayanResult,
  NumerologyResult,
  SystemCrossNote,
  TemporalCoordinate,
  TwelveTribeAffinity,
  TwelveTribeLifeConnotation
} from '../types';

const TRIBE_LIFE_MEANINGS: Record<string, TwelveTribeLifeConnotation> = {
  Judah: {
    lifeRepresents:
      'Leadership under pressure, courage that protects the camp, and the willingness to go first when others hesitate. As an archetypal reading under this methodology, this aligns with sovereign responsibility—not domination, but radiant stewardship.',
    dayPractice: 'Speak one clear vow aloud at sunrise; act on it before noon.',
    shadowToWatch: 'Pride that isolates, or roaring without serving the flock.',
    giftToEmbody: 'Courage that makes others safer.'
  },
  Issachar: {
    lifeRepresents:
      'Reading seasons rightly—knowing when to plant, wait, or harvest. As an archetypal reading under this methodology, this aligns with discernment of timing, study, and wise counsel that orients communities.',
    dayPractice: 'Before deciding, name the season you are actually in (seed / heat / gather / rest).',
    shadowToWatch: 'Analysis that never becomes action.',
    giftToEmbody: 'Epoch-reading that liberates others from false urgency.'
  },
  Zebulun: {
    lifeRepresents:
      'Commerce as covenant—building harbors where resources, ideas, and people meet safely. As an archetypal reading under this methodology, this aligns with networking, patronage, and translating vision into trade.',
    dayPractice: 'Send one message that opens a harbor between two people or projects.',
    shadowToWatch: 'Restless travel that never docks.',
    giftToEmbody: 'Bridge-building that funds and shelters the scholars.'
  },
  Reuben: {
    lifeRepresents:
      'Firstborn passion and the awakening of human potential. As an archetypal reading under this methodology, this aligns with raw vitality, honesty about desire, and the courage to begin again after instability.',
    dayPractice: 'Name one desire without shame; channel it into one constructive act.',
    shadowToWatch: 'Impulse that destabilizes trust.',
    giftToEmbody: 'Passionate honesty that restarts stagnant fields.'
  },
  Simeon: {
    lifeRepresents:
      'Hearing truth that cuts—zeal for purity and the intensity that refuses soft lies. As an archetypal reading under this methodology, this aligns with fierce listening and decisive purification.',
    dayPractice: 'Listen twice before you speak once; cut one false narrative today.',
    shadowToWatch: 'Zeal that wounds allies.',
    giftToEmbody: 'Truth-hearing that cleanses without cruelty.'
  },
  Gad: {
    lifeRepresents:
      'Tactical courage on the frontier—overcoming when the camp is threatened. As an archetypal reading under this methodology, this aligns with crisis competence and loyal defense of what matters.',
    dayPractice: 'Identify one frontier threat; take one protective tactical step.',
    shadowToWatch: 'Fighting every battle as if it were existential.',
    giftToEmbody: 'Resolute defense that creates peace behind the line.'
  },
  Ephraim: {
    lifeRepresents:
      'Fruitfulness and material stewardship—turning scarcity into provision. As an archetypal reading under this methodology, this aligns with building, multiplying resources, and leaving systems stronger than you found them.',
    dayPractice: 'Improve one tangible system (budget, workspace, archive) by 1%.',
    shadowToWatch: 'Empire-building that forgets the fountain.',
    giftToEmbody: 'Provision that multiplies blessing for many.'
  },
  Manasseh: {
    lifeRepresents:
      'Restoring forgotten knowledge—remembering what exile erased. As an archetypal reading under this methodology, this aligns with memory work, lineage repair, and reclaiming abandoned gifts.',
    dayPractice: 'Recover one forgotten skill, photo, text, or ancestor story.',
    shadowToWatch: 'Nostalgia that blocks present fruitfulness.',
    giftToEmbody: 'Memory that heals the future.'
  },
  Benjamin: {
    lifeRepresents:
      'Fierce protection of the sanctuary and the written word. As an archetypal reading under this methodology, this aligns with guardianship of sacred boundaries, craftsmanship of text, and loyalty under night.',
    dayPractice: 'Guard one boundary; write one sentence worth keeping.',
    shadowToWatch: 'Predatory intensity without temple purpose.',
    giftToEmbody: 'Protector-scribe energy that keeps the flame lit.'
  },
  Dan: {
    lifeRepresents:
      'Judgment as equilibrium—discerning law so the camp does not dissolve into chaos. As an archetypal reading under this methodology, this aligns with ethical clarity, fair arbitration, and serpent-wise caution.',
    dayPractice: 'Weigh one decision on the scales; refuse both favoritism and fear.',
    shadowToWatch: 'Cold judgment that loses mercy.',
    giftToEmbody: 'Discernment that restores balance.'
  },
  Asher: {
    lifeRepresents:
      'Oil, nourishment, and gracious hosting—abundance that delights. As an archetypal reading under this methodology, this aligns with hospitality, healing craft, and making ordinary tables sacred.',
    dayPractice: 'Feed someone (body or soul) with genuine delight.',
    shadowToWatch: 'Pleasure without consecration.',
    giftToEmbody: 'Nourishment that makes royalty of the everyday.'
  },
  Naphtali: {
    lifeRepresents:
      'Swift joy and eloquent speech—pleasant words that climb mountains. As an archetypal reading under this methodology, this aligns with messaging, poetry, agility of spirit, and good news carried far.',
    dayPractice: 'Speak or write one pleasant true word that lifts another person.',
    shadowToWatch: 'Speed that skips depth.',
    giftToEmbody: 'Joyful eloquence that moves mountains lightly.'
  }
};

function tribeKey(tribeName: string): string {
  const base = tribeName.split('(')[0].trim().split('/')[0].trim();
  return base.replace(/\s+/g, ' ');
}

function lifeForTribe(tribeName: string): TwelveTribeLifeConnotation {
  const key = tribeKey(tribeName);
  for (const [k, v] of Object.entries(TRIBE_LIFE_MEANINGS)) {
    if (key.includes(k)) return v;
  }
  return {
    lifeRepresents: 'An archetypal stewardship role within the living camp of meaning—under this methodology, not as an objective identity claim.',
    dayPractice: 'Orient one action toward service of the whole.',
    shadowToWatch: 'Forgetting why the banner was raised.',
    giftToEmbody: 'Faithful presence in your quadrant.'
  };
}

/** Completes the navigation ladder on every cross-note (Why → Independent → Intersect → Disagree → Act). */
function withNavigationLadder(
  note: Omit<SystemCrossNote, 'independentlySays' | 'intersectsWith' | 'disagreesWith' | 'doWithDisagreement'> &
    Partial<Pick<SystemCrossNote, 'independentlySays' | 'intersectsWith' | 'disagreesWith' | 'doWithDisagreement'>>
): SystemCrossNote {
  const peers = note.triangulatesWith.join(', ');
  return {
    ...note,
    independentlySays:
      note.independentlySays ||
      `${note.connectsToDay} ${note.connectsToMonth}`.trim(),
    intersectsWith:
      note.intersectsWith ||
      `Strongest dialogue partners: ${peers || 'adjacent calendars'}. ${note.crossNote}`,
    disagreesWith:
      note.disagreesWith ||
      `Tension appears when this system's timing or symbolism does not match ${peers || 'other traditions'} on the same Julian Day—do not force a single averaged answer.`,
    doWithDisagreement:
      note.doWithDisagreement ||
      `Hold both readings. Choose Path A or Path B consciously (or the bridge). Use disagreements as forks, not as failures of the day.`
  };
}

/**
 * Builds presence notes for every tradition — why it is here and how it intertwines.
 */
export function buildSystemCrossNotes(args: {
  temporal: TemporalCoordinate;
  mayan: MayanResult;
  dreamspell: DreamspellResult;
  chinese: ChineseResult;
  egyptian: EgyptianResult;
  ethiopian: EthiopianResult;
  greek: GreekResult;
  enochianBiblical: EnochianBiblicalResult;
  numerology: NumerologyResult;
  geneKeysSun: GeneKeyGate;
  topTribe: TwelveTribeAffinity;
  sunSign: string;
}): SystemCrossNote[] {
  const {
    temporal,
    mayan,
    dreamspell,
    chinese,
    egyptian,
    ethiopian,
    greek,
    enochianBiblical,
    numerology,
    geneKeysSun,
    topTribe,
    sunSign
  } = args;
  const eb = enochianBiblical;
  const life = lifeForTribe(topTribe.tribe);

  return [
    withNavigationLadder({
      systemId: 'mayan',
      systemName: 'Classical Maya (Tzolkʼin · Haabʼ · Long Count)',
      whyPresent:
        'Maya computus measures sacred day-quality independent of the Gregorian marketplace clock. It answers: what kind of day-spirit is active?',
      lifeRelevance:
        'Use it to time initiation, rest, and ritual—not as fortune-telling, but as a vocabulary for the day’s character.',
      connectsToDay: `Today is ${mayan.tzolkin.formatted} (${mayan.tzolkin.meaning}) facing ${mayan.tzolkin.direction}—the same compass quadrant as the ${topTribe.directionInCamp} tribal camp when directions align.`,
      connectsToMonth: `Haabʼ ${mayan.haab.formatted} frames the solar month mood (${mayan.haab.meaning}).`,
      connectsToBirthChart: `Your measured moment’s Kin ${mayan.kinNumber} can be compared to a natal Kin if you lock a birth date—birth Kin vs transit Kin is the Maya “progressed day.”`,
      connectsToName: `Name numerology (Life Path ${numerology.lifePathNumber}) scores tribal affinity; Maya direction then boosts tribes camping the same way as today’s glyph.`,
      triangulatesWith: ['dreamspell', 'twelve_tribes', 'chinese', 'enochian'],
      crossNote: `Cross-note: Maya ${mayan.tzolkin.direction} × Tribe ${topTribe.tribe} (${topTribe.directionInCamp}) × Chinese ${chinese.dominantElement} — ${life.giftToEmbody}`,
      independentlySays: `${mayan.tzolkin.formatted} · Kin ${mayan.kinNumber} · Long Count ${mayan.longCount.formatted}.`,
      disagreesWith:
        'Maya day-quality can conflict with Chinese day-pillar work-style or Roman dies temperament on the same civil date—sacred character ≠ marketplace schedule.',
      doWithDisagreement:
        'Keep Maya as day-character; use Chinese/Roman for how you schedule labor. Do not collapse them into one mood.'
    }),
    withNavigationLadder({
      systemId: 'dreamspell',
      systemName: 'Dreamspell 13:20 Synchronometer',
      whyPresent:
        'Dreamspell is the modern harmonic reading of the 260-day loom—tone, seal, wavespell, and oracle—as a practice language for intention.',
      lifeRelevance:
        'It tells you how to *act* the day (tone power) and what seal-quality to embody, bridging classical Maya day-signs into contemporary spiritual work.',
      connectsToDay: `${dreamspell.signature} — tone ${dreamspell.galacticTone.name} asks for ${dreamspell.galacticTone.power}.`,
      connectsToMonth: `Thirteen Moon: ${dreamspell.thirteenMoon.moonName}, day ${dreamspell.thirteenMoon.dayOfMoon}/28 (${dreamspell.thirteenMoon.serviceQuestion}).`,
      connectsToBirthChart: `Destiny Kin vs today’s Kin shows harmonic distance in the 260-day field—useful natal/transit contrast when birth data is locked.`,
      connectsToName: `Oracle guide ${dreamspell.oracle.guide.name} often rhymes with name-path themes under Universal Day ${numerology.universalDay}.`,
      triangulatesWith: ['mayan', 'gene_keys', 'twelve_tribes'],
      crossNote: `Cross-note: Dreamspell ${dreamspell.solarSeal.name} power of ${dreamspell.solarSeal.power} supports Gene Key gift “${geneKeysSun.gift}” when you refuse the shadow of ${geneKeysSun.shadow}.`,
      independentlySays: `${dreamspell.signature} · Tone ${dreamspell.galacticTone.name} (${dreamspell.galacticTone.power}).`,
      disagreesWith:
        'Dreamspell practice language may diverge from classical Maya glyph meanings even on the same Kin number—modern harmonic vs archaeological computus.',
      doWithDisagreement:
        'Treat Dreamspell as action-tone and Maya as day-character. Use both; do not force synonymy.'
    }),
    withNavigationLadder({
      systemId: 'chinese',
      systemName: 'Chinese BaZi · Wu Xing · Solar Terms',
      whyPresent:
        'BaZi maps year/month/day/hour pillars—how qi is distributed in the living moment. It is the elemental weather report of the day.',
      lifeRelevance:
        'Use stems/branches to choose work style: Wood expands, Fire clarifies, Earth stabilizes, Metal refines, Water deepens.',
      connectsToDay: `Day pillar ${chinese.dayPillar.stemPinYin}-${chinese.dayPillar.branchPinYin} (${chinese.dayPillar.stemElement} ${chinese.dayPillar.zodiacAnimal}).`,
      connectsToMonth: `Month pillar + solar term ${chinese.solarTerm.name} (${chinese.solarTerm.chineseName}) set the seasonal qi for this stretch of the year.`,
      connectsToBirthChart: `Natal four pillars vs today’s day pillar is classical BaZi timing—compare when you enter birth data in Systems Report.`,
      connectsToName: `Dominant ${chinese.dominantElement} is weighed against Life Path ${numerology.lifePathNumber} and tribal zodiac ${topTribe.zodiacCorrespondence}.`,
      triangulatesWith: ['mayan', 'twelve_tribes', 'egyptian', 'enochian'],
      crossNote: `Cross-note: Chinese ${chinese.solarTerm.name} ↔ Egyptian ${egyptian.season} ↔ Biblical ${eb.biblicalSeason.hebrewTekufah} — three seasonal clocks on one JD.`,
      independentlySays: `Day ${chinese.dayPillar.stemPinYin}-${chinese.dayPillar.branchPinYin} · Dominant ${chinese.dominantElement} · ${chinese.solarTerm.name}.`,
      disagreesWith:
        'Wu Xing weather can urge outward yang action while Maya direction or Enochian watch asks containment—or the reverse.',
      doWithDisagreement:
        'Name the fork (expansion vs containment). Pick one primary mode for the day; use the other for micro-pockets of time.'
    }),
    withNavigationLadder({
      systemId: 'egyptian',
      systemName: 'Egyptian Sothic Civil Calendar',
      whyPresent:
        'The Nile civil year is an imperial solar metronome—365 days without leap—preserving Akhet/Peret/Shemu harvest logic.',
      lifeRelevance:
        'It reminds you that civic duty and agricultural rhythm are spiritual: inundation, growth, harvest.',
      connectsToDay: `Civil day ${egyptian.dayOfMonth} of ${egyptian.monthName}.`,
      connectsToMonth: `Season ${egyptian.season} — Sothic year ${egyptian.sothicYearInCycle}/1460.`,
      connectsToBirthChart: `Egyptian civil date of birth vs today measures “civic age” on the Nabonassar loom.`,
      connectsToName: `Epagomenal/deity month lore colors how name-path leadership (Judah-types) or scholarship (Issachar-types) shows up.`,
      triangulatesWith: ['chinese', 'ethiopian', 'enochian', 'greek'],
      crossNote: `Cross-note: Egyptian ${egyptian.season} and Chinese ${chinese.solarTerm.name} both read solar longitude—use them as twin harvest advisories.`,
      independentlySays: `${egyptian.monthName} ${egyptian.dayOfMonth} · Season ${egyptian.season}.`,
      disagreesWith:
        'Egyptian civil harvest seasons can lag or lead biblical tekufot and Chinese jieqi by wording even when solar longitude agrees.',
      doWithDisagreement:
        'Prefer solar-longitude agreement as the shared fact; treat seasonal names as tradition-specific labels.'
    }),
    withNavigationLadder({
      systemId: 'ethiopian',
      systemName: 'Ethiopian Geʼez Calendar',
      whyPresent:
        'Geʼez computus preserves African Christian timekeeping and the highland memory that also safeguarded Enochian astronomy.',
      lifeRelevance:
        'It links your date to evangelist-cycle stewardship and to the living Orthodoxy that carried 1 Enoch.',
      connectsToDay: `${ethiopian.monthName} ${ethiopian.dayOfMonth}, Year of Grace ${ethiopian.year}.`,
      connectsToMonth: `Evangelist cycle: ${ethiopian.evangelist} — a gospel posture for the year’s narrative voice.`,
      connectsToBirthChart: `Geʼez birth date vs civil Gregorian reveals the 7–8 year era offset—useful for Ethiopian lineage work.`,
      connectsToName: `Evangelist tone can color how you speak your name’s mission this year.`,
      triangulatesWith: ['enochian', 'egyptian', 'twelve_tribes'],
      crossNote: `Cross-note: Ethiopian evangelist ${ethiopian.evangelist} × Enochian watch ${eb.enochian.watchGate} — highland memory meeting Watcher gates.`,
      independentlySays: `${ethiopian.monthName} ${ethiopian.dayOfMonth}, Amete Mihret ${ethiopian.year} · Evangelist ${ethiopian.evangelist}.`,
      disagreesWith:
        'Geʼez evangelist-year narrative may not match Greek festival mood or Roman dies on the same UT instant.',
      doWithDisagreement:
        'Use Ethiopian as gospel-posture; use Greek/Roman as civic-festival/diurnal temperament. Separate registers.'
    }),
    withNavigationLadder({
      systemId: 'greek',
      systemName: 'Attic Greek · Metonic · Olympiad',
      whyPresent:
        'Hellenic lunisolar time keeps festival consciousness—Apollo, Demeter, Dionysus—alive beside solar civil calendars.',
      lifeRelevance:
        'It invites ecstatic, civic, and mystery-cult modes of meaning: when to celebrate, initiate, or legislate.',
      connectsToDay: `${greek.atticMonthName} day ${greek.atticDay} under ${greek.patronDeity}.`,
      connectsToMonth: `Festival field: ${greek.historicFestival} · Metonic ${greek.metonicCycleYear}/19.`,
      connectsToBirthChart: `Olympiad dating frames life in four-year athletic-civic arcs.`,
      connectsToName: `Patron deity of the Attic month can name the mythic ally of your Life Path work this month.`,
      triangulatesWith: ['egyptian', 'roman_dies', 'twelve_tribes'],
      crossNote: `Cross-note: Greek ${greek.patronDeity} ↔ Roman ${eb.gregorianWeekdayDeity.romanDeity} (${eb.gregorianWeekdayDeity.latinDies}) — Hellenic month deity meets Latin dies.`,
      independentlySays: `${greek.atticMonthName} ${greek.atticDay} · ${greek.patronDeity} · ${greek.historicFestival}.`,
      disagreesWith:
        'Lunisolar festival timing can diverge from pure solar Egyptian/Chinese seasons even when civil dates align.',
      doWithDisagreement:
        'Celebrate or initiate on the Hellenic festival clock; schedule harvest/civic labor on the solar clocks.'
    }),
    withNavigationLadder({
      systemId: 'enochian_biblical',
      systemName: 'Enochian Time · Biblical Tekufot · Roman Dies',
      whyPresent:
        'Enochian 364-day watches, biblical season verses, and Roman planetary weekdays together bind scripture, Watcher gates, and classical diurnal temperament.',
      lifeRelevance:
        'Read the day as covenant season (tekufah) + planetary temperament (dies) + directional watch—then act.',
      connectsToDay: `${eb.enochian.formatted} · ${eb.gregorianWeekdayDeity.latinDies} · Hour of ${eb.currentPlanetaryHour.planet}.`,
      connectsToMonth: `${eb.biblicalSeason.name} — verses ${eb.biblicalTransits.seasonVerseAnchors.slice(0, 2).join(', ')}.`,
      connectsToBirthChart: `Tekufah of birth vs today shows seasonal covenant distance; Roman birth-weekday deity vs today is diurnal temperament contrast.`,
      connectsToName: `Name path + tribal camp remap under Enochian flip: civil ${topTribe.directionInCamp} may read as Watcher ${eb.compassOrientation.directionRemap[topTribe.directionInCamp]}.`,
      triangulatesWith: ['twelve_tribes', 'ethiopian', 'chinese', 'mayan'],
      crossNote: `Cross-note: ${eb.biblicalSeason.verses[0].ref} anchors the season; Tribe ${topTribe.tribe} practices: ${life.dayPractice}`,
      independentlySays: `${eb.enochian.formatted} · ${eb.biblicalSeason.hebrewTekufah} · ${eb.gregorianWeekdayDeity.latinDies} (hour of ${eb.currentPlanetaryHour.planet}).`,
      disagreesWith:
        'Civil north-up compass vs Enochian flip remaps tribal camp bearings—Peek A and Peek B are intentionally non-identical.',
      doWithDisagreement:
        'Use A/B Compare. Act in one orientation at a time; log which frame you chose.'
    }),
    withNavigationLadder({
      systemId: 'numerology',
      systemName: 'Pythagorean · Chaldean Numerology',
      whyPresent:
        'Number reduces date and name into vibrational roots—the simplest bridge between civil calendar and archetypal psychology.',
      lifeRelevance:
        'Life Path is the long arc; Universal Day is today’s weather of that arc.',
      connectsToDay: `Universal Day ${numerology.universalDay} — ${numerology.numberMeanings[numerology.universalDay] || 'active vibration'}.`,
      connectsToMonth: `Universal Month ${numerology.universalMonth} inside Universal Year ${numerology.universalYear}.`,
      connectsToBirthChart: `Life Path ${numerology.lifePathNumber}${numerology.lifePathIsMaster ? ' (Master)' : ''} is birth-date derived—your durable number signature.`,
      connectsToName: `Expression/soul calculations (Systems Report gematria) fuse name letters with Life Path; tribal scoring uses Life Path index.`,
      triangulatesWith: ['twelve_tribes', 'mayan', 'gene_keys'],
      crossNote: `Cross-note: Life Path ${numerology.lifePathNumber} elevates tribe affinity for camp roles that match your number’s vocation.`,
      independentlySays: `Life Path ${numerology.lifePathNumber} · Universal Day ${numerology.universalDay} · Chaldean ${numerology.chaldeanVibration}.`,
      disagreesWith:
        'Life Path vocation may not match the day’s Maya/Chinese weather—long arc vs daily weather is a real tension.',
      doWithDisagreement:
        'Let Life Path set the decade posture; let Universal Day / Maya / Chinese set today’s tactics.'
    }),
    withNavigationLadder({
      systemId: 'gene_keys',
      systemName: 'Gene Keys · I Ching Gates (Solar / Earth)',
      whyPresent:
        'Gene Keys translate ecliptic position into a shadow→gift→siddhi spectrum—psychology of the sky’s current teaching.',
      lifeRelevance:
        'Work the Gift; refuse the Shadow; glimpse the Siddhi. It is a practice continuum, not a fixed identity stamp.',
      connectsToDay: `Sun Gate ${geneKeysSun.gate}.${geneKeysSun.line} (${geneKeysSun.name}) — Gift: ${geneKeysSun.gift}.`,
      connectsToMonth: `As the Sun moves ~1°/day, gate/line slowly shift—monthly Gene Key weather.`,
      connectsToBirthChart: `Natal Sun gate vs transit Sun gate is the classic Golden Path contrast when birth time/date is fixed.`,
      connectsToName: `Name-path themes often rhyme with the Gift emphasized under this methodology (e.g. leadership names under Judah + Gate of Guidance).`,
      triangulatesWith: ['dreamspell', 'twelve_tribes', 'ephemeris'],
      crossNote: `Cross-note: Gene Key Gift “${geneKeysSun.gift}” × Tribe gift “${life.giftToEmbody}” × Dreamspell power “${dreamspell.solarSeal.power}”.`,
      independentlySays: `Sun Gate ${geneKeysSun.gate}.${geneKeysSun.line} (${geneKeysSun.name}) — Shadow ${geneKeysSun.shadow} / Gift ${geneKeysSun.gift} / Siddhi ${geneKeysSun.siddhi}.`,
      disagreesWith:
        'Gift practice can conflict with a Roman dies or Chinese yang day that pushes speed over depth.',
      doWithDisagreement:
        'Protect a Gift window (even 20 minutes). Schedule yang tasks outside that window.'
    }),
    withNavigationLadder({
      systemId: 'twelve_tribes',
      systemName: 'Twelve Tribes Archetypal Camp (Numbers 2)',
      whyPresent:
        'The Tribes are not ethnic branding here—they are a twelvefold archetypal camp around the Tabernacle: how human vocation arranges itself in space (East/South/West/North) and symbol (gem, banner, blessing).',
      lifeRelevance: life.lifeRepresents,
      connectsToDay: `Strongest archetypal alignment under this methodology: ${topTribe.tribe} (${topTribe.affinityScore}%). Suggested practice: ${life.dayPractice}`,
      connectsToMonth: `Camp direction ${topTribe.directionInCamp} should be read against this month’s Chinese solar term (${chinese.solarTerm.name}) and biblical tekufah (${eb.biblicalSeason.hebrewTekufah}).`,
      connectsToBirthChart: `Natal Sun in ${sunSign} leans toward tribes whose zodiacCorrespondence shares that sign’s element/mythos; lock birth data to deepen natal tribe scoring.`,
      connectsToName: `Life Path ${numerology.lifePathNumber} and name gematria (Systems Report) further weight which banner scores highest—name is a tribal trumpet, not a destiny stamp.`,
      triangulatesWith: ['mayan', 'chinese', 'numerology', 'enochian_biblical', 'gene_keys', 'ephemeris'],
      crossNote: `Cross-note: Why Tribes sit beside every system—because camp direction is the common language that Maya glyphs, Chinese elements, Roman dies, and Enochian watches can all speak.`,
      independentlySays: `Strongest archetypal alignment under this methodology: ${topTribe.tribe} (${topTribe.affinityScore}%) · ${topTribe.directionInCamp} camp · ${topTribe.archetypeRole}.`,
      intersectsWith: `Scored from Maya direction, Chinese element, and Life Path/Universal Day—then read against Gene Key gift and Enochian camp remap.`,
      disagreesWith:
        'A second tribe may score close behind; Maya direction and Chinese element can pull affinity in opposite camps.',
      doWithDisagreement:
        'Treat the top tribe as the primary archetypal lens for today, not an identity. If scores are close, hold both banners and choose practice consciously.'
    }),
    withNavigationLadder({
      systemId: 'ephemeris_astro',
      systemName: 'Planetary Ephemeris · Astrocartography',
      whyPresent:
        'Planets locate the day in ecliptic myth; astrocartography projects those myths onto Earth so place becomes part of the chart.',
      lifeRelevance:
        'Sky tells *what* is emphasized; map tells *where* that emphasis geographically intensifies.',
      connectsToDay: `Sun in ${sunSign} colors tribal zodiac links; planetary hour of ${eb.currentPlanetaryHour.planet} times action.`,
      connectsToMonth: `Slow planets set multi-month weather; solar sign change marks month-scale shifts.`,
      connectsToBirthChart: `Transit-to-natal aspects (when birth locked) and relocation lines are the birth-chart spine of The Crucible.`,
      connectsToName: `Gematria of place-names and personal names in Systems Report fuses linguistic vibration with geodetic lines.`,
      triangulatesWith: ['gene_keys', 'twelve_tribes', 'enochian_biblical'],
      crossNote: `Cross-note: Sun ${sunSign} × Tribe ${topTribe.zodiacCorrespondence} × Enoch Flip remaps camp bearings on the world map.`,
      independentlySays: `Sun in ${sunSign} · planetary hour of ${eb.currentPlanetaryHour.planet} · geographic line emphasis via astrocartography.`,
      disagreesWith:
        'Place-line emphasis can contradict the day’s tribal camp direction if you are physically far from high-resonance meridians.',
      doWithDisagreement:
        'Either relocate attention (travel/call someone there) or treat place-lines as background weather while acting locally.'
    })
  ];
}

/**
 * Master intertwining builder — attach to CompleteCalculationContext.intertwining
 */
export function buildCrossSystemIntertwining(args: {
  temporal: TemporalCoordinate;
  mayan: MayanResult;
  dreamspell: DreamspellResult;
  chinese: ChineseResult;
  egyptian: EgyptianResult;
  ethiopian: EthiopianResult;
  greek: GreekResult;
  enochianBiblical: EnochianBiblicalResult;
  numerology: NumerologyResult;
  geneKeysSun: GeneKeyGate;
  geneKeysEarth: GeneKeyGate;
  celestialBodies: CelestialCoordinate[];
  twelveTribesScores: TwelveTribeAffinity[];
  topTribe: TwelveTribeAffinity;
}): CrossSystemIntertwining {
  const sun = args.celestialBodies.find((b) => b.id === 'sun');
  const sunSign = sun?.zodiacSign || 'Unknown';
  const life = lifeForTribe(args.topTribe.tribe);

  const enrichedTribes: TwelveTribeAffinity[] = args.twelveTribesScores.map((t) => {
    const L = lifeForTribe(t.tribe);
    return {
      ...t,
      lifeConnotation: L,
      dayConnection: `Affinity ${t.affinityScore}% today via camp ${t.directionInCamp}, Maya direction ${args.mayan.tzolkin.direction}, and Universal Day ${args.numerology.universalDay}. Practice: ${L.dayPractice}`,
      monthConnection: `Read against solar term ${args.chinese.solarTerm.name} and tekufah ${args.enochianBiblical.biblicalSeason.hebrewTekufah}.`,
      birthChartConnection: `Zodiac link ${t.zodiacCorrespondence} vs transit Sun ${sunSign}; deepen with locked natal date in Systems Report.`,
      nameConnection: `Life Path ${args.numerology.lifePathNumber} and name gematria weight this banner; names that mean leadership, law, or joy amplify matching tribes.`
    };
  });

  const systemNotes = buildSystemCrossNotes({
    temporal: args.temporal,
    mayan: args.mayan,
    dreamspell: args.dreamspell,
    chinese: args.chinese,
    egyptian: args.egyptian,
    ethiopian: args.ethiopian,
    greek: args.greek,
    enochianBiblical: args.enochianBiblical,
    numerology: args.numerology,
    geneKeysSun: args.geneKeysSun,
    topTribe: enrichedTribes[0] || args.topTribe,
    sunSign
  });

  const top = enrichedTribes[0] || args.topTribe;

  const triangulationNarrative = `INTERTWINING DOSSIER — Why these systems sit together
Julian Day ${args.temporal.julianDayUT.toFixed(4)} is the shared spine. From it:
• Maya ${args.mayan.tzolkin.formatted} and Dreamspell ${args.dreamspell.signature} speak day-quality and action-tone.
• Chinese ${args.chinese.dayPillar.stemPinYin}-${args.chinese.dayPillar.branchPinYin} and solar term ${args.chinese.solarTerm.name} speak elemental qi and month weather.
• Egyptian ${args.egyptian.season}, Ethiopian ${args.ethiopian.evangelist}, Greek ${args.greek.atticMonthName} speak civil/festival memory.
• Enochian ${args.enochianBiblical.enochian.watchGate} and ${args.enochianBiblical.biblicalSeason.hebrewTekufah} speak covenant season and Watcher direction (${args.enochianBiblical.biblicalTransits.seasonVerseAnchors[0]}).
• Roman ${args.enochianBiblical.gregorianWeekdayDeity.latinDies} and hour of ${args.enochianBiblical.currentPlanetaryHour.planet} speak diurnal temperament.
• Numerology Life Path ${args.numerology.lifePathNumber} / Universal Day ${args.numerology.universalDay} speak name-and-date vibration.
• Gene Keys Sun ${args.geneKeysSun.gate}.${args.geneKeysSun.line} (${args.geneKeysSun.gift}) speak shadow-to-gift practice.
• Twelve Tribes strongest archetypal alignment under this methodology: ${top.tribe} — ${life.lifeRepresents}
Suggested practice today: ${life.dayPractice}
Shadow to refuse: ${life.shadowToWatch}
Gift to explore: ${life.giftToEmbody}
Enochian remap of camp ${top.directionInCamp} → ${args.enochianBiblical.compassOrientation.directionRemap[top.directionInCamp]}.
These are not separate apps glued together—they are dialects of one JD, triangulated so agreements strengthen confidence and contradictions become conscious forks. Archetypal alignments are methodological readings, not objective identities.`;

  return {
    systemNotes,
    twelveTribesEnriched: enrichedTribes,
    primaryTribeLife: {
      tribe: top.tribe,
      ...life,
      whyBesideOtherSystems:
        'The tribal camp is the human-vocation layer under this methodology. Calendars say when; planets say what; tribes offer archetypal lenses for how vocation can arrange itself in the living day—not a claim that computation discovered your objective identity.',
      dayLink: top.dayConnection || '',
      monthLink: top.monthConnection || '',
      birthChartLink: top.birthChartConnection || '',
      nameLink: top.nameConnection || ''
    },
    triangulationNarrative,
    intertwiningThreads: [
      {
        id: 'thread-direction',
        title: 'Cardinal Direction Thread',
        nodes: [
          `Maya ${args.mayan.tzolkin.direction}`,
          `Tribe camp ${top.directionInCamp}`,
          `Enochian remap → ${args.enochianBiblical.compassOrientation.directionRemap[top.directionInCamp]}`,
          `Astrocartography orientation (Enoch Flip optional)`
        ],
        meaning: 'Direction is the shared grammar between glyph, camp, Watcher gate, and map.'
      },
      {
        id: 'thread-season',
        title: 'Seasonal Covenant Thread',
        nodes: [
          `Chinese ${args.chinese.solarTerm.name}`,
          `Egyptian ${args.egyptian.season}`,
          `Biblical ${args.enochianBiblical.biblicalSeason.hebrewTekufah}`,
          `Verse ${args.enochianBiblical.biblicalTransits.seasonVerseAnchors[0]}`
        ],
        meaning: 'Three+ seasonal clocks prevent mistaking marketplace months for covenant seasons.'
      },
      {
        id: 'thread-vocation',
        title: 'Vocation · Name · Gift Thread',
        nodes: [
          `Tribe ${top.tribe}`,
          `Life Path ${args.numerology.lifePathNumber}`,
          `Gene Key Gift ${args.geneKeysSun.gift}`,
          `Dreamspell power ${args.dreamspell.solarSeal.power}`,
          `Roman ${args.enochianBiblical.gregorianWeekdayDeity.romanDeity}`
        ],
        meaning: 'Archetypal vocation (tribe/name) meets how the sky asks you to practice (gift/tone/dies)—under declared methodologies, not as fixed identity.'
      },
      {
        id: 'thread-element',
        title: 'Elemental Weather Thread',
        nodes: [
          `Chinese ${args.chinese.dominantElement}`,
          `Maya ${args.mayan.tzolkin.element}`,
          `Composite ${args.chinese.dominantElement}/${args.mayan.tzolkin.element}`,
          `Tribe zodiac ${top.zodiacCorrespondence}`
        ],
        meaning: 'Elemental agreement raises confidence; elemental tension becomes a dialectical fork.'
      }
    ]
  };
}

/** Enrich tribe scores with life connotations (used inside synthesis path). */
export function enrichTribeWithLife(t: TwelveTribeAffinity): TwelveTribeAffinity {
  const L = lifeForTribe(t.tribe);
  return {
    ...t,
    lifeConnotation: L,
    resonanceDescription: `${L.lifeRepresents} Resonates at ${t.affinityScore}% via ${t.directionInCamp} camp, ${t.gemstone}, and role: ${t.archetypeRole}. Day practice: ${L.dayPractice}`
  };
}
