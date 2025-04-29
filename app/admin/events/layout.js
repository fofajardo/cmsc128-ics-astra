"use client";

import { useState } from "react";
import AdminStatCard from "@/components/AdminStatCard";
import { CalendarClock, CalendarRange, CalendarCheck2 } from "lucide-react";
import { TabContext } from "@/components/TabContext";

export default function AdminEventsLayout({ children }) {
  const [info, setInfo] = useState({
    title: "Active Events",
    search: "Search for an event",
  });

  return (
    <>
      {/* Header with background */}
      <div className="relative">
        <img
          src="/blue-bg.png"
          alt="Background"
          className="h-80 w-full object-cover"
        />
        <div className="absolute inset-2 flex flex-col items-center justify-evenly text-astrawhite z-20">
          <div className="text-center pt-6">
            <h1 className="font-h1">Event Management</h1>
            <p className="font-s">
              Organize, track, and grow community engagement through impactful events.
            </p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center">
              <AdminStatCard
                delay={0.0}
                title="Active Events"
                value={17}
                icon={<CalendarCheck2 className="size-13 text-astrawhite" strokeWidth={3} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
                delay={0.1}
                title="Past Events"
                value={42}
                icon={<CalendarRange className="size-13 text-astrawhite" strokeWidth={3} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
                delay={0.2}
                title="Total Events"
                value={59}
                icon={<CalendarClock className="size-13 text-astrawhite" strokeWidth={3} />}
                route={false}
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>

      <TabContext.Provider value={{ info, setInfo }}>
        {children}
      </TabContext.Provider>
    </>
  );
}
