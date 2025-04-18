"use client";
import React, { useState } from "react";
import EditPersonal from './EditPersonal/page';
import EditTechnical from './EditTechnical/page';
import EditInterest from './EditInterest/page';
import EditExperience from './EditExperience/page';
import EditAffiliation from './EditAffiliation/page';
import AddAffiliation from './AddAffiliation/page';
import AddExperience from './AddExperience/page';



export default function AlumniProfilePage() {
  const profileData = {
    FirstName: "Juan Miguel",
    MiddleName: "Ramirez",
    LastName: "Dela Cruz",
    StudentID: "2017-00001",
    Title: "Mr",
    Gender: "Female",
    IsMaidenName: false,
    Birthdate: "2000/05/08",
    PlaceofBirth: "Manila",
    CivilStatus: "Single",
    Citizenship: "Philippines",
    Degree: "BS Computer Science",
    GraduationYear: "2021",
  };

  const technicalSkills = ["Frontend", "Database", "Figma", "Python"];

  const fieldOfInterests = [
    "Artificial Intelligence",
    "Web Development",
    "UI/UX Design",
    "Cybersecurity",
  ];

  const colors = [
    "bg-pink-100 border-pink-500 text-pink-800",
    "bg-blue-100 border-blue-500 text-blue-800",
    "bg-green-100 border-green-500 text-green-800",
    "bg-violet-100 border-violet-500 text-violet-800",
  ];

  const experiences = [
    {
      company: "Department of Information and Communications Technology",
      title: "Full-Stack Web Developer",
      type: "Full-time",
      startDate: "August 2021",
      endDate: "Present",
      location: "Makati, Philippines",
      locationType: "On-site",
      description:
        "Assisted in the design and development of responsive and intuitive user interfaces (UI) and user experiences (UX) for web applications. Collaborated with backend developers to integrate frontend components with server-side logic and APIs.",
    },
    {
      company: "Tech Solutions Inc.",
      title: "Frontend Developer",
      type: "Part-time",
      startDate: "June 2020",
      endDate: "July 2021",
      location: "Quezon City, Philippines",
      locationType: "Remote",
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
      endDate: "Present",
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
  ];

  const toggleSection = (setterFunction) => {
    setterFunction((prevState) => !prevState);
  };

  const [showTechnicalSkills, setShowTechnicalSkills] = useState(true);
  const [showFieldOfInterests, setShowFieldOfInterests] = useState(true);
  const [showExperiences, setShowExperiences] = useState(true);
  const [showAffiliations, setShowAffiliations] = useState(true);

  const [isShowPersonalForm, setisShowPersonalForm] = useState(false);
  const showPersonalForm = () => setisShowPersonalForm(true);
  const hidePersonalForm = () => setisShowPersonalForm(false);

  const [isShowTechnicalForm, setisShowTechnicalForm] = useState(false);
  const showTechnicalForm = () => setisShowTechnicalForm(true);
  const hideTechnicalForm = () => setisShowTechnicalForm(false);

  const [isShowInterestForm, setisShowInterestForm] = useState(false);
  const showInterestForm = () => setisShowInterestForm(true);
  const hideInterestForm = () => setisShowInterestForm(false);

  const [isShowExperienceForm, setisShowExperienceForm] = useState(false);
  const showExperienceForm = () => setisShowExperienceForm(true);
  const hideExperienceForm = () => setisShowExperienceForm(false);

  const [isShowAffiliationForm, setisShowAffiliationForm] = useState(false);
  const showAffiliationForm = () => setisShowAffiliationForm(true);
  const hideAffiliationForm = () => setisShowAffiliationForm(false);

  const [isShowAddExperienceForm, setisShowAddExperienceForm] = useState(false)
  const showAddExperienceForm = () => setisShowAddExperienceForm(true)
  const hideAddExperienceForm = () => setisShowAddExperienceForm(false)
  
  const [isShowAddAffiliationForm, setisShowAddAffiliationForm] = useState(false)
  const showAddAffiliationForm = () => setisShowAddAffiliationForm(true)
  const hideAddAffiliationForm = () => setisShowAddAffiliationForm(false)


  return (
    <div className="p-5 flex flex-col justify-center items-center min-h-screen bg-gray-100 space-y-5">

      {/* Profile Information */}
      <div className="profile-card w-full max-w-3xl p-5 sm:p-10 bg-white rounded-lg shadow-md flex flex-wrap sm:flex-nowrap items-center space-y-5 sm:space-y-0 sm:space-x-20">
        <div className="flex justify-center w-full sm:w-auto">
          <img
            src="https://via.placeholder.com/150"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-gray-300"
          />
        </div>
  
        <div className="w-full sm:w-auto">
          <div className="flex items-center justify-left pb-5">
            <h1 className="text-xl font-bold text-center sm:text-left">Alumni Profile</h1>
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 ml-4"
              onClick={showPersonalForm}
            >
              Edit Profile
            </button>
          </div>
  
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-10">
            {Object.entries(profileData)
              .filter(([key]) => key !== "IsMaidenName")
              .map(([key, value]) => (
                <div key={key}>
                  <p>{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="font-semibold text-gray-700">{value}</p>
                </div>
            ))}
          </div>
  
          {isShowPersonalForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-30">
              <div className="p-10 bg-white rounded-lg shadow-lg relative">
                <EditPersonal
                  profileData={profileData}
                  hidePersonalForm={hidePersonalForm}
                />
              </div>
            </div>
        )}
   
      </div>
    </div>

    {/* Technical Skills Section */}
    <div className="profile-card p-5 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-center text-gray-800">Technical Skills</h1>
        <div className="flex items-center space-x-3">
          <button onClick={() => toggleSection(setShowTechnicalSkills)} className="text-gray-500">
            <i
              className={`fa-solid fas fa-chevron-${showTechnicalSkills ? "up" : "down"} text-xl font-bold text-black`}
            ></i>
          </button>
        </div>
      </div>
      {showTechnicalSkills && (
        <div className="mt-4 flex flex-wrap gap-3">
          {technicalSkills.map((skill, index) => (
            <div key={index} className={`p-2 rounded-lg border-2 ${colors[index % colors.length]}`}>
              {skill}
            </div>
          ))}
          <button onClick={showTechnicalForm} className="text-gray-500">
            <i className="fa-solid fa-plus-circle text-xl font-bold text-[#0e6cf3]"></i>
          </button>
        </div>
      )}
      {isShowTechnicalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-30">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <EditTechnical technicalSkills={technicalSkills} hideTechnicalForm={hideTechnicalForm} />
          </div>
        </div>
      )}
    </div>

    <div className="profile-card p-5 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-center text-gray-800">Field of Interests</h1>
        <div className="flex items-center space-x-3">
          <button onClick={() => toggleSection(setShowFieldOfInterests)} className="text-gray-500">
            <i
              className={`fa-solid fas fa-chevron-${showFieldOfInterests ? "up" : "down"} text-xl font-bold text-black`}
            ></i>
          </button>
        </div>
      </div>
      {showFieldOfInterests && (
        <div className="mt-4 flex flex-wrap gap-3">
          {fieldOfInterests.map((skill, index) => (
            <div key={index} className={`p-2 rounded-lg border-2 ${colors[index % colors.length]}`}>
              {skill}
            </div>
          ))}
          <button onClick={showInterestForm} className="text-gray-500">
            <i className="fa-solid fa-plus-circle text-xl font-bold text-[#0e6cf3]"></i>
          </button>
        </div>
      )}
      {isShowInterestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-30">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <EditInterest fieldOfInterests={fieldOfInterests} hideInterestForm={hideInterestForm} />
          </div>
        </div>
      )}
    </div>

    <div className="profile-card p-5 bg-white rounded-lg shadow-md w-full max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-center text-gray-800">Work Experience</h1>
        <button onClick={() => toggleSection(setShowExperiences)} className="text-gray-500">
          <i
            className={`fa-solid fas fa-chevron-${showExperiences ? "up" : "down"} text-xl font-bold text-black`}
          ></i>
        </button>
      </div>
      {showExperiences && (
        <div className="mt-4 relative pl-3">
          <div
            className="absolute left-3 top-3 w-0.5 bg-[#0e6cf3]"
            style={{
              height: experiences.length > 0 ? `calc(100% - ${experiences.length > 1 ? "80px" : "60px"})` : "0",
            }}
          ></div>
          {experiences.map((experience, index) => (
            <div key={index} className="mb-10 ml-6 mr-10 relative">
              <div className="absolute w-6 h-6 bg-white rounded-full -left-6 top-3 flex items-center justify-center border-2 border-[#0e6cf3] z-10">
                <div className="w-3 h-3 bg-[#0e6cf3] rounded-full"></div>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{experience.company}</h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <p>{experience.title}</p>
                <span>•</span>
                <p>{experience.type}</p>
              </div>
              <p className="text-sm text-gray-500">
                {experience.startDate} - {experience.endDate}
              </p>
              <p className="text-sm text-gray-500">
                {experience.location} <span>•</span> {experience.locationType}
              </p>
              <p className="mt-2 text-gray-600">{experience.description}</p>
            </div>
          ))}
          <div className="mt-4 ml-6 flex justify-end space-x-3">
            <button
              className="flex items-center space-x-2 border-1 p-2 rounded-lg bg-[#e2f0fd] border-[#68a9da] text-[#062441]"
              onClick={showAddExperienceForm}
            >
              <i className="fa-solid fa-plus text-[#0e6cf3] text-xl"></i>
              <span className="text-sm font-medium">Add Experience</span>
            </button>
            <button
              className="flex items-center space-x-2 border-1 p-2 rounded-lg bg-[#e2f0fd] border-[#68a9da] text-[#062441]"
              onClick={showExperienceForm}
            >
              <i className="fa-solid fa-edit text-[#0e6cf3] text-xl"></i>
              <span className="text-sm font-medium">Edit Experience</span>
            </button>
          </div>
        </div>
      )}

      {isShowExperienceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-30">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <EditExperience experiences={experiences} hideExperienceForm={hideExperienceForm} />
          </div>
        </div>
      )}

      {isShowAddExperienceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-30">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <AddExperience hideAddExperienceForm={hideAddExperienceForm} />
          </div>
        </div>
      )}
    </div>

    <div className="profile-card p-5 bg-white rounded-lg shadow-md w-full max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-center text-gray-800">Organization Affiliations</h1>
        <button onClick={() => toggleSection(setShowAffiliations)} className="text-gray-500">
          <i
            className={`fa-solid fas fa-chevron-${showAffiliations ? "up" : "down"} text-xl font-bold text-black`}
          ></i>
        </button>
      </div>
      {showAffiliations && (
        <div className="mt-4 relative pl-3">
          <div
            className="absolute left-3 top-3 w-0.5 bg-[#0e6cf3]"
            style={{
              height: affiliations.length > 0 ? `calc(100% - ${affiliations.length > 1 ? "80px" : "60px"})` : "0",
            }}
          ></div>
          {affiliations.map((affiliation, index) => (
            <div key={index} className="mb-10 ml-6 mr-10 relative">
              <div className="absolute w-6 h-6 bg-white rounded-full -left-6 top-3 flex items-center justify-center border-2 border-[#0e6cf3] z-10">
                <div className="w-3 h-3 bg-[#0e6cf3] rounded-full"></div>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{affiliation.organization}</h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <p>{affiliation.title}</p>
              </div>
              <p className="text-sm text-gray-500">
                {affiliation.location} <span>•</span>{" "}
                {affiliation.isCurrentlyAffiliated ? "Currently Affiliated" : "Not Affiliated"}
              </p>
              <p className="text-sm text-gray-500">
                {affiliation.startDate} - {affiliation.endDate}
              </p>
              <p className="mt-2 text-gray-600">{affiliation.description}</p>
            </div>
          ))}
          <div className="mt-4 ml-6 flex justify-end space-x-3">
            <button
              className="flex items-center space-x-2 border-1 p-2 rounded-lg bg-[#e2f0fd] border-[#68a9da] text-[#062441]"
              onClick={showAddAffiliationForm}
            >
              <i className="fa-solid fa-plus text-[#0e6cf3] text-xl"></i>
              <span className="text-sm font-medium">Add Affiliation</span>
            </button>
            <button
              className="flex items-center space-x-2 border-1 p-2 rounded-lg bg-[#e2f0fd] border-[#68a9da] text-[#062441]"
              onClick={showAffiliationForm}
            >
              <i className="fa-solid fa-edit text-[#0e6cf3] text-xl"></i>
              <span className="text-sm font-medium">Edit Affiliations</span>
            </button>
          </div>
        </div>
      )}

      {isShowAffiliationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-30">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <EditAffiliation affiliations={affiliations} hideAffiliationForm={hideAffiliationForm} />
          </div>
        </div>
      )}

      {isShowAddAffiliationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-30">
          <div className="p-10 bg-white rounded-lg shadow-lg relative">
            <AddAffiliation hideAddAffiliationForm={hideAddAffiliationForm} />
          </div>
        </div>
      )}
    </div>
  </div>
  )
}
