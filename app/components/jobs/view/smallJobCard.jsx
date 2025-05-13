import Image from "next/image";
import Link from "next/link";
import { jobTypeMap, locationTypeMap } from "@/components/jobs/mappings";
import { Clock } from "lucide-react";
import JobMap from "../map";
import { ReportButton } from "@/components/Buttons";

export default function SmallJobCard({job, showApply, canReport}) {
  const isOpen = true;

  const formatSalary = (num) => {
    return `₱${num.toLocaleString("en-US")}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col items-center md:flex-row gap-5 bg-astrawhite max-w-[1250px] w-19/20 min-h-[308px] h-auto rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-10 pb-7">
      {/* Details */}
      <div className="w-full md:w-1/3 flex flex-col">
        <h1 className="text-astrablack text-2xl font-bold">Job Details</h1>

        <div className="flex flex-col mt-5">
          <h1 className="text-astrablack text-xl font-bold break-words">
            {formatSalary(job.salary)}<span className="text-xl font-normal">/month</span>
          </h1>
        </div>

        <div className="flex gap-2 items-center pt-3 pb-2">
          <Image src="/icons/marker.svg" width={20} height={28.5} alt="loc" className="shrink-0" />
          <p className="text-black text-sm leading-4">{job.location}</p>
        </div>

        <div className="flex gap-2 items-center">
          <Clock size="20" className="shrink-0" />
          <p className="text-black text-sm">{formatDate(job.expires_at)}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 my-3">
          <div className={`border-1 ${isOpen ? "border-[#045600] bg-[#ECFFED] text-[#045600]" : "text-[#E8403C] bg-[#FFF0EC] border-[#E8403C]"} rounded-lg py-2 px-4.5`}>
            <p className="text-sm">{isOpen ? "Open" : "Closed"}</p>
          </div>
          <div className={`border-1 bg-astratintedwhite ${isOpen ? "text-astrablack border-astradarkgray" : "text-astralightgray border-astralightgray"} rounded-lg py-2 px-4.5`}>
            <p className="text-sm">{jobTypeMap[job.employment_type]}</p>
          </div>
          <div className={`border-1 bg-astratintedwhite ${isOpen ? "text-astrablack border-astradarkgray" : "text-astralightgray border-astralightgray"} rounded-lg py-2 px-4.5`}>
            <p className="text-sm">{locationTypeMap[job.location_type]}</p>
          </div>
        </div>

        <div className="flex flex-col items-center w-full md:w-7/10">
          <Link
            href={job.apply_link}
            target="_blank"
            className={`hover:bg-astradark text-center transition-all duration-150 ease-in-out text-astrawhite font-semibold w-full py-2 rounded-lg mt-2 ${isOpen ? "text-astrawhite bg-astraprimary" : "text-[#E8403C] bg-[#FFF0EC]"} ${showApply ? "" : "hidden"}`}
          >
            Apply Now
          </Link>
          <p className={`text-center text-sm font-medium mt-1 ${isOpen ? "text-astrablack" : "text-[#E8403C]"}`}>
            {isOpen ? "Applications are still ongoing!" : "Applications have already closed."}
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="w-full md:w-2/3 flex flex-col gap-2">
        <div className="w-full md:h-70 h-40 flex items-center rounded-sm">
          {/* <Image src="/map.jpg" width={600} height={275} alt='loc' className="shrink-0"></Image> */}
          <JobMap address={job.location} />
        </div>
        {canReport && (
          <div className="self-end mr-2">
            <ReportButton contentType={"Job"} />
          </div>
        )}
      </div>
    </div>
  );}
