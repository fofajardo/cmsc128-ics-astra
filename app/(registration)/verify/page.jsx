"use client";
import { useState } from "react";
import Image from "next/image";
import ToastNotification from "@/components/ToastNotification";

export default function EmailVerification() {
  const [toastData, setToastData] = useState(null);

  const handleResendLink = () => {
    setToastData({
      type: "success",
      message: "Verification link resent!",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-astratintedwhite)] p-4">
      <div className="max-w-md w-full p-8 rounded-lg shadow-sm text-center bg-white flex flex-col items-center justify-center">
        <div className="mb-4">
          <Image
            src="/astronaut.png?height=150&width=150"
            alt="Astronaut"
            width={150}
            height={150}
            className="mx-auto"
          />
        </div>
        <p className="text-gray-700 mb-2 text-sm md:text-base">
          Your email is currently unverified. Please check your email address.
        </p>
        <div className="mt-2">
          <span className="text-sm md:text-base">Didn&apos;t receive? </span>
          <button
            onClick={handleResendLink}
            className="text-[var(--color-astralight)] text-sm md:text-base hover:underline"
          >
            Resend
          </button>
        </div>
      </div>

      {toastData && (
        <ToastNotification
          type={toastData.type}
          message={toastData.message}
          onClose={() => setToastData(null)}
        />
      )}
    </div>
  );
}
