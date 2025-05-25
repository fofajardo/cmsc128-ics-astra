"use client";

import { useState } from "react";
import { Check, Download, FileText, Image, FileDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ReusableDrawer } from "./Drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const tabOptions = {
  demographics: [
    { value: "age", label: "Age", description: "View alumni age distribution." },
    { value: "sex", label: "Sex", description: "See alumni by gender." },
    { value: "civil", label: "Civil Status", description: "Civil status breakdown." },
    { value: "batch", label: "Batch", description: "Alumni by graduation batch." },
  ],
  career: [
    { value: "field", label: "Field/Industry", description: "Industries and fields of alumni." },
    { value: "employment", label: "Employment Status", description: "Employment status overview." },
    { value: "income", label: "Income Range", description: "Income range distribution." },
    { value: "org", label: "Org Affiliation", description: "Organization affiliations." },
    { value: "donations", label: "Donations", description: "Alumni donations and fundraising." },
    { value: "degree", label: "Highest Degree", description: "Highest degree obtained by alumni." },
  ],
  status: [
    { value: "alumni", label: "Alumni Status", description: "Active, inactive, and other statuses." },
    { value: "events", label: "Events", description: "Alumni events status." },
  ],
};

function getSelectedLabel(category, tab) {
  const found = tabOptions[category].find(opt => opt.value === tab);
  return found ? found.label : category.charAt(0).toUpperCase() + category.slice(1);
}

