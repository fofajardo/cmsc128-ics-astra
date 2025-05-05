"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import { Icon } from "@iconify/react";
import "react-datepicker/dist/react-datepicker.css";

export default function DateFilter({ placeholder, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCalendar = () => setIsOpen((prev) => !prev);

  const handleClear = () => {
    onChange?.(null);
    setIsOpen(false);
  };

  return (
    <div className="relative w-[180px] text-sm">
      <button
        onClick={toggleCalendar}
        className={`flex items-center justify-between w-full px-4 py-2 rounded-[10px] border-2 shadow-md hover:shadow-lg transition-all duration-200 ${
          value ? "bg-astraprimary text-astrawhite border-astrawhite" : "bg-astrawhite text-astradark border-astraprimary"
        }`}
      >
        <div className="flex items-center gap-2">
          <span>
            {value ? new Intl.DateTimeFormat("en-GB").format(value) : placeholder}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {value && (
            <Icon
              icon="mdi:close-circle-outline"
              className="text-lg text-astrawhite hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            />
          )}
          <Icon
            icon="material-symbols:calendar-month"
            className={`text-xl ${value ? "text-astrawhite" : "text-astraprimary"} cursor-pointer`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-astrawhite p-2 rounded-[10px] border-2 border-astraprimary shadow-xl">
          <DatePicker
            selected={value}
            onChange={(date) => {
              onChange?.(date);
              setIsOpen(false);
            }}
            inline
            calendarClassName="custom-calendar"
          />
        </div>
      )}
    </div>
  );
}
