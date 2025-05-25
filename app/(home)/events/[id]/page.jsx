"use client";
import { useParams } from "next/navigation";
//import events from "../../../data/events";
import { useState,useEffect } from "react";
import AttendeesSection from "@/components/events/IndividualEvent/AttendeesSection";
import EventDetails from "@/components/events/IndividualEvent/EventDetails";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import HeaderEvent from "@/components/events/IndividualEvent/HeaderEvent";
import axios from "axios";
import { isValidUUID } from "../../../../api/utils/validators";
import ToastNotification from "@/components/ToastNotification";

import venue2 from "../../../assets/venue2.jpeg";
import { ChartColumnStackedIcon } from "lucide-react";
import { useSignedInUser } from "@/components/UserContext";


export default function EventDetailPage() {
  const user = useSignedInUser();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isInterested, setIsInterested] = useState(false);
  const [isGoing, setIsGoing] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [numOfInterested, setNumOfInterested] = useState(0);
  const [toastData, setToastData] = useState(null);
  const isAlumn = user?.state?.isAlumnus;
  const user_id = user?.state?.user?.id;

  const fetchEvent = async () => {
    try {
      const ID = id;
      const [eventRes, contentRes,interestStatsRes,interestRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/content/${id}`)
      ]);

      if (eventRes.data.status === "OK" && contentRes.data.status === "OK" && interestStatsRes.data.status === "OK" && interestRes.data.status === "OK") {
        const event = eventRes.data;
        const content = contentRes.data;
        const interests = interestRes.data.list;
        const interestStats = interestStatsRes.data.list;

        let interestedUsers = [];
        if( user?.state?.isAlumnus || user?.state?.isAdmin||user?.state?.isModerator){
          const isCurrentUserInterested = interests.some(user => user.user_id === user_id);
          setIsInterested(isCurrentUserInterested);
          interestedUsers = await Promise.all(
            interests.map(async (user) => ({
              id: user.user_id,
              name: await fetchUserName(user.user_id),
            }))
          );
        }


        const photoUrl = await fetchEventPhoto(event.event.event_id);

        const mergedEvent = {
          id: event.event.event_id,
          event_id: event.event.event_id,
          imageSrc: photoUrl || venue2,
          title: content.content.title || "Untitled",
          description: content?.content.details || "No description",
          date: new Date(event.event.event_date).toDateString(),
          location: event.event.venue,
          attendeesList: interestedUsers,
          status: event.event.status,
          avatars: [],
        };

        setEvent(mergedEvent);
        setNumOfInterested(interestStats.interest_count);
      }
    } catch (error) {
      setEvent(null);
    }
  };

  const fetchUserName = async (id) => {
    try{
      const response = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${id}`);

      if (response.data.status === "OK") {
        const selectEventName = response.data.user.username;
        return selectEventName;
      } else {
        ; // console.error("Unexpected response:", response.data);
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
        if(response.data.photo == "/events/default-event.jpg") return venue2.src; //added this since the default-event.jpg not working
        return response.data.photo;
      }
    } catch (error) {
      ; // console.log(`Failed to fetch photo for event_id ${contentId}:`, error);
    }
    return venue2.src;
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(()=>{
    setEvent(eventList.find((e) => e.id === id));
  },[eventList]);


  const handleSave = (updatedEvent) => {
    setEvent(updatedEvent);
  };

  const addDeleteInterest = async (newIsInterested) => {
    try{

      const interest = {
        user_id: user_id,
        content_id: event.id
      };

      if(newIsInterested){
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests`, interest);
        if(response.status === "CREATED"){
          setToastData({ type: "success", message: "Interest added!" });
        }
      } else {

        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/${interest.user_id}/${interest.content_id}`);
        if(response.status === "DELETED"){
          setToastData({ type: "success", message: "Interest removed successfully!"});
        }
      }

    } catch (error){
      ; // console.log("error at addDeleteInterest: ", error.message);
    }
  };

  const handleGoingClick = () => {
    setIsGoing((prev) => !prev);
    if (isInterested) setIsInterested(false); // Optional: disable "Interested" when "Going" is clicked
    fetchEvent();
  };

  const [isInterestedLoading, setIsInterestedLoading] = useState(false);

  const handleInterestClick = async () => {
    if (isInterestedLoading) return;

    const hasAccess = user?.state?.isAlumnus || user?.state?.isAdmin || user?.state?.isModerator;
    if (!hasAccess) {
      setToastData({ type: "fail", message: "Sign in first to add interest." });
      return;
    }

    if (event?.status !== "Open") {
      setToastData({ type: "fail", message: "Event is closed for interest." });
      return;
    }

    try {
      setIsInterestedLoading(true);
      const newIsInterested = !isInterested;
      setIsInterested(newIsInterested);


      if (isGoing && newIsInterested) {
        setIsGoing(false);
      }

      await addDeleteInterest(newIsInterested);
      await fetchEvent();
    } catch (error) {
      setIsInterested(!isInterested);
    } finally {
      setIsInterestedLoading(false);
    }
  };

  if (!event) {
    return <div className="p-10 text-center text-xl">Event not found.</div>;
  }

  return (
    <div className="bg-astradirtywhite min-h-screen px-6 sm:px-12 py-6 max-w-screen-xl mx-auto">
      <BackButton />

      <div className="flex flex-col lg:flex-row gap-6">
        {toastData && (
          <ToastNotification
            type={toastData.type}
            message={toastData.message}
            onClose={() => setToastData(null)}
          />
        )}
        <HeaderEvent event={event} onSave={handleSave} />
        <EventDetails event={event} isInterested={isInterested} handleInterestClick={handleInterestClick} isGoing={isGoing} handleGoingClick={handleGoingClick}/>
      </div>
      <AttendeesSection
        event={(user?.state?.isUnlinked || user?.state?.isAdmin)
          ? event
          : { ...event, attendees: [] }}
      />
    </div>
  );
}
