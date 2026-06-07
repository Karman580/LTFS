"use client";

import React, { useState } from "react";

interface TranscriptPanelProps {
  transcript: string;
}

export function TranscriptPanel({ transcript }: TranscriptPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="transcript-panel" className="space-y-3">
      <button
        id="toggle-transcript-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-2xl border border-[#D9D9D9] bg-[#FFFFFF] px-5 py-4 text-left transition-colors hover:bg-[#F5F5F5] shadow-sm"
      >
        <div className="flex items-center gap-2.5">
          <svg className="h-5 w-5 text-[#F5C400]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <span className="text-sm font-semibold text-[#111111]">
            Interview Transcript
          </span>
        </div>

        <svg
          className={`h-5 w-5 text-[#666666] transition-transform duration-300 ${
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
          isOpen ? "max-h-[2000px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-[#D9D9D9] bg-[#FFFFFF] p-6 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
          <div className="max-h-[500px] overflow-y-auto pr-2">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#111111]">
              {transcript}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
