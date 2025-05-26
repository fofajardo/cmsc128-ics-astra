"use client";

import { Info } from "lucide-react";
import { PersonalInfo } from "@/components/profile/sections/PersonalInfo";
import { TechnicalSkills } from "@/components/profile/sections/TechnicalSkills";
import { FieldsOfInterest } from "@/components/profile/sections/FieldsOfInterest";
import { Experience } from "@/components/profile/sections/Experience";
import { Affiliations } from "@/components/profile/sections/Affiliations";
import { useUser } from "@/components/UserContext.jsx";
import nationalities from "i18n-nationality";
import nationalities_en from "i18n-nationality/langs/en.json";
import DegreeProgramsSection from "@/components/profile/sections/DegreeProgramsSection.jsx";

nationalities.registerLocale(nationalities_en);

export default function Page() {
  const context = useUser();

  return (
    <div className="min-h-screen bg-[var(--color-astratintedwhite)]">
      <main className="container mx-auto py-8 px-4 max-w-7xl">
        {!context.state.isVerified && (
          <div className="bg-[#E2F0FD] border-2 border-[var(--color-astralight)] p-4 rounded-md mb-6 flex items-center">
            <Info className="h-5 w-5 text-[var(--color-astrablack)] mr-2 flex-shrink-0" />
            <p className="text-sm text-[var(--color-astrablack)]">
              Your profile is being verified. Kindly wait for an administrator to approve your account.
            </p>
          </div>
        )}

        <PersonalInfo context={context} />

        {context.state.isVerified && (
          <>
            <TechnicalSkills
              context={context}
            />

            <FieldsOfInterest
              context={context}
            />

            <DegreeProgramsSection
              context={context}
            />

            <Experience
              context={context}
            />

            <Affiliations
              context={context}
            />
          </>
        )}
      </main>
    </div>
  );
}
