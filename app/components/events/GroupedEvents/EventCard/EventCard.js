"use client";
import Link from "next/link";
import EventImage from "./EventImage";
import EventInfo from "./EventInfo";


export default function EventCard({
  id,
  imageSrc,
  title,
  description,
  date,
  location,
  attendees,
  status,
  avatars,
}) {
  return (
    <div className="group relative bg-astrawhite shadow-md hover:shadow-xl transition duration-300 rounded-2xl overflow-hidden max-w-[1200px] mx-auto mb-10 border border-astragray hover:border-astraprimary">
      <div className="flex flex-col lg:flex-row">
        <EventImage src={imageSrc} title={title} />

        <div className="flex-1 p-6 flex flex-col justify-between bg-astrawhite relative z-10">
          <EventInfo
            id={id}
            title={title}
            description={description}
            date={date}
            location={location}
            attendees={attendees}
            status={status}
            avatars={avatars}
          />
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-astraprimary opacity-10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
