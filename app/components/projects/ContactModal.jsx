"use client";
import React from "react";

export default function ContactModal({ requester, message, setMessage, onClose, onSend }) {
  // Quick reply template messages
  const quickReplies = [
    {
      id: "more-info",
      label: "Request more info",
      message: "Hi, I'm interested in learning more about this project. Could you share additional details?"
    },
    {
      id: "collaborate",
      label: "Offer collaboration",
      message: "Hello! I have similar experience and would love to collaborate on this project."
    },
    {
      id: "network",
      label: "Network",
      message: "Hi there! I'm impressed by this project and would like to connect to discuss potential opportunities."
    }
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="bg-gradient-to-br from-white to-astrawhite rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp border border-white/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-astraprimary/90 to-astraprimary p-6 relative">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-astraprimary shadow-md overflow-hidden">
              {requester.profilePic ? (
                <img
                  src={requester.profilePic}
                  alt={requester.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold">
                  {requester.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h3 id="contact-modal-title" className="font-lb text-xl text-white mb-1">Message {requester.name}</h3>
              <p className="text-white/70 text-sm">
                Typically responds within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-5">
            <label
              htmlFor="message-textarea"
              className="block text-astradarkgray font-sb mb-2 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-astraprimary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Your Message
            </label>

            <div className="relative">
              <textarea
                id="message-textarea"
                className="w-full border border-astragray/30 rounded-lg p-4 min-h-32 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white shadow-inner"
                placeholder="Introduce yourself and explain why you're reaching out..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                aria-describedby="char-counter"
              ></textarea>
            </div>

            <div className="flex justify-between mt-2 text-xs text-astragray">
              <p>Be professional and clear about your intent</p>
              <p id="char-counter" className={`${message.length > 500 ? 'text-red-500 font-medium' : ''}`}>
                {message.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="mb-5">
            <p className="text-sm text-astradarkgray mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map(reply => (
                <button
                  key={reply.id}
                  onClick={() => setMessage(reply.message)}
                  className="text-sm px-3 py-1 bg-astralightgray hover:bg-astragray/20 rounded-full text-astradarkgray transition-colors"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-astralightgray/40 border-t border-astragray/10 flex justify-between items-center">
          <div className="text-sm text-astradarkgray">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Messages are monitored for community guidelines
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="px-6 py-2.5 bg-white border border-astragray/30 rounded-lg font-sb hover:bg-astragray/10 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-6 py-2.5 rounded-lg font-sb flex items-center transition-all ${
                !message.trim()
                  ? 'bg-astragray/50 text-astradarkgray/50 cursor-not-allowed'
                  : 'bg-astraprimary text-astrawhite hover:bg-astraprimary/90 shadow-md shadow-astraprimary/20'
              }`}
              onClick={onSend}
              disabled={!message.trim()}
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}