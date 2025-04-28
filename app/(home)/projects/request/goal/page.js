"use client"; 
 
import React, { useState, useEffect } from "react"; 
import { useRouter, useSearchParams } from "next/navigation"; 
import Link from "next/link"; 
import BackButton from "@/components/events/IndividualEvent/BackButton";
 
const RequestFundraiserGoal = () => { 
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize states with URL parameters if they exist
  const [amount, setAmount] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [amountError, setAmountError] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");
  const [targetDateError, setTargetDateError] = useState("");

  // Load data from URL parameters on component mount
  useEffect(() => {
    const urlAmount = searchParams.get('amount');
    const urlZipCode = searchParams.get('zipCode');
    const urlTargetDate = searchParams.get('targetDate');
    
    if (urlAmount) setAmount(urlAmount);
    if (urlZipCode) setZipCode(urlZipCode);
    if (urlTargetDate) setTargetDate(urlTargetDate);
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
    const query = search ? `?${search}` : '';
    router.replace(`${window.location.pathname}${query}`, { scroll: false });
  };

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    updateUrlParams('amount', value);
    
    // Validate that it's a number
    if (value && isNaN(value)) {
      setAmountError("Please enter a valid number");
    } else {
      setAmountError("");
    }
  };

  // Handle ZIP code input change
  const handleZipCodeChange = (e) => {
    const value = e.target.value;
    setZipCode(value);
    updateUrlParams('zipCode', value);
    
    // Validate that it's a number
    if (value && isNaN(value)) {
      setZipCodeError("Please enter a valid ZIP code");
    } else {
      setZipCodeError("");
    }
  };

  // Handle target date input change
  const handleTargetDateChange = (e) => {
    const value = e.target.value;
    setTargetDate(value);
    updateUrlParams('targetDate', value);
    
    // Validate date is in the future
    if (value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time portion for accurate date comparison
      
      if (selectedDate < today) {
        setTargetDateError("Please select a future date");
      } else {
        setTargetDateError("");
      }
    } else {
      setTargetDateError("");
    }
  };

  // Check if all fields are valid and filled
  const isFormValid = amount && zipCode && targetDate && !amountError && !zipCodeError && !targetDateError;

  return ( 
    <div className="min-h-screen w-full flex flex-col md:flex-row"> 
      {/*edit left side*/} 
      <div className="w-full md:w-[35%] bg-astralightgray flex py-12 md:py-0"> 
        <div className="flex flex-col items-start space-y-6 pl-10 pt-60 ml-6"> 
          {/* Header text */} 
          <h2 className="text-5xl text-astrablack text-left"> 
            Tell us how much you'd like to raise 
          </h2> 
          <p className="font-r text-astrablack text-left tracking-wide"> 
            Give a rough estimate of your <br />  
            fundraising needs and timeline. 
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
              Set your fundraising target 
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
                    amountError ? 'border-red-500' : 'border-astradarkgray'
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
                <input
                  type="date"
                  value={targetDate}
                  onChange={handleTargetDateChange}
                  min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                  className={`w-full p-3 border rounded-md ${
                    targetDateError ? 'border-red-500' : 'border-astradarkgray'
                  } focus:outline-none focus:ring-2 focus:ring-astraprimary`}
                />
                {targetDateError && (
                  <p className="text-red-500 text-sm mt-1">{targetDateError}</p>
                )}
              </div>

              {/* ZIP code field */}
              <div className="w-full">
                <label className="block text-astrablack font-r mb-2">
                  Where are you fundraising?
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  placeholder="Enter your ZIP code"
                  className={`w-full p-3 border rounded-md ${
                    zipCodeError ? 'border-red-500' : 'border-astradarkgray'
                  } focus:outline-none focus:ring-2 focus:ring-astraprimary`}
                />
                {zipCodeError && (
                  <p className="text-red-500 text-sm mt-1">{zipCodeError}</p>
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