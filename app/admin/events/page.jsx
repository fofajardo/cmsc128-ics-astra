"use client";
import { EventTableHeader, Table, PageTool } from "@/components/TableBuilder";
import { useTab } from "../../components/TabContext";
import {toast} from "@/components/ToastNotification";
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
import { PhotoType } from "../../../common/scopes";

export default function Events() {
  const { setEventCounts } = useContext(TabContext);
  const user = useSignedInUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { currTab, info } = useTab();
  const [eventList, setEvents] = useState([]);
  const [contentMap, setContents] = useState({});
  const [eventInterests, setEventInterests] = useState({});
  const [selectedContentId, setSelectedContentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [currEvent, setCurrEvent] = useState({
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
  });

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
    event_date: "",
    max_slots: "",
    status: "open",
    external_link: "",
    access_link: "",
    description: "",
    imageFile: null,
  });

  const defaultFormData = {
    title: "",
    venue: "",
    event_type: "",
    event_date: "",
    max_slots: "",
    status: "open",
    external_link: "",
    access_link: "",
    description: "",
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

  function getChangedFields(currentData, defaultData) {
    const updatedFields = {};
    for (const key in currentData) {
      const currentValue = currentData[key];
      const defaultValue = defaultData[key];

      if (Array.isArray(currentValue)) {
        if (JSON.stringify(currentValue) !== JSON.stringify(defaultValue)) {
          updatedFields[key] = currentValue;
        }
      } else if (typeof currentValue === "string" && typeof defaultValue === "string") {
        const trimmed = currentValue.trim();
        if (trimmed !== defaultValue.trim()) {
          updatedFields[key] = trimmed;
        }
      } else if (typeof currentValue === "boolean") {
        if (currentValue !== defaultValue) {
          updatedFields[key] = currentValue;
        }
      } else if (currentValue !== defaultValue) {
        updatedFields[key] = currentValue;
      }
    }
    return updatedFields;
  }

  const fetchEventInterests = async (events) => {
    const interestMap = {};
    const interestPromises = events.map(async (event) => {
      try {
        const interestResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/${event.event_id}`
        );
        if (interestResponse.data.status === "OK") {
          interestMap[event.event_id] = interestResponse.data.list.interest_count || 0;
        } else {
          interestMap[event.event_id] = 0; // Fallback
        }
      } catch (error) {
        interestMap[event.event_id] = 0; // Fallback
      }
    });
    await Promise.all(interestPromises);
    return interestMap;
  };

  const updateStats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/events-summary`);
      if (response.data.status === "OK") {
        const { active_events, past_events, total_events } = response.data.stats;
        const counts = {
          past : past_events || 0,
          active : active_events || 0,
          total : total_events || 0,
        };
        setEventCounts(counts);
        return counts;
      } else {
        // console.error("Failed to fetch event statistics:", response.data);
        setEventCounts({ past: 0, active: 0, total: 0 });
        return { past: 0, active: 0, total: 0 };
      }
    } catch (error) {
      // console.error("Failed to fetch event statistics:", error);
      setEventCounts({ past: 0, active: 0, total: 0 });
      return { past: 0, active: 0, total: 0 };
    };
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pagination.currPage,
        limit: pagination.numToShow
      });

      // Add search query if present
      if (searchQuery && searchQuery.trim() !== "") {
        params.append("searchQuery", searchQuery);
      }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events`, {params});
      const eventData = response.data;

      if (eventData.status === "OK") {
        const events = eventData.list;
        const total = eventData.total;
        const totalPages = eventData.totalPages;

        // Fetch photos, and interests concurrently
        const [interests, stats] = await Promise.all([
          fetchEventInterests(events),
          updateStats()
        ]);

        // Update state
        setEventInterests(interests);
        setEventCounts(stats);

        // Inside fetchEvents, update the eventList mapping:
        const eventList = await Promise.all(
          events.map(async (event) => {
            // Try to fetch the event photo ID
            let photoId = null;
            try {
              const photoRes = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/by-content-id/${event.event_id}`
              );

              if (photoRes.data.status === "OK" && photoRes.data.photos.length > 0) {
                const eventPhoto = photoRes.data.photos.find(photo => photo.type === 3);
                if (eventPhoto) {
                  photoId = eventPhoto.id;
                }
              }
            } catch (photoError) {
              // console.error(`Error fetching photo for event ${event.event_id}:`, photoError);
            }

            return {
              id: event.event_id,
              event_id: event.event_id,
              content_id: event.event_id,
              event_name: event.title || "Unknown",
              location: event.venue || "Unknown Location",
              type: event.online ? "Online" : "In-Person",
              date: new Date(event.event_date).toDateString(),
              max_slot: event.slots,
              status: event.status,
              external_link: event.external_link,
              access_link: event.access_link,
              description: event.details || "No Description",
              interested: interests[event.event_id] || 0,
              photoId: photoId,
            };
          })
        );
        // Set events using the fetched data
        setEvents(eventList);
        setPagination((prev) => ({
          ...prev,
          lastPage: totalPages,
          total: total,
          display: [
            total === 0 ? 0 : (pagination.currPage - 1) * pagination.numToShow + 1,
            Math.min(pagination.currPage * pagination.numToShow, total),
          ],
        }));

      } else {
        throw new Error("Failed to fetch events");
      }
    } catch (error) {
      // console.error("Failed to fetch events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch event!",
        variant: "fail"
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // FOR BACKEND PEEPS
  useEffect(() => {
    fetchEvents();
  }, []);

  // Debounce search input to prevent too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchEvents();
    }, 200); // Wait 500ms after typing stops

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch events when pagination changes
  useEffect(() => {
    fetchEvents();
  }, [pagination.currPage, pagination.numToShow]);

  const toggleAddModal = () => {
    setShowAddModal((prev) => !prev);
    resetForm();
  };

  const toggleEditModal = (event) => {
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
        toast({
          title: "Succes",
          description: `${name} deleted successfully!`,
          variant: "success"
        });

      }

    }catch(error){
      toast({
        title: "Error",
        description: "Failed to delete event!",
        variant: "error"
      });
      // console.error("Failed to delete events:", error);
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
      toast({
        title: "Error",
        description: "Failed to delete event!",
        variant: "error"
      });
      // console.error("Failed to delete events:", error);
    }
    fetchEvents();
  };

  const handleAdd = async () => {   // add content -> get the newly created content_id -> add event
    try{
      let contentId;

      let user_id = user?.state?.user.id;

      if(!isValidDate(addFormData.event_date)){
        toast({
          title: "Error",
          description: "Invalid date format!",
          variant: "error"
        });

      }
      const isOnline = addFormData.event_type === "Online";
      if (!isValidUUID(user_id)){
        toast({
          title: "Error",
          description: "Failed to create event!",
          variant: "error"
        });
        return -1;
      }

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

      if (contentResponse.data.status === "CREATED" && contentResponse.data.content.id) {
        contentId = contentResponse.data.content.id;

        const eventToAdd = {
          event_id: contentId,
          event_date: new Date(addFormData.event_date).toISOString(),
          venue: addFormData.venue,
          external_link: addFormData.external_link || "",
          access_link: addFormData.access_link || "",
          online: isOnline,
          slots: Number(addFormData.max_slots) || 0,
          status: addFormData.status
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
          }

          if (eventResponse.data.status === "CREATED") {
            toast({
              title: "Success",
              description: "Event published successfully!",
              variant: "success"
            });
            toggleAddModal();
            resetForm();
            fetchEvents();
          }
        }catch{
          handleDeleteContent(contentId);
        }
      }
    }catch(error){
      toast({
        title: "Error",
        description: "Failed to create event!",
        variant: "error"
      });
    }
    setShowAddModal(false);
    resetForm();
    fetchEvents();
  };

  const handleEdit = async () => {
    try {
      const toEditId = editId;

      const eventDefaults = {
        event_date: "",
        venue: "",
        external_link: "",
        access_link: "",
        online: true,
        slots: 0,
        status: "Open"
      };

      const contentDefaults = {
        title: "",
        details: "",
      };

      const eventUpdateData = getChangedFields({
        event_date: addFormData.event_date,
        venue: addFormData.venue,
        external_link: addFormData.external_link,
        access_link: addFormData.access_link,
        online: addFormData.event_type === "Online" ? true : false,
        status: addFormData.status,
        slots: addFormData.max_slots
      }, eventDefaults);

      const contentUpdateData = getChangedFields({
        title: addFormData.title,
        details: addFormData.description,
      }, contentDefaults);

      const needsEventUpdate = Object.keys(eventUpdateData).length > 0;
      const needsContentUpdate = Object.keys(contentUpdateData).length > 0;
      const needsPhotoUpdate = addFormData.imageFile !== null;

      const [eventRes, contentRes] = await Promise.all([
        needsEventUpdate ? axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${toEditId}`, eventUpdateData) : null,
        needsContentUpdate ? axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${toEditId}`, contentUpdateData) : null
      ]);

      const eventSuccess = eventRes?.data?.status === "UPDATED";
      const contentSuccess = contentRes?.data?.status === "UPDATED";
      const eventFailed = eventRes?.data?.status === "FAILED" || eventRes?.data?.status === "FORBIDDEN";
      const contentFailed = contentRes?.data?.status === "FAILED" || contentRes?.data?.status === "FORBIDDEN";
      let photoFailed = false;

      // Process photo if a new image was uploaded
      if (addFormData.imageFile) {
        // console.log("Uploading new event photo");
        const formData = new FormData();
        formData.append("File", addFormData.imageFile);
        formData.append("content_id", toEditId);

        try {
          // First, check if an event photo already exists for this content
          const existingPhotoRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/by-content-id/${toEditId}`
          );

          let photoId = null;

          if (existingPhotoRes.data.status === "OK" && existingPhotoRes.data.photos.length > 0) {
            // Find photo with type 3 (event photo)
            const eventPhoto = existingPhotoRes.data.photos.find(photo => photo.type === 3);

            if (eventPhoto) {
              photoId = eventPhoto.id;
              // console.log("Found existing event photo with ID:", photoId);
            }
          }

          if (photoId) {
            // Update existing photo
            // console.log("Updating existing photo with ID:", photoId);
            const photoRes = await axios.put(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/event/${photoId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } else {

            formData.append("type", PhotoType.EVENT_PIC);
            const photoRes = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/photos`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          }
          // console.log("Photo API response:", photoRes?.data);
        } catch (photoError) {
          photoFailed = true;
          // console.error("Error handling event photo:", photoError);
        }
      }

      if ((needsEventUpdate && eventFailed) || (needsContentUpdate && contentFailed) || (needsPhotoUpdate && photoFailed)) {
        toast({
          title: "Error",
          description: "Failed to edit event!",
          variant: "error"
        });
      } else if ((needsEventUpdate && eventSuccess) || (needsContentUpdate && contentSuccess)) {
        toast({
          title: "Success",
          description: "Event edited successfully!",
          variant: "success"
        });
      }

    }catch(error){
      // console.error("error",error);
      toast({
        title: "Error",
        description: "Failed to edit event!",
        variant: "error"
      });
    } finally{
      setShowEditModal(false);
      resetForm();
      fetchEvents();
    }
  };

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
          reset = {resetForm}
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
            handleEdit(id);
          }}
          toggleModal={() => setShowEditModal(false)}
          reset = {resetForm}
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
            data={loading ? skeletonRows : createRows(eventList, confirmDelete, toggleEditModal, setAddFormData)}
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

