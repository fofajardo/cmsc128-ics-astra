"use client"
import { useState, useEffect } from "react";
import {TableHeader, Table, PageTool} from '@/components/TableBuilder';
import SearchFilter from "admin/alumni/search/filter";
import { Check } from "lucide-react";
import { ActionButton } from "@/components/Buttons";
import { useTab } from '@/components/TabContext';
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";


export default function CommunicationPage() {
    const [showFilter, setShowFilter] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const { currTab, info } = useTab();
    const [toast, setToast] = useState(null);
    console.log("Current tab from layout:", currTab);

    useEffect(() => {
      setSelectedIds([]);
    }, [currTab]);


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

        {toast && (
          <ToastNotification
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {/* Table section */}
        <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
            <div className='flex flex-col py-4 px-1 md:px-4 lg:px-8'>
                <TableHeader info={info} pagination={pagination} toggleFilter={toggleFilter} />
                {currTab === 'Announcements' && (
                    <h1 className="font-h2 bg-astrawhite p-6 justify-center flex">
                        Put your announcements content here
                    </h1>
                )}
                {currTab === 'Newsletters' && (
                    <h1 className="font-h2 bg-astrawhite p-6 justify-center flex">
                        Put your Newsletters content here
                    </h1>
                )}
                {/* MODIFY THIS TABLE AS NEEDED */}
                {currTab === 'Requests' && (
                    <Table cols={cols} data={createRows(selectedIds, setSelectedIds, currTab)} />
                )}

                <PageTool pagination={pagination} setPagination={setPagination} />
            </div>
            <div className="flex flex-row justify-between md:pl-4 lg:pl-8">
                <ActionButton label="Reset Selection" color = "blue" onClick={() => setSelectedIds([])}/>
                
                <BottomButtons selectedCount={selectedIds.length} currTab={currTab} setToast={setToast}/>
            </div>
        </div>
      </div>
    );
  }



  function getNotifyContent(action, selectedCount) {
    const plural = selectedCount > 1 ? "s" : "";
    let message = "";
    let type = "success";
  
    switch (action) {
      case "approve":
        message = selectedCount > 0
          ? `${selectedCount} pending account${plural} have been approved!`
          : "All pending accounts have been approved!";
        break;
      case "decline":
        message = selectedCount > 0
          ? `${selectedCount} pending account${plural} have been declined!`
          : "All pending accounts have been declined!";
        type = "fail";
        break;
      case "remove":
        message = selectedCount > 0
          ? `Access has been removed from ${selectedCount} accounts!`
          : "Access has been removed from all active accounts!";
        type = "fail";
        break;
      case "reactivate":
        message = selectedCount > 0
          ? `${selectedCount} inactive account${plural} have been reactivated!`
          : "All inactive accounts have been reactivated!";
        break;
    }
  
    return { notifyMessage: message, notifyType: type };
  }
  

  function BottomButtons({ selectedCount, currTab, setToast }) {
    const [modal, setModal] = useState({
      open: false,
      action: null, // "approve", "decline", etc.
      notifyMessage: '',
      notifyType: 'success',
    });
  
    const openModal = (actionType) => {
      const { notifyMessage, notifyType } = getNotifyContent(actionType, selectedCount);
      setModal({ open: true, action: actionType, notifyMessage, notifyType });
    };
  
    const closeModal = () => {
      setModal({ open: false, action: null });
    };
    
    const handleConfirm = () => {
      const { notifyMessage, notifyType } = getNotifyContent(modal.action, selectedCount);
    
      closeModal(); // first close the modal
    
      setTimeout(() => {
        setToast({
          type: notifyType,
          message: notifyMessage
        });
      }, 50);
    };
    
  
    const modals = {
      approve: {
        title: `${selectedCount > 0 ? `Approve ${selectedCount} Accounts?` : `Approve All Accounts?`}`,
        desc: selectedCount > 0
          ? `You are about to approve ${selectedCount} selected pending accounts.`
          : `You are about to approve all pending accounts.`,
        label: selectedCount > 0 ? "Approve" : "Approve All",
        color: "green"
      },
      decline: {
        title: `${selectedCount > 0 ? `Decline ${selectedCount} Accounts?` : `Decline All Accounts?`}`,
        desc: selectedCount > 0
          ? `You are about to decline ${selectedCount} selected pending accounts.`
          : `You are about to decline all pending accounts.`,
        label: selectedCount > 0 ? "Decline" : "Decline All",
        color: "red"
      },
      remove: {
        title: `${selectedCount > 0 ? `Remove Access from ${selectedCount} Accounts?` : `Remove Access from All?`}`,
        desc: selectedCount > 0
          ? `You are about to remove access from ${selectedCount} approved accounts.`
          : `You are about to remove access from all approved accounts.`,
        label: selectedCount > 0 ? "Remove Access" : "Remove All Access",
        color: "red"
      },
      reactivate: {
        title: `${selectedCount > 0 ? `Reactivate ${selectedCount} Accounts?` : `Reactivate All Accounts?`}`,
        desc: selectedCount > 0
          ? `You are about to reactivate ${selectedCount} inactive accounts.`
          : `You are about to reactivate all inactive accounts.`,
        label: selectedCount > 0 ? "Reactivate" : "Reactivate All",
        color: "blue"
      }
    };
  
    return (
      <>
        <div className="flex gap-3 md:pr-4 lg:pr-8">
          {currTab === "Announcements" && (
            <ActionButton
                label={selectedCount > 0 ? `Reactivate (${selectedCount})` : "Reactivate All"}
                color="blue"
                onClick={() => openModal("reactivate")}
            />
          )}
  
          {currTab === "Newsletters" && (
            <ActionButton
              label={selectedCount > 0 ? `Remove Access (${selectedCount})` : "Remove All"}
              color="red"
              onClick={() => openModal("remove")}
            />
          )}
  
          {currTab === "Requests" && (
        <>
            <ActionButton
              label={selectedCount > 0 ? `Approve (${selectedCount})` : "Approve All"}
              color="green"
              onClick={() => openModal("approve")}
            />
            <ActionButton
              label={selectedCount > 0 ? `Decline (${selectedCount})` : "Decline All"}
              color="red"
              onClick={() => openModal("decline")}
            />
        </>
          )}
        </div>
        
        {modal.open && (
          <ConfirmModal
            isOpen={modal.open}
            onClose={closeModal}
            onConfirm={handleConfirm}
            title={modals[modal.action].title}
            description={modals[modal.action].desc}
            confirmLabel={modals[modal.action].label}
            confirmColor={modals[modal.action].color}
            count={selectedCount > 0 ? selectedCount : null}
          />
        )}
      </>
    );
  }
  
  
  

const cols = [
    { label: 'Checkbox:label-hidden', justify: 'center', visible: 'all'},
    { label: 'Image:label-hidden', justify: 'center', visible: 'all' },
    { label: 'Requester', justify: 'start', visible: 'all' },
    { label: 'Subject', justify: 'center', visible: 'md' },
    { label: 'Details', justify: 'center', visible: 'md' },
    { label: 'Quick Actions', justify: 'center', visible: 'all' },
];

function createRows(selectedIds, setSelectedIds, currTab) {
    return alumList.map((alum) => ({
        'Checkbox:label-hidden': renderCheckboxes(alum.id, selectedIds, setSelectedIds),
        'Image:label-hidden': renderAvatar(alum.image, alum.alumname),
        Requester: renderName(alum.alumname, alum.email),
        'Graduation Year': renderText(alum.graduationYear),
        'Subject': renderText(alum.student_num),
        'Details': renderText(alum.course),
        'Quick Actions': renderActions(alum.id, alum.alumname, currTab),
    }));
}

function renderCheckboxes(id, selectedIds, setSelectedIds) {
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


function renderActions(id, name, currTab) {
    return (

        //Based muna sa currTab pero I think mas maganda kung sa mismong account/user kukunin yung active status
        
      <div className="flex justify-center gap-3 md:pr-4 lg:pr-2">
        <ActionButton
          label="View"
          color="gray"
          route={`/admin/alumni/manage-access/${id}`}
        />
  
        {currTab === 'Announcements' && (
        <div className="hidden lg:block">
          <ActionButton
            label="Reactivate"
            color="blue"
            notifyMessage={`${name} has been reactivated!`}
            notifyType="success"
          />
        </div>
        )}
  
        {currTab === 'Newsletters' && (
          <div className="hidden lg:block">
            <ActionButton
              label="Remove Access"
              color="red"
              notifyMessage={`${name} has been removed!`}
              notifyType="fail"
            />
          </div>
        )}
  
        {currTab === 'Requests' && (
        <>
            <div className="hidden lg:block">
            <ActionButton 
                label="Approve"
                color="green"
                notifyMessage={`${name} has been approved!`}
                notifyType="success"
            />
            </div>
            <div className="hidden lg:block">
            <ActionButton
                label="Decline"
                color="red"
                notifyMessage={`${name} has been declined!`}
                notifyType="fail"
            />
            </div>
        </>
        )}
      </div>
    );
  }
  


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
    