"use client";
import { useEffect, useState } from "react";
import AdminStatCard from "@/components/AdminStatCard";
import { GraduationCap, Calendar, Briefcase, HandHeart } from "lucide-react";
import BarGraph from "./components/bargraph";
import { Donut } from "./components/PieChartDonut";
import UpcomingEvents from "./components/UpcomingEvents";
import ActivityOverview from "./components/ActivityOverview";
import RecentActivity from "./components/RecentActivity";
import TransitionSlide from "@/components/transitions/TransitionSlide";
import axios from "axios";
import { capitalizeTitle } from "@/utils/format";
import { NavigationMenuDemo } from "./components/navigationmenu";
import BarChartComponent from "./components/BarChart";
import ReusablePieChart from "./components/ReusablePieChart";

export default function Dashboard() {
  const [activeAlumniStats, setActiveAlumniStats] = useState(null);
  const [activeJobsStats, setActiveJobsStats] = useState(null);
  const [activeEventsStats, setActiveEventsStats] = useState(null);
  const [fundsRaisedStats, setFundsRaisedStats] = useState(null);
  const [projectDonationSummary, setProjectDonationSummary] = useState([]);
  const [alumniAgeStats, setAlumniAgeStats] = useState([]);
  const [alumniSexStats, setAlumniSexStats] = useState([]);
  const [alumniCivilStats, setAlumniCivilStats] = useState([]);
  const [alumniOrgStats, setAlumniOrgStats] = useState([]);
  const [category, setCategory] = useState("demographics");
  const [tab, setTab] = useState("donations");

  useEffect(() => {
    const fetchStatistics = async () => {
      const urls = [
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/alumni-stats`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/active-jobs`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/active-events`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/funds-raised`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/project-donation-summary`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/alumni-age-stats`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/alumni-sex-stats`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/alumni-civil-status-stats`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/alumni-org-affiliation-stats`),
      ];

      const [
        alumniRes,
        jobsRes,
        eventsRes,
        fundsRes,
        donationSummaryRes,
        alumniAgeRes,
        alumniSexRes,
        alumniCivilRes,
        alumniOrgRes,
      ] = await Promise.allSettled(urls);

      if (alumniRes.status === "fulfilled") setActiveAlumniStats(alumniRes.value.data.stats);
      if (jobsRes.status === "fulfilled") setActiveJobsStats(jobsRes.value.data.stats);
      if (eventsRes.status === "fulfilled") setActiveEventsStats(eventsRes.value.data.stats);
      if (fundsRes.status === "fulfilled") setFundsRaisedStats(fundsRes.value.data.stats);

      if (alumniAgeRes.status === "fulfilled" && alumniAgeRes.value.data.status === "OK") {
        setAlumniAgeStats(alumniAgeRes.value.data.stats);
      }
      if (alumniSexRes.status === "fulfilled" && alumniSexRes.value.data.status === "OK") {
        setAlumniSexStats(alumniSexRes.value.data.stats);
      }
      if (alumniCivilRes.status === "fulfilled" && alumniCivilRes.value.data.status === "OK") {
        setAlumniCivilStats(alumniCivilRes.value.data.stats);
      }
      if (alumniOrgRes.status === "fulfilled" && alumniOrgRes.value.data.status === "OK") {
        setAlumniOrgStats(alumniOrgRes.value.data.stats);
      }
      if (donationSummaryRes.status === "fulfilled" && donationSummaryRes.value.data.status === "OK") {
        const updatedProjectDonationSummary = donationSummaryRes.value.data.list.map((project) => ({
          donationTitle: capitalizeTitle(project.title),
          funds: project.total_donations,
          project_status: project.project_status,
        }));
        setProjectDonationSummary(updatedProjectDonationSummary);
      }
    };

    fetchStatistics();
  }, []);

  const activeAlumniCount = activeAlumniStats?.active_alumni_count ?? "Loading...";
  const activeJobsCount = activeJobsStats?.active_jobs_count ?? "Loading...";
  const activeEventsCount = activeEventsStats?.active_events_count ?? "Loading...";
  const fundsRaisedAmount = fundsRaisedStats?.total_funds_raised ?? "Loading...";

  const pieSexStats = alumniSexStats.map(item => ({
    name: item.sex.charAt(0).toUpperCase() + item.sex.slice(1), // Capitalize
    value: item.count,
  }));

  function renderTabContent() {
    switch (tab) {
    case "donations":
      return (
        <FundsDonut
          fundsRaisedStats={fundsRaisedStats}
          projectStatistics={projectDonationSummary}
        />
      );

    case "age":
      return (
        <BarChartComponent
          data={alumniAgeStats.filter(item => item.age > 0)}
          config={{ count: { label: "Alumni Count", color: "var(--color-astraprimary)" } }}
          title="Alumni Age Distribution"
          description="Active alumni by age"
          xKey="age"
          barKey="count"
          barLabel="Alumni Count"
          barColor="var(--color-astraprimary)"
        />
      );

    case "sex": {
      const colorConfig = {
        Female: "#FF69B4",
        Male: "var(--color-astraprimary)",
      };

      const pieSexStats = alumniSexStats.map(item => {
        const name = item.sex.charAt(0).toUpperCase() + item.sex.slice(1);
        return {
          name,
          value: item.count,
          fill: colorConfig[name] || "var(--color-astralight)",
        };
      });

      return (
        <ReusablePieChart
          data={pieSexStats}
          config={{
            Female: { label: "Female", color: "#60a5fa" },
            Male: { label: "Male", color: "var(--color-astraprimary)" },
          }}
          title="Alumni Sex Distribution"
          description="Active alumni by sex"
          dataKey="value"
          nameKey="name"
          maxHeight={300}
        />
      );
    }

    case "civil": {
      const colorConfig = {
        Married: "var(--color-astralight)",
        Single: "var(--color-astradark)",
      };

      const pieCivilStats = alumniCivilStats.map(item => {
        const name = item.civil_status.charAt(0).toUpperCase() + item.civil_status.slice(1);
        return {
          name,
          value: item.count,
          fill: colorConfig[name] || "#a3a3a3", // fallback gray
        };
      });

      return (
        <ReusablePieChart
          data={pieCivilStats}
          config={{
            Married: { label: "Married"},
            Single: { label: "Single"},
          }}
          title="Alumni Civil Status Distribution"
          description="Active alumni by civil status"
          dataKey="value"
          nameKey="name"
          maxHeight={300}
        />
      );
    }

    default:
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