function createRows(events, confirmDelete, toggleEditModal,setAddFormData) {
  return events.map((event) => ({
    Event: renderTitle(event.event_name),
    Location: renderText(event.location),
    Type: renderText(event.type),
    Date: renderText(event.date),
    Interested: renderText(event.interested),
    Actions: renderActions(event, confirmDelete, toggleEditModal, setAddFormData),
  }));
}

function renderTitle(name) {
  return <div className="text-center font-semibold py-5">{name}</div>;
}

function renderText(text) {
  return <div className="text-center text-astradarkgray font-s">{text}</div>;
}

function renderActions(event, confirmDelete, toggleEditModal, setAddFormData) {
  const { id, event_name } = event;

  const prepareEditData = async () => {
    // First, fetch the event photo information
    try {
      const photoRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/by-content-id/${id}`
      );

      let photoId = null;
      let imageUrl = null;

      if (photoRes.data.status === "OK" && photoRes.data.photos.length > 0) {
        // Find photo with type 3 (event photo)
        const eventPhoto = photoRes.data.photos.find(photo => photo.type === 3);
        if (eventPhoto) {
          photoId = eventPhoto.id;

          // Get the event photo URL
          const eventPhotoRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/event/${id}`
          );

          if (eventPhotoRes.data.status === "OK") {
            imageUrl = eventPhotoRes.data.photo;
          }
        }
      }

      // Set form data with the event information
      setAddFormData({
        title: event.event_name || "",
        venue: event.location || "",
        event_type: event.type || "",
        event_date: event.date || "",
        max_slots: event.max_slot,
        status: event.status || "open",
        external_link: event.external_link || "",
        access_link: event.access_link || "",
        description: event.description || "",
        photoId: photoId,
        image: imageUrl,
      });

      toggleEditModal(event);
    } catch (error) {
      //console.error("Error fetching event photo information:", error);

      // Fall back to basic information without photo
      setAddFormData({
        title: event.event_name || "",
        venue: event.location || "",
        event_type: event.type || "",
        event_date: event.date || "",
        max_slots: event.max_slot,
        status: event.status || "open",
        external_link: event.external_link || "",
        access_link: event.access_link || "",
        description: event.description || "",
      });

      toggleEditModal(event);
    }
  };

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
          onClick={prepareEditData}
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
          onClick={prepareEditData}
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