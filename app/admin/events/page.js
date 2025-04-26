"use client";
import { useState } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import { useTab } from "../../components/TabContext";
import ToastNotification from "@/components/ToastNotification";
import eventList from "./eventDummy";
import { Trash2, Eye, Pencil } from "lucide-react";

export default function Events() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);

  const toggleAddModal = () => {
    setShowAddModal((prev) => !prev);
  };

  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: 10,
    numToShow: 10,
    total: eventList.length,
  });

  const handleDelete = (id, name) => {
    setToast({ type: "success", message: `${name} deleted successfully!` });
  };

  return (
    <div>
      {/* Tools / Add Event Modal */}
      {showAddModal && (
        <div
          onClick={toggleAddModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-[90%] max-w-3xl shadow-lg overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-2xl font-bold mb-6 text-astradarkblue">
              Event Details
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Event Name</label>
                <input
                  type="text"
                  placeholder="Ex: User Experience Researcher"
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Event Type</label>
                <select className="border rounded px-3 py-2 w-full">
                  <option>Please Select</option>
                  <option>In-Person</option>
                  <option>Online</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Ex: Santa Rosa City, Laguna"
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Maximum Number of Slots
                </label>
                <input
                  type="number"
                  placeholder="Ex: 20"
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Date</label>
                <input type="date" className="border rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-medium mb-1">Event Status</label>
                <select className="border rounded px-3 py-2 w-full">
                  <option>Please Select</option>
                  <option>Open</option>
                  <option>Closed</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block font-medium mb-1">Link</label>
                <input
                  type="text"
                  placeholder="Ex: https://hiring.com/apply"
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-medium mb-1">
                  Event Description
                </label>
                <textarea
                  placeholder="Enter event description..."
                  className="border rounded px-3 py-2 w-full h-28"
                />
              </div>
            </form>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={toggleAddModal}
                className="text-blue-600 border border-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50"
              >
                Clear Details
              </button>
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  toggleAddModal();
                  setToast({
                    type: "success",
                    message: "Event successfully published!",
                  });
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
              >
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Table Section */}
      <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
        <div className="flex flex-col py-4 px-1 md:px-4 lg:px-8">
          <TableHeader
            info={info}
            pagination={pagination}
            toggleFilter={toggleAddModal}
          />
          <Table cols={cols} data={createRows(handleDelete)} />
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

function createRows(handleDelete) {
  return eventList.map((event) => ({
    Event: renderTitle(event.event_name),
    Location: renderText(event.location),
    Type: renderText(event.type),
    Date: renderText(event.date),
    Going: renderText(event.going),
    Interested: renderText(event.interested),
    Actions: renderActions(event.id, event.event_name, handleDelete),
  }));
}

function renderTitle(name) {
  return (
    <div className="text-center font-semibold py-5">{name}</div>
  );
}

function renderText(text) {
  return (
    <div className="text-center text-astradarkgray font-s">
      {text}
    </div>
  );
}

function renderActions(id, name, handleDelete) {
  return (
    <div className="flex justify-center items-center gap-3 py-4">
      {/* Desktop */}
      <div className="hidden md:flex gap-2">
        <a
          href={`/admin/events/${id}/view`}
          className="bg-[#e6f0ff] text-[#007bff] px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#d0e3ff]"
        >
          View
        </a>
        <a
          href={`/admin/events/${id}/edit`}
          className="bg-astraprimary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#0062cc]"
        >
          Edit
        </a>
        <button
          onClick={() => handleDelete(id, name)}
          className="bg-astrared text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#c82333]"
        >
          Delete
        </button>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden gap-2">
        <a
          href={`/admin/events/${id}/view`}
          className="bg-[#e6f0ff] text-[#007bff] p-2 rounded-md"
        >
          <Eye size={20} />
        </a>
        <a
          href={`/admin/events/${id}/edit`}
          className="bg-astraprimary text-white p-2 rounded-md"
        >
          <Pencil size={20} />
        </a>
        <button
          onClick={() => handleDelete(id, name)}
          className="bg-astrared text-white p-2 rounded-md"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
