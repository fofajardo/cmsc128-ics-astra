"use client";
import { useState, useEffect } from "react";
import AdminStatCard from "@/components/AdminStatCard";
import { BriefcaseBusiness, School } from "lucide-react";
import { TabContext } from "@/components/TabContext";
import { useRouter, usePathname } from "next/navigation";
import { School2 } from "lucide-react";
import { Building } from "lucide-react";
import axios from "axios";
import {NavMenuItemId} from "../../../common/scopes.js";
import {ActiveNavItemMarker} from "@/components/Header.jsx"; // Make sure axios is installed

export default function AdminAlumniLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // State to store the statistics
  const [stats, setStats] = useState({
    total_organizations: 0,
    universities: 0,
    outside: 0,
  });

  const [info, setInfo] = useState({
    title: "Organizations",
    search: "Search for an organization",
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchStatistics = async () => {
    try {
      console.log(`${process.env.NEXT_PUBLIC_API_URL}/v1/organizations/statistics`);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/organizations/stats`);

      if (response.data.status === "OK") {
        // Update state with the statistics data
        const { total_organizations, universities, outside } = response.data.statistics;
        setStats({
          total_organizations,
          universities,
          outside,
        });
      } else {
        console.error("Failed to fetch statistics");
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    // Fetch statistics from the API

    fetchStatistics();
  }, [refreshTrigger]); // Empty dependency array means this runs only once when the component mounts

  const statData = stats;

  return (
    <>
      {/* Header with background */}
      <ActiveNavItemMarker id={NavMenuItemId.ORGANIZATIONS}/>
      <div className="relative">
        <img
          src="/blue-bg.png"
          alt="Background"
          className="h-80 w-full object-cEVENTSover"
        />
        <div className="absolute inset-2 flex flex-col items-center justify-evenly text-astrawhite z-20">
          <div className="text-center pt-6">
            <h1 className="font-h1">Organizations</h1>
            <p className="font-s">Empowering connections, camaraderie, and inspiring growth.</p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center">
              <AdminStatCard
                delay={0.0}
                title="Total Orgs"
                value={statData.total_organizations}
                icon={<School className="size-13 text-astrawhite/" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
                delay={0.1}
                title="University Orgs"
                value={statData.universities}
                icon={<School2 className="size-13 text-astrawhite/" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
                delay={0.2}
                title="Outside Orgs"
                value={statData.outside}
                icon={<Building className="size-13 text-astrawhite/" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
      {/* pass the value of currTab and info to the children */}
      <TabContext.Provider value={{ info, setRefreshTrigger }}>
        {children}
      </TabContext.Provider>
    </>
  );
}