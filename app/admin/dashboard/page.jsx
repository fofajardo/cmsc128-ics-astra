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
import { BarChartComponent, VerticalBarChart, StackedBarChart } from "./components/BarChart";
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
  const [alumniFieldStats, setAlumniFieldStats] = useState([]);
  const [alumniIncomeStats, setAlumniIncomeStats] = useState([]);
  const [alumniEmploymentStats, setAlumniEmploymentStats] = useState([]);
  const [alumniBatchStats, setAlumniBatchStats] = useState([]);
  const [tab, setTab] = useState("donations");

  useEffect(() => {
    const fetchStatistics = async () => {
      try{
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
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/alumni-field-stats`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/alumni-income-range-stats`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/alumni-employment-status`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/alumni-batch`),
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
          alumniFieldRes,
          alumniIncomeRes,
          alumniEmploymentRes,
          alumniBatchRes,
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
          const updatedAlumniOrgStats = await Promise.all(
            alumniOrgRes.value.data.stats.map(async (org) => ({
              name: org.name,
              acronym: org.acronym,
              nameWithAcronym: `${org.name} (${org.acronym})`,
              count: org.count,
              active: org.active,
              inactive: org.inactive,
            }))
          );
          setAlumniOrgStats(updatedAlumniOrgStats);
        }

        if (alumniFieldRes.status === "fulfilled" && alumniFieldRes.value.data.status === "OK") {
          setAlumniFieldStats(alumniFieldRes.value.data.stats);
        }

        if (alumniIncomeRes.status === "fulfilled" && alumniIncomeRes.value.data.status === "OK") {
          setAlumniIncomeStats(alumniIncomeRes.value.data.stats);
        }

        if (alumniEmploymentRes.status === "fulfilled" && alumniEmploymentRes.value.data.status === "OK") {
          console.log("Alumni Employment Stats:", alumniEmploymentRes.value.data.stats);
          setAlumniEmploymentStats(alumniEmploymentRes.value.data.stats);
        }

        if (alumniBatchRes.status === "fulfilled" && alumniBatchRes.value.data.status === "OK") {
          console.log("Alumni Batch Stats:", alumniBatchRes.value.data.stats);
          setAlumniBatchStats(alumniBatchRes.value.data.stats);
        }

        if (donationSummaryRes.status === "fulfilled" && donationSummaryRes.value.data.status === "OK") {
          const updatedProjectDonationSummary = await Promise.all(
            donationSummaryRes.value.data.list.map(async (project) => ({
              donationTitle: capitalizeTitle(project.title),
              funds: project.total_donations,
              project_status: project.project_status,
            }))
          );
          setProjectDonationSummary(updatedProjectDonationSummary);
        }
      }
      catch (error) {
        console.log("Error fetching statistics:", error);
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

    case "age": {
      // Example dummy data for stacked bars
      const dummyStackedAges = Array.from({ length: 19 }, (_, i) => ({
        age: 20 + i,
        male: Math.floor(Math.random() * 20),
        female: Math.floor(Math.random() * 20),
      }));

      return (
        <TransitionSlide>
          <StackedBarChart
            data={alumniAgeStats.filter(item => item.age > 0)}
            config={{
              active: { label: "Active", color: "var(--color-astraprimary)" },
              inactive: { label: "Inactive", color: "#60a5fa" },
            }}
            title="Alumni Age Distribution"
            description="Active and inactive alumni by age"
            xKey="age"
            barKeys={["active", "inactive"]}
            barColors={["var(--color-astraprimary)", "#60a5fa"]}
          />
        </TransitionSlide>
      );
    }

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
        <TransitionSlide>
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
        </TransitionSlide>
      );
    }

    case "civil": {
      const colorConfig = {
        Married: "var(--color-astralight)",
        Single: "var(--color-astradark)",
        Divorced: "var(--color-pieastra-primary-80)",
        Separated: "var(--color-pieastra-primary-50)",
        Widowed: "var(--color-pieastra-primary-30)",
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
        <TransitionSlide>
          <ReusablePieChart
            data={pieCivilStats}
            config={{
              Married: { label: "Married"},
              Single: { label: "Single"},
              Divorced: { label: "Divorced"},
              Separated: { label: "Separated"},
              Widowed: { label: "Widowed"},
            }}
            title="Alumni Civil Status Distribution"
            description="Active alumni by civil status"
            dataKey="value"
            nameKey="name"
            maxHeight={300}
          />
        </TransitionSlide>
      );
    }

    case "org": {
      // Dummy data for testing scalability
      const dummyAlumniOrgStats = Array.from({ length: 10 }, (_, i) => ({
        name: `Org ${i + 1}`,
        count: Math.floor(Math.random() * 200) + 10, // 10 to 209 alumni
        active: Math.floor(Math.random() * 100),
        inactive: Math.floor(Math.random() * 100),
      }));
      return (
        <TransitionSlide>
          <VerticalBarChart
            data={alumniOrgStats.sort((a, b) => b.count - a.count)}
            config={{
              count: { label: "Active Alumni", color: "var(--color-astraprimary)" },
              active: { color: "#60a5fa" },
              inactive: { color: "#a3a3a3" },
            }}
            title="Alumni by Organization"
            description="Active alumni per organization"
            yKey="name"
            yKeyLong="nameWithAcronym"
            barKey="count"
            barLabel="Total Alumni"
            barColor="var(--color-astradark)"
          />
        </TransitionSlide>
      );
    }

    case "field": {
      // Dummy data for testing scalability
      const dummyAlumniFieldStats = Array.from({ length: 10 }, (_, i) => ({
        field: `Field ${i + 1}`,
        count: Math.floor(Math.random() * 200) + 10, // 10 to 209 alumni
        active: Math.floor(Math.random() * 100),
        inactive: Math.floor(Math.random() * 100),
      }));
      const sortedFieldStats = [...alumniFieldStats].sort((a, b) => b.count - a.count);

      return (
        <TransitionSlide>
          <VerticalBarChart
            data={sortedFieldStats}
            config={{
              count: { label: "Total Alumni", color: "var(--color-astraprimary)" },
              active: { color: "#60a5fa" },
              inactive: { color: "#a3a3a3" },
            }}
            title="Alumni by Field"
            description="Number of alumni per field"
            yKey="field"
            barKey="count"
            barLabel="Total Alumni"
            barColor="var(--color-astraprimary)"
          />
        </TransitionSlide>
      );
    }

    case "income": {
      // Dummy data for testing scalability
      const dummyAlumniIncomeStats = Array.from({ length: 7 }, (_, i) => ({
        income_range: `$${(i + 1) * 100}k`,
        count: Math.floor(Math.random() * 200) + 10, // 10 to 209 alumni
        active: Math.floor(Math.random() * 100),
        inactive: Math.floor(Math.random() * 100),
      }));

      const sortedIncomeStats = [...alumniIncomeStats].sort((a, b) => {
        const getMin = (range) => {
          if (!range) return 0;
          const match = range.match(/^(\d+)[kK]/);
          return match ? parseInt(match[1], 10) : 0;
        };
        return getMin(a.income_range) - getMin(b.income_range);
      });

      return (
        <TransitionSlide>
          <BarChartComponent
            data={sortedIncomeStats}
            config={{
              count: { label: "Total Alumni", color: "var(--color-astraprimary)" },
              active: { color: "#60a5fa" },
              inactive: { color: "#a3a3a3" },
            }}
            title="Alumni by Income Range"
            description="Number of alumni per income range"
            xKey="income_range"
            barKey="count"
            barLabel="Alumni Count"
            barColor="var(--color-astraprimary)"
          />
        </TransitionSlide>
      );
    }

    case "employment": {
      const colorConfig = {
        Employed: "var(--color-pieastra-primary-90)",
        Unemployed: "var(--color-astradark)",
        "Self Employed": "var(--color-pieastra-primary-60)",
      };

      const pieEmploymentStats = alumniEmploymentStats.map(item => {
        // Format status for display and color mapping
        let name = item.employment_status
          .replace(/_/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase());
        return {
          name,
          value: item.total_alumni,
          fill: colorConfig[name] || "#a3a3a3",
        };
      });

      return (
        <TransitionSlide>
          <ReusablePieChart
            data={pieEmploymentStats}
            config={{
              Employed: { label: "Employed" },
              Unemployed: { label: "Unemployed" },
              "Self Employed": { label: "Self Employed" },
            }}
            title="Alumni Employment Status"
            description="Active alumni by employment status"
            dataKey="value"
            nameKey="name"
            maxHeight={300}
          />
        </TransitionSlide>
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
          <div className="flex flex-col gap-2 flex-2">
            <NavigationMenuDemo tab={tab} setTab={setTab} />
            {renderTabContent()}
          </div>
        </div>
        {/* <InteractiveLineChart/> */}
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