const dummyJobs = [
  { job_id: 0, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/", job_requirements: ["3+ years experience in Flutter and Dart", "Strong knowledge of RESTful APIs", "Experience with state management (e.g., Provider, Bloc)", "Familiarity with Git and version control", "Good problem-solving skills"], hiring_manager: "09171234567" },
  { job_id: 1, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/", job_requirements: ["Bachelor’s degree in Computer Science or related field", "Strong understanding of mobile app lifecycle", "Knowledge of Firebase integration", "Experience with agile methodologies"], hiring_manager: "jane.doe@ilearntech.com" },
  { job_id: 2, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/", job_requirements: ["Proficiency in Flutter and native Android/iOS development", "Ability to write clean, maintainable code", "Experience with third-party libraries and APIs", "Excellent communication skills"], hiring_manager: "09182345678" },
  { job_id: 3, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/", job_requirements: ["Minimum 2 years of Flutter development experience", "Strong understanding of UI/UX design principles", "Knowledge of cloud functions and serverless computing", "Team player with a proactive attitude"], hiring_manager: "john.smith@ilearntech.com" },
  { job_id: 4, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/", job_requirements: ["Strong background in computer science fundamentals", "Experience with CI/CD pipelines", "Hands-on experience with GraphQL", "Ability to handle multiple tasks efficiently"], hiring_manager: "09203456789" },
  { job_id: 5, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/", job_requirements: ["Knowledge of software architecture patterns", "Experience integrating third-party SDKs", "Ability to work independently and in a team", "Strong analytical and debugging skills"], hiring_manager: "maria.reyes@ilearntech.com" },
  { job_id: 6, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/", job_requirements: ["Deep understanding of mobile development best practices", "Experience with push notifications and background services", "Familiarity with Flutter Web", "Detail-oriented mindset"], hiring_manager: "09314567890" },
  { job_id: 7, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/", job_requirements: ["Proficiency with APIs and third-party integrations", "Ability to mentor junior developers", "Good understanding of responsive design", "Strong problem-solving capabilities"], hiring_manager: "alex.tan@ilearntech.com" },
  { job_id: 8, salary: 70000, job_title: "Full Stack Flutter Developer", company_name: "iLearn Technology Solutions, Inc.", location: "Makati City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Hybrid", apply_link: "https://amis.uplb.edu.ph/", job_requirements: ["Strong foundation in object-oriented programming", "Experience with mobile performance tuning", "Knowledge of different mobile architectures (MVC, MVVM)", "Excellent interpersonal and teamwork skills"], hiring_manager: "09425678901" }
];

const dummyMyJobs = [
  { job_id: 0, salary: 270000, job_title: "Google Cloud Engineer", company_name: "Google Philippines", location: "Taguig City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Onsite",
    details: `As a Cloud Engineer at Google Cloud, you'll design,  build, and optimize scalable cloud solutions that help businesses  transform and innovate. You'll work with cutting-edge technologies like Kubernetes, BigQuery, and AI/ML tools to architect secure, high-performance infrastructure. Partnering with customers and internal  teams, you’ll solve complex technical challenges and drive cloud adoption worldwide.
    
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
    
        Interested? Explore openings at careers.google.com. 🚀`,  created_at: new Date(new Date().setDate(new Date().getDate() - 29)) },
  { job_id: 1, salary: 270000, job_title: "Google Cloud Engineer", company_name: "Google Philippines", location: "Taguig City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Onsite",  created_at: new Date(new Date().setDate(new Date().getDate() - 15)) },
  { job_id: 2, salary: 270000, job_title: "Project Manager", company_name: "Google Philippines", location: "Taguig City, Philippines", expires_at: new Date(), employment_type: "Full-Time", location_type: "Onsite", created_at: new Date(new Date().setMonth(new Date().getMonth() - 2)) },
];

const job = {
  job_id: 20021,
  salary: 70000,
  job_title: "Google Cloud Engineer",
  company_name: "Google Philippines",
  location: "38th Floor, Seven NEO, Building 5th Ave, Manila, 1016 Metro Manila",
  expires_at: new Date(),
  employment_type: "Full-Time",
  location_type: "Onsite",
  details: `As a Cloud Engineer at Google Cloud, you'll design, build, and optimize scalable cloud solutions that help businesses transform and innovate. You'll work with cutting-edge technologies like Kubernetes, BigQuery, and AI/ML tools to architect secure, high-performance infrastructure. Partnering with customers and internal teams, you’ll solve complex technical challenges and drive cloud adoption worldwide.
  
  Key Responsibilities:
  - Design and deploy secure, scalable cloud architectures on Google Cloud Platform (GCP).
  - Automate infrastructure using Terraform, Ansible, or other IaC tools.
  - Troubleshoot performance issues and optimize cost-efficiency.
  - Collaborate with customers and internal teams to implement best practices.
  
  Requirements:
  - Bachelor’s degree in Computer Science, Engineering, or related field (or equivalent experience).
  - Hands-on experience with GCP, AWS, or Azure (certifications a plus).
  - Proficiency in Python, Go, or scripting languages.
  - Strong knowledge of networking, security, and DevOps practices.
  
  Why Join? 
  Work on the forefront of cloud innovation, shape the future of enterprise tech, and grow with a global leader in cloud computing.
  
  Interested? 
  Explore openings at careers.google.com. 🚀`,
  apply_link: "https://amis.uplb.edu.ph",
  job_requirements:
`Hands-on experience with GCP services
Proficiency with Infrastructure as Code (Terraform, Ansible)
Strong coding skills in Python or Go
Deep understanding of networking and security principles`,
  hiring_manager: "cloud.recruiter@google.com"
};


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
];

const statusOptions = [
  {value: "open", label: "Open"},
  {value: "closed", label: "Closed"}
];

const locationTypeOptions = [
  {value: "onsite", label: "Onsite"},
  {value: "remote", label: "Remote"},
  {value: "hybrid", label: "Hybrid"}
];

export {job, dummyJobs, dummyMyJobs, filters, jobTypeOptions, statusOptions, locationTypeOptions};