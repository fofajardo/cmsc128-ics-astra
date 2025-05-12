"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import axios from "axios";
import { capitalizeTitle } from "@/utils/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// temporary labels 
const PROJECT_STATUS_LABELS = {
  0: "Pending",
  1: "Active",
  2: "Finished",
};
const PROJECT_STATUS_COLORS = {
  0: "bg-yellow-100 text-yellow-800",
  1: "bg-blue-100 text-blue-800",
  2: "bg-green-100 text-green-800",
};

const chartConfig = {
  funds: {
    label: "Funds",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
  ASD: {
    label: "ASD",
    color: "hsl(var(--chart-2))",
  },
};

function FundDisplay({ color, title, funds, project_status, isDense }) {
  const titleFont = isDense ? "font-s" : "font-r";
  const fundsFont = isDense ? "font-sb" : "font-rb";

  return (
    <div className="flex items-center justify-between max-w-full gap-6">
      <div className="flex items-center gap-2.5">
        <div
          className="w-5 min-h-8 rounded-lg flex-shrink-0"
          style={{ backgroundColor: color }}
        ></div>
        <div className="flex flex-col">
          <span className={`text-astrablack line-clamp-1 ${titleFont}`}>{title}</span>
          <span
            className={`px-1 py-0 rounded text-[11px] w-fit ${PROJECT_STATUS_COLORS[project_status] || "bg-gray-100 text-gray-700"}`}
          >
            {PROJECT_STATUS_LABELS[project_status] || "Unknown"}
          </span>
        </div>
      </div>
      <span className={`text-astraprimary text-right ${fundsFont}`}>
        ₱{Number(funds).toLocaleString()}
      </span>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPageButton = (page) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`px-2 md:px-4 py-2 rounded-sm md:rounded-xl font-s ${currentPage === page ? "bg-astraprimary text-astrawhite" : "bg-transparent text-astradarkgray hover:bg-astratintedwhite"}`}
    >
      {page}
    </button>
  );

  const renderDots = (key) => (
    <span key={key} className="px-2 text-astradarkgray select-none">
      ...
    </span>
  );

  const getPageButtons = () => {
    const pages = [];
    pages.push(renderPageButton(1));

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push(renderDots("start-dots"));
    for (let i = start; i <= end; i++) pages.push(renderPageButton(i));
    if (end < totalPages - 1) pages.push(renderDots("end-dots"));
    if (totalPages > 1) pages.push(renderPageButton(totalPages));

    return pages;
  };

  return (
    totalPages > 1 && (
      <div className="flex items-center justify-center gap-2 sm:gap-1 py-4 cursor-pointer bg-white rounded-b-xl">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? "text-astralightgray cursor-not-allowed" : "text-astraprimary hover:bg-astratintedwhite"}`}
        >
          <svg className="w-5 h-5 stroke-3" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {getPageButtons()}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? "text-astralightgray cursor-not-allowed" : "text-astraprimary hover:bg-astratintedwhite"}`}
        >
          <svg className="w-5 h-5 stroke-3" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )
  );
}

export function Donut() {
  const router = useRouter();
  const [projectStatistics, setProjectStatistics] = React.useState([]);
  const [fundsRaised, setFundsRaised] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(6);

  React.useEffect(() => {
    const fetchProjectDonationSummary = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/project-donation-summary`
        );

        if (response.data.status == "OK") {
          const updatedProjectDonationSummary = await Promise.all(
            response.data.list.map(async (project) => {
              const projectData = {
                donationTitle: capitalizeTitle(project.title),
                funds: project.total_donations,
                project_status: project.project_status,
              };
              return projectData;
            })
          );

          setProjectStatistics(updatedProjectDonationSummary);
        } else {
          console.error("Unexpected response:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch project-donation details:", error);
      }
    };

    const fetchTotalRaised = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/funds-raised`
        );

        console.log(response.data.stats);

        setFundsRaised(response.data.stats);
      } catch (error) {
        console.error("Failed to fetch project-donation details:", error);
      }
    };

    fetchProjectDonationSummary();
    fetchTotalRaised();
  }, []);

  const colorSteps = [
    "var(--color-pieastra-primary-100)",
    "var(--color-pieastra-primary-90)",
    "var(--color-pieastra-primary-80)",
    "var(--color-pieastra-primary-70)",
    "var(--color-pieastra-primary-60)",
    "var(--color-pieastra-primary-50)",
    "var(--color-pieastra-primary-40)",
    "var(--color-pieastra-primary-30)",
    "var(--color-pieastra-primary-20)",
    "var(--color-pieastra-primary-10)",
  ];

  // filter out donations with 0 funds
  const filteredStatistics = projectStatistics.filter(item => item.funds > 0);

  const totalPages = Math.ceil(filteredStatistics.length / pageSize);
  const paginatedData = [...filteredStatistics]
    .sort((a, b) => b.funds - a.funds)
    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
    .map((item, idx) => ({
      ...item,
      fill: colorSteps[idx] || colorSteps[colorSteps.length - 1],
    }));

  const totalFunds = fundsRaised?.total_funds_raised ?? "Loading...";

  return (
    <Card className="flex flex-col h-full py-4 gap-0">
      <CardHeader className="items-center pb-0">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <CardTitle>Highest Funded Categories</CardTitle>
            {/* <CardDescription>January - April 2025</CardDescription> */}
          </div>
          <a
            onClick={() => router.push("/admin/projects")}
            className="text-astraprimary font-rb hover:underline cursor-pointer"
          >
            See All
          </a>
        </div>
        <hr className="h-2 border-astrablack"></hr>
      </CardHeader>
      <CardContent className="flex-1 pb-0 px-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[330px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel showPeso={true} />}
            />
            <Pie
              data={paginatedData}
              dataKey="funds"
              nameKey="donationTitle"
              innerRadius={80}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-astradark font-lb bg-blue-red"
                        >
                          ₱{totalFunds.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Funds Raised
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <CardFooter className="flex-col gap-0 font-s">
          <div className="leading-none text-muted-foreground pb-2">
            Showing <span className="font-bold">
              {filteredStatistics.length === 0 ? 0 : ((currentPage - 1) * pageSize + 1)}
            </span>
            -
            <span className="font-bold">{Math.min(currentPage * pageSize, filteredStatistics.length)}</span>
            {" "}out of <span className="font-bold">{projectStatistics.length}</span> Donation Drives
          </div>

          {/* Page size selector */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-muted-foreground">Show</span>
            <div className="min-w-[60px]">
              <Select
                value={pageSize.toString()}
                onValueChange={value => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Page size" />
                </SelectTrigger>
                <SelectContent className="min-w-fit">
                  {[5, 6, 8, 10].map(size => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-muted-foreground">per page</span>
          </div>

          <div className="mt-0 flex flex-col space-y-1.5 min-w-full gap-2">
            {paginatedData.map((item, index) => (
              <div
                key={index}
                className="transition-all cursor-pointer duration-200 
                  hover:scale-105 hover:shadow-lg hover:bg-pieastra-primary-10/40 hover:font-semibold 
                  rounded-lg px-2.5 py-0.5 group"
              >
                <FundDisplay
                  title={item.donationTitle}
                  funds={item.funds}
                  color={item.fill}
                  project_status={item.project_status}
                  isDense={paginatedData.length === 10}
                />
              </div>
            ))}
          </div>

        </CardFooter>
      </CardContent>
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
    </Card>
  );
}
