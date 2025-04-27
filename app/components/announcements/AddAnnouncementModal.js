"use client";
import { useState } from 'react';
import { X, Upload, Plus } from "lucide-react";

export default function AddAnnouncementModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-astradarkgray hover:text-astrablack"
        >
          <X className="w-6 h-6" />
        </button>

        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold text-astrablack mb-6">Add New Announcement</h2>
          
          {/* Image Upload */}
          <div className="mb-6">
            <div className="relative">
              {formData.image ? (
                <div className="relative w-full h-48">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-astragray rounded-lg cursor-pointer hover:bg-astralightgray/50">
                  <Upload className="w-8 h-8 text-astradarkgray mb-2" />
                  <span className="text-astradarkgray">Upload cover image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter announcement title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-astragray rounded-lg focus:outline-none focus:border-astraprimary"
            />
          </div>

          {/* Content Input */}
          <div className="mb-6">
            <textarea
              placeholder="Write your announcement content here..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-3 border border-astragray rounded-lg h-48 resize-none focus:outline-none focus:border-astraprimary"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-astradarkgray hover:bg-astralightgray rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-astraprimary text-white rounded-lg hover:bg-astraprimary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
