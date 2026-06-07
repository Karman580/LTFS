"use client";

import React, { useState } from "react";

interface DeveloperViewProps {
  rawResponse: string;
  modelUsed?: string;
}

export function DeveloperView({ rawResponse, modelUsed }: DeveloperViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  let formattedJson = rawResponse;
  let parseStatus = "Valid JSON";
  let parseStatusColor = "text-green-400";

  try {
    const parsed = JSON.parse(rawResponse);
    formattedJson = JSON.stringify(parsed, null, 2);
  } catch {
    parseStatus = "Invalid JSON";
    parseStatusColor = "text-red-400";
  }

  return (
    <section id="developer-view" className="space-y-3">
      <button
        id="toggle-developer-view-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] px-5 py-4 text-left transition-colors hover:bg-amber-500/[0.06]"
      >
        <div className="flex items-center gap-2.5">
          <svg className="h-5 w-5 text-amber-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
          <span className="text-sm font-semibold text-amber-200">
            Developer View
          </span>
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-400">
            Debug
          </span>
        </div>

        <svg
          className={`h-5 w-5 text-amber-400/50 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4 rounded-2xl border border-amber-500/10 bg-white/[0.02] p-6">
          {/* Validation status */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Pydantic Validation
            </span>
            <span className={`text-xs font-semibold ${parseStatusColor}`}>
              ✓ {parseStatus}
            </span>
          </div>

          {/* Raw response */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Raw Gemini Response
            </h4>
            <div className="max-h-[400px] overflow-auto rounded-lg border border-white/[0.06] bg-black/30 p-4">
              <pre className="text-xs leading-relaxed text-slate-400">
                <code>{formattedJson}</code>
              </pre>
            </div>
          </div>

          {/* Response size */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>
              Response size:{" "}
              <span className="font-medium text-slate-400">
                {(rawResponse.length / 1024).toFixed(1)} KB
              </span>
            </span>
            <span>
              Fields:{" "}
              <span className="font-medium text-slate-400">20</span>
            </span>
          </div>
          {modelUsed && (
            <div className="flex justify-between items-center bg-amber-950/30 p-2 rounded text-amber-200">
              <span className="font-semibold text-xs text-amber-500 uppercase tracking-wider">Model Used</span>
              <span className="font-mono">{modelUsed}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
