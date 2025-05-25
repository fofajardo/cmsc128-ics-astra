"use client";

import {useUser} from "@/components/UserContext.jsx";
import BackButton from "@/components/events/IndividualEvent/BackButton.jsx";
import {Affiliations} from "@/components/profile/sections/Affiliations.jsx";

export default function Page() {
  const context = useUser();

  return (
    <div className="min-h-screen bg-[var(--color-astratintedwhite)]">
      <main className="container mx-auto py-8 px-4 max-w-7xl">
        <BackButton />
        {context.state.isVerified && (
          <Affiliations
            context={context}
            editMode={true}
          />
        )}
      </main>
    </div>
  );
}
