"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditEventModal from "./EditEventModal/EditEventModal";
import HeaderImage from "./HeaderImage";
import HeaderTitleBar from "./HeaderTitleBar";
import HeaderDescription from "./HeaderDescription";
import DeleteConfirmationModal from "./DeleteEventModal/DeleteEventModal";

export default function HeaderEvent({ event, onSave, onDelete }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventData, setEventData] = useState(event);
  const router = useRouter();

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

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (onDelete) onDelete(eventData);
    router.push("/events");
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-md p-6 relative">
      <HeaderImage imageSrc={eventData.image || eventData.imageSrc} title={eventData.title} />
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

      {showDeleteConfirm && (
        <DeleteConfirmationModal
          title={eventData.title}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
