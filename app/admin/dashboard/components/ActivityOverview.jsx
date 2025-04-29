"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AdminTabs from "@/components/AdminTabs";
import { differenceInDays, parseISO, compareDesc } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const mockData = [
  { id: 10, name: "Benjamin K. Lee", email: "benjamin.lee@example.com", date: "2025-04-25T18:00:00Z" },
  { id: 9, name: "Isabella Rose Thomas", email: "isabella.thomas@example.com", date: "2025-04-25T09:30:00Z" },
  { id: 8, name: "James Anderson", email: "james.anderson@example.com", date: "2025-04-23T08:45:00Z" },
  { id: 7, name: "Sophia L. Garcia", email: "sophia.garcia@example.com", date: "2025-04-22T08:15:00Z" },
  { id: 6, name: "William J. Martinez", email: "william.martinez@example.com", date: "2025-04-21T07:50:00Z" },
  { id: 5, name: "Ava Wilson", email: "ava.wilson@example.com", date: "2025-04-20T07:00:00Z" },
  { id: 4, name: "Noah Z. Davis", email: "noah.davis@example.com", date: "2025-04-19T06:30:00Z" },
  { id: 3, name: "Olivia Mae Brown", email: "olivia.brown@example.com", date: "2025-04-18T06:00:00Z" },
  { id: 2, name: "Liam A. Smith", email: "liam.smith@example.com", date: "2025-04-17T05:45:00Z" },
  { id: 1, name: "Emma Johnson", email: "emma.johnson@example.com", date: "2025-04-16T05:30:00Z" },
  { id: 18, name: "Riggs Mikael Tomas", email: "rttomas@example.com", date: "2025-03-12T05:30:00Z" },

  // Inactive users
  { id: 11, name: "Lucas P. Bennett", email: "lucas.bennett@example.com", date: "2023-03-10T10:15:00Z" },
  { id: 12, name: "Grace Hughes", email: "grace.hughes@example.com", date: "2022-12-01T09:40:00Z" },
  { id: 13, name: "Ethan M. Kelly", email: "ethan.kelly@example.com", date: "2023-01-05T11:25:00Z" },
  { id: 14, name: "Hannah R. Moore", email: "hannah.moore@example.com", date: "2022-03-30T14:10:00Z" },
  { id: 15, name: "Jackson L. Foster", email: "jackson.foster@example.com", date: "2023-02-15T08:35:00Z" },
  { id: 16, name: "Zoey F. Thomas", email: "zoey.thomas@example.com", date: "2023-01-10T07:20:00Z" },
  { id: 17, name: "Nathan J. Ross", email: "nathan.ross@example.com", date: "2023-03-01T13:00:00Z" }
];

const today = new Date();

// recently registered: within 1 year
const recentlyRegistered = mockData
  .filter(item => differenceInDays(today, parseISO(item.date)) <= 365)
  .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date))); // most recent first

// inactive: more than 1 year
const inactiveAccounts = mockData
  .filter(item => differenceInDays(today, parseISO(item.date)) > 365)
  .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date))); // longest inactive first

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
      <div className="mr-3 py-1 px-1">
        <Avatar>
          <AvatarImage src="https://cdn-icons-png.flaticon.com/512/145/145974.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

      </div>
      <div className="flex-1">
        <p className="font-r">{alumni?.name}</p>
        <p className="font-s text-astradarkgray">{alumni?.email || ""}</p>
      </div>
      <div className="text-right">
        {alumni && (
          <a
            onClick={() => router.push(`/admin/alumni/search/${alumni.id}`)}
            className="text-astraprimary font-s hover:underline text-sm cursor-pointer"
          >
            See Details
          </a>
        )}
        <p className="text-sm text-astradarkgray">{getRelativeTime(alumni.date)}</p>
      </div>
    </div>
  );
}


function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPageButton = (page) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`px-2 md:px-4 py-2 rounded-sm md:rounded-xl font-s ${
        currentPage === page ? "bg-astraprimary text-astrawhite" : "bg-transparent text-astradarkgray hover:bg-astratintedwhite"
      }`}
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
  const totalRecentPages = Math.ceil(recentlyRegistered.length / alumniPerPage);
  const totalInactivePages = Math.ceil(inactiveAccounts.length / alumniPerPage);


  const tabs = {
    "Recent Registrations": 3,
    "Inactive Accounts": 0,
  };

  const [currTab, setCurrTab] = useState("Recent Registrations");

  useEffect(() => {
    setCurrentPage(1);
  }, [currTab]);
  const handleTabChange = (newTab) => {
    setCurrTab(newTab);
  };

  const startIndex = (currentPage - 1) * alumniPerPage;
  const recentContent = recentlyRegistered.slice(startIndex, startIndex + alumniPerPage);
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
        <div className="flex-1 px-4">
          <AdminTabs tabs ={tabs} currTab={currTab} size={"font-rb"} handleTabChange={handleTabChange}/>
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