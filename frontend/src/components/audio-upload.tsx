"use client";

import React, { useCallback, useRef, useState } from "react";

interface AudioUploadProps {
  onFileSelected: (file: File) => void;
  onProcess: () => void;
  selectedFile: File | null;
  isProcessing: boolean;
}

const ACCEPTED_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/x-m4a",
  "audio/mp4",
  "audio/m4a",
  "audio/aac",
];

const MAX_SIZE_MB = 50;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AudioUpload({
  onFileSelected,
  onProcess,
  selectedFile,
  isProcessing,
}: AudioUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback(
    (file: File) => {
      setError(null);

      // Check type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(
          `Unsupported format: ${file.type || "unknown"}. Please upload MP3, WAV, or M4A files.`
        );
        return;
      }

      // Check size
      if (file.size > MAX_SIZE_BYTES) {
        setError(
          `File too large (${formatFileSize(file.size)}). Maximum size is ${MAX_SIZE_MB} MB.`
        );
        return;
      }

      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) validateAndSet(file);
    },
    [validateAndSet]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSet(file);
    },
    [validateAndSet]
  );

  return (
    <section id="audio-upload" className="space-y-5">
      <h2 className="text-[#111111] text-xl font-bold border-b-2 border-[#F5C400] pb-2 inline-block">
        Upload Interview Recording
      </h2>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!isProcessing) fileInputRef.current?.click();
          }
        }}
        className={`
          relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center 
          rounded-2xl border-2 border-dashed transition-all duration-300
          ${
            isDragging
              ? "border-[#F5C400] bg-[#FFF8D6]"
              : "border-[#F5C400] bg-[#FFFFFF] hover:bg-[#FFF8D6]"
          }
          ${isProcessing ? "pointer-events-none opacity-50" : ""}
        `}
      >
        {/* Upload icon */}
        <div
          className={`mb-4 rounded-xl p-3 transition-colors ${
            selectedFile
              ? "bg-[#F5C400]/20 text-[#F5C400]"
              : "bg-[#F5F5F5] text-[#666666]"
          }`}
        >
          {selectedFile ? (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          ) : (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
          )}
        </div>

        {selectedFile ? (
          <div className="text-center">
            <p className="text-sm font-medium text-[#111111]">{selectedFile.name}</p>
            <p className="mt-1 text-xs text-[#666666]">
              {formatFileSize(selectedFile.size)}
            </p>
            <p className="mt-2 text-xs text-[#111111]/70">Click to change file</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-[#666666]">
              <span className="font-medium text-[#111111]">Click to upload</span>{" "}
              or drag and drop
            </p>
            <p className="mt-1.5 text-xs text-[#666666]">
              MP3, WAV, or M4A • Max {MAX_SIZE_MB} MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/x-m4a,audio/mp4"
          onChange={handleFileInput}
          className="hidden"
          id="audio-file-input"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Process button */}
      <button
        id="process-interview-btn"
        onClick={onProcess}
        disabled={!selectedFile || isProcessing}
        className={`
          w-full rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-300
          ${
            selectedFile && !isProcessing
              ? "bg-[#F5C400] text-[#111111] shadow-sm hover:bg-[#E0B300] active:scale-[0.98]"
              : "cursor-not-allowed bg-[#F5F5F5] text-[#666666] border border-[#D9D9D9]"
          }
        `}
      >
        {isProcessing ? "Processing..." : "Process Application"}
      </button>
    </section>
  );
}
