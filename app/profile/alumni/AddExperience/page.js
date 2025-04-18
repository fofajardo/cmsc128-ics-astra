"use client"
import { useState } from "react"

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
    "Self-employed",
    "Freelance",
    "Contract",
    "Internship",
    "Apprenticeship",
    "Seasonal",
  ]

  const locationTypes = ["On-site", "Hybrid", "Remote"]

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

    console.log("New experience:", newExperience)
    // Here you would typically save to your backend

    // Close the form
    hideAddExperienceForm()
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add Experience</h2>
        <button onClick={hideAddExperienceForm} className="text-gray-500 hover:text-gray-700">
          <i className="fa-solid fa-times text-xl"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company or Organization</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Ex: Department of Information and Communications Technology"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6"> {/* Employment details in 3 columns */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Makati, Philippines"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {locationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center"> {/* Checkbox full width */}
            <input
              type="checkbox"
              id="isCurrentlyWorking"
              name="isCurrentlyWorking"
              checked={formData.isCurrentlyWorking}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isCurrentlyWorking" className="ml-2 block text-sm text-gray-700">
              I am currently working in this role
            </label>
          </div>

          <div className="grid grid-cols-2 gap-6"> {/* Date fields side by side */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="startDate.month"
                  value={formData.startDate.month}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  name="startDate.year"
                  value={formData.startDate.year}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!formData.isCurrentlyWorking && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="endDate.month"
                    value={formData.endDate.month}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!formData.isCurrentlyWorking}
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    name="endDate.year"
                    value={formData.endDate.year}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!formData.isCurrentlyWorking}
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div> {/* Full width description */}
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your role and responsibilities"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            ></textarea>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={hideAddExperienceForm}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-[#0e6cf3] text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
