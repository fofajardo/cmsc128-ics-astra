"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { donationTitle: "BSCS Scholarship", funds: 50000, fill: "var(--color-pieastra-primary-100)" },
  { donationTitle: "Abot-kaya Scholarship", funds: 39200, fill: "var(--color-pieastra-primary-80)" },
  { donationTitle: "PhySci Renovation", funds: 25200, fill: "var(--color-pieastra-primary-60)" },
  { donationTitle: "E-Jeepney Modernization", funds: 16800, fill: "var(--color-pieastra-primary-40)" },
  { donationTitle: "Additions of PC", funds: 12600, fill: "var(--color-pieastra-primary-20)" },
  { donationTitle: "Additions of Server", funds: 10000, fill: "var(--color-pieastra-primary-10)" },
]

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
}

function FundDisplay({ color, title, funds }) {
  return (
    <div className="flex items-center justify-between max-w-full gap-6">
      <div className="flex items-center gap-2">
        <span
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
        ></span>
        <span className="text-astrablack font-r">{title}</span>
      </div>
      <span className="text-astraprimary font-rb text-right">
        ₱{Number(funds).toLocaleString()}
      </span>
    </div>
  );
}


export function Donut() {
  const totalFunds = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.funds, 0)
  }, [])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Highest Funded Categories</CardTitle>
        <CardDescription>January - April 2025</CardDescription>
        <hr className="h-2 border-astrablack"></hr>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[330px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              
              content={<ChartTooltipContent hideLabel showPeso={true}/>}
            />
            <Pie
              data={chartData}
              dataKey="funds"
              nameKey="donationTitle"
              innerRadius={80}
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
                          ₱{totalFunds.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Funds Raised
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <CardFooter className="flex-col gap-2 font-s">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing 6 out of 25 Donation Drives
        </div>

        <div className="mt-4 flex flex-col space-y-1.5 min-w-full gap-2">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="transition-all cursor-pointer duration-200 hover:scale-102 hover:shadow-md hover:bg-gray-50 rounded-lg px-2.5 py-1"
            >
              <FundDisplay
                title={item.donationTitle}
                funds={item.funds}
                color={item.fill}
              />
            </div>
          ))}
        </div>
      </CardFooter>
      </CardContent>
    </Card>
  )
}
