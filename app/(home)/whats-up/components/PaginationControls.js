"use client";
import React from "react";

export function PaginationControls() {
  return (
    <div className="flex justify-center mt-10">
      <button className="px-4 py-2 mx-2 bg-astraprimary text-white rounded-lg">
        Previous
      </button>
      <button className="px-4 py-2 mx-2 bg-astraprimary text-white rounded-lg">
        Next
      </button>
    </div>
  );
}
