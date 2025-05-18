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
import Image from "next/image";

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

  useEffect(() => {
    // Fetch statistics from the API
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

    fetchStatistics();
  }, []); // Empty dependency array means this runs only once when the component mounts

  const statData = stats;

   return (
    <>
      <ActiveNavItemMarker id={NavMenuItemId.ORGANIZATIONS} />

      {/* Header Section with Background */}
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
            {/* Top Section: Text and Illustration */}
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Text Section */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h1 className="text-5xl font-extrabold leading-tight">Organizations</h1>
                <p className="mt-6 text-lg text-blue-100 max-w-md">
                  Empowering connections, camaraderie, and inspiring growth.
                </p>
              </div>

              {/* Animated SVG Illustration */}
              <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
                <div className="transition-transform duration-300 ease-in-out hover:scale-105">
                  <Image
                    src="/vectors/organizations-vector.svg"
                    alt="Organization Vector"
                    width={500}
                    height={300}
                    className="w-full max-w-md h-auto animate-float hover:animate-hover-wiggle"
                  />
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <AdminStatCard
                delay={0.0}
                title="Total Orgs"
                value={statData.total_organizations}
                icon={<School className="size-13 text-white" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
                className="bg-blue-800/80 backdrop-blur-md border border-white/10 rounded-xl"
              />
              <AdminStatCard
                delay={0.1}
                title="University Orgs"
                value={statData.universities}
                icon={<School2 className="size-13 text-white" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
                className="bg-blue-800/80 backdrop-blur-md border border-white/10 rounded-xl"
              />
              <AdminStatCard
                delay={0.2}
                title="Outside Orgs"
                value={statData.outside}
                icon={<Building className="size-13 text-white" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
                className="bg-blue-800/80 backdrop-blur-md border border-white/10 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Context Provider */}
      <TabContext.Provider value={{ info, setInfo }}>
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