"use client";

import { useState } from "react";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = () => {
    // Simple validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Clear any errors
    setError("");

    window.location.href = "/recover/4";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-astratintedwhite)]">
      <div className="w-full max-w-md">
        <div className="p-8 rounded-lg shadow-sm text-center bg-[var(--color-astrawhite)]">
          <div className="flex justify-center mb-4">
            <img src="/recover/assets/pass-icon.png" alt="Key Icon" width="60" height="60" />
          </div>

          <h1 className="text-xl font-medium mb-2 text-[var(--color-astrablack)]">
            Set new password
          </h1>
          <p className="text-sm mb-6 text-gray-700">
            Your new password must be different from previous used passwords.
          </p>

          {error && <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm rounded-md">{error}</div>}

          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1 text-[var(--color-astrablack)]">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-2.5 border border-gray-200 rounded-md text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6 text-left">
            <label className="block text-sm font-medium mb-1 text-[var(--color-astrablack)]">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full p-2.5 border border-gray-200 rounded-md text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full py-2.5 px-4 rounded-md text-sm mb-4 text-white bg-[var(--color-astraprimary)]"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
          <div
            className="text-sm cursor-pointer text-[var(--color-astraprimary)]"
            onClick={() => (window.location.href = "/login")}
          >
            Back to Sign In
          </div>
        </div>
      </div>
    </div>
  );
}
