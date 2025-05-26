"use client";

import JobForm from "../../components/jobs/addJob";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function HiringPrompt({ refreshJobs }) {
  const [showForm, setForm] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setForm(true)}
          className="group relative bg-astraprimary hover:bg-astradark text-astrawhite rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center"
          aria-label="Post a job offer"
        >
          <Plus size={24} />
          <span className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 bg-astrablack text-astrawhite text-sm font-medium px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
            Post a job offer
          </span>
        </button>
      </div>

      {showForm && <JobForm close={() => setForm(false)} refreshJobs={refreshJobs} />}
    </>
  );
}