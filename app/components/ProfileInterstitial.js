"use client";

import {Info} from "lucide-react";
import Link from "next/link";
import {feRoutes} from "../../common/routes.js";
import {useSignedInUser, useUser} from "@/components/UserContext.jsx";
import {LoadingSpinner} from "@/components/LoadingSpinner.jsx";
import PropTypes from "prop-types";

export default function ProfileInterstitial({ children }) {
  const context = useSignedInUser();

  if (!context.state.initialized) {
    return (
      <div className="min-h-screen bg-[var(--color-astratintedwhite)]">
        <main className="container mx-auto py-8 px-4 max-w-7xl flex items-center justify-center">
          <LoadingSpinner className="w-16 h-16" />
        </main>
      </div>
    );
  }

  if (!context.state.profile) {
    return (
      <div className="min-h-screen bg-[var(--color-astratintedwhite)]">
        <main className="container mx-auto py-8 px-4 max-w-7xl">
          <div className="bg-[#E2F0FD] border-2 border-[var(--color-astralight)] p-4 rounded-md mb-6 flex items-center">
            <Info className="h-5 w-5 text-[var(--color-astrablack)] mr-2 flex-shrink-0" />
            <p className="text-sm text-[var(--color-astrablack)]">
              Your profile does not yet exist. Please <Link href={feRoutes.auth.signUp()} className="text-[var(--color-astraprimary)] hover:underline">create your profile</Link> to continue.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <main>
      {children}
    </main>
  );
}

ProfileInterstitial.propTypes = {
  children: PropTypes.node.isRequired,
};
