"use client";

import React, { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { MoveUpRight, MoveDownRight, Calendar, GraduationCap, Users, TrendingUp, Briefcase } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Constants
const RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 3 months" },
];

const CHART_CONFIG = {
  events: { label: "Events", color: "hsl(var(--chart-1))", icon: Calendar },
  jobs: { label: "Jobs", color: "hsl(var(--chart-2))", icon: Briefcase },
  alumni: { label: "Alumni", color: "hsl(var(--chart-3))", icon: GraduationCap },
};


// Needs 6 months of data (for growth calculation), everyday count of created events jobs and alumni
const CHART_DATA = [
  { date: "2025-03-27", events: 135, jobs: 120, alumni: 75 },
  { date: "2025-03-28", events: 125, jobs: 110, alumni: 70 },
  { date: "2025-03-29", events: 115, jobs: 90, alumni: 60 },
  { date: "2025-03-30", events: 95, jobs: 85, alumni: 55 },
  { date: "2025-03-31", events: 105, jobs: 100, alumni: 65 },
  { date: "2025-04-01", events: 130, jobs: 125, alumni: 80 },
  { date: "2025-04-02", events: 0, jobs: 0, alumni: 0 },
  { date: "2025-04-03", events: 120, jobs: 115, alumni: 70 },
  { date: "2025-04-04", events: 110, jobs: 100, alumni: 60 },
  { date: "2025-04-05", events: 100, jobs: 105, alumni: 65 },
  { date: "2025-04-06", events: 95, jobs: 90, alumni: 50 },
  { date: "2025-04-07", events: 140, jobs: 0, alumni: 0 },
  { date: "2025-04-08", events: 130, jobs: 110, alumni: 75 },
  { date: "2025-04-09", events: 0, jobs: 95, alumni: 60 },
  { date: "2025-04-10", events: 90, jobs: 85, alumni: 45 },
  { date: "2025-04-11", events: 120, jobs: 100, alumni: 70 },
  { date: "2025-04-12", events: 100, jobs: 80, alumni: 55 },
  { date: "2025-04-13", events: 145, jobs: 130, alumni: 85 },
  { date: "2025-04-14", events: 110, jobs: 90, alumni: 50 },
  { date: "2025-04-15", events: 0, jobs: 0, alumni: 0 },
  { date: "2025-04-16", events: 135, jobs: 105, alumni: 75 },
  { date: "2025-04-17", events: 125, jobs: 95, alumni: 65 },
  { date: "2025-04-18", events: 140, jobs: 120, alumni: 70 },
  { date: "2025-04-19", events: 0, jobs: 100, alumni: 60 },
  { date: "2025-04-20", events: 90, jobs: 0, alumni: 40 },
  { date: "2025-04-21", events: 100, jobs: 85, alumni: 55 },
  { date: "2025-04-22", events: 150, jobs: 110, alumni: 80 },
  { date: "2025-04-23", events: 0, jobs: 0, alumni: 0 },
  { date: "2025-04-24", events: 130, jobs: 105, alumni: 70 },
  { date: "2025-04-25", events: 120, jobs: 95, alumni: 60 },
];



// Utility Functions
const calculateDateRanges = (timeRange) => {
  const now = new Date();
  const days = { "7d": 7, "30d": 30, "90d": 90 }[timeRange];

  const end = now;
  const start = new Date(now);
  start.setDate(now.getDate() - days + 1);
  const prevEnd = new Date(start);
  prevEnd.setDate(start.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevEnd.getDate() - days + 1);

  return {
    startLabel: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    endLabel: end.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    current: { start, end },
    previous: { start: prevStart, end: prevEnd },
  };
};

const filterDataByRange = (data, range) =>
  data.filter(({ date }) => {
    const d = new Date(date);
    return d >= range.start && d <= range.end;
  });

const calculateSummary = (currentData, previousData, chartConfig) =>
  Object.keys(chartConfig).reduce((acc, key) => {
    const totalCurrent = currentData.reduce((sum, item) => sum + item[key], 0);
    const totalPrevious = previousData.reduce((sum, item) => sum + item[key], 0) || 1;
    const delta = totalCurrent - totalPrevious;

    acc[key] = {
      total: totalCurrent,
      delta,
      percentage: Math.round((delta / totalPrevious) * 100),
    };
    return acc;
  }, {});

