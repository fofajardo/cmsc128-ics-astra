import { useState } from "react";

export default function SearchFilter({onClose, onApply}) {
  const initialFilters = {
    orgName: "",
    fromDate: "",
    toDate: "",
    sortCategory: "",
    sortOrder: "asc",
  };

  const [filters, setFilters] = useState(initialFilters);


  const handleResetAll = () => {
    setFilters(initialFilters);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(filters);
    }
    onClose(); // optionally close after apply
  };

  return (
    <div className="bg-astrawhite p-6 rounded-2xl shadow-lg space-y-4 overflow-y-auto h-auto">
      <div className="flex justify-between items-center">
        <div className="text-astrablack text-2xl font-semibold">Filter by:</div>
        <button className="text-xl text-astradarkgray hover:text-astrablack font-bold" onClick={onClose}>&times;</button>
      </div>

      {/* Organization Name */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-lg">Organization</div>
          <button
            onClick={() => setFilters({ ...filters, orgName: ""})}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>
        <input
          type="text"
          placeholder="Ex. UPLB IRRI"
          value={filters.orgName}
          onChange={(e) => setFilters({ ...filters, orgName: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
        />
      </div>

      {/* Date Posted */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-lg">Founded Date</div>
          <button
            onClick={() => setFilters({ ...filters, fromDate: "", yearDate: "" })}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="From"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
          />
          <input
            type="text"
            placeholder="Latest"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-astrablack text-2xl font-semibold">Sort by:</div>
          <button
            onClick={() => setFilters({ ...filters, sortCategory: "", sortOrder: "asc" })}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>

        <div className="flex">
          <select
            value={filters.sortCategory}
            onChange={(e) => setFilters({ ...filters, sortCategory: e.target.value })}
            className="flex-grow px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
          >
            <option value="">Select Category</option>
            <option value="name">Organization Name</option>
            <option value="founded_date">Founded Date</option>
          </select>

          <div className="flex ml-2">
            {["asc", "desc"].map((order) => (
              <button
                key={order}
                onClick={() => setFilters({ ...filters, sortOrder: order })}
                className={`w-full px-4 py-2 font-sb transition text-sm ${
                  filters.sortOrder === order
                    ? "bg-astraprimary text-white"
                    : "bg-white text-astraprimary border border-astraprimary"
                }`}
              >
                {order === "asc" ? "Ascending" : "Descending"}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          className="w-full py-4 rounded-md border border-astraprimary text-astraprimary hover:bg-astralight/20 transition font-sb"
          onClick={handleResetAll}
        >
          Reset All
        </button>
        <button
          className="w-full py-4 rounded-md bg-astraprimary text-white hover:bg-astradark transition font-sb"
          onClick={handleApply}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
