"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import { useProjectRequestForm } from "@/utils/hooks/useProjectRequestForm";

const RequestFundraiserPreview = () => {
  const router = useRouter();
  const { formData, clearFormData } = useProjectRequestForm();
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");

  // Format amount to currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setPhotoError('Please upload an image file');
        return;
      }
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError('Image size should be less than 5MB');
        return;
      }
      setPhoto(file);
      setPhotoError('');
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Here you would typically handle the form submission
    // For now, we'll just clear the form data
    clearFormData();
    router.push('/projects');
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side */}
      <div className="w-full md:w-[35%] bg-astralightgray flex py-8 md:py-0">
        <div className="flex flex-col items-start space-y-4 md:space-y-6 pl-6 md:pl-10 pt-20 md:pt-60 ml-4 md:ml-6">
          <h2 className="text-3xl md:text-5xl text-astrablack text-left">
            Preview your project
          </h2>
          <p className="font-r text-astrablack text-left tracking-wide text-sm md:text-base">
            Review your project details before submitting
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full md:w-[65%] bg-astrawhite flex flex-col min-h-[50vh] md:min-h-screen">
        {/* Centered content */}
        <div className="flex-grow flex flex-col justify-center items-center px-4 md:px-0 py-8 md:py-0">
          <div className="flex flex-col items-center space-y-6 w-full md:w-[70%] mb-8">
            {/* Project Details */}
            <div className="w-full space-y-6">
              {/* Title */}
              <div className="w-full">
                <h3 className="font-l text-astrablack text-xl md:text-2xl mb-4">Project Details</h3>
                <div className="bg-astralightgray p-4 rounded-lg">
                  <p className="font-semibold text-astrablack">{formData.title}</p>
                  <p className="text-astradarkgray mt-2 whitespace-pre-wrap">{formData.description}</p>
                </div>
              </div>

              {/* Goal Details */}
              <div className="w-full">
                <h3 className="font-l text-astrablack text-xl md:text-2xl mb-4">Goal Details</h3>
                <div className="bg-astralightgray p-4 rounded-lg space-y-2">
                  <p><span className="font-semibold">Target Amount:</span> {formatAmount(formData.amount)}</p>
                  <p><span className="font-semibold">Project Type:</span> {formData.projectType}</p>
                  <p><span className="font-semibold">Target Date:</span> {formatDate(formData.targetDate)}</p>
                  {formData.externalLink && (
                    <p>
                      <span className="font-semibold">External Donation Link:</span>{' '}
                      <a href={formData.externalLink} target="_blank" rel="noopener noreferrer"
                         className="text-astraprimary hover:underline">
                        {formData.externalLink}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* Photo Upload */}
              <div className="w-full">
                <h3 className="font-l text-astrablack text-xl md:text-2xl mb-4">Project Photo</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="photo-upload"
                      />
                      <div className={`w-full p-3 border rounded-md text-sm md:text-base cursor-pointer text-center
                        ${photoError ? 'border-red-500' : 'border-astradarkgray hover:border-astraprimary'}`}>
                        {photo ? 'Change Photo' : 'Upload Photo'}
                      </div>
                    </label>
                  </div>
                  {photoError && (
                    <p className="text-red-500 text-xs md:text-sm">{photoError}</p>
                  )}
                  {photoPreview && (
                    <div className="mt-4">
                      <img
                        src={photoPreview}
                        alt="Project preview"
                        className="max-w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex justify-between px-4 md:px-12 py-4 md:py-5 border-astralightgray border-t-1">
          <BackButton />
          <button
            onClick={handleSubmit}
            className="blue-button font-semibold transition cursor-pointer w-[120px] md:w-[150px] h-[45px] md:h-[55px] text-sm md:text-base"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestFundraiserPreview;