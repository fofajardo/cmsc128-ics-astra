import { AlertCircle, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RejectionDetailsModal({
  isOpen,
  onClose,
  fundraiser
}) {
  const router = useRouter();

  if (!isOpen || !fundraiser) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-white to-astrawhite rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideUp border border-white/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500/90 to-red-600 p-6 relative">
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
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 shadow-md">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl text-white mb-1 font-bold">
                Fundraiser Rejected
              </h3>
              <p className="text-white/70 text-sm">
                {fundraiser.title}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-astrablack mb-2">
                Reason for Rejection
              </h4>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">
                  {fundraiser.rejectionReason.mainReason}
                </p>
                <p className="text-sm text-astradarkgray mt-2">
                  {fundraiser.rejectionReason.details}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-astrablack mb-2">
                Resubmission Guidelines
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-astradarkgray">
                  {fundraiser.rejectionReason.resubmissionGuidelines}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-astralightgray/40 border-t border-astragray/10 flex justify-between items-center">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-lg border border-astragray/30 text-astradarkgray hover:bg-astragray/10 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              router.push("/projects/create");
            }}
            className="py-2 px-4 rounded-lg bg-astraprimary text-white hover:bg-astraprimary/90 transition-colors flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Resubmit Fundraiser
          </button>
        </div>
      </div>
    </div>
  );
}