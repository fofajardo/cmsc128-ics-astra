"use client";
import { GraduationCap, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import axios from "axios";

export default function ProjectCardPending({
  id,
  image,
  title,
  type,
  requester,
  goal,
  description,
  setToast,
  onUpdate,
}) {

  const STATUS = {
    APPROVE: 1,
    DECLINE: 2
  }

  const updateProjectRequest = async (updatedStatus) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests/${id}`, {
        status: updatedStatus
      });
      if (response.data.status === "UPDATED") {
        console.log('Successfully updated project request with id:', id);
        if (typeof onUpdate === "function") {
          onUpdate(id, updatedStatus);
        }
      } else {
          console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Failed to approve project request:', error);
    }
  };

  //Function to handle approve, placeholder pa lang
  const handleApprove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateProjectRequest(STATUS.APPROVE);
    setToast({
      type: "success",
      message: `${title} has been approved!`
    });
  };

  //Function to handle decline, placeholder pa lang
  const handleDecline = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateProjectRequest(STATUS.DECLINE);
    setToast({
      type: "fail",
      message: `${title} has been declined!`
    });
  };

  return (
    <Link href={`/admin/projects/pending/${id}`}>
      <div className="group bg-astrawhite rounded-2xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-astraprimary overflow-hidden">
        {/* Project Image */}
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-astradark text-astrawhite px-2 py-1 rounded-lg text-xs font-s flex items-center gap-1">
            {type === "Scholarship" ? (
              <GraduationCap className="w-3 h-3" />
            ) : (
              <HeartHandshake className="w-3 h-3" />
            )}
            {type}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-lb text-lg line-clamp-1">{title}</h3>
          <p className="text-astradarkgray font-s mt-1 line-clamp-1">
            <span className="font-sb">Requested by:</span> {requester}
          </p>
          <p className="text-astradarkgray font-s mt-1">
            <span className="font-sb">Goal:</span> {formatCurrency(goal)}
          </p>
          <p className="text-astradarkgray font-s mt-2 line-clamp-2">{description}</p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              className="green-button px-2 py-1"
              onClick={handleApprove}
            >
              Approve
            </button>
            <button
              className="red-button px-2 py-1"
              onClick={handleDecline}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}