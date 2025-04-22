'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import EditEventModal from './EditEventModal';

export default function HeaderEvent({ event, onSave }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventData, setEventData] = useState(event);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setShowEditModal(false);
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveChanges = (updatedData) => {
    setEventData(updatedData);
    setShowEditModal(false);
    if (onSave) onSave(updatedData);
  };

  return (
    <div className="flex-1 bg-astrawhite rounded-xl shadow-md p-6 relative">
      <Image
        src={eventData.imageSrc}
        alt={eventData.title}
        width={800}
        height={400}
        className="rounded-xl w-full h-[300px] object-cover"
      />
      {/* Title + Buttons in same row */}
      <div className="mt-4 flex items-center justify-between flex-wrap">
        <h1 className="text-2xl font-bold text-gray-900">{eventData.title}</h1>
        <div className="flex gap-2 items-center">
          {!isEditMode ? (
            <button
              onClick={toggleEditMode}
              className="focus:outline-none transition duration-200"
            >
              <Icon
                icon="mdi:file-document-outline"
                className="text-astraprimary text-2xl"
              />
            </button>
          ) : (
            <>
              <button
                onClick={openEditModal}
                className="bg-astraprimary text-white text-sm font-semibold px-3 py-1 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => alert('Delete logic here')}
                className="bg-white text-astraprimary border border-astraprimary text-sm font-semibold px-3 py-1 rounded-md"
              >
                Delete
              </button>
              <button
                onClick={toggleEditMode}
                className="bg-gray-200 text-gray-800 text-sm font-semibold px-3 py-1 rounded-md"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-astrablack mt-2 text-sm leading-relaxed">
        {eventData.eventDetail}
      </p>

      {showEditModal && (
        <EditEventModal
          event={eventData}
          onClose={closeEditModal}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
}
