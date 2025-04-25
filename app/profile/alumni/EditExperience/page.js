"use client"
import { useState } from "react"
import EditExperienceModal from "./2/page"

export default function EditExperience({ experiences, hideExperienceForm }) {
  const [editedExperiences, setEditedExperiences] = useState([...experiences])
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(null)

  const handleEdit = (index) => {
    setSelectedExperienceIndex(index)
  }

  const handleDelete = (index) => {
    const updated = [...editedExperiences]
    updated.splice(index, 1)
    setEditedExperiences(updated)
  }

  const handleUpdate = (index, updatedData) => {
    const updated = [...editedExperiences]
    updated[index] = updatedData
    setEditedExperiences(updated)
    setSelectedExperienceIndex(null)
  }

  const handleModalSave = (updatedAffiliation) => {
    const updated = [...editedExperiences]
    updated[selectedAffiliationIndex] = updatedAffiliation
    setEditedExperiences(updated)
    setSelectedExperienceIndex(null) // close modal
  }

  const handleModalCancel = () => {
    setSelectedExperienceIndex(null)
  }

  const handleSave = () => {
    console.log("Saving affiliations:", editedExperiences)
    hideExperienceForm()
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-2xl font-bold">Edit Experiences</h2>
        <button
          onClick={hideExperienceForm}
          className="ml-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <i className="fa-solid fa-times text-xl"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {editedExperiences.map((experience, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{experience.company}</h3>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <p>{experience.title}</p>
                    <span>•</span>
                    <p>{experience.type}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {experience.startDate} {experience.isCurrentlyAffiliated ? "- Present" : `- ${experience.endDate}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(index)} className="p-2 text-blue-600 hover:text-blue-800">
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(index)} className="p-2 text-red-600 hover:text-red-800">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={hideExperienceForm}
          className="text-sm md:text-base px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="text-sm md:text-base px-2 py-1 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[var(--color-astradark)]"
        >
          Save
        </button>
      </div>


      {selectedExperienceIndex !== null && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
          <EditExperienceModal
            existingExperience={editedExperiences[selectedExperienceIndex]}
            onSave={handleModalSave}
            onCancel={handleModalCancel}
          />
        </div>
      )}
    </div>
  )
}
