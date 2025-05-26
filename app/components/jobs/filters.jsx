"use client";

import Select from "react-select";
import { ListFilter, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { jobTypeOptions, statusOptions, locationTypeOptions } from "@/components/jobs/mappings";

export default function Filter({ onApply }) {
  const [formData, setFormData] = useState({job_type: "", status: "", location: "", location_type: "", min_salary: "", max_salary: "", recent: true });

  const isMounted = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected, { name }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selected && selected.value !== "" ? selected.value : "",
    }));
  };

  const clearFilter = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  useEffect(() => {
    if (isMounted.current) {
      onApply(formData);
    } else {
      isMounted.current = true;
    }
  }, [formData]);

  const isFilled = (fieldName) =>
    formData[fieldName] !== "" &&
    formData[fieldName] !== null &&
    formData[fieldName] !== undefined;

  const getSelectStyles = (fieldName) => ({
    control: (styles, state) => ({
      ...styles,
      minHeight: 45,
      backgroundColor: isFilled(fieldName)
        ? "var(--color-astraprimary)"
        : "var(--color-astrawhite)",
      borderColor: isFilled(fieldName)
        ? "var(--color-astrawhite)"
        : state.isFocused
          ? "var(--color-astradark)"
          : "var(--color-astraprimary)",
      borderRadius: 10,
      cursor: "pointer",
      borderWidth: 2,
      boxShadow: state.isFocused
        ? "0 0 0 1px var(--color-astradark)"
        : "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "all 0.2s",
      ":hover": {
        borderColor: isFilled(fieldName)
          ? "var(--color-astrawhite)"
          : "var(--color-astradark)",
        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
      },
    }),
    valueContainer: (styles) => ({
      ...styles,
      padding: "0 12px",
    }),
    placeholder: (styles) => ({
      ...styles,
      color: isFilled(fieldName)
        ? "var(--color-astrawhite)"
        : "var(--color-astradark)",
      fontSize: 14,
    }),
    singleValue: (styles) => ({
      ...styles,
      color: isFilled(fieldName)
        ? "var(--color-astrawhite)"
        : "var(--color-astradark)",
      fontSize: 14,
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      padding: 0,
      color: isFilled(fieldName)
        ? "var(--color-astrawhite)"
        : "var(--color-astraprimary)",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    menu: (styles) => ({
      ...styles,
      marginTop: 4,
      padding: "4px 0",
      backgroundColor: "var(--color-astrawhite)",
      border: "2px solid var(--color-astragray)",
      borderRadius: 10,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      zIndex: 50,
    }),
    option: (styles, state) => ({
      ...styles,
      padding: "8px 16px",
      fontSize: 14,
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? "var(--color-astraprimary)"
        : state.isFocused
          ? "var(--color-astragray)"
          : "transparent",
      color: state.isSelected
        ? "var(--color-astrawhite)"
        : "var(--color-astradark)",
      ":active": {
        backgroundColor: "var(--color-astraprimary)",
      },
    }),
  });

  return (
    <form className="w-full pb-8 flex flex-wrap items-center justify-center gap-4">
      {/* Job Type */}
      <div className="w-[180px] relative">
        <Select
          options={jobTypeOptions}
          placeholder="Job Type"
          onChange={handleSelectChange}
          value={
            jobTypeOptions.find(
              (opt) => opt.value === formData.job_type
            )
          }
          name="job_type"
          instanceId="jobType"
          styles={getSelectStyles("job_type")}
          isClearable={true}
        />
      </div>

      {/* Status */}
      <div className="w-[180px] relative">
        <Select
          options={statusOptions}
          placeholder="Status"
          onChange={handleSelectChange}
          value={
            statusOptions.find((opt) => opt.value === formData.status) || null
          }
          name="status"
          instanceId="status"
          styles={getSelectStyles("status")}
          isClearable={true}
        />
      </div>

      {/* Location */}
      <div className="w-[180px]">
        <input
          type="text"
          onChange={handleChange}
          value={formData.location}
          name="location"
          className="w-full h-[45px] px-4 bg-astrawhite border-2 shadow-md hover:shadow-lg cursor-pointer border-astraprimary rounded-[10px] hover:border-astradark focus:border-astradark transition-all duration-200 placeholder:text-astradark text-sm"
          placeholder="Location"
        />
      </div>

      {/* Location Type */}
      <div className="w-[180px] relative">
        <Select
          options={locationTypeOptions}
          placeholder="Location Type"
          onChange={handleSelectChange}
          value={
            locationTypeOptions.find(
              (opt) => opt.value === formData.location_type
            ) || null
          }
          name="location_type"
          instanceId="locationType"
          styles={getSelectStyles("location_type")}
          isClearable={true}
        />
      </div>

      {/* Salary Range */}
      <div className="flex gap-2 items-center">
        <input
          type="number"
          name="min_salary"
          value={formData.min_salary}
          onChange={handleChange}
          className="w-[180px] h-[45px] px-3 bg-astrawhite border-2 shadow-md hover:shadow-lg cursor-pointer border-astraprimary rounded-[10px] hover:border-astradark focus:border-astradark transition-all duration-200 placeholder:text-astradark text-sm"
          placeholder="Salary Min ₱"
        />
        <input
          type="number"
          name="max_salary"
          value={formData.max_salary}
          onChange={handleChange}
          className="w-[180px] h-[45px] px-3 bg-astrawhite border-2 shadow-md hover:shadow-lg cursor-pointer border-astraprimary rounded-[10px] hover:border-astradark focus:border-astradark transition-all duration-200 placeholder:text-astradark text-sm"
          placeholder="Salary Max ₱"
        />
      </div>

      {/* Most Recent */}
      <button
        type="button"
        onClick={() =>
          setFormData((prev) => ({ ...prev, recent: !prev.recent }))
        }
        className={`h-[45px] w-[160px] flex items-center justify-between px-4 rounded-[10px] border-2 shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 ${
          formData.recent
            ? "bg-astraprimary text-white border-astraprimary"
            : "bg-astrawhite text-astradark border-astraprimary"
        }`}
      >
        <span className="text-sm">Most Recent</span>
        <ListFilter
          className={formData.recent ? "text-white" : "text-astraprimary"}
          size={20}
        />
      </button>
    </form>
  );
}
