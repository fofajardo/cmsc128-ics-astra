import { Field, Form, Formik } from "formik";
import { object, mixed } from "yup";
import axios from "axios";
import { clientRoutes } from "../../../common/routes.js";
import LoadingOverlay from "@/components/LoadingOverlay.jsx";
import AuthSignOutLink from "@/(auth)/AuthSignOutLink.jsx";
import { useSignedInUser } from "@/components/UserContext.jsx";
import httpStatus from "http-status-codes";
import {useRef} from "react";
import {GraduationProofSchema} from "../../../common/validationSchemas.js";
import {PhotoType} from "../../../common/scopes.js";

export default function SignUpStep5({ onSetPage }) {
  const user = useSignedInUser();

  const initialValues = {
    proof_file: null
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const formData = new FormData();
      formData.append("degree_proof", values.proof_file);

      const response = await axios.post(clientRoutes.users.getDegreeProof(user.state.user?.id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === httpStatus.CREATED) {
        onSetPage(6);
      }
    } catch (error) {
      setFieldError("server", error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const buildForm = ({ setFieldValue, errors, isSubmitting }) => {
    const errorsForMap = Object.values(errors);

    const handleFileChange = (event) => {
      setFieldValue("proof_file", event.currentTarget.files[0]);
    };

    return (
      <Form className="space-y-4">
        <LoadingOverlay loading={isSubmitting} coverContainer={true} />

        <h1 className="text-2xl font-bold mb-4 text-justify">Notice and Consent to Privacy</h1>
        <p className="text-sm mb-4 text-justify">
          When uploading your proof of graduation file for the University of the Philippines Los Baños (UPLB),
          please ensure that the document is clear, legible, and in the required format (e.g., PDF, JPEG, or PNG).
          This document serves as official verification of your academic achievement and will be used for alumni
          tracking and relations advancement.
        </p>

        <div>
          <label className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            Proof of Graduation <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <div className="flex">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-[var(--color-astrablack)] text-sm md:text-base flex-1"
              accept=".pdf,.jpeg,.jpg,.png"
            />
            <button
              type="button"
              className="bg-[var(--color-astraprimary)] text-white px-4 py-1 rounded-r-md hover:bg-blue-700 transition-colors text-sm md:text-base"
              onClick={handleButtonClick}
            >
              Browse
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">PDF, JPEG, or PNG</p>
        </div>

        <p className="text-xs text-justify text-[var(--color-astrablack)]">
          By uploading and clicking <strong>Submit</strong>, you consent to the collection and processing of your personal data
          in accordance with the Data Privacy Act of 2012 (RA 10173). ICS-ASTRA ensures your information is handled confidentially
          and used solely for alumni tracking and engagement purposes.
        </p>

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
          Submit
        </button>
      </Form>
    );
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-astrablack)]">
          Proof of Graduation
        </h2>
        <AuthSignOutLink />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={GraduationProofSchema}
        onSubmit={handleSubmit}
        component={buildForm}
      />
    </div>
  );
}