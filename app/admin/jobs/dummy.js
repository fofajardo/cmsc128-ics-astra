const jobList = [
    {
        id: 1,
        job_title: "Backend Developer",
        company_name: "TechNova Inc.",
        location: "New York, NY",
        job_type: "Full-time",
        created_at: "2025-04-20",
        status: "Open"
    },
    {
        id: 2,
        job_title: "Civil Engineering Consultant",
        company_name: "UrbanStructures Ltd.",
        location: "San Francisco, CA",
        job_type: "Freelance",
        created_at: "2025-04-18",
        status: "Expired"
    },
    {
        id: 3,
        job_title: "Frontend Developer",
        company_name: "Creative Pixels",
        location: "Chicago, IL",
        job_type: "Part-time",
        created_at: "2025-04-22",
        status: "Open"
    },
    {
        id: 4,
        job_title: "DevOps Engineer",
        company_name: "CloudForge",
        location: "Austin, TX",
        job_type: "Full-time",
        created_at: "2025-04-21",
        status: "Open"
    },
    {
        id: 5,
        job_title: "iOS Developer",
        company_name: "AppNation",
        location: "Seattle, WA",
        job_type: "Temporary",
        created_at: "2025-04-19",
        status: "Expired"
    },
    {
        id: 6,
        job_title: "Full Stack Developer",
        company_name: "NextGen Web",
        location: "Miami, FL",
        job_type: "Full-time",
        created_at: "2025-04-20",
        status: "Open"
    },
    {
        id: 7,
        job_title: "Cloud Engineer",
        company_name: "SkyLayer",
        location: "Denver, CO",
        job_type: "Part-time",
        created_at: "2025-04-23",
        status: "Open"
    },
    {
        id: 8,
        job_title: "Security Analyst",
        company_name: "SecureNet",
        location: "Boston, MA",
        job_type: "Full-time",
        created_at: "2025-04-17",
        status: "Expired"
    },
    {
        id: 9,
        job_title: "AI Researcher",
        company_name: "NeuroTech Labs",
        location: "Los Angeles, CA",
        job_type: "Full-time",
        created_at: "2025-04-22",
        status: "Open"
    },
    {
        id: 10,
        job_title: "Database Administrator",
        company_name: "DataCore Solutions",
        location: "Atlanta, GA",
        job_type: "Freelance",
        created_at: "2025-04-18",
        status: "Expired"
    }
];


const job = {
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
    apply_link: "https://amis.uplb.edu.ph",
    job_requirements: 
`Hands-on experience with GCP services
Proficiency with Infrastructure as Code (Terraform, Ansible)
Strong coding skills in Python or Go
Deep understanding of networking and security principles`,
    hiring_manager: "cloud.recruiter@google.com"
}

export {jobList, job}