import SmallJobCard from "@/components/jobs/view/smallJobCard";
import Back from "@/components/jobs/view/back";
import {job} from "../../dummy";
import BigJobCardwDelete from "@/components/jobs/admin/bigJobCardwDelete";

export default function JobsAdminPage() {
    return (
    <div className="mt-[80px] py-8 bg-astratintedwhite w-full flex flex-col items-center">

        <Back/>

        <BigJobCardwDelete {...job}/>

        <div className="h-11"/>
       
        <SmallJobCard job={job} showApply={false}/>
    </div>
  )}
  