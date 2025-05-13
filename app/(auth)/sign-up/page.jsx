"use client";

import {useLayoutEffect, useState} from "react";
import Link from "next/link";
import {feRoutes} from "../../../common/routes.js";
import {AuthBackToHomeLink} from "@/(auth)/AuthBackToHomeLink.jsx";
import SignUpStep1 from "@/(auth)/sign-up/SignUpStep1.jsx";
import SignUpStep2 from "@/(auth)/sign-up/SignUpStep2.jsx";
import SignUpStep3 from "@/(auth)/sign-up/SignUpStep3.jsx";
import SignUpStep4 from "@/(auth)/sign-up/SignUpStep4.jsx";
import SignUpStep5 from "@/(auth)/sign-up/SignUpStep5.jsx";
import {useSignedInUser} from "@/components/UserContext.jsx";
import {LoadingSpinner} from "@/components/LoadingSpinner.jsx";
import {RouteGuard} from "@/components/RouteGuard.jsx";
import SignUpStep6 from "@/(auth)/sign-up/SignUpStep6.jsx";
import {RouteGuardMode} from "../../../common/scopes.js";
import {redirect} from "next/navigation";

function buildPage(aPageState) {
  const [page, setPage] = aPageState;
  const [email, setEmail] = useState(null);

  switch (page) {
  case 0:
    return (
      <div className="w-full flex items-center justify-center">
        <LoadingSpinner className="w-16 h-16" />
      </div>
    );
  case 1:
    return <SignUpStep1 onSetPage={setPage} onSetEmail={setEmail} />;
  case 2:
    return <SignUpStep2 email={email} />;
  case 3:
    return <SignUpStep3 onSetPage={setPage} />;
  case 4:
    return <SignUpStep4 onSetPage={setPage} />;
  case 5:
    return <SignUpStep5 onSetPage={setPage} />;
  case 6:
    return <SignUpStep6 />;
  default:
    return "Unknown page";
  }
}

export default function SignupPage() {
  const [page, setPage] = useState(0);
  const userContext = useSignedInUser();

  useLayoutEffect(() => {
    if (!userContext.state.initialized) {
      return;
    }

    if (userContext.state.isGuest) {
      setPage(1);
    } else if (userContext.state.profile === null) {
      setPage(3);
    } else if (userContext.state.degreePrograms === null) {
      setPage(4);
    } else if (!userContext.state.degreeProofUploaded) {
      setPage(5);
    } else {
      // This user has already completed the sign up process.
      redirect(feRoutes.main.home());
    }
  }, [userContext.state]);

  return (
    <div className="min-h-screen flex bg-[var(--color-astratintedwhite)]">
      {/* Left Side */}
      <div className="w-full md:w-1/2 relative flex justify-center px-4 md:px-8 max-h-screen overflow-auto">
        <div className="w-full max-w-md py-8">
          {
            page === 1 && <AuthBackToHomeLink />
          }
          {/* Logo and Back to Home */}
          <div className="flex flex-col items-center mb-4">
            <img
              src="/astra-logo-w-name.png"
              alt="ICS-ASTRA Logo"
              height={30}
              width={120}
              className="w-auto mb-2"
            />
          </div>

          <div className="space-y-4">
            {buildPage([page, setPage])}
          </div>

          {
            page > 0 &&
          <div className="flex justify-center mt-6 space-x-2">
            <div className={"w-2 h-2 rounded-full " + (page >= 1 ? "bg-[var(--color-astraprimary)]" : "bg-gray-300")}></div>
            <div className={"w-2 h-2 rounded-full " + (page >= 2 ? "bg-[var(--color-astraprimary)]" : "bg-gray-300")}></div>
            <div className={"w-2 h-2 rounded-full " + (page >= 3 ? "bg-[var(--color-astraprimary)]" : "bg-gray-300")}></div>
            <div className={"w-2 h-2 rounded-full " + (page >= 4 ? "bg-[var(--color-astraprimary)]" : "bg-gray-300")}></div>
            <div className={"w-2 h-2 rounded-full " + (page >= 5 ? "bg-[var(--color-astraprimary)]" : "bg-gray-300")}></div>
            <div className={"w-2 h-2 rounded-full " + (page >= 6 ? "bg-[var(--color-astraprimary)]" : "bg-gray-300")}></div>
          </div>
          }

          {/* spacing hack */}
          <hr className="my-4 opacity-0" />
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
