"use client";
import { useState, use, useEffect } from "react";
import { GoBackButton } from "@/components/Buttons";
import SkillTag from "@/components/SkillTag";
import { Mail, MapPin, GraduationCap, Image } from "lucide-react";
import { ActionButton } from "@/components/Buttons";
import TransitionSlide from "@/components/transitions/TransitionSlide";
import axios from "axios";
import { capitalizeName, formatDate } from "@/utils/format.jsx";

const getStatusBadge = (status) => {
  const statusMap = {
    0: {text: "Pending", color: "bg-astrayellow"},
    1: {text: "Approved", color: "bg-astragreen"},
    2: {text: "Inactive", color: "bg-astrared"},
  };

  const {text, color} = statusMap[status] || {};

  return (
    <span className={`${color} text-white font-s px-3.5 py-0.5 rounded-lg w-fit mx-auto sm:mx-0 mt-1 sm:mt-0`}>
      {text}
    </span>
  );
};

export default function AlumniSearchProfile({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const [userRes, setUserRes] = useState(null);
  const [profileRes, setProfileRes] = useState(null);
  const [workExperienceRes, setWorkExperienceRes] = useState(null);
  const [organizationAffiliationsRes, setOrganizationAffiliationsRes] = useState(null);
  const [photoRes, setPhotoRes] = useState(null);
  const [degreeRes, setDegreeRes] = useState(null);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [workExperience, setWorkExperience] = useState(null);
  const [organizationAffiliations, setOrganizationAffiliations] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [graduationYear, setGraduationYear] = useState(null);
  const [course, setCourse] = useState(null);

  const [missing, setMissing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${id}`).then((value) => {
      setUserRes(value);
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles/${id}`).then((value) => {
        setProfileRes(value);
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/work-experiences/alum/${id}`).then((value) => {
          setWorkExperienceRes(value);
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/organization-affiliations/${id}/organizations`).then((value) => {
            setOrganizationAffiliationsRes(value);
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/photos/alum/${id}`).then((value) => {
              setPhotoRes(value);
              if (value.data.status === "OK" && value.data.photo) {
                setProfileImage(value.data.photo);
              }
            }).catch((error) => {
              console.log("No profile photo found:", error);
            });
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/degree-programs/alumni/${id}`).then((value) => {
              setDegreeRes(value);
              if (value.data.status === "OK" && value.data.degreePrograms?.length > 0) {
                const sortedPrograms = [...value.data.degreePrograms].sort((a, b) => {
                  return new Date(b.year_graduated) - new Date(a.year_graduated);
                });
                setGraduationYear(new Date(sortedPrograms[0].year_graduated).getFullYear().toString());
                setCourse(sortedPrograms[0].name);
              }
            }).catch((error) => {
              console.log("No degree Year Found:", error);
            });
          }).catch(() => {
            console.log("No org affiliation");
          });
        }).catch(() => {
          console.log("No work experience");
        });
      }).catch(() => {
        console.log("No alumni profile");
        setMissing(true);
      });
    }).catch(() => {
      console.log("No user");
      setMissing(true);
    });
  }, [refreshTrigger]);

  useEffect(() => {
    const localUser = userRes?.data?.user;
    const localProfile = profileRes?.data?.alumniProfile;
    const localWorkExperience = workExperienceRes?.data?.work_experiences;
    const localOrganizationAffiliations = organizationAffiliationsRes?.data?.affiliated_organizations;

    setUser(localUser);
    setProfile(localProfile);
    setWorkExperience(localWorkExperience);
    setOrganizationAffiliations(localOrganizationAffiliations);

    if (localUser == null || localProfile == null) {
      return;
    }

    localProfile.birthdate = formatDate(localProfile.birthdate, "long");
    localProfile.graduation_date = formatDate(localProfile.graduation_date, "month-year");

    // Compute status
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (!localProfile.approved) {
      localProfile.status = 0; // Pending
    } else if (new Date(localProfile.created_at) < oneYearAgo) {
      localProfile.status = 2; // Inactive
    } else {
      localProfile.status = 1; // Approved
    }

    if (localWorkExperience == null || localOrganizationAffiliations == null) {
      return;
    }

    localWorkExperience.forEach((experience) => {
      experience.year_started = formatDate(experience.year_started, "month-year");
      experience.year_ended = experience.year_ended ? formatDate(experience.year_ended, "month-year") : "Present";
    });
  }, [userRes, profileRes, workExperienceRes, refreshTrigger]);

  if (missing) {
    return <div className="text-center mt-20 text-red-500">{"Alumnus not found."}</div>;
  }

  if (!user || !profile) {
    return <div className="text-center mt-20">{"Loading..."}</div>;
  }

  const handleApprove = async () => {
    try {
      console.log(`Approving ID: ${id}.`);

      const getResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles/${id}`
      );

      const latestProfile = getResponse.data?.alumniProfile;

      if (!latestProfile) {
        return;
      }

      const {
        id: _,
        created_at: __,
        approved: ___,
        ...rest
      } = latestProfile;

      const newProfile = {
        ...rest,
        approved: true
      };

      const postResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles/${id}`,
        newProfile
      );

      if (postResponse.data.status === "CREATED") {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error(`Failed to approve ${name}:`, error);
    }
  };

  const handleRemoveAccess = async () => {
    try {
      const getResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles/${id}`
      );

      const latestProfile = getResponse.data?.alumniProfile;

      if (!latestProfile) {
        return;
      }

      const {
        id: _,
        created_at: __,
        approved: ___,
        ...rest
      } = latestProfile;

      const newProfile = {
        ...rest,
        approved: false
      };

      const postResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles/${id}`,
        newProfile
      );

      if (postResponse.data.status === "CREATED") {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error(`Failed to remove ${name}'s access:`, error);
    }
  };

  const handleReactivate = async () => {
    try {
      const getResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles/${id}`
      );

      const latestProfile = getResponse.data?.alumniProfile;

      if (!latestProfile) {
        return;
      }

      const {
        id: _,
        created_at: __,
        ...rest
      } = latestProfile;

      const newProfile = {
        ...rest
      };

      const postResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles/${id}`,
        newProfile
      );

      if (postResponse.data.status === "CREATED") {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error(`Failed to reactivate ${name}:`, error);
    }
  };

  return (
    <>
      <div className="p-4 bg-astradirtywhite min-h-screen">
        <div className="max-w-6xl mx-auto my-1">
          <GoBackButton />
        </div>
        {/* PROFILE SECTION */}
        <TransitionSlide className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between bg-white border border-astralightgray rounded-xl px-6 py-4 shadow-sm gap-4">
          {/* left section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full md:w-auto">
            {/* avatar placeholder */}
            <div className="w-18 h-18 rounded-full overflow-hidden bg-gray-200 mx-auto sm:mx-4 flex items-center justify-center">
              <img
                src={profileImage || user?.image || "https://cdn-icons-png.flaticon.com/512/145/145974.png"}
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/145/145974.png";
                }}
              />
            </div>

            {/* text info */}
            <div className="mt-2 sm:mt-0 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 justify-center sm:justify-start">
                <h3 className="font-lb text-astrablack">{capitalizeName(profile.first_name + " " + profile.middle_name + " " + profile.last_name)}</h3>
                {getStatusBadge(profile.status)}
              </div>
              <a className="block font-s text-astradark hover:underline">
                {user.email}
              </a>
              <div className="flex justify-center sm:justify-start items-center font-s text-astradarkgray mt-0.5">
                <MapPin className="w-4 h-4 mr-1" />
                {profile.location}
              </div>
            </div>
          </div>

          {/* right section */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 w-full md:w-auto">
            {/* ID num */}
            <span className="text-xs bg-astragray text-astradarkgray px-2 py-1 rounded-full hidden md:block">
              {profile.student_num}
            </span>

            {/* year num badge */}
            <div className="hidden md:block">
              <span className="text-xs bg-astragray text-astradarkgray px-2 py-1 rounded-full flex items-center space-x-1">
                <GraduationCap className="w-3 h-3" />
                <span>{graduationYear}</span>
              </span>
            </div>

            {/* contact button */}
            <button className="w-full md:w-auto text-astraprimary border-2 border-astraprimary px-10 py-0.5 font-rb rounded-md hover:bg-astraprimary hover:text-white transition">
              Contact
            </button>
          </div>
        </TransitionSlide >

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Left Column: Personal Info */}
          <TransitionSlide className="md:col-span-2 bg-white rounded-xl border border-astralightgray p-6 shadow-md">
            {/* Personal Info */}
            <div className="grid grid-cols-3 gap-y-8 text-center text-sm text-astrablack py-10">
              <div>
                <p className="font-rb">{capitalizeName(profile.first_name)}</p>
                <p className="text-astradarkgray">First Name</p>
              </div>
              <div>
                <p className="font-rb">{capitalizeName(profile.middle_name) || "N/A"}</p>
                <p className="text-astradarkgray">Middle Name</p>
              </div>
              <div>
                <p className="font-rb">{capitalizeName(profile.last_name)}</p>
                <p className="text-astradarkgray">Surname</p>
              </div>

              <div>
                <p className="font-rb">{profile.honorifics}</p>
                <p className="text-astradarkgray">Title</p>
              </div>
              <div>
                <p className="font-rb">{profile.gender}</p>
                <p className="text-astradarkgray">Gender</p>
              </div>
              <div>
                <p className="font-rb">{profile.birthdate}</p>
                <p className="text-astradarkgray">Birthdate</p>
              </div>

              <div>
                <p className="font-rb">{profile.civil_status}</p>
                <p className="text-astradarkgray">Civil Status</p>
              </div>
              <div>
                <p className="font-rb">{profile.citizenship}</p>
                <p className="text-astradarkgray">Citizenship</p>
              </div>
              <div>
                <p className="font-rb">{course}</p>
                <p className="text-astradarkgray">Degree Program</p>
              </div>
            </div>

            {/* Experience Section */}
            <div className="mt-6">
              <h4 className="bg-astraprimary text-white px-4 py-2 rounded-t-md text-sm font-semibold">
                Experience
              </h4>
              <div className="space-y-4 p-4 bg-astratintedwhite rounded-b-md text-sm">
                {workExperience?.length > 0 ? (
                  workExperience.map((experience, idx) => (
                    <div key={idx} className="border-l-4 border-astralight rounded">
                      <div className="ml-5">
                        <p className="font-semibold text-astrablack">{experience.title}</p>
                        <p className="font-semibold text-astrablack">{experience.company}</p>
                        <p className="text-astradarkgray">
                          {experience.year_started} - {experience.year_ended ? experience.year_ended : "Present"}
                        </p>
                        <p className="italic text-astradarkgray">{experience.location}</p>
                        <p className="italic text-astradarkgray">{experience.salary}</p>
                      </div>
                    </div>
                  ))) : (
                  {/*
                                      TODO: FIX DISPLAY, text div is not centered and does not flex
                                  */},
                  <div className="border-l-4 border-astralight rounded">
                    <div className="text-center mt-50 text-astradarkgray">
                      {"No work experience"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Affiliations Section */}
            <div className="mt-6">
              <h4 className="bg-astraprimary text-white px-4 py-2 rounded-t-md text-sm font-semibold">
                Affiliations
              </h4>
              <div className="space-y-4 p-4 bg-astratintedwhite rounded-b-md text-sm">
                {organizationAffiliations?.length > 0 ? (
                  organizationAffiliations.map((affiliation, idx) => (
                    <div key={idx} className="border-l-4 border-astralight rounded">
                      <div className="ml-5">
                        <p className="font-semibold text-astrablack">{affiliation.organizations.name}</p>
                        <p className="italic text-astradarkgray">{affiliation.role}</p>
                        <p className="text-astradarkgray">
                          {formatDate(affiliation.joined_date, "month-year")}
                          <br />
                          {affiliation.location}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center mt-50 text-astradarkgray">
                    {"No affiliations found."}
                  </div>
                )}
              </div>
            </div>
          </TransitionSlide >

          {/* Right Column */}
          <div  className="space-y-4">
            {/* Skills */}
            <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
              <h4 className="font-rb text-astrablack mb-0">Technical Skills</h4>
              <hr className="h-2 border-astralightgray"></hr>
              <div className="flex gap-3 flex-wrap text-sm">
                {profile.skills
                  ?.split(",")
                  .map(skill => skill.trim())
                  .filter(skill => skill.length > 0)
                  .map((skill, idx) => {
                    const colors = [
                      "bg-blue-100 text-blue-700",
                      "bg-pink-100 text-pink-700",
                      "bg-green-100 text-green-700",
                    ];
                    const color = colors[idx % colors.length];
                    return (
                      <SkillTag
                        key={idx}
                        text={skill}
                        color={color}
                      />
                    );
                  })}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
              <h4 className="font-rb text-astrablack mb-0">Fields of Interest</h4>
              <hr className="h-2 border-astralightgray"></hr>
              <div className="flex gap-3 flex-wrap text-sm">
                {workExperience?.length > 0 ? (
                  workExperience.map((experience, idx) => {
                    const colors = [
                      "bg-blue-100 text-blue-700",
                      "bg-pink-100 text-pink-700",
                      "bg-green-100 text-green-700",
                    ];
                    const color = colors[idx % colors.length];
                    return (
                      <SkillTag
                        key={idx}
                        text={experience.field}
                        color={color}
                      />
                    );
                  })
                ) : (
                  <div className="text-center mt-50 text-astradarkgray">
                    {"No particular field of interest"}
                  </div>
                )}
              </div>
            </div>

            {/* Proof of Graduation */}
            <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
              <h4 className="font-rb text-astrablack mb-0">Proof of Graduation</h4>
              <hr className="h-2 border-astralightgray"></hr>
              <div className="relative flex justify-center items-center h-60 bg-gray-100 rounded-md border shadow">
                {/* main image */}
                <img
                  src="https://media.licdn.com/dms/image/v2/D5622AQG1fAsAsQh6HQ/feedshare-shrink_800/feedshare-shrink_800/0/1722688761782?e=2147483647&v=beta&t=uINCPcGEVdl801U3Zbcg5tkbeqgKzePV0R4TT6q6q0E"
                  alt="Proof"
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />

                {/* fallback icon (hidden by default) */}
                <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-400">
                  <Image className="w-16 h-16" strokeWidth="1" />
                  <span className="mt-2">Image not available</span>
                </div>
              </div>
            </div>
            <div className='flex justify-center gap-2'>
              {profile.status === 0 && (
                <>
                  <ActionButton
                    label="Approve" color = "green" size = 'large' flex = 'flex-1'
                    notifyMessage={`${profile.first_name} ${profile.middle_name} ${profile.last_name} has been approved!`}
                    notifyType="success"
                    onClick={handleApprove}
                  />
                  <ActionButton label="Decline" color = "red" size = 'large' flex = 'flex-1'
                    notifyMessage={`${profile.first_name} ${profile.middle_name} ${profile.last_name} has been declined!`}
                    notifyType="fail"
                  />
                </>
              )}

              {profile.status === 1 && (
                <>
                  <ActionButton label="Remove Access" color = "red" size = 'large' flex = 'flex-1'
                    notifyMessage={`Access has been removed from ${profile.first_name} ${profile.middle_name} ${profile.last_name}!`}
                    notifyType="fail"
                    onClick={handleRemoveAccess}
                  />
                </>
              )}

              {profile.status === 2 && (
                <>
                  <ActionButton label="Reactivate" color = "blue" size = 'large' flex = 'flex-1'
                    notifyMessage={`${profile.first_name} ${profile.middle_name} ${profile.last_name} has been reactivated!`}
                    notifyType="success"
                    onClick={handleReactivate}
                  />
                </>
              )}
            </div>
          </div >
        </div>

      </div>
    </>
  );
}
