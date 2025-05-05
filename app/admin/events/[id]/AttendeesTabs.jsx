"use client";

export default function AttendeesTabs({ attendees, interested, activeTab, setActiveTab, setCurrentPage }) {
  return (
    <div className="flex gap-6 border-b mb-6">
      {/* <button
        onClick={() => { setActiveTab("going"); setCurrentPage(1); }}
        className={`pb-2 text-lg font-semibold transition-all rounded-t-md px-4 py-2 ${
          activeTab === "going"
            ? "bg-astragray text-astrablue"
            : "text-astradarkgray hover:bg-astraprimary hover:text-astrawhite"
        }`}
      >
        Going ({attendees.length} / 50)
      </button> */}
      <button
        onClick={() => { setActiveTab("interested"); setCurrentPage(1); }}
        className={`pb-2 text-lg font-semibold transition-all rounded-t-md px-4 py-2 ${
          activeTab === "interested"
            ? "bg-astragray text-astrablue"
            : "text-astradarkgray hover:bg-astraprimary hover:text-astrawhite"
        }`}
      >
        Interested ({interested.length})
      </button>
    </div>
  );
}
