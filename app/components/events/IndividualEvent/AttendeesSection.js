"use client";
import Image from "next/image";

export default function AttendeesSection({ event }) {
  return (
    <div className="mt-10 bg-astrawhite rounded-xl shadow-md p-6">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="text-astraprimary font-semibold">
          Going <span className="text-astradarkgray">({event.attendees})</span> • Interested (2)
        </div>
        <div className="text-4xl font-bold text-astraprimary">{event.attendees}</div>
        <div className="text-sm text-astradarkgray">Attendees Count</div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {event.attendeesList.map((attendee, index) => (
          <div key={index} className="flex items-center gap-4 bg-astragray p-3 rounded-lg">
            {attendee.avatar && (
              <Image
                src={attendee.avatar}
                alt={attendee.name}
                width={48}
                height={48}
                className="rounded-full w-12 h-12 object-cover"
              />
            )}
            <div>
              <div className="font-medium text-astrablack">{attendee.name}</div>
              <div className="text-sm text-astradarkgray">
                {attendee.title} at {attendee.company}
              </div>
              <div className="text-xs text-astradarkgray">
                Class of {attendee.classYear} • Alumni
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
