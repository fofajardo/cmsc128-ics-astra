"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Upload, Send } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";
import { useSignedInUser } from "@/components/UserContext";

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
      // Create content entry
      const contentPayload = {
        user_id: userContext?.state?.authUser?.id,
        title: formData.title,
        details: `Newsletter: ${formData.title}`,
        views: 0,
        tags: ["newsletter"]
      };

      let contentId;
      try {
        const contentResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/contents`,
          contentPayload
        );

        if (contentResponse.data.status === "CREATED") {
          contentId = contentResponse.data.content.id;
          setToast({ type: "info", message: "Content created, uploading file..." });
        } else {
          throw new Error(contentResponse.data?.message || "Failed to create newsletter entry");
        }
      } catch (error) {
        throw new Error(`Content creation failed: ${error.response?.data?.message || error.message}`);
      }

      // Upload PDF file
      try {
        const fileFormData = new FormData();
        fileFormData.append("File", formData.file);
        fileFormData.append("content_id", contentId);
        fileFormData.append("type", PhotoType.NEWSLETTER_PDF); // Newsletter type

        const uploadResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/photos`,
          fileFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        // Even if Supabase shows an error but the file uploaded successfully
        if (uploadResponse.data && (uploadResponse.data.status === "CREATED" || uploadResponse.data.photo)) {
          setToast({ type: "success", message: "Newsletter published successfully!" });
          // Give time for the success message to show before redirecting
          await new Promise(resolve => setTimeout(resolve, 1500));
          router.push("/admin/whats-up");
          return;
        }
      } catch (error) {
        // If the file actually uploaded despite the error
        if (error.response?.status === 200 || error.response?.data?.photo) {
          setToast({ type: "success", message: "Newsletter published successfully!" });
          await new Promise(resolve => setTimeout(resolve, 1500));
          router.push("/admin/whats-up");
          return;
        }
        throw new Error(`File upload failed: ${error.response?.data?.message || error.message}`);
      }

    } catch (error) {
      console.error("Upload process failed:", error);
      setToast({
        type: "error",
        message: error.message || "Failed to upload newsletter"
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
