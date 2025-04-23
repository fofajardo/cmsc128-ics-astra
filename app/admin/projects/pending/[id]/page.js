"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoBackButton, ActionButton } from "@/components/Buttons";
import { GraduationCap, HeartHandshake, Calendar, User, Goal, FileText, Phone, Mail } from "lucide-react";
import ToastNotification from '@/components/ToastNotification';

// This would be in your app/admin/projects/pending/[id]/page.js file
export default function PendingProjectDetail({ params }) {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  
  // In a real app, you'd fetch this data based on the params.id
  // For demo purposes, we're using a hardcoded project
  const project = {
    id: params.id,
    title: "Women in Tech Scholarship",
    type: "Scholarship",
    image: "/api/placeholder/800/400",
    description: "Supporting female students pursuing degrees in computer science and information technology to increase representation in tech.",
    longDescription: "This scholarship aims to address the gender gap in technology fields by providing financial support to female students who demonstrate academic excellence and passion for computer science and IT. Recipients will receive funding for tuition, books, and have opportunities to connect with female mentors in the industry. The scholarship committee will select candidates based on academic merit, financial need, and demonstrated interest in pursuing a career in technology. By supporting this initiative, we hope to contribute to a more diverse and inclusive tech workforce in the future.",
    goal: "₱300,000",
    requester: {
      name: "ICS Women's Society",
      email: "icswomen@example.edu.ph",
      phone: "+63 912 345 6789",
      position: "Student Organization"
    },
    submissionDate: "2025-02-15",
    proposedStartDate: "2025-06-01",
    proposedEndDate: "2025-09-30",
    eligibilityCriteria: "Female students majoring in Computer Science or Information Technology with at least a 2.5 GPA. Must demonstrate financial need and submit a personal essay on their career goals in tech.",
    fundDistribution: "50% for tuition fees, 30% for books and study materials, 20% for mentorship program expenses"
  };

  const handleApprove = () => {
    setToast({ 
      type: 'success', 
      message: `${project.title} has been approved!` 
    });
    
    // In a real app, you would submit to backend here
    // After approval, redirect back to projects page after a short delay
    setTimeout(() => {
      router.push('/admin/projects');
    }, 2000);
  };

  const handleDecline = () => {
    setToast({ 
      type: 'fail', 
      message: `${project.title} has been declined!` 
    });
    
    // In a real app, you would submit to backend here
    // After declining, redirect back to projects page after a short delay
    setTimeout(() => {
      router.push('/admin/projects');
    }, 2000);
  };

  return (
    <div className="bg-astradirtywhite min-h-screen pb-12">
      {toast && (
        <ToastNotification 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="relative h-64">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 text-astrawhite">
            <GoBackButton />
            <h1 className="font-h1 mt-4">{project.title}</h1>
            <div className="flex items-center mt-2">
              <div className="bg-astrawhite text-astradark px-3 py-1 rounded-lg text-sm font-s flex items-center gap-1">
                {project.type === "Scholarship" ? (
                  <GraduationCap className="w-4 h-4" />
                ) : (
                  <HeartHandshake className="w-4 h-4" />
                )}
                {project.type}
              </div>
              
              <div className="ml-4 flex items-center gap-1 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Submitted: {new Date(project.submissionDate).toLocaleDateString('en-PH')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Project details */}
        <div className="lg:col-span-2 bg-astrawhite p-6 rounded-xl shadow">
          <h2 className="font-lb text-xl mb-4">Project Details</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-sb text-lg">Description</h3>
              <p className="mt-2 text-astradarkgray">{project.longDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-2 items-start">
                <Goal className="w-5 h-5 text-astraprimary mt-1" />
                <div>
                  <p className="font-sb">Funding Goal</p>
                  <p className="text-astradarkgray">{project.goal}</p>
                </div>
              </div>
              
              <div className="flex gap-2 items-start">
                <Calendar className="w-5 h-5 text-astraprimary mt-1" />
                <div>
                  <p className="font-sb">Project Duration</p>
                  <p className="text-astradarkgray">
                    {new Date(project.proposedStartDate).toLocaleDateString('en-PH')} to {new Date(project.proposedEndDate).toLocaleDateString('en-PH')}
                  </p>
                </div>
              </div>
            </div>
            
            {project.type === "Scholarship" && (
              <>
                <div>
                  <h3 className="font-sb text-lg">Eligibility Criteria</h3>
                  <p className="mt-2 text-astradarkgray">{project.eligibilityCriteria}</p>
                </div>
                
                <div>
                  <h3 className="font-sb text-lg">Fund Distribution</h3>
                  <p className="mt-2 text-astradarkgray">{project.fundDistribution}</p>
                </div>
              </>
            )}
            
            {project.type === "Fundraiser" && (
              <div>
                <h3 className="font-sb text-lg">Fund Utilization</h3>
                <p className="mt-2 text-astradarkgray">{project.fundDistribution}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Requester information and actions */}
        <div className="space-y-6">
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Requester Information</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2 items-start">
                <User className="w-5 h-5 text-astraprimary mt-1" />
                <div>
                  <p className="font-sb">Name</p>
                  <p className="text-astradarkgray">{project.requester.name}</p>
                  <p className="text-astragray text-sm">{project.requester.position}</p>
                </div>
              </div>
              
              <div className="flex gap-2 items-start">
                <Mail className="w-5 h-5 text-astraprimary mt-1" />
                <div>
                  <p className="font-sb">Email</p>
                  <p className="text-astradarkgray">{project.requester.email}</p>
                </div>
              </div>
              
              <div className="flex gap-2 items-start">
                <Phone className="w-5 h-5 text-astraprimary mt-1" />
                <div>
                  <p className="font-sb">Phone</p>
                  <p className="text-astradarkgray">{project.requester.phone}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Actions</h2>
            
            <div className="space-y-4">
              <ActionButton 
                label="Approve Project" 
                onClick={handleApprove} 
                color="success" 
                fullWidth={true}
              />
              
              <ActionButton 
                label="Decline Project" 
                onClick={handleDecline} 
                color="danger" 
                fullWidth={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}