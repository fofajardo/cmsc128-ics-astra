"use client";

import Image from "next/image";

export function PersonalInfo({context, profileData, setIsShowPersonalForm}) {
  return (
    <section className="bg-white rounded-lg px-10 py-12 mb-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Profile Picture Column */}
        <div className="flex justify-center items-center md:min-w-[200px]">
          <Image
            src={context.state.avatarUrl}
            alt="Profile Picture"
            width={180}
            height={180}
            className="w-[180px] h-[180px] rounded-full object-cover"
          />
        </div>
        {/* Profile Info Column */}

        <div className="flex-1">
          <div className="flex justify-left gap-4 items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">Profile Information</h2>
            {context.state.isVerified && (
              <button
                className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white hover:bg-[var(--color-astradark)] rounded-md"
                onClick={() => setIsShowPersonalForm(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-7">
            {Object.entries(profileData)
              .filter(([key, value]) => {
                const isMaidenName = key === "IsMaidenName";
                const isNullSuffix = key === "Suffix" && value === null;
                return !isMaidenName && !isNullSuffix;
              })
              .map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, " $1");

                return (
                  <div key={key} className="flex flex-col py-2">
                    <p className="text-sm font-semibold text-[var(--color-astrablack)] mb-1">{label}:</p>
                    <p className="text-sm text-[var(--color-astrablack)] text-left">{value}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}