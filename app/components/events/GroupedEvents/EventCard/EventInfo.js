import Link from "next/link";
import StatusLabel from "./StatusLabel";
import AvatarGroup from "./AvatarGroup";
import EventMetadata from "../EventMetaData";

export default function EventInfo({
    id,
    title,
    description,
    date,
    location,
    attendees,
    status,
    avatars,
  }) {
    return (
      <>
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-astrablack group-hover:text-astraprimary transition-colors duration-300">
              {title}
            </h2>
            <StatusLabel status={status} />
          </div>
  
          <p className="text-sm text-astradarkgray mt-2 max-w-[90%] group-hover:text-astrablack transition-colors duration-300">
            {description}
          </p>
  
          <EventMetadata
            date={date}
            location={location}
            attendees={attendees}
            textSize="text-sm"
            iconSize={18}
            textColor="text-astrablack"
            spacing="mt-4 space-y-2"
          />
  
          <AvatarGroup avatars={avatars} />
        </div>
  
        <div className="flex justify-end items-center mt-6">
          <Link href={`/events/${id}`}>
            <button className="bg-astraprimary text-astrawhite px-6 py-2 rounded-full font-semibold hover:bg-astradark transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg cursor-pointer">
              View Details
            </button>
          </Link>
        </div>
      </>
    );
  }
  