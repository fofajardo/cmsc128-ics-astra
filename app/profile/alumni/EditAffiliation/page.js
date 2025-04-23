"use client"
import { useState } from "react"

export default function EditAffiliation({ affiliations, hideAffiliationForm }) {
  const [editedAffiliations, setEditedAffiliations] = useState([...affiliations])
  const [selectedAffiliationIndex, setSelectedAffiliationIndex] = useState(null)

  const handleEdit = (index) => {
    setSelectedAffiliationIndex(index)
  }

  const handleDelete = (index) => {
    const updatedAffiliations = [...editedAffiliations]
    updatedAffiliations.splice(index, 1)
    setEditedAffiliations(updatedAffiliations)
  }

  const handleSave = () => {
    // Here you would typically save the changes to your backend
    console.log("Saving affiliations:", editedAffiliations)
    hideAffiliationForm()
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col max-h-[90vh] overflow-y-auto px-4 pt-6 pb-4">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-2xl font-bold">Edit Affiliations</h2>
        <button
          onClick={hideAffiliationForm}
          className="ml-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <i className="fa-solid fa-times text-xl"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {editedAffiliations.map((affiliation, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-lg font-semibold">{affiliation.organization}</h3>
                <p className="text-gray-600">{affiliation.title}</p>
                <p className="text-sm text-gray-500">
                  {affiliation.location} •{" "}
                  {affiliation.isCurrentlyAffiliated ? "Currently Affiliated" : "Not Affiliated"}
                </p>
                <p className="text-sm text-gray-500">
                  {affiliation.startDate} - {affiliation.endDate}
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
          onClick={hideAffiliationForm}
          className="text-sm md:text-base px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button onClick={handleSave} className="text-sm md:text-base px-2 py-1 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[var(--color-astradark)]">
          Save
        </button>
      </div>
    </div>
  )
}
