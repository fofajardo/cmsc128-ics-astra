"use client";
import React from "react";

export function NewsItem() {
  return (
    <div className="flex flex-col gap-5">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-5 bg-white shadow-md rounded-lg">
          <h3 className="text-2xl font-bold text-slate-900">
            News Title {index + 1}
          </h3>
          <p className="mt-2 text-slate-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            nec odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
        </div>
      ))}
    </div>
  );
}
