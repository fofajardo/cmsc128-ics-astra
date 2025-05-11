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
  // const [currentEvents, setCurrentEvents] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const [numOfInterested, setNumOfInterested] = useState(0);
  //const user_id = "38f98c8d-af8d-4cef-ab9b-8a5d80e9c8b1"; //Only using this since userid is needed
  console.log("user: ", user);
  const isAlumn = user?.state?.isAlumnus;
  const user_id = user?.state?.user?.id;
  console.log("isAlumnus: ",isAlumn);
  console.log("user id: ", user?.state?.user?.id );

  const fetchEvent = async () => {
    try {
      console.log("id: ", id);
      console.log("id interest: ", id);
      const ID = id;
      console.log("id fetch:", ID);
      if(isValidUUID(id)) console.log("valid");
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

        console.log("event: ", event);
        console.log("content: ", content);
        console.log("interests:", interests);
        console.log("intereststat", interestStats.interest_count);
        let interestedUsers = [];
        if( user?.state?.isAlumnus || user?.state?.isAdmin||user?.state?.isModerator){
          console.log("signed in");
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
          status: event.event.online ? "Online" : "Offline",
          avatars: [],
        };

        setEvent(mergedEvent);
        setNumOfInterested(interestStats.interest_count);
      }
    } catch (error) {
      console.error("Failed fetching event, content, or interests:", error);
      setEvent(null);
    }
  };

  const fetchUserName = async (id) => {
    try{
      const response = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${id}`);

      console.log(response);
      if (response.data.status === "OK") {
        const selectEventName = response.data.user.username;
        console.log("select event name:",selectEventName, "type", typeof(selectEventName));
        return selectEventName;
      } else {
        console.error("Unexpected response:", response.data);
      }
    }catch(error){
      console.error("Failed to get content:", error);
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
      console.log(`Failed to fetch photo for event_id ${contentId}:`, error);
    }
    return venue2.src;
  };

  useEffect(() => {

    fetchEvent();
    //fetchInterest(id);
  }, [id]);

  useEffect(()=>{
    setEvent(eventList.find((e) => e.id === id));
  },[eventList]);


  const handleSave = (updatedEvent) => {
    setEvent(updatedEvent);
  };

  const addDeleteInterest = async (newIsInterested) => {
    try{

      console.log("user:", user?.state?.user);

      console.log("click interests...");
      console.log("not alumn", !user?.state?.isAlumnus);
      const hasAccess = user?.state?.isAlumnus || user?.state?.isAdmin || user?.state?.isModerator;
      if (!hasAccess) return;
      console.log("adding interest: ", user_id, event.id);
      const interest = {
        user_id: user_id,
        content_id: event.id
      };

      console.log("s interested: ",newIsInterested);
      if(newIsInterested){
        console.log("adding to interest: ", interest);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests`, interest);

        if(response.status === "CREATED"){
          console.log("successfully created event interest");
        }
      } else {
        console.log("interest: ", interest);
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/${interest.user_id}/${interest.content_id}`);
        if(response.status === "DELETED"){
          console.log("successfully deleted event interest");
        }
      }

    } catch (error){
      console.log("error at addDeleteInterest: ", error.message);
    }
  };

  const handleGoingClick = () => {
    setIsGoing((prev) => !prev);
    if (isInterested) setIsInterested(false); // Optional: disable "Interested" when "Going" is clicked
    fetchEvent();
  };

  const [isInterestedLoading, setIsInterestedLoading] = useState(false);
  const [isGoingLoading, setIsGoingLoading] = useState(false);

  const handleInterestClick = async () => {
    if (isInterestedLoading || isGoingLoading) return;


    console.log("passed..");
    try {
      setIsInterestedLoading(true);
      const newIsInterested = !isInterested;
      setIsInterested(newIsInterested);


      if (isGoing && newIsInterested) {
        setIsGoing(false);
      }

      await addDeleteInterest(newIsInterested);
      console.log("added/deleted event interest");

      await fetchEvent();
    } catch (error) {
      console.error("Failed to update interest:", error);
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
