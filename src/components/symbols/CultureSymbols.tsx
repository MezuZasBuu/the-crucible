/**
 * Culture symbols — each tradition shown with marks from its own writing or
 * number system, not generic icons:
 *
 *   Maya        bar-and-dot numerals (drawn as SVG)
 *   Chinese     Hanzi for stems, branches, animals and the five elements; taijitu
 *   Egyptian    hieroglyphs (ankh, star, season signs)
 *   Ethiopian   Ge'ez month names and numerals
 *   Greek       Attic month names in Greek letters
 *   Roman       Roman numerals
 *   Vedic       Devanagari (nakshatra names, Om)
 *   Hebrew      month names of the season calendar
 *   I Ching     hexagrams (used by Gene Keys gates)
 *
 * Fonts: Noto families via Fontsource (SIL Open Font License).
 */

import React from 'react';
import {
  Ear,
  Feather,
  Flame,
  Droplets,
  Hourglass,
  MoonStar,
  Sailboat,
  Scale,
  Shield,
  Sprout,
  Sunrise,
  Wheat,
  type LucideIcon
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Tradition registry                                                  */
/* ------------------------------------------------------------------ */

export type CultureId =
  | 'western'
  | 'maya'
  | 'dreamspell'
  | 'chinese'
  | 'egyptian'
  | 'ethiopian'
  | 'greek'
  | 'roman'
  | 'vedic'
  | 'hebrew'
  | 'numerology'
  | 'gene_keys'
  | 'callings'
  | 'map';

export interface CultureInfo {
  id: CultureId;
  name: string;
  /** Where and when it comes from */
  origin: string;
  /** One plain sentence: what this system is */
  plain: string;
  /** What it adds to a daily reading */
  tellsYou: string;
  color: string;
}

export const CULTURES: Record<CultureId, CultureInfo> = {
  western: {
    id: 'western',
    name: 'Western astrology',
    origin: 'Babylon → Greece → today',
    plain: 'Tracks where the Sun, Moon and planets sit against the twelve zodiac signs.',
    tellsYou: 'The general mood of the sky and how planets relate to each other right now.',
    color: '#a9812f'
  },
  maya: {
    id: 'maya',
    name: 'Maya calendar',
    origin: 'Mesoamerica, 2,000+ years old',
    plain: 'Counts days in interlocking cycles: a 260-day sacred count and a 365-day year.',
    tellsYou: 'The “day sign” and number for today — a traditional theme for the day.',
    color: '#25706a'
  },
  dreamspell: {
    id: 'dreamspell',
    name: 'Dreamspell (13 Moon)',
    origin: 'Modern, José Argüelles, 1987',
    plain: 'A modern system inspired by the Maya count, using 13 months of 28 days.',
    tellsYou: 'Today’s “kin”: a colour, a symbol and a number tone. It is not the traditional Maya count.',
    color: '#6a4a9c'
  },
  chinese: {
    id: 'chinese',
    name: 'Chinese calendar',
    origin: 'China, 2,000+ years old',
    plain: 'Names each year, month, day and hour with one of 10 “stems” and 12 animal “branches”.',
    tellsYou: 'Which of the five elements (wood, fire, earth, metal, water) is strongest today.',
    color: '#b8483a'
  },
  egyptian: {
    id: 'egyptian',
    name: 'Egyptian calendar',
    origin: 'Ancient Egypt',
    plain: 'A 365-day year of three seasons tied to the Nile: flood, growth and harvest.',
    tellsYou: 'Which season of the old farming year we are in.',
    color: '#b0771a'
  },
  ethiopian: {
    id: 'ethiopian',
    name: 'Ethiopian calendar',
    origin: 'Ethiopia, still in daily use',
    plain: 'Twelve 30-day months plus a short thirteenth month; about 7–8 years behind the Western year.',
    tellsYou: 'Today’s date as it is written in Ethiopia right now.',
    color: '#3a7646'
  },
  greek: {
    id: 'greek',
    name: 'Athenian calendar',
    origin: 'Classical Athens',
    plain: 'Months that follow the Moon, each named after a festival.',
    tellsYou: 'Which lunar month and festival season it would be in ancient Athens.',
    color: '#2c6494'
  },
  roman: {
    id: 'roman',
    name: 'Roman days & hours',
    origin: 'Rome and Babylon',
    plain: 'Each weekday and each hour is named for one of seven classical planets.',
    tellsYou: 'Which planet “rules” today and this hour — the origin of our weekday names.',
    color: '#983c52'
  },
  vedic: {
    id: 'vedic',
    name: 'Vedic astrology (Jyotish)',
    origin: 'India',
    plain: 'Uses the zodiac as measured against the actual stars, plus 27 “lunar mansions”.',
    tellsYou: 'Which lunar mansion the Moon is in and the phase of the lunar month.',
    color: '#a85a1e'
  },
  hebrew: {
    id: 'hebrew',
    name: 'Seasons & the 364-day calendar',
    origin: 'Ancient Judea (Book of Enoch)',
    plain: 'An ancient 364-day solar year of four equal seasons, each with a “gate” of the Sun.',
    tellsYou: 'Which of the four seasons and gates today falls in.',
    color: '#4650a0'
  },
  numerology: {
    id: 'numerology',
    name: 'Numerology',
    origin: 'Greek (Pythagorean) tradition',
    plain: 'Reduces dates and names to single digits, each with a traditional meaning.',
    tellsYou: 'Today’s number and, with your birth date, your Life Path number.',
    color: '#565b70'
  },
  gene_keys: {
    id: 'gene_keys',
    name: 'Gene Keys',
    origin: 'Modern, based on the I Ching',
    plain: 'Links the Sun’s position to one of the 64 I Ching hexagrams.',
    tellsYou: 'A “shadow” to watch and a “gift” to practise today.',
    color: '#6a4a9c'
  },
  callings: {
    id: 'callings',
    name: 'The Twelve Callings',
    origin: 'The Crucible’s own framework',
    plain: 'Twelve roles a person can play — leader, listener, host and so on — arranged around a compass.',
    tellsYou: 'Which role today’s cycles point to, with one small practice to try.',
    color: '#2c7458'
  },
  map: {
    id: 'map',
    name: 'Astro map',
    origin: 'Modern astrology',
    plain: 'Draws on a world map where each planet is rising, setting or overhead.',
    tellsYou: 'How the same sky reads differently depending on where you are.',
    color: '#2c6494'
  }
};

/* ------------------------------------------------------------------ */
/* Native-script vocabularies                                          */
/* ------------------------------------------------------------------ */

export const HANZI_ANIMALS: Record<string, string> = {
  Rat: '鼠', Ox: '牛', Tiger: '虎', Rabbit: '兔', Dragon: '龙', Snake: '蛇',
  Horse: '马', Goat: '羊', Monkey: '猴', Rooster: '鸡', Dog: '狗', Pig: '猪'
};

export const HANZI_ELEMENTS: Record<string, string> = { Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水' };

export const WUXING_COLOR: Record<string, string> = {
  Wood: '#3a7646', Fire: '#b8483a', Earth: '#a8842a', Metal: '#666a7e', Water: '#2c6494'
};

/** Hebrew names for the twelve months of the season calendar, Nisan-first. */
export const HEBREW_MONTHS = ['ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול', 'תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר'];

/** Ethiopian months in Ge'ez script, Meskerem-first (13 months). */
export const GEEZ_MONTHS = ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'];

/** Attic months in Greek, Hekatombaion-first. */
export const GREEK_MONTHS = [
  'Ἑκατομβαιών', 'Μεταγειτνιών', 'Βοηδρομιών', 'Πυανεψιών', 'Μαιμακτηριών', 'Ποσειδεών',
  'Γαμηλιών', 'Ἀνθεστηριών', 'Ἐλαφηβολιών', 'Μουνυχιών', 'Θαργηλιών', 'Σκιροφοριών'
];
const GREEK_MONTH_LATIN = [
  'Hekatombaion', 'Metageitnion', 'Boedromion', 'Pyanepsion', 'Maimakterion', 'Poseideon',
  'Gamelion', 'Anthesterion', 'Elaphebolion', 'Mounichion', 'Thargelion', 'Skirophorion'
];
export function greekMonthNative(latinName: string): string {
  const i = GREEK_MONTH_LATIN.findIndex((m) => latinName.toLowerCase().startsWith(m.toLowerCase()));
  return i >= 0 ? GREEK_MONTHS[i] : '';
}

/** The 27 nakshatras (lunar mansions) in Devanagari, Ashwini-first. */
export const NAKSHATRA_DEVANAGARI = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा',
  'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वभाद्रपद', 'उत्तरभाद्रपद', 'रेवती'
];

/** Egyptian season signs (illustrative hieroglyphs: water, plant, sun). */
export const EGYPT_SEASON_SIGN: Record<string, { sign: string; meaning: string }> = {
  Akhet: { sign: '\u{13217}', meaning: 'Flood season' },
  Peret: { sign: '\u{131B0}', meaning: 'Growing season' },
  Shemu: { sign: '\u{131F3}', meaning: 'Harvest season' }
};
export function egyptSeasonSign(season: string) {
  const key = Object.keys(EGYPT_SEASON_SIGN).find((k) => season.includes(k));
  return key ? EGYPT_SEASON_SIGN[key] : undefined;
}

export function toRoman(n: number): string {
  if (!Number.isFinite(n) || n <= 0 || n >= 4000) return String(n);
  const map: Array<[number, string]> = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let out = '';
  let v = Math.floor(n);
  for (const [val, sym] of map) {
    while (v >= val) {
      out += sym;
      v -= val;
    }
  }
  return out;
}

/** Ge'ez numerals for 1–99 (enough for day-of-month and month numbers). */
export function toGeezNumeral(n: number): string {
  const ones = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
  const tens = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];
  if (!Number.isFinite(n) || n < 1 || n > 99) return String(n);
  return tens[Math.floor(n / 10)] + ones[n % 10];
}

