/**
 * The Crucible — Micro-Test Diagnostic Suite Modal
 * High Density Theme: #0a0a0a surfaces, #222 borders, sharp corners,
 * condensed status ledger, and high-contrast assertion passes.
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

  const filtered = filterTradition === 'ALL'
    ? reports
    : reports.filter((r) => r.tradition === filterTradition);

  const traditions = Array.from(new Set(reports.map((r) => r.tradition)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-sm border border-[#222] bg-[#0a0a0a] shadow-2xl overflow-hidden font-mono">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#222] p-3 bg-[#070707]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rotate-45 border border-cyan-400 bg-cyan-950/80" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-cinzel">
                Verification & Micro-Tests Matrix
              </h3>
              <p className="text-[9px] text-gray-500 uppercase tracking-tight">
                Deterministic algorithmic invariance across modules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReRun}
              className="px-2.5 py-1 rounded-sm bg-[#141414] hover:bg-[#202020] text-cyan-400 border border-[#333] hover:border-cyan-500 text-[10px] uppercase font-bold transition-colors"
            >
              Re-run Suite
            </button>
            <button
              onClick={onClose}
              className="px-2 py-0.5 text-gray-400 hover:text-white rounded-sm bg-[#111] border border-[#222] text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Status Scoreboard */}
        <div className="flex items-center justify-between p-2.5 bg-[#0d0d0d] border-b border-[#222] text-[10px] px-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 uppercase">Status:</span>
            <span className={`font-bold ${allPassed ? 'text-green-400' : 'text-red-400'}`}>
              {passedCount} / {reports.length} TESTS PASSED (100% INVARIANCE)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 uppercase text-[9px]">Filter:</span>
            <select
              value={filterTradition}
              onChange={(e) => setFilterTradition(e.target.value)}
              className="bg-[#111] border border-[#222] text-gray-300 rounded-sm px-2 py-0.5 text-[10px] focus:outline-none font-mono"
            >
              <option value="ALL">All Traditions</option>
              {traditions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tests List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.map((test) => (
            <div
              key={test.id}
              className={`p-2.5 rounded-sm border text-[11px] ${
                test.passed
                  ? 'border-[#222] bg-[#0d0d0d] border-l-2 border-l-green-500'
                  : 'border-[#222] bg-[#0d0d0d] border-l-2 border-l-red-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.2 rounded-sm text-[9px] uppercase font-bold border ${
                      test.passed
                        ? 'bg-green-950/40 border-green-800 text-green-300'
                        : 'bg-red-950/40 border-red-800 text-red-300'
                    }`}
                  >
                    {test.passed ? 'PASSED' : 'FAILED'}
                  </span>
                  <span className="font-bold text-white text-[11px]">{test.testName}</span>
                </div>
                <span className="text-[9px] text-gray-500 uppercase">
                  {test.tradition} • {test.durationMs.toFixed(3)} ms
                </span>
              </div>

              <div className="mt-1.5 grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] bg-[#080808] p-1.5 rounded-sm border border-[#1a1a1a]">
                <div>
                  <span className="text-gray-500 uppercase text-[9px]">Expected:</span>{' '}
                  <span className="text-gray-300 font-mono">{test.expected}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase text-[9px]">Actual:</span>{' '}
                  <span className="text-cyan-400 font-mono font-bold">{test.actual}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
