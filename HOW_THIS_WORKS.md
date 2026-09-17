# How The Crucible Works — Complete Architecture & Implementation Reference

This is the canonical human-readable map of **The Crucible**: purpose, philosophy, stack, data contracts, calculation pipeline, every engine module, UI wiring, APIs, free external services, epistemic honesty, reports, tests, defaults, limits, and glossary.

**Companion docs**

| File | Role |
|------|------|
| `HOW_THIS_WORKS.md` (this file) | Architecture, engines, implementations, data flow |
| `UI_UX.md` | Visual design system for Figma / Framer revamp |
| `README.md` | Quick start (if present) |
| `metadata.json` | Product metadata |

Update this file whenever engines, contracts, routes, or shell IA change.

---

## 1. One-sentence purpose

The Crucible takes a **date, time, and place**, converts them into a shared **Julian Day**, then runs many independent tradition engines and **weaves** their results into one living context—so calendars, planets, numbers, scripture seasons, Vedic lunar markers, and tribal archetypes speak to each other instead of sitting in separate silos.

---

## 2. Design philosophy

### 2.1 Gridlock (determinism)

Same input → same calendrical / astronomical / synthesis results (aside from wall-clock latency stamps and optional live streaming of “now”).

- Core math does **not** call the internet.
- Gemini, Google Maps, and Nominatim are **optional enrichment** layers.
- Integrity fingerprint: `rulesetHash` + `calculationId`.

### 2.2 Triangulation (not averaging)

When Maya, Chinese, Enochian, Roman dies, and other layers disagree, The Crucible does **not** collapse them into one bland answer. It:

1. Shows each system’s own reading  
2. Attaches a **cross-note** (why present · life · day · month · birth · name)  
3. Surfaces **agreements**, **tensions**, and **dialectical forks** (Path A / Path B / synthesis)  
4. Uses the **Twelve Tribes camp** as a human-vocation layer (direction, season, gift, name)

### 2.3 Epistemic honesty

Every speculative or interpretive layer should be labeled. Eight classes (`EpistemicClass`) must not be collapsed:

| Class | Short | Typical use |
|-------|-------|-------------|
| `HISTORICAL_FACT` | FACT | Calibrated calendrical milestones |
| `TEXTUAL_TRADITION` | TEXT | Scripture / Enoch / traditional claims |
| `SCHOLARLY_INTERPRETATION` | SCHOLAR | Academic framing |
| `COMPARATIVE_ANALOGY` | ANALOGY | Dialectical forks, cross-system analogies |
| `SYSTEM_INTERPRETATION` | SYSTEM | Tradition-specific reading (e.g. Vedic profile) |
| `SPECULATIVE_SYNTHESIS` | SPECULATIVE | Gaia overcast (not live magnetometers) |
| `EMPIRICAL_EVIDENCE` | EMPIRICAL | Observational claims when present |
| `COMPUTED_GEOMETRY` | COMPUTED | Lunar illumination, JD, ecliptic math |

UI: `EpistemicBadge`. Labels: `src/engine/epistemic.ts`.

### 2.4 Information flow (one-way)

```
RAW INPUT (date / time / place / optional name / methodology)
    → NORMALIZATION (TemporalCoordinate / Julian Day)
    → DETERMINISTIC TRADITION ENGINES
    → OPTIONAL VEDIC (methodology flag)
    → SYNTHESIS + TWELVE TRIBES SCORING
    → CROSS-SYSTEM INTERTWINING (notes, threads, life connotations)
    → OPTIONAL GAIA OVERCAST + DIALECTICAL FORKS (methodology flag)
    → HASH / AUDIT FIELDS
    → UI PANELS / REPORTS / EXPORT
    → OPTIONAL LLM (Compass / research / monograph) grounded on context
```

The LLM never invents calendar numbers. It narrates what the engines already computed.

---

## 3. Tech stack & how to run

| Layer | Stack |
|-------|--------|
| UI | React 19, Vite 6, Tailwind CSS 4, Lucide icons, Motion |
| Maps | Free: OSM embed + vector SVG · Optional: `@vis.gl/react-google-maps` |
| Geocode | Free: OSM Nominatim · Offline: sanctuary presets |
| Server | Express + Vite middleware (`server.ts`, port **3000**) |
| LLM | `@google/genai` when `GEMINI_API_KEY` is set |

