import {feRoutes} from "../../../common/routes.js";
import {useRefetchUser, useSignedInUser} from "@/components/UserContext.jsx";
import {redirect} from "next/navigation";

export default function SignUpStep6() {
  const userContext = useSignedInUser();

  const handleContinue = async function() {
    await useRefetchUser(userContext);
    redirect(feRoutes.main.home());
  };

  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <img
          src="/recover/assets/verify-icon.png"
          alt="Verification Icon"
          width={60}
          height={60}
        />
      </div>
      <strong className="text-gray-700 text-sm md:text-base">
        Your account has been created successfully.
      </strong>
      <p className="mt-4 mb-8">
        Please wait while we verify your information. In the meantime, you may explore the platform with limited access. Full access will be granted once verification is complete.
      </p>
      <button
        type="button"
        className="w-full bg-[var(--color-astraprimary)] hover:bg-blue-700 rounded-md py-2 px-4 flex items-center justify-center transition-colors"
        onClick={handleContinue}
      >
        <span className="text-sm md:text-base text-white">Continue</span>
      </button>
    </div>
  );
}