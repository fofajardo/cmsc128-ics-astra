"use client"
import { useState } from "react";
import AdminStatCard from "@/components/AdminStatCard";
import AdminTabs from "@/components/AdminTabs";
import {GraduationCap, UserRoundPlus, UserRoundCheck, UserRoundX } from "lucide-react";
import { TabContext } from '../../../components/TabContext';
import { useRouter, usePathname } from 'next/navigation'

export default function AdminAlumniLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [info, setInfo] = useState({
      title: "Pending Accounts",
      search: "Search for an alumni",
  });
  
  const tabs = {
      'Pending': 3,
      'Approved': 0,
      'Inactive': 2,
  };
  
  const [currTab, setCurrTab] = useState('Pending');

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
      title: `${newTab} Accounts`,
    }));
    router.push('/admin/alumni/manage-access');
  };

  //if from profile page, go back and set tab
  const dynamicTabClick = (tabName) => {
    if (pathname === '/admin/alumni/manage-access'){
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
              <h1 className="font-h1">Manage Access</h1>
              <p className="font-s">The ever-growing UPLB-ICS Alumni Network</p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center"> 
                  <AdminStatCard title='Registered' value = {255} icon={<GraduationCap className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={'/admin/alumni/search'}/>
                  <AdminStatCard title='Pending' value = {59} icon={<UserRoundPlus className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={false} onClick={() => dynamicTabClick('Pending')}/>
                  <AdminStatCard title='Approved' value = {179} icon={<UserRoundCheck className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={false} onClick={() => dynamicTabClick('Approved')}/>
                  <AdminStatCard title='Inactive' value = {12} icon={<UserRoundX className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={false} onClick={() => dynamicTabClick('Inactive')}/>
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