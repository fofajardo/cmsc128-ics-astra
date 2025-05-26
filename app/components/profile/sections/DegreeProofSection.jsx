"use client";

import DegreeProofModal from "@/components/profile/modals/DegreeProofModal.jsx";

export default function DegreeProofSection({ context }) {
  return (
    <section className="bg-white rounded-lg p-8 mb-6 max-w-7xl mx-auto">
      <div className="flex flex-col">
        <div className="flex justify-between gap-4 items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">
            Proof of Graduation
          </h2>
        </div>
        <div className="flex justify-between items-center self-center mb-4">
          <DegreeProofModal context={context} />
        </div>
      </div>
    </section>
  );
}
