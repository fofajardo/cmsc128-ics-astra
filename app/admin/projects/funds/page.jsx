"use client";
import { useState, useEffect } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import { Eye, BarChart2 } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";
import {GoBackButton} from "@/components/Buttons";
import axios from "axios";
import { formatCurrency, capitalizeName } from "@/utils/format";

export default function ProjectFunds() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [toast, setToast] = useState(null);
  const [tempSelectedStatus, setTempSelectedStatus] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [totalFundsRaised, setTotalFundsRaised] = useState(0);

  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectRequest = async () => {
      try {
        setLoading(true);
        const projectResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects`, {
          params: {
            page: -1
          }
        });
        const projectData = projectResponse.data;
        console.log(projectData);
        if (projectData.status === "OK") {

          setProjectData(
            projectData.projects.map(
              project => ({
                id: project.project_id,
                title: project.title,
                type: capitalizeName(project.type),
                goal: project.goal_amount.toString(),
                raised: project.total_donations.toString(),
                donors: project.number_of_donors.toString(),
                project_status: project.project_status !== 2 ? "Active" : "Inactive",
                request_status: "",
              })
            )
          );

        } else {
          console.error("Unexpected response:", projectData);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

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

  // Apply both search and status filters to the projects
  const filteredProjects = projectData
    .filter(project => {
      // Apply status filter
      if (selectedStatus !== "All" && project.project_status !== selectedStatus) {
        return false;
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
            className="bg-astrawhite p-8 rounded-xl w-80"
          >
            <h3 className="font-lb text-xl mb-4">Filter Projects</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-s text-astradarkgray mb-2 block">
                  Status
                </label>
                <select
                  className="w-full p-2 border border-astragray rounded-lg"
                  value={tempSelectedStatus}
                  onChange={(e) => setTempSelectedStatus(e.target.value)}
                >
                  <option value="All">All Projects</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button className="gray-button" onClick={toggleFilter}>
                  Cancel
                </button>
                <button
                  className="blue-button"
                  onClick={() => {
                    setSelectedStatus(tempSelectedStatus); // apply the filter
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
            <Table cols={cols} data={createRows(currentProjects, selectedIds, setSelectedIds, setToast)} />
          )}

          {filteredProjects.length > 0 && (
            <PageTool pagination={pagination} setPagination={setPagination} />
          )}

          {/* Total Funds Raised Section */}
          <div className="mt-6 bg-astrawhite rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold text-astradarkgray mb-2">Total Funds Raised</h3>
              <p className="text-3xl font-bold text-astrablue">
                {formatCurrency(totalFundsRaised)}
              </p>
              <p className="text-sm text-astragray mt-2">
                {searchQuery ? `From search results for "${searchQuery}"` :
                  selectedStatus === "All" ? "Across all projects" :
                    `From ${selectedStatus.toLowerCase()} projects only`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Table columns definition - removed Progress and Quick Actions columns
const cols = [
  { label: "Project", justify: "start", visible: "all" },
  { label: "Type", justify: "center", visible: "md" },
  { label: "Goal", justify: "center", visible: "lg" },
  { label: "Raised", justify: "center", visible: "sm" },
  { label: "Status", justify: "center", visible: "md" },
];

// Function to create table rows
function createRows(projects, selectedIds, setSelectedIds, setToast) {
  return projects.map((project) => ({
    "Project": renderProject(project.title),
    "Type": renderType(project.type),
    "Goal": renderAmount(project.goal),
    "Raised": renderAmount(project.raised),
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
  return (
    <div className="text-center">
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
        type === "Scholarship" ? "bg-astralightblue text-astrablue" : "bg-astralightgreen text-astragreen"
      }`}>
        {type}
      </span>
    </div>
  );
}

function renderAmount(amount) {
  return <div className="text-center text-astradarkgray font-s">{formatCurrency(amount)}</div>;
}

function renderStatus(status) {
  return (
    <div className="text-center">
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
        status === "Active" ? "bg-astralightgreen text-astragreen" : "bg-astralightgray text-astradarkgray"
      }`}>
        {status}
      </span>
    </div>
  );
}