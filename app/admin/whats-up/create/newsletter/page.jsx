"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Upload, Send } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";
import { useSignedInUser } from "@/components/UserContext";
import { PhotoType } from "../../../../../common/scopes";

export default function UploadNewsletter() {
  const userContext = useSignedInUser();
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    file: null,
    preview: "https://marketplace.canva.com/EAGWT7FdhOk/1/0/1131w/canva-black-and-grey-modern-business-company-email-newsletter-R_dH5ll-SAs.jpg"
  });

  // Handle file upload
  const handleFileChange = (e) => {
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
      if (file.type !== "application/pdf") {
        setFileError("Please upload a PDF file");
        return;
      }
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setFileError("File size should be less than 10MB");
        return;
      }
      setFile(file);
      setFileError("");
      setFormData(prev => ({ ...prev, file: file }));
      // console.log("File selected:", file.name);
    }
  };

  const submitNewsletter = async () => {
    try {
      const payload = {
        user_id: userContext?.state?.authUser?.id,
        title: formData.title,
        details: "",
        views: 0,
        tags: ["newsletter", "published"]
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/`, payload);
      const newsletterData = response.data;

      if (newsletterData.status === "CREATED") {
        // console.log("Created newsletter:", newsletterData);
        return {
          status: newsletterData.status,
          id: newsletterData.content.id
        };
      } else {
        // console.error("Unexpected response:", newsletterData);
        return false;
      }
    } catch (error) {
      ; // console.error("Failed to create newsletter:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const newsletterResponse = await submitNewsletter();

      if (!newsletterResponse || newsletterResponse.status !== "CREATED") {
        throw new Error("Failed to create newsletter");
      }

      const contentId = newsletterResponse.id;
      // console.log("Newsletter created with ID:", contentId);

      if (formData.file) {
        try {
          const fileFormData = new FormData();
          fileFormData.append("File", formData.file);
          fileFormData.append("user_id", userContext?.state?.authUser?.id);
          fileFormData.append("content_id", contentId);
          fileFormData.append("title", formData.title);
          fileFormData.append("type", PhotoType.POSTS_PIC);

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/newsletter`,
            fileFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          );

          if (response.data.status === "CREATED") {
            ; // console.log("File uploaded successfully:", response.data);
          } else {
            // console.error("Unexpected file upload response:", response.data);
            throw new Error("Failed to upload file");
          }
        } catch (fileError) {
          ; // console.error("Failed to upload newsletter file:", fileError);
          // throw fileError;
        }
      }

      setToast({
        type: "success",
        message: "Newsletter published successfully!"
      });

      setTimeout(() => {
        setFormData({
          title: "",
          file: null,
          preview: "https://marketplace.canva.com/EAGWT7FdhOk/1/0/1131w/canva-black-and-grey-modern-business-company-email-newsletter-R_dH5ll-SAs.jpg"
        });
        router.push("/admin/whats-up");
      }, 2000);
    } catch (error) {
      // console.error("Error submitting newsletter:", error);
      setToast({
        type: "fail",
        message: "Failed to submit newsletter. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-astradirtywhite p-6">
      <div className="max-w-md mx-auto">
        <GoBackButton />

        {toast && (
          <ToastNotification
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        <div className="mt-6">
          <div className="bg-astrawhite rounded-xl p-6 shadow-md">
            <h1 className="font-h2 text-astrablack mb-6">Upload Newsletter</h1>

            <div
              className={`relative aspect-[3/4] mb-6 group ${isDragging ? "border-2 border-dashed border-astrablue" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <img
                  src={formData.preview}
                  alt="Newsletter preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-astradarkgray/50 group-hover:bg-astradarkgray/70 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-3/4 text-center bg-transparent text-astrawhite font-rb text-xl mb-4 p-2 border border-astrawhite/50 rounded-lg placeholder-astrawhite/70"
                    placeholder="Enter newsletter title"
                  />
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="w-8 h-8 text-astrawhite mb-2" />
                    <span className="text-astrawhite font-rb">Upload PDF</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {formData.file && (
                    <span className="mt-2 text-astrawhite/90 font-s">
                      {formData.file.name}
                    </span>
                  )}
                  {fileError && (
                    <span className="mt-2 text-red-500 font-s">
                      {fileError}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => router.back()} className="gray-button">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.file || !formData.title || isSubmitting}
                className="blue-button flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
