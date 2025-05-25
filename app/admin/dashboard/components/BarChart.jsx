"use client";

import { Bar, BarChart, CartesianGrid, LabelList, Rectangle, XAxis, YAxis } from "recharts";
import { useRef, useState } from "react";

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
import {DrawerDemo, ReusableDrawer} from "./Drawer";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

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
  const chartRef = useRef(null);

  // Calculate total alumni
  const total = data.reduce(function(sum, row) {
    return sum + (row[barKey] || 0);
  }, 0);
  
  function renderChart(showToolTip = true) {
    return (
      <ChartContainer config={config} className="aspect-auto h-[380px] w-full">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            top: 30,
          }}
        >
          <CartesianGrid vertical={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            allowDecimals={false}
            width={28}
          />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={function(value) { return value; }}
            angle={angle}
          />
          {showToolTip && (
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
          )}
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
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="grid gap-1 flex-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>Showing {total} {description}</CardDescription>}
            <ReusableDrawer
              title={`Export ${title}`}
              description="Download chart data or image"
              triggerElement={
                <Button variant="outline" className="max-w-max">
                  <FileDown />
                  Export Report
                </Button>
              }
              chartData={data}
              chartRef={chartRef}
              chartTitle={title}
            >
              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-0">{title}</h3>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
                {renderChart(true)}
              </div>
            </ReusableDrawer>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef}>
          {renderChart(true)}
        </div>
      </CardContent>
      {footer && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {footer}
        </CardFooter>
      )}
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
  const chartRef = useRef(null);
  
  // Calculate total alumni
  const total = data.reduce(
    (sum, row) =>
      sum +
      barKeys.reduce((rowSum, key) => rowSum + (row[key] || 0), 0),
    0
  );

  function renderChart(showToolTip = true) {
    return (
      <ChartContainer config={config} className="aspect-auto h-[380px] w-full">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 30 }}
        >
          <CartesianGrid vertical={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={28}
          />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={function(value) {
              return typeof value === "string" ? value.slice(0, 3) : value;
            }}
          />
          {showToolTip && (
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
          )}
          <ChartLegend content={<ChartLegendContent />} />
          {barKeys.map(function(key, idx) {
            return (
              <Bar
                key={key}
                dataKey={key}
                fill={barColors[idx] || config[key]?.color || "var(--color-desktop)"}
                stackId="a"
                shape={function(props) {
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
                      ? function(props) {
                        const { x, y, width, index } = props;
                        const total = barKeys.reduce(
                          function(sum, k) { 
                            return sum + (data[index]?.[k] || 0); 
                          },
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
                      : function(props) {
                        const { value } = props;
                        return value > 0 ? value : null;
                      }
                  }
                />
              </Bar>
            );
          })}
        </BarChart>
      </ChartContainer>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="grid gap-1 flex-1">
            <CardTitle>{title}</CardTitle>  
            {description && <CardDescription>Showing {total} {description}</CardDescription>}
            <ReusableDrawer
              title={`Export ${title}`}
              description="Download chart data or image"
              triggerElement={
                <Button variant="outline" className="max-w-max">
                  <FileDown />
                  Export Report
                </Button>
              }
              chartData={data}
              chartRef={chartRef}
              chartTitle={title}
            >
              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-0">{title}</h3>
                {description && <p className="text-sm text-muted-foreground">Showing {total} {description}</p>}
                {renderChart(true)}
              </div>
            </ReusableDrawer>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef}>
          {/* Main chart view with tooltip enabled */}
          {renderChart(true)}
        </div>
      </CardContent>
      {footer && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {footer}
        </CardFooter>
      )}
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
  const chartRef = useRef(null);
  
  // Calculate total alumni
  const total = data.reduce(function(sum, row) {
    return sum + (row[barKey] || 0);
  }, 0);

  function renderChart(showToolTip = true) {
    return (
      <ChartContainer config={config} className="aspect-auto h-[380px] w-full">
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
            tickFormatter={function(value) {
              return typeof value === "string" ? value.slice(0, 3) : value.slice(0, 3);
            }}
            hide
          />
          <XAxis dataKey={barKey} type="number" tickLine={false} axisLine={false} allowDecimals={false}/>
          {showToolTip && (
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line"/>}
              labelFormatter={yKeyLong ? function(_, payload) {
                return payload[0]?.payload?.[yKeyLong];
              } : undefined}
            />
          )}
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
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="grid gap-1 flex-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>Showing {total} {description}</CardDescription>}
            <ReusableDrawer
              title={`Export ${title}`}
              description="Download chart data or image"
              triggerElement={
                <Button variant="outline" className="max-w-max">
                  <FileDown />
                  Export Report
                </Button>
              }
              chartData={data}
              chartRef={chartRef}
              chartTitle={title}
            >
              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-0">{title}</h3>
                {description && <p className="text-sm text-muted-foreground">Showing {total} {description}</p>}
                {renderChart(true)}
              </div>
            </ReusableDrawer>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef}>
          {renderChart(true)}
        </div>
      </CardContent>
      {footer && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}