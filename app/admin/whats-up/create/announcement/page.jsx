"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Image, Send, Save } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";
import axios from 'axios';
import { useSignedInUser } from "@/components/UserContext";

export default function CreateAnnouncement() {
  const user  = useSignedInUser();
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    type: "Event"
  });
  const [editorContent, setEditorContent] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setToast({ type: "error", message: "Please enter a title" });
      return false;
    }
    if (!formData.description.trim()) {
      setToast({ type: "error", message: "Please enter a description" });
      return false;
    }
    if (!editorContent.trim()) {
      setToast({ type: "error", message: "Please enter content" });
      return false;
    }
    return true;
  };

  const prepareFormData = (status) => {
    return {
      // user_id: useSignedInUser().user_id,
      title: formData.title,
      details: editorContent,
      image: formData.image, // In production, this would be an uploaded image URL
    };
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = prepareFormData("draft");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/contents`,
        payload
      );

      setToast({ type: "success", message: "Announcement saved as draft" });
      setTimeout(() => router.push("/admin/whats-up"), 2000);
    } catch (error) {
      console.error("Error saving draft:", error);
      setToast({ type: "error", message: "Failed to save draft" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = prepareFormData("published");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/contents`,
        payload
      );

      setToast({ type: "success", message: "Announcement published successfully" });
      setTimeout(() => router.push("/admin/whats-up"), 2000);
    } catch (error) {
      console.error("Error publishing announcement:", error);
      setToast({ type: "error", message: "Failed to publish announcement" });
    } finally {
      setIsLoading(false);
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
            <div className={`relative w-full h-full rounded-xl ${!formData.image ? "bg-astradarkgray/90" : ""}`}>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
              <div className={`absolute inset-0 ${formData.image ? "bg-astradarkgray/50 opacity-0 group-hover:opacity-100" : ""} rounded-xl transition-opacity`}>
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

            {/* Rich Text Editor */}
            <div className="mb-6">
              <div className="border border-astragray rounded-lg">
                <div className="bg-astradirtywhite p-2 border-b border-astragray">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="p-1 hover:bg-astragray/30 rounded"
                      onClick={() => {
                        const selection = window.getSelection().toString();
                        if (selection) {
                          // Replace selected text with bold version
                          const content = editorContent;
                          const textarea = document.getElementById('richTextEditor');
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          setEditorContent(
                            content.substring(0, start) +
                            `<b>${selection}</b>` +
                            content.substring(end)
                          );
                        } else {
                          setEditorContent(prev => `<b>${prev}</b>`);
                        }
                      }}
                      title="Bold"
                    >
                      <span className="font-bold">B</span>
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-astragray/30 rounded"
                      onClick={() => {
                        const selection = window.getSelection().toString();
                        if (selection) {
                          // Replace selected text with italic version
                          const content = editorContent;
                          const textarea = document.getElementById('richTextEditor');
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          setEditorContent(
                            content.substring(0, start) +
                            `<i>${selection}</i>` +
                            content.substring(end)
                          );
                        } else {
                          setEditorContent(prev => `<i>${prev}</i>`);
                        }
                      }}
                      title="Italic"
                    >
                      <span className="italic">I</span>
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-astragray/30 rounded"
                      onClick={() => {
                        const selection = window.getSelection().toString();
                        if (selection) {
                          // Replace selected text with underlined version
                          const content = editorContent;
                          const textarea = document.getElementById('richTextEditor');
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          setEditorContent(
                            content.substring(0, start) +
                            `<u>${selection}</u>` +
                            content.substring(end)
                          );
                        } else {
                          setEditorContent(prev => `<u>${prev}</u>`);
                        }
                      }}
                      title="Underline"
                    >
                      <span className="underline">U</span>
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-astragray/30 rounded"
                      onClick={() => {
                        setEditorContent(prev => `<h2>${prev}</h2>`);
                      }}
                      title="Heading"
                    >
                      <span className="font-bold text-lg">H</span>
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-astragray/30 rounded"
                      onClick={() => {
                        setEditorContent(prev => `${prev}<ul><li>List item</li></ul>`);
                      }}
                      title="Bullet List"
                    >
                      <span>• List</span>
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-astragray/30 rounded"
                      onClick={() => {
                        setEditorContent(prev => `${prev}<a href="#">Link</a>`);
                      }}
                      title="Link"
                    >
                      <span className="underline text-blue-500">Link</span>
                    </button>
                  </div>
                </div>
                <textarea
                  id="richTextEditor"
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="w-full font-rb text-astradarkgray p-4 outline-none rounded-b-lg"
                  placeholder="Enter rich text content here (HTML tags supported)"
                  rows={10}
                />
              </div>
              <div className="mt-2 text-xs text-astragray">
                <p>Use HTML tags for formatting: &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;u&gt;underline&lt;/u&gt;, etc.</p>
                <div className="mt-1">
                  <details>
                    <summary className="cursor-pointer hover:text-astradarkgray">Preview Content</summary>
                    <div
                      className="mt-2 p-3 border border-astragray rounded-lg bg-white"
                      dangerouslySetInnerHTML={{ __html: editorContent }}
                    />
                  </details>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-astragray">
              <button
                onClick={() => router.back()}
                className="gray-button"
                disabled={isLoading}
              >
                Cancel
              </button>
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
                {isLoading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}