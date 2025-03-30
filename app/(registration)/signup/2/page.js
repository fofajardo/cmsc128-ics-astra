import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="flex flex-wrap">
      <div className="w-full flex flex-col sm:w-full md:w-1/2">
        <div className="flex justify-center pt-6 pb-4 sm:pt-8 md:-mb-24 md:justify-start md:pl-12">
          <a href="#" className="border-b-gray-700 border-b-4 pb-2 text-2xl font-bold text-gray-900">
            Personal Information
          </a>
        </div>
        <div className="px-6 sm:px-8 lg:w-[28rem] mx-auto my-auto flex flex-col justify-center pt-4 md:pt-0">
          <div className="md:hidden bg-gray-100 p-4 mb-4 rounded-lg"> {/* For Mobile */}
            <h3 className="font-bold text-lg mb-2">Notice and Consent to Privacy</h3>
            <p className="text-sm mb-2">
              When uploading your proof of graduation file for the University of the Philippines Los Baños (UPLB),
              please ensure that the document is clear, legible, and in the required format (e.g., PDF, JPEG, or PNG).
              This document serves as official verification of your academic achievement and will be used for alumni
              tracking and relations advancement.
            </p>
            <p className="text-sm">
              By proceeding with the upload, you acknowledge and agree that your personal data will be collected,
              processed, and stored in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173).
            </p>
          </div>

          <form className="space-y-3">
            <div>
              <label htmlFor="preferred-delegation" className="signup-additional-steps-text">
                Preferred Delegation
              </label>
              <input
                type="text"
                id="preferred-delegation"
                name="preferred-delegation"
                placeholder="Mx."
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="first-name" className="signup-additional-steps-text">
                First Name
              </label>
              <input type="text" id="first-name" name="first-name" placeholder="First Name" className="form-input" />
            </div>
            <div>
              <label htmlFor="middle-name" className="signup-additional-steps-text">
                Middle Name
              </label>
              <input type="text" id="middle-name" name="middle-name" placeholder="Middle Name" className="form-input" />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="last-name" className="signup-additional-steps-text">
                  Last Name
                </label>
                <input type="text" id="last-name" name="last-name" placeholder="Last Name" className="form-input" />
              </div>
              <div className="flex-1">
                <label htmlFor="suffix" className="signup-additional-steps-text">
                  Suffix
                </label>
                <input type="text" id="suffix" name="suffix" placeholder="Suffix" className="form-input" />
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="link-checkbox"
                type="checkbox"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="link-checkbox" className="ms-2 text-sm font-medium text-black">
                My last name is the same as my maiden name
              </label>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="birthdate" className="signup-additional-steps-text">
                  Birthdate
                </label>
                <input type="text" id="birthdate" name="birthdate" placeholder="YYYY/MM/DD" className="form-input" />
              </div>
              <div className="flex-1">
                <label htmlFor="sex" className="signup-additional-steps-text">
                  Sex
                </label>
                <input type="text" id="sex" name="sex" placeholder="Sex" className="form-input" />
              </div>
              <div className="flex-1">
                <label htmlFor="civil-status" className="signup-additional-steps-text">
                  Civil Status
                </label>
                <input type="text" id="civil-status" name="civil-status" placeholder="Single" className="form-input" />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="place-of-birth" className="signup-additional-steps-text">
                  Place of Birth
                </label>
                <input
                  type="text"
                  id="place-of-birth"
                  name="place-of-birth"
                  placeholder="Philippines"
                  className="form-input"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="country-of-citizenship" className="signup-additional-steps-text">
                  Country of Citizenship
                </label>
                <select id="country-of-citizenship" name="country-of-citizenship" className="form-input">
                  <option value="">Select a country</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/signup" className="w-1/3">
                <button type="button" className="form-back-btn">
                  Back
                </button>
              </Link>
              <Link href="/signup/3" className="w-2/3">
                <button type="button" className="btn-primary w-full">
                  Next
                </button>
              </Link>
            </div>
            <div className="flex justify-center mt-6 space-x-1">
              <div className="pagination-dot "></div>
              <div className="pagination-dot active"></div>
              <div className="pagination-dot"></div>
            </div>
          </form>
        </div>
      </div>
      <div className="relative hidden h-56 sm:h-screen md:block md:w-1/2 bg-black">
        <img src="/blue-bg.png" alt="Background" className="h-full w-full object-cover" />
        <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center px-6">
          <h1 className="notice-consent-privacy-title">Notice and Consent to Privacy</h1>
          <p className="notice-consent-privacy-body">
            When uploading your proof of graduation file for the University of the Philippines Los Baños (UPLB), please
            ensure that the document is clear, legible, and in the required format (e.g., PDF, JPEG, or PNG). This
            document serves as official verification of your academic achievement and will be used for alumni tracking
            and relations advancement.
          </p>
          <p className="notice-consent-privacy-body">
            By proceeding with the upload, you acknowledge and agree that your personal data will be collected,
            processed, and stored in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173). ICS-ASTRA
            adheres to this law, ensuring that your information will be handled with strict confidentiality and used
            solely for the stated purpose of alumni tracking and relations advancement.
          </p>
        </div>
      </div>
    </div>
  )
}

