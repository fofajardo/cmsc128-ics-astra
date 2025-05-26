import { FileX, ArrowLeft, AlertTriangle, RefreshCw, Search } from "lucide-react";
import { GoBackButton } from "@/components/Buttons";

export default function ProfileNotFound({
  id,
  title = "Alumni Profile Not Found",
  message = "We couldn't find an alumni profile with this ID.",
  onBack = () => window.history.back()
}) {
  return (
    <div className="p-4 bg-astradirtywhite min-h-screen">
      <div className="max-w-6xl mx-auto my-1">
        <GoBackButton onClick={onBack} />
      </div>

      <div className="max-w-lg mx-auto mt-8 p-8 bg-white rounded-xl border border-astralightgray shadow-md animate-fadeIn">
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 p-4 bg-astrared/5 rounded-full">
            <FileX size={48} className="text-astrared animate-pulse" />
          </div>

          <h2 className="mt-2 font-lb text-xl text-astrablack">{title}</h2>

          <p className="mt-2 text-astradarkgray">
            {message}
          </p>

          {id && (
            <div className="flex items-center mt-4 text-astraprimary bg-astratintedwhite px-4 py-2 rounded-lg w-full justify-center">
              <AlertTriangle size={16} className="mr-2 text-astrared" />
              <span className="font-mono font-medium text-sm">{id}</span>
            </div>
          )}

          <div className="mt-6 w-full border-t border-astralightgray pt-6">
            <h3 className="font-rb text-left mb-3 text-astrablack">Possible Solutions:</h3>
            <ul className="text-left space-y-2 text-astradarkgray">
              <li className="flex items-start">
                <Search className="h-4 w-4 mt-0.5 mr-2 text-astraprimary" />
                <span>Verify the alumni ID is correct</span>
              </li>
              <li className="flex items-start">
                <RefreshCw className="h-4 w-4 mt-0.5 mr-2 text-astraprimary" />
                <span>Refresh the page and try again</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 mt-0.5 mr-2 text-astraprimary" />
                <span>Check if this account has been deactivated</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex justify-center w-full">
            <button
              className="flex items-center justify-center px-6 py-2.5 bg-astraprimary text-white rounded-md hover:bg-astraprimary/90 transition-colors"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Alumni List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}