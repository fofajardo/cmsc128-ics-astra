import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-wrap">
      <div className="w-full flex flex-col sm:w-full md:w-1/2">
        <div className="flex justify-center pt-8 sm:pt-12 md:-mb-24 md:justify-start md:pl-12">
          <a
            href="#"
            className="border-b-gray-700 border-b-4 pb-2 text-2xl font-bold text-gray-900"
          >
            Educational Information
          </a>
        </div>

        <div className="px-4 sm:px-6 lg:w-[28rem] mx-auto my-auto flex flex-col justify-center pt-8 md:pt-0">
          <form className="space-y-3">
            <div>
              <label
                htmlFor="degree-program"
                className="signup-additional-steps-text"
              >
                Degree Program
              </label>
              <input
                type="text"
                id="degree-program"
                name="degree-program"
                placeholder="BS Computer Science"
                className="form-input"
              />
            </div>

            <div>
              <label
                htmlFor="student-id"
                className="signup-additional-steps-text"
              >
                Student ID
              </label>
              <input
                type="text"
                id="student-id"
                name="student-id"
                placeholder="XXXX-XXXXX"
                className="form-input"
              />
            </div>

            <div>
              <label
                htmlFor="graduation-year"
                className="signup-additional-steps-text"
              >
                Graduation Year
              </label>
              <input
                type="text"
                id="graduation-year"
                name="graduation-year"
                placeholder="XXXX"
                className="form-input"
              />
            </div>

            <div class="max-w-md mx-auto">
              <label class="signup-additional-steps-text">Proof of Graduation</label>
              <input
                type="file"
                class="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded"
              />
              <p class="text-xs text-slate-500 mt-2">PDF, JPEG, or PNG</p>
            </div>

            <p className="text-xs text-gray-700 mt-4 text-center">
              By clicking "Submit," you confirm that you have read and understood this notice and consent to the processing of your personal data in accordance with the Data Privacy Act of 2012. Thank you for your cooperation!
            </p>
            <Link href="/3">
              <button
                type="button"
                className="w-full btn-primary"
              >
                Submit
              </button>
            </Link>
            <div className="flex justify-center mt-6 space-x-1">
              <div className="pagination-dot "></div>
              <div className="pagination-dot "></div>
              <div className="pagination-dot active"></div>
            </div>
          </form>
        </div>
      </div>

      <div className="relative hidden h-56 sm:h-screen md:block md:w-1/2 bg-black">
        <img
          src="/blue-bg.png"
          alt="Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center px-6">
          <h1 className="notice-consent-privacy-title">
            Notice and Consent to Privacy
          </h1>
          <p className="notice-consent-privacy-body">
            When uploading your proof of graduation file for the University of the Philippines Los Baños (UPLB),
            please ensure that the document is clear, legible, and in the required format (e.g., PDF, JPEG, or PNG).
            This document serves as official verification of your academic achievement and will be used for alumni tracking and relations advancement.
          </p>
          <p className="notice-consent-privacy-body">
            By proceeding with the upload, you acknowledge and agree that your personal data will be collected, processed, and stored in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173). ICS-ASTRA adheres to this law, ensuring that your information will be handled with strict confidentiality and used solely for the stated purpose of alumni tracking and relations advancement.
          </p>
        </div>
      </div>
    </div>
  );
}
