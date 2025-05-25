"use client";
import {useEffect, useState} from "react";
import {Field, Form, Formik} from "formik";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {toast} from "@/components/ToastNotification.jsx";
import axios from "axios";
import {clientRoutes} from "../../../../common/routes.js";
import {CountryDropdown} from "@/components/ui/country-dropdown.jsx";
import {PersonalInfoUpdateSchema} from "../../../../common/validationSchemas.js";
import {cn} from "@/lib/utils.jsx";

export default function PersonalInfoModal({ context }) {
  const [open, setOpen] = useState(false);
  const [isChildSubmitting, setIsChildSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (open) {
      // Initialize form values from context when modal opens
      setFormValues({
        honorifics: context.state.profile.honorifics || "",
        first_name: context.state.profile.first_name || "",
        middle_name: context.state.profile.middle_name || "",
        last_name: context.state.profile.last_name || "",
        suffix: context.state.profile.suffix || "",
        gender: context.state.profile.gender || "",
        civil_status: context.state.profile.civil_status.toString() || "",
        citizenship: context.state.profile.citizenship || "",
      });
    }
  }, [open]);

  const handleSubmit = async (values, { setSubmitting }) => {
    // console.log(values);
    setIsChildSubmitting(true);
    try {
      await axios.put(clientRoutes.alumniProfiles.withId(context.state.user.id), values);
      context.actions.patchProfile(values);
      setOpen(false);
      toast({ title: "Personal information updated successfully!", variant: "success" });
    } catch (e) {
      toast({ title: e.message || "Failed to update personal information.", variant: "fail" });
    } finally {
      setSubmitting(false);
      setIsChildSubmitting(false);
    }
  };

  const inDefaultGenderSet = function(aGender) {
    return ["Male", "Female", "Prefer not to say"].includes(aGender.trim());
  };

  const buildForm = ({ handleChange, handleBlur, values, errors, touched, setFieldValue, setTouched }) => {
    return (
      <Form className="space-y-4">
        {/* Preferred Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="honorifics" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Preferred Title <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              as="select"
              id="honorifics"
              name="honorifics"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
            >
              <option value="">Select a title</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Mx.">Mx.</option>
            </Field>
            {touched.honorifics && errors.honorifics && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.honorifics}</div>
            )}
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Gender
            </label>
            <div className="relative">
              <Field
                as="select"
                name="gender"
                className={cn(
                  "w-full rounded-lg border border-gray-300 px-3 py-1",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]",
                  "text-sm md:text-base",
                )}
                onChange={handleChange}
              >
                <option hidden={true}>Other (specify)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="">Other (specify)</option>
              </Field>
              <Field
                type="text"
                name="gender"
                className={cn(
                  "w-full rounded-lg border border-gray-300 px-3 py-1",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]",
                  "text-sm md:text-base mt-2",
                  inDefaultGenderSet(values.gender) && "hidden"
                )}
                placeholder="Specify your gender"
              />
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              First Name <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              type="text"
              name="first_name"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
              placeholder="Enter your first name"
            />
            {touched.first_name && errors.first_name && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.first_name}</div>
            )}
          </div>
          <div>
            <label htmlFor="middle_name" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Middle Name <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              type="text"
              name="middle_name"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
              placeholder="Enter your middle name"
            />
            {touched.middle_name && errors.middle_name && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.middle_name}</div>
            )}
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Last Name <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              type="text"
              name="last_name"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
              placeholder="Enter your last name"
            />
            {touched.last_name && errors.last_name && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.last_name}</div>
            )}
          </div>
          <div>
            <label htmlFor="suffix" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">Suffix</label>
            <Field
              type="text"
              name="suffix"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
              placeholder="Suffix (e.g., Jr., III)"
            />
          </div>
        </div>

        {/* Civil Status & Student ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="civil_status" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Civil Status <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              as="select"
              name="civil_status"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
            >
              <option value="">Select civil status</option>
              <option value="0">Single</option>
              <option value="1">Married</option>
              <option value="4">Widowed</option>
              <option value="2">Divorced</option>
              <option value="3">Separated</option>
            </Field>
            {touched.civil_status && errors.civil_status && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.civil_status}</div>
            )}
          </div>
          <div>
            <label htmlFor="citizenship" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Country of Citizenship <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <CountryDropdown
              placeholder="Country"
              defaultValue={values.citizenship}
              onChange={function(aCountryCode) {
                setFieldValue("citizenship", aCountryCode);
                setTouched("citizenship");
              }}
            />
            {touched.citizenship && errors.citizenship && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.citizenship}</div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-wrap justify-between gap-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 border border-red-500 text-red-600 rounded-lg bg-white hover:bg-red-50"
          >
            Cancel
          </button>
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[var(--color-astradark)]"
            >
              Save
            </button>
          </div>
        </DialogFooter>
      </Form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white hover:bg-[var(--color-astradark)] rounded-md">
        Edit
      </DialogTrigger>
      <DialogContent loading={isChildSubmitting} className="sm:max-w-4xl overflow-y-auto max-h-full">
        <DialogHeader>
          <DialogTitle>Edit Personal Information</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={formValues}
          enableReinitialize={true}
          validationSchema={PersonalInfoUpdateSchema}
          onSubmit={handleSubmit}
          component={buildForm}
        />
      </DialogContent>
    </Dialog>
  );
}