/** I Ching hexagram character for a gate number 1–64 (King Wen order). */
export function hexagramChar(gate: number): string {
  if (!Number.isFinite(gate) || gate < 1 || gate > 64) return '';
  return String.fromCodePoint(0x4dc0 + Math.round(gate) - 1) + '︎';
}

/* ------------------------------------------------------------------ */
/* Components                                                          */
/* ------------------------------------------------------------------ */

/** Text set in the right script font. */
export const Script: React.FC<{ children: React.ReactNode; size?: number | string; color?: string; className?: string; lang?: string; title?: string }> = ({
  children,
  size,
  color,
  className = '',
  lang,
  title
}) => (
  <span className={`script-text ${className}`} style={{ fontSize: size, color }} lang={lang} title={title} dir={lang === 'he' ? 'rtl' : undefined}>
    {children}
  </span>
);

/**
 * Maya bar-and-dot numeral for 0–19: a dot is 1, a bar is 5, a shell is 0.
 * Stacked the traditional way — dots above bars.
 */
export const MayaNumeral: React.FC<{ value: number; size?: number; color?: string; className?: string; title?: string }> = ({
  value,
  size = 28,
  color = 'currentColor',
  className = '',
  title
}) => {
  const v = Math.max(0, Math.min(19, Math.round(value)));
  const bars = Math.floor(v / 5);
  const dots = v % 5;
  const rows = bars + (dots > 0 ? 1 : 0);
  const rowH = 7;
  const totalH = Math.max(rows, 1) * rowH;
  const top = (32 - totalH) / 2;
  const label = title ?? `Maya numeral ${v}`;

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} role="img" aria-label={label}>
      <title>{label}</title>
      {v === 0 ? (
        <g fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 16c0-5 5-8 11-8s11 3 11 8-5 8-11 8-11-3-11-8z" />
          <path d="M9 16c2-3 4-4 7-4s5 1 7 4M12 20l1.5-4M16 21v-5M20 20l-1.5-4" />
        </g>
      ) : (
        <g fill={color}>
          {dots > 0 &&
            Array.from({ length: dots }, (_, i) => {
              const gap = 6.2;
              const startX = 16 - ((dots - 1) * gap) / 2;
              return <circle key={i} cx={startX + i * gap} cy={top + rowH / 2} r="2.3" />;
            })}
          {Array.from({ length: bars }, (_, i) => {
            const row = (dots > 0 ? 1 : 0) + i;
            return <rect key={i} x="4" y={top + row * rowH + 1.4} width="24" height="4.2" rx="2.1" />;
          })}
        </g>
      )}
    </svg>
  );
};