```bash
npm install
# Optional in .env.local:
#   GEMINI_API_KEY=...
#   VITE_GOOGLE_MAPS_API_KEY=...
npm run dev          # tsx server.ts → http://localhost:3000
npm run lint         # tsc --noEmit
npm run test:modules # 5× module suite with auto-retest
npm run build        # vite build + esbuild server bundle
npm start            # node dist/server.cjs
```

**Primary calculation path (what the UI uses):**  
`executeCrucibleCalculation` in `src/engine/crucibleCore.ts`, invoked client-side via `useMemo` in `src/App.tsx`.

**Parallel server path:** `POST /api/calculate` runs the same engine for API consumers.

---

## 4. Application shell & UX wiring

### 4.1 Layout skeleton (`src/App.tsx`)

```
┌──────────────────────────────────────────────────────────────┐
│ SecureDashboardHeader (sticky)                               │
│  Brand ◆ | Telemetry | Tabs | Today's Report / Diags / Export│
├──────────────────────────────────────────────────────────────┤
│ TemporalControlBar                                           │
│  stream · date/time · UTC · place/Nominatim · epochs · corr. │
├──────────────────────────────────────────────────────────────┤
│ MAIN VIEW (one of:)                                          │
│  GRID | ENOCHIAN | 14-DAY | REPORT | GEARS | MAP | COMPASS   │
├──────────────────────────────────────────────────────────────┤
│ Footer: calculationId · latency ms · rulesetHash             │
└──────────────────────────────────────────────────────────────┘
+ Modals: DailyEnergyReportModal · ReportExportModal · Diagnostics
```

Default location: **Jerusalem Sanctuary** (`31.778°N, 35.2354°E`).  
Default querent name: `Sovereign Querent`.  
Default methodology flags: `includeVedic: true`, `includeGaiaOverlay: true`.  
Default Maya correlation: `GMT_584283`.

### 4.2 Views (`CrucibleView`)

| View ID | UI | Content |
|---------|-----|---------|
| `GRID` | Master Grid | Gaia teaser → Gears → Ephemeris → Dreamspell → Calendar grid → Archetypal Matrix |
| `ENOCHIAN` | Enochian panel | A/B peek, verses, Roman dies, hours, map-flip handoff |
| `LONG_TERM_RESONANCE` | 14-Day panel | Forward multi-engine forecast; can push date into App |
| `REPORT` | Total Systems | Natal/name, gematria, Gaia, forks, ledger, JSON/JSONL |
| `GEARS` | Gear of Gears | Dedicated interlocking visualizer + copy |
| `ASTROCARTOGRAPHY` | World matrix | OSM / Vector / Google; lines; Enoch Flip |
| `COMPASS` | LLM Compass | Grounded Q&A → `/api/compass` |

### 4.3 Master Grid vertical order (intentional)

1. Gaia / forks teaser (atmosphere + SPECULATIVE honesty)  
2. Gears (feel cycles)  
3. Ephemeris (sky facts)  
4. Dreamspell (practice language)  
5. Calendar Comparison + cross-notes  
6. Archetypal Matrix / Twelve Tribes (vocation hub)

### 4.4 How state drives calculation

```
temporalInput + correlationKey
        │
        ▼
useMemo → executeCrucibleCalculation(temporalInput, correlationKey)
        │
        ▼
calculationContext  →  all panels / modals / footer
```

- **Streaming:** 1s interval overwrites date/time when streaming is on.  
- **Map probe / sanctuary / Nominatim:** updates `temporalInput.location`.  
- **14-Day day chip:** updates `dateString`.  
- **Enochian Map Flip:** sets flip flag and may navigate to Astrocartography.

---

## 5. Core data contracts (`src/types.ts`)

### 5.1 `TemporalInput`

| Field | Meaning |
|-------|---------|
| `dateString` | `YYYY-MM-DD` |
| `timeString` | `HH:MM:SS` |
| `timezoneOffsetMinutes` | JS-style offset |
| `isUTC` | Interpret as UT when true |
| `location` | `latitude`, `longitude`, optional city/country/elevation |
| `methodology?` | Partial `MethodologyBundle` overrides |
| `querentName?` | Name for numerology / reports |

### 5.2 `TemporalCoordinate` (normalized)

Julian Day UT/TT, ΔT, GMST/LST, Gregorian leap, Julian calendar Y/M/D, weekday, day-of-year, ISO string, etc.

**Everything hangs off Julian Day.** That is the shared spine.

### 5.3 `MethodologyBundle`

| Field | Default (`DEFAULT_METHODOLOGY`) |
|-------|----------------------------------|
| `calendarCorrelation` | `GMT_584283` |
| `ayanamsha` | `lahiri` |
| `ephemerisModel` | `crucible_mean_motion_v1` |
| `houseSystem` | `none` |
| `chineseDayBoundary` | `solar_terms` |
| `zodiac` | `tropical_primary` |
| `includeVedic` | `true` |
| `includeGaiaOverlay` | `true` |
| `epistemicStrictMode` | `false` |
| `version` | `1.0.0` |

Merged via `mergeMethodology()` in `epistemic.ts`.

### 5.4 `CompleteCalculationContext`

| Group | Fields |
|-------|--------|
| Audit | `calculationId`, `timestamp`, `executionDurationMs`, `eventTimeIso`, `calculationTimeIso`, `rulesetHash` |
| Echo | `input` |
| Calendars | `temporal`, `mayan`, `dreamspell`, `chinese`, `egyptian`, `ethiopian`, `greek`, `enochianBiblical`, `numerology` |
| Sky / geo | `celestialBodies`, `astrocartographyLines`, `geneKeysSun`, `geneKeysEarth` |
| Weave | `synthesis`, `intertwining`, `methodology` |
| Optional | `vedic?`, `gaiaOvercast?`, `dialecticalForks?` |

### 5.5 `CrossSystemIntertwining`

| Field | Meaning |
|-------|---------|
| `systemNotes[]` | Per-tradition cross-notes |
| `twelveTribesEnriched[]` | Tribes + life connotations |
| `primaryTribeLife` | Top tribe manifesto + practices |
| `triangulationNarrative` | Full dossier text |
| `intertwiningThreads[]` | Direction, Season, Vocation/Name/Gift, Element |

---

## 6. Calculation pipeline (exact order)

Function: **`executeCrucibleCalculation(input, correlationKey = 'GMT_584283')`**  
File: `src/engine/crucibleCore.ts`

| # | Step | Function / module | Produces |
|---|------|-------------------|----------|
| 1 | Stamp | `new Date().toISOString()`, timer start | `calculationTimeIso` |
| 2 | Methodology | `mergeMethodology({...input.methodology, calendarCorrelation})` | `methodology` |
| 3 | Normalize | `normalizeTemporal(input)` | `temporal` |
| 4 | Maya | `calculateMayan(temporal, methodology.calendarCorrelation)` | `mayan` |
| 5 | Dreamspell | `calculateDreamspell(temporal)` | `dreamspell` |
| 6 | Chinese | `calculateChinese(temporal)` | `chinese` |
| 7 | Historical | `calculateEgyptian` / `Ethiopian` / `Greek` | `egyptian`, `ethiopian`, `greek` |
| 8 | Enochian layer | `calculateEnochianBiblical(temporal, input)` | `enochianBiblical` |
| 9 | Numerology | `calculateNumerology(temporal, querentName \|\| 'THE CRUCIBLE')` | `numerology` |
| 10 | Ephemeris | `calculateEphemeris(temporal)` | `celestialBodies` |
| 11 | Astrocartography | `calculateAstrocartography(temporal, celestialBodies)` | `astrocartographyLines` |
| 12 | Gene Keys | `getGeneKeyFromLongitude` on Sun & anti-solar Earth | `geneKeysSun`, `geneKeysEarth` |
| 13 | Vedic (opt) | `calculateVedicDetails(moon, sun, JD)` if `includeVedic` | `vedic` |
| 14 | Synthesis | `calculateSynthesis(temporal, mayan, chinese, numerology)` | `synthesis` |
| 15 | Intertwining | `buildCrossSystemIntertwining(...)` | `intertwining`; enriches tribes + `recommendedFocus` |
| 16 | Gaia (opt) | `calculateGaiaOvercast` + `buildDialecticalForks` + `toSharedDialecticalForks` if `includeGaiaOverlay` | `gaiaOvercast`, `dialecticalForks` |
| 17 | Audit | hash canonical string | `rulesetHash`, `calculationId`, `executionDurationMs` |

**Canonical hash string (simplified):**  
`JD | methodology.version | Long Count | Dreamspell signature | Year pillar | Life Path | Enochian date | Top tribe | Vedic nakshatra`

`calculationId` form: `CRUCIBLE-{HASH}-{floor(JD)}`.

---

## 7. Engine module map (`src/engine/`)

| File | Responsibility |
|------|----------------|
| `crucibleCore.ts` | Master orchestrator |
| `temporal.ts` | JD (Meeus), sidereal time, normalize, hash |
| `mayan.ts` | Long Count, Tzolkʼin, Haabʼ, Calendar Round, correlations |
| `dreamspell.ts` | 13:20 Kin, seals, tones, wavespell, oracle, Thirteen Moon |
| `chinese.ts` | Gan-Zhi pillars, Jieqi, Wu Xing |
| `historicalCalendars.ts` | Egyptian civil, Ethiopian Geʼez, Greek Attic/Metonic |
| `enochianBiblical.ts` | 364-day year, tekufot+verses, Roman dies, hours, compass flip |
| `numerology.ts` | Life Path, Universal Day/Month/Year, Chaldean vibration |
| `ephemeris.ts` | Mean-motion tropical bodies, aspects helpers |
| `astrocartography.ts` | MC/IC/ASC/DSC lines, `SANCTUARY_NODES` |
| `synthesis.ts` | Harmonic index, Twelve Tribes scoring, Gene Keys gates |
| `crossSystemBridge.ts` | Cross-notes, tribe life connotations, intertwining threads |
| `sharedCelestial.ts` | Shared lunar illumination / phase / aspect metrics |
| `gaiaOvercastForks.ts` | Speculative Gaia overlay + dialectical forks + total systems report builder |
| `longTermResonance.ts` | Vedic details, `PRESET_LOCATIONS`, 14-day forecast |
| `dailyEnergyReport.ts` | Daily energy monograph from context |
| `gematriaEtymology.ts` | Multi-cipher gematria + etymology + fused name numbers |
| `epistemic.ts` | Labels, methodology defaults, register prompt hints |
| `knowledgeBase.ts` | `CANONICAL_CLAIMS`, `CANONICAL_RULESETS`, JSONL helpers |
| `export.ts` | CSV report, download, print |
| `freeGeocode.ts` | Nominatim + `FREE_SANCTUARY_PRESETS` |
| `microTests.ts` | Verification suite |

---

## 8. Every system — function & why it exists

### 8.1 Temporal kernel (`temporal.ts`)

**What:** Civil → UT → JD UT/TT, ΔT, GMST/LST, Julian calendar conversion.  
**Why:** Without a shared instant, intertwining is fiction.  
**Links:** Feeds every engine; footer hash; streaming clock.

### 8.2 Classical Maya (`mayan.ts`)

**What:** Long Count, Tzolkʼin (260), Haabʼ (365), Calendar Round, GAP days.  
**Correlations:**

| Key | JDN constant |
|-----|--------------|
| `GMT_584283` | 584283 (canonical default) |
| `GMT_584285` | 584285 (astronomical variant) |
| `SPINDEN_489384` | 489384 |

**Why:** Sacred day-*quality* independent of marketplace Gregorian.  
**Triangulates with:** Dreamspell, Tribes (camp direction), Chinese element, Enochian remap.

### 8.3 Dreamspell (`dreamspell.ts`)

**What:** Kin, seal, tone, wavespell, Fifth Force oracle, Thirteen Moon, plasmas.  
**Why:** Modern practice language for *how to act* the day.  
**Triangulates with:** Maya, Gene Keys gift, Tribes.

### 8.4 Chinese BaZi (`chinese.ts`)

**What:** Year/month/day/hour pillars, solar terms (Jieqi), Wu Xing counts.  
**Why:** Elemental weather and work-style timing.  
**Triangulates with:** Egyptian season, biblical tekufah, Maya element, Tribes.

### 8.5 Egyptian Sothic (`historicalCalendars.ts`)

