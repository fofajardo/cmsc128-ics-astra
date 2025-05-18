"use client";
import { useState } from "react";
import EditExperienceModal from "./EditExperienceModal";
import ToastNotification from "@/components/ToastNotification";

export default function ExperienceModal({ experiences: initialExperiences, onClose }) {
  const [experiences, setExperiences] = useState([...initialExperiences]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleEdit = (index) => {
    setSelectedIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...experiences];
    updated.splice(index, 1);
    setExperiences(updated);
  };

  const handleModalSave = (updatedExperience) => {
    const updated = [...experiences];
    updated[selectedIndex] = updatedExperience;
    setExperiences(updated);
    setSelectedIndex(null);
  };

  const handleSave = () => {
    setShowToast({ type: "success", message: "Experiences saved successfully!" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Edit Experiences</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-times text-xl md:text-2xl"></i>
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {experiences.map((exp, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-md md:text-lg font-semibold">{exp.company}</h3>
                  <div className="text-sm md:text-base flex items-center space-x-2 text-gray-600">
                    <p>{exp.title} • {exp.type}</p>
                  </div>
                  <p className="text-sm md:text-base text-gray-500">
                    {exp.startDate} {exp.isCurrentlyWorking ? "- Present" : `- ${exp.endDate}`}
                  </p>
                  <p className="text-sm md:text-base text-gray-500">{exp.location}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
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

        {selectedIndex !== null && (
          <EditExperienceModal
            experience={experiences[selectedIndex]}
            onClose={() => setSelectedIndex(null)}
            onSave={handleModalSave}
          />
        )}

        {showToast && (
          <ToastNotification
            type={showToast.type}
            message={showToast.message}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
}