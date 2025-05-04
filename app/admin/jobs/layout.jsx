"use client";
import { useState } from "react";
import AdminStatCard from "@/components/AdminStatCard";
import AdminTabs from "@/components/AdminTabs";
import { BriefcaseBusiness } from "lucide-react";
import { TabContext } from "@/components/TabContext";
import { useRouter, usePathname } from "next/navigation";

export default function AdminAlumniLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [info, setInfo] = useState({
    title: "Jobs Openings",
    search: "Search for a job post",
  });

  const tabs = {
    "All": 3,
    "Reported": 0
  };

  const [currTab, setCurrTab] = useState("All");

  const handleTabChange = (newTab) => {
    setCurrTab(newTab);

    setInfo((prev) => ({
      ...prev,
      title: `${newTab} Jobs`,
    }));

    // Reset Filters and Pagination
    // Then refetch alumList

  };

  // main tab switcher for the list page
  const handleGoToTab = (newTab) => {
    setCurrTab(newTab);
    setInfo((prev) => ({
      ...prev,
      title: `${newTab} Jobs`,
    }));
    router.push("/admin/jobs");
  };

  //if from profile page, go back and set tab
  const dynamicTabClick = (tabName) => {
    if (pathname === "/admin/alumni/manage-access"){
      handleTabChange(tabName);
    }else {
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
            <p className="font-s">Empowering opportunities and building networks to unlock potential.</p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center">
              <AdminStatCard delay={0.0} title='Active Job Posts' value = {255} icon={<BriefcaseBusiness className='size-13 text-astrawhite/>' strokeWidth={3}/>} route={false} onClick={() =>{}}/>
              <AdminStatCard delay={0.1} title='Closed Job Posts' value = {59} icon={<BriefcaseBusiness className='size-13 text-astrawhite/>' strokeWidth={3}/>} route={false} onClick={() =>{}}/>
              <AdminStatCard delay={0.2} title='Total Job Posts' value = {179} icon={<BriefcaseBusiness className='size-13 text-astrawhite/>' strokeWidth={3}/>} route={false} onClick={() =>{}}/>
              <AdminStatCard delay={0.3} title='Total Companies' value = {12} icon={<BriefcaseBusiness className='size-13 text-astrawhite/>' strokeWidth={3}/>} route={false} onClick={() =>{}}/>
            </div>
          </div>
        </div>
      </div>
      {/* pass the value of currTab and info to the children */}
      <TabContext.Provider value={{info, setInfo }}>
        <AdminTabs tabs ={tabs} currTab={currTab} handleTabChange={dynamicTabClick}/>
        {children}
      </TabContext.Provider>
    </>
  );
}