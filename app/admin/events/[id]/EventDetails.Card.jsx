"use client";

import { CalendarDays, MapPin } from "lucide-react";
import { FiExternalLink,FiLink } from "react-icons/fi";
import Link from "next/link";

export default function EventDetailsCard({ event, onEdit, onDelete }) {
  const formatUrl = (url) => {
    if (!url) return null;
    try {

      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
      new URL(url); // Validate URL
      return url;
    } catch {
      return null;
    }
  };
  const formattedExternalLink = formatUrl(event.external_link);

  return (
    <div className="bg-astrawhite p-6 rounded-2xl shadow-md flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Event Details</h2>
      <div className="flex items-center text-sm text-astradarkgray mb-2">
        <CalendarDays className="w-5 h-5 mr-2 text-astradarkgray" />
        {event.date} | {event.time}
      </div>
      <div className="flex items-center text-sm text-astradarkgray mb-2">
        <MapPin className="w-5 h-5 mr-2 text-astradarkgray" />
        {event.location}
      </div>
      {formattedExternalLink && (
        <div className="flex items-center gap-2 text-astradarkgray mb-2">
          <div className="flex items-center text-astrablack text-sm leading-relaxed">
            <FiExternalLink className="mr-2 text-astradarkgray w-5 h-5" />
            {/* <span className="text-astradarkgray">Event Link: </span> */}
            <Link
              href={formattedExternalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 hover:text-blue-800 break-all"
            >
              {formattedExternalLink.replace(/^https?:\/\//, "")}
            </Link>
          </div>
        </div>
      )}
      <button
        onClick={onEdit}
        className="w-full bg-astraprimary hover:bg-astradark text-astrawhite font-semibold py-2 rounded-lg mb-2 transition-all"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="w-full bg-astrared hover:bg-[#e63228] text-astrawhite font-semibold py-2 rounded-lg transition-all"
      >
        Delete
      </button>
    </div>
  );
}
