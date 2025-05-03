// TabNavigation.jsx
export default function TabNavigation({ activeTab, handleTabChange }) {
  return (
    <div className="flex border-b border-astragray/20">
      <button
        onClick={() => handleTabChange("all")}
        className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
          activeTab === "all"
            ? "text-astraprimary border-b-2 border-astraprimary"
            : "text-astradarkgray hover:text-astraprimary"
        }`}
      >
        All Fundraisers
      </button>
      <button
        onClick={() => handleTabChange("approved")}
        className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
          activeTab === "approved"
            ? "text-astraprimary border-b-2 border-astraprimary"
            : "text-astradarkgray hover:text-astraprimary"
        }`}
      >
        Approved
      </button>
      <button
        onClick={() => handleTabChange("pending")}
        className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
          activeTab === "pending"
            ? "text-astraprimary border-b-2 border-astraprimary"
            : "text-astradarkgray hover:text-astraprimary"
        }`}
      >
        Pending
      </button>
      <button
        onClick={() => handleTabChange("rejected")}
        className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
          activeTab === "rejected"
            ? "text-astraprimary border-b-2 border-astraprimary"
            : "text-astradarkgray hover:text-astraprimary"
        }`}
      >
        Rejected
      </button>
    </div>
  );
}