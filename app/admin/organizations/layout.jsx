"use client";
import { useState } from "react";
import AdminStatCard from "@/components/AdminStatCard";
import { BriefcaseBusiness, School } from "lucide-react";
import { TabContext } from "@/components/TabContext";
import { useRouter, usePathname } from "next/navigation";
import { School2 } from "lucide-react";
import { Building } from "lucide-react";

export default function AdminAlumniLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [info, setInfo] = useState({
    title: "Organizations",
    search: "Search for an organization",
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
            <h1 className="font-h1">Organizations</h1>
            <p className="font-s">Empowering connections, camaraderie, and inspiring growth.</p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center">
              <AdminStatCard delay={0.0} title='Total Orgs' value = {255} icon={<School className='size-13 text-astrawhite/>' strokeWidth={2}/>} route={false} onClick={() =>{}}/>
              <AdminStatCard delay={0.1} title='University Orgs' value = {59} icon={<School2 className='size-13 text-astrawhite/>' strokeWidth={2}/>} route={false} onClick={() =>{}}/>
              <AdminStatCard delay={0.2} title='Outside Orgs' value = {59} icon={<Building className='size-13 text-astrawhite/>' strokeWidth={2}/>} route={false} onClick={() =>{}}/>
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