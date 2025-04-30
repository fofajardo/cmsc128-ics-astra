"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

const collageItems = [
  {
    image: "https://international.uplb.edu.ph/wp-content/uploads/2022/04/DSC_1153-scaled.jpg",
    title: "Latest News & Announcements",
    description: "Stay updated with the latest campus highlights.",
  },
  {
    image: "https://live.staticflickr.com/2460/32576436890_05b40abfb4_h.jpg",
    title: "Request Forms",
    description: "Easily access academic and alumni request services.",
  },
  {
    image: "https://thumbs.dreamstime.com/b/los-banos-laguna-philippines-june-distant-view-uplb-university-philippines-los-banos-main-library-323558081.jpg",
    title: "Newsletter Archives",
    description: "Relive past stories, memories, and announcements.",
  },
];

export default function ImageCollage() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      {collageItems.map((item, idx) => (
        <Link key={idx} href="/whats-up">
          <div
            className="group relative overflow-hidden rounded-2xl h-[400px] bg-cover bg-center cursor-pointer shadow-lg"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-astradark/90 via-astraprimary/60 to-transparent opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out flex flex-col items-center justify-center text-center text-white p-6 space-y-4">
              <Sparkles size={40} className="text-white mb-2 animate-fade-bounce" />
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="text-base">{item.description}</p>
              <button className="mt-2 px-6 py-2 bg-white text-astradark font-semibold rounded-full hover:scale-105 hover:bg-astraprimary hover:text-white transition-all duration-300 shadow-md">
                Learn More
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[5px] bg-astradark" />
          </div>
        </Link>
      ))}
    </div>
  );
}
