/**
 * The Crucible — Personal Systems Dossier (print / Save-as-PDF product)
 * Tiers: FREE_PREVIEW | FULL_READING ($12.99) | DEEP_REPORT ($24–29)
 */

import { CompleteCalculationContext, DossierTier } from '../types';
import { downloadFile } from './export';

export const DOSSIER_TIER_META: Record<
  DossierTier,
  { label: string; priceHint: string; blurb: string }
> = {
  FREE_PREVIEW: {
    label: 'Free Preview',
    priceHint: '$0',
    blurb: 'Enough of the basic systems to understand what you found.'
  },
  FULL_READING: {
    label: 'Full Reading',
    priceHint: '$12.99',
    blurb: 'Complete Systems Report, intertwining, expanded calculations, name analysis.'
  },
  DEEP_REPORT: {
    label: 'Deep Report',
    priceHint: '$24–$29',
    blurb: 'Birth + name + extended synthesis + astrocartography + 14-day resonance + downloadable dossier.'
  }
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function section(title: string, body: string): string {
  return `<section class="chapter"><h2>${esc(title)}</h2>${body}</section>`;
}

function kv(label: string, value: string): string {
  return `<div class="kv"><span class="k">${esc(label)}</span><span class="v">${esc(value)}</span></div>`;
}

function noteLadder(ctx: CompleteCalculationContext): string {
  return ctx.intertwining.systemNotes
    .map(
      (n) => `
    <article class="note">
      <h3>${esc(n.systemName)}</h3>
      <ol class="ladder">
        <li><strong>Why is this here?</strong> ${esc(n.whyPresent)}</li>
        <li><strong>Independently says</strong> ${esc(n.independentlySays)}</li>
        <li><strong>Intersects</strong> ${esc(n.intersectsWith)}</li>
        <li><strong>Disagrees</strong> ${esc(n.disagreesWith)}</li>
        <li><strong>What to do</strong> ${esc(n.doWithDisagreement)}</li>
      </ol>
    </article>`
    )
    .join('\n');
}

/**
 * Build a print-ready HTML Personal Systems Dossier.
 */
export function generateDossierHTML(
  ctx: CompleteCalculationContext,
  tier: DossierTier,
  opts?: {
    querentName?: string;
    birthDate?: string;
    birthTime?: string;
    fourteenDaySummary?: string;
  }
): string {
  const name = opts?.querentName || ctx.input.querentName || 'Sovereign Querent';
  const meta = DOSSIER_TIER_META[tier];
  const tribe = ctx.intertwining.primaryTribeLife;
  const gaia = ctx.gaiaOvercast;
  const vedic = ctx.vedic;

  const freeCore = `
    ${section(
      'Temporal Foundation',
      kv('Gregorian', `${ctx.input.dateString} ${ctx.input.timeString}`) +
        kv('Location', `${ctx.input.location.city || '—'} (${ctx.input.location.latitude}, ${ctx.input.location.longitude})`) +
        kv('Julian Day UT', String(ctx.temporal.julianDayUT)) +
        kv('Calculation ID', ctx.calculationId) +
        kv('Ruleset Hash', ctx.rulesetHash) +
        kv('Methodology', `${ctx.methodology.calendarCorrelation} · ${ctx.methodology.ayanamsha} · ${ctx.methodology.version}`)
    )}
    ${section(
      'Core Systems (Preview)',
      kv('Maya Long Count', ctx.mayan.longCount.formatted) +
        kv('Tzolkʼin', ctx.mayan.tzolkin.formatted) +
        kv('Chinese Day Pillar', `${ctx.chinese.dayPillar.stemPinYin}-${ctx.chinese.dayPillar.branchPinYin}`) +
        kv('Dreamspell', ctx.dreamspell.signature) +
        kv('Universal Day', String(ctx.numerology.universalDay)) +
        kv(
          'Strongest Archetypal Alignment',
          `${tribe.tribe} (${ctx.synthesis.topResonatingTribe.affinityScore}%) — under this methodology`
        )
    )}
    ${section(
      'Epistemic Register',
      `<p>This dossier separates <em>computed geometry</em>, <em>textual tradition</em>, <em>system interpretation</em>, <em>comparative analogy</em>, and <em>speculative synthesis</em>. Speculative field overlays (Gaia proxies) are not live magnetometer readings.</p>`
    )}
  `;

  const fullExtra =
    tier === 'FREE_PREVIEW'
      ? ''
      : `
    ${section(
      'Complete Calendrical Ledger',
      kv('Haabʼ', ctx.mayan.haab.formatted) +
        kv('Egyptian', `${ctx.egyptian.monthName} ${ctx.egyptian.dayOfMonth} · ${ctx.egyptian.season}`) +
        kv('Ethiopian', `${ctx.ethiopian.monthName} ${ctx.ethiopian.dayOfMonth} · ${ctx.ethiopian.evangelist}`) +
        kv('Greek', `${ctx.greek.atticMonthName} ${ctx.greek.atticDay} · ${ctx.greek.patronDeity}`) +
        kv('Enochian', ctx.enochianBiblical.enochian.formatted) +
        kv('Biblical Tekufah', ctx.enochianBiblical.biblicalSeason.hebrewTekufah) +
        kv('Roman Dies', `${ctx.enochianBiblical.gregorianWeekdayDeity.latinDies} (${ctx.enochianBiblical.gregorianWeekdayDeity.romanDeity})`) +
        kv('Planetary Hour', ctx.enochianBiblical.currentPlanetaryHour.planet) +
        (vedic
          ? kv('Vedic Nakshatra', `${vedic.nakshatraName} Pada ${vedic.nakshatraPada} · ${vedic.tithiName}`)
          : '')
    )}
    ${section(
      'Gene Keys',
      kv('Sun Gate', `${ctx.geneKeysSun.gate}.${ctx.geneKeysSun.line} ${ctx.geneKeysSun.name}`) +
        kv('Gift / Shadow / Siddhi', `${ctx.geneKeysSun.gift} / ${ctx.geneKeysSun.shadow} / ${ctx.geneKeysSun.siddhi}`) +
        kv('Earth Gate', `${ctx.geneKeysEarth.gate}.${ctx.geneKeysEarth.line} ${ctx.geneKeysEarth.name}`)
    )}
    ${section(
      'Name · Numerology',
      kv('Querent', name) +
        kv('Life Path', String(ctx.numerology.lifePathNumber)) +
        kv('Universal Month / Year', `${ctx.numerology.universalMonth} / ${ctx.numerology.universalYear}`) +
        kv('Chaldean Vibration', String(ctx.numerology.chaldeanVibration))
    )}
    ${section(
      'Intertwining · Navigation',
      `<pre class="narrative">${esc(ctx.intertwining.triangulationNarrative)}</pre>
       <h3>Why is this here? — every system</h3>
       ${noteLadder(ctx)}`
    )}
    ${section(
      'Agreements · Tensions · Practices',
      `<h3>Agreements</h3><ul>${ctx.synthesis.crossSystemAgreements.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
       <h3>Tensions</h3><ul>${ctx.synthesis.creativeTensionsOrAnomalies.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
       <h3>Archetypal practice</h3>
       ${kv('Explore', tribe.giftToEmbody) + kv('Today', tribe.dayPractice) + kv('Refuse', tribe.shadowToWatch)}
       <p class="fine">${esc(tribe.whyBesideOtherSystems)}</p>`
    )}
    ${
      gaia
        ? section(
            'Speculative Field Overlay',
            kv('Epistemic Class', gaia.epistemicClass) +
              kv('Geomagnetic Status (proxy)', gaia.geomagneticStatus) +
              kv('Kp Estimate (proxy)', String(gaia.geomagneticKpEstimated)) +
              kv('Schumann Proxy Hz', String(gaia.schumannFrequencyHz)) +
              kv('Lunar Illumination', `${gaia.lunarIlluminationPercent}% · ${gaia.lunarPhaseName}`) +
              `<p class="fine">SPECULATIVE — exploratory synthesis, not empirical magnetometer measurement.</p>`
          )
        : ''
    }
    ${
      (ctx.dialecticalForks || []).length
        ? section(
            'Dialectical Forks',
            ctx.dialecticalForks!
              .map(
                (f) => `<article class="fork">
              <h3>${esc(f.title)}</h3>
              <p>${esc(f.apparentContradictionDescription)}</p>
              <p><strong>Path A:</strong> ${esc(f.pathA.title)} — ${esc(f.pathA.summary)}</p>
              <p><strong>Path B:</strong> ${esc(f.pathB.title)} — ${esc(f.pathB.summary)}</p>
              <p><strong>Synthesis:</strong> ${esc(f.synthesis.title)} — ${esc(f.synthesis.summary)}</p>
            </article>`
              )
              .join('')
          )
        : ''
    }
  `;

  const deepExtra =
    tier !== 'DEEP_REPORT'
      ? ''
      : `
    ${section(
      'Natal Lock (Deep)',
      kv('Birth Date', opts?.birthDate || ctx.input.dateString) +
        kv('Birth Time', opts?.birthTime || ctx.input.timeString) +
        kv('Birth Place', `${ctx.input.location.city || '—'} @ ${ctx.input.location.latitude}, ${ctx.input.location.longitude}`) +
        `<p class="fine">Deep tier treats the locked birth coordinate as natal baseline for dossier ownership. Birth-time sensitivity analysis is available in the Profile / What Changed instruments.</p>`
    )}
    ${section(
      'Astrocartography Summary',
      `<p>${ctx.astrocartographyLines.length} planetary lines computed (MC/IC/ASC/DSC). Top lines:</p>
       <ul>${ctx.astrocartographyLines
         .slice(0, 12)
         .map((l) => `<li>${esc(l.lineTypeName)} — ${esc(l.planetId)} · subsolar ${l.subSolarLongitude}°</li>`)
         .join('')}</ul>`
    )}
    ${section(
      'Celestial Snapshot',
      `<ul>${ctx.celestialBodies
        .slice(0, 12)
        .map(
          (b) =>
            `<li>${esc(b.name)}: ${b.eclipticLongitude.toFixed(2)}° · ${esc(b.zodiacSign)} ${b.signDegree.toFixed(2)}°${b.isRetrograde ? ' (R)' : ''}</li>`
        )
        .join('')}</ul>`
    )}
    ${section(
      '14-Day Resonance',
      opts?.fourteenDaySummary
        ? `<pre class="narrative">${esc(opts.fourteenDaySummary)}</pre>`
        : `<p class="fine">Open the 14-Day Resonance view in The Crucible to regenerate the forward loom, then re-export Deep Report to embed the summary. Engine: generateFourteenDayForecast.</p>`
    )}
    ${section(
      'Methodology Fingerprint',
      kv('Correlation', ctx.methodology.calendarCorrelation) +
        kv('Ayanamsha', ctx.methodology.ayanamsha) +
        kv('Ephemeris Model', ctx.methodology.ephemerisModel) +
        kv('Zodiac', ctx.methodology.zodiac) +
        kv('Include Vedic', String(ctx.methodology.includeVedic)) +
        kv('Include Gaia Overlay', String(ctx.methodology.includeGaiaOverlay)) +
        kv('Methodology Version', ctx.methodology.version) +
        kv('Event Time ISO', ctx.eventTimeIso) +
        kv('Calculation Time ISO', ctx.calculationTimeIso) +
        kv('Execution ms', String(ctx.executionDurationMs))
    )}
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>THE CRUCIBLE — Personal Systems Dossier — ${esc(name)}</title>
<style>
  @page { margin: 18mm; }
  body { font-family: "EB Garamond", Georgia, serif; color: #111; background: #faf9f7; line-height: 1.45; }
  .cover { text-align: center; padding: 48px 24px 32px; border-bottom: 1px solid #ccc; margin-bottom: 28px; }
  .cover h1 { font-family: Cinzel, "Times New Roman", serif; letter-spacing: 0.22em; font-size: 28px; margin: 0; }
  .cover .sub { font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #555; margin-top: 8px; }
  .cover .tier { margin-top: 16px; font-size: 12px; color: #333; }
  .cover .meta { margin-top: 20px; font-family: "JetBrains Mono", Consolas, monospace; font-size: 11px; color: #444; }
  .chapter { break-inside: avoid; margin-bottom: 28px; padding-bottom: 12px; border-bottom: 1px solid #e5e5e5; }
  h2 { font-family: Cinzel, serif; font-size: 15px; letter-spacing: 0.14em; text-transform: uppercase; margin: 0 0 12px; }
  h3 { font-size: 13px; margin: 14px 0 6px; }
  .kv { display: flex; gap: 12px; font-size: 12px; margin: 4px 0; font-family: "JetBrains Mono", Consolas, monospace; }
  .k { min-width: 160px; color: #666; text-transform: uppercase; font-size: 10px; }
  .v { flex: 1; color: #111; }
  .narrative { white-space: pre-wrap; font-family: Georgia, serif; font-size: 12px; background: #f3f1ec; padding: 12px; }
  .note, .fork { background: #fff; border: 1px solid #ddd; padding: 10px 12px; margin: 10px 0; }
  .ladder { margin: 6px 0 0 18px; font-size: 12px; }
  .ladder li { margin: 4px 0; }
  .fine { font-size: 11px; color: #666; font-style: italic; }
  .footer { margin-top: 40px; font-size: 10px; color: #777; text-align: center; font-family: monospace; }
  @media print {
    body { background: white; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
  <div class="no-print" style="position:sticky;top:0;background:#111;color:#eee;padding:10px 16px;font-family:sans-serif;font-size:12px;display:flex;justify-content:space-between;gap:12px;z-index:10">
    <span>THE CRUCIBLE · ${esc(meta.label)} · Use browser Print → Save as PDF</span>
    <button onclick="window.print()" style="padding:6px 12px;cursor:pointer">Print / Save PDF</button>
  </div>
  <div class="cover">
    <h1>THE CRUCIBLE</h1>
    <div class="sub">Personal Systems Dossier</div>
    <div class="tier">${esc(meta.label)} · ${esc(meta.priceHint)} · ${esc(meta.blurb)}</div>
    <div class="meta">
      Prepared for ${esc(name)}<br/>
      Event ${esc(ctx.input.dateString)} ${esc(ctx.input.timeString)} · ${esc(ctx.input.location.city || 'Location')}<br/>
      ${esc(ctx.calculationId)}
    </div>
  </div>
  ${freeCore}
  ${fullExtra}
  ${deepExtra}
  <div class="footer">
    Navigation through systems — not fifty calculators dumped on a page.<br/>
    Archetypal alignments are methodological readings. Speculative overlays are labeled SPECULATIVE.<br/>
    Fingerprint ${esc(ctx.rulesetHash)} · Generated ${esc(ctx.calculationTimeIso)}
  </div>
</body>
</html>`;
}

export function openDossierPrintWindow(
  ctx: CompleteCalculationContext,
  tier: DossierTier,
  opts?: Parameters<typeof generateDossierHTML>[2]
): void {
  const html = generateDossierHTML(ctx, tier, opts);
  const w = window.open('', '_blank', 'noopener,noreferrer,width=900,height=1100');
  if (!w) {
    downloadFile(`crucible-dossier-${tier.toLowerCase()}.html`, html, 'text/html;charset=utf-8');
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

export function downloadDossierHTML(
  ctx: CompleteCalculationContext,
  tier: DossierTier,
  opts?: Parameters<typeof generateDossierHTML>[2]
): void {
  const html = generateDossierHTML(ctx, tier, opts);
  downloadFile(`crucible-dossier-${tier.toLowerCase()}-${ctx.input.dateString}.html`, html, 'text/html;charset=utf-8');
}
