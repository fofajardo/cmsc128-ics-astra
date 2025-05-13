"use client";

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
  footer = null,
  maxHeight = 250,
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className={`mx-auto aspect-square max-h-[${maxHeight}px] pb-0 [&_.recharts-pie-label-text]:fill-foreground`}
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey={dataKey}
              label
              nameKey={nameKey}
            />
            <ChartLegend
              content={props => <ChartLegendContent {...props} nameKey={nameKey} />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {footer ? (
          footer
        ) : (
          <>
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}