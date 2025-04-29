import {
  CalendarDays,
  MapPin,
  Users,
  Video,
} from "lucide-react";

export default function EventMetadata({
  date,
  location,
  attendees,
  meetingLink = null,
  showMeetingLink = false,
  textSize = "text-xs",
  iconSize = 16,
  textColor = "text-gray-600",
  spacing = "mt-3 space-y-1",
}) {
  const isOnline = location?.toLowerCase() === "online";

  return (
    <div className={`${textSize} ${textColor} ${spacing}`}>
      <p className="flex items-center gap-2">
        <CalendarDays size={iconSize} />
        {date}
      </p>

      <p className="flex items-center gap-2">
        <MapPin size={iconSize} />
        {location}
        {showMeetingLink && isOnline && meetingLink && (
          <>
            <span className="text-gray-400 px-1">|</span>
            <a
              href={meetingLink}
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
                  hover:bg-astradark
                  transition-colors
                  duration-200
                "
            >
              <Video size={12} className="inline mr-1" />
              Join Meeting
            </a>
          </>
        )}
      </p>

      <p className="flex items-center gap-2">
        <Users size={iconSize} />
        Attendees: {attendees}
      </p>
    </div>
  );
}
