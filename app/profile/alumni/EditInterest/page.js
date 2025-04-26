"use client"
import { useState } from "react"
import SkillTag from "@/components/SkillTag"
import { XCircle } from "lucide-react"

export default function EditInterest({ fieldOfInterests, hideInterestForm }) {
  const [interests, setInterests] = useState([...fieldOfInterests])
  const [newInterest, setNewInterest] = useState("")

  const handleAddInterest = (e) => {
    if (e.key === "Enter" && newInterest.trim() !== "") {
      const newTag = {
        text: newInterest.trim(),
        color: "bg-indigo-100 text-indigo-800 border-indigo-300"
      }
      setInterests([...interests, newTag])
      setNewInterest("")
    }
  }

  const handleRemoveInterest = (index) => {
    const updated = [...interests]
    updated.splice(index, 1)
    setInterests(updated)
  }

  const handleSave = () => {
    console.log("Saving interests:", interests)
    hideInterestForm()
  }

  return (
    <div className="w-full max-w-full sm:max-w-2xl px-4 sm:px-6 md:px-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Fields</h2>
        <button onClick={hideInterestForm} className="text-gray-500 hover:text-gray-700">
          <i className="fa-solid fa-times text-xl"></i>
        </button>
      </div>

      <div className="mb-6">
        <div className="border border-gray-300 bg-white rounded-lg p-3 min-h-[64px] w-full flex flex-wrap gap-3">
          {interests.map((interest, index) => (
            <div key={index} className="relative group">
              <SkillTag text={interest.text} color={interest.color} />
              <button
                onClick={() => handleRemoveInterest(index)}
                className="absolute -left-3 -top-2 bg-white rounded-full p-1 shadow group-hover:block hidden"
              >
                <XCircle className="text-red-500 w-4 h-4" />
              </button>
            </div>
          ))}
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={handleAddInterest}
            placeholder="Add field and press Enter"
            className="flex-grow min-w-[200px] outline-none text-sm bg-transparent"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-4">
        <button
          onClick={() => setInterests([])}
          className="text-sm md:text-base px-2 py-1 md:px-4 md:py-2 border border-red-500 text-red-600 rounded-lg bg-white hover:bg-red-50"
        >
          Clear All
        </button>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={hideInterestForm}
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
      </div>
    </div>
  )
}
