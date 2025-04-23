'use client';
import { useParams } from "next/navigation";
import events from "../../../data/events";
import { useState } from "react";
import AttendeesSection from "@/components/events/IndividualEvent/AttendeesSection";
import EventDetails from "@/components/events/IndividualEvent/EventDetails";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import HeaderEvent from "@/components/events/IndividualEvent/HeaderEvent";



export default function EventDetailPage() {
  const { id } = useParams();
  const originalEvent = events.find((e) => e.id === id);
  const [event, setEvent] = useState(originalEvent);
  const [isInterested, setIsInterested] = useState(false); 
  const [isGoing, setIsGoing] = useState(false);


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
    <div className="bg-astradirtywhite min-h-screen pt-[100px] px-6 sm:px-12 py-6 max-w-screen-xl mx-auto">
      <BackButton />

      <div className="flex flex-col lg:flex-row gap-6">
        <HeaderEvent event={event} onSave={handleSave} />
        <EventDetails event={event} isInterested={isInterested} handleInterestClick={handleInterestClick} isGoing={isGoing} handleGoingClick={handleGoingClick}/>
      </div>

      <AttendeesSection event={event} />
    </div>
  );
}
