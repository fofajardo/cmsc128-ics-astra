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



export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isInterested, setIsInterested] = useState(false);
  const [isGoing, setIsGoing] = useState(false);
  const [eventList, setEventList] = useState([]);
  // const [currentEvents, setCurrentEvents] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const [numOfInterested, setNumOfInterested] = useState(0);


  // const fetchInterest = async (id) => {
  //   try{
  //     let interests = [];
  //     const interest = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/content/${id}`);
  //     if (interest.data.status === "OK") {
  //       interests = interest.data|| [];
  //     }
  //   }catch(error){
  //     console.error("Failed fetching interests:", error);
  //   }
  // };

  const fetchEvent = async () => {
    try {
      console.log("id: ", id);
      console.log("id interest: ", id);
      const ID = id
      console.log("id fetch:", ID);
      if(isValidUUID(id)) console.log('valid');
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
        console.log('interests:', interests);
        console.log('intereststat', interestStats.interest_count);

        const interestedUsers = await Promise.all(
          interests.map(async (user) => ({
            id: user.user_id,
            name: await fetchUserName(user.user_id),
          }))
        );

        const mergedEvent = {
          id: event.event_id,
          event_id: event.event_id,
          imageSrc: content?.imageSrc || venue2,
          title: contentRes.title || "Untitled",
          description: content?.details || "No description",
          date: new Date(event.event_date).toDateString(),
          location: event.venue,
          attendeesList: interestedUsers,
          status: event.online ? "Online" : "Offline",
          avatars: [],
        };


        setEvent(mergedEvent);
        setNumOfInterested(interestStats.interest_count)
      }
    } catch (error) {
      console.error("Failed fetching event, content, or interests:", error);
      setEvent(null);
    }
  };

  const fetchUserName = async (id) => {
    try{
      const response = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/users-legacy/${id}`);

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
    <div className="bg-astradirtywhite min-h-screen px-6 sm:px-12 py-6 max-w-screen-xl mx-auto">
      <BackButton />

      <div className="flex flex-col lg:flex-row gap-6">
        <HeaderEvent event={event} onSave={handleSave} />
        <EventDetails event={event} isInterested={isInterested} handleInterestClick={handleInterestClick} isGoing={isGoing} handleGoingClick={handleGoingClick}/>
      </div>

      <AttendeesSection event={event} />
    </div>
  );
}
