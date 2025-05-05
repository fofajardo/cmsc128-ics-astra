"use client";
import { useState } from "react";
import ToastNotification from "@/components/ToastNotification";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSendEmail = () => {

    if (!email) {
      setShowToast({
        type: "fail",
        message: "Please enter your email address.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setShowToast({
        type: "fail",
        message: "Please enter a valid email address.",
      });
      return;
    }

    window.location.href = "/recover/2"; // Redirect to next step
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-astratintedwhite)]">
      <div className="w-full max-w-md">
        <div className="p-8 rounded-lg shadow-sm text-center bg-[var(--color-astrawhite)]">
          <div className="flex justify-center mb-4">
            <img src="/recover/assets/key-icon.png" alt="Key Icon" width="60" height="60" />
          </div>

          <h1 className="text-xl font-medium mb-2 text-[var(--color-astrablack)]">
            Forgot password?
          </h1>
          <p className="text-sm mb-6 text-gray-700">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1 text-[var(--color-astrablack)]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2.5 border border-gray-200 rounded-md text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className="w-full py-2.5 px-4 rounded-md text-sm mb-4 text-white bg-[var(--color-astraprimary)]"
            onClick={handleSendEmail}
          >
            Send Email
          </button>

          <div
            className="text-sm cursor-pointer text-[var(--color-astraprimary)]"
            onClick={() => (window.location.href = "/sign-in")}
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
  );
}
