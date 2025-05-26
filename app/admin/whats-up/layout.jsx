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
import Image from "next/image";

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
      <ActiveNavItemMarker id={NavMenuItemId.ADMIN_NEWS}/>
      <div className="relative w-full h-auto overflow-hidden">
        {/* Background Image */}
        <Image
          src="/blue-bg.png"
          alt="Background"
          fill
          className="object-cover object-center z-0"
          priority
        />

        {/* Header Content */}
        <div className="relative z-10 px-6 pt-10 md:pt-16 pb-10 text-white">
          <div className="max-w-7xl mx-auto flex flex-col gap-10">
            {/* Title and Vector Illustration */}
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Text Section */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h1 className="text-5xl font-extrabold leading-tight">
                  Communication Module
                </h1>
                <p className="mt-6 text-lg text-blue-100 max-w-md">
                  The ever-growing UPLB-ICS Alumni Network
                </p>
              </div>

              {/* Vector Illustration */}
              <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
                <div className="transition-transform duration-300 ease-in-out hover:scale-105">
                  <Image
                    src="/vectors/whats-up.svg"
                    alt="Alumni Vector"
                    width={500}
                    height={300}
                    className="w-full max-w-md h-auto animate-float hover:animate-hover-wiggle"
                  />
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <AdminStatCard
                title="Announcements"
                value={dashboard.announcements}
                icon={<Megaphone className="size-13 text-white" strokeWidth={1.5} />}
                route={false}
                onClick={() => dynamicTabClick("Announcements")}
                className="bg-blue-800/80 backdrop-blur-md border border-white/10 rounded-xl"
              />
              <AdminStatCard
                title="Newsletters"
                value={dashboard.newsletters}
                icon={<Newspaper className="size-13 text-white" strokeWidth={1.5} />}
                route={false}
                onClick={() => dynamicTabClick("Newsletters")}
                className="bg-blue-800/80 backdrop-blur-md border border-white/10 rounded-xl"
              />
            </div>
          </div>
          {currTab === "Announcements" && (
            <Link href="/admin/whats-up/create/announcement" passHref>
              <button className="mt-7 mx-auto block border-2 border-astrawhite text-astrawhite hover:bg-astrawhite hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]">
                Create an announcement
              </button>
            </Link>
          )}
          {currTab === "Newsletters" && (
            <Link href="/admin/whats-up/create/newsletter" passHref>
              <button className="mt-7 mx-auto block border-2 border-astrawhite text-astrawhite hover:bg-astrawhite hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]">
                Add a newsletter
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

      {/* Animations */}
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
