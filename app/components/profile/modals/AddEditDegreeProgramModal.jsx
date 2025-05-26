"use client";

import {useEffect, useState} from "react";
import {Field, Form, Formik} from "formik";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog.jsx";
import {toast} from "@/components/ToastNotification.jsx";
import axios from "axios";
import {clientRoutes} from "../../../../common/routes.js";
import {EditIcon} from "lucide-react";
import {DegreeProgramSchema2} from "../../../../common/validationSchemas.js";
import {kICSDegreePrograms} from "../../../../common/scopes.js";

export default function AddEditDegreeProgramModal({ context, degreeProgram = null, degreeProgramKey = null }) {
  const isEdit = degreeProgram !== null;
  const [open, setOpen] = useState(false);
  const [isChildSubmitting, setIsChildSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    level: "",
    institution: "",
    year_started: "",
    year_graduated: "",
    is_uplb: false,
    uplb_program: ""
  });

  useEffect(() => {
    if (open && degreeProgram !== null) {
      setInitialValues({
        name: degreeProgram.name || "",
        level: degreeProgram.level || "",
        institution: degreeProgram.institution || "",
        year_started: new Date(degreeProgram.year_started).getFullYear().toString(),
        year_graduated: new Date(degreeProgram.year_graduated).getFullYear().toString(),
        is_uplb: degreeProgram.is_uplb,
        uplb_program: kICSDegreePrograms.findIndex(p => p.name === degreeProgram.name) !== -1 
          ? kICSDegreePrograms.findIndex(p => p.name === degreeProgram.name).toString()
          : ""
      });
    }
  }, [open]);

  const handleSubmit = async (aValues, { setSubmitting }) => {
    setIsChildSubmitting(true);
    try {
      let values = {
        ...aValues,
        year_started: `${aValues.year_started}-01-01`,
        year_graduated: `${aValues.year_graduated}-01-01`,
      };

      if (aValues.is_uplb && aValues.uplb_program !== "") {
        const selectedProgram = kICSDegreePrograms[parseInt(aValues.uplb_program)];
        values = {
          ...values,
          name: selectedProgram.name,
          level: selectedProgram.level,
          institution: selectedProgram.institution
        };
      }

      delete values.uplb_program;

      if (isEdit) {
        await axios.put(clientRoutes.degreePrograms.getOne(degreeProgram.id), values);
        context.actions.patchDegreePrograms(degreeProgramKey, values);
      } else {
        values.user_id = context.state.user.id;
        await axios.post(clientRoutes.degreePrograms.base(), values);
        context.actions.pushDegreeProgram(values);
      }

      setOpen(false);
      toast({
        title: isEdit ? "Degree program updated successfully!" : "Degree program added successfully!",
        variant: "success"
      });
    } catch (e) {
      toast({
        title: e?.response?.data?.message ?? e?.message ?? "Failed to save degree program.",
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
      await axios.delete(clientRoutes.degreePrograms.getOne(degreeProgram.id));
      context.actions.patchDegreePrograms(degreeProgramKey, { is_deleted: true });
      setOpen(false);
      toast({
        title: "Degree program deleted successfully!",
        variant: "success"
      });
    } catch (e) {
      toast({
        title: e?.response?.data?.message ?? e?.message ?? "Failed to delete degree program.",
        variant: "fail"
      });
    } finally {
      setIsChildSubmitting(false);
    }
  };

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button>
          {isEdit ? (
            <div>
              <EditIcon className="w-5 h-5 text-[var(--color-astraprimary)]" />
            </div>
          ) : (
            <div className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 text-[var(--color-astraprimary)] border border-[var(--color-astraprimary)] hover:bg-[var(--color-astradirtywhite)] rounded-md">
              Add
            </div>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl overflow-y-auto max-h-full" loading={isChildSubmitting}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Degree Program" : "Add Degree Program"}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={DegreeProgramSchema2}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="flex items-center mb-4">
                <Field
                  type="checkbox"
                  id="is_uplb"
                  name="is_uplb"
                  className="h-4 w-4 text-[var(--color-astraprimary)] border-gray-300 rounded"
                />
                <label htmlFor="is_uplb" className="ml-2 text-sm text-gray-700">
                  I took this degree at the UPLB-CAS Institute of Computer Science
                </label>
              </div>

              {values.is_uplb ? (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                    ICS Degree Program <span className="text-[var(--color-astrared)]">*</span>
                  </label>
                  <Field
                    as="select"
                    name="uplb_program"
                    className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                  >
                    <option value="">Select a degree program</option>
                    {kICSDegreePrograms.map((program, index) => (
                      <option key={index} value={index}>{program.name}</option>
                    ))}
                  </Field>
                  {touched.uplb_program && errors.uplb_program && (
                    <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.uplb_program}</div>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                      Degree Name <span className="text-[var(--color-astrared)]">*</span>
                    </label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Ex: Bachelor of Science in Computer Science"
                      className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                    />
                    {touched.name && errors.name && (
                      <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                      Degree Level <span className="text-[var(--color-astrared)]">*</span>
                    </label>
                    <Field
                      type="text"
                      name="level"
                      placeholder="Ex: Bachelor of Science"
                      className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                    />
                    {touched.level && errors.level && (
                      <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.level}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                      Institution <span className="text-[var(--color-astrared)]">*</span>
                    </label>
                    <Field
                      type="text"
                      name="institution"
                      placeholder="Ex: University of the Philippines Los Baños"
                      className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                    />
                    {touched.institution && errors.institution && (
                      <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.institution}</div>
                    )}
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                    Year Started <span className="text-[var(--color-astrared)]">*</span>
                  </label>
                  <Field
                    as="select"
                    name="year_started"
                    className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                  >
                    <option value="">Select year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Field>
                  {touched.year_started && errors.year_started && (
                    <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.year_started}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                    Year Graduated <span className="text-[var(--color-astrared)]">*</span>
                  </label>
                  <Field
                    as="select"
                    name="year_graduated"
                    className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                  >
                    <option value="">Select year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Field>
                  {touched.year_graduated && errors.year_graduated && (
                    <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.year_graduated}</div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex flex-wrap justify-between gap-4">
                {isEdit && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                )}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[var(--color-astradark)]"
                  >
                    Save
                  </button>
                </div>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}