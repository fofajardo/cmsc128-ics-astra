"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminStatCard from "@/components/AdminStatCard";
import AdminTabs from "@/components/AdminTabs";
import { Gift } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TabContext } from "@/components/TabContext";
import Link from "next/link";

export default function AdminDonationsLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [info, setInfo] = useState({
    title: "Donations",
    search: "Search for a donation",
    currTab: "Unverified"
  });

  const [donationCounts, setDonationCounts] = useState({
    verified: <Skeleton className="h-7 w-12 my-2" />,
    unverified: <Skeleton className="h-7 w-12 my-2" />,
    total: <Skeleton className="h-7 w-12 my-2" />,
  });

  const tabs = {
    Unverified: donationCounts.unverified,
    All: donationCounts.total,
  };

  const [currTab, setCurrTab] = useState("Unverified");

  const handleTabChange = (newTab) => {
    setCurrTab(newTab);
    setInfo((prev) => ({
      ...prev,
      title: `${newTab} Donations`,
    }));
    // Reset filters/pagination and refetch if needed
  };

  const handleGoToTab = (newTab) => {
    setCurrTab(newTab);
    setInfo((prev) => ({
      ...prev,
      title: `${newTab} Donations`,
      currTab: newTab
    }));
    router.push("/admin/donations");
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
          className="h-100 w-full object-cover"
        />
        <div className="absolute inset-2 flex flex-col items-center justify-evenly text-astrawhite z-20">
          <div className="text-center pt-6">
            <h1 className="font-h1">Donations</h1>
            <p className="font-s">
              Fostering generosity and driving impact through transparency and trust.
            </p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center">
              <AdminStatCard
                delay={0.1}
                title="Verified Donations"
                value={donationCounts.verified}
                icon={<Gift className="size-13 text-astrawhite" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
                delay={0.0}
                title="Unverified Donations"
                value={donationCounts.unverified}
                icon={<Gift className="size-13 text-astrawhite" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
              />
              <AdminStatCard
                delay={0.2}
                title="Total Donations"
                value={donationCounts.total}
                icon={<Gift className="size-13 text-astrawhite" strokeWidth={2} />}
                route={false}
                onClick={() => {}}
              />
            </div>
          </div>

          <div className="flex flex-row gap-8">
            {/* Manage projects button */}
            <Link href="/admin/projects" passHref>
              <button className="mt-2 border-2 border-astrawhite text-astrawhite hover:bg-astrawhite hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]">
                Manage Projects
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs + children context */}
      <TabContext.Provider value={{ info, setInfo, setDonationCounts }}>
        <AdminTabs tabs={tabs} currTab={currTab} handleTabChange={dynamicTabClick} />
        {children}
      </TabContext.Provider>
    </>
  );
}
