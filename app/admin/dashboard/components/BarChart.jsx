"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart as ReBarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function BarChartComponent({
  data,
  config,
  title = "Bar Chart",
  description = "",
  xKey,
  barKey,
  barLabel,
  barColor = "var(--color-desktop)",
  footer = null,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <ReBarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 30,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => typeof value === "string" ? value.slice(0, 3) : value}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey={barKey} fill={barColor} radius={[8, 8, 0, 0]}>
              <LabelList
                dataKey={barKey}
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </ReBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {footer ? (
          footer
        ) : (
          <>
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
