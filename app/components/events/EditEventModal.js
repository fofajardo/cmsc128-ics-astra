'use client';
import { useState } from "react";

export default function EditEventModal({ event, onClose, onSave }) {
  const [title, setTitle] = useState(event.title);
  const [eventDetail, setEventDetail] = useState(event.eventDetail);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedEvent = {
      ...event,
      title,
      eventDetail,
    };

    if (onSave) {
      onSave(updatedEvent);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Transparent and blurred background */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-50 bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={eventDetail}
              onChange={(e) => setEventDetail(e.target.value)}
              className="w-full border rounded-md p-2"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-400 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
