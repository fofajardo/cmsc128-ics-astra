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
    <div className="mt-[80px] py-10 bg-astratintedwhite w-full">

      <h1 className="text-astrablack font-bold text-2xl ml-33 mb-5">Recommended Jobs</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 justify-items-center justify-center mx-30">
        {jobs.map((job) => {
          return (
            <JobCard key={job.key} {...job}/>
        )})}
      </div>

      <h1 className="text-astrablack font-bold text-2xl ml-33 mb-5">Manage My Job Postings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 justify-items-center justify-center mx-30">
        {myJobs.map((job) => {
          return (
            <JobEditCard key={job.key} {...job}/>
        )})}
      </div>

    </div>
  )}
  