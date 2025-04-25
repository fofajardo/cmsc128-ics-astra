const jobs = [
    { job_id: 0, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/" },
    { job_id: 1, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/" },
    { job_id: 2, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/" },
    { job_id: 3, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/" },
    { job_id: 4, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/" },
    { job_id: 5, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/" },
    { job_id: 6, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/" }
  ];  

const myJobs = [
    { job_id: 0, salary: 270000, job_title: "Google Cloud Engineer", company_name: "Google Philippines", location: "Taguig City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Onsite" },
    { job_id: 1, salary: 270000, job_title: "Google Cloud Engineer", company_name: "Google Philippines", location: "Taguig City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Onsite" },
    { job_id: 2, salary: 270000, job_title: "Google Cloud Engineer", company_name: "Google Philippines", location: "Taguig City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Onsite" }
];

const job = {
    job_id:20021,
    salary:70000, 
    job_title:"Google Cloud Engineer", 
    company_name:"Google Philippines", 
    location:"38th Floor, Seven NEO, Building 5th Ave, Manila, 1016 Metro Manila", 
    expires_at: new Date(), 
    employment_type: "Full-Time", 
    location_type: "Onsite",
    details: 
    `As a Cloud Engineer at Google Cloud, you'll design,  build, and optimize scalable cloud solutions that help businesses  transform and innovate. You'll work with cutting-edge technologies like Kubernetes, BigQuery, and AI/ML tools to architect secure, high-performance infrastructure. Partnering with customers and internal  teams, you’ll solve complex technical challenges and drive cloud adoption worldwide.

    Key Responsibilities:
    Design and deploy secure, scalable cloud architectures on Google Cloud Platform (GCP).
    Automate infrastructure using Terraform, Ansible, or other IaC tools.
    Troubleshoot performance issues and optimize cost-efficiency.
    Collaborate with customers and internal teams to implement best practices.

    Requirements:
    Bachelor’s degree in Computer Science, Engineering, or related field (or equivalent experience).
    Hands-on experience with GCP, AWS, or Azure (certifications a plus).
    Proficiency in Python, Go, or scripting languages.
    Strong knowledge of networking, security, and DevOps practices.

    Why Join? Work on the forefront of cloud innovation, shape the future of enterprise tech, and grow with a global leader in  cloud computing.

    Interested? Explore openings at careers.google.com. 🚀`,
    apply_link: "https://amis.uplb.edu.ph"
}

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

export {job, jobs, myJobs, filters, jobTypeOptions, statusOptions, locationTypeOptions};