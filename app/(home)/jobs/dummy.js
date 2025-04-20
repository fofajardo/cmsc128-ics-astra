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