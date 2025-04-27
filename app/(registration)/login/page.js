"use client"
import { useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = []
    if (!email.includes("@")) newErrors.push("Invalid email format.")
    if (password.length < 8) newErrors.push("Password must be at least 8 characters.")
    setErrors(newErrors)
    return newErrors.length === 0
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-astratintedwhite)]">
      <div className="flex-1 flex">
        <div className="w-full md:w-1/2 p-4 md:p-8 pt-12 md:pt-20 px-4 md:px-0 flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-[var(--color-astrablack)]">Sign In</h2>
              <Link href="/signup" className="text-[var(--color-astraprimary)] text-sm hover:underline">
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
                  className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-astraprimary] bg-white text-gray-900"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-astraprimary] bg-white text-gray-900"
                />
              </div>

              {errors.length > 0 && (
                <div className="bg-red-100 text-[var(--color-astrared)] text-sm px-3 py-2 rounded">
                  {errors.map((err, idx) => (
                    <p key={idx}>• {err}</p>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[var(--color-astraprimary)] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link href="/recover" className="text-[var(--color-astraprimary)] text-sm hover:underline">
                Forgot password?
              </Link>
            </div>

            <div className="mt-6">
              <button className="w-full border border-[var(--color-astradirtywhite)] bg-white hover:bg-gray-100 rounded-md py-2 px-4 flex items-center justify-center transition-colors">
                <User size={18} className="mr-2 text-[var(--color-astralightgray)]" />
                <span className="text-sm text-[var(--color-astrablack)]">Continue as Guest</span>
              </button>
            </div>
          </div>
        </div>
        <div className="hidden md:block md:w-1/2 bg-[var(--color-astraprimary)]">
          <img src="/blue-bg.png" alt="Background" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
