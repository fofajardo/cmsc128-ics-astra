"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";

export default function CardCarousel({ event }) {
  const isOnline = event.location?.toLowerCase() === "online";

  return (
    <div
      className="
        bg-astrawhite 
        rounded-2xl 
        overflow-hidden 
        border 
        border-astralightgray 
        shadow-sm 
        transform 
        transition-all 
        duration-500 
        ease-in-out 
        hover:scale-[1.025] 
        hover:shadow-2xl 
        hover:border-transparent 
        hover:ring-2 
        hover:ring-offset-2 
        hover:ring-astraprimary 
        hover:ring-opacity-60 
        active:scale-[0.99] 
        active:shadow-inner 
        cursor-pointer
      "
    >
      {/* Event Image */}
      <div className="w-full h-[160px]">
        <Image
          src={event.imageSrc?.src || event.imageSrc}
          alt={event.title}
          width={300}
          height={160}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Event Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-md text-astraprimary group-hover:underline transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-astradarkgray mt-1 line-clamp-2">
          {event.description}
        </p>

        {/* Metadata */}
        <div className="text-xs text-gray-600 mt-3 space-y-1">
          {/* Date */}
          <p className="flex items-center gap-1">
            <Icon icon="mdi:calendar" className="text-base" />
            {event.date}
          </p>

          {/* Location + Join Meeting */}
          <p className="flex items-center gap-1">
            <Icon icon="mdi:map-marker" className="text-base" />
            {event.location}

            {isOnline && event.meetingLink && (
              <>
                <span className="text-gray-400 px-1">|</span>
                <a
                  href={event.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-block 
                    text-xs 
                    bg-astraprimary 
                    text-astrawhite 
                    px-2 
                    py-1 
                    rounded-md 
                    font-medium 
                    hover:bg-blue-700 
                    transition-colors 
                    duration-200
                  "
                >
                  Join Meeting
                </a>
              </>
            )}
          </p>

          {/* Attendees */}
          <p className="flex items-center gap-1">
            <Icon icon="mdi:account-group" className="text-base" />
            Attendees: {event.attendees}
          </p>
        </div>
      </div>
    </div>
  );
}
