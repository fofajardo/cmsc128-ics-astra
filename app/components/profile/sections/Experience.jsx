"use client";

export const Experience = ({ experiences, setIsShowExperienceForm, setIsShowAddExperienceForm }) => {
  return (
    <section className="bg-white rounded-lg p-8 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">Experience</h2>
        <div className="flex gap-2">
          <button
            className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 text-[var(--color-astraprimary)] border border-[var(--color-astraprimary)] hover:bg-[var(--color-astradirtywhite)] rounded-md"
            onClick={() => setIsShowAddExperienceForm(true)}
          >
            Add
          </button>
          <button
            className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 text-[var(--color-astraprimary)] border border-[var(--color-astraprimary)] hover:bg-[var(--color-astradirtywhite)] rounded-md"
            onClick={() => setIsShowExperienceForm(true)}
          >
            Edit
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="flex">
            <div className="mr-4">
              <div className={`w-2 h-full ${index === 0 ? "bg-[var(--color-astraprimary)]" : "bg-[var(--color-astradark)]"} rounded-full`}></div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-[var(--color-astrablack)]">{exp.company}</h3>
              <p className="text-sm text-[var(--color-astrablack)]">{exp.title} • {exp.type}</p>
              <p className="text-sm text-[var(--color-astrablack)]">
                {exp.startDate} {exp.isCurrentlyWorking ? "- Present" : `- ${exp.endDate}`}
              </p>
              <p className="text-[var(--color-astrablack)] text-sm md:text-md text-justify">{exp.location}</p>
              <p className="text-[var(--color-astrablack)] text-sm md:text-md text-justify mt-2">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};