"use client";
import { useEffect, useState } from "react";
import AdminStatCard from "@/components/AdminStatCard";
import { GraduationCap, Calendar, Briefcase, HandHeart } from "lucide-react";
import BarGraph from "./components/bargraph";
import { Donut } from "./components/piechart";
import UpcomingEvents from "./components/UpcomingEvents";
import ActivityOverview from "./components/ActivityOverview";
import RecentActivity from "./components/RecentActivity";
import TransitionSlide from "@/components/transitions/TransitionSlide";
import axios from "axios";
import { capitalizeTitle } from "@/utils/format";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { NavigationMenuDemo } from "./components/navigationmenu";

export default function Dashboard() {
  const [activeAlumniStats, setActiveAlumniStats] = useState(null);
  const [activeJobsStats, setActiveJobsStats] = useState(null);
  const [activeEventsStats, setActiveEventsStats] = useState(null);
  const [fundsRaisedStats, setFundsRaisedStats] = useState(null);
  const [projectDonationSummary, setProjectDonationSummary] = useState([]);
  const [category, setCategory] = useState("demographics");
  const [tab, setTab] = useState("age");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const alumniRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/alumni-stats`);
        const jobsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/active-jobs`);
        const eventsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/active-events`);
        const fundsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/funds-raised`);
        const donationSummaryRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/project-donation-summary`);
        setActiveAlumniStats(alumniRes.data.stats);
        setActiveJobsStats(jobsRes.data.stats);
        setActiveEventsStats(eventsRes.data.stats);
        setFundsRaisedStats(fundsRes.data.stats);

        if (donationSummaryRes.data.status == "OK") {
          const updatedProjectDonationSummary = await Promise.all(
            donationSummaryRes.data.list.map(async (project) => {
              const projectData = {
                donationTitle: capitalizeTitle(project.title),
                funds: project.total_donations,
                project_status: project.project_status,
              };
              return projectData;
            })
          );
          setProjectDonationSummary(updatedProjectDonationSummary);
        } else {
          console.log("Unexpected response:", donationSummaryRes.data);
        }
      } catch (error) {
        console.log("Failed to fetch statistics: ", error);
      }
    };

    fetchStatistics();
  }, []);

  const activeAlumniCount = activeAlumniStats?.active_alumni_count ?? "Loading...";
  const activeJobsCount = activeJobsStats?.active_jobs_count ?? "Loading...";
  const activeEventsCount = activeEventsStats?.active_events_count ?? "Loading...";
  const fundsRaisedAmount = fundsRaisedStats?.total_funds_raised ?? "Loading...";

  function renderTabContent() {
    if (tab === "donations") {
      return (
        <FundsDonut
          fundsRaisedStats={fundsRaisedStats}
          projectStatistics={projectDonationSummary}
        />
      );
    }
    return (
      <div className="p-8 text-center text-muted-foreground">
        <span className="text-lg font-semibold">
          {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/_/g, " ")}
        </span>
        <div className="mt-2 text-sm">
          Placeholder content for {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/_/g, " ")}
        </div>
      </div>
    );
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
            <h1 className="font-h1">Welcome Back, ICS Admin!</h1>
            <p className="font-s">Here&apos;s a quick overview of what’s happening today</p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center">
              <AdminStatCard delay={0.0} title='Active Alumni' value={activeAlumniCount} icon={<GraduationCap className='size-13 text-astrawhite/>' strokeWidth={1.5} />} route={"/admin/alumni/search"} />
              <AdminStatCard delay={0.2} title='Active Job Posts' value={activeJobsCount} icon={<Briefcase className='size-13 text-astrawhite/>' strokeWidth={1.5} />} route={"/admin/jobs"} />
              <AdminStatCard delay={0.3} title='Active Events' value={activeEventsCount} icon={<Calendar className='size-13 text-astrawhite/>' strokeWidth={1.5} />} route={"/admin/events"} />
              <AdminStatCard delay={0.4} title='Funds Raised' value={fundsRaisedAmount} icon={<HandHeart className='size-13 text-astrawhite/>' strokeWidth={1.5} />} route={"/admin/projects"} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-col bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row gap-4">
          <AlumAct_Events />
          <div className="flex flex-col gap-2 flex-1">
            <NavigationMenuDemo tab={tab} setTab={setTab} />
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
}

function ActivityBreakdown() {
  return <TransitionSlide className="flex-2 md:flex-3 h-auto w-auto">
    <BarGraph />
  </TransitionSlide>;
}

function Activity() {
  return <TransitionSlide className="flex-2 h-auto w-auto">
    <RecentActivity />
  </TransitionSlide>;
}

function AlumAct_Events() {
  return <div className="flex-grow flex flex-col gap-4">
    <TransitionSlide className="flex-2 flex-grow h-auto w-auto">
      <ActivityOverview />
    </TransitionSlide>
    <TransitionSlide className="flex-2 flex-grow h-auto w-auto">
      <UpcomingEvents />
    </TransitionSlide>
  </div>;
}

function FundsDonut({ fundsRaisedStats, projectStatistics }) {
  return (
    <TransitionSlide className="flex-1 h-auto w-auto md:row-start-1 md:row-span-8 md:col-start-3">
      <div className="size-full">
        <Donut fundsRaised={fundsRaisedStats} projectStatistics={projectStatistics} />
      </div>
    </TransitionSlide>
  );
}