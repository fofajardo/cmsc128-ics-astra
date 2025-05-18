"use client";

import { Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jobTypeMap, locationTypeMap } from "@/components/jobs/mappings";
import { formatDate, formatSalary } from "@/utils/format";

export default function JobCard({ job }) {
  const router = useRouter();

  const viewPost = () => {
    router.push(`/jobs/${job.job_id}/view`);
  };

  return (
    <div className="bg-astrawhite w-[340px] h-[290px] rounded-2xl shadow-md hover:-translate-y-0.5 p-5 transition-all duration-100 ease-in overflow-hidden flex flex-col justify-between">
      {/* Content Section */}
      <div className="overflow-hidden space-y-2">
        {/* Salary */}
        <div className="flex items-baseline gap-1">
          <h1 className="text-astrablack text-lg font-bold truncate">
            {formatSalary(job.salary)}
          </h1>
          <span className="text-sm text-astrablack">/month</span>
        </div>

        {/* Job Title & Company */}
        <div className="mt-1">
          <h2 className="font-bold text-base leading-tight line-clamp-2 h-10">
            {job.job_title}
          </h2>
          <p className="text-sm text-astrablack truncate mt-1">{job.company_name}</p>
        </div>

        {/* Location & Date */}
        <div className="space-y-1 mt-2">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/marker.svg"
              width={14}
              height={14}
              alt="location"
              className="flex-shrink-0"
            />
            <p className="text-sm text-astrablack truncate">{job.location}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="flex-shrink-0" />
            <p className="text-sm text-astrablack truncate">
              {formatDate(job.expires_at, "short-month", "en-US")}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="border border-astradarkgray bg-astratintedwhite rounded-full px-2 py-0.5">
            <p className="text-sm text-astrablack truncate">
              {jobTypeMap[job.employment_type]}
            </p>
          </div>
          <div className="border border-astradarkgray bg-astratintedwhite rounded-full px-2 py-0.5">
            <p className="text-sm text-astrablack truncate">
              {locationTypeMap[job.location_type]}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-3">
        <Link
          href={job.apply_link}
          target="_blank"
          className="flex-1 bg-astraprimary hover:bg-astradark text-white text-sm md:text-md font-medium text-center py-2 rounded-lg transition-colors"
        >
          Apply Now
        </Link>
        <button
          onClick={viewPost}
          className="flex-1 border border-astraprimary text-astraprimary text-sm md:text-md font-medium py-2 rounded-lg transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
}