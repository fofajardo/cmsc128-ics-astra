"use client";
import { useState, useEffect } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import { useTab } from "../../components/TabContext";
import ToastNotification from "@/components/ToastNotification";
import { isValidDate } from "../../../api/utils/validators";
import { Trash2, Eye, Pencil } from "lucide-react";
import axios from "axios";


export default function Events() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  const [eventList, setEvents] = useState([]);
  const [contentList, setContents] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState("")
  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: 10,
    numToShow: 10,
    total: eventList.length,
  });

  const [addFormData, setAddFormData] = useState({
    title: "",
    venue: "",
    event_type: "",
    online: false,
    event_date: "",
    max_slots: "",
    status: "open",
    link: "",
    description: ""
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const resetForm = () => {
    setAddFormData({
      title: "",
      venue: "",
      event_type: "",
      online: false,
      event_date: "",
      max_slots: "",
      status: "",
      link: "",
      description: ""
    });
    setSelectedContentId("");

  };
    // FOR BACKEND PEEPS
  useEffect(() => {
    fetchEvents();
    fetchContents();
  }, [pagination]);

  const toggleAddModal = () => {
    setShowAddModal((prev) => !prev);
  };

  const toggleEditModal = (eventData) => {
    if(eventData){

    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const fetchContentName = async (id) => {
    try {
      const response = await axios
           .get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`);

      console.log(response);
      if (response.data.status === "OK") {
            const selectEventName = response.data.content.title
            // setEventName(selectEventName);
            // console.log('event name: ', eventName);
            console.log('select event name:',selectEventName);
      } else {
            console.error('Unexpected response:', response.data);
      }
    }catch(error){
      console.error('Failed to get content:', error);
    }
  };

  const handleContentChange = (e) => {
    const selectId = e.target.value;
    setSelectedContentId(selectId);
    console.log('contentId: ', selectId);
    console.log('selectedcontentId: ', selectedContentId);
    fetchContentName(selectId);

  };


  const fetchEvents = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.error('API URL is not defined in environment variables');
        setEvents([]); // Set empty array as fallback
        return;
      }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events`, {
            params: {
                page: pagination.currPage,
                limit: pagination.numToShow
            }
        });
        console.log('Fetched events:', response.data);

        if (response.data.status === "OK") {
            setEvents(
                response.data.list.map(event => ({
                    id: event.event_id,
                    event_name: event.title?? "unknown",    //TODO: fetch event title from contents
                    location: event.venue,
                    type: event.online === true ? 'Online' : 'In-Person',
                    date: event.event_date,
                    going: event.going ?? 10,
                    interested: event.interested //TODO: fetch number of going by total number of event interest
                }))
            );
        } else {
            console.error('Unexpected response:', response.data);
        }
    } catch (error) {
        console.error('Failed to fetch events:', error);
        if (error.code === 'ERR_NETWORK') {
          setToast({
              type: "error",
              message: "Network error: Cannot connect to the server. Please check your connection."
          });
      } else if (error.response) {
          setToast({
              type: "error",
              message: `Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`
          });
      } else {
          setToast({
              type: "error",
              message: "An unexpected error occurred. Please try again later."
          });
      }
      setEvents([]);
    }

  };

  const fetchContents= async () =>{
    try{
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.error('API URL is not defined in environment variables');
        setEvents([]); // Set empty array as fallback
        return;
      }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents`, {
            params: {
                page: pagination.currPage,
                limit: pagination.numToShow
            }
        });
        console.log('Fetched contents:', response.data);

        if (response.data.status === "OK") {
            setContents(
                response.data.list.map(content => ({
                    id: content.id,
                    title: content.title?? "unknown",    //TODO: fetch event title from contents
                    details: content.details,
                }))
            );
        } else {
            console.error('Unexpected response:', response.data);
        }
    } catch (error) {
        console.error('Failed to fetch contents:', error);
        if (error.code === 'ERR_NETWORK') {
          setToast({
              type: "error",
              message: "Network error: Cannot connect to the server. Please check your connection."
          });
      } else if (error.response) {
          setToast({
              type: "error",
              message: `Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`
          });
      } else {
          setToast({
              type: "error",
              message: "An unexpected error occurred. Please try again later."
          });
      }
      setContents([]);
    }
  };
  // prompt for deletion
  const confirmDelete = (id, name) => {
    setEventToDelete({ id, name });
    setShowDeleteModal(true);
  };
  const handleDelete = async (id, name) => {
    try{
        const response = await axios
           .delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${id}`);

        if (response.data.status === "DELETED") {
          setToast({ type: "success", message: `${name} deleted successfully!` });
        }

    }catch(error){
      console.error('Failed to delete events:', error);
      setToast({ type: "error", message: "Failed to delete event!" });
    }  finally {
      setShowDeleteModal(false);
    }
    fetchEvents();
  };

  const handleAdd = async () => {
    try{
      console.log('event_id: ',selectedContentId);
      if(!isValidDate(addFormData.event_date)){
        console.log('invalid date format');
      }
      const isOnline = addFormData.online === "Online";
      const eventToAdd = {
        event_id: selectedContentId, //fetch from the contents
        event_date: new Date(addFormData.event_date).toISOString(),
        venue: addFormData.venue,
        external_link:addFormData.link,
        access_link: addFormData.link,  //add another link
        online:isOnline
      };

      console.log(eventToAdd);
      const response = await axios
           .post(`${process.env.NEXT_PUBLIC_API_URL}/v1/events`, eventToAdd);

      console.log(response);
      if (response.data.status === "CREATED") {
        setToast({ type: "success", message: "Event published successfully!" });
      }
    }catch(error){
      console.error('Failed to create events:', error);
      setToast({ type: "error", message: "Failed to create event." });
    }
    setShowAddModal(false);
    resetForm();
    fetchEvents();
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
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={selectedContentId}
                  onChange={handleContentChange}>
                  <option value="">Please Select</option>
                  {contentList.map(content => (
                    <option key={content.id} value={content.id}>
                      {content.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Event Type</label>
                <select
                  name="online"
                  value={addFormData.online}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option>Please Select</option>
                  <option>In-Person</option>
                  <option>Online</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="venue"
                  value={addFormData.venue}
                  onChange={handleInputChange}
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
                  name="max_slots"
                  value={addFormData.max_slots}
                  onChange={handleInputChange}
                  placeholder="Ex: 20"
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="event_date"
                  value={addFormData.event_date}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Event Status</label>
                <select
                  name="status"
                  value={addFormData.status}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option>Please Select</option>
                  <option>Open</option>
                  <option>Closed</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block font-medium mb-1">Link</label>
                <input
                  type="text"
                  name="link"
                  value={addFormData.link}
                  onChange={handleInputChange}
                  placeholder="Ex: https://hiring.com/apply"
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-medium mb-1">
                  Event Description
                </label>
                <textarea
                  name="description"
                  value={addFormData.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description..."
                  className="border rounded px-3 py-2 w-full h-28"
                />
              </div>
            </form>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="text-blue-600 border border-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50"
              >
                Clear Details
              </button>
              <button
                type="submit"
                onClick={handleAdd}
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
              >
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}


      {showDeleteModal && eventToDelete && (
        <div
          onClick={() => setShowDeleteModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete the event: <strong>{eventToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={()=>handleDelete(eventToDelete.id, eventToDelete.name)}
                className="bg-astrared text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-red-300">
                Confirm
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
          <Table cols={cols} data={createRows(eventList,confirmDelete)} />
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

function createRows(eventList,confirmDelete) {
  return eventList.map((event) => ({
    Event: renderTitle(event.event_name),
    Location: renderText(event.location),
    Type: renderText(event.type),
    Date: renderText(event.date),
    Going: renderText(event.going),
    Interested: renderText(event.interested),
    Actions: renderActions(event.id, event.event_name, confirmDelete),
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

function renderActions(id, name, confirmDelete) {
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
          onClick={() => confirmDelete(id, name)}
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
          onClick={() => confirmDelete(id, name)}
          className="bg-astrared text-white p-2 rounded-md"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
