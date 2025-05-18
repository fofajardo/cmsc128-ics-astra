"use client";
import SkillTag from "@/components/SkillTag";
import TechnicalSkillsModal from "@/components/profile/modals/TechnicalSkillsModal.jsx";

export const TechnicalSkills = ({ context, technicalSkills }) => {
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

        <TechnicalSkillsModal context={context} skills={technicalSkills} />
      </div>
    </section>
  );
};