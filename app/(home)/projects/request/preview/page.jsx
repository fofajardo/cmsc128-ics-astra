"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import { useProjectRequestForm } from "@/utils/hooks/useProjectRequestForm";
import ToastNotification from "@/components/ToastNotification";
import { useSignedInUser } from "@/components/UserContext";
import axios from "axios";

const RequestFundraiserPreview = () => {
  const router = useRouter();
  const { formData, clearFormData } = useProjectRequestForm();
  const user = useSignedInUser();
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
    handleFile(file);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  // Common file handling logic
  const handleFile = (file) => {
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

  // Request project function
  const requestProject = async () => {
    try {
      const data = {
        user_id: user?.state?.user?.id,
        title: formData.title,
        details: formData.description,
        due_date: new Date(formData.targetDate),
        goal_amount: Number(formData.amount),
        donation_link: formData.externalLink || "test_link",
        type: formData.projectType.toLowerCase(),
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects`, data);
      const projectData = response.data;

      if (projectData.status === "CREATED") {
        console.log("Created project:", projectData);
        return true;
      } else {
        console.error("Unexpected response:", projectData);
        return false;
      }
    } catch (error) {
      console.error("Failed to create project request:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Check if user is logged in
    if (!user?.state?.user) {
      setShowToast({
        type: "fail",
        message: "Please log in to submit a project request"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await requestProject();

      if (success) {
        // Clear form data
        clearFormData();

        // Show success toast
        setShowToast({
          type: "success",
          message: "Project request submitted successfully!"
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/projects");
        }, 2000);
      } else {
        throw new Error("Failed to create project");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      setShowToast({
        type: "fail",
        message: "Failed to submit project. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
                      isDragging ? 'border-astraprimary bg-astralightgray' : 'border-astraprimary'
                    } transition-colors duration-200`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      {photoPreview ? (
                        <div className="relative w-full">
                          <img
                            src={photoPreview}
                            alt="Project preview"
                            className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                            <span className="text-white font-semibold">Change Photo</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 mb-4">
                            <svg
                              className="w-full h-full text-astraprimary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-astraprimary font-semibold mb-2">
                            Drag and drop your photo here
                          </p>
                          <p className="text-astraprimary text-sm">
                            or click to browse files
                          </p>
                          <p className="text-astraprimary text-xs mt-2">
                            Supported formats: JPG, PNG, GIF (max 5MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                  {photoError && (
                    <p className="text-red-500 text-xs md:text-sm text-center">{photoError}</p>
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
            disabled={isSubmitting}
            className={`blue-button font-semibold transition cursor-pointer w-[120px] md:w-[150px] h-[45px] md:h-[55px] text-sm md:text-base flex items-center justify-center ${
              isSubmitting ? 'opacity-75' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <ToastNotification
          type={showToast.type}
          message={showToast.message}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default RequestFundraiserPreview;