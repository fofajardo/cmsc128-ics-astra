"use client";

import {formatMonthYear} from "@/lib/utils.jsx";
import {feRoutes} from "../../../../common/routes.js";
import AddEditAffiliationModal from "@/components/profile/modals/AddEditAffiliationModal.jsx";

export const Affiliations = ({ context, editMode }) => {
  const affiliations = context.state.organizationAffiliations ?? [];

  return (
    <section className="bg-white rounded-lg p-8 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">Affiliations</h2>
        <div className="flex gap-2">
          <AddEditAffiliationModal context={context} />
          {
            !editMode && (
              <a href={feRoutes.profiles.affiliations(context.state.user?.id)}>
                <button
                  className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 text-[var(--color-astraprimary)] border border-[var(--color-astraprimary)] hover:bg-[var(--color-astradirtywhite)] rounded-md"
                >
                  Edit
                </button>
              </a>
            )
          }
        </div>
      </div>

      <div className="space-y-6">
        {affiliations.map(buildAffiliations)}
      </div>
    </section>
  );

  function buildAffiliations(aff, index) {
    aff.startDateDisplay = formatMonthYear(aff.joined_date);
    aff.endDateDisplay = aff.end_date ? formatMonthYear(aff.end_date) : "";
    if (aff.is_deleted) {
      return;
    }

    return (
      <div key={index} className="flex">
        <div className="mr-4">
          <div
            className={`w-2 h-full ${index === 0 ? "bg-[var(--color-astraprimary)]" : "bg-[var(--color-astradark)]"} rounded-full`}></div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold text-[var(--color-astrablack)]">{aff.organizations.name}</h3>
          <p className="text-sm text-[var(--color-astrablack)]">{aff.role}</p>
          <p className="text-sm text-[var(--color-astrablack)]">
            {aff.startDateDisplay} {
              aff.is_current
                ? "- Present"
                : !aff.end_date
                  ? ""
                  : `- ${aff.endDateDisplay}`
            }
          </p>
          <p className="text-[var(--color-astrablack)] text-sm md:text-md text-justify">
            {aff.organizations.location}
          </p>
          <p className="text-[var(--color-astrablack)] text-sm md:text-md text-justify mt-2">{aff.description}</p>
        </div>
        {
          editMode && <AddEditAffiliationModal context={context} affiliation={aff} affiliationKey={index} />
        }
      </div>
    );
  }
};