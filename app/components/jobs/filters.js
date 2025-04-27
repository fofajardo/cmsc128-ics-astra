'use client';

import Select from "react-select";
import { ListFilter } from "lucide-react";
import { useState } from "react";
import { jobTypeOptions, statusOptions, locationTypeOptions } from "../../(home)/jobs/dummy";

export default function Filter() {
    const [formData, setFormData] = useState({job_type: '', status: '', location: '', location_type: '', min_salary: '', max_salary: '', recent: false});
    const [select, setSelect] = useState({job_type: null, status: null, location_type: null}) 

    const handleChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        // console.log({name, value});
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));

        // put filtering logic here
      }

    const handleSelectChange = (selected, { name }) => {
        setSelect({...select, [name]: selected});
        setFormData({...formData, [name]: selected.value})
        // console.log(formData)

        // put filtering logic here as well
    };

    const queryFilter = (e) => {
        e.preventDefault();
        // fetch new results based on filter here
    }

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
    <form onChange={queryFilter} className="w-19/20 pb-8 flex flex-wrap items-end justify-center gap-4">
        
        {/* Job Type */}
        <Select unstyled options={jobTypeOptions} placeholder="Job Type" onChange={handleSelectChange} value={select.job_type} name={"job_type"} instanceId="jobType"
            classNames={{...selectStyles , control: (state) => `!cursor-pointer m-0 p-0 text-[var(--color-astrablack)] outline-none bg-[var(--color-astrawhite)] border border-[var(--color-astraprimary)] font-normal pl-4 w-[130px] h-[45px] rounded-lg hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] ${state.isFocused ? '-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.25)]' : '-translate-y-0'} transition-all duration-200 ease-out`}}/>
        
        {/* Status */}
        <Select unstyled options={statusOptions} placeholder="Status" onChange={handleSelectChange} value={select.status} name={"status"} instanceId="status"
        classNames={{...selectStyles, control: (state) => `!cursor-pointer m-0 p-0 text-[var(--color-astrablack)] outline-none bg-[var(--color-astrawhite)] border border-[var(--color-astraprimary)] font-normal pl-4 w-[111px] h-[45px] rounded-lg hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] ${state.isFocused ? '-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.25)]' : '-translate-y-0'}`}}/>
        
        {/* Location */}
        <div className="grid grid-cols-1 -translate-y-0 hover:-translate-y-1 focus:-translate-y-1 " tabIndex={0}>
            <label className="ml-2 text-sm">Location</label>
            <input type="text" onChange={handleChange} value={formData.location} name={"location"} className="text-astrablack bg-astrawhite outline outline-transparent border-1 border-astraprimary font-normal px-4 h-[45px] w-40 rounded-lg placeholder:text-astradarkgray hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] focus:shadow-[0_2px_6px_rgba(0,0,0,0.25)]" placeholder="City/Country"></input>
        </div>

        {/* Location Type */}
        <Select unstyled options={locationTypeOptions} placeholder="Location Type" onChange={handleSelectChange} value={select.location_type} name={"location_type"} instanceId="locationType"
        classNames={{...selectStyles, control: (state) => `!cursor-pointer m-0 p-0 text-[var(--color-astrablack)] outline-none bg-[var(--color-astrawhite)] border border-[var(--color-astraprimary)] font-normal pl-4 w-[155px] h-[45px] rounded-lg hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] ${state.isFocused ? '-translate-y-1 shadow-[0_2px_6px_rgba(0,0,0,0.25)]' : '-translate-y-0'}`}}/>

        {/* Salary Range */}
        <div className="grid grid-cols-1 -translate-y-0 hover:-translate-y-1 focus:-translate-y-1 " tabIndex={0}>
            <label className="ml-2 text-sm">Salary Range (₱)</label>
            <div className="flex gap-1 items-center">
                <input type="number" onChange={handleChange} value={formData.min_salary} name={"min_salary"} className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-astrablack bg-astrawhite outline outline-transparent border-1 border-astraprimary font-normal px-4 h-[45px] w-32 rounded-lg placeholder:text-astradarkgray hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] focus:shadow-[0_2px_6px_rgba(0,0,0,0.25)]" placeholder="Minimum"></input>
                <hr className="w-2 h-[2px] bg-astraprimary text-transparent"></hr>
                <input type="number" onChange={handleChange} value={formData.max_salary} name={"max_salary"} className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-astrablack bg-astrawhite outline outline-transparent border-1 border-astraprimary font-normal px-4 h-[45px] w-32 rounded-lg placeholder:text-astradarkgray hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] focus:shadow-[0_2px_6px_rgba(0,0,0,0.25)]" placeholder="Maximum"></input>
            </div>
        </div>

        {/* Most Recent */}
        <button onClick={(e) => {e.preventDefault(); setFormData({...formData, recent: !formData.recent})}} value={formData.recent} name={"recent"} className={`${formData.recent ? 'bg-[var(--color-astraprimary)] text-[var(--color-astrawhite)]' : 'text-[var(--color-astrablack)] bg-[var(--color-astrawhite)]'} !cursor-pointer flex items-center justify-between outline outline-transparent border-1 border-astraprimary font-normal px-4 h-[45px] w-40 rounded-lg placeholder:text-astradarkgray -translate-y-0 hover:-translate-y-1 focus:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)] focus:shadow-[0_2px_6px_rgba(0,0,0,0.25)] hover:scale-none`} tabIndex={0}>
            <p>Most Recent</p>
            <ListFilter className={`${formData.recent ? 'text-[var(--color-astrawhite)]' : 'text-[var(--color-astraprimary)]'}`} size={29}/>
        </button>

    </form>
  )}
  