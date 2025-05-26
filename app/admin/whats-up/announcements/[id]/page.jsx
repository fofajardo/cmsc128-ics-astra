"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Image, Trash2, Save, Send } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";
import { PhotoType } from "../../../../../common/scopes.js";
import dynamic from "next/dynamic";

// Dynamically import MDX editor to avoid SSR issues
const MDXEditor = dynamic(() => import("@/components/MDXEditor"), {
  ssr: false,
  loading: () => <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50 animate-pulse">Loading editor...</div>
});

export default function AnnouncementDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [existingPhotoId, setExistingPhotoId] = useState(null);
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image: null
  });

  // Load photos from localStorage
  const loadPhotosFromLocalStorage = () => {
    try {
      const cachedPhotos = localStorage.getItem("announcementPhotos");
      const cachedTypesMap = localStorage.getItem("photoTypesMap");

      if (cachedPhotos && cachedTypesMap) {
        return {
          photos: JSON.parse(cachedPhotos),
          typesMap: JSON.parse(cachedTypesMap)
        };
      }
    } catch (error) {
      console.error("Error loading photos from localStorage:", error);
    }
    return { photos: {}, typesMap: {} };
  };

  // Process content for MDX editor
  const processContentForEditor = (content) => {
    if (!content) return "";

    let processed = content;

    // Convert HTML entities back to readable format
    processed = processed
      .replace(/&#x20;/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");

    // The content should already have proper newlines (\n) from the database
    // No need to convert them - the MDX editor expects \n characters
    return processed;
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

  // Handle MDX editor content change
  const handleContentChange = (markdown) => {
    setFormData(prev => ({ ...prev, content: markdown }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        title: formData.title,
        details: formData.content,
        tags: ["announcement", "published"]
      };

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`, payload);

      if (photo) {
        try {
          const formData = new FormData();
          formData.append("File", photo);
          formData.append("content_id", id);
          formData.append("type", PhotoType.PROJECT_PIC); // Using the proper ENUM from scopes.js

          // If we have an existing photo ID, update it instead of creating a new one
          if (existingPhotoId) {
            const photoResponse = await axios.put(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/${existingPhotoId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }
            );
          } else {
            // Create new photo if no existing photo ID
            const photoResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/photos`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }
            );
          }
        } catch (photoError) {
          console.error("Failed to upload announcement photo:", photoError);
        }
      }

      setToast({ type: "success", message: "Announcement published successfully!" });
      setTimeout(() => router.push("/admin/whats-up"), 2000);
    } catch (error) {
      console.error("Publish failed", error);
      setToast({ type: "error", message: "Failed to publish announcement" });
    }
  };

  const handleSaveDraft = async () => {
    try {
      const payload = {
        title: formData.title,
        details: formData.content,
        tags: ["announcement", "draft"]
      };

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`, payload);

      if (photo) {
        try {
          const formData = new FormData();
          formData.append("File", photo);
          formData.append("content_id", id);
          formData.append("type", PhotoType.PROJECT_PIC); // Using the proper ENUM from scopes.js

          // If we have an existing photo ID, update it instead of creating a new one
          if (existingPhotoId) {
            const photoResponse = await axios.put(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/${existingPhotoId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }
            );
          } else {
            // Create new photo if no existing photo ID
            const photoResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/photos`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }
            );
          }
        } catch (photoError) {
          console.error("Failed to upload announcement photo:", photoError);
        }
      }

      setToast({ type: "success", message: "Draft saved successfully!" });
    } catch (error) {
      console.error("Save draft failed", error);
      setToast({ type: "error", message: "Failed to save draft" });
    }
  };

  useEffect(() => {
    if (id !== "new") {
      setIsLoading(true);

      // Try to get cached photo from localStorage
      const { photos } = loadPhotosFromLocalStorage();
      const cachedPhoto = photos[id];

      if (cachedPhoto) {
        setPhotoPreview(cachedPhoto);
      }

      // Get content data
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`)
        .then((response) => {
          const content = response.data.content;

          setFormData({
            title: content?.title || "",
            description: content?.description || "This is a description",
            content: processContentForEditor(content?.details || ""),
            image: content?.image || null
          });

          // If we didn't find a cached photo but content has an image, use that
          if (!cachedPhoto && content?.image) {
            setPhotoPreview(content.image);
          }

          // Check if there's an existing photo for this content
          return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/photos?content_id=${id}`);
        })
        .then((photoResponse) => {
          if (photoResponse?.data?.status === "OK" && photoResponse.data.photos?.length > 0) {
            // Store the existing photo ID for potential updates
            setExistingPhotoId(photoResponse.data.photos[0].id);

            // If we don't already have a preview, use the photo URL
            if (!photoPreview && photoResponse.data.photos[0].url) {
              setPhotoPreview(photoResponse.data.photos[0].url);
            }
          }
        })
        .catch((error) => {
          console.log("Error fetching content or photos", error);
          setToast({ type: "error", message: "Failed to load announcement" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      setShowDeleteModal(false);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`);
      setToast({ type: "success", message: "Announcement deleted successfully" });

      // Redirect after short delay
      setTimeout(() => {
        router.push("/admin/whats-up");
      }, 1000);
    } catch (error) {
      console.error("Delete failed:", error);
      setToast({ type: "error", message: "Failed to delete announcement" });
    } finally {
      setShowDeleteModal(false);
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

        {showDeleteModal && (
          <ConfirmModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            title="Delete Announcement"
            description="Are you sure you want to delete this announcement? This action cannot be undone."
            confirmLabel="Delete"
            confirmColor="red"
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

          {/* Content Form - Updated with MDX Editor */}
          <div className="bg-astrawhite rounded-xl p-6 shadow-md">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full font-h1 text-astrablack mb-4 p-2 border border-transparent hover:border-astragray focus:border-astraprimary rounded-lg outline-none"
              placeholder="Enter announcement title"
            />

            <div className="mb-4">
              {isLoading ? (
                <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50 animate-pulse flex items-center justify-center">
                  <span className="text-gray-500">Loading content...</span>
                </div>
              ) : (
                <MDXEditor
                  ref={editorRef}
                  markdown={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your announcement content here..."
                />
              )}
            </div>

            {/* Action Buttons - Using global button styles */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-astragray">
              <button onClick={() => router.back()} className="gray-button">
                Cancel
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="red-button flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button onClick={handleSaveDraft} className="font-rb px-4 py-2 text-astrawhite bg-astradarkgray hover:bg-astradarkgray/90 rounded-lg flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button onClick={handleSubmit} className="blue-button flex items-center gap-2" >
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