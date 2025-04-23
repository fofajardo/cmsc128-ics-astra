import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function SmallJobCard(job) {

    const isOpen = true;

    return (
    <div className="flex gap-5 bg-astrawhite max-w-[1250px] min-w-[750px] w-19/20 min-h-[308px] h-auto rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-10 pb-7">
        {/* Details */}
        <div className="w-1/3">
            <h1 className="text-astrablack text-2xl font-bold">Job Details</h1>
            
            <h1 className="text-astrablack text-xl font-bold mt-5">₱{job.salary}<span className="text-xl font-normal">/month</span></h1>
            
            <div className="flex gap-2 items-start pt-3 pb-2">
                <Image src="/icons/marker.svg" width={20} height={28.5} alt='loc' className="shrink-0"></Image>
                <p className="text-black text-sm leading-4">{job.location}</p>
            </div>
            
            <div className="flex gap-2 items-center">
                <Clock size="20" className="shrink-0"/>
                <p className="text-black text-sm">{job.expires_at.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}</p>
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 my-3">
                <div className={`border-1 ${isOpen ? "border-[#045600] bg-[#ECFFED] text-[#045600]" : "text-[#E8403C] bg-[#FFF0EC] border-[#E8403C]"} rounded-lg py-2 px-4.5`}><p className="text-sm">{isOpen ? "Open": "Close"}</p></div>                
                <div className={`border-1 bg-astratintedwhite ${isOpen ? "text-astrablack border-astradarkgray" : "text-astralightgray border-astralightgray"} rounded-lg py-2 px-4.5`}><p className="text-sm">{job.employment_type}</p></div>
                <div className={`border-1 bg-astratintedwhite ${isOpen ? "text-astrablack border-astradarkgray" : "text-astralightgray border-astralightgray"} rounded-lg py-2 px-4.5`}><p className="text-sm">{job.location_type}</p></div>
            </div>

            <div className="flex flex-col items-center w-7/10">
                <Link href={job.apply_link} target="_blank" className={`hover:bg-astradark text-center transition-all duration-150 ease-in-out text-astrawhite font-semibold w-full py-2 rounded-lg mt-2 ${isOpen ? "text-astrawhite bg-astraprimary"  : "text-[#E8403C] bg-[#FFF0EC]"}`}>Apply Now</Link>
                <p className={`text-center text-sm font-medium mt-1 ${isOpen ? "text-astrablack" : "text-[#E8403C]"}`}>{isOpen ? "Applications are still ongoing!" : "Applications have already closed."}</p>
            </div>

        </div>

        {/* Google Maps */}
        <div className="w-2/3 h-full flex items-center rounded-xl">
            <Image src="/map.jpg" width={600} height={275} alt='loc' className="shrink-0"></Image>
        </div>
    </div>
  )}
  