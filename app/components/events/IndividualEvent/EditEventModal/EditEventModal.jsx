"use client";
import { useState } from "react";
import ImageUploadSection from "./ImageUploadSection";
import EventFormFields from "./EventFormFields";
import FormActionButtons from "./FormActionButtons";

export default function EditEventModal({ event, onClose, onSave }) {
  const [title, setTitle] = useState(event.title);
  const [eventDetail, setEventDetail] = useState(event.eventDetail);
  const [date, setDate] = useState(event.date ? new Date(event.date) : null);
  const [location, setLocation] = useState(event.location || "");
  const [status, setStatus] = useState(event.status || "Open");
  const [image, setImage] = useState(event.image || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedEvent = {
      ...event,
      title,
      eventDetail,
      date: new Date(date).toISOString().slice(0, 10) || "",
      location,
      status,
      image,
    };
    if (onSave) {
      onSave(updatedEvent);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-astrablack/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-2xl">
        <h2 className="text-2xl font-bold text-astradarkgray mb-6">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUploadSection image={image} setImage={setImage} />
          <EventFormFields
            isEdit={true}
            title={title}
            setTitle={setTitle}
            date={date}
            setDate={setDate}
            location={location}
            setLocation={setLocation}
            status={status}
            setStatus={setStatus}
            eventDetail={eventDetail}
            setEventDetail={setEventDetail}
          />
          <FormActionButtons onClose={onClose} />
        </form>
      </div>
    </div>
  );
}
