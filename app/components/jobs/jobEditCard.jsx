"use client";
import { Clock, OctagonAlert } from "lucide-react";
import Image from "next/image";
import ConfirmationPrompt from "./edit/confirmation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { jobTypeMap, locationTypeMap } from "@/components/jobs/mappings";

export default function JobEditCard({job}) {
  const [showPrompt, setPrompt] = useState(false);
  const router = useRouter();

  const isExpired = () => {
    const dateToday = new Date();
    var thirtyDays = new Date(job.created_at);
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    return dateToday > thirtyDays;
  };

  const viewPost = () => {
    router.push(`/jobs/${job.job_id}/view`);
  };

  const editPost = () => {
    router.push(`/jobs/${job.job_id}/edit`);
  };

  const formatSalary = (num) => {
    return `₱${num.toLocaleString("en-US")}`;
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return "Invalid date"; // fallback for bad values

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  const handleRenew = () => {
    // add renew logic here

    setPrompt(false);
  };

  return (
  <>
    <div className="relative bg-astrawhite w-[351px] h-[308px] rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-6 hover:-translate-y-0.5 transition-all duration-100 ease-in overflow-hidden flex flex-col justify-between">

      <div className="overflow-hidden">
        <h1 className="text-astrablack text-2xl font-bold truncate">
          {formatSalary(job.salary)}
          <span className="text-xl font-normal">/month</span>
        </h1>

        <h2 className="font-bold text-lg mt-2 leading-6 truncate">{job.job_title}</h2>
        <h2 className="text-md truncate">{job.company_name}</h2>

        <div className="flex gap-2 items-center pt-3 pb-2">
          <Image src="/icons/marker.svg" width={20} height={28.5} alt='loc' className="shrink-0" />
          <p className="text-black text-sm truncate">{job.location}</p>
        </div>

        <div className="flex gap-2 items-center">
          <Clock size="20" />
          <p className="text-black text-sm truncate">{formatDate(job.expires_at)}</p>
        </div>

        <div className="flex gap-2 items-center py-3 flex-wrap">
          <div className="border-1 border-astradarkgray bg-astratintedwhite rounded-3xl py-0.5 px-3">
            <p className="text-astrablack text-sm truncate">{jobTypeMap[job.employment_type]}</p>
          </div>
          <div className="border-1 border-astradarkgray bg-astratintedwhite rounded-3xl py-0.5 px-3">
            <p className="text-astrablack text-sm truncate">{locationTypeMap[job.location_type]}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center pt-2 justify-center">
        <button
          onClick={viewPost}
          className="hover:bg-astradark !cursor-pointer text-astrawhite border-1 border-astraprimary bg-astraprimary font-semibold w-7/10 py-3 rounded-lg transition-all duration-150 ease-in-out"
        >
          View Post
        </button>
        <button
          onClick={editPost}
          className="!cursor-pointer hover:opacity-70 text-astraprimary border-1 border-astraprimary font-semibold w-3/10 py-3 rounded-lg transition-all duration-150 ease-in-out"
        >
          Edit
        </button>
      </div>

      {isExpired() && (
        <div className="absolute top-0 left-0 bg-astradirtywhite/50 backdrop-blur-[2px] w-full h-full rounded-2xl z-10 flex items-center justify-center">
          <div className="flex flex-col items-center px-4 text-center">
            <OctagonAlert size={50} className="text-astrared mb-3" strokeWidth={2.5} />
            <h1 className="text-base font-medium">This post has expired!<br />Would you like to renew this job posting?</h1>
            <button
              onClick={() => setPrompt(true)}
              className="mt-3 bg-astrawhite text-astraprimary font-semibold w-[90px] py-2 rounded-3xl shadow-md hover:shadow-sm transition-all"
            >
              Yes
            </button>
          </div>
        </div>
      )}
    </div>

    {showPrompt && (
      <ConfirmationPrompt
        prompt={`Are you sure you want to renew this job posting for a ${job.job_title} position?`}
        close={() => setPrompt(false)}
        handleConfirm={handleRenew}
      />
    )}
  </>

  );}
