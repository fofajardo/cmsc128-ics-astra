"use client";
import React, { useState } from "react";
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {toast} from "@/components/ToastNotification.jsx";

export default function PersonalInfoModal({ profileData }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(profileData || {});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "radio") {
      setFormData({ ...formData, Title: value });
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
      toast({ variant: "fail", title: "Please fill in the missing fields." });
      return;
    }

    toast({ variant: "success", title: "Your profile has been saved!" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white hover:bg-[var(--color-astradark)] rounded-md">
        Edit
      </DialogTrigger>
      <DialogContent loading={isSubmitting}>
        <DialogHeader>
          <DialogTitle>Edit Intro</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Preferred Title */}
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
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}