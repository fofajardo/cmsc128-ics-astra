"use client"
import { useState } from "react";
import AdminStatCard from "../../../components/AdminStatCard";
import AdminTabs from "../../../components/AdminTabs";
import { Megaphone, Newspaper } from "lucide-react";
import { TabContext } from '../../../components/TabContext';
import { useRouter, usePathname } from 'next/navigation'

export default function AdminWhatsUpLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [info, setInfo] = useState({
      title: "Announcements",
      search: "Search for announcements",
  });
  
  const tabs = {
      'Announcements': 3,
      'Newsletters': 0,
  };
  
  const [currTab, setCurrTab] = useState('Announcements');

  const handleTabChange = (newTab) => {
      setCurrTab(newTab);
      setInfo((prev) => ({
        ...prev,
        title: `${newTab}`,
        search: `Search for ${newTab.toLowerCase()}`
      }));
  };

  const handleGoToTab = (newTab) => {
    setCurrTab(newTab);
    setInfo((prev) => ({
      ...prev,
      title: `${newTab}`,
      search: `Search for ${newTab.toLowerCase()}`
    }));
    router.push('/admin/whats-up');
  };

  const dynamicTabClick = (tabName) => {
    if (pathname === '/admin/whats-up'){
      handleTabChange(tabName);
    } else {
      handleGoToTab(tabName);
    }
  }

  return (
    <>
      <div className="relative">
        <img
          src="/blue-bg.png"
          alt="Background"
          className="h-80 w-full object-cover"
        />
        <div className="absolute inset-2 flex flex-col items-center justify-evenly text-astrawhite z-20">
          <div className="text-center pt-6">
              <h1 className="font-h1">What's Up Module</h1>
              <p className="font-s">Keep the UPLB-ICS Alumni Network informed and engaged</p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center"> 
                <AdminStatCard 
                  title='Announcements' 
                  value={255} 
                  icon={<Megaphone className='size-13 text-astrawhite' strokeWidth={1.5} />} 
                  route={false} 
                  onClick={() => dynamicTabClick('Announcements')}
                />
                <AdminStatCard 
                  title='Newsletters' 
                  value={59} 
                  icon={<Newspaper className='size-13 text-astrawhite' strokeWidth={1.5}/>} 
                  route={false} 
                  onClick={() => dynamicTabClick('Newsletters')}
                />
            </div>
          </div>
        </div>
      </div>
      <TabContext.Provider value={{ currTab, setCurrTab, info, setInfo }}>
        <AdminTabs tabs={tabs} currTab={currTab} handleTabChange={dynamicTabClick}/>
        {children}
      </TabContext.Provider>
    </>
  );
}
