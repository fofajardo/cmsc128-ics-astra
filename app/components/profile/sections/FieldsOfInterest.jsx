"use client";
import SkillTag from "@/components/SkillTag";
import InterestsModal from "@/components/profile/modals/InterestsModal.jsx";

export const FieldsOfInterest = ({ context }) => {
  const fieldOfInterests = (context.state.profile.interests?.trim() ?? "") === ""
    ? []
    : context.state.profile.interests.split(",").map(function(interest) {
      return { text: interest };
    });

  return (
    <section className="bg-white rounded-lg p-8 mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)] mb-6">Fields of Interest</h2>
      <div className="flex flex-wrap gap-2">
        {fieldOfInterests.map((interest, index) => (
          <SkillTag
            key={index}
            text={interest.text}
          />
        ))}

        <InterestsModal context={context} interests={fieldOfInterests} />
      </div>
    </section>
  );
};