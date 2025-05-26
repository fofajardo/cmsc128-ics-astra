"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Image, Send } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";
import { useSignedInUser } from "@/components/UserContext";
import dynamic from "next/dynamic";

// Dynamically import MDX editor to avoid SSR issues
const MDXEditor = dynamic(() => import("@/components/MDXEditor"), {
  ssr: false,
  loading: () => <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50 animate-pulse">Loading editor...</div>
});

export default function CreateAnnouncement() {
  const userContext = useSignedInUser();
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "", // Ensure this is always a string
    image: null,
    type: "Event"
  });

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

  // Handle MDX editor content change
  const handleContentChange = (markdown) => {
    setFormData(prev => ({ ...prev, content: markdown }));
  };

  const submitAnnouncement = async () => {
    const payload = {
      user_id: userContext?.state?.authUser?.id,
      title: formData.title,
      details: formData.content, // Send markdown content
      views: 0,
      tags: ["announcement", "published"]
    };

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/`, payload);
    const announcementData = response.data;

    if (announcementData.status === "CREATED") {
      return {
        status: announcementData.status,
        id: announcementData.content.id
      };
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title.trim()) {
      setToast({
        type: "fail",
        message: "Please enter a title for the announcement"
      });
      return;
    }

    if (!formData.content.trim()) {
      setToast({
        type: "fail",
        message: "Please enter content for the announcement"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const announcementResponse = await submitAnnouncement();

      if (!announcementResponse || announcementResponse.status !== "CREATED") {
        throw new Error("Failed to create announcement");
      }

      const contentId = announcementResponse.id;

      if (photo) {
        try {
          const formData = new FormData();
          formData.append("File", photo);
          formData.append("content_id", contentId);
          formData.append("type", 5); // TODO: use appropriate ENUM; check photo_type.js once merged

          const photoResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/photos`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          );
        } catch (photoError) {
          console.error("Failed to upload photo:", photoError);
        }
      }

      // Show success toast
      setToast({
        type: "success",
        message: "Announcement published successfully!"
      });

      setTimeout(() => {
        setFormData({
          title: "",
          content: ""
        });
        setPhoto(null);
        setPhotoPreview(null);
        router.push("/admin/whats-up");
      }, 2000);
    } catch (error) {
      setToast({
        type: "fail",
        message: "Failed to submit announcement. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-astradirtywhite p-6">
      <div className="max-w-5xl mx-auto">
        <GoBackButton />

        {toast && (
          <ToastNotification
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        <div className="mt-6">
          <div className="relative w-full h-[400px] mb-6 group">
            <div className={`relative w-full h-full rounded-xl ${!photoPreview ? "bg-astradarkgray/90" : ""}`}>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
              <label htmlFor="announcement-image" className="absolute inset-0">
                <div className={`absolute inset-0 ${photoPreview ? "bg-astradarkgray/50 group-hover:bg-astradarkgray/70" : ""} rounded-xl transition-colors`}>
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer ${
                      isDragging ? "border-astraprimary bg-astralightgray" : ""
                    } transition-colors duration-200`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Image className="w-12 h-12 text-astrawhite mb-3" />
                    <span className="text-astrawhite text-lg font-rb">
                      {isDragging ? "Drop image here" : "Click or drag to upload image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="announcement-image"
                    />
                  </div>
                </div>
              </label>
            </div>
            {photoError && <p className="text-red-500 mt-2">{photoError}</p>}
          </div>

          <div className="bg-astrawhite rounded-xl p-6 shadow-md">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full font-h1 text-astrablack mb-4 p-2 border border-transparent hover:border-astragray focus:border-astraprimary rounded-lg outline-none"
              placeholder="Enter announcement title"
            />

            <div className="mb-4">
              <MDXEditor
                ref={editorRef}
                markdown={formData.content}
                onChange={handleContentChange}
                placeholder="Write your announcement content here..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-astragray">
              <button
                onClick={() => router.back()}
                className="gray-button"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="blue-button flex items-center gap-2"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}