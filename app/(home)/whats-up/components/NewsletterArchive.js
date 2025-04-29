"use client";
import React, { useState } from "react";
import Link from "next/link";

export function NewsletterArchive() {
  // Fallback image in case the main image fails to load
  const fallbackImage = "https://placehold.co/600x800/e2e8f0/475569?text=Newsletter";

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  // Create an array of 12 items for demo
  const newsletters = Array(12).fill().map((_, index) => ({
    title: `Newsletter ${index + 1}`,
    image: "https://marketplace.canva.com/EAGWT7FdhOk/1/0/1131w/canva-black-and-grey-modern-business-company-email-newsletter-R_dH5ll-SAs.jpg",
    pdfLink: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {newsletters.map((newsletter, index) => (
        <Link
          href={newsletter.pdfLink}
          key={index}
          target="_blank"
          className="block group"
        >
          <div className="aspect-[3/4] relative bg-black rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <img
              src={newsletter.image}
              alt={`Newsletter ${index + 1}`}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-medium text-lg">
                Volume {index + 1} - Newsletter.pdf
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}