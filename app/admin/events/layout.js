"use client";

import { useState } from "react";
import AdminStatCard from "@/components/AdminStatCard";
import { CalendarClock } from "lucide-react";
import { TabContext } from '@/components/TabContext';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminEventsLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [info, setInfo] = useState({
    title: "Active Events",
    search: "Search for an event",
  });

  const handleTabChange = (newTab) => {
    setCurrTab(newTab);
    setInfo((prev) => ({
      ...prev,
      title: `${newTab} Events`,
    }));
    // Reset Filters and Pagination logic can go here
  };

  const handleGoToTab = (newTab) => {
    setCurrTab(newTab);
    setInfo((prev) => ({
      ...prev,
      title: `${newTab} Events`,
    }));
    router.push('/admin/events/manage');
  };

  const dynamicTabClick = (tabName) => {
    if (pathname === '/admin/events/manage') {
      handleTabChange(tabName);
    } else {
      handleGoToTab(tabName);
    }
  };

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
              {/* Only 3 cards now */}
              <AdminStatCard
                title="Active Events"
                value={17} // you can change the number later
                icon={<CalendarClock className="size-13 text-astrawhite" strokeWidth={3} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
                title="Past Events"
                value={42}
                icon={<CalendarClock className="size-13 text-astrawhite" strokeWidth={3} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
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

      {/* Pass context values down to children */}
      <TabContext.Provider value={{ info, setInfo }}>
        {children}
      </TabContext.Provider>
    </>
  );
}
