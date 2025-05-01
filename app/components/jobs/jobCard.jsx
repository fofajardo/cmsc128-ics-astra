"use client";

import { Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JobCard({job}) {
  const router = useRouter();
  const jobTypeMap = {"0": "Part-Time", "1": "Full-time", "2": "Temporary", "3": "Freelance"};
  const locationTypeMap = {"0": "Onsite", "1": "Remote", "2": "Hybrid"};

  const viewPost = () => {
    console.log(job.job_id);
    router.push(`/jobs/${job.job_id}/view`);
  };

  const formatSalary = (num) => {
    return `₱${num.toLocaleString("en-US")}`;
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return "Invalid Date";

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };


  return (
    <div className="bg-astrawhite w-[351px] h-[308px] rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 p-6 transition-all duration-100ms ease-in">

      <h1 className="text-astrablack text-2xl font-bold">{formatSalary(job.salary)}<span className="text-xl font-normal">/month</span></h1>

      <h2 className="font-bold text-lg mt-2 leading-6 truncate">{job.job_title}</h2>
      <h2 className="text-md">{job.company_name}</h2>

      <div className="flex gap-2 items-center pt-3 pb-2">
        <Image src="/icons/marker.svg" width={20} height={28.5} alt='loc' className="shrink-0"></Image>
        <p className="text-black text-sm truncate">{job.location}</p>
      </div>

      <div className="flex gap-2 items-center">
        <Clock size="20"/>
        <p className="text-black text-sm">{formatDate(job.expires_at)}</p>
      </div>

      <div className="flex gap-2 items-center py-3">
        <div className="border-1 border-astradarkgray bg-astratintedwhite rounded-3xl py-0.5 px-3"><p className="text-astrablack text-sm">{jobTypeMap[job.employment_type]}</p></div>
        <div className="border-1 border-astradarkgray bg-astratintedwhite rounded-3xl py-0.5 px-3"><p className="text-astrablack text-sm">{locationTypeMap[job.location_type]}</p></div>
      </div>

      <div className="flex gap-2 items-center py-2.5 justify-center">
        <Link href={job.apply_link} target="_blank" className="hover:bg-astradark text-center transition-all duration-150 ease-in-out text-astrawhite border-1 border-astraprimary bg-astraprimary font-semibold w-7/10 py-3 rounded-lg">Apply Now</Link>
        <button onClick={viewPost} className="!cursor-pointer hover:scale-none hover:opacity-70 text-astraprimary border-1 border-astraprimary font-semibold w-3/10 py-3 rounded-lg">View</button>
      </div>

    </div>
  );}
