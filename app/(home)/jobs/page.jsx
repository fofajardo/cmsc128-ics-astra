"use client";

import HiringPrompt from "../../components/jobs/hiringPrompt";
import JobCard from "../../components/jobs/jobCard";
import JobEditCard from "../../components/jobs/jobEditCard";
import SearchBar from "../../components/jobs/search";
import Filter from "../../components/jobs/filters";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useSignedInUser } from "@/components/UserContext";
import { JobsStatus } from "../../../common/scopes";
import { job } from "./dummy";
import jobVector from "../../assets/job-vector.png";

export default function JobsPage() {
  const user = useSignedInUser();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [jobCards, setJobCards] = useState(6); // limit / no. of cards to show
  const [myJobCards, setMyJobCards] = useState(6); // limit / no. of cards owned to show
  const CARDS_PER_CLICK = 6;

  const handleSeeMore = (cards, addCards) => {
    addCards(cards + CARDS_PER_CLICK);
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/jobs`);
      if (response.data.status === "OK") {
        const jobs = response.data.list || [];
        setJobs(jobs);

        const userId = user?.state?.user?.id;

        if (userId) {
          const jobsWithContentFlag = await Promise.all(
            jobs.map(async (job) => {
              try {
                const res = await axios.get(
                  `${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${job.job_id}`
                );

                const contents = Array.isArray(res.data)
                  ? res.data
                  : res.data.list || [];

                const hasUserContent = contents.some(
                  (content) => content.user_id === userId
                );

                return {
                  ...job,
                  hasUserContent,
                };
              } catch (err) {
                console.error(`Error fetching content for job ${job.job_id}`, err);
                return { ...job, hasUserContent: false };
              }
            })
          );
          setMyJobs(jobsWithContentFlag);
        }
      } else {
        console.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Failed to fetch jobs. Please try again later.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  const sort = (filtered, asc) => {
    return filtered.sort((a, b) => (new Date(b.created_at) - new Date(a.created_at)) * (asc ? 1 : -1));
  };

  const handleApplyFilter = (filters) => {
    const {job_type = "",
      status = "",
      location = "",
      location_type = "",
      min_salary = "",
      max_salary = "",
      recent = false
    } = filters;

    const lowerLocation = location.toLowerCase();
    const dateToday = new Date();

    var filtered = jobs.filter(job => {
      const matchesJobType = job_type === job.employment_type || job_type === "";

      const statusExpired = ((dateToday - new Date (job.expires_at)) < 0) ? true : false;
      const statusVal = job.status === JobsStatus.OPEN_UNTIL_EXPIRED
        ? statusExpired : job.status === JobsStatus.CLOSED ? false : true;
      const matchesStatus = status === "" ? true : ([JobsStatus.OPEN_UNTIL_EXPIRED, JobsStatus.OPEN_INDEFINITE].includes(status)
        ? statusVal : !statusVal);

      const jobLowerLocation = job.location.toLowerCase();
      const matchesLocation = jobLowerLocation.includes(lowerLocation) || lowerLocation.length === 0;

      const matchesLocationType = location_type === job.location_type || location_type === "";

      const matchesMinSalary = min_salary <= job.salary || min_salary === "";
      const matchesMaxSalary = max_salary >= job.salary || max_salary === "";

      return (
        matchesJobType &&
        matchesStatus &&
        matchesLocationType &&
        matchesLocation &&
        matchesMinSalary && matchesMaxSalary
      );
    });

    const sorted = sort(filtered, recent);

    setFilteredJobs(filtered);
  };

  const [showExpired, setExpired] = useState(false);

  return (
    <div className="overflow-hidden pb-10 bg-astratintedwhite w-full flex flex-col items-center">
      <div className="w-full bg-astradirtywhite mb-8">
        <div
          className="relative w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/blue-bg.png')" }}
        >
          <div className="max-w-[1440px] mx-auto px-12 py-20 flex flex-col lg:flex-row items-center justify-between text-astrawhite gap-10">
            <div className="max-w-[600px] space-y-6 text-center lg:text-left animate-hero-text">
              <h1 className="text-[60px] font-extrabold leading-[1.1]">
                Careers & <br/> Opportunities
              </h1>
              <p className="text-lg font-medium">
                Explore professional positions that align with your qualifications and career aspirations.
              </p>
            </div>
            <div className="w-full lg:w-[550px] flex justify-center">
              <div className="relative w-full h-auto max-w-[550px] animate-natural-float">
                <Image
                  src={jobVector}
                  alt="Job Illustration"
                  className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        <style jsx global>{`
          @keyframes naturalFloat {
            0% { transform: translate(0px, 0px) rotate(0deg); }
            25% { transform: translate(8px, -10px) rotate(1deg); }
            50% { transform: translate(0px, -20px) rotate(0deg); }
            75% { transform: translate(-8px, -10px) rotate(-1deg); }
            100% { transform: translate(0px, 0px) rotate(0deg); }
          }
          @keyframes fadeBounce {
            0% { opacity: 0; transform: translateY(-10px); }
            50% { opacity: 1; transform: translateY(5px); }
            100% { transform: translateY(0px); }
          }
          @keyframes particles {
            0% { background-position: 0 0; }
            100% { background-position: 1000px 0; }
          }
          .animate-natural-float { animation: naturalFloat 8s ease-in-out infinite; }
          .animate-fade-bounce { animation: fadeBounce 1.5s ease forwards; }
          .animate-hero-text { animation: fadeBounce 2s ease-in-out; }
        `}</style>
      </div>

      <HiringPrompt refreshJobs={fetchJobs}/>

      <SearchBar onSearch={(query) => {
        const lower = query.toLowerCase();
        const filtered = jobs.filter(job =>
          (job.job_title || "").toLowerCase().includes(lower) || (job.company_name || "").toLowerCase().includes(lower));
        setFilteredJobs(filtered);}}/>

      <Filter onApply={handleApplyFilter}/>

      {filteredJobs.length == 0 ? <Image src="/jobs/empty.png" width={181} height={224} alt='empty' className="shrink-0 col-span-3"/>
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          <h1 className="text-astrablack font-bold text-2xl ml-2 lg:col-span-3 md:col-span-2 justify-self-start">Recommended Jobs</h1>
          {(filteredJobs.length > 0 ? filteredJobs : jobs).slice(0, jobCards).map((job) => {
            return (
              <JobCard key={job.job_id} job={job}/>
            );})}
        </div>
      }

      {filteredJobs.length === 0 ? <></> : filteredJobs.length <= jobCards ?
        <div className="text-center my-10 text-gray-400 text-sm font-medium">
          All jobs loaded
        </div> :
        <button
          onClick={() => handleSeeMore(jobCards, setJobCards)}
          className="my-6 hover:text-astrawhite border border-astraprimary rounded-lg relative flex h-9 w-28 items-center justify-center overflow-hidden bg-astrawhite text-astraprimary transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-astraprimary before:duration-500 before:ease-out hover:before:h-40 hover:before:w-40"
        >
          <span className="relative z-10 text-sm md:text-md font-medium">See More</span>
        </button>
      }

      {myJobs.length == 0 ? <></>
        :
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
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
              );})}
          </div>


          {myJobs.length === 0 ? <></> :  myJobs.length <= myJobCards ?
            <div className="text-center my-10 text-gray-400 text-sm font-medium">
              All my jobs loaded
            </div> :
            <button
              onClick={() => handleSeeMore(myJobCards, setMyJobCards)}
              className="my-6 hover:text-astrawhite border border-astraprimary rounded-lg relative flex h-9 w-28 items-center justify-center overflow-hidden bg-astrawhite text-astraprimary transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-astraprimary before:duration-500 before:ease-out hover:before:h-40 hover:before:w-40"
            >
              <span className="relative z-10 text-sm md:text-md font-medium">See More</span>
            </button>}
        </>
      }
    </div>
  );}
