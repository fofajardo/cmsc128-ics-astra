"use client";
import { useState, useEffect } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import SearchFilter from "./filter";
import { ActionButton } from "@/components/Buttons";
import { useTab } from "../../components/TabContext";
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";
import { Trash2 } from "lucide-react";
import axios from "axios";


export default function Organizations() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  const [orgData, setOrgData] = useState([]);

  const toggleFilter = () => {
    console.log("Toggling filter modal:", !showFilter);
    setShowFilter((prev) => !prev);
  };

  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: 10,
    numToShow: 10,
    total: 999,
    itemsPerPage: 5
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  const handleSearch = (searchInput) => {
    setSearchQuery(searchInput);

    // put job search logic here
  };

  const handleApply = (filters) => {
    // put filtering and sorting logic here
    setFilters(filters);
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/organizations`,
        {
          params: {
            page: pagination.currPage,
            limit: pagination.numToShow,
          },
        }
      );

      console.log(response.data.organization);

      if (response.data.status === "OK") {
        const updatedOrganizationsData = await Promise.all(
          response.data.organization.map(async (organization) => {
            const organizationData = {
              id: organization.id,
              name: organization.name,
              acronym: organization.acronym,
              type: organization.type,
              founded_date: organization.founded_date,
              created_at: organization.created_at
            };

            return organizationData;
          }));

        setOrgData(updatedOrganizationsData);
        const newTotal = updatedOrganizationsData.length; // fallback since no total
        if (pagination.total !== newTotal) {
          setPagination((prev) => ({
            ...prev,
            total: newTotal,
          }));
        }
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      setToast({
        type: "fail",
        message: "Failed to fetch organizations.",
      });
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [pagination]);

  const renderActions = (id, name) => {
    const handleDelete = async () => {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/organizations/${id}`);
        setToast({ type: "success", message: `${name} has been deleted!` });
        fetchOrganizations();
      } catch (error) {
        console.error("Failed to delete organization:", error);
        setToast({ type: "fail", message: `Failed to delete ${name}.` });
      }
    };

    return (
      <div className="flex justify-center gap-3 md:pr-4 lg:pr-2">
        <div className="hidden md:block">
          <ActionButton label="Delete" color="red" onClick={handleDelete} />
        </div>
        <div className="block md:hidden">
          <ActionButton label={<Trash2 size={20} />} color="red" onClick={handleDelete} />
        </div>
      </div>
    );
  };

  const createRows = (selectedIds, setSelectedIds, currTab, orgList) => {
    return orgList.map((org) => ({
      "Name": renderName(org.name),
      "Acronym": renderText(org.acronym),
      "Type": renderText(`${org.type === 0 ? "University" : "Outside"}`),
      "Founded Date": renderText(org.founded_date),
      "Created": renderText(org.created_at),
      "Quick Actions": renderActions(org.id, org.name, currTab),
    }));
  }

  const orgList = orgData
  .filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (org.type === 0 ? "university" : "outside").includes(searchQuery.toLowerCase());

    const matchesOrgName = !filters.orgName || org.name.toLowerCase().includes(filters.orgName.toLowerCase());

    const orgFoundedDate = new Date(org.founded_date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    const matchesFoundedDate =
      (!fromDate || orgFoundedDate >= fromDate) &&
      (!toDate || orgFoundedDate <= toDate);

    return matchesSearch && matchesOrgName && matchesFoundedDate;
  })
  .sort((a, b) => {
    // If no sortCategory is set, return as is (no sorting)
    if (!filters.sortCategory) return 0;

    // Get the values to be sorted
    const aValue = a[filters.sortCategory];
    const bValue = b[filters.sortCategory];

    // Handle sorting based on the category and order
    if (aValue < bValue) {
      return filters.sortOrder === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return filters.sortOrder === "asc" ? 1 : -1;
    }
    return 0; // If equal, no change in order
  });

  // console.log(orgList);

  return (
    <div>
      {/* Filter Modal */}
      {showFilter && (
        <div
          onClick={toggleFilter}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div onClick={e => e.stopPropagation()}>
            <SearchFilter onClose={toggleFilter} onApply={handleApply} />
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
          <Table cols={cols} data={createRows(selectedIds, setSelectedIds, currTab, orgList)} />
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
        <div className="flex flex-row justify-between md:pl-4 lg:pl-8">
          {/* <ActionButton label="Reset Selection" color = "blue" onClick={() => setSelectedIds([])}/>
          <BottomButtons selectedCount={selectedIds.length} currTab={currTab} setToast={setToast}/> */}
        </div>
      </div>
    </div>
  );
}

const cols = [
  { label: "Name", justify: "center", visible: "all" },
  { label: "Acronym", justify: "center", visible: "sm" },
  { label: "Type", justify: "center", visible: "lg" },
  { label: "Founded Date", justify: "center", visible: "md" },
  { label: "Created", justify: "center", visible: "lg" },
  { label: "Quick Actions", justify: "center", visible: "all" },
];

function renderName(name) {
  return (
    <div>
      <div className="font-sb py-4 pl-3 text-left md:pl-3 md:text-center ">{name}</div>
    </div>
  );
}

function renderText(text) {
  return <div className="text-center text-astradarkgray font-s">{text}</div>;
}


function renderStatus(text) {
  return <div className={`text-center ${text === "Expired" ? "text-astrared" : "text-astragreen"} font-s`}>{text}</div>;
}