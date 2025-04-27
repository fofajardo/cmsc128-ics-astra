'use client';

import { useState } from "react";
import { useParams } from "next/navigation";
import JobForm from "../../../components/jobs/edit/editJob";
import ConfirmationPrompt from "./confirmation";

export default function BigJobCardwEdit(job) {
    const [showPrompt, setPrompt] = useState(false);
    const [showForm, setForm] = useState(false);

    const { id } = useParams();
    
    const handleDelete = () => {
        // handle delete job id logic here
        
        setPrompt(false);
    };

    return (
        <div className="bg-astrawhite max-w-[1250px] w-19/20 lg:w-12/20 min-h-[308px] h-auto rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] lg:p-10 pb-7 pt-10 px-7">
        
        <div className="flex items-start gap-2">
            <div className="mr-2">
                <h1 className="text-astrablack text-2xl font-bold">{job.job_title}</h1>
                <h2 className="text-md text-astrablack leading-4"><span className="font-bold">Offered by </span>{job.company_name}</h2>
            </div>
            <button onClick={()=>{setForm(true)}} className="hover:bg-astradark hover:scale-none !cursor-pointer text-astrawhite border-1 border-astraprimary bg-astraprimary font-semibold w-16 py-2 rounded-lg text-lg">Edit</button>
            <button onClick={()=>{setPrompt(true)}} className="hover:scale-none hover:opacity-70 !cursor-pointer text-astraprimary border-1 border-astraprimary font-semibold w-20 py-2 rounded-lg text-lg">Delete</button>
        </div>
        
        <p className="mt-5 text-black text-justify">{`${job.details}`}</p>
        {showForm ? <JobForm close={()=>setForm(false)} job={job}/> : <></>} 
        {showPrompt ? <ConfirmationPrompt isEdit={false} close={()=>setPrompt(false)} object={id} handleConfirm={handleDelete}/> : <></>} 
    </div>
  )}
  