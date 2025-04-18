import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-astratintedwhite)]">
      <div className="flex-1 flex">
        <div className="w-full md:w-1/2 flex items-center justify-center p-4">
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
                  className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
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
