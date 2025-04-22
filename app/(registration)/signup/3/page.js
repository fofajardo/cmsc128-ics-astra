import Link from "next/link"

export default function EducationalInfoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-astratintedwhite)]">
      <div className="flex flex-1">
        <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-2xl font-semibold text-black mb-4">Educational Information</h2>

            <form className="space-y-4">
              <div>
                <label htmlFor="degree-program" className="block text-sm font-medium text-gray-700 mb-1">
                  Degree Program
                </label>
                <input
                  type="text"
                  id="degree-program"
                  name="degree-program"
                  placeholder="BS Computer Science"
                  className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="student-id" className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  id="student-id"
                  name="student-id"
                  placeholder="XXXX-XXXXX"
                  className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="graduation-year" className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>
                <input
                  type="text"
                  id="graduation-year"
                  name="graduation-year"
                  placeholder="XXXX"
                  className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proof of Graduation</label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    placeholder="filename_proof.png"
                    className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900 flex-1"
                  />
                  <button
                    type="button"
                    className="bg-[var(--color-astraprimary)] text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                  >
                    Browse
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">PDF, JPEG, or PNG</p>
              </div>

              <p className="text-xs text-gray-700 mt-4 text-center">
                By clicking "Submit," you confirm that you have read and understood this notice and consent to the
                processing of your personal data in accordance with the Data Privacy Act of 2012. Thank you for your
                cooperation!
              </p>

              <div className="flex space-x-4 mt-6">
                <Link href="/signup/2" className="flex-1">
                  <button
                    type="button"
                    className="w-full border border-[var(--color-astraprimary)] text-[var(--color-astraprimary)] bg-[var(--color-astrawhite)] py-2 px-4 rounded-md hover:bg-[var(--color-astradirtywhite)] transition-colors"
                  >
                    Back
                  </button>
                </Link>
                <Link href="/dashboard" className="flex-1">
                  <button
                    type="button"
                    className="w-full bg-[var(--color-astraprimary)] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                </Link>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--color-astraprimary)]"></div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel - Image */}
        <div className="hidden md:block md:w-1/2 bg-[var(--color-astraprimary)]">
          <div className="relative h-full">
            <img src="/blue-bg.png" alt="Background" className="h-full w-full object-cover" />
            <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center px-6">
              <h1 className="text-2xl font-bold text-white mb-4 text-justify">Notice and Consent to Privacy</h1>
              <p className="text-white text-sm mb-4 text-justify">
                When uploading your proof of graduation file for the University of the Philippines Los Baños (UPLB),
                please ensure that the document is clear, legible, and in the required format (e.g., PDF, JPEG, or PNG).
                This document serves as official verification of your academic achievement and will be used for alumni
                tracking and relations advancement.
              </p>
              <p className="text-white text-sm mb-4 text-justify">
                By proceeding with the upload, you acknowledge and agree that your personal data will be collected,
                processed, and stored in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173).
                ICS-ASTRA adheres to this law, ensuring that your information will be handled with strict
                confidentiality and used solely for the stated purpose of alumni tracking and relations advancement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}