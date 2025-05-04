"use client";
import { useState } from "react";
import { MessageSquare, User, Send } from "lucide-react";

export default function MessagesModal({ fundraiser, onClose, onSendMessage }) {
  const [message, setMessage] = useState("");

  // Format timestamp to readable date and time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-astraprimary shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl text-white mb-1 font-bold">
                Messages
              </h3>
              <p className="text-white/70 text-sm">
                {fundraiser.title}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {fundraiser.messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-astralightgray/50 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-astradarkgray/50" />
              </div>
              <h4 className="text-lg font-medium text-astradarkgray mb-1">
                No messages yet
              </h4>
              <p className="text-astradarkgray/70 text-sm">
                Messages related to your fundraiser will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {fundraiser.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.sender === "You"
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === "You"
                        ? "bg-astraprimary text-white"
                        : "bg-astralightgray text-astradarkgray"
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div
                    className={`max-w-[80%] ${
                      msg.sender === "You"
                        ? "bg-astraprimary text-white"
                        : "bg-astralightgray text-astradarkgray"
                    } p-3 rounded-lg`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">
                        {msg.sender}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Message Input */}
        <div className="p-4 bg-astralightgray/40 border-t border-astragray/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-astragray/30 py-2 px-4 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`py-2 px-4 rounded-lg ${
                message.trim()
                  ? "bg-astraprimary text-white hover:bg-astraprimary/90"
                  : "bg-astragray/30 text-astragray/50 cursor-not-allowed"
              } transition-colors flex items-center gap-2`}
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}