'use client';

import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
    const [searchString, setSearchString] = useState('');

    const handleSearch = (event) => {
        // search logic here
        
        event.preventDefault()
    }

    return (
    <form onSubmit={handleSearch} className="bg-astrawhite w-4xl h-[55px] rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] py-6 flex items-center justify-between gap-2 mb-4">
        <div className="h-full flex items-center gap-3 ml-3 w-full">
            <Search className="text-[var(--color-astradarkgray)]"  size={28}/>
            <input type="text" placeholder="Search for job title" value={searchString} onChange={(e)=>setSearchString(e.target.value)} className="font-normal text-sm text-astradarkgray outline-none focus:border-b-1 border-0 border-astraprimary/50 focus:pb-1 w-full transition-all duration-150 ease-in"></input>
        </div>
        <input type="submit" value={"Search"} className="!cursor-pointer text-sm text-astrawhite bg-astraprimary hover:bg-astradark hover:translate-x-1 font-semibold w-[100px] h-[55px] rounded-md transition-all duration-100 ease-in-out"></input>
    </form>
  )}
  