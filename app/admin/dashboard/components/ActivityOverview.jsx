"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import AdminTabs from "@/components/AdminTabs";
import { differenceInDays, parseISO, compareDesc } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { capitalizeName } from "@/utils/format.jsx";
import axios from "axios";
import { Eye } from "lucide-react";

const today = new Date();


function getRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000); // difference in seconds

  if (diff < 60) return "A few seconds ago";
  if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} day(s) ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AlumniItem({ alumni, router }) {
  if (!alumni) {
    return <div className="min-h-[72px]" />;
  }

  return (
    <div className="flex items-center border-b py-2 min-h-[72px]">
      <div className="mr-3 py-1 px-1 hidden sm:block">
        <Avatar>
          <AvatarImage
            src={alumni.avatar_url}
            alt={alumni?.name || "User"}
            onError={(e) => {
              e.target.src = "https://cdn-icons-png.flaticon.com/512/145/145974.png";
            }}
          />
          <AvatarFallback className="rounded-md">
            {alumni?.name ? getInitials(alumni.name) : "?"}
          </AvatarFallback>
        </Avatar>

      </div>
      <div className="flex-1">
        <p className="font-r line-clamp-1"><span style={{ color: alumni?.name === null ? "red" : "inherit" }}>
          {alumni?.name === null ? "No profile" : alumni?.name}
        </span></p>
        <p className="font-s text-astradarkgray line-clamp-1">{alumni?.email || ""}</p>
      </div>
      <div className="text-right">
        {alumni?.name !== null && (
          <>
            {/* Show text on small screens, hide on md+ */}
            <button
              onClick={() => router.push(`/admin/alumni/search/${alumni.id}`)}
              aria-label="See Details"
              className="block sm:hidden rounded-md p-2 bg-astratintedwhite hover:bg-astraprimary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-astraprimary"
              title="See Details"
            >
              <Eye size={18} className="text-astraprimary" />
            </button>
            <a
              onClick={() => router.push(`/admin/alumni/search/${alumni.id}`)}
              className="text-astraprimary font-s hover:underline text-sm cursor-pointer hidden sm:inline-flex items-center"
            >
              See Details
            </a>
          </>
        )}
        <p className="font-s text-astradarkgray hidden sm:block">{getRelativeTime(alumni.date)}</p>
      </div>
    </div>
  );
}

function getInitials(name) {
  if (!name) return "??";

  const nameParts = name.split(" ");
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPageButton = (page) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`px-2 md:px-4 py-2 rounded-sm md:rounded-xl font-s ${currentPage === page ? "bg-astraprimary text-astrawhite" : "bg-transparent text-astradarkgray hover:bg-astratintedwhite"}`}
    >
      {page}
    </button>
  );

  const renderDots = (key) => (
    <span key={key} className="px-2 text-astradarkgray select-none">
      ...
    </span>
  );

  const getPageButtons = () => {
    const pages = [];
    pages.push(renderPageButton(1));

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push(renderDots("start-dots"));
    for (let i = start; i <= end; i++) pages.push(renderPageButton(i));
    if (end < totalPages - 1) pages.push(renderDots("end-dots"));
    if (totalPages > 1) pages.push(renderPageButton(totalPages));

    return pages;
  };

  return (
    totalPages > 1 && (
      <div className="flex items-center justify-center gap-2 sm:gap-1 py-4 cursor-pointer bg-white rounded-b-xl">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? "text-astralightgray cursor-not-allowed" : "text-astraprimary hover:bg-astratintedwhite"}`}
        >
          <svg className="w-5 h-5 stroke-3" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {getPageButtons()}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? "text-astralightgray cursor-not-allowed" : "text-astraprimary hover:bg-astratintedwhite"}`}
        >
          <svg className="w-5 h-5 stroke-3" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )
  );
}

