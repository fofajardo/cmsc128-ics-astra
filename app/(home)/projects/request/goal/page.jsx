"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import { capitalizeName } from "@/utils/format";
import { PROJECT_TYPE } from "@/constants/projectConsts"; // TODO: Use constants for project type
import { useProjectRequestForm } from "@/utils/hooks/useProjectRequestForm";

const RequestFundraiserGoal = () => {
  const router = useRouter();
  const { formData, updateFormData } = useProjectRequestForm();

  // Initialize states
  const [amount, setAmount] = useState("");
  const [projectType, setProjectType] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [amountError, setAmountError] = useState("");
  const [projectTypeError, setProjectTypeError] = useState("");
  const [targetDateError, setTargetDateError] = useState("");

  // Load saved form data on mount and when formData
  // Initially, through url siya, now using local storage na
  useEffect(() => {
    if (formData) {
      if (formData.amount) setAmount(formData.amount);
      if (formData.projectType) setProjectType(formData.projectType);
      if (formData.targetDate) setTargetDate(formData.targetDate);
    }
  }, [formData]);

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    // Allow only valid integer input
    const validValue = value.replace(/[^0-9-]/g, ""); // Remove non-numeric characters except minus

    // Validate that it's a number
    if (value && value < 0) {
      setAmountError("Please enter a positive number");
    } else if (value && validValue !== value) {
      setAmountError("Please enter a valid amount in Pesos");
    } else if (value && isNaN(value)) {
      setAmountError("Please enter a valid amount in Pesos");
    } else if (value && parseInt(value) > 1000000000) {
      setAmountError("Amount cannot exceed 1 billion Pesos");
    } else {
      setAmountError("");
      updateFormData({ amount: value });
    }
  };

  // Handle project type input change
  const handleProjectTypeChange = (e) => {
    const value = e.target.value;
    setProjectType(value);

    if (value && !Object.values(PROJECT_TYPE).includes(value.toLowerCase())) {
      setProjectTypeError("Please enter a valid project type");
    } else {
      setProjectTypeError("");
      updateFormData({ projectType: value });
    }
  };

  // Handle target date input change
  const handleTargetDateChange = (e) => {
    const value = e.target.value;
    setTargetDate(value);

    // Validate date is in the future
    if (value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time portion for accurate date comparison

      if (selectedDate < today) {
        setTargetDateError("Please select a future date");
      } else {
        setTargetDateError("");
        updateFormData({ targetDate: value });
      }
    } else {
      setTargetDateError("");
    }
  };

  // Check if all fields are valid and filled
  const isFormValid = amount && projectType && targetDate && !amountError && !projectTypeError && !targetDateError;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/*edit left side*/}
      <div className="w-full md:w-[35%] bg-astralightgray flex py-12 md:py-0">
        <div className="flex flex-col items-start space-y-6 pl-10 pt-60 ml-6">
          {/* Header text */}
          <h2 className="text-5xl text-astrablack text-left">
            Tell us how much you&apos;d like to raise
          </h2>
          <p className="font-r text-astrablack text-left tracking-wide">
            Give a rough estimate of your <br />
            project needs and timeline.
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
              Set your project target
            </h3>
            {/* form */}
            <div className="w-full space-y-6">
              {/* Amount field */}
              <div className="w-full">
                <label className="block text-astrablack font-r mb-2">
                  How much would you like to raise?
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount in Pesos"
                  className={`w-full p-3 border rounded-md ${
                    amountError ? "border-red-500" : "border-astradarkgray"
                  } focus:outline-none focus:ring-2 focus:ring-astraprimary`}
                />
                {amountError && (
                  <p className="text-red-500 text-sm mt-1">{amountError}</p>
                )}
              </div>

              {/* Target Date field */}
              <div className="w-full">
                <label className="block text-astrablack font-r mb-2">
                  When do you need to reach your goal?
                </label>
                <input  // TODO: Add date picker
                  type="date"
                  value={targetDate}
                  onChange={handleTargetDateChange}
                  min={new Date().toISOString().split("T")[0]} // Set minimum date to today
                  className={`w-full p-3 border rounded-md ${
                    targetDateError ? "border-red-500" : "border-astradarkgray"
                  } focus:outline-none focus:ring-2 focus:ring-astraprimary`}
                />
                {targetDateError && (
                  <p className="text-red-500 text-sm mt-1">{targetDateError}</p>
                )}
              </div>

              {/* Project type field */}
              <div className="w-full">
                <label className="block text-astrablack font-r mb-2">
                  What type of project are you requesting?
                </label>
                <select
                  name="projectType"
                  value={projectType}
                  onChange={handleProjectTypeChange}
                  className={`w-full p-3 border rounded-md ${
                    projectTypeError ? "border-red-500" : "border-astradarkgray"
                  } focus:outline-none focus:ring-2 focus:ring-astraprimary`}
                >
                  <option value="">Select a Project Type</option>
                  <option value={PROJECT_TYPE.FUNDRAISING}>{capitalizeName(PROJECT_TYPE.FUNDRAISING)}</option>
                  <option value={PROJECT_TYPE.DONATION_DRIVE}>{capitalizeName(PROJECT_TYPE.DONATION_DRIVE)}</option>
                  <option value={PROJECT_TYPE.SCHOLARSHIP}>{capitalizeName(PROJECT_TYPE.SCHOLARSHIP)}</option>
                </select>
                {projectTypeError && (
                  <p className="text-red-500 text-sm mt-1">{projectTypeError}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex justify-between px-6 md:px-12 py-5 border-astralightgray border-t-1">
          <BackButton />
          {isFormValid ? (
            <Link href="/projects/request/details" passHref>
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

export default RequestFundraiserGoal;