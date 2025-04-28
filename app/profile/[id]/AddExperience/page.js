"use client"
import { useState } from "react"
import ToastNotification from "@/components/ToastNotification"

export default function AddExperience({ hideAddExperienceForm }) {
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    type: "Full-time",
    location: "",
    locationType: "On-site",
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

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)
  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contractual",
    "Internship"
  ]
  const locationTypes = ["On-site", "Remote", "Hybrid"]

  const [showToast, setShowToast] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.company || !formData.title || !formData.type || !formData.location || !formData.startDate.month || !formData.startDate.year) {
      setShowToast({
        type: "fail",
        message: "Please fill in all required fields.",
      })
      return
    }

    // If not currently working, validate end date
    if (!formData.isCurrentlyWorking && (!formData.endDate.month || !formData.endDate.year)) {
      setShowToast({
        type: "fail",
        message: "End date is required.",
      })
      return
    }

    // Format dates
    const startDateFormatted = `${formData.startDate.month} ${formData.startDate.year}`
    const endDateFormatted = formData.isCurrentlyWorking
      ? "Present"
      : `${formData.endDate.month} ${formData.endDate.year}`

    const newExperience = {
      company: formData.company,
      title: formData.title,
      type: formData.type,
      location: formData.location,
      locationType: formData.locationType,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      description: formData.description,
    }

    setShowToast({
      type: "success",
      message: "Your experience has been added!",
    });
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-[var(--color-astrawhite)] rounded-lg flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Add Experience</h2>
        <button onClick={hideAddExperienceForm} className="text-gray-500 hover:text-gray-700">
          <i className="fa-solid fa-times text-xl md:text-2xl"></i>
        </button>
      </div>

      <div className="overflow-y-auto max-h-[70vh] p-2">
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {/* Company */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Company or Organization <span className="text-[var(--color-astrared)]">*</span></label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Ex: Department of Information and Communications Technology"
              className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Title & Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Title <span className="text-[var(--color-astrared)]">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Software Engineer"
                className="text-sm md:text-base w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Employment Type <span className="text-[var(--color-astrared)]">*</span></label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="text-sm md:text-base w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select type</option>
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Currently Working */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isCurrentlyWorking"
              name="isCurrentlyWorking"
              checked={formData.isCurrentlyWorking}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isCurrentlyWorking" className="ml-2 block text-sm md:text-base text-gray-700">
              I am currently working in this role
            </label>
          </div>

          {/* Start and End Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Start Date <span className="text-[var(--color-astrared)]">*</span></label>
              
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="startDate.month"
                  value={formData.startDate.month}
                  onChange={handleChange}
                  className="text-sm md:text-base px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  name="startDate.year"
                  value={formData.startDate.year}
                  onChange={handleChange}
                  className="text-sm md:text-base px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {!formData.isCurrentlyWorking && (
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">End Date <span className="text-[var(--color-astrared)]">*</span></label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="endDate.month"
                    value={formData.endDate.month}
                    onChange={handleChange}
                    className="text-sm md:text-base px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    name="endDate.year"
                    value={formData.endDate.year}
                    onChange={handleChange}
                    className="text-sm md:text-base px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Location & Location Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Location <span className="text-[var(--color-astrared)]">*</span></label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Makati, Philippines"
                className="text-sm md:text-base w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Location Type <span className="text-[var(--color-astrared)]">*</span></label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                className="text-sm md:text-base w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {locationTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your role and responsibilities"
              className="text-sm md:text-base w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
            ></textarea>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={hideAddExperienceForm}
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
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  )
}
