'use client';
import { useState } from 'react';
import { Calendar, Briefcase, User } from "lucide-react";

const mockData = [
    { type: 'create', category: 'event', user: 'Alice Carter', title: 'Spring Gala 2025', date: '2025-04-24T10:15:00Z' },
    { type: 'update', category: 'alumni', user: 'Bob Harris', title: 'Work Experience', date: '2025-04-24T16:45:00Z' },
    { type: 'delete', category: 'jobs', user: 'Clara Evans', title: 'Marketing Manager Position', date: '2025-04-23T09:30:00Z' },
    { type: 'create', category: 'projects', user: 'David Kim', title: 'Solar Panel Research', date: '2025-04-20T14:00:00Z' },
    { type: 'update', category: 'event', user: 'Emma Lopez', title: 'Tech Workshop', date: '2025-04-18T11:20:00Z' },
    { type: 'delete', category: 'alumni', user: 'Frank Miller', title: 'Education', date: '2025-04-15T08:50:00Z' },
    { type: 'create', category: 'jobs', user: 'Grace Lee', title: 'UX Designer Role', date: '2025-04-10T13:10:00Z' },
    { type: 'update', category: 'projects', user: 'Henry Patel', title: 'Blockchain Development', date: '2025-04-05T15:25:00Z' },
    { type: 'create', category: 'event', user: 'Isla Nguyen', title: 'Career Fair 2025', date: '2025-03-30T12:00:00Z' },
    { type: 'update', category: 'alumni', user: 'Jack Wilson', title: 'Work Experience', date: '2025-03-25T17:40:00Z' },
    { type: 'delete', category: 'jobs', user: 'Kelly Brown', title: 'Data Scientist Position', date: '2025-03-20T10:55:00Z' },
    { type: 'create', category: 'projects', user: 'Liam Davis', title: 'Quantum Computing Study', date: '2025-03-15T09:15:00Z' },
    { type: 'update', category: 'event', user: 'Mia Clark', title: 'Networking Night', date: '2025-03-10T14:30:00Z' },
    { type: 'delete', category: 'alumni', user: 'Noah Adams', title: 'Work Experience', date: '2025-03-05T16:00:00Z' },
    { type: 'create', category: 'jobs', user: 'Olivia White', title: 'Product Manager Role', date: '2025-02-28T11:45:00Z' },
    { type: 'update', category: 'projects', user: 'Peter Scott', title: 'AI Ethics Framework', date: '2025-02-20T13:20:00Z' },
    { type: 'create', category: 'event', user: 'Quinn Taylor', title: 'Alumni Mixer', date: '2025-02-15T15:50:00Z' },
    { type: 'update', category: 'alumni', user: 'Rachel Green', title: 'Education', date: '2025-02-10T08:30:00Z' },
    { type: 'delete', category: 'jobs', user: 'Sam Lewis', title: 'Frontend Developer Position', date: '2025-02-05T12:25:00Z' },
    { type: 'create', category: 'projects', user: 'Tina Brooks', title: 'Sustainable Agriculture Initiative', date: '2025-01-30T10:00:00Z' }
];

function ActivityItem({ activity }) {
    if (!activity) {
        return <div className="min-h-[72px]" />;
    }

    const getIcon = () => {
        switch (activity.category) {
            case 'event':
                return <Calendar className="h-5 w-5 text-astrawhite" strokeWidth={2} />;
            case 'jobs':
                return <Briefcase className="h-5 w-5 text-astrawhite" strokeWidth={2} />;
            case 'alumni':
            case 'projects':
                return <User className="h-5 w-5 text-astrawhite" strokeWidth={2} />;
            default:
                return <User className="h-5 w-5 text-astrawhite" strokeWidth={2} />;
        }
    };

    const getDescription = () => {
        if (activity.category === 'alumni') {
            return `${activity.user} has ${activity.type}d ${activity.title.toLowerCase()}.`;
        }
        if (activity.type === 'create') {
            return `${activity.user} created ${activity.category === 'event' ? 'an' : 'a'} ${activity.category} with a title "${activity.title}".`;
        }
        return `${activity.user} ${activity.type}d a ${activity.category} titled "${activity.title}".`;
    };

    const getTime = () => {
        const activityDate = new Date(activity.date);
        const now = new Date('2025-04-25T00:00:00Z'); // Current datetime as per context
        const diffInSeconds = Math.floor((now - activityDate) / 1000);

        const minutes = Math.floor(diffInSeconds / 60);
        if (minutes < 60) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        }

        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        }

        const days = Math.floor(hours / 24);
        if (days < 7) {
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        }

        const weeks = Math.floor(days / 7);
        if (weeks < 4) {
            return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
        }

        const months = Math.floor(days / 30);
        if (months < 12) {
            return `${months} month${months !== 1 ? 's' : ''} ago`;
        }

        const years = Math.floor(months / 12);
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    };

    return (
        <div className="flex items-center border-b py-2 min-h-[72px]">
            <div className="mr-3 bg-astraprimary p-2 rounded-xl">
                {getIcon()}
            </div>
            <div className="flex-1">
                <p className="font-r line-clamp-2">{getDescription()}</p>
            </div>
            <div className="text-right relative">
                <p className="text-xs text-astradarkgray">
                    {getTime()}
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
                    <svg className="w-5 h-5 stroke-3" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                {getPageButtons()}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-astralightgray cursor-not-allowed' : 'text-astraprimary hover:bg-astratintedwhite'}`}
                >
                    <svg className="w-5 h-5 stroke-3" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        )
    );
}

export default function RecentActivity() {
    const [currentPage, setCurrentPage] = useState(1);
    const activitiesPerPage = 5;
    const totalPages = Math.ceil(mockData.length / activitiesPerPage);

    const startIndex = (currentPage - 1) * activitiesPerPage;
    const currentActivities = mockData.slice(startIndex, startIndex + activitiesPerPage);
    const displayActivities = Array(activitiesPerPage).fill(null).map((_, index) => currentActivities[index] || null);

    return (
        <div className="border rounded-lg shadow-md p-4 bg-astrawhite h-full">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Activity</h2>
                </div>
                <div className="flex-1 px-4">
                    {displayActivities.map((activity, index) => (
                        <ActivityItem key={index} activity={activity} />
                    ))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}