export function NavigationMenuDemo({
  tab,
  setTab,
  chartRefs, // New prop to receive references to all charts from parent
  chartData, // New prop to receive all chart data from parent
}) {
  const [exportTab, setExportTab] = useState("all");
  const [exporting, setExporting] = useState(false);

  const getCategoryByTab = (tab) => {
    for (const key in tabOptions) {
      if (tabOptions[key].some(opt => opt.value === tab)) return key;
    }
    return "demographics";
  };
  const currentCategory = getCategoryByTab(tab);

  // Function to handle export all action
  const exportAllCharts = async () => {
    if (!chartRefs || !chartData) {
      console.error("Chart refs or data missing");
      return;
    }

    setExporting(true);
    try {
      console.log("Starting export process...");

      // Create a new ZIP file
      const zip = new JSZip();

      // Add a README
      zip.file("README.txt",
        "Alumni Dashboard Export\n" +
        "Date: " + new Date().toLocaleDateString() + "\n" +
        "Time: " + new Date().toLocaleTimeString() + "\n\n" +
        "This archive contains exported data from the Alumni Dashboard."
      );

      // Create folder for data
      const dataFolder = zip.folder("chart-data");

      // Export data even if refs are null
      for (const chartKey in chartData) {
        const data = chartData[chartKey];

        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn(`No data available for ${chartKey}`);
          continue;
        }

        // Export chart data as CSV
        try {
          console.log(`Creating CSV for ${chartKey} (${data.length} rows)`);
          const headers = Object.keys(data[0]).join(",");
          const rows = data.map(item =>
            Object.values(item).map(val =>
              typeof val === "string" ? `"${val.replace(/"/g, "\"\"")}"` : val
            ).join(",")
          );
          const csv = [headers, ...rows].join("\n");
          dataFolder.file(`${chartKey}.csv`, csv);
          console.log(`Successfully created CSV for ${chartKey}`);
        } catch (csvErr) {
          console.error(`Error creating CSV for ${chartKey}:`, csvErr);
        }
      }

      // Generate and download the ZIP file
      console.log("Generating ZIP...");
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `alumni-dashboard-data-${new Date().toISOString().slice(0,10)}.zip`);
      console.log("Export complete!");
      alert("Data exported successfully! Note: Chart images could not be included because the chart components aren't properly configured with refs.");

    } catch (err) {
      console.error("Error exporting data:", err);
      alert("An error occurred while exporting data. Please check the console for details.");
    } finally {
      setExporting(false);
    }
  };

  const exportChartByKey = async (chartKey) => {
    const data = chartData?.[chartKey];

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error(`No data available for ${chartKey}`);
      alert(`Cannot export ${chartKey}: No data available`);
      return;
    }

    setExporting(true);
    try {
      console.log(`Exporting data for: ${chartKey}`);

      // Create CSV content directly
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map(item =>
        Object.values(item).map(val =>
          typeof val === "string" ? `"${val.replace(/"/g, "\"\"")}"` : val
        ).join(",")
      );
      const csv = [headers, ...rows].join("\n");

      // Create a blob and save it directly
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${chartKey}-data-${new Date().toISOString().slice(0,10)}.csv`);
      console.log(`Export of ${chartKey} complete!`);

    } catch (err) {
      console.error(`Error exporting chart ${chartKey}:`, err);
      alert(`An error occurred while exporting "${chartKey}". Please check the console for details.`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full relative">
      <div className="flex flex-col md:flex-row md:items-center">
        <NavigationMenu className="md:w-2xl w-full">
          <NavigationMenuList className="w-full flex-wrap gap-2">
            <NavigationMenuItem>
              <div className="font-sb">
                Demographics
              </div>
              <NavigationMenuTrigger>
                {currentCategory === "demographics" && getSelectedLabel("demographics", tab) !== "Demographics" ? (
                  <span className="font-semibold text-astraprimary flex items-center gap-1 truncate line-clamp-1">
                    {getSelectedLabel("demographics", tab)}
                  </span>
                ) : (
                  "Select..."
                )}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid grid-cols-2 gap-2 p-3 w-90 md:w-max">
                  {tabOptions.demographics.map(opt => (
                    <li key={opt.value}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded transition-colors ${
                          tab === opt.value
                            ? "bg-astraprimary text-white"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => setTab(opt.value)}
                        type="button"
                      >
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-xs text-foreground">{opt.description}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <div className="font-sb">
                Career
              </div>
              <NavigationMenuTrigger>
                {currentCategory === "career" && getSelectedLabel("career", tab) !== "Career" ? (
                  <span className="font-semibold text-primary flex items-center gap-1 truncate line-clamp-1">
                    {getSelectedLabel("career", tab)}
                  </span>
                ) : (
                  "Select..."
                )}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid grid-cols-2 gap-2 p-4 w-90 md:w-max">
                  {tabOptions.career.map(opt => (
                    <li key={opt.value}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded transition-colors ${
                          tab === opt.value
                            ? "bg-astraprimary text-white"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => setTab(opt.value)}
                        type="button"
                      >
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-xs text-foreground">{opt.description}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <div className="font-sb">
                Status
              </div>
              <NavigationMenuTrigger>
                {currentCategory === "status" && getSelectedLabel("status", tab) !== "Status" ? (
                  <span className="font-semibold text-primary flex items-center gap-1 truncate line-clamp-1">
                    {getSelectedLabel("status", tab)}
                  </span>
                ) : (
                  "Select..."
                )}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid grid-cols-2 gap-1 p-4 w-90 md:w-max">
                  {tabOptions.status.map(opt => (
                    <li key={opt.value}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded transition-colors ${
                          tab === opt.value
                            ? "bg-primary text-white"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => setTab(opt.value)}
                        type="button"
                      >
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-xs text-foreground">{opt.description}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem className="w-full md:w-auto order-last md:order-none md:ml-0 md:mt-5">
              <ReusableDrawer
                title="Export Dashboard Data"
                description="Download all charts and data from the dashboard"
                triggerElement={
                  <Link href="#" className="w-full">
                    <div className={navigationMenuTriggerStyle()}>
                      <Download className="mr-1 size-4.5" />
                      Export All
                    </div>
                  </Link>
                }
                chartData={chartData}
                chartRef={chartRefs}
                buttons={false}
              >
                <div className="bg-white p-4 rounded-lg max-h-[80vh] overflow-hidden flex flex-col">
                  <h2 className="text-lg font-bold">Export Dashboard Data</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose what you want to export from the dashboard
                  </p>

                  <Tabs defaultValue="all" value={exportTab} onValueChange={setExportTab} className="w-full">
                    <TabsList>
                      <TabsTrigger value="all">All Charts</TabsTrigger>
                      <TabsTrigger value="individual">Individual Charts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-4">
                      <div className="space-y-4">
                        <p>Export all charts and their data as a ZIP file containing:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {/* <li className="flex items-center">
                            <Image className="h-4 w-4 mr-2" />
                            <span>PNG images of all charts</span>
                          </li> */}
                          <li className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            <span>CSV files with raw chart data</span>
                          </li>
                        </ul>

                        <Button
                          onClick={exportAllCharts}
                          disabled={exporting || !chartRefs || Object.keys(chartRefs).length === 0}
                          className="w-full"
                        >
                          {exporting ? "Preparing Export..." : "Export All Charts"}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="individual" className="mt-4">
                      <div>
                        <p className="mb-2">Select individual charts to export:</p>
                        <div className="h-[300px] overflow-y-auto pr-4">
                          <div className="space-y-2">
                            {chartRefs && Object.keys(chartRefs).map((chartKey) => {
                              // Format chart key for display (camelCase to Title Case)
                              const chartName = chartKey
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase());

                              return (
                                <div key={chartKey} className="flex justify-between items-center p-2 border rounded-md">
                                  <div>
                                    <p className="font-medium">{chartName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {chartData?.[chartKey]?.length || 0} data points
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => exportChartByKey(chartKey)}
                                    disabled={exporting}
                                    variant="outline"
                                  >
                                    <FileDown className="h-4 w-4 mr-1" />
                                    Export
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </ReusableDrawer>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
