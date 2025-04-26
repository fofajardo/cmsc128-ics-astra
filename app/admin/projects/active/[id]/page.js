"use client"
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { GoBackButton, ActionButton } from "@/components/Buttons";
import { GraduationCap, HeartHandshake, Calendar, User, Goal, FileText, Phone, Mail, Share2, Edit, Trash2, Users, MessageSquare } from "lucide-react";
import ToastNotification from '@/components/ToastNotification';
import Link from "next/link";

//for admin/projects/active/[id]
export default function ActiveProjectDetail({ params }) {
  const id = use(params).id;
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState("");
  
//dummy data
  const project = {
    id: id,
    title: "Computer Science Scholarship Fund",
    type: "Scholarship",
    image: "/projects/assets/Donation.jpg",
    description: "Supporting underprivileged students pursuing Computer Science degrees with full tuition coverage and stipend for books and materials.",
    longDescription: "This scholarship aims to provide comprehensive financial support to academically gifted but financially challenged students who wish to pursue a degree in Computer Science. Selected recipients will receive full tuition coverage, a monthly stipend for living expenses, and additional allowances for books, materials, and technology requirements. The scholarship committee will select candidates based on academic excellence, demonstrated financial need, and a passion for computing. By removing financial barriers, we hope to enable talented students to focus on their studies and achieve their full potential in the field of computer science.",
    goal: "₱500,000",
    raised: "₱480,000",
    donors: 45,
    requester: {
      name: "Prof. Maria Santos",
      email: "msantos@example.edu.ph",
      phone: "+63 912 345 6789",
      position: "Faculty Member"
    },
    submissionDate: "2024-12-05",
    startDate: "2025-01-15",
    endDate: "2025-12-31",
    eligibilityCriteria: "Undergraduate students majoring in Computer Science with at least a 2.0 GPA. Must demonstrate financial need and submit a personal statement about their interest in computer science.",
    fundDistribution: "75% for tuition fees, 15% for books and study materials, 10% for stipend",
    transactions: [
      { id: 1, donor: "Anonymous", amount: "₱25,000", date: "2025-01-20" },
      { id: 2, donor: "Juan Dela Cruz", amount: "₱15,000", date: "2025-01-25" },
      { id: 3, donor: "ICS Alumni Association", amount: "₱100,000", date: "2025-02-05" },
      { id: 4, donor: "Tech Company Inc.", amount: "₱150,000", date: "2025-02-28" },
      { id: 5, donor: "Anonymous", amount: "₱10,000", date: "2025-03-10" },
      { id: 6, donor: "Maria Reyes", amount: "₱50,000", date: "2025-03-22" },
      { id: 7, donor: "Maria Reyes", amount: "₱50,000", date: "2025-03-22" },
      { id: 8, donor: "Maria Reyes", amount: "₱50,000", date: "2025-03-22" },
      { id: 9, donor: "Maria Reyes", amount: "₱50,000", date: "2025-03-22" },
    ]
  };

  //for progress bar
  const goalValue = parseInt(project.goal.replace(/[^0-9]/g, ''));
  const raisedValue = parseInt(project.raised.replace(/[^0-9]/g, ''));
  const progressPercentage = Math.min(Math.round((raisedValue / goalValue) * 100), 100);
  
  //determine progress bar color based on percentage
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

  //demo purposes only, does nothing
  //connect to backend to get project url
  const handleShare = () => {
    setToast({ 
      type: 'success', 
      message: 'Share link copied to clipboard!' 
    });
  };

  //demo purposes only, does nothing
  //connect to backend
  const handleEdit = () => {
    setToast({ 
      type: 'success', 
      message: 'Edit functionality would open here!' 
    });
  };

  //show the delete modal
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  //demo purposes only, does nothing
  //connect to backend to delete
  const confirmDelete = () => {
    setShowDeleteModal(false);
    
    setToast({ 
      type: 'success', 
      message: `${project.title} has been deleted!` 
    });
    setTimeout(() => {
      router.push('/admin/projects');
    }, 2000);
  };

  //demo purposes only, does nothing
  //only shows the modal, need to connect to backend
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
      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-astrawhite p-6 rounded-xl w-96 max-w-full mx-4">
            <h3 className="font-lb text-xl mb-2">Confirm Deletion</h3>
            <p className="text-astradarkgray mb-6">
              Are you sure you want to delete "{project.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 text-astrawhite bg-astrablack rounded-lg hover:bg-astradarkgray transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
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
              <span className="ml-4 bg-green-500 text-astrawhite px-3 py-1 rounded-lg font-sb">Active</span>
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
                <span>Ends: {new Date(project.endDate).toLocaleDateString('en-PH')}</span>
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
              <h2 className="font-lb text-xl">Fundraising Progress</h2>
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
          
          {/* Transactions section*/}
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
        
        {/* Right column - Requester information and actions*/}
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
          
          {/* Actions*/}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Actions</h2>
            
            <div className="space-y-4">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-astragray text-astradark rounded-lg hover:bg-astragray transition-colors font-s"
              >
                <Share2 className="w-5 h-5" />
                Share Project
              </button>
              
              <button
                onClick={handleEdit}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-s"
              >
                <Edit className="w-5 h-5" />
                Edit Project
              </button>
              
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-s"
              >
                <Trash2 className="w-5 h-5" />
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>
      
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