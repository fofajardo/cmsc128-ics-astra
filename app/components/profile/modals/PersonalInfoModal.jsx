"use client";
import React, { useState } from "react";
import { Camera } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";

export default function PersonalInfoModal({ profileData, onClose }) {
  const [formData, setFormData] = useState(profileData || {});
  const [isMaidenNameChecked, setIsMaidenNameChecked] = useState(
    profileData?.Title === "Ms." || profileData?.Title === "Mrs." ? profileData?.IsMaidenName : false
  );
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "radio") {
      setFormData({ ...formData, Title: value });
      setIsMaidenNameChecked(value === "Ms." || value === "Mrs.");
    } else if (type === "checkbox") {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = {
      Title: formData.Title,
      FirstName: formData.FirstName,
      MiddleName: formData.MiddleName,
      LastName: formData.LastName,
      Degree: formData.Degree,
      GraduationYear: formData.GraduationYear,
      CivilStatus: formData.CivilStatus,
      BirthDate: formData.BirthDate,
      BirthPlace: formData.BirthPlace,
      Citizenship: formData.Citizenship,
    };

    const isEmpty = (value) =>
      value === undefined || value === null || (typeof value === "string" && value.trim() === "");

    const missingFields = Object.entries(requiredFields).filter(([_, value]) => isEmpty(value));

    if (missingFields.length > 0) {
      setShowToast({ type: "fail", message: "Please fill in the missing fields." });
      return;
    }

    setShowToast({ type: "success", message: "Your profile has been saved!" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg w-full max-w-4xl p-8">
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Profile Picture */}
          <div className="flex justify-center w-full mb-8 relative">
            <div className="relative">
              <img
                src={formData?.ProfilePicture || "/Placeholder.png"}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-gray-300"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Preferred Title <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
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
                    <span className="ml-2 text-sm md:text-base">{title}</span>
                  </label>
                ))}
              </div>
            </div>
            {isMaidenNameChecked && (
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                  Maiden Name
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="IsMaidenName"
                    checked={formData?.IsMaidenName || false}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-[var(--color-astraprimary)] focus:ring-[var(--color-astraprimary)]"
                  />
                  <span className="ml-2 text-sm md:text-base">
                    Is your last name your maiden name?
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                First Name <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <input
                type="text"
                name="FirstName"
                value={formData?.FirstName || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Middle Name <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <input
                type="text"
                name="MiddleName"
                value={formData?.MiddleName || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                placeholder="Enter your middle name"
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Last Name <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <input
                type="text"
                name="LastName"
                value={formData?.LastName || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                placeholder="Enter your last name"
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Suffix</label>
              <input
                type="text"
                name="Suffix"
                value={formData?.Suffix || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                placeholder="Suffix (e.g., Jr., III)"
              />
            </div>
          </div>

          {/* Degree & Graduation Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                UPLB Degree <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <select
                name="Degree"
                value={formData?.Degree || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
              >
                <option value="">Select degree</option>
                <option value="BS Computer Science">BS Computer Science</option>
                <option value="MS Computer Science">MS Computer Science</option>
                <option value="Master of Information Technology">Master of Information Technology</option>
                <option value="PhD Computer Science">PhD Computer Science</option>
              </select>
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Graduation Year <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <input
                type="number"
                name="GraduationYear"
                value={formData?.GraduationYear || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="Enter your graduation year"
              />
            </div>
          </div>

          {/* Civil Status & Student ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Civil Status <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <select
                name="CivilStatus"
                value={formData?.CivilStatus || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
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
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="text"
                name="StudentID"
                value={formData?.StudentNumber || ""}
                onChange={handleChange}
                disabled={true}
                className="w-full rounded-lg border border-gray-300 px-3 py-1 bg-gray-100 cursor-not-allowed text-sm md:text-base"
                placeholder="Enter your student ID"
              />
            </div>
          </div>

          {/* Birth Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Birthdate <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <input
                type="date"
                name="BirthDate"
                value={formData?.BirthDate || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Place of Birth <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <input
                type="text"
                name="BirthPlace"
                value={formData?.BirthPlace || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                placeholder="Enter your place of birth"
              />
            </div>
          </div>

          {/* Citizenship & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Country of Citizenship <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <input
                type="text"
                name="Citizenship"
                value={formData?.Citizenship || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                placeholder="Enter your country of citizenship"
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Gender <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <select
                name="Gender"
                value={formData?.Gender || ""}
                onChange={handleChange}
                disabled={true}
                className="w-full rounded-lg border border-gray-300 px-3 py-1 bg-gray-100 cursor-not-allowed text-sm md:text-base"
              >
                <option value="">Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="submit"
              className="text-sm md:text-base px-4 py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[var(--color-astradark)] transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              className="text-sm md:text-base px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Show Toast Notification */}
        {showToast && (
          <ToastNotification
            type={showToast.type}
            message={showToast.message}
            onClose={() => setShowToast(null)}
          />
        )}
      </div>
    </div>
  );
}