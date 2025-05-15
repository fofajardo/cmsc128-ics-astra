"use client";
import { useState, useEffect } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import { Eye, BarChart2 } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";
import {GoBackButton} from "@/components/Buttons";
import axios from "axios";
import { formatCurrency, capitalizeName } from "@/utils/format";
import { PROJECT_STATUS, PROJECT_STATUS_LABELS } from "@/constants/projectConsts";

/*
Projects are considered active if they satisfy the ff:
project_status is awaiting budget (0) or ongoing (1)
request_status is approved
*/
export default function ProjectFunds() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [toast, setToast] = useState(null);
  const [tempSelectedStatus, setTempSelectedStatus] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState({ field: "", order: "asc" });
  const [tempSortBy, setTempSortBy] = useState({ field: "", order: "asc" });
  const [totalFundsRaised, setTotalFundsRaised] = useState(0);

  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationsSummary, setDonationsSummary] = useState({ total_raised: 0 });

  useEffect(() => {
    const fetchProjectRequest = async () => {
      try {
        setLoading(true);
        const projectResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests/projects`);
        const projectData = projectResponse.data;
        console.log("Raw API Response:", projectData);
        if (projectData.status === "OK") {
          const mappedProjects = projectData.list.map(
            project => {
              console.log("Complete Project Data:", {
                request_id: project.request_id,
                status: project.status,
                projectData: {
                  project_id: project.projectData.project_id,
                  title: project.projectData.title,
                  type: project.projectData.type,
                  goal_amount: project.projectData.goal_amount,
                  total_donations: project.projectData.total_donations,
                  number_of_donors: project.projectData.number_of_donors,
                  project_status: project.projectData.project_status,
                  due_date: project.projectData.due_date,
                  date_complete: project.projectData.date_complete,
                  donation_link: project.projectData.donation_link,
                  details: project.projectData.details
                },
                requesterData: project.requesterData
              });
              return {
                id: project.projectData.project_id,
                title: project.projectData.title,
                type: capitalizeName(project.projectData.type),
                goal: project.projectData.goal_amount.toString(),
                raised: project.projectData.total_donations.toString(),
                donors: project.projectData.number_of_donors.toString(),
                project_status: project.projectData.project_status,
                request_status: project.status
              };
            }
          );
          console.log("Final Mapped Projects:", mappedProjects);
          setProjectData(mappedProjects);
        } else {
          console.error("Unexpected response:", projectData);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDonationsSummary = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/donations/summary`);
        const donationSummaryData = response.data;
        if (donationSummaryData.status === "OK") {
          console.log("Fetched donation summary:", donationSummaryData);
          setDonationsSummary({
            total_raised: donationSummaryData.summary.total_raised
          });
        } else {
          console.error("Unexpected response:", donationSummaryData);
        }
      } catch (error) {
        console.error("Failed to fetch donation summary:", error);
      }
    };

    fetchDonationsSummary();
    fetchProjectRequest();
  }, []);

  // Information for the table header
  const [info, setInfo] = useState({
    title: "Project Funds",
    search: "Search for a project",
  });

  // Toggle filter modal
  const toggleFilter = () => {
    setTempSelectedStatus(selectedStatus); // reset modal input to current selection
    setShowFilter((prev) => !prev);
  };

  // Pagination state
  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: 2,
    numToShow: 10,
    total: 16,
    itemsPerPage: 10
  });

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (searchInput) => {
    setSearchQuery(searchInput);
    // Reset pagination when searching
    setPagination(prev => ({
      ...prev,
      currPage: 1,
      display: [1, prev.numToShow]
    }));
  };

  // Apply both search, status filters, and sorting to the projects
  const filteredProjects = projectData
    .filter(project => {
      // Apply status filter
      if (selectedStatus !== "All") {
        if (selectedStatus === "Pending" && project.request_status !== 0) {
          return false;
        }
        if (selectedStatus === "Active" && !(project.project_status < 2 && project.request_status === 1)) {
          return false;
        }
        if (selectedStatus === "Inactive" && !(project.project_status === 2 || project.request_status === 2)) {
          return false;
        }
      }

      // Apply search filter (case insensitive)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          project.title.toLowerCase().includes(query) ||
          project.type.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (!sortBy.field) return 0;

      let comparison = 0;
      switch (sortBy.field) {
      case "goal":
        comparison = parseInt(a.goal.replace(/[₱,]/g, "")) - parseInt(b.goal.replace(/[₱,]/g, ""));
        break;
      case "raised":
        comparison = parseInt(a.raised.replace(/[₱,]/g, "")) - parseInt(b.raised.replace(/[₱,]/g, ""));
        break;
      case "type":
        comparison = a.type.localeCompare(b.type);
        break;
      default:
        return 0;
      }

      return sortBy.order === "asc" ? comparison : -comparison;
    });

  // Update pagination based on filtered results
  useEffect(() => {
    const totalPages = Math.ceil(filteredProjects.length / pagination.itemsPerPage) || 1;

    setPagination(prev => ({
      ...prev,
      total: filteredProjects.length,
      lastPage: totalPages,
      currPage: prev.currPage > totalPages ? 1 : prev.currPage
    }));
  }, [filteredProjects.length, pagination.itemsPerPage]);

  // Get current page projects
  const currentProjects = filteredProjects.slice(
    (pagination.currPage - 1) * pagination.itemsPerPage,
    pagination.currPage * pagination.itemsPerPage
  );

  // Calculate total funds raised whenever filtered projects change
  useEffect(() => {
    const total = filteredProjects.reduce((sum, project) => {
      // Extract numerical value from string like "₱350,000"
      const raisedValue = parseInt(project.raised.replace(/[₱,]/g, ""));
      return sum + raisedValue;
    }, 0);

    setTotalFundsRaised(total);
  }, [filteredProjects]);

  return (
    <div>
      {/* Toast notification */}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      {/* Filter Modal */}
      {showFilter && (
        <div
          onClick={toggleFilter}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-astrawhite p-8 rounded-xl w-96"
          >
            <h3 className="font-lb text-xl mb-4">Filter & Sort Projects</h3>
            <div className="flex flex-col gap-4">
              {/* Status Filter */}
              <div>
                <label className="font-s text-astradarkgray mb-2 block">
                  Project Status
                </label>
                <select
                  className="w-full p-2 border border-astragray rounded-lg"
                  value={tempSelectedStatus}
                  onChange={(e) => setTempSelectedStatus(e.target.value)}
                >
                  <option value="All">All Projects</option>
                  <option value="Pending">Awaiting Budget</option>
                  <option value="Active">Ongoing</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="font-s text-astradarkgray mb-2 block">
                  Sort By
                </label>
                <select
                  className="w-full p-2 border border-astragray rounded-lg mb-2"
                  value={tempSortBy.field}
                  onChange={(e) => setTempSortBy(prev => ({ ...prev, field: e.target.value }))}
                >
                  <option value="">No Sorting</option>
                  <option value="goal">Goal Amount</option>
                  <option value="raised">Raised Amount</option>
                  <option value="type">Project Type</option>
                </select>
              </div>

              {/* Sort Order */}
              {tempSortBy.field && (
                <div>
                  <label className="font-s text-astradarkgray mb-2 block">
                    Sort Order
                  </label>
                  <select
                    className="w-full p-2 border border-astragray rounded-lg"
                    value={tempSortBy.order}
                    onChange={(e) => setTempSortBy(prev => ({ ...prev, order: e.target.value }))}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button className="gray-button" onClick={toggleFilter}>
                  Cancel
                </button>
                <button
                  className="blue-button"
                  onClick={() => {
                    setSelectedStatus(tempSelectedStatus);
                    setSortBy(tempSortBy);
                    setPagination((prev) => ({
                      ...prev,
                      currPage: 1,
                      display: [1, prev.numToShow],
                    }));
                    toggleFilter();
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with background */}
      <div className="relative">
        <img
          src="/blue-bg.png"
          alt="Background"
          className="h-48 w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-astrawhite z-20">
          <div className="text-center">
            <h1 className="font-h1">Project Funds</h1>
            <p className="font-s mt-2">Financial overview of ongoing and completed projects</p>
          </div>
        </div>
      </div>

      {/* Total Funds Raised Section */}
      <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-astrawhite rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold text-astradark mb-2">Total Funds Raised</h3>
              <p className="text-3xl font-bold text-astraprimary">
                {formatCurrency(donationsSummary.total_raised)}
              </p>
              <p className="text-sm text-astradark mt-2">
                {searchQuery ? `From search results for "${searchQuery}"` :
                  selectedStatus === "All" ? "Across all approved projects" :
                    `From ${selectedStatus.toLowerCase()} projects only`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
        <div className="max-w-6xl px-4 mt-4">
          <GoBackButton />
        </div>
        <div className="flex flex-col py-4 px-1 md:px-4 lg:px-8">
          <TableHeader
            info={info}
            pagination={pagination}
            setPagination={setPagination}
            toggleFilter={toggleFilter}
            setSearchQuery={handleSearch}
            searchQuery={searchQuery}
          />

          {/* Show message when no results found */}
          {filteredProjects.length === 0 ? (
            <div className="bg-astrawhite rounded-lg p-8 text-center my-4">
              <p className="text-astradarkgray">No projects found matching your criteria</p>
              {searchQuery && (
                <button
                  className="text-astrablue mt-2 underline"
                  onClick={() => handleSearch("")}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <Table cols={cols} data={createRows(currentProjects, selectedIds, setSelectedIds, setToast)} />
                </div>
              </div>
            </div>
          )}

          {filteredProjects.length > 0 && (
            <PageTool pagination={pagination} setPagination={setPagination} />
          )}
        </div>
      </div>
    </div>
  );
}

// Table columns definition
const cols = [
  { label: "Project", justify: "start", visible: "all" },
  { label: "Type", justify: "center", visible: "md" },
  { label: "Raised", justify: "center", visible: "sm" },
  { label: "Goal", justify: "center", visible: "lg" },
  { label: "Status", justify: "center", visible: "md" },
];

// Function to create table rows
function createRows(projects, selectedIds, setSelectedIds, setToast) {
  return projects.map((project) => ({
    "Project": renderProject(project.title),
    "Type": renderType(project.type),
    "Raised": renderAmount(project.raised, true),
    "Goal": renderAmount(project.goal, false),
    "Status": renderStatus(project.project_status),
  }));
}

// Helper functions for rendering table cells
function renderProject(title) {
  return (
    <div className="font-s font-semibold py-5 pl-2">{title}</div>
  );
}

function renderType(type) {
  let bgColor;
  switch (type) {
  case "Scholarship":
    bgColor = "bg-astralight text-astrawhite";
    break;
  case "Donation Drive":
    bgColor = "bg-astragreen text-astratintedwhite";
    break;
  default:
    bgColor = "bg-astralightgray text-astradirtywhite";
  }

  return (
    <div className="text-center">
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${bgColor}`}>
        {type}
      </span>
    </div>
  );
}

function renderAmount(amount, isRaised) {
  return (
    <div className={`text-center font-s ${isRaised ? "text-astraprimary" : "text-astradark"}`}>
      {formatCurrency(amount)}
    </div>
  );
}

function renderStatus(project_status) {
  let bgColor;
  switch (project_status) {
  case PROJECT_STATUS.AWAITING_BUDGET:
    bgColor = "bg-yellow-100 text-astrayellow";
    break;
  case PROJECT_STATUS.ONGOING:
    bgColor = "bg-green-100 text-astragreen";
    break;
  case PROJECT_STATUS.FINISHED:
    bgColor = "bg-red-100 text-astrared";
    break;
  default:
    bgColor = "bg-red-100 text-astrared";
  }

  return (
    <div className="text-center">
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${bgColor}`}>
        {PROJECT_STATUS_LABELS[project_status]}
      </span>
    </div>
  );
}