"use client";

import AddEditExperienceModal from "@/components/profile/modals/AddEditExperienceModal.jsx";
import {formatMonthYear} from "@/lib/utils.jsx";
import {useState} from "react";
import {EMPLOYMENT_STATUS_LABELS, LOCATION_TYPE_LABELS} from "../../../../common/scopes.js";
import {redirect} from "next/navigation";
import {feRoutes} from "../../../../common/routes.js";

export const Experience = ({ context, editMode }) => {
  const experiences = context.state.workExperiences ?? [];
  return (
    <section className="bg-white rounded-lg p-8 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">Experience</h2>
        <div className="flex gap-2">
          <AddEditExperienceModal context={context} />

          {
            !editMode && (
              <a href={feRoutes.profiles.experience(context.state.user?.id)}>
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
        {experiences.map(buildExperiences)}
      </div>
    </section>
  );

  function buildExperiences(exp, index) {
    exp.startDateDisplay = formatMonthYear(exp.year_started);
    exp.endDateDisplay = exp.year_ended ? formatMonthYear(exp.year_ended) : "";
    exp.employmentTypeDisplay = exp.employment_type !== null
      ? EMPLOYMENT_STATUS_LABELS[exp.employment_type]
      : "";
    exp.locationTypeDisplay = exp.location_type !== null
      ? LOCATION_TYPE_LABELS[exp.location_type]
      : "";

    if (exp.is_deleted) {
      return;
    }

    return (
      <div key={index} className="flex">
        <div className="mr-4">
          <div
            className={`w-2 h-full ${index === 0 ? "bg-[var(--color-astraprimary)]" : "bg-[var(--color-astradark)]"} rounded-full`}></div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold text-[var(--color-astrablack)]">{exp.company}</h3>
          <p className="text-sm text-[var(--color-astrablack)]">
            {exp.title}{exp.employmentTypeDisplay !== "" && " • "}{exp.employmentTypeDisplay}
          </p>
          <p className="text-sm text-[var(--color-astrablack)]">
            {exp.startDateDisplay} {
              exp.isCurrent
                ? "- Present"
                : !exp.year_ended
                  ? ""
                  : `- ${exp.endDateDisplay}`
            }
          </p>
          <p className="text-[var(--color-astrablack)] text-sm md:text-md text-justify">
            {exp.location}{exp.locationTypeDisplay !== "" && " • "}{exp.locationTypeDisplay}
          </p>
          <p className="text-[var(--color-astrablack)] text-sm md:text-md text-justify mt-2">{exp.description}</p>
        </div>
        {
          editMode && <AddEditExperienceModal context={context} experience={exp} experienceKey={index} />
        }
      </div>
    );
  }
};