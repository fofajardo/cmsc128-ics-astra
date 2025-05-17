"use client";
import React, { useState, useEffect } from "react"; // Make sure React is imported
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
import axios from "axios";

export default function AlumniProfilePage({ params }) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Fetch the profile data using the id from params
  // Still a static/dummy data
  const profileData = {
    Title: "Mr.",
    FirstName: "Juan Miguel",
    MiddleName: "Ramirez",
    LastName: "Dela Cruz",
    Suffix: "Jr.",
    Gender: "Female",
    IsMaidenName: true,
    BirthDate: "2000-05-08",
    BirthPlace: "Manila",
    Citizenship: "Philippines",
    CivilStatus: "Single",
    StudentNumber: "2017-00001",
    Degree: "BS Computer Science",
    GraduationYear: "2021",
  };

  const isVerified = true;

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

  const [isShowPersonalForm, setIsShowPersonalForm] = useState(false);
  const [isShowTechnicalForm, setIsShowTechnicalForm] = useState(false);
  const [isShowInterestForm, setIsShowInterestForm] = useState(false);
  const [isShowExperienceForm, setIsShowExperienceForm] = useState(false);
  const [isShowAffiliationForm, setIsShowAffiliationForm] = useState(false);
  const [isShowAddExperienceForm, setIsShowAddExperienceForm] = useState(false);
  const [isShowAddAffiliationForm, setIsShowAddAffiliationForm] = useState(false);

  // Fetch profile photo on component mount and when id changes
  useEffect(() => {
    fetchProfilePhoto();
  }, [id]);

  // Function to fetch profile photo
  const fetchProfilePhoto = async () => {
    setIsLoading(true);
    try {
      // console.log("Fetching photo for user ID:", id);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/alum/${id}`
      );

      // console.log("Photo response:", response.data);
      if (response.data.status === "OK" && response.data.photo) {
        setProfileImage(response.data.photo);
      } else {
        // Keep profile image as null if no photo is returned
        setProfileImage(null);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching profile photo:", err);
      setError("Failed to load profile picture");
      setProfileImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for profile picture updates
  const handleProfilePictureUpdate = () => {
    fetchProfilePhoto();
  };

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

  return (
    <div className="min-h-screen bg-[var(--color-astratintedwhite)]">
      <main className="container mx-auto py-8 px-4 max-w-7xl">
        {!isVerified && (
          <div className="bg-[#E2F0FD] border-2 border-[var(--color-astralight)] p-4 rounded-md mb-6 flex items-center">
            <Info className="h-5 w-5 text-[var(--color-astrablack)] mr-2 flex-shrink-0" />
            <p className="text-sm text-[var(--color-astrablack)]">
              Your profile is being verified. Kindly wait for an administrator to approve your account.
            </p>
          </div>
        )}

        <PersonalInfo
          profileData={profileData}
          isVerified={isVerified}
          setIsShowPersonalForm={setIsShowPersonalForm}
          profileImage={profileImage}
          userId={id}
          onUpdateProfilePicture={handleProfilePictureUpdate}
        />

        {isVerified && (
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
          alumniId ={id}
          profileData={profileData}
          onClose={() => setIsShowPersonalForm(false)}
          onUpdate={handleProfilePictureUpdate}
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
