"use client";

import { useState } from "react";
import ToastNotification from "@/components/ToastNotification";

export default function SecurityCode() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [showToast, setShowToast] = useState(null);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Only allow a single digit (0-9)

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && code[index] === "") {
      if (index > 0) {
        const prevInput = document.getElementById(`code-${index - 1}`);
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        if (prevInput) prevInput.focus();
      }
    }
  };

  const handleVerify = () => {
    const isComplete = code.every(digit => digit !== "");

    if (!isComplete) {
      setShowToast({
        type: "fail",
        message: "Please enter the complete security code.",
      });
      return;
    }

    window.location.href = "/profile";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-astratintedwhite)] p-4">
      <div className="max-w-md w-full p-8 flex flex-col items-center justify-center text-center bg-white rounded shadow">
        <div className="flex justify-center mb-4">
          <img src="/recover/assets/pass-icon.png" alt="Key Icon" width="60" height="60" />
        </div>
        <h2 className="text-xl font-bold text-[var(--color-astrablack)] mb-1">Enter security code</h2>
        <p className="text-sm text-gray-700 mb-6">
          Open your authenticator app and enter the security code it provides.
        </p>
        <div className="flex gap-2 mb-6">
          {code.map((digit, i) => (
            <input
              key={i}
              id={`code-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              inputMode="numeric"
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-10 h-12 border border-gray-300 rounded text-center text-lg"
            />
          ))}
        </div>
        <div
          onClick={handleVerify}
          className="w-full cursor-pointer text-white text-center py-2 rounded bg-[var(--color-astraprimary)] hover:bg-[var(--color-astraprimary)]/90"
        >
          Verify
        </div>
      </div>
      {showToast && (
        <ToastNotification
          type={showToast.type}
          message={showToast.message}
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
}
