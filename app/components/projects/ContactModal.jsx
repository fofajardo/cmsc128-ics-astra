"use client";
import React from "react";

export default function ContactModal({ requester, message, setMessage, onClose, onSend }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-white to-astrawhite rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp border border-white/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-astraprimary/90 to-astraprimary p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white"
            aria-label="Close modal"
          >
            ✕
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-astraprimary shadow-md">
              {requester.profilePic ? (
                <img src={requester.profilePic} alt={requester.name} className="rounded-full w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold">{requester.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="font-lb text-xl text-white mb-1">Message {requester.name}</h3>
              <p className="text-white/70 text-sm">Typically responds within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <label className="block text-astradarkgray font-sb mb-2">Your Message</label>
          <textarea
            className="w-full border border-astragray/30 rounded-lg p-4 min-h-32 focus:ring-astraprimary transition-all bg-white shadow-inner"
            placeholder="Introduce yourself and explain why you're reaching out..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className={`text-xs text-right mt-2 ${message.length > 500 ? "text-red-500 font-medium" : "text-astragray"}`}>
            {message.length}/1000 characters
          </p>

          {/* Quick Replies */}
          <div className="mt-4 space-x-2">
            {[
              "Hi, I'm interested in learning more about this project. Could you share additional details?",
              "Hello! I have similar experience and would love to collaborate on this project.",
              "Hi there! I'm impressed by this project and would like to connect to discuss potential opportunities.",
            ].map((msg, idx) => (
              <button
                key={idx}
                onClick={() => setMessage(msg)}
                className="text-sm px-3 py-1 bg-astralightgray hover:bg-astragray/20 rounded-full text-astradarkgray transition"
              >
                {msg.split(".")[0]}...
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-astralightgray/40 border-t border-astragray/10 flex justify-between items-center">
          <p className="text-sm text-astradarkgray flex items-center">
            <span className="text-green-500 mr-1">✔</span> Messages are monitored
          </p>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-astragray/30 rounded-lg font-sb hover:bg-astragray/10"
            >
              Cancel
            </button>
            <button
              onClick={onSend}
              disabled={!message.trim()}
              className={`px-6 py-2.5 rounded-lg font-sb flex items-center ${
                !message.trim()
                  ? "bg-astragray/50 text-astradarkgray/50 cursor-not-allowed"
                  : "bg-astraprimary text-astrawhite hover:bg-astraprimary/90 shadow"
              }`}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
