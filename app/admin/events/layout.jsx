"use client";

import { useState } from "react";
import AdminStatCard from "@/components/AdminStatCard";
import { CalendarClock, CalendarRange, CalendarCheck2 } from "lucide-react";
import { TabContext } from "@/components/TabContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ActiveNavItemMarker } from "@/components/Header.jsx";
import { NavMenuItemId } from "../../../common/scopes.js";
import Image from "next/image";

export default function AdminEventsLayout({ children }) {
  const [info, setInfo] = useState({
    title: "Active Events",
    search: "Search for an event",
  });

  const [eventCounts, setEventCounts] = useState({
    active: <Skeleton className="h-7 w-12 my-2" />,
    past: <Skeleton className="h-7 w-12 my-2" />,
    total: <Skeleton className="h-7 w-12 my-2" />,
  });

  return (
    <>
      {/* Nav Marker for Active Menu */}
      <ActiveNavItemMarker id={NavMenuItemId.EVENTS} />

      {/* Header Section with Background */}
      <div className="relative w-full h-auto overflow-hidden">
        {/* Background Image */}
        <Image
          src="/blue-bg.png"
          alt="Background"
          fill
          className="object-cover object-center z-0"
          priority
        />

        {/* Overlay Content */}
        <div className="relative z-10 px-6 pt-10 md:pt-16 pb-10 text-white">
          <div className="max-w-7xl mx-auto flex flex-col gap-10">
            {/* Top Content: Text and Illustration */}
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Text Section */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h1 className="text-5xl font-extrabold leading-tight">
                  Event Management
                </h1>
                <p className="mt-6 text-lg text-blue-100 max-w-md">
                  Organize, track, and grow community engagement through impactful events.
                </p>
              </div>

              {/* Animated SVG Illustration */}
              <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
                <div className="transition-transform duration-300 ease-in-out hover:scale-105">
                  <Image
                    src="/vectors/events-vector.svg"
                    alt="Event Vector"
                    width={500}
                    height={300}
                    className="w-full max-w-md h-auto animate-float hover:animate-hover-wiggle"
                  />
                </div>
              </div>
            </div>

            {/* Stat Cards Section */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <AdminStatCard
                delay={0.0}
                title="Active Events"
                value={eventCounts.active}
                icon={<CalendarCheck2 className="size-13 text-white" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
                className="bg-blue-800/80 backdrop-blur-md border border-white/10 rounded-xl"
              />
              <AdminStatCard
                delay={0.1}
                title="Past Events"
                value={eventCounts.past}
                icon={<CalendarRange className="size-13 text-white" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
                className="bg-blue-800/80 backdrop-blur-md border border-white/10 rounded-xl"
              />
              <AdminStatCard
                delay={0.2}
                title="Total Events"
                value={eventCounts.total}
                icon={<CalendarClock className="size-13 text-white" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
                className="bg-blue-800/80 backdrop-blur-md border border-white/10 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Context Provider */}
      <TabContext.Provider value={{ info, setInfo, setEventCounts }}>
        {children}
      </TabContext.Provider>

      {/* Custom Animation Styles */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes hoverWiggle {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(2deg);
          }
          50% {
            transform: rotate(-2deg);
          }
          75% {
            transform: rotate(1deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .hover\\:animate-hover-wiggle:hover {
          animation: hoverWiggle 0.6s ease-in-out;
        }
      `}</style>
    </>
  );
}
