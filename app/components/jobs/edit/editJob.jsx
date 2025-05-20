"use client";

import {X} from "lucide-react";
import Select from "react-select";
import ConfirmationPrompt from "./confirmation";
import { useState } from "react";
import axios from "axios";
import { JobsStatus } from "../../../../common/scopes";

export default function JobForm({isEdit, close, job, content, handleUpdate}){
  const [showPrompt, setPrompt] = useState(false);
  const employmentOptions =[{value: 0, label: "Part-Time"},{value: 1, label: "Full-time"}, {value: 2, label: "Temporary"}, {value: 3, label: "Freelance"}];
  const locationOptions =[{value: 0, label: "Onsite"},{value: 1, label: "Remote"}, {value: 2, label: "Hybrid"}];
  const statusOptions =[{value: JobsStatus.OPEN_UNTIL_EXPIRED, label: "Open"},{value: JobsStatus.CLOSED, label: "Closed"}];
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    ...job,
    description: content.details || "",
    requirements: job.requirements || "",
    hiring_manager: job.hiring_manager || "",
  });
  const [employmentType, setEmploymentType] = useState(employmentOptions.find(option => option.value === job.employment_type));
  const [locationType, setLocationType] = useState(locationOptions.find(option => option.value === job.location_type));
  const [status, setStatus] = useState(statusOptions.find(option => option.value === job.status));

  const handleClear = () => {
    setFormData({company_name: "", job_title: "", location: "", salary: "", apply_link: "", description: "", expires_at: "", requirements: "", hiring_manager: ""});
    setEmploymentType(null);
    setLocationType(null);
    setStatus(null);
    setErrors({});
  };

  const handleChange = (e) => {
    e.preventDefault();

    var {name, value} = e.target;

    // trim texts as needed
    if (name === "requirements" && value.length > 1500) value = value.slice(0, 1500);
    if (name === "description" && value.length > 3000) value = value.slice(0, 3000);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = async () => {
    const changedFields = Object.keys(formData).filter((key) => {
      if (key === "description") {
        return formData.description !== job.content?.details;
      }
      return formData[key] !== job[key];
    });
    // console.log(changedFields);
    if (changedFields.length === 0) {
      console.error("No changes detected.");
      setPrompt(false);
      return;
    }

    const requiredErrors = changedFields.filter((key) => {
      const value = formData[key];
      return value === undefined || value === null || value === "";
    });

    const missingFields = requiredErrors.reduce((obj, key) => {
      obj[key] = true;
      return obj;
    }, {});

    if (Object.keys(missingFields).length > 0) {
      console.error("Missing required fields:", missingFields);
      setErrors(missingFields);
      setPrompt(false);
      return;
    }

    // Prepare job data except description
    const datatobesent = {};
    changedFields.forEach((field) => {
      if (field !== "description") {
        datatobesent[field] = formData[field];
      }
    });

    try {
      // Update main job (only if non-description fields changed)
      if (Object.keys(datatobesent).length > 0) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/jobs/${job.job_id}`, datatobesent);
      }

      // Update content.details if description changed
      if (changedFields.includes("description")) {
        const contentToSend = {
          details: formData.description,
        };
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${job.job_id}`, contentToSend);
      }
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/jobs/${job.job_id}`);
      // console.log("Job and/or content updated successfully!");
      setPrompt(false);
      handleUpdate(job.job_id);
      close();
    } catch (error) {
      console.error("Error updating job:", error.response?.data || error.message);
      setPrompt(false);
    }
  };

  const selectStyle = {
    control: () =>
      "!cursor-text outline-none border-1 border-[#C4C4C4] rounded-sm w-full min-h-[30px] min-h-[unset] h-[30px] mt-1.5 px-3 text-sm",
    valueContainer: () => "m-0 p-0 h-full flex items-center",
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

        {/* Header */}
        <div className="flex items-end justify-between border-b-1 border-b-black/30 px-8 pb-4">
          <h1 className="text-astrablack text-2xl font-semibold">Edit Job Details</h1>
          <X onClick={close} size={25} color="black" className="!cursor-pointer" />
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 px-8">

          {/* Job Title */}
          <div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <label className="text-black font-medium text-lg">Title</label>
              {errors.job_title && (
                <p className="text-sm text-astrared self-end">Required</p>
              )}
            </div>
            <input
              type="text"
              placeholder="Ex: User Experience Researcher"
              onChange={handleChange}
              value={formData.job_title}
              name="job_title"
              className="focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm"
            />
          </div>

          {/* Company */}
          <div>
            <div className="flex flex-row gap-2 justify-between">
              <label className="text-black font-medium text-lg">Company</label>
              {errors.company_name && (
                <p className="text-sm text-astrared self-end">Required</p>
              )}
            </div>
            <input
              type="text"
              placeholder="Ex: Google"
              onChange={handleChange}
              value={formData.company_name}
              name="company_name"
              className="focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <label className="text-black font-medium text-lg">Location</label>
              {errors.location && (
                <p className="text-sm text-astrared self-end">Required</p>
              )}
            </div>
            <input
              type="text"
              placeholder="Ex: Santa Rosa City, Laguna"
              onChange={handleChange}
              value={formData.location}
              name="location"
              className="focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm"
            />
          </div>

          {/* Location Type */}
          <div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <label className="text-black font-medium text-lg">Location Type</label>
              {errors.location_type && (
                <p className="text-sm text-astrared self-end">Required</p>
              )}
            </div>
            <Select
              unstyled
              options={locationOptions}
              placeholder="Please Select"
              onChange={(selected) => {
                setLocationType(selected);
                setFormData((prev) => ({ ...prev, location_type: selected?.value }));
              }}
              value={locationType}
              instanceId="locationType"
              classNames={selectStyle}
              styles={selectBaseStyle}
            />
          </div>

          {/* Salary */}
          <div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <label className="text-black font-medium text-lg">Job Salary (₱)</label>
              {errors.salary && (
                <p className="text-sm text-astrared self-end">Required</p>
              )}
            </div>
            <input
              type="text"
              placeholder="Ex: ₱40,000 - ₱50,000"
              onChange={handleChange}
              value={formData.salary}
              name="salary"
              className="focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm"
            />
          </div>

          {/* Employment Type */}
          <div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <label className="text-black font-medium text-lg">Employment Type</label>
              {errors.job_type && (
                <p className="text-sm text-astrared self-end">Required</p>
              )}
            </div>
            <Select
              unstyled
              options={employmentOptions}
              placeholder="Please Select"
              onChange={(selected) => {
                setEmploymentType(selected);
                setFormData((prev) => ({ ...prev, employment_type: selected?.value }));
              }}
              value={employmentType}
              instanceId="employmentType"
              classNames={selectStyle}
              styles={selectBaseStyle}
            />
          </div>

          {/* Deadline */}
          <div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <label className="text-black font-medium text-lg">Deadline of Applications</label>
              {errors.expires_at && (
                <p className="text-sm text-astrared self-end">Required</p>
              )}
            </div>
            <input
              type="date"
              placeholder="YYYY/MM/DD"
              onChange={handleChange}
              name="expires_at"
              className="focus:border-astraprimary !cursor-pointer placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm"
              style={{ colorScheme: "light", accentColor: "#0E6CF3" }}
            />
          </div>

          {/* Job Status */}
          <div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <label className="text-black font-medium text-lg">Job Status</label>
              {errors.status && (
                <p className="text-sm text-astrared self-end">Required</p>
              )}
            </div>
            <Select
              unstyled
              options={statusOptions}
              placeholder="Please Select"
              onChange={(selected) => {
                setStatus(selected);
                setFormData((prev) => ({ ...prev, status: selected?.value }));
              }}
              value={status}
              instanceId="status"
              classNames={selectStyle}
              styles={selectBaseStyle}
            />
          </div>

          {/* Application Link */}
          <div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <label className="text-black font-medium text-lg">Application Link</label>
              {errors.apply_link && (
                <p className="text-sm text-astrared self-end">Required</p>
              )}
            </div>
            <input
              type="text"
              placeholder="Ex: https://hiring.com/apply"
              onChange={handleChange}
              value={formData.apply_link}
              name="apply_link"
              className="focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm"
            />
          </div>

          {/* Hiring Manager */}
          <div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <label className="text-black font-medium text-lg">Contact Person</label>
              {errors.hiring_manager && (
                <p className="text-sm text-astrared self-end">Required</p>
              )}
            </div>
            <input
              type="text"
              placeholder="Email address/phone number"
              onChange={handleChange}
              value={formData.hiring_manager}
              name="hiring_manager"
              className="focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm"
            />
          </div>

          {/* Job Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-row gap-2 items-center justify-between">
              <label className="text-black font-medium text-lg">Job Description</label>
              {errors.description && (
                <p className="text-sm text-astrared self-end">Required</p>
              )}
            </div>
            <textarea
              placeholder="Provide a concise overview of the role... (3,000 characters maximum)"
              onChange={handleChange}
              name="description"
              value={formData.description}
              className="focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm resize-none h-[110px]"
            />
          </div>

          {/* Job Requirements */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-row gap-2 items-center justify-between">
              <label className="text-black font-medium text-lg">Requirements</label>
              {errors.requirements && (
                <p className="text-sm text-astrared self-end">Required</p>
              )}
            </div>
            <textarea
              placeholder="Provide the requirements needed for the role... (1,500 characters maximum)"
              onChange={handleChange}
              name="requirements"
              value={formData.requirements}
              className="focus:border-astraprimary placeholder:text-astradarkgray outline-none border-1 border-[#C4C4C4] rounded-sm w-full mt-1.5 px-3 py-1 text-sm resize-none h-[110px]"
            />
          </div>
        </form>

        {/* Footer Buttons */}
        <div className="flex justify-between my-4 px-8">
          <button
            onClick={handleClear}
            className="!cursor-pointer text-astraprimary border-1 border-astraprimary font-semibold w-35 py-2 rounded-lg text-base"
          >
            Clear Details
          </button>
          <button
            onClick={() => setPrompt(true)}
            className="!cursor-pointer text-astrawhite border-1 border-astraprimary bg-astraprimary font-semibold w-35 py-2 rounded-lg text-base"
          >
            Edit Post
          </button>
        </div>
      </div>

      {/* Confirmation Prompt */}
      {showPrompt && (
        <ConfirmationPrompt
          prompt="Are you sure you want to edit this job posting?"
          close={() => setPrompt(false)}
          handleConfirm={handleEdit}
        />
      )}
    </div>
  );}
