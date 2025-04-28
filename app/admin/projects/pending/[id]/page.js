"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoBackButton, ActionButton } from "@/components/Buttons";
import { GraduationCap, HeartHandshake, Calendar, User, Goal, FileText, Phone, Mail, MessageSquare } from "lucide-react";
import ToastNotification from '@/components/ToastNotification';
import { use } from "react";

//admin/projects/pending/[id]
export default function PendingProjectDetail({ params }) {
  // Unwrap params with React.use()
  const id = use(params).id;
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState("");
  
  // In a real app, you'd fetch this data based on the id
  // For demo purposes, we're using a hardcoded project
  const project = {
    id: id,
    title: "Women in Tech Scholarship",
    type: "Scholarship",
    image: "/projects/assets/Donation.jpg",
    description: "Supporting female students pursuing degrees in computer science and information technology to increase representation in tech.",
    longDescription: "This scholarship aims to address the gender gap in technology fields by providing financial support to female students who demonstrate academic excellence and passion for computer science and IT. Recipients will receive funding for tuition, books, and have opportunities to connect with female mentors in the industry. The scholarship committee will select candidates based on academic merit, financial need, and demonstrated interest in pursuing a career in technology. By supporting this initiative, we hope to contribute to a more diverse and inclusive tech workforce in the future.",
    goal: "₱300,000",
    requester: {
      name: "Ma'am Mira Fanclub",
      email: "mirafanclub@email.com",
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
    
    //after approval, redirect back to projects page after a short delay
    setTimeout(() => {
      router.push('/admin/projects');
    }, 2000);
  };

  const handleDecline = () => {
    setToast({ 
      type: 'fail', 
      message: `${project.title} has been declined!` 
    });
    
    //after declining, redirect to projects page after a short delay
    setTimeout(() => {
      router.push('/admin/projects');
    }, 2000);
  };

  //function to handle message, to be integrated by backend
  //just shows a toast notification for now
  const handleSendMessage = () => {
    setToast({ 
      type: 'success', 
      message: 'Message sent successfully!' 
    });
    setShowContactModal(false);
    setMessage("");
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30 flex items-end">
          <div className="p-6 text-astrawhite w-full">
          <div className="flex items-center mt-4">
              <h1 className="font-h1 text-astrawhite text-shadow shadow-black">{project.title}</h1>
              <span className="ml-4 bg-yellow-500 text-astrawhite px-3 py-1 rounded-lg font-sb">Pending</span>
            </div>
            <div className="flex items-center mt-2">
              <div className="bg-astrawhite text-astradark px-3 py-1 rounded-lg text-sm font-s flex items-center gap-1">
                {project.type === "Scholarship" ? (
                  <GraduationCap className="w-4 h-4" />
                ) : (
                  <HeartHandshake className="w-4 h-4" />
                )}
                {project.type}
              </div>
              
              <div className="ml-4 bg-astrawhite text-astradark px-3 py-1 rounded-lg text-sm font-s flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Submitted: {new Date(project.submissionDate).toLocaleDateString('en-PH')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <GoBackButton />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Project details */}
        <div className="lg:col-span-2 bg-astrawhite p-6 rounded-xl shadow">
          <h2 className="font-lb text-xl mb-4">Project Details</h2>
          
          <div className="space-y-6">
            <div>
              <p className="mt-2 text-astradarkgray text-justify">{project.longDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-2 items-start">
                <Goal className="w-8 h-8 text-astraprimary mt-1" />
                <div>
                  <p className="font-sb">Funding Goal</p>
                  <p className="text-astradarkgray">{project.goal}</p>
                </div>
              </div>
              
              <div className="flex gap-2 items-start">
                <Calendar className="w-8 h-8 text-astraprimary mt-1" />
                <div>
                  <p className="font-sb">Project Duration</p>
                  <p className="text-astradarkgray">
                    {new Date(project.proposedStartDate).toLocaleDateString('en-PH')} to {new Date(project.proposedEndDate).toLocaleDateString('en-PH')}
                  </p>
                </div>
              </div>
            </div>
            {/*Conditional rendering based on project type, can be removed later if not necessary*/}
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
        <div className="space-y-6 lg:sticky lg:top-24 self-start">
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Requester Information</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2 items-start">
                <User className="w-10 h-10 text-astraprimary" />
                <div>
                  <p className="text-astradarkgray">{project.requester.name}</p>
                  <p className="text-astralightgray text-sm">{project.requester.position}</p>
                </div>
              </div>
              
              <div className="flex gap-2 items-start">
                <Mail className="w-6 h-6 text-astraprimary mr-2" />
                <div>
                  <p className="text-astradarkgray">{project.requester.email}</p>
                </div>
              </div>
              
              <div className="flex gap-2 items-start">
                <Phone className="w-6 h-6 text-astraprimary mr-2" />
                <div>
                  <p className="text-astradarkgray">{project.requester.phone}</p>
                </div>
              </div>
              
              <button 
                className="flex items-center gap-2 mt-4 bg-astraprimary text-astrawhite py-2 px-4 rounded-lg w-full justify-center font-sb transition-colors hover:bg-astraprimary/90"
                onClick={() => setShowContactModal(true)}
              >
                <MessageSquare className="w-5 h-5" />
                Contact
              </button>
            </div>
          </div>
          
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Actions</h2>
            
            <div className="flex flex-col space-y-4">
              <button 
                onClick={handleApprove}
                className="flex items-center justify-center gap-2 bg-astragreen text-astrawhite py-3 px-6 rounded-lg font-sb transition-colors hover:bg-astragreen/90 shadow-md"
              >
                Approve Project
              </button>
              
              <button 
                onClick={handleDecline}
                className="flex items-center justify-center gap-2 bg-astrared text-astrawhite py-3 px-6 rounded-lg font-sb transition-colors hover:bg-astrared/90 shadow-md"
              >
                Decline Project
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Modal */}
      {/* Contact Modal */}
      {showContactModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div className="bg-gradient-to-br from-white to-astrawhite rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp border border-white/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-astraprimary/90 to-astraprimary p-6 relative">
        <div className="absolute right-4 top-4">
          <button 
            onClick={() => setShowContactModal(false)} 
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-astraprimary shadow-md">
            {project.requester.profilePic ? (
              <img 
                src={project.requester.profilePic} 
                alt={project.requester.name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold">
                {project.requester.name.charAt(0)}
              </span>
            )} 
          </div>
          <div>
            <h3 className="font-lb text-xl text-white mb-1">Message {project.requester.name}</h3>
            <p className="text-white/70 text-sm">
              Typically responds within 24 hours
            </p>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-6">
        <div className="mb-5">
          <label className="block text-astradarkgray font-sb mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-astraprimary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Your Message
          </label>

          <div className="relative">
            <textarea 
              className="w-full border border-astragray/30 rounded-lg p-4 min-h-32 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white shadow-inner"
              placeholder="Introduce yourself and explain why you're reaching out..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-between mt-2 text-xs text-astragray">
            <p>Be professional and clear about your intent</p>
            <p className={`${message.length > 500 ? 'text-red-500 font-medium' : ''}`}>
              {message.length}/1000 characters
            </p>
          </div>
        </div>
        
        {/* Quick suggestions */}
        <div className="mb-5">
          <p className="text-sm text-astradarkgray mb-2">Quick replies:</p>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setMessage("Hi, I'm interested in learning more about this project. Could you share additional details?")}
              className="text-sm px-3 py-1 bg-astralightgray hover:bg-astragray/20 rounded-full text-astradarkgray transition-colors"
            >
              Request more info
            </button>
            <button 
              onClick={() => setMessage("Hello! I have similar experience and would love to collaborate on this project.")}
              className="text-sm px-3 py-1 bg-astralightgray hover:bg-astragray/20 rounded-full text-astradarkgray transition-colors"
            >
              Offer collaboration
            </button>
            <button 
              onClick={() => setMessage("Hi there! I'm impressed by this project and would like to connect to discuss potential opportunities.")}
              className="text-sm px-3 py-1 bg-astralightgray hover:bg-astragray/20 rounded-full text-astradarkgray transition-colors"
            >
              Network
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-6 bg-astralightgray/40 border-t border-astragray/10 flex justify-between items-center">
        <div className="text-sm text-astradarkgray">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Messages are monitored for community guidelines
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            className="px-6 py-2.5 bg-white border border-astragray/30 rounded-lg font-sb hover:bg-astragray/10 transition-colors"
            onClick={() => setShowContactModal(false)}
          >
            Cancel
          </button>
          <button 
            className={`px-6 py-2.5 rounded-lg font-sb flex items-center transition-all ${
              !message.trim() 
                ? 'bg-astragray/50 text-astradarkgray/50 cursor-not-allowed' 
                : 'bg-astraprimary text-astrawhite hover:bg-astraprimary/90 shadow-md shadow-astraprimary/20'
            }`}
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Send Message
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}