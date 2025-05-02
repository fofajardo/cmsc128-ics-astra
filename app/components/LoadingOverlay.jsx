"use client";

import {LoadingSpinner} from "@/components/LoadingSpinner.jsx";

export default function LoadingOverlay({loading, coverContainer = false}) {
  if (!loading) {
    return null;
  }

  const overlayClass = coverContainer
    ? "absolute inset-0 z-50 flex items-center justify-center bg-white/80"
    : "fixed inset-0 z-50 flex items-center justify-center bg-white/80";

  return (
    <div className={overlayClass}>
      <LoadingSpinner className="w-16 h-16"/>
    </div>
  );
}
