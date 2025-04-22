"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import { Icon } from "@iconify/react";
import "react-datepicker/dist/react-datepicker.css";

export default function DateFilter({ placeholder }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleCalendar = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative w-[180px] text-sm">
      <button
        onClick={toggleCalendar}
        className={`flex items-center justify-between w-full px-4 py-2 rounded-[10px] border-2 shadow-md hover:shadow-lg transition-all duration-200 ${
          selectedDate
            ? "bg-astraprimary text-astrawhite border-astrawhite"
            : "bg-astrawhite text-astradark border-astraprimary"
        }`}
      >
        <div className="flex items-center gap-2">
          <span>
            {selectedDate
              ? new Intl.DateTimeFormat("en-GB").format(selectedDate)
              : placeholder}
          </span>
        </div>
        <Icon
          icon="material-symbols:calendar-month"
          className={`text-xl ${
            selectedDate ? "text-white" : "text-astraprimary"
          } cursor-pointer`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-astrawhite p-2 rounded-[10px] border-2 border-astraprimary shadow-xl">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
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