const formatDate = (date, includeYear = false) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(includeYear && { year: "numeric" }),
  });

// Components
function TimeRangeSelector({ timeRange, setTimeRange }) {
  return (
    <Select value={timeRange} onValueChange={setTimeRange}>
      <SelectTrigger aria-label="Select time range" className="w-[150px] bg-astradirtywhite/50">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>
      <SelectContent>
        {RANGE_OPTIONS.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SummaryStats({ summary, chartConfig, activeChart, setActiveChart }) {
  return (
    <div className="flex flex-grow flex-row flex-wrap gap-2 justify-center">
      {Object.keys(chartConfig).map((key) => {
        const { total, delta, percentage } = summary[key];
        const isActive = key === activeChart;
        const Icon = chartConfig[key].icon;

        return (
          <button
            key={key}
            onClick={() => setActiveChart(key)}
            className={`flex flex-1 flex-grow items-center py-4 px-6 rounded-lg hover:bg-astradirtywhite transition-colors ${
              isActive ? "bg-astralight/15" : "bg-astrawhite border"
            }`}
          >
            {/* Icon on the left */}
            <div className="relative mr-4">
              <Icon className="h-6 w-6 text-astradark" strokeWidth={2}/>
              <span className="font-sb">
                {chartConfig[key].label}
              </span>
            </div>


            {/* Main content */}
            <div className="flex flex-row md:flex-col justify-baseline items-center md:items-baseline ">
              <div className={`font-rb text-left ${isActive ? 'text-astraprimary' : 'text-astrablack transition-colors'}`}>
                {total}
              </div>


              <div className="flex flex-row items-baseline">

                <div className="hidden md:block font-s text-astradarkgray">{delta}</div>

                {delta >= 0 ? (
                  <MoveUpRight className="ml-2 h-3 w-3 text-astraprimary/75 inline mr-1"  strokeWidth={3} />
                ) : (
                  <MoveDownRight className="ml-2 h-3 w-3 text-astrared/75 inline mr-1"  strokeWidth={3} />
                )}

                <div className={`font-s hidden lg:block ${delta >= 0 ? 'text-astraprimary' : 'text-astrared'}`}>{Math.floor(Math.abs(percentage))}%</div>
              </div>
            </div>

          </button>
        );
      })}
    </div>
  );
}

function ActivityChart({ data, activeChart, chartConfig }) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px]">
      <BarChart data={data} margin={{ left: 12, right: 12 }} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => formatDate(value)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey={activeChart}
              valueFormatter={(value) => value.toString()}
              labelFormatter={(value) => formatDate(value, true)}
            />
          }
        />
        <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} radius={[15, 15, 0, 0]}/>
      </BarChart>
    </ChartContainer>
  );
}

export default function BarGraph() {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeChart, setActiveChart] = useState("events");

  const { current, previous, startLabel, endLabel } = useMemo(
    () => calculateDateRanges(timeRange),
    [timeRange]
  );

  const filteredData = useMemo(
    () => filterDataByRange(CHART_DATA, current),
    [current]
  );

  const previousData = useMemo(
    () => filterDataByRange(CHART_DATA, previous),
    [previous]
  );

  const summary = useMemo(
    () => calculateSummary(filteredData, previousData, CHART_CONFIG),
    [filteredData, previousData]
  );

  return (
    <Card className="size-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Activity Breakdown</CardTitle>
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
      </CardHeader>

      <div className="flex flex-col lg:flex-row w-full items-center gap-4 px-4">
        <div className="px-6 text-sm text-astradarkgray">
          {startLabel} – {endLabel}
        </div>

        <SummaryStats
          summary={summary}
          chartConfig={CHART_CONFIG}
          activeChart={activeChart}
          setActiveChart={setActiveChart}
        />
      </div>

      <CardContent className="pt-6">
        {filteredData.length > 0 ? (
          <ActivityChart
            data={filteredData}
            activeChart={activeChart}
            chartConfig={CHART_CONFIG}
          />
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            No activity
          </div>
        )}
      </CardContent>
    </Card>
  );
}