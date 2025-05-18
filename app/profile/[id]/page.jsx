"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { PersonalInfo } from "@/components/profile/sections/PersonalInfo";
import { TechnicalSkills } from "@/components/profile/sections/TechnicalSkills";
import { FieldsOfInterest } from "@/components/profile/sections/FieldsOfInterest";
import { Experience } from "@/components/profile/sections/Experience";
import { Affiliations } from "@/components/profile/sections/Affiliations";
import AddAffiliationModal from "@/components/profile/modals/AddAffiliationModal";
import AddExperienceModal from "@/components/profile/modals/AddExperienceModal";
import AffiliationModal from "@/components/profile/modals/AffiliationModal";
import ExperienceModal from "@/components/profile/modals/ExperienceModal";
import InterestsModal from "@/components/profile/modals/InterestsModal";
import PersonalInfoModal from "@/components/profile/modals/PersonalInfoModal";
import TechnicalSkillsModal from "@/components/profile/modals/TechnicalSkillsModal";
import {UserFetcher, UserProvider, useUser} from "@/components/UserContext.jsx";
import {feRoutes} from "../../../common/routes.js";
import {
  CIVIL_STATUS_LABELS,
  EMPLOYMENT_STATUS_LABELS,
  LOCATION_TYPE_LABELS,
  SEX_LABELS
} from "../../../common/scopes.js";
import nationalities from "i18n-nationality";
import nationalities_en from "i18n-nationality/langs/en.json";
import {useParams} from "next/navigation";

nationalities.registerLocale(nationalities_en);

function Page() {
  const context = useUser();
  const [isShowPersonalForm, setIsShowPersonalForm] = useState(false);
  const [isShowTechnicalForm, setIsShowTechnicalForm] = useState(false);
  const [isShowInterestForm, setIsShowInterestForm] = useState(false);
  const [isShowExperienceForm, setIsShowExperienceForm] = useState(false);
  const [isShowAffiliationForm, setIsShowAffiliationForm] = useState(false);
  const [isShowAddExperienceForm, setIsShowAddExperienceForm] = useState(false);
  const [isShowAddAffiliationForm, setIsShowAddAffiliationForm] = useState(false);

  {/* Disables background scrolling */}
  useEffect(() => {
    const isAnyModalOpen =
      isShowPersonalForm ||
      isShowTechnicalForm ||
      isShowInterestForm ||
      isShowExperienceForm ||
      isShowAffiliationForm ||
      isShowAddExperienceForm ||
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
    isShowPersonalForm,
    isShowTechnicalForm,
    isShowInterestForm,
    isShowExperienceForm,
    isShowAffiliationForm,
    isShowAddExperienceForm,
    isShowAddAffiliationForm
  ]);

  if (!context.state.profile) {
    return (
      <div className="min-h-screen bg-[var(--color-astratintedwhite)]">
        <main className="container mx-auto py-8 px-4 max-w-7xl">
          <div className="bg-[#E2F0FD] border-2 border-[var(--color-astralight)] p-4 rounded-md mb-6 flex items-center">
            <Info className="h-5 w-5 text-[var(--color-astrablack)] mr-2 flex-shrink-0" />
            <p className="text-sm text-[var(--color-astrablack)]">
              Your profile does not yet exist. Please <Link href={feRoutes.auth.signUp()} className="text-[var(--color-astraprimary)] hover:underline">create your profile</Link> to continue.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const profileData = {
    Title: context.state.profile.honorifics,
    FirstName: context.state.profile.first_name,
    MiddleName: context.state.profile.middle_name,
    LastName: context.state.profile.last_name,
    Suffix: context.state.profile.suffix,
    Gender: context.state.profile.gender,
    SexAssignedAtBirth: SEX_LABELS[context.state.profile.sex],
    BirthDate: context.state.profile.birthdate,
    Address: context.state.profile.address,
    Citizenship: nationalities.getName(context.state.profile.citizenship, "en"),
    CivilStatus: CIVIL_STATUS_LABELS[context.state.profile.civil_status],
    StudentNumber: context.state.profile.student_num,
  };

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

  const experiences = context.state.workExperiences
    ? context.state.workExperiences.map((experience) => {
      return {
        company: experience.company,
        title: experience.title,
        type: experience.employment_type !== null ? EMPLOYMENT_STATUS_LABELS[experience.employment_type] : "",
        startDate: experience.year_started,
        endDate: experience.year_ended,
        location: experience.location,
        locationType: experience.location_type !== null ? LOCATION_TYPE_LABELS[experience.location_type] : "",
        description: experience.description,
        isCurrent: experience.is_current,
      };
    })
    : [];

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

        <PersonalInfo
          context={context}
          profileData={profileData}
          setIsShowPersonalForm={setIsShowPersonalForm}
        />

        {context.state.isVerified && (
          <>
            <TechnicalSkills
              technicalSkills={technicalSkills}
              setIsShowTechnicalForm={setIsShowTechnicalForm}
            />

            <FieldsOfInterest
              fieldOfInterests={fieldOfInterests}
              setIsShowInterestForm={setIsShowInterestForm}
            />

            <Experience
              experiences={experiences}
              setIsShowExperienceForm={setIsShowExperienceForm}
              setIsShowAddExperienceForm={setIsShowAddExperienceForm}
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
      {isShowPersonalForm && (
        <PersonalInfoModal
          profileData={profileData}
          onClose={() => setIsShowPersonalForm(false)}
        />
      )}

      {isShowTechnicalForm && (
        <TechnicalSkillsModal
          skills={technicalSkills}
          onClose={() => setIsShowTechnicalForm(false)}
        />
      )}

      {isShowInterestForm && (
        <InterestsModal
          interests={fieldOfInterests}
          onClose={() => setIsShowInterestForm(false)}
        />
      )}

      {isShowExperienceForm && (
        <ExperienceModal
          experiences={experiences}
          onClose={() => setIsShowExperienceForm(false)}
        />
      )}

      {isShowAddExperienceForm && (
        <AddExperienceModal
          onClose={() => setIsShowAddExperienceForm(false)}
        />
      )}

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

export default function WrappedPage() {
  const { id } = useParams();

  return (
    <UserProvider>
      <UserFetcher userId={id} isMinimal={false} />
      <Page />
    </UserProvider>
  );
}
