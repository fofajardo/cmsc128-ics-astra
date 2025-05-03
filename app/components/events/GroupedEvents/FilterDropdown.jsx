"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

export default function FilterDropdown({ icon, placeholder, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option) => {
    onChange?.(option); // Notify parent
    setIsOpen(false);
  };

  const isActive = (option) => value?.label === option.label;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative min-w-[150px]">
      <button
        onClick={toggleDropdown}
        className={`flex items-center justify-between gap-2 w-full px-4 py-2 rounded-[10px] border-2 shadow-md hover:shadow-lg transition duration-200 cursor-pointer
          ${value ? "bg-astraprimary text-astrawhite border-astrawhite" : "bg-astrawhite text-astradark border-astraprimary"}
        `}
      >
        <div className="flex items-center gap-2">
          <Icon icon={icon} className={`text-base ${value ? "text-astrawhite" : "text-astraprimary"}`} />
          <span className="whitespace-nowrap text-sm">{value ? value.label : placeholder}</span>
        </div>
        <Icon icon="mdi:chevron-down" className={`text-xl ${value ? "text-astrawhite" : "text-astraprimary"} transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-astrawhite border border-astraprimary rounded-[10px] shadow-xl overflow-hidden">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className={`flex items-center gap-2 px-4 py-2 transition-all cursor-pointer
                ${isActive(option) ? "bg-astraprimary text-astrawhite" : "text-astradark hover:bg-astragray"}
              `}
            >
              <Icon icon={option.icon} className={`text-base ${isActive(option) ? "text-astrawhite" : "text-astraprimary"}`} />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
