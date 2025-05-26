"use client";

import {formatYear} from "@/lib/utils.jsx";
import {feRoutes} from "../../../../common/routes.js";
import AddEditDegreeProgramModal from "@/components/profile/modals/AddEditDegreeProgramModal.jsx";
import {useRouter} from "next/navigation";

export default function DegreeProgramsSection({ context, editMode }) {
  const router = useRouter();
  const degreePrograms = context.state.degreePrograms ?? [];

  return (
    <section className="bg-white rounded-lg p-8 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">Degree Programs</h2>
        <div className="flex gap-2">
          <AddEditDegreeProgramModal context={context} />
          {
            !editMode && (
              <button
                className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 text-[var(--color-astraprimary)] border border-[var(--color-astraprimary)] hover:bg-[var(--color-astradirtywhite)] rounded-md"
                onClick={() => router.push(feRoutes.profiles.degreePrograms(context.state.user?.id))}
              >
                Edit
              </button>
            )
          }
        </div>
      </div>

      <div className="space-y-6">
        {degreePrograms.map(buildDegreePrograms)}
      </div>
    </section>
  );

  function buildDegreePrograms(program, index) {
    if (program.is_deleted) {
      return;
    }

    return (
      <div key={index} className="flex">
        <div className="mr-4">
          <div
            className={`w-2 h-full ${index === 0 ? "bg-[var(--color-astraprimary)]" : "bg-[var(--color-astradark)]"} rounded-full`}></div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold text-[var(--color-astrablack)]">{program.name}</h3>
          <p className="text-sm text-[var(--color-astrablack)]">{program.level}</p>
          <p className="text-sm text-[var(--color-astrablack)]">
            {formatYear(program.year_started)} - {formatYear(program.year_graduated)}
          </p>
          <p className="text-[var(--color-astrablack)] text-sm md:text-md text-justify">
            {program.institution}
          </p>
        </div>
        {
          editMode && <AddEditDegreeProgramModal context={context} degreeProgram={program} degreeProgramKey={index} />
        }
      </div>
    );
  }
}