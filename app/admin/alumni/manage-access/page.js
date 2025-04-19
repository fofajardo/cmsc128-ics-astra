"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import {TableHeader, Table, PageTool} from '@/components/TableBuilder';
import { users, alumniProfiles } from '@/components/DummyData'
import SearchFilter from "admin/alumni/search/filter";
import ToastNotification from '@/components/ToastNotification';
import { Check } from "lucide-react";

const alumList = [
    {
        id: 1,
        image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
        alumname: "Emma Johnson",
        email: "emma.johnson@example.com",
        graduationYear: 2015,
        student_num: "2022-03814",
        course: "BS Computer Science",
        location: "New York, NY",
        fieldOfWork: "Backend Development",
        skills: ["Java", "Spring Boot", "REST APIs", "PostgreSQL"]
    },
    {
        id: 2,
        image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
        alumname: "Liam Smith",
        email: "liam.smith@example.com",
        graduationYear: 2018,
        student_num: "2021-03814",
        course: "BS Civil Engineering",
        location: "San Francisco, CA",
        fieldOfWork: "Machine Learning Engineering",
        skills: ["Python", "Scikit-learn", "Pandas"]
    },
    {
        id: 3,
        image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
        alumname: "Olivia Brown",
        email: "olivia.brown@example.com",
        graduationYear: 2012,
        student_num: "2020-03814",
        course: "BS Education",
        location: "Chicago, IL",
        fieldOfWork: "Frontend Development",
        skills: ["HTML", "CSS", "JavaScript", "Vue.js"]
    },
    {
        id: 4,
        image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
        alumname: "Noah Davis",
        email: "noah.davis@example.com",
        graduationYear: 2020,
        student_num: "2022-30214",
        course: "BS Computer Science",
        location: "Austin, TX",
        fieldOfWork: "DevOps Engineering",
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"]
    },
    {
        id: 5,
        image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
        alumname: "Ava Wilson",
        email: "ava.wilson@example.com",
        graduationYear: 2017,
        student_num: "2020-12314",
        course: "BS Computer Science",
        location: "Seattle, WA",
        fieldOfWork: "Mobile App Development",
        skills: ["Swift", "iOS", "Firebase"]
    },
    {
        id: 6,
        image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
        alumname: "William Martinez",
        email: "william.martinez@example.com",
        graduationYear: 2014,
        student_num: "2021-41237",
        course: "BS Chemical Engineering",
        location: "Miami, FL",
        fieldOfWork: "Full Stack Development",
        skills: ["Node.js", "React", "MongoDB", "GraphQL"]
    },
    {
        id: 7,
        image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
        alumname: "Sophia Garcia",
        email: "sophia.garcia@example.com",
        graduationYear: 2016,
        student_num: "2022-99632",
        course: "BS Forestry",
        location: "Denver, CO",
        fieldOfWork: "Cloud Engineering",
        skills: ["Azure", "Linux", "Networking", "Python"]
    },
    {
        id: 8,
        image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
        alumname: "James Anderson",
        email: "james.anderson@example.com",
        graduationYear: 2013,
        student_num: "2017-26934",
        course: "BS Computer Science",
        location: "Boston, MA",
        fieldOfWork: "Security Engineering",
        skills: ["Penetration Testing", "OWASP", "Metasploit"]
    },
    {
        id: 9,
        image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
        alumname: "Isabella Thomas",
        email: "isabella.thomas@example.com",
        graduationYear: 2019,
        student_num: "2015-04814",
        course: "BS Industrial Engineering",
        location: "Los Angeles, CA",
        fieldOfWork: "AI Research",
        skills: ["PyTorch", "Deep Learning", "NLP"]
    },
    {
        id: 10,
        image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
        alumname: "Benjamin Lee",
        email: "benjamin.lee@example.com",
        graduationYear: 2011,
        student_num: "2013-03825",
        course: "BS Information Technology",
        location: "Atlanta, GA",
        fieldOfWork: "Database Administration",
        skills: ["SQL", "Oracle", "Database Tuning", "Shell Scripting", "PL/SQL"]
    }
];
    


export default function AlumniAccess() {
    const [showFilter, setShowFilter] = useState(false);
    const info = { title: "Pending Accounts", search: "Search for an alumni" };
  
    const toggleFilter = () => {
        console.log("Toggling filter modal:", !showFilter);
        setShowFilter((prev) => !prev);
      };
  
    const [pagination, setPagination] = useState({
        display: [1, 10],
        currPage: 1,
        lastPage: 10,
        numToShow: 10,
        total: 999
    });
    return (
      <div>
        {/* Filter Modal */}
        {showFilter && (
            <div
                onClick={toggleFilter}     
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
                <div onClick={e => e.stopPropagation()}>
                <SearchFilter onClose={toggleFilter} />
                </div>
            </div>
            )}
        {/* Header with background */}
        <div className="relative">
          <img
            src="/blue-bg.png"
            alt="Background"
            className="h-64 w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-astrawhite z-10">
            <h1 className="font-h1 text-center">Manage Access</h1>
            <p className="font-s text-center">The ever-growing UPLB-ICS Alumni Network</p>
          </div>
        </div>
  
        {/* Table section */}
        <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24">
            <div className='flex flex-col py-4 px-1 md:px-4 lg:px-8'>
                <TableHeader info={info} pagination={pagination} toggleFilter={toggleFilter} />
                <Table cols={cols} data={createRows()} />
                <PageTool pagination={pagination} setPagination={setPagination} />
            </div>
        </div>
      </div>
    );
  }

const cols = [
    { label: 'Checkbox:label-hidden', justify: 'center', visible: 'all'},
    { label: 'Image:label-hidden', justify: 'center', visible: 'all' },
    { label: 'Name', justify: 'start', visible: 'all' },
    { label: 'Graduation Year', justify: 'center', visible: 'md' },
    { label: 'Student ID', justify: 'center', visible: 'lg' },
    { label: 'Course', justify: 'center', visible: 'lg' },
    { label: 'Quick Actions', justify: 'center', visible: 'all' },
];

function createRows() {
    return alumList.map((alum) => ({
        'Checkbox:label-hidden': renderCheckboxes(alum.id),
        'Image:label-hidden': renderAvatar(alum.image, alum.alumname),
        Name: renderName(alum.alumname, alum.email),
        'Graduation Year': renderText(alum.graduationYear),
        'Student ID': renderText(alum.student_num),
        'Course': renderText(alum.course),
        'Quick Actions': renderActions(alum.id, alum.alumname),
    }));
}

function renderCheckboxes(id) {
    const [selectedIds, setSelectedIds] = useState([]);
    const isChecked = selectedIds.includes(id);

    const handleChange = () => {
        setSelectedIds((prev) =>
            isChecked ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <label className="flex items-center justify-center cursor-pointer group pl-4">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={handleChange}
                className="peer hidden"
            />
            <div
                className={`w-5 h-5 rounded border-2 
                ${isChecked ? 'bg-astradark border-astradark shadow-md shadow-astradark/40' : 'border-gray-400'}
                flex items-center justify-center transition-all duration-200 ease-in-out`}
            >
                {isChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
        </label>
    );
}



function renderAvatar(image, name) {
    return (
        <div className="flex justify-center">
            <div className="w-12 h-12 m-3">
                <img
                    src={image}
                    alt={`${name}'s avatar`}
                    className="w-full h-full object-cover rounded-xl"
                />
            </div>
        </div>
    );
}

function renderName(name, email) {
    return (
        <div>
            <div className="font-rb">{name}</div>
            <div className="text-astradarkgray font-s">{email}</div>
        </div>
    );
}

function renderText(text) {
    return <div className="text-center text-astradarkgray font-s">{text}</div>;
}


function renderActions(id,name) {
    const router = useRouter();
    const [toast, setToast] = useState(null);

    const handleClick = () => {
        router.push(`/admin/alumni/manage-access/${id}`); // Navigates to /id/{id}
    };

    const handleApprove = () => {
        setToast({type: 'success', message: `${name} has been approved!`})
    }

    const handleDecline = () => {
        setToast({type: 'fail', message: `${name} has been declined!`})
    }

    return (
        <>
        {toast && (
          <ToastNotification
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
        
        <div className="flex justify-center gap-3">
            <button
                className="gray-button font-sb"
                onClick={handleClick}
            >
                View
            </button>
            <button
                className="green-button font-sb"
                onClick={handleApprove}
            >
                Approve
            </button>
            <button
                className="red-button font-sb"
                onClick={handleDecline}
            >
                Decline
            </button>
        </div>
        </>
    );
}
