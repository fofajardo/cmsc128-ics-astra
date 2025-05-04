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
  Send,
} from "lucide-react";
import ToastNotification from "@/components/ToastNotification";

export default function UserFundraisers() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewMessagesModalOpen, setIsViewMessagesModalOpen] = useState(false);
  const [isRejectionDetailsModalOpen, setIsRejectionDetailsModalOpen] = useState(false);
  const [selectedFundraiser, setSelectedFundraiser] = useState(null);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);
  const [expandedFundraiser, setExpandedFundraiser] = useState(null);

  // Dummy fundraiser data
  const [fundraisers, setFundraisers] = useState([
    {
      id: "1",
      title: "Women in Tech Scholarship",
      type: "Scholarship",
      image: "/projects/assets/Donation.jpg",
      status: "approved",
      description: "Supporting female students pursuing degrees in CS and IT to increase representation in tech.",
      goal: "₱300,000",
      raised: "₱200,000",
      donors: 87,
      endDate: "2025-09-30",
      createdAt: "2025-01-15",
      rejectionReason: null,
      messages: [
        {
          id: "m1",
          sender: "Admin",
          content: "Your fundraiser has been approved! Congratulations!",
          timestamp: "2025-01-16T10:30:00",
          isRead: true,
        },
        {
          id: "m2",
          sender: "Admin",
          content: "We've featured your fundraiser on our homepage.",
          timestamp: "2025-01-20T14:22:00",
          isRead: false,
        },
      ],
    },
    {
      id: "2",
      title: "Community Library Expansion",
      type: "Community",
      image: "/projects/assets/Library.jpg",
      status: "pending",
      description: "Expanding our local library to provide more educational resources to the community.",
      goal: "₱500,000",
      raised: "₱0",
      donors: 0,
      endDate: "2025-10-15",
      createdAt: "2025-04-28",
      rejectionReason: null,
      messages: [],
    },
    {
      id: "3",
      title: "Medical Support for Children",
      type: "Medical",
      image: "/projects/assets/Medical.jpg",
      status: "rejected",
      description: "Providing medical support and treatment for children with rare diseases.",
      goal: "₱1,000,000",
      raised: "₱0",
      donors: 0,
      endDate: "2025-12-31",
      createdAt: "2025-04-20",
      rejectionReason: {
        mainReason: "Incomplete Documentation",
        details: "Your fundraiser request was rejected due to missing documentation. Please provide the following documents: 1) Medical certificates, 2) Hospital affiliation letter, 3) Detailed cost breakdown.",
        resubmissionGuidelines: "You can resubmit your fundraiser after completing the required documentation. Make sure to address all the points mentioned in the rejection reason."
      },
      messages: [
        {
          id: "m3",
          sender: "Admin",
          content: "We need additional documentation for your fundraiser request.",
          timestamp: "2025-04-22T09:15:00",
          isRead: true,
        },
        {
          id: "m4",
          sender: "Admin",
          content: "Your fundraiser has been rejected due to incomplete documentation.",
          timestamp: "2025-04-24T16:45:00",
          isRead: true,
        },
      ],
    },
    {
      id: "4",
      title: "Animal Shelter Renovation",
      type: "Animal Welfare",
      image: "/projects/assets/Animal.jpg",
      status: "approved",
      description: "Renovating our local animal shelter to provide better conditions for rescued animals.",
      goal: "₱250,000",
      raised: "₱75,000",
      donors: 32,
      endDate: "2025-08-15",
      createdAt: "2025-03-10",
      rejectionReason: null,
      messages: [
        {
          id: "m5",
          sender: "Admin",
          content: "Your fundraiser has been approved!",
          timestamp: "2025-03-12T11:20:00",
          isRead: true,
        },
        {
          id: "m6",
          sender: "Donor",
          content: "I'd like to know more about how the funds will be used for renovation.",
          timestamp: "2025-04-05T15:30:00",
          isRead: false,
        },
      ],
    },
  ]);

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

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const updatedFundraisers = fundraisers.map((fundraiser) => {
      if (fundraiser.id === selectedFundraiser.id) {
        return {
          ...fundraiser,
          messages: [
            ...fundraiser.messages,
            {
              id: `m${Math.random().toString(36).substr(2, 9)}`,
              sender: "You",
              content: message,
              timestamp: new Date().toISOString(),
              isRead: true,
            },
          ],
        };
      }
      return fundraiser;
    });

    setFundraisers(updatedFundraisers);
    setMessage("");

    // Update the selected fundraiser with the new messages
    const updatedSelectedFundraiser = updatedFundraisers.find(
      (fundraiser) => fundraiser.id === selectedFundraiser.id
    );
    setSelectedFundraiser(updatedSelectedFundraiser);

    setToast({
      type: "success",
      message: "Message sent successfully!",
    });
  };

  const handleSubmitEdit = () => {
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

  // Format timestamp to readable date and time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
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

      {/* Edit Request Modal */}
      {isEditModalOpen && selectedFundraiser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-white to-astrawhite rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideUp border border-white/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-astraprimary/90 to-astraprimary p-6 relative">
              <div className="absolute right-4 top-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-astraprimary shadow-md">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl text-white mb-1 font-bold">
                    Request Fundraiser Edit
                  </h3>
                  <p className="text-white/70 text-sm">
                    {selectedFundraiser.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-astradarkgray mb-6">
                  To request changes to your approved fundraiser, please select the sections
                  you'd like to modify and provide details about the requested changes.
                  An administrator will review your request.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input type="checkbox" className="rounded text-astraprimary" />
                      <span className="font-medium">Title</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-astragray/30 rounded-lg p-3 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white"
                      placeholder="New title"
                      defaultValue={selectedFundraiser.title}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input type="checkbox" className="rounded text-astraprimary" />
                      <span className="font-medium">Description</span>
                    </label>
                    <textarea
                      className="w-full border border-astragray/30 rounded-lg p-3 min-h-24 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white"
                      placeholder="New description"
                      defaultValue={selectedFundraiser.description}
                    ></textarea>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input type="checkbox" className="rounded text-astraprimary" />
                      <span className="font-medium">End Date</span>
                    </label>
                    <input
                      type="date"
                      className="w-full border border-astragray/30 rounded-lg p-3 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white"
                      defaultValue={selectedFundraiser.endDate}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input type="checkbox" className="rounded text-astraprimary" />
                      <span className="font-medium">Other Changes</span>
                    </label>
                    <textarea
                      className="w-full border border-astragray/30 rounded-lg p-3 min-h-24 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white"
                      placeholder="Describe any other changes you'd like to make"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-astralightgray/40 border-t border-astragray/10 flex justify-between items-center">
              <div className="text-sm text-astradarkgray">
                <div className="flex items-center space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-astraprimary"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span>Your request will be reviewed within 1-2 business days</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 text-astradarkgray border border-astragray/30 rounded-lg hover:bg-astragray/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitEditRequest}
                  className="px-5 py-2 bg-gradient-to-r from-astraprimary to-astrasecondary text-white rounded-lg shadow-md hover:brightness-105 transition-all flex items-center space-x-2"
                >
                  <span>Submit Request</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* View Messages Modal */}
      {isViewMessagesModalOpen && selectedFundraiser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-white to-astrawhite rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideUp border border-white/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-astraprimary/90 to-astraprimary p-6 relative">
              <div className="absolute right-4 top-4">
                <button
                  onClick={() => setIsViewMessagesModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-astraprimary shadow-md">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl text-white mb-1 font-bold">
                    Messages
                  </h3>
                  <p className="text-white/70 text-sm">
                    {selectedFundraiser.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {selectedFundraiser.messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-astralightgray/50 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-astradarkgray/50" />
                  </div>
                  <h4 className="text-lg font-medium text-astradarkgray mb-1">
                    No messages yet
                  </h4>
                  <p className="text-astradarkgray/70 text-sm">
                    Messages related to your fundraiser will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedFundraiser.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.sender === "You"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.sender === "You"
                            ? "bg-astraprimary text-white"
                            : "bg-astralightgray text-astradarkgray"
                        }`}
                      >
                        {msg.sender === "You" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] ${
                          msg.sender === "You"
                            ? "bg-astraprimary text-white"
                            : "bg-astralightgray text-astradarkgray"
                        } p-3 rounded-lg`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">
                            {msg.sender}
                          </span>
                          <span className="text-xs opacity-70">
                            {formatTimestamp(msg.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Message Input */}
            <div className="p-4 bg-astralightgray/40 border-t border-astragray/10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-astragray/30 py-2 px-4 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`py-2 px-4 rounded-lg ${
                    message.trim()
                      ? "bg-astraprimary text-white hover:bg-astraprimary/90"
                      : "bg-astragray/30 text-astragray/50 cursor-not-allowed"
                  } transition-colors flex items-center gap-2`}
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Details Modal */}
      {isRejectionDetailsModalOpen && selectedFundraiser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-white to-astrawhite rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideUp border border-white/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500/90 to-red-600 p-6 relative">
              <div className="absolute right-4 top-4">
                <button
                  onClick={() => setIsRejectionDetailsModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 shadow-md">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl text-white mb-1 font-bold">
                    Fundraiser Rejected
                  </h3>
                  <p className="text-white/70 text-sm">
                    {selectedFundraiser.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-astrablack mb-2">
                    Reason for Rejection
                  </h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 font-medium">
                      {selectedFundraiser.rejectionReason.mainReason}
                    </p>
                    <p className="text-sm text-astradarkgray mt-2">
                      {selectedFundraiser.rejectionReason.details}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-astrablack mb-2">
                    Resubmission Guidelines
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-astradarkgray">
                      {selectedFundraiser.rejectionReason.resubmissionGuidelines}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-astralightgray/40 border-t border-astragray/10 flex justify-between items-center">
              <button
                onClick={() => setIsRejectionDetailsModalOpen(false)}
                className="py-2 px-4 rounded-lg border border-astragray/30 text-astradarkgray hover:bg-astragray/10 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsRejectionDetailsModalOpen(false);
                  router.push("/projects/create");
                }}
                className="py-2 px-4 rounded-lg bg-astraprimary text-white hover:bg-astraprimary/90 transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Resubmit Fundraiser
              </button>
            </div>
          </div>
        </div>
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