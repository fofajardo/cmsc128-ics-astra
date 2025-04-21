'use client';

import {X} from 'lucide-react';
import Select from 'react-select';
import { useState } from 'react';

export default function JobForm({isEdit, close}){
    const employmentOptions =[{value: "1", label: "Part-Time"},{value: "2", label: "Full-time"}, {value: "3", label: "Temporary"}, {value: "4", label: "Freelance"}]
    const locationOptions =[{value: "1", label: "Onsite"},{value: "2", label: "Remote"}, {value: "3", label: "Hybrid"}]
    const statusOptions =[{value: "1", label: "Open"},{value: "2", label: "Closed"}]
    
    const [formData, setFormData] = useState({company_name: '', job_title: '', location: '', salary: '', apply_link: ''});
    const [employmentType, setEmploymentType] = useState(null)
    const [locationType, setLocationType] = useState(null)
    const [status, setStatus] = useState(null)

    const handleChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        console.log({name, value});
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }

    const selectStyle = {
        control: () =>
        'outline-none border-1 border-[#C4C4C4] rounded-sm w-full min-h-[30px] min-h-[unset] h-[30px] mt-1.5 px-3 text-sm',
        valueContainer: () => 'm-0 p-0 h-full flex items-center',
        placeholder: () => 'text-[var(--color-astradarkgray)] p-0 m-0',
        dropdownIndicator: ({menuIsOpen}) => `py-0 text-[var(--color-astraprimary)] transition-transform duration-300 ease-in-out ${menuIsOpen ? 'rotate-180' : ''}`,
        indicatorSeparator: () => 'hidden',
        singleValue: () => 'leading-none',
        menu: () => 'mt-1 bg-[#F8F8F8] border border-[#C4C4C4] rounded-b-md',
        option: ({ isSelected, isFocused }) =>
        `cursor-pointer px-3 py-2 text-[var(--color-astrablack)] rounded-sm leading-none ${
            isSelected || isFocused
            ? 'bg-[var(--color-astratintedwhite)]'
            : 'bg-[#F8F8F8]'
        }`,
    }

    const selectBaseStyle = {
        control: (base) => ({...base, minHeight: '30px'}),
        option: (base) => ({...base, fontSize: '14px'}) 
    }

    return (
    <div className="fixed inset-0 h-auto bg-astrablack/60 flex items-center justify-center z-100">
        <div className="bg-[#F8F8F8] max-w-[1000px] w-19/20 min-h-[100px] h-auto max-h-[95vh] rounded-xl pt-8 pb-5 overflow-y-auto">
            
            <div className='flex items-end justify-between border-b-1 border-b-black/30 px-8 pb-4'>
                <h1 className="text-astrablack text-2xl font-semibold">Add Job Details</h1>
                <X onClick={close} size={25} color='black'/>
            </div>

            <form className="grid grid-cols-2 gap-4 mt-5 px-8">
                
                <div className='col-span-2'>
                    <label className='block text-black font-medium text-lg'>Company</label>
                    <input type="text" placeholder="Ex: Google" onChange={handleChange} value={formData.company_name} name="company_name" className='placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'></input>
                </div>

                <div className=''>
                    <label className='block text-black font-medium text-lg'>Title</label>
                    <input type="text" placeholder="Ex: User Experience Researcher" onChange={handleChange} value={formData.job_title} name="job_title" className='placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'></input>
                </div>
                
                <div>
                    <label className='block text-black font-medium text-lg'>Employment Type</label>
                    <Select unstyled options={employmentOptions} placeholder="Please Select" onChange={setEmploymentType} value={employmentType} instanceId="employmentType" classNames={selectStyle}
                        styles={selectBaseStyle}/>
                </div>
                
                <div className=''>
                    <label className='block text-black font-medium text-lg'>Location</label>
                    <input type="text" placeholder="Ex: Santa Rosa City, Laguna" onChange={handleChange} value={formData.location} name="location" className='placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'></input>
                </div>

                <div>
                    <label className='block text-black font-medium text-lg'>Location Type</label>
                    <Select unstyled options={locationOptions} placeholder="Please Select" onChange={setLocationType} value={locationType} instanceId="locationType" classNames={selectStyle}
                        styles={selectBaseStyle}/>
                </div>

                <div className=''>
                    <label className='block text-black font-medium text-lg'>Job Salary (₱)</label>
                    <input type="text" placeholder="Ex: ₱40,000 - ₱50,000" onChange={handleChange} value={formData.salary} name="salary" className='placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'></input>
                </div>

                <div>
                    <label className='block text-black font-medium text-lg'>Job Status</label>
                    <Select unstyled options={statusOptions} placeholder="Please Select" onChange={setStatus} value={status} instanceId="status"classNames={selectStyle}
                        styles={selectBaseStyle}/>
                </div>

                <div className=''>
                    <label className='block text-black font-medium text-lg'>Deadline of Applications</label>
                    <input  type="date" placeholder="YYYY/MM/DD" onChange={handleChange} className='placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'
                            style={{ colorScheme: 'light', accentColor: '#0E6CF3' }}></input>
                </div>

                <div className=''>
                    <label className='block text-black font-medium text-lg'>Application Link</label>
                    <input type="text" placeholder="Ex: https://hiring.com/apply" onChange={handleChange} value={formData.apply_link} name="apply_link" className='placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'></input>
                </div>

                <div className='col-span-2'>
                    <label className='block text-black font-medium text-lg'>Job Description</label>
                    <textarea  type="text" placeholder="Provide a concise overview of the role, including job requirements, key responsibilities, and objectives. You may also include your company’s representative email for additional inquiries." 
                            className='placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm resize-none h-[110px]'></textarea>
                </div>
            </form>

            <div className="flex justify-between my-4 px-8">
                <button className="text-astraprimary border-1 border-astraprimary font-semibold w-35 py-2 rounded-lg text-base">Clear Details</button>
                <button className="text-astrawhite border-1 border-astraprimary bg-astraprimary font-semibold w-35 py-2 rounded-lg text-base">Publish Post</button>
            </div>

        </div>
    </div>
  )}
  