"use client";
import { useState } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import { ActionButton } from "@/components/Buttons";
import ToastNotification from "@/components/ToastNotification";
import { Eye, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function ProjectFunds() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [toast, setToast] = useState(null);
  const [tempSelectedStatus, setTempSelectedStatus] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

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
    // Logic for filtering projects by search query
    setPagination(prev => ({
      ...prev,
      currPage: 1,
      display: [1, prev.numToShow]
    }));
  };

  // Filter projects by status
  const filteredProjects =
    selectedStatus === "All"
      ? projectFundsData
      : projectFundsData.filter((project) => project.status === selectedStatus);

  // Get current page projects
  const currentProjects = filteredProjects.slice(
    (pagination.currPage - 1) * pagination.itemsPerPage,
    pagination.currPage * pagination.itemsPerPage
  );

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
        <div className="flex flex-col py-4 px-1 md:px-4 lg:px-8">
          <TableHeader
            info={info}
            pagination={pagination}
            setPagination={setPagination}
            toggleFilter={toggleFilter}
            setSearchQuery={handleSearch}
            searchQuery={searchQuery}
          />
          <Table cols={cols} data={createRows(currentProjects, selectedIds, setSelectedIds, setToast)} />
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
      </div>
    </div>
  );
}

// Table columns definition
const cols = [
  { label: "Project", justify: "start", visible: "all" },
  { label: "Type", justify: "center", visible: "md" },
  { label: "Goal", justify: "center", visible: "lg" },
  { label: "Raised", justify: "center", visible: "sm" },
  { label: "Progress", justify: "center", visible: "lg" },
  { label: "Status", justify: "center", visible: "md" },
  { label: "Quick Actions", justify: "center", visible: "all" },
];

// Function to create table rows
function createRows(projects, selectedIds, setSelectedIds, setToast) {
  return projects.map((project) => ({
    "Project": renderProject(project.title),
    "Type": renderType(project.type),
    "Goal": renderAmount(project.goal),
    "Raised": renderAmount(project.raised),
    "Progress": renderProgress(project.raised, project.goal),
    "Status": renderStatus(project.status),
    "Quick Actions": renderActions(project.id, project.title, setToast),
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
  return <div className="text-center text-astradarkgray font-s">{amount}</div>;
}

function renderProgress(raised, goal) {
  // Extract numerical values from strings like "₱350,000"
  const raisedValue = parseInt(raised.replace(/[₱,]/g, ""));
  const goalValue = parseInt(goal.replace(/[₱,]/g, ""));
  const percentage = Math.round((raisedValue / goalValue) * 100);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full bg-astralightgray rounded-full h-2.5">
        <div
          className="bg-astrablue h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-astradarkgray mt-1">{percentage}%</div>
    </div>
  );
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

function renderActions(id, title, setToast) {
  const handleViewAnalytics = () => {
    // Analytics viewing logic
    setToast({
      type: "success",
      message: `Viewing analytics for ${title}`
    });
  };

  return (
    <div className="flex justify-center gap-3 md:pr-4 lg:pr-2">
      <div className="hidden md:block">
        <ActionButton
          label="View"
          color="gray"
          route={`/admin/projects/${id}`}
        />
      </div>
      <div className="block md:hidden">
        <ActionButton
          label={<Eye size={20}/>}
          color="gray"
          route={`/admin/projects/${id}`}
        />
      </div>
      <div className="hidden md:block">
        <ActionButton
          label="Analytics"
          color="blue"
          onClick={handleViewAnalytics}
        />
      </div>
      <div className="block md:hidden">
        <ActionButton
          label={<BarChart2 size={20}/>}
          color="blue"
          onClick={handleViewAnalytics}
        />
      </div>
    </div>
  );
}

// Sample project funds data based on the projectsData from the original file
const projectFundsData = [
  {
    id: 1,
    title: "Computer Science Scholarship Fund",
    type: "Scholarship",
    goal: "₱500,000",
    raised: "₱350,000",
    donors: 45,
    status: "Active",
  },
  {
    id: 2,
    title: "Programming Lab Equipment Drive",
    type: "Fundraiser",
    goal: "₱750,000",
    raised: "₱420,000",
    donors: 67,
    status: "Active",
  },
  {
    id: 3,
    title: "ICS Building Renovation Fund",
    type: "Fundraiser",
    goal: "₱1,200,000",
    raised: "₱185,000",
    donors: 29,
    status: "Active",
  },
  {
    id: 6,
    title: "Research Excellence Scholarship",
    type: "Scholarship",
    goal: "₱250,000",
    raised: "₱175,000",
    donors: 12,
    status: "Inactive",
  },
  {
    id: 7,
    title: "CS Library Enhancement Fund",
    type: "Fundraiser",
    goal: "₱200,000",
    raised: "₱76,000",
    donors: 31,
    status: "Active",
  },
  {
    id: 8,
    title: "Hackathon Sponsorship Fund",
    type: "Fundraiser",
    goal: "₱150,000",
    raised: "₱84,000",
    donors: 23,
    status: "Active",
  },
  {
    id: 10,
    title: "CS Department 25th Anniversary Fund",
    type: "Fundraiser",
    goal: "₱500,000",
    raised: "₱125,000",
    donors: 87,
    status: "Inactive",
  },
  {
    id: 12,
    title: "International Exchange Scholarship",
    type: "Scholarship",
    goal: "₱400,000",
    raised: "₱320,000",
    donors: 28,
    status: "Active",
  },
  {
    id: 13,
    title: "IT Career Conference Fund",
    type: "Fundraiser",
    goal: "₱120,000",
    raised: "₱35,000",
    donors: 14,
    status: "Active",
  },
  {
    id: 14,
    title: "Indigenous CS Education Fund",
    type: "Scholarship",
    goal: "₱275,000",
    raised: "₱120,000",
    donors: 19,
    status: "Inactive",
  }];