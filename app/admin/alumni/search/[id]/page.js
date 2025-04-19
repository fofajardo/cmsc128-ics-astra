import * as React from 'react'
import { GoBackButton } from '@/components/Buttons'
import SkillTag from '@/components/SkillTag'
import { users, alumniProfiles } from '@/components/DummyData'
import { Mail, MapPin, GraduationCap, Image } from "lucide-react";

export default function AlumniSearchProfile({ params }) {
  const {id} = params

  const user = users.find((u) => u.id === id);
  const profile = alumniProfiles.find((p) => p.alum_id === id);


  if (!user || !profile) {
    return <div className="text-center mt-20 text-red-500">Alumnus not found.</div>;
  }

  return (
    <div className="p-4 bg-astradirtywhite min-h-screen">
      <div className="pb-2">
        <GoBackButton />
      </div>
      {/* PROFILE SECTION */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between bg-white border border-astralightgray rounded-xl px-6 py-4 shadow-sm gap-4">
        {/* left section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full md:w-auto">
          {/* avatar placeholder */}
          <img src={user.image} alt={user.first_name} className="w-18 h-18 rounded-full bg-gray-200 mx-auto sm:mx-4" />

          {/* text info */}
          <div className="mt-2 sm:mt-0 text-center sm:text-left">
            <h3 className="font-lb text-astrablack">{user.first_name} {user.middle_name} {user.last_name}</h3>
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
            <span>{new Date(profile.year_graduated).getFullYear()}</span>
          </span>
          </div>

        {/* contact button */}
        <button className="w-full md:w-auto text-astraprimary border-2 border-astraprimary px-10 py-0.5 font-rb rounded-md hover:bg-astraprimary hover:text-white transition">
          Contact
        </button>
        </div>
      </div>


      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Left Column: Personal Info */}
      <div className="md:col-span-2 bg-white rounded-xl border border-astralightgray p-6 shadow-md">
        {/* Personal Info */}
        <div className="grid grid-cols-3 gap-y-8 text-center text-sm text-astrablack py-10">
          <div>
            <p className="font-rb">{user.first_name}</p>
            <p className="text-astradarkgray">First Name</p>
          </div>
          <div>
            <p className="font-rb">{user.middle_name || "N/A"}</p>
            <p className="text-astradarkgray">Middle Name</p>
          </div>
          <div>
            <p className="font-rb">{user.last_name}</p>
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
            <p className="font-rb">Single</p>
            <p className="text-astradarkgray">Civil Status</p>
          </div>
          <div>
            <p className="font-rb">{profile.citizenship}</p>
            <p className="text-astradarkgray">Citizenship</p>
          </div>
          <div>
            <p className="font-rb">BS Computer Science</p>
            <p className="text-astradarkgray">Degree Program</p>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mt-6">
          <h4 className="bg-astraprimary text-white px-4 py-2 rounded-t-md text-sm font-semibold">
            Experience
          </h4>
          <div className="space-y-4 p-4 bg-astratintedwhite rounded-b-md text-sm">
            <div className="border-l-4 border-astralight rounded">
              <div className="ml-5">
                <p className="font-semibold text-astrablack">Department of Information and Communications Technology</p>
                <p className="italic text-astradarkgray">Makati, Philippines</p>
                <p className="text-astradarkgray">August 2021 - Present</p>
              </div>
            </div>
            <div className="border-l-4 border-astralight rounded">
              <div className="ml-5">
                <p className="font-semibold text-astrablack">Department of Information and Communications Technology</p>
                <p className="italic text-astradarkgray">Makati, Philippines</p>
                <p className="text-astradarkgray">August 2021 - Present</p>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliations Section */}
        <div className="mt-6">
          <h4 className="bg-astraprimary text-white px-4 py-2 rounded-t-md text-sm font-semibold">
            Affiliations
          </h4>
          <div className="space-y-4 p-4 bg-astratintedwhite rounded-b-md text-sm">
            <div className="border-l-4 border-astralight rounded">
                <div className="ml-5">
                <p className="font-semibold text-astrablack">ICS-ASTRA Development Team</p>
                <p className="italic text-astradarkgray">Frontend Developer</p>
                <p className="text-astradarkgray">August 2021 - Present<br />UPLB</p>
              </div>
            </div>
            <div className="border-l-4 border-astralight rounded">
              <div className="ml-5">
                <p className="font-semibold text-astrablack">UPLB User Experience Society</p>
                <p className="italic text-astradarkgray">Member</p>
                <p className="text-astradarkgray">August 2021 - Present<br />UPLB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Skills */}
        <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
          <h4 className="font-rb text-astrablack mb-0">Technical Skills</h4>
          <hr className="h-2 border-astralightgray"></hr>
          <div className="flex gap-2 justify-between flex-wrap text-sm">
            <SkillTag text="Frontend" color="bg-blue-100 text-blue-700" />
            <SkillTag text="Database" color="bg-pink-100 text-pink-700" />
            <SkillTag text="CSS" color="bg-blue-100 text-blue-700" />
            <SkillTag text="C" color="bg-gray-200 text-gray-700" />
            <SkillTag text="HTML" color="bg-green-100 text-green-700" />
            <SkillTag text="Database" color="bg-pink-100 text-pink-700" />
            <SkillTag text="HTML" color="bg-green-100 text-green-700" />
            <SkillTag text="CSS" color="bg-blue-100 text-blue-700" />
            <SkillTag text="C" color="bg-gray-200 text-gray-700" />
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
          <h4 className="font-rb text-astrablack mb-0">Fields of Interest</h4>
          <hr className="h-2 border-astralightgray"></hr>
          <div className="flex gap-2 justify-between flex-wrap text-sm">
            <SkillTag text="Frontend" color="bg-blue-100 text-blue-700" />
            <SkillTag text="Database" color="bg-pink-100 text-pink-700" />
            <SkillTag text="HTML" color="bg-green-100 text-green-700" />
            <SkillTag text="Frontend" color="bg-blue-100 text-blue-700" />
            <SkillTag text="CSS" color="bg-blue-100 text-blue-700" />
            <SkillTag text="C" color="bg-gray-200 text-gray-700" />
            <SkillTag text="HTML" color="bg-green-100 text-green-700" />
            <SkillTag text="CSS" color="bg-blue-100 text-blue-700" />
            <SkillTag text="HTML" color="bg-green-100 text-green-700" />
            <SkillTag text="Frontend" color="bg-blue-100 text-blue-700" />
            <SkillTag text="CSS" color="bg-blue-100 text-blue-700" />
            <SkillTag text="Database" color="bg-pink-100 text-pink-700" />
            <SkillTag text="Javascript" color="bg-yellow-100 text-yellow-700" />
          </div>
        </div>

        {/* Proof of Graduation */}
        <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
          <h4 className="font-rb text-astrablack mb-0">Proof of Graduation</h4>
          <hr className="h-2 border-astralightgray"></hr>
          <div className="flex justify-center items-center h-60 bg-gray-100 rounded-md">
            <Image className="w-16 h-16" strokeWidth="1"></Image>
          </div>
        </div>
      </div>
    </div>

    </div>
  )
}
