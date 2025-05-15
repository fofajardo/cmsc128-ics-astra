"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../styles/datepicker.css";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import { capitalizeName } from "@/utils/format";
import { PROJECT_TYPE } from "../../../../../common/scopes";
import { useProjectRequestForm } from "@/utils/hooks/useProjectRequestForm";

const RequestFundraiserGoal = () => {
  const router = useRouter();
  const { formData, updateFormData } = useProjectRequestForm();

  // Initialize states
  const [amount, setAmount] = useState("");
  const [projectType, setProjectType] = useState("");
  const [targetDate, setTargetDate] = useState(null);
  const [amountError, setAmountError] = useState("");
  const [projectTypeError, setProjectTypeError] = useState("");
  const [targetDateError, setTargetDateError] = useState("");

  // Load saved form data on mount and when formData
  // Initially, through url siya, now using local storage na
  useEffect(() => {
    if (formData) {
      if (formData.amount) setAmount(formData.amount);
      if (formData.projectType) setProjectType(formData.projectType);
      if (formData.targetDate) setTargetDate(new Date(formData.targetDate));
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
  const handleTargetDateChange = (date) => {
    setTargetDate(date);

    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time portion for accurate date comparison

      if (date < today) {
        setTargetDateError("Please select a future date");
      } else {
        setTargetDateError("");
        updateFormData({ targetDate: date.toISOString().split("T")[0] });
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
      <div className="w-full md:w-[35%] bg-astralightgray flex py-8 md:py-0">
        <div className="flex flex-col items-start space-y-4 md:space-y-6 pl-6 md:pl-10 pt-20 md:pt-60 ml-4 md:ml-6">
          {/* Header text */}
          <h2 className="text-3xl md:text-5xl text-astrablack text-left">
            Tell us how much you&apos;d like to raise
          </h2>
          <p className="font-r text-astrablack text-left tracking-wide text-sm md:text-base">
            Give a rough estimate of your <br />
            project needs and timeline.
          </p>
        </div>
      </div>

      {/*edit right side*/}
      <div className="w-full md:w-[65%] bg-astrawhite flex flex-col min-h-[50vh] md:min-h-screen">
        {/* Centered content */}
        <div className="flex-grow flex flex-col justify-center items-center px-4 md:px-0 py-8 md:py-0">
          <div className="flex flex-col items-center space-y-4 w-full md:w-[70%] mb-8">
            {/* Header */}
            <h3 className="font-l text-astrablack self-start w-full text-xl md:text-2xl">
              Set your project target
            </h3>
            {/* form */}
            <div className="w-full space-y-6">
              {/* Amount field */}
              <div className="w-full">
                <label className="block text-astrablack font-r mb-2 text-sm md:text-base">
                  How much would you like to raise?
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount in Pesos"
                  className={`w-full p-3 border rounded-md text-sm md:text-base ${
                    amountError ? "border-red-500" : "border-astradarkgray"
                  } focus:outline-none focus:ring-2 focus:ring-astraprimary`}
                />
                {amountError && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">{amountError}</p>
                )}
              </div>

              {/* Target Date field */}
              <div className="w-full">
                <label className="block text-astrablack font-r mb-2 text-sm md:text-base">
                  When do you need to reach your goal?
                </label>
                <div className="relative">
                  <DatePicker
                    selected={targetDate}
                    onChange={handleTargetDateChange}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select a date"
                    className={`w-full p-3 border rounded-md text-sm md:text-base ${
                      targetDateError ? "border-red-500" : "border-astradarkgray"
                    } focus:outline-none focus:ring-2 focus:ring-astraprimary`}
                    wrapperClassName="w-full"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={10}
                    showMonthDropdown
                    scrollableMonthDropdown
                    popperClassName="react-datepicker-popper"
                    popperPlacement="bottom-start"
                    popperModifiers={[
                      {
                        name: "offset",
                        options: {
                          offset: [0, 8],
                        },
                      },
                    ]}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-astraprimary pointer-events-none"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                {targetDateError && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">{targetDateError}</p>
                )}
              </div>

              {/* Project type field */}
              <div className="w-full">
                <label className="block text-astrablack font-r mb-2 text-sm md:text-base">
                  What type of project are you requesting?
                </label>
                <select
                  name="projectType"
                  value={projectType}
                  onChange={handleProjectTypeChange}
                  className={`w-full p-3 border rounded-md text-sm md:text-base ${
                    projectTypeError ? "border-red-500" : "border-astradarkgray"
                  } focus:outline-none focus:ring-2 focus:ring-astraprimary`}
                >
                  <option value="">Select a Project Type</option>
                  <option value={PROJECT_TYPE.FUNDRAISING}>{capitalizeName(PROJECT_TYPE.FUNDRAISING)}</option>
                  <option value={PROJECT_TYPE.DONATION_DRIVE}>{capitalizeName(PROJECT_TYPE.DONATION_DRIVE)}</option>
                  <option value={PROJECT_TYPE.SCHOLARSHIP}>{capitalizeName(PROJECT_TYPE.SCHOLARSHIP)}</option>
                </select>
                {projectTypeError && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">{projectTypeError}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex justify-between px-4 md:px-12 py-4 md:py-5 border-astralightgray border-t-1">
          <BackButton />
          {isFormValid ? (
            <Link href="/projects/request/details" passHref>
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

export default RequestFundraiserGoal;