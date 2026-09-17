# The Crucible — UI / UX Design System Spec

**Purpose:** Single source of truth for a total visual revamp in **Figma** or **Framer**, then rebuild back into this Vite/React/Tailwind codebase. Capture **every** surface, typeface, color, graphic language, asset style, layout rule, interaction pattern, and component contract as implemented today.

**Companion docs:** `HOW_THIS_WORKS.md` (engines & meaning) · this file (interface & experience only).

**Product version signal in UI:** `Universal Esoterism Framework v5.0.0` (header subtitle).

**Default geographic anchor:** Jerusalem Sanctuary — `31.778°N, 35.2354°E`.

---

## 1. Design thesis (non-negotiable)

| Principle | Spec |
|-----------|------|
| **Brand first** | “THE CRUCIBLE” is hero-level in the sticky header (Cinzel, tracked, uppercase)—not a quiet nav whisper. |
| **Ledger, not dashboard** | High-density telemetry on a void grid. Avoid soft SaaS cards, pill clusters, and multi-stat hero strips. |
| **Sharp geometry** | Prefer `rounded-sm` / near-zero radius. Diamond brand mark (rotated square). Crosshair / diamond paran markers. |
| **Semantic color** | Each tradition owns an accent; cyan = temporal invariant / agreements; amber = solar / Enochian / daily action. |
| **Epistemic honesty** | Badges label FACT / TEXT / ANALOGY / SPECULATIVE etc. Speculative layers (Gaia) must never look like live instrument data. |
| **One job per section** | Banner → mechanism → sky → practice → calendars → vocation. Do not dump everything in the first viewport. |
| **Motion = presence** | Pulse live dots, slow gear spins, CTA hover translate/rotate—not decorative particle noise. |

**Anti-patterns to avoid in the revamp (unless intentionally redesigning away):** purple-on-white gradients, cream+terracotta editorial look, broadsheet dense newspaper columns, glow-heavy dark neon kitsch, rounded-full marketing pills as primary chrome.

---

## 2. Global canvas & atmosphere

### 2.1 Page void

| Token | Value | Notes |
|-------|-------|-------|
| Background color | `#050505` | Near-black void |
| Microdot grid | `radial-gradient(circle at 2px 2px, #1a1a1a 1px, transparent 0)` | Size `24px × 24px` on `body` |
| Default text | `#d1d5db` (gray-300) | Readable secondary white |
| Selection | `bg-cyan-900/60` + `text-cyan-200` | Temporal accent |

CSS source: `src/index.css` + `index.html` body classes.

### 2.2 Panel surfaces

| Role | Hex | Border | Radius |
|------|-----|--------|--------|
| Primary panel | `#0a0a0a` | `#222` | `rounded-sm` |
| Inset well | `#0d0d0d` / `#111` | `#222` | `rounded-sm` |
| Deep canvas (map) | `#050505` | `#222` | `rounded-sm` |
| Nested telemetry | `#0c0c0c` / `#141414` | `#1c1c1c` | `rounded-sm` |
| Soft divider | `#1a1a1a` | — | hairline top border |

Utility classes:

- `.crucible-grid-bg` — denser 16px microdot on `#0a0a0a`
- `.crucible-radar-grid` — faint cyan radial + 16px cartesian grid (ephemeris / radar feel)

### 2.3 Scrollbars

Width/height `4px`; track `#050505`; thumb `#222` → hover `#333`; radius `1px`.

### 2.4 Layout shell

```
Viewport
└── min-h-screen flex-col font-sans bg-[#050505]
    ├── SecureDashboardHeader (sticky top-0 z-40, h-14)
    ├── main.max-w-7xl.mx-auto.p-3|md:p-5.space-y-4
    │   ├── TemporalControlBar
    │   └── Active view panels (space-y-3|4)
    └── Footer (calc id · latency · hash)
+ Modals: Daily Report · Export · Diagnostics (portaled overlays)
```

**Max content width:** `max-w-7xl` (~80rem). Horizontal padding `12px` mobile / `20px` desktop.

---

## 3. Typography

### 3.1 Font families (Google Fonts, loaded in `index.html`)

