'use client';

import { ListFilter } from "lucide-react";
import Select from "react-select";
import { jobTypeOptions, statusOptions, locationTypeOptions } from "../../(home)/jobs/dummy";

export default function Filter() {
    const selectStyles = {
        control: () =>
        '!cursor-pointer m-0 p-0 text-[var(--color-astrablack)] outline-none bg-[var(--color-astrawhite)] border border-[var(--color-astraprimary)] font-normal pl-4 w-[130px] h-[45px] rounded-lg',
        valueContainer: () => 'm-0 p-0',
        placeholder: () => 'text-[var(--color-astrablack)]',
        dropdownIndicator: () => 'px-2 py-0 text-[var(--color-astraprimary)]',
        indicatorSeparator: () => 'hidden',
        menu: () => 'mt-2 p-2 bg-[var(--color-astrawhite)] border border-[var(--color-astraprimary)] rounded-lg',
        option: ({ isSelected, isFocused }) =>
        `cursor-pointer px-3 py-2 text-sm text-[var(--color-astrablack)] rounded-sm ${
            isSelected || isFocused
            ? 'bg-[var(--color-astratintedwhite)]'
            : 'bg-[var(--color-astrawhite)]'
        }`,
    }

    return (
    <form className="w-19/20 pb-8 flex flex-wrap items-end justify-center gap-4">
        
        {/* Job Type */}
        <Select unstyled options={jobTypeOptions} placeholder="Job Type" instanceId="jobType"
            classNames={{...selectStyles , control: (state) => `!cursor-pointer m-0 p-0 text-[var(--color-astrablack)] outline-none bg-[var(--color-astrawhite)] border border-[var(--color-astraprimary)] font-normal pl-4 w-[130px] h-[45px] rounded-lg hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] ${state.isFocused ? '-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.25)]' : '-translate-y-0'} transition-all duration-200 ease-out`}}/>
        
        {/* Status */}
        <Select unstyled options={statusOptions} placeholder="Status" instanceId="status"
        classNames={{...selectStyles, control: (state) => `!cursor-pointer m-0 p-0 text-[var(--color-astrablack)] outline-none bg-[var(--color-astrawhite)] border border-[var(--color-astraprimary)] font-normal pl-4 w-[111px] h-[45px] rounded-lg hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] ${state.isFocused ? '-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.25)]' : '-translate-y-0'}`}}/>
        
        {/* Location */}
        <div className="grid grid-cols-1 -translate-y-0 hover:-translate-y-1 focus:-translate-y-1 " tabIndex={0}>
            <label className="ml-2 text-sm">Location</label>
            <input type="text" className="text-astrablack bg-astrawhite outline outline-transparent border-1 border-astraprimary font-normal px-4 h-[45px] w-40 rounded-lg placeholder:text-astradarkgray hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] focus:shadow-[0_2px_6px_rgba(0,0,0,0.25)]" placeholder="City/Country"></input>
        </div>

        {/* Location Type */}
        <Select unstyled options={locationTypeOptions} placeholder="Location Type" instanceId="locationType"
        classNames={{...selectStyles, control: (state) => `!cursor-pointer m-0 p-0 text-[var(--color-astrablack)] outline-none bg-[var(--color-astrawhite)] border border-[var(--color-astraprimary)] font-normal pl-4 w-[155px] h-[45px] rounded-lg hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] ${state.isFocused ? '-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.25)]' : '-translate-y-0'}`}}/>

        {/* Salary Range */}
        <div className="grid grid-cols-1 -translate-y-0 hover:-translate-y-1 focus:-translate-y-1 " tabIndex={0}>
            <label className="ml-2 text-sm">Salary Range (₱)</label>
            <div className="flex gap-1 items-center">
                <input type="number" className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-astrablack bg-astrawhite outline outline-transparent border-1 border-astraprimary font-normal px-4 h-[45px] w-32 rounded-lg placeholder:text-astradarkgray hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] focus:shadow-[0_2px_6px_rgba(0,0,0,0.25)]" placeholder="Minimum"></input>
                <hr className="w-2 h-[2px] bg-astraprimary text-transparent"></hr>
                <input type="number" className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-astrablack bg-astrawhite outline outline-transparent border-1 border-astraprimary font-normal px-4 h-[45px] w-32 rounded-lg placeholder:text-astradarkgray hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] focus:shadow-[0_2px_6px_rgba(0,0,0,0.25)]" placeholder="Maximum"></input>
            </div>
        </div>

        {/* Most Recent */}
        <button className="!cursor-pointer flex items-center justify-between text-astrablack bg-astrawhite outline outline-transparent border-1 border-astraprimary font-normal px-4 h-[45px] w-40 rounded-lg placeholder:text-astradarkgray -translate-y-0 hover:-translate-y-1 focus:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] focus:shadow-[0_2px_6px_rgba(0,0,0,0.25)] hover:scale-none" tabIndex={0}>
            <p>Most Recent</p>
            <ListFilter className="text-[var(--color-astraprimary)]" size={29}/>
        </button>

    </form>
  )}
  