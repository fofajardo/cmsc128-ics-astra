"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Save, X, Upload } from "lucide-react";

export default function ArticleDetailsPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({
    title: "ICS Welcomes New Faculty Members",
    status: "Published",
    date: "April 15, 2024",
    body: [
      "The Institute of Computer Science (ICS) is delighted to announce the addition of several distinguished faculty members to its team this academic year. These new appointments bring compelling expertise and innovative teaching methodologies, further strengthening the institute's reputation for academic excellence.",
      "Our new faculty members come from diverse professional backgrounds, with expertise ranging from artificial intelligence and data science to cybersecurity and software engineering. They are expected to contribute significantly to path-breaking research and innovation.",
      "In welcoming these new colleagues, ICS reaffirms its dedication to providing high-quality education, mentoring future leaders, and pushing the boundaries of what is possible in computer science. We look forward to the unique perspectives and fresh ideas they bring as they work to inspire students, drive knowledge sharing, and achieve milestones in research and innovation."
    ]
  });
  const [imageFile, setImageFile] = useState(null);

  const handleSave = () => {
    // Add save to backend logic here
    console.log('Saving:', content);
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-astradirtywhite">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-astraprimary hover:text-astraprimary/80"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Announcements
          </button>
          
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit2 className="w-4 h-4" />
              Edit Article
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="relative">
            <img
              src={imageFile || content.imageUrl || "https://cdn.builder.io/api/v1/image/assets/7687333fb4bb4909a4eab75308bcf09b/950fa1cdac6430480b31ef36a44036380a994f87?placeholderIfAbsent=true"}
              alt="Article Cover"
              className={`w-full h-[400px] object-cover ${isEditing ? 'opacity-50' : ''}`}
            />
            {isEditing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 cursor-pointer">
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-white mb-2" />
                  <span className="text-white text-lg font-medium">Upload Cover Image</span>
                  <span className="text-white/80 text-sm mt-1">Click to browse</span>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
          
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {content.status}
              </span>
              <span className="text-astradarkgray">{content.date}</span>
            </div>

            {isEditing ? (
              <input
                type="text"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="text-3xl font-bold text-astrablack mb-4 w-full px-2 py-1 border rounded"
              />
            ) : (
              <h1 className="text-3xl font-bold text-astrablack mb-4">
                {content.title}
              </h1>
            )}

            <div className="prose max-w-none">
              {content.body.map((paragraph, index) => (
                isEditing ? (
                  <textarea
                    key={index}
                    value={paragraph}
                    onChange={(e) => {
                      const newBody = [...content.body];
                      newBody[index] = e.target.value;
                      setContent({ ...content, body: newBody });
                    }}
                    className="text-astradarkgray mb-4 w-full p-2 border rounded min-h-[100px]"
                  />
                ) : (
                  <p key={index} className="text-astradarkgray mb-4">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
