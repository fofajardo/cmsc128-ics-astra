'use client';

import { useState } from "react";
import ConfirmationPrompt from "../edit/confirmation";
import { useParams } from "next/navigation";

export default function BigJobCardwDelete(job) {
    const [showPrompt, setPrompt] = useState(false);
    const { id } = useParams();

    const handleDelete = () => {
        // handle delete job id logic here
        
        setPrompt(false);
    };

    return (
    <div className="bg-astrawhite max-w-[1250px] w-19/20 min-h-[308px] h-auto rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-10 pb-7">
        
        <div className="flex items-start gap-2">
            <div className="mr-2">
                <h1 className="text-astrablack text-2xl font-bold">{job.job_title}</h1>
                <h2 className="text-md text-astrablack leading-4"><span className="font-bold">Offered by </span>{job.company_name}</h2>
            </div>
            <button onClick={()=>{setPrompt(true)}} className="hover:scale-none hover:bg-astrared/85 bg-astrared !cursor-pointer text-astrawhite font-bold w-16 py-2 rounded-md text-xs">Delete</button>
        </div>
        
        <p className="mt-5 text-black text-justify">{`${job.details}`}</p>
        {showPrompt ? <ConfirmationPrompt isEdit={false} close={()=>setPrompt(false)} object={id} handleConfirm={handleDelete}/> : <></>} 
    </div>
  )}
  