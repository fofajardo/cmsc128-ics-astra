"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { GoBackButton } from "@/components/Buttons";
import SkillTag from "@/components/SkillTag";
// import { alumniData } from "@/components/DummyDataSearch";
import { Mail, MapPin, GraduationCap, Image as LucideImage } from "lucide-react";
import TransitionSlide from "@/components/transitions/TransitionSlide";
import axios from "axios";

export default function AlumniSearchProfile({ params }) {
  const [alumnus, setAlumnus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = params;

  useEffect(() => {
    const fetchAlumnusDetails = async () => {
      setLoading(true);
      try {
        // Fetch alumni basic info
        const profileResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles/${id}`
        );

        if (profileResponse.data.status !== "OK" || !profileResponse.data.alumni) {
          throw new Error("Alumni profile not found");
        }

        const alumnusData = profileResponse.data.alumni;

        // Fetch photo
        try {
          const photoResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/alum/${id}`
          );

          if (photoResponse.data.status === "OK" && photoResponse.data.photo) {
            alumnusData.image = photoResponse.data.photo;
          } else {
            alumnusData.image = "https://cdn-icons-png.flaticon.com/512/145/145974.png";
          }
        } catch (photoError) {
          console.log("Failed to fetch photo:", photoError);
          alumnusData.image = "https://cdn-icons-png.flaticon.com/512/145/145974.png";
        }

        // Fetch degree programs
        try {
          const degreeResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/degree-programs/alumni/${alumnusData.user_id || id}`
          );

          if (degreeResponse.data.status === "OK" && degreeResponse.data.degreePrograms?.length > 0) {
            const sortedPrograms = [...degreeResponse.data.degreePrograms].sort(
              (a, b) => new Date(b.year_graduated) - new Date(a.year_graduated)
            );

            alumnusData.degree_program = sortedPrograms[0].degree_title || "N/A";
            alumnusData.year_graduated = sortedPrograms[0].year_graduated || "N/A";
          } else {
            alumnusData.degree_program = "N/A";
            alumnusData.year_graduated = "N/A";
          }
        } catch (degreeError) {
          console.error("Failed to fetch degree programs:", degreeError);
          alumnusData.degree_program = "N/A";
          alumnusData.year_graduated = "N/A";
        }

        // Fetch work experience
        try {
          const experienceResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/work-experience/alumni/${alumnusData.user_id || id}`
          );

          if (experienceResponse.data.status === "OK" && experienceResponse.data.workExperiences) {
            alumnusData.experience = experienceResponse.data.workExperiences.map(exp => ({
              company: exp.company || "N/A",
              position: exp.position || "N/A",
              location: exp.location || "N/A",
              start_date: exp.start_date || new Date().toISOString(),
              end_date: exp.end_date || null
            }));
          } else {
            alumnusData.experience = [];
          }
        } catch (expError) {
          console.error("Failed to fetch work experience:", expError);
          alumnusData.experience = [];
        }

        // Fetch affiliations
        try {
          const affiliationsResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/affiliations/alumni/${alumnusData.user_id || id}`
          );

          if (affiliationsResponse.data.status === "OK" && affiliationsResponse.data.affiliations) {
            alumnusData.affiliations = affiliationsResponse.data.affiliations.map(aff => ({
              organization: aff.organization || "N/A",
              position: aff.position || "N/A",
              institution: aff.institution || "N/A",
              start_date: aff.start_date || new Date().toISOString(),
              end_date: aff.end_date || null
            }));
          } else {
            alumnusData.affiliations = [];
          }
        } catch (affError) {
          console.error("Failed to fetch affiliations:", affError);
          alumnusData.affiliations = [];
        }

        // Set default values for fields that might be missing
        const defaultAlumnus = {
          first_name: alumnusData.first_name || "N/A",
          middle_name: alumnusData.middle_name || "",
          last_name: alumnusData.last_name || "N/A",
          email: alumnusData.email || "N/A",
          location: alumnusData.location || "N/A",
          student_num: alumnusData.student_num || "No Student Number",
          gender: alumnusData.gender || "N/A",
          birthdate: alumnusData.birthdate || "N/A",
          civil_status: alumnusData.civil_status || "N/A",
          citizenship: alumnusData.citizenship || "N/A",
          honorifics: alumnusData.honorifics || "N/A",
          skills: alumnusData.skills || "",
          interests: alumnusData.interests || "",
          ...alumnusData
        };

        setAlumnus(defaultAlumnus);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching alumnus details:", error);
        setError(error.message || "Failed to fetch alumni details");
        setLoading(false);
      }
    };

    fetchAlumnusDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 bg-astradirtywhite min-h-screen">
        <div className="max-w-6xl mx-auto my-1">
          <GoBackButton />
        </div>
        <div className="max-w-6xl mx-auto mt-4 bg-white rounded-xl p-10 shadow-sm flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mt-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mt-2 animate-pulse"></div>
          <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mt-10">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mt-2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !alumnus) {
    return (
      <div className="p-4 bg-astradirtywhite min-h-screen">
        <div className="max-w-6xl mx-auto my-1">
          <GoBackButton />
        </div>
        <div className="text-center my-20 text-red-500">
          <h2 className="text-xl font-bold mb-2">Alumnus not found</h2>
          <p>{error || "Could not retrieve alumni details"}</p>
        </div>
      </div>
    );
  }

  const skillsArray = alumnus.skills ?
    (typeof alumnus.skills === "string" ? alumnus.skills.split(",").map(skill => skill.trim()) : alumnus.skills) : [];

  const interestsArray = alumnus.interests ?
    (typeof alumnus.interests === "string" ? alumnus.interests.split(",").map(interest => interest.trim()) : alumnus.interests) : [];

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
          <img
            src={alumnus.image || "https://cdn-icons-png.flaticon.com/512/145/145974.png"}
            alt={`${alumnus.first_name} ${alumnus.last_name}`}
            className="w-18 h-18 rounded-full bg-gray-200 mx-auto sm:mx-4 object-cover"
          />

          {/* text info */}
          <div className="mt-2 sm:mt-0 text-center sm:text-left">
            <h3 className="font-lb text-astrablack">
              {alumnus.first_name} {alumnus.middle_name} {alumnus.last_name}
            </h3>
            <a className="block font-s text-astradark hover:underline">
              {alumnus.email}
            </a>
            <div className="flex justify-center sm:justify-start items-center font-s text-astradarkgray mt-0.5">
              <MapPin className="w-4 h-4 mr-1" />
              {alumnus.location}
            </div>
          </div>
        </div>

        {/* right section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 w-full md:w-auto">
          {/* ID num */}
          <span className="text-xs bg-astragray text-astradarkgray px-2 py-1 rounded-full hidden md:block">
            {alumnus.student_num}
          </span>

          {/* year num badge */}
          <div className="hidden md:block">
            <span className="text-xs bg-astragray text-astradarkgray px-2 py-1 rounded-full flex items-center space-x-1">
              <GraduationCap className="w-3 h-3" />
              <span>
                {alumnus.year_graduated && alumnus.year_graduated !== "N/A"
                  ? new Date(alumnus.year_graduated).getFullYear()
                  : "N/A"}
              </span>
            </span>
          </div>
        </div>
      </TransitionSlide>


      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Left Column: Personal Info */}
        <TransitionSlide className="md:col-span-2 bg-white rounded-xl border border-astralightgray p-6 shadow-md">
          {/* Personal Info */}
          <div className="grid grid-cols-3 gap-y-8 text-center text-sm text-astrablack py-10">
            <div>
              <p className="font-rb">{alumnus.first_name}</p>
              <p className="text-astradarkgray">First Name</p>
            </div>
            <div>
              <p className="font-rb">{alumnus.middle_name || "N/A"}</p>
              <p className="text-astradarkgray">Middle Name</p>
            </div>
            <div>
              <p className="font-rb">{alumnus.last_name}</p>
              <p className="text-astradarkgray">Surname</p>
            </div>

            <div>
              <p className="font-rb">{alumnus.honorifics}</p>
              <p className="text-astradarkgray">Title</p>
            </div>
            <div>
              <p className="font-rb">{alumnus.gender}</p>
              <p className="text-astradarkgray">Gender</p>
            </div>
            <div>
              <p className="font-rb">
                {alumnus.birthdate && alumnus.birthdate !== "N/A"
                  ? new Date(alumnus.birthdate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-astradarkgray">Birthdate</p>
            </div>

            <div>
              <p className="font-rb">{alumnus.civil_status}</p>
              <p className="text-astradarkgray">Civil Status</p>
            </div>
            <div>
              <p className="font-rb">{alumnus.citizenship}</p>
              <p className="text-astradarkgray">Citizenship</p>
            </div>
            <div>
              <p className="font-rb">{alumnus.degree_program}</p>
              <p className="text-astradarkgray">Degree Program</p>
            </div>
          </div>

          {/* Experience Section */}
          <div className="mt-6">
            <h4 className="bg-astraprimary text-white px-4 py-2 rounded-t-md text-sm font-semibold">
              Experience
            </h4>
            <div className="space-y-4 p-4 bg-astratintedwhite rounded-b-md text-sm">
              {alumnus.experience && alumnus.experience.length > 0 ? (
                alumnus.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-astralight rounded">
                    <div className="ml-5">
                      <p className="font-semibold text-astrablack">{exp.company}</p>
                      <p className="italic text-astradarkgray">{exp.location}</p>
                      <p className="text-astradarkgray">
                        {exp.start_date ? new Date(exp.start_date).toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric"
                        }) : "N/A"} - {
                          exp.end_date
                            ? new Date(exp.end_date).toLocaleDateString("en-US", {
                              year: "numeric", month: "long", day: "numeric"
                            })
                            : "Present"
                        }
                      </p>
                      {exp.position && <p className="text-astradarkgray">Position: {exp.position}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-astradarkgray italic">No experience listed.</p>
              )}
            </div>
          </div>

          {/* Affiliations Section */}
          <div className="mt-6">
            <h4 className="bg-astraprimary text-white px-4 py-2 rounded-t-md text-sm font-semibold">
              Affiliations
            </h4>
            <div className="space-y-4 p-4 bg-astratintedwhite rounded-b-md text-sm">
              {alumnus.affiliations && alumnus.affiliations.length > 0 ? (
                alumnus.affiliations.map((aff, index) => (
                  <div key={index} className="border-l-4 border-astralight rounded">
                    <div className="ml-5">
                      <p className="font-semibold text-astrablack">{aff.organization}</p>
                      {aff.position && <p className="italic text-astradarkgray">{aff.position}</p>}
                      <p className="text-astradarkgray">
                        {aff.start_date ? new Date(aff.start_date).toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric"
                        }) : "N/A"} - {
                          aff.end_date
                            ? new Date(aff.end_date).toLocaleDateString("en-US", {
                              year: "numeric", month: "long", day: "numeric"
                            })
                            : "Present"
                        }
                        {aff.institution && <><br />{aff.institution}</>}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-astradarkgray italic">No affiliations listed.</p>
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
            <div className="flex gap-2 flex-wrap text-sm">
              {skillsArray.length > 0 ? (
                skillsArray.map((skill, index) => (
                  <SkillTag key={index} text={skill} color="bg-blue-100 text-blue-700" />
                ))
              ) : (
                <p className="text-astradarkgray italic">No skills listed.</p>
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
            <h4 className="font-rb text-astrablack mb-0">Fields of Interest</h4>
            <hr className="h-2 border-astralightgray"></hr>
            <div className="flex gap-2 flex-wrap text-sm">
              {interestsArray.length > 0 ? (
                interestsArray.map((interest, index) => (
                  <SkillTag key={index} text={interest} color="bg-green-100 text-green-700" />
                ))
              ) : (
                <p className="text-astradarkgray italic">No interests listed.</p>
              )}
            </div>
          </div>
        </TransitionSlide>
      </div>
    </div>
  );
}