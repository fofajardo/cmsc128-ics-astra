'use client';

import HiringPrompt from "../../components/jobs/hiringPrompt";
import JobCard from "../../components/jobs/jobCard";
import JobEditCard from "../../components/jobs/jobEditCard";
import SearchBar from "../../components/jobs/search";
import Filter from "../../components/jobs/filters";
import Image from "next/image";
import {dummyJobs, dummyMyJobs} from './dummy'
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from "lucide-react";

export default function JobsPage() {
    const [jobs, setJobs] = useState(dummyJobs);
    const [myJobs, setMyJobs] = useState(dummyMyJobs);
    const [jobCards, setJobCards] = useState(6); // limit / no. of cards to show
    const [myJobCards, setMyJobCards] = useState(6); // limit / no. of cards owned to show
    const CARDS_PER_CLICK = 6;

    const [showExpired, setExpired] = useState(false);

    useEffect(() => {
    // fetch jobs logic here whenever See More component is clicked

    // fetch myJobs logic here whenever See More component is clicked

    }, [jobCards, myJobCards])

    return (
    <div className="overflow-hidden pb-10 bg-astratintedwhite w-full flex flex-col items-center">

      <header className="mb-8 bg-[url(/blue-bg.png)] bg-cover bg-center h-[60lvh] w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-[32px] md:text-[55px] text-astrawhite">Take off to new careers at ICS-ASTRA!</h1>
        <h2 className="text-astrawhite text-[16px] md:text-[20px] w-1/2 text-center">
          Discover a place where your ambitions and potential align. With opportunities designed to inspire, you can turn your aspirations
          into reality.
        </h2>
      </header>

      <HiringPrompt/>
      
      <SearchBar/>

      <Filter/>

      {jobs.length == 0 ? <Image src="/jobs/empty.png" width={181} height={224} alt='empty' className="shrink-0 col-span-3"/> 
      : <div className="grid grid-cols-[351px] lg:grid-cols-[351px_351px_351px] md:grid-cols-[351px_351px] gap-5 justify-items-center justify-center mx-30">
          <h1 className="text-astrablack font-bold text-2xl ml-2 lg:col-span-3 md:col-span-2 justify-self-start">Recommended Jobs</h1>
            {jobs.slice(0,jobCards).map((job) => {
              return (
                <JobCard key={job.job_id} job={job}/>
            )})}
        </div>
      }
      
      {jobs.length == 0 ? <></> : <button onClick={()=>setJobCards((prev)=>prev + CARDS_PER_CLICK)} className="my-10 hover:scale-none hover:text-astrawhite border-1 border-astraprimary text-lg rounded-lg relative flex h-[50px] w-33 items-center justify-center overflow-hidden bg-astrawhite text-astraprimary transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-astraprimary before:text-astraprimary before:duration-500 before:ease-out hover:before:h-56 hover:before:w-56">
        <span className="relative z-10">See More</span>
      </button>}
      
      {myJobs.length == 0 ? <></> 
      : 
      <>
        <div className="grid grid-cols-[351px] lg:grid-cols-[351px_351px_351px] md:grid-cols-[351px_351px] gap-5 justify-items-center justify-center mx-30">
          <div className="flex justify-between lg:col-span-3 md:col-span-2 justify-self-start items-center">
            <h1 className="text-astrablack font-bold text-2xl ml-2">Manage My Job Postings</h1>
            {/* <button onClick={() => setExpired(!showExpired)} name={"recent"} className={`ml-3 ${showExpired ? 'bg-[var(--color-astraprimary)] text-[var(--color-astrawhite)]' : 'text-[var(--color-astrablack)] bg-[var(--color-astrawhite)]'} !cursor-pointer flex items-center justify-between outline outline-transparent border-1 border-astraprimary font-normal px-4 h-[45px] w-30 rounded-lg placeholder:text-astradarkgray -translate-y-0 hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] hover:scale-none`} tabIndex={0}>
                <p>Expired</p>
                {showExpired ? <Eye className={`text-[var(--color-astrawhite)]`} size={25} strokeWidth={2}/>
                : <EyeOff className={'text-[var(--color-astraprimary)]'} size={25} strokeWidth={2}/>}
            </button> */}
          </div>
              {myJobs.slice(0, myJobCards).map((job) => {
              return (
                <JobEditCard key={job.job_id} job={job}/>
            )})}
        </div>
        

        <button onClick={()=>setMyJobCards((prev) => prev + CARDS_PER_CLICK)} className="my-10 hover:scale-none hover:text-astrawhite border-1 border-astraprimary text-lg rounded-lg relative flex h-[50px] w-33 items-center justify-center overflow-hidden bg-astrawhite text-astraprimary transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-astraprimary before:text-astraprimary before:duration-500 before:ease-out hover:before:h-56 hover:before:w-56">
          <span className="relative z-10">See More</span>
        </button>
      </>
      }
    </div>
  )}
  