import {Field, Form, Formik} from "formik";
import {SignUpUserSchema} from "../../../common/validationSchemas.js";
import axios from "axios";
import {clientRoutes} from "../../../common/routes.js";
import {useRefetchUser, useSignedInUser} from "@/components/UserContext.jsx";
import LoadingOverlay from "@/components/LoadingOverlay.jsx";
import Image from "next/image.js";
import ToastNotification from "@/components/ToastNotification.jsx";
import {useState} from "react";

export default function SignUpStep2({onSetPage, email}) {
  const [showToast, setShowToast] = useState(null);
  let values = {username: email};

  const handleResendLink = function() {
    axios.post(clientRoutes.auth.signUpResendEmail(), values).then(function (response) {
      setShowToast({
        type: "success",
        message: "A confirmation email has been resent to your inbox.",
      });
    }).catch(function (error) {
      setShowToast({
        type: "fail",
        message: error?.response?.data?.message ?? "Something went wrong",
      });
    });
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <Image
          src="/astronaut.png?height=150&width=150"
          alt="Astronaut"
          width={150}
          height={150}
          className="mx-auto"
        />
      </div>
      <p className="text-gray-700 mb-2 text-sm md:text-base">
        We sent a confirmation link to your email address ({email}). Please check your inbox to verify your account.
      </p>
      <div className="mt-4 font-semibold">
        <span className="text-sm md:text-base">Didn&apos;t receive? </span>
      </div>
      <button
        onClick={handleResendLink}
        className="text-[var(--color-astradark)] text-sm md:text-base hover:underline"
      >
        Resend confirmation email
      </button>

      {showToast && (
        <ToastNotification
          type={showToast.type}
          message={showToast.message}
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
}