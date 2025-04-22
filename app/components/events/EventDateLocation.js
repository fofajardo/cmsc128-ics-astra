'use client';
import { Icon } from "@iconify/react";

export default function EventDateLocation({ date, location }) {
  return (
    <>
      <div className="flex items-center gap-2 text-astradarkgray mb-2">
        <Icon icon="mdi:clock-outline" className="text-astraprimary text-xl" />
        <span>{date}</span>
      </div>
      <div className="flex items-center gap-2 text-astradarkgray">
        <Icon icon="mdi:map-marker-outline" className="text-red-500 text-xl" />
        <span>{location}</span>
      </div>
    </>
  );
}
