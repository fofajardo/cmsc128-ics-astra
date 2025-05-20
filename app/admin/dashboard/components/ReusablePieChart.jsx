"use client";

import { useMemo, useState } from "react";
import { Pie, PieChart, Cell } from "recharts";

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
  // If selectOptions is provided, use its data/config, else use props
  const [selected, setSelected] = useState(
    selectOptions?.defaultValue || (selectOptions?.options?.[0].value)
  );
  const [chartKey, setChartKey] = useState(selected);

  const handleSelectChange = (value) => {
    setSelected(value);
    setChartKey(value);
  };

  const chartData = selectOptions
    ? selectOptions.dataMap[selected]?.data || []
    : data;
  const chartConfig = selectOptions
    ? selectOptions.dataMap[selected]?.config || {}
    : config;

  // calculate total for percentage
  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + (item[dataKey] ?? 0), 0),
    [chartData, dataKey]
  );

  // custom label to show percentage
  const renderLabel = (entry) => {
    if (!total) return "";
    const percent = ((entry[dataKey] / total) * 100).toFixed(1);
    return `${percent}%`;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="flex flex-row items-center space-x-2 w-full">
          <div className="grid gap-1 flex-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>Showing {total} {description}</CardDescription>}
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
        <ChartContainer
          key={chartKey}
          config={chartConfig}
          className="aspect-auto h-[400px] w-full"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey={dataKey}
              label={renderLabel}
              nameKey={nameKey}
            >
            </Pie>
            <ChartLegend
              content={props => <ChartLegendContent {...props} nameKey={nameKey} />}
              className="flex-wrap"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {footer}
      </CardFooter>
    </Card>
  );
}