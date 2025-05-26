"use client";

import {useEffect, useState} from "react";
import {Field, Form, Formik} from "formik";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {toast} from "@/components/ToastNotification.jsx";
import axios from "axios";
import {clientRoutes} from "../../../../common/routes.js";
import {EditIcon} from "lucide-react";
import {AffiliationSchema} from "../../../../common/validationSchemas.js";
import {ComboBoxResponsive} from "@/components/ui/combobox.jsx";

export default function AddEditAffiliationModal({ context, affiliation = null, affiliationKey = null }) {
  const isEdit = affiliation !== null;
  const [open, setOpen] = useState(false);
  const [isChildSubmitting, setIsChildSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({
    org_id: "",
    organizations: {},
    role: "",
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
    if (open && affiliation !== null) {
      setInitialValues({
        org_id: affiliation.organizations.id || "",
        organizations: affiliation.organizations || {},
        role: affiliation.role || "",
        is_current: affiliation.is_current,
        startDate: {
          month: new Date(affiliation.joined_date).toLocaleString("default", { month: "long" }),
          year: new Date(affiliation.joined_date).getFullYear().toString()
        },
        endDate: affiliation.end_date ? {
          month: new Date(affiliation.end_date).toLocaleString("default", { month: "long" }),
          year: new Date(affiliation.end_date).getFullYear().toString()
        } : { month: "", year: "" },
        description: affiliation.description || ""
      });
    }
  }, [open]);

  const handleSubmit = async (aValues, { setSubmitting }) => {
    setIsChildSubmitting(true);
    try {
      const startDate = new Date(
        parseInt(aValues.startDate.year),
        months.indexOf(aValues.startDate.month)
      );

      const endDate = aValues.is_current ? null : new Date(
        parseInt(aValues.endDate.year),
        months.indexOf(aValues.endDate.month)
      );

      const values = {
        org_id: aValues.org_id,
        role: aValues.role,
        joined_date: startDate,
        end_date: endDate,
        description: aValues.description,
        is_current: aValues.is_current
      };

      if (isEdit) {
        await axios.put(clientRoutes.users.getOrganizationsWithOrgId(context.state.user.id, values.org_id), values);
        context.actions.patchOrganizationAffiliations(affiliationKey, values);
      } else {
        values.user_id = context.state.user.id;
        await axios.post(clientRoutes.users.getOrganizations(context.state.user?.id), values);
        values.organizations = aValues.organizations;
        context.actions.pushOrganizationAffiliation(values);
      }

      setOpen(false);
      toast({
        title: isEdit ? "Affiliation updated successfully!" : "Affiliation added successfully!",
        variant: "success"
      });
    } catch (e) {
      toast({
        title: e?.response?.data?.message ?? e?.message ?? "Failed to save affiliation.",
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
      await axios.delete(clientRoutes.users.getOrganizationsWithOrgId(context.state.user.id, affiliation.organizations.id));
      context.actions.patchOrganizationAffiliations(affiliationKey, { is_deleted: true });
      setOpen(false);
      toast({
        title: "Affiliation deleted successfully!",
        variant: "success"
      });
    } catch (e) {
      toast({
        title: e?.response?.data?.message ?? e?.message ?? "Failed to delete affiliation.",
        variant: "fail"
      });
    } finally {
      setIsChildSubmitting(false);
    }
  };

  const organizations = context.state.organizations?.map(function(org) {
    const searchValue = org.name + " (" + org.acronym + ")";
    return {
      ...org,
      value: searchValue,
      label: org.name,
    };
  }) ?? [];

  const buildForm = ({ values, errors, touched, isSubmitting, setFieldValue }) => {
    return (
      <Form className="space-y-6">
        {/* Organization */}
        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            Organization <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <ComboBoxResponsive
            items={organizations}
            type="button"
            placeholder="Select a recognized student organization"
            className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
            readOnly={isEdit}
            onChange={function (org) {
              if (!org) {
                return;
              }
              setFieldValue("organizations", org);
              setFieldValue("org_id", org.id);
            }}
            value={affiliation && {
              id: affiliation.organizations.id,
              value: affiliation.organizations.name + " (" + affiliation.organizations.acronym + ")",
              label: affiliation.organizations.name,
            }}
          />
          {touched.org_id && errors.org_id && (
            <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.org_id}</div>
          )}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
            Role <span className="text-[var(--color-astrared)]">*</span>
          </label>
          <Field
            type="text"
            id="role"
            name="role"
            placeholder="Ex: Frontend Developer"
            className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
          />
          {touched.role && errors.role && (
            <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.role}</div>
          )}
        </div>

        {/* Current Affiliation */}
        <div className="flex items-center">
          <Field
            type="checkbox"
            id="is_current"
            name="is_current"
            className="h-4 w-4 text-[var(--color-astraprimary)] border-gray-300 rounded"
          />
          <label htmlFor="is_current" className="ml-2 text-sm text-gray-700">
            I am currently affiliated with this organization
          </label>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate.month" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Start Date <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Field
                as="select"
                id="startDate.month"
                name="startDate.month"
                className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
              >
                <option value="">Month</option>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </Field>
              <Field
                as="select"
                id="startDate.year"
                name="startDate.year"
                className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
              >
                <option value="">Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </Field>
            </div>
          </div>

          {/* End Date */}
          {!values.is_current && (
            <div>
              <label htmlFor="endDate.month" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                End Date <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  as="select"
                  id="endDate.month"
                  name="endDate.month"
                  className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                >
                  <option value="">Month</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </Field>
                <Field
                  as="select"
                  id="endDate.year"
                  name="endDate.year"
                  className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
                >
                  <option value="">Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </Field>
              </div>
            </div>
          )}
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
    );
  };

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
          <DialogTitle>{isEdit ? "Edit Affiliation" : "Add Affiliation"}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={AffiliationSchema}
          onSubmit={handleSubmit}
          component={buildForm}
        />
      </DialogContent>
    </Dialog>
  );
}