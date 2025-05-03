// EmptyState.jsx
import { AlertCircle } from "lucide-react";

export default function EmptyState({ activeTab }) {
  return (
    <div className="text-center py-12">
      <div className="bg-astralightgray/50 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-astradarkgray/50" />
      </div>
      <h3 className="text-xl font-medium text-astradarkgray mb-2">
        No {activeTab !== "all" ? activeTab : ""} fundraisers found
      </h3>
      <p className="text-astradarkgray/80 max-w-md mx-auto">
        {activeTab === "all"
          ? "You haven't created any fundraisers yet. Start by creating your first fundraiser!"
          : `You don't have any ${activeTab} fundraisers at the moment.`}
      </p>
    </div>
  );
}