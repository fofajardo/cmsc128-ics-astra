"use client";
import { PlusCircle } from "lucide-react";
import SkillTag from "@/components/SkillTag";

export const TechnicalSkills = ({ technicalSkills, setIsShowTechnicalForm }) => {
  return (
    <section className="bg-white rounded-lg p-8 mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)] mb-6">Technical Skills</h2>
      <div className="flex flex-wrap gap-2">
        {technicalSkills.map((skill, index) => (
          <SkillTag
            key={index}
            text={skill.text}
          />
        ))}
        <button
          className="p-2 bg-[(var(--color-astradirtywhite)] text-[var(--color-astraprimary)] rounded-full"
          onClick={() => setIsShowTechnicalForm(true)}
        >
          <PlusCircle size={20} />
        </button>
      </div>
    </section>
  );
};