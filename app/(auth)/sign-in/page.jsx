"use client";
import Link from "next/link";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {AuthSchema} from "../../../common/validationSchemas.js";
import {clientRoutes} from "../../../common/routes.js";
import LoadingOverlay from "@/components/LoadingOverlay.jsx";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useRefetchUser, useSignedInUser} from "@/components/UserContext.jsx";
import {AuthBackToHomeLink} from "@/(auth)/AuthBackToHomeLink.jsx";
import {RouteGuardUnauthenticated} from "@/components/RouteGuard.jsx";
import {FaGoogle} from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const initialValues = {
    username: "",
    password: "",
  };

  const userContext = useSignedInUser();

  const handleSubmit = function (aValues, {setSubmitting, setFieldError}) {
    axios.post(clientRoutes.auth.signIn(), aValues).then(function (response) {
      useRefetchUser(userContext).then(function () {
        if (response.status === 200) {
          return router.push("/");
        }
        setSubmitting(false);
      });
    }).catch(function (error) {
      setFieldError("server", error?.response?.data?.message ?? "Something went wrong");
      setSubmitting(false);
    });
  };

  const buildForm = function({errors, isSubmitting}) {
    const errorsForMap = Object.values(errors);
    return (
      <Form className="space-y-4">
        <LoadingOverlay loading={isSubmitting} coverContainer={true}/>
        <Field
          type="email"
          name="username"
          placeholder="Email"
          className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900 text-sm md:text-base"
        />
        <Field
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900 text-sm md:text-base"
        />

        {errorsForMap.length > 0 && (
          <div className="bg-red-100 text-[var(--color-astrared)] text-sm px-3 py-2 rounded">
            {errorsForMap.map((err, idx) => (
              <p key={idx}>{err}</p>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="text-sm md:text-base w-full bg-[var(--color-astraprimary)] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          disabled={isSubmitting}
        >
          Sign In
        </button>
        <Link href={clientRoutes.auth.signInExternal("google")}>
          <button
            type="button"
            className="w-full bg-[var(--color-astraprimary)] hover:bg-blue-700 rounded-md py-2 px-4 flex items-center justify-center transition-colors"
          >
            <FaGoogle size={18} className="mr-2 text-white" />
            <span className="text-sm md:text-base text-white">Sign In with Google</span>
          </button>
        </Link>
      </Form>
    );
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-astratintedwhite)]">
      <RouteGuardUnauthenticated />
      {/* Left Side */}
      <div className="w-full md:w-1/2 relative flex justify-center px-4 md:px-8">
        <div className="w-full max-w-md py-8">
          <AuthBackToHomeLink />
          {/* Logo and Back to Home inside form flex */}
          <div className="flex flex-col items-center mb-4">
            <img
              src="/astra-logo-w-name.png"
              alt="ICS-ASTRA Logo"
              height={30}
              width={120}
              className="w-auto mb-2"
            />
          </div>

          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-astrablack)]">Sign In</h2>
            <Link
              href="/sign-up"
              className="text-[var(--color-astraprimary)] text-sm md:text-base hover:underline"
            >
              Create an account
            </Link>
          </div>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={AuthSchema}
            component={buildForm}
          />

          <div className="mt-4">
            <Link
              href="/recover">
              <button
                className="w-full border border-[var(--color-astradirtywhite)] bg-white hover:bg-gray-100 rounded-md py-2 px-4 flex items-center justify-center transition-colors">
                <span className="text-sm md:text-base text-[var(--color-astrablack)]">Forgot password?</span>
              </button>
            </Link>
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
