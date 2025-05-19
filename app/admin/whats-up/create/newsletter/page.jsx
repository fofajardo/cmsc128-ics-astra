"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Upload, Send } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";
import { useSignedInUser } from "@/components/UserContext";
import { PhotoType } from "../../../../../common/scopes.js";

export default function UploadNewsletter() {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const userContext = useSignedInUser();
  const [formData, setFormData] = useState({
    title: "",
    file: null,
    preview: "https://marketplace.canva.com/EAGWT7FdhOk/1/0/1131w/canva-black-and-grey-modern-business-company-email-newsletter-R_dH5ll-SAs.jpg"
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate PDF file
      if (file.type !== 'application/pdf') {
        setToast({ type: "error", message: "Please upload a valid PDF file" });
        return;
      }
      setFormData(prev => ({ ...prev, file: file }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.file) {
      setToast({ type: "error", message: "Please provide both title and file" });
      return;
    }

    setLoading(true);
    try {
      // Create content entry first
      const contentResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/contents`,
        {
          user_id: userContext?.state?.authUser?.id,
          title: formData.title,
          details: `Newsletter: ${formData.title}`,
          views: 0,
          tags: ["newsletter"]
        }
      );

      if (contentResponse.data.status === "CREATED") {
        const contentId = contentResponse.data.content.id;
        
        // Create form data for file upload
        const fileFormData = new FormData();
        fileFormData.append("File", formData.file);
        fileFormData.append("content_id", contentId);
        fileFormData.append("type", PhotoType.NEWSLETTER_PDF.toString());

        try {
          const uploadResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/photos`,
            fileFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          );

          if (uploadResponse.data.status === "CREATED") {
            setToast({ type: "success", message: "Newsletter uploaded successfully!" });
            setTimeout(() => router.push("/admin/whats-up"), 1500);
          } else {
            throw new Error("Failed to upload PDF file");
          }
        } catch (uploadError) {
          // If file upload fails, delete the content
          await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${contentId}`);
          throw uploadError;
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setToast({
        type: "error", 
        message: error.response?.data?.message || "Failed to upload newsletter"
      });
    } finally {
      setLoading(false);
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
                disabled={!formData.file || !formData.title || loading}
                className="blue-button flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin mr-2">⌛</div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Publish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
