"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Image, Trash2, Save, Send } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";

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
    image: null
  });

  // Simple text editor as a fallback solution
  const [editorContent, setEditorContent] = useState("");

  const handleSubmit = async () => {
    try {
      const payload = {
        title: formData.title,
        details: formData.content,
        image: formData.image,
        tags: ["announcement", "published"]
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`, payload);


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
        image: formData.image,
        tags: ["announcement", "draft"]
      };

        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`, payload);

      setToast({ type: "success", message: "Draft saved successfully!" });
    } catch (error) {
      console.error("Save draft failed", error);
      setToast({ type: "error", message: "Failed to save draft" });
    }
  };

  useEffect(() => {
    if (id !== "new") {
      setIsLoading(true);
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`)
        .then((response) => {
          const content = response.data.content;
          setFormData({
            title: content?.title || "",
            description: content?.description || "This is a description",
            content: content?.details || "",
            image: content?.image || null
          });
          setEditorContent(content?.details || "");
        })
        .catch((error) => {
          console.log("Error fetching content", error);
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
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

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
          {/* Image Upload Section - Updated overlay color */}
          <div className="relative w-full h-[400px] mb-6 group">
            <img
              src={formData.image}
              alt={formData.title}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-astradarkgray/90 rounded-xl">
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group-hover:bg-astradarkgray/70 transition-colors rounded-xl">
                <Image className="w-12 h-12 text-astrawhite mb-3" />
                <span className="text-astrawhite text-lg font-rb">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Content Form - Updated with global styles */}
          <div className="bg-astrawhite rounded-xl p-6 shadow-md">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full font-h1 text-astrablack mb-4 p-2 border border-transparent hover:border-astragray focus:border-astraprimary rounded-lg outline-none"
              placeholder="Enter announcement title"
            />

            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full font-r text-astrablack p-2 border border-transparent hover:border-astragray focus:border-astraprimary rounded-lg outline-none resize-none"
              placeholder="Enter announcement content"
              rows={8}
            />

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