"use client";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoBackButton, ActionButton } from "@/components/Buttons";
import { GraduationCap, HeartHandshake, Calendar, User, Goal, FileText, Phone, Mail, Share2, Users, MessageSquare } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";
import Link from "next/link";
import axios from "axios";
import { formatCurrency, formatDate, capitalizeName } from "@/utils/format";
import { PROJECT_STATUS, PROJECT_TYPE } from "../../../../../common/scopes";
import { feRoutes } from "../../../../../common/routes";
import { useSignedInUser } from "@/components/UserContext.jsx";

//for admin/projects/inactive/[id]
export default function InactiveProjectDetail({ params }) {
  //fix the params.id error by unwrapping with use()
  const id = use(params).id;
  const router = useRouter();
  const userContext = useSignedInUser();
  const user_id = userContext.state.user?.id;
  const [toast, setToast] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const MAX_MESSAGE_LENGTH = 500;

  const [projectData, setProjectData] = useState(null);

  const [projectPhoto, setProjectPhoto] = useState({});
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState("/projects/assets/Donation.png");

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
        const projectResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests/projects/${id}`);
        const projectData = projectResponse.data;
        console.log(projectData);
        if (projectData.status === "OK") {
          const projectId = projectData.list.projectData.project_id;

          const donationsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/donations`, {
            params: {
              requester_id: user_id,
              project_id: projectId
            }
          });
          const donationData = donationsResponse.data;
          console.log(donationData);
          let formattedDonations;
          if (donationData.status === "OK") {
            formattedDonations = donationData.donations.map(donation => ({
              id: donation.id,
              donor: donation.donor,
              amount: donation.amount,
              date: donation.donation_date,
              isVerified: donation.is_verified,
            }));
          } else {
            console.error("Unexpected response:", donationData);
          }

          setProjectData({
            id: projectId,
            request_status: projectData.status,
            project_status: projectData.list.projectData.project_status,
            title: projectData.list.projectData.title,
            type: projectData.list.projectData.type,
            image: FALLBACK_IMAGE, // Use constant for default image
            urlLink: projectData.list.projectData.donation_link,
            description: projectData.list.projectData.details,
            longDescription: projectData.list.projectData.details,
            goal: projectData.list.projectData.goal_amount.toString(),
            raised: projectData.list.projectData.total_donations.toString(),
            donors: projectData.list.projectData.number_of_donors.toString(),
            requester: {
              name: projectData.list.requesterData.full_name,
              email: projectData.list.requesterData.email,
              phone: "NA",
              position: projectData.list.requesterData.role === "unlinked" || projectData.list.requesterData.role === null
                ? "N/A"
                : projectData.list.requesterData.role,
            },
            submissionDate: projectData.list.date_requested,
            dateReviewed: projectData.list.date_reviewed,
            startDate: "1999-01-01",
            endDate: projectData.list.projectData.due_date,
            eligibilityCriteria: "NA",
            fundDistribution: "NA",
            transactions: formattedDonations,
          });
          try {
            const photoResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/project/${projectId}`
            );

            if (photoResponse.data.status === "OK" && photoResponse.data.photo) {
              setImageLoading(true);
              setImageError(false);
              setImageSrc(photoResponse.data.photo);
            } else {
              // Handle case where photo data is not in expected format
              setImageLoading(false);
              setImageError(true);
              setImageSrc(FALLBACK_IMAGE);
            }
          } catch (photoError) {
            console.log(`Failed to fetch photo for project_id ${projectId}:`, photoError);
            setImageError(true);
            setImageLoading(false);
            setImageSrc(FALLBACK_IMAGE);
          }
        } else {
          console.error("Unexpected response:", projectData);
        }
      } catch (error) {
        console.error("Failed to fetch projects and donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectRequest();
  }, [id]);

  useEffect(() => {
    if (projectData?.id) {
      setProjectData(prevData => ({
        ...prevData,
        image: projectPhoto
      }));
    }
  }, [projectPhoto]);

  //for progress bar percentage
  const goalValue = parseInt(projectData?.goal.replace(/[^0-9]/g, ""));
  const raisedValue = parseInt(projectData?.raised.replace(/[^0-9]/g, ""));
  const progressPercentage = Math.min(Math.round((raisedValue / goalValue) * 100), 100);

  //progress bar color based on percentage
  let progressColor = "bg-astraprimary";
  if (progressPercentage >= 100) {
    progressColor = "bg-green-500";
  } else if (progressPercentage >= 75) {
    progressColor = "bg-yellow-500";
  } else if (progressPercentage >= 50) {
    progressColor = "bg-orange-500";
  } else if (progressPercentage >= 25) {
    progressColor = "bg-red-500";
  }

  //handle share button click
  //placeholder
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  //handle send message button click
  const handleSendMessage = () => {
    try {
      // Create email subject and body
      const subject = `Inquiry about ${projectData.title}`;
      const emailBody = `Hello ${projectData.requester.name},\n\n${message}\n\nBest regards,\n${userContext?.state?.user?.name || userContext?.state?.user?.email || "Anonymous"}`;

      // Create Gmail URL with pre-filled information
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(projectData.requester.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

      // Open Gmail in a new tab
      window.open(gmailUrl, "_blank");

      setToast({
        type: "success",
        message: "Opening Gmail...",
      });
      setShowContactModal(false);
      setMessage("");
    } catch (error) {
      console.error("Failed to open Gmail:", error);
      setToast({
        type: "fail",
        message: "Failed to open Gmail. Please try again.",
      });
    }
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    if (newMessage.length <= MAX_MESSAGE_LENGTH) {
      setMessage(newMessage);
    }
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

      {/* Project image and title section */}
      <div className="relative h-64">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-astralightgray/50 z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-astraprimary"></div>
          </div>
        )}
        <img
          src={imageSrc}
          alt={projectData?.title}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 text-astrawhite w-full">
            <div className="flex items-center mt-4">
              <h1 className="font-h1 text-astrawhite text-shadow shadow-black">{projectData?.title}</h1>
              <span className="ml-4 bg-astrared text-astrawhite px-3 py-1 rounded-lg font-sb">Inactive</span>
            </div>
            <div className="flex items-center mt-2">
              <div className="bg-astrawhite text-astradark px-3 py-1 rounded-lg text-sm font-s flex items-center gap-1">
                {projectData?.type === PROJECT_TYPE.SCHOLARSHIP ? (
                  <GraduationCap className="w-4 h-4" />
                ) : (
                  <HeartHandshake className="w-4 h-4" />
                )}
                {projectData?.type ? capitalizeName(projectData.type) : projectData?.type}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-4">
        <GoBackButton />
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Project details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress section */}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <div className="flex justify-between items-end mb-2">
              <h2 className="font-lb text-xl">Final Results</h2>
              <div className="text-right">
                <div className="text-2xl font-lb">{formatCurrency(projectData?.raised)}</div>
                <div className="text-astradarkgray text-sm">of {formatCurrency(projectData?.goal)} goal</div>
              </div>
            </div>

            <div className="h-3 bg-astralightgray rounded-full overflow-hidden">
              <div
                className={`h-full ${progressColor}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between mt-4 text-astradarkgray">
              <div className="flex items-center gap-1">
                <Users className="w-5 h-5" />
                <span>{projectData?.donors} donors</span>
              </div>
              <div>{progressPercentage}% of goal</div>
            </div>
          </div>

          {/* Description section */}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Project Details</h2>

            <div className="space-y-6">
              <div>
                <p className="mt-2 text-astradarkgray text-justify">{projectData?.longDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-2 items-start">
                  <Goal className="w-8 h-8  text-astraprimary mt-1" />
                  <div>
                    <p className="font-sb">Funding Goal</p>
                    <p className="text-astradarkgray">{formatCurrency(projectData?.goal)}</p>
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <Calendar className="w-8 h-8  text-astraprimary mt-1" />
                  <div>
                    <p className="font-sb">Project Due Date</p>
                    <p className="text-astradarkgray">
                      {formatDate(projectData?.endDate, "long")}
                    </p>
                  </div>
                </div>
              </div>

              {projectData?.type === "Scholarship" && (
                <>
                  <div>
                    <h3 className="font-sb text-lg">Eligibility Criteria</h3>
                    <p className="mt-2 text-astradarkgray">{projectData?.eligibilityCriteria}</p>
                  </div>

                  <div>
                    <h3 className="font-sb text-lg">Fund Distribution</h3>
                    <p className="mt-2 text-astradarkgray">{projectData?.fundDistribution}</p>
                  </div>
                </>
              )}

              {projectData?.type === "Fundraiser" && (
                <div>
                  <h3 className="font-sb text-lg">Fund Utilization</h3>
                  <p className="mt-2 text-astradarkgray">{projectData?.fundDistribution}</p>
                </div>
              )}
            </div>
          </div>

          {/* Transactions section - Improved */}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Transactions</h2>

            <div className="max-h-80 overflow-y-auto custom-scrollbar rounded-lg border border-astralightgray/50">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-astralightgray">
                  <tr>
                    <th className="py-3 px-4 text-left font-sb">Donor</th>
                    <th className="py-3 px-4 text-right font-sb">Verified</th>
                    <th className="py-3 px-4 text-right font-sb">Amount</th>
                    <th className="py-3 px-4 text-right font-sb">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-astralightgray/50">
                  {projectData?.transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-astralightgray/10 transition-colors">
                      <td className="py-3 px-4">{transaction.donor}</td>
                      <td className="py-3 px-4 text-right">
                        {transaction.isVerified ? (
                          <span className="text-astragreen font-bold">YES</span>
                        ) : (
                          <span className="text-astrared font-bold">NO</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-sb text-astraprimary">{formatCurrency(transaction.amount)}</td>
                      <td className="py-3 px-4 text-right text-astradarkgray">{formatDate(transaction.date)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-astralightgray/30 border-t-2 border-astralightgray">
                    <td className="py-3 px-4 font-sb">Total</td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4 text-right font-sb text-astraprimary">{formatCurrency(projectData?.raised)}</td>
                    <td className="py-3 px-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right column - Requester information and archive notice - Now sticky */}
        <div className="space-y-6 lg:sticky lg:top-24 self-start">
          {/* Requester information */}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Project Organizer</h2>

            <div className="space-y-4">
              <div className="flex gap-2 items-start">
                <User className="w-10 h-10 text-astraprimary" />
                <div>
                  <p className="text-astradarkgray">{projectData?.requester.name}</p>
                  <p className="text-astralightgray text-sm">{projectData?.requester?.position && projectData?.requester?.position !== "N/A" ? capitalizeName(projectData.requester.position) : projectData?.requester?.position}</p>
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <Mail className="w-6 h-6 text-astraprimary mr-2" />
                <div>
                  <p className="text-astradarkgray">{projectData?.requester.email}</p>
                </div>
              </div>

              {/* <div className="flex gap-2 items-start">
                <Phone className="w-6 h-6 text-astraprimary mr-2" />
                <div>
                  <p className="text-astradarkgray">{projectData?.requester.phone}</p>
                </div>
              </div> */}

              <button
                className="flex items-center gap-2 mt-4 bg-astraprimary text-astrawhite py-2 px-4 rounded-lg w-full justify-center font-sb transition-colors hover:bg-astraprimary/90"
                onClick={() => setShowContactModal(true)}
              >
                <MessageSquare className="w-5 h-5" />
                Contact
              </button>
            </div>
          </div>

          {/* Archive notice */}
          <div className="bg-yellow-50 p-6 rounded-xl shadow border border-yellow-200">
            <h2 className="font-lb text-xl mb-2 text-yellow-800">Archived Project</h2>
            <p className="text-yellow-700 mb-4">
              This project has ended and is now archived. Changes cannot be made to inactive projects.
            </p>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors font-s"
            >
              <Share2 className="w-5 h-5" />
              Share Project
            </button>
          </div>
        </div>
      </div>

      {/* Share modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-white to-astralightgray rounded-2xl p-8 w-[90%] max-w-md relative shadow-xl border border-white/20 animate-scaleIn">
            <div className="absolute -top-3 -right-3">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="bg-white text-astrablack h-10 w-10 rounded-full flex items-center justify-center shadow-md hover:bg-astralightgray transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="mb-7 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-astraprimary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-astraprimary">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                </div>
              </div>
              <h2 className="font-rb text-xl font-bold text-astrablack">Share Your Project</h2>
              <p className="text-sm text-gray-500 mt-1">Copy the link below to share with others</p>
            </div>

            <div className="bg-white rounded-xl shadow-inner p-1">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 overflow-hidden">
                <div className="flex-shrink-0">
                  <div className="bg-astraprimary/10 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-astraprimary">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  readOnly
                  value={feRoutes.projects.about(id)}
                  className="w-full text-sm py-1 bg-transparent focus:outline-none text-gray-700 overflow-hidden text-ellipsis"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(feRoutes.projects.about(id));

                  // Show success animation in button
                  const btn = document.getElementById("copyBtn");
                  btn.classList.remove("bg-astraprimary");
                  btn.classList.add("bg-green-500");
                  btn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Copied!
            `;

                  setToast({
                    type: "success",
                    message: "Share link copied to clipboard!",
                  });

                  setTimeout(() => setIsShareModalOpen(false), 1500);
                }}
                id="copyBtn"
                className="bg-astraprimary text-white py-3 px-6 rounded-xl flex items-center justify-center font-medium shadow-lg shadow-astraprimary/30 hover:shadow-astraprimary/40 hover:bg-astraprimary/90 transition-all duration-200 w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy Link
              </button>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100 flex justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-3">Or share directly to</p>
                <div className="flex space-x-4 justify-center">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(feRoutes.projects.about(id))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(feRoutes.projects.about(id))}&text=Check out this project!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=Check out this project! ${encodeURIComponent(feRoutes.projects.about(id))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(feRoutes.projects.about(id))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }

  .animate-scaleIn {
    animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`}</style>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-white to-astrawhite rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp border border-white/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-astraprimary/90 to-astraprimary p-6 relative">
              <div className="absolute right-4 top-4">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-astraprimary shadow-md">
                  {projectData?.requester.profilePic ? (
                    <img
                      src={projectData?.requester.profilePic}
                      alt={projectData?.requester.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold">
                      {projectData?.requester.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-lb text-xl text-white mb-1">Message {projectData?.requester.name}</h3>
                  <p className="text-white/70 text-sm">
                    Typically responds within 24 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="mb-5">
                <label className="block text-astradarkgray font-sb mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-astraprimary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Your Message
                </label>

                <div className="relative">
                  <textarea
                    className="w-full border border-astragray/30 rounded-lg p-4 min-h-32 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white shadow-inner"
                    placeholder="Introduce yourself and explain why you're reaching out..."
                    value={message}
                    onChange={handleMessageChange}
                    maxLength={MAX_MESSAGE_LENGTH}
                  ></textarea>
                </div>

                <div className="flex justify-between mt-2 text-xs text-astragray">
                  <p>Be professional and clear about your intent</p>
                  <p className={`${message.length >= MAX_MESSAGE_LENGTH ? "text-red-500 font-medium" : ""}`}>
                    {message.length}/{MAX_MESSAGE_LENGTH} characters
                  </p>
                </div>
              </div>

              {/* Quick suggestions */}
              <div className="mb-5">
                <p className="text-sm text-astradarkgray mb-2">Quick replies:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setMessage("Hi, I'm interested in learning more about this project. Could you share additional details?")}
                    className="text-sm px-3 py-1 bg-astralightgray hover:bg-astragray/20 rounded-full text-astradarkgray transition-colors"
                  >
                    Request more info
                  </button>
                  <button
                    onClick={() => setMessage("Hello! I have similar experience and would love to collaborate on this project.")}
                    className="text-sm px-3 py-1 bg-astralightgray hover:bg-astragray/20 rounded-full text-astradarkgray transition-colors"
                  >
                    Offer collaboration
                  </button>
                  <button
                    onClick={() => setMessage("Hi there! I'm impressed by this project and would like to connect to discuss potential opportunities.")}
                    className="text-sm px-3 py-1 bg-astralightgray hover:bg-astragray/20 rounded-full text-astradarkgray transition-colors"
                  >
                    Network
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-astralightgray/40 border-t border-astragray/10 flex justify-between items-center">
              <div className="text-sm text-astradarkgray">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Messages are monitored for community guidelines
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="px-6 py-2.5 bg-white border border-astragray/30 rounded-lg font-sb hover:bg-astragray/10 transition-colors"
                  onClick={() => setShowContactModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-6 py-2.5 rounded-lg font-sb flex items-center transition-all ${
                    !message.trim()
                      ? "bg-astragray/50 text-astradarkgray/50 cursor-not-allowed"
                      : "bg-astraprimary text-astrawhite hover:bg-astraprimary/90 shadow-md shadow-astraprimary/20"
                  }`}
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }

  .animate-slideUp {
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`}</style>

      {/* Add a style for custom scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }
      `}</style>
    </div>
  );
}