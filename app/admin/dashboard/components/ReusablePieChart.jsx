"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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

export default function ReusablePieChart({
  data,
  config,
  title = "Pie Chart",
  description = "",
  dataKey = "value",
  nameKey = "name",
  footer = "",
  maxHeight = 250,
}) {
  // calculate total for percentage
  const total = useMemo(
    () => data.reduce((sum, item) => sum + (item[dataKey] ?? 0), 0),
    [data, dataKey]
  );

  // custom label to show percentage
  const renderLabel = (entry) => {
    if (!total) return "";
    const percent = ((entry[dataKey] / total) * 100).toFixed(1);
    return `${percent}%`;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>Showing {total} {description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0 px-4">
        <ChartContainer
          config={config}
          className="aspect-auto h-[400px] w-full"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey={dataKey}
              label={renderLabel}
              nameKey={nameKey}
            />
            <ChartLegend
              content={props => <ChartLegendContent {...props} nameKey={nameKey} />}
              className="flex-wrap"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
      </CardFooter>
    </Card>
  );
}