/** A Maya Long Count (e.g. 13.0.14.1.7) as a column of bar-and-dot numerals. */
export const MayaLongCount: React.FC<{ digits: number[]; size?: number; color?: string }> = ({ digits, size = 26, color }) => (
  <span className="inline-flex items-center gap-1" aria-label={`Long Count ${digits.join('.')}`}>
    {digits.map((d, i) => (
      <span key={i} className="maya-numeral-cell">
        <MayaNumeral value={d} size={size} color={color} />
      </span>
    ))}
  </span>
);

/** Taijitu (yin–yang), drawn to the standard construction. */
const Taijitu: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <circle cx="24" cy="24" r="13" fill="#fffdf8" stroke={color} strokeWidth="1.5" />
    <path d="M24 11a13 13 0 0 1 0 26a6.5 6.5 0 0 1 0-13a6.5 6.5 0 0 0 0-13z" fill={color} />
    <circle cx="24" cy="17.5" r="1.9" fill={color} />
    <circle cx="24" cy="30.5" r="1.9" fill="#fffdf8" />
  </g>
);

/** Eight-point compass star for the Twelve Callings. */
const CompassStar: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <path d="M24 9l3.2 11.8L39 24l-11.8 3.2L24 39l-3.2-11.8L9 24l11.8-3.2z" fill={color} />
    <path d="M14.5 14.5l6.3 4.2M33.5 14.5l-6.3 4.2M33.5 33.5l-6.3-4.2M14.5 33.5l6.3-4.2" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
    <circle cx="24" cy="24" r="2.4" fill="#fffdf8" />
  </g>
);

