"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

import { GoBackButton } from "@/components/Buttons";
import ToastNotification from "@/components/ToastNotification";
import ContactModal from "@/components/projects/ContactModal";
import ProjectDetails from "@/components/projects/ProjectDetails";
import RequesterActions from "@/components/projects/RequesterActions";
import DeclineModal from "@/components/projects/DeclineModal";
import { capitalizeName } from "@/utils/format";
import axios from "axios";
import { HeartHandshake } from "lucide-react";
import { GraduationCap } from "lucide-react";
import { PROJECT_TYPE } from "@/constants/projectConsts";

export default function PendingProjectDetail({ params }) {
  const id = use(params).id;
  const router = useRouter();

  const [toast, setToast] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState("/projects/assets/Donation.png");

  const [projectPhoto, setProjectPhoto] = useState({});

  const STATUS = {
    APPROVE: 1,
    DECLINE: 2
  };

  // Add constant for fallback image
  const FALLBACK_IMAGE = "/projects/assets/Donation.png";

  // Add timeout for image loading
  useEffect(() => {
    let timeoutId;
    if (imageLoading) {
      timeoutId = setTimeout(() => {
        setImageLoading(false);
        setImageError(true);
        setImageSrc(FALLBACK_IMAGE);
      }, 5000); // 5 second timeout
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [imageLoading]);

  useEffect(() => {
    const fetchProjectRequest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests/projects/${id}`);
        const projectData = response.data;
        if (projectData.status === "OK") {
          const projectId = projectData.list.projectData.project_id;

          // Fetch photo for this single project
          try {
            const photoResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/project/${projectId}`
            );

            if (photoResponse.data.status === "OK" && photoResponse.data.photo) {
              setImageLoading(true);
              setImageError(false);
              setImageSrc(photoResponse.data.photo);
            } else {
              setImageLoading(false);
              setImageError(true);
              setImageSrc(FALLBACK_IMAGE);
            }
          } catch (error) {
            console.log(`Failed to fetch photo for project_id ${projectId}:`, error);
            setImageError(true);
            setImageLoading(false);
            setImageSrc(FALLBACK_IMAGE);
          }

          setProjectData({
            id: projectData.list.projectData.project_id,
            title: projectData.list.projectData.title,
            image: FALLBACK_IMAGE,
            description: projectData.list.projectData.details,
            longDescription: projectData.list.projectData.details,
            goal: projectData.list.projectData.goal_amount.toString(),
            requester: {
              name: projectData.list.requesterData.full_name,
              email: projectData.list.requesterData.email,
              phone: "N/A",
              position: projectData.list.requesterData.role === "unlinked" || projectData.list.requesterData.role === null
                ? "N/A"
                : projectData.list.requesterData.role,
            },
            submissionDate: projectData.list.date_requested,
            proposedStartDate: "1999-01-01",
            proposedEndDate: projectData.list.projectData.due_date,
            eligibilityCriteria: "NA",
            fundDistribution: "NA",
            status: projectData.list.status,
            request_id: projectData.list.request_id,
            project_status: projectData.list.projectData.project_status,
            type: projectData.list.projectData.type,
            donationLink: projectData.list.projectData.donation_link,
          });
        } else {
          console.error("Unexpected response:", projectData);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectRequest();
  }, []);

  const project = projectData;
  // {
  //   id,
  //   title: "Women in Tech Scholarship",
  //   type: "Scholarship",
  //   image: "/projects/assets/Donation.jpg",
  //   description: "Supporting female students pursuing degrees in computer science and information technology to increase representation in tech.",
  //   longDescription: "This scholarship aims to address the gender gap in technology fields by providing financial support to female students who demonstrate academic excellence and passion for computer science and IT. Recipients will receive funding for tuition, books, and have opportunities to connect with female mentors in the industry. The scholarship committee will select candidates based on academic merit, financial need, and demonstrated interest in pursuing a career in technology. By supporting this initiative, we hope to contribute to a more diverse and inclusive tech workforce in the future.",
  //   goal: "₱300,000",
  //   requester: {
  //     name: "Ma'am Mira Fanclub",
  //     email: "mirafanclub@email.com",
  //     phone: "+63 912 345 6789",
  //     position: "Student Organization",
  //   },
  //   submissionDate: "2025-02-15",
  //   proposedStartDate: "2025-06-01",
  //   proposedEndDate: "2025-09-30",
  //   eligibilityCriteria: "Female students majoring in Computer Science or Information Technology with at least a 2.5 GPA. Must demonstrate financial need and submit a personal essay on their career goals in tech.",
  //   fundDistribution: "50% for tuition fees, 30% for books and study materials, 20% for mentorship program expenses",
  // };

  const updateProjectRequest = async (updatedStatus, updatedResponse) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests/${id}`, {
        status: updatedStatus,
        response: updatedResponse,
      });
      if (response.data.status === "UPDATED") {
        console.log("Successfully updated project request with id:", id);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Failed to approve project request:", error);
    }
  };


  const handleApprove = () => {
    updateProjectRequest(STATUS.APPROVE);
    setToast({ type: "success", message: `${project.title} has been approved!` });
    setTimeout(() => router.push("/admin/projects"), 2000);
  };

  const handleDecline = () => {
    setToast({ type: "fail", message: `${project.title} has been declined!` });
    setTimeout(() => router.push("/admin/projects"), 2000);
  };

  const handleFinalDecline = () => {
    updateProjectRequest(STATUS.DECLINE, declineReason);
    setToast({ type: "fail", message: `${project.title} has been declined. Reason: ${declineReason}` });
    setShowDeclineModal(false);
    setDeclineReason("");
    setTimeout(() => router.push("/admin/projects"), 2000);
  };

  const handleSendMessage = () => {
    setToast({ type: "success", message: "Message sent successfully!" });
    setShowContactModal(false);
    setMessage("");
  };

  if (loading) {
    return (
      <div className="bg-astradirtywhite min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-astraprimary"></div>
          <p className="text-astraprimary font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-astradirtywhite min-h-screen pb-12">
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Banner */}
      <div className="relative h-64">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-astralightgray/50 z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-astraprimary"></div>
          </div>
        )}
        <img
          src={imageSrc}
          alt={project.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => {
            setImageLoading(false);
          }}
          onError={(e) => {
            console.error("Image failed to load:", e);
            setImageError(true);
            setImageSrc(FALLBACK_IMAGE);
            setImageLoading(false);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30 flex items-end">
          <div className="p-6 text-astrawhite w-full">
            <div className="flex items-center mt-4">
              <h1 className="font-h1 text-astrawhite text-shadow shadow-black">{project.title}</h1>
              <span className="ml-4 bg-yellow-500 text-astrawhite px-3 py-1 rounded-lg font-sb">Pending</span>
            </div>
            <div className="flex items-center mt-2">
              <div className="bg-astrawhite text-astradark px-3 py-1 rounded-lg text-sm font-s flex items-center gap-1">
                {project.type === PROJECT_TYPE.SCHOLARSHIP? (
                  <GraduationCap className="w-4 h-4" />
                ) : (
                  <HeartHandshake className="w-4 h-4" />
                )}
                {project?.type ? capitalizeName(project.type) : project?.type}
              </div>
              <div className="ml-4 bg-astrawhite text-astradark px-3 py-1 rounded-lg text-sm font-s flex items-center gap-1">
                Submitted: {new Date(project.submissionDate).toLocaleDateString("en-PH")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <GoBackButton />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProjectDetails project={project} />
        <RequesterActions
          project={project}
          onApprove={handleApprove}
          onDecline={handleDecline}
          onContact={() => setShowContactModal(true)}
          onTriggerDeclineModal={() => setShowDeclineModal(true)}
        />
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          requester={project.requester}
          message={message}
          setMessage={setMessage}
          onClose={() => setShowContactModal(false)}
          onSend={handleSendMessage}
        />
      )}

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
