"use client"
import { useState } from "react";
import { TableHeader, PageTool } from '@/components/TableBuilder';
import { Filter, Plus, Trash2, Edit2 } from "lucide-react";
import { useTab } from '@/components/TabContext';
import ToastNotification from "@/components/ToastNotification";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CommunicationPage() {
    const router = useRouter();
    const { currTab, info } = useTab();
    const [toast, setToast] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [tempSelectedType, setTempSelectedType] = useState(selectedType);

    // Pagination state with limit
    const paginationOptions = [9, 12, 15, 18, 21];
    const [itemsPerPage, setItemsPerPage] = useState(9);
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
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = filteredAnnouncements.slice(startIndex, endIndex);

    const pagination = {
        display: [startIndex + 1, Math.min(endIndex, totalItems)],
        currPage: currentPage,
        lastPage: totalPages,
        numToShow: itemsPerPage,
        total: totalItems
    };

    const handleDeleteNewsletter = (index, e) => {
        e.preventDefault(); // Prevent PDF from opening
        e.stopPropagation(); // Prevent event bubbling
        setToast({ type: "success", message: "Newsletter deleted successfully" });
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

            <div className="bg-astradirtywhite w-full px-2 py-4 md:px-6 lg:px-12 flex flex-col">
                <div className='flex flex-col py-2 px-1 md:px-2 lg:px-4'>
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
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    setItemsPerPage(newValue);
                                    setCurrentPage(1); // Reset to first page when changing items per page
                                }}
                                className="px-3 py-2 border border-astragray rounded-lg bg-white text-astradarkgray"
                            >
                                {paginationOptions.map(option => (
                                    <option key={option} value={option}>
                                       {option}
                                    </option>
                                ))}
                            </select>
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
                        <div className="bg-astrawhite p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 auto-rows-fr">
                            {currentItems.map((announcement) => (
                                <div key={announcement.id} className="group relative">
                                    <Link 
                                        href={`/admin/whats-up/announcements/${announcement.id}`}
                                    >
                                        <div 
                                            className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                        >
                                            <img
                                                src={announcement.image}
                                                className="w-full h-full object-cover"
                                                alt={announcement.title}
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-astraprimary to-transparent/0 text-astrawhite p-4">
                                                <h1 className="text-lg font-bold text-astrawhite line-clamp-1">
                                                    {announcement.title}
                                                </h1>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <i className="fas fa-calendar-alt text-astrawhite text-sm"></i>
                                                    <span className="text-sm text-astrawhite/90">
                                                        {announcement.datePublished}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-astrawhite/80 mt-2 line-clamp-2">
                                                    {announcement.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => router.push(`/admin/whats-up/announcements/${announcement.id}`)}
                                        className="absolute top-2 right-2 p-2 bg-astraprimary text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-astradark"
                                        title="Edit announcement"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {currTab === 'Newsletters' && (
                        <div className="bg-astrawhite p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {Array(12).fill().map((_, index) => (
                                    <Link 
                                        href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                                        key={index}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative"
                                    >
                                        <div className="aspect-[3/4] relative bg-black rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                            <img
                                                src="https://marketplace.canva.com/EAGWT7FdhOk/1/0/1131w/canva-black-and-grey-modern-business-company-email-newsletter-R_dH5ll-SAs.jpg"
                                                alt={`Volume ${index + 1}`}
                                                className="w-full h-full object-cover opacity-90"
                                            />
                                            <div className="absolute inset-0 bg-astradarkgray/50 group-hover:bg-astradarkgray/70 transition-colors" />
                                            
                                            {/* Delete Button */}
                                            <button
                                                onClick={(e) => handleDeleteNewsletter(index, e)}
                                                className="absolute top-2 right-2 p-2 bg-astrared text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-astrared/90"
                                                title="Delete newsletter"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                                <h3 className="text-astrawhite font-rb text-lg mb-1">
                                                    Volume {index + 1}
                                                </h3>
                                                <p className="text-astrawhite/80 font-s">
                                                    Newsletter.pdf
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <PageTool 
                                pagination={pagination}
                                setPagination={(newPagination) => {
                                    setCurrentPage(newPagination.currPage);
                                }}
                            />
                        </div>
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
        description: "Join us for the annual coding competition! Register now and showcase your skills in software development.",
        type: "Event"
    },
    {
        id: 2,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Alumni Networking Event",
        datePublished: "2025-05-10",
        description: "Reconnect with fellow alumni and industry leaders at our exclusive networking event. Reserve your spot today!",
        type: "Event"
    },
    {
        id: 3,
        image: "/whats-up/assets/Announcement.jpg",
        title: "AI & Machine Learning Course",
        datePublished: "2025-06-01",
        description: "Our university is launching a new course on AI & Machine Learning! Enroll to stay ahead in the tech industry.",
        type: "Update"
    },
    {
        id: 4,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Graduation Ceremony 2025",
        datePublished: "2025-07-15",
        description: "Celebrate the achievements of our graduates! The commencement ceremony will be held at the university auditorium.",
        type: "Event"
    },
    {
        id: 5,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Scholarship Applications Open",
        datePublished: "2025-08-05",
        description: "Apply now for merit-based scholarships and financial aid opportunities available to eligible students.",
        type: "Update"
    },
    {
        id: 6,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Scholarship Applications Open",
        datePublished: "2025-08-05",
        description: "Apply now for merit-based scholarships and financial aid opportunities available to eligible students.",
        type: "Update"
    },
    {
        id: 7,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Scholarship Applications Open",
        datePublished: "2025-08-05",
        description: "Apply now for merit-based scholarships and financial aid opportunities available to eligible students.",
        type: "Update"
    },
    {
        id: 8,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Scholarship Applications Open",
        datePublished: "2025-08-05",
        description: "Apply now for merit-based scholarships and financial aid opportunities available to eligible students.",
        type: "Update"
    },
    {
        id: 9,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Scholarship Applications Open",
        datePublished: "2025-08-05",
        description: "Apply now for merit-based scholarships and financial aid opportunities available to eligible students.",
        type: "Update"
    },
    {
        id: 10,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Scholarship Applications Open",
        datePublished: "2025-08-05",
        description: "Apply now for merit-based scholarships and financial aid opportunities available to eligible students.",
        type: "Update"
    },
    {
        id: 11,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Research Symposium 2025",
        datePublished: "2025-09-01",
        description: "Present your research at our annual symposium. Open for submissions in various computer science domains.",
        type: "Event"
    },
    {
        id: 12,
        image: "/whats-up/assets/Announcement.jpg",
        title: "New Computer Lab Opening",
        datePublished: "2025-09-15",
        description: "State-of-the-art facilities featuring the latest hardware and software for students.",
        type: "News"
    },
    {
        id: 13,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Industry Partnership Program",
        datePublished: "2025-09-20",
        description: "New collaborations with leading tech companies offering internship opportunities.",
        type: "Update"
    },
    {
        id: 14,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Alumni Mentorship Program",
        datePublished: "2025-10-01",
        description: "Connect with experienced alumni mentors in your field of interest.",
        type: "Event"
    },
    {
        id: 15,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Programming Competition",
        datePublished: "2025-10-15",
        description: "Test your coding skills against fellow students. Attractive prizes to be won!",
        type: "Event"
    },
    {
        id: 16,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Software Engineering Workshop",
        datePublished: "2025-10-30",
        description: "Learn industry-standard practices and tools from experienced professionals.",
        type: "Event"
    },
    {
        id: 17,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Department Recognition Day",
        datePublished: "2025-11-05",
        description: "Celebrating outstanding achievements of students and faculty members.",
        type: "News"
    },
    {
        id: 18,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Curriculum Updates 2026",
        datePublished: "2025-11-15",
        description: "Important changes to course offerings and program requirements.",
        type: "Update"
    },
    {
        id: 19,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Tech Start-up Fair",
        datePublished: "2025-11-30",
        description: "Meet innovative start-ups and explore career opportunities.",
        type: "Event"
    },
    {
        id: 20,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Holiday Coding Camp",
        datePublished: "2025-12-10",
        description: "Join our winter break programming bootcamp for students.",
        type: "Event"
    },
    {
        id: 21,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Faculty Research Grants",
        datePublished: "2025-12-15",
        description: "New funding opportunities for research projects in computer science.",
        type: "News"
    },
    {
        id: 22,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Library System Upgrade",
        datePublished: "2025-12-20",
        description: "Enhanced digital resources and improved search functionality.",
        type: "Update"
    },
    {
        id: 23,
        image: "/whats-up/assets/Announcement.jpg",
        title: "New Year Tech Conference",
        datePublished: "2026-01-05",
        description: "Annual technology conference featuring keynote speakers from leading tech companies.",
        type: "Event"
    },
    {
        id: 24,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Student Excellence Awards",
        datePublished: "2026-01-15",
        description: "Recognizing outstanding academic and extracurricular achievements.",
        type: "News"
    },
    {
        id: 25,
        image: "/whats-up/assets/Announcement.jpg",
        title: "Spring Semester Updates",
        datePublished: "2026-01-20",
        description: "Important information about upcoming semester changes and events.",
        type: "Update"
    }
];
