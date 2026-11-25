# The Crucible

One day, read through the world's calendars. The Crucible works out what Western astrology, the Maya and
Chinese calendars, Vedic astrology, numerology and several historical calendars each say about a date, shows
them side by side in their own symbols, and writes a short reading in everyday language.

## What's in the app

| Section | What it does |
|---|---|
| **Today** | The reading for the chosen day: an at-a-glance strip, then mood, people, work, money, travel. |
| **My chart** | Enter a birth date, time and place to get a standard birth chart and see how today compares. |
| **Next 14 days** | A day-by-day outlook with a match score for each day. |
| **Traditions** | Every calendar in detail, the Twelve Callings compass, a world map, a full report, and a question box. |

Press **How it works** in the header for an in-app guide to every tradition and symbol.

## Run locally

Prerequisite: Node.js 20+.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000. Everything works without any keys. Optional keys (see `.env.example`):

- `GEMINI_API_KEY` — AI-written daily readings and the question box
- `VITE_FIREBASE_*` — sign-in (see `docs/FIREBASE_SETUP.md`)
- `VITE_GOOGLE_MAPS_API_KEY` — satellite map layer

Other scripts:

```bash
npm run lint
```

```bash
npm run test:modules
```

```bash
npm run build
```

## Open-source building blocks

All installed from npm and bundled by Vite; nothing is loaded from a third-party CDN at runtime.

| Package | Licence | Used for |
|---|---|---|
| [`astronomy-engine`](https://github.com/cosinekitty/astronomy) | MIT | Sun, Moon and planet positions (geocentric, tropical) |
| [`tz-lookup`](https://github.com/darkskyapp/tz-lookup-oss) | CC0 | Time zone of a birth place, so local birth times convert to UTC correctly |
| Fontsource: Inter, Fraunces, Cinzel, JetBrains Mono | OFL | Interface type |
| Fontsource: Noto Sans Symbols / Symbols 2 | OFL | Zodiac, planet and aspect glyphs; I Ching hexagrams |
| Fontsource: Noto Serif SC, Devanagari, Hebrew, Ethiopic; Noto Sans Egyptian Hieroglyphs | OFL | Each tradition's own script |
| `lucide-react` | ISC | Interface icons and the Twelve Callings emblems |

## Accuracy notes

- Planet positions are accurate to arc-minutes for 1900–2100. Chiron uses a simple orbit model (about 1°).
  The lunar node is the mean node.
- Houses are Placidus by default, with Whole Sign as an option and as the automatic fallback above 66° latitude.
- The astronomy and calendar arithmetic are calculated; what a position *means* comes from each tradition and
  is offered for reflection, not as prediction or advice.
- **The Twelve Callings** is the app's own framework (twelve roles around a compass). It is not a historical
  tradition.

## Project layout

```
src/engine/        calculations: ephemeris, calendars, chart geometry, synthesis
src/components/    screens and panels
  chart/           chart wheel and chart tables
  symbols/         zodiac glyphs and culture symbols (numerals, scripts, emblems)
  shell/           brand mark, guide
src/styles/        refine.css — visual layer on top of index.css tokens
functions/         Cloudflare Pages API routes
server.ts          Express dev/production server
```

More detail: `HOW_THIS_WORKS.md`.
