"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TableHeader, Table, PageTool } from '@/components/TableBuilder';
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { useTab } from '@/components/TabContext';
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";
import NewsletterArchive from "@/components/NewsletterArchive";
import AddAnnouncementModal from "@/components/announcements/AddAnnouncementModal";

export default function AdminWhatsUpPage() {
  const router = useRouter();
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      title: "ICS Welcomes New Faculty Members",
      description: "The Institute of Computer Science is thrilled to welcome its newest faculty members...",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/7687333fb4bb4909a4eab75308bcf09b/950fa1cdac6430480b31ef36a44036380a994f87?placeholderIfAbsent=true",
      status: "published",
      publishDate: "2024-03-15",
      author: "Admin Team",
      category: "announcement",
      views: 245,
      engagement: {
        likes: 56,
        shares: 23,
        comments: 12
      }
    },
    {
      id: 2,
      title: "Alumni Achievement Spotlight",
      description: "Celebrating the outstanding accomplishments...",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/...",
      status: "draft",
      publishDate: null,
      author: "Communications Team",
      category: "spotlight",
      views: 0,
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
    // ...more items with same structure
  ]);

  // Add pagination state
  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: 10,
    numToShow: 10,
    total: 20 // Update this with actual total count
  });

  // Add toggleFilter function
  const toggleFilter = () => {
    // Add your filter logic here
    console.log("Toggle filter clicked");
  };

  const handleDelete = (id) => {
    // Add delete functionality
    console.log(`Deleting item ${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/admin/whats-up/edit/${id}`);
  };

  const handleItemClick = (id) => {
    router.push(`/admin/whats-up/article/${id}`);
  };

  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
      <div className='flex flex-col py-4 px-1 md:px-4 lg:px-8'>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="text-astradarkgray">Displaying entries 1-8 of 96 total</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a newsletter"
                className="pl-10 pr-4 py-2 border border-astragray rounded-lg w-64"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-astradarkgray" width="20" height="20" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-astraprimary rounded-lg hover:bg-astraprimary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleItemClick(item.id)}
            >
              <img 
                src={item.imageUrl}
                alt={item.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status === 'published' ? 'Posted' : 'Draft'}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-astradarkgray mb-4">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-sm text-astradarkgray">
                  <span>{item.publishDate}</span>
                  <div className="flex items-center gap-4">
                    <span>{item.views} views</span>
                    <span>{item.engagement.likes} likes</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>

        <AddAnnouncementModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
        />
      </div>
    </div>
  );
}
