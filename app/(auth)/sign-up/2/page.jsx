"use client";
import Link from "next/link";
import { useState } from "react";

export default function PersonalInfoPage() {
  const [delegation, setDelegation] = useState("");
  const [formValues, setFormValues] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    birthdate: "",
    sex: "",
    civilStatus: "",
    placeOfBirth: "",
    citizenship: "Philippines"
  });
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const requiredFilled = delegation &&
      formValues.firstName &&
      formValues.middleName &&
      formValues.lastName &&
      formValues.birthdate &&
      formValues.sex &&
      formValues.civilStatus &&
      formValues.placeOfBirth &&
      formValues.citizenship;

    if (!requiredFilled) {
      setShowError(true);
    } else {
      setShowError(false);
      window.location.href = "/sign-up/3";
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-astratintedwhite)]">
      <div className="w-full md:w-1/2 relative flex items-center justify-center px-4 md:px-8">
        <div className="max-w-md w-full mx-auto">
          <form className="space-y-4 px-4 sm:px-6 sm:pt-4 md:px-8 md:pt-6">
            <img
              src="/astra-logo-w-name.png"
              alt="ICS-ASTRA Logo"
              height={30}
              width={120}
              className="w-auto mb-2"
            />
            <h2 className="text-lg md:text-2xl font-semibold text-black mb-4">Personal Information</h2>
            <div>
              <label htmlFor="preferred-delegation" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                Preferred Delegation <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <select
                id="preferred-delegation"
                name="delegation"
                value={delegation}
                onChange={(e) => setDelegation(e.target.value)}
                className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
              >
                <option value="">Select</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Mx.">Mx.</option>
              </select>
            </div>

            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                First Name <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <input
                type="text"
                id="first-name"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
              />
            </div>

            <div>
              <label htmlFor="middle-name" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                Middle Name <span className="text-[var(--color-astrared)]">*</span>
              </label>
              <input
                type="text"
                id="middle-name"
                name="middleName"
                value={formValues.middleName}
                onChange={handleChange}
                className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="last-name" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                  Last Name <span className="text-[var(--color-astrared)]">*</span>
                </label>
                <input
                  type="text"
                  id="last-name"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="suffix" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                  Suffix
                </label>
                <input
                  type="text"
                  id="suffix"
                  name="suffix"
                  value={formValues.suffix}
                  onChange={handleChange}
                  placeholder="Jr., Sr., III..."
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
                />
              </div>
            </div>

            {(delegation === "Ms." || delegation === "Mrs.") && (
              <div className="flex items-center">
                <input
                  id="maiden-name-checkbox"
                  type="checkbox"
                  className="w-4 h-4 text-[var(--color-astraprimary)] border-gray-300 rounded-sm focus:ring-[var(--color-astraprimary)] focus:ring-2"
                />
                <label htmlFor="maiden-name-checkbox" className="ms-2 text-sm md:text-base font-medium text-black">
                  My last name is the same as my maiden name
                </label>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex-1">
                <label htmlFor="birthdate" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                  Birthdate <span className="text-[var(--color-astrared)]">*</span>
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formValues.birthdate}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
                />
              </div>

              <div className="flex-1">
                <label htmlFor="sex" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                  Sex <span className="text-[var(--color-astrared)]">*</span>
                </label>
                <select
                  id="sex"
                  name="sex"
                  value={formValues.sex}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="flex-1">
                <label htmlFor="civil-status" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                  Civil Status <span className="text-[var(--color-astrared)]">*</span>
                </label>
                <select
                  id="civil-status"
                  name="civilStatus"
                  value={formValues.civilStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="place-of-birth" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                  Place of Birth <span className="text-[var(--color-astrared)]">*</span>
                </label>
                <input
                  type="text"
                  id="place-of-birth"
                  name="placeOfBirth"
                  value={formValues.placeOfBirth}
                  onChange={handleChange}
                  placeholder="e.g. Manila"
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="country-of-citizenship" className="block text-sm font-medium text-[var(--color-astrablack)] mb-1">
                  Citizenship <span className="text-[var(--color-astrared)]">*</span>
                </label>
                <select
                  id="country-of-citizenship"
                  name="citizenship"
                  value={formValues.citizenship}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-[var(--color-astradirtywhite)] rounded-md bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)]"
                >
                  <option value="">Select</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {showError && (
              <div className="mb-2 text-sm text-red-600 font-medium ">
                Please fill in all required fields.
              </div>
            )}

            <div className="flex space-x-4 mt-6">
              <Link href="/sign-up" className="flex-1">
                <button
                  type="button"
                  className="text-sm md:text-base w-full border border-[var(--color-astraprimary)] text-[var(--color-astraprimary)] bg-[var(--color-astrawhite)] py-2 px-4 rounded-md hover:bg-[var(--color-astradirtywhite)] transition-colors"
                >
                  Back
                </button>
              </Link>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={handleNext}
                  className="text-sm md:text-base w-full bg-[var(--color-astraprimary)] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-[var(--color-astraprimary)]"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 bg-[var(--color-astraprimary)]">
        <img src="/blue-bg.png" alt="Background" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
