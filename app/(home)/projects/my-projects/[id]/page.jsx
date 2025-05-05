"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  GraduationCap,
  HeartHandshake,
  Calendar,
  User,
  MessageSquare,
  Trash2,
  Edit3,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import ToastNotification from "@/components/ToastNotification";
import MessagesModal from "./MessagesModal";
import EditModal from "./EditModal";
import RejectionModal from "./RejectionModal";
import axios from "axios";
import { formatCurrency, capitalizeName } from "@/utils/format";
import { PROJECT_TYPE } from "@/constants/projectConsts";
import { REQUEST_STATUS, REQUEST_STATUS_LABELS } from "@/constants/requestConsts";

export default function UserProjects() {
  const { id: user_id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewMessagesModalOpen, setIsViewMessagesModalOpen] = useState(false);
  const [isRejectionDetailsModalOpen, setIsRejectionDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [toast, setToast] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectPhotos, setProjectPhotos] = useState({});

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests/projects`, {
          params: { user_id }
        });
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
                id: project.projectData.project_id,
                title: project.projectData.title,
                description: project.projectData.details,
                image: photoMap[project.projectData.project_id] || "/projects/assets/Donation.jpg",
                goal: project.projectData.goal_amount.toString(),
                raised: project.projectData.total_donations.toString(),
                donors: project.projectData.number_of_donors,
                type: project.projectData.type,
                createdAt: project.date_requested,
                endDate: project.projectData.due_date,
                project_status: project.projectData.project_status,
                donationLink: project.projectData.donation_link,
                requester: project.requesterData.full_name,
                dateCompleted: project.projectData.date_complete,
                status: project.status,
                request_id: project.request_id,
                messages: [{
                  id: project.projectData.project_id,
                  sender: "Admin",
                  content: project.response,
                  timestamp: project.date_reviewed,
                  isRead: false,
                }],
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

    fetchUserProjects();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
    case REQUEST_STATUS_LABELS[REQUEST_STATUS.APPROVED]:
      return "bg-green-100 text-green-700";
    case REQUEST_STATUS_LABELS[REQUEST_STATUS.SENT]:
      return "bg-blue-100 text-blue-700";
    case REQUEST_STATUS_LABELS[REQUEST_STATUS.REJECTED]:
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
    case REQUEST_STATUS_LABELS[REQUEST_STATUS.APPROVED]:
      return <CheckCircle className="w-4 h-4" />;
    case REQUEST_STATUS_LABELS[REQUEST_STATUS.SENT]:
      return <Clock className="w-4 h-4" />;
    case REQUEST_STATUS_LABELS[REQUEST_STATUS.REJECTED]:
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleOpenEditModal = (project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleOpenMessagesModal = (openProject) => {
    setSelectedProject(openProject);
    setIsViewMessagesModalOpen(true);

    // Mark all messages as read
    const updatedProjects = projects.map((project) => {
      if (project.id === openProject.id) {
        return {
          ...project,
          messages: project.messages.map((msg) => ({
            ...msg,
            isRead: true,
          })),
        };
      }
      return project;
    });

    setProjects(updatedProjects);

    //Update selected project with read messages
    const updatedSelectedProject = updatedProjects.find(
      (project) => project.id === openProject.id
    );
    setSelectedProject(updatedSelectedProject);
  };

  const handleOpenRejectionDetailsModal = (project) => {
    setSelectedProject(project);
    setIsRejectionDetailsModalOpen(true);
  };

  const handleSubmitEditRequest = () => {
    //Handle edit submission logic here
    setIsEditModalOpen(false);
    setToast({
      type: "success",
      message: "Edit request submitted successfully!",
    });
  };

  const toggleExpandProject = (id) => {
    if (expandedProject === id) {
      setExpandedProject(null);
    } else {
      setExpandedProject(id);
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (activeTab === "all") return true;
    return REQUEST_STATUS_LABELS[project.status].toLowerCase() === activeTab.toLowerCase();
  });

  const getUnreadMessagesCount = (project) => {
    return project.messages.filter((message) => !message.isRead).length;
  };

  const handleMessageSent = (projectId, newMessage) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          messages: [
            ...project.messages,
            {
              id: `m${Math.random().toString(36).substr(2, 9)}`,
              sender: "You",
              content: newMessage,
              timestamp: new Date().toISOString(),
              isRead: true,
            },
          ],
        };
      }
      return project;
    });

    setProjects(updatedProjects);

    //Update the selected project with the new messages
    const updatedSelectedProject = updatedProjects.find(
      (project) => project.id === projectId
    );
    setSelectedProject(updatedSelectedProject);

    setToast({
      type: "success",
      message: "Message sent successfully!",
    });
  };

  return (
    <div className="bg-astradirtywhite min-h-screen pb-12">
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/*Back Navigation */}
      <div className="max-w-6xl mx-auto px-6 pt-5 pb-5">
        <button
          onClick={() => router.push("/projects")}
          className="flex items-center gap-2 text-astraprimary font-medium hover:text-astraprimary/80 transition-colors py-2 px-3 rounded-lg border border-astragray/20 bg-astrawhite shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </button>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-astraprimary to-astraprimary/90 pt-6 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-astrawhite mb-2">My Projects</h1>
              <p className="text-astrawhite/80">
                Manage and track all your fundraising projects in one place
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-12">
        {/* Tabs */}
        <div className="bg-astrawhite rounded-t-xl shadow-md mb-6 overflow-hidden">
          <div className="flex border-b border-astragray/20">
            <button
              onClick={() => handleTabChange("all")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "all"
                  ? "text-astraprimary border-b-2 border-astraprimary"
                  : "text-astradarkgray hover:text-astraprimary"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => handleTabChange(REQUEST_STATUS_LABELS[REQUEST_STATUS.APPROVED])}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === REQUEST_STATUS_LABELS[REQUEST_STATUS.APPROVED]
                  ? "text-astraprimary border-b-2 border-astraprimary"
                  : "text-astradarkgray hover:text-astraprimary"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => handleTabChange(REQUEST_STATUS_LABELS[REQUEST_STATUS.SENT])}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === REQUEST_STATUS_LABELS[REQUEST_STATUS.SENT]
                  ? "text-astraprimary border-b-2 border-astraprimary"
                  : "text-astradarkgray hover:text-astraprimary"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleTabChange(REQUEST_STATUS_LABELS[REQUEST_STATUS.REJECTED])}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === REQUEST_STATUS_LABELS[REQUEST_STATUS.REJECTED]
                  ? "text-astraprimary border-b-2 border-astraprimary"
                  : "text-astradarkgray hover:text-astraprimary"
              }`}
            >
              Rejected
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-astralightgray/50 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4">
                    <AlertCircle className="w-10 h-10 text-astradarkgray/50" />
                  </div>
                  <h3 className="text-xl font-medium text-astradarkgray mb-2">
                    No {activeTab !== "all" ? activeTab.toLowerCase() : ""} projects found
                  </h3>
                  <p className="text-astradarkgray/80 max-w-md mx-auto">
                    {activeTab === "all"
                      ? "You haven't created any projects yet. Start by creating your first project!"
                      : `You don't have any ${activeTab.toLowerCase()} projects at the moment.`}
                  </p>
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-astrawhite rounded-xl shadow hover:shadow-lg transition-all border border-astragray/10 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Image */}
                        <div className="md:w-48 h-36 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={project.image}
                            alt={project.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-astrablack">
                              {project.title}
                            </h2>
                            <span
                              className={`${getStatusColor(
                                REQUEST_STATUS_LABELS[project.status]
                              )} px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1.5`}
                            >
                              {getStatusIcon(REQUEST_STATUS_LABELS[project.status])}
                              {capitalizeName(REQUEST_STATUS_LABELS[project.status])}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mb-3">
                            <div className="flex items-center gap-1.5 text-sm text-astradarkgray">
                              <div className="bg-astragray/20 p-1 rounded">
                                {project.type === PROJECT_TYPE.SCHOLARSHIP ? (
                                  <GraduationCap className="w-3.5 h-3.5" />
                                ) : (
                                  <HeartHandshake className="w-3.5 h-3.5" />
                                )}
                              </div>
                              {capitalizeName(project.type)}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-astradarkgray">
                              <div className="bg-astragray/20 p-1 rounded">
                                <Calendar className="w-3.5 h-3.5" />
                              </div>
                              Created: {new Date(project.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <p className="text-astradarkgray mb-4 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Progress bar (only for approved projects) */}
                          {project.status === REQUEST_STATUS_LABELS[REQUEST_STATUS.APPROVED] && (
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="font-medium">Progress</span>
                                <span>
                                  {project.raised} of {project.goal}
                                </span>
                              </div>
                              <div className="h-2 bg-astralightgray rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-astraprimary transition-all duration-500"
                                  style={{
                                    width: `${Math.min(
                                      Math.round(
                                        (parseInt(project.raised.replace(/[^\d]/g, "")) /
                                          parseInt(project.goal.replace(/[^\d]/g, ""))) *
                                          100
                                      ),
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-3">
                            {project.status === REQUEST_STATUS_LABELS[REQUEST_STATUS.APPROVED] && (
                              <button
                                onClick={() => handleOpenEditModal(project)}
                                className="flex items-center gap-1.5 bg-amber-100 text-amber-700 py-2 px-4 rounded-lg text-sm hover:bg-amber-200 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                                Request Edit
                              </button>
                            )}

                            {project.status === REQUEST_STATUS_LABELS[REQUEST_STATUS.REJECTED] && (
                              <button
                                onClick={() =>
                                  handleOpenRejectionDetailsModal(project)
                                }
                                className="flex items-center gap-1.5 bg-red-100 text-red-700 py-2 px-4 rounded-lg text-sm hover:bg-red-200 transition-colors"
                              >
                                <AlertCircle className="w-4 h-4" />
                                View Rejection Details
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenMessagesModal(project)}
                              className="flex items-center gap-1.5 bg-astralightgray text-astradarkgray py-2 px-4 rounded-lg text-sm hover:bg-astragray/20 transition-colors relative"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Messages
                              {getUnreadMessagesCount(project) > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                  {getUnreadMessagesCount(project)}
                                </span>
                              )}
                            </button>

                            <button
                              onClick={() => toggleExpandProject(project.id)}
                              className="ml-auto flex items-center gap-1 text-astradarkgray hover:text-astraprimary transition-colors"
                            >
                              {expandedProject === project.id
                                ? "Less Details"
                                : "More Details"}
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  expandedProject === project.id
                                    ? "transform rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {expandedProject === project.id && (
                        <div className="mt-6 pt-6 border-t border-astragray/20 space-y-4 animate-expandDown">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="font-medium mb-2 text-astrablack">
                                Project Details
                              </h4>
                              <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                  <span className="text-astradarkgray">
                                    Goal Amount:
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(project.goal)}
                                  </span>
                                </li>
                                <li className="flex justify-between">
                                  <span className="text-astradarkgray">
                                    End Date:
                                  </span>
                                  <span className="font-medium">
                                    {new Date(
                                      project.endDate
                                    ).toLocaleDateString()}
                                  </span>
                                </li>
                                {project.status === REQUEST_STATUS_LABELS[REQUEST_STATUS.APPROVED] && (
                                  <>
                                    <li className="flex justify-between">
                                      <span className="text-astradarkgray">
                                        Amount Raised:
                                      </span>
                                      <span className="font-medium">
                                        {project.raised}
                                      </span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span className="text-astradarkgray">
                                        Number of Donors:
                                      </span>
                                      <span className="font-medium">
                                        {project.donors}
                                      </span>
                                    </li>
                                  </>
                                )}
                              </ul>
                            </div>

                            <div className="md:col-span-2">
                              <h4 className="font-medium mb-2 text-astrablack">
                                Description
                              </h4>
                              <p className="text-sm text-astradarkgray">
                                {project.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end pt-4">
                            {project.status === REQUEST_STATUS_LABELS[REQUEST_STATUS.REJECTED] ? (
                              <button
                                onClick={() => router.push("/projects/request/goal")}
                                className="flex items-center gap-1.5 bg-astraprimary text-astrawhite py-2 px-4 rounded-lg text-sm hover:bg-astraprimary/90 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                                Resubmit Project
                              </button>
                            ) : project.status === REQUEST_STATUS_LABELS[REQUEST_STATUS.SENT] ? (
                              <button
                                onClick={() => {
                                  // Handle cancellation logic
                                  const updatedProjects = projects.filter(
                                    (f) => f.id !== project.id
                                  );
                                  setProjects(updatedProjects);
                                  setToast({
                                    type: "success",
                                    message:
                                      "Project request cancelled successfully!",
                                  });
                                }}
                                className="flex items-center gap-1.5 bg-red-100 text-red-700 py-2 px-4 rounded-lg text-sm hover:bg-red-200 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Cancel Request
                              </button>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && selectedProject && (
        <EditModal
          project={selectedProject}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleSubmitEditRequest}
        />
      )}

      {isViewMessagesModalOpen && selectedProject && (
        <MessagesModal
          project={selectedProject}
          onClose={() => setIsViewMessagesModalOpen(false)}
          onSendMessage={(message) => handleMessageSent(selectedProject.id, message)}
        />
      )}

      {isRejectionDetailsModalOpen && selectedProject && (
        <RejectionModal
          project={selectedProject}
          onClose={() => setIsRejectionDetailsModalOpen(false)}
          onResubmit={() => {
            setIsRejectionDetailsModalOpen(false);
            router.push("/projects/create");
          }}
        />
      )}
    </div>
  );
}