"use client";
import { useState } from "react";
import { Edit3, X } from "lucide-react";

export default function EditModal({ fundraiser, onClose, onSubmit }) {
  const [editedData, setEditedData] = useState({
    title: fundraiser.title,
    description: fundraiser.description,
    goal: fundraiser.goal.replace(/[^\d]/g, ""),
    endDate: new Date(fundraiser.endDate).toISOString().split('T')[0],
    reason: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });

    // Clear the error for this field when user makes changes
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editedData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!editedData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!editedData.goal) {
      newErrors.goal = "Goal amount is required";
    } else if (isNaN(editedData.goal) || parseInt(editedData.goal) <= 0) {
      newErrors.goal = "Please enter a valid amount";
    }

    if (!editedData.endDate) {
      newErrors.endDate = "End date is required";
    } else {
      const selectedDate = new Date(editedData.endDate);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.endDate = "End date must be in the future";
      }
    }

    if (!editedData.reason.trim()) {
      newErrors.reason = "Please provide a reason for the edit request";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...editedData,
        goal: `$${parseInt(editedData.goal).toLocaleString()}`,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-white to-astrawhite rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideUp border border-white/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-astraprimary/90 to-astraprimary p-6 relative">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-astraprimary shadow-md">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl text-white mb-1 font-bold">
                Request Edit
              </h3>
              <p className="text-white/70 text-sm">
                Submit changes for review and approval
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-astradarkgray mb-1">
                  Fundraiser Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editedData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.title
                      ? "border-red-400 bg-red-50"
                      : "border-astragray/30 focus:border-astraprimary"
                  } focus:ring-2 focus:ring-astraprimary/30 transition-all`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-astradarkgray mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editedData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.description
                      ? "border-red-400 bg-red-50"
                      : "border-astragray/30 focus:border-astraprimary"
                  } focus:ring-2 focus:ring-astraprimary/30 transition-all resize-none`}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-astradarkgray mb-1">
                    Goal Amount ($)
                  </label>
                  <input
                    type="number"
                    name="goal"
                    value={editedData.goal}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.goal
                        ? "border-red-400 bg-red-50"
                        : "border-astragray/30 focus:border-astraprimary"
                    } focus:ring-2 focus:ring-astraprimary/30 transition-all`}
                  />
                  {errors.goal && (
                    <p className="text-red-500 text-xs mt-1">{errors.goal}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-astradarkgray mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={editedData.endDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.endDate
                        ? "border-red-400 bg-red-50"
                        : "border-astragray/30 focus:border-astraprimary"
                    } focus:ring-2 focus:ring-astraprimary/30 transition-all`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-astradarkgray mb-1">
                  Reason for Edit <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={editedData.reason}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Please explain why you're requesting these changes..."
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.reason
                      ? "border-red-400 bg-red-50"
                      : "border-astragray/30 focus:border-astraprimary"
                  } focus:ring-2 focus:ring-astraprimary/30 transition-all resize-none`}
                ></textarea>
                {errors.reason && (
                  <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                )}
              </div>

              <div className="border-t border-astragray/20 pt-4 mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-astradarkgray border border-astragray/30 hover:bg-astragray/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-astraprimary text-white hover:bg-astraprimary/90 transition-colors"
                >
                  Submit Edit Request
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}