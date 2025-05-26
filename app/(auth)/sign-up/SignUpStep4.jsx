import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { clientRoutes } from "../../../common/routes.js";
import LoadingOverlay from "@/components/LoadingOverlay.jsx";
import AuthSignOutLink from "@/(auth)/AuthSignOutLink.jsx";
import { useSignedInUser } from "@/components/UserContext.jsx";
import httpStatus from "http-status-codes";
import {DegreeProgramSchema} from "../../../common/validationSchemas.js";
import {kICSDegreePrograms} from "../../../common/scopes.js";

export default function SignUpStep4({ onSetPage }) {
  const user = useSignedInUser();

  const initialValues = {
    degree_program_const: "",
    year_started: "",
    year_graduated: ""
  };

  const handleSubmit = async (aValues, { setSubmitting, setFieldError }) => {
    try {
      const values = {
        ...aValues,
        ...kICSDegreePrograms[parseInt(aValues.degree_program_const)],
        user_id: user.state.user?.id,
      };
      values.year_started += "-01-01";
      values.year_graduated += "-01-01";
      delete values.degree_program_const;
      values.is_uplb = true;

      const response = await axios.post(clientRoutes.degreePrograms.base(), values);

      if (response.status === httpStatus.CREATED) {
        onSetPage(5);
      }
    } catch (error) {
      setFieldError("server", error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const buildForm = ({ errors, isSubmitting }) => {
    const errorsForMap = Object.values(errors);

    return (
      <Form className="space-y-4">
        <LoadingOverlay loading={isSubmitting} coverContainer={true} />

        <div>
          <label htmlFor="degree_program" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            Degree Program <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <Field as="select"
            id="degree-program"
            name="degree_program_const"
            className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-[var(--color-astrablack)] text-sm md:text-base"
          >
            <option value="">Select a degree program</option>
            <option value="0">BS Computer Science</option>
            <option value="1">MS Computer Science</option>
            <option value="2">Master of Information Technology</option>
            <option value="3">PhD Computer Science</option>
          </Field>
        </div>

        <div>
          <label htmlFor="year-started" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            Year Started <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <Field
            type="text"
            id="year-started"
            name="year_started"
            placeholder="XXXX"
            className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-[var(--color-astrablack)] text-sm md:text-base"
          />
        </div>


        <div>
          <label htmlFor="year-started" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            Year Graduated <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <Field
            type="text"
            id="year-graduated"
            name="year_graduated"
            placeholder="XXXX"
            className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-[var(--color-astrablack)] text-sm md:text-base"
          />
        </div>

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
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-astrablack)]">
          Educational Information
        </h2>
        <AuthSignOutLink />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={DegreeProgramSchema}
        onSubmit={handleSubmit}
        component={buildForm}
      />
    </div>
  );
}