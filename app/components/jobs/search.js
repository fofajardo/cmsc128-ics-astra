import { Icon } from "@iconify/react";

export default function SearchBar() {
    return (
    <form className="bg-astrawhite w-4xl h-[55px] rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] py-6 flex items-center justify-between gap-2 mb-7">
        <div className="h-full flex items-center gap-3 ml-3">
            <Icon icon="lucide:search" width="28" height="28" className="shrink-0 text-astradarkgray"/>
            <input type="text" placeholder="Search for job title" className="font-normal text-sm text-astradarkgray outline-none"></input>
        </div>
        <input type="submit" value={"Search"} className="text-sm text-astrawhite bg-astraprimary font-semibold w-[100px] h-[55px] rounded-md"></input>
    </form>
  )}
  