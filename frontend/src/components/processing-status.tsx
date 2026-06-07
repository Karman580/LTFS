"use client";

import React from "react";

export function ProcessingStatus() {
  return (
    <section id="processing-status" className="space-y-5">
      <h2 className="text-[#111111] text-xl font-bold border-b-2 border-[#F5C400] pb-2 inline-block">Processing Interview</h2>

      <div className="rounded-2xl border border-[#D9D9D9] bg-[#FFFFFF] p-8 shadow-sm">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated spinner */}
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-[3px] border-[#F5F5F5]" />
            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-[3px] border-transparent border-t-[#F5C400]" />
            <div className="absolute inset-2 h-12 w-12 animate-spin rounded-full border-[3px] border-transparent border-b-[#111111]" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>

          {/* Status messages */}
          <div className="space-y-2 text-center">
            <p className="text-base font-bold text-[#111111]">
              Processing Application...
            </p>
            <p className="text-sm text-[#666666]">
              Generating Customer Profile and Preparing Application Data
            </p>
          </div>

          {/* Pulsing dots */}
          <div className="flex items-center space-x-1.5">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#F5C400]" style={{ animationDelay: "0ms" }} />
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#F5C400]" style={{ animationDelay: "300ms" }} />
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#F5C400]" style={{ animationDelay: "600ms" }} />
          </div>

          <p className="text-xs text-[#666666]">
            This may take a minute depending on the recording length
          </p>
        </div>
      </div>
    </section>
  );
}
