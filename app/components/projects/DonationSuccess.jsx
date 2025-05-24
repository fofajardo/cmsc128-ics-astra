"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function DonationSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f4f7fe] text-center px-4">
      {/* Success Animation Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-astraprimary bg-astrawhite shadow-lg">
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-16 h-16 text-astraprimary"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-md space-y-4"
      >
        <h2 className="text-3xl font-bold text-astrablack">Thank you for your generous support!</h2>
        <p className="text-base text-astradarkgray">
        Your donation has been successfully processed. Kindly wait while the admin verifies the transaction.
        </p>
      </motion.div>

      {/* Back Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8"
      >
        <button
          onClick={() => router.push("/projects")}
          className="px-8 py-3 border-2 border-astraprimary text-astraprimary hover:bg-astraprimary hover:text-astrawhite rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer font-medium"
        >
          Back to Projects
        </button>
      </motion.div>
    </div>
  );
}
