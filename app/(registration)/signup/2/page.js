import Link from "next/link"

export default function PersonalInfoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-astratintedwhite)]">
      <div className="flex flex-1">
        {/* Left Panel - Form */}
        <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-2xl font-semibold text-black mb-4">Personal Information</h2>

            <form className="space-y-4">
              <div>
                <label htmlFor="preferred-delegation" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Delegation
                </label>
                <input
                  type="text"
                  id="preferred-delegation"
                  name="preferred-delegation"
                  placeholder="Mx."
                  className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  name="first-name"
                  placeholder="First Name"
                  className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="middle-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middle-name"
                  name="middle-name"
                  placeholder="Middle Name"
                  className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    name="last-name"
                    placeholder="Last Name"
                    className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="suffix" className="block text-sm font-medium text-gray-700 mb-1">
                    Suffix
                  </label>
                  <input
                    type="text"
                    id="suffix"
                    name="suffix"
                    placeholder="Suffix"
                    className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="maiden-name-checkbox"
                  type="checkbox"
                  className="w-4 h-4 text-[var(--color-astraprimary)] bg-gray-100 border-gray-300 rounded-sm focus:ring-[var(--color-astraprimary)] focus:ring-2"
                />
                <label htmlFor="maiden-name-checkbox" className="ms-2 text-sm font-medium text-black">
                  My last name is the same as my maiden name
                </label>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                    Birthdate
                  </label>
                  <input
                    type="text"
                    id="birthdate"
                    name="birthdate"
                    placeholder="YYYY/MM/DD"
                    className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">
                    Sex
                  </label>
                  <input
                    type="text"
                    id="sex"
                    name="sex"
                    placeholder="Sex"
                    className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="civil-status" className="block text-sm font-medium text-gray-700 mb-1">
                    Civil Status
                  </label>
                  <input
                    type="text"
                    id="civil-status"
                    name="civil-status"
                    placeholder="Single"
                    className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="place-of-birth" className="block text-sm font-medium text-gray-700 mb-1">
                    Place of Birth
                  </label>
                  <input
                    type="text"
                    id="place-of-birth"
                    name="place-of-birth"
                    placeholder="Philippines"
                    className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="country-of-citizenship" className="block text-sm font-medium text-gray-700 mb-1">
                    Country of Citizenship
                  </label>
                  <select
                    id="country-of-citizenship"
                    name="country-of-citizenship"
                    className="w-full px-3 py-2 border border-[var(--color-astradirtywhite)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-astraprimary)] bg-white text-gray-900"
                  >
                    <option value="">Philippines</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <Link href="/signup" className="flex-1">
                  <button
                    type="button"
                    className="w-full border border-[var(--color-astraprimary)] text-[var(--color-astraprimary)] bg-[var(--color-astrawhite)] py-2 px-4 rounded-md hover:bg-[var(--color-astradirtywhite)] transition-colors"
                  >
                    Back
                  </button>
                </Link>
                <Link href="/signup/3" className="flex-1">
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
                <div className="w-2 h-2 rounded-full bg-[var(--color-astraprimary)]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 bg-[var(--color-astraprimary)]">
          <div className="relative h-full">
            <img src="/blue-bg.png" alt="Background" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  )
}