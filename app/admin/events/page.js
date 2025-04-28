"use client";
import { useState, useEffect, useContext } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import { TabContext } from "@/components/TabContext";
import { useTab } from "../../components/TabContext";
import ToastNotification from "@/components/ToastNotification";
import { isValidDate,isValidUUID } from "../../../api/utils/validators";
import { Trash2, Eye, Pencil } from "lucide-react";
import axios from "axios";
import Fuse from 'fuse.js';


export default function Events() {
  const { setEventCounts } = useContext(TabContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  const [eventList, setEvents] = useState([]);
  const [contentList, setContents] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: 10,
    numToShow: 10,
    total: 0,
  });

  const [addFormData, setAddFormData] = useState({
    title: "",
    venue: "",
    event_type: "",
    online: false,
    event_date: "",
    max_slots: "",
    status: "open",
    external_link: "",
    access_link: "",
    description: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [filters, setFilters] = useState(null);


  const resetForm = () => {
    setAddFormData({
      title: "",
      venue: "",
      event_type: "",
      online: false,
      event_date: "",
      max_slots: "",
      status: "",
      external_link: "",
      access_link: "",
      description: ""
    });
    setSelectedContentId("");

  };
    // FOR BACKEND PEEPS
  useEffect(() => {
    fetchEvents();
    fetchContents();
    console.log(eventList);
  }, [pagination.currPage,pagination.numToShow]);

  useEffect(() => {
    if (!eventList || !Array.isArray(eventList)) {
      console.log("eventList not ready yet:", eventList);
      return;
    }
    const fuse = new Fuse(contentList, {
      keys: ['title'],
      threshold: 0.3,
    });

    if (searchQuery) {
      const result = fuse.search(searchQuery);
      const matchingContentIds = result.map(r => r.item.id);

      console.log("matchingContentIds:", matchingContentIds);
      console.log("eventList:", eventList.map(e => ({ event_id: e.event_id, content_id: e.content_id })));

      const filtered = eventList.filter(event =>
        matchingContentIds.includes(event.event_id)
      );

      console.log("Filtered Events:", filtered);
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(eventList);
    }
  }, [searchQuery, eventList, contentList]);


  useEffect(() => {
    const total = eventList.length;
    const numToShow = pagination.numToShow;
    const lastPage = Math.max(1, Math.ceil(total / numToShow));

    setPagination((prev) => ({
      ...prev,
      total: total,
      lastPage: lastPage,
      display: [
        (prev.currPage - 1) * numToShow + 1,
        Math.min(prev.currPage * numToShow, total),
      ],
    }));
  }, [eventList]);

  // const filteredEvents = eventList.filter((event) => {
  //   const content = contentList.find(c => c.content_id === event.event_id);
  //   console.log("Content for Event ID", event.event_id, ":", content);

  //   if (content) {
  //     console.log("Checking Title:", content.title);
  //     return content.title.toLowerCase().includes(searchQuery.toLowerCase());
  //   }
  //   return false;
  // });





  const toggleAddModal = () => {
    setShowAddModal((prev) => !prev);
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
            return selectEventName;
      } else {
            console.error('Unexpected response:', response.data);
      }
    }catch(error){
      console.error('Failed to get content:', error);
    }
    return -1;
  };

  // const fetchEventName = (id) =>{
  //   const name = fetchContentName(id);
  //   console.log("event name", name);
  //   return name;
  // };
  // const handleContentChange = (e) => {
  //   const selectId = e.target.value;
  //   setSelectedContentId(selectId);
  //   console.log('contentId: ', selectId);
  //   console.log('selectedcontentId: ', selectedContentId);
  //   const name = fetchContentName(selectId);

  // };


  const fetchEvents = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.error('API URL is not defined in environment variables');
        setEvents([]);
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
          console.log("First event object:", response.data.list[0]);

            setEvents(
                response.data.list.map(event => ({
                    id: event.event_id,
                    event_id: event.event_id,
                    content_id: event.event_id,
                    event_name: fetchContentName(event.event_id),    //TODO: fetch event title from contents
                    location: event.venue,
                    type: event.online === true ? 'Online' : 'In-Person',
                    date: event.event_date,
                    going: event.going ?? 10,
                    interested: event.interested //TODO: fetch number of going by total number of event interest
                }))
            );
            setEventCounts({total:response.data.list.length});


            console.log("list: ", response.data.list.length);

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
        setEvents([]);
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
          handleDeleteContent(id);
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

  const handleDeleteContent = async (id) => {
    try{
        const response = await axios
           .delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`);
    }catch(error){
      console.error('Failed to delete events:', error);
      setToast({ type: "error", message: "Failed to delete event!" });
    }
    fetchEvents();
  };


  const handleAdd = async () => {   // add content -> get the newly created content_id -> add event
    try{
      let user_id = "19a54ed6-5a0e-4850-8193-e013140d6111";  //manually added; TODO: change after user auth implemented
      console.log('event_id: ',selectedContentId);
      if(!isValidDate(addFormData.event_date)){
        console.log('invalid date format');
      }
      const isOnline = addFormData.online === "Online";
      if (!isValidUUID(user_id)){
        console.log("invalid user id: ", user_id);
        setToast({ type: "error", message: "Failed to create event." });
        return -1;
      }

      const contentToAdd = {
        user_id: user_id,
        title: addFormData.title,
        details:addFormData.description,
        created_at: new Date().toISOString(),  // Default to current date if not provided
        updated_at: new Date().toISOString(),  // Default to current date if not provided
        views: 0,
      }

      const contentResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/contents`,
        contentToAdd
      );

      if (contentResponse.data.status === "CREATED" && contentResponse.data.id) {
        const contentId = contentResponse.data.id;

        const eventToAdd = {
          event_id: contentId,
          event_date: new Date(addFormData.event_date).toISOString(),
          venue: addFormData.venue,
          external_link: addFormData.external_link || "",
          access_link: addFormData.access_link || "",
          online: isOnline,
        };

        const eventResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/events`,
          eventToAdd
        );

        if (eventResponse.data.status === "CREATED") {
          setToast({ type: "success", message: "Event published successfully!" });
          toggleAddModal();
          resetForm();
          fetchEvents();
        }
        else {
          handleDeleteContent(contentId); //
        }
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
                <input
                  type="text"
                  name="title"
                  value={addFormData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: User Experience Researcher"
                  className="border rounded px-3 py-2 w-full"
                />
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
                <label className="block font-medium mb-1">External Link</label>
                <input
                  type="text"
                  name="external_link"
                  value={addFormData.external_link}
                  onChange={handleInputChange}
                  placeholder="Ex: https://hiring.com/apply"
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-medium mb-1">Access Link</label>
                <input
                  type="text"
                  name="access_link"
                  value={addFormData.access_link}
                  onChange={handleInputChange}
                  placeholder="Ex: https://hiring.com/apply"
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              {/* Add field for access_link*/}
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
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <Table cols={cols} data={createRows(filteredEvents,confirmDelete)} />
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

function createRows(filteredEvents,confirmDelete) {
  return filteredEvents.map((event) => ({
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
