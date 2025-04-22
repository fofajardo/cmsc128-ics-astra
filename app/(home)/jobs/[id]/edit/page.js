import BigJobCardwEdit from "../../../../components/jobs/edit/bigJobCardwEdit";
import SmallJobCard from "../../../../components/jobs/view/smallJobCard";
import Back from "../../../../components/jobs/view/back";
import {job} from "../../dummy";

export default function JobsPage() {

    return (
    <div className="mt-[80px] py-8 bg-astratintedwhite w-full flex flex-col items-center">
        
        <Back/>

        <BigJobCardwEdit {...job}/>

        <div className="h-11"/>
       
        <SmallJobCard {...job}/>
    </div>
  )}
  