export default function ActivityOverview() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const alumniPerPage = 5;

  const [recentRegisters, setRecentRegisters] = useState([]);
  const [inactiveAccounts, setInactiveAccounts] = useState([]);

  const totalRecentPages = useMemo(
    () => Math.ceil(recentRegisters.length / alumniPerPage),
    [recentRegisters.length]
  );

  const totalInactivePages = useMemo(
    () => Math.ceil(inactiveAccounts.length / alumniPerPage),
    [inactiveAccounts.length]
  );

  const [tabs, setTabs] = useState({
    "Recent Registrations": 0,
    "Inactive Accounts": 0,
  });

  useEffect(() => {
    const fetchRecentRegisters = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/users?recent=true&alumni=true`,
        );

        // console.log(response.data);

        if (response.data.status === "OK") {
          const updatedRecentRegisters = await Promise.all(
            response.data.list.map(async (user) => {
              const hasProfile = user.alumni_profiles !== null;

              const userData = {
                id: user.id,
                name: hasProfile
                  ? capitalizeName(`${user.alumni_profiles.first_name} ${user.alumni_profiles.middle_name} ${user.alumni_profiles.last_name}`)
                  : null,
                email: user.email,
                date: user.created_at,
                avatar_url: user?.avatar_url || "https://cdn-icons-png.flaticon.com/512/145/145974.png"
              };

              return userData;
            })
          );

          setRecentRegisters(updatedRecentRegisters);
          setTabs(prev => ({
            ...prev,
            "Recent Registrations": updatedRecentRegisters.length
          }));
        } else {
          ; // console.error("Unexpected response:", response.data);
        }
      } catch (error) {
        ; // console.error("Failed to fetch alumni:", error);
      }
    };

    const fetchInactiveAccounts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/users/inactive-alumni`,
        );

        // console.log(response.data);

        if (response.data.status === "OK") {
          const updatedInactiveAccounts = await Promise.all(
            response.data.list.map(async (user) => {
              const userData = {
                id: user.user_id,
                name: capitalizeName(`${user.first_name} ${user.middle_name} ${user.last_name}`),
                email: user.email,
                date: user.profile_created_at,
                avatar_url: user?.avatar_url || "https://cdn-icons-png.flaticon.com/512/145/145974.png",
              };

              return userData;
            })
          );

          setInactiveAccounts(updatedInactiveAccounts);
          setTabs(prev => ({
            ...prev,
            "Inactive Accounts": updatedInactiveAccounts.length
          }));
        } else {
          ; // console.error("Unexpected response:", response.data);
        }
      } catch (error) {
        ; // console.error("Failed to fetch alumni:", error);
      }
    };

    fetchRecentRegisters();
    fetchInactiveAccounts();
  }, []);

  const [currTab, setCurrTab] = useState("Recent Registrations");

  useEffect(() => {
    setCurrentPage(1);
  }, [currTab]);
  const handleTabChange = (newTab) => {
    setCurrTab(newTab);
  };


  const startIndex = (currentPage - 1) * alumniPerPage;
  const recentContent = recentRegisters.slice(startIndex, startIndex + alumniPerPage);
  const inactiveContent = inactiveAccounts.slice(startIndex, startIndex + alumniPerPage);
  const displayRecent = Array(alumniPerPage).fill(null).map((_, index) => recentContent[index] || null);
  const displayInactive = Array(alumniPerPage).fill(null).map((_, index) => inactiveContent[index] || null);

  return (
    <div className="border rounded-lg shadow-md p-4 bg-astrawhite h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Alumni Activity Overview</h2>
          <a
            onClick={() => router.push("/admin/alumni/search")}
            className="text-astraprimary font-rb hover:underline cursor-pointer"
          >
            See All
          </a>
        </div>
        <div className="flex-1 md:px-4 px-0">
          <AdminTabs tabs={tabs} currTab={currTab} size={"font-rb"} handleTabChange={handleTabChange} />
          {currTab === "Recent Registrations" && (
            <div>
              {displayRecent.map((alumni, index) => (
                <AlumniItem key={index} alumni={alumni} router={router} />
              ))}
              <Pagination currentPage={currentPage} totalPages={totalRecentPages} onPageChange={setCurrentPage} />
            </div>
          )}
          {currTab === "Inactive Accounts" && (
            <div>
              {displayInactive.map((alumni, index) => (
                <AlumniItem key={index} alumni={alumni} router={router} />
              ))}
              <Pagination currentPage={currentPage} totalPages={totalInactivePages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}