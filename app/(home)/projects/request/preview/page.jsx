"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import { useProjectRequestForm } from "@/utils/hooks/useProjectRequestForm";
import ToastNotification from "@/components/ToastNotification";
import { useSignedInUser } from "@/components/UserContext";
import axios from "axios";
import { PhotoType } from "../../../../../common/scopes";

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
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
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
      if (!file.type.startsWith("image/")) {
        setPhotoError("Please upload an image file");
        return;
      }
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError("Image size should be less than 5MB");
        return;
      }
      setPhoto(file);
      setPhotoError("");
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
        return {
          status: "CREATED",
          id: projectData.id // Return the content ID
        };
      } else {
        ; // console.error("Unexpected response:", projectData);
        return false;
      }
    } catch (error) {
      ; // console.error("Failed to create project request:", error);
    }
  };

  // Modified handleSubmit function with photo upload
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
      const projectResponse = await requestProject();

      if (!projectResponse || projectResponse.status !== "CREATED") {
        throw new Error("Failed to create project");
      }

      const contentId = projectResponse.id;

      if (photo) {
        try {
          const formData = new FormData();
          formData.append("File", photo);
          formData.append("content_id", contentId);
          formData.append("type", PhotoType.PROJECT_PIC);

          const photoResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/photos`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          );

          if (photoResponse.data.status !== "CREATED") {
            ; // console.error("Unexpected photo upload response:", photoResponse.data);
          }
        } catch (photoError) {
          ; // console.error("Failed to upload project photo:", photoError);
        }
      }

      // Show success toast
      setShowToast({
        type: "success",
        message: "Project request submitted successfully!"
      });

      setTimeout(() => {
        clearFormData();
        router.push("/projects");
      }, 2000);
    } catch (error) {
      // console.error("Error submitting project:", error);
      setShowToast({
        type: "fail",
        message: "Failed to submit project. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-astrawhite">
      {/* Header */}
      <div className="bg-astralightgray/40 p-4 sm:p-6 md:p-8 lg:p-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-astrablack">
          Review Your Project
        </h1>
        <p className="text-sm sm:text-base text-astradarkgray mt-2">
          Please review all details before submitting your project request.
        </p>
      </div>

      {/* Main content */}
      <div className="flex-grow p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Preview header that mimics how the project will look */}
          <div className="bg-gradient-to-r from-astraprimary to-astrablue h-12 sm:h-16"></div>

          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Left column - Photo preview and upload */}
              <div className="order-2 md:order-1">
                <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer block w-full h-full"
                  >
                    {photoPreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={photoPreview}
                          alt="Project Visual"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <span className="text-white font-semibold text-sm sm:text-base">Change Photo</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center h-full flex items-center justify-center ${
                          isDragging ? "border-astraprimary bg-astralightgray" : "border-astraprimary"
                        } transition-colors duration-200`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4">
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
                          <p className="text-astraprimary font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                            Drag and drop your photo here
                          </p>
                          <p className="text-astraprimary text-xs sm:text-sm">
                            or click to browse files
                          </p>
                          <p className="text-astraprimary text-xs mt-1 sm:mt-2">
                            Supported formats: JPG, PNG, GIF (max 5MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {photoError && (
                  <p className="text-red-500 text-xs sm:text-sm text-center mb-4">{photoError}</p>
                )}

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-astrablack">Project Type</h2>
                    <p className="text-sm sm:text-base text-astradarkgray">{formData.projectType}</p>
                  </div>

                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-astrablack">Target Date</h2>
                    <p className="text-sm sm:text-base text-astradarkgray">{formatDate(formData.targetDate)}</p>
                  </div>

                  {formData.externalLink && (
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-astrablack">External Donation Link</h2>
                      <a
                        href={formData.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base text-astraprimary hover:underline break-all"
                      >
                        {formData.externalLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column - Text details */}
              <div className="order-1 md:order-2">
                <div className="mb-4 sm:mb-6">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-astrablack">{formData.title}</h1>
                  <div className="mt-3 sm:mt-4 bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-lg sm:text-xl font-semibold text-astraprimary">
                      {formatAmount(formData.amount)} <span className="text-xs sm:text-sm text-astradarkgray">project goal</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-astrablack mb-2">About this project</h2>
                  <div className="bg-white rounded-lg">
                    <p className="text-sm sm:text-base text-astradarkgray whitespace-pre-line">{formData.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 sm:py-5 border-astralightgray border-t-1 bg-white">
        <BackButton />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`blue-button font-semibold transition cursor-pointer w-[150px] sm:w-[180px] md:w-[200px] h-[45px] sm:h-[50px] md:h-[55px] text-sm sm:text-base flex items-center justify-center ${isSubmitting ? "opacity-75" : ""}`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm sm:text-base">Submitting...</span>
            </>
          ) : (
            <span className="text-sm sm:text-base">Submit Request</span>
          )}
        </button>
      </div>

      {/* Toast notification */}
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