| CSS var / class | Family | Weights used | Role |
|-----------------|--------|--------------|------|
| `--font-cinzel` / `.font-cinzel` | **Cinzel** | 400, 600, 700, 800 | Brand, sacred section titles |
| `--font-garamond` / `.font-garamond` | **EB Garamond** | 400–600 + italic | Novelistic prose, cross-notes, banner quote |
| `--font-mono` / `.font-mono` | **JetBrains Mono** | 300, 400, 500, 700 | Tickers, JD, hashes, controls, labels |
| `--font-sans` / `.font-sans` (body default) | **Plus Jakarta Sans** | 300–700 | UI chrome, body |

Import URL (preserve in Framer/Figma):

```
https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap
```

### 3.2 Type scale (as used)

| Use | Approx size | Treatment |
|-----|-------------|-----------|
| Brand H1 | `14–16px` | Cinzel bold, `tracking-[0.2em]`, uppercase, white |
| Framework subtitle | `9px` | Mono, cyan-500, uppercase, tight tracking |
| Section title | `12px` (`text-xs`) | Cinzel bold, uppercase, tracking-wider |
| Banner quote | `12–14px` | Serif italic, gray-200 |
| Body / panel copy | `11–12px` | Sans or mono |
| Control labels | `9–10px` | Mono uppercase |
| Micro badges | `8px` | Mono bold uppercase |
| Map overlays | `8–9px` | Mono |

### 3.3 Typographic rules for Figma/Framer

1. Never use Inter / Roboto / Arial / system as brand faces.  
2. Uppercase + tracking is the “instrument panel” voice; italic Garamond is the “oracle / essay” voice.  
3. Do not mix more than two voices in one component (title Cinzel + body mono OR title Cinzel + prose Garamond).

---

## 4. Color schema (full semantic map)

### 4.1 Neutrals

| Name | Hex | Usage |
|------|-----|-------|
| Void | `#050505` | Page |
| Panel | `#0a0a0a` | Cards |
| Well | `#0d0d0d` | Inputs |
| Raised | `#111` / `#151515` | Buttons idle / tab active |
| Border | `#222` / `#333` | Structure / hover |
| Label mute | gray-500 | `text-gray-500` |
| Secondary text | gray-400 | Idle controls |
| Primary text | gray-200 / white | Readable |

### 4.2 Accents (Tailwind + raw hex where custom)

| Accent | Typical tokens | Tradition / meaning |
|--------|----------------|---------------------|
| **Cyan** | `cyan-300/400/500`, `#00f0ff` | Maya, JD, agreements, map sanctuary, live stream |
| **Amber** | `amber-300/400`, borders amber-600/800 | Enochian, daily report CTA, paran diamonds, solar |
| **Orange** | `orange-400` | Chinese sexagenary header ticker |
| **Emerald** | `emerald-300/400`, green-400 | Dreamspell, free geocode, latency STABLE |
| **Purple** | `purple-*` / violet | Numerology / Pythagorean / Julian dies |
| **Indigo** | indigo | Greek Attic |
| **Rose / red** | `rose-300`, red | SPECULATIVE badge, shadow warnings |
| **Blue** | blue-900 gradients | 14-day resonance CTA |

### 4.3 Epistemic badge colors (`EPISTEMIC_LABELS`)

| Class | Short | Hex |
|-------|-------|-----|
| HISTORICAL_FACT | FACT | `#22d3ee` |
| TEXTUAL_TRADITION | TEXT | `#a78bfa` |
| SCHOLARLY_INTERPRETATION | SCHOLAR | `#60a5fa` |
| COMPARATIVE_ANALOGY | ANALOGY | `#fbbf24` |
| SYSTEM_INTERPRETATION | SYSTEM | `#34d399` |
| SPECULATIVE_SYNTHESIS | SPECULATIVE | `#fb7185` |
| EMPIRICAL_EVIDENCE | EMPIRICAL | `#4ade80` |
| COMPUTED_GEOMETRY | COMPUTED | `#67e8f9` |

Badge chrome: `8px` mono bold, border `{color}66`, fill `{color}14`, `rounded-sm`.

### 4.4 Tradition left-rail keys

Panels often use `border-l-2` with tradition color (cyan / amber / emerald / etc.) on `#0d0d0d` wells—treat as a **keyed ledger row**, not a card.

### 4.5 Gradients (sparing)

| Where | Gradient |
|-------|----------|
| Gaia banner strip | `from-[#0d1520] via-[#0a0a0a] to-[#120a15]` + cyan border |
| Daily Report CTA | `from-amber-500/20 to-orange-500/20` |
| 14-Day CTA | `from-cyan-900/40 to-blue-900/40` |

---

## 5. Brand & graphic asset language

### 5.1 Diamond emblem (header)

