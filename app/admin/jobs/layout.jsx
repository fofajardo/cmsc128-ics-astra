"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminStatCard from "@/components/AdminStatCard";
import AdminTabs from "@/components/AdminTabs";
import { BriefcaseBusiness } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TabContext } from "@/components/TabContext";
import {NavMenuItemId} from "../../../common/scopes.js";
import {ActiveNavItemMarker} from "@/components/Header.jsx";
import Image from "next/image";

export default function AdminJobsLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [info, setInfo] = useState({
    title: "Job Openings",
    search: "Search for a job post",
  });

  const [jobCounts, setJobCounts] = useState({
    active: <Skeleton className="h-7 w-12 my-2" />,
    expired: <Skeleton className="h-7 w-12 my-2" />,
    total: <Skeleton className="h-7 w-12 my-2" />,
    companies: <Skeleton className="h-7 w-12 my-2" />,
  });

  const tabs = {
    All: 3,
    Reported: 0,
  };

  const [currTab, setCurrTab] = useState("All");

  const handleTabChange = (newTab) => {
    setCurrTab(newTab);
    setInfo((prev) => ({
      ...prev,
      title: `${newTab} Jobs`,
    }));
    // Reset filters/pagination and refetch if needed
  };

  const handleGoToTab = (newTab) => {
    setCurrTab(newTab);
    setInfo((prev) => ({
      ...prev,
      title: `${newTab} Jobs`,
    }));
    router.push("/admin/jobs");
  };

  const dynamicTabClick = (tabName) => {
    if (pathname === "/admin/alumni/manage-access") {
      handleTabChange(tabName);
    } else {
      handleGoToTab(tabName);
    }
  };

return (
    <>
      <ActiveNavItemMarker id={NavMenuItemId.JOBS} />

      {/* Background Section */}
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
                  Job Posting
                </h1>
                <p className="mt-6 text-lg text-blue-100 max-w-md">
                  Empowering opportunities and building networks to unlock potential.
                </p>
              </div>

              {/* Animated SVG Illustration */}
              <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
                <div className="transition-transform duration-300 ease-in-out hover:scale-105">
                  <Image
                    src="/vectors/jobs-vector.svg"
                    alt="Job Vector"
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
                title="Active Job Posts"
                value={jobCounts.active}
                icon={<BriefcaseBusiness className="size-13 text-white" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
                className="bg-blue-800/80 backdrop-blur-md border border-white/10 rounded-xl"
              />
              <AdminStatCard
                delay={0.1}
                title="Closed Job Posts"
                value={jobCounts.expired}
                icon={<BriefcaseBusiness className="size-13 text-white" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
                className="bg-blue-800/80 backdrop-blur-md border border-white/10 rounded-xl"
              />
              <AdminStatCard
                delay={0.2}
                title="Total Job Posts"
                value={jobCounts.total}
                icon={<BriefcaseBusiness className="size-13 text-white" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
                className="bg-blue-800/80 backdrop-blur-md border border-white/10 rounded-xl"
              />
              <AdminStatCard
                delay={0.3}
                title="Total Companies"
                value={jobCounts.companies}
                icon={<BriefcaseBusiness className="size-13 text-white" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
                className="bg-blue-800/80 backdrop-blur-md border border-white/10 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + children context */}
      <TabContext.Provider value={{ info, setInfo, setJobCounts }}>
        <AdminTabs tabs={tabs} currTab={currTab} handleTabChange={dynamicTabClick} />
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
