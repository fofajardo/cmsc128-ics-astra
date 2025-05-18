"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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

export default function InteractiveLineChart({
  chartConfigs, // {admission: {...}, graduation: {...}, duration: {...}}
  initialTab = "graduation",
  labelFormatter = (value) => value,
}) {
  const tabKeys = Object.keys(chartConfigs);
  const [activeTab, setActiveTab] = React.useState(
    tabKeys.includes(initialTab) ? initialTab : tabKeys[0]
  );

  const { data, xKey, title, description, config } = chartConfigs[activeTab];
  const chartKeys = Object.keys(config);
  const [activeChart, setActiveChart] = React.useState(chartKeys[0]);

  // update activeChart if config changes
  React.useEffect(() => {
    setActiveChart(chartKeys[0]);
  }, [activeTab]);

  // calculate totals for each chart key
  const total = React.useMemo(() => {
    const totals = {};
    chartKeys.forEach((key) => {
      totals[key] = data.reduce((acc, curr) => acc + (curr[key] ?? 0), 0);
    });
    return totals;
  }, [data, chartKeys]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex gap-2">
          {tabKeys.map((key) => (
            <button
              key={key}
              className={`px-4 py-2 rounded ${activeTab === key ? "bg-astraprimary text-white" : "bg-gray-200"}`}
              onClick={() => setActiveTab(key)}
            >
              {chartConfigs[key].tabLabel ?? key}
            </button>
          ))}
        </div>
        {chartKeys.length > 1 && (
          <div className="flex">
            {chartKeys.map((key) => (
              <button
                key={key}
                data-active={activeChart === key}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-xs text-muted-foreground">
                  {config[key]?.label ?? key}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key]?.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={config[activeChart]?.label ?? activeChart}
                  labelFormatter={labelFormatter}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={config[activeChart]?.color ?? `var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
