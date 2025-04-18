import HiringPrompt from "../../components/jobs/hiringPrompt";
import JobCard from "../../components/jobs/jobCard";
import JobEditCard from "../../components/jobs/jobEditCard";

export default function JobsPage() {
    const jobs = [
      {key:0, salary:70000, title:"Full Stack Flutter Developer", company:"iLearn Technology Solutions, Inc.", location:"Makati City, Philippines", expiryDate: new Date(), employmentType: "Full-Time", workArrangement: "Hybrid"},
      {key:1, salary:70000, title:"Full Stack Flutter Developer", company:"iLearn Technology Solutions, Inc.", location:"Makati City, Philippines", expiryDate: new Date(), employmentType: "Full-Time", workArrangement: "Hybrid"},
      {key:2, salary:70000, title:"Full Stack Flutter Developer", company:"iLearn Technology Solutions, Inc.", location:"Makati City, Philippines", expiryDate: new Date(), employmentType: "Full-Time", workArrangement: "Hybrid"},
      {key:3, salary:70000, title:"Full Stack Flutter Developer", company:"iLearn Technology Solutions, Inc.", location:"Makati City, Philippines", expiryDate: new Date(), employmentType: "Full-Time", workArrangement: "Hybrid"},
      {key:4, salary:70000, title:"Full Stack Flutter Developer", company:"iLearn Technology Solutions, Inc.", location:"Makati City, Philippines", expiryDate: new Date(), employmentType: "Full-Time", workArrangement: "Hybrid"},
      {key:5, salary:70000, title:"Full Stack Flutter Developer", company:"iLearn Technology Solutions, Inc.", location:"Makati City, Philippines", expiryDate: new Date(), employmentType: "Full-Time", workArrangement: "Hybrid"},
      {key:6, salary:70000, title:"Full Stack Flutter Developer", company:"iLearn Technology Solutions, Inc.", location:"Makati City, Philippines", expiryDate: new Date(), employmentType: "Full-Time", workArrangement: "Hybrid"}
    ];

    const myJobs = [
      {key:0, salary:270000, title:"Google Cloud Engineer", company:"Google Philippines", location:"Taguig City, Philippines", expiryDate: new Date(), employmentType: "Full-Time", workArrangement: "Onsite"},
      {key:1, salary:270000, title:"Google Cloud Engineer", company:"Google Philippines", location:"Taguig City, Philippines", expiryDate: new Date(), employmentType: "Full-Time", workArrangement: "Onsite"},
      {key:2, salary:270000, title:"Google Cloud Engineer", company:"Google Philippines", location:"Taguig City, Philippines", expiryDate: new Date(), employmentType: "Full-Time", workArrangement: "Onsite"}
    ];
    return (
    <div className="mt-[80px] py-10 bg-astratintedwhite w-full flex flex-col items-center">

      <HiringPrompt/>
      
      <div className="grid grid-cols-[351px] lg:grid-cols-[351px_351px_351px] md:grid-cols-[351px_351px] gap-5 justify-items-center justify-center mx-30">
      <h1 className="text-astrablack font-bold text-2xl ml-2 lg:col-span-3 md:col-span-2 justify-self-start">Recommended Jobs</h1>
        {jobs.map((job) => {
          return (
            <JobCard key={job.key} {...job}/>
        )})}
      </div>
      
      <button className="my-10 self-center text-lg text-astraprimary border-1 border-astraprimary font-normal w-33 py-3 rounded-lg bg-astrawhite">See More</button>

      <div className="grid grid-cols-[351px] lg:grid-cols-[351px_351px_351px] md:grid-cols-[351px_351px] gap-5 justify-items-center justify-center mx-30">
      <h1 className="text-astrablack font-bold text-2xl ml-2 lg:col-span-3 md:col-span-2 justify-self-start">Manage My Job Postings</h1>
        {myJobs.map((job) => {
          return (
            <JobEditCard key={job.key} {...job}/>
        )})}
      </div>

      <button className="my-10 self-center text-lg text-astraprimary border-1 border-astraprimary font-normal w-33 py-3 rounded-lg bg-astrawhite">See More</button>

    </div>
  )}
  