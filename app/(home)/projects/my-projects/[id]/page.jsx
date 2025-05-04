"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { fundraisers as initialFundraisers } from "./fundraisersData";

export default function UserFundraisers() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewMessagesModalOpen, setIsViewMessagesModalOpen] = useState(false);
  const [isRejectionDetailsModalOpen, setIsRejectionDetailsModalOpen] = useState(false);
  const [selectedFundraiser, setSelectedFundraiser] = useState(null);
  const [toast, setToast] = useState(null);
  const [expandedFundraiser, setExpandedFundraiser] = useState(null);
  const [fundraisers, setFundraisers] = useState(initialFundraisers);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleOpenEditModal = (fundraiser) => {
    setSelectedFundraiser(fundraiser);
    setIsEditModalOpen(true);
  };

  const handleOpenMessagesModal = (fundraiser) => {
    setSelectedFundraiser(fundraiser);
    setIsViewMessagesModalOpen(true);

    // Mark all messages as read
    const updatedFundraisers = fundraisers.map((f) => {
      if (f.id === fundraiser.id) {
        return {
          ...f,
          messages: f.messages.map((msg) => ({
            ...msg,
            isRead: true,
          })),
        };
      }
      return f;
    });

    setFundraisers(updatedFundraisers);

    // Update selected fundraiser with read messages
    const updatedSelectedFundraiser = updatedFundraisers.find(
      (f) => f.id === fundraiser.id
    );
    setSelectedFundraiser(updatedSelectedFundraiser);
  };

  const handleOpenRejectionDetailsModal = (fundraiser) => {
    setSelectedFundraiser(fundraiser);
    setIsRejectionDetailsModalOpen(true);
  };

  const handleSubmitEditRequest = () => {
    // Handle edit submission logic here
    setIsEditModalOpen(false);
    setToast({
      type: "success",
      message: "Edit request submitted successfully!",
    });
  };

  const toggleExpandFundraiser = (id) => {
    if (expandedFundraiser === id) {
      setExpandedFundraiser(null);
    } else {
      setExpandedFundraiser(id);
    }
  };

  const filteredFundraisers = fundraisers.filter((fundraiser) => {
    if (activeTab === "all") return true;
    return fundraiser.status === activeTab;
  });

  const getUnreadMessagesCount = (fundraiser) => {
    return fundraiser.messages.filter((message) => !message.isRead).length;
  };

  const handleMessageSent = (fundraiserId, newMessage) => {
    const updatedFundraisers = fundraisers.map((fundraiser) => {
      if (fundraiser.id === fundraiserId) {
        return {
          ...fundraiser,
          messages: [
            ...fundraiser.messages,
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
      return fundraiser;
    });

    setFundraisers(updatedFundraisers);

    // Update the selected fundraiser with the new messages
    const updatedSelectedFundraiser = updatedFundraisers.find(
      (fundraiser) => fundraiser.id === fundraiserId
    );
    setSelectedFundraiser(updatedSelectedFundraiser);

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

      {/* Header */}
      <div className="bg-gradient-to-r from-astraprimary to-astraprimary/90 pt-12 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-astrawhite mb-2">My Projects</h1>
              <p className="text-astrawhite/80">
                Manage and track all your fundraising projects in one place
              </p>
            </div>
            <button
              onClick={() => router.push("/projects/request/goal")}
              className="bg-astrawhite text-astraprimary py-2 px-4 rounded-lg flex items-center gap-2 font-medium transition-colors hover:bg-astrawhite/90 shadow-lg"
            >
              <HeartHandshake className="w-5 h-5" />
              Request Fundraiser
            </button>
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
              All Fundraisers
            </button>
            <button
              onClick={() => handleTabChange("approved")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "approved"
                  ? "text-astraprimary border-b-2 border-astraprimary"
                  : "text-astradarkgray hover:text-astraprimary"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => handleTabChange("pending")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "pending"
                  ? "text-astraprimary border-b-2 border-astraprimary"
                  : "text-astradarkgray hover:text-astraprimary"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleTabChange("rejected")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "rejected"
                  ? "text-astraprimary border-b-2 border-astraprimary"
                  : "text-astradarkgray hover:text-astraprimary"
              }`}
            >
              Rejected
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {filteredFundraisers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-astralightgray/50 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4">
                    <AlertCircle className="w-10 h-10 text-astradarkgray/50" />
                  </div>
                  <h3 className="text-xl font-medium text-astradarkgray mb-2">
                    No {activeTab !== "all" ? activeTab : ""} fundraisers found
                  </h3>
                  <p className="text-astradarkgray/80 max-w-md mx-auto">
                    {activeTab === "all"
                      ? "You haven't created any fundraisers yet. Start by creating your first fundraiser!"
                      : `You don't have any ${activeTab} fundraisers at the moment.`}
                  </p>
                </div>
              ) : (
                filteredFundraisers.map((fundraiser) => (
                  <div
                    key={fundraiser.id}
                    className="bg-astrawhite rounded-xl shadow hover:shadow-lg transition-all border border-astragray/10 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Image */}
                        <div className="md:w-48 h-36 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={fundraiser.image}
                            alt={fundraiser.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-astrablack">
                              {fundraiser.title}
                            </h2>
                            <span
                              className={`${getStatusColor(
                                fundraiser.status
                              )} px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1.5`}
                            >
                              {getStatusIcon(fundraiser.status)}
                              {fundraiser.status.charAt(0).toUpperCase() +
                                fundraiser.status.slice(1)}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mb-3">
                            <div className="flex items-center gap-1.5 text-sm text-astradarkgray">
                              <div className="bg-astragray/20 p-1 rounded">
                                {fundraiser.type === "Scholarship" ? (
                                  <GraduationCap className="w-3.5 h-3.5" />
                                ) : (
                                  <HeartHandshake className="w-3.5 h-3.5" />
                                )}
                              </div>
                              {fundraiser.type}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-astradarkgray">
                              <div className="bg-astragray/20 p-1 rounded">
                                <Calendar className="w-3.5 h-3.5" />
                              </div>
                              Created: {new Date(fundraiser.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <p className="text-astradarkgray mb-4 line-clamp-2">
                            {fundraiser.description}
                          </p>

                          {/* Progress bar (only for approved fundraisers) */}
                          {fundraiser.status === "approved" && (
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="font-medium">Progress</span>
                                <span>
                                  {fundraiser.raised} of {fundraiser.goal}
                                </span>
                              </div>
                              <div className="h-2 bg-astralightgray rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-astraprimary transition-all duration-500"
                                  style={{
                                    width: `${Math.min(
                                      Math.round(
                                        (parseInt(fundraiser.raised.replace(/[^\d]/g, "")) /
                                          parseInt(fundraiser.goal.replace(/[^\d]/g, ""))) *
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
                            {fundraiser.status === "approved" && (
                              <button
                                onClick={() =>
                                  router.push(`/projects/${fundraiser.id}`)
                                }
                                className="flex items-center gap-1.5 bg-astraprimary text-astrawhite py-2 px-4 rounded-lg text-sm hover:bg-astraprimary/90 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Page
                              </button>
                            )}

                            {fundraiser.status === "approved" && (
                              <button
                                onClick={() => handleOpenEditModal(fundraiser)}
                                className="flex items-center gap-1.5 bg-amber-100 text-amber-700 py-2 px-4 rounded-lg text-sm hover:bg-amber-200 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                                Request Edit
                              </button>
                            )}

                            {fundraiser.status === "rejected" && (
                              <button
                                onClick={() =>
                                  handleOpenRejectionDetailsModal(fundraiser)
                                }
                                className="flex items-center gap-1.5 bg-red-100 text-red-700 py-2 px-4 rounded-lg text-sm hover:bg-red-200 transition-colors"
                              >
                                <AlertCircle className="w-4 h-4" />
                                View Rejection Details
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenMessagesModal(fundraiser)}
                              className="flex items-center gap-1.5 bg-astralightgray text-astradarkgray py-2 px-4 rounded-lg text-sm hover:bg-astragray/20 transition-colors relative"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Messages
                              {getUnreadMessagesCount(fundraiser) > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                  {getUnreadMessagesCount(fundraiser)}
                                </span>
                              )}
                            </button>

                            <button
                              onClick={() => toggleExpandFundraiser(fundraiser.id)}
                              className="ml-auto flex items-center gap-1 text-astradarkgray hover:text-astraprimary transition-colors"
                            >
                              {expandedFundraiser === fundraiser.id
                                ? "Less Details"
                                : "More Details"}
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  expandedFundraiser === fundraiser.id
                                    ? "transform rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {expandedFundraiser === fundraiser.id && (
                        <div className="mt-6 pt-6 border-t border-astragray/20 space-y-4 animate-expandDown">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="font-medium mb-2 text-astrablack">
                                Fundraiser Details
                              </h4>
                              <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                  <span className="text-astradarkgray">
                                    Goal Amount:
                                  </span>
                                  <span className="font-medium">
                                    {fundraiser.goal}
                                  </span>
                                </li>
                                <li className="flex justify-between">
                                  <span className="text-astradarkgray">
                                    End Date:
                                  </span>
                                  <span className="font-medium">
                                    {new Date(
                                      fundraiser.endDate
                                    ).toLocaleDateString()}
                                  </span>
                                </li>
                                {fundraiser.status === "approved" && (
                                  <>
                                    <li className="flex justify-between">
                                      <span className="text-astradarkgray">
                                        Amount Raised:
                                      </span>
                                      <span className="font-medium">
                                        {fundraiser.raised}
                                      </span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span className="text-astradarkgray">
                                        Number of Donors:
                                      </span>
                                      <span className="font-medium">
                                        {fundraiser.donors}
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
                                {fundraiser.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end pt-4">
                            {fundraiser.status === "rejected" ? (
                              <button
                                onClick={() => router.push("/projects/create")}
                                className="flex items-center gap-1.5 bg-astraprimary text-astrawhite py-2 px-4 rounded-lg text-sm hover:bg-astraprimary/90 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                                Resubmit Fundraiser
                              </button>
                            ) : fundraiser.status === "pending" ? (
                              <button
                                onClick={() => {
                                  // Handle cancellation logic
                                  const updatedFundraisers = fundraisers.filter(
                                    (f) => f.id !== fundraiser.id
                                  );
                                  setFundraisers(updatedFundraisers);
                                  setToast({
                                    type: "success",
                                    message:
                                      "Fundraiser request cancelled successfully!",
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
      {isEditModalOpen && selectedFundraiser && (
        <EditModal
          fundraiser={selectedFundraiser}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleSubmitEditRequest}
        />
      )}

      {isViewMessagesModalOpen && selectedFundraiser && (
        <MessagesModal
          fundraiser={selectedFundraiser}
          onClose={() => setIsViewMessagesModalOpen(false)}
          onSendMessage={(message) => handleMessageSent(selectedFundraiser.id, message)}
        />
      )}

      {isRejectionDetailsModalOpen && selectedFundraiser && (
        <RejectionModal
          fundraiser={selectedFundraiser}
          onClose={() => setIsRejectionDetailsModalOpen(false)}
          onResubmit={() => {
            setIsRejectionDetailsModalOpen(false);
            router.push("/projects/create");
          }}
        />
      )}

      {/* Back Navigation */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-astradarkgray hover:text-astraprimary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}