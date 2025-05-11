"use client";
import Image from "next/image";
import { GraduationCap, HeartHandshake, Users, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatCurrency, formatDate, capitalizeName } from "@/utils/format";
import { PROJECT_TYPE } from "@/constants/projectConsts";

export default function ProjectCard({
  id,
  request_id,
  image,
  title = "Snacks to Support Student Success",
  description = "This project aims to provide middle school students the resources they need to excel academically, emotionally, and physically...",
  goal = "PHP50K",
  raised = "PHP20K",
  donors = "30K",
  endDate = "2025-06-30",
  type = "Fundraiser",
  showDonate = true
}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Calculate progress percentage
  const goalAmount = parseInt(goal.replace(/[^0-9]/g, ""));
  const raisedAmount = parseInt(raised.replace(/[^0-9]/g, ""));
  const progressPercent = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);

  // Determine progress bar color based on percentage
  const getProgressColor = () => {
    if (progressPercent < 25) return "bg-red-500";
    if (progressPercent < 50) return "bg-orange-500";
    if (progressPercent < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Handle window resize for responsive design
  useEffect(() => {
    setIsMounted(true);

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const handleCardClick = () => {
    router.push(`/projects/about/${request_id}`);
  };

  const handleDonateClick = (e) => {
    e.stopPropagation(); // prevents the outer link from triggering
    router.push(`/projects/donate/${id}?title=${encodeURIComponent(title)}`);
  };

  // Adjust image height based on screen size
  const getImageHeight = () => {
    if (!isMounted) return "h-48";
    if (dimensions.width < 640) return "h-40";
    if (dimensions.width < 1024) return "h-44";
    return "h-48";
  };

  // Description line clamp based on screen size
  const getDescriptionClamp = () => {
    if (!isMounted) return "line-clamp-2";
    if (dimensions.width < 640) return "line-clamp-1";
    if (dimensions.width < 1024) return "line-clamp-2";
    return "line-clamp-2";
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-astrawhite rounded-2xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-astraprimary overflow-hidden h-full flex flex-col">
      {/* Project Image */}
      <div className={`relative ${getImageHeight()} w-full overflow-hidden`}>
        <Image
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          width={400}
          height={200}
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
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-lb text-lg line-clamp-1">{title}</h3>
        <p className={`text-astradarkgray font-s mt-2 text-sm ${getDescriptionClamp()}`}>{description}</p>

        {/* Progress bar */}
        <div className="mt-auto pt-3">
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
            {endDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className="line-clamp-1">Until {formatDate(endDate, "long")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        {showDonate && (
          <button
            onClick={handleDonateClick}
            className="mt-3 w-full blue-button font-s py-1"
          >
            Donate
          </button>
        )}
      </div>
    </div>
  );
}