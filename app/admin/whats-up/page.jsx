"use client";
import { useState, useEffect } from "react";
import { TableHeader, PageTool } from "@/components/TableBuilder";
import { Filter, Plus, Trash2, Edit2 } from "lucide-react";
import { useTab } from "@/components/TabContext";
import ToastNotification from "@/components/ToastNotification";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function CommunicationPage() {
  const router = useRouter();
  const { currTab } = useTab();
  const [toast, setToast] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [tempSelectedType, setTempSelectedType] = useState("All");
  const [announcements, setAnnouncements] = useState([]);

  const [info, setInfo] = useState({
    title: currTab === "Newsletters" ? "Newsletters" : "Announcements",
    search: currTab === "Newsletters" ? "Search newsletters" : "Search announcements",
  });

  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: 1,
    numToShow: 12,
    total: 0
  });

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents`);
        if (response.data.status === "OK") {
          const list = response.data.list || response.data.data?.list || [];
          setAnnouncements(list);
        } else {
          console.error("Unexpected response format:", response.data);
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Failed to fetch contents:", error);
        setAnnouncements([]);
      }
    };

    fetchContents();
  }, []);

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesType = selectedType === "All" || announcement.type === selectedType;
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  useEffect(() => {
    const total = filteredAnnouncements.length;
    const lastPage = Math.ceil(total / pagination.numToShow) || 1;
    const validCurrPage = Math.min(pagination.currPage, lastPage);
    const startIndex = (validCurrPage - 1) * pagination.numToShow;
    const endIndex = Math.min(startIndex + pagination.numToShow, total);

    setPagination((prev) => ({
      ...prev,
      currPage: validCurrPage,
      total: total,
      lastPage: lastPage,
      display: [total > 0 ? startIndex + 1 : 0, endIndex],
    }));
  }, [filteredAnnouncements.length, pagination.currPage, pagination.numToShow]);

  const currentItems = filteredAnnouncements.slice(
    (pagination.currPage - 1) * pagination.numToShow,
    pagination.currPage * pagination.numToShow
  );

  const handleDeleteNewsletter = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setToast({ type: "success", message: "Newsletter deleted successfully" });
  };

  const handleAddNew = () => {
    const path =
      currTab === "Newsletters"
        ? "/admin/whats-up/create/newsletter"
        : "/admin/whats-up/create/announcement";
    router.push(path);
  };

  return (
    <div>
      {showFilter && (
        <div onClick={() => setShowFilter(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div onClick={(e) => e.stopPropagation()} className="bg-astrawhite p-8 rounded-xl w-80">
            <h3 className="font-lb text-xl mb-4">Filter Announcements</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-s text-astradarkgray mb-2 block">Announcement Type</label>
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
              <button
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-astraprimary rounded-lg"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
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
        <div className="flex flex-col py-4 px-1 md:px-4 lg:px-8">
          <TableHeader
            info={info}
            pagination={pagination}
            setPagination={setPagination}
            toggleFilter={() => setShowFilter(true)}
            searchQuery={searchTerm}
            setSearchQuery={setSearchTerm}
            addButton={{
              label: "Add New",
              onClick: handleAddNew,
            }}
          />

          {currTab === "Announcements" && (
            <div className="bg-astrawhite p-6 rounded-xl shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {currentItems.map((announcement) => (
                  <div key={announcement.id} className="group relative">
                    <Link href={`/admin/whats-up/announcements/${announcement.id}`}>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
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
                              {announcement.updated_at
                                ? new Date(announcement.updated_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                                : "No date"}
                            </span>
                          </div>
                          <p className="text-sm text-astrawhite/80 mt-2 line-clamp-2">
                            {announcement.details}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() =>
                        router.push(`/admin/whats-up/announcements/${announcement.id}`)
                      }
                      className="absolute top-2 right-2 p-2 bg-astraprimary text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-astradark"
                      title="Edit announcement"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
