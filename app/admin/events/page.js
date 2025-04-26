"use client";

import { useState } from "react";
import { TableHeader, Table, PageTool } from '@/components/TableBuilder';
import SearchFilter from "./filter";
import { ActionButton } from "@/components/Buttons";
import { useTab } from '../../components/TabContext';
import ToastNotification from "@/components/ToastNotification";
import { Trash2, Eye, Pencil } from "lucide-react";
import eventList from './eventDummy'; 

export default function Events() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: Math.ceil(eventList.length / 10),
    numToShow: 10,
    total: eventList.length,
  });

  const startIndex = (pagination.currPage - 1) * pagination.numToShow;
  const endIndex = startIndex + pagination.numToShow;
  const paginatedEvents = eventList.slice(startIndex, endIndex);

  return (
    <div>
      {showFilter && (
        <div
          onClick={toggleFilter}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div onClick={(e) => e.stopPropagation()}>
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

      <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
        <div className="flex flex-col py-4 px-1 md:px-4 lg:px-8">
          <TableHeader info={info} pagination={pagination} toggleFilter={toggleFilter} />
          <Table cols={cols} data={createRows(paginatedEvents, selectedIds, setSelectedIds)} />
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
      </div>
    </div>
  );
}

// Columns
const cols = [
  { label: 'Event Name', justify: 'start', visible: 'all' },
  { label: 'Location', justify: 'center', visible: 'md' },
  { label: 'Type', justify: 'center', visible: 'lg' },
  { label: 'Date', justify: 'center', visible: 'sm' },
  { label: 'Going', justify: 'center', visible: 'sm' },
  { label: 'Interested', justify: 'center', visible: 'md' },
  { label: 'Quick Actions', justify: 'center', visible: 'all' },
];

// Row Formatter
function createRows(events, selectedIds, setSelectedIds) {
  return events.map((event) => ({
    'Event Name': renderTitle(event.event_name),
    'Location': renderText(event.location),
    'Type': renderText(event.type),
    'Date': renderText(event.date),
    'Going': renderText(event.going),
    'Interested': renderText(event.interested),
    'Quick Actions': renderActions(event.id, event.event_name),
  }));
}

// Render Helpers
function renderTitle(title) {
  return (
    <div className="font-s font-semibold py-5 pl-4 md:pl-6 lg:pl-8">
      {title}
    </div>
  );
}

function renderText(text) {
  return (
    <div className="text-center text-astradarkgray font-s">
      {text}
    </div>
  );
}

function renderActions(id, title) {
  return (
    <div className="flex justify-end gap-2 md:gap-3 pr-4 md:pr-6 lg:pr-8">
      {/* View */}
      <div className="hidden md:block">
        <ActionButton
          label="View"
          color="gray"
          route={`/admin/events/${id}/view`}
        />
      </div>
      <div className="block md:hidden">
        <ActionButton
          label={<Eye size={20} />}
          color="gray"
          route={`/admin/events/${id}/view`}
        />
      </div>

      {/* Edit */}
      <div className="hidden md:block">
        <ActionButton
          label="Edit"
          color="blue"
          route={`/admin/events/${id}/edit`}
        />
      </div>
      <div className="block md:hidden">
        <ActionButton
          label={<Pencil size={20} />}
          color="blue"
          route={`/admin/events/${id}/edit`}
        />
      </div>

      {/* Delete */}
      <div className="hidden md:block">
        <ActionButton
          label="Delete"
          color="red"
          notifyMessage={`${title} has been deleted!`}
          notifyType="fail"
        />
      </div>
      <div className="block md:hidden">
        <ActionButton
          label={<Trash2 size={20} />}
          color="red"
          notifyMessage={`${title} has been deleted!`}
          notifyType="fail"
        />
      </div>
    </div>
  );
}
