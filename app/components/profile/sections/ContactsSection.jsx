
"use client";

import { CONTACT_TYPE_LABELS, CONTACT_TYPE_ICONS } from "../../../../common/scopes.js";
import AddEditContactModal from "@/components/profile/modals/AddEditContactModal.jsx";
import { useRouter } from "next/navigation";
import { feRoutes } from "../../../../common/routes.js";

export function ContactsSection({context, editMode}) {
  const router = useRouter();
  const contacts = context.state.contacts ?? [];

  return (
    <section className="bg-white rounded-lg p-8 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">Contact Information</h2>
        <div className="flex gap-2">
          <AddEditContactModal context={context}/>
          {
            !editMode && (
              <button
                className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 text-[var(--color-astraprimary)] border border-[var(--color-astraprimary)] hover:bg-[var(--color-astradirtywhite)] rounded-md"
                onClick={() => router.push(feRoutes.profiles.contacts(context.state.user?.id))}
              >
                Edit
              </button>
            )
          }
        </div>
      </div>

      <div className="space-y-4">
        {contacts.map(buildContactItem)}
      </div>
    </section>
  );

  function buildContactItem(contact, index) {
    if (contact.is_deleted) {
      return;
    }

    const IconComponent = CONTACT_TYPE_ICONS[contact.type];

    return (
      <div key={index} className="flex items-center">
        <div className="mr-4 text-center">
          <IconComponent className="w-6 h-6 text-[var(--color-astraprimary)]"/>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--color-astrablack)]">
            {contact.content}
          </h3>
          <p className="text-sm text-[var(--color-astrablack)]">{CONTACT_TYPE_LABELS[contact.type]}</p>
        </div>
        {
          editMode && <AddEditContactModal context={context} contact={contact} contactKey={index}/>
        }
      </div>
    );
  }
}
