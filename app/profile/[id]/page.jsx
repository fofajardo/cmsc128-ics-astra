"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { PersonalInfo } from "@/components/profile/sections/PersonalInfo";
import { TechnicalSkills } from "@/components/profile/sections/TechnicalSkills";
import { FieldsOfInterest } from "@/components/profile/sections/FieldsOfInterest";
import { Experience } from "@/components/profile/sections/Experience";
import { Affiliations } from "@/components/profile/sections/Affiliations";
import AddAffiliationModal from "@/components/profile/modals/AddAffiliationModal";
import AffiliationModal from "@/components/profile/modals/AffiliationModal";
import { useUser } from "@/components/UserContext.jsx";
import nationalities from "i18n-nationality";
import nationalities_en from "i18n-nationality/langs/en.json";

nationalities.registerLocale(nationalities_en);

export default function Page() {
  const context = useUser();
  const [isShowAffiliationForm, setIsShowAffiliationForm] = useState(false);
  const [isShowAddAffiliationForm, setIsShowAddAffiliationForm] = useState(false);

  {/* Disables background scrolling */}
  useEffect(() => {
    const isAnyModalOpen =
      isShowAffiliationForm ||
      isShowAddAffiliationForm;

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    isShowAffiliationForm,
    isShowAddAffiliationForm
  ]);

  const technicalSkills = (context.state.profile.skills?.trim() ?? "") === ""
    ? []
    : context.state.profile.skills.split(",").map(function(skill) {
      return { text: skill };
    });

  const fieldOfInterests = (context.state.profile.interests?.trim() ?? "") === ""
    ? []
    : context.state.profile.interests.split(",").map(function(interest) {
      return { text: interest };
    });

  const affiliations = context.state.organizationAffiliations
    ? context.state.organizationAffiliations.map((affiliation) => {
      return {
        organization: affiliation.organizations.name,
        title: affiliation.role,
        location: affiliation.organizations.location,
        startDate: affiliation.joined_date,
        endDate: affiliation.end_date,
        description: affiliation.description,
        isCurrent: affiliation.is_current,
      };
    })
    : [];

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
              technicalSkills={technicalSkills}
            />

            <FieldsOfInterest
              context={context}
              fieldOfInterests={fieldOfInterests}
            />

            <Experience
              context={context}
            />

            <Affiliations
              affiliations={affiliations}
              setIsShowAffiliationForm={setIsShowAffiliationForm}
              setIsShowAddAffiliationForm={setIsShowAddAffiliationForm}
            />
          </>
        )}
      </main>

      {/* Modal Forms */}
      {isShowAffiliationForm && (
        <AffiliationModal
          affiliations={affiliations}
          onClose={() => setIsShowAffiliationForm(false)}
        />
      )}

      {isShowAddAffiliationForm && (
        <AddAffiliationModal
          onClose={() => setIsShowAddAffiliationForm(false)}
        />
      )}
    </div>
  );
}
