"use client";
import { useState, useEffect, useContext } from "react";
import { TabContext } from "@/components/TabContext";
import { TableHeader, PageTool } from "@/components/TableBuilder";
import { Filter, Plus, Trash2, Edit2, Loader } from "lucide-react";
import { useTab } from "@/components/TabContext";
import ToastNotification from "@/components/ToastNotification";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { PhotoType } from "../../../common/scopes.js";

export default function CommunicationPage() {
  const router = useRouter();
  const { currTab } = useTab();
  const { setDashboard } = useContext(TabContext);
  const [toast, setToast] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [tempSelectedType, setTempSelectedType] = useState("All");
  const [announcements, setAnnouncements] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [contentPhotos, setContentPhotos] = useState({});
  const [photoTypesMap, setPhotoTypesMap] = useState({});
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [newsletterFiles, setNewsletterFiles] = useState({});
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);

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

  // Function to determine which photo fetching endpoint to use based on photo type
  const getPhotoEndpointByType = (type) => {
    switch (type) {
    case PhotoType.EVENT_PIC:
      return "event";
    case PhotoType.PROJECT_PIC:
      return "project";
    case PhotoType.JOB_PIC:
      return "jobs";
    default:
      return "event"; // Default to event if type is unknown
    }
  };

  // Helper functions for default images based on photo type
  const getDefaultImageByPhotoType = (type) => {
    switch (type) {
    case PhotoType.EVENT_PIC:
      return getDefaultEventImage();
    case PhotoType.PROJECT_PIC:
      return getDefaultProjectImage();
    case PhotoType.JOB_PIC:
      return getDefaultJobImage();
    default:
      return getDefaultEventImage();
    }
  };

  // Separate helper functions for default images
  const getDefaultEventImage = () => {
    return "/events/default-event.jpg";
  };

  const getDefaultProjectImage = () => {
    return "/projects/assets/Donation.jpg";
  };

  const getDefaultJobImage = () => {
    return "/jobs/assets/default-job.jpg";
  };

  // Save photos to localStorage
  const savePhotosToLocalStorage = (photos, typesMap) => {
    try {
      localStorage.setItem("announcementPhotos", JSON.stringify(photos));
      localStorage.setItem("photoTypesMap", JSON.stringify(typesMap));
    } catch (error) {
      console.error("Error saving photos to localStorage:", error);
    }
  };

  // Modified function to fetch content photos
  const fetchContentPhotos = async (contentIds) => {
    try {
      const photoMap = {};

      // First, fetch the photo type information for all content IDs
      const photoTypesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/content-types`,
        { params: { content_ids: contentIds.join(",") } }
      );

      // Create a map of content IDs to their photo types
      const photoTypesMap = {};
      if (photoTypesResponse.data.status === "OK" && photoTypesResponse.data.types) {
        photoTypesResponse.data.types.forEach(item => {
          photoTypesMap[item.content_id] = item.type;
        });
      }

      // Create arrays of promises for fetching photos
      const photoPromises = [];

      // For each content ID, fetch the photo based on its type from the photos table
      contentIds.forEach((contentId) => {
        const photoType = photoTypesMap[contentId];

        if (photoType !== undefined) {
          const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/${getPhotoEndpointByType(photoType)}/${contentId}`;

          const photoPromise = axios.get(endpoint)
            .then(response => {
              if (response.data.status === "OK" && response.data.photo) {
                photoMap[contentId] = response.data.photo;
              }
            })
            .catch(error => {
              console.log(`Failed to fetch photo for content_id ${contentId}:`, error);
            });

          photoPromises.push(photoPromise);
        }
      });

      // Wait for all photo fetch operations to complete
      await Promise.all(photoPromises);

      // Always save to localStorage for future use
      savePhotosToLocalStorage(photoMap, photoTypesMap);

      // Return the correct structure
      return { photos: photoMap, typesMap: photoTypesMap };
    } catch (error) {
      console.error("Error fetching photos:", error);
      // Return empty objects to avoid undefined values
      return { photos: {}, typesMap: {} };
    }
  };

  // Function to fetch files for newsletters
  const fetchNewsletterFiles = async (contentIds) => {
    try {
      const filesMap = {};

      // Create promises for fetching files
      const filePromises = contentIds.map(contentId =>
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/photos/files/${contentId}`)
          .then(response => {
            if (response.data.status === "OK" && response.data.file) {
              filesMap[contentId] = response.data.file; // Store the first file for each content
            }
          })
          .catch(error => {
            console.log(`Failed to fetch file for content_id ${contentId}:`, error);
          })
      );

      // Wait for all file fetch operations to complete
      await Promise.all(filePromises);

      return filesMap;
    } catch (error) {
      console.error("Error fetching files:", error);
      return {};
    }
  };

  useEffect(() => {
    setInfo({
      title: currTab === "Newsletters" ? "Newsletters" : "Announcements",
      search: currTab === "Newsletters" ? "Search newsletters" : "Search announcements",
    });

    const fetchContents = async () => {
      setIsLoadingPhotos(true);
      setIsLoadingFiles(true);
      try {
        // Fetch announcements
        const announcementResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents?tag=announcement`);
        if (announcementResponse.data.status === "OK") {
          const announcementList = announcementResponse.data.list || announcementResponse.data.data?.list || [];
          setAnnouncements(announcementList);

          // Extract content IDs for photo fetching
          const announcementIds = announcementList.map(item => item.id);

          // Fetch photos for all announcements
          const { photos, typesMap } = await fetchContentPhotos(announcementIds);
          setContentPhotos(photos);
          setPhotoTypesMap(typesMap);
        } else {
          console.error("Unexpected response format for announcements:", announcementResponse.data);
          setAnnouncements([]);
        }

        // Fetch newsletters
        const newsletterResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents?tag=newsletter`);
        if (newsletterResponse.data.status === "OK") {
          const newsletterList = newsletterResponse.data.list || newsletterResponse.data.data?.list || [];
          setNewsletters(newsletterList);

          // Extract content IDs for file fetching
          const newsletterIds = newsletterList.map(item => item.id);

          // Fetch files for newsletters
          const files = await fetchNewsletterFiles(newsletterIds);
          setNewsletterFiles(files);
          console.log("Fetched files:", files);
        } else {
          console.error("Unexpected response format for newsletters:", newsletterResponse.data);
          setNewsletters([]);
        }
      } catch (error) {
        console.error("Failed to fetch contents:", error);
        setAnnouncements([]);
        setNewsletters([]);
      } finally {
        setIsLoadingPhotos(false);
        setIsLoadingFiles(false);
      }
    };

    fetchContents();
  }, [currTab]);

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesType = selectedType === "All" || announcement.type === selectedType;
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filteredNewsletters = newsletters.filter((newsletter) => {
    const matchesType = selectedType === "All" || newsletter.type === selectedType;
    const matchesSearch = newsletter.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  useEffect(() => {
    const currentList = currTab === "Newsletters" ? filteredNewsletters : filteredAnnouncements;
    const total = currentList.length;
    const lastPage = Math.ceil(total / pagination.numToShow) || 1; // Ensure minimum 1 page
    // Update dashboard counts immediately for both types
    setDashboard((prev) => ({
      ...prev,
      announcements: announcements.length,
      newsletters: newsletters.length,
    }));

    // Calculate the current range
    const startIndex = (pagination.currPage - 1) * pagination.numToShow;
    const endIndex = Math.min(startIndex + pagination.numToShow, total);

    // Make sure current page is valid (might not be if filters reduced the items count)
    const validCurrPage = Math.min(pagination.currPage, lastPage);

    // Only if the page changed due to filtering, recalculate display values
    const actualStartIndex = (validCurrPage - 1) * pagination.numToShow;
    const actualEndIndex = Math.min(actualStartIndex + pagination.numToShow, total);

    setPagination(prev => ({
      ...prev,
      currPage: validCurrPage,
      total: total,
      lastPage: lastPage,
      display: [
        total > 0 ? actualStartIndex + 1 : 0, // If no items, start from 0
        actualEndIndex
      ]
    }));
  }, [currTab, filteredAnnouncements.length, filteredNewsletters.length, pagination.currPage, pagination.numToShow]);

  const currentItems = currTab === "Newsletters"
    ? filteredNewsletters.slice(
      (pagination.currPage - 1) * pagination.numToShow,
      pagination.currPage * pagination.numToShow
    )
    : filteredAnnouncements.slice(
      (pagination.currPage - 1) * pagination.numToShow,
      pagination.currPage * pagination.numToShow
    );

  const handleDeleteNewsletter = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/photos/newsletter/${id}`);
      if (response.data.status === "DELETED") {
        setNewsletters(prev => prev.filter(newsletter => newsletter.id !== id));
        setToast({ type: "success", message: "Newsletter deleted successfully" });
      } else {
        setToast({ type: "error", message: response.data.message || "Failed to delete newsletter" });
      }
    } catch (error) {
      console.error("Error deleting newsletter:", error);
      setToast({ type: "error", message: "An error occurred while deleting the newsletter" });
    }
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
      {/* {showFilter && (
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
      )} */}

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
          />

          {currTab === "Announcements" && (
            <div className="bg-astrawhite p-6 rounded-xl shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {isLoadingPhotos ? (
                  // Loading skeleton for photos
                  Array(pagination.numToShow).fill().map((_, index) => (
                    <div key={`skeleton-${index}`} className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg bg-astralightgray animate-pulse">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader className="w-8 h-8 text-astragray animate-spin" />
                      </div>
                    </div>
                  ))
                ) : currentItems.length > 0 ? (
                  currentItems.map((announcement) => (
                    <div key={announcement.id} className="group relative">
                      <Link href={`/admin/whats-up/announcements/${announcement.id}`}>
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                          <img
                            src={contentPhotos[announcement.id] ||
                                getDefaultImageByPhotoType(photoTypesMap[announcement.id] || PhotoType.EVENT_PIC)}
                            className="w-full h-full object-cover"
                            alt={announcement.title}
                            onError={(e) => {
                              e.target.src = getDefaultImageByPhotoType(photoTypesMap[announcement.id] || PhotoType.EVENT_PIC);
                            }}
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
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-astragray">
                    No announcements found. Try adjusting your filters or add a new announcement.
                  </div>
                )}
              </div>
            </div>
          )}

          {currTab === "Newsletters" && (
            <div className="bg-astrawhite p-6 rounded-xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                {isLoadingFiles ? (
                  // Loading skeleton for newsletters
                  Array(pagination.numToShow).fill().map((_, index) => (
                    <div key={`skeleton-${index}`} className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg bg-astralightgray animate-pulse max-w-[280px] mx-auto w-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader className="w-8 h-8 text-astragray animate-spin" />
                      </div>
                    </div>
                  ))
                ) : currentItems.length > 0 ? (
                  currentItems.map((newsletter) => (
                    <div key={newsletter.id} className="group relative max-w-[280px] mx-auto w-full">
                      <a
                        href={newsletterFiles[newsletter.id]?.url || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="aspect-[3/4] relative bg-black rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                          <img
                            src="https://marketplace.canva.com/EAGWT7FdhOk/1/0/1131w/canva-black-and-grey-modern-business-company-email-newsletter-R_dH5ll-SAs.jpg"
                            alt={newsletter.title}
                            className="w-full h-full object-cover opacity-90"
                          />
                          <div className="absolute inset-0 bg-astradarkgray/50 group-hover:bg-astradarkgray/70 transition-colors" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                            <h3 className="text-astrawhite font-rb text-lg mb-1">
                              {newsletter.title}
                            </h3>
                            <p className="text-astrawhite/80 font-s">
                              {newsletterFiles[newsletter.id]?.image_key?.replace(/^\d+\s*-/, "") || "Newsletter.pdf"}
                            </p>
                          </div>
                        </div>
                      </a>
                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDeleteNewsletter(newsletter.id, e)}
                        className="absolute top-2 right-2 p-2 bg-astrared text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-astrared/90"
                        title="Delete newsletter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-astragray">
                    No newsletters found. Try adjusting your filters or add a new newsletter.
                  </div>
                )}
              </div>
            </div>
          )}

          <PageTool
            pagination={pagination}
            setPagination={setPagination}
          />
        </div>
      </div>
    </div>
  );
}