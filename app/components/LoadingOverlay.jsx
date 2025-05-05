"use client";

import {LoadingSpinner} from "@/components/LoadingSpinner.jsx";
import {useSignedInUser} from "@/components/UserContext.jsx";

export default function LoadingOverlay({loading, coverContainer = false, hideContainer = false}) {
  if (!loading) {
    return null;
  }

  const backgroundClass = hideContainer ? "bg-white" : "bg-white/80";
  const overlayClass = coverContainer
    ? `absolute inset-0 z-100 flex items-center justify-center ${backgroundClass}`
    : `fixed inset-0 z-100 flex items-center justify-center ${backgroundClass}`;

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
