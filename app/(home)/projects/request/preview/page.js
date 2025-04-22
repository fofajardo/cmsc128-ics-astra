"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

const FundraiserConfirmPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const zipCode = searchParams.get("zipCode");
  const amount = searchParams.get("amount");
  const photoPreview = searchParams.get("photoPreview");

  const handleSubmit = () => {
    // Here, you might submit the data to a backend
    alert("Submitted! You can now connect this to an API call.");
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-astrawhite">
      <h1 className="text-4xl font-bold mb-6 text-astrablack">
        Review Your Fundraiser
      </h1>

      <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-md">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-astrablack">Title</h2>
            <p className="text-astradarkgray">{title}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-astrablack">Description</h2>
            <p className="text-astradarkgray whitespace-pre-line">{description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-astrablack">Zip Code</h2>
            <p className="text-astradarkgray">{zipCode}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-astrablack">Amount</h2>
            <p className="text-astradarkgray">₱{amount}</p>
          </div>
        </div>

        <div className="w-full h-full">
          {photoPreview ? (
            photoPreview.startsWith("data:image/") ? (
              <img
                src={photoPreview}
                alt="Fundraiser Visual Preview"
                className="w-full h-auto rounded-lg shadow"
              />
            ) : (
              <video
                src={photoPreview}
                controls
                className="w-full rounded-lg shadow"
              />
            )
          ) : (
            <p className="text-astradarkgray italic">No image or video uploaded.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={() => router.back()}
          className="bg-astralightgray text-astrablack px-6 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          Go Back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-astraprimary text-white px-6 py-2 rounded-lg hover:bg-astradarkgray transition"
        >
          Submit Fundraiser
        </button>
      </div>
    </div>
  );
};

export default FundraiserConfirmPage;
