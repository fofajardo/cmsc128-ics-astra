"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Upload, Send } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";

export default function UploadNewsletter() {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    file: null,
    preview: "https://marketplace.canva.com/EAGWT7FdhOk/1/0/1131w/canva-black-and-grey-modern-business-company-email-newsletter-R_dH5ll-SAs.jpg"
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file: file }));
    }
  };

  const handleSubmit = () => {
    setToast({ type: "success", message: "Newsletter uploaded successfully" });
    setTimeout(() => router.push("/admin/whats-up"), 2000);
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

            <div className="relative aspect-[3/4] mb-6 group">
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
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.file && (
                    <span className="mt-2 text-astrawhite/90 font-s">
                      {formData.file.name}
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
                disabled={!formData.file || !formData.title}
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
