"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, X } from "lucide-react"; // import X icon

export default function EventModal({
  isEdit,
  id,
  formData,
  handleChange,
  handleSubmit,
  toggleModal,
  reset
}) {
  const [selectedDate, setSelectedDate] = useState(
    formData.event_date ? new Date(formData.event_date) : null
  );

  const handleDateChange = (date) => {
    if (!date) return;
    const adjustedDate = new Date(date);
    adjustedDate.setHours(0, 1, 0, 0);

    setSelectedDate(adjustedDate);

    handleChange({
      target: {
        name: "event_date",
        value: adjustedDate.toISOString(),
      },
    });
  };


  return (
    <div
      onClick={toggleModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-xl p-6 w-[90%] max-w-3xl shadow-lg overflow-y-auto max-h-[90vh]"
      >
        {/* X Close Button */}
        <button
          onClick={toggleModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-astradarkblue">
          {isEdit ? "Edit Event" : "Event Details"}
        </h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={
            (e) => {
              e.preventDefault();
              if (isEdit) {
                handleSubmit(id);
              } else {
                handleSubmit(e);
              }
            }
          }
        >
          {/* Event Name */}
          <div>
            <label className="block font-medium mb-1">Event Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: User Experience Researcher"
              className="border rounded px-3 py-2 w-full"
              required={!isEdit}
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block font-medium mb-1">Event Type</label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required={!isEdit}

            >
              <option value="">Please Select</option>
              <option>In-Person</option>
              <option>Online</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Ex: Santa Rosa City, Laguna"
              className="border rounded px-3 py-2 w-full"
              required={!isEdit}

            />
          </div>

          {/* Maximum Slots */}
          <div>
            <label className="block font-medium mb-1">
              Maximum Number of Slots
            </label>
            <input
              type="number"
              name="max_slots"
              value={formData.max_slots}
              onChange={handleChange}
              placeholder="Ex: 20"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          {/* Date Picker with Icon on the Left */}
          <div>
            <label className="block font-medium mb-1">Date</label>
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

          {/* Event Status */}
          <div>
            <label className="block font-medium mb-1">Event Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required={!isEdit}

            >
              <option value="">Please Select</option>
              <option>Open</option>
              <option>Closed</option>
              <option> Cancelled</option>
            </select>
          </div>

          {/* Link */}
          <div className="col-span-2">
            <label className="block font-medium mb-1">External Link</label>
            <input
              type="text"
              name="external_link"
              value={formData.external_link}
              onChange={handleChange}
              placeholder="Ex: https://hiring.com/apply"
              className="border rounded px-3 py-2 w-full"
              required={!isEdit && formData.type === "Online"}
            />
          </div>
          <div className="col-span-2">
            <label className="block font-medium mb-1">Access Link</label>
            <input
              type="text"
              name="access_link"
              value={formData.access_link}
              onChange={handleChange}
              placeholder="Ex: https://hiring.com/apply"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          {/* Event Description */}
          <div className="col-span-2">
            <label className="block font-medium mb-1">Event Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description..."
              className="border rounded px-3 py-2 w-full h-28"
              required={!isEdit}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6 col-span-2">
            <button
              type="button"
              onClick={isEdit ? toggleModal : reset}
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50"
            >
              {isEdit ? "Cancel" : "Clear Details"}
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
              //onClick={handleSubmit}
            >
              {isEdit ? "Update Event" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
