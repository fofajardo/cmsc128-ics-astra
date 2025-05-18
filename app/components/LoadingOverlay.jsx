"use client";

import {LoadingSpinner} from "@/components/LoadingSpinner.jsx";
import {useSignedInUser} from "@/components/UserContext.jsx";
import {cn} from "@/lib/utils.jsx";

export default function LoadingOverlay({loading, coverContainer = false, hideContainer = false, className}) {
  if (!loading) {
    return null;
  }

  const overlayClass = cn(
    "inset-0 z-100 flex items-center justify-center",
    coverContainer
      ? "absolute"
      : "fixed",
    hideContainer
      ? "bg-white"
      : "bg-white/80",
    className);

  return (
    <div className={overlayClass}>
      <LoadingSpinner className="w-16 h-16"/>
    </div>
  );
}

export function RootLoadingOverlay() {
  const user = useSignedInUser();
  return <LoadingOverlay loading={!user.state.initialized || !user.state.routeInitialized} hideContainer={true} />;
}
