"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const RequestFundraiser = () => {
  //to keep buttons active
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load selection from URL on component mount
  useEffect(() => {
    const selectionFromUrl = searchParams.get('fundingFor');
    if (selectionFromUrl) {
      setSelectedOption(selectionFromUrl);
    }
  }, [searchParams]);
  
  // Handle back button
  const handleBack = () => {
    router.back();
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    // Update URL with selection (without navigation)
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('fundingFor', option);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.replace(`${window.location.pathname}${query}`, { scroll: false });
  };

  const isButtonSelected = (option) => {
    return selectedOption === option;
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/*edit left side*/}
      <div className="w-full md:w-[35%] bg-astralightgray flex py-12 md:py-0">
        <div className="flex flex-col items-start space-y-6 pl-10 pt-60 ml-6">
          {/* Header text */}
          <h2 className="text-5xl text-astrablack text-left">
            Tell us who you're <br /> raising funds for
          </h2>
          <p className="font-r text-astrablack text-left tracking-wide">
            This information helps us get to know you <br /> and your
            fundraising needs.
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
              Who are you fundraising for?
            </h3>

            {/* Buttons (di ko ginamit astralight, mas gusto ko much lighter e) */}

            {/* Button 1 */}
            <button
              onClick={() => handleOptionSelect('yourself')}
              className={`w-full flex items-center gap-4 rounded-md border border-astradarkgray p-4 transition-colors cursor-pointer
                ${isButtonSelected('yourself') ? "bg-[#D6E9FF]" : "bg-astrawhite hover:bg-[#D6E9FF]"}
              `}
            >
              {/* Logo/Image */}
              <img
                src="/projects/assets/Yourself.png"
                alt="Yourself image"
                className="w-10 h-10 object-contain"
              />

              {/* Text Content */}
              <div className="text-left">
                <h4 className="font-r text-astrablack">Yourself</h4>
                <p className="font-s text-astradarkgray">
                  Funds are delivered to your bank account for your own use
                </p>
              </div>
            </button>
            
            {/* Button 2 */}
            <button
              onClick={() => handleOptionSelect('someone-else')}
              className={`w-full flex items-center gap-4 rounded-md border border-astradarkgray p-4 transition-colors cursor-pointer
                ${isButtonSelected('someone-else') ? "bg-[#D6E9FF]" : "bg-astrawhite hover:bg-[#D6E9FF]"}
              `}
            >
              {/* Logo/Image */}
              <img
                src="/projects/assets/Somebody.svg"
                alt="Someone Else image"
                className="w-10 h-10 object-contain"
              />

              {/* Text Content */}
              <div className="text-left">
                <h4 className="font-r text-astrablack">Someone else</h4>
                <p className="font-s text-astradarkgray">
                  You'll invite a beneficiary to receive funds or distribute them yourself
                </p>
              </div>
            </button>

            {/* Button 3 */}
            <button
              onClick={() => handleOptionSelect('charity')}
              className={`w-full flex items-center gap-4 rounded-md border border-astradarkgray p-4 transition-colors cursor-pointer
                ${isButtonSelected('charity') ? "bg-[#D6E9FF]" : "bg-astrawhite hover:bg-[#D6E9FF]"}
              `}
            >
              {/* Logo/Image */}
              <img
                src="/projects/assets/Charity.png"
                alt="Charity image"
                className="w-10 h-10 object-contain"
              />

              {/* Text Content */}
              <div className="text-left">
                <h4 className="font-r text-astrablack">Charity</h4>
                <p className="font-s text-astradarkgray">
                  Funds are delivered to your chosen charity for you
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex justify-between px-6 md:px-12 py-5 border-astralightgray border-t-1">
        <button 
            onClick={handleBack}
            className="flex items-center text-astradarkgray hover:text-astraprimary transition-colors font-r transition cursor-pointer"
          > 
            <i className="fas fa-arrow-left mr-2"></i> 
          </button> 
          {selectedOption ? (
            <Link href="/projects/request/goal" passHref>
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
        {/* wala sa 1st page
        <button className="flex items-center text-astradarkgray hover:text-astraprimary transition-colors font-r transition cursor-pointer">
          <i className="fas fa-arrow-left mr-2"></i>
        </button>
        */}
      </div>
    </div>
  );
};

export default RequestFundraiser;