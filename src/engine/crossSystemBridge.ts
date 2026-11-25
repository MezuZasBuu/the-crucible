/**
 * The Crucible — Cross-System Bridge & Life Connotation Engine
 *
 * Explains why each spiritual/calendrical system is present, how it
 * connects to the living day, month, birth chart, and name vibration,
 * and how all streams triangulate through the Twelve Callings circle.
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
  CallingAffinity,
  CallingLifeConnotation
} from '../types';

const CALLING_LIFE_MEANINGS: Record<string, CallingLifeConnotation> = {
  'The Trailblazer': {
    lifeRepresents:
      'Leadership under pressure: the willingness to go first when others hesitate. This is about responsibility, not control — courage that makes the people around you safer.',
    dayPractice: 'Say one clear intention out loud in the morning; act on it before noon.',
    shadowToWatch: 'Pride that isolates, or making noise without helping anyone.',
    giftToEmbody: 'Courage that makes others safer.'
  },
  'The Stargazer': {
    lifeRepresents:
      'Reading the season correctly — knowing when to plant, wait, or harvest. This is about timing, study, and calm advice that helps others get their bearings.',
    dayPractice: 'Before deciding, name the season you are actually in (seed / heat / gather / rest).',
    shadowToWatch: 'Analysis that never becomes action.',
    giftToEmbody: 'A sense of timing that frees others from false urgency.'
  },
  'The Wayfarer': {
    lifeRepresents:
      'Building harbors where resources, ideas, and people can meet safely. This is about networking, generosity, and turning a vision into a workable exchange.',
    dayPractice: 'Send one message that connects two people or projects.',
    shadowToWatch: 'Restless travel that never docks.',
    giftToEmbody: 'Bridge-building that supports the people doing deep work.'
  },
  'The Wellspring': {
    lifeRepresents:
      'Raw vitality and fresh starts. This is about being honest about what you want, and having the courage to begin again after things have been unstable.',
    dayPractice: 'Name one desire without shame; channel it into one constructive act.',
    shadowToWatch: 'Impulse that damages trust.',
    giftToEmbody: 'Passionate honesty that restarts what has gone stale.'
  },
  'The Listener': {
    lifeRepresents:
      'Hearing the truth, even when it cuts. This is about deep listening and refusing comfortable lies — then clearing them away cleanly.',
    dayPractice: 'Listen twice before you speak once; drop one false story today.',
    shadowToWatch: 'Intensity that wounds allies.',
    giftToEmbody: 'Truth-hearing that cleanses without cruelty.'
  },
  'The Sentinel': {
    lifeRepresents:
      'Steady courage at the edge. This is about staying competent in a crisis and loyally defending what matters.',
    dayPractice: 'Identify one real risk; take one protective step.',
    shadowToWatch: 'Fighting every battle as if everything depended on it.',
    giftToEmbody: 'Firm defense that creates peace behind the line.'
  },
  'The Cultivator': {
    lifeRepresents:
      'Fruitfulness and care for material things — turning scarcity into plenty. This is about building, multiplying resources, and leaving systems stronger than you found them.',
    dayPractice: 'Improve one tangible system (budget, workspace, archive) by 1%.',
    shadowToWatch: 'Building an empire and forgetting what it was for.',
    giftToEmbody: 'Provision that benefits many people.'
  },
  'The Memory Keeper': {
    lifeRepresents:
      'Restoring what was forgotten. This is about memory work, repairing family or community threads, and reclaiming abandoned gifts.',
    dayPractice: 'Recover one forgotten skill, photo, text, or family story.',
    shadowToWatch: 'Nostalgia that blocks what could grow now.',
    giftToEmbody: 'Memory that heals the future.'
  },
  'The Flamekeeper': {
    lifeRepresents:
      'Fierce protection of what is precious. This is about guarding boundaries, careful craft with words, and staying loyal through the night.',
    dayPractice: 'Guard one boundary; write one sentence worth keeping.',
    shadowToWatch: 'Intensity with no purpose behind it.',
    giftToEmbody: 'Protective focus that keeps the flame lit.'
  },
  'The Arbiter': {
    lifeRepresents:
      'Judgment as balance — fair rules so the circle does not dissolve into chaos. This is about ethical clarity, even-handed decisions, and wise caution.',
    dayPractice: 'Weigh one decision honestly; refuse both favoritism and fear.',
    shadowToWatch: 'Cold judgment that loses mercy.',
    giftToEmbody: 'Discernment that restores balance.'
  },
  'The Host': {
    lifeRepresents:
      'Nourishment and gracious hosting — plenty that delights. This is about hospitality, healing craft, and making an ordinary table feel special.',
    dayPractice: 'Feed someone (body or spirit) with genuine delight.',
    shadowToWatch: 'Pleasure with no care behind it.',
    giftToEmbody: 'Nourishment that dignifies the everyday.'
  },
  'The Messenger': {
    lifeRepresents:
      'Swift joy and warm speech. This is about carrying good news, writing and speaking well, and keeping a light, agile spirit.',
    dayPractice: 'Say or write one kind, true thing that lifts another person.',
    shadowToWatch: 'Speed that skips depth.',
    giftToEmbody: 'Joyful words that make hard things lighter.'
  }
};

function lifeForCalling(callingName: string): CallingLifeConnotation {
  return (
    CALLING_LIFE_MEANINGS[callingName] ?? {
      lifeRepresents: 'A role of service within the circle — a lens for today, not a fixed identity.',
      dayPractice: 'Point one action toward the good of the whole.',
      shadowToWatch: 'Forgetting why you took up the role.',
      giftToEmbody: 'Faithful presence in your quarter.'
    }
  );
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
  topCalling: CallingAffinity;
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
    topCalling,
    sunSign
  } = args;
  const eb = enochianBiblical;
  const life = lifeForCalling(topCalling.calling);

  return [
    withNavigationLadder({
      systemId: 'mayan',
      systemName: 'Classical Maya (Tzolkʼin · Haabʼ · Long Count)',
      whyPresent:
        'Maya computus measures sacred day-quality independent of the Gregorian marketplace clock. It answers: what kind of day-spirit is active?',
      lifeRelevance:
        'Use it to time initiation, rest, and ritual—not as fortune-telling, but as a vocabulary for the day’s character.',
      connectsToDay: `Today is ${mayan.tzolkin.formatted} (${mayan.tzolkin.meaning}) facing ${mayan.tzolkin.direction}—the same compass quarter as today's calling (${topCalling.quarter}) when directions align.`,
      connectsToMonth: `Haabʼ ${mayan.haab.formatted} frames the solar month mood (${mayan.haab.meaning}).`,
      connectsToBirthChart: `Your measured moment’s Kin ${mayan.kinNumber} can be compared to a natal Kin if you lock a birth date—birth Kin vs transit Kin is the Maya “progressed day.”`,
      connectsToName: `Name numerology (Life Path ${numerology.lifePathNumber}) scores calling affinity; Maya direction then boosts callings in the same quarter as today’s glyph.`,
      triangulatesWith: ['dreamspell', 'twelve_callings', 'chinese', 'enochian'],
      crossNote: `Cross-note: Maya ${mayan.tzolkin.direction} × Calling ${topCalling.calling} (${topCalling.quarter}) × Chinese ${chinese.dominantElement} — ${life.giftToEmbody}`,
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
      triangulatesWith: ['mayan', 'gene_keys', 'twelve_callings'],
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
      connectsToName: `Dominant ${chinese.dominantElement} is weighed against Life Path ${numerology.lifePathNumber} and calling zodiac ${topCalling.zodiacCorrespondence}.`,
      triangulatesWith: ['mayan', 'twelve_callings', 'egyptian', 'enochian'],
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
      connectsToName: `Epagomenal/deity month lore colors how name-path leadership (Trailblazer types) or scholarship (Stargazer types) shows up.`,
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
      triangulatesWith: ['enochian', 'egyptian', 'twelve_callings'],
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
      triangulatesWith: ['egyptian', 'roman_dies', 'twelve_callings'],
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
      connectsToName: `Name path + calling-quarter remap under Enochian flip: civil ${topCalling.quarter} may read as Watcher ${eb.compassOrientation.directionRemap[topCalling.quarter]}.`,
      triangulatesWith: ['twelve_callings', 'ethiopian', 'chinese', 'mayan'],
      crossNote: `Cross-note: ${eb.biblicalSeason.verses[0].ref} anchors the season; Calling ${topCalling.calling} practices: ${life.dayPractice}`,
      independentlySays: `${eb.enochian.formatted} · ${eb.biblicalSeason.hebrewTekufah} · ${eb.gregorianWeekdayDeity.latinDies} (hour of ${eb.currentPlanetaryHour.planet}).`,
      disagreesWith:
        'Civil north-up compass vs Enochian flip remaps calling quarters—Peek A and Peek B are intentionally non-identical.',
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
      connectsToName: `Expression/soul calculations (Systems Report gematria) fuse name letters with Life Path; calling scoring uses Life Path index.`,
      triangulatesWith: ['twelve_callings', 'mayan', 'gene_keys'],
      crossNote: `Cross-note: Life Path ${numerology.lifePathNumber} elevates calling affinity for callings that match your number’s vocation.`,
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
      connectsToName: `Name-path themes often rhyme with the Gift emphasized under this methodology (e.g. leadership names with The Trailblazer + Gate of Guidance).`,
      triangulatesWith: ['dreamspell', 'twelve_callings', 'ephemeris'],
      crossNote: `Cross-note: Gene Key Gift “${geneKeysSun.gift}” × Calling gift “${life.giftToEmbody}” × Dreamspell power “${dreamspell.solarSeal.power}”.`,
      independentlySays: `Sun Gate ${geneKeysSun.gate}.${geneKeysSun.line} (${geneKeysSun.name}) — Shadow ${geneKeysSun.shadow} / Gift ${geneKeysSun.gift} / Siddhi ${geneKeysSun.siddhi}.`,
      disagreesWith:
        'Gift practice can conflict with a Roman dies or Chinese yang day that pushes speed over depth.',
      doWithDisagreement:
        'Protect a Gift window (even 20 minutes). Schedule yang tasks outside that window.'
    }),
    withNavigationLadder({
      systemId: 'twelve_callings',
      systemName: 'The Twelve Callings',
      whyPresent:
        'The Twelve Callings are the Crucible’s own circle of twelve roles standing around a shared centre—three in each compass quarter (East/South/West/North). Each has a stone, an emblem, a gift and a shadow. It describes how people serve a whole, not who anyone is by birth.',
      lifeRelevance: life.lifeRepresents,
      connectsToDay: `Strongest archetypal alignment under this methodology: ${topCalling.calling} (${topCalling.affinityScore}%). Suggested practice: ${life.dayPractice}`,
      connectsToMonth: `The quarter ${topCalling.quarter} should be read against this month’s Chinese solar term (${chinese.solarTerm.name}) and biblical tekufah (${eb.biblicalSeason.hebrewTekufah}).`,
      connectsToBirthChart: `Natal Sun in ${sunSign} leans toward callings whose zodiacCorrespondence shares that sign’s element/mythos; lock birth data to deepen natal calling scoring.`,
      connectsToName: `Life Path ${numerology.lifePathNumber} and name gematria (Systems Report) further weight which calling scores highest—name is a signal, not a destiny stamp.`,
      triangulatesWith: ['mayan', 'chinese', 'numerology', 'enochian_biblical', 'gene_keys', 'ephemeris'],
      crossNote: `Cross-note: Why the Callings sit beside every system—because compass direction is the common language that Maya glyphs, Chinese elements, Roman dies, and Enochian watches can all speak.`,
      independentlySays: `Strongest archetypal alignment under this methodology: ${topCalling.calling} (${topCalling.affinityScore}%) · ${topCalling.quarter} quarter · ${topCalling.archetypeRole}.`,
      intersectsWith: `Scored from Maya direction, Chinese element, and Life Path/Universal Day—then read against Gene Key gift and Enochian compass remap.`,
      disagreesWith:
        'A second calling may score close behind; Maya direction and Chinese element can pull affinity in opposite quarters.',
      doWithDisagreement:
        'Treat the top calling as the primary archetypal lens for today, not an identity. If scores are close, hold both callings and choose practice consciously.'
    }),
    withNavigationLadder({
      systemId: 'ephemeris_astro',
      systemName: 'Planetary Ephemeris · Astrocartography',
      whyPresent:
        'Planets locate the day in ecliptic myth; astrocartography projects those myths onto Earth so place becomes part of the chart.',
      lifeRelevance:
        'Sky tells *what* is emphasized; map tells *where* that emphasis geographically intensifies.',
      connectsToDay: `Sun in ${sunSign} colors calling zodiac links; planetary hour of ${eb.currentPlanetaryHour.planet} times action.`,
      connectsToMonth: `Slow planets set multi-month weather; solar sign change marks month-scale shifts.`,
      connectsToBirthChart: `Transit-to-natal aspects (when birth locked) and relocation lines are the birth-chart spine of The Crucible.`,
      connectsToName: `Gematria of place-names and personal names in Systems Report fuses linguistic vibration with geodetic lines.`,
      triangulatesWith: ['gene_keys', 'twelve_callings', 'enochian_biblical'],
      crossNote: `Cross-note: Sun ${sunSign} × Calling ${topCalling.zodiacCorrespondence} × Enoch Flip remaps the quarters on the world map.`,
      independentlySays: `Sun in ${sunSign} · planetary hour of ${eb.currentPlanetaryHour.planet} · geographic line emphasis via astrocartography.`,
      disagreesWith:
        'Place-line emphasis can contradict the day’s calling quarter if you are physically far from high-resonance meridians.',
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
  callingScores: CallingAffinity[];
  topCalling: CallingAffinity;
}): CrossSystemIntertwining {
  const sun = args.celestialBodies.find((b) => b.id === 'sun');
  const sunSign = sun?.zodiacSign || 'Unknown';
  const life = lifeForCalling(args.topCalling.calling);

  const enrichedCallings: CallingAffinity[] = args.callingScores.map((t) => {
    const L = lifeForCalling(t.calling);
    return {
      ...t,
      lifeConnotation: L,
      dayConnection: `Affinity ${t.affinityScore}% today via the ${t.quarter} quarter, Maya direction ${args.mayan.tzolkin.direction}, and Universal Day ${args.numerology.universalDay}. Practice: ${L.dayPractice}`,
      monthConnection: `Read against solar term ${args.chinese.solarTerm.name} and tekufah ${args.enochianBiblical.biblicalSeason.hebrewTekufah}.`,
      birthChartConnection: `Zodiac link ${t.zodiacCorrespondence} vs transit Sun ${sunSign}; deepen with locked natal date in Systems Report.`,
      nameConnection: `Life Path ${args.numerology.lifePathNumber} and name gematria weight this calling; names that mean leadership, law, or joy amplify matching callings.`
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
    topCalling: enrichedCallings[0] || args.topCalling,
    sunSign
  });

  const top = enrichedCallings[0] || args.topCalling;

  const triangulationNarrative = `INTERTWINING DOSSIER — Why these systems sit together
Julian Day ${args.temporal.julianDayUT.toFixed(4)} is the shared spine. From it:
• Maya ${args.mayan.tzolkin.formatted} and Dreamspell ${args.dreamspell.signature} speak day-quality and action-tone.
• Chinese ${args.chinese.dayPillar.stemPinYin}-${args.chinese.dayPillar.branchPinYin} and solar term ${args.chinese.solarTerm.name} speak elemental qi and month weather.
• Egyptian ${args.egyptian.season}, Ethiopian ${args.ethiopian.evangelist}, Greek ${args.greek.atticMonthName} speak civil/festival memory.
• Enochian ${args.enochianBiblical.enochian.watchGate} and ${args.enochianBiblical.biblicalSeason.hebrewTekufah} speak covenant season and Watcher direction (${args.enochianBiblical.biblicalTransits.seasonVerseAnchors[0]}).
• Roman ${args.enochianBiblical.gregorianWeekdayDeity.latinDies} and hour of ${args.enochianBiblical.currentPlanetaryHour.planet} speak diurnal temperament.
• Numerology Life Path ${args.numerology.lifePathNumber} / Universal Day ${args.numerology.universalDay} speak name-and-date vibration.
• Gene Keys Sun ${args.geneKeysSun.gate}.${args.geneKeysSun.line} (${args.geneKeysSun.gift}) speak shadow-to-gift practice.
• Twelve Callings strongest archetypal alignment under this methodology: ${top.calling} — ${life.lifeRepresents}
Suggested practice today: ${life.dayPractice}
Shadow to refuse: ${life.shadowToWatch}
Gift to explore: ${life.giftToEmbody}
Enochian remap of quarter ${top.quarter} → ${args.enochianBiblical.compassOrientation.directionRemap[top.quarter]}.
These are not separate apps glued together—they are dialects of one JD, triangulated so agreements strengthen confidence and contradictions become conscious forks. Archetypal alignments are methodological readings, not objective identities.`;

  return {
    systemNotes,
    callingsEnriched: enrichedCallings,
    primaryCallingLife: {
      calling: top.calling,
      ...life,
      whyBesideOtherSystems:
        'The calling quarter is the human-vocation layer under this methodology. Calendars say when; planets say what; callings offer archetypal lenses for how vocation can arrange itself in the living day—not a claim that computation discovered your objective identity.',
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
          `Calling quarter ${top.quarter}`,
          `Enochian remap → ${args.enochianBiblical.compassOrientation.directionRemap[top.quarter]}`,
          `Astrocartography orientation (Enoch Flip optional)`
        ],
        meaning: 'Direction is the shared grammar between glyph, quarter, Watcher gate, and map.'
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
          `Calling ${top.calling}`,
          `Life Path ${args.numerology.lifePathNumber}`,
          `Gene Key Gift ${args.geneKeysSun.gift}`,
          `Dreamspell power ${args.dreamspell.solarSeal.power}`,
          `Roman ${args.enochianBiblical.gregorianWeekdayDeity.romanDeity}`
        ],
        meaning: 'Archetypal vocation (calling/name) meets how the sky asks you to practice (gift/tone/dies)—under declared methodologies, not as fixed identity.'
      },
      {
        id: 'thread-element',
        title: 'Elemental Weather Thread',
        nodes: [
          `Chinese ${args.chinese.dominantElement}`,
          `Maya ${args.mayan.tzolkin.element}`,
          `Composite ${args.chinese.dominantElement}/${args.mayan.tzolkin.element}`,
          `Calling zodiac ${top.zodiacCorrespondence}`
        ],
        meaning: 'Elemental agreement raises confidence; elemental tension becomes a dialectical fork.'
      }
    ]
  };
}

/** Enrich calling scores with life connotations (used inside synthesis path). */
export function enrichCallingWithLife(t: CallingAffinity): CallingAffinity {
  const L = lifeForCalling(t.calling);
  return {
    ...t,
    lifeConnotation: L,
    resonanceDescription: `${L.lifeRepresents} Resonates at ${t.affinityScore}% via ${t.quarter} quarter, ${t.gemstone}, and role: ${t.archetypeRole}. Day practice: ${L.dayPractice}`
  };
}