/** Spiral for Dreamspell (a modern system — deliberately not a Maya glyph). */
const Spiral: React.FC<{ color: string }> = ({ color }) => (
  <path
    d="M24 24m0-2a2 2 0 1 1-2 2a5 5 0 1 1 5 5a8 8 0 1 1-8-8a11 11 0 1 1 11 11"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
  />
);

/** Sun rising through a gate — the four season-gates of the 364-day calendar. */
const SunGate: React.FC<{ color: string }> = ({ color }) => (
  <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 37V20a12 12 0 0 1 24 0v17" />
    <path d="M9 37h30" />
    <circle cx="24" cy="27" r="4.2" fill={color} stroke="none" />
    <path d="M24 18.5v-2.5M16.8 27h-2M33.2 27h-2M18.6 21.6l-1.5-1.5M29.4 21.6l1.5-1.5" strokeWidth="1.6" />
  </g>
);

/** Meridian globe for the astro map. */
const Globe: React.FC<{ color: string }> = ({ color }) => (
  <g fill="none" stroke={color} strokeWidth="1.7">
    <circle cx="24" cy="24" r="13" />
    <ellipse cx="24" cy="24" rx="5.5" ry="13" />
    <path d="M11 24h26M13.5 16.5h21M13.5 31.5h21" />
  </g>
);

const EMBLEM_TEXT: Partial<Record<CultureId, { text: string; lang?: string; scale?: number; dy?: number }>> = {
  western: { text: '☉︎', scale: 1.05 },
  egyptian: { text: '\u{132F9}', lang: 'egy', scale: 0.95, dy: 0.5 },
  ethiopian: { text: 'ግ', lang: 'gez', scale: 0.9 },
  greek: { text: 'Ω', lang: 'el', scale: 0.95 },
  roman: { text: 'XII', scale: 0.52 },
  vedic: { text: 'ॐ', lang: 'sa', scale: 0.82 },
  numerology: { text: '9', scale: 0.9 },
  gene_keys: { text: '䷀︎', scale: 0.95 }
};

