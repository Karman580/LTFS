"use client";

import React from "react";

export function Header() {
  return (
    <header className="w-full border-b border-[#D9D9D9] bg-[#F5C400]">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center gap-4">
        {/* Logo Placement */}
        <div>
          <svg className="h-12 w-[240px] rounded shadow-sm" viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg">
            <rect width="280" height="80" fill="#facc15" />
            <circle cx="45" cy="40" r="18" fill="none" stroke="#111" strokeWidth="2.5" />
            <path d="M40 28 L34 46 L50 46" fill="none" stroke="#111" strokeWidth="3" />
            <path d="M42 34 L56 34 L50 54" fill="none" stroke="#111" strokeWidth="3" />
            <text x="75" y="48" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fontStyle="italic" fill="#111">L&amp;T Finance</text>
            <polygon points="10,65 260,65 250,75 10,75" fill="#0ea5e9" />
            <polygon points="260,65 270,65 260,75 250,75" fill="#0ea5e9" />
          </svg>
        </div>

        <div className="h-8 w-px bg-black/20 mx-2 hidden sm:block" />
        
        <h1 className="text-xl font-bold text-[#111111] hidden sm:block">
          L&T Finance Services
        </h1>
      </div>
    </header>
  );
}
