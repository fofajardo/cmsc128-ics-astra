"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import CardCarousel from "./CardCarousel"; // ✅ Imported reusable card

export default function EventCarousel({ events }) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;

  // Navigate Left
  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  // Navigate Right
  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + visibleCount, events.length - visibleCount)
    );
  };

  const visibleEvents = events.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="relative">
      <h2 className="text-[28px] font-extrabold text-astradarkgray mb-10">
        Latest Events
      </h2>

      <div className="relative flex items-center gap-4">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-[-20px] z-10 bg-white shadow-md hover:bg-astragray transition-all p-2 rounded-full cursor-pointer"
        >
          <Icon icon="ic:baseline-keyboard-arrow-left" className="text-3xl" />
        </button>

        {/* Card Grid */}
        <div className="grid grid-cols-5 gap-6 w-full transition-all duration-500 ease-in-out">
          {visibleEvents.map((event, index) => (
            <CardCarousel key={index} event={event} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-[-20px] z-10 bg-white shadow-md hover:bg-astragray transition-all p-2 rounded-full cursor-pointer"
        >
          <Icon icon="ic:baseline-keyboard-arrow-right" className="text-3xl" />
        </button>
      </div>
    </div>
  );
}