**What:** 365-day civil year, Akhet/Peret/Shemu, Epagomenae, Sothic cycle index.  
**Why:** Imperial solar harvest metronome.  
**Triangulates with:** Chinese jieqi, biblical seasons.

### 8.6 Ethiopian Geʼez

**What:** 13 months, Amete Mihret, evangelist cycle.  
**Why:** Highland Christian memory; bridge to Enoch preservation.  
**Triangulates with:** Enochian watches, Tribes / Jerusalem default.

### 8.7 Greek Attic / Metonic

**What:** Attic month, patron deity, festival, Metonic year, Olympiad.  
**Why:** Lunisolar festival consciousness beside solar civil clocks.  
**Triangulates with:** Roman dies deities, Tribes mythic roles.

### 8.8 Enochian · Biblical · Roman (`enochianBiblical.ts`)

**What:**

- 364-day Enochian year + watch gates  
- Biblical tekufot with verse anchors (e.g. Gen 8:22, Ex 12:2, Prov 10:5, Lev 23:39, John 10:22)  
- Gregorian & Julian **Dies** (Sol…Saturnus) + energies  
- Chaldean planetary hours + half-hour phases  
- Compass flip (N↔S, E↔W; map mirror via UI)

**Why:** Covenant season + Watcher direction + diurnal temperament in one layer.  
**A/B peek:** Civil north-up vs Enochian/Biblical frame.  
**Triangulates with:** Tribes camp remap, Chinese/Egyptian seasons, Maya direction.

### 8.9 Numerology (`numerology.ts`)

**What:** Life Path, Universal Day/Month/Year, Chaldean vibration, meanings.  
**Why:** Bridge from civil date (+ name) to vocation scoring.  
**Name:** Core defaults to `"THE CRUCIBLE"` if unset; App defaults to `Sovereign Querent`; Systems Report / gematria deepen name work.  
**Triangulates with:** Tribes, Maya, Gene Keys.

### 8.10 Ephemeris & Astrocartography

**What:** Tropical longitudes (mean-motion model), aspects helpers; MC/IC/ASC/DSC lines; sanctuary nodes (Giza, Jerusalem, Chichen Itza, Lalibela, etc.).  
**Why:** Sky *what* + Earth *where*.  
**Enoch Flip:** Applies Watcher orientation to the map (`AstrocartographyMap`).  
**Triangulates with:** Gene Keys (from longitude), tribal zodiac, Enochian remap.

### 8.11 Gene Keys (`synthesis.ts`)

**What:** Ecliptic → 64 gates; Sun & Earth (anti-solar); shadow → gift → siddhi.  
**Why:** Psychological practice continuum for the sky’s teaching.  
**Note:** Full Human Design stack is **not** implemented—gate mapping only.  
**Triangulates with:** Dreamspell power, tribal gift-to-embody, name themes.

### 8.12 Vedic (`longTermResonance.ts` → core)

**What:** Lahiri ayanamsha, nakshatra (+ pada, lord, deity, shakti, symbol), tithi, yoga, karana, sidereal sun/moon degrees.  
**Why:** Sidereal lunar day-quality beside tropical ephemeris.  
**Epistemic:** typically `SYSTEM_INTERPRETATION`.  
**Toggle:** `methodology.includeVedic`.

### 8.13 Twelve Tribes (`synthesis.ts` + `crossSystemBridge.ts`)

**What:** Numbers 2–style camp:

- **East:** Judah, Issachar, Zebulun  
- **South:** Reuben, Simeon, Gad  
- **West:** Ephraim, Manasseh, Benjamin  
- **North:** Dan, Asher, Naphtali  

Each carries gem, banner, zodiac correspondence, archetype role, and **life connotations** (life represents, day practice, shadow, gift).

**Why beside every system:** Calendars answer **when**. Planets answer **what**. Numbers answer **vibration**. Tribes answer **who you are being asked to be** in the living day—via direction, element/zodiac, and Life Path.

**Scoring (simplified):**

- +25 if camp direction matches Maya day direction  
- +20 if zodiac elemental language matches Chinese dominant element  
- +15 if tribe index aligns with Life Path / Universal Day  
- Then enriched with life connotations + day/month/birth/name connection strings  

**UI:** Archetypal Matrix banner + clickable tribes; cross-notes throughout Calendar grid.

