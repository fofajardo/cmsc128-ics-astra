"use client";
import { useState, use } from "react";
import { useParams, useRouter } from 'next/navigation';
import Image from "next/image";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import {
  GraduationCap,
  HeartHandshake,
  Calendar,
  User,
  Goal,
  FileText,
  Phone,
  Mail,
  Share2,
  Users,
  MessageSquare,
} from "lucide-react";
import ToastNotification from "@/components/ToastNotification";


export default function ProjectDetails({ params }) {
  const router = useRouter();
  const { id } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);

  // Dummy project data
  const project = {
    id: use(params).id,
    title: "Women in Tech Scholarship",
    type: "Scholarship",
    image: "/projects/assets/Donation.jpg",
    urlLink: "https://example.com/project/12345",
    status: 0,
    description:
      "Supporting female students pursuing degrees in CS and IT to increase representation in tech.",
    longDescription:
      "This scholarship aims to address the gender gap in technology fields by providing financial support to female students who demonstrate academic excellence and passion for computer science and IT. Recipients will receive funding for tuition, books, and mentorship opportunities. By supporting this initiative, we contribute to a more inclusive tech workforce.",
    goal: "₱300,000",
    raised: "₱200,000",
    donors: 87,
    endDate: "2025-09-30",
    organizer: {
      name: "Ma'am Mira Fanclub",
      position: "Student Organization",
      email: "mirafanclub@email.com",
      phone: "+63 912 345 6789",
    },
    topDonator: { name: "pogi ng tl", amount: "₱100,000" },
    recentDonator: { name: "maam mira cute", amount: "₱5,000" },
    firstDonator: { name: "Anonymous", amount: "₱1,000" },
  };

  const goalValue = parseInt(project.goal.replace(/[^\d]/g, ""));
  const raisedValue = parseInt(project.raised.replace(/[^\d]/g, ""));
  const progressPercentage = Math.min(
    Math.round((raisedValue / goalValue) * 100),
    100
  );

  const handleSendMessage = () => {
    setToast({
      type: "success",
      message: "Message sent successfully!",
    });
    setIsContactModalOpen(false);
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

      {/* Header */}
      <div>
        <div className="max-w-6xl mx-auto">
          <div className="p-6 text-astrawhite w-full">
            <div className="bg-astrawhite rounded-lg px-3 py-2 inline-block shadow border border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-astraprimary">
                  {project.title}
                </h1>
                <span
                  className={`${
                    project.status === 0 ? "bg-green-500" : "bg-red-500"
                  } text-astrawhite px-3 py-1 rounded-lg font-semibold`}
                >
                  {project.status === 0 ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center mt-2 gap-4">
              <div className="bg-astrawhite text-astraprimary px-3 py-1 rounded-lg text-sm flex items-center gap-1 shadow border border-gray-200">
                {project.type === "Scholarship" ? (
                  <GraduationCap className="w-4 h-4" />
                ) : (
                  <HeartHandshake className="w-4 h-4" />
                )}
                {project.type}
              </div>

              <div className="bg-astrawhite text-astraprimary px-3 py-1 rounded-lg text-sm flex items-center gap-1 shadow border border-gray-200">
                <Calendar className="w-4 h-4" />
                <span>
                  Ends: {new Date(project.endDate).toLocaleDateString("en-PH")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button and Image */}
      <div className="max-w-6xl mx-auto px-6 mt-6 ">
        <BackButton />
        <div className="mt-4 rounded-xl overflow-hidden h-64 w-full relative">
          <Image
            src={project.image}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-astrawhite p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">
              {project.description}
            </h2>
            <p className="text-sm leading-relaxed text-astrablack">
              {project.longDescription}
            </p>
          </div>

          {/* Organizer Info*/}
          <div className="bg-astrawhite p-6 rounded-xl shadow border border-gray-200">
            <h3 className="font-bold text-lg">Project Organizer</h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-center">
                <div className="flex gap-3 items-center mr-5">
                  <User className="w-5 h-5 text-astraprimary" />
                  <div>
                    <p className="text-sm font-medium">
                      {project.organizer.name}
                    </p>
                    <p className="text-xs text-astradarkgray">
                      {project.organizer.position}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="flex items-center gap-2 bg-astraprimary text-astrawhite py-2 px-4 rounded-lg justify-center font-medium transition-colors hover:bg-astraprimary/90"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact
                </button>
              </div>

              <div className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-astraprimary" />
                <p className="text-sm">{project.organizer.email}</p>
              </div>

              <div className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-astraprimary" />
                <p className="text-sm">{project.organizer.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6 lg:sticky lg:top-24 self-start lg:sticky">
          {/* Progress Bar */}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-xl font-bold">Fundraising Progress</h2>
              <div className="text-right">
                <div className="text-2xl font-bold">{project.raised}</div>
                <div className="text-astradarkgray text-sm">
                  of {project.goal}
                </div>
              </div>
            </div>

            <div className="h-3 bg-astralightgray rounded-full overflow-hidden">
              <div
                className="h-full bg-astraprimary transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between mt-4 text-astradarkgray">
              <div className="flex items-center gap-1">
                <Users className="w-5 h-5" />
                <span>{project.donors} donors</span>
              </div>
              <div>{progressPercentage}% of goal</div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className={`flex items-center justify-center gap-2 ${
                  project.status === 1 ? "w-full" : "w-full"
                } py-3 px-4 bg-astragray text-astradark rounded-lg hover:bg-astragray/80 transition-colors font-medium`}
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
              {project.status === 0 && (
                <button
                  onClick={() => router.push(`/projects/donate/${id}`)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-astraprimary text-white rounded-lg hover:bg-astraprimary/90 transition-colors font-medium"
                >
                  <HeartHandshake className="w-5 h-5" />
                  Donate
                </button>
              )}
            </div>
          </div>

          {/* Donators */}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg mb-4">Top Contributors</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-astraprimary/10 p-2 rounded-full">
                    <Users className="w-4 h-4 text-astraprimary" />
                  </div>
                  <span className="font-medium">Top Donator</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{project.topDonator.name}</p>
                  <p className="text-sm text-astradarkgray">
                    {project.topDonator.amount}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium">Recent Donator</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{project.recentDonator.name}</p>
                  <p className="text-sm text-astradarkgray">
                    {project.recentDonator.amount}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">First Donator</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{project.firstDonator.name}</p>
                  <p className="text-sm text-astradarkgray">
                    {project.firstDonator.amount}
                  </p>
                </div>
              </div>
            </div>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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

            <div className="mb-7 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-astraprimary/10 p-3 rounded-full">
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
                    className="text-astraprimary"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-astrablack">
                Share Your Project
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Copy the link below to share with others
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-inner p-1">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 overflow-hidden">
                <div className="flex-shrink-0">
                  <div className="bg-astraprimary/10 p-2 rounded-md">
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
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  readOnly
                  value={project.urlLink}
                  className="w-full text-sm py-1 bg-transparent focus:outline-none text-gray-700 overflow-hidden text-ellipsis"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(project.urlLink);

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy Link
              </button>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100 flex justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-3">
                  Or share directly to
                </p>
                <div className="flex space-x-4 justify-center">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      project.urlLink
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      project.urlLink
                    )}&text=Check out this project!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=Check out this project! ${encodeURIComponent(
                      project.urlLink
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      project.urlLink
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-white to-astrawhite rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp border border-white/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-astraprimary/90 to-astraprimary p-6 relative">
              <div className="absolute right-4 top-4">
                <button
                  onClick={() => setIsContactModalOpen(false)}
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
                  {project.organizer.profilePic ? (
                    <img
                      src={project}
                      alt={project.organizer.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold">
                      {project.organizer.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-lb text-xl text-white mb-1">
                    Message {project.organizer.name}
                  </h3>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-astraprimary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Your Message
                </label>

                <div className="relative">
                  <textarea
                    className="w-full border border-astragray/30 rounded-lg p-4 min-h-32 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white shadow-inner"
                    placeholder="Introduce yourself and explain why you're reaching out..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-between mt-2 text-xs text-astragray">
                  <p>Be professional and clear about your intent</p>
                  <p
                    className={`${
                      message.length > 500 ? "text-red-500 font-medium" : ""
                    }`}
                  >
                    {message.length}/1000 characters
                  </p>
                </div>
              </div>

              {/* Quick suggestions */}
              <div className="mb-5">
                <p className="text-sm text-astradarkgray mb-2">
                  Quick replies:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setMessage(
                        "Hi, I'm interested in learning more about this project. Could you share additional details?"
                      )
                    }
                    className="text-sm px-3 py-1 bg-astralightgray hover:bg-astragray/20 rounded-full text-astradarkgray transition-colors"
                  >
                    Request more info
                  </button>
                  <button
                    onClick={() =>
                      setMessage(
                        "Hello! I have similar experience and would love to collaborate on this project."
                      )
                    }
                    className="text-sm px-3 py-1 bg-astralightgray hover:bg-astragray/20 rounded-full text-astradarkgray transition-colors"
                  >
                    Offer collaboration
                  </button>
                  <button
                    onClick={() =>
                      setMessage(
                        "Hi there! I'm impressed by this project and would like to connect to discuss potential opportunities."
                      )
                    }
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Messages are monitored for community guidelines
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="px-6 py-2.5 bg-white border border-astragray/30 rounded-lg font-sb hover:bg-astragray/10 transition-colors"
                  onClick={() => setIsContactModalOpen(false)}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
