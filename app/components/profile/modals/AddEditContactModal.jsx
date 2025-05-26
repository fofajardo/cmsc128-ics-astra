
"use client";

import {useEffect, useState} from "react";
import {Field, Form, Formik} from "formik";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.jsx";
import {toast} from "@/components/ToastNotification.jsx";
import axios from "axios";
import {clientRoutes} from "../../../../common/routes.js";
import {EditIcon} from "lucide-react";
import {CONTACT_TYPE, CONTACT_TYPE_LABELS} from "../../../../common/scopes.js";
import {ContactSchema} from "../../../../common/validationSchemas.js";

export default function AddEditContactModal({ context, contact = null, contactKey = null }) {
  const isEdit = contact !== null;
  const [open, setOpen] = useState(false);
  const [isChildSubmitting, setIsChildSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({
    type: "",
    content: ""
  });

  useEffect(() => {
    if (open && contact !== null) {
      setInitialValues({
        type: contact.type.toString(),
        content: contact.content || ""
      });
    }
  }, [open, contact]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsChildSubmitting(true);
    values.user_id = context.state.user.id;

    try {
      if (isEdit) {
        await axios.put(clientRoutes.contacts.withId(contact.id), values);
        context.actions.patchContacts(contactKey, values);
      } else {
        const response = await axios.post(clientRoutes.contacts.base(), values);
        context.actions.pushContact(response.data.contact);
      }

      setOpen(false);
      toast({
        title: isEdit ? "Contact updated successfully!" : "Contact added successfully!",
        variant: "success"
      });
    } catch (e) {
      toast({
        title: e?.response?.data?.message ?? e?.message ?? "Failed to save contact information.",
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
      await axios.delete(clientRoutes.contacts.withId(contact.id));
      context.actions.patchContacts(contactKey, { is_deleted: true });
      setOpen(false);
      toast({
        title: "Contact deleted successfully!",
        variant: "success"
      });
    } catch (e) {
      toast({
        title: e?.response?.data?.message ?? e?.message ?? "Failed to delete contact.",
        variant: "fail"
      });
    } finally {
      setIsChildSubmitting(false);
    }
  };

  const buildForm = ({ values, errors, touched, isSubmitting }) => (
    <Form className="space-y-6">
      {/* Contact Type */}
      {
        !contact && (
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
              Contact Type <span className="text-[var(--color-astrared)]">*</span>
            </label>
            <Field
              as="select"
              id="type"
              name="type"
              className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
            >
              <option value="">Select contact type</option>
              {Object.entries(CONTACT_TYPE)
                .filter(([key]) => !["isDefined"].includes(key))
                .map(([key, value]) => (
                  <option key={key} value={value}>{CONTACT_TYPE_LABELS[value]}</option>
                ))
              }
            </Field>
            {touched.type && errors.type && (
              <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.type}</div>
            )}
          </div>
        )
      }

      {/* Contact Information */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
          Contact Information <span className="text-[var(--color-astrared)]">*</span>
        </label>
        <Field
          type="text"
          id="content"
          name="content"
          placeholder="Enter contact information"
          className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] text-sm md:text-base"
        />
        {touched.content && errors.content && (
          <div className="text-[var(--color-astrared)] text-xs mt-1">{errors.content}</div>
        )}
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
      <DialogContent className="sm:max-w-[425px]" loading={isChildSubmitting}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Contact" : "Add Contact"}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={ContactSchema}
          onSubmit={handleSubmit}
          component={buildForm}
        />
      </DialogContent>
    </Dialog>
  );
}