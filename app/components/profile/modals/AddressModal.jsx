"use client";

import {useEffect, useState} from "react";
import {Field, Form, Formik} from "formik";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {toast} from "@/components/ToastNotification.jsx";
import axios from "axios";
import {clientRoutes} from "../../../../common/routes.js";
import {AddressInfoUpdateSchema, PersonalInfoUpdateSchema} from "../../../../common/validationSchemas.js";

export default function AddressModal({ context }) {
  const [open, setOpen] = useState(false);
  const [isChildSubmitting, setIsChildSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (open) {
      // Initialize form values from context when modal opens
      setFormValues({
        location: context.state.profile.location || "",
        address: context.state.profile.address || "",
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
      toast({ title: "Address information updated successfully!", variant: "success" });
    } catch (e) {
      toast({ title: e.message || "Failed to update address information.", variant: "fail" });
    } finally {
      setSubmitting(false);
      setIsChildSubmitting(false);
    }
  };

  const buildForm = ({ handleChange, handleBlur, values, errors, touched, setFieldValue, setTouched }) => {
    return (
      <Form className="space-y-4">
        {/* Address Fields */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            General Location <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <Field
            type="text"
            name="location"
            className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
            placeholder="Enter your general location"
          />
          {touched.location && errors.location && (
            <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.location}</div>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            Address <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <Field
            type="text"
            name="address"
            className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
            placeholder="Enter your middle name"
          />
          {touched.address && errors.address && (
            <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.address}</div>
          )}
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
          <DialogTitle>Edit Address Information</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={formValues}
          enableReinitialize={true}
          validationSchema={AddressInfoUpdateSchema}
          onSubmit={handleSubmit}
          component={buildForm}
        />
      </DialogContent>
    </Dialog>
  );
}