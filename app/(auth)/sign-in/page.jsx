"use client";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {AuthSchema} from "../../../common/validationSchemas.js";
import {clientRoutes} from "../../../common/routes.js";
import LoadingOverlay from "@/components/LoadingOverlay.jsx";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useRefetchUser, useSignedInUser} from "@/components/UserContext.jsx";

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
      setFieldError("username", "Invalid email or password.");
      setSubmitting(false);
    });
  };

  function buildForm({isSubmitting}) {
    return (
      <Form className="space-y-4">
        <LoadingOverlay loading={isSubmitting} coverContainer={true}/>
        <Field
          type="email"
          name="username"
          placeholder="Email"
          className="text-sm md:text-base w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-astraprimary] bg-white text-gray-900"
        />
        <ErrorMessage
          name="username"
          component="div"
          className="bg-red-100 text-[var(--color-astrared)] text-sm md:text-base px-3 py-2 rounded"/>

        <Field
          type="password"
          name="password"
          placeholder="Password"
          className="text-sm md:text-base w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-astraprimary] bg-white text-gray-900"
        />
        <ErrorMessage
          name="password"
          component="div"
          className="bg-red-100 text-[var(--color-astrared)] text-sm md:text-base px-3 py-2 rounded"/>

        <button
          type="submit"
          className="text-sm md:text-base w-full bg-[var(--color-astraprimary)] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          disabled={isSubmitting}
        >
          Sign In
        </button>
        <Link href={clientRoutes.auth.signInExternal("google")}>
          <button
            className="text-sm md:text-base w-full bg-[var(--color-astraprimary)] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            disabled={isSubmitting}
          >
            Sign In with Google
          </button>
        </Link>
      </Form>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-astratintedwhite)]">
      {/* Left Side */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center px-4 md:px-8">
        <div className="w-full max-w-md p-8">
          {/* Logo and Back to Home inside form flex */}
          <div className="flex flex-col items-center mb-4">
            <img
              src="/astra-logo-w-name.png"
              alt="ICS-ASTRA Logo"
              height={30}
              width={120}
              className="w-auto mb-2"
            />
            <Link
              href="/"
              className="flex items-center text-[var(--color-astrablack)] hover:text-[var(--color-astraprimary)] transition-colors text-sm md:text-base font-medium py-1 px-4"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2"/>
              Back to Home
            </Link>
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

          <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={AuthSchema}>
            {buildForm}
          </Formik>

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
