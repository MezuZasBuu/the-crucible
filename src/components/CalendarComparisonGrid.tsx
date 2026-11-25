/**
 * All traditions, side by side — one card per calendar or system.
 * Each card: what the system is (one sentence), today's value written with the
 * tradition's own symbols, a few facts, and what it traditionally means.
 */

import React from 'react';
import { CompleteCalculationContext } from '../types';
import { MayanGlyphIcon } from './symbols/CrucibleGlyphs';
import {
  CULTURES,
  CultureHeader,
  CultureId,
  GEEZ_MONTHS,
  HANZI_ANIMALS,
  HANZI_ELEMENTS,
  HEBREW_MONTHS,
  MayaLongCount,
  MayaNumeral,
  NAKSHATRA_DEVANAGARI,
  Script,
  WUXING_COLOR,
  egyptSeasonSign,
  greekMonthNative,
  hexagramChar,
  toGeezNumeral,
  toRoman
} from './symbols/CultureSymbols';
import { PlanetGlyph } from './symbols/AstroGlyph';

interface CalendarComparisonGridProps {
  ctx: CompleteCalculationContext;
}

const Card: React.FC<{ culture: CultureId; value?: number; children: React.ReactNode }> = ({ culture, value, children }) => (
  <article className="trad-card" style={{ ['--trad-color' as string]: CULTURES[culture].color }}>
    <CultureHeader culture={culture} value={value} />
    {children}
  </article>
);

const Facts: React.FC<{ rows: Array<[string, React.ReactNode]> }> = ({ rows }) => (
  <dl className="trad-facts">
    {rows.map(([k, v]) => (
      <React.Fragment key={k}>
        <dt>{k}</dt>
        <dd>{v}</dd>
      </React.Fragment>
    ))}
  </dl>
);

const PLANET_ID: Record<string, string> = {
  Sun: 'sun', Moon: 'moon', Mars: 'mars', Mercury: 'mercury', Jupiter: 'jupiter', Venus: 'venus', Saturn: 'saturn'
};

function firstClause(text: string | undefined): string {
  return (text ?? '').split(/[.;]/)[0].trim();
}

