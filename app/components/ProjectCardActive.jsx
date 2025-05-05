"use client";
import { GraduationCap, HeartHandshake, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate, capitalizeName } from "@/utils/format";
import { PROJECT_TYPE } from "@/constants/projectConsts";

export default function ProjectCardActive({
  id,
  image,
  title,
  type,
  goal,
  raised,
  donors,
  endDate,
  isActive = true
}) {

  //calculating progress percentage
  const goalAmount = parseInt(goal.replace(/[^0-9]/g, ""));
  const raisedAmount = parseInt(raised.replace(/[^0-9]/g, ""));
  const progressPercent = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);

  //determine progress bar color based on percentage
  const getProgressColor = () => {
    if (progressPercent < 25) return "bg-red-500";
    if (progressPercent < 50) return "bg-orange-500";
    if (progressPercent < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Link href={`/admin/projects/${isActive ? "active" : "inactive"}/${id}`}>
      <div className={`group bg-astrawhite rounded-2xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-astraprimary overflow-hidden ${!isActive ? "opacity-60" : ""}`}>
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

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs font-s mb-1 line-clamp-1">
              <span>{formatCurrency(raised)} raised</span>
              <span>Goal: {formatCurrency(goal)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${getProgressColor()} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-astradarkgray">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{donors} donors</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Until {formatDate(endDate, "short-month")}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            className="mt-3 w-full blue-button font-s py-1"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}