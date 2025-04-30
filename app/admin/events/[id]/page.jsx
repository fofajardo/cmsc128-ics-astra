"use client";

import { useParams, useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import eventList from "../eventDummy";

import BackButton from "@/components/events/IndividualEvent/BackButton";
import HeaderEvent from "@/components/events/IndividualEvent/HeaderEvent";
import EditEventModal from "@/components/events/IndividualEvent/EditEventModal/EditEventModal";
import DeleteConfirmationModal from "@/components/events/IndividualEvent/DeleteEventModal/DeleteEventModal";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";

import EventDetailsCard from "./EventDetails.Card";
import SendEventCard from "./SendEventCard";
import AttendeesTabs from "./AttendeesTabs";
import AttendeesList from "./AttendeesList";
import venue2 from "../../../assets/venue2.jpeg";

export default function EventAdminDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  //const eventId = parseInt(id);
  //const originalEvent = eventList.find((e) => e.id === eventId);

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
    setEvent((prevEvent) => ({
      ...prevEvent,
      ...updatedEvent
    }));
    setShowEditModal(false);
    setToastData({ type: "success", message: "Event updated successfully!" });
  };

  const handleDeleteContent = async (id) => {
    try{
      const response = await axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`);

      setToastData({ type: "success", message: "Event deleted successfully!" });
    }catch(error){
      console.error("Failed to delete events:", error);
      setToastData({ type: "error", message: "Failed to delete event!" });
    }
  };

  const handleDelete = async () => {
    try{
      const response = await axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${id}`);

      console.log("edit event - delete:", response.data);
      if (response.data.status === "DELETED") {
        handleDeleteContent(id);
        //setToastData({ type: "success", message: `${name} deleted successfully!` });
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

      console.log("event id in ", toEditId);
      console.log(event);
      console.log(new Date(event.date));
      console.log(updatedEvent);

      // const ndate = new Date(event.date);
      // const formatted = ndate.toISOString().slice(0, 10);
      // console.log(formatted);

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
        eventOnly += 1
        console.log('entered event update');

      }

      if (Object.keys(contentUpdateData).length > 0) {
        contentRes = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${toEditId}`,contentUpdateData);
        eventOnly += 1 // 2 -> event,content updated; 1->onlyevent
        console.log('entered content update');
      }
      // create photos - post/put
      // if (Object.keys(contentUpdateData).length > 0) {
      //   contentRes = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${toEditId}`,contentUpdateData);
      //   eventOnly += 1 // 2 -> event,content updated; 1->onlyevent
      //   console.log('entered content update');
      // }

      console.log('eventOnly: ', eventOnly);
      console.log(eventRes);
      console.log(contentRes);
      console.log(contentRes.data.status);
      console.log(eventRes?.data);


      if (eventRes?.data?.status ==="UPDATED"  && contentRes?.data?.status === "UPDATED" && eventOnly===2){
        setToastData({ type: "success", message: "Event edited successfully!" });
        console.log("here at 1dtcondition");

      } else if ((eventRes?.data?.status ==="UPDATED" && eventOnly===1) || (contentRes?.data?.status === "UPDATED" && eventOnly===1)){
        setToastData({ type: "success", message: "Event edited successfully!" });
        console.log("here at 2nd condition");

      } else if (
        (["FAILED", "FORBIDDEN"].includes(eventRes?.data?.status) && eventOnly === 2) ||
        (["FAILED", "FORBIDDEN"].includes(contentRes?.data?.status) && eventOnly === 2)
      )
      {
        setToastData({ type: "error", message: "Failed to edit event." });
        console.log("here at 3rd condition");
      }
    }catch(error){
      console.log('error',error);
      setToastData({ type: "error", message: "Failed to edit event." });
    } finally{
    //setEvent({...updatedEvent});
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

  const fetchInterest = async (id) => {
    try{
      const interests = [];
      const interest = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/content/${id}`);
      if (interest.data.status === "OK") {
        interests = interest.data|| [];
      }
    }catch(error){
      console.error("Failed fetching interests:", error);
    }

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


  const fetchEvent = async () =>{
    let mergedEvent;
    try {
      console.log("id: ", id);
      const [eventRes, contentRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`),
        //fetch the interests
        //fetch the photo
      ]);

      // let interests = [];
      // try {
      //   console.log("id interest: ", id);
      //   if(isValidUUID(id)) console.log('valid');

      //   const interestRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/content/${id}`);
      //   if (interestRes.data.status === "OK") {
      //     interests = interestRes.data.data || [];
      //   }
      // } catch (interestError) {
      //   console.warn('Failed to fetch interests, continuing with empty array:', interestError);&& interestRes.data.status === "OK"
      // }
      console.log('eventResponse:',eventRes);
      if (eventRes.data.status === "OK" && contentRes.data.status === "OK" ) {
        const eventResponse = eventRes.data;
        const contentResponse = contentRes.data;
        //const interests = interestRes.data.data || [];

        console.log("event: ", eventResponse);
        console.log("content: ", contentResponse);
        //  console.log('interests:', interests);

        console.log("event: ", eventResponse.event.event_id);
        console.log("content: ", contentResponse.content.id);

        mergedEvent = {
          id: eventResponse.event.event_id,
          event_id: eventResponse.event.event_id,
          imageSrc: contentResponse?.imageSrc || venue2, // fetch this on photo entity;
          title: contentResponse.content.title || "Untitled",
          description: contentResponse?.content.details || "No description",
          date: new Date(eventResponse.event.event_date).toDateString(),
          location: eventResponse.event.venue,
          //attendees: interests, //
          status: eventResponse.online ? "Online" : "Offline",
          avatars: [],
        };
        console.log("mergedEvent", mergedEvent);
        setEvent(mergedEvent);
      }
    } catch (error) {
      console.error("Failed fetching event, content, or interests:", error);
      setEvent(null);
    }
    setEvent(mergedEvent);
    console.log("event after fetch:", event);
  };

  useEffect(() => {
     fetchEvent();
  }, [id]);

  // useEffect(()=>{
  //   setEvent(eventList.find((e) => e.id === id));
  // },[eventList]);

  const handleInterestClick = () => {
    setIsInterested((prev) => !prev);
    if (isGoing) setIsGoing(false); // Optional: disable "Going" when "Interested" is clicked
  };

  const handleGoingClick = () => {
    setIsGoing((prev) => !prev);
    if (isInterested) setIsInterested(false); // Optional: disable "Interested" when "Going" is clicked
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
          onSave={handleEdit}
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
