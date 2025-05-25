"use client";
import { useState, useEffect ,useContext} from "react";
import {TableHeader, Table, PageTool} from "@/components/TableBuilder";
import SearchFilter from "./filter";
import { ActionButton } from "@/components/Buttons";
import { useTab } from "../../components/TabContext";
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";
import { Trash2, Eye } from "lucide-react";
import { jobTypeMap } from "@/components/jobs/mappings";
import axios from "axios";
import { TabContext } from "../../components/TabContext";
import ConfirmationPrompt from "@/components/jobs/edit/confirmation";
import { formatDate } from "@/utils/format";

export default function Jobs() {
  const [showPrompt, setPrompt] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const {setJobCounts} = useContext(TabContext);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [paginatedJobs, setPaginatedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const initialFilters = {
    companyName: "",
    location: "",
    jobType: "",
    fromDate: "",
    toDate: "",
    status: "",
    sortCategory: "",
    sortOrder: "asc",
  };

  const initialPagination = {
    display: [1, itemsPerPage],
    currPage: 1,
    lastPage: 1,
    numToShow: itemsPerPage,
    total: 0,
    itemsPerPage
  };

  const [filter, setFilter] = useState(initialFilters);

  const toggleFilter = () => {
    // console.log("Toggling filter modal:", !showFilter);
    setShowFilter((prev) => !prev);
  };

  const [pagination, setPagination] = useState(initialPagination);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/jobs${currTab === "Reported" ? "/reported" : ""}`);
      if (response.data.status === "OK") {
        setJobs(response.data.list || []);
        computeCounts(response.data.list || []);
      } else {
        ; // console.error("Unexpected response from server.");
      }
    } catch (error) {
      ; // console.error("Failed to fetch jobs. Please try again later.");
    }
  };

  useEffect(() => {
    const total = filteredJobs.length;
    const lastPage = Math.max(1, Math.ceil(total / itemsPerPage));

    setPagination({
      display: [1, Math.min(itemsPerPage, total)],
      currPage: 1,
      lastPage,
      numToShow: itemsPerPage,
      total,
      itemsPerPage
    });
  }, [filteredJobs, searchQuery]);

  useEffect(() => {
    setFilter(initialFilters);

    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetchJobs();
  }, [currTab]);

  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    const start = (pagination.currPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    setPaginatedJobs(filteredJobs.slice(start, end));
  }, [filteredJobs, pagination.currPage, pagination.itemsPerPage]);

  const handleSearch = (searchInput) => {
    const lower = (searchInput || "").toLowerCase();
    const filtered = jobs.filter(job =>
      (job.job_title || "").toLowerCase().includes(lower)
    );

    setSearchQuery(searchInput);
    setFilteredJobs(filtered);
  };

  const computeCounts = (list) => {
    const today = new Date();
    let active = 0;
    let expired = 0;

    for (const job of list) {
      const expiresAt = new Date(job.expires_at);
      if (!isNaN(expiresAt) && expiresAt >= today) {
        active++;
      } else {
        expired++;
      }
    }
    let total_count = active + expired;
    setJobCounts({ active:active, expired: expired, total: total_count });
  };

  const sort = (filtered, sortBy, asc) => {
    asc = asc === "asc" ? true : false;
    switch (sortBy) {
    case "company":
      return filtered.sort((a, b) => a.company_name.toLowerCase().localeCompare(b.company_name.toLowerCase())
          * (asc ? 1 : -1));
    case "location":
      return filtered.sort((a, b) => a.location.toLowerCase().localeCompare(b.location.toLowerCase())
          * (asc ? 1 : -1));
    case "date":
      return filtered.sort((a, b) => (new Date(a.created_at) - new Date(b.created_at)) * (asc ? 1 : -1));
    default:
      return filtered;
    }
  };

  const handleApply = (filters = {}) => {
    setFilter(filters);
    const {
      companyName = "",
      location = "",
      jobType = "",
      fromDate = "",
      toDate = "",
      sortCategory = "",
      sortOrder = ""
    } = filters;

    const lowerCompany = companyName.toLowerCase();
    const lowerLocation = location.toLowerCase();
    const parsedJobType = jobType ? Number(jobType) : null;
    const yearFrom = parseInt(fromDate, 10);
    const yearTo = parseInt(toDate, 10);

    const filtered = jobs.filter(job => {
      const jobCompany = (job.company_name || "").toLowerCase();
      const jobLocation = (job.location || "").toLowerCase();
      const jobTypeNum = Number(job.employment_type);
      const jobYear = parseInt(job.created_at, 10);
      const matchesCompany = !lowerCompany || jobCompany.includes(lowerCompany);
      const matchesLocation = !lowerLocation || jobLocation.includes(lowerLocation);
      const matchesType = parsedJobType === null || jobTypeNum === parsedJobType;
      const matchesYearFrom = isNaN(yearFrom) || jobYear >= yearFrom;
      const matchesYearTo = isNaN(yearTo) || jobYear <= yearTo;

      return (
        matchesCompany &&
        matchesLocation &&
        matchesType &&
        matchesYearFrom &&
        matchesYearTo
      );
    });

    setFilteredJobs(sort(filtered, sortCategory, sortOrder));
  };

  const handleDelete = async () => {
    if (!jobToDelete?.id) {
      // console.error("No job selected for deletion.");
      return;
    }

    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/jobs/${jobToDelete.id}`);
      if (response.data.status === "DELETED") {
        // console.log("Successfully deleted");
        fetchJobs();
        setPrompt(false);
        setJobToDelete(null);
      } else {
        ; // console.error("Failed to delete job.");
      }
    } catch (error) {
      ; // console.error("Error deleting job:", error);
    }
  };

  return (
    <div>
      {/* Filter Modal */}
      {showFilter && (
        <div
          onClick={toggleFilter}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div onClick={e => e.stopPropagation()}>
            <SearchFilter onClose={toggleFilter} onApply={handleApply} filter={filter}/>
          </div>
        </div>
      )}

      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Table section */}
      <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
        <div className='flex flex-col py-4 px-1 md:px-4 lg:px-8'>
          <TableHeader info={info} pagination={pagination} setPagination={setPagination} toggleFilter={toggleFilter} setSearchQuery={handleSearch} searchQuery={searchQuery} />
          <Table cols={cols} data={createRows(selectedIds, setSelectedIds, currTab, paginatedJobs, setPrompt, setJobToDelete)} />
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
        <div className="flex flex-row justify-between md:pl-4 lg:pl-8">
          {/* <ActionButton label="Reset Selection" color = "blue" onClick={() => setSelectedIds([])}/> */}
          {/* <BottomButtons selectedCount={selectedIds.length} currTab={currTab} setToast={setToast}/> */}
        </div>
      </div>
      {showPrompt && (
        <ConfirmationPrompt
          prompt="Are you sure you want to delete this job posting?"
          close={() => setPrompt(false)}
          handleConfirm={handleDelete}
        />
      )}
    </div>
  );
}

