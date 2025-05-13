"use client";
import { PlusCircle } from "lucide-react";
import SkillTag from "@/components/SkillTag";

export const FieldsOfInterest = ({ fieldOfInterests, setIsShowInterestForm }) => {
  return (
    <section className="bg-white rounded-lg p-8 mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)] mb-6">Fields of Interest</h2>
      <div className="flex flex-wrap gap-2">
        {fieldOfInterests.map((interest, index) => (
          <SkillTag
            key={index}
            text={interest.text}
            color={interest.color}
          />
        ))}
        <button
          className="p-2 bg-[(var(--color-astradirtywhite)] text-[var(--color-astraprimary)] rounded-full"
          onClick={() => setIsShowInterestForm(true)}
        >
          <PlusCircle size={20} />
        </button>
      </div>
    </section>
  );
};