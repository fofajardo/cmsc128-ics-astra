"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Image, Send } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";
import { useSignedInUser } from "@/components/UserContext";

export default function CreateAnnouncement() {
  const userContext = useSignedInUser();
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
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

  const submitAnnouncement = async () => {
    try {
      const payload = {
        user_id: userContext?.state?.authUser?.id,
        title: formData.title,
        details: formData.content,
        views: 0,
        tags: ["announcement", "published"]
      };

      const response =  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/`, payload);
      const announcementData = response.data;

      if (announcementData.status === "CREATED") {
        // console.log("Created announcement:", announcementData);
        return {
          status: announcementData.status,
          id: announcementData.content.id // Return the content ID
        };
      } else {
        // console.error("Unexpected response:", announcementData);
        return false;
      }
    } catch (error) {
      ; // console.error("Failed to create announcement:", error);
      throw error;
    }
    //   const contentId = response.data.data.id;
    //   await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/photos/event/${contentId}`, {
    //     photo: formData.image,
    //     content_id: contentId
    //   });
    //   console.log(response.data.data.id);

    //   setToast({ type: "success", message: "Announcement published successfully!" });
    //   setTimeout(() => router.push("/admin/whats-up"), 2000);
    // } catch (error) {
    //   console.error("Publish failed", error);
    //   setToast({ type: "error", message: "Failed to publish announcement" });
    // }
  };

  const handleSubmit = async () => {

    // Check if user is ADMIN
    // if (!userContext?.state?.isAdmin) {
    //   setToast({
    //     type: "fail",
    //     message: "You are not authorized to publish announcements"
    //   });
    //   return;
    // }

    setIsSubmitting(true);

    try {
      const announcementResponse = await submitAnnouncement();

      if (!announcementResponse || announcementResponse.status !== "CREATED") {
        throw new Error("Failed to create announcement");
      }

      const contentId = announcementResponse.id;
      // console.log("Announcement created with ID:", contentId);

      if (photo) {
        try {
          const formData = new FormData();
          formData.append("File", photo);
          formData.append("content_id", contentId);
          formData.append("type", 5); // TODO: use appropriate ENUM; check photo_type.js once merged

          // console.log("Uploading photo for announcement ID:", contentId);

          const photoResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/photos`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          );

          // if (photoResponse.data.status === "CREATED") {
          // console.log("Photo uploaded successfully:", photoResponse.data);
          // } else {
          ; // console.error("Unexpected photo upload response:", photoResponse.data);
          // }
        } catch (photoError) {
          ; // console.error("Failed to upload project photo:", photoError);
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
      // console.error("Error submitting announcement:", error);
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

            {/* <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full mb-4 p-2 border border-astragray rounded-lg font-rb"
            >
              <option value="Event">Event</option>
              <option value="News">News</option>
              <option value="Update">Update</option>
            </select> */}

            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full font-r text-astrablack p-2 border border-transparent hover:border-astragray focus:border-astraprimary rounded-lg outline-none resize-none"
              placeholder="Enter announcement content"
              rows={8}
            />

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-astragray">
              <button onClick={() => router.back()} className="gray-button">
                Cancel
              </button>
              <button onClick={handleSubmit} className="blue-button flex items-center gap-2">
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