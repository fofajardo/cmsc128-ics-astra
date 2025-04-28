"use client";
import * as React from 'react';
import { GoBackButton } from '@/components/Buttons';
import SkillTag from '@/components/SkillTag';
import { alumniData } from '@/components/DummyDataSearch'; // Import your alumni data
import { Mail, MapPin, GraduationCap, Image as LucideImage } from "lucide-react";
import TransitionSlide from '@/components/transitions/TransitionSlide';

export default function AlumniSearchProfile({ params }) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  // Find the alumnus based on the ID from the route params
  const alumnus = alumniData.find((alum) => alum.id === id);

  if (!alumnus) {
    return <div className="text-center mt-20 text-red-500">Alumnus not found.</div>;
  }

  // Split the skills string into an array if it exists
  const skillsArray = alumnus.skills ? alumnus.skills.split(', ').map(skill => skill.trim()) : [];
  const interestsArray = alumnus.interests ? alumnus.interests.split(', ').map(interest => interest.trim()) : [];

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
          <img src={alumnus.image} className="w-18 h-18 rounded-full bg-gray-200 mx-auto sm:mx-4" />

          {/* text info */}
          <div className="mt-2 sm:mt-0 text-center sm:text-left">
            <h3 className="font-lb text-astrablack">{alumnus.first_name} {alumnus.middle_name} {alumnus.last_name}</h3>
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
              <span>{new Date(alumnus.year_graduated).getFullYear()}</span>
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
              <p className="font-rb">{alumnus.birthdate}</p>
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
              {alumnus.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-astralight rounded">
                  <div className="ml-5">
                    <p className="font-semibold text-astrablack">{exp.company}</p>
                    <p className="italic text-astradarkgray">{exp.location}</p>
                    <p className="text-astradarkgray">
                      {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} -
                      {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Present'}
                    </p>
                    {exp.position && <p className="text-astradarkgray">Position: {exp.position}</p>}
                  </div>
                </div>
              ))}
              {alumnus.experience.length === 0 && <p className="text-astradarkgray italic">No experience listed.</p>}
            </div>
          </div>

          {/* Affiliations Section */}
          <div className="mt-6">
            <h4 className="bg-astraprimary text-white px-4 py-2 rounded-t-md text-sm font-semibold">
              Affiliations
            </h4>
            <div className="space-y-4 p-4 bg-astratintedwhite rounded-b-md text-sm">
              {alumnus.affiliations.map((aff, index) => (
                <div key={index} className="border-l-4 border-astralight rounded">
                  <div className="ml-5">
                    <p className="font-semibold text-astrablack">{aff.organization}</p>
                    {aff.position && <p className="italic text-astradarkgray">{aff.position}</p>}
                    <p className="text-astradarkgray">
                      {new Date(aff.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} -
                      {aff.end_date ? new Date(aff.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Present'}
                      {aff.institution && <><br />{aff.institution}</>}
                    </p>
                  </div>
                </div>
              ))}
              {alumnus.affiliations.length === 0 && <p className="text-astradarkgray italic">No affiliations listed.</p>}
            </div>
          </div>
        </TransitionSlide>

        {/* Right Column */}
        <TransitionSlide className="space-y-4">
          {/* Skills */}
          <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
            <h4 className="font-rb text-astrablack mb-0">Technical Skills</h4>
            <hr className="h-2 border-astralightgray"></hr>
            <div className="flex gap-2 justify-between flex-wrap text-sm">
              {skillsArray.map((skill, index) => (
                <SkillTag key={index} text={skill} color="bg-blue-100 text-blue-700" />
              ))}
              {skillsArray.length === 0 && <p className="text-astradarkgray italic">No skills listed.</p>}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
            <h4 className="font-rb text-astrablack mb-0">Fields of Interest</h4>
            <hr className="h-2 border-astralightgray"></hr>
            <div className="flex gap-2 justify-between flex-wrap text-sm">
              {interestsArray.map((interest, index) => (
                <SkillTag key={index} text={interest} color="bg-green-100 text-green-700" />
              ))}
              {interestsArray.length === 0 && <p className="text-astradarkgray italic">No interests listed.</p>}
            </div>
          </div>
        </TransitionSlide>
      </div>
    </div>
  );
}