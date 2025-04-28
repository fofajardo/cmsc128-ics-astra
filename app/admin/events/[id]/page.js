'use client';

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import eventList from "../eventDummy";

import BackButton from "@/components/events/IndividualEvent/BackButton";
import HeaderEvent from "@/components/events/IndividualEvent/HeaderEvent";
import EditEventModal from "@/components/events/IndividualEvent/EditEventModal/EditEventModal";
import DeleteConfirmationModal from "@/components/events/IndividualEvent/DeleteEventModal/DeleteEventModal";
import ToastNotification from "@/components/ToastNotification";

import EventDetailsCard from "./EventDetails.Card";
import SendEventCard from "./SendEventCard";
import AttendeesTabs from "./AttendeesTabs";
import AttendeesList from "./AttendeesList";

export default function EventAdminDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const eventId = parseInt(id);
  const originalEvent = eventList.find((e) => e.id === eventId);

  const [event, setEvent] = useState(originalEvent);
  const [selectedOption, setSelectedOption] = useState("Everyone");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("going");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastData, setToastData] = useState(null);

  const itemsPerPage = 5;

  const handleSave = (updatedEvent) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      ...updatedEvent
    }));
    setShowEditModal(false);
    setToastData({ type: "success", message: "Event updated successfully!" });
  };

  const handleDelete = () => {
    console.log("Deleted Event:", event.title);
    setShowDeleteModal(false);
    setToastData({ type: "success", message: "Event deleted successfully!" });
    router.push('/events');
  };

  const handleSend = () => {
    if (!event) return;

    let recipients = [];

    if (selectedOption === "Everyone") {
      recipients = [...(event.attendeesList || []), ...(event.interestedList || [])];
    } else if (selectedOption === "Selected Users") {
      recipients = (event.attendeesList || []).slice(0, 3);
    } else if (selectedOption === "Groups") {
      const companies = {};
      (event.attendeesList || []).forEach(person => {
        if (!companies[person.company]) {
          companies[person.company] = [];
        }
        companies[person.company].push(person);
      });
      recipients = Object.values(companies).flat();
    }

    console.log("Sending Event:", {
      to: selectedOption,
      recipients: recipients.map(r => r.name),
      message: message
    });

    setMessage("");
    setSelectedOption("Everyone");

    setToastData({
      type: "success",
      message: `Successfully sent "${event.title}" to ${recipients.length} users!`
    });
  };

  if (!event) {
    return <div className="p-10 text-center text-xl">Event not found.</div>;
  }

  return (
    <div className="bg-astradirtyastrawhite min-h-screen px-6 sm:px-12 py-6 max-w-screen-xl mx-auto relative">
      <BackButton />

      {toastData && (
        <ToastNotification
          type={toastData.type}
          message={toastData.message}
          onClose={() => setToastData(null)}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col">
          <HeaderEvent
            event={event}
            onSave={handleSave}
            onDelete={handleDelete}
            className="h-full"
          />
        </div>

        <div className="flex flex-col justify-between gap-6 w-full lg:max-w-xs">
          <EventDetailsCard
            event={event}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />
          <SendEventCard
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            message={message}
            setMessage={setMessage}
            handleSend={handleSend}
          />
        </div>
      </div>

      <div className="bg-astrawhite mt-10 p-6 rounded-2xl shadow-md">
        <AttendeesTabs
          attendees={event.attendeesList || []}
          interested={event.interestedList || []}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setCurrentPage={setCurrentPage}
        />

        <AttendeesList
          attendees={event.attendeesList || []}
          interested={event.interestedList || []}
          activeTab={activeTab}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {showEditModal && (
        <EditEventModal
          event={event}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmationModal
          title={event.title}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
