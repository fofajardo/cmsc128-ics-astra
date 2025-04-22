'use client';

import JobForm from "../../components/jobs/addJob";
import { useState } from "react";

export default function HiringPrompt() {
    const [showForm, setForm] = useState(false);

    return (
    <div className="bg-astrawhite w-4xl h-[110px] rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-6 flex items-center justify-between gap-2 mb-7">
        <div className="w-3/10 h-4/5 flex flex-col justify-end">
            <h1 className="font-semibold text-xl text-astrablack leading-6">Post a job</h1>
            <p className="font-normal text-sm text-astradarkgray">Promote career opportunities</p>
        </div>
        <div className="w-7/10 h-4/5 flex items-center justify-start">
            <button onClick={()=>setForm(true)}className="!cursor-pointer text-left bg-astratintedwhite font-normal text-sm text-astradarkgray py-7 px-4 rounded-2xl inset-shadow-[0_1px_4px_rgba(0,0,0,0.25)] w-full">What job are you hiring for?..</button>
        </div>

        {showForm ? <JobForm close={()=>setForm(false)}/> : <></>} 
    </div>
  )}
  