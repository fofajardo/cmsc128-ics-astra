export default function EditForm({ profileData, hidePersonalForm }) {
  return (
    <>
      <div className="flex justify-center w-full ">
        <img
          src="https://via.placeholder.com/150"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-gray-300"
        />
      </div>
      <div className="mt-6">
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Title</label>
          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="PreferredTitle"
                value="Mr."
                checked={profileData?.Title === "Mr."}
                className="form-radio h-4 w-4 text-[#00743e]"
              />
              <span className="ml-2">Mr.</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="PreferredTitle"
                value="Ms."
                checked={profileData?.Title === "Ms."}
                className="form-radio h-4 w-4 text-[#00743e]"
              />
              <span className="ml-2">Ms.</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="PreferredTitle"
                value="Mrs."
                checked={profileData?.Title === "Mrs."}
                className="form-radio h-4 w-4 text-[#00743e]"
              />
              <span className="ml-2">Mrs.</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="PreferredTitle"
                value="Mx."
                checked={profileData?.Title === "Mx."}
                className="form-radio h-4 w-4 text-[#00743e]"
              />
              <span className="ml-2">Mx.</span>
            </label>
          </div>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isMaidenName"
                checked={profileData?.IsMaidenName}
                className="form-checkbox h-4 w-4 text-[#00743e]"
              />
              <span className="ml-2">Is your last name your maiden name?</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex space-x-4">
          <label className="w-full">
            <span className="block text-sm font-medium">First Name</span>
            <input
              type="text"
              name="firstName"
              defaultValue={profileData?.FirstName}
              className="form-input"
            />
          </label>
          <label className="w-full">
            <span className="block text-sm font-medium">Middle Name</span>
            <input
              type="text"
              name="middleName"
              defaultValue={profileData?.MiddleName}
              className="form-input"
            />
          </label>
          <label className="w-full">
            <span className="block text-sm font-medium">Last Name</span>
            <input
              type="text"
              name="lastName"
              defaultValue={profileData?.LastName}
              className="form-input"
            />
          </label>
          <label className="w-full">
            <span className="block text-sm font-medium">Suffix</span>
            <input
              type="text"
              name="suffix"
              defaultValue={profileData?.Suffix}
              className="form-input"
            />
          </label>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex space-x-4">
          <label className="w-full">
            <span className="block text-sm font-medium">Birthdate</span>
            <input
              type="date"
              name="birthdate"
              defaultValue={profileData?.Birthdate}
              className="form-input"
            />
          </label>
          <label className="w-full">
            <span className="block text-sm font-medium">Place of Birth</span>
            <input
              type="text"
              name="placeOfBirth"
              defaultValue={profileData?.PlaceofBirth}
              className="form-input"
            />
          </label>
          <label className="w-full">
            <span className="block text-sm font-medium">Student ID</span>
            <input
              type="text"
              name="studentId"
              defaultValue={profileData?.StudentID}
              className="form-input"
            />
          </label>
          <label className="w-full">
            <span className="block text-sm font-medium">Civil Status</span>
            <select
              name="civilStatus"
              defaultValue={profileData?.CivilStatus}
              className="form-input"
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
              <option value="Divorced">Divorced</option>
            </select>
          </label>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex space-x-4">
          <fieldset className="w-full">
            <legend className="block text-sm font-medium">Gender</legend>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  className="form-radio"
                  defaultChecked={profileData?.Gender === "Male"}
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  className="form-radio"
                  defaultChecked={profileData?.Gender === "Female"}
                />
                <span className="ml-2">Female</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  className="form-radio"
                  defaultChecked={profileData?.Gender === "Other"}
                />
                <span className="ml-2">Other</span>
              </label>
            </div>
          </fieldset>
          <label className="w-full">
            <span className="block text-sm font-medium">Country of Citizenship</span>
            <input
              type="text"
              name="citizenship"
              defaultValue={profileData?.Citizenship}
              className="form-input"
            />
          </label>
          <label className="w-full">
            <span className="block text-sm font-medium">UPLB Degree</span>
            <input
              type="text"
              name="degree"
              defaultValue={profileData?.Degree}
              className="form-input"
            />
          </label>
          <label className="w-full">
            <span className="block text-sm font-medium">Graduation Year</span>
            <input
              type="number"
              name="graduationYear"
              defaultValue={profileData?.GraduationYear}
              className="form-input"
              min="1900"
              max={new Date().getFullYear()}
            />
          </label>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={hidePersonalForm} // Use the passed-down function
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
  