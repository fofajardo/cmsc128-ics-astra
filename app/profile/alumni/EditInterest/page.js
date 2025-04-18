"use client"
import { useState } from "react"

export default function EditInterest({ fieldOfInterests, hideInterestForm }) {
  const [interests, setInterests] = useState([...fieldOfInterests])
  const [newInterest, setNewInterest] = useState("")
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const colors = [
    "bg-pink-100 border-pink-500 text-pink-800",
    "bg-blue-100 border-blue-500 text-blue-800",
    "bg-green-200 border-green-500 text-green-800",
    "bg-violet-100 border-violet-500 text-violet-800",
  ]

  const handleAddInterest = (e) => {
    if (e.key === "Enter" && newInterest.trim() !== "") {
      setInterests([...interests, newInterest])
      setNewInterest("")
    }
  }

  const handleRemoveInterest = (index) => {
    const updatedInterests = [...interests]
    updatedInterests.splice(index, 1)
    setInterests(updatedInterests)
  }

  const handleSave = () => {
    // Here you would typically save the changes to your backend
    console.log("Saving interests:", interests)
    hideInterestForm()
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Fields</h2>
        <button onClick={hideInterestForm} className="text-gray-500 hover:text-gray-700">
          <i className="fa-solid fa-times text-xl"></i>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-3 mb-4">
          {interests.map((interest, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg border-2 relative ${colors[index % colors.length]}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {interest}
              {hoveredIndex === index && (
                <button
                  onClick={() => handleRemoveInterest(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <i className="fa-solid fa-times text-xs"></i>
                </button>
              )}
            </div>
          ))}
          <div className="p-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={handleAddInterest}
              placeholder="Type and press Enter"
              className="bg-transparent border-none outline-none w-40"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setInterests([])}
          className="px-4 py-2 border border-red-500 text-red-600 rounded-lg bg-white hover:bg-red-50"
        >
          Clear All Fields
        </button>
        <div className="flex space-x-4">
          <button
            onClick={hideInterestForm}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#0e6cf3] text-white rounded-lg hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
