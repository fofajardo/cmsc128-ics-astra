"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useState,useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import EventCard from "@/components/events/GroupedEvents/EventCard/EventCard";
import FilterDropdown from "@/components/events/GroupedEvents/FilterDropdown";
import DateFilter from "@/components/events/GroupedEvents/DateFilter";
import Pagination from "@/components/events/GroupedEvents/Pagination";
import EventCarousel from "@/components/events/GroupedEvents/CardCarousel/EventCarousel";
import ExploreUPLBSection from "@/components/events/GroupedEvents/ExploreUPLBSection";
import UPLBImageCollage from "@/components/events/GroupedEvents/UPLBImageCollage";

import events from "../../data/events";
import eventsVector from "../../assets/events-vector.png";
import venue2 from "../../assets/venue2.jpeg";

export default function EventsPage() {
  const itemsPerPage = 4;
  const [contentList, setContents] = useState([]);
  const [eventCounts, setEventCounts] = useState({
    active: 0,
    past: 0,
    total: 0
  });




  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: 10,
    numToShow: 10,
    total: 0,
  });

  const [eventList, setEventList] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, contentsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events`, {
            params: { page: 1, limit: 100 },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents`, {
            params: { page: 1, limit: 100 },
          }),
        ]);

        if (eventsRes.data.status === "OK" && contentsRes.data.status === "OK") {
          const contentMap = new Map();
          contentsRes.data.list.forEach(content => {
            contentMap.set(content.id, content);
          });

          const mergedEvents = eventsRes.data.list.map(event => {
            const matchedContent = contentMap.get(event.event_id) || {};
            return {
              id: event.event_id,
              event_id: event.event_id,
              imageSrc: matchedContent.imageSrc || venue2,
              title: matchedContent.title || "Untitled",
              description: matchedContent.details || "No description",
              date: new Date(event.event_date).toDateString(),
              location: event.venue,
              attendees: event.going ?? [],
              status: event.online ? "Online" : "Offline",
              avatars: [],
            };
          });

          setEventList(mergedEvents);
          setTotalPages(Math.ceil(mergedEvents.length / itemsPerPage));
        }
      } catch (error) {
        console.error("Failed fetching events or contents:", error);
        setEventList([]);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentEvents(eventList.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ));
  }, [currentPage, eventList]);

  return (
    <div className="w-full bg-astradirtywhite">
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
            <p className="text-lg font-medium">
              Discover, manage, and dive into campus events in a whole new way!
            </p>
            <button className="mt-4 px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
              Explore Now
            </button>
          </div>
          <div className="w-full lg:w-[550px] flex justify-center">
            <div className="relative w-full h-auto max-w-[550px] animate-natural-float">
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

      {/* Filters Section */}
      <div className="relative z-20 bg-astradirtywhite w-full py-14 -mt-10 border-t border-astradarkgray">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-8 px-4">
          <div className="w-full max-w-[1000px]">
            <div className="flex items-stretch w-full border border-astragray bg-astrawhite">
              <input
                type="text"
                placeholder="Search for event"
                className="flex-grow py-4 pl-6 focus:outline-none text-base text-astradark"
              />
              <button className="px-6 bg-astraprimary hover:bg-astradark text-astrawhite font-semibold transition flex items-center gap-2 cursor-pointer">
                Search
              </button>
            </div>
          </div>

          <div className="w-full max-w-[1000px] flex flex-wrap justify-center gap-4 text-sm font-medium z-20">
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

      {/* All Events */}
      <div className="max-w-[1440px] mx-auto px-12 mt-20 relative z-10">
        <h1 className="text-[28px] font-extrabold text-astradarkgray mb-10">
          All Events
        </h1>
        <div className="space-y-10 transition-all duration-700 ease-in-out">
          {currentEvents.map((event, index) => (
            <EventCard
              key={index}
              id={event.event_id}
              imageSrc={event.imageSrc}
              title={event.title}
              description={event.description}
              date={event.date}
              location={event.location}
              attendees={event.attendees}
              status={event.status}
              avatars={event.avatars}
            />
          ))}

        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Carousel */}
      <div className="max-w-[1440px] mx-auto px-12 mt-24 pb-20 bg-astradirtywhite">
        <EventCarousel events={events} />
      </div>

      {/* Explore UPLB Section */}
      <ExploreUPLBSection />

      {/* UPLB Image Collage */}
      <UPLBImageCollage />

      {/* Animations */}
      <style jsx global>{`
        @keyframes naturalFloat {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(8px, -10px) rotate(1deg); }
          50% { transform: translate(0px, -20px) rotate(0deg); }
          75% { transform: translate(-8px, -10px) rotate(-1deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        @keyframes fadeBounce {
          0% { opacity: 0; transform: translateY(-10px); }
          50% { opacity: 1; transform: translateY(5px); }
          100% { transform: translateY(0px); }
        }
        @keyframes particles {
          0% { background-position: 0 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-natural-float { animation: naturalFloat 8s ease-in-out infinite; }
        .animate-fade-bounce { animation: fadeBounce 1.5s ease forwards; }
        .animate-hero-text { animation: fadeBounce 2s ease-in-out; }
        .animate-particles {
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: particles 60s linear infinite;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
