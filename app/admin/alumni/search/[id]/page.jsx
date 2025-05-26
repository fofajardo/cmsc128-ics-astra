"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { GoBackButton } from "@/components/Buttons";
import SkillTag from "@/components/SkillTag";
import {
  MapPin,
  GraduationCap,
  Image,
  Briefcase,
  Users,
  Code,
  Lightbulb,
  Loader2
} from "lucide-react";
import TransitionSlide from "@/components/transitions/TransitionSlide";
import axios from "axios";
import { capitalizeName, formatDate } from "@/utils/format.jsx";
import {CIVIL_STATUS_LABELS} from "../../../../../common/scopes.js";
import nationalities from "i18n-nationality";
import nationalities_en from "i18n-nationality/langs/en.json";
import ProfileNotFound from "@/components/ProfileNotFound.jsx";
import ProfileLoadingState from "@/components/ProfileLoadingState.jsx";

nationalities.registerLocale(nationalities_en);

export default function AlumniSearchProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [workExperience, setWorkExperience] = useState([]);
  const [organizationAffiliations, setOrganizationAffiliations] = useState([]);
  const [graduationYear, setGraduationYear] = useState(null);
  const [course, setCourse] = useState(null);
  const [proofOfGraduation, setProofOfGraduation] = useState(null);
  const [proofLoading, setProofLoading] = useState(true);

  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, profileRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${id}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles/${id}`),
        ]);

        const userData = userRes.data.user;
        const profileData = profileRes.data.alumniProfile;

        if (!userData || !profileData) {
          setMissing(true);
          return;
        }

        profileData.birthdate = formatDate(profileData.birthdate, "long");
        profileData.graduation_date = formatDate(profileData.graduation_date, "month-year");

        setUser(userData);
        setProfile(profileData);

        // Fetch proof of graduation specifically
        try {
          const proofRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/photos/degree-proof/${id}`);
          setProofOfGraduation(proofRes?.data?.photo || null);
        } catch (error) {
          console.log("No proof of graduation found");
          setProofOfGraduation(null);
        } finally {
          setProofLoading(false);
        }
      } catch (error) {
        setMissing(true);
        return;
      }

      try {
        const [workRes, orgRes, degreeRes] = await Promise.allSettled([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/work-experiences/alum/${id}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${id}/organizations`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/degree-programs/alumni/${id}`),
        ]);

        if (workRes.status === "fulfilled") {
          const workData = workRes.value.data.work_experiences || [];
          workData.forEach((exp) => {
            exp.year_started = formatDate(exp.year_started, "month-year");
            exp.year_ended = exp.year_ended ? formatDate(exp.year_ended, "month-year") : "Present";
          });
          setWorkExperience(workData);
        }

        if (orgRes.status === "fulfilled") {
          setOrganizationAffiliations(orgRes.value.data?.affiliated_organizations || []);
        }

        if (degreeRes.status === "fulfilled") {
          if (degreeRes.value.data?.status === "OK" && degreeRes.value.data?.degreePrograms?.length > 0) {
            const sorted = [...degreeRes.value.data.degreePrograms].sort(
              (a, b) => new Date(b.year_graduated) - new Date(a.year_graduated)
            );
            setGraduationYear(new Date(sorted[0].year_graduated).getFullYear().toString());
            setCourse(sorted[0].name);
          }
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (missing) {
    return <ProfileNotFound id={id} />;
  }

  if (loading || !user || !profile) {
    return <ProfileLoadingState />;
  }

  return (
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
              src={user?.avatar_url || "https://cdn-icons-png.flaticon.com/512/145/145974.png"}
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
            <h3 className="font-lb text-astrablack">{capitalizeName(profile.first_name + " " + profile.middle_name + " " + profile.last_name)}</h3>
            <a className="block font-s text-astradark hover:underline">
              {user.email || "No email provided"}
            </a>
            <div className="flex justify-center sm:justify-start items-center font-s text-astradarkgray mt-0.5">
              <MapPin className="w-4 h-4 mr-1" />
              {profile.location || "No location specified"}
            </div>
          </div>
        </div>

        {/* right section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 w-full md:w-auto">
          {/* ID num */}
          <span className="text-xs bg-astragray text-astradarkgray px-2 py-1 rounded-full hidden md:block">
            {profile.student_num || "No ID"}
          </span>

          {/* year num badge */}
          <div className="hidden md:block">
            <span className="text-xs bg-astragray text-astradarkgray px-2 py-1 rounded-full flex items-center space-x-1">
              <GraduationCap className="w-3 h-3" />
              <span>{graduationYear || "N/A"}</span>
            </span>
          </div>

          {/* contact button */}
          {/* <button className="w-full md:w-auto text-astraprimary border-2 border-astraprimary px-10 py-0.5 font-rb rounded-md hover:bg-astraprimary hover:text-white transition">
            Contact
          </button> */}
        </div>
      </TransitionSlide>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Personal Info */}
        <TransitionSlide className="md:col-span-2 bg-white rounded-xl border border-astralightgray p-6 shadow-md">
          {/* Personal Info */}
          <div className="grid grid-cols-3 gap-y-8 text-center text-sm text-astrablack py-10">
            <div>
              <p className="font-rb">{capitalizeName(profile.first_name) || "N/A"}</p>
              <p className="text-astradarkgray">First Name</p>
            </div>
            <div>
              <p className="font-rb">{capitalizeName(profile.middle_name) || "N/A"}</p>
              <p className="text-astradarkgray">Middle Name</p>
            </div>
            <div>
              <p className="font-rb">{capitalizeName(profile.last_name) || "N/A"}</p>
              <p className="text-astradarkgray">Surname</p>
            </div>

            <div>
              <p className="font-rb">
                {(profile.honorifics) ? profile.honorifics : "N/A"}
              </p>
              <p className="text-astradarkgray">Title</p>
            </div>
            <div>
              <p className="font-rb">{profile.gender || "N/A"}</p>
              <p className="text-astradarkgray">Gender</p>
            </div>
            <div>
              <p className="font-rb">{profile.birthdate || "N/A"}</p>
              <p className="text-astradarkgray">Birthdate</p>
            </div>

            <div>
              <p className="font-rb">{CIVIL_STATUS_LABELS[profile.civil_status] || "N/A"}</p>
              <p className="text-astradarkgray">Civil Status</p>
            </div>
            <div>
              <p className="font-rb">
                {profile.citizenship ? nationalities.getName(profile.citizenship, "en") : "N/A"}
              </p>
              <p className="text-astradarkgray">Citizenship</p>
            </div>
            <div>
              <p className="font-rb">{course || "N/A"}</p>
              <p className="text-astradarkgray">Degree Program</p>
            </div>
          </div>

          {/* Experience Section */}
          <div className="mt-6">
            <h4 className="bg-astraprimary text-white px-4 py-2 rounded-t-md text-sm font-semibold">
              Experience
            </h4>
            <div className="p-4 bg-astratintedwhite rounded-b-md">
              {workExperience?.length > 0 ? (
                <div className="space-y-4">
                  {workExperience.map((experience, idx) => (
                    <div key={idx} className="border-l-4 border-astralight rounded">
                      <div className="ml-5">
                        <p className="font-semibold text-astrablack">{experience.title}</p>
                        <p className="font-semibold text-astrablack">{experience.company}</p>
                        <p className="text-astradarkgray">
                          {experience.year_started} - {experience.year_ended}
                        </p>
                        <p className="italic text-astradarkgray">{experience.location}</p>
                        <p className="italic text-astradarkgray">{experience.salary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  Icon={Briefcase}
                  message="No work experience to display"
                />
              )}
            </div>
          </div>

          {/* Affiliations Section */}
          <div className="mt-6">
            <h4 className="bg-astraprimary text-white px-4 py-2 rounded-t-md text-sm font-semibold">
              Affiliations
            </h4>
            <div className="p-4 bg-astratintedwhite rounded-b-md">
              {organizationAffiliations?.length > 0 ? (
                <div className="space-y-4">
                  {organizationAffiliations.map((affiliation, idx) => (
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
                  ))}
                </div>
              ) : (
                <EmptyState
                  Icon={Users}
                  message="No affiliations to display"
                />
              )}
            </div>
          </div>
        </TransitionSlide>

        {/* Right Column */}
        <TransitionSlide className="space-y-4">
          {/* Skills */}
          <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
            <h4 className="font-rb text-astrablack mb-0">Technical Skills</h4>
            <hr className="h-2 border-astralightgray"></hr>
            <div className="flex gap-3 flex-wrap text-sm">
              {profile.skills && profile.skills.trim() ? (
                profile.skills
                  .split(",")
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
                  })
              ) : (
                <EmptyState
                  Icon={Code}
                  message="No technical skills listed"
                />
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
            <h4 className="font-rb text-astrablack mb-0">Fields of Interest</h4>
            <hr className="h-2 border-astralightgray"></hr>
            <div className="flex gap-3 flex-wrap text-sm">
              {workExperience?.length > 0 &&
               workExperience.some(exp => exp.field && exp.field.trim()) ? (
                  workExperience
                    .filter(exp => exp.field && exp.field.trim())
                    .map((experience, idx) => {
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
                  <EmptyState
                    Icon={Lightbulb}
                    message="No fields of interest specified"
                  />
                )}
            </div>
          </div>

          {/* Proof of Graduation */}
          <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
            <h4 className="font-rb text-astrablack mb-0">Proof of Graduation</h4>
            <hr className="h-2 border-astralightgray"></hr>
            <div className="relative flex justify-center items-center h-60 bg-gray-100 rounded-md border shadow">
              {proofLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-astradarkgray">
                  <Loader2 className="w-10 h-10 animate-spin text-astraprimary" />
                  <span className="mt-2">Loading proof...</span>
                </div>
              ) : proofOfGraduation ? (
                <>
                  <img
                    src={proofOfGraduation}
                    alt="Proof of Graduation"
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-400">
                    <Image className="w-16 h-16" strokeWidth="1" />
                    <span className="mt-2">Image failed to load</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Image className="w-16 h-16" strokeWidth="1" />
                  <span className="mt-2 italic">No proof of graduation provided</span>
                </div>
              )}
            </div>
          </div>
        </TransitionSlide>
      </div>
    </div>
  );
}

// Reusable empty state component for consistent UI
const EmptyState = ({ Icon, message, className = "" }) => {
  return (
    <div className={`w-full py-4 flex flex-col items-center justify-center text-astradarkgray ${className}`}>
      <Icon className="w-10 h-10 mb-2 text-astralightgray" strokeWidth={1} />
      <p className="italic text-sm">{message}</p>
    </div>
  );
};
