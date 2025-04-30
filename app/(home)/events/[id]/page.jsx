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
  const [currentEvents, setCurrentEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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
  useEffect(() => {
    async function fetchEvent() {
      try {
        console.log("id: ", id);
        const [eventRes, contentRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${id}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`)
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
        if (eventRes.data.status === "OK" && contentRes.data.status === "OK" ) {
          const event = eventRes.data;
          const content = contentRes.data;
          //const interests = interestRes.data.data || [];

          console.log("event: ", event);
          console.log("content: ", content);
          //  console.log('interests:', interests);

          const mergedEvent = {
            id: event.event_id,
            event_id: event.event_id,
            imageSrc: content?.imageSrc || venue2,
            title: contentRes.title || "Untitled",
            description: content?.details || "No description",
            date: new Date(event.event_date).toDateString(),
            location: event.venue,
            //attendees: interests, //
            status: event.online ? "Online" : "Offline",
            avatars: [],
          };

          setEvent(mergedEvent);
        }
      } catch (error) {
        console.error("Failed fetching event, content, or interests:", error);
        setEvent(null);
      }
    }

    fetchEvent();
    fetchInterest(id);
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

      {/*<AttendeesSection event={event} />*/}
    </div>
  );
}
