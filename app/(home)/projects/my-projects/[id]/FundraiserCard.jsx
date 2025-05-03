// FundraiserCard.jsx
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  HeartHandshake,
  Calendar,
  MessageSquare,
  Edit3,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Trash2
} from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function FundraiserCard({
  fundraiser,
  onOpenEditModal,
  onOpenMessagesModal,
  onOpenRejectionDetailsModal,
  handleCancelRequest,
  getUnreadMessagesCount
}) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-astrawhite rounded-xl shadow hover:shadow-lg transition-all border border-astragray/10 overflow-hidden">
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
              <StatusBadge status={fundraiser.status} />
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
                  onClick={() => router.push(`/projects/${fundraiser.id}`)}
                  className="flex items-center gap-1.5 bg-astraprimary text-astrawhite py-2 px-4 rounded-lg text-sm hover:bg-astraprimary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Page
                </button>
              )}

              {fundraiser.status === "approved" && (
                <button
                  onClick={() => onOpenEditModal(fundraiser)}
                  className="flex items-center gap-1.5 bg-amber-100 text-amber-700 py-2 px-4 rounded-lg text-sm hover:bg-amber-200 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Request Edit
                </button>
              )}

              {fundraiser.status === "rejected" && (
                <button
                  onClick={() => onOpenRejectionDetailsModal(fundraiser)}
                  className="flex items-center gap-1.5 bg-red-100 text-red-700 py-2 px-4 rounded-lg text-sm hover:bg-red-200 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  View Rejection Details
                </button>
              )}

              <button
                onClick={() => onOpenMessagesModal(fundraiser)}
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
                onClick={toggleExpand}
                className="ml-auto flex items-center gap-1 text-astradarkgray hover:text-astraprimary transition-colors"
              >
                {isExpanded ? "Less Details" : "More Details"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isExpanded ? "transform rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (
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
                  onClick={() => handleCancelRequest(fundraiser.id)}
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
  );
}