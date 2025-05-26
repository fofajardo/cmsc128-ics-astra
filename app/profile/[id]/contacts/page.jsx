"use client";

import {useUser} from "@/components/UserContext.jsx";
import BackButton from "@/components/events/IndividualEvent/BackButton.jsx";
import {ContactsSection} from "@/components/profile/sections/ContactsSection.jsx";

export default function Page() {
  const context = useUser();

  return (
    <div className="min-h-screen bg-[var(--color-astratintedwhite)]">
      <main className="container mx-auto py-8 px-4 max-w-7xl">
        <BackButton />
        {context.state.isVerified && (
          <ContactsSection
            context={context}
            editMode={true}
          />
        )}
      </main>
    </div>
  );
}
