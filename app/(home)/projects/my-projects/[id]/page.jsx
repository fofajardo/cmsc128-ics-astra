"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  GraduationCap,
  HeartHandshake,
  Calendar,
  User,
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
import EditModal from "./EditModal";
import axios from "axios";
import { formatCurrency, capitalizeName } from "@/utils/format";
import { PROJECT_TYPE } from "@/constants/projectConsts";
import { REQUEST_STATUS, REQUEST_STATUS_LABELS } from "@/constants/requestConsts";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function UserProjects() {
  const { id: user_id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [toast, setToast] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [loading, setLoading] = useState(true);
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
          console.log("First project response:", projectData.list[0]?.response);

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

          const mappedProjects = projectData.list.map(
            project => {
              console.log('Project status:', project.status);
              console.log('Project response:', project.response);
              console.log('REQUEST_STATUS_LABELS:', REQUEST_STATUS_LABELS);
              console.log('REQUEST_STATUS_LABELS[REQUEST_STATUS.APPROVED]:', REQUEST_STATUS_LABELS[REQUEST_STATUS.APPROVED]);
              return {
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
                response: project.response,
              };
            }
          );
          console.log('Mapped projects:', mappedProjects);
          setProjects(mappedProjects);
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

  return (
    <div className="bg-astradirtywhite min-h-screen pb-12">
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header with integrated back button */}
      <div className="bg-gradient-to-r from-astraprimary to-astraprimary/90 pt-6 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-astrawhite mb-2 mt-5">My Projects</h1>
              <p className="text-astrawhite/80">
                Manage and track all your fundraising projects in one place
              </p>
            </div>
            <button
              onClick={() => router.push("/projects")}
              className="flex items-center gap-2 text-astrawhite hover:text-astrablack transition-colors w-fit px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Projects
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-14">
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
              {loading ? (
                <div className="bg-astrawhite p-6 rounded-b-xl flex items-center justify-center">
                  <LoadingSpinner className="h-10 w-10" />
                </div>
              ) : (
                filteredProjects.length === 0 ? (
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium mb-2 text-astrablack">
                                  Project Details
                                </h4>
                                <div className="space-y-2">
                                  <p className="text-sm text-astradarkgray">
                                    <span className="font-medium">Type:</span>{" "}
                                    {capitalizeName(project.type)}
                                  </p>
                                  <p className="text-sm text-astradarkgray">
                                    <span className="font-medium">Created:</span>{" "}
                                    {new Date(project.createdAt).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-astradarkgray">
                                    <span className="font-medium">End Date:</span>{" "}
                                    {new Date(project.endDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2 text-astrablack">
                                  Status Details
                                </h4>
                                <div className="space-y-2">
                                  <p className="text-sm text-astradarkgray">
                                    <span className="font-medium">Status:</span>{" "}
                                    {capitalizeName(REQUEST_STATUS_LABELS[project.status])}
                                  </p>
                                  {project.status === REQUEST_STATUS_LABELS[REQUEST_STATUS.APPROVED] && (
                                    <p className="text-sm text-astradarkgray">
                                      <span className="font-medium">Donors:</span>{" "}
                                      {project.donors}
                                    </p>
                                  )}
                                  {project.status === REQUEST_STATUS.REJECTED && project.response && (
                                    <p className="text-sm text-astradarkgray">
                                      <span className="font-medium">Reason for Rejection:</span>{" "}
                                      {project.response}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedProject && (
        <EditModal
          project={selectedProject}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleSubmitEditRequest}
        />
      )}
    </div>
  );
}