export const CalendarComparisonGrid: React.FC<CalendarComparisonGridProps> = ({ ctx }) => {
  const { mayan, chinese, egyptian, ethiopian, greek, numerology, dreamspell, geneKeysSun, geneKeysEarth, vedic } = ctx;
  const eb = ctx.enochianBiblical;
  const lc = mayan.longCount;
  const pillars: Array<['Year' | 'Month' | 'Day' | 'Hour', typeof chinese.dayPillar]> = [
    ['Year', chinese.yearPillar],
    ['Month', chinese.monthPillar],
    ['Day', chinese.dayPillar],
    ['Hour', chinese.hourPillar]
  ];
  const season = egyptSeasonSign(egyptian.season);
  const weekday = eb.gregorianWeekdayDeity;
  const hour = eb.currentPlanetaryHour;
  const sealColor: Record<string, string> = { Red: '#b8483a', White: '#8a8fa3', Blue: '#2c6494', Yellow: '#b0771a' };

  return (
    <section className="space-y-4 motion-enter" aria-label="All traditions for this day">
      <div className="page-intro">
        <h3 className="panel-title">The same day, written twelve ways</h3>
        <p className="page-lead">
          Every culture below kept its own calendar. Each card shows how that tradition would write today’s date, in its
          own symbols, and what the day traditionally stands for.
        </p>
      </div>

      <div className="trad-grid">
        {/* MAYA */}
        <Card culture="maya" value={mayan.tzolkin.number}>
          <div className="trad-hero">
            <span className="trad-hero-symbol">
              <MayaNumeral value={mayan.tzolkin.number} size={34} />
            </span>
            <MayanGlyphIcon name={mayan.tzolkin.signName} size={44} color={CULTURES.maya.color} />
            <div className="min-w-0">
              <p className="trad-hero-value">{mayan.tzolkin.formatted}</p>
              <p className="trad-hero-sub">Day sign: {mayan.tzolkin.meaning}</p>
            </div>
          </div>
          <Facts
            rows={[
              ['Sacred count', `${mayan.tzolkin.formatted} (day ${mayan.kinNumber} of 260)`],
              ['Solar year', `${mayan.haab.formatted} — ${mayan.haab.meaning}`],
              [
                'Long Count',
                <span className="inline-flex flex-wrap items-center gap-2">
                  <MayaLongCount digits={[lc.baktun, lc.katun, lc.tun, lc.uinal, lc.kin]} size={22} color={CULTURES.maya.color} />
                  <span className="data-readout">{lc.formatted}</span>
                </span>
              ],
              ['Direction', `${mayan.tzolkin.direction} · ${mayan.tzolkin.element}`]
            ]}
          />
          <p className="trad-meaning">
            <strong>In plain words:</strong> the Maya wrote numbers with dots (1) and bars (5). Today is day number{' '}
            {mayan.tzolkin.number} with the sign {mayan.tzolkin.signName}. The Long Count is the number of days since the
            calendar’s starting point in 3114 BCE — {mayan.daysSinceEpoch.toLocaleString()} days.
          </p>
        </Card>

        {/* CHINESE */}
        <Card culture="chinese">
          <div className="trad-pillars">
            {pillars.map(([label, p]) => (
              <div key={label} className={`trad-pillar ${label === 'Day' ? 'trad-pillar-today' : ''}`}>
                <span className="trad-pillar-label">{label}</span>
                <Script className="trad-pillar-hanzi" lang="zh" color={WUXING_COLOR[p.stemElement]}>
                  {p.stem}
                  {p.branch}
                </Script>
                <span className="trad-pillar-name">
                  {p.stemElement} {p.zodiacAnimal}
                </span>
              </div>
            ))}
          </div>
          <Facts
            rows={[
              [
                'Today',
                <>
                  {chinese.dayPillar.stemPolarity} {chinese.dayPillar.stemElement} {chinese.dayPillar.zodiacAnimal}{' '}
                  <Script lang="zh" className="trad-native">
                    {HANZI_ELEMENTS[chinese.dayPillar.stemElement]}
                    {HANZI_ANIMALS[chinese.dayPillar.zodiacAnimal]}
                  </Script>
                </>
              ],
              [
                'Season marker',
                <>
                  {chinese.solarTerm.name}{' '}
                  <Script lang="zh" className="trad-native">{chinese.solarTerm.chineseName}</Script>
                </>
              ],
              [
                'Strongest element',
                <>
                  {chinese.dominantElement}{' '}
                  <Script lang="zh" color={WUXING_COLOR[chinese.dominantElement]}>{HANZI_ELEMENTS[chinese.dominantElement]}</Script>
                </>
              ],
              ['Moon', `${chinese.lunarPhaseName} · lunar day ${chinese.lunarDay}`]
            ]}
          />
          <p className="trad-meaning">
            <strong>In plain words:</strong> each column is a pair of characters — one of ten “stems” (an element) and
            one of twelve “branches” (an animal). Together the four pairs are called the Four Pillars. The colour shows
            the element: wood, fire, earth, metal or water.
          </p>
        </Card>

        {/* VEDIC */}
        {vedic && (
          <Card culture="vedic">
            <div className="trad-hero">
              <span className="trad-hero-symbol">
                <Script lang="sa" size={22}>{NAKSHATRA_DEVANAGARI[vedic.nakshatraNumber - 1]?.slice(0, 4) ?? 'ॐ'}</Script>
              </span>
              <div className="min-w-0">
                <p className="trad-hero-value">
                  Moon in {vedic.nakshatraName}{' '}
                  <Script lang="sa" className="trad-native" size="0.95em">{NAKSHATRA_DEVANAGARI[vedic.nakshatraNumber - 1]}</Script>
                </p>
                <p className="trad-hero-sub">Lunar mansion {vedic.nakshatraNumber} of 27 · {vedic.nakshatraSymbol}</p>
              </div>
            </div>
            <Facts
              rows={[
                ['Lunar day', `${vedic.tithiName} (${vedic.paksha})`],
                ['Ruling planet', vedic.nakshatraLord],
                ['Deity', vedic.nakshatraDeity],
                ['Quality', vedic.nakshatraShakti]
              ]}
            />
            <p className="trad-meaning">
              <strong>In plain words:</strong> Indian astrology divides the Moon’s monthly path into 27 “mansions”. The
              one the Moon is in today sets the tone of the day. It measures against the real stars, so positions sit
              about {vedic.lahiriAyanamshaDeg.toFixed(0)}° earlier than in Western astrology.
            </p>
          </Card>
        )}

        {/* NUMEROLOGY */}
        <Card culture="numerology">
          <div className="trad-hero">
            <span className="trad-hero-symbol" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>
              {numerology.universalDay}
            </span>
            <div className="min-w-0">
              <p className="trad-hero-value">Today is a “{numerology.universalDay}” day</p>
              <p className="trad-hero-sub">{firstClause(numerology.numberMeanings?.[numerology.universalDay])}</p>
            </div>
          </div>
          <Facts
            rows={[
              ['This year', `${numerology.universalYear}`],
              ['This month', `${numerology.universalMonth}`],
              ['Life Path', `${numerology.lifePathNumber}${numerology.lifePathIsMaster ? ' (master number)' : ''} — from the date shown`]
            ]}
          />
          <p className="trad-meaning">
            <strong>In plain words:</strong> add up the digits of a date until one digit is left. That digit is the
            day’s number. Do the same with a birth date and you get a Life Path number.
          </p>
        </Card>

        {/* EGYPTIAN */}
        <Card culture="egyptian">
          <div className="trad-hero">
            <span className="trad-hero-symbol">
              <Script lang="egy" size={30} title={season?.meaning}>{season?.sign ?? '\u{132F9}'}</Script>
            </span>
            <div className="min-w-0">
              <p className="trad-hero-value">
                {egyptian.isEpagomenal ? 'Days “upon the year”' : `${egyptian.dayOfMonth} ${egyptian.monthName}`}
              </p>
              <p className="trad-hero-sub">{egyptian.season}</p>
            </div>
          </div>
          <Facts
            rows={[
              ['Season', egyptian.season],
              ['Civil year', `${egyptian.civilYear}`],
              ['Sirius cycle', `year ${egyptian.sothicYearInCycle} of ${egyptian.sothicGreatYearCycle}`]
            ]}
          />
          <p className="trad-meaning">
            <strong>In plain words:</strong> the Egyptian year had three seasons of four months — flood, growth and
            harvest — plus five extra days. The hieroglyph shown stands for the current season.
          </p>
        </Card>

        {/* ETHIOPIAN */}
        <Card culture="ethiopian">
          <div className="trad-hero">
            <span className="trad-hero-symbol">
              <Script lang="gez" size={24}>{toGeezNumeral(ethiopian.dayOfMonth)}</Script>
            </span>
            <div className="min-w-0">
              <p className="trad-hero-value">
                {ethiopian.dayOfMonth} {ethiopian.monthName.split('(')[0].trim()}, {ethiopian.year}
              </p>
              <p className="trad-hero-sub">
                <Script lang="gez" className="trad-native">
                  {GEEZ_MONTHS[ethiopian.monthIndex - 1]} {toGeezNumeral(ethiopian.dayOfMonth)}
                </Script>
              </p>
            </div>
          </div>
          <Facts
            rows={[
              ['Year', `${ethiopian.year} (${ethiopian.offsetFromGregorianYears} years behind the Western year)`],
              ['Year of', `St ${ethiopian.evangelist}`],
              ['Month', `${ethiopian.monthIndex} of 13`]
            ]}
          />
          <p className="trad-meaning">
            <strong>In plain words:</strong> this is today’s date as it is written in Ethiopia now, in Ge’ez script.
            Each year is named after one of the four Gospel writers in turn.
          </p>
        </Card>

        {/* ATHENIAN */}
        <Card culture="greek">
          <div className="trad-hero">
            <span className="trad-hero-symbol" style={{ fontFamily: 'var(--font-display)' }}>
              {toRoman(greek.atticDay).length > 4 ? greek.atticDay : greek.atticDay}
            </span>
            <div className="min-w-0">
              <p className="trad-hero-value">
                {greek.atticDay} {greek.atticMonthName}
              </p>
              <p className="trad-hero-sub">
                <span className="trad-native" lang="el" style={{ fontFamily: 'var(--font-display)' }}>
                  {greekMonthNative(greek.atticMonthName)}
                </span>
              </p>
            </div>
          </div>
          <Facts
            rows={[
              ['Festival', greek.historicFestival],
              ['Honouring', greek.patronDeity],
              ['Olympiad', `${greek.olympiadNumber}, year ${greek.olympiadYear}`]
            ]}
          />
          <p className="trad-meaning">
            <strong>In plain words:</strong> Athenian months began at each new Moon and were named for festivals. Years
            were counted in four-year Olympiads, from the first Olympic Games.
          </p>
        </Card>

        {/* ROMAN */}
        <Card culture="roman">
          <div className="trad-hero">
            <span className="trad-hero-symbol">
              <PlanetGlyph planet={PLANET_ID[weekday.planetaryRuler] ?? 'sun'} size={30} />
            </span>
            <div className="min-w-0">
              <p className="trad-hero-value">
                {weekday.latinDies} · {weekday.gregorianName}
              </p>
              <p className="trad-hero-sub">Day of {weekday.planetaryRuler} ({weekday.romanDeity})</p>
            </div>
          </div>
          <Facts
            rows={[
              ['Day’s theme', firstClause(weekday.energy)],
              [
                'This hour',
                <>
                  <PlanetGlyph planet={PLANET_ID[hour.planet] ?? 'sun'} size={15} tinted /> {hour.planet} · {hour.formattedWindow}
                </>
              ],
              ['Hour’s theme', hour.quality],
              ['Year', toRoman(Number(ctx.input.dateString.slice(0, 4)))]
            ]}
          />
          <p className="trad-meaning">
            <strong>In plain words:</strong> our weekdays are named after seven “planets” (Sun-day, Moon-day,
            Saturn-day…). The same seven also take turns ruling the hours, starting at sunrise.
          </p>
        </Card>

        {/* SEASON CALENDAR */}
        <Card culture="hebrew">
          <div className="trad-hero">
            <span className="trad-hero-symbol">
              <Script lang="he" size={22}>{HEBREW_MONTHS[eb.enochian.monthIndex - 1] ?? ''}</Script>
            </span>
            <div className="min-w-0">
              <p className="trad-hero-value">
                Month {eb.enochian.monthIndex}, day {eb.enochian.dayOfMonth}
              </p>
              <p className="trad-hero-sub">{eb.enochian.seasonName.split('(')[0].trim()} · week {eb.enochian.weekOfYear} of 52</p>
            </div>
          </div>
          <Facts
            rows={[
              ['Season', eb.biblicalSeason.name.split('—')[0].trim()],
              ['Farming year', eb.biblicalSeason.agriculturalPhase],
              ['Sun’s gate', eb.enochian.watchGate.split('(')[0].trim()],
              ['Festival echo', eb.biblicalSeason.liturgicalEcho.split('—')[0].trim()]
            ]}
          />
          <p className="trad-meaning">
            <strong>In plain words:</strong> the Book of Enoch describes a year of exactly 364 days — 52 full weeks — so
            every date always falls on the same weekday. The Sun is pictured rising through one of four “gates”, one per
            season.
          </p>
        </Card>

        {/* DREAMSPELL */}
        <Card culture="dreamspell">
          <div className="trad-hero">
            <span className="trad-hero-symbol" style={{ color: sealColor[dreamspell.solarSeal.color] }}>
              <MayaNumeral value={dreamspell.galacticTone.number} size={34} />
            </span>
            <div className="min-w-0">
              <p className="trad-hero-value">Kin {dreamspell.kin}</p>
              <p className="trad-hero-sub">
                {dreamspell.solarSeal.name.startsWith(dreamspell.solarSeal.color) ? '' : `${dreamspell.solarSeal.color} `}
                {dreamspell.galacticTone.name} {dreamspell.solarSeal.name.replace(`${dreamspell.solarSeal.color} `, '')} · {dreamspell.solarSeal.color}
              </p>
            </div>
          </div>
          <Facts
            rows={[
              ['Symbol', `${dreamspell.solarSeal.name} — ${dreamspell.solarSeal.power}`],
              ['Number tone', `${dreamspell.galacticTone.number} · ${dreamspell.galacticTone.name} (${dreamspell.galacticTone.action})`],
              ['Colour', `${dreamspell.solarSeal.color} — ${dreamspell.colorFamily.essence}`]
            ]}
          />
          <p className="trad-meaning">
            <strong>In plain words:</strong> Dreamspell is a modern (1987) system inspired by the Maya count. It gives
            every day a colour, a symbol and a number from 1 to 13. Its day numbers differ from the traditional Maya
            count shown above — that is expected.
          </p>
        </Card>

        {/* GENE KEYS */}
        <Card culture="gene_keys" value={geneKeysSun.gate}>
          <div className="trad-hero">
            <span className="trad-hero-symbol">
              <span className="astro-glyph" style={{ fontSize: 34 }}>{hexagramChar(geneKeysSun.gate)}</span>
            </span>
            <div className="min-w-0">
              <p className="trad-hero-value">Key {geneKeysSun.gate}: {geneKeysSun.gift}</p>
              <p className="trad-hero-sub">{geneKeysSun.name}</p>
            </div>
          </div>
          <Facts
            rows={[
              ['Watch for', geneKeysSun.shadow],
              ['Practise', geneKeysSun.gift],
              ['At its best', geneKeysSun.siddhi],
              [
                'Balancing key',
                <>
                  <span className="astro-glyph trad-native">{hexagramChar(geneKeysEarth.gate)}</span> {geneKeysEarth.gate} · {geneKeysEarth.gift}
                </>
              ]
            ]}
          />
          <p className="trad-meaning">
            <strong>In plain words:</strong> the six-line figure is a hexagram from the I Ching, the ancient Chinese
            Book of Changes. Gene Keys matches the Sun’s position to one of the 64 hexagrams and gives each a habit to
            watch for and a strength to practise.
          </p>
        </Card>
      </div>
    </section>
  );
};
