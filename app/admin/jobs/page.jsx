"use client";
import { useState, useEffect } from "react";
import {TableHeader, Table, PageTool} from "@/components/TableBuilder";
import SearchFilter from "./filter";
import { ActionButton } from "@/components/Buttons";
import { useTab } from "../../components/TabContext";
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";
import { Trash2, Eye } from "lucide-react";
import axios from "axios";

export default function Jobs() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const toggleFilter = () => {
    console.log("Toggling filter modal:", !showFilter);
    setShowFilter((prev) => !prev);
  };

  const [pagination, setPagination] = useState({
    display: [1, itemsPerPage],
    currPage: 1,
    lastPage: 1,
    numToShow: itemsPerPage,
    total: 0,
    itemsPerPage
  });

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/jobs`);
      if (response.data.status === "OK") {
        setJobs(response.data.list || []);
      } else {
        console.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Failed to fetch jobs. Please try again later.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

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

  const handleSearch = (searchInput) => {
    const lower = (searchInput || "").toLowerCase();
    const filtered = jobs.filter(job =>
      (job.job_title || "").toLowerCase().includes(lower)
    );

    setSearchQuery(searchInput);
    setFilteredJobs(filtered);
  };

  const handleApply = (filters = {}) => {
    const {
      companyName = "",
      location = "",
      jobType = "",
      fromDate = "",
      toDate = "",
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

    setFilteredJobs(filtered);
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
            <SearchFilter onClose={toggleFilter} onApply={handleApply}/>
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
          <Table cols={cols} data={createRows(selectedIds, setSelectedIds, currTab, filteredJobs, fetchJobs)} />
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
        <div className="flex flex-row justify-between md:pl-4 lg:pl-8">
          {/* <ActionButton label="Reset Selection" color = "blue" onClick={() => setSelectedIds([])}/> */}
          {/* <BottomButtons selectedCount={selectedIds.length} currTab={currTab} setToast={setToast}/> */}
        </div>
      </div>
    </div>
  );
}

function BottomButtons({ selectedCount, currTab, setToast }) {
  const [modal, setModal] = useState({
    open: false,
    action: null, // "approve", "decline", etc.
    notifyMessage: "",
    notifyType: "success",
  });

  const openModal = (actionType) => {
    const { notifyMessage, notifyType } = getNotifyContent(actionType, selectedCount);
    setModal({ open: true, action: actionType, notifyMessage, notifyType });
  };

  const closeModal = () => {
    setModal({ open: false, action: null });
  };

  const handleConfirm = () => {
    const { notifyMessage, notifyType } = getNotifyContent(modal.action, selectedCount);

    closeModal(); // first close the modal

    setTimeout(() => {
      setToast({
        type: notifyType,
        message: notifyMessage
      });
    }, 50);
  };


  const modals = {
    approve: {
      title: `${selectedCount > 0 ? `Approve ${selectedCount} Accounts?` : "Approve All Accounts?"}`,
      desc: selectedCount > 0
        ? `You are about to approve ${selectedCount} selected pending accounts.`
        : "You are about to approve all pending accounts.",
      label: selectedCount > 0 ? "Approve" : "Approve All",
      color: "green"
    },
    decline: {
      title: `${selectedCount > 0 ? `Decline ${selectedCount} Accounts?` : "Decline All Accounts?"}`,
      desc: selectedCount > 0
        ? `You are about to decline ${selectedCount} selected pending accounts.`
        : "You are about to decline all pending accounts.",
      label: selectedCount > 0 ? "Decline" : "Decline All",
      color: "red"
    },
    remove: {
      title: `${selectedCount > 0 ? `Remove Access from ${selectedCount} Accounts?` : "Remove Access from All?"}`,
      desc: selectedCount > 0
        ? `You are about to remove access from ${selectedCount} approved accounts.`
        : "You are about to remove access from all approved accounts.",
      label: selectedCount > 0 ? "Remove Access" : "Remove All Access",
      color: "red"
    },
    reactivate: {
      title: `${selectedCount > 0 ? `Reactivate ${selectedCount} Accounts?` : "Reactivate All Accounts?"}`,
      desc: selectedCount > 0
        ? `You are about to reactivate ${selectedCount} inactive accounts.`
        : "You are about to reactivate all inactive accounts.",
      label: selectedCount > 0 ? "Reactivate" : "Reactivate All",
      color: "blue"
    }
  };

  return (
    <>
      <div className="flex gap-3 md:pr-4 lg:pr-8">
        {currTab === "Pending" && (
          <>
            <ActionButton
              label={selectedCount > 0 ? `Approve (${selectedCount})` : "Approve All"}
              color="green"
              onClick={() => openModal("approve")}
            />
            <ActionButton
              label={selectedCount > 0 ? `Decline (${selectedCount})` : "Decline All"}
              color="red"
              onClick={() => openModal("decline")}
            />
          </>
        )}

        {currTab === "Approved" && (
          <ActionButton
            label={selectedCount > 0 ? `Remove Access (${selectedCount})` : "Remove All"}
            color="red"
            onClick={() => openModal("remove")}
          />
        )}

        {currTab === "Inactive" && (
          <ActionButton
            label={selectedCount > 0 ? `Reactivate (${selectedCount})` : "Reactivate All"}
            color="blue"
            onClick={() => openModal("reactivate")}
          />
        )}
      </div>

      {modal.open && (
        <ConfirmModal
          isOpen={modal.open}
          onClose={closeModal}
          onConfirm={handleConfirm}
          title={modals[modal.action].title}
          description={modals[modal.action].desc}
          confirmLabel={modals[modal.action].label}
          confirmColor={modals[modal.action].color}
          count={selectedCount > 0 ? selectedCount : null}
        />
      )}
    </>
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

function createRows(selectedIds, setSelectedIds, currTab, filteredJobs, fetch) {
  const jobTypeMap = {"0": "Part-Time", "1": "Full-time", "2": "Temporary", "3": "Freelance"};

  return jobList.map((job) => ({
    "Title": renderTitle(job.job_title),
    "Company": renderText(job.company_name),
    "Location": renderText(job.location),
    "Type": renderType(jobTypeMap[job.employment_type]),
    "Posted": renderText(job.created_at),
    "Status": renderStatus(job.expires_at),
    "Quick Actions": renderActions(job.job_id, job.job_title, currTab, fetch),
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
  case 1:
    text = "Part-time";
    break;
  case 2:
    text = "Full-time";
    break;
  case 3:
    text = "Temporary";
    break;
  case 4:
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
  const color = isExpired ? "text-red-600" : "text-green-600";
  return <div className={`text-center ${text === "Expired" ? "text-astrared" : "text-astragreen"} font-s`}>{text}</div>;
}

function renderActions(id, name, currTab, onDeleteSuccess) {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/jobs/${id}`);
      if (response.data.status === "DELETED") {
        console.log("Successfully deleted");
        onDeleteSuccess();
      } else {
        console.error("Failed to delete job.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
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
          onClick={handleDelete}
          notifyMessage={`${name} has been deleted!`}
          notifyType="fail"
        />
      </div>
      <div className="block md:hidden">
        <ActionButton
          label={<Trash2 size={20}/>}
          color="red"
          onClick={handleDelete}
          notifyMessage={`${name} has been deleted!`}
          notifyType="fail"
        />
      </div>
    </div>
  );
}