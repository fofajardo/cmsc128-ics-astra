'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Image, Send } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";

export default function CreateAnnouncement() {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: null,
    type: 'Event'
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = () => {
    setToast({ type: "success", message: "Announcement created successfully" });
    setTimeout(() => router.push('/admin/whats-up'), 2000);
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
            <div className={`relative w-full h-full rounded-xl ${!formData.image ? 'bg-astradarkgray/90' : ''}`}>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
              <div className={`absolute inset-0 ${formData.image ? 'bg-astradarkgray/50 group-hover:bg-astradarkgray/70' : ''} rounded-xl transition-colors`}>
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
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
          </div>

          <div className="bg-astrawhite rounded-xl p-6 shadow-md">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full font-h1 text-astrablack mb-4 p-2 border border-transparent hover:border-astragray focus:border-astraprimary rounded-lg outline-none"
              placeholder="Enter announcement title"
            />

            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full mb-4 p-2 border border-astragray rounded-lg font-rb"
            >
              <option value="Event">Event</option>
              <option value="News">News</option>
              <option value="Update">Update</option>
            </select>

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
