"use client";
import React from "react";

export default function NewsletterArchive({ isAdmin }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="p-4 bg-white shadow-md rounded-lg flex flex-col justify-between"
        >
          <h3 className="text-lg font-bold text-slate-900">
            Newsletter {index + 1}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            A brief description of the newsletter content goes here.
          </p>
        </div>
      ))}
    </div>
  );
}