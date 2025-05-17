"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, Rectangle, XAxis, YAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function BarChartComponent({
  data,
  config,
  title = "Bar Chart",
  description = "",
  xKey,
  barKey,
  barLabel,
  angle = 0,
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
          <BarChart
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
              tickFormatter={(value) => value}
              angle={angle}
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
          </BarChart>
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
  );
}

export function StackedBarChart({
  data,
  config,
  title = "Stacked Bar Chart",
  description = "",
  xKey,
  barKeys = [],
  barColors = [],
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
          <BarChart
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
              tickFormatter={(value) =>
                typeof value === "string" ? value.slice(0, 3) : value
              }
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {barKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                fill={barColors[idx] || config[key]?.color || "var(--color-desktop)"}
                stackId="a"
                shape={(props) => {
                  const { index } = props;
                  let topIdx = barKeys.length - 1;
                  while (topIdx > 0 && (!data[index] || !data[index][barKeys[topIdx]])) {
                    topIdx--;
                  }
                  const isTop = idx === topIdx;
                  return <Rectangle {...props} radius={isTop ? [8, 8, 0, 0] : [0, 0, 0, 0]} />;
                }}
              >
                <LabelList
                  dataKey={key}
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  content={
                    idx === barKeys.length - 1
                      ? (props) => {
                        const { x, y, width, index } = props;
                        const total = barKeys.reduce(
                          (sum, k) => sum + (data[index]?.[k] || 0),
                          0
                        );
                        return total > 0 ? (
                          <text
                            x={x + width / 2}
                            y={y - 8}
                            textAnchor="middle"
                            className="fill-foreground"
                            fontSize={12}
                          >
                            {total}
                          </text>
                        ) : null;
                      }
                      : (props) => {
                        const { value } = props;
                        return value > 0 ? value : null;
                      }
                  }
                />
              </Bar>
            ))}
          </BarChart>
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
  );
}

export function VerticalBarChart({
  data,
  config,
  title = "Vertical Bar Chart",
  description = "",
  yKey = "month",
  yKeyLong = null,
  barKey = "desktop",
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
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey={yKey}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                typeof value === "string" ? value.slice(0, 3) : value
              }
              hide
            />
            <XAxis dataKey={barKey} type="number" hide />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line"/>}
              labelFormatter={yKeyLong ? (_, payload) => payload[0]?.payload?.[yKeyLong] : undefined}
            />
            <Bar
              dataKey={barKey}
              layout="vertical"
              fill={barColor}
              radius={4}
            >
              <LabelList
                dataKey={yKey}
                position="insideLeft"
                offset={8}
                className="fill-(--color-astrawhite)"
                fontSize={12}
              />
              <LabelList
                dataKey={barKey}
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
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
  );
}