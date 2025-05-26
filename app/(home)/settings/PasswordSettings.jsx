import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ToastNotification.jsx";
import { clientRoutes } from "../../../common/routes.js";
import axios from "axios";

// Validation schema
const passwordValidationSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password")
});

export default function PasswordSettings() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    newPassword: "",
    confirmPassword: ""
  };

  const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
    setStatus(null);

    try {
      await axios.post(clientRoutes.auth.update(), {
        password: values.newPassword,
      });

      toast({
        variant: "success",
        title: "Password updated successfully!"
      });

      resetForm();
    } catch (error) {
      toast({
        variant: "fail",
        title: "Failed to update password."
      });
      setStatus("Failed to update password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const PasswordInput = ({
    field,
    form,
    id,
    label,
    showPassword,
    toggleShowPassword,
    ...props
  }) => (
    <div>
      <label htmlFor={id} className="block text-sm md:text-base font-medium text-[var(--color-astrablack)]">
        {label} <span className="text-[var(--color-astrared)]">*</span>
      </label>
      <div className="relative">
        <input
          {...field}
          {...props}
          id={id}
          type={showPassword ? "text" : "password"}
          className={`text-sm md:text-base pr-10 w-full py-2 px-3 border rounded-md ${
            form.touched[field.name] && form.errors[field.name]
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute inset-y-0 right-0 pr-3"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>
      <ErrorMessage
        name={field.name}
        component="p"
        className="text-red-500 text-sm md:text-base mt-1"
      />
    </div>
  );

  return (
    <div>
      <h2 className="text-[var(--color-astrablack)] text-md md:text-xl font-semibold mb-4">
        Change Password
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={passwordValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
            <Field name="newPassword">
              {({ field, form }) => (
                <PasswordInput
                  field={field}
                  form={form}
                  id="new-password"
                  label="New Password"
                  showPassword={showNewPassword}
                  toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
                />
              )}
            </Field>

            <Field name="confirmPassword">
              {({ field, form }) => (
                <PasswordInput
                  field={field}
                  form={form}
                  id="confirm-password"
                  label="Confirm Password"
                  showPassword={showConfirmPassword}
                  toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            </Field>

            {status && (
              <p className="text-red-500 text-sm md:text-base">{status}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-sm md:text-base w-full py-2 px-4 rounded-md text-white ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)]"
              }`}
            >
              {isSubmitting ? "Changing Password..." : "Change Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}