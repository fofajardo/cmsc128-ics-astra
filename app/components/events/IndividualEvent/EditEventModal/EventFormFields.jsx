"use client";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EventFormFields({
  isEdit,
  title,
  setTitle,
  date,
  setDate,
  location,
  setLocation,
  status,
  setStatus,
  eventDetail,
  setEventDetail,
}) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="w-[70%]">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          <div className="w-[30%] relative">
            <label className="block text-sm font-medium">Date</label>
            <div className="relative">
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="yyyy-MM-dd"
                className="w-full border rounded-md p-2 pr-10 cursor-pointer"
                placeholderText="Select date"
                minDate={new Date()}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-astraprimary pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-[70%]">
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          <div className="w-[30%]">
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-md p-2 cursor-pointer"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={eventDetail}
            onChange={(e) => setEventDetail(e.target.value)}
            className="w-full border rounded-md p-2"
            rows={4}
            required={!isEdit}
          />
        </div>
      </div>
    </>
  );
}