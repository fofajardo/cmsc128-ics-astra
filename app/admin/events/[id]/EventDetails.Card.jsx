"use client";

import { CalendarDays, MapPin } from "lucide-react";

export default function EventDetailsCard({ event, onEdit, onDelete }) {
  return (
    <div className="bg-astrawhite p-6 rounded-2xl shadow-md flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Event Details</h2>
      <div className="flex items-center text-sm text-astradarkgray mb-2">
        <CalendarDays className="w-5 h-5 mr-2 text-astradarkgray" />
        {event.date} | {event.time}
      </div>
      <div className="flex items-center text-sm text-astradarkgray mb-6">
        <MapPin className="w-5 h-5 mr-2 text-astradarkgray" />
        {event.location}
      </div>
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
