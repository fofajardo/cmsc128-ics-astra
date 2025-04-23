import Link from "next/link"
import { User } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-astratintedwhite)]">
      <div className="flex-1 flex">
        <div className="w-full md:w-1/2 p-4 md:p-8 pt-12 md:pt-20 px-4 md:px-0 flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-black">Sign Up</h2>
              <Link href="/login" className="text-[var(--color-astraprimary)] text-sm hover:underline">
                I have an account
              </Link>
            </div>

            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                />
              </div>
              <Link href="/signup/2">
                <button
                  type="button"
                  className="w-full bg-[var(--color-astraprimary)] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </Link>
            </form>

            <div className="mt-4 text-center">
              <Link href="/recover" className="text-[var(--color-astraprimary)] text-sm hover:underline">
                Forgot password?
              </Link>
            </div>

            <div className="mt-6">
              <button className="w-full border border-[var(--color-astradirtywhite)] bg-white hover:bg-gray-100 rounded-md py-1 px-4 flex items-center justify-center transition-colors">
                <User size={18} className="mr-2 text-[var(--color-astralightgray)]" />
                <span className="text-sm text-[var(--color-astrablack)]">Continue as Guest</span>
              </button>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-astraprimary)]"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
        <div className="hidden md:block md:w-1/2 bg-[var(--color-astraprimary)]">
          <img src="/blue-bg.png" alt="Background" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  )
}
