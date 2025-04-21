import React, { useState } from 'react';
import { Camera } from 'lucide-react';

export default function EditForm({ profileData, hidePersonalForm }) {
  const [formData, setFormData] = useState(profileData || {});
  const [isMaidenNameChecked, setIsMaidenNameChecked] = useState(
    profileData?.Title === "Ms." || profileData?.Title === "Mrs." ? profileData?.IsMaidenName : false
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'radio') {
      setFormData({ ...formData, Title: value });
      setIsMaidenNameChecked(value === "Ms." || value === "Mrs.");
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, ProfilePicture: URL.createObjectURL(file) });
    }
  };

  return (
  <div className="max-h-[90vh] overflow-y-auto">
    <form className="space-y-4 p-8">
      {/* Profile Picture */}
      <div className="flex justify-center w-full mb-6 relative">
        <div className="relative">
          <img
            src={formData?.ProfilePicture || "/Placeholder.png"}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-gray-300"
            alt="Profile"
          />
          <input
            type="file"
            accept="image/*"
            className="absolute bottom-0 right-0 opacity-0 cursor-pointer w-24 h-24 sm:w-32 sm:h-32 rounded-full"
            onChange={handleImageChange}
            id="profile-picture-upload"
          />
          <label
            htmlFor="profile-picture-upload"
            className="absolute bottom-0 right-0 p-2 bg-black bg-opacity-50 rounded-full cursor-pointer"
          >
            <Camera className="text-white" size={24} />
          </label>
        </div>
      </div>

      {/* Preferred Title & Maiden Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Title</label>
          <div className="flex gap-4">
            {["Mr.", "Ms.", "Mrs.", "Mx."].map((title) => (
              <label key={title} className="inline-flex items-center">
                <input
                  type="radio"
                  name="Title"
                  value={title}
                  checked={formData?.Title === title}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-[var(--color-astraprimary)] focus:ring-[var(--color-astraprimary)]"
                />
                <span className="ml-2">{title}</span>
              </label>
            ))}
          </div>
        </div>
        {isMaidenNameChecked && (
          <div className="flex flex-col mt-auto">
            <label className="inline-flex items-center mt-6 sm:mt-0">
              <input
                type="checkbox"
                name="IsMaidenName"
                checked={formData?.IsMaidenName || false}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-[var(--color-astraprimary)] focus:ring-[var(--color-astraprimary)]"
              />
              <span className="ml-2">Is your last name your maiden name?</span>
            </label>
          </div>
        )}
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            name="FirstName"
            value={formData?.FirstName || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
          <input
            type="text"
            name="MiddleName"
            value={formData?.MiddleName || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            placeholder="Enter your middle name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            name="LastName"
            value={formData?.LastName || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            placeholder="Enter your last name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Suffix</label>
          <input
            type="text"
            name="Suffix"
            value={formData?.Suffix || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            placeholder="Suffix (e.g., Jr., III)"
          />
        </div>
      </div>

      {/* Degree & Graduation Year */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">UPLB Degree</label>
          <select
            name="Degree"
            value={formData?.Degree || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
          >
            <option value="">Select degree</option>
            <option value="BS Computer Science">BS Computer Science</option>
            <option value="MS Computer Science">MS Computer Science</option>
            <option value="Master of Information Technology">Master of Information Technology</option>
            <option value="PhD Computer Science">PhD Computer Science</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
          <input
            type="number"
            name="GraduationYear"
            value={formData?.GraduationYear || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            min="1900"
            max={new Date().getFullYear()}
            placeholder="Enter your graduation year"
          />
        </div>
      </div>

      {/* Civil Status & Student ID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Civil Status</label>
          <select
            name="CivilStatus"
            value={formData?.CivilStatus || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
          >
            <option value="">Select civil status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
            <option value="Divorced">Divorced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
          <input
            type="text"
            name="StudentID"
            value={formData?.StudentID || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            placeholder="Enter your student ID"
          />
        </div>
      </div>      

      {/* Birth Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Birthdate</label>
          <input
            type="date"
            name="Birthdate"
            value={formData?.Birthdate || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Place of Birth</label>
          <input
            type="text"
            name="PlaceOfBirth"
            value={formData?.PlaceOfBirth || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            placeholder="Enter your place of birth"
          />
        </div>
      </div>

      {/* Citizenship & Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country of Citizenship</label>
          <input
            type="text"
            name="Citizenship"
            value={formData?.Citizenship || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            placeholder="Enter your country of citizenship"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            name="Gender"
            value={formData?.Gender || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
          >
            <option value="">Select gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[#006233] transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          onClick={hidePersonalForm}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
  );
}
