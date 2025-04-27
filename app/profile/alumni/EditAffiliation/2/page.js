"use client"
import { useState, useEffect } from "react"
import ToastNotification from "@/components/ToastNotification"

export default function EditAffiliationModal({ existingAffiliation, onCancel }) {
  const [formData, setFormData] = useState({
    organization: "",
    title: "",
    location: "",
    locationType: "",
    isCurrentlyAffiliated: false,
    startDate: { month: "", year: "" },
    endDate: { month: "", year: "" },
    description: "",
  })

  useEffect(() => {
    if (existingAffiliation) {
      const [startMonth, startYear] = existingAffiliation.startDate.split(" ")

      // Handle the end date when it's "Present" or null
      const [endMonth, endYear] =
        existingAffiliation.endDate && existingAffiliation.endDate !== "Present"
          ? existingAffiliation.endDate.split(" ")
          : ["", ""]

      setFormData({
        ...existingAffiliation,
        startDate: { month: startMonth, year: startYear },
        endDate: { month: endMonth, year: endYear },
      })
    }
  }, [existingAffiliation])

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)
  const [showToast, setShowToast] = useState(false)

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

    // Validate required fields
    if (!formData.organization || !formData.title || !formData.location || !formData.startDate.month || !formData.startDate.year) {
      setShowToast({
        type: "fail",
        message: "Please fill in all required fields.",
      })
      return
    }

    // Validate end date if not currently affiliated
    if (!formData.isCurrentlyAffiliated && (!formData.endDate.month || !formData.endDate.year)) {
      setShowToast({
        type: "fail",
        message: "End date is required.",
      })
      return
    }

    const updatedAffiliation = {
      ...formData,
      startDate: `${formData.startDate.month} ${formData.startDate.year}`,
      endDate: formData.isCurrentlyAffiliated
        ? "Present" // Mark as "Present" if still affiliated
        : `${formData.endDate.month} ${formData.endDate.year}`,
    }
    
    setShowToast({ type: "success", message: "Affiliation updated successfully!" })
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-[var(--color-astrawhite)] rounded-lg flex flex-col">
    <div className="overflow-y-auto max-h-[70vh] p-2">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Affiliation</h2>
          <button
            onClick={onCancel}
            className="ml-4 p-2 text-gray-500 hover:text-gray-700"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        {/* Organization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization <span className="text-[var(--color-astrared)]">*</span></label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="w-full px-4 py-1 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Title & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-[var(--color-astrared)]">*</span></label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-[var(--color-astrared)]">*</span></label>
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

        {/* Current Affiliation Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isCurrentlyAffiliated"
            name="isCurrentlyAffiliated"
            checked={formData.isCurrentlyAffiliated}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="isCurrentlyAffiliated" className="ml-2 text-sm text-gray-700">
            I am currently affiliated with this organization
          </label>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-[var(--color-astrared)]">*</span></label>
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

          {!formData.isCurrentlyAffiliated && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-[var(--color-astrared)]">*</span></label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="endDate.month"
                  value={formData.endDate.month}
                  onChange={handleChange}
                  className="px-4 py-1 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Month</option>
                  {months.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select
                  name="endDate.year"
                  value={formData.endDate.year}
                  onChange={handleChange}
                  className="px-4 py-1 border border-gray-300 rounded-lg"
                  required
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
    {showToast && (
      <ToastNotification
        type={showToast.type}
        message={showToast.message}
        onClose={() => setShowToast(null)} // Close the toast when it disappears
      />
    )}
    </div>
  )
}
