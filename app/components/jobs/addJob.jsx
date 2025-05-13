"use client";

import Select from "react-select";
import { useState } from "react";
import ConfirmationPrompt from "./edit/confirmation";
import axios from "axios";
import { v4 as uuvidv4 } from "uuid";
import { useSignedInUser } from "../UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, X, Upload, Image as ImageIcon, Trash2  } from "lucide-react";

export default function JobForm({isEdit, close, refreshJobs}){
  const user = useSignedInUser();
  const [showPrompt, setPrompt] = useState(false);
  const employmentOptions =[{value: "0", label: "Part-Time"},{value: "1", label: "Full-time"}, {value: "2", label: "Temporary"}, {value: "3", label: "Freelance"}];
  const locationOptions =[{value: "0", label: "Onsite"},{value: "1", label: "Remote"}, {value: "2", label: "Hybrid"}];
  const statusOptions =[{value: "0", label: "Open"},{value: "1", label: "Closed"}];
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({company_name: "", job_title: "", location: "", salary: "", apply_link: "", details: "", expires_at: "", job_requirements: "", hiring_manager: ""});
  const [employmentType, setEmploymentType] = useState(null);
  const [locationType, setLocationType] = useState(null);
  const [status, setStatus] = useState(null);
  const [showInvalidDateModal, setShowInvalidDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formData.event_date ? new Date(formData.event_date) : null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDateChange = (date) => {
    if (!date) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date < today) {
      setShowInvalidDateModal(true);
      return;
    }

    setSelectedDate(date);

    handleChange({
      target: {
        name: "expires_at",
        value: date.toISOString().split("T")[0],
      },
    });
  };

  const normalizeUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };

  const handleClear = () => {
    setFormData({company_name: "", job_title: "", location: "", salary: "", apply_link: "", details: "", expires_at: "", job_requirements: "", hiring_manager: ""});
    setEmploymentType(null);
    setLocationType(null);
    setStatus(null);
    setErrors({});
    setSelectedDate(null);
  };

  const handleChange = (e) => {
    if (e?.preventDefault) e.preventDefault();

    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    const payload = {
      company_name: formData.company_name,
      job_title: formData.job_title,
      location: formData.location,
      location_type: locationType?.value,
      hiring_manager: formData.company_name,
      employment_type: 1,
      salary: Number(formData.salary.replace(/,/g, "")),
      expires_at: formData.expires_at,
      apply_link: normalizeUrl(formData.apply_link),
      details: formData.details,
      requirements: formData.job_requirements,
      user_id: user.state.user.id,
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/jobs`, payload);

      if (response.data.status === "CREATED") {
        await refreshJobs?.();
        close();
      }
    } catch (error) {
      let message = "An unexpected error occurred. Please try again.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
        console.error("Axios error:", message);
      } else {
        console.error("Unexpected error:", error);
      }

      setErrorMessage(message);
      setShowErrorModal(true);
    }
  };


  const selectStyle = {
    control: (state) =>
      `${state.isFocused ? console.log(state) : console.log(state) } focus:border-[#0E6CF3] !cursor-text outline-none border-1 border-[#C4C4C4] rounded-sm w-full min-h-[30px] min-h-[unset] h-[30px] mt-1.5 px-3 text-sm`,
    valueContainer: () => "focus:border-[#0E6CF3] m-0 p-0 h-full flex items-center",
    placeholder: () => "text-[var(--color-astradarkgray)] p-0 m-0",
    dropdownIndicator: ({menuIsOpen}) => `py-0 text-[var(--color-astraprimary)] transition-transform duration-300 ease-in-out ${menuIsOpen ? "rotate-180" : ""}`,
    indicatorSeparator: () => "hidden",
    singleValue: () => "leading-none",
    menu: () => "mt-1 bg-[#F8F8F8] border border-[#C4C4C4] rounded-b-md",
    option: ({ isSelected, isFocused }) =>
      `cursor-pointer px-3 py-2 text-[var(--color-astrablack)] rounded-sm leading-none ${
        isSelected || isFocused
          ? "bg-[var(--color-astratintedwhite)]"
          : "bg-[#F8F8F8]"
      }`,
  };

  const selectBaseStyle = {
    control: (base) => ({...base, minHeight: "30px"}),
    option: (base) => ({...base, fontSize: "14px"})
  };

  return (
    <div className="fixed inset-0 h-auto bg-astrablack/60 flex items-center justify-center z-100">
      <div className="bg-[#F8F8F8] max-w-[1000px] w-19/20 min-h-[100px] h-auto max-h-[95vh] rounded-xl pt-8 pb-5 overflow-y-auto">

        <div className='flex items-end justify-between border-b-1 border-b-black/30 px-8 pb-4'>
          <h1 className="text-astrablack text-2xl font-semibold">Add Job Details</h1>
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
            <Select unstyled options={locationOptions} placeholder="Please Select" onChange={setLocationType} value={locationType} instanceId="locationType" styles={selectBaseStyle} classNames={selectStyle}/>
          </div>

          <div className=''>
            <div className='flex flex-row gap-2 items-center justify-between'>
              <label className='text-black font-medium text-lg'>Job Salary (₱)</label>
              {errors.salary ?
                <p className="text-sm text-astrared self-end">Required</p> : <></>
              }
            </div>
            <input type="text" placeholder="Ex: 40,000" onChange={handleChange} value={formData.salary} name="salary" className='focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm'></input>
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

          <div>
            <label className="block font-medium mb-1">Deadline of Applications</label>
            <div className="flex items-center border rounded px-3 py-2 w-full gap-2">
              <Calendar className="text-astraprimary w-5 h-5" />
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                className="w-full outline-none cursor-pointer"
                required={!isEdit}
              />
            </div>
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
            {formData.apply_link && !formData.apply_link.match(/^https?:\/\/.+\..+/) && (<p className="text-sm text-astrared mt-1">Link must start with http:// or https://</p>)}
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
          <button
            onClick={() => {
              setPrompt(true);
            }}
            className="cursor-pointer text-astrawhite border border-astraprimary bg-astraprimary font-semibold w-35 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-astraprimary">Publish Post</button>
        </div>
      </div>
      {showPrompt ? <ConfirmationPrompt prompt={"Are you sure you want to post this job posting?"} close={()=>setPrompt(false)} handleConfirm={handleAdd}/> : <></>}
      {showInvalidDateModal && (
        <div className="fixed inset-0 bg-astrablack/60 flex items-center justify-center z-100">
          <div className="bg-astrawhite max-w-[600px] w-19/20 min-h-[100px] h-auto rounded-2xl p-7 pb-5">
            <h2 className="text-xl font-semibold mb-4">Invalid Deadline</h2>
            <p className="mb-6">The deadline must be today or a future date.</p>
            <button onClick={() => setShowInvalidDateModal(false)} className="px-4 py-2 bg-astraprimary text-white rounded hover:bg-opacity-90">
              Confirm
            </button>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="fixed inset-0 bg-astrablack/60 flex items-center justify-center z-100">
          <div className="bg-astrawhite max-w-[600px] w-19/20 min-h-[100px] h-auto rounded-2xl p-7 pb-5">
            <h2 className="text-xl font-semibold mb-4">Error Posting Job</h2>
            <p className="mb-6 text-gray-700">Please check job fields</p>
            <button onClick={() => setShowErrorModal(false)} className="px-4 py-2 bg-astraprimary text-white rounded hover:bg-opacity-90">
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );}
