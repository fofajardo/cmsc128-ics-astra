'use client';

import HiringPrompt from "../../components/jobs/hiringPrompt";
import JobCard from "../../components/jobs/jobCard";
import JobEditCard from "../../components/jobs/jobEditCard";
import SearchBar from "../../components/jobs/search";
import Filter from "../../components/jobs/filters";
import Image from "next/image";
import {dummyJobs, dummyMyJobs, filters} from './dummy'
import { useState, useEffect } from 'react';

export default function JobsPage() {
    const [jobs, setJobs] = useState(dummyJobs);
    const [myJobs, setMyJobs] = useState(dummyMyJobs);
    const [jobCards, setJobCards] = useState(6); // limit / no. of cards to show
    const [myJobCards, setMyJobCards] = useState(6); // limit / no. of cards owned to show
    const CARDS_PER_CLICK = 6;

    useEffect(() => {
    // fetch jobs logic here whenever See More component is clicked

    // fetch myJobs logic here whenever See More component is clicked

    }, [jobCards, myJobCards])

    return (
    <div className="overflow-hidden py-10 bg-astratintedwhite w-full flex flex-col items-center">

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
          <h1 className="text-astrablack font-bold text-2xl ml-2 lg:col-span-3 md:col-span-2 justify-self-start">Manage My Job Postings</h1>
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
  