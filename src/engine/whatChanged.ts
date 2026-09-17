/**
 * What Changed? — compare two CompleteCalculationContext snapshots.
 */

import { CompleteCalculationContext, WhatChangedField, WhatChangedReport } from '../types';

function field(
  systemId: string,
  systemName: string,
  label: string,
  before: string,
  after: string
): WhatChangedField {
  const status: WhatChangedField['status'] =
    before === after ? 'unchanged' : 'changed';
  return { systemId, systemName, label, before, after, status };
}

function snapshot(ctx: CompleteCalculationContext): WhatChangedField[] {
  const sun = ctx.celestialBodies.find((b) => b.id === 'sun');
  const moon = ctx.celestialBodies.find((b) => b.id === 'moon');
  return [
    field('mayan', 'Maya', 'Long Count', ctx.mayan.longCount.formatted, ctx.mayan.longCount.formatted),
    field('mayan', 'Maya', 'Tzolkʼin', ctx.mayan.tzolkin.formatted, ctx.mayan.tzolkin.formatted),
    field('mayan', 'Maya', 'Haabʼ', ctx.mayan.haab.formatted, ctx.mayan.haab.formatted),
    field('mayan', 'Maya', 'Kin', String(ctx.mayan.kinNumber), String(ctx.mayan.kinNumber)),
    field('dreamspell', 'Dreamspell', 'Signature', ctx.dreamspell.signature, ctx.dreamspell.signature),
    field('dreamspell', 'Dreamspell', 'Tone', ctx.dreamspell.galacticTone.name, ctx.dreamspell.galacticTone.name),
    field(
      'chinese',
      'Chinese',
      'Day Pillar',
      `${ctx.chinese.dayPillar.stemPinYin}-${ctx.chinese.dayPillar.branchPinYin}`,
      `${ctx.chinese.dayPillar.stemPinYin}-${ctx.chinese.dayPillar.branchPinYin}`
    ),
    field('chinese', 'Chinese', 'Dominant Element', ctx.chinese.dominantElement, ctx.chinese.dominantElement),
    field('chinese', 'Chinese', 'Solar Term', ctx.chinese.solarTerm.name, ctx.chinese.solarTerm.name),
    field('egyptian', 'Egyptian', 'Season', ctx.egyptian.season, ctx.egyptian.season),
    field('ethiopian', 'Ethiopian', 'Evangelist', ctx.ethiopian.evangelist, ctx.ethiopian.evangelist),
    field('greek', 'Greek', 'Attic Month', ctx.greek.atticMonthName, ctx.greek.atticMonthName),
    field('enochian', 'Enochian', 'Date', ctx.enochianBiblical.enochian.formatted, ctx.enochianBiblical.enochian.formatted),
    field(
      'enochian',
      'Biblical',
      'Tekufah',
      ctx.enochianBiblical.biblicalSeason.hebrewTekufah,
      ctx.enochianBiblical.biblicalSeason.hebrewTekufah
    ),
    field(
      'roman',
      'Roman',
      'Dies',
      ctx.enochianBiblical.gregorianWeekdayDeity.latinDies,
      ctx.enochianBiblical.gregorianWeekdayDeity.latinDies
    ),
    field('numerology', 'Numerology', 'Universal Day', String(ctx.numerology.universalDay), String(ctx.numerology.universalDay)),
    field('numerology', 'Numerology', 'Life Path', String(ctx.numerology.lifePathNumber), String(ctx.numerology.lifePathNumber)),
    field(
      'vedic',
      'Vedic',
      'Nakshatra',
      ctx.vedic?.nakshatraName || '—',
      ctx.vedic?.nakshatraName || '—'
    ),
    field(
      'vedic',
      'Vedic',
      'Tithi',
      ctx.vedic?.tithiName || '—',
      ctx.vedic?.tithiName || '—'
    ),
    field(
      'gene_keys',
      'Gene Keys',
      'Sun Gate',
      `${ctx.geneKeysSun.gate}.${ctx.geneKeysSun.line} ${ctx.geneKeysSun.name}`,
      `${ctx.geneKeysSun.gate}.${ctx.geneKeysSun.line} ${ctx.geneKeysSun.name}`
    ),
    field(
      'tribes',
      'Twelve Tribes',
      'Strongest Archetypal Alignment',
      `${ctx.synthesis.topResonatingTribe.tribe} (${ctx.synthesis.topResonatingTribe.affinityScore}%)`,
      `${ctx.synthesis.topResonatingTribe.tribe} (${ctx.synthesis.topResonatingTribe.affinityScore}%)`
    ),
    field('sky', 'Ephemeris', 'Sun Sign', sun?.zodiacSign || '—', sun?.zodiacSign || '—'),
    field('sky', 'Ephemeris', 'Moon Sign', moon?.zodiacSign || '—', moon?.zodiacSign || '—'),
    field(
      'sky',
      'Ephemeris',
      'Sun Longitude',
      sun ? sun.eclipticLongitude.toFixed(2) : '—',
      sun ? sun.eclipticLongitude.toFixed(2) : '—'
    ),
    field(
      'methodology',
      'Methodology',
      'Correlation',
      ctx.methodology.calendarCorrelation,
      ctx.methodology.calendarCorrelation
    ),
    field('methodology', 'Methodology', 'Ayanamsha', ctx.methodology.ayanamsha, ctx.methodology.ayanamsha)
  ];
}

