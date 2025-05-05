import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { clientRoutes } from "../../../common/routes.js";
import LoadingOverlay from "@/components/LoadingOverlay.jsx";
import AuthSignOutLink from "@/(auth)/AuthSignOutLink.jsx";
import { CountryDropdown } from "@/components/ui/country-dropdown.jsx";
import {PersonalInfoSchema} from "../../../common/validationSchemas.js";
import {useSignedInUser} from "@/components/UserContext.jsx";
import httpStatus from "http-status-codes";

export default function SignUpStep3({onSetPage}) {
  const user = useSignedInUser();

  const initialValues = {
    birthdate: "",
    location: "",
    address: "",
    gender: "",
    student_num: "",
    skills: "",
    honorifics: "",
    citizenship: "PHL",
    sex: "",
    civil_status: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    is_profile_public: true,
  };

  const handleSubmit = async (aValues, { setSubmitting, setFieldError }) => {
    try {
      const userId = user.state.user?.id;
      const values = {
        ...aValues,
        alum_id: userId
      };
      values.gender = aValues.gender.trim() === "" ? aValues.sex : aValues.gender;
      values.sex = aValues.sex === "Male" ? 1 : 2;

      const response = await axios.post(clientRoutes.alumniProfiles.withId(userId), values);

      if (response.status === httpStatus.CREATED) {
        onSetPage(4);
      }
    } catch (error) {
      setFieldError("server", error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const buildForm = ({ handleChange, handleBlur, values, errors, isSubmitting }) => {
    const errorsForMap = Object.values(errors);

    return (
      <Form className="space-y-4">
        <LoadingOverlay loading={isSubmitting} coverContainer={true} />

        <div>
          <label htmlFor="preferred-delegation" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            Preferred Delegation <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <Field as="select"
            id="preferred-delegation"
            name="honorifics"
            className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
          >
            <option value="">Select</option>
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Mx.">Mx.</option>
          </Field>
        </div>

        <div>
          <label htmlFor="first-name" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            First Name <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <Field
            type="text"
            id="first-name"
            name="first_name"
            className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
          />
        </div>

        <div>
          <label htmlFor="middle-name" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            Middle Name <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <Field
            type="text"
            id="middle-name"
            name="middle_name"
            className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="last-name" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Last Name <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              type="text"
              id="last-name"
              name="last_name"
              className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="suffix" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Suffix
            </label>
            <Field
              type="text"
              id="suffix"
              name="suffix"
              placeholder="Jr., Sr., III..."
              className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <label htmlFor="birthdate" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Birthdate <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              type="date"
              id="birthdate"
              name="birthdate"
              className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <label htmlFor="sex" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Sex Assigned At Birth <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field as="select"
              id="sex"
              name="sex"
              className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Field>
          </div>
          <div className="flex-1">
            <label htmlFor="sex" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Gender
            </label>
            <Field
              id="gender"
              name="gender"
              className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <label htmlFor="civil-status" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Civil Status <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field as="select"
              id="civil-status"
              name="civil_status"
              className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            >
              <option value="">Select</option>
              <option value="0">Single</option>
              <option value="1">Married</option>
              <option value="4">Widowed</option>
              <option value="2">Divorced</option>
              <option value="3">Separated</option>
            </Field>
          </div>
        </div>

        <div>
          <label htmlFor="middle-name" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            Complete Address <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <Field
            type="text"
            id="address"
            name="address"
            className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="address" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              General Location <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              type="text"
              id="location"
              name="location"
              placeholder="e.g. Manila"
              className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="country-of-citizenship" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Citizenship <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <CountryDropdown
              placeholder="Country"
              name="citizenship"
              defaultValue="PHL"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.citizenship}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="address" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Student Number <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              type="text"
              id="student-number"
              name="student_num"
              placeholder="XXXX-XXXXX"
              className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            />
          </div>
        </div>

        {errorsForMap.length > 0 && (
          <div className="bg-red-100 text-[var(--color-astrared)] text-sm px-3 py-2 rounded">
            <ul>
              {errorsForMap.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
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
          Personal Information
        </h2>
        <AuthSignOutLink />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={PersonalInfoSchema}
        onSubmit={handleSubmit}
        component={buildForm}
      />
    </div>
  );
}