"use client";
import { useState, useEffect } from "react";
import EditPersonal from "./EditPersonal/page";
import EditTechnical from "./EditTechnical/page";
import EditInterest from "./EditInterest/page";
import EditExperience from "./EditExperience/page";
import EditAffiliation from "./EditAffiliation/page";
import AddAffiliation from "./AddAffiliation/page";
import AddExperience from "./AddExperience/page";
import { Info, PlusCircle } from "lucide-react";
import SkillTag from "@/components/SkillTag";

export default function AlumniProfilePage() {
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

  const isVerified = false;

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
        <section className="bg-white rounded-lg px-10 py-12 mb-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Profile Picture Column */}
            <div className="flex justify-center items-center md:min-w-[200px]">
              <img
                src="/pfp.jpg"
                alt="Profile Picture"
                className="w-[180px] h-[180px] rounded-full object-cover"
              />
            </div>

            {/* Profile Info Column */}
            <div className="flex-1">
              <div className="flex justify-left gap-4 items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">Profile Information</h2>
                {isVerified && (
                  <button
                    className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white hover:bg-[var(--color-astradark)] rounded-md"
                    onClick={() => setIsShowPersonalForm(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-7">
                {Object.entries(profileData)
                  .filter(([key, value]) => {
                    const isMaidenName = key === "IsMaidenName";
                    const isNullSuffix = key === "Suffix" && value === null;
                    return !isMaidenName && !isNullSuffix;
                  })
                  .map(([key, value]) => {
                    const label =
                    key === "LastName"
                      ? profileData.IsMaidenName
                        ? "Maiden Name"
                        : "Last Name"
                      : key.replace(/([A-Z])/g, " $1");

                    return (
                      <div key={key} className="flex flex-col py-2">
                        <p className="text-sm font-semibold text-[var(--color-astrablack)] mb-1">{label}:</p>
                        <p className="text-sm text-[var(--color-astrablack)] text-left">{value}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>

        {isVerified && (
          <>
            {/* Technical Skills */}
            <section className="bg-white rounded-lg p-8 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)] mb-6">Technical Skills</h2>
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map((skill, index) => (
                  <SkillTag
                    key={index}
                    text={skill.text}
                    color={skill.color}
                  />
                ))}
                <button
                  className="p-2 bg-[(var(--color-astradirtywhite)] text-[var(--color-astraprimary)] rounded-full"
                  onClick={() => setIsShowTechnicalForm(true)}
                >
                  <PlusCircle size={20} />
                </button>
              </div>
            </section>

            {/* Fields of Interest */}
            <section className="bg-white rounded-lg p-8 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)] mb-6">Fields of Interest</h2>
              <div className="flex flex-wrap gap-2">
                {fieldOfInterests.map((interest, index) => (
                  <SkillTag
                    key={index}
                    text={interest.text}
                    color={interest.color}
                  />
                ))}
                <button
                  className="p-2 bg-[(var(--color-astradirtywhite)] text-[var(--color-astraprimary)] rounded-full"
                  onClick={() => setIsShowInterestForm(true)}
                >
                  <PlusCircle size={20} />
                </button>
              </div>
            </section>

            {/* Experience */}
            <section className="bg-white rounded-lg p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">Experience</h2>
                <div className="flex gap-2">
                  <button
                    className="text-sm md:text-base px-2 py-1 md:px-4 md:py-2 text-[var(--color-astraprimary)] border border-[var(--color-astraprimary)] hover:bg-[var(--color-astradirtywhite)] rounded-md"
                    onClick={() => setIsShowAddExperienceForm(true)}
                  >
                    Add
                  </button>
                  <button
                    className="text-sm md:text-base px-2 py-1 md:px-4 md:py-2 text-[var(--color-astraprimary)] border border-[var(--color-astraprimary)] hover:bg-[var(--color-astradirtywhite)] rounded-md"
                    onClick={() => setIsShowExperienceForm(true)}
                  >
                    Edit
                  </button>
                </div>
              </div>


              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4">
                      <div className={`w-2 h-full ${index === 0 ? "bg-[var(--color-astraprimary)]" : "bg-[var(--color-astradark)]"} rounded-full`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-[var(--color-astrablack)]">{exp.company}</h3>
                      <p className="text-sm text-[var(--color-astrablack)]">{exp.title} • {exp.type}</p>
                      <p className="text-sm text-[var(--color-astrablack)]">
                        {exp.startDate} {exp.isCurrentlyWorking ? "- Present" : `- ${exp.endDate}`}
                      </p>
                      <p className="text-[var(--color-astrablack)] text-sm md:text-md text-justify">{exp.location}</p>
                      <p className="text-[var(--color-astrablack)] text-sm md:text-md text-justify mt-2">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Organization Affiliations */}
            <section className="bg-white rounded-lg p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">Affiliations</h2>
                <div className="flex gap-2">
                  <button
                    className="text-sm md:text-base px-2 py-1 md:px-4 md:py-2 text-[var(--color-astraprimary)] border border-[var(--color-astraprimary)] hover:bg-[var(--color-astradirtywhite)] rounded-md"
                    onClick={() => setIsShowAddAffiliationForm(true)}
                  >
                    Add
                  </button>
                  <button
                    className="text-sm md:text-base px-2 py-1 md:px-4 md:py-2 text-[var(--color-astraprimary)] border border-[var(--color-astraprimary)] hover:bg-[var(--color-astradirtywhite)] rounded-md"
                    onClick={() => setIsShowAffiliationForm(true)}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {affiliations.map((aff, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4">
                      <div className={`w-2 h-full ${index === 0 ? "bg-[var(--color-astraprimary)]" : "bg-[var(--color-astradark)]"} rounded-full`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-[var(--color-astrablack)]">{aff.organization}</h3>
                      <p className="text-sm text-[var(--color-astrablack)]">{aff.title}</p>
                      <p className="text-sm text-[var(--color-astrablack)]">
                        {aff.startDate} {aff.isCurrentlyAffiliated ? "- Present" : `- ${aff.endDate}`}
                      </p>
                      <p className="text-[var(--color-astrablack)] text-sm md:text-md text-justify">
                        {aff.location} • {aff.isCurrentlyAffiliated ? "Currently Affiliated" : "Not Affiliated"}
                      </p>
                      <p className="text-[var(--color-astrablack)] text-sm md:text-md text-justify mt-2">{aff.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Modal Forms */}
      {isShowPersonalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <EditPersonal profileData={profileData} hidePersonalForm={() => setIsShowPersonalForm(false)} />
          </div>
        </div>
      )}

      {isShowTechnicalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <EditTechnical technicalSkills={technicalSkills} hideTechnicalForm={() => setIsShowTechnicalForm(false)} />
          </div>
        </div>
      )}

      {isShowInterestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <EditInterest fieldOfInterests={fieldOfInterests} hideInterestForm={() => setIsShowInterestForm(false)} />
          </div>
        </div>
      )}

      {isShowExperienceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <EditExperience experiences={experiences} hideExperienceForm={() => setIsShowExperienceForm(false)} />
          </div>
        </div>
      )}

      {isShowAffiliationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <EditAffiliation affiliations={affiliations} hideAffiliationForm={() => setIsShowAffiliationForm(false)} />
          </div>
        </div>
      )}

      {isShowAddExperienceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <AddExperience hideAddExperienceForm={() => setIsShowAddExperienceForm(false)} />
          </div>
        </div>
      )}

      {isShowAddAffiliationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <AddAffiliation hideAddAffiliationForm={() => setIsShowAddAffiliationForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
