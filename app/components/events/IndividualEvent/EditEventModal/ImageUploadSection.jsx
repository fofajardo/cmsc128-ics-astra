"use client";
import { useState } from "react";
import { UploadCloud, ImageIcon, Trash2 } from "lucide-react";

export default function ImageUploadSection({ image, setImage }) {
  const [imagePreview, setImagePreview] = useState(image || "");
  const [fileName, setFileName] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage("");
    setImagePreview("");
    setFileName("");
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-astrablack">Event Image</label>
      <div className="border-2 border-dashed border-astraprimary bg-astrawhite rounded-xl w-full h-48 flex items-center justify-center relative hover:bg-blue-100 transition cursor-pointer overflow-hidden">
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
        ) : (
          <div className="flex flex-col items-center justify-center text-astraprimary text-sm">
            <UploadCloud className="w-8 h-8 mb-1" />
            <p>Browse Files to upload</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="mt-2 bg-astrawhite border border-blue-200 rounded-md px-3 py-2 flex items-center justify-between text-sm text-blue-800">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          <span>{fileName || "No selected File"}</span>
        </div>
        {imagePreview && (
          <button
            type="button"
            onClick={handleImageRemove}
            className="text-astradark hover:text-astrared"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