/**
 * Diff two calculation contexts system-by-system.
 */
export function computeWhatChanged(
  from: CompleteCalculationContext,
  to: CompleteCalculationContext,
  labels?: { fromLabel?: string; toLabel?: string }
): WhatChangedReport {
  const fromSnap = snapshot(from);
  const toSnap = snapshot(to);
  const paired: WhatChangedField[] = fromSnap.map((f, i) => {
    const t = toSnap[i];
    return field(f.systemId, f.systemName, f.label, f.before, t?.after ?? t?.before ?? '—');
  });

  // Methodology-dependent flag when correlation/ayanamsha differ
  const methodChanged =
    from.methodology.calendarCorrelation !== to.methodology.calendarCorrelation ||
    from.methodology.ayanamsha !== to.methodology.ayanamsha;

  const changed = paired
    .filter((p) => p.status === 'changed')
    .map((p) =>
      methodChanged && (p.systemId === 'mayan' || p.systemId === 'vedic')
        ? { ...p, status: 'methodology_dependent' as const }
        : p
    );
  const unchanged = paired.filter((p) => p.status === 'unchanged');

  const changedSystems = new Set(changed.map((c) => c.systemName));
  const convergenceNotes: string[] = [];
  const tensionNotes: string[] = [];

  if (changedSystems.has('Maya') && changedSystems.has('Dreamspell')) {
    convergenceNotes.push('Maya and Dreamspell both moved — 260-day loom shifted together.');
  }
  if (changedSystems.has('Chinese') && changedSystems.has('Egyptian')) {
    convergenceNotes.push('Chinese and Egyptian seasonal language both changed — solar-season clocks moved.');
  }
  if (changedSystems.has('Vedic') && changedSystems.has('Ephemeris')) {
    convergenceNotes.push('Vedic lunar markers and tropical sky both registered change.');
  }
  if (changedSystems.has('Twelve Tribes') && !changedSystems.has('Numerology')) {
    tensionNotes.push('Archetypal tribe alignment shifted while Life Path stayed stable — daily scoring weather, not identity rewrite.');
  }
  if (changedSystems.has('Maya') && changedSystems.has('Chinese')) {
    const maya = changed.find((c) => c.systemId === 'mayan' && c.label === 'Tzolkʼin');
    const chi = changed.find((c) => c.systemId === 'chinese' && c.label === 'Dominant Element');
    if (maya && chi) {
      tensionNotes.push(`Maya day-sign moved (${maya.before} → ${maya.after}) while Chinese element moved (${chi.before} → ${chi.after}) — read as fork weather, not a single verdict.`);
    }
  }

  const stabilityNotes = [
    `${unchanged.length} fields remained stable across the comparison.`,
    unchanged.some((u) => u.label === 'Life Path')
      ? 'Life Path unchanged — durable natal number signature held.'
      : 'Life Path differed — check whether birth input changed.'
  ];

  const fromLabel =
    labels?.fromLabel || `${from.input.dateString} ${from.input.timeString}`;
  const toLabel = labels?.toLabel || `${to.input.dateString} ${to.input.timeString}`;

  const summary = `WHAT CHANGED — ${fromLabel} → ${toLabel}
Changed: ${changed.length} · Unchanged: ${unchanged.length}
Systems in motion: ${[...changedSystems].join(', ') || 'none'}
${convergenceNotes[0] || 'No multi-system convergence note.'}
${tensionNotes[0] || 'No sharp interpretive tension flagged.'}`;

  return {
    fromLabel,
    toLabel,
    fromCalculationId: from.calculationId,
    toCalculationId: to.calculationId,
    changed,
    unchanged,
    convergenceNotes,
    tensionNotes,
    stabilityNotes,
    summary
  };
}

/** Birth-time sensitivity: stable vs sensitive fields across a window */
export function birthTimeSensitivity(
  startCtx: CompleteCalculationContext,
  endCtx: CompleteCalculationContext
): { stable: WhatChangedField[]; sensitive: WhatChangedField[]; summary: string } {
  const report = computeWhatChanged(startCtx, endCtx, {
    fromLabel: `Birth window start ${startCtx.input.timeString}`,
    toLabel: `Birth window end ${endCtx.input.timeString}`
  });
  return {
    stable: report.unchanged,
    sensitive: report.changed,
    summary: `SENSITIVITY ANALYSIS — Across the stated birth-time window:
Stable: ${report.unchanged.length} fields
Sensitive: ${report.changed.length} fields
These results remain unchanged across your stated birth-time range vs those that change substantially.`
  };
}
