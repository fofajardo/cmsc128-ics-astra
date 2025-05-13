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
    verificationStatus: "",
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
    <div className="bg-astrawhite p-4 md:p-6 rounded-2xl shadow-lg space-y-3 md:space-y-4 overflow-y-auto max-h-[90vh] w-[90vw] md:w-[600px] lg:w-[700px]">
      <div className="flex justify-between items-center">
        <div className="text-astrablack text-xl md:text-2xl font-semibold">Filter by:</div>
        <button className="text-xl text-astradarkgray hover:text-astrablack font-bold" onClick={onClose}>&times;</button>
      </div>

      {/* Donor */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-base md:text-lg">Donor</div>
          <button
            onClick={() => setFilters({ ...filters, donor: ""})}
            className="text-astraprimary font-sb text-xs md:text-sm"
          >
            Reset
          </button>
        </div>
        <input
          type="text"
          placeholder="Ex. Juan Dela Cruz"
          value={filters.donor}
          onChange={(e) => setFilters({ ...filters, donor: e.target.value })}
          className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-gray-300 bg-white font-r text-sm md:text-base"
        />
      </div>

      {/* Project Title */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-base md:text-lg">Project Title</div>
          <button
            onClick={() => setFilters({ ...filters, projectTitle: ""})}
            className="text-astraprimary font-sb text-xs md:text-sm"
          >
            Reset
          </button>
        </div>
        <input
          type="text"
          placeholder="Ex. EAA Hall Sound System Upgrade"
          value={filters.projectTitle}
          onChange={(e) => setFilters({ ...filters, projectTitle: e.target.value })}
          className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-gray-300 bg-white font-r text-sm md:text-base"
        />
      </div>

      {/* Donation Date */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-base md:text-lg">Donation Date</div>
          <button
            onClick={() => setFilters({ ...filters, fromDate: "", toDate: "" })}
            className="text-astraprimary font-sb text-xs md:text-sm"
          >
            Reset
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="From"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-gray-300 bg-white font-r text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Latest"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-gray-300 bg-white font-r text-sm md:text-base"
          />
        </div>
      </div>

      {/* Mode of Payment */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-base md:text-lg">Mode of Payment</div>
          <button
            onClick={() => setFilters({ ...filters, modeOfPayment: "" })}
            className="text-astraprimary font-sb text-xs md:text-sm"
          >
            Reset
          </button>
        </div>
        <select
          value={filters.modeOfPayment}
          onChange={(e) => setFilters({ ...filters, modeOfPayment: e.target.value })}
          className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-gray-300 bg-white font-r text-sm md:text-base"
        >
          <option value="">Select Mode of Payment</option>
          <option value={DONATION_MODE_OF_PAYMENT_LABELS[DONATION_MODE_OF_PAYMENT.PHYSICAL_PAYMENT]}>{DONATION_MODE_OF_PAYMENT_LABELS[DONATION_MODE_OF_PAYMENT.PHYSICAL_PAYMENT]}</option>
          <option value={DONATION_MODE_OF_PAYMENT_LABELS[DONATION_MODE_OF_PAYMENT.BANK_TRANSFER]}>{DONATION_MODE_OF_PAYMENT_LABELS[DONATION_MODE_OF_PAYMENT.BANK_TRANSFER]}</option>
        </select>
      </div>

      {/* Verification Status */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-base md:text-lg">Verification Status</div>
          <button
            onClick={() => setFilters({ ...filters, verificationStatus: "" })}
            className="text-astraprimary font-sb text-xs md:text-sm"
          >
            Reset
          </button>
        </div>
        <select
          value={filters.verificationStatus}
          onChange={(e) => setFilters({ ...filters, verificationStatus: e.target.value })}
          className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-gray-300 bg-white font-r text-sm md:text-base"
        >
          <option value="">All Status</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Amount */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-black font-medium text-base md:text-lg">Amount</div>
          <button
            onClick={() => setFilters({ ...filters, fromAmount: "", toAmount: "" })}
            className="text-astraprimary font-sb text-xs md:text-sm"
          >
            Reset
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="number"
            placeholder="Min. amount"
            value={filters.fromAmount}
            onChange={(e) => setFilters({ ...filters, fromAmount: e.target.value })}
            className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-gray-300 bg-white font-r text-sm md:text-base"
          />
          <input
            type="number"
            placeholder="Max amount"
            value={filters.toAmount}
            onChange={(e) => setFilters({ ...filters, toAmount: e.target.value })}
            className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-gray-300 bg-white font-r text-sm md:text-base"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="text-astrablack text-xl md:text-2xl font-semibold">Sort by:</div>
          <button
            onClick={() => setFilters({ ...filters, sortCategory: "", sortOrder: "asc" })}
            className="text-astraprimary font-sb text-xs md:text-sm"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <select
            value={filters.sortCategory}
            onChange={(e) => setFilters({ ...filters, sortCategory: e.target.value })}
            className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-gray-300 bg-white font-r text-sm md:text-base"
          >
            <option value="">Select Category</option>
            <option value="name">Donor</option>
            <option value="projectTitle">Project Title</option>
            <option value="donationDate">Donation Date</option>
            <option value="modeOfPayment">Mode of Payment</option>
            <option value="amount">Amount</option>
          </select>

          <div className="flex gap-2">
            {["asc", "desc"].map((order) => (
              <button
                key={order}
                onClick={() => setFilters({ ...filters, sortOrder: order })}
                className={`flex-1 px-3 md:px-4 py-2 md:py-2.5 font-sb transition text-xs md:text-sm ${
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
      <div className="flex flex-col md:flex-row gap-2 pt-2">
        <button
          className="w-full py-3 md:py-4 rounded-md border border-astraprimary text-astraprimary hover:bg-astralight/20 transition font-sb text-sm md:text-base"
          onClick={handleResetAll}
        >
          Reset All
        </button>
        <button
          className="w-full py-3 md:py-4 rounded-md bg-astraprimary text-white hover:bg-astradark transition font-sb text-sm md:text-base"
          onClick={handleApply}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
