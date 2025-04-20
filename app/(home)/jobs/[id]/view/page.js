import BigJobCard from "../../../../components/jobs/view/bigJobCard";
import SmallJobCard from "../../../../components/jobs/view/smallJobCard";
import { ArrowLeft } from "lucide-react";

export default function JobsPage() {
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

        Interested? Explore openings at careers.google.com. 🚀`
    }

    return (
    <div className="mt-[80px] py-8 bg-astratintedwhite w-full flex flex-col items-center">
        
        <div className="flex gap-2 self-start ml-15 mb-5">
            <ArrowLeft size="29" className="shrink-0"/>
            <button className="text-astrablack font-semibold text-xl">Back</button>
        </div>

        <BigJobCard {...job}/>

        <div className="h-11"/>
       
        <SmallJobCard {...job}/>
    </div>
  )}
  