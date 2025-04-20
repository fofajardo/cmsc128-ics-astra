"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import EventCard from "../../components/EventCard";
import FilterDropdown from "../../components/FilterDropdown";
import DateFilter from "../../components/DateFilter";
import { useState } from "react";
import Pagination from "../../components/Pagination";
import events from "../../data/events";

import eventsVector from "../../assets/events-vector.png"

export default function EventsPage() {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const currentEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full bg-white">
      <div className="h-[100px]" />

      {/* Hero Section */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/blue-bg.png')" }}
      >
        <div className="max-w-[1440px] mx-auto px-12 py-20 flex flex-col lg:flex-row items-center justify-between text-astrawhite gap-10">
          <div className="max-w-[600px] space-y-6 text-center lg:text-left animate-hero-text">
            <h1 className="text-[60px] font-extrabold leading-[1.1]">
              User Event <br /> & Management
            </h1>
            <p className="text-lg font-medium text-astrawhite">
              Discover, manage, and dive into campus events in a whole new way!
            </p>
            <div className="mt-4">
              <button className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                Explore Now
              </button>
            </div>
          </div>
          <div className="w-full lg:w-[550px] flex justify-center">
            <div className="relative w-full h-auto max-w-[550px] animate-float">
              <Image
                src={eventsVector}
                alt="Events Illustration"
                className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative z-10 bg-astrawhite w-full py-14 -mt-10 border-t border-astradarkgray">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-8 px-4">
          <div className="w-full max-w-[1000px]">
            <div className="flex items-stretch w-full border border-astragray bg-astrawhite">
              <input
                type="text"
                placeholder="Search for event"
                className="flex-grow py-4 pl-6 focus:outline-none text-base text-astradark"
              />
              <button className="px-6 bg-astraprimary hover:bg-astradark text-astrawhite font-semibold transition flex items-center gap-2 cursor-pointer">
                <Icon icon="tabler:search" className="text-lg" />
                Search
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="w-full max-w-[1000px] flex flex-wrap justify-center gap-4 text-sm font-medium">
            <FilterDropdown
              icon="material-symbols:location-on"
              options={[
                { label: "Online", icon: "mdi:wifi" },
                { label: "In-person", icon: "mdi:account-group" },
              ]}
              placeholder="Location"
            />
            <FilterDropdown
              icon="fluent:status-20-filled"
              options={[
                { label: "Upcoming", icon: "mdi:clock-outline" },
                { label: "Ongoing", icon: "mdi:progress-clock" },
                { label: "Completed", icon: "mdi:check-circle-outline" },
              ]}
              placeholder="Status"
            />
            <DateFilter placeholder="Start Date" />
            <DateFilter placeholder="End Date" />
            <FilterDropdown
              icon="material-symbols:sort"
              options={[
                { label: "Most Recent", icon: "mdi:sort-calendar-descending" },
                { label: "Oldest", icon: "mdi:sort-calendar-ascending" },
                { label: "Popular", icon: "mdi:star-outline" },
              ]}
              placeholder="Sort"
            />
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="max-w-[1440px] mx-auto px-12 mt-20">
        <h1 className="text-[28px] font-extrabold text-astradarkgray mb-10">All Events</h1>
        <div className="space-y-10 transition-all duration-700 ease-in-out">
          {currentEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0px);
            filter: none;
          }
          50% {
            transform: translateY(-15px);
            filter: drop-shadow(0 0 10px white) drop-shadow(0 0 20px white);
          }
          100% {
            transform: translateY(0px);
            filter: none;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: floatUp 4s ease-in-out infinite;
        }

        .animate-hero-text {
          animation: fadeUp 1.5s ease forwards;
        }
      `}</style>
    </div>
  );
}
