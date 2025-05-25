"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Trash2 } from "lucide-react";
import ConfirmationPrompt from "../edit/confirmation";

export default function BigJobCardwDelete({ job = {}, content = {} }) {
  const [showPrompt, setPrompt] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/jobs/${id}`);
      if (response.data.status === "DELETED") {
        router.push("/admin/jobs"); // Redirect after successful deletion
      } else {
        ; // console.error("Failed to delete job.");
      }
    } catch (error) {
      ; // console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="bg-astrawhite max-w-[1250px] w-full lg:w-27/40 min-h-[308px] h-auto rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] lg:p-10 pb-7 pt-10 px-7">
      <div className="flex items-start gap-2">
        <div className="mr-2">
          <h1 className="text-astrablack text-2xl font-bold">{job.job_title}</h1>
          <h2 className="text-md text-astrablack leading-4"><span className="font-bold">Offered by </span>{job.company_name}</h2>
        </div>
        <button
          onClick={() => setPrompt(true)}
          className="hover:scale-none hover:bg-astrared/85 bg-astrared !cursor-pointer text-astrawhite font-bold w-8 py-2 rounded-md text-xs flex items-center justify-center"
        >
          <Trash2 />
        </button>
      </div>

      <p className="mt-5 text-black text-justify whitespace-pre-wrap">{`${content.details}`}</p>

      {showPrompt && (
        <ConfirmationPrompt
          prompt="Are you sure you want to delete this job posting?"
          close={() => setPrompt(false)}
          handleConfirm={handleDelete}
        />
      )}
    </div>
  );
}
