"use client";
import React from "react";

export default function DeclineModal({ reason, setReason, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-white to-astrawhite rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp border border-white/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-astrared/90 to-astrared p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white"
            aria-label="Close modal"
          >
            ✕
          </button>
          <div>
            <h3 className="font-lb text-xl text-white mb-1">Decline Project</h3>
            <p className="text-white/70 text-sm">Please provide a reason for declining.</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <label className="block text-astradarkgray font-sb mb-2">Reason for Decline</label>
          <textarea
            className="w-full border border-astragray/30 rounded-lg p-4 min-h-32 focus:ring-astrared transition-all bg-white shadow-inner"
            placeholder="Explain your reason for declining the request..."
            value={reason}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                setReason(e.target.value);
              }
            }}
            maxLength={500}
          />
          <p className={`text-xs text-right mt-2 ${reason.length > 500 ? "text-red-500 font-medium" : "text-astragray"}`}>
            {reason.length}/500 characters
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 bg-astralightgray/40 border-t border-astragray/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-astragray/30 rounded-lg font-sb hover:bg-astragray/10"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!reason.trim()}
            className={`px-6 py-2.5 rounded-lg font-sb flex items-center ${
              !reason.trim()
                ? "bg-astragray/50 text-astradarkgray/50 cursor-not-allowed"
                : "bg-astrared text-astrawhite hover:bg-astrared/90 shadow"
            }`}
          >
            Confirm Decline
          </button>
        </div>
      </div>
    </div>
  );
}
