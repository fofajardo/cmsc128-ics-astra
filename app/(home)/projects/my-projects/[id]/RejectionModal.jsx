"use client";
import { XCircle, X, AlertTriangle, Edit3 } from "lucide-react";

export default function RejectionModal({ fundraiser, onClose, onResubmit }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-white to-astrawhite rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideUp border border-white/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 relative">
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
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 shadow-md">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl text-white mb-1 font-bold">
                Fundraiser Rejected
              </h3>
              <p className="text-white/70 text-sm">
                Here's why your fundraiser was not approved
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-red-600 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-red-700 mb-1">Reason for Rejection</h4>
                <p className="text-red-700/70 text-sm">
                  {fundraiser.rejectionReason ||
                    "Your fundraiser request doesn't meet our community guidelines. Please review the feedback below and consider resubmitting with the suggested changes."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-astradarkgray font-medium mb-2">Fundraiser Details</h4>
              <div className="bg-astralightgray/40 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-astradarkgray/70">Title</p>
                    <p className="font-medium">{fundraiser.title}</p>
                  </div>
                  <div>
                    <p className="text-astradarkgray/70">Type</p>
                    <p className="font-medium">{fundraiser.type}</p>
                  </div>
                  <div>
                    <p className="text-astradarkgray/70">Goal</p>
                    <p className="font-medium">{fundraiser.goal}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-astradarkgray font-medium mb-2">Admin Feedback</h4>
              <div className="border border-astragray/20 rounded-lg p-4">
                <ul className="space-y-3">
                  {fundraiser.adminFeedback ? (
                    fundraiser.adminFeedback.map((feedback, index) => (
                      <li key={index} className="flex space-x-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span className="text-sm text-astradarkgray">{feedback}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex space-x-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span className="text-sm text-astradarkgray">
                          The fundraiser goal amount is too high for the described purpose.
                        </span>
                      </li>
                      <li className="flex space-x-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span className="text-sm text-astradarkgray">
                          The description lacks specific details about how the funds will be used.
                        </span>
                      </li>
                      <li className="flex space-x-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span className="text-sm text-astradarkgray">
                          Please provide more information about your organization or credentials.
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-astradarkgray font-medium mb-2">Next Steps</h4>
              <p className="text-sm text-astradarkgray mb-4">
                You can resubmit your fundraiser by addressing the feedback provided above.
                Our team will review your new submission as soon as possible.
              </p>

              <div className="flex flex-wrap justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-astradarkgray border border-astragray/30 hover:bg-astragray/10 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={onResubmit}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-astraprimary text-white hover:bg-astraprimary/90 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Resubmit Fundraiser
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}