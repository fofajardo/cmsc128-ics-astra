"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import { useSignedInUser } from "./UserContext";
import { AlertCircle, X } from "lucide-react";
import axios from "axios";
import ToastNotification from "@/components/ToastNotification";

export function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={"inline-flex items-baseline text-astrablack hover:text-astradark font-rb"}
    >
      <span className="mr-1 text-xl">←</span>
      Go Back
    </button>
  );
}


export function ActionButton({ label, color, size = "small", flex, onClick, route, notifyMessage, notifyType }) {
  const router = useRouter();
  const [toast, setToast] = useState(null);

  const handleClick = () => {
    if (onClick) return onClick();
    if (route) return router.push(route);
    if (notifyMessage) {
      setToast({ type:notifyType || "success", message: notifyMessage});
    }
  };

  const sizeClasses = {
    small: "px-3 py-2 font-sb",
    medium: "px-5 py-2 font-sb",
    large: "px-5 py-2 font-rb",
  };

  return (
    <>
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <button className={`${color}-button ${sizeClasses[size] || sizeClasses.small} ${flex}`} onClick={handleClick}>
        {label}
      </button>
    </>
  );
}

export default function ReportForm({contentType, close, id}){
  const user = useSignedInUser();
  const [reportDetails, setDetails] = useState("");
  const type = {"Job": 0, "Event": 1, "Project": 2};

  const handleReport = async () => {
    const payload = {
      content_id: id,
      details: reportDetails,
      type: type[contentType],
      reporter_id: user.state.user.id,
    };
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/reports`, payload);

      if (response.data.status === "CREATED") {
        close();
      }
    } catch (error) {
      console.error("Failed to submit report:", error);
    }
  };

  return(
    <div className="fixed inset-0 h-auto bg-astrablack/60 flex items-center justify-center z-[100]" onClick={(e)=>e.stopPropagation()}>
      <div className="bg-astrawhite max-w-[450px] w-19/20 min-h-[100px] h-auto max-h-[95vh] rounded-xl pt-8 pb-5 overflow-y-auto">

        <div className='flex items-center justify-between border-b-1 border-b-black/30 px-8 pb-4'>
          <h1 className="text-astrablack text-2xl font-semibold">Report {contentType}</h1>
          <X onClick={close} size={25} color='black' className='!cursor-pointer z-[111]'/>
        </div>

        <form className="grid grid-cols-1 gap-4 mt-5 px-8">
          <div className='col-span-1'>
            <div className='flex flex-row gap-2 items-center justify-between'>
              <label className='text-black font-medium text-lg'>Describe the issue</label>
            </div>
            <textarea  type="text" placeholder="Briefly explain what is wrong with this content. You can mention any violations, inaccuracies, or inappropriate elements."
              onChange={(e)=>setDetails(e.target.value)} name={"reportDetails"} value={reportDetails} className='focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm resize-none h-[180px]'></textarea>
          </div>
        </form>
        <div className="flex justify-end my-4 px-8 gap-2">
          <button onClick={close} className="!cursor-pointer text-astraprimary border-1 border-astraprimary font-semibold w-23 py-2 rounded-lg text-base">Cancel</button>
          <button onClick={handleReport} className="focus:border-astraprimary !cursor-pointer text-astrawhite border-1 border-astraprimary bg-astraprimary font-semibold w-24 py-2 rounded-lg text-base">Submit</button>
        </div>
      </div>
    </div>
  );
}

export function ReportButton({ contentType, onSubmit, id }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div onClick={()=>setShowForm(true)} className="flex items-center cursor-pointer group border border-astrawhite pl-2 pr-1 py-0.75 rounded-3xl transition-all duration-250 hover:border-astradark hover:pl-3">
      <p className="text-[13px] mr-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250">
        Report {contentType}
      </p>
      <div className="relative w-5 h-5 flex items-center justify-center">
        <span className="absolute inline-flex h-full w-full rounded-full bg-astradark opacity-30 animate-ping group-hover:hidden [animation-duration:1.75s]" />
        <AlertCircle size={20} className="relative z-3 text-astradark transition-colors duration-300 group-hover:text-astradark"
        />
      </div>
      {showForm && <ReportForm contentType={contentType} close={()=>setShowForm(false)} id={id}/>}
    </div>
  );
}