"use client"
import { useState, useEffect } from "react"

export default function EditExperienceModal({ existingExperience, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    type: "Full-time",
    location: "",
    locationType: "",
    isCurrentlyWorking: false,
    startDate: {
      month: "",
      year: "",
    },
    endDate: {
      month: "",
      year: "",
    },
    description: "",
  })

  useEffect(() => {
    if (existingExperience) {
      const [startMonth, startYear] = existingExperience.startDate.split(" ")

      let endMonth = "";
      let endYear = "";

      // Check if endDate exists before splitting
      if (existingExperience.endDate && existingExperience.endDate !== "Present") {
        [endMonth, endYear] = existingExperience.endDate.split(" ")
      }

      setFormData({
        ...existingExperience,
        startDate: { month: startMonth, year: startYear },
        endDate: { month: endMonth, year: endYear },
      })
    }
  }, [existingExperience])

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedExperience = {
      ...formData,
      startDate: `${formData.startDate.month} ${formData.startDate.year}`,
      endDate: formData.isCurrentlyWorking
        ? null // End date should be null when still working
        : `${formData.endDate.month} ${formData.endDate.year}`,
    }
    onSave(updatedExperience)
  }

  return (
    <div className="bg-[var(--color-astrawhite)] rounded-lg shadow-xl w-full max-w-3xl p-6">
      <div className="overflow-y-auto max-h-[70vh] p-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Experience</h2>
          <button
            onClick={onCancel}
            className="ml-4 p-2 text-gray-500 hover:text-gray-700"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        {/* Organization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-1 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Title & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-1 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-1 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Location Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
          <select
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
            className="w-full px-4 py-1 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select type</option>
            <option value="Face-to-face">Face-to-face</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Current Work Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isCurrentlyWorking"
            name="isCurrentlyWorking"
            checked={formData.isCurrentlyWorking}  // This will check the checkbox if isCurrentlyWorking is true
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="isCurrentlyWorking" className="ml-2 text-sm text-gray-700">
            I am currently working here
          </label>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="startDate.month"
                value={formData.startDate.month}
                onChange={handleChange}
                className="px-4 py-1 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Month</option>
                {months.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                name="startDate.year"
                value={formData.startDate.year}
                onChange={handleChange}
                className="px-4 py-1 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Year</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {!formData.isCurrentlyWorking && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="endDate.month"
                  value={formData.endDate.month || ""}
                  onChange={handleChange}
                  className="px-4 py-1 border border-gray-300 rounded-lg"
                >
                  <option value="">Month</option>
                  {months.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select
                  name="endDate.year"
                  value={formData.endDate.year || ""}
                  onChange={handleChange}
                  className="px-4 py-1 border border-gray-300 rounded-lg"
                >
                  <option value="">Year</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-1 border border-gray-300 rounded-lg h-28"
            placeholder="Optional"
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
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
    </div>
    </div>
  )
}
