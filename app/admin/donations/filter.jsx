import { useState } from "react";
import { DONATION_MODE_OF_PAYMENT, DONATION_MODE_OF_PAYMENT_LABELS } from "@/constants/donationConsts";

export default function SearchFilter({onClose, onApply}) {
  const initialFilters = {
    donor: "",
    projectTitle: "",
    fromDate: "",
    toDate: "",
    modeOfPayment: "",
    fromAmount: "",
    toAmount: "",
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

      {/* Donor */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-lg">Donor</div>
          <button
            onClick={() => setFilters({ ...filters, donor: ""})}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>
        <input
          type="text"
          placeholder="Ex. Juan Dela Cruz"
          value={filters.donor}
          onChange={(e) => setFilters({ ...filters, donor: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
        />
      </div>

      {/* Project Title */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-lg">Project Title</div>
          <button
            onClick={() => setFilters({ ...filters, projectTitle: ""})}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>
        <input
          type="text"
          placeholder="Ex. EAA Hall Sound System Upgrade"
          value={filters.projectTitle}
          onChange={(e) => setFilters({ ...filters, projectTitle: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
        />
      </div>

      {/* Donation Date */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-lg">Donation Date</div>
          <button
            onClick={() => setFilters({ ...filters, fromDate: "", toDate: "" })}
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

      {/* Mode of Payment */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-lg">Mode of Payment</div>
          <button
            onClick={() => setFilters({ ...filters, fromDate: "", toDate: "" })}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>
        <select
          value={filters.modeOfPayment}
          onChange={(e) => setFilters({ ...filters, modeOfPayment: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
        >
          <option value="">Select Mode of Payment</option>
          <option value={DONATION_MODE_OF_PAYMENT_LABELS[DONATION_MODE_OF_PAYMENT.PHYSICAL_PAYMENT]}>{DONATION_MODE_OF_PAYMENT_LABELS[DONATION_MODE_OF_PAYMENT.PHYSICAL_PAYMENT]}</option>
          <option value={DONATION_MODE_OF_PAYMENT_LABELS[DONATION_MODE_OF_PAYMENT.BANK_TRANSFER]}>{DONATION_MODE_OF_PAYMENT_LABELS[DONATION_MODE_OF_PAYMENT.BANK_TRANSFER]}</option>
        </select>
      </div>

      {/* Amount */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-lg">Amount</div>
          <button
            onClick={() => setFilters({ ...filters, fromAmount: "", toAmount: "" })}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min. amount"
            value={filters.fromAmount}
            onChange={(e) => setFilters({ ...filters, fromAmount: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
          />
          <input
            type="number"
            placeholder="Max amount"
            value={filters.toAmount}
            onChange={(e) => setFilters({ ...filters, toAmount: e.target.value })}
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
            <option value="name">Donor</option>
            <option value="projectTitle">Project Title</option>
            <option value="donationDate">Donation Date</option>
            <option value="modeOfPayment">Mode of Payment</option>
            <option value="amount">Amount</option>
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
