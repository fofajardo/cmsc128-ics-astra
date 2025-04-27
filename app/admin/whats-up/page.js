"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TableHeader, Table, PageTool } from '../../../components/TableBuilder';
import { Plus, Edit, Trash2 } from "lucide-react";
import { useTab } from '../../../components/TabContext';
import ConfirmModal from "../../../components/ConfirmModal";
import ToastNotification from "../../../components/ToastNotification";

export default function AdminWhatsUpPage() {
  const router = useRouter();
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      title: "Institute announces new partnerships",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/...",
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

  const handleDelete = (id) => {
    // Add delete functionality
    console.log(`Deleting item ${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/admin/whats-up/edit/${id}`);
  };

  return (
    <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
      <div className='flex flex-col py-4 px-1 md:px-4 lg:px-8'>
        <TableHeader info={info} pagination={pagination} toggleFilter={toggleFilter} />
        
        {/* Admin Controls */}
        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={() => router.push('/admin/whats-up/create')}
            className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create {currTab === 'Newsletters' ? 'Newsletter' : 'News'}
          </button>
        </div>

        {/* Content based on current tab */}
        {currTab === 'Announcements' && (
          <div className="news-items-grid">
            <div className="flex flex-col gap-8 max-md:gap-6">
              {newsItems.map((item) => (
                <div key={item.id} className={`news-item ${animations.staggered} flex flex-row gap-6 bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 max-md:flex-col relative`}>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  {/* Image section */}
                  <div className="w-2/5 max-md:w-full">
                    <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full rounded-l-lg max-md:rounded-t-lg max-md:rounded-b-none" />
                  </div>

                  {/* Content section */}
                  <div className="w-3/5 p-6 flex flex-col justify-between max-md:w-full">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 max-md:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        By {item.author} • {item.publishDate || 'Draft'}
                      </p>
                      <p className="mt-3 text-base text-slate-500">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Engagement metrics */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-slate-600">
                        <span>{item.views} views</span>
                        <span>{item.engagement.likes} likes</span>
                        <span>{item.engagement.comments} comments</span>
                      </div>
                      
                      {/* Admin Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {currTab === 'Newsletters' && (
          <div className="newsletters-grid">
            <NewsletterArchive isAdmin={true} />
          </div>
        )}

        <PageTool pagination={pagination} setPagination={setPagination} />
      </div>
    </div>
  );
}
