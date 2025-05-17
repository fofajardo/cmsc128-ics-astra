"use client";
import { useState } from "react";
import Link from "next/link";
import AdminStatCard from "@/components/AdminStatCard";
import AdminTabs from "@/components/AdminTabs";
import {Megaphone, Newspaper, CalendarDays, FilePlus2,  } from "lucide-react";
import { TabContext } from "../../components/TabContext";
import { useRouter, usePathname } from "next/navigation";
import {NavMenuItemId} from "../../../common/scopes.js";
import {ActiveNavItemMarker} from "@/components/Header.jsx";

export default function AdminAlumniLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [info, setInfo] = useState({
    title: "Announcements",
    search: "Search for announcements",
  });
  const [dashboard, setDashboard] = useState({
    announcements: 0,
    newsletters: 0,
    events: 0,
  });

  const tabs = {
    "Announcements": 0,
    "Newsletters": 0,
  };

  const [currTab, setCurrTab] = useState("Announcements");

  const handleTabChange = (newTab) => {
    setCurrTab(newTab);

    setInfo((prev) => ({
      ...prev,
      title: `${newTab} Accounts`,
    }));

    // Reset Filters and Pagination
    // Then refetch alumList

  };

  // main tab switcher for the list page
  const handleGoToTab = (newTab) => {
    setCurrTab(newTab);
    setInfo((prev) => ({
      ...prev,
      title: `${newTab}`,
      search: `Search for ${newTab.toLowerCase()}`
    }));
    router.push("/admin/whats-up");
  };

  //if from profile page, go back and set tab
  const dynamicTabClick = (tabName) => {
    if (pathname === "/admin/whats-up"){
      handleTabChange(tabName);
    }else {
      handleGoToTab(tabName);
    }
  };

  return (
    <>
      {/* Header with background */}
      <ActiveNavItemMarker id={NavMenuItemId.NEWS}/>
      <div className="relative">
        <img
          src="/blue-bg.png"
          alt="Background"
          className="h-80 w-full object-cover"
        />
        <div className="absolute inset-2 flex flex-col items-center justify-evenly text-astrawhite z-20">
          <div className="text-center pt-6">
            <h1 className="font-h1">Communication Module</h1>
            <p className="font-s">The ever-growing UPLB-ICS Alumni Network</p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center">
              <AdminStatCard title='Announcements' value = {dashboard.announcements} icon={<Megaphone className='size-13 text-astrawhite/>' strokeWidth={1.5} />} route = {false} onClick={() => dynamicTabClick("Announcements")}/>
              <AdminStatCard title='Newsletters' value = {dashboard.newsletters} icon={<Newspaper className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={false} onClick={() => dynamicTabClick("Newsletters")}/>
              <AdminStatCard title='Active Events' value = {dashboard.events} icon={<CalendarDays className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={"/admin/events"}/>
            </div>
          </div>
          {currTab === "Announcements" && (
          <Link href="/admin/whats-up/create/announcement" passHref>
            <button className="mt-2 border-2 border-astrawhite text-astrawhite hover:bg-astrawhite hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]">
              Create an announcement
            </button>
          </Link>
          )}
          {currTab === "Newsletters" && (
            <Link href="/admin/whats-up/newsletters/create" passHref>
              <button className="mt-2 border-2 border-astrawhite text-astrawhite hover:bg-astrawhite hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]">
                Create a newsletter
              </button>
            </Link>
          )}
        </div>
      </div>
      {/* pass the value of currTab and info to the children */}
      <TabContext.Provider value={{ currTab, setCurrTab, info, setInfo, setDashboard }}>
        <AdminTabs tabs ={tabs} currTab={currTab} handleTabChange={dynamicTabClick}/>
        {children}
      </TabContext.Provider>
    </>
  );
}
