"use client";
import { useState } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import { useTab } from "../../components/TabContext";
import ToastNotification from "@/components/ToastNotification";
import EventModal from "./EventModal"; 
import eventListDummy from "./eventDummy";
import { Trash2, Eye, Pencil } from "lucide-react";

export default function Events() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  const [eventList, setEventList] = useState(eventListDummy);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    location: "",
    max_slots: "",
    date: "",
    status: "",
    link: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  const toggleAddModal = () => {
    setFormData({
      title: "",
      type: "",
      location: "",
      max_slots: "",
      date: "",
      status: "",
      link: "",
      description: "",
    });
    setShowAddModal((prev) => !prev);
  };

  const toggleEditModal = (event) => {
    setFormData({
      title: event.title,
      type: event.type,
      location: event.location,
      max_slots: event.max_slots || "",
      date: event.date,
      status: event.status || "",
      link: event.link || "",
      description: event.description || "",
    });
    setEditingId(event.id);
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      ...formData,
      id: eventList.length + 1,
      going: 0,
      interested: 0,
    };
    setEventList((prev) => [...prev, newEvent]);
    setToast({ type: "success", message: "Event successfully published!" });
    toggleAddModal();
  };

  const handleEditEvent = (e) => {
    e.preventDefault();
    setEventList((prev) =>
      prev.map((event) =>
        event.id === editingId ? { ...event, ...formData } : event
      )
    );
    setToast({ type: "success", message: "Event successfully updated!" });
    setShowEditModal(false);
  };

  const handleDelete = (id, name) => {
    setEventList((prev) => prev.filter((event) => event.id !== id));
    setToast({ type: "success", message: `${name} deleted successfully!` });
  };

  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: 10,
    numToShow: 10,
    total: eventList.length,
  });

  return (
    <div>
      {/* Add Event Modal */}
      {showAddModal && (
        <EventModal
          isEdit={false}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleAddEvent}
          toggleModal={toggleAddModal}
        />
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <EventModal
          isEdit={true}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleEditEvent}
          toggleModal={() => setShowEditModal(false)}
        />
      )}

      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Table Section */}
      <div className="bg-astradirtyastrawhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
        <div className="flex flex-col py-4 px-1 md:px-4 lg:px-8">
          <TableHeader
            info={info}
            pagination={pagination}
            toggleFilter={toggleAddModal}
          />
          <Table
            cols={cols}
            data={createRows(eventList, handleDelete, toggleEditModal)}
          />
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
      </div>
    </div>
  );
}

const cols = [
  { label: "Event", justify: "center", visible: "all" },
  { label: "Location", justify: "center", visible: "sm" },
  { label: "Type", justify: "center", visible: "md" },
  { label: "Date", justify: "center", visible: "lg" },
  { label: "Going", justify: "center", visible: "lg" },
  { label: "Interested", justify: "center", visible: "lg" },
  { label: "Actions", justify: "center", visible: "all" },
];

function createRows(events, handleDelete, toggleEditModal) {
  return events.map((event) => ({
    Event: renderTitle(event.title),
    Location: renderText(event.location),
    Type: renderText(event.type),
    Date: renderText(event.date),
    Going: renderText(event.going),
    Interested: renderText(event.interested),
    Actions: renderActions(event, handleDelete, toggleEditModal),
  }));
}

function renderTitle(name) {
  return <div className="text-center font-semibold py-5">{name}</div>;
}

function renderText(text) {
  return <div className="text-center text-astradarkgray font-s">{text}</div>;
}

function renderActions(event, handleDelete, toggleEditModal) {
  const { id, title } = event;
  return (
    <div className="flex justify-center items-center gap-3 py-4">
      <div className="hidden md:flex gap-2">
        <a
          href={`/admin/events/${id}`}
          className="bg-[#e6f0ff] text-[#007bff] px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#d0e3ff]"
        >
          View
        </a>
        <button
          onClick={() => toggleEditModal(event)}
          className="bg-astraprimary text-astrawhite px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#0062cc]"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(id, title)}
          className="bg-astrared text-astrawhite px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#c82333]"
        >
          Delete
        </button>
      </div>
      <div className="flex md:hidden gap-2">
        <a
          href={`/admin/events/${id}/view`}
          className="bg-[#e6f0ff] text-[#007bff] p-2 rounded-md"
        >
          <Eye size={20} />
        </a>
        <button
          onClick={() => toggleEditModal(event)}
          className="bg-astraprimary text-astrawhite p-2 rounded-md"
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={() => handleDelete(id, title)}
          className="bg-astrared text-astrawhite p-2 rounded-md"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
