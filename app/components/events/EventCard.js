"use client";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function EventCard({
  id,
  imageSrc,
  title,
  description,
  date,
  location,
  attendees,
  status,
  avatars,
}) {
  return (
    <div className="group bg-astrawhite shadow-md hover:shadow-lg transition-shadow duration-300 rounded-[20px] overflow-hidden w-full max-w-[1200px] mx-auto mb-8 min-h-[220px] border border-astragray">
      <div className="flex">
        <div className="relative w-[300px] min-h-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-l-[20px] transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-astrablack group-hover:text-astraprimary transition-colors duration-300">
                {title}
              </h2>
              <span
                className={`px-3 py-1 rounded-md text-sm font-semibold ${
                  status === "Open"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-500 text-astrawhite"
                }`}
              >
                {status}
              </span>
            </div>

            <p className="text-sm text-astradarkgray mt-2 max-w-[80%] group-hover:text-astrablack transition-colors duration-300">
              {description}
            </p>

            <div className="mt-4 space-y-2 text-sm text-astrablack">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:calendar-month" className="text-astraprimary text-lg" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:map-marker" className="text-astraprimary text-lg" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:account-group" className="text-astraprimary text-lg" />
                <span>Attendees: {attendees}</span>
              </div>
            </div>

            <div className="flex items-center mt-4 space-x-[-10px]">
              {avatars.map((avatar, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-astrawhite z-10 hover:z-20 transition-all duration-200 hover:scale-110"
                >
                  <Image
                    src={avatar}
                    alt={`avatar-${idx}`}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end items-center mt-6">
            <Link href={`/events/${id}`}>
              <button className="bg-astraprimary text-astrawhite text-sm px-6 py-2 rounded-md font-bold hover:bg-astradark transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md cursor-pointer">
                VIEW ALL
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
