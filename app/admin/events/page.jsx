"use client";
import { EventTableHeader, Table, PageTool } from "@/components/TableBuilder";
import { useTab } from "../../components/TabContext";
import ToastNotification from "@/components/ToastNotification";
import EventModal from "./EventModal";
import eventListDummy from "./eventDummy";
import { Trash2, Eye, Pencil } from "lucide-react";
import { useState, useEffect, useContext, useMemo } from "react";
import { TabContext } from "@/components/TabContext";
import { isValidDate,isValidUUID } from "../../../api/utils/validators";
import axios from "axios";
import Fuse from "fuse.js";
import { useSignedInUser } from "@/components/UserContext";
import { CenteredSkeleton } from "@/components/ui/skeleton";

export default function Events() {
  const { setEventCounts } = useContext(TabContext);
  const user = useSignedInUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  const [eventList, setEvents] = useState([]);
  const [contentList, setContents] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setloading] = useState(true);
  // const [searchQuery, setSearchQuery] = useState("");

  const cols = [
    { label: "Event", justify: "center", visible: "all" },
    { label: "Location", justify: "center", visible: "sm" },
    { label: "Type", justify: "center", visible: "md" },
    { label: "Date", justify: "center", visible: "lg" },
    { label: "Interested", justify: "center", visible: "lg" },
    { label: "Actions", justify: "center", visible: "all" },
  ];

  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: 1,
    numToShow: 10,
    total: 10,
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
    description: "",
    tags : [],
    imageFile: null,
  });
  const defaultFormData = {
    title: "",
    venue: "",
    event_type: "",
    online: false,
    event_date: "",
    max_slots: "",
    status: "open",
    external_link: "",
    access_link: "",
    description: "",
    tags: [],
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [filters, setFilters] = useState(null);
  const [editId,setEditId] = useState(false);


  const resetForm = () => {
    setAddFormData(defaultFormData);
    setSelectedContentId("");

  };

  const getChangedFields = (current, defaults) => {
    const changed = {};
    for (const key in current) {
      const currentValue = current[key];
      const defaultValue = defaults[key];

      const isArray = Array.isArray(currentValue);
      const isString = typeof currentValue === "string";

      let isDifferent;

      if (isArray) {
        isDifferent = JSON.stringify(currentValue) !== JSON.stringify(defaultValue);
      } else if (isString) {
        const trimmed = currentValue.trim();
        isDifferent = trimmed !== defaultValue.trim();
        if (trimmed === "") continue;
      } else {
        isDifferent = currentValue !== defaultValue;
      }

      if (isDifferent) {
        changed[key] = currentValue;
      }
    }
    return changed;
  };

  // FOR BACKEND PEEPS
  useEffect(() => {
    fetchEvents();
    //fetchContents();
    console.log(eventList);
  }, []);



  useEffect(() => {
    if (!Array.isArray(eventList)) return;

    const filtered = eventList.filter(event =>
      event?.event_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredEvents(filtered);
    setPagination((prev) => ({ ...prev, currPage: 1 }));
  }, [searchQuery, eventList]);

  useEffect(() => {
    const total = filteredEvents.length;
    const lastPage = Math.max(1, Math.ceil(total / pagination.numToShow));

    setPagination((prev) => ({
      ...prev,
      currPage: Math.min(prev.currPage, lastPage),
      total,
      lastPage,
      display: [
        total === 0 ? 0 : (prev.currPage - 1) * pagination.numToShow + 1,
        Math.min(prev.currPage * pagination.numToShow, total),
      ],
    }));
  }, [filteredEvents,pagination.numToShow]);


  const currentPageData = useMemo(() => {
    const startIndex = (pagination.currPage - 1) * pagination.numToShow;
    const endIndex = startIndex + pagination.numToShow;
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, pagination.currPage, pagination.numToShow]);

  useEffect(() => {
    if (eventList && Array.isArray(eventList)) {
      setFilteredEvents(eventList);
    }
  }, [eventList]);

  const toggleAddModal = () => {
    setShowAddModal((prev) => !prev);
  };

  const toggleEditModal = (event) => {
    console.log("event:", event);
    console.log("eventid:", event?.id);
    setEditId(event?.id);
    setShowEditModal((prev) => !prev);

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const getActivePastEvents = (listOfEvents, totalEvents) =>{
    const result = listOfEvents.filter((event) => new Date(event.date) < new Date());
    setEventCounts({
      past: result.length,
      active: totalEvents - result.length,
      total: totalEvents
    });
  };

  const fetchInterest = async (id) => {
    try{
      const interest = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/${id}`);
      if (interest.data.status === "OK") {
        const selectEventName = interest.data.list.interest_count;
        console.log("select event name:",selectEventName, "type", typeof(selectEventName));
        return selectEventName;
      } else {
        console.error("Unexpected interest:", interest.data);
      }
    }catch(error){
      console.log(error);
    }
  };
  const fetchContentName = async (id) => {
    try {
      const response = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`);

      console.log(response);
      if (response.data.status === "OK") {

        const selectEventName = response.data.content.title;
        console.log("select event name:",selectEventName, "type", typeof(selectEventName));
        return selectEventName;
      } else {
        console.error("Unexpected response:", response.data);
      }
    }catch(error){
      console.error("Failed to get content:", error);
    }
    return "unknown";
  };

  const fetchEvents = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.error("API URL is not defined in environment variables");
        setEvents([]);
        return;
      }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events`
        , {
          params: {
            page: pagination.currPage,
            limit: pagination.numToShow
          }
        }
      );
      console.log("Fetched events:", response.data);

      if (response.data.status === "OK") {
        console.log("First event object:", response.data.list[0]);

        const eventList = await Promise.all(
          response.data.list.map(async (event) => ({
            id: event.event_id,
            event_id: event.event_id,
            content_id: event.event_id,
            event_name: await fetchContentName(event.event_id),
            location: event.venue,
            type: event.online === true ? "Online" : "In-Person",
            date: new Date(event.event_date).toDateString(),
            going: event.going ?? 10, // TODO: implement the
            interested:await fetchInterest(event.event_id)
          }))
        );

        setEvents(eventList);
        console.log("list: ", response.data.list.length);

        getActivePastEvents(eventList,response.data.total);
        setloading(false);
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      if (error.code === "ERR_NETWORK") {
        setToast({
          type: "error",
          message: "Network error: Cannot connect to the server. Please check your connection."
        });
      } else if (error.response) {
        setToast({
          type: "error",
          message: `Server error: ${error.response.status} - ${error.response.data.message || "Unknown error"}`
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
      console.error("Failed to delete events:", error);
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
      console.error("Failed to delete events:", error);
      setToast({ type: "error", message: "Failed to delete event!" });
    }
    fetchEvents();
  };
  const handleAdd = async () => {   // add content -> get the newly created content_id -> add event
    try{
      let contentId;

      let user_id = user?.state?.user.id;  //manually added; TODO: change after user auth implemented
      console.log("event_id: ",selectedContentId);
      if(!isValidDate(addFormData.event_date)){
        console.log("invalid date format");
      }
      const isOnline = addFormData.event_type === "Online";
      if (!isValidUUID(user_id)){
        console.log("invalid user id: ", user_id);
        setToast({ type: "error", message: "Failed to create event." });
        return -1;
      }
      console.log("form:",addFormData);
      const contentToAdd = {
        user_id: user_id,
        title: addFormData.title,
        details:addFormData.description,
        created_at: new Date().toISOString(),  // Default to current date if not provided
        updated_at: new Date().toISOString(),  // Default to current date if not provided
        views: 0,
      };

      const contentResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/contents`,
        contentToAdd
      );

      console.log("content created: ", contentResponse.data.status);
      console.log("content id: ",contentResponse.data.id);
      console.log("content id1: ",contentResponse.data.content.id);

      if (contentResponse.data.status === "CREATED" && contentResponse.data.content.id) {
        console.log("creating event...");
        contentId = contentResponse.data.content.id;

        const eventToAdd = {
          event_id: contentId,
          event_date: new Date(addFormData.event_date).toISOString(),
          venue: addFormData.venue,
          external_link: addFormData.external_link || "",
          access_link: addFormData.access_link || "",
          online: isOnline,
        };
        try{
          const eventResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/events`,
            eventToAdd
          );

          // If we have an image file, upload it
          if (addFormData.imageFile) {
            const formData = new FormData();
            formData.append("File", addFormData.imageFile);
            formData.append("content_id", contentId);
            formData.append("type", 3); // Type 3 is for event_pic as defined in the API

            // Upload the image
            const photoResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/photos`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (photoResponse.data.status === "CREATED") {
              console.log("Event photo uploaded successfully");
            }
          }

          if (eventResponse.data.status === "CREATED") {
            setToast({ type: "success", message: "Event published successfully!" });
            toggleAddModal();
            resetForm();
            fetchEvents();
          }
        }catch{
          handleDeleteContent(contentId);
        }
      }
    }catch(error){
      console.error("Failed to create events:", error);
      setToast({ type: "error", message: "Failed to create event." });
    }
    setShowAddModal(false);
    resetForm();
    fetchEvents();
  };

  const handleEdit = async () => {
    try{

      const toEditId = editId;

      console.log("event id in ", toEditId);

      console.log("add form: ", addFormData);

      const eventDefaults = {
        event_date: "",
        venue: "",
        external_link: "",
        access_link: "",
        online: false,
      };

      const contentDefaults = {
        title: "",
        details: "",
        tags: [],
      };

      console.log("inside handle edit");
      const eventUpdateData = getChangedFields({
        event_date: addFormData.event_date,
        venue: addFormData.venue,
        external_link: addFormData.external_link,
        access_link: addFormData.access_link,
        online: addFormData.event_type==="Online",
      }, eventDefaults);

      const contentUpdateData = getChangedFields({
        title: addFormData.title,
        details: addFormData.description,
        tags: addFormData.tags,
      }, contentDefaults);

      console.log("event  to update:", eventUpdateData);
      console.log("content to update: ", contentUpdateData);

      let eventRes, contentRes, eventOnly = 0;
      if (Object.keys(eventUpdateData).length > 0) {
        eventRes = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${toEditId}`, eventUpdateData);
        eventOnly += 1;
        console.log("entered event update");
      }

      if (Object.keys(contentUpdateData).length > 0) {
        contentRes = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${toEditId}`,contentUpdateData);
        eventOnly += 1; // 2 -> event,content updated; 1->onlyevent
        console.log("entered content update");
      }

      console.log("eventOnly: ", eventOnly);
      console.log(eventRes);
      console.log(contentRes);
      console.log(contentRes?.data.status);
      console.log(eventRes?.data);


      if (eventRes?.data?.status ==="UPDATED"  && contentRes?.data?.status === "UPDATED" && eventOnly===2){
        setToast({ type: "success", message: "Event edited successfully!" });
        console.log("here at 1dtcondition");

      } else if ((eventRes?.data?.status ==="UPDATED" && eventOnly===1) || (contentRes?.data?.status === "UPDATED" && eventOnly===1)){
        setToast({ type: "success", message: "Event edited successfully!" });
        console.log("here at 2nd condition");

      } else if (
        ((eventRes?.data?.status === "FAILED" || eventRes?.data?.status === "FORBIDDEN") && eventOnly === 2) ||
        ((contentRes?.data?.status === "FAILED" || contentRes?.data?.status === "FORBIDDEN") && eventOnly === 2)
      ) {
        setToast({ type: "error", message: "Failed to edit event." });
        console.log("here at 3rd condition");
      }

    }catch(error){
      console.error("error",error);
      setToast({ type: "error", message: "Failed to edit event." });
    } finally{
      setShowEditModal(false);
      resetForm;
      fetchEvents();
    }
  };

  console.log(user);
  const isAllowed = user?.state?.isAdmin || user?.state?.isModerator;

  if (!isAllowed) {
    return <div className="p-10 text-center text-xl">FORBIDDEN</div>;
  }


  return (
    <div>
      {/* Add Event Modal */}
      {showAddModal && (
        <EventModal
          isEdit={false}
          formData={addFormData}
          handleChange={handleInputChange}
          handleSubmit={(e) => {
            e.preventDefault();
            handleAdd(editId);
          }}
          toggleModal={toggleAddModal}
        />
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <EventModal
          isEdit={true}
          editId={editId}
          formData={addFormData}
          handleChange={handleInputChange}
          handleSubmit={(id) => {
            console.log("id",id);
            handleEdit(id);
          }}
          toggleModal={() => setShowEditModal(false)}
        />
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
      <div className="bg-astradirtyastrawhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
        <div className="flex flex-col py-4 px-1 md:px-4 lg:px-8">
          <EventTableHeader //info, pagination, toggleFilter, setPagination, searchQuery, setSearchQuery
            info={info}
            pagination={pagination}
            toggleFilter={toggleAddModal}
            setPagination={setPagination}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Table
            cols={cols}
            data={loading ? skeletonRows : createRows(currentPageData, confirmDelete, toggleEditModal)}
          />
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
      </div>
    </div>
  );
}


const skeletonRows = Array(10).fill({
  Event: <CenteredSkeleton className="h-6 w-1/2 my-6" />,
  Location: <CenteredSkeleton className="h-6 w-1/2" />,
  Type: <CenteredSkeleton className="h-6 w-1/2" />,
  Date: <CenteredSkeleton className="h-6 w-1/2" />,
  Interested: <CenteredSkeleton className="h-6 w-1/2" />,
  Actions: <CenteredSkeleton className="h-4 w-18"/>
});

function createRows(events, confirmDelete, toggleEditModal) {
  return events.map((event) => ({
    Event: renderTitle(event.event_name),
    Location: renderText(event.location),
    Type: renderText(event.type),
    Date: renderText(event.date),
    Interested: renderText(event.interested),
    Actions: renderActions(event, confirmDelete, toggleEditModal),
  }));
}

function renderTitle(name) {
  return <div className="text-center font-semibold py-5">{name}</div>;
}

function renderText(text) {
  return <div className="text-center text-astradarkgray font-s">{text}</div>;
}

function renderActions(event, confirmDelete, toggleEditModal) {
  const { id, event_name } = event;
  // console.log("event in renderaction:",event);
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
          onClick={() =>
            toggleEditModal(event)}
          className="bg-astraprimary text-astrawhite px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#0062cc]"
        >
          Edit
        </button>
        <button
          onClick={() => confirmDelete(id, event_name)}
          className="bg-astrared text-astrawhite px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#c82333]"
        >
          Delete
        </button>
      </div>
      <div className="flex md:hidden gap-2">
        <a
          href={`/admin/events/${id}`}
          className="bg-[#e6f0ff] text-[#007bff] p-2 rounded-md"
        >
          <Eye size={20} />
        </a>
        <button
          onClick={() =>
            toggleEditModal(event)}
          className="bg-astraprimary text-astrawhite p-2 rounded-md"
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={() => confirmDelete(id, event_name)}
          className="bg-astrared text-astrawhite p-2 rounded-md"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
