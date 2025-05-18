"use client";
import { useState, useEffect, useMemo } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import SearchFilter from "./filter";
import { ActionButton } from "@/components/Buttons";
import { useTab } from "../../components/TabContext";
import ToastNotification from "@/components/ToastNotification";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { capitalizeTitle } from "@/utils/format";

export default function Organizations() {
  const [showFilter, setShowFilter] = useState(false);
  const { info } = useTab();
  const [toast, setToast] = useState(null);
  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };
  const [orgList, setOrgList] = useState([]);
  const [appliedFilters, updateFilters] = useState({
    orgName: "",
    fromDate: "",
    toDate: "",
    sortCategory: "",
    sortOrder: "asc",
  });
  const [pagination, setPagination] = useState({
    display: [1, 10],       // Displaying Alum #1 to #10
    currPage: 1,            // Current active page
    lastPage: 10,           // Last Page => total/numToShow
    numToShow: 5,          // How many organizations to show
    total: 0                // How many organizations in db
  });
  const [searchQuery, setSearchQuery] = useState("");
  const stableFilters = useMemo(() => appliedFilters, [JSON.stringify(appliedFilters)]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      currPage: 1
    }));
  }, [searchQuery, stableFilters, pagination.numToShow]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/organizations`,
          {
            params: {
              page: pagination.currPage,
              limit: pagination.numToShow,
              search: searchQuery,
              filters: stableFilters
            },
          }
        );

        console.log(response.data.organization);

        if (response.data.status === "OK") {
          const updatedOrganizationList = await Promise.all(
            response.data.organization.map(async (organization) => {
              const organizationData = {
                id: organization.id,
                name: capitalizeTitle(organization.name),
                acronym: organization.acronym,
                type: organization.type,
                founded_date: organization.founded_date,
                created_at: organization.created_at
              };

              return organizationData;
            })
          );

          const listLength = updatedOrganizationList.length;
          const lowerBound = listLength === 0 ? 0 : (pagination.currPage - 1) * pagination.numToShow + 1;
          const upperBound = listLength === 0 ? 0 : lowerBound + listLength - 1;

          setPagination((prev) => ({
            ...prev,
            display: [lowerBound, upperBound],
            total: response.data.total,
            lastPage: Math.ceil(response.data.total / prev.numToShow)
          }));

          setOrgList(updatedOrganizationList);
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

    fetchOrganizations();
  }, [searchQuery, stableFilters, pagination.numToShow, pagination.currPage]);

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

  const createRows = (orgList) => {
    return orgList.map((org) => ({
      "Name": renderName(org.name),
      "Acronym": renderText(org.acronym),
      "Type": renderText(`${org.type === 0 ? "University" : "Outside"}`),
      "Founded Date": renderText(org.founded_date),
      "Created": renderText(org.created_at),
      "Quick Actions": renderActions(org.id, org.name),
    }));
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
            <SearchFilter
              onClose={toggleFilter}
              initialFilters={appliedFilters}
              updateFilters={updateFilters}
            />
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
          <TableHeader
            info={info}
            pagination={pagination}
            setPagination={setPagination}
            toggleFilter={toggleFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery} />
          <Table cols={cols} data={createRows(orgList)} />
          <PageTool pagination={pagination} setPagination={setPagination} />
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