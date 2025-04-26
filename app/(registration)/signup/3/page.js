"use client"
import { useRef, useState } from "react"
import Link from "next/link"
import React from "react"

export default function EducationalInfoPage() {
  const [studentId, setStudentId] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [degreeProgram, setDegreeProgram] = useState("");
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  // Handles student ID; only allows numbers and formats as XXXX-XXXXX
  const handleStudentIdChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    // Limit to 9 characters
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    if (value.length > 4 && value.length <= 9) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    setStudentId(value);
  };

  // Handles graduation year; only allows numbers
  const handleGraduationYearChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    // Limit to 4 characters
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    setGraduationYear(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!degreeProgram || !studentId || !graduationYear || !file) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!/^\d{4}-\d{5}$/.test(studentId)) {
      setErrorMessage("Student ID must be in the format XXXX-XXXXX.");
      return;
    }

    if (!/^\d{4}$/.test(graduationYear)) {
      setErrorMessage("Graduation year must be a 4-digit number.");
      return;
    }

    // Form is valid, proceed with form submission
    setErrorMessage("");
    // Here you would proceed with form submission logic, e.g., API call
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-astratintedwhite)]">
      <div className="flex flex-1">
        <div className="w-full md:w-1/2 p-4 md:p-8 pt-12 md:pt-20 px-4 md:px-0 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Mobile View for Notice */}
            <div className="mt-12 mb-6 text-xs text-[var(--color-astrablack)] bg-white border border-gray-200 rounded-md p-4 md:hidden">
              <h2 className="font-semibold text-lg mb-3">Notice and Consent to Privacy</h2>
              <p className="mt-2">
                When uploading your proof of graduation for the University of the Philippines Los Baños (UPLB), please ensure the document is clear, legible, and in the required format (PDF, JPEG, or PNG).
              </p>
              <p className="mb-2">
                By submitting, you agree that your data will be collected and processed in accordance with the Data Privacy Act of 2012 (RA 10173).
              </p>
              <p>
                Your data will be used solely for alumni tracking and advancement, handled with confidentiality by ICS-ASTRA.
              </p>
            </div>

            <form className="space-y-4 px-4 sm:px-6 md:px-8" onSubmit={handleSubmit}>
              <h2 className="text-2xl font-semibold text-black mb-4">Educational Information</h2>
              
              {/* Degree Program */}
              <div>
                <label htmlFor="degree-program" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                  Degree Program
                </label>
                <select
                  id="degree-program"
                  name="degree-program"
                  value={degreeProgram}
                  onChange={(e) => setDegreeProgram(e.target.value)}
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-[var(--color-astrablack)]"
                >
                  <option value="">Select a degree program</option>
                  <option value="BS Computer Science">BS Computer Science</option>
                  <option value="MS Computer Science">MS Computer Science</option>
                  <option value="Master of Information Technology">Master of Information Technology</option>
                  <option value="PhD Computer Science">PhD Computer Science</option>
                </select>
              </div>

              {/* Student ID */}
              <div>
                <label htmlFor="student-id" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  id="student-id"
                  name="student-id"
                  value={studentId}
                  onChange={handleStudentIdChange}
                  placeholder="XXXX-XXXXX"
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-[var(--color-astrablack)]"
                />
              </div>

              {/* Graduation Year */}
              <div>
                <label htmlFor="graduation-year" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                  Graduation Year
                </label>
                <input
                  type="text"
                  id="graduation-year"
                  name="graduation-year"
                  value={graduationYear}
                  onChange={handleGraduationYearChange}
                  placeholder="XXXX"
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-[var(--color-astrablack)]"
                />
              </div>

              {/* Proof of Graduation */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">Proof of Graduation</label>
                <div className="flex">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-[var(--color-astrablack)] flex-1"
                  />
                  <button
                    type="button"
                    className="bg-[var(--color-astraprimary)] text-white px-4 py-1 rounded-r-md hover:bg-blue-700 transition-colors"
                    onClick={handleButtonClick}
                  >
                    Browse
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">PDF, JPEG, or PNG</p>
              </div>

              {errorMessage && <p className="text-[var(--color-astrared)] text-sm">{errorMessage}</p>}

              <p className="text-xs text-[var(--color-astrablack)] mt-4 text-center">
                By clicking "Submit," you confirm that you have read and understood this notice and consent to the
                processing of your personal data in accordance with the Data Privacy Act of 2012. Thank you for your
                cooperation!
              </p>

              <div className="flex space-x-4 mt-6">
                <Link href="/signup/2" className="flex-1">
                  <button
                    type="button"
                    className="w-full border border-[var(--color-astraprimary)] text-[var(--color-astraprimary)] bg-[var(--color-astrawhite)] py-2 px-4 rounded-md hover:bg-[var(--color-astradirtywhite)] transition-colors"
                  >
                    Back
                  </button>
                </Link>
                <button
                  type="submit"
                  className="w-full bg-[var(--color-astraprimary)] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--color-astraprimary)]"></div>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 bg-[var(--color-astraprimary)]">
          <div className="relative h-full">
            <img src="/blue-bg.png" alt="Background" className="h-full w-full object-cover" />
            <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center p-4 md:p-8 pt-12 md:pt-20">
              <h1 className="text-2xl font-bold text-white mb-4 text-justify">Notice and Consent to Privacy</h1>
              <p className="text-white text-sm mb-4 text-justify">
                When uploading your proof of graduation file for the University of the Philippines Los Baños (UPLB),
                please ensure that the document is clear, legible, and in the required format (e.g., PDF, JPEG, or PNG).
                This document serves as official verification of your academic achievement and will be used for alumni
                tracking and relations advancement.
              </p>
              <p className="text-white text-sm mb-4 text-justify">
                By proceeding with the upload, you acknowledge and agree that your personal data will be collected,
                processed, and stored in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173).
                ICS-ASTRA adheres to this law, ensuring that your information will be handled with strict
                confidentiality and used solely for the stated purpose of alumni tracking and relations advancement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}