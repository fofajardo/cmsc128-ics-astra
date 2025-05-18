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
import {CIVIL_STATUS_LABELS, SEX_LABELS} from "../../../common/scopes.js";
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

  const technicalSkills = [
    { text: "Frontend", color: "bg-blue-100 text-blue-800 border-blue-300" },
    { text: "Database", color: "bg-green-100 text-green-800 border-green-300" },
    { text: "Figma", color: "bg-pink-100 text-pink-800 border-pink-300" },
    { text: "Python", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    { text: "Java", color: "bg-red-100 text-red-800 border-red-300" },
    { text: "HTML", color: "bg-purple-100 text-purple-800 border-purple-300" },
    { text: "CSS", color: "bg-teal-100 text-teal-800 border-teal-300" },
    { text: "JavaScript", color: "bg-orange-100 text-orange-800 border-orange-300" },
    { text: "React", color: "bg-gray-100 text-gray-800 border-gray-300" },
    { text: "Node.js", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  ];

  const fieldOfInterests = [
    { text: "Artificial Intelligence", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
    { text: "Web Development", color: "bg-cyan-100 text-cyan-800 border-cyan-300" },
    { text: "UI/UX Design", color: "bg-rose-100 text-rose-800 border-rose-300" },
    { text: "Cybersecurity", color: "bg-purple-100 text-purple-800 border-purple-300" },
  ];

  const experiences = [
    {
      company: "Department of Information and Communications Technology",
      title: "Full-Stack Web Developer",
      type: "Full-time",
      startDate: "August 2019",
      endDate: null,
      location: "Makati, Philippines",
      locationType: "On-site",
      isCurrentlyWorking: true,
      description:
        "Assisted in the design and development of responsive and intuitive user interfaces (UI) and user experiences (UX) for web applications. Collaborated with backend developers to integrate frontend components with server-side logic and APIs.",
    },
    {
      company: "ICS Research and Development Center",
      title: "Intern",
      type: "Internship",
      startDate: "June 2019",
      endDate: "July 2019",
      location: "Laguna, Philippines",
      locationType: "On-site",
      isCurrentlyWorking: false,
      description:
        "Assisted in the development of a web-based application for data management. Gained hands-on experience in HTML, CSS, and JavaScript. Participated in team meetings and contributed to project discussions.",
    },
    {
      company: "Tech Solutions Inc.",
      title: "Frontend Developer",
      type: "Part-time",
      startDate: "June 2020",
      endDate: "July 2021",
      location: "Quezon City, Philippines",
      locationType: "Remote",
      isCurrentlyWorking: false,
      description:
        "Developed interactive and responsive web pages using React and Redux. Worked closely with designers to create cohesive and visually appealing user experiences. Implemented unit tests to ensure application reliability.",
    },
  ];

  const affiliations = [
    {
      organization: "Philippine Association of Computing Professionals",
      title: "Active Member",
      location: "Makati, Philippines",
      isCurrentlyAffiliated: true,
      startDate: "January 2022",
      endDate: null,
      description:
        "Participated in collaborative projects and conferences to advocate for technological advancements and computing research across the country.",
    },
    {
      organization: "Tech Innovators Guild",
      title: "Volunteer Coordinator",
      location: "Pasig City, Philippines",
      isCurrentlyAffiliated: false,
      startDate: "March 2020",
      endDate: "December 2021",
      description:
        "Organized and managed volunteer programs for community outreach initiatives focused on digital literacy education.",
    },
    {
      organization: "Philippine Association of Computing Professionals",
      title: "Active Member",
      location: "Makati, Philippines",
      isCurrentlyAffiliated: true,
      startDate: "January 2022",
      endDate: null,
      description:
        "Participated in collaborative projects and conferences to advocate for technological advancements and computing research across the country.",
    }
  ];

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
      <UserFetcher userId={id} />
      <Page />
    </UserProvider>
  );
}