/**
 * Round medallion carrying each tradition's own mark.
 * `value` customises it where that makes sense (Maya number, I Ching gate).
 */
export const CultureEmblem: React.FC<{ culture: CultureId; size?: number; value?: number; className?: string; onInk?: boolean }> = ({
  culture,
  size = 44,
  value,
  className = '',
  onInk = false
}) => {
  const info = CULTURES[culture];
  const color = onInk ? '#e9d49c' : info.color;
  const paper = onInk ? 'rgba(255,255,255,0.06)' : '#fffdf8';
  const t = EMBLEM_TEXT[culture];
  const text = culture === 'gene_keys' && value ? hexagramChar(value) : t?.text;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`culture-emblem ${className}`} role="img" aria-label={info.name}>
      <title>{info.name}</title>
      <circle cx="24" cy="24" r="22.5" fill={paper} stroke={color} strokeWidth="1.2" />
      <circle cx="24" cy="24" r="19.2" fill="none" stroke={color} strokeWidth="0.6" strokeDasharray="1 2.6" opacity="0.7" />
      {culture === 'maya' && (
        <g transform="translate(8 8)" color={color}>
          <MayaNumeral value={value ?? 13} size={32} color={color} />
        </g>
      )}
      {culture === 'chinese' && <Taijitu color={color} />}
      {culture === 'callings' && <CompassStar color={color} />}
      {culture === 'dreamspell' && <Spiral color={color} />}
      {culture === 'hebrew' && <SunGate color={color} />}
      {culture === 'map' && <Globe color={color} />}
      {text && (
        <text
          x="24"
          y={24 + (t?.dy ?? 0)}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          fontSize={26 * (t?.scale ?? 1)}
          fontWeight={culture === 'roman' || culture === 'numerology' ? 600 : 400}
          style={{ fontFamily: culture === 'roman' || culture === 'numerology' || culture === 'greek' ? 'var(--font-display)' : 'var(--font-glyph), var(--font-script)' }}
          lang={t?.lang}
        >
          {text}
        </text>
      )}
    </svg>
  );
};

/** Emblem + name + origin, with the plain-language explanation underneath. */
export const CultureHeader: React.FC<{ culture: CultureId; value?: number; title?: string; explain?: boolean; right?: React.ReactNode }> = ({
  culture,
  value,
  title,
  explain = true,
  right
}) => {
  const info = CULTURES[culture];
  return (
    <div className="culture-header">
      <CultureEmblem culture={culture} value={value} size={46} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline flex-wrap gap-x-2">
          <h3 className="culture-title">{title ?? info.name}</h3>
          <span className="culture-origin">{info.origin}</span>
        </div>
        {explain && <p className="culture-plain">{info.plain}</p>}
      </div>
      {right}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Twelve Callings emblems                                             */
/* ------------------------------------------------------------------ */

const CALLING_ICONS: Record<string, LucideIcon> = {
  sunrise: Sunrise,
  stars: MoonStar,
  ship: Sailboat,
  water: Droplets,
  ear: Ear,
  shield: Shield,
  sprout: Sprout,
  hourglass: Hourglass,
  flame: Flame,
  scales: Scale,
  grain: Wheat,
  feather: Feather
};

export const QUARTER_COLOR: Record<string, string> = {
  East: '#b0771a',
  South: '#b8483a',
  West: '#6a4a9c',
  North: '#2c6494'
};

export const CallingEmblem: React.FC<{ emblemId: string; size?: number; color?: string; className?: string; strokeWidth?: number }> = ({
  emblemId,
  size = 22,
  color,
  className,
  strokeWidth = 1.6
}) => {
  const Icon = CALLING_ICONS[emblemId] ?? Sunrise;
  return <Icon width={size} height={size} color={color} className={className} strokeWidth={strokeWidth} aria-hidden />;
};
