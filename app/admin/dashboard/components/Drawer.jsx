"use client";

import * as React from "react";
import { Download, FileDown, ImageDown, Table } from "lucide-react";
import html2canvas from "html2canvas-pro";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ReusableDrawer({
  title = "Export Data",
  description = "Download chart data or image",
  triggerElement,
  children,
  chartData,
  chartRef,
  chartTitle = "Chart",
  open,
  onOpenChange,
  buttons = true
}) {

  function convertToCSV(data) {
    if (!data || !data.length) return "";

    // Get headers from first object
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(","));

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Handle string values with commas by quoting them
        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : value;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  }

  function downloadCSV() {
    if (!chartData || !chartData.length) return;

    const csv = convertToCSV(chartData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", `${chartTitle.toLowerCase().replace(/\s+/g, "_")}_data.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function downloadImage() {
    const chartPreviewContainer = document.querySelector("[data-tab=\"chart\"] .bg-white");

    if (!chartPreviewContainer) {
      // Fallback to chartRef if preview container not found
      if (!chartRef || !chartRef.current) {
        alert("Chart reference not available.");
        return;
      }
    }

    try {
      // Get the element to capture (preview container or direct chart)
      const elementToCapture = chartPreviewContainer || chartRef.current;

      // Create a promise to handle the capture
      const capturePromise = new Promise((resolve, reject) => {
        // Use html2canvas-pro with improved settings
        html2canvas(elementToCapture, {
          backgroundColor: "#ffffff",
          scale: 2,  // Higher quality
          logging: false,
          useCORS: true,
          allowTaint: true,

          // Fix color issues by applying custom style preprocessor
          onBeforeCapture: (canvas, ctx, elements) => {
            // Can modify canvas context here if needed
            return { canvas, ctx };
          },

          // Properly handle font family and text
          fontFaces: true
        }).then(canvas => {
          resolve(canvas);
        }).catch(error => {
          console.error("Canvas capture error:", error);
          reject(error);
        });
      });

      capturePromise.then(canvas => {
        // Export the canvas as PNG
        try {
          const imgURL = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = `${chartTitle.toLowerCase().replace(/\s+/g, "_")}_chart.png`;
          link.href = imgURL;
          link.click();
        } catch (e) {
          console.error("Canvas export error:", e);
          alert("Failed to export image. This might be due to cross-origin restrictions.");
        }
      }).catch(() => {
        alert("Failed to capture chart image. Please try a screenshot instead.");
      });
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to capture chart image. Please try a screenshot instead.");
    }
  }

  // Preview CSV in the drawer
  function renderCSVPreview() {
    if (!chartData || !chartData.length) return <p>No data available</p>;

    const headers = Object.keys(chartData[0]);
    return (
      <div className="overflow-auto max-h-96 border rounded">
        <table className="w-full text-sm">
          <thead className="bg-muted sticky top-0">
            <tr>
              {headers.map((header, i) => (
                <th key={i} className="p-2 text-left font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chartData.slice(0, 100).map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                {headers.map((header, j) => (
                  <td key={j} className="p-2 border-t">{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {chartData.length > 100 && (
          <div className="p-2 text-center text-muted-foreground bg-muted/20 text-sm">
            Showing 100 of {chartData.length} rows
          </div>
        )}
      </div>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        {triggerElement}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader className="grid flex-1 gap-0 px-4 py-1">
            <DrawerTitle className="font-rb">{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-0">
            <Tabs defaultValue="csv">
              <TabsList className="mb-0">
                <TabsTrigger value="csv">
                  <Table className="mr-1 h-4 w-4" />
                  Data Preview
                </TabsTrigger>
                <TabsTrigger value="chart">
                  <ImageDown className="mr-1 h-4 w-4" />
                  Chart Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="csv" className="p-0">
                {renderCSVPreview()}
                <div className="mt-4 mb-4 flex justify-end">
                  {buttons && <Button onClick={downloadCSV}>
                    <FileDown />
                    Download CSV
                  </Button> }
                </div>
              </TabsContent>
              <TabsContent value="chart" data-tab="chart">
                <div className="bg-white p-2 rounded-lg border">
                  {children}
                </div>
                <div className="mt-4 mb-4 flex justify-end">
                  {buttons && <Button onClick={downloadImage}>
                    <Download />
                    Save Image
                  </Button> }
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
