"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const validateForm = () => {
    const newErrors = [];

    if (!email || !password || !confirmPassword) {
      newErrors.push("Please fill in all fields.");
    }

    if (email && !email.includes("@")) newErrors.push("Invalid email format.");
    if (password && password.length < 8) newErrors.push("Password must be at least 8 characters.");
    if (password !== confirmPassword) newErrors.push("Passwords do not match.");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      window.location.href = "/signup/2";
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-astratintedwhite)]">
      {/* Left Side */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center px-4 md:px-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          {/* Logo and Back to Home */}
          <div className="flex flex-col items-center mb-4">
            <img
              src="/astra-logo-w-name.png"
              alt="ICS-ASTRA Logo"
              height={30}
              width={120}
              className="w-auto mb-2"
            />
            <Link
              href="/"
              className="flex items-center text-[var(--color-astrablack)] hover:text-[var(--color-astraprimary)] transition-colors text-sm md:text-base font-medium bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-astrablack)]">Sign Up</h2>
            <Link href="/sign-in" className="text-[var(--color-astraprimary)] text-sm md:text-base hover:underline">
              I have an account
            </Link>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900 text-sm md:text-base"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900 text-sm md:text-base"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900 text-sm md:text-base"
            />

            {errors.length > 0 && (
              <div className="bg-red-100 text-[var(--color-astrared)] text-sm px-3 py-2 rounded">
                {errors.map((err, idx) => (
                  <p key={idx}>{err}</p>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="text-sm md:text-base w-full bg-[var(--color-astraprimary)] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/recover" className="text-[var(--color-astraprimary)] text-sm md:text-base hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="mt-6">
            <button className="w-full border border-[var(--color-astradirtywhite)] bg-white hover:bg-gray-100 rounded-md py-2 px-4 flex items-center justify-center transition-colors">
              <User size={18} className="mr-2 text-[var(--color-astralightgray)]" />
              <span className="text-sm md:text-base text-[var(--color-astrablack)]">Continue as Guest</span>
            </button>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-astraprimary)]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>

      {/* Right Side (Background Image) */}
      <div className="hidden md:block md:w-1/2 bg-[var(--color-astraprimary)]">
        <img
          src="/blue-bg.png"
          alt="Background"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
