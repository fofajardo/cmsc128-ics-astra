'use client';

import { useRouter } from 'next/navigation';

export default function DonationSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f4f7fe] text-center px-4">
      {/* Blue Check Icon */}
      <div className="mb-6">
        <div className="w-24 h-24 flex items-center justify-center rounded-full border-4 border-blue-500">
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2">Thank You for Your Support!</h2>
      <p className="text-sm text-gray-600 max-w-md">
        Your generous donation helps us make the world a better place. We are truly grateful for your contribution.
      </p>

      <button
        onClick={() => router.push('/projects')} // update path if needed
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Go back
      </button>
    </div>
  );
}
