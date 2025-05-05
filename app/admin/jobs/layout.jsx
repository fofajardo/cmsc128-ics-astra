"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminStatCard from "@/components/AdminStatCard";
import AdminTabs from "@/components/AdminTabs";
import { BriefcaseBusiness } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TabContext } from "@/components/TabContext";

export default function AdminJobsLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [info, setInfo] = useState({
    title: "Job Openings",
    search: "Search for a job post",
  });

  const [jobCounts, setJobCounts] = useState({
    active: <Skeleton className="h-7 w-12 my-2" />,
    closed: <Skeleton className="h-7 w-12 my-2" />,
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
      {/* Header with background */}
      <div className="relative">
        <img
          src="/blue-bg.png"
          alt="Background"
          className="h-80 w-full object-cover"
        />
        <div className="absolute inset-2 flex flex-col items-center justify-evenly text-astrawhite z-20">
          <div className="text-center pt-6">
            <h1 className="font-h1">Job Posting</h1>
            <p className="font-s">
              Empowering opportunities and building networks to unlock potential.
            </p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center">
              <AdminStatCard
                delay={0.0}
                title="Active Job Posts"
                value={jobCounts.active}
                icon={<BriefcaseBusiness className="size-13 text-astrawhite" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
                delay={0.1}
                title="Closed Job Posts"
                value={jobCounts.closed}
                icon={<BriefcaseBusiness className="size-13 text-astrawhite" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
                delay={0.2}
                title="Total Job Posts"
                value={jobCounts.total}
                icon={<BriefcaseBusiness className="size-13 text-astrawhite" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
                delay={0.3}
                title="Total Companies"
                value={jobCounts.companies}
                icon={<BriefcaseBusiness className="size-13 text-astrawhite" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
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
    </>
  );
}
