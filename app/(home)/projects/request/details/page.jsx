"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import { useProjectRequestForm } from "@/utils/hooks/useProjectRequestForm";

const RequestFundraiserDetails = () => {
  const router = useRouter();
  const { formData, updateFormData } = useProjectRequestForm();

  // Initialize states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // Load saved form data on mount
  useEffect(() => {
    if (formData) {
      if (formData.title) setTitle(formData.title);
      if (formData.description) setDescription(formData.description);
    }
  }, [formData]);

  // Handle title input change
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    if (value.length > 100) {
      setTitleError("Title cannot exceed 100 characters");
    } else {
      setTitleError("");
      updateFormData({ title: value });
    }
  };

  // Handle description input change
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    if (value.length > 1000) {
      setDescriptionError("Description cannot exceed 1000 characters");
    } else {
      setDescriptionError("");
      updateFormData({ description: value });
    }
  };

  // Check if all fields are valid and filled
  const isFormValid = title && description && !titleError && !descriptionError;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side */}
      <div className="w-full md:w-[35%] bg-astralightgray flex py-8 md:py-0">
        <div className="flex flex-col items-start space-y-4 md:space-y-6 pl-6 md:pl-10 pt-20 md:pt-60 ml-4 md:ml-6">
          {/* Header text */}
          <h2 className="text-3xl md:text-5xl text-astrablack text-left">
            Tell us about your project
          </h2>
          <p className="font-r text-astrablack text-left tracking-wide text-sm md:text-base">
            Help others understand your project<br />
            goal and why it matters to you.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full md:w-[65%] bg-astrawhite flex flex-col min-h-[50vh] md:min-h-screen">
        {/* Centered content */}
        <div className="flex-grow flex flex-col justify-center items-center px-4 md:px-0 py-8 md:py-0">
          <div className="flex flex-col items-center space-y-4 w-full md:w-[70%] mb-8">
            {/* Header */}
            <h3 className="font-l text-astrablack self-start w-full text-xl md:text-2xl">
              Describe why you&apos;re requesting the project
            </h3>
            {/* form */}
            <div className="w-full space-y-6">
              {/* Title field */}
              <div className="w-full">
                <label className="block text-astrablack font-r mb-2 text-sm md:text-base">
                  Give your project a title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter project title"
                  className={`w-full p-3 border rounded-md text-sm md:text-base ${
                    titleError ? "border-red-500" : "border-astradarkgray"
                  } focus:outline-none focus:ring-2 focus:ring-astraprimary`}
                />
                <div className="flex justify-between mt-1">
                  {titleError && (
                    <p className="text-red-500 text-xs md:text-sm">{titleError}</p>
                  )}
                  <p className="text-astradarkgray text-xs md:text-sm ml-auto">
                    {title.length}/100 characters
                  </p>
                </div>
              </div>

              {/* Description field */}
              <div className="w-full">
                <label className="block text-astrablack font-r mb-2 text-sm md:text-base">
                  Describe your project
                </label>
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter project description"
                  rows={6}
                  className={`w-full p-3 border rounded-md text-sm md:text-base ${
                    descriptionError ? "border-red-500" : "border-astradarkgray"
                  } focus:outline-none focus:ring-2 focus:ring-astraprimary resize-none`}
                />
                <div className="flex justify-between mt-1">
                  {descriptionError && (
                    <p className="text-red-500 text-xs md:text-sm">{descriptionError}</p>
                  )}
                  <p className="text-astradarkgray text-xs md:text-sm ml-auto">
                    {description.length}/1000 characters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex justify-between px-4 md:px-12 py-4 md:py-5 border-astralightgray border-t-1">
          <BackButton />
          {isFormValid ? (
            <Link href="/projects/request/photo" passHref>
              <button className="blue-button font-semibold transition cursor-pointer w-[120px] md:w-[150px] h-[45px] md:h-[55px] text-sm md:text-base">
                Continue
              </button>
            </Link>
          ) : (
            <button
              disabled
              className="bg-astradarkgray text-astrawhite font-semibold py-2 px-4 md:px-6 rounded-xl shadow cursor-not-allowed w-[120px] md:w-[150px] h-[45px] md:h-[55px] opacity-50 text-sm md:text-base"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestFundraiserDetails;