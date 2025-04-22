"use client";

import { Icon } from "@iconify/react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-12 flex-wrap gap-1">
      <button
        className="px-4 py-2 rounded-md bg-astrawhite border border-astragray text-astradark hover:bg-astralight disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Icon icon="ic:round-chevron-left" className="text-xl" />
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`w-10 h-10 rounded-md border text-sm font-semibold transition-all cursor-pointer ${
            page === currentPage
              ? "bg-astraprimary text-astrawhite border-astraprimary shadow-lg"
              : "bg-astrawhite text-astradark border-astragray hover:bg-astralight hover:border-astradark"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="px-4 py-2 rounded-md bg-astrawhite border border-astragray text-astradark hover:bg-astralight disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Icon icon="ic:round-chevron-right" className="text-xl" />
      </button>
    </div>
  );
}
