"use client"
import { useState } from "react"

export default function AddAffiliation({ hideAddAffiliationForm }) {
  const [formData, setFormData] = useState({
    organization: "",
    title: "",
    location: "",
    isCurrentlyAffiliated: false,
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

    const startDateFormatted = `${formData.startDate.month} ${formData.startDate.year}`
    const endDateFormatted = formData.isCurrentlyAffiliated
      ? "Present"
      : `${formData.endDate.month} ${formData.endDate.year}`

    const newAffiliation = {
      organization: formData.organization,
      title: formData.title,
      location: formData.location,
      locationType: formData.locationType,
      isCurrentlyAffiliated: formData.isCurrentlyAffiliated,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      description: formData.description,
    }

    console.log("New affiliation:", newAffiliation)
    hideAddAffiliationForm()
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add Affiliation</h2>
        <button onClick={hideAddAffiliationForm} className="text-gray-500 hover:text-gray-700">
          <i className="fa-solid fa-times text-xl"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Ex: ICS-ASTRA Development Team"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Title and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Frontend Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                placeholder="Ex: Los Baños, Laguna"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isCurrentlyAffiliated"
              name="isCurrentlyAffiliated"
              checked={formData.isCurrentlyAffiliated}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isCurrentlyAffiliated" className="ml-2 block text-sm text-gray-700">
              I am currently affiliated with this organization
            </label>
          </div>

          {/* Start & End Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Start */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="grid grid-cols-2 gap-4">
                <select name="startDate.month" value={formData.startDate.month} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Month</option>
                  {months.map((month) => <option key={month} value={month}>{month}</option>)}
                </select>
                <select name="startDate.year" value={formData.startDate.year} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Year</option>
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>

            {/* End */}
            {!formData.isCurrentlyAffiliated && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <div className="grid grid-cols-2 gap-4">
                  <select name="endDate.month" value={formData.endDate.month} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Month</option>
                    {months.map((month) => <option key={month} value={month}>{month}</option>)}
                  </select>
                  <select name="endDate.year" value={formData.endDate.year} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Year</option>
                    {years.map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your role and responsibilities"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={hideAddAffiliationForm}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[var(--color-astradark)] font-medium"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
