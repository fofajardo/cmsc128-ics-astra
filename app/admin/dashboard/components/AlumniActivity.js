'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const mockdata = [
    { id: '1', img: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg', name: 'Juan D. Dela Cruz', email: 'jdcruz@up.edu.ph', created: '2025-04-25T10:00:00Z' },
    { id: '2', img: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg', name: 'Riggs Mikael T. Tomas', email: 'rttomas@up.edu.ph', created: '2025-04-25T09:49:00Z' },
    { id: '3', img: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg', name: 'Mallory Allison', email: 'mallison@up.edu.ph', created: '2025-04-25T01:00:00Z' },
    { id: '4', img: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg', name: 'Jonner Camara', email: 'jncamara@up.edu.ph', created: '2025-04-23T10:00:00Z' },
    { id: '5', img: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg', name: 'Maria Veronica', email: 'mvd@up.edu.ph', created: '2025-04-20T10:00:00Z' },
    { id: '6', img: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg', name: 'Alex Santos', email: 'asantos@up.edu.ph', created: '2025-04-15T10:00:00Z' },
    { id: '7', img: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg', name: 'Lara Mendoza', email: 'lmendoza@up.edu.ph', created: '2025-04-10T10:00:00Z' },
    { id: '8', img: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg', name: 'Carlo Reyes', email: 'creyes@up.edu.ph', created: '2025-04-05T10:00:00Z' },
    { id: '9', img: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg', name: 'Sofia Cruz', email: 'scruz@up.edu.ph', created: '2025-04-01T10:00:00Z' },
    { id: '10', img: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg', name: 'Mark Tan', email: 'mtan@up.edu.ph', created: '2025-03-28T10:00:00Z' },
    { id: '11', img: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg', name: 'Elena Diaz', email: 'ediaz@up.edu.ph', created: '2025-03-25T10:00:00Z' },
];

function AlumniItem({ alumni, router }) {
  if (!alumni) {
    return <div className="min-h-[72px]" />;
  }

  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'A few seconds ago';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="flex items-center border-b py-2 min-h-[72px]">
      <div className="flex items-center flex-1">
        <img src={alumni.img} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
        <div>
        <p className="font-r line-clamp-1">{alumni.name}</p>
          <p className="font-s text-astradarkgray">{alumni.email}</p>
        </div>
      </div>
      <div className="text-right bg-astrawhite">
        <a
          onClick={() => router.push(`alumni/search/${alumni.id}`)}
          className="text-astraprimary font-s hover:underline text-sm cursor-pointer"
        >
          See Details
        </a>
        <p className="text-sm text-astradarkgray">
          {timeAgo(alumni.created)}
        </p>
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
        currentPage === page ? 'bg-astraprimary text-astrawhite' : 'bg-transparent text-astradarkgray hover:bg-astratintedwhite'
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

    if (start > 2) pages.push(renderDots('start-dots'));
    for (let i = start; i <= end; i++) pages.push(renderPageButton(i));
    if (end < totalPages - 1) pages.push(renderDots('end-dots'));
    if (totalPages > 1) pages.push(renderPageButton(totalPages));

    return pages;
  };

  return (
    totalPages > 1 && (
      <div className="flex items-center justify-center gap-2 sm:gap-1 py-4 cursor-pointer bg-white rounded-b-xl">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-astradarkgray cursor-not-allowed' : 'text-astraprimary hover:bg-astratintedwhite'}`}
        >
          <svg className="w-5 h-5 stroke-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {getPageButtons()}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-astradarkgray cursor-not-allowed' : 'text-astraprimary hover:bg-astratintedwhite'}`}
        >
          <svg className="w-5 h-5 stroke-3" fill="none" stroke="currentColor" viewBox="0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )
  );
}

export default function AlumniActivity() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const alumniPerPage = 5;
  const totalPages = Math.ceil(mockdata.length / alumniPerPage);

  const startIndex = (currentPage - 1) * alumniPerPage;
  const currentAlumni = mockdata.slice(startIndex, startIndex + alumniPerPage);
  const displayAlumni = Array(alumniPerPage).fill(null).map((_, index) => currentAlumni[index] || null);

  return (
    <div className="border rounded-lg shadow-md p-4 bg-astrawhite h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Registers</h2>
          <a
            onClick={() => router.push('/admin/alumni/search')}
            className="text-astraprimary font-rb hover:underline cursor-pointer"
          >
            See All
          </a>
        </div>
        <div className="flex-1">
          {displayAlumni.map((alumni, index) => (
            <AlumniItem key={index} alumni={alumni} router={router} />
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}