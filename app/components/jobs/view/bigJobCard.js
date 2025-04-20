export default function BigJobCard(job) {
    return (
    <div className="bg-astrawhite max-w-[1250px] min-w-[750px] w-19/20 min-h-[308px] h-auto rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-10 pb-7">
        
        <h1 className="text-astrablack text-2xl font-bold">{job.job_title}</h1>
        <h2 className="text-md text-astrablack leading-4"><span className="font-bold">Offered by </span>{job.company_name}</h2>
        
        <p className="mt-5 text-black text-justify">{`${job.details}`}</p>

    </div>
  )}
  