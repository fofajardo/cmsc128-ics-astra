"use client";

import React, { useState, useMemo, useRef } from "react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { FileDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { ReusableDrawer } from "./Drawer";

// Helper to group and count by key
function groupByCount(data, key) {
  const map = {};
  data.forEach((item) => {
    const value = item[key];
    map[value] = (map[value] || 0) + 1;
  });
  // Sort keys numerically
  return Object.entries(map)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([k, v]) => ({ [key]: Number(k), count: v }));
}

export default function LineChartComponent({ alumniBatchStats }) {
  const [activeChart, setActiveChart] = useState("admission");
  // Add ref and drawer state for export functionality
  const chartRef = useRef(null);

  // Use the real fetched data
  const fetchedData = alumniBatchStats ?? [];

  // Prepare chart data for each tab
  const chartDataMap = useMemo(
    function() {
      return {
        admission: groupByCount(fetchedData, "year_started"),
        graduation: groupByCount(fetchedData, "year_graduated"),
        duration: groupByCount(fetchedData, "study_duration"),
      };
    },
    [fetchedData]
  );

  const chartConfig = {
    views : {
      label: "Alumni Count"
    },
    admission: {
      label: "Admission Year",
      color: "var(--color-astragreen)",
      dataKey: "year_started",
      xLabel: "Admission Year",
    },
    graduation: {
      label: "Graduation Year",
      color: "var(--color-astrayellow)",
      dataKey: "year_graduated",
      xLabel: "Graduation Year",
    },
    duration: {
      label: "Duration",
      color: "var(--color-astradark)",
      dataKey: "study_duration",
      xLabel: "Study Duration (years)",
    },
  };

  // Calculate total for each chart
  const total = useMemo(
    function() {
      return {
        admission: chartDataMap.admission.reduce(function(acc, curr) { return acc + curr.count; }, 0),
        graduation: chartDataMap.graduation.reduce(function(acc, curr) { return acc + curr.count; }, 0),
        duration: chartDataMap.duration.reduce(function(acc, curr) { return acc + curr.count; }, 0),
      };
    },
    [chartDataMap]
  );

  const currentConfig = chartConfig[activeChart];
  const currentData = chartDataMap[activeChart];

  const range = useMemo(function() {
    return {
      admission: {
        min: chartDataMap.admission[0]?.year_started,
        max: chartDataMap.admission[chartDataMap.admission.length - 1]?.year_started,
      },
      graduation: {
        min: chartDataMap.graduation[0]?.year_graduated,
        max: chartDataMap.graduation[chartDataMap.graduation.length - 1]?.year_graduated,
      },
      duration: {
        min: chartDataMap.duration[0]?.study_duration,
        max: chartDataMap.duration[chartDataMap.duration.length - 1]?.study_duration,
      },
    };
  }, [chartDataMap]);

  // Function to render the chart - avoids duplication
  function renderChart(showTooltip = true) {
    return (
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[300px] w-full"
      >
        <LineChart
          data={currentData}
          margin={{
            top: 24,
            bottom: 24,
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={currentConfig.dataKey}
            tickLine={true}
            axisLine={false}
            tickMargin={8}
            minTickGap={0}
            label={{
              value: currentConfig.xLabel,
              position: "insideBottom",
              offset: -16,
            }}
            tickFormatter={function(value) { return value; }}
            angle={-25}
          />
          {showTooltip && (
            <ChartTooltip
              content={function({ label, payload, active }) {
                const keySelected = Object.keys(payload[0]?.payload ?? {})[0];
                return (
                  <ChartTooltipContent
                    nameKey="views"
                    labelKey={currentConfig.dataKey}
                    label={label}
                    labelFormatter={() =>
                      keySelected === "study_duration"
                        ? `${label} year/s`
                        : `Year: ${label}`

                    }
                    indicator="line"
                    payload={payload}
                    active={active}
                  />
                );
              }}
            />
          )}
          <Line
            dataKey="count"
            type="monotone"
            stroke={currentConfig.color}
            strokeWidth={2.5}
            dot={{fill: currentConfig.color}}
            activeDot={{r: 6}}
          >
            <LabelList
              dataKey="count"
              position="top"
              offset={8}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
        </LineChart>
      </ChartContainer>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="grid gap-1 flex-1">
              <CardTitle>Alumni Batch Trends Over Time</CardTitle>
              <CardDescription>
                Showing {total[activeChart]} alumni statistics by {currentConfig.label.toLowerCase()}
              </CardDescription>

              {/* Add ReusableDrawer for export functionality */}
              <ReusableDrawer
                title={`Export ${currentConfig.label} Chart`}
                description="Download chart data or image"
                triggerElement={
                  <Button variant="outline" className="max-w-max">
                    <FileDown />
                    Export Report
                  </Button>
                }
                chartData={currentData}
                chartRef={chartRef}
                chartTitle={`Alumni ${currentConfig.label} Trends`}
              >
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-0">Alumni {currentConfig.label} Trends</h3>
                  <p className="text-sm text-muted-foreground">
                    Showing {total[activeChart]} alumni statistics by {currentConfig.label.toLowerCase()}
                  </p>
                  {renderChart(true)}
                </div>
              </ReusableDrawer>
            </div>
          </div>
        </div>
        <div className="flex">
          {["admission", "graduation", "duration"].map(function(key) {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className="flex md:whitespace-nowrap flex-1 flex-col justify-center gap-1 border-t px-3 py-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 lg:px-8 lg:py-6"
                onClick={function() { setActiveChart(key); }}
              >
                <span className="font-s text-astradark">
                  {chartConfig[key].label}
                </span>
                <span className="font-lb leading-none sm:text-3xl">
                  {range[key].min} - {range[key].max}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div ref={chartRef}>
          {renderChart(true)}
        </div>
      </CardContent>
    </Card>
  );
}
