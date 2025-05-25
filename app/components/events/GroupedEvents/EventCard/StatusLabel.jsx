import { CheckCircle, XCircle } from "lucide-react";

export default function StatusLabel({ status }) {
  const isOpen = status === "Open";
  return (
    <span
      className={`flex items-center gap-2 px-4 py-1 rounded-md text-sm font-semibold shadow-sm transition-all duration-300 ${
        isOpen ? "bg-astragreen text-astrawhite" : "bg-astrared text-astrawhite"
      }`}
    >
      {isOpen ? (
        <>
          <CheckCircle size={16} className="text-astrawhite" />
          {status}
        </>
      ) : (
        <>
          <XCircle size={16} className="text-astrawhite" />
          {status}
        </>
      )}
    </span>
  );
}
