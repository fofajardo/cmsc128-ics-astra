"use client";
import {useEffect, useState} from "react";
import {Field, Form, Formik} from "formik";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {toast} from "@/components/ToastNotification.jsx";
import * as Yup from "yup";
import axios from "axios";
import {clientRoutes} from "../../../../common/routes.js";
import {EmploymentType, EMPLOYMENT_STATUS_LABELS, LocationType, LOCATION_TYPE_LABELS} from "../../../../common/scopes.js";
import {EditIcon} from "lucide-react";

export default function AddEditExperienceModal({ context, experience = null, experienceKey = null }) {
  const isEdit = experience !== null;
  const [open, setOpen] = useState(false);
  const [isChildSubmitting, setIsChildSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({
    company: "",
    title: "",
    field: "",
    salary: 0,
    employment_type: EmploymentType.FULL_TIME,
    location: "",
    location_type: LocationType.ON_SITE,
    is_current: false,
    startDate: { month: "", year: "" },
    endDate: { month: "", year: "" },
    description: ""
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    if (open && experience !== null) {
      setInitialValues({
        company: experience.company || "",
        title: experience.title || "",
        field: experience.field || "",
        salary: experience.salary || 0,
        employment_type: experience.employment_type || EmploymentType.FULL_TIME.toString(),
        location: experience.location || "",
        location_type: experience.location_type || LocationType.ON_SITE.toString(),
        is_current: experience.is_current,
        startDate: {
          month: new Date(experience.year_started).toLocaleString("default", { month: "long" }),
          year: new Date(experience.year_started).getFullYear().toString()
        },
        endDate: experience.year_ended ? {
          month: new Date(experience.year_ended).toLocaleString("default", { month: "long" }),
          year: new Date(experience.year_ended).getFullYear().toString()
        } : { month: "", year: "" },
        description: experience.description || ""
      });
    }
  }, [open]);

  // Form validation schema
  const ExperienceSchema = Yup.object().shape({
    company: Yup.string().required("Company or organization is required"),
    title: Yup.string().required("Title is required"),
    field: Yup.string().required("Field is required"),
    employment_type: Yup.string().required("Employment type is required"),
    location: Yup.string().required("Location is required"),
    location_type: Yup.string().required("Location type is required"),
    startDate: Yup.object().shape({
      month: Yup.string().required("Start month is required"),
      year: Yup.string().required("Start year is required")
    }),
    endDate: Yup.object().when("is_current", {
      is: false,
      then: () => Yup.object().shape({
        month: Yup.string().required("End month is required"),
        year: Yup.string().required("End year is required")
      }),
      otherwise: () => Yup.object().shape({
        month: Yup.string(),
        year: Yup.string()
      })
    }),
    is_current: Yup.boolean(),
    description: Yup.string(),
    salary: Yup.number().required("Salary is required")
  });

  const handleSubmit = async (aValues, { setSubmitting }) => {
    setIsChildSubmitting(true);
    try {
      // Convert month/year to proper Date objects
      const startDate = new Date(
        parseInt(aValues.startDate.year),
        months.indexOf(aValues.startDate.month)
      );

      const endDate = aValues.is_current ? null : new Date(
        parseInt(aValues.endDate.year),
        months.indexOf(aValues.endDate.month)
      );

      const values = {
        company: aValues.company,
        title: aValues.title,
        field: aValues.field,
        salary: aValues.salary.toString(),
        employment_type: parseInt(aValues.employment_type),
        year_started: startDate,
        year_ended: endDate,
        location: aValues.location,
        location_type: parseInt(aValues.location_type),
        description: aValues.description,
        is_current: aValues.is_current
      };

      if (isEdit) {
        await axios.put(clientRoutes.workExperiences.withId(experience.id), values);
        context.actions.patchWorkExperiences(experienceKey, values);
      } else {
        values.user_id = context.state.user.id;
        const response = await axios.post(clientRoutes.workExperiences.base(), values);
        values.id = response.data.id;
        context.actions.pushWorkExperience(values);
      }

      setOpen(false);
      toast({
        title: isEdit ? "Experience updated successfully!" : "Experience added successfully!",
        variant: "success"
      });
    } catch (e) {
      toast({
        title: e?.response?.data?.message ?? e?.message ?? "Failed to save experience.",
        variant: "fail"
      });
    } finally {
      setSubmitting(false);
      setIsChildSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsChildSubmitting(true);
    try {
      await axios.delete(clientRoutes.workExperiences.withId(experience.id));
      context.actions.patchWorkExperiences(experienceKey, { is_deleted: true });
      setOpen(false);
      toast({
        title: "Experience deleted successfully!",
        variant: "success"
      });
    } catch (e) {
      toast({
        title: e?.response?.data?.message ?? e?.message ?? "Failed to delete experience.",
        variant: "fail"
      });
    } finally {
      setIsChildSubmitting(false);
    }
  };

  const buildForm = ({ values, errors, touched, handleChange, isSubmitting }) => {
    console.log(errors);
    return (
      <Form className="space-y-6">
        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            Company or Organization <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <Field
            type="text"
            id="company"
            name="company"
            placeholder="Ex: Department of Information and Communications Technology"
            className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
          />
          {touched.company && errors.company && (
            <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.company}</div>
          )}
        </div>

        {/* Title & Employment Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Title <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              type="text"
              id="title"
              name="title"
              placeholder="Ex: Software Engineer"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
            />
            {touched.title && errors.title && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.title}</div>
            )}
          </div>
          <div>
            <label htmlFor="employment_type" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Employment Type <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              as="select"
              id="employment_type"
              name="employment_type"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
            >
              {Object.entries(EMPLOYMENT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Field>
            {touched.employment_type && errors.employment_type && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.employment_type}</div>
            )}
          </div>
        </div>

        {/* Field of Work */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Field of Work <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              type="text"
              id="field"
              name="field"
              placeholder="Ex: Software Development"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
            />
            {touched.field && errors.field && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.field}</div>
            )}
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Estimated Salary <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              type="number"
              id="salary"
              name="salary"
              min="0"
              placeholder="Ex: 20,000"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
            />
            {touched.salary && errors.salary && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.salary}</div>
            )}
          </div>
        </div>

        {/* Currently Working */}
        <div className="flex items-center">
          <Field
            type="checkbox"
            id="is_current"
            name="is_current"
            className="h-4 w-4 text-[var(--color-astraprimary)] border-gray-300 rounded"
          />
          <label htmlFor="is_current" className="ml-2 text-sm text-gray-700">
            I am currently working in this role
          </label>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate.month" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Start Date <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Field
                  as="select"
                  id="startDate.month"
                  name="startDate.month"
                  className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                >
                  <option value="">Month</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </Field>
                {touched.startDate?.month && errors.startDate?.month && (
                  <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.startDate.month}</div>
                )}
              </div>
              <div>
                <Field
                  as="select"
                  id="startDate.year"
                  name="startDate.year"
                  className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                >
                  <option value="">Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </Field>
                {touched.startDate?.year && errors.startDate?.year && (
                  <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.startDate.year}</div>
                )}
              </div>
            </div>
          </div>

          {!values.is_current && (
            <div>
              <label htmlFor="endDate.month" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                End Date <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field
                    as="select"
                    id="endDate.month"
                    name="endDate.month"
                    className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                  >
                    <option value="">Month</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </Field>
                  {touched.endDate?.month && errors.endDate?.month && (
                    <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.endDate.month}</div>
                  )}
                </div>
                <div>
                  <Field
                    as="select"
                    id="endDate.year"
                    name="endDate.year"
                    className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                  >
                    <option value="">Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </Field>
                  {touched.endDate?.year && errors.endDate?.year && (
                    <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.endDate.year}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location & Location Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Location <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              type="text"
              id="location"
              name="location"
              placeholder="Ex: Makati, Philippines"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
            />
            {touched.location && errors.location && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.location}</div>
            )}
          </div>
          <div>
            <label htmlFor="location_type" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Location Type <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              as="select"
              id="location_type"
              name="location_type"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
            >
              {Object.entries(LOCATION_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Field>
            {touched.location_type && errors.location_type && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.location_type}</div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            Description (Optional)
          </label>
          <Field
            as="textarea"
            id="description"
            name="description"
            placeholder="Describe your role and responsibilities"
            className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base h-32"
          />
        </div>

        <DialogFooter className="flex flex-wrap justify-between gap-4">
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[var(--color-astradark)]"
          >
            Save
          </button>
        </DialogFooter>
      </Form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button>
          {
            isEdit ? (
              <div>
                <EditIcon className="w-5 h-5 text-[var(--color-astraprimary)]" />
              </div>
            ) : (
              <div className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 text-[var(--color-astraprimary)] border border-[var(--color-astraprimary)] hover:bg-[var(--color-astradirtywhite)] rounded-md">
              Add
              </div>
            )
          }
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl overflow-y-auto max-h-full" loading={isChildSubmitting}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Experience" : "Add Experience"}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={ExperienceSchema}
          onSubmit={handleSubmit}
          component={buildForm}
        />
      </DialogContent>
    </Dialog>
  );
}