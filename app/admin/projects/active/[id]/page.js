"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoBackButton, ActionButton } from "@/components/Buttons";
import { GraduationCap, HeartHandshake, Calendar, User, Goal, FileText, Phone, Mail, Share2, Edit, Trash2, Users } from "lucide-react";
import ToastNotification from '@/components/ToastNotification';
import Link from "next/link";

// This would be in your app/admin/projects/active/[id]/page.js file
export default function ActiveProjectDetail({ params }) {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // In a real app, you'd fetch this data based on the params.id
  // For demo purposes, we're using a hardcoded project
  const project = {
    id: params.id,
    title: "Computer Science Scholarship Fund",
    type: "Scholarship",
    image: "/api/placeholder/800/400",
    description: "Supporting underprivileged students pursuing Computer Science degrees with full tuition coverage and stipend for books and materials.",
    longDescription: "This scholarship aims to provide comprehensive financial support to academically gifted but financially challenged students who wish to pursue a degree in Computer Science. Selected recipients will receive full tuition coverage, a monthly stipend for living expenses, and additional allowances for books, materials, and technology requirements. The scholarship committee will select candidates based on academic excellence, demonstrated financial need, and a passion for computing. By removing financial barriers, we hope to enable talented students to focus on their studies and achieve their full potential in the field of computer science.",
    goal: "₱500,000",
    raised: "₱350,000",
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
    ]
  };

  // Calculate progress percentage
  const goalValue = parseInt(project.goal.replace(/[^0-9]/g, ''));
  const raisedValue = parseInt(project.raised.replace(/[^0-9]/g, ''));
  const progressPercentage = Math.min(Math.round((raisedValue / goalValue) * 100), 100);
  
  // Determine progress bar color based on percentage
  let progressColor = "bg-astraprimary";
  if (progressPercentage >= 100) {
    progressColor = "bg-green-500";
  } else if (progressPercentage >= 75) {
    progressColor = "bg-blue-400";
  } else if (progressPercentage >= 50) {
    progressColor = "bg-blue-300";
  }

  const handleShare = () => {
    // In a real app, you'd implement sharing functionality
    // For demo purposes, we'll just show a toast
    setToast({ 
      type: 'success', 
      message: 'Share link copied to clipboard!' 
    });
  };

  const handleEdit = () => {
    // In a real app, you'd redirect to an edit page
    // For demo purposes, we'll just show a toast
    setToast({ 
      type: 'success', 
      message: 'Edit functionality would open here!' 
    });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real app, you'd submit to backend here
    setShowDeleteModal(false);
    
    setToast({ 
      type: 'success', 
      message: `${project.title} has been deleted!` 
    });
    
    // After deletion, redirect back to projects page after a short delay
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
                className="px-4 py-2 text-astradarkgray bg-astralightgray rounded-lg hover:bg-astragray transition-colors"
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
      
      <div className="relative h-64">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 text-astrawhite w-full">
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
                <span>Ends: {new Date(project.endDate).toLocaleDateString('en-PH')}</span>
              </div>
            </div>
          </div>
        </div>
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
          
          {/* Transactions section */}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Transactions</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-astralightgray">
                    <th className="py-3 px-4 text-left font-sb">Donor</th>
                    <th className="py-3 px-4 text-right font-sb">Amount</th>
                    <th className="py-3 px-4 text-right font-sb">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {project.transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-astralightgray">
                      <td className="py-3 px-4">{transaction.donor}</td>
                      <td className="py-3 px-4 text-right">{transaction.amount}</td>
                      <td className="py-3 px-4 text-right">{new Date(transaction.date).toLocaleDateString('en-PH')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-astralightgray">
                    <td className="py-3 px-4 font-sb">Total</td>
                    <td className="py-3 px-4 text-right font-sb">{project.raised}</td>
                    <td className="py-3 px-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        {/* Right column - Requester information and actions */}
        <div className="space-y-6">
          {/* Requester information */}
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
          
          {/* Actions */}
          <div className="bg-astrawhite p-6 rounded-xl shadow">
            <h2 className="font-lb text-xl mb-4">Actions</h2>
            
            <div className="space-y-4">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-astralightgray text-astradark rounded-lg hover:bg-astragray transition-colors font-s"
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
    </div>
  );
}