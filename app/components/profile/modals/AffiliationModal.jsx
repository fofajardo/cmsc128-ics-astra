"use client";
import { useState } from "react";
import EditAffiliationModal from "./EditAffiliationModal";
import ToastNotification from "@/components/ToastNotification";

export default function AffiliationModal({ affiliations: initialAffiliations, onClose }) {
  const [affiliations, setAffiliations] = useState([...initialAffiliations]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleEdit = (index) => {
    setSelectedIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...affiliations];
    updated.splice(index, 1);
    setAffiliations(updated);
  };

  const handleModalSave = (updatedAffiliation) => {
    const updated = [...affiliations];
    updated[selectedIndex] = updatedAffiliation;
    setAffiliations(updated);
    setSelectedIndex(null);
  };

  const handleSave = () => {
    setShowToast({ type: "success", message: "Affiliations saved successfully!" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Edit Affiliations</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-times text-xl md:text-2xl"></i>
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {affiliations.map((aff, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-md md:text-lg font-semibold">{aff.organization}</h3>
                  <p className="text-sm md:text-base text-gray-600">{aff.title}</p>
                  <p className="text-sm md:text-base text-gray-500">
                    {aff.startDate} {aff.isCurrentlyAffiliated ? "- Present" : `- ${aff.endDate}`}
                  </p>
                  <p className="text-sm md:text-base text-gray-500">
                    {aff.location} • {aff.isCurrentlyAffiliated ? "Currently Affiliated" : "Not Affiliated"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 text-astraprimary hover:text-blue-800"
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

        {selectedIndex !== null && (
          <EditAffiliationModal
            affiliation={affiliations[selectedIndex]}
            onClose={() => setSelectedIndex(null)}
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