### 8.14 Gaia overcast & dialectical forks (`gaiaOvercastForks.ts`)

**What:** Literary “overcast” using shared lunar metrics + aspect tension proxies + Schumann base ~7.83 Hz wobble; **not** live NOAA/Kp feeds.  
**Epistemic:** `SPECULATIVE_SYNTHESIS`.  
**Forks (examples):** Expansion vs containment; structure vs transmutation; civil duty vs lunar gnosis; civil vs Enochian flip.  
**Epistemic on forks:** `COMPARATIVE_ANALOGY`.  
**Toggle:** `methodology.includeGaiaOverlay`.

---

## 9. How systems intertwine

### 9.1 Four intertwining threads

| Thread | Typical nodes | Meaning |
|--------|---------------|---------|
| **Cardinal Direction** | Maya → Tribe camp → Enochian remap → Map flip | Shared spatial grammar |
| **Seasonal Covenant** | Chinese jieqi → Egyptian season → Biblical tekufah → verse | Multiple season clocks, one solar sky |
| **Vocation · Name · Gift** | Tribe → Life Path → Gene Key gift → Dreamspell power → Roman deity | Who + how to practice |
| **Elemental Weather** | Chinese Wu Xing → Maya element → composite → tribal zodiac | Agreement raises confidence; tension → fork |

### 9.2 Day / month / birth / name matrix

| Axis | Question |
|------|----------|
| **Day** | What does *today’s* computation say in this tradition? |
| **Month** | What longer seasonal/month container am I inside? |
| **Birth chart** | How would natal data contrast with this transit? (deepened when birth locked in Systems Report) |
| **Name** | How do Life Path / gematria / tribal scoring hear vocation? |

UI component: `SystemCrossNoteCard` (+ `IntertwiningOverview` on Archetypal Matrix).

---

## 10. UI component map (`src/components/`)

| Component | Role |
|-----------|------|
| `SecureDashboardHeader` | Brand, telemetry, tabs, CTA openers |
| `TemporalControlBar` | Stream, date/time, UTC, place/Nominatim, epochs, correlation, latency/hash |
| `GearsVisualizer` | Interlocking chronometric gears |
| `PlanetaryEphemerisWidget` | Zodiac wheel, bodies, aspects |
| `DreamspellSynchronometerPanel` | Dreamspell / 13-Moon / oracle |
| `CalendarComparisonGrid` | Side-by-side calendars + cross-notes |
| `ArchetypalMatrixPanel` | Tribes matrix + intertwining hub |
| `SystemCrossNoteCard` | Expandable cross-note atom |
| `EpistemicBadge` | Epistemic class chip |
| `EnochianBiblicalPanel` | Enochian / biblical / Roman deep dive |
| `AstrocartographyMap` | OSM / Vector / Google + lines + flip |
| `GoogleMapCameraController` | 3D camera / fly-to |
| `GoogleMapPolyline` | Geodesic polylines |
| `TotalSystemsReportPanel` | Measurement dossier + research synthesize |
| `LongTermResonancePanel` | 14-day forecast UI |
| `ConversationalCompass` | Chat → `/api/compass` |
| `DailyEnergyReportModal` | Daily report + optional expand |
| `ReportExportModal` | CSV / JSON / print / KB dumps |
| `DiagnosticMicroTestsModal` | Runs `runMicroTests()` |
| `symbols/CrucibleGlyphs` | SVG Maya / Chinese / tribe glyphs |

Visual tokens, fonts, and Framer checklist: see **`UI_UX.md`**.

---

## 11. Free & optional external services

| Concern | Implementation | Key? |
|---------|----------------|------|
| Geocode | `geocodeNominatim` → OpenStreetMap Nominatim | No |
| Offline places | `FREE_SANCTUARY_PRESETS` (Jerusalem, Giza, Chichen Itza, Stonehenge, Varanasi, Lhasa, Machu Picchu, Delphi) | No |
| Map basemap | OSM embed iframe (`mapProvider: 'osm'`) | No |
| Map lines without Google | Vector SVG canvas (`mapProvider: 'vector'`) | No |
| Google Maps | `@vis.gl/react-google-maps` when `VITE_GOOGLE_MAPS_API_KEY` or user key | Optional |
| LLM Compass / research / monograph | Gemini via `GEMINI_API_KEY` | Optional |
| LLM offline | Deterministic dossier assembled from context + KB | — |

