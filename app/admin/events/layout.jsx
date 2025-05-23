"use client";

import { useState } from "react";
import AdminStatCard from "@/components/AdminStatCard";
import { CalendarClock, CalendarRange, CalendarCheck2 } from "lucide-react";
import { TabContext } from "@/components/TabContext";
import { Skeleton } from "@/components/ui/skeleton";
import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId} from "../../../common/scopes.js";

export default function AdminEventsLayout({ children }) {
  const [info, setInfo] = useState({
    title: "Active Events",
    search: "Search for an event",
  });

  const [eventCounts, setEventCounts] = useState({
    active: <Skeleton className="h-7 w-12 my-2" />,
    past: <Skeleton className="h-7 w-12 my-2" />,
    total: <Skeleton className="h-7 w-12 my-2" />
  });


  // const handleTabChange = (newTab) => {
  //   setCurrTab(newTab);
  //   setInfo((prev) => ({
  //     ...prev,
  //     title: `${newTab} Events`,
  //   }));
  //   // Reset Filters and Pagination logic can go here
  // };

  return (
    <>
      {/* Header with background */}
      <ActiveNavItemMarker id={NavMenuItemId.ADMIN_EVENTS}/>
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
                value={eventCounts.active}
                icon={<CalendarCheck2 className="size-13 text-astrawhite" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
                delay={0.1}
                title="Past Events"
                value={eventCounts.past}
                icon={<CalendarRange className="size-13 text-astrawhite" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
                delay={0.2}
                title="Total Events"
                value={eventCounts.total}
                icon={<CalendarClock className="size-13 text-astrawhite" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Pass context values down to children */}
      <TabContext.Provider value={{ info, setInfo,setEventCounts }}>
        {children}
      </TabContext.Provider>
    </>
  );
}
