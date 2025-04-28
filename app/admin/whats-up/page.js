"use client"
import { useState } from "react";
import { TableHeader, PageTool } from '@/components/TableBuilder';
import { Filter, Plus } from "lucide-react";
import { useTab } from '@/components/TabContext';
import ToastNotification from "@/components/ToastNotification";
import { useRouter } from "next/navigation";

export default function CommunicationPage() {
    const router = useRouter();
    const { currTab, info } = useTab();
    const [toast, setToast] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [tempSelectedType, setTempSelectedType] = useState(selectedType);

    // Pagination state
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);

    // Filter announcements
    const filteredAnnouncements = announcements.filter((announcement) => {
        const matchesType = selectedType === "All" || announcement.type === selectedType;
        const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    // Calculate pagination
    const totalItems = filteredAnnouncements.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredAnnouncements.slice(startIndex, endIndex);

    const pagination = {
        display: [startIndex + 1, Math.min(endIndex, totalItems)],
        currPage: currentPage,
        lastPage: totalPages,
        numToShow: itemsPerPage,
        total: totalItems
    };

    return (
        <div>
            {/* Filter Modal */}
            {showFilter && (
                <div
                    onClick={() => setShowFilter(false)}     
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                >
                    <div onClick={e => e.stopPropagation()} className="bg-astrawhite p-8 rounded-xl w-80">
                      <h3 className="font-lb text-xl mb-4">Filter Announcements</h3>
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="font-s text-astradarkgray mb-2 block">
                            Announcement Type
                          </label>
                          <select
                            className="w-full p-2 border border-astragray rounded-lg"
                            value={tempSelectedType}
                            onChange={(e) => setTempSelectedType(e.target.value)}
                          >
                            <option value="All">All Announcements</option>
                            <option value="Event">Events</option>
                            <option value="News">News</option>
                            <option value="Update">Updates</option>
                          </select>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                          <button className="gray-button" onClick={() => setShowFilter(false)}>
                            Cancel
                          </button>
                          <button
                            className="blue-button"
                            onClick={() => {
                              setSelectedType(tempSelectedType);
                              setShowFilter(false);
                            }}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                </div>
            )}

            {toast && (
                <ToastNotification
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
                <div className='flex flex-col py-4 px-1 md:px-4 lg:px-8'>
                    {/* Search and Controls */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <span className="text-astradarkgray">
                                Displaying {pagination.display[0]}-{pagination.display[1]} of {pagination.total}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search announcements..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-astragray rounded-lg w-64"
                                />
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-astradarkgray" width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button
                                onClick={() => setShowFilter(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-astragray rounded-lg"
                            >
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                            <button
                                onClick={() => router.push('/admin/whats-up/create')}
                                className="flex items-center gap-2 px-4 py-2 text-white bg-astraprimary rounded-lg"
                            >
                                <Plus className="w-4 h-4" />
                                Add New
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {currTab === 'Announcements' && (
                        <div className="bg-astrawhite p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentItems.map((announcement) => (
                                <div key={announcement.id} className="relative h-100 w-120 rounded-lg overflow-hidden shadow-lg">
                                    {/* Background Image */}
                                    <img
                                        src={announcement.image}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Overlay Container: Slightly Below Image */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-astraprimary to-astrasecondary text-astrawhite p-6 rounded-t-lg min-h-64 flex flex-col justify-end">
                                        <h1 className="text-base font-extrabold text-astrawhite">{announcement.title}</h1>
                                        <div className="flex items-center gap-2">
                                            {/* Font Awesome Calendar Icon */}
                                            <i className="fas fa-calendar-alt text-astrawhite text-sm"></i>
                                            <span className="text-sm text-astrawhite">{announcement.datePublished}</span>
                                        </div>
                                        <p className="text-sm text-astragray-300">{announcement.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {currTab === 'Newsletters' && (
                        <h1 className="font-h2 bg-astrawhite p-6 justify-center flex">
                            Put your Newsletters content here
                        </h1>
                    )}

                    {/* Pagination */}
                    <PageTool 
                        pagination={pagination}
                        setPagination={(newPagination) => {
                            setCurrentPage(newPagination.currPage);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

const announcements = [
    {
        id: 1,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Upcoming Hackathon 2025",
        datePublished: "2025-04-25",
        description: "Join us for the annual coding competition! Register now and showcase your skills in software development."
    },
    {
        id: 2,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Alumni Networking Event",
        datePublished: "2025-05-10",
        description: "Reconnect with fellow alumni and industry leaders at our exclusive networking event. Reserve your spot today!"
    },
    {
        id: 3,
        image: "/whats-up/assets/Announcement.jpg",
        title: "AI & Machine Learning Course",
        datePublished: "2025-06-01",
        description: "Our university is launching a new course on AI & Machine Learning! Enroll to stay ahead in the tech industry."
    },
    {
        id: 4,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Graduation Ceremony 2025",
        datePublished: "2025-07-15",
        description: "Celebrate the achievements of our graduates! The commencement ceremony will be held at the university auditorium."
    },
    {
        id: 5,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Scholarship Applications Open",
        datePublished: "2025-08-05",
        description: "Apply now for merit-based scholarships and financial aid opportunities available to eligible students."
    },
    {
      id: 6,
      image: "/whats-up/assets/Announcement.jpg",
      title: "Scholarship Applications Open",
      datePublished: "2025-08-05",
      description: "Apply now for merit-based scholarships and financial aid opportunities available to eligible students."
  },
  {
    id: 7,
    image: "/whats-up/assets/Announcement.jpg",
    title: "Scholarship Applications Open",
    datePublished: "2025-08-05",
    description: "Apply now for merit-based scholarships and financial aid opportunities available to eligible students."
},
{
  id: 8,
  image: "/whats-up/assets/Announcement.jpg",
  title: "Scholarship Applications Open",
  datePublished: "2025-08-05",
  description: "Apply now for merit-based scholarships and financial aid opportunities available to eligible students."
},
{
  id: 9,
  image: "/whats-up/assets/Announcement.jpg",
  title: "Scholarship Applications Open",
  datePublished: "2025-08-05",
  description: "Apply now for merit-based scholarships and financial aid opportunities available to eligible students."
},
{
  id: 10,
  image: "/whats-up/assets/Announcement.jpg",
  title: "Scholarship Applications Open",
  datePublished: "2025-08-05",
  description: "Apply now for merit-based scholarships and financial aid opportunities available to eligible students."
},
];
