"use client";
import { useState } from "react";
import SkillTag from "@/components/SkillTag";
import { XCircle } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";

export default function InterestsModal({ interests: initialInterests, onClose }) {
  const [interests, setInterests] = useState([...initialInterests]);
  const [newInterest, setNewInterest] = useState("");
  const [showToast, setShowToast] = useState(null);

  const handleAddInterest = (e) => {
    if (e.key === "Enter" && newInterest.trim() !== "") {
      const newTag = {
        text: newInterest.trim(),
        color: "bg-indigo-100 text-indigo-800 border-indigo-300"
      };
      setInterests([...interests, newTag]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (index) => {
    const updated = [...interests];
    updated.splice(index, 1);
    setInterests(updated);
  };

  const handleSave = () => {
    setShowToast({ type: "success", message: "Interests saved successfully!" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Edit Interests</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-times text-xl md:text-2xl"></i>
          </button>
        </div>

        <div className="mb-6">
          <div className="border border-gray-300 bg-white rounded-lg p-3 min-h-[64px] max-h-[200px] w-full flex flex-wrap gap-x-2 gap-y-2 overflow-y-auto">
            {interests.map((interest, index) => (
              <div key={index} className="relative group flex items-center">
                <SkillTag text={interest.text} color={interest.color} />
                <button
                  onClick={() => handleRemoveInterest(index)}
                  className="absolute -left-2 -top-2 bg-white rounded-full p-1 shadow group-hover:block hidden"
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
              placeholder="Add Field"
              className="text-xs bg-white border border-gray-300 rounded-full px-4 py-2 h-8 w-40 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4">
          <button
            onClick={() => setInterests([])}
            className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 border border-red-500 text-red-600 rounded-lg bg-white hover:bg-red-50"
          >
            Clear All
          </button>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onClose}
              className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[var(--color-astradark)]"
            >
              Save
            </button>
          </div>
        </div>

        {showToast && (
          <ToastNotification
            type={showToast.type}
            message={showToast.message}
            onClose={() => setShowToast(null)}
          />
        )}
      </div>
    </div>
  );
}