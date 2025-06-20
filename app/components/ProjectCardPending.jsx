"use client";
import { GraduationCap, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { formatCurrency, capitalizeName } from "@/utils/format";
import { PROJECT_TYPE } from "../../common/scopes";
import axios from "axios";

export default function ProjectCardPending({
  id,
  image,
  title,
  type,
  requester,
  goal,
  description,
  onApprove,
  onTriggerDeclineModal,
}) {

  // const STATUS = {
  //   APPROVE: 1,
  //   DECLINE: 2
  // };

  //Function to handle approve, placeholder pa lang
  // const handleApprove = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   updateProjectRequest(STATUS.APPROVE, id);
  //   setToast({
  //     type: "success",
  //     message: `${title} has been approved!`
  //   });
  // };

  //Function to handle decline, placeholder pa lang
  // const handleDecline = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   updateProjectRequest(STATUS.DECLINE);
  //   setToast({
  //     type: "fail",
  //     message: `${title} has been declined!`
  //   });
  // };

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
            {type === PROJECT_TYPE.SCHOLARSHIP ? (
              <GraduationCap className="w-3 h-3" />
            ) : (
              <HeartHandshake className="w-3 h-3" />
            )}
            {capitalizeName(type)}
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
          <p className="text-astradarkgray font-s mt-2 line-clamp-1">{description}</p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              className="green-button px-2 py-1"
              onClick={onApprove}
            >
              Approve
            </button>
            <button
              className="red-button px-2 py-1"
              onClick={onTriggerDeclineModal}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}