- Outer: `28–32px` square, `border-[#444]`, `rotate-45`, black fill  
- Inner: circle `border-cyan-500`, `animate-pulse`  
- **Framer/Figma:** recreate as vector; do not replace with a logo wordmark that removes the diamond.

### 5.2 Lucide icons (stroke UI)

Used throughout (`lucide-react`): `Sun`, `Calendar`, `Sparkles`, `GitFork`, `ArrowRight`, `BookOpen`, `Compass`, `FlipHorizontal2`, `Clock`, `Eye`, `Key`, `Navigation2`, etc.

**Style:** thin stroke, 12–16px in chrome, colored to accent (cyan/amber). Never emoji as primary iconography.

### 5.3 Vector glyphs (`src/components/symbols/CrucibleGlyphs.tsx`)

Custom SVG cartouches for:

- Mayan day signs (Imix, Ik, Akbal, …) — cyan default `#00f0ff`, 48×48 viewBox, rounded cartouche + dashed inner circle  
- Chinese zodiac / Wu Xing element marks  
- Twelve Tribes emblems  

**Asset style rules:**

1. Flat vector, stroke-forward, low fill opacity (`0.3–0.8`)  
2. Dark fill behind glyph `#0d111a`  
3. Hover: `scale-110`  
4. No photorealistic illustrations; no 3D clay icons  
5. Export SVG sets for Figma with same stroke weights (~2)

### 5.4 Gear of Gears

Interlocking circular rings / teeth metaphor for calendar cycles. Animations:

- `.animate-spin-slow` — 60s linear  
- `.animate-spin-reverse` — 45s reverse  

Palette: cyan/amber strokes on dark wells. Treat as **mechanical diagram**, not cartoon gears.

### 5.5 Ephemeris / zodiac wheel

Radar-grid backdrop + 360° wheel. Aspects as thin chords. Keep scientific-diagram aesthetic.

### 5.6 Map graphics

| Layer | Style |
|-------|-------|
| Sanctuary marker | Cyan disc + mono label chip |
| Paran crossing | Amber diamond (`rotate-45`) |
| Probe | Amber pulsing ring + crosshair |
| Vector world | Equirectangular SVG, graticule `#151515` / `#222`, land fill `#0c0d12` |
| Selected geodesic | Thicker stroke; IC dashed |
| Enoch flip | `scaleX(-1)` on map canvas + amber banner “Enochian World Flip Active” |

### 5.7 Imagery policy

No stock hero photos. Atmosphere = void + grid + vectors. If Framer adds imagery, prefer **astronomical / cartographic / manuscript** textures at ≤20% opacity behind panels—never replace brand diamond.

---

## 6. Information architecture & UX flows

### 6.1 Primary navigation (header tabs)

Order as shipped:

1. Master Grid  
2. Enochian / Biblical  
3. 14-Day Resonance  
4. Systems Report  
5. Gear of Gears  
6. Astrocartography  
7. LLM Compass  

**Active tab:** `bg-[#151515] text-cyan-400 border-cyan-800/80`.  
**Idle:** gray-400 → hover white / `#111`.

### 6.2 Header telemetry (xl+)

Three columns: Gregorian datetime · Mayan Long Count (cyan) · Chinese year pillar (orange).

### 6.3 Header CTAs

| Control | Visual | Action |
|---------|--------|--------|
| Today's Report | Amber gradient border, pulsing dot | Open Daily Energy modal |
| Diagnostics | Green pulse + mono | Micro-test suite modal |
| Export | Mono border | Report export modal |

### 6.4 Temporal control bar UX

1. **Streaming Real-Time** toggle — cyan pulse when live (1s tick updates date/time)  
2. **Fetch Now** — snap to wall clock  
3. Date / time inputs — mono, cyan focus ring  
4. **UTC / LOCAL** — amber when UTC  
5. **Place + Geo** — free **OSM Nominatim** search; dropdown results  
6. Sanctuary presets (offline) — Jerusalem, Giza, Chichen Itza, Stonehenge, Varanasi, Lhasa, Machu Picchu, Delphi  
7. Correlation select — GMT 584283 / 584285 / Spinden  
8. Latency gauge + ruleset hash  
9. Calibrated epoch chips (2012, J2000, Jia-Zi, Apollo 11, Sothic)

**UX rule:** Changing place/date recalculates entire context immediately (client `useMemo` → `executeCrucibleCalculation`).

### 6.5 Master Grid vertical narrative

