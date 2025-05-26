import { ChevronRight } from "lucide-react";

export default function TabNavigation({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="w-full md:w-64 border-r border-gray-200">
      <div className="p-4 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-sm w-full flex items-center justify-between p-3 rounded-md text-left ${
              activeTab === tab.id
                ? "bg-blue-50 text-[var(--color-astraprimary)]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              {tab.icon}
              <span>{tab.label}</span>
            </div>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                activeTab === tab.id ? "sm:rotate-90" : ""
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}