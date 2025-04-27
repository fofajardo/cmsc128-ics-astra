'use client';

import { Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function JobEditCard({job}) {
    const router = useRouter();
    
    const viewPost = () => {
        router.push(`/jobs/${job.job_id}/view`);
    };

    const editPost = () => {
        router.push(`/jobs/${job.job_id}/edit`);
    };

    const formatSalary = (num) => {
        return `₱${num.toLocaleString('en-US')}`
    }

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
    <div className="bg-astrawhite w-[351px] h-[308px] rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-6 hover:-translate-y-0.5 transition-all duration-100ms ease-in">
        
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
            <div className="border-1 border-astradarkgray bg-astratintedwhite rounded-3xl py-0.5 px-3"><p className="text-astrablack text-sm">{job.employment_type}</p></div>
            <div className="border-1 border-astradarkgray bg-astratintedwhite rounded-3xl py-0.5 px-3"><p className="text-astrablack text-sm">{job.location_type}</p></div>
        </div>
       
        <div className="flex gap-2 items-center py-2.5 justify-center">
            <button onClick={viewPost} className="hover:bg-astradark hover:scale-none !cursor-pointer text-astrawhite border-1 border-astraprimary bg-astraprimary font-semibold w-7/10 py-3 rounded-lg">View Post</button>
            <button onClick={editPost} className="hover:scale-none hover:opacity-70 !cursor-pointer text-astraprimary border-1 border-astraprimary font-semibold w-3/10 py-3 rounded-lg">Edit</button>
        </div>
    
    </div>
  )}
  