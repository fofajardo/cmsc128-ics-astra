"use client"
import { useState } from "react";
import AdminStatCard from "@/components/AdminStatCard";
import AdminTabs from "@/components/AdminTabs";
import {Megaphone, Newspaper, CalendarDays, FilePlus2,  } from "lucide-react";
import { TabContext } from '../../components/TabContext';
import { useRouter, usePathname } from 'next/navigation'

export default function AdminAlumniLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [info, setInfo] = useState({
      title: "Announcements",
      search: "Search for announcements",
  });
  
  const tabs = {
      'Announcements': 3,
      'Newsletters': 0,
      'Requests': 2,
  };
  
  const [currTab, setCurrTab] = useState('Announcements');

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
    router.push('/admin/communications');
  };

  //if from profile page, go back and set tab
  const dynamicTabClick = (tabName) => {
    if (pathname === '/admin/comunications'){
      handleTabChange(tabName);
    }else {
      handleGoToTab(tabName);
    }
  }

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
              <h1 className="font-h1">Communication Module</h1>
              <p className="font-s">The ever-growing UPLB-ICS Alumni Network</p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center"> 
                  <AdminStatCard delay={0.0} title='Announcements' value = {255} icon={<Megaphone className='size-13 text-astrawhite/>' strokeWidth={1.5} />} route = {false} onClick={() => dynamicTabClick('Announcements')}/>
                  <AdminStatCard delay={0.1} title='Newsletters' value = {59} icon={<Newspaper className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={false} onClick={() => dynamicTabClick('Newsletters')}/>
                  <AdminStatCard delay={0.2} title='Active Requests' value = {15} icon={<FilePlus2 className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={false} onClick={() => dynamicTabClick('Requests')}/>
                  <AdminStatCard delay={0.3} title='Active Events' value = {179} icon={<CalendarDays className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={'/admin/events'}/>
            </div>
          </div>
        </div>
      </div>
      {/* pass the value of currTab and info to the children */}
      <TabContext.Provider value={{ currTab, setCurrTab, info, setInfo }}>
      <AdminTabs tabs ={tabs} currTab={currTab} handleTabChange={dynamicTabClick}/>
      {children}
      </TabContext.Provider>
    </>
  );
}