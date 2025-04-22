'use client';
import { useState } from 'react';
import EditEventModal from './EditEventModal';
import HeaderImage from './HeaderImage';
import HeaderTitleBar from './HeaderTitleBar';
import HeaderDescription from './HeaderDescription';

export default function HeaderEvent({ event, onSave }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventData, setEventData] = useState(event);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setShowEditModal(false);
  };

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const handleSaveChanges = (updatedData) => {
    setEventData(updatedData);
    setShowEditModal(false);
    if (onSave) onSave(updatedData);
  };

  const handleDelete = () => alert('Delete logic here');

  return (
    <div className="flex-1 bg-astrawhite rounded-xl shadow-md p-6 relative">
      <HeaderImage imageSrc={eventData.imageSrc} title={eventData.title} />
      <HeaderTitleBar
        title={eventData.title}
        isEditMode={isEditMode}
        onEditToggle={toggleEditMode}
        onOpenEditModal={openEditModal}
        onDelete={handleDelete}
        onCancel={toggleEditMode}
      />

      <HeaderDescription description={eventData.eventDetail} />

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
