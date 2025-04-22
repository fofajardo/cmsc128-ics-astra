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
    <div className="w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Affiliations</h2>
        <button onClick={hideAffiliationForm} className="text-gray-500 hover:text-gray-700">
          <i className="fa-solid fa-times text-xl"></i>
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={() => (window.location.href = "/AddAffiliation")}
          className="px-4 py-2 bg-[#0e6cf3] text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Add Affiliation
        </button>
      </div>

      <div className="space-y-6">
        {editedAffiliations.map((affiliation, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start">
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
                <p className="mt-2 text-gray-600">{affiliation.description}</p>
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
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button onClick={handleSave} className="px-4 py-2 bg-[#0e6cf3] text-white rounded-lg hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  )
}
