import { SquareUser } from "lucide-react";

export default function SideJobCard(job) {
  return (
    <div className="self-start bg-astrawhite max-w-[1250px] w-full lg:w-12/40 rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] px-10 lg:px-7 pt-8 pb-7">

      <h1 className="text-astrablack text-2xl font-bold">Requirements</h1>
      <p className="mt-5 text-black text-justify whitespace-pre-wrap">{`${job.requirements}`}</p>
      <div className="flex gap-2 items-center mt-5">
        <SquareUser size={28}/>
        <h2 className="text-md text-astrablack leading-5"><span className="font-bold">Hiring Manager: </span>{job.hiring_manager}</h2>
      </div>
    </div>
  );}
