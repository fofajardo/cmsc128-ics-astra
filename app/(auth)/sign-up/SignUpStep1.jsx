import {Field, Form, Formik} from "formik";
import {SignUpUserSchema} from "../../../common/validationSchemas.js";
import axios from "axios";
import {clientRoutes, feRoutes} from "../../../common/routes.js";
import {useRefetchUser, useSignedInUser} from "@/components/UserContext.jsx";
import LoadingOverlay from "@/components/LoadingOverlay.jsx";
import Link from "next/link.js";
import httpStatus from "http-status-codes";

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
        <Field
          type="password"
          name="passwordConfirm"
          placeholder="Confirm Password"
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
        >
          Next
        </button>
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