"use client";

import EventDateLocation from "./EventDateLocation";
import EventActions from "./EventActions";
import Link from "next/link";
import { FiExternalLink} from "react-icons/fi";


export default function EventDetails({ event, isInterested, isGoing, handleInterestClick, handleGoingClick }) {

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
    <div className="w-full lg:w-[300px] bg-astrawhite rounded-xl shadow-md p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold mb-4 text-astrablack">Event Details</h2>
        <EventDateLocation date={event.date} location={event.location} />
        {formattedExternalLink && (
          <div className="flex items-center gap-2 text-astradarkgray mt-2">
            <div className="flex items-center text-astrablack text-sm leading-relaxed">
              <FiExternalLink className="mr-2 text-blue-500 w-5 h-5" />
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

      </div>

      <EventActions
        status={event.status}
        isInterested={isInterested}
        isGoing={isGoing}
        onInterestClick={handleInterestClick}
        onGoingClick={handleGoingClick}
      />
    </div>
  );
}
