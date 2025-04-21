import HiringPrompt from "../../components/jobs/hiringPrompt";
import JobCard from "../../components/jobs/jobCard";
import JobEditCard from "../../components/jobs/jobEditCard";
import SearchBar from "../../components/jobs/search";
import Filter from "../../components/jobs/filters";
import {jobs, myJobs, filters} from './dummy'

export default function JobsPage() {
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

      <div className="grid grid-cols-[351px] lg:grid-cols-[351px_351px_351px] md:grid-cols-[351px_351px] gap-5 justify-items-center justify-center mx-30">
      <h1 className="text-astrablack font-bold text-2xl ml-2 lg:col-span-3 md:col-span-2 justify-self-start">Recommended Jobs</h1>
        {jobs.map((job) => {
          return (
            <JobCard key={job.job_id} job={job}/>
        )})}
      </div>
      
      <button className="!cursor-pointer my-10 self-center text-lg text-astraprimary border-1 border-astraprimary font-normal w-33 py-3 rounded-lg bg-astrawhite">See More</button>

      <div className="grid grid-cols-[351px] lg:grid-cols-[351px_351px_351px] md:grid-cols-[351px_351px] gap-5 justify-items-center justify-center mx-30">
      <h1 className="text-astrablack font-bold text-2xl ml-2 lg:col-span-3 md:col-span-2 justify-self-start">Manage My Job Postings</h1>
        {myJobs.map((job) => {
          return (
            <JobEditCard key={job.job_id} job={job}/>
        )})}
      </div>

      <button className="!cursor-pointer my-10 self-center text-lg text-astraprimary border-1 border-astraprimary font-normal w-33 py-3 rounded-lg bg-astrawhite">See More</button>

    </div>
  )}
  