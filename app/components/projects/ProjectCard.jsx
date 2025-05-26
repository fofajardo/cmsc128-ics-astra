"use client";
import Image from "next/image";
import { GraduationCap, HeartHandshake, Users, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatCurrency, formatDate, capitalizeName } from "@/utils/format";
import { PROJECT_TYPE } from "../../../common/scopes";

export default function ProjectCard({
  id,
  image,
  title = "Snacks to Support Student Success",
  description = "This project aims to provide middle school students the resources they need to excel academically, emotionally, and physically...",
  goal = "PHP50K",
  raised = "PHP20K",
  donors = "30K",
  endDate = "2025-06-30",
  type = "Fundraiser",
  requestId = "",
  donationLink = "",
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
    router.push(`/projects/about/${requestId}`);
  };

  const handleDonateClick = (e) => {
    e.stopPropagation(); // prevents the outer link from triggering
    router.push(`/projects/donate/${requestId}`);
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
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden"
      onClick={() => router.push(`/projects/about/${id}`)}
    >
      {/* Image Container */}
      <div className="relative w-full pt-[56.25%]">
        <Image
          src={image}
          alt={title}
          fill
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <h3 className="font-rb text-astrablack mb-2 line-clamp-2 min-h-[2.5rem]">
          {title}
        </h3>
        <p className="font-r text-astradarkgray mb-4 line-clamp-3 flex-grow">
          {description}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-rb text-astrablack">{formatCurrency(raised)}</span>
            <span className="font-r text-astradarkgray">of {formatCurrency(goal)}</span>
          </div>
          <div className="h-2 bg-astralightgray rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-500 ease-out`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-astradarkgray" />
            <span className="font-r text-astradarkgray">{donors} Donors</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-astradarkgray" />
            <span className="font-r text-astradarkgray">{formatDate(endDate)}</span>
          </div>
        </div>

        {/* Project Type */}
        <div className="flex items-center gap-2 mb-4">
          {type === PROJECT_TYPE.FUNDRAISER ? (
            <HeartHandshake className="w-4 h-4 text-astraprimary" />
          ) : (
            <GraduationCap className="w-4 h-4 text-astraprimary" />
          )}
          <span className="font-rb text-astraprimary text-sm">{type}</span>
        </div>

        {/* Donate Button */}
        {showDonate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(donationLink, "_blank");
            }}
            className="w-full py-3 px-4 bg-astraprimary text-astrawhite rounded-lg hover:bg-astraprimary/90 transition-all duration-300 text-sm sm:text-base font-medium touch-target"
          >
            Donate Now
          </button>
        )}
      </div>
    </div>
  );
}