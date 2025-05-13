"use client";
import { useState, useEffect } from "react";
import AdminStatCard from "@/components/AdminStatCard";
import AdminTabs from "@/components/AdminTabs";
import { GraduationCap, UserRoundPlus, UserRoundCheck, UserRoundX } from "lucide-react";
import { TabContext } from "../../../components/TabContext";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

export default function AdminAlumniLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [info, setInfo] = useState({
    title: "Pending Accounts",
    search: "Search for an alumni",
  });

  const [tabs, setTabs] = useState({
    "Pending": 0,
    "Approved": 0,
    "Inactive": 0,
  });

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    inactive: 0,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchAlumniStats = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/alumni-stats`);
        setTabs({
          "Pending": response.data.stats.pending_alumni_count,
          "Approved": response.data.stats.approved_alumni_count,
          "Inactive": response.data.stats.inactive_alumni_count,
        });
        setStats({
          pending: response.data.stats.pending_alumni_count,
          approved: response.data.stats.approved_alumni_count,
          inactive: response.data.stats.inactive_alumni_count,
        });
      } catch (error) {
        console.error("Failed to fetch alumni stats:", error);
      }
    };

    fetchAlumniStats();
  }, [refreshTrigger]);

  const [currTab, setCurrTab] = useState("Pending");

  const handleTabChange = (newTab) => {
    setCurrTab(newTab);

    setInfo((prev) => ({
      ...prev,
      title: `${newTab} Accounts`,
    }));
  };

  // main tab switcher for the list page
  const handleGoToTab = (newTab) => {
    setCurrTab(newTab);
    setInfo((prev) => ({
      ...prev,
      title: `${newTab} Accounts`,
    }));
    router.push("/admin/alumni/manage-access");
  };

  // if from profile page, go back and set tab
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
            <h1 className="font-h1">Manage Access</h1>
            <p className="font-s">The ever-growing UPLB-ICS Alumni Network</p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center">
              <AdminStatCard delay={0.1} title='Pending' value={stats.pending} icon={<UserRoundPlus className='size-13 text-astrawhite/>' strokeWidth={1.5} />} route={false} onClick={() => dynamicTabClick("Pending")} />
              <AdminStatCard delay={0.2} title='Approved' value={stats.approved} icon={<UserRoundCheck className='size-13 text-astrawhite/>' strokeWidth={1.5} />} route={false} onClick={() => dynamicTabClick("Approved")} />
              <AdminStatCard delay={0.3} title='Inactive' value={stats.inactive} icon={<UserRoundX className='size-13 text-astrawhite/>' strokeWidth={1.5} />} route={false} onClick={() => dynamicTabClick("Inactive")} />
            </div>
          </div>
        </div>
      </div>
      {/* pass the value of currTab and info to the children */}
      <TabContext.Provider value={{ currTab, setCurrTab, info, setInfo, refreshTrigger, setRefreshTrigger }}>
        <AdminTabs tabs={tabs} currTab={currTab} handleTabChange={dynamicTabClick} />
        {children}
      </TabContext.Provider>
    </>
  );

  // <AdminStatCard delay={0.0} title='Registered' value={stats.approved + stats.pending} icon={<GraduationCap className='size-13 text-astrawhite/>' strokeWidth={1.5} />} route={"/admin/alumni/search"} />
}