**Fallback ladders**

- Maps: OSM → Vector → Google (if key)  
- LLM: Gemini → offline grounded text  

Gaia does **not** call live magnetometer APIs.

---

## 12. Server API (`server.ts`)

Listen: `0.0.0.0:3000`. Health reports service version `2.0.0`.

| Method | Path | Behavior |
|--------|------|----------|
| `GET` | `/api/health` | Status ping |
| `POST` | `/api/calculate` | Body `{ input, correlationKey }` → full context |
| `GET` | `/api/micro-tests` | `runMicroTests()` |
| `GET` | `/api/knowledge-base/claims` | JSON or `?format=jsonl` |
| `GET` | `/api/knowledge-base/rulesets` | `CANONICAL_RULESETS` |
| `POST` | `/api/compass` | Grounded dialogue (Gemini or offline) |
| `POST` | `/api/research/synthesize` | Research prose (Gemini or offline) |
| `POST` | `/api/forecast/14-day` | `generateFourteenDayForecast` |
| `GET` | `/api/forecast/locations` | `PRESET_LOCATIONS` |
| `POST` | `/api/daily-report/expand` | Long monograph expand |

Dev: Vite middleware. Prod: static `dist` + `dist/server.cjs`.

Compass system prompt injects methodology, Vedic, Gaia epistemic class, intertwining, and KB claim/ruleset summaries—and forbids inventing citations.

---

## 13. Reports & outputs

| Output | Engine / UI | Notes |
|--------|-------------|-------|
| Daily Energy Report | `dailyEnergyReport.ts` / modal | Uses core Universal Day, Vedic, Gaia, Enochian, tribe practice |
| Total Systems Report | `buildTotalSystemsReport` + panel | Gaia, gematria, forks, ledger, JSON/JSONL |
| 14-day forecast | `generateFourteenDayForecast` | Re-runs core per day × location preset |
| CSV / print | `export.ts` | Includes Enochian + Tribe life fields |
| LLM Compass | `/api/compass` | Narration only |
| Knowledge dumps | KB endpoints + export modal | Claims / rulesets |

---

## 14. Knowledge base stance

`knowledgeBase.ts` stores:

- **Rulesets** — versioned methodology identifiers (tradition name, version, notes)  
- **Claims** — status such as Authoritative / Documented / Disputed / Reconstructed  

This is an in-code provenance seed—not yet a PostgreSQL graph or file-pack ruleset archive.

**Ritual counsel and tribal life meanings are symbolic navigation aids**, not medical, legal, or financial advice. Prefer Verify tests and `rulesetHash` when auditing numbers.

---

## 15. Testing

### 15.1 Micro-tests (`runMicroTests`)

Entry points:

- UI: Diagnostics modal  
- API: `GET /api/micro-tests`

Coverage includes:

| ID family | Asserts |
|-----------|---------|
| `TEST-TEMPORAL-*` | J2000 JD = 2451545.0; Apollo JD |
| `TEST-MAYA-*` | 2012-12-21 → `13.0.0.0.0`, `4 Ahau` (GMT 584283) |
| `TEST-CHINESE-*` | 1984 Jia-Zi Rat; 2024 Jia-Chen Dragon |
| Historical / num / ephem / astro | Egyptian, Ethiopian, numerology, bodies, lines |
| `TEST-BENCH-01` | Full pipeline latency bound |
| `TEST-ENOCH-*` / `TEST-ROMAN-*` | 364-day bounds, hours, N→S / E→W flip |

### 15.2 Module suite (`npm run test:modules`)

Script: `scripts/runAllModuleTests.ts`  
**5 passes per module**, auto-retest up to 5 rounds on failure.

Modules:

1. `crucibleCore.executeCrucibleCalculation`  
2. `microTests.runMicroTests`  
3. `sharedCelestial.lunarMetrics`  
4. `gaiaOvercastForks`  
5. `dailyEnergyReport`  
6. `longTermResonance.14day`  
7. `export.csv`  
8. `gematriaEtymology`  
9. `knowledgeBase+epistemic`  
10. `freeGeocode.sanctuaryPresets`  
11. `determinism.sameInputSameHash`  

Fixture: `2026-09-07` @ Jerusalem `31.778, 35.2354`.

---

## 16. Important defaults & constants

| Item | Value |
|------|-------|
| App sanctuary | `31.778, 35.2354` Jerusalem Sanctuary |
| Forecast preset `jerusalem` | `31.7683, 35.2137` (slightly different city centroid) |
| Default correlation | `GMT_584283` |
| Core fallback name | `THE CRUCIBLE` |
| App default querent | `Sovereign Querent` |
| Schumann proxy base | ~7.83 Hz |
| Server port | `3000` |
| UI version string | `Universal Esoterism Framework v5.0.0` (header) |

---

## 17. Typical user journeys

1. **Live day reading** — Stream on Grid; gears → calendars → Tribes practice.  
2. **Understand Tribes** — Archetypal Matrix; read day/month/birth/name links.  
3. **Enochian season** — Enochian tab; Peek A/B; verses; flip map.  
4. **Name + birth** — Systems Report; gematria + forks + JSON.  
5. **Place change** — Sanctuary chip or Nominatim Geo search.  
6. **Map without Google** — OSM Free or Vector provider.  
7. **Verify** — Diagnostics micro-tests / `npm run test:modules`.  
8. **Ask** — LLM Compass (grounded when key present; offline otherwise).

---

## 18. What “perfect intertwining” means here

It does **not** mean every tradition secretly says the same thing.

It means:

1. One **Julian Day** spine  
2. Each tradition keeps its own integrity  
3. **Cross-notes** make presence and life-relevance explicit  
4. **Tribes** translate multi-system weather into vocation  
5. **Threads** show direction, season, gift, and element as shared cables  
6. **Forks** honor disagreement  
7. **Epistemic labels** keep speculation from posing as instrument data  
8. **Exports / hashes / tests** keep the weave auditable  

---

## 19. Known limits (intentional honesty)

- Ephemeris is fast / approximate (not Swiss Ephemeris–grade)  
- Timezone is offset-based (not full IANA historical TZDB)  
- Birth-time uncertainty / sensitivity analysis is not first-class  
- Rulesets are in-code registries, not yet versioned JSON file packs  
- Human Design full stack not implemented (Gene Keys gate mapping only)  
- Gaia Kp / Schumann are **proxies**, not live sensor feeds  
- LLM is optional and must not be treated as the source of tradition  
- Astrolog / GPL Swiss reference engines are discussed as future options only—not integrated  

The current app is a **synchronic intertwining product** with deterministic engines, explicit cross-notes, and optional enrichment APIs.

---

## 20. Glossary

| Term | Meaning in The Crucible |
|------|-------------------------|
| JD | Julian Day — shared time spine |
| Cross-note | Why a system is here + day/month/birth/name links |
| Intertwining | Structured weave of notes, threads, tribe life connotations |
| Triangulation | Reading agreements/conflicts without averaging |
| Camp / Tribe | Archetypal vocation quadrant (Numbers 2 symbolism) |
| Tekufah | Biblical seasonal quarter with verse anchors |
| Dies | Latin planetary weekday |
| Enoch Flip | 180° + E↔W map/compass remap |
| Fork | Explicit Path A vs Path B when systems diverge |
| Methodology | Declared calculation choices (correlation, Vedic, Gaia, …) |
| Epistemic class | Honesty label for fact vs text vs analogy vs speculation |
| Ruleset hash | Soft integrity fingerprint of a calculation |
| Gridlock | Deterministic same-input → same-output doctrine |

---

## 21. Repository layout (implementation index)

```
the-crucible/
  HOW_THIS_WORKS.md          ← this document
  UI_UX.md                   ← design system / Framer handoff
  server.ts                  ← Express API + Vite middleware
  package.json               ← scripts: dev, build, lint, test:modules
  scripts/runAllModuleTests.ts
  src/
    App.tsx                  ← shell, views, client calculation
    types.ts                 ← contracts
    index.css                ← fonts, void grid, scrollbars, gear anims
    main.tsx
    engine/                  ← all deterministic + report modules (§7)
    components/              ← all UI panels (§10)
```

---

*End of architecture reference. For visual revamp details, open `UI_UX.md`.*
