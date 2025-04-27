'use client';

import { useParams, useRouter } from "next/navigation";
import eventList from "../eventDummy";
import { useState } from "react";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import HeaderEvent from "@/components/events/IndividualEvent/HeaderEvent";
import EditEventModal from "@/components/events/IndividualEvent/EditEventModal/EditEventModal";
import DeleteConfirmationModal from "@/components/events/IndividualEvent/DeleteEventModal/DeleteEventModal";
import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import ToastNotification from "@/components/ToastNotification"; // IMPORTANT: Import your new ToastNotification

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
  const [toastData, setToastData] = useState(null); // NEW: instead of toastMessage

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

  const attendees = event?.attendeesList || [];
  const interested = event?.interestedList || [];

  const currentList = activeTab === "going" ? attendees : interested;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const paginatedList = currentList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!event) {
    return <div className="p-10 text-center text-xl">Event not found.</div>;
  }

  return (
    <div className="bg-astradirtyastrawhite min-h-screen pt-[100px] px-6 sm:px-12 py-6 max-w-screen-xl mx-auto relative">
      <BackButton />

      {/* Toast Notification */}
      {toastData && (
        <ToastNotification
          type={toastData.type}
          message={toastData.message}
          onClose={() => setToastData(null)}
        />
      )}

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side */}
        <div className="flex-1 flex flex-col">
          <HeaderEvent
            event={event}
            onSave={handleSave}
            onDelete={handleDelete}
            className="h-full"
          />
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-between gap-6 w-full lg:max-w-xs">
          {/* Event Details Card */}
          <div className="bg-astrawhite p-6 rounded-2xl shadow-md flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Event Details</h2>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <CalendarDays className="w-5 h-5 mr-2 text-gray-500" />
              {event.date} | {event.time}
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-6">
              <MapPin className="w-5 h-5 mr-2 text-gray-500" />
              {event.location}
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="w-full bg-astraprimary hover:bg-astradark text-white font-semibold py-2 rounded-lg mb-2 transition-all"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-astrared hover:bg-[#e63228] text-white font-semibold py-2 rounded-lg transition-all"
            >
              Delete
            </button>
          </div>

          {/* Send This Event Card */}
          <div className="bg-astrawhite p-6 rounded-2xl shadow-md flex flex-col flex-1">
            <h2 className="text-lg font-semibold mb-4">Send this event to</h2>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-gray-700"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option>Everyone</option>
              <option>Selected Users</option>
              <option>Groups</option>
            </select>

            <label className="text-sm text-gray-600 mb-1 block">Message (optional)</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 flex-1 text-gray-700"
              rows="3"
              placeholder="Type here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={handleSend}
              className="w-full bg-astraprimary hover:bg-astradark text-white font-semibold py-2 rounded-lg transition-all"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Attendees Section */}
      <div className="bg-astrawhite mt-10 p-6 rounded-2xl shadow-md">
        {/* Tabs */}
        <div className="flex gap-6 border-b mb-6">
          <button
            onClick={() => { setActiveTab("going"); setCurrentPage(1); }}
            className={`pb-2 text-lg font-semibold transition-all rounded-t-md px-4 py-2 ${
              activeTab === "going"
                ? "bg-astragray text-astrablue"
                : "text-gray-500 hover:bg-astraprimary hover:text-white"
            }`}
          >
            Going ({attendees.length} / 50)
          </button>
          <button
            onClick={() => { setActiveTab("interested"); setCurrentPage(1); }}
            className={`pb-2 text-lg font-semibold transition-all rounded-t-md px-4 py-2 ${
              activeTab === "interested"
                ? "bg-astragray text-astrablue"
                : "text-gray-500 hover:bg-astraprimary hover:text-white"
            }`}
          >
            Interested ({interested.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row">
          {/* Left: Attendee Count */}
          <div className="hidden md:flex flex-col items-center justify-center w-48 border-r pr-6">
            <div className="text-5xl font-bold text-astrablue">{currentList.length}</div>
            <div className="text-gray-500 mt-2 text-center">Attendees</div>
          </div>

          {/* Right: List */}
          <div className="flex-1">
            {paginatedList.map((person, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b py-4 hover:bg-gray-100 rounded-lg transition-all px-2"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden">
                    <Image
                      src={person.avatar}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-gray-800">{person.name}</div>
                    <div className="text-sm text-gray-500">Alumni | Class of {person.classYear}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  {person.title} at {person.company}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-6 gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-gray-600 hover:text-astrablue disabled:opacity-50"
                >
                  ←
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-full font-semibold ${
                      currentPage === i + 1
                        ? "bg-astrablue text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    } transition-all`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-gray-600 hover:text-astrablue disabled:opacity-50"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
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
