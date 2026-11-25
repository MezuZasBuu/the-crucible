/**
 * The Crucible — Accuracy self-check modal.
 * Re-runs the built-in known-answer checks and lists the results.
 */

import React, { useState } from 'react';
import { runMicroTests } from '../engine/microTests';
import { MicroTestReport } from '../types';

interface DiagnosticMicroTestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticMicroTestsModal: React.FC<DiagnosticMicroTestsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [reports, setReports] = useState<MicroTestReport[]>(() => runMicroTests());
  const [filterTradition, setFilterTradition] = useState<string>('ALL');

  if (!isOpen) return null;

  const handleReRun = () => {
    const updated = runMicroTests();
    setReports(updated);
  };

  const allPassed = reports.every((r) => r.passed);
  const passedCount = reports.filter((r) => r.passed).length;
  const failedCount = reports.length - passedCount;

  const filtered = filterTradition === 'ALL'
    ? reports
    : reports.filter((r) => r.tradition === filterTradition);

  const traditions = Array.from(new Set(reports.map((r) => r.tradition)));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(27,31,59,0.45)] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="self-check-title"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-[color:var(--line-soft)] bg-[color:var(--surface-raised)] text-[color:var(--text-primary)] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[color:var(--line-soft)] p-4 sm:p-5">
          <div className="min-w-0 flex-1">
            <h3 id="self-check-title" className="panel-title">
              Accuracy self-check
            </h3>
            <p className="readable-muted mt-1">
              The app re-calculates a set of dates with known answers to confirm its calendar maths is working.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={handleReRun} className="cta-ghost">
              Run again
            </button>
            <button type="button" onClick={onClose} className="cta-ghost" aria-label="Close">
              Close
            </button>
          </div>
        </div>

        {/* Result summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--line-soft)] px-4 sm:px-5 py-3">
          <p
            className={`text-sm font-semibold ${
              allPassed ? 'text-[color:var(--temporal-deep)]' : 'text-[color:var(--el-fire)]'
            }`}
            role="status"
          >
            {allPassed
              ? `All ${reports.length} checks passed.`
              : `${passedCount} of ${reports.length} checks passed; ${failedCount} did not match.`}
          </p>

          <label className="flex items-center gap-2">
            <span className="text-sm text-[color:var(--text-secondary)]">Show</span>
            <select
              value={filterTradition}
              onChange={(e) => setFilterTradition(e.target.value)}
              className="field-input"
            >
              <option value="ALL">All calendars</option>
              {traditions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Checks list */}
        <ul className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
          {filtered.map((test) => (
            <li key={test.id} className="curious-box !py-3">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      test.passed
                        ? 'border-[color:var(--temporal-deep)] text-[color:var(--temporal-deep)]'
                        : 'border-[color:var(--el-fire)] text-[color:var(--el-fire)]'
                    }`}
                  >
                    {test.passed ? 'Passed' : 'Did not match'}
                  </span>
                  <span className="text-sm font-semibold text-[color:var(--text-primary)] break-words">{test.testName}</span>
                </div>
                <span className="text-xs text-[color:var(--text-muted)]">{test.tradition}</span>
              </div>

              <dl className="trad-facts mt-2">
                <dt>Known answer</dt>
                <dd className="break-words">{test.expected}</dd>
                <dt>App calculated</dt>
                <dd className={`break-words ${test.passed ? '' : 'text-[color:var(--el-fire)]'}`}>{test.actual}</dd>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
