"use client";

import React, { useCallback, useState } from "react";
import type { ProcessingResponse, ProcessingState } from "@/lib/types";
import { processAudio } from "@/lib/api";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AudioUpload } from "@/components/audio-upload";
import { ProcessingStatus } from "@/components/processing-status";
import { ApplicationForm } from "@/components/application-form";
import { AudioPlayer } from "@/components/audio-player";
import { TranscriptPanel } from "@/components/transcript-panel";

export default function Home() {
  const [state, setState] = useState<ProcessingState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ProcessingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = useCallback((file: File) => {
    setSelectedFile(file);
    setError(null);
    // Reset previous results when a new file is selected
    setResult(null);
    setState("idle");
  }, []);

  const handleProcess = useCallback(async () => {
    if (!selectedFile) return;

    setState("processing");
    setError(null);
    setResult(null);

    try {
      const response = await processAudio(selectedFile);
      setResult(response);
      setState("complete");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      setState("error");
    }
  }, [selectedFile]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-3xl space-y-8 px-6">
          <div className="text-center md:text-left space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-[#111111]">Loan Application Processing Portal</h1>
            <p className="text-[#666666]">Customer Interview Processing &amp; Application Assessment System</p>
          </div>

          {/* ── Section 1: Audio Upload ─────────────────────────── */}
          <div className="animate-fade-in-up">
            <div className="mb-4 rounded border border-[#D9D9D9] bg-[#FFFFFF] px-4 py-3 text-sm text-[#111111]">
              <span className="font-semibold text-[#111111]">Security Note:</span> Customer information is processed securely for loan application review purposes.
            </div>
            <AudioUpload
              onFileSelected={handleFileSelected}
              onProcess={handleProcess}
              selectedFile={selectedFile}
              isProcessing={state === "processing"}
            />
          </div>

          {/* ── Section 2: Processing Status ────────────────────── */}
          {state === "processing" && (
            <div className="animate-fade-in-up">
              <ProcessingStatus />
            </div>
          )}

          {/* ── Error State ──────────────────────────────────────── */}
          {state === "error" && (
            <div className="animate-fade-in-up rounded-2xl border border-[#DC2626] bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <div className="w-full">
                  <h3 className="text-sm font-semibold text-[#DC2626]">
                    Processing Temporarily Unavailable
                  </h3>
                  <p className="mt-1 text-sm text-[#666666]">
                    The application could not be processed at this time.
                  </p>
                  
                  <div className="mt-3 bg-[#F5F5F5] p-3 rounded-lg border border-[#D9D9D9]">
                    <p className="text-xs font-medium text-[#111111] mb-1">Possible Causes:</p>
                    <ul className="list-disc pl-4 text-xs text-[#666666] space-y-0.5">
                      <li>Backend processing capacity has been exhausted</li>
                      <li>Service is temporarily unavailable</li>
                      <li>Please try again later</li>
                    </ul>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-[#666666]">
                      Reference Code: <span className="font-mono">LTFS-ERR-001</span>
                    </p>
                    <button
                      onClick={handleProcess}
                      className="rounded-lg bg-[#DC2626] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Section 3: Results ───────────────────────────────── */}
          {state === "complete" && result && (
            <>
              {/* Application Form — PRIMARY OUTPUT */}
              <div className="animate-fade-in-up">
                <ApplicationForm data={result.data} />
              </div>

              {/* Audio Player */}
              {selectedFile && (
                <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                  <AudioPlayer file={selectedFile} />
                </div>
              )}

              {/* Transcript — Collapsible */}
              <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <TranscriptPanel transcript={result.data.transcript} />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
