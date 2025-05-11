"use client";
import { useState, useEffect, useMemo } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import SearchFilter from "admin/alumni/search/filter";
import { Check, Eye, Trash2, CheckCircle2, ShieldCheck } from "lucide-react";
import { ActionButton } from "@/components/Buttons";
import { useTab } from "../../../components/TabContext";
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";
import { capitalizeName } from "@/utils/format";

export default function AlumniAccess() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  const toggleFilter = () => { setShowFilter((prev) => !prev); };
  const [alumList, setAlumList] = useState([]);
  const [appliedFilters, updateFilters] = useState({
    yearFrom: "",
    yearTo: "",
    location: "",
    field: "",
    skills: [],
    sortCategory: "",
    sortOrder: "asc",
  });
  const [pagination, setPagination] = useState({
    display: [1, 10],       // Displaying Alum #1 to #10
    currPage: 1,            // Current active page
    lastPage: 10,           // Last Page => total/numToShow
    numToShow: 10,          // How many alum to show
    total: 0                // How many alum in db
  });
  const [searchQuery, setSearchQuery] = useState("");

  const stableFilters = useMemo(() => appliedFilters, [JSON.stringify(appliedFilters)]);

  useEffect(() => {
    setPagination({
      display: [1, 10],
      currPage: 1,
      lastPage: 10,
      numToShow: 10,
      total: 0
    });

    // Reset filters
    updateFilters({
      yearFrom: "",
      yearTo: "",
      location: "",
      field: "",
      skills: [],
      sortCategory: "",
      sortOrder: "asc",
    });

    // Clear search query
    setSearchQuery("");

    // Optionally clear selected rows
    setSelectedIds([]);

    // You can also optionally scroll to top:
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currTab]);

  useEffect(() => {
    const fetchAlumniProfiles = async () => {
      try {
        // For better search, fetch all or more profiles when searching
        // This allows for more sophisticated client-side filtering
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const endpoints = {
          Pending: "/v1/users/pending-alumni",
          Approved: "/v1/users/approved-alumni",
          Inactive: "/v1/users/inactive-alumni",
        };

        const route = `${baseUrl}${endpoints[currTab] || endpoints["Pending"]}`;

        const response = await axios.get(route,
          {
            params: {
              page: pagination.currPage,
              limit: pagination.numToShow,
              search: searchQuery,
              filters: stableFilters
            },
          }
        );

        const totalResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/statistics/alumni-stats`);

        const totals = {
          Pending: totalResponse.data.stats.pending_alumni_count,
          Approved: totalResponse.data.stats.approved_alumni_count,
          Inactive: totalResponse.data.stats.inactive_alumni_count
        };

        if (response.data.status === "OK") {
          const updatedAlumList = await Promise.all(
            response.data.list.map(async (alum) => {
              const alumData = {
                id: alum.alum_id,
                alumname: capitalizeName(`${alum.first_name} ${alum.middle_name} ${alum.last_name}`),
                graduationYear: "N/A",
                student_num: alum.student_num,
                image:
                  "https://cdn-icons-png.flaticon.com/512/145/145974.png",
              };

              try {
                const photoResponse = await axios.get(
                  `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/alum/${alum.alum_id}`
                );
                if (
                  photoResponse.data.status === "OK" &&
                  photoResponse.data.photo
                ) {
                  alumData.image = photoResponse.data.photo;
                }
              } catch (photoError) {
                console.log(
                  `Failed to fetch photo for alum_id ${alum.alum_id}:`,
                  photoError
                );
              }

              return alumData;
            })
          );

          const totalCount = totals[currTab];
          const listLength = updatedAlumList.length;
          const lowerBound = listLength === 0 ? 0 : (pagination.currPage - 1) * pagination.numToShow + 1;
          const upperBound = listLength === 0 ? 0 : lowerBound + listLength - 1;

          // Set total and lastPage based on the fetched total count
          setPagination((prev) => ({
            ...prev,
            display: [lowerBound, upperBound],
            total: totalCount,
            lastPage: Math.ceil(totalCount / prev.numToShow),
          }));
          // Store raw data
          setAlumList(updatedAlumList);
        } else {
          console.error("Unexpected response:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
      }
    };

    fetchAlumniProfiles();
  }, [pagination.currPage, pagination.numToShow, currTab, searchQuery, stableFilters]);

  return (
    <div>
      {/* Filter Modal */}
      <div
        onClick={toggleFilter}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs transition-all duration-100 ease-out ${showFilter ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <SearchFilter
            onClose={toggleFilter}
            initialFilters={appliedFilters}
            updateFilters={updateFilters}
          />
        </div>
      </div>

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
          <Table cols={cols} data={createRows(alumList, selectedIds, setSelectedIds, currTab)} />
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
        <div className="flex flex-row justify-between md:pl-4 lg:pl-8">
          <ActionButton label="Reset Selection" color="blue" onClick={() => setSelectedIds([])} />

          <BottomButtons selectedCount={selectedIds.length} currTab={currTab} setToast={setToast} />
        </div>
      </div>
    </div>
  );
}

function getNotifyContent(action, selectedCount) {
  const plural = selectedCount > 1 ? "s" : "";
  let message = "";
  let type = "success";

  switch (action) {
  case "approve":
    message = selectedCount > 0
      ? `${selectedCount} pending account${plural} have been approved!`
      : "All pending accounts have been approved!";
    break;
  case "decline":
    message = selectedCount > 0
      ? `${selectedCount} pending account${plural} have been declined!`
      : "All pending accounts have been declined!";
    type = "fail";
    break;
  case "remove":
    message = selectedCount > 0
      ? `Access has been removed from ${selectedCount} accounts!`
      : "Access has been removed from all active accounts!";
    type = "fail";
    break;
  case "reactivate":
    message = selectedCount > 0
      ? `${selectedCount} inactive account${plural} have been reactivated!`
      : "All inactive accounts have been reactivated!";
    break;
  }

  return { notifyMessage: message, notifyType: type };
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
  { label: "Checkbox:label-hidden", justify: "center", visible: "all" },
  { label: "Image:label-hidden", justify: "center", visible: "all" },
  { label: "Name", justify: "start", visible: "all" },
  { label: "Graduation Year", justify: "center", visible: "lg" },
  { label: "Student ID", justify: "center", visible: "md" },
  // { label: "Course", justify: "center", visible: "md" },
  { label: "Quick Actions", justify: "center", visible: "all" },
];

function createRows(alumList, selectedIds, setSelectedIds, currTab) {
  return alumList.map((alum) => ({
    "Checkbox:label-hidden": renderCheckboxes(alum.id, selectedIds, setSelectedIds),
    "Image:label-hidden": renderAvatar(alum.image, alum.alumname),
    Name: renderName(alum.alumname, alum.email),
    "Graduation Year": renderText(alum.graduationYear),
    "Student ID": renderText(alum.student_num),
    // "Course": renderText(alum.course),
    "Quick Actions": renderActions(alum.id, alum.alumname, currTab),
  }));
}

function renderCheckboxes(id, selectedIds, setSelectedIds) {
  const isChecked = selectedIds.includes(id);

  const handleChange = () => {
    setSelectedIds((prev) =>
      isChecked ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <label className="flex items-center justify-center cursor-pointer group pl-4">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="peer hidden"
      />
      <div
        className={`w-5 h-5 rounded border-2
            ${isChecked ? "bg-astradark border-astradark shadow-md shadow-astradark/40" : "border-gray-400"}
            flex items-center justify-center transition-all duration-200 ease-in-out`}
      >
        {isChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </div>
    </label>
  );
}

function renderAvatar(image, name) {
  return (
    <div className="flex justify-center">
      <div className="w-12 h-12 m-3">
        <img
          src={image}
          alt={`${name}'s avatar`}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    </div>
  );
}

function renderName(name, email) {
  return (
    <div>
      <div className="font-rb">{name}</div>
      <div className="text-astradarkgray font-s hidden md:block">{email}</div>
    </div>
  );
}

function renderText(text) {
  return <div className="text-center text-astradarkgray font-s">{text}</div>;
}

function renderActions(id, name, currTab) {
  // Based muna sa currTab pero I think mas maganda kung sa mismong account/user kukunin yung active status*/
  return (
    <div className="flex justify-center gap-3 md:pr-4 lg:pr-2">
      <div className="hidden md:block">
        <ActionButton
          label="View"
          color="gray"
          route={`/admin/alumni/manage-access/${id}`}
        />
      </div>
      <div className="block md:hidden">
        <ActionButton
          label={<Eye size={20} />}
          color="gray"
          route={`/admin/alumni/manage-access/${id}`}
        />
      </div>
      {currTab === "Pending" && (
        <>
          <div className="hidden md:block">
            <ActionButton
              label="Approve"
              color="green"
              notifyMessage={`${name} has been approved!`}
              notifyType="success"
            />
          </div>
          <div className="block md:hidden">
            <ActionButton
              label={<CheckCircle2 size={20} />}
              color="green"
              notifyMessage={`${name} has been approved!`}
              notifyType="success"
            />
          </div>
          <div className="hidden md:block">
            <ActionButton
              label="Decline"
              color="red"
              notifyMessage={`${name} has been declined!`}
              notifyType="fail"
            />
          </div>
          <div className="block md:hidden">
            <ActionButton
              label={<Trash2 size={20} />}
              color="red"
              notifyMessage={`${name} has been declined!`}
              notifyType="fail"
            />
          </div>
        </>
      )}

      {currTab === "Approved" && (
        <>
          <div className="hidden md:block">
            <ActionButton
              label="Remove Access"
              color="red"
              notifyMessage={`${name} has been removed!`}
              notifyType="fail"
            />
          </div>
          <div className="block md:hidden">
            <ActionButton
              label={<Trash2 size={20} />}
              color="red"
              notifyMessage={`${name} has been removed!`}
              notifyType="fail"
            />
          </div>
        </>
      )}

      {currTab === "Inactive" && (
        <>
          <div className="hidden md:block">
            <ActionButton
              label="Reactivate"
              color="blue"
              notifyMessage={`${name} has been reactivated!`}
              notifyType="success"
            />
          </div>
          <div className="block md:hidden">
            <ActionButton
              label={<ShieldCheck size={20} />}
              color="blue"
              notifyMessage={`${name} has been reactivated!`}
              notifyType="success"
            />
          </div>
        </>
      )}
    </div>
  );
}