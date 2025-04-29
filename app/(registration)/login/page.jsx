"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = [];

    // Check if all fields are filled
    if (!email || !password) {
      newErrors.push("Please fill in all fields.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-astratintedwhite)]">
      {/* Left Side */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center px-4 md:px-8">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <img
            src="/astra-logo.png"
            alt="ICS-ASTRA Logo"
            width={70}
            height={70}
            className="mb-3"
          />
          <Link
            href="/"
            className="flex items-center text-[var(--color-astrablack)] hover:text-[var(--color-astraprimary)] transition-colors text-sm md:text-base font-medium"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-astrablack)]">Sign In</h2>
            <Link
              href="/signup"
              className="text-[var(--color-astraprimary)] text-sm md:text-base hover:underline"
            >
              Create an account
            </Link>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm md:text-base w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-astraprimary] bg-white text-gray-900"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm md:text-base w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-astraprimary] bg-white text-gray-900"
              />
            </div>

            {errors.length > 0 && (
              <div className="bg-red-100 text-[var(--color-astrared)] text-sm md:text-base px-3 py-2 rounded">
                {errors.map((err, idx) => (
                  <p key={idx}>{err}</p>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="text-sm md:text-base w-full bg-[var(--color-astraprimary)] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/recover"
              className="text-[var(--color-astraprimary)] text-sm md:text-base hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="mt-6">
            <button className="w-full border border-[var(--color-astradirtywhite)] bg-white hover:bg-gray-100 rounded-md py-2 px-4 flex items-center justify-center transition-colors">
              <User size={18} className="mr-2 text-[var(--color-astralightgray)]" />
              <span className="text-sm md:text-base text-[var(--color-astrablack)]">Continue as Guest</span>
            </button>
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
