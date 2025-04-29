"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/events/IndividualEvent/BackButton";

const RequestFundraiserDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize states with URL parameters if they exist
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // Retrieve previous page data
  const amount = searchParams.get("amount");
  const zipCode = searchParams.get("zipCode");
  const targetDate = searchParams.get("targetDate");

  // Load data from URL parameters on component mount
  useEffect(() => {
    const urlTitle = searchParams.get("title");
    const urlDescription = searchParams.get("description");

    if (urlTitle) setTitle(urlTitle);
    if (urlDescription) setDescription(urlDescription);
  }, [searchParams]);

  // Update URL without navigation whenever values change
  const updateUrlParams = (key, value) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      current.set(key, value);
    } else {
      current.delete(key);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${window.location.pathname}${query}`, { scroll: false });
  };

  // Handle title input change
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    updateUrlParams("title", value);

    // Validate title is not empty
    if (!value.trim()) {
      setTitleError("Please enter a title for your fundraiser");
    } else {
      setTitleError("");
    }
  };

  // Handle description input change
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    updateUrlParams("description", value);

    // Validate description is not empty
    if (!value.trim()) {
      setDescriptionError("Please describe your need and situation");
    } else {
      setDescriptionError("");
    }
  };

  // Check if both fields are valid and filled
  const isFormValid = title.trim() && description.trim() && !titleError && !descriptionError;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/*edit left side*/}
      <div className="w-full md:w-[35%] bg-astralightgray flex py-12 md:py-0">
        <div className="flex flex-col items-start space-y-6 pl-10 pt-60 ml-6">
          {/* Header text */}
          <h2 className="text-5xl text-astrablack text-left">
            Share your story
          </h2>
          <p className="font-r text-astrablack text-left tracking-wide">
            Help others understand your fundraising<br />
            goal and why it matters to you.
          </p>
        </div>
      </div>

      {/*edit right side*/}
      <div className="w-full md:w-[65%] bg-astrawhite flex flex-col min-h-[50vh] md:min-h-screen">
        {/* Centered content */}
        <div className="flex-grow flex flex-col justify-center items-center px-4 md:px-0">
          <div className="flex flex-col items-center space-y-4 w-full md:w-[70%] mb-8">
            {/* Header */}
            <h3 className="font-l text-astrablack self-start w-full">
              Describe why you’re fundraising
            </h3>
            {/* form */}
            <div className="w-full space-y-6">
              {/* Title field */}
              <div className="w-full">
                <label className="block text-astrablack font-r mb-2">
                  Give your fundraiser a title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Help Paul attend college"
                  className={`w-full p-3 border rounded-md ${
                    titleError ? "border-red-500" : "border-astradarkgray"
                  } focus:outline-none focus:ring-2 focus:ring-astraprimary`}
                />
                {titleError && (
                  <p className="text-red-500 text-sm mt-1">{titleError}</p>
                )}
              </div>

              {/* Description field */}
              <div className="w-full">
                <label className="block text-astrablack font-r mb-2">
                  Describe your need and situation
                </label>
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Hey everyone, I'm fundraising to..."
                  rows={6}
                  className={`w-full p-3 border rounded-md resize-y min-h-[150px] ${
                    descriptionError ? "border-red-500" : "border-astradarkgray"
                  } focus:outline-none focus:ring-2 focus:ring-astraprimary`}
                />
                {descriptionError && (
                  <p className="text-red-500 text-sm mt-1">{descriptionError}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex justify-between px-6 md:px-12 py-5 border-astralightgray border-t-1">
          <BackButton />
          {isFormValid ? (
            <Link href="/projects/request/photo" passHref>
              <button className="blue-button font-semibold transition cursor-pointer w-[150px] h-[55px]">
                Continue
              </button>
            </Link>
          ) : (
            <button
              disabled
              className="bg-astradarkgray text-astrawhite font-semibold py-2 px-6 rounded-xl shadow cursor-not-allowed w-[150px] h-[55px] opacity-50"
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