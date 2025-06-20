import {Field, Form, Formik} from "formik";
import {SignUpUserSchema} from "../../../common/validationSchemas.js";
import axios from "axios";
import {clientRoutes, feRoutes} from "../../../common/routes.js";
import {useRefetchUser, useSignedInUser} from "@/components/UserContext.jsx";
import LoadingOverlay from "@/components/LoadingOverlay.jsx";
import Link from "next/link.js";
import httpStatus from "http-status-codes";
import {FaEnvelope, FaGoogle} from "react-icons/fa";

export default function SignUpStep1({onSetPage, onSetEmail}) {
  const initialValues = {
    username: "",
    password: "",
    passwordConfirm: "",
  };

  const userContext = useSignedInUser();

  const handleSubmit = async function(aValues, {setSubmitting, setFieldError}) {
    try {
      const response = await axios.post(clientRoutes.auth.signUp(), aValues);
      await useRefetchUser(userContext);
      if (response.status === httpStatus.OK) {
        onSetEmail(aValues.username);
        onSetPage(2);
      }
      setSubmitting(false);
    } catch (error) {
      setFieldError("server", error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const buildForm = function({errors, touched, isSubmitting}) {
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
        {touched.username && errors.username && (
          <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.username}</div>
        )}

        <Field
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900 text-sm md:text-base"
        />
        {touched.password && errors.password && (
          <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.password}</div>
        )}

        <Field
          type="password"
          name="passwordConfirm"
          placeholder="Confirm Password"
          className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900 text-sm md:text-base"
        />
        {touched.passwordConfirm && errors.passwordConfirm && (
          <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.passwordConfirm}</div>
        )}

        {errorsForMap.length > 0 && (
          <div className="bg-red-100 text-[var(--color-astrared)] text-sm px-3 py-2 rounded">
            {errorsForMap.map((err, idx) => (
              <p key={idx}>{err}</p>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[var(--color-astraprimary)] hover:bg-blue-700 rounded-md py-2 px-4 flex items-center justify-center transition-colors"
        >
          <FaEnvelope size={18} className="mr-2 text-white" />
          <span className="text-sm md:text-base text-white">Sign Up with Email</span>
        </button>

        <Link href={clientRoutes.auth.signInExternal("google")}>
          <button
            type="button"
            className="w-full bg-[var(--color-astraprimary)] hover:bg-blue-700 rounded-md py-2 px-4 flex items-center justify-center transition-colors"
          >
            <FaGoogle size={18} className="mr-2 text-white" />
            <span className="text-sm md:text-base text-white">Sign Up with Google</span>
          </button>
        </Link>
      </Form>
    );
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-astrablack)]">Sign Up</h2>
        <Link href={feRoutes.auth.signIn()} className="text-[var(--color-astraprimary)] text-sm md:text-base hover:underline">
          I have an account
        </Link>
      </div>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={SignUpUserSchema} component={buildForm} />
    </div>
  );
}