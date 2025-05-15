"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Image, Trash2, Save, Send } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";
import { PhotoType } from "../../../../../common/scopes.js";

export default function AnnouncementDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image: null,
    imageFile: null // Store the actual file for upload
  });
  const [photoId, setPhotoId] = useState(null); // Track existing photo ID

  // Simple text editor as a fallback solution
  const [editorContent, setEditorContent] = useState("");

  const handleDelete = async () => {
    try {
      // First, delete any associated photos by content_id
      if (id !== "new") {
        try {
          // Fetch photos associated with this content
          const photosResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/by-content-id/${id}`
          );

          if (photosResponse.data.status === "OK" &&
              photosResponse.data.photos &&
              photosResponse.data.photos.length > 0) {

            // Delete each photo by its ID
            const photos = photosResponse.data.photos;
            console.log(`Found ${photos.length} photos to delete for content ID: ${id}`);

            for (const photo of photos) {
              if (!photo.id) continue; // Skip if ID is missing

              try {
                console.log(`Deleting photo with ID: ${photo.id}`);
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/photos/${photo.id}`);
                console.log(`Successfully deleted photo ID ${photo.id}`);
              } catch (deleteError) {
                console.error(`Error deleting photo ID ${photo.id}:`, deleteError);
                // Continue with next photo
              }
            }
          }
        } catch (photoError) {
          console.error("Error fetching photos for deletion:", photoError);
          // Continue with content deletion anyway
        }

        // Then delete the content itself
        const contentResponse = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`
        );

        if (contentResponse.data.status === "DELETED") {
          setToast({
            type: "success",
            message: "Announcement deleted successfully"
          });

          // Navigate back after a short delay
          setTimeout(() => router.push("/admin/whats-up"), 2000);
        } else {
          throw new Error("Failed to delete announcement");
        }
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      setToast({
        type: "error",
        message: `Failed to delete announcement: ${error.message}`
      });
    } finally {
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      setIsLoading(true);

      // First fetch the content data
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`)
        .then((response) => {
          const content = response.data.content;
          setFormData({
            title: content?.title || "",
            description: content?.description || "This is a description",
            content: content?.details || "",
            image: null,
            imageFile: null
          });
          setEditorContent(content?.details || "");

          // Then check if there's an associated photo
          return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/photos/content-types`, {
            params: { content_ids: id }
          });
        })
        .then((photoTypesResponse) => {
          if (photoTypesResponse.data.status === "OK" && photoTypesResponse.data.types) {
            const photoInfo = photoTypesResponse.data.types.find(item => item.content_id === id);

            if (photoInfo) {
              setPhotoId(photoInfo.id); // Store the photo ID for later update/delete operations

              // Determine the correct endpoint based on the photo type
              let endpoint;
              switch (photoInfo.type) {
              case PhotoType.EVENT_PIC:
                endpoint = `event/${id}`;
                break;
              case PhotoType.PROJECT_PIC:
                endpoint = `project/${id}`;
                break;
              case PhotoType.JOB_PIC:
                endpoint = `jobs/${id}`;
                break;
              default:
                endpoint = `event/${id}`; // Default to event
              }

              // Fetch the actual photo
              return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/photos/${endpoint}`);
            }
          }
          return Promise.resolve(null);
        })
        .then((photoResponse) => {
          if (photoResponse && photoResponse.data && photoResponse.data.photo) {
            // Update the form data with the photo URL
            setFormData(prev => ({ ...prev, image: photoResponse.data.photo }));
          }
        })
        .catch((error) => {
          console.log("Error fetching content or photo", error);
          setToast({ type: "error", message: "Failed to load announcement" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image: imageUrl,
        imageFile: file
      }));
    }
  };

  // Modified handleSave function to correctly delete photos by ID
  const handleSave = async (isDraft = true) => {
    try {
      let contentResponse;
      let contentId;

      // Prepare the content data
      const contentData = {
        title: formData.title,
        details: formData.content,
        tags: ["announcement"] // TODO: hardcoded for now, fix later
      };

      // Create/update content code remains the same...
      if (id === "new") {
        // Create new content
        contentResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/contents`,
          contentData
        );

        if (contentResponse.data.status !== "CREATED") {
          throw new Error("Failed to create announcement");
        }
        contentId = contentResponse.data.content.id;
      } else {
        // Update existing content
        contentResponse = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`,
          contentData
        );

        if (contentResponse.data.status !== "UPDATED") {
          throw new Error("Failed to update announcement");
        }
        contentId = id;
      }

      // Handle image upload if there's a new image
      if (formData.imageFile) {
        // Default photo type
        let photoType = PhotoType.EVENT_PIC;

        // If we're updating an existing announcement, get existing photos first
        if (id !== "new") {
          try {
            console.log(`Fetching photos for content ID: ${contentId}`);

            // Use the new endpoint to fetch all photos by content ID
            const photosResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/by-content-id/${contentId}`
            );

            if (photosResponse.data.status === "OK" &&
                photosResponse.data.photos &&
                photosResponse.data.photos.length > 0) {

              const existingPhotos = photosResponse.data.photos;

              // Get the type from the first photo
              if (existingPhotos.length > 0) {
                const firstPhoto = existingPhotos[0];
                photoType = firstPhoto.type || PhotoType.EVENT_PIC;

                console.log(`Found ${existingPhotos.length} photos for content ID: ${contentId}`);
                console.log(`Using photo type: ${photoType} for content ID: ${contentId}`);

                // Delete each photo by its ID
                for (const photo of existingPhotos) {
                  if (!photo.id) {
                    console.log("Skipping photo with undefined ID");
                    continue; // Skip if ID is missing
                  }

                  try {
                    console.log(`Deleting photo with ID: ${photo.id}`);

                    // Delete using photo's primary key ID
                    const deleteResponse = await axios.delete(
                      `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/${photo.id}`
                    );

                    console.log(`Successfully deleted photo ID ${photo.id}:`, deleteResponse.data);
                  } catch (deleteError) {
                    console.error(`Error deleting photo ID ${photo.id}:`, deleteError.response?.data || deleteError.message);
                    // Continue with next photo
                  }
                }
              }
            } else {
              console.log(`No photos found for content ID: ${contentId}, using default type`);
            }
          } catch (fetchError) {
            console.error("Error fetching photos:", fetchError.response?.data || fetchError.message);
            // Continue with default photo type
          }
        }

        // Create a new FormData for the photo upload
        const photoFormData = new FormData();

        // Sanitize filename to prevent upload errors
        const originalFile = formData.imageFile;
        const fileName = originalFile.name;
        const sanitizedName = fileName.replace(/[^\w\s.-]/g, "").replace(/\s+/g, "-").toLowerCase() || "image.jpg";
        const timestamp = Date.now();
        const finalFileName = `${timestamp}-${sanitizedName}`;

        // Create a new file with sanitized name
        const sanitizedFile = new File(
          [originalFile],
          finalFileName,
          {type: originalFile.type}
        );

        // Use the same type as the previous photo or default to EVENT_PIC for new content
        photoFormData.append("File", sanitizedFile);
        photoFormData.append("content_id", contentId);
        photoFormData.append("type", photoType); // Use the preserved or default type

        console.log(`Uploading new photo for content ID: ${contentId} with type: ${photoType}`);

        try {
          // Upload new photo
          const photoResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/photos`,
            photoFormData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          console.log("Photo upload response:", photoResponse.data);

          if (photoResponse.data.status !== "CREATED") {
            console.error("Photo upload failed with status:", photoResponse.data.status);
            throw new Error("Failed to upload image");
          }

          // Store the new photo ID
          if (photoResponse.data.photo && photoResponse.data.photo.id) {
            setPhotoId(photoResponse.data.photo.id);
          }
        } catch (uploadError) {
          console.error("Photo upload error details:", uploadError.response?.data || uploadError.message);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
      }

      setToast({
        type: "success",
        message: `Announcement ${isDraft ? "saved as draft" : "published"} successfully`
      });

      // Navigate back after a short delay
      setTimeout(() => router.push("/admin/whats-up"), 2000);

    } catch (error) {
      console.error("Error saving announcement:", error);
      console.error("Error details:", error.response?.data);
      setToast({
        type: "error",
        message: `Failed to ${id === "new" ? "create" : "update"} announcement: ${error.message}`
      });
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
          {/* Image Upload Section */}
          <div className="relative w-full h-[400px] mb-6 group">
            {formData.image ? (
              // Show existing image if available
              <img
                src={formData.image}
                alt={formData.title || "Announcement image"}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              // Show placeholder if no image
              <div className="w-full h-full bg-astradarkgray rounded-xl"></div>
            )}

            {/* Image upload overlay */}
            <div className="absolute inset-0 bg-astradarkgray/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                <Image className="w-12 h-12 text-astrawhite mb-3" />
                <span className="text-astrawhite text-lg font-rb">
                  {formData.image ? "Change image" : "Click to upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Content Form */}
          <div className="bg-astrawhite rounded-xl p-6 shadow-md">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full font-h1 text-astrablack mb-4 p-2 border border-transparent hover:border-astragray focus:border-astraprimary rounded-lg outline-none"
              placeholder="Enter announcement title"
            />

            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full font-rb text-astradarkgray mb-6 p-2 border border-transparent hover:border-astragray focus:border-astraprimary rounded-lg outline-none resize-none"
              placeholder="Enter short description"
              rows={2}
            />

            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full font-r text-astrablack p-2 border border-transparent hover:border-astragray focus:border-astraprimary rounded-lg outline-none resize-none"
              placeholder="Enter announcement content"
              rows={8}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-astragray">
              <button onClick={() => router.back()} className="gray-button">
                Cancel
              </button>
              {id !== "new" && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="red-button flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
              <button
                onClick={() => handleSave(true)}
                className="font-rb px-4 py-2 text-astrawhite bg-astradarkgray hover:bg-astradarkgray/90 rounded-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={() => handleSave(false)}
                className="blue-button flex items-center gap-2"
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