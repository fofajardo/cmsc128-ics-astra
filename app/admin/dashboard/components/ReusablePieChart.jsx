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
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0 px-4">
        <ChartContainer
          config={config}
          className={`mx-auto aspect-square max-h-[${maxHeight + 10}px] font-s pb-0 [&_.recharts-pie-label-text]:fill-foreground [&_.recharts-pie-label-text]:text-xs [&_.recharts-pie-label-text]:font-semibold [&_.recharts-pie-label-text]:leading-none`}
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
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {footer && <p className="text-muted-foreground">{footer}</p>}
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Total: {total}</span>
        </div>
      </CardFooter>
    </Card>
  );
}