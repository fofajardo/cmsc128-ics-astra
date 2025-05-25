"use client";

import { useMemo, useState, useRef } from "react";
import { Pie, PieChart, Cell } from "recharts";
import { FileDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
  ChartLegend,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ReusableDrawer } from "./Drawer";

export default function ReusablePieChart({
  data,
  config,
  title = "Pie Chart",
  description = "",
  dataKey = "value",
  nameKey = "name",
  footer = "",
  maxHeight = 250,
  selectOptions = null, // { options: [{ label, value }], dataMap: { [value]: { data, config } }, defaultValue }
}) {
  // Chart ref for export functionality
  const chartRef = useRef(null);

  // If selectOptions is provided, use its data/config, else use props
  const [selected, setSelected] = useState(
    "status"
  );
  const [chartKey, setChartKey] = useState(selected);

  function handleSelectChange(value) {
    setSelected(value);
    setChartKey(value);
  }

  const chartData = selectOptions
    ? selectOptions.dataMap[selected]?.data || []
    : data;
  const chartConfig = selectOptions
    ? selectOptions.dataMap[selected]?.config || {}
    : config;

  // calculate total for percentage
  const total = useMemo(
    function () {
      return chartData.reduce(function (sum, item) {
        return sum + (item[dataKey] ?? 0);
      }, 0);
    },
    [chartData, dataKey]
  );

  // Function to render the chart - avoids duplication
  function renderChart(showTooltip = true, forExport = false) {
    return (
      <ChartContainer
        key={chartKey}
        config={chartConfig}
        className="aspect-auto h-[400px] w-full"
      >
        <PieChart>
          {showTooltip && (
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          )}
          <Pie
            data={chartData}
            dataKey={dataKey}
            label={(entry) => renderLabel(entry, forExport)}
            nameKey={nameKey}
          >
            {chartData.map(function (entry, index) {
              const colorKey = entry[nameKey];
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    chartConfig[colorKey]?.color ||
                    `var(--chart-${index % 10})`
                  }
                />
              );
            })}
          </Pie>
          <ChartLegend
            content={function (props) {
              return <ChartLegendContent {...props} nameKey={nameKey} />;
            }}
            className="flex-wrap"
          />
        </PieChart>
      </ChartContainer>
    );
  }

  // custom label to show percentage
  function renderLabel(entry, forExport = false) {
    if (!total) return "";
    const percent = ((entry[dataKey] / total) * 100).toFixed(1);

    // If for export, show both value and percentage
    if (forExport) {
      return `${entry[dataKey]} (${percent}%)`;
    }

    // Otherwise, just show percentage
    return `${percent}%`;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="flex flex-row items-center space-x-2 w-full">
          <div className="grid gap-1 flex-1">
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription>
                Showing {total} {description}
              </CardDescription>
            )}

            {/* Add ReusableDrawer for export functionality */}
            <ReusableDrawer
              title={`Export ${title}`}
              description="Download chart data or image"
              triggerElement={
                <Button variant="outline" className="max-w-max">
                  <FileDown />
                  Export Report
                </Button>
              }
              chartData={chartData}
              chartRef={chartRef}
              chartTitle={title}
            >
              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-0">{title}</h3>
                {description && (
                  <p className="text-sm text-muted-foreground">
                    Showing {total} {description}
                  </p>
                )}
                {/* Render chart with values+percentages for export */}
                {renderChart(true, true)}
              </div>
            </ReusableDrawer>
          </div>

          {selectOptions && (
            <Select value={selected} onValueChange={handleSelectChange}>
              <SelectTrigger
                className="ml-auto h-7 max-w-full rounded-lg pl-2.5"
                aria-label="Select chart type"
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl">
                {selectOptions.options.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0 px-4">
        <div ref={chartRef}>{renderChart(true)}</div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">{footer}</CardFooter>
    </Card>
  );
}