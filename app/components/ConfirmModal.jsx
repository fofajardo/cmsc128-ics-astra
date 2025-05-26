"use client";
import React from "react";

export default function ConfirmModal({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  confirmColor = "blue",
  count = null, // for optional "(5)" style
}) {

  if (!isOpen) return null;

  const colorVariants = {
    red: "bg-astrared hover:bg-astrared/90",
    blue: "bg-astraprimary hover:bg-astradark",
    green: "bg-astragreen hover:bg-astragreen/90",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full px-6 py-6">
        {/* Title */}
        <h2 className="text-xl font-lb text-astrablack mb-1">
          {title}
        </h2>
        <hr className="border-astralightgray mb-4" />

        {/* Description */}
        <p className="text-astrablack font-r mb-6">{description}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-astragray/20 text-astradarkgray hover:bg-astragray/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 rounded-md text-white font-semibold transition ${colorVariants[confirmColor]}`}
          >
            {count ? `${confirmLabel} (${count})` : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
