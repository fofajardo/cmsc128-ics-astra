"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import { Check, Wallet, Users, HeartHandshake } from "lucide-react";
import AdminStatCard from "@/components/AdminStatCard";
import { ActionButton } from "@/components/Buttons";
import AdminTabs from "@/components/AdminTabs";
import ToastNotification from "@/components/ToastNotification";
import ProjectCardPending from "@/components/ProjectCardPending";
import ProjectCardActive from "@/components/ProjectCardActive";
import { formatCurrency, capitalizeName } from "@/utils/format";
import { REQUEST_STATUS } from "@/constants/requestConsts";
import { PROJECT_STATUS, PROJECT_TYPE } from "@/constants/projectConsts";
import DeclineModal from "@/components/projects/DeclineModal";
import Link from "next/link";
import axios from "axios";

export default function ProjectsAdmin() {
  const router = useRouter();

  const [showFilter, setShowFilter] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [toast, setToast] = useState(null);
  const [tempSelectedType, setTempSelectedType] = useState(selectedType);

  const [projects, setProjects] = useState([]);
  const [donationsSummary, setDonationsSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const [projectPhotos, setProjectPhotos] = useState({});
  const [requestTo, setrequestIdToDecline] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineRequestData, setDeclineRequestData] = useState({});

  useEffect(() => {
    const fetchProjectRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests/projects`);
        const projectData = response.data;
        if (projectData.status === "OK") {
          console.log("Fetched projects:", projectData);

          // extract project id's
          const projectIds = projectData.list.map(project => project.projectData.project_id);

          // map for photos initialization
          const photoMap = {};

          // fetch individual project photos
          const photoPromises = projectIds.map(async (projectId) => {
            try {
              const photoResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/project/${projectId}`
              );

              if (photoResponse.data.status === "OK" && photoResponse.data.photo) {
                photoMap[projectId] = photoResponse.data.photo;
              }
            } catch (error) {
              console.log(`Failed to fetch photo for project_id ${projectId}:`, error);
            }
          });

          await Promise.all(photoPromises);
          setProjectPhotos(photoMap);

          setProjects(
            projectData.list.map(
              project => ({
                status: project.projectData.project_status === PROJECT_STATUS.FINISHED ? REQUEST_STATUS.REJECTED : project.status,
                request_id: project.request_id,
                id: project.projectData.project_id,
                image: photoMap[project.projectData.project_id] || "/projects/assets/Donation.jpg",
                project_status: project.projectData.project_status,
                title: project.projectData.title,
                description: project.projectData.details,
                goal: project.projectData.goal_amount.toString(),
                raised: project.projectData.total_donations.toString(),
                donors: project.projectData.number_of_donors,
                type: project.projectData.type,
                endDate: project.projectData.due_date,
                dateCompleted: project.projectData.date_complete,
                donationLink: project.projectData.donation_link,
                requester: project.requesterData?.full_name !== ""
                  ? capitalizeName(project.requesterData?.full_name)
                  : project.requesterData?.role === "unlinked"
                    ? "Deleted User"
                    : capitalizeName(project.requesterData?.role)
                ,
              })
            )
          );
        } else {
          console.error("Unexpected response:", projectData);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDonationsSummary = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/donations/summary`);
        const donationSummaryData = response.data;
        if (donationSummaryData.status === "OK") {
          console.log("Fetched donation summary:", donationSummaryData);
          setDonationsSummary({
            total_raised: donationSummaryData.summary.total_raised,
            contributors: donationSummaryData.summary.contributors
          });
        } else {
          console.error("Unexpected response:", donationSummaryData);
        }
      } catch (error) {
        console.error("Failed to fetch donation summary:", error);
      }
    };

    fetchDonationsSummary();
    fetchProjectRequests();
  }, []);

  const updateProjectRequest = async (updatedStatus, requestId, requestResponse="") => {
    try {
      let data = {
        status: updatedStatus
      };

      if (updatedStatus === REQUEST_STATUS.REJECTED) {
        data = {
          ...data,
          response: requestResponse,
        };
      };

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests/${encodeURI(requestId)}`, data);
      if (response.data.status === "UPDATED") {
        console.log("Successfully updated project request with id:", requestId);
        handleUpdateCallback(updatedStatus, requestId);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Failed to approve project request:", error);
    }
  };

  const handleUpdateCallback = (updatedStatus, requestId) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.request_id === requestId
          ? { ...project, status: updatedStatus }
          : project
      )
    );
  };

  const handleApprove = (id, title) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(id);
    console.log(title);
    updateProjectRequest(REQUEST_STATUS.APPROVED, id);
    setToast({
      type: "success",
      message: `${title} has been approved!`
    });
  };

  const handleDecline = (id, title) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeclineModal(true);
    setDeclineRequestData({
      id,
      title,
    });
  };

  const handleFinalDecline = () => {
    updateProjectRequest(REQUEST_STATUS.REJECTED, declineRequestData.id, declineReason);
    setToast({ type: "fail", message: `${declineRequestData.title} has been declined. Reason: ${declineReason}` });
    setShowDeclineModal(false);
    setDeclineReason("");
    setTimeout(() => router.push("/admin/projects"), 2000);
  };

  const projectsData = projects;

  const statusToTab = {
    0: "Pending",
    1: "Active",
    2: "Inactive",
  };

  //for searching a project
  const [info, setInfo] = useState({
    title: "Pending Projects",
    search: "Search for a project",
  });

  //tabs for different projects
  const tabs = Object.values(projectsData).reduce((acc, project) => {
    if (project.status === 0) acc.Pending++;
    else if (project.status === 1) acc.Active++;
    else if (project.status === 2) acc.Inactive++;
    return acc;
  }, { Pending: 0, Active: 0, Inactive: 0 });

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
      : projectsData.filter((project) => project.type === selectedType.toLowerCase());

  //for filtering projects by status
  const filteredByTabProjects = filteredProjects.filter(
    (project) => statusToTab[project.status].toLowerCase() === currTab.toLowerCase()
  );

  // Update pagination total and lastPage
  useEffect(() => {
    const totalItems = filteredByTabProjects.length;
    const lastPage = Math.max(1, Math.ceil(totalItems / pagination.numToShow));
    setPagination((prev) => ({
      ...prev,
      total: totalItems,
      lastPage: lastPage,
      currPage: Math.min(prev.currPage, lastPage), // Avoid invalid page
      display: [
        (Math.min(prev.currPage, lastPage) - 1) * prev.numToShow + 1,
        Math.min(totalItems, Math.min(prev.currPage, lastPage) * prev.numToShow),
      ],
    }));
  }, [filteredProjects, currTab, pagination.numToShow]);

  //this is for getting the projects for current page and handling the tab status
  const currentProjects = filteredProjects
    .filter((project) => statusToTab[project.status].toLowerCase() === currTab.toLowerCase())
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
                  <option value={PROJECT_TYPE.DONATION_DRIVE}>{capitalizeName(PROJECT_TYPE.DONATION_DRIVE)}</option>
                  <option value={PROJECT_TYPE.FUNDRAISING}>{capitalizeName(PROJECT_TYPE.FUNDRAISING)}</option>
                  <option value={PROJECT_TYPE.SCHOLARSHIP}>{capitalizeName(PROJECT_TYPE.SCHOLARSHIP)}</option>
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
          className="h-100 w-full object-cover"
        />
        <div className="absolute inset-2 flex flex-col items-center justify-evenly text-astrawhite z-20">
          <div className="text-center pt-6">
            <h1 className="font-h1">Projects</h1>
            <p className="font-s mt-2">Fueling futures, making a difference.</p>
          </div>
          <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
            <div className="flex flex-row gap-3 min-w-max px-4 justify-center">
              {/*active projects card */}
              <AdminStatCard
                delay={0.0}
                title="Active Projects"
                value={tabs["Active"]}
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
                value={formatCurrency(donationsSummary.total_raised)}
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
                value={donationsSummary.contributors}
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

          {/* Create a project button */}
          <Link href="/projects/request/goal" passHref>
            <button className="mt-2 border-2 border-astrawhite text-astrawhite hover:bg-astrawhite hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]">
              Create a Project
            </button>
          </Link>
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
                    id={project.request_id}
                    image={project.image}
                    title={project.title}
                    type={project.type}
                    requester={project.requester}
                    goal={project.goal}
                    description={project.description}
                    onApprove={handleApprove(project.request_id, project.title)}
                    onTriggerDeclineModal={handleDecline(project.request_id, project.title)}
                  />
                ))}

              {(currTab === "Active" || currTab === "Inactive") &&
                currentProjects.map((project) => (
                  <ProjectCardActive
                    key={project.id}
                    id={project.request_id}
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

      {showDeclineModal && (
        <DeclineModal
          reason={declineReason}
          setReason={setDeclineReason}
          onClose={() => setShowDeclineModal(false)}
          onSubmit={handleFinalDecline}
        />
      )}
    </div>
  );
}