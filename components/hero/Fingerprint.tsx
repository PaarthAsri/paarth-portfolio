"use client";

import { useState } from "react";

export default function Fingerprint() {
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleInteraction = () => {
    if (isScanning || isVerified) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true);
      setTimeout(() => setIsVerified(false), 2000);
    }, 1500);
  };

  return (
    <button
      onClick={handleInteraction}
      className="group relative inline-flex flex-col items-center gap-2 cursor-pointer"
      aria-label="Biometric verification"
    >
      <div className="relative w-14 h-14">
        <svg
          viewBox="0 0 56 56"
          className="w-full h-full"
          fill="none"
          stroke={isVerified ? "var(--color-accent)" : "var(--color-text-dim)"}
          strokeWidth="1.5"
        >
          {/* Fingerprint ridges */}
          <path d="M28 8C18 8 10 16 10 26" />
          <path d="M28 8C38 8 46 16 46 26" />
          <path d="M28 14C21 14 15 19 15 26" />
          <path d="M28 14C35 14 41 19 41 26" />
          <path d="M28 20C24 20 20 23 20 26" />
          <path d="M28 20C32 20 36 23 36 26" />
          <path d="M28 26V34" />
          <path d="M22 26C22 30 24 33 28 34" />
          <path d="M34 26C34 30 32 33 28 34" />
          <path d="M16 30C16 36 20 41 28 44" />
          <path d="M40 30C40 36 36 41 28 44" />
          <path d="M28 44V48" />
        </svg>
        {/* Scan line */}
        {isScanning && (
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div
              className="absolute left-0 right-0 h-0.5 bg-accent/60 fingerprint-scan"
            />
          </div>
        )}
      </div>
      <span
        className={`font-mono text-[10px] tracking-widest transition-colors duration-300 ${
          isVerified ? "text-accent" : "text-text-dim group-hover:text-text-secondary"
        }`}
      >
        {isVerified ? "VERIFIED" : "SCAN"}
      </span>
    </button>
  );
}
