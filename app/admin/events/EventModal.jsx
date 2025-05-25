"use client";

import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, X, Upload, Image as ImageIcon, Trash2  } from "lucide-react"; // import X icon
import { validate } from "uuid";
import ToastNotification from "@/components/ToastNotification";

export default function EventModal({
  isEdit,
  id,
  formData,
  handleChange,
  handleSubmit,
  toggleModal,
  reset
}) {
  const [toast, setToast] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    formData.event_date ? new Date(formData.event_date) : null
  );

  const [imagePreview, setImagePreview] = useState(formData.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);


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

  const handleFile = (file) => {
    if (file) {
      // Check file type
      if(!file.type.startsWith("image/")) {
        setToast({ type: "error", message: "Invalid file type. Please upload an image." });
        return;
      }
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setToast({ type: "error", message: "File size exceeds 5MB limit." });
        return;
      }
      setImageFile(file);
      setFileName(file.name);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Update the formData with the image file
        handleChange({
          target: { name: "imageFile", value: file },
        });
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
      setFileName("");
      setImageFile(null);
      handleChange({
        target: { name: "imageFile", value: null },
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleImageRemove = () => {
    const file = null;
    handleFile(file);
    fileInputRef.current.value = null; // Clear the file input
  };

  const validator = () => {
    const { title, description, venue } = formData;

    if (
      title.trim() &&
      description.trim() &&
      venue.trim()
    ) {
      return true;
    }

    setToast({ type: "error", message: "Invalid input, fill empty field/s" });
    return false;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      // For editing, create a formatted event object that includes the photo information
      const updatedEvent = {
        id: id,
        title: formData.title,
        description: formData.description,
        venue: formData.venue,
        event_date: selectedDate,
        max_slots: formData.max_slots,
        status: formData.status,
        event_type: formData.event_type,
        external_link: formData.external_link,
        access_link: formData.access_link,
        photoId: formData.photoId, // Include the existing photoId
        imageFile: imageFile // The new uploaded file (if any)
      };

      // Pass the structured event object to parent component
      handleSubmit(updatedEvent);
    } else {
      // For new events, use existing validator
      if (validator()) {
        handleSubmit(e);
      }
    }
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
          onSubmit={handleFormSubmit}
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
              <option value="In-Person">In-Person</option>
              <option value="Online">Online</option>
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
              min={0}
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
                minDate={new Date()}
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
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          {/* Event Image Upload - Added this section */}
          <div className="col-span-2 mb-2">
            <label className="block font-medium mb-1">Event Image</label>
            <div className="border-2 border-dashed border-astraprimary rounded-xl w-full h-48 flex items-center justify-center relative hover:bg-blue-50 transition cursor-pointer overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div
                  className={`p-4 sm:p-8 md:p-8 text-center h-full w-full flex items-center justify-center ${
                    isDragging ? "border-astraprimary bg-astralightgray" : "border-astraprimary"
                  } transition-colors duration-200`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-8 h-8 sm:w-8 sm:h-8 mb-1 sm:mb-1">
                      <svg
                        className="w-full h-full text-astraprimary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-astraprimary font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                      Drag and drop your photo here
                    </p>
                    <p className="text-astraprimary text-xs sm:text-sm">
                      or click to browse files
                    </p>
                    <p className="text-astraprimary text-xs mt-1 sm:mt-2">
                      Supported formats: JPG, PNG
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="mt-2 bg-astrawhite border border-blue-200 rounded-md px-3 py-2 flex items-center justify-between text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>{fileName || "No selected file"}</span>
              </div>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="text-astradark hover:text-astrared"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
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
          {toast && (
            <ToastNotification
              type={toast.type}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          )}
        </form>
      </div>
    </div>
  );
}
