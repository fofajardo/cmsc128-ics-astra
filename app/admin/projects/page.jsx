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
import { formatCurrency, capitalizeName, formatDate } from "@/utils/format";
import { REQUEST_STATUS } from "@/constants/requestConsts";
import { PROJECT_STATUS, PROJECT_TYPE } from "@/constants/projectConsts";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [paginatedProjects, setPaginatedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  //this is for the current showed tab
  const [currTab, setCurrTab] = useState("Pending");

  const [donationsSummary, setDonationsSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const [projectPhotos, setProjectPhotos] = useState({});
  const [requestTo, setrequestIdToDecline] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineRequestData, setDeclineRequestData] = useState({});
  const itemsPerPage = 4;

  const toggleFilter = () => {
    setTempSelectedType(selectedType); // reset modal input to current selection
    setShowFilter((prev) => !prev);
  };

  //this is the one beside the pending/active/inactive projects
  //must change lastPage and total to what is in the database
  const [pagination, setPagination] = useState({
    display: [1, itemsPerPage],
    currPage: 1,
    lastPage: 1,
    numToShow: itemsPerPage,
    total: 0,
    itemsPerPage
  });

  const fetchProjectRequests = async function () {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests/projects`);
      const projectData = response.data;
      if (projectData.status === "OK") {
        console.log("Fetched projects:", projectData);

        // extract project id's
        const projectIds = projectData.list.map(project => project.projectData.project_id);
        // console.log(projectIds);

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

        // Check due dates and update project status to finished if past due date
        const originalProjects = projectData.list;

        // Check each project and update status if necessary
        const updatedProjects = originalProjects.map((project) => ({
          ...project,
          projectData: {
            ...project.projectData,
            project_status: checkProjectStatus(project),
          }
        }));

        console.log(updatedProjects);

        // Get the list of updated projects (those whose status has changed)
        const changedProjects = getUpdatedProjects(originalProjects, updatedProjects);
        console.log("Project past their due dates (updated project_status to finished): ", changedProjects);
        if (changedProjects.length > 0) {
          const projectIdsToUpdate = changedProjects.map(project => project.projectData.project_id);
          console.log("Project IDs to update in DB", projectIdsToUpdate);
          await updateProjectsStatus(projectIdsToUpdate); // Update status in backend
        }

        setProjects(
          updatedProjects.map(
            project => ({
              status: project.projectData.project_status === PROJECT_STATUS.FINISHED ? REQUEST_STATUS.REJECTED : project.status,  // set project as inactive if project status finished or request rejected
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

  const fetchDonationsSummary = async function () {
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

  // Function to check project status based on today's date
  const checkProjectStatus = (project) => {
    const today = new Date();
    return new Date(project.projectData.due_date) < today
      ? project.status === REQUEST_STATUS.APPROVED ? PROJECT_STATUS.FINISHED
        : project.projectData.project_status : project.projectData.project_status;
  };

  // Function to compare the current project with the updated project
  const getUpdatedProjects = (originalProjects, updatedProjects) => {
    return updatedProjects.filter(updatedProject => {
      const originalProject = originalProjects.find(project => project.projectData.project_id === updatedProject.projectData.project_id);
      if (!originalProject) return false; // Skip if no original project is found

      // Check if there's a difference (e.g., status, due_date, etc.)
      return originalProject.projectData.project_status !== updatedProject.projectData.project_status;
    });
  };

  // Function to update the project status in the backend
  const updateProjectsStatus = async (projectIds) => {
    try {
      // Send the project IDs to the backend for updating status
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects/status`, { projectIds: projectIds, project_status: PROJECT_STATUS.FINISHED });
      const updateData = response.data;
      if (updateData.status === "UPDATED") {
        console.log("Successfully updated! ", updateData);
      } else {
        console.error("Unexpected response:", updateData);
      }
    } catch (error) {
      console.error("Error updating projects:", error);
    }
  };

  useEffect(() => {
    fetchDonationsSummary();
    fetchProjectRequests();
  }, []);

  useEffect(() => {

    setFilteredProjects(projects);
  }, [projects]);

  useEffect(() => {
    const filteredProjectsByType = selectedType === "All"
      ? projects
      : projects.filter((project) => project.type === selectedType.toLowerCase());
    const filteredProjectsByStatusTab = filteredProjectsByType.filter(
      (project) => statusToTab[project.status].toLowerCase() === currTab.toLowerCase()
    );
    const lower = (searchQuery || "").toLowerCase();
    const filtered = filteredProjectsByStatusTab.filter(project =>
      (project.title || "").toLowerCase().includes(lower)
    );
    setFilteredProjects(filtered);
  }, [projects, selectedType, currTab]);

  useEffect(() => {
    const total = filteredProjects.length;
    const lastPage = Math.max(1, Math.ceil(total / itemsPerPage));

    setPagination({
      display: [1, Math.min(itemsPerPage, total)],
      currPage: 1,
      lastPage,
      numToShow: itemsPerPage,
      total,
      itemsPerPage
    });
  }, [filteredProjects, searchQuery]);

  useEffect(() => {
    const start = (pagination.currPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    setPaginatedProjects(filteredProjects.slice(start, end));
  }, [filteredProjects, pagination.currPage, pagination.itemsPerPage]);

  const handleSearch = (searchInput) => {
    const lower = (searchInput || "").toLowerCase();
    const filtered = projects.filter(project =>
      (project.title || "").toLowerCase().includes(lower)
    );
    const filteredByStatusTab = filtered.filter(
      (project) => statusToTab[project.status].toLowerCase() === currTab.toLowerCase()
    );

    setSearchQuery(searchInput);
    setFilteredProjects(filteredByStatusTab);
  };

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

  const handleApprove = (id, title, endDate) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (new Date(endDate) < new Date()) {
      setToast({
        type: "fail",
        message: `${title} is already past its due date (${formatDate(endDate, "short-month")})`
      });
    } else {
      console.log(id);
      console.log(title);
      // updateProjectRequest(REQUEST_STATUS.APPROVED, id);
      setToast({
        type: "success",
        message: `${title} has been approved!`
      });
    }
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
  const tabs = Object.values(projects).reduce((acc, project) => {
    if (project.status === 0) acc.Pending++;
    else if (project.status === 1) acc.Active++;
    else if (project.status === 2) acc.Inactive++;
    return acc;
  }, { Pending: 0, Active: 0, Inactive: 0 });

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
          className="h-[500px] w-full object-cover"
        />
        <div className="absolute inset-2 flex flex-col items-center justify-between text-astrawhite z-20 min-h-[500px]">
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

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 px-4 w-full max-w-2xl pb-12 items-center justify-center">
            {/* Create a project button */}
            <Link href="/projects/request/goal" passHref className="w-full sm:w-auto">
              <button className="mt-2 border-2 border-astrawhite text-astrawhite hover:bg-astrawhite hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-full sm:w-[200px] h-[60px]">
                Create a Project
              </button>
            </Link>

            {/* Manage donations button */}
            <Link href="/admin/donations" passHref className="w-full sm:w-auto">
              <button className="mt-2 border-2 border-astrawhite text-astrawhite hover:bg-astrawhite hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-full sm:w-[200px] h-[60px]">
                Manage Donations
              </button>
            </Link>
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
            setPagination={setPagination}
            toggleFilter={toggleFilter}
            setSearchQuery={handleSearch}
            searchQuery={searchQuery}
            optionValues={["4","8","12","16","20"]}
          />

          {/* Projects Grid */}
          {loading ? (
            <div className="bg-astrawhite p-6 rounded-b-xl flex items-center justify-center">
              <LoadingSpinner className="h-10 w-10" />
            </div>
          ) : (
            <div className="bg-astrawhite shadow-md p-6 rounded-b-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currTab === "Pending" &&
                  paginatedProjects.map((project) => (
                    <ProjectCardPending
                      key={project.id}
                      id={project.request_id}
                      image={project.image}
                      title={project.title}
                      type={project.type}
                      requester={project.requester}
                      goal={project.goal}
                      description={project.description}
                      onApprove={handleApprove(project.request_id, project.title, project.endDate)}
                      onTriggerDeclineModal={handleDecline(project.request_id, project.title)}
                    />
                  ))}

                {(currTab === "Active" || currTab === "Inactive") &&
                  paginatedProjects.map((project) => (
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
              {paginatedProjects.length === 0 && (
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
          )}

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