1. Gaia / forks teaser banner (entry emotion + SPECULATIVE label)  
2. Gear of Gears  
3. Planetary Ephemeris  
4. Dreamspell Synchronometer  
5. Calendar Comparison (+ per-system cross-notes)  
6. Archetypal Matrix / Twelve Tribes (+ epistemic badges + intertwining)

### 6.6 Cross-note pattern (`SystemCrossNoteCard`)

- Collapsed: one line “Cross-Note · Why this system”  
- Expanded sections: Why present · In your life · Day · Month · Birth · Name  
- Voice: Garamond italic for prose; mono labels  

### 6.7 Enochian view UX

- Peek A (Civil) / Peek B (Enochian) / A/B Compare  
- Map Flip control → jumps to Astrocartography with flip on  
- Hour / half-hour matrices  
- Epistemic: TEXT + SYSTEM badges  

### 6.8 Astrocartography UX

**Map providers (free-first):**

| Mode | Requirement | Behavior |
|------|-------------|----------|
| **OSM Free** | None | OpenStreetMap embed iframe; line overlay via Vector mode |
| **Vector** | None | Full geodesic SVG canvas |
| **Google** | `VITE_GOOGLE_MAPS_API_KEY` | 3D satellite / hybrid / terrain + polylines |

Also: Enoch Flip, tilt/heading, sanctuary list, line filters (MC/IC/ASC/DSC), planet filter, paran toggle, coordinate probe.

### 6.9 Systems Report UX

Gaia overcast · dialectical forks (A/B + synthesis) · gematria/name · ledger export JSON/CSV · epistemic honesty on speculative fields.

### 6.10 Daily Report modal

Long-form monograph: executive synthesis, traditions, Vedic, eclipse, continental overcast, strategic plan. Amber/solar framing.

### 6.11 14-Day Resonance

Location picker from presets; day chips; click day → sets temporal date.

### 6.12 LLM Compass

Chat grounded on calculation context + knowledge-base claims/rulesets. Offline fallback narrative when no `GEMINI_API_KEY`.

---

## 7. Component inventory (map to Figma frames)

| Component | File | Figma frame suggestion |
|-----------|------|------------------------|
| SecureDashboardHeader | `SecureDashboardHeader.tsx` | `Shell / Header` |
| TemporalControlBar | `TemporalControlBar.tsx` | `Shell / Temporal Bar` |
| GearsVisualizer | `GearsVisualizer.tsx` | `Grid / Gears` |
| PlanetaryEphemerisWidget | `PlanetaryEphemerisWidget.tsx` | `Grid / Ephemeris` |
| DreamspellSynchronometerPanel | `DreamspellSynchronometerPanel.tsx` | `Grid / Dreamspell` |
| CalendarComparisonGrid | `CalendarComparisonGrid.tsx` | `Grid / Calendars` |
| SystemCrossNoteCard | `SystemCrossNoteCard.tsx` | `Atoms / Cross-Note` |
| ArchetypalMatrixPanel | `ArchetypalMatrixPanel.tsx` | `Grid / Tribes Matrix` |
| EpistemicBadge | `EpistemicBadge.tsx` | `Atoms / Epistemic` |
| EnochianBiblicalPanel | `EnochianBiblicalPanel.tsx` | `View / Enochian` |
| AstrocartographyMap | `AstrocartographyMap.tsx` | `View / Map` |
| TotalSystemsReportPanel | `TotalSystemsReportPanel.tsx` | `View / Report` |
| LongTermResonancePanel | `LongTermResonancePanel.tsx` | `View / 14-Day` |
| ConversationalCompass | `ConversationalCompass.tsx` | `View / Compass` |
| DailyEnergyReportModal | `DailyEnergyReportModal.tsx` | `Modal / Daily` |
| ReportExportModal | `ReportExportModal.tsx` | `Modal / Export` |
| DiagnosticMicroTestsModal | `DiagnosticMicroTestsModal.tsx` | `Modal / Diagnostics` |
| CrucibleGlyphs | `symbols/CrucibleGlyphs.tsx` | `Assets / Glyphs` |

---

## 8. Spacing, density, breakpoints

| Token | Value |
|-------|-------|
| Panel padding | `10–16px` (`p-2.5`–`p-4`) |
| Stack gap | `12–16px` (`space-y-3`–`4`) |
| Control height | ~28–32px |
| Header height | `56px` (`h-14`) |
| Map canvas height | `540px` |
| Breakpoints used | `sm`, `md`, `lg`, `xl` (Tailwind defaults) |

