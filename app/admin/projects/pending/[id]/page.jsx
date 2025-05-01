"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

import { GoBackButton } from "@/components/Buttons";
import ToastNotification from "@/components/ToastNotification";
import ContactModal from "@/components/projects/ContactModal";
import ProjectDetails from "@/components/projects/ProjectDetails";
import RequesterActions from "@/components/projects/RequesterActions";
import DeclineModal from "@/components/projects/DeclineModal";

export default function PendingProjectDetail({ params }) {
  const id = use(params).id;
  const router = useRouter();

  const [toast, setToast] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const project = {
    id,
    title: "Women in Tech Scholarship",
    type: "Scholarship",
    image: "/projects/assets/Donation.jpg",
    description: "Supporting female students pursuing degrees in computer science and information technology to increase representation in tech.",
    longDescription: "This scholarship aims to address the gender gap in technology fields by providing financial support to female students who demonstrate academic excellence and passion for computer science and IT. Recipients will receive funding for tuition, books, and have opportunities to connect with female mentors in the industry. The scholarship committee will select candidates based on academic merit, financial need, and demonstrated interest in pursuing a career in technology. By supporting this initiative, we hope to contribute to a more diverse and inclusive tech workforce in the future.",
    goal: "₱300,000",
    requester: {
      name: "Ma'am Mira Fanclub",
      email: "mirafanclub@email.com",
      phone: "+63 912 345 6789",
      position: "Student Organization",
    },
    submissionDate: "2025-02-15",
    proposedStartDate: "2025-06-01",
    proposedEndDate: "2025-09-30",
    eligibilityCriteria: "Female students majoring in Computer Science or Information Technology with at least a 2.5 GPA. Must demonstrate financial need and submit a personal essay on their career goals in tech.",
    fundDistribution: "50% for tuition fees, 30% for books and study materials, 20% for mentorship program expenses",
  };

  const handleApprove = () => {
    setToast({ type: "success", message: `${project.title} has been approved!` });
    setTimeout(() => router.push("/admin/projects"), 2000);
  };

  const handleDecline = () => {
    setToast({ type: "fail", message: `${project.title} has been declined!` });
    setTimeout(() => router.push("/admin/projects"), 2000);
  };

  const handleFinalDecline = () => {
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
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30 flex items-end">
          <div className="p-6 text-astrawhite w-full">
            <div className="flex items-center mt-4">
              <h1 className="font-h1 text-astrawhite text-shadow shadow-black">{project.title}</h1>
              <span className="ml-4 bg-yellow-500 text-astrawhite px-3 py-1 rounded-lg font-sb">Pending</span>
            </div>
            <div className="flex items-center mt-2">
              <div className="bg-astrawhite text-astradark px-3 py-1 rounded-lg text-sm font-s flex items-center gap-1">
                {project.type}
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
