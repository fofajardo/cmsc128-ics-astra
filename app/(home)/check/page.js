"use client";

export default function InformationChanged() {
  const handleYesClick = () => {
    // Note: Fetch data then redirect it to personal
    window.location.href = "/profile/alumni/EditPersonal";
  };

  const handleNoClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-astratintedwhite)]">
      <div className="w-full max-w-md">
        <div className="p-8 rounded-lg shadow-sm bg-[var(--color-astrawhite)]">
          <h1 className="text-[var(--color-astrablack)] text-3xl font-bold mb-2">
            Has your information changed?
          </h1>
          <p className="text-sm mb-6 text-gray-700">
            Please let us know if any of your personal details have changed since your last visit.
          </p>

          <div className="space-y-3">
            <button 
              onClick={handleYesClick}
              className="w-full py-2.5 px-4 border text-[var(--color-astrawhite)] bg-[var(--color-astraprimary)] rounded-md text-sm text-center"
            >
              Yes, my information has changed
            </button>
            <button 
              onClick={handleNoClick}
              className="w-full py-2.5 px-4 border border-gray-200 rounded-md text-sm text-center text-[var(--color-astrablack)]"
            >
              No, everything is the same
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}