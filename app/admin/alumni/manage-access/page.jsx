"use client";
import { useState, useEffect } from "react";
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
  // console.log("Current tab from layout:", info);

  const [alumList, setAlumList] = useState(mockdata);
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
    total: 999              // How many alum in db
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSelectedIds([]);
  }, [currTab]);


  // FOR BACKEND PEEPS
  useEffect(() => {
    console.log("State updated:", {
      appliedFilters,
      pagination,
      searchQuery,
    });

    const fetchAlumniProfiles = async () => {
      try {
        // For better search, fetch all or more profiles when searching
        // This allows for more sophisticated client-side filtering
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles`,
          {
            params: {
              page: searchQuery ? 1 : pagination.currPage,
              limit: searchQuery ? 50 : pagination.numToShow, // Fetch more when searching
            },
          }
        );

        if (response.data.status === "OK") {
          const updatedAlumList = await Promise.all(
            response.data.list.map(async (alum) => {
              const alumData = {
                id: alum.alum_id,
                alumname: capitalizeName(`${alum.first_name} ${alum.last_name}`),
                firstName: alum.first_name.toLowerCase(), // Store for searching
                lastName: alum.last_name.toLowerCase(),   // Store for searching
                email: alum.email,
                student_num: alum.student_num,
                graduationYear: "N/A",
                location: alum.location,
                fieldOfWork:
                  alum.primary_work_experience?.field || "No Position Title",
                skills: alum.skills ? alum.skills.split(",") : [],
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

              try {
                const idForDegree = alum.user_id || alum.alum_id;
                if (idForDegree) {
                  const degreeResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/degree-programs/alumni/${idForDegree}`
                  );
                  if (
                    degreeResponse.data.status === "OK" &&
                    degreeResponse.data.degreePrograms?.length > 0
                  ) {
                    const sortedPrograms = [
                      ...degreeResponse.data.degreePrograms,
                    ].sort(
                      (a, b) =>
                        new Date(b.year_graduated) -
                        new Date(a.year_graduated)
                    );
                    alumData.graduationYear = new Date(
                      sortedPrograms[0].year_graduated
                    )
                      .getFullYear()
                      .toString();
                  }
                }
              } catch (degreeError) {
                console.error(
                  `Failed to fetch degree programs for alum ${alum.alum_id}:`,
                  degreeError
                );
              }

              return alumData;
            })
          );

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
  }, [pagination.currPage, pagination.numToShow]);

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



const mockdata = [
  {
    id: 1,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Emma Johnson",
    email: "emma.johnson@example.com",
    graduationYear: 2015,
    student_num: "2022-03814",
    course: "BS Computer Science",
    location: "New York, NY",
    fieldOfWork: "Backend Development",
    skills: ["Java", "Spring Boot", "REST APIs", "PostgreSQL"]
  },
  {
    id: 2,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Liam Smith",
    email: "liam.smith@example.com",
    graduationYear: 2018,
    student_num: "2021-03814",
    course: "BS Civil Engineering",
    location: "San Francisco, CA",
    fieldOfWork: "Machine Learning Engineering",
    skills: ["Python", "Scikit-learn", "Pandas"]
  },
  {
    id: 3,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Olivia Brown",
    email: "olivia.brown@example.com",
    graduationYear: 2012,
    student_num: "2020-03814",
    course: "BS Education",
    location: "Chicago, IL",
    fieldOfWork: "Frontend Development",
    skills: ["HTML", "CSS", "JavaScript", "Vue.js"]
  },
  {
    id: 4,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Noah Davis",
    email: "noah.davis@example.com",
    graduationYear: 2020,
    student_num: "2022-30214",
    course: "BS Computer Science",
    location: "Austin, TX",
    fieldOfWork: "DevOps Engineering",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"]
  },
  {
    id: 5,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Ava Wilson",
    email: "ava.wilson@example.com",
    graduationYear: 2017,
    student_num: "2020-12314",
    course: "BS Computer Science",
    location: "Seattle, WA",
    fieldOfWork: "Mobile App Development",
    skills: ["Swift", "iOS", "Firebase"]
  },
  {
    id: 6,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "William Martinez",
    email: "william.martinez@example.com",
    graduationYear: 2014,
    student_num: "2021-41237",
    course: "BS Chemical Engineering",
    location: "Miami, FL",
    fieldOfWork: "Full Stack Development",
    skills: ["Node.js", "React", "MongoDB", "GraphQL"]
  },
  {
    id: 7,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Sophia Garcia",
    email: "sophia.garcia@example.com",
    graduationYear: 2016,
    student_num: "2022-99632",
    course: "BS Forestry",
    location: "Denver, CO",
    fieldOfWork: "Cloud Engineering",
    skills: ["Azure", "Linux", "Networking", "Python"]
  },
  {
    id: 8,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "James Anderson",
    email: "james.anderson@example.com",
    graduationYear: 2013,
    student_num: "2017-26934",
    course: "BS Computer Science",
    location: "Boston, MA",
    fieldOfWork: "Security Engineering",
    skills: ["Penetration Testing", "OWASP", "Metasploit"]
  },
  {
    id: 9,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Isabella Thomas",
    email: "isabella.thomas@example.com",
    graduationYear: 2019,
    student_num: "2015-04814",
    course: "BS Industrial Engineering",
    location: "Los Angeles, CA",
    fieldOfWork: "AI Research",
    skills: ["PyTorch", "Deep Learning", "NLP"]
  },
  {
    id: 10,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Benjamin Lee",
    email: "benjamin.lee@example.com",
    graduationYear: 2011,
    student_num: "2013-03825",
    course: "BS Information Technology",
    location: "Atlanta, GA",
    fieldOfWork: "Database Administration",
    skills: ["SQL", "Oracle", "Database Tuning", "Shell Scripting", "PL/SQL"]
  }
];
