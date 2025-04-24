"use client"
import { useState, useEffect } from "react";
import {TableHeader, Table, PageTool} from '@/components/TableBuilder';
import SearchFilter from "./filter";
import { ActionButton } from "@/components/Buttons";
import { useTab } from '../../components/TabContext';
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";
import { jobList }from './dummy';
import { Trash2, Eye } from "lucide-react";


export default function Jobs() {
    const [showFilter, setShowFilter] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const { currTab, info } = useTab();
    const [toast, setToast] = useState(null);
    // console.log("Current tab from layout:", info);

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
                <Table cols={cols} data={createRows(selectedIds, setSelectedIds, currTab)} />
                <PageTool pagination={pagination} setPagination={setPagination} />
            </div>
            <div className="flex flex-row justify-between md:pl-4 lg:pl-8">
                {/* <ActionButton label="Reset Selection" color = "blue" onClick={() => setSelectedIds([])}/> */}
                {/* <BottomButtons selectedCount={selectedIds.length} currTab={currTab} setToast={setToast}/> */}
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
          {currTab === "Pending" && (
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
  
          {currTab === "Approved" && (
            <ActionButton
              label={selectedCount > 0 ? `Remove Access (${selectedCount})` : "Remove All"}
              color="red"
              onClick={() => openModal("remove")}
            />
          )}
  
          {currTab === "Inactive" && (
            <ActionButton
              label={selectedCount > 0 ? `Reactivate (${selectedCount})` : "Reactivate All"}
              color="blue"
              onClick={() => openModal("reactivate")}
            />
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
    { label: 'Title', justify: 'start', visible: 'all' },
    { label: 'Company', justify: 'center', visible: 'sm' },
    { label: 'Location', justify: 'center', visible: 'lg' },
    { label: 'Type', justify: 'center', visible: 'lg' },
    { label: 'Posted', justify: 'center', visible: 'lg' },
    { label: 'Status', justify: 'center', visible: 'md' },
    { label: 'Quick Actions', justify: 'center', visible: 'all' },
];

function createRows(selectedIds, setSelectedIds, currTab) {
    return jobList.map((job) => ({
        'Title': renderTitle(job.job_title),
        'Company': renderText(job.company_name),
        'Location': renderText(job.location),
        'Type': renderText(job.job_type),
        'Posted': renderText(job.created_at),
        'Status': renderStatus(job.status),
        'Quick Actions': renderActions(job.id, job.job_title, currTab),
    }));
}

function renderTitle(name) {
    return (
        <div>
            <div className="font-s font-semibold py-5 pl-2 ">{name}</div>
        </div>
    );
}

function renderText(text) {
    return <div className="text-center text-astradarkgray font-s">{text}</div>;
}


function renderStatus(text) {
    return <div className={`text-center ${text === 'Expired' ? 'text-astrared' : 'text-astragreen'} font-s`}>{text}</div>;
}

function renderActions(id, name) {
    return (

        //Based muna sa currTab pero I think mas maganda kung sa mismong account/user kukunin yung active status
        
      <div className="flex justify-center gap-3 md:pr-4 lg:pr-2">
        <div className="hidden md:block">
            <ActionButton
            label="View"
            color="gray"
            route={`/admin/jobs/${id}/view`}
            />
        </div>
        <div className="block md:hidden">
            <ActionButton
            label={<Eye size={20}/>}
            color="gray"
            route={`/admin/jobs/${id}/view`}
            />
        </div>
        <div className="hidden md:block">
            <ActionButton
            label="Delete"
            color="red"
            notifyMessage={`${name} has been declined!`}
            notifyType="fail"
            />
        </div>
        <div className="block md:hidden">
            <ActionButton
            label={<Trash2 size={20}/>}
            color="red"
            notifyMessage={`${name} has been declined!`}
            notifyType="fail"
            />
        </div>
      </div>
    );
  }


    