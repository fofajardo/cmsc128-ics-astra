"use client";

import {useUser} from "@/components/UserContext.jsx";
import BackButton from "@/components/events/IndividualEvent/BackButton.jsx";
import DegreeProgramsSection from "@/components/profile/sections/DegreeProgramsSection.jsx";
import DegreeProofSection from "@/components/profile/sections/DegreeProofSection.jsx";
import React from "react";

export default function Page() {
  const context = useUser();

  return (
    <div className="min-h-screen bg-[var(--color-astratintedwhite)]">
      <main className="container mx-auto py-8 px-4 max-w-7xl">
        <BackButton />
        {context.state.isVerified && (
          <>
            <DegreeProgramsSection
              context={context}
              editMode={true}
            />
            <DegreeProofSection context={context} />
          </>
        )}
      </main>
    </div>
  );
}
