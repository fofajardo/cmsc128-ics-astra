"use client";
import React from "react";

export function YearFilter() {
  return (
    <div className="flex justify-center mt-10">
      <select className="px-4 py-2 border border-gray-300 rounded-lg">
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
      </select>
    </div>
  );
}