const cols = [
  { label: "Title", justify: "start", visible: "all" },
  { label: "Company", justify: "center", visible: "sm" },
  { label: "Location", justify: "center", visible: "lg" },
  { label: "Type", justify: "center", visible: "lg" },
  { label: "Posted", justify: "center", visible: "lg" },
  { label: "Status", justify: "center", visible: "md" },
  { label: "Quick Actions", justify: "center", visible: "all" },
];

function createRows(selectedIds, setSelectedIds, currTab, filteredJobs, setPrompt, setJobtoDelete) {
  return filteredJobs.map((job) => ({
    "Title": renderTitle(job.job_title),
    "Company": renderText(job.company_name),
    "Location": renderText(job.location),
    "Type": renderType(job.employment_type),
    "Posted": renderText(formatDate(job.created_at, "short-month")),
    "Status": renderStatus(job.expires_at),
    "Quick Actions": renderActions(job.job_id, job.job_title, currTab, setPrompt, setJobtoDelete),
  }));
}

function renderTitle(name) {
  return (
    <div>
      <div className="font-s font-semibold py-5 pl-2 ">{name}</div>
    </div>
  );
}

function renderText(text) {
  return <div className="text-center text-astradarkgray font-s">{text}</div>;
}

function renderType(type) {
  let text;

  switch (type) {
  case 0:
    text = "Part-time";
    break;
  case 1:
    text = "Full-time";
    break;
  case 2:
    text = "Temporary";
    break;
  case 3:
    text = "Freelance";
    break;
  default:
    text = "Unknown";
  }
  return <div className="text-center text-astradarkgray font-s">{text}</div>;
}

function renderStatus(expiresAt) {
  const today = new Date();
  const expiryDate = new Date(expiresAt);

  const isExpired = isNaN(expiryDate) || expiryDate < today;

  const text = isExpired ? "Expired" : "Active";
  const color = isExpired ? "text-astrared" : "text-astragreen";
  return <div className={`text-center ${color} font-s`}>{text}</div>;
}

function renderActions(id, name, currTab, setPrompt, setJobToDelete) {
  const confirmDelete = () => {
    setJobToDelete({id});
    setPrompt(true);
  };
  return (

  //Based muna sa currTab pero I think mas maganda kung sa mismong account/user kukunin yung active status

    <div className="flex justify-center gap-3 md:pr-4 lg:pr-2">
      <div className="hidden md:block">
        <ActionButton
          label="View"
          color="gray"
          route={`/admin/jobs/${id}/view`}
        />
      </div>
      <div className="block md:hidden">
        <ActionButton
          label={<Eye size={20}/>}
          color="gray"
          route={`/admin/jobs/${id}/view`}
        />
      </div>
      <div className="hidden md:block">
        <ActionButton
          label="Delete"
          color="red"
          onClick={confirmDelete}
          notifyMessage={`${name} has been deleted!`}
          notifyType="fail"
        />
      </div>
      <div className="block md:hidden">
        <ActionButton
          label={<Trash2 size={20}/>}
          color="red"
          onClick={confirmDelete}
          notifyMessage={`${name} has been deleted!`}
          notifyType="fail"
        />
      </div>
    </div>
  );
}