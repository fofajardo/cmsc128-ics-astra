"use client";

import { useParams, useRouter } from "next/navigation";
import { useState,useEffect, useContext } from "react";
// import eventList from "../eventDummy";

import BackButton from "@/components/events/IndividualEvent/BackButton";
import HeaderEvent from "@/components/events/IndividualEvent/HeaderEvent";
import EditEventModal from "@/components/events/IndividualEvent/EditEventModal/EditEventModal";
import DeleteConfirmationModal from "@/components/events/IndividualEvent/DeleteEventModal/DeleteEventModal";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";
import { TabContext } from "@/components/TabContext";

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
  const [toastData, setToastData] = useState(null);
  const itemsPerPage = 5;

  const handleSave = (updatedEvent) => {
    handleEdit(updatedEvent);
    // setEvent((prevEvent) => ({
    //   ...prevEvent,
    //   ...updatedEvent
    // }));
    // setShowEditModal(false);
    // setToastData({ type: "success", message: "Event updated successfully!" });
  };

  const handleDeleteContent = async (id) => {
    try{
      const response = await axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`);

      setToastData({ type: "success", message: "Event deleted successfully!" });
    }catch(error){
      // console.error("Failed to delete events:", error);
      setToastData({ type: "error", message: "Failed to delete event!" });
    }
  };

  const handleDelete = async () => {
    try{
      const response = await axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${id}`);

      // console.log("edit event - delete:", response.data);
      if (response.data.status === "DELETED") {
        handleDeleteContent(id);
      }
    }catch{
      setToastData({ type: "error", message: "Failed to delete event!" });
    } finally{
      setShowDeleteModal(false);
      router.push("/admin/events");
    }
  };

  const handleEdit = async (updatedEvent) => {
    try{
      const toEditId = id;
      // console.log("event id in ", toEditId);
      // console.log(event);
      // console.log(new Date(event.date));
      // console.log(updatedEvent);

      const eventDefaults = {
        event_date: "",
        venue: "",
        // external_link: "",
        // access_link: "",
        online: false,
      };

      const contentDefaults = {
        title: "",
        details: "",
        //tags: [],
      };

      const eventUpdateData = getChangedFields({
        event_date: updatedEvent.date,
        venue: updatedEvent.location,
        // external_link: addFormData.external_link,
        // access_link: addFormData.access_link,
        //online: addFormData.online,
      }, eventDefaults);

      const contentUpdateData = getChangedFields({
        title: updatedEvent.title,
        details: updatedEvent.description,
        //tags: addFormData.tags,
      }, contentDefaults);

      let eventRes, contentRes, eventOnly = 0;
      if (Object.keys(eventUpdateData).length > 0) {
        eventRes = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${toEditId}`, eventUpdateData);
        eventOnly += 1;
        // console.log("entered event update");

      }

      if (Object.keys(contentUpdateData).length > 0) {
        contentRes = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${toEditId}`,contentUpdateData);
        eventOnly += 1; // 2 -> event,content updated; 1->onlyevent
        // console.log("entered content update");
      }
      // TODO: POST/PUT photo
      //
      //

      // console.log("eventOnly: ", eventOnly);
      // console.log(eventRes);
      // console.log(contentRes);
      // console.log(contentRes.data.status);
      // console.log(eventRes?.data);


      if (eventRes?.data?.status ==="UPDATED"  && contentRes?.data?.status === "UPDATED" && eventOnly===2){
        setToastData({ type: "success", message: "Event edited successfully!" });
        // console.log("here at 1dtcondition");

      } else if ((eventRes?.data?.status ==="UPDATED" && eventOnly===1) || (contentRes?.data?.status === "UPDATED" && eventOnly===1)){
        setToastData({ type: "success", message: "Event edited successfully!" });
        // console.log("here at 2nd condition");

      } else if (
        (["FAILED", "FORBIDDEN"].includes(eventRes?.data?.status) && eventOnly === 2) ||
        (["FAILED", "FORBIDDEN"].includes(contentRes?.data?.status) && eventOnly === 2)
      )
      {
        setToastData({ type: "error", message: "Failed to edit event." });
        // console.log("here at 3rd condition");
      }
    }catch(error){
      // console.log("error",error);
      setToastData({ type: "error", message: "Failed to edit event." });
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

    // console.log("Sending Event:", {
    //   to: selectedOption,
    //   recipients: recipients.map(r => r.name),
    //   message: message
    // });

    setMessage("");
    setSelectedOption("Everyone");

    setToastData({
      type: "success",
      message: `Successfully sent "${event.title}" to ${recipients.length} users!`
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

      // console.log(response);
      if (response.data.status === "OK") {
        const selectUserName = response.data.user.username;
        // console.log("select event name:",selectUserName, "type", typeof(selectUserName));
        return selectUserName;
      } else {
        setToastData("Unexpected response:", response.data.message);
      }
    }catch(error){
      setToastData({ type: "error", message: error.message });
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
      ; // console.log(`Failed to fetch photo for event_id ${contentId}:`, error);
    }
  };

  const updateStats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/events-summary`);
      if (response.data.status === "OK") {
        const { active_events, past_events, total_events } = response.data.stats;
        // console.log("stats: ", response.data.stats);
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
    }
  };

  const fetchEvent = async () =>{
    try {
      // console.log("id: ", id);
      const [eventRes, contentRes,interestStatsRes,interestRes,eventsResponse,actResponse, stats] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/content/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/active-events`),
        updateStats(),
        //TODO: fetch the photo

      ]);
      if(eventsResponse.data.status === "OK" && actResponse.data.status === "OK") {
        // console.log("events responses: ",eventsResponse);
        // console.log("acts responses: ",actResponse);

      }
      // console.log("eventResponse:",eventRes);
      if (eventRes.data.status === "OK" && contentRes.data.status === "OK" ) {
        const eventResponse = eventRes.data;
        const contentResponse = contentRes.data;
        const interests = interestRes.data.list;
        const interestStats = interestStatsRes.data.list;

        // console.log("interests:", interests);
        // console.log("intereststat", interestStats.interest_count);

        const interestedUsers = await Promise.all(
          interests.map(async (user) => ({
            id: user.user_id,
            name: await fetchUserName(user.user_id),
          }))
        );

        // console.log("event: ", eventResponse);
        // console.log("content: ", contentResponse);
        // console.log("event: ", eventResponse.event.event_id);
        // console.log("content: ", contentResponse.content.id);

        const photoUrl = await fetchEventPhoto(eventResponse.event.event_id);

        // console.log("photo url: ", photoUrl);


        const mergedEvent = {
          id: eventResponse.event.event_id,
          event_id: eventResponse.event.event_id,
          imageSrc: photoUrl, // fetch this on photo entity;
          title: contentResponse.content.title || "Untitled",
          description: contentResponse?.content.details || "No description",
          date: new Date(eventResponse.event.event_date).toDateString(),
          location: eventResponse.event.venue,
          attendees: interestedUsers, //
          status: eventResponse.event.status
        };
        // console.log("mergedEvent", mergedEvent);
        setEvent(mergedEvent);


      }

      if (stats) {
        setEventCounts(stats);
      }
    } catch (error) {
      // console.error("Failed fetching event, content, or interests:", error);
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
