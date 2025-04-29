"use client"
import { useState } from "react";
import ToastNotification from "@/components/ToastNotification";

export default function CheckEmail() {
  const [showToast, setShowToast] = useState(false);

  const handleOpenEmailApp = () => {
    window.location.href = "/recover/3"
  }

  const handleResend = () => {
    setShowToast({
      type: "success",
      message: "Email resent successfully!",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-astratintedwhite)]">
      <div className="w-full max-w-md">
        <div className="p-8 rounded-lg shadow-sm text-center bg-[var(--color-astrawhite)]">
            <div className="flex justify-center mb-4">
                <img src="/recover/assets/email-icon.png" alt="Key Icon" width="60" height="60" />
            </div>

            <h1 className="text-xl font-medium mb-2 text-[var(--color-astrablack)]">
                Check your email
            </h1>
            <p className="text-sm mb-6 text-gray-700">
                We've sent a password reset link to your email
            </p>

            <button
                className="w-full py-2.5 px-4 rounded-md text-sm mb-4 text-white bg-[var(--color-astraprimary)]"
                onClick={handleOpenEmailApp}
            >
                Open Email App
            </button>

            <p className="text-sm mb-2 text-gray-700">
                Don't receive the email?{" "}
                <span className="text-sm cursor-pointer text-[var(--color-astraprimary)]" onClick={handleResend}>
                    Click to resend
                </span>
            </p>

            <div
                className="text-sm cursor-pointer text-[var(--color-astraprimary)]"
                onClick={() => (window.location.href = "/login")}
            >
                Back to Sign In
            </div>
        </div>
      </div>

      {showToast && (
        <ToastNotification
            type={showToast.type}
            message={showToast.message}
            onClose={() => setShowToast(null)} // Close the toast when it disappears
        />
      )}
    </div>
  )
}
