import { CalendarDays, MapPin, Users } from "lucide-react";

export default function MetadataRow({ date, location, attendees }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 mt-4 text-sm text-astrablack">
      <div className="flex items-center gap-2">
        <CalendarDays size={18} className="text-astraprimary" />
        <span>{date}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={18} className="text-astraprimary" />
        <span>{location}</span>
      </div>
      <div className="flex items-center gap-2 col-span-full">
        <Users size={18} className="text-astraprimary" />
        <span>Attendees: {attendees}</span>
      </div>
    </div>
  );
}
