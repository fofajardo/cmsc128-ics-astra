"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EditEventModal from "./EditEventModal/EditEventModal";
import HeaderImage from "./HeaderImage";
import HeaderTitleBar from "./HeaderTitleBar";
import HeaderDescription from "./HeaderDescription";
import DeleteConfirmationModal from "./DeleteEventModal/DeleteEventModal";

export default function HeaderEvent({ event }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventData, setEventData] = useState(event);
  const router = useRouter();

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };


  return (
    <div className="flex-1 bg-white rounded-xl shadow-md p-6 relative">
      <HeaderImage imageSrc={eventData.image || eventData.imageSrc} title={eventData.title} />
      <HeaderTitleBar
        title={event.title}
      />
      <HeaderDescription description={event.description} />

    </div>
  );
}