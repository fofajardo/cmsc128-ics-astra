'use client';

import {X} from 'lucide-react';
import Select from 'react-select';
import ConfirmationPrompt from './confirmation';
import { useState } from 'react';

export default function JobForm({isEdit, close, job}){
    const [showPrompt, setPrompt] = useState(false);
    const employmentOptions =[{value: "1", label: "Part-Time"},{value: "2", label: "Full-Time"}, {value: "3", label: "Temporary"}, {value: "4", label: "Freelance"}]
    const locationOptions =[{value: "1", label: "Onsite"},{value: "2", label: "Remote"}, {value: "3", label: "Hybrid"}]
    const statusOptions =[{value: "1", label: "Open"},{value: "2", label: "Closed"}]
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({...job, job_requirements: '', hiring_manager: ''});
    const [employmentType, setEmploymentType] = useState(employmentOptions.find(option => option.label === job.employment_type))
    const [locationType, setLocationType] = useState(locationOptions.find(option => option.label === job.location_type))
    const [status, setStatus] = useState({value: "1", label: "Open"})

    const handleClear = () => {
        setFormData({company_name: '', job_title: '', location: '', salary: '', apply_link: '', details: '', expires_at: '', job_requirements: '', hiring_manager: ''})
        setEmploymentType(null)
        setLocationType(null)
        setStatus(null)
        setErrors({})
    }

    const handleChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        console.log(name + " " + value)
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }

    const handleEdit = () => {
        const requiredFields = [
            "company_name",
            "job_title",
            "job_type",
            "location",
            "location_type",
            "salary",
            "status",
            "expires_at",
            "apply_link",
            "details",
            "job_requirements",
            // "hiring_manager"
            // uncomment/comment depending on what are required fields
        ];

        const requiredErrors = requiredFields.filter((key) => !formData[key]);
        const missingFields = requiredErrors.reduce((obj, value) => {
            obj[value] = true
            return obj;
        }, {})

        if (employmentType) delete missingFields.job_type
        if (locationType) delete missingFields.location_type
        if (status) delete missingFields.status

        if (Object.keys(missingFields).length > 0){
            setErrors(missingFields);
            setPrompt(false)
            return
        }

        // handle edit job logic here
        
        
        setPrompt(false);
        close();
    } 

    const selectStyle = {
        control: () =>
        '!cursor-text outline-none border-1 border-[#C4C4C4] rounded-sm w-full min-h-[30px] min-h-[unset] h-[30px] mt-1.5 px-3 text-sm',
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
                <h1 className="text-astrablack text-2xl font-semibold">Edit Job Details</h1>
                <X onClick={close} size={25} color='black' className='!cursor-pointer '/>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 px-8"> 
                
            <div className=''>
                    <div className='flex flex-row gap-2 items-center justify-between'>
                        <label className='text-black font-medium text-lg'>Title</label>
                        {errors.job_title ?
                            <p className="text-sm text-astrared self-end">Required</p> : <></>
                        }
                    </div>
                    <input type="text" placeholder="Ex: User Experience Researcher" onChange={handleChange} value={formData.job_title} name="job_title" className='focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'></input>
                </div>
                
                <div className='col-span-1 md:col-span-1'>
                    <div className='flex flex-row gap-2 justify-between'>
                        <label className='text-black font-medium text-lg'>Company</label>
                        {errors.company_name ?
                            <p className="text-sm text-astrared self-end">Required</p> : <></>
                        }
                    </div>
                    <input type="text" placeholder="Ex: Google" onChange={handleChange} value={formData.company_name} name="company_name" className='focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'></input>
                </div>
                
                <div className=''>
                <div className='flex flex-row gap-2 items-center justify-between'>
                        <label className='text-black font-medium text-lg'>Location</label>
                        {errors.location ?
                            <p className="text-sm text-astrared self-end">Required</p> : <></>
                        }
                    </div>
                    <input type="text" placeholder="Ex: Santa Rosa City, Laguna" onChange={handleChange} value={formData.location} name="location" className='focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'></input>
                </div>

                <div>
                <div className='flex flex-row gap-2 items-center justify-between'>
                        <label className='text-black font-medium text-lg'>Location Type</label>
                        {errors.location_type ?
                            <p className="text-sm text-astrared self-end">Required</p> : <></>
                        }
                    </div>
                    <Select unstyled options={locationOptions} placeholder="Please Select" onChange={setLocationType} value={locationType} instanceId="locationType" classNames={selectStyle}
                        styles={selectBaseStyle}/>
                </div>

                <div className=''>
                    <div className='flex flex-row gap-2 items-center justify-between'>
                        <label className='text-black font-medium text-lg'>Job Salary (₱)</label>
                        {errors.salary ?
                            <p className="text-sm text-astrared self-end">Required</p> : <></>
                        }
                    </div>
                    <input type="text" placeholder="Ex: ₱40,000 - ₱50,000" onChange={handleChange} value={formData.salary} name="salary" className='focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'></input>
                </div>

                <div>
                    <div className='flex flex-row gap-2 items-center justify-between'>
                        <label className='text-black font-medium text-lg'>Employment Type</label>
                        {errors.job_type ?
                            <p className="text-sm text-astrared self-end">Required</p> : <></>
                        }
                    </div>
                    <Select unstyled options={employmentOptions} placeholder="Please Select" onChange={setEmploymentType} value={employmentType} instanceId="employmentType" classNames={selectStyle}
                        styles={selectBaseStyle}/>
                </div>

                <div className=''>
                <div className='flex flex-row gap-2 items-center justify-between'>
                        <label className='text-black font-medium text-lg'>Deadline of Applications</label>
                        {errors.expires_at ?
                            <p className="text-sm text-astrared self-end">Required</p> : <></>
                        }
                    </div>
                    <input  type="date" placeholder="YYYY/MM/DD" onChange={handleChange} className='focus:border-astraprimary !cursor-pointer placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'
                            name={"expires_at"} style={{ colorScheme: 'light', accentColor: '#0E6CF3' }}></input>
                </div>

                <div>
                    <div className='flex flex-row gap-2 items-center justify-between'>
                        <label className='text-black font-medium text-lg'>Job Status</label>
                        {errors.status ?
                            <p className="text-sm text-astrared self-end">Required</p> : <></>
                        }
                    </div>
                    <Select unstyled options={statusOptions} placeholder="Please Select" onChange={setStatus} value={status} instanceId="status"classNames={selectStyle}
                        styles={selectBaseStyle}/>
                </div>

                <div className=''>
                    <div className='flex flex-row gap-2 items-center justify-between'>
                        <label className='text-black font-medium text-lg'>Application Link</label>
                        {errors.apply_link ?
                            <p className="text-sm text-astrared self-end">Required</p> : <></>
                        }
                    </div>
                    <input type="text" placeholder="Ex: https://hiring.com/apply" onChange={handleChange} value={formData.apply_link} name="apply_link" className='focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'></input>
                </div>

                <div className=''>
                    <div className='flex flex-row gap-2 items-center justify-between'>
                        <label className='text-black font-medium text-lg'>Contact Information</label>
                        {errors.hiring_manager ?
                            <p className="text-sm text-astrared self-end">Required</p> : <></>
                        }
                    </div>
                    <input type="text" placeholder="Email address/phone number" onChange={handleChange} value={formData.hiring_manager} name="hiring_manager" className='focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'></input>
                </div>

                <div className='col-span-1 md:col-span-2'>
                <div className='flex flex-row gap-2 items-center justify-between'>
                        <label className='text-black font-medium text-lg'>Job Description</label>
                        {errors.details ?
                            <p className="text-sm text-astrared self-end">Required</p> : <></>
                        }
                    </div>
                    <textarea  type="text" placeholder="Provide a concise overview of the role, including job requirements, key responsibilities, and objectives. You may also include your company’s representative email for additional inquiries." 
                            onChange={handleChange} name={"details"} value={formData.details} className='focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm resize-none h-[110px]'></textarea>
                </div>

                <div className='col-span-1 md:col-span-2'>
                <div className='flex flex-row gap-2 items-center justify-between'>
                        <label className='text-black font-medium text-lg'>Requirements</label>
                        {errors.job_requirements ?
                            <p className="text-sm text-astrared self-end">Required</p> : <></>
                        }
                    </div>
                    <textarea  type="text" placeholder="Provide the requirements that are needed for the role. You may include skills (technical/non-technical), certifications, and experiences that you are looking for in an applicant." 
                            onChange={handleChange} name={"job_requirements"} value={formData.job_requirements} className='focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm resize-none h-[110px]'></textarea>
                </div>
            </form>

            <div className="flex justify-between my-4 px-8">
                <button onClick={handleClear} className="!cursor-pointer text-astraprimary border-1 border-astraprimary font-semibold w-35 py-2 rounded-lg text-base">Clear Details</button>
                <button onClick={()=>{setPrompt(true)}} className="!cursor-pointer text-astrawhite border-1 border-astraprimary bg-astraprimary font-semibold w-35 py-2 rounded-lg text-base">Edit Post</button>
            </div>

        </div>

        {showPrompt ? <ConfirmationPrompt isEdit={true} close={()=>setPrompt(false)} handleConfirm={handleEdit}/> : <></>} 
    </div>
  )}
  