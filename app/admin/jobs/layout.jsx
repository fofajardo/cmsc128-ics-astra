"use client";
import { useState } from "react";
import AdminStatCard from "@/components/AdminStatCard";
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
        {children}
      </TabContext.Provider>
    </>
  );
}