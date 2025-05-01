"use client";
import { useState } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import { Check, Wallet, Users, HeartHandshake } from "lucide-react";
import AdminStatCard from "@/components/AdminStatCard";
import { ActionButton } from "@/components/Buttons";
import AdminTabs from "@/components/AdminTabs";
import ToastNotification from "@/components/ToastNotification";
import ProjectCardPending from "@/components/ProjectCardPending";
import ProjectCardActive from "@/components/ProjectCardActive";
import Link from "next/link";

export default function ProjectsAdmin() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [toast, setToast] = useState(null);
  const [tempSelectedType, setTempSelectedType] = useState(selectedType);

  //for searching a project
  const [info, setInfo] = useState({
    title: "Pending Projects",
    search: "Search for a project",
  });

  //tabs for different projects
  const tabs = {
    Pending: 5,
    Active: 8,
    Inactive: 3,
  };

  //this is for the current showed tab
  const [currTab, setCurrTab] = useState("Pending");

  //function for changing the tab
  const handleTabChange = (newTab) => {
    setCurrTab(newTab);

    setInfo((prev) => ({
      ...prev,
      title: `${newTab} Projects`,
    }));

    //when the tab is changed, the search bar and filters will be reset
    //reset Filters and Pagination
    setSelectedType("All");
  };

  const toggleFilter = () => {
    setTempSelectedType(selectedType); // reset modal input to current selection
    setShowFilter((prev) => !prev);
  };

  //this is the one beside the pending/active/inactive projects
  //must change lastPage and total to what is in the database
  const [pagination, setPagination] = useState({
    display: [1, 8],
    currPage: 1,
    lastPage: 2,
    numToShow: 8,
    total: 16,
  });

  //for filtering projects by type
  //scholarship
  //fundraiser
  const filteredProjects =
    selectedType === "All"
      ? projectsData
      : projectsData.filter((project) => project.type === selectedType);

  //this is for getting the projects for current page and handling the tab status
  const currentProjects = filteredProjects
    .filter((project) => project.status.toLowerCase() === currTab.toLowerCase())
    .slice(
      (pagination.currPage - 1) * pagination.numToShow,
      pagination.currPage * pagination.numToShow
    );

  return (
    <div>
      {/*pops a toast notification sa top for approve/decline */}
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
                  Project Type
                </label>
                <select
                  className="w-full p-2 border border-astragray rounded-lg"
                  value={tempSelectedType}
                  onChange={(e) => setTempSelectedType(e.target.value)}
                >
                  <option value="All">All Projects</option>
                  <option value="Fundraiser">Fundraisers</option>
                  <option value="Scholarship">Scholarships</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button className="gray-button" onClick={toggleFilter}>
                  Cancel
                </button>
                <button
                  className="blue-button"
                  onClick={() => {
                    setSelectedType(tempSelectedType); // apply the filter
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
          className="h-80 w-full object-cover"
        />
        <div className="absolute inset-2 flex flex-col items-center justify-evenly text-astrawhite z-20">
          <div className="text-center pt-6">
            <h1 className="font-h1">Projects</h1>
            <p className="font-s mt-2">Fueling futures, making a difference.</p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center">
              {/*active drives card */}
              <AdminStatCard
                delay={0.0}
                title="Active Drives"
                value={8}
                icon={
                  <HeartHandshake
                    className="size-13 text-astrawhite"
                    strokeWidth={1.5}
                  />
                }
                route={false}
                onClick={() => handleTabChange("Active")}
              />

              {/*total raised card */}
              <AdminStatCard
                delay={0.1}
                title="Total Raised"
                value="₱1.2M"
                icon={
                  <Wallet
                    className="size-13 text-astrawhite"
                    strokeWidth={1.5}
                  />
                }
                route="/admin/projects/funds"
              />

              {/*contributors card */}
              <AdminStatCard
                delay={0.2}
                title="Contributors"
                value={258}
                icon={
                  <Users
                    className="size-13 text-astrawhite"
                    strokeWidth={1.5}
                  />
                }
                route="/admin/projects/contributors"
              />
            </div>
          </div>
        </div>
      </div>

      <AdminTabs
        tabs={tabs}
        currTab={currTab}
        handleTabChange={handleTabChange}
      />

      {/* Table section */}
      <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
        <div className="flex flex-col py-4 px-1 md:px-4 lg:px-8">
          <TableHeader
            info={info}
            pagination={pagination}
            toggleFilter={toggleFilter}
          />

          {/* Projects Grid */}
          <div className="bg-astrawhite shadow-md p-6 rounded-b-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currTab === "Pending" &&
                currentProjects.map((project) => (
                  <ProjectCardPending
                    key={project.id}
                    id={project.id}
                    image={project.image}
                    title={project.title}
                    type={project.type}
                    requester={project.requester}
                    goal={project.goal}
                    description={project.description}
                    setToast={setToast}
                  />
                ))}

              {(currTab === "Active" || currTab === "Inactive") &&
                currentProjects.map((project) => (
                  <ProjectCardActive
                    key={project.id}
                    id={project.id}
                    image={project.image}
                    title={project.title}
                    type={project.type}
                    goal={project.goal}
                    raised={project.raised}
                    donors={project.donors}
                    endDate={project.endDate}
                    isActive={currTab === "Active"}
                  />
                ))}
            </div>

            {/* If no projects match the filter */}
            {currentProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-astradarkgray font-s">
                  No{" "}
                  {selectedType.toLowerCase() !== "all"
                    ? selectedType.toLowerCase()
                    : ""}{" "}
                  projects found.
                </p>
              </div>
            )}
          </div>

          {/* Pagination for projects */}
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
      </div>
    </div>
  );
}

// Sample project data
const projectsData = [
  {
    id: 1,
    title: "Computer Science Scholarship Fund",
    type: "Scholarship",
    image: "/projects/assets/Donation.jpg",
    description:
      "Supporting underprivileged students pursuing Computer Science degrees with full tuition coverage and stipend for books and materials.",
    goal: "₱500,000",
    raised: "₱350,000",
    donors: 45,
    requester: "Prof. Maria Santos",
    endDate: "2025-12-31",
    status: "Active",
  },
  {
    id: 2,
    title: "Programming Lab Equipment Drive",
    type: "Fundraiser",
    image: "/projects/assets/Donation.jpg",
    description:
      "Raising funds to upgrade the programming laboratory with new computers, software licenses, and modern teaching equipment.",
    goal: "₱750,000",
    raised: "₱420,000",
    donors: 67,
    requester: "ICS Student Council",
    endDate: "2025-06-30",
    status: "Active",
  },
  {
    id: 3,
    title: "ICS Building Renovation Fund",
    type: "Fundraiser",
    image: "/projects/assets/Donation.jpg",
    description:
      "Help us renovate the aging ICS building with modern facilities, air conditioning, and student collaboration spaces.",
    goal: "₱1,200,000",
    raised: "₱185,000",
    donors: 29,
    requester: "Dr. Roberto Aquino",
    endDate: "2025-08-15",
    status: "Active",
  },
  {
    id: 4,
    title: "Women in Tech Scholarship",
    type: "Scholarship",
    image: "/projects/assets/Donation.jpg",
    description:
      "Supporting female students pursuing degrees in computer science and information technology to increase representation in tech.",
    goal: "₱300,000",
    raised: "₱0",
    donors: 0,
    requester: "ICS Women's Society",
    endDate: "2025-09-30",
    status: "Pending",
  },
  {
    id: 5,
    title: "Alumni Mentorship Program",
    type: "Fundraiser",
    image: "/projects/assets/Donation.jpg",
    description:
      "Creating a structured mentorship program connecting alumni with current students for career guidance and professional development.",
    goal: "₱100,000",
    raised: "₱0",
    donors: 0,
    requester: "ICS Alumni Association",
    endDate: "2025-07-31",
    status: "Pending",
  },
  {
    id: 6,
    title: "Research Excellence Scholarship",
    type: "Scholarship",
    image: "/projects/assets/Donation.jpg",
    description:
      "Supporting promising students in their final year research projects with funding for equipment, materials, and conference attendance.",
    goal: "₱250,000",
    raised: "₱175,000",
    donors: 12,
    requester: "Dr. Elena Cruz",
    endDate: "2024-12-31",
    status: "Inactive",
  },
  {
    id: 7,
    title: "CS Library Enhancement Fund",
    type: "Fundraiser",
    image: "/projects/assets/Donation.jpg",
    description:
      "Expanding our digital and physical library resources with the latest textbooks, journals, and access to premium online learning platforms.",
    goal: "₱200,000",
    raised: "₱76,000",
    donors: 31,
    requester: "ICS Library Committee",
    endDate: "2025-05-30",
    status: "Active",
  },
  {
    id: 8,
    title: "Hackathon Sponsorship Fund",
    type: "Fundraiser",
    image: "/projects/assets/Donation.jpg",
    description:
      "Supporting our annual hackathon event with prizes, food, equipment, and guest speakers from the tech industry.",
    goal: "₱150,000",
    raised: "₱84,000",
    donors: 23,
    requester: "ICS Tech Club",
    endDate: "2025-03-15",
    status: "Active",
  },
  {
    id: 9,
    title: "First-Gen CS Student Scholarship",
    type: "Scholarship",
    image: "/projects/assets/Donation.jpg",
    description:
      "Supporting first-generation college students pursuing computer science degrees with financial aid and mentoring support.",
    goal: "₱350,000",
    raised: "₱0",
    donors: 0,
    requester: "Dr. Paulo Hernandez",
    endDate: "2025-08-30",
    status: "Pending",
  },
  {
    id: 10,
    title: "CS Department 25th Anniversary Fund",
    type: "Fundraiser",
    image: "/projects/assets/Donation.jpg",
    description:
      "Celebrating 25 years of excellence with an alumni gathering, commemorative book, and establishment of new student programs.",
    goal: "₱500,000",
    raised: "₱125,000",
    donors: 87,
    requester: "CS Department",
    endDate: "2024-11-15",
    status: "Inactive",
  },
  {
    id: 11,
    title: "Game Development Lab Fund",
    type: "Fundraiser",
    image: "/projects/assets/Donation.jpg",
    description:
      "Creating a dedicated game development laboratory with high-performance workstations, VR equipment, and industry-standard software.",
    goal: "₱800,000",
    raised: "₱0",
    donors: 0,
    requester: "Game Dev Student Group",
    endDate: "2025-12-01",
    status: "Pending",
  },
  {
    id: 12,
    title: "International Exchange Scholarship",
    type: "Scholarship",
    image: "/projects/assets/Donation.jpg",
    description:
      "Providing financial support for ICS students participating in international exchange programs with partner universities.",
    goal: "₱400,000",
    raised: "₱320,000",
    donors: 28,
    requester: "International Programs Office",
    endDate: "2025-04-15",
    status: "Active",
  },
  {
    id: 13,
    title: "IT Career Conference Fund",
    type: "Fundraiser",
    image: "/projects/assets/Donation.jpg",
    description:
      "Hosting an annual career conference bringing together alumni, industry leaders, and students for networking and job opportunities.",
    goal: "₱120,000",
    raised: "₱35,000",
    donors: 14,
    requester: "ICS Career Services",
    endDate: "2025-02-28",
    status: "Active",
  },
  {
    id: 14,
    title: "Indigenous CS Education Fund",
    type: "Scholarship",
    image: "/projects/assets/Donation.jpg",
    description:
      "Supporting indigenous students pursuing computer science education with comprehensive scholarships and cultural support programs.",
    goal: "₱275,000",
    raised: "₱120,000",
    donors: 19,
    requester: "Indigenous Student Association",
    endDate: "2024-10-15",
    status: "Inactive",
  },
  {
    id: 15,
    title: "Technology Innovation Scholarship",
    type: "Scholarship",
    image: "/projects/assets/Donation.jpg",
    description:
      "Rewarding students who demonstrate exceptional innovation and creativity in their technology projects and academic work.",
    goal: "₱200,000",
    raised: "₱0",
    donors: 0,
    requester: "Dr. Antonio Reyes",
    endDate: "2025-07-15",
    status: "Pending",
  },
  {
    id: 16,
    title: "Alumni Network Infrastructure Fund",
    type: "Fundraiser",
    image: "/projects/assets/Donation.jpg",
    description:
      "Developing a robust digital platform to connect alumni, facilitate mentorship, share job opportunities, and strengthen our community.",
    goal: "₱180,000",
    raised: "₱65,000",
    donors: 42,
    requester: "Alumni Relations Office",
    endDate: "2025-04-30",
    status: "Active",
  },
];
