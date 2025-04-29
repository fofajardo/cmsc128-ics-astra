"use client";

import { Clock, MapPin } from "lucide-react";

export default function EventDateLocation({ date, location }) {
  return (
    <>
      <div className="flex items-center gap-2 text-astradarkgray mb-2">
        <Clock className="text-astraprimary w-5 h-5" />
        <span>{date}</span>
      </div>
      <div className="flex items-center gap-2 text-astradarkgray">
        <MapPin className="text-astrared w-5 h-5" />
        <span>{location}</span>
      </div>
    </>
  );
}
