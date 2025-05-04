"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ToastNotification from "@/components/ToastNotification";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import { set } from "date-fns";
import { capitalizeName, formatCurrency, formatDate } from "@/utils/format";
import { PROJECT_TYPE } from "@/constants/projectConsts";
import axios from "axios";
import { useSignedInUser } from "@/components/UserContext";

const ProjectConfirmPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const projectType = searchParams.get("projectType");
  const amount = searchParams.get("amount");
  const targetDate = searchParams.get("targetDate");
  const photoUrlLink = "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"; // TODO: Update photoUrl
  const user = useSignedInUser();

  const requestProject = async () => {
    try {
      setLoading(true);

      const data = {
        user_id: user?.state?.user?.id,
        title: title,
        details: description,
        due_date: new Date(targetDate),
        goal_amount: Number(amount),
        donation_link: "test_link", // TODO: Add donation link field
        type: projectType.toLowerCase(),
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects`, data);
      const projectData = response.data;
      if (projectData.status === "CREATED") {
        console.log("Created project:", projectData);
      } else {
        console.error("Unexpected response:", projectData);
      }
    } catch (error) {
      console.log("Failed to create project request:", error);
    } finally {
      setLoading(false);
    }
  };

  // Safe sessionStorage access in useEffect to avoid SSR issues
  useEffect(() => {
    // Only access sessionStorage in the browser environment
    if (typeof window !== "undefined") {
      const storedPhotoUrl = sessionStorage.getItem("projectPhotoPreview");
      setPhotoUrl(storedPhotoUrl || photoUrlLink);
    } else {
      setPhotoUrl(photoUrlLink);
    }
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      //code for backend API call to submit the project
      requestProject();

      // Show success toast
      setShowToast(true);

      // After 3 seconds (matching toast duration), redirect to projects page
      setTimeout(() => {
        router.push("/projects");
      }, 500);

    } catch (error) {
      console.error("Error submitting project:", error);
      // Handle error state here
      setShowToast({
        type: "fail",
        message: "Failed to submit project. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-astrawhite">
      {/* Header */}
      <div className="bg-astralightgray p-6 md:p-12">
        <h1 className="text-4xl font-bold text-astrablack">
          Review Your Project
        </h1>
        <p className="text-astradarkgray mt-2">
          Please review all details before submitting your project request.
        </p>
      </div>

      {/*Main content*/}
      <div className="flex-grow p-6 md:p-12">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Preview header that mimics how the project will look */}
          <div className="bg-gradient-to-r from-astraprimary to-astrablue h-16"></div>

          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left column - Photo preview */}
              <div className="order-2 md:order-1">
                <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
                  {photoUrl ? (
                    photoUrl.startsWith("data:") ? (
                      <img
                        src={photoUrl}
                        alt="Project Visual"
                        className="w-full h-full object-cover"
                      />
                    ) : photoUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        src={photoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={photoUrl}
                        alt="Project Visual"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                      <p className="text-astradarkgray italic">No image or video uploaded</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-astrablack">Project Type</h2>
                    <p className="text-astradarkgray">{capitalizeName(projectType)}</p>
                  </div>

                  {/* Added Target Date section */}
                  <div>
                    <h2 className="text-lg font-semibold text-astrablack">Target Date</h2>
                    <p className="text-astradarkgray">{formatDate(targetDate, "long")}</p>
                  </div>
                </div>
              </div>

              {/* Right column - Text details */}
              <div className="order-1 md:order-2">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-astrablack">{title}</h1>
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    <p className="text-xl font-semibold text-astraprimary">{formatCurrency(amount)} <span className="text-sm text-astradarkgray">project goal</span></p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-astrablack mb-2">About this project</h2>
                  <div className="bg-white rounded-lg">
                    <p className="text-astradarkgray whitespace-pre-line">{description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-between items-center px-6 md:px-12 py-5 border-astralightgray border-t-1 bg-white">
        <BackButton />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`blue-button font-semibold transition cursor-pointer w-[200px] h-[55px] flex items-center justify-center ${isSubmitting ? "opacity-75" : ""}`}
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
            "Submit Request"
          )}
        </button>
      </div>

      {/* Toast notification */}
      {showToast && (
        <ToastNotification
          type="success"
          message="Project request submitted successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default ProjectConfirmPage;