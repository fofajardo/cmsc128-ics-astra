const jobs = [
    { job_id: 0, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid" },
    { job_id: 1, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid" },
    { job_id: 2, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid" },
    { job_id: 3, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid" },
    { job_id: 4, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid" },
    { job_id: 5, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid" },
    { job_id: 6, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid" }
];

const myJobs = [
    { job_id: 0, salary: 270000, job_title: "Google Cloud Engineer", company_name: "Google Philippines", location: "Taguig City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Onsite" },
    { job_id: 1, salary: 270000, job_title: "Google Cloud Engineer", company_name: "Google Philippines", location: "Taguig City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Onsite" },
    { job_id: 2, salary: 270000, job_title: "Google Cloud Engineer", company_name: "Google Philippines", location: "Taguig City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Onsite" }
];

const filters = [
    {id:0, type:"dropdown", label:"Job Type" , icon:"lucide:chevron-down", placeholder:""},
    {id:1, type:"dropdown", label:"Status" , icon:"lucide:chevron-down", placeholder:""},
    {id:2, type:"text", label:"Location" , icon:"", placeholder:"City/Country"},
    {id:3, type:"dropdown", label:"Location Type" , icon:"lucide:chevron-down", placeholder:""},
    {id:4, type:"range", label:"Salary Range (₱)" , icon:"", placeholder:""},
    {id:5, type:"filter", label:"Most Recent" , icon:"lucide:list-filter", placeholder:""}
];

const jobTypeOptions = [
    {value: "part-time", label: "Part-Time"},
    {value: "full-time", label: "Full-Time"},
    {value: "temporary", label: "Temporary"},
    {value: "freelance", label: "Freelance"}
]

const statusOptions = [
    {value: "open", label: "Open"},
    {value: "closed", label: "Closed"}
]

const locationTypeOptions = [
    {value: "onsite", label: "Onsite"},
    {value: "remote", label: "Remote"},
    {value: "hybrid", label: "Hybrid"}
]

export {jobs, myJobs, filters, jobTypeOptions, statusOptions, locationTypeOptions};