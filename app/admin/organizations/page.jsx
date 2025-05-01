"use client";
import { useState, useEffect } from "react";
import {TableHeader, Table, PageTool} from "@/components/TableBuilder";
import SearchFilter from "./filter";
import { ActionButton } from "@/components/Buttons";
import { useTab } from "../../components/TabContext";
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";
import orgList from "./dummy";
import { Trash2 } from "lucide-react";


export default function Jobs() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  // console.log("Current tab from layout:", info);

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

  const handleSearch = (searchInput) => {
    setSearchQuery(searchInput);

    // put job search logic here
  };

  const handleApply = () => {
    // put filtering and sorting logic here
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
          <Table cols={cols} data={createRows(selectedIds, setSelectedIds, currTab)} />
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

function createRows(selectedIds, setSelectedIds, currTab) {
  return orgList.map((org) => ({
    "Name": renderName(org.name),
    "Acronym": renderText(org.acronym),
    "Type": renderText(`${org.type === 0 ? "University" : "Outside"}`),
    "Founded Date": renderText(org.founded_date),
    "Created": renderText(org.created_at),
    "Quick Actions": renderActions(org.id, org.name, currTab),
  }));
}

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

function renderActions(id, name) {
  const handleDelete = () => {
    // handle delete job id logic here

  };
  return (

  //Based muna sa currTab pero I think mas maganda kung sa mismong account/user kukunin yung active status

    <div className="flex justify-center gap-3 md:pr-4 lg:pr-2">
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


