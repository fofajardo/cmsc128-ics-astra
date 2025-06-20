"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { TrendingUp, FileDown } from "lucide-react"; // Add FileDown import
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
import { Button } from "@/components/ui/button";
import { ReusableDrawer } from "./Drawer";
import { capitalizeTitle } from "@/utils/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NameEmailSkeleton, Skeleton } from "@/components/ui/skeleton";
import { PROJECT_STATUS, PROJECT_STATUS_LABELS } from "../../../../common/scopes";

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

function FundDisplay({ color, title, funds, project_status, isDense, sumFunds }) {
  const percent = sumFunds > 0 ? (funds / sumFunds) * 100 : 0;
  const barBg = color || "#e5e7eb";
  const minBarWidth = 0; // px, adjust as needed
  const barHeight = isDense ? 8 : 10;

  return (
    <div className="w-full flex items-center">
      <div
        className={`relative flex items-center rounded overflow-hidden transition-all h-${barHeight} w-full bg-astragray`}
        style={{
          minWidth: `${minBarWidth}px`,
        }}
      >
        {/* Colored progress bar */}
        <div
          className="absolute left-0 top-0 h-full transition-all"
          style={{
            width: `max(${percent}%, ${minBarWidth}px)`,
            minWidth: `${minBarWidth}px`,
            background: barBg,
            zIndex: 1,
          }}
        />
        {/* Content above the bar */}
        <div className="relative flex items-center w-full z-10 px-3 py-1">
          <span className={"font-rb truncate text-astrablack"}>
            {title}
          </span>
          <span
            className={`ml-2 px-2 py-0.5 rounded text-xs whitespace-nowrap ${PROJECT_STATUS_COLORS[project_status] || "bg-gray-100 text-gray-700"}`}
          >
            {PROJECT_STATUS_LABELS[project_status] || "Unknown"}
          </span>
          <span className={"ml-auto font-rb"}>
            ₱{Number(funds).toLocaleString()}
          </span>
        </div>
      </div>
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

export function Donut({ fundsRaised, projectStatistics }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [showChart, setShowChart] = React.useState(false);
  const chartRef = React.useRef(null); // Add chart reference for export
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
  const filteredStatistics = projectStatistics?.filter(item => item.funds > 0) ?? [];

  React.useEffect(() => {
    if (
      filteredStatistics.length > 0 &&
      fundsRaised !== null &&
      fundsRaised !== undefined
    ) {
      const timer = setTimeout(() => setShowChart(true), 850);
      return () => clearTimeout(timer);
    }
  }, [filteredStatistics, fundsRaised]);

  const totalPages = Math.ceil(filteredStatistics.length / pageSize);
  const paginatedData = [...filteredStatistics]
    .sort((a, b) => b.funds - a.funds)
    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
    .map((item, idx) => ({
      ...item,
      fill: colorSteps[idx] || colorSteps[colorSteps.length - 1],
    }));

  const totalFunds = fundsRaised?.total_funds_raised ?? "Loading...";
  const maxFunds = paginatedData.length > 0 ? Math.max(...paginatedData.map(item => item.funds)) : 1;
  const sumFunds = paginatedData.reduce((acc, item) => acc + item.funds, 0);

  // Function to render the chart - avoids duplication
  function renderChart(showTooltip = true, forExport = false) {
    return (
      <ChartContainer
        config={chartConfig}
        className={forExport ? "mx-auto aspect-square h-[300px]" : "mx-auto aspect-square max-h-[350px]"}
      >
        <PieChart>
          {showTooltip && (
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel showPeso={true} />}
            />
          )}
          <Pie
            data={paginatedData}
            dataKey="funds"
            nameKey="donationTitle"
            innerRadius={forExport ? 70 : 85}
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
                        ₱{typeof totalFunds === "number" ? totalFunds.toLocaleString() : "Loading..."}
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
    );
  }

  return (
    <Card className="flex flex-col h-full py-4 gap-0">
      <CardHeader className="items-center pb-0">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <CardTitle>Projects by Funds Raised</CardTitle>
            <CardDescription className="line-clamp-1">
              See which projects have raised the most funds.
            </CardDescription>

          </div>
          <a
            onClick={() => router.push("/admin/projects")}
            className="text-astraprimary font-rb hover:underline cursor-pointer"
          >
            View
          </a>
        </div>
        <hr className="h-2 border-astrablack"></hr>
      </CardHeader>
      <div className="flex items-center justify-between px-6 pt-0">
        {/* Add ReusableDrawer for export functionality */}
        <ReusableDrawer
          title="Export Projects by Funds Raised"
          description="Download chart data or image"
          triggerElement={
            <Button variant="outline" className="max-w-max mt-0">
              <FileDown />
              Export Report
            </Button>
          }
          chartData={paginatedData.map(item => ({
            name: item.donationTitle,
            value: item.funds,
            status: PROJECT_STATUS_LABELS[item.project_status] || "Unknown"
          }))}
          chartRef={chartRef}
          chartTitle="Projects by Funds Raised"
        >
          <div className="bg-white p-4 rounded-lg flex flex-col">
            <h3 className="text-lg font-bold mb-0">Projects by Funds Raised</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Top {paginatedData.length} projects by funds raised (₱{typeof totalFunds === "number" ? totalFunds.toLocaleString() : "Loading..."} total)
            </p>

            {/* Main chart section */}
            <div className="h-[280px]">
              {renderChart(true, true)}
            </div>

            {/* Custom legend with values in two columns */}
            <div className="mt-2 border-t pt-2">
              <h4 className="text-xs font-bold mb-2">Legend</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {paginatedData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-1">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="truncate md:max-w-48 max-w-24 text-xs" title={item.donationTitle}>
                        {item.donationTitle}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-medium text-xs whitespace-nowrap">
                        ₱{item.funds.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ReusableDrawer>

        {/* Page size selector */}
        <div className="flex items-center gap-2 justify-end mr-6">
          <span className="text-muted-foreground">Show</span>
          <div className="min-w-[60px]">
            <Select
              value={pageSize.toString()}
              onValueChange={function(value) {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent className="min-w-fit">
                {[5, 6, 8, 10].map(function(size) {
                  return (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <span className="text-muted-foreground">per page</span>
        </div>
      </div>

      <CardContent className="flex-0 pb-0 px-0">
        {showChart ? (
          <div ref={chartRef}>
            {renderChart(true)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[330px] gap-4">
            <div className="relative w-[260px] h-[260px] flex items-center justify-center">
              {/* Outer pulsing circle */}
              <Skeleton className="rounded-full w-[260px] h-[260px]" />
              {/* Inner "hole" */}
              <div
                className="absolute rounded-full bg-white"
                style={{
                  width: "160px",
                  height: "160px",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
              {/* Centered loading text */}
              <span
                className="absolute text-muted-foreground"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              >
                Loading chart...
              </span>
            </div>
          </div>
        )}
        <CardFooter className="flex-col gap-0 font-s">
          <div className="leading-none text-muted-foreground mt-[-20] pb-2">
            Showing <span className="font-bold">
              {filteredStatistics.length === 0 ? 0 : ((currentPage - 1) * pageSize + 1)}
            </span>
            -
            <span className="font-bold">{Math.min(currentPage * pageSize, filteredStatistics.length)}</span>
            {" "}out of <span className="font-bold">{projectStatistics?.length ?? 0}</span> Donation Drives
          </div>

          <div className="mt-0 flex flex-col space-y-0.5 min-w-full gap-0">
            {showChart
              ? paginatedData.map((item, index) => (
                <div
                  key={index}
                  className="transition-all duration-200
                        hover:scale-102
                        rounded-lg px-2.5 py-0.5 group"
                >
                  <FundDisplay
                    title={item.donationTitle}
                    funds={item.funds}
                    color={item.fill}
                    project_status={item.project_status}
                    isDense={paginatedData.length === 10}
                    sumFunds={sumFunds}
                  />
                </div>
              ))
              : Array.from({ length: pageSize }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-lg px-2.5 pb-1.5 flex flex-row items-center justify-between"
                >
                  <div className="flex flex-row gap-2">
                    <Skeleton className={"rounded-lg w-5 min-h-8 flex-shrink-0"}/>
                    <NameEmailSkeleton/>
                  </div>
                  <Skeleton className="h-8 w-24" />
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
