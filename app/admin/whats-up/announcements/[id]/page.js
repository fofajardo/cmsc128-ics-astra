"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Image, Trash2, Save, Send } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";

export default function AnnouncementDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Demo announcement data - replace with API call
  const announcement = {
    id,
    image: "/whats-up/assets/Announcement.jpg",
    title: "Upcoming Hackathon 2025",
    datePublished: "2025-04-25",
    description: "Join us for the annual coding competition! Register now and showcase your skills in software development.",
    type: "Event",
    content: "Extended description and details about the announcement would go here...",
    author: "Admin User",
    recipients: 245,
    viewCount: 123
  };

  const [formData, setFormData] = useState({
    title: announcement.title,
    description: announcement.description,
    content: announcement.content,
    image: announcement.image
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    setToast({ type: "success", message: "Announcement deleted successfully" });
    setTimeout(() => router.push("/admin/whats-up"), 2000);
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

            {/* Action Buttons - Using global button styles */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-astragray">
              <button onClick={() => router.back()} className="gray-button">
                Cancel
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="red-button flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button className="font-rb px-4 py-2 text-astrawhite bg-astradarkgray hover:bg-astradarkgray/90 rounded-lg flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button className="blue-button flex items-center gap-2">
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
