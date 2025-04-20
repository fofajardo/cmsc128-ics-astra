import { Clock } from "lucide-react";
import Image from "next/image";

export default function JobEditCard(job) {
    return (
    <div className="bg-astrawhite w-[351px] h-[308px] rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-6">
        
        <h1 className="text-astrablack text-2xl font-bold">₱{job.salary}<span className="text-xl font-normal">/month</span></h1>
        
        <h2 className="font-bold text-lg mt-2 leading-6">{job.title}</h2>
        <h2 className="text-md">{job.company}</h2>
        
        <div className="flex gap-2 items-center pt-3 pb-2">
            <Image src="/icons/marker.svg" width={20} height={28.5} alt='loc' className="shrink-0"></Image>
            <p className="text-black text-sm">{job.location}</p>
        </div>
       
        <div className="flex gap-2 items-center">
            <Clock size="20"/>
            <p className="text-black text-sm">May 20, 2025</p>
        </div>
       
        <div className="flex gap-2 items-center py-3">
            <div className="border-1 border-astradarkgray bg-astratintedwhite rounded-3xl py-0.5 px-3"><p className="text-astrablack text-sm">{job.employmentType}</p></div>
            <div className="border-1 border-astradarkgray bg-astratintedwhite rounded-3xl py-0.5 px-3"><p className="text-astrablack text-sm">{job.workArrangement}</p></div>
        </div>
       
        <div className="flex gap-2 items-center py-2.5 justify-center">
            <button className="text-astrawhite border-1 border-astraprimary bg-astraprimary font-semibold w-7/10 py-3 rounded-lg">View Post</button>
            <button className="text-astraprimary border-1 border-astraprimary font-semibold w-3/10 py-3 rounded-lg">Edit</button>
        </div>
    
    </div>
  )}
  