**Density doctrine:** Prefer more information per panel over whitespace-heavy marketing layouts. Revamp may loosen density for Framer storytelling **only if** the ledger character survives on the data screens.

---

## 9. Motion spec

| Motion | Spec | Where |
|--------|------|-------|
| Live pulse | Tailwind `animate-pulse` / `animate-ping` | Stream dot, sanctuary ping, CTA ping |
| Gear spin | 60s / 45s continuous | GearsVisualizer |
| CTA hover | `translate-x-0.5`, `rotate-45` on Sun, `scale-105` | Banner / header |
| Map marker hover | `scale-125` / `scale-150` | Sanctuaries / parans |
| Glyph hover | `scale-110` | CrucibleGlyphs |

Prefer `transition-colors` / `transition-transform`; avoid large blur animations.

---

## 10. Free APIs & external services (wiring)

| Service | Key? | Used for |
|---------|------|----------|
| **OpenStreetMap embed** | No | Map basemap (`mapProvider: osm`) |
| **OSM Nominatim** | No | Place geocoding (`freeGeocode.ts`) |
| **Vector canvas** | No | Astro lines without Google |
| **Google Maps JS** | Optional `VITE_GOOGLE_MAPS_API_KEY` | 3D map / hybrid |
| **Google Gemini** | Optional `GEMINI_API_KEY` | Compass LLM |
| Sanctuary presets | Offline | Always-available coordinates |

**Fallback ladder for maps:** OSM → Vector → Google (if key).  
**Fallback for LLM:** Deterministic offline dossier from context + KB.

---

## 11. Content voice & microcopy patterns

| Register | Example |
|----------|---------|
| Instrument | `STREAMING REAL-TIME` · `HASH:` · `Latency:` |
| Sacred title | `Enochian Time · Biblical Transits · Roman Dies` |
| Oracle prose | Italic Garamond banner quote about Gaia / forks |
| Epistemic | `SPECULATIVE` · `FACT` · `ANALOGY` |
| Action | `Today's Daily Report` · `Open Systems Report` · `Map Flip ON` |

Tone: precise, ceremonial, never cute. Avoid emoji in primary UI.

---

## 12. Accessibility & interaction notes

- Sticky header must not obscure focus rings; keep `z-40` overlays manageable.  
- Map iframe: provide “Open full OSM” + “Show line overlay (Vector)” escapes.  
- Color is semantic but not the only cue—labels accompany accents.  
- Prefer keyboard-operable buttons for tabs/epochs; ensure modal focus traps in revamp.  
- Contrast: cyan/amber on `#0a0a0a` meets dense-UI norms; do not lighten void to gray-800 without retuning accents.

---

## 13. Framer / Figma handoff checklist

1. Import the four font families and create text styles matching §3.  
2. Create color styles for neutrals + accents + all 8 epistemic colors.  
3. Build **Shell** (header + temporal bar + footer) as a shared component.  
4. Build **Atoms**: EpistemicBadge, diamond emblem, glyph set, mono chip, left-rail well.  
5. Build one frame per view in §6.1 with real sample data strings (Long Count, Kin, pillars).  
6. Document map provider toggle and Enoch flip as interaction prototypes.  
7. Export SVG glyph library from `CrucibleGlyphs.tsx`.  
8. When rebuilding into code: keep class naming semantic; prefer CSS variables listed in `index.css`; preserve `max-w-7xl` shell unless IA changes intentionally.  
9. Do not remove epistemic labeling in the revamp—promote it.  
10. Keep free-map path working without Google keys.

---

## 14. File & token sources (for builders)

| Concern | Source |
|---------|--------|
| Fonts / body void | `index.html`, `src/index.css` |
| App shell / views | `src/App.tsx` |
| Header | `src/components/SecureDashboardHeader.tsx` |
| Temporal + geocode UI | `src/components/TemporalControlBar.tsx`, `src/engine/freeGeocode.ts` |
| Map providers | `src/components/AstrocartographyMap.tsx` |
| Epistemic UI | `src/components/EpistemicBadge.tsx`, `src/engine/epistemic.ts` |
| Glyphs | `src/components/symbols/CrucibleGlyphs.tsx` |
| Meaning / engines | `HOW_THIS_WORKS.md` |

---

*End of UI/UX spec. Update this file whenever visual language, shell IA, or asset style changes.*
