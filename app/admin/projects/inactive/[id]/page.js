"use client"
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { GoBackButton, ActionButton } from "@/components/Buttons";
import { GraduationCap, HeartHandshake, Calendar, User, Goal, FileText, Phone, Mail, Share2, Users, MessageSquare } from "lucide-react";
import ToastNotification from '@/components/ToastNotification';
import Link from "next/link";

//for admin/projects/inactive/[id]
export default function InactiveProjectDetail({ params }) {
  //fix the params.id error by unwrapping with use()
  const id = use(params).id;
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState("");
  
  //dummy data
  const project = {
    id: id,
    title: "Research Excellence Scholarship",
    type: "Scholarship",
    image: "/projects/assets/Donation.jpg",
    description: "Supporting promising students in their final year research projects with funding for equipment, materials, and conference attendance.",
    longDescription: "The Research Excellence Scholarship was created to support exceptional students in their final year of study who are working on innovative research projects in computer science and information technology. Recipients received funding to cover the costs of specialized equipment, research materials, data access, and travel expenses for presenting their work at academic conferences. The scholarship committee selected candidates based on the originality and potential impact of their research proposals, academic performance, and faculty recommendations. By providing this support, we helped nurture the next generation of researchers and innovators in the field.",
    goal: "₱250,000",
    raised: "₱175,000",
    donors: 12,
    requester: {
      name: "Mr. John Paul Minoc",
      email: "ecruz@example.edu.ph",
      phone: "+63 915 678 9012",
      position: "Faculty Member"
    },
    submissionDate: "2024-07-15",
    startDate: "2024-08-01",
    endDate: "2024-12-31",
    eligibilityCriteria: "Final year undergraduate or graduate students pursuing degrees in Computer Science or related fields. Must have a research proposal approved by a faculty advisor and maintain at least a 2.0 GPA.",
    fundDistribution: "60% for equipment and materials, 25% for conference travel, 15% for publication fees",
    transactions: [
      { id: 1, donor: "Computer Systems Corporation", amount: "₱50,000", date: "2024-08-12" },
      { id: 2, donor: "ICS Alumni Fund", amount: "₱75,000", date: "2024-09-05" },
      { id: 3, donor: "Anonymous", amount: "₱10,000", date: "2024-09-17" },
      { id: 4, donor: "Dr. Antonio Reyes", amount: "₱15,000", date: "2024-10-02" },
      { id: 5, donor: "Tech Research Foundation", amount: "₱25,000", date: "2024-11-10" },
      { id: 6, donor: "Tech Research Foundation", amount: "₱25,000", date: "2024-11-10" },
      { id: 7, donor: "Tech Research Foundation", amount: "₱25,000", date: "2024-11-10" },
      { id: 8, donor: "Tech Research Foundation", amount: "₱25,000", date: "2024-11-10" },
      { id: 9, donor: "Tech Research Foundation", amount: "₱25,000", date: "2024-11-10" },
      { id: 10, donor: "Tech Research Foundation", amount: "₱25,000", date: "2024-11-10" },
      { id: 11, donor: "Tech Research Foundation", amount: "₱25,000", date: "2024-11-10" },
      { id: 12, donor: "Tech Research Foundation", amount: "₱25,000", date: "2024-11-10" },
    ]
  };

  //for progress bar percentage
  const goalValue = parseInt(project.goal.replace(/[^0-9]/g, ''));
  const raisedValue = parseInt(project.raised.replace(/[^0-9]/g, ''));
  const progressPercentage = Math.min(Math.round((raisedValue / goalValue) * 100), 100);
  
  //progress bar color based on percentage
  let progressColor = "bg-astraprimary";
  if (progressPercentage >= 100) {
    progressColor = "bg-green-500";
  } else if (progressPercentage >= 75) {
    progressColor = "bg-yellow-500";
  } else if (progressPercentage >= 50) {
    progressColor = "bg-orange-500";
  } else if (progressPercentage >= 25) {
    progressColor = "bg-red-500";
  }

  //handle share button click
  //placeholder
  const handleShare = () => {
    setToast({ 
      type: 'success', 
      message: 'Share link copied to clipboard!' 
    });
  };

  //handle send message button click
  //placeholder
  const handleSendMessage = () => {
    // In a real app, you would send this message to the backend
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

      {/* Project image and title section */}
      <div className="relative h-64">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 text-astrawhite w-full">
            <div className="flex items-center mt-4">
              <h1 className="font-h1 text-astrawhite text-shadow shadow-black">{project.title}</h1>
              <span className="ml-4 bg-astrared text-astrawhite px-3 py-1 rounded-lg font-sb">Inactive</span>
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
                <span>Ended: {new Date(project.endDate).toLocaleDateString('en-PH')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <GoBackButton />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Project details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress section */}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <div className="flex justify-between items-end mb-2">
              <h2 className="font-lb text-xl">Final Results</h2>
              <div className="text-right">
                <div className="text-2xl font-lb">{project.raised}</div>
                <div className="text-astradarkgray text-sm">of {project.goal} goal</div>
              </div>
            </div>
            
            <div className="h-3 bg-astralightgray rounded-full overflow-hidden">
              <div 
                className={`h-full ${progressColor}`} 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between mt-4 text-astradarkgray">
              <div className="flex items-center gap-1">
                <Users className="w-5 h-5" />
                <span>{project.donors} donors</span>
              </div>
              <div>{progressPercentage}% of goal</div>
            </div>
          </div>
          
          {/* Description section */}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Project Details</h2>
            
            <div className="space-y-6">
              <div>
                <p className="mt-2 text-astradarkgray text-justify">{project.longDescription}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-2 items-start">
                  <Goal className="w-8 h-8  text-astraprimary mt-1" />
                  <div>
                    <p className="font-sb">Funding Goal</p>
                    <p className="text-astradarkgray">{project.goal}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 items-start">
                  <Calendar className="w-8 h-8  text-astraprimary mt-1" />
                  <div>
                    <p className="font-sb">Project Duration</p>
                    <p className="text-astradarkgray">
                      {new Date(project.startDate).toLocaleDateString('en-PH')} to {new Date(project.endDate).toLocaleDateString('en-PH')}
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
          
          {/* Transactions section - Improved */}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Transactions</h2>
            
            <div className="max-h-80 overflow-y-auto custom-scrollbar rounded-lg border border-astralightgray/50">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-astralightgray">
                  <tr>
                    <th className="py-3 px-4 text-left font-sb">Donor</th>
                    <th className="py-3 px-4 text-right font-sb">Amount</th>
                    <th className="py-3 px-4 text-right font-sb">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-astralightgray/50">
                  {project.transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-astralightgray/10 transition-colors">
                      <td className="py-3 px-4">{transaction.donor}</td>
                      <td className="py-3 px-4 text-right font-sb text-astraprimary">{transaction.amount}</td>
                      <td className="py-3 px-4 text-right text-astradarkgray">{new Date(transaction.date).toLocaleDateString('en-PH')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-astralightgray/30 border-t-2 border-astralightgray">
                    <td className="py-3 px-4 font-sb">Total</td>
                    <td className="py-3 px-4 text-right font-sb text-astraprimary">{project.raised}</td>
                    <td className="py-3 px-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        {/* Right column - Requester information and archive notice - Now sticky */}
        <div className="space-y-6 lg:sticky lg:top-24 self-start">
          {/* Requester information */}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Project Organizer</h2>
            
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
          
          {/* Archive notice */}
          <div className="bg-yellow-50 p-6 rounded-xl shadow border border-yellow-200">
            <h2 className="font-lb text-xl mb-2 text-yellow-800">Archived Project</h2>
            <p className="text-yellow-700 mb-4">
              This project has ended and is now archived. Changes cannot be made to inactive projects.
            </p>
            
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors font-s"
            >
              <Share2 className="w-5 h-5" />
              Share Project
            </button>
          </div>
        </div>
      </div>
      
      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-astrawhite rounded-xl p-6 max-w-lg w-full">
            <h3 className="font-lb text-xl mb-4">Contact {project.requester.name}</h3>
            
            <div className="mb-4">
              <label className="block text-astradarkgray font-sb mb-2">
                Message
              </label>
              <textarea 
                className="w-full border border-astragray/30 rounded-lg p-4 min-h-32"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex gap-4 justify-end">
              <button 
                className="px-6 py-2 bg-astralightgray border border-astragray/30 rounded-lg font-sb"
                onClick={() => setShowContactModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2 bg-astraprimary text-astrawhite rounded-lg font-sb disabled:bg-astragray/50"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add a style for custom scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }
      `}</style>
    </div>
  );
}