"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Image, Trash2, Save, Send } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";
import axios from 'axios';
import dynamic from "next/dynamic";

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

  const handleDelete = () => {
    setIsLoading(true);
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`)
      .then(() => {
        setShowDeleteModal(false);
        setToast({ type: "success", message: "Announcement deleted successfully" });
        setTimeout(() => router.push("/admin/whats-up"), 2000);
      })
      .catch((error) => {
        console.log("Error deleting announcement", error);
        setToast({ type: "error", message: "Failed to delete announcement" });
        setShowDeleteModal(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSaveDraft = () => {
    setIsLoading(true);
    const payload = {
      ...formData,
      content: editorContent, // Use the editor content from state
      status: "draft"
    };

    saveAnnouncement(payload);
  };

  const handlePublish = () => {
    setIsLoading(true);
    const payload = {
      ...formData,
      content: editorContent, // Use the editor content from state
      status: "published"
    };

    saveAnnouncement(payload);
  };

  const saveAnnouncement = (payload) => {
    const method = id !== "new" ? "put" : "post";
    const url = id !== "new"
      ? `${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/v1/contents`;

    axios[method](url, payload)
      .then((response) => {
        setToast({
          type: "success",
          message: `Announcement ${payload.status === "draft" ? "saved as draft" : "published"} successfully`
        });
        setTimeout(() => router.push("/admin/whats-up"), 2000);
      })
      .catch((error) => {
        console.log("Error saving announcement", error);
        setToast({
          type: "error",
          message: `Failed to ${payload.status === "draft" ? "save" : "publish"} announcement`
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-astradirtywhite p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-astradarkgray font-rb">Loading...</p>
        </div>
      </div>
    );
  }

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
              <img
                src={formData.image}
                alt={formData.title}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
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
            )}
            {formData.image && (
              <div className="absolute inset-0 bg-astradarkgray/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                  <Image className="w-12 h-12 text-astrawhite mb-3" />
                  <span className="text-astrawhite text-lg font-rb">Change image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
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

            {/* Rich Text Editor - Replaced CKEditor with textarea for now */}
            <div className="mb-6">
              <div className="border border-astragray rounded-lg">
                <div className="bg-astradirtywhite p-2 border-b border-astragray">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="p-1 hover:bg-astragray/30 rounded"
                      onClick={() => {
                        setEditorContent(prev => `<b>${prev}</b>`);
                      }}
                      title="Bold"
                    >
                      <span className="font-bold">B</span>
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-astragray/30 rounded"
                      onClick={() => {
                        setEditorContent(prev => `<i>${prev}</i>`);
                      }}
                      title="Italic"
                    >
                      <span className="italic">I</span>
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-astragray/30 rounded"
                      onClick={() => {
                        setEditorContent(prev => `<u>${prev}</u>`);
                      }}
                      title="Underline"
                    >
                      <span className="underline">U</span>
                    </button>
                  </div>
                </div>
                <textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="w-full font-rb text-astradarkgray p-4 outline-none rounded-b-lg"
                  placeholder="Enter rich text content here (HTML tags supported)"
                  rows={10}
                />
              </div>
              <div className="mt-2 text-xs text-astragray">
                <p>Use HTML tags for formatting: &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;u&gt;underline&lt;/u&gt;, etc.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-astragray">
              <button
                onClick={() => router.back()}
                className="gray-button"
                disabled={isLoading}
              >
                Cancel
              </button>
              {id !== "new" && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="red-button flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
              <button
                onClick={handleSaveDraft}
                className="font-rb px-4 py-2 text-astrawhite bg-astradarkgray hover:bg-astradarkgray/90 rounded-lg flex items-center gap-2"
                disabled={isLoading}
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={handlePublish}
                className="blue-button flex items-center gap-2"
                disabled={isLoading}
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