// EditModal.jsx
import { Edit3 } from "lucide-react";

export default function EditModal({ isOpen, onClose, fundraiser, onSubmit }) {
  if (!isOpen || !fundraiser) return null;

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
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl text-white mb-1 font-bold">
                Request Fundraiser Edit
              </h3>
              <p className="text-white/70 text-sm">
                {fundraiser.title}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-astradarkgray mb-6">
              To request changes to your approved fundraiser, please select the sections
              you'd like to modify and provide details about the requested changes.
              An administrator will review your request.
            </p>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="rounded text-astraprimary" />
                  <span className="font-medium">Title</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-astragray/30 rounded-lg p-3 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white"
                  placeholder="New title"
                  defaultValue={fundraiser.title}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="rounded text-astraprimary" />
                  <span className="font-medium">Description</span>
                </label>
                <textarea
                  className="w-full border border-astragray/30 rounded-lg p-3 min-h-24 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white"
                  placeholder="New description"
                  defaultValue={fundraiser.description}
                ></textarea>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="rounded text-astraprimary" />
                  <span className="font-medium">End Date</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-astragray/30 rounded-lg p-3 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white"
                  defaultValue={fundraiser.endDate}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="rounded text-astraprimary" />
                  <span className="font-medium">Other Changes</span>
                </label>
                <textarea
                  className="w-full border border-astragray/30 rounded-lg p-3 min-h-24 focus:ring-2 focus:ring-astraprimary/30 focus:border-astraprimary transition-all bg-white"
                  placeholder="Describe any other changes you'd like to make"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-astralightgray/40 border-t border-astragray/10 flex justify-between items-center">
          <div className="text-sm text-astradarkgray">
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-astraprimary"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Your request will be reviewed within 1-2 business days</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-astradarkgray border border-astragray/30 rounded-lg hover:bg-astragray/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-5 py-2 bg-gradient-to-r from-astraprimary to-astrasecondary text-white rounded-lg shadow-md hover:brightness-105 transition-all flex items-center space-x-2"
            >
              <span>Submit Request</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}