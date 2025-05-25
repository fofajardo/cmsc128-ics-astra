"use client";

import { Experience } from "@/components/profile/sections/Experience";
import {useUser} from "@/components/UserContext.jsx";
import BackButton from "@/components/events/IndividualEvent/BackButton.jsx";

export default function Page() {
  const context = useUser();

  return (
    <div className="min-h-screen bg-[var(--color-astratintedwhite)]">
      <main className="container mx-auto py-8 px-4 max-w-7xl">
        <BackButton />
        {context.state.isVerified && (
          <Experience
            context={context}
            editMode={true}
          />
        )}
      </main>
    </div>
  );
}
