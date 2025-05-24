"use client";
import { useState, useEffect } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import { ActionButton } from "@/components/Buttons";
import ToastNotification from "@/components/ToastNotification";
// Removed lucide icon imports
import Link from "next/link";
import {GoBackButton} from "@/components/Buttons";
import axios from "axios";
import { formatCurrency, formatDate } from "@/utils/format";
import { LoadingSpinner } from "@/components/LoadingSpinner";

/*
Contributors shown are unique by both name and project.
If a contributor donated multiple times to the same project,
they will appear only once, with the total amount summed under the Donation column.
*/
export default function Contributors() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [toast, setToast] = useState(null);
  const [tempSelectedProject, setTempSelectedProject] = useState("All");
  const [selectedProject, setSelectedProject] = useState("All");
  const [loading, setLoading] = useState(true);
  const [contributors, setContributors] = useState([]);

  function combineContributorsByNameAndProject(contributors) {
    const grouped = {};

    contributors.forEach(contributor => {
      const key = `${contributor.name}-${contributor.project}`;

      if (!grouped[key]) {
        grouped[key] = {
          ...contributor,
          donation: Number(contributor.donation) || 0
        };
      } else {
        grouped[key].donation += Number(contributor.donation) || 0;
      }
    });

    return Object.values(grouped);
  }


  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);
        const contributorResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/project-contributors`);
        const contributorData = contributorResponse.data;
        if (contributorData.status === "OK") {
          const uniqueProjectContributors = combineContributorsByNameAndProject(contributorData.list);
          setContributors(
            uniqueProjectContributors.map(
              (contributor, index) => ({
                id: index + 1,
                name: contributor.name,
                email: contributor.email,
                project: contributor.project,
                amount: contributor.donation,
                date: contributor.donation_date
              })
            )
          );
        } else {
          console.error("Unexpected response:", contributorData);
        }
      } catch (error) {
        console.error("Failed to fetch contributors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  // Information for the table header
  const [info, setInfo] = useState({
    title: "Project Contributors",
    search: "Search for a contributor",
  });

  // Toggle filter modal
  const toggleFilter = () => {
    setTempSelectedProject(selectedProject); // reset modal input to current selection
    setShowFilter((prev) => !prev);
  };

  // Pagination state
  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: 3,
    numToShow: 10,
    total: 258,
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

  // Filter contributors by search query and project
  const filteredContributors = contributors
    .filter(contributor => {
      // First filter by project if not "All"
      if (selectedProject !== "All" && contributor.project !== selectedProject) {
        return false;
      }

      // Then filter by search query if there is one
      if (searchQuery.trim() === "") {
        return true; // No search query, keep all items that matched project filter
      }

      // Case-insensitive search across multiple fields
      const query = searchQuery.toLowerCase();
      return (
        contributor.name.toLowerCase().includes(query) ||
        contributor.email.toLowerCase().includes(query) ||
        contributor.project.toLowerCase().includes(query) ||
        String(contributor.amount).includes(query) ||
        new Date(contributor.date).toLocaleDateString("en-US").includes(query)
      );
    });

  // Update pagination based on filtered results
  const totalFilteredItems = filteredContributors.length;
  const lastPageNumber = Math.ceil(totalFilteredItems / pagination.itemsPerPage) || 1;

  // Ensure current page is valid after filtering
  if (pagination.currPage > lastPageNumber) {
    setPagination(prev => ({
      ...prev,
      currPage: lastPageNumber,
      display: [(lastPageNumber - 1) * prev.itemsPerPage + 1, Math.min(lastPageNumber * prev.itemsPerPage, totalFilteredItems)]
    }));
  }

  // Get current page contributors
  const currentContributors = filteredContributors.slice(
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
            <h3 className="font-lb text-xl mb-4">Filter Contributors</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-s text-astradarkgray mb-2 block">
                  Project
                </label>
                <select
                  className="w-full p-2 border border-astragray rounded-lg"
                  value={tempSelectedProject}
                  onChange={(e) => setTempSelectedProject(e.target.value)}
                >
                  <option value="All">All Projects</option>
                  {Array.from(new Set(contributors.map(c => c.project))).map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button className="gray-button" onClick={toggleFilter}>
                  Cancel
                </button>
                <button
                  className="blue-button"
                  onClick={() => {
                    setSelectedProject(tempSelectedProject); // apply the filter
                    setSearchQuery(""); // Clear search when applying new filter
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
            <h1 className="font-h1">Contributors</h1>
            <p className="font-s mt-2">Community members supporting our projects</p>
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
            pagination={{
              ...pagination,
              total: totalFilteredItems,
              lastPage: lastPageNumber
            }}
            setPagination={setPagination}
            toggleFilter={toggleFilter}
            setSearchQuery={handleSearch}
            searchQuery={searchQuery}
          />
          {loading ? (
            <div className="bg-astrawhite p-6 rounded-b-xl flex items-center justify-center">
              <LoadingSpinner className="h-10 w-10" />
            </div>
          ) : currentContributors.length > 0 ? (
            <Table
              cols={cols}
              data={createRows(currentContributors, selectedIds, setSelectedIds, setToast)}
            />
          ) : (
            <div className="py-8 text-center text-astradarkgray">
              No contributors found matching your search criteria.
            </div>
          )}
          <PageTool
            pagination={{
              ...pagination,
              total: totalFilteredItems,
              lastPage: lastPageNumber
            }}
            setPagination={setPagination}
          />
        </div>
      </div>
    </div>
  );
}

// Table columns definition
const cols = [
  { label: "Name", justify: "start", visible: "all" },
  { label: "Email", justify: "center", visible: "md" },
  { label: "Project", justify: "center", visible: "lg" },
  { label: "Donation", justify: "center", visible: "sm" },
  { label: "Date", justify: "center", visible: "lg" },
];

// Function to create table rows
function createRows(contributors, selectedIds, setSelectedIds, setToast) {
  return contributors.map((contributor) => ({
    "Name": renderName(contributor.name),
    "Email": renderText(contributor.email),
    "Project": renderText(contributor.project),
    "Donation": renderAmount(contributor.amount),
    "Date": renderDate(contributor.date),
  }));
}

// Helper functions for rendering table cells
function renderName(name) {
  return (
    <div className="font-s font-semibold py-5 pl-2">{name}</div>
  );
}

function renderText(text) {
  return <div className="text-center text-astradarkgray font-s">{text}</div>;
}

function renderAmount(amount) {
  return <div className="text-center text-astragreen font-s font-semibold">{formatCurrency(amount)}</div>;
}

function renderDate(date) {
  return <div className="text-center text-astradarkgray font-s">{formatDate(date)}</div>;
}