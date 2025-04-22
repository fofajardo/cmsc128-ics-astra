'use client';
import EventDateLocation from "./EventDateLocation";
import EventActions from "./EventActions";

export default function EventDetails({ event, isInterested, handleInterestClick }) {
  return (
    <div className="w-full lg:w-[300px] bg-astrawhite rounded-xl shadow-md p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold mb-4 text-astrablack">Event Details</h2>
        <EventDateLocation date={event.date} location={event.location} />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <EventActions
          status={event.status}
          isInterested={isInterested}
          handleInterestClick={handleInterestClick}
        />
      </div>
    </div>
  );
}
