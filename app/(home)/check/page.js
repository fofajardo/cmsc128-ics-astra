"use client";
import { useState } from "react";
import EditForm from "@/profile/alumni/EditPersonal/page";

export default function InformationChanged() {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleYesClick = () => {
    setShowEditModal(true);
  };

  const handleNoClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-astratintedwhite)] relative">
      <div className="w-full max-w-md">
        <div className="p-8 rounded-lg shadow-sm bg-[var(--color-astrawhite)]">
          <h1 className="text-[var(--color-astrablack)] text-3xl font-bold mb-2">
            Has your information changed?
          </h1>
          <p className="text-sm mb-6 text-gray-700">
            Please let us know if any of your personal details have changed since your last visit.
          </p>

          <div className="space-y-3">
            <button 
              onClick={handleYesClick}
              className="w-full py-2.5 px-4 border text-[var(--color-astrawhite)] bg-[var(--color-astraprimary)] rounded-md text-sm text-center"
            >
              Yes, my information has changed
            </button>
            <button 
              onClick={handleNoClick}
              className="w-full py-2.5 px-4 border border-gray-200 rounded-md text-sm text-center text-[var(--color-astrablack)]"
            >
              No, everything is the same
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-[var(--color-astratintedwhite)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-4">
            <EditForm hidePersonalForm={() => setShowEditModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
