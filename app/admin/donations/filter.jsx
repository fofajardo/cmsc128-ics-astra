import { useState, useEffect } from "react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/datepicker.css";
import { DONATION_MODE_OF_PAYMENT, DONATION_MODE_OF_PAYMENT_LABELS } from "@/constants/donationConsts";

export default function SearchFilter({ onClose, onApply }) {
  const [filters, setFilters] = useState({
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
  });

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
    setFilters((prev) => ({
      ...prev,
      fromDate: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    setFilters((prev) => ({
      ...prev,
      toDate: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      donor: "",
      projectTitle: "",
      fromDate: "",
      toDate: "",
      modeOfPayment: "",
      fromAmount: "",
      toAmount: "",
      verificationStatus: "",
    });
    setFromDate(null);
    setToDate(null);
    onApply({
      donor: "",
      projectTitle: "",
      fromDate: "",
      toDate: "",
      modeOfPayment: "",
      fromAmount: "",
      toAmount: "",
      verificationStatus: "",
    });
    onClose();
  };

  return (
    <div className="bg-white rounded-xl p-6 w-[90vw] max-w-[600px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filter Donations</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Donor Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name</label>
          <input
            type="text"
            name="donor"
            value={filters.donor}
            onChange={handleInputChange}
            placeholder="Enter donor name"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astraprimary"
          />
        </div>

        {/* Project Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
          <input
            type="text"
            name="projectTitle"
            value={filters.projectTitle}
            onChange={handleInputChange}
            placeholder="Enter project title"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astraprimary"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <div className="relative">
              <DatePicker
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select start date"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astraprimary"
                wrapperClassName="w-full"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={10}
                showMonthDropdown
                scrollableMonthDropdown
                popperClassName="react-datepicker-popper"
                popperPlacement="bottom-start"
                popperModifiers={[
                  {
                    name: "offset",
                    options: {
                      offset: [0, 8],
                    },
                  },
                ]}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-astraprimary pointer-events-none"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <div className="relative">
              <DatePicker
                selected={toDate}
                onChange={handleToDateChange}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select end date"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astraprimary"
                wrapperClassName="w-full"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={10}
                showMonthDropdown
                scrollableMonthDropdown
                popperClassName="react-datepicker-popper"
                popperPlacement="bottom-start"
                popperModifiers={[
                  {
                    name: "offset",
                    options: {
                      offset: [0, 8],
                    },
                  },
                ]}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-astraprimary pointer-events-none"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>
        </div>

        {/* Mode of Payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Payment</label>
          <select
            name="modeOfPayment"
            value={filters.modeOfPayment}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astraprimary"
          >
            <option value="">All</option>
            {Object.entries(DONATION_MODE_OF_PAYMENT_LABELS).map(([key, label]) => (
              <option key={key} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
            <input
              type="number"
              name="fromAmount"
              value={filters.fromAmount}
              onChange={handleInputChange}
              placeholder="Enter minimum amount"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astraprimary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
            <input
              type="number"
              name="toAmount"
              value={filters.toAmount}
              onChange={handleInputChange}
              placeholder="Enter maximum amount"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astraprimary"
            />
          </div>
        </div>

        {/* Verification Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
          <select
            name="verificationStatus"
            value={filters.verificationStatus}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astraprimary"
          >
            <option value="">All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-astraprimary border-2 border-astraprimary rounded-md hover:bg-astraprimary/10 font-medium transition-colors"
        >
          Reset All
        </button>
        <button
          onClick={handleApply}
          className="px-6 py-2 bg-astraprimary text-white rounded-md hover:bg-astraprimary/90 font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
