"use client";

import { useParams, useRouter } from "next/navigation";
import { useState,useEffect, useContext } from "react";
// import eventList from "../eventDummy";

import BackButton from "@/components/events/IndividualEvent/BackButton";
import HeaderEvent from "@/components/events/IndividualEvent/HeaderEvent";
import EditEventModal from "@/components/events/IndividualEvent/EditEventModal/EditEventModal";
import DeleteConfirmationModal from "@/components/events/IndividualEvent/DeleteEventModal/DeleteEventModal";
import { toast } from "@/components/ToastNotification";
import axios from "axios";
import { TabContext } from "@/components/TabContext";
import { PhotoType } from "../../../../common/scopes";

import EventDetailsCard from "./EventDetails.Card";
import SendEventCard from "./SendEventCard";
import AttendeesTabs from "./AttendeesTabs";
import AttendeesList from "./AttendeesList";
import venue1 from "../../../assets/venue1.jpeg";
import venue2 from "../../../assets/venue2.jpeg";

export default function EventAdminDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { setEventCounts } = useContext(TabContext);
  const [event, setEvent] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Everyone");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("going");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const itemsPerPage = 5;


  const handleDeleteContent = async (id) => {
    try{
      const response = await axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`);

      toast({
        title: "Success",
        description: "Event deleted successfully!",
        variant: "success"
      });
    }catch(error){
      toast({
        title: "Error",
        description: "Failed to delete event!",
        variant: "fail"
      });
    }
  };

  const handleDelete = async () => {
    try{
      const response = await axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${id}`);

      if (response.data.status === "DELETED") {
        handleDeleteContent(id);
      }
    }catch{
      toast({
        title: "Error",
        description: "Failed to delete event!",
        variant: "fail"
      });
    } finally{
      setShowDeleteModal(false);
      router.push("/admin/events");
    }
  };

  const handleEdit = async (updatedEvent) => {
    try{
      const toEditId = id;
      const eventDefaults = {
        event_date: event?.date || "",
        venue: event?.location || "",
        online: event?.online || false,
      };

      const contentDefaults = {
        title: event?.title || "",
        details: event?.description || "",
      };

      const eventUpdateData = getChangedFields({
        event_date: updatedEvent.date,
        venue: updatedEvent.location,
      }, eventDefaults);


      const contentUpdateData = getChangedFields({
        title: updatedEvent.title,
        details: updatedEvent.description,
        //tags: addFormData.tags,
      }, contentDefaults);


      const needsEventUpdate = Object.keys(eventUpdateData).length > 0;
      const needsContentUpdate = Object.keys(contentUpdateData).length > 0;
      const needsPhotoUpdate = updatedEvent.photoFile !== null;

      const [eventRes, contentRes] = await Promise.all([
        needsEventUpdate ? axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${toEditId}`, eventUpdateData) : null,
        needsContentUpdate ? axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${toEditId}`, contentUpdateData) : null
      ]);

      if (updatedEvent.photoFile) {
        const formData = new FormData();
        formData.append("File", updatedEvent.photoFile);
        formData.append("content_id", toEditId);

        // Use the new specific endpoint for updating event photos
        photoRes = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/event/${updatedEvent.photoId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // console.log("Event photo update response:", photoRes.data);
      }
      const eventSuccess = eventRes?.data?.status === "UPDATED";
      const contentSuccess = contentRes?.data?.status === "UPDATED";
      const eventFailed = eventRes?.data?.status === "FAILED" || eventRes?.data?.status === "FORBIDDEN";
      const contentFailed = contentRes?.data?.status === "FAILED" || contentRes?.data?.status === "FORBIDDEN";
      const photoSuccess = photoRes?.data?.status === "UPDATED";
      const photoFailed = photoRes?.data?.status === "FAILED" || photoRes?.data?.status === "FORBIDDEN";

      if ((needsEventUpdate && eventFailed) || (needsContentUpdate && contentFailed)|| (needsPhotoUpdate && photoFailed)) {
        toast({
          title: "Error",
          description: "Failed to edit event!",
          variant: "fail"
        });
      } else if ((needsEventUpdate && eventSuccess) || (needsContentUpdate && contentSuccess) || (needsPhotoUpdate && photoSuccess)) {
        toast({
          title: "Success",
          description: "Event edited successfully!",
          variant: "success"
        });
      }
    }catch(error){
      toast({
        title: "Error",
        description: "Failed to edit event!",
        variant: "fail"
      });
    } finally{
      setShowEditModal(false);
      fetchEvent();
    }
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

    setMessage("");
    setSelectedOption("Everyone");
    toast({
      title: "Success",
      description: `Successfully sent "${event.title}" to ${recipients.length} users!`,
      variant: "success"
    });
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

  const fetchUserName = async (id) => {
    try{
      const response = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${id}`);

      if (response.data.status === "OK") {
        const selectUserName = response.data.user.username;
        return selectUserName;
      }
    }catch(error){
      ;
    }
    return "Unknown";
  };

  const fetchEventPhoto = async (contentId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/event/${contentId}`
      );

      if (response.data.status === "OK" && response.data.photo) {
        if (response.data.photo.includes("default")) {
          if (response.data.photo.includes("default")) {
            const venue = Math.random() < 0.5 ? 1 : 2;
            if (venue === 1) {
              return venue1.src;
            } else {
              return venue2.src;
            }
          }
        }
        return response.data.photo;
      }
    } catch (error) {
      ;
    }
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

        setEventCounts({ past: 0, active: 0, total: 0 });
        return { past: 0, active: 0, total: 0 };
      }
    } catch (error) {

      setEventCounts({ past: 0, active: 0, total: 0 });
      return { past: 0, active: 0, total: 0 };
    }
  };

  const fetchEvent = async () =>{
    try {

      const [eventRes, contentRes,interestStatsRes,interestRes, stats] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/content/${id}`),
        updateStats(),
      ]);

      if (eventRes.data.status === "OK" && contentRes.data.status === "OK" ) {
        const eventResponse = eventRes.data;
        const contentResponse = contentRes.data;
        const interests = interestRes.data.list;
        const interestStats = interestStatsRes.data.list;

        const photoResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/by-content-id/${id}`
        );

        let photoId = null;
        if (photoResponse.data.status === "OK" && photoResponse.data.photos.length > 0) {
          // Find the event photo (type 3)
          const eventPhoto = photoResponse.data.photos.find(photo => photo.type === 3);
          photoId = eventPhoto ? eventPhoto.id : null;
        }

        const interestedUsers = await Promise.all(
          interests.map(async (user) => ({
            id: user.user_id,
            name: await fetchUserName(user.user_id),
          }))
        );

        const photoUrl = await fetchEventPhoto(eventResponse.event.event_id);

        const mergedEvent = {
          id: eventResponse.event.event_id,
          event_id: eventResponse.event.event_id,
          photoId: photoId, // fetch this on photo entity;
          imageSrc: photoUrl, // fetch this on photo entity;
          title: contentResponse.content.title || "Untitled",
          description: contentResponse?.content.details || "No description",
          external_link: eventResponse.event.external_link|| "",
          access_link: eventResponse.event.access_link || "",
          date: new Date(eventResponse.event.event_date).toDateString(),
          location: eventResponse.event.venue,
          attendees: interestedUsers, //
          status: eventResponse.event.status
        };
        setEvent(mergedEvent);


      }

      if (stats) {
        setEventCounts(stats);
      }
    } catch (error) {
      setEvent(null);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (!event) {
    return <div className="p-10 text-center text-xl">Event not found.</div>;
  }

  return (
    <div className="bg-astradirtyastrawhite min-h-screen px-6 sm:px-12 py-6 max-w-screen-xl mx-auto relative">
      <BackButton />


      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col">
          <HeaderEvent
            event={event}
            // onSave={handleSave}
            // onDelete={handleDelete}
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
          interested={event.attendees || []}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setCurrentPage={setCurrentPage}
        />

        <AttendeesList
          attendees={event.attendeesList || []}
          interested={event.attendees || []}
          activeTab={activeTab}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {showEditModal && (
        <EditEventModal
          event={event}
          onClose={() => {
            setShowEditModal(false);}}
          onSave={
            handleEdit
          }
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
