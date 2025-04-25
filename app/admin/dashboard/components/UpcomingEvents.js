'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {Calendar} from "lucide-react";

const mockData = [
    { id: 21, title: 'Innovation Showcase', location: 'Grand Hall', date: '2025-08-2' },
    { id: 20, title: 'Innovation Showcase', location: 'Grand Hall', date: '2025-08-25' },
    { id: 19, title: 'Cybersecurity Seminar', location: 'Zoom Meeting', date: '2025-08-20' },
    { id: 18, title: 'Web Development Workshop', location: 'Tech Center', date: '2025-08-15' },
    { id: 17, title: 'Startup Accelerator Kickoff', location: 'Innovation Hub', date: '2025-08-10' },
    { id: 16, title: 'AI Research Symposium', location: 'Main Auditorium', date: '2025-08-05' },
    { id: 15, title: 'Career Networking Mixer', location: 'Baker Hall', date: '2025-08-01' },
    { id: 14, title: 'Tech Talk: Cloud Computing', location: 'Zoom Meeting', date: '2025-07-25' },
    { id: 13, title: 'Leadership Summit', location: 'Conference Room B', date: '2025-07-20' },
    { id: 12, title: 'Coding Hackathon', location: 'Innovation Lab', date: '2025-07-15' },
    { id: 11, title: 'Alumni Gala', location: 'Grand Hall', date: '2025-07-10' },
    { id: 10, title: 'Entrepreneurship Workshop', location: 'Tech Center', date: '2025-07-05' },
    { id: 9, title: 'Data Science Bootcamp', location: 'Zoom Meeting', date: '2025-07-01' },
    { id: 8, title: 'Startup Pitch Event', location: 'Innovation Hub', date: '2025-06-25' },
    { id: 7, title: 'Industry Panel Discussion', location: 'Conference Room A', date: '2025-06-20' },
    { id: 6, title: 'Resume Building Session', location: 'Library Room 3', date: '2025-06-15' },
    { id: 5, title: 'Career Fair 2025', location: 'Main Hall', date: '2025-06-10' },
    { id: 4, title: 'Tech Workshop: AI Basics', location: 'Tech Center', date: '2025-06-05' },
    { id: 3, title: 'Networking Night', location: 'Baker Hall', date: '2025-06-01' },
    { id: 2, title: 'Job Seminar', location: 'Zoom Meeting', date: '2025-05-27' },
    { id: 1, title: 'Alum: Connect Together', location: 'PhysSci Building', date: '2025-05-11' },
];

function EventItem({ event, router }) {

    if (!event) {
        return <div className="min-h-[72px]" />; 
    }

    return (
        <div className="flex items-center border-b py-2 min-h-[72px]">
            <div className="mr-3 bg-astraprimary p-2 rounded-xl">
                <Calendar className="h-5 w-5 text-astrawhite" strokeWidth={2}/>
            </div>
            <div className="flex-1">
                <p className="font-r line-clamp-1">{event?.title}</p>
                <p className="font-s text-astradarkgray">{event?.location || ''}</p>
            </div>
            <div className="text-right">
                {event && (
                <a
                    onClick={() => router.push(`/admin/events/${event.id}`)}
                    className="text-astraprimary font-s hover:underline text-sm cursor-pointer"
                >
                    See Details
                </a>
                )}
                <p className="text-sm text-astradarkgray">
                {event ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
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
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-astralightgray cursor-not-allowed' : 'text-astraprimary hover:bg-astratintedwhite'}`}
        >
          <svg className="w-5 h-5 stroke-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {getPageButtons()}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-astralightgray cursor-not-allowed' : 'text-astraprimary hover:bg-astratintedwhite'}`}
        >
          <svg className="w-5 h-5 stroke-3" fill="none" stroke="currentColor" viewBox="0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )
  );
}

export default function UpcomingEvents() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 5;
    const totalPages = Math.ceil(mockData.length / eventsPerPage);
  
    const startIndex = (currentPage - 1) * eventsPerPage;
    const currentEvents = mockData.slice(startIndex, startIndex + eventsPerPage);
    const displayEvents = Array(eventsPerPage).fill(null).map((_, index) => currentEvents[index] || null);
  
    return (
      <div className="border rounded-lg shadow-md p-4 bg-astrawhite h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <a
              onClick={() => router.push('/admin/events')}
              className="text-astraprimary font-rb hover:underline cursor-pointer"
            >
              See All
            </a>
          </div>
          <div className="flex-1 px-4">
            {displayEvents.map((event, index) => (
              <EventItem key={index} event={event} router={router} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    );
  }