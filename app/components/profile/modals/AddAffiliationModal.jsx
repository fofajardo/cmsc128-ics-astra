"use client";
import { useState } from "react";
import ToastNotification from "@/components/ToastNotification";

export default function AddAffiliationModal({ onClose }) {
  const [formData, setFormData] = useState({
    organization: "",
    title: "",
    location: "",
    isCurrentlyAffiliated: false,
    startDate: { month: "", year: "" },
    endDate: { month: "", year: "" },
    description: ""
  });
  const [showToast, setShowToast] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.organization || !formData.title || !formData.location ||
        !formData.startDate.month || !formData.startDate.year) {
      setShowToast({ type: "fail", message: "Please fill in all required fields." });
      return;
    }

    if (!formData.isCurrentlyAffiliated && (!formData.endDate.month || !formData.endDate.year)) {
      setShowToast({ type: "fail", message: "End date is required." });
      return;
    }

    const newAffiliation = {
      ...formData,
      startDate: `${formData.startDate.month} ${formData.startDate.year}`,
      endDate: formData.isCurrentlyAffiliated
        ? "Present"
        : `${formData.endDate.month} ${formData.endDate.year}`
    };

    setShowToast({ type: "success", message: "Affiliation added successfully!" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Add Affiliation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-times text-xl md:text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
              Organization <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Ex: ICS-ASTRA Development Team"
              className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm md:text-base"
              required
            />
          </div>

          {/* Title & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Title <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Frontend Developer"
                className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm md:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Location <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Los Baños, Laguna"
                className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm md:text-base"
                required
              />
            </div>
          </div>

          {/* Current Affiliation */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isCurrentlyAffiliated"
              checked={formData.isCurrentlyAffiliated}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm md:text-base text-gray-700">
              I am currently affiliated with this organization
            </label>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Start Date <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="startDate.month"
                  value={formData.startDate.month}
                  onChange={handleChange}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm md:text-base"
                  required
                >
                  <option value="">Month</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select
                  name="startDate.year"
                  value={formData.startDate.year}
                  onChange={handleChange}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm md:text-base"
                  required
                >
                  <option value="">Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {!formData.isCurrentlyAffiliated && (
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                  End Date <span className="text-[var(--color-astrared)]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="endDate.month"
                    value={formData.endDate.month}
                    onChange={handleChange}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm md:text-base"
                    required
                  >
                    <option value="">Month</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    name="endDate.year"
                    value={formData.endDate.year}
                    onChange={handleChange}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm md:text-base"
                    required
                  >
                    <option value="">Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your role and responsibilities"
              className="w-full px-3 py-1 border border-gray-300 rounded-lg h-32 text-sm md:text-base"
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm md:text-base px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm md:text-base px-2 py-1 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[var(--color-astradark)]"
            >
              Save
            </button>
          </div>
        </form>

        {showToast && (
          <ToastNotification
            type={showToast.type}
            message={showToast.message}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
}