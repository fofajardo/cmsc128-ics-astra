import BigJobCard from "../../../../components/jobs/view/bigJobCard";
import SmallJobCard from "../../../../components/jobs/view/smallJobCard";
import Back from "../../../../components/jobs/view/back";
import {job} from "../../dummy";
import SideJobCard from "@/components/jobs/view/sideJobCard";

export default function JobsPage() {
    return (
    <div className="py-8 bg-astratintedwhite w-full flex flex-col items-center">

        <Back/>
        <div className="flex justify-between gap-y-2 flex-wrap max-w-[1250px] w-19/20">
            <BigJobCard {...job}/> <SideJobCard {...job}/>
        </div>

        <div className="h-11"/>
       
        <SmallJobCard job={job} showApply={true}/>
    </div>
  )}
  