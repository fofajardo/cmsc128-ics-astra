"use client";

import Image from "next/image";
import EventMetadata from "../EventMetaData";

export default function CardCarousel({ event }) {
  return (
    <div
      className="
        bg-astrawhite
        rounded-2xl
        overflow-hidden
        border
        border-astralightgray
        shadow-md
        transform
        transition-all
        duration-500
        ease-in-out
        hover:scale-[1.03]
        hover:shadow-xl
        hover:border-transparent
        hover:ring-2
        hover:ring-offset-2
        hover:ring-astraprimary
        hover:ring-opacity-70
        active:scale-[0.98]
        active:shadow-inner
        cursor-pointer
      "
    >
      {/* Event Image */}
      <div className="w-full h-[180px]">
        <img
          src={event.imageSrc?.src || event.imageSrc}
          alt={event.title}
          width={300}
          height={180}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Event Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-lg text-astraprimary group-hover:underline transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-[15px] text-astradarkgray mt-2 line-clamp-2">
          {event.description}
        </p>

        {/* Metadata with enhanced styling */}
        <EventMetadata
          date={event.date}
          location={event.location}
          attendees={event.attendees}
          meetingLink={event.meetingLink}
          showMeetingLink={true}
          textSize="text-sm"
          iconSize={16}
          textColor="text-astrablack"
          spacing="mt-4 space-y-2"
        />
      </div>
    </div>
  );
}
