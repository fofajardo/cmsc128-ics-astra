import { useEffect, useState } from "react";
import axios from "axios";

export default function SearchFilter({ onClose, initialFilters, updateFilters }) {
  const defaultFieldOptions = [
    "Frontend Developer",
    "Backend Developer",
    "Database Developer",
    "Game Designer",
    "Cybersecurity Analyst",
    "Data Scientist",
    "DevOps",
    "Systems Analyst",
  ];
  const [allFields, setAllFields] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/work-experiences/distinct-fields`);
        const fetchedFields = res.data?.list?.map(item => item.field) || [];

        const combined = Array.from(new Set([...defaultFieldOptions, ...fetchedFields]));

        setAllFields(combined);
      } catch (err) {
        console.error("Failed to fetch fields:", err);
      }
    };

    fetchFields();
  }, []);

  const [filters, setFilters] = useState(initialFilters);
  const [skillInput, setSkillInput] = useState("");

  const [fieldSearch, setFieldSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredFields, setFilteredFields] = useState(defaultFieldOptions);

  const handleSkillAdd = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      setFilters({ ...filters, skills: [...filters.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFilters({
      ...filters,
      skills: filters.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleResetAll = () => {
    setFilters({
      yearFrom: "",
      yearTo: "",
      location: "",
      field: "",
      skills: [],
      sortCategory: "",
      sortOrder: "asc",
    });
    setSkillInput("");
    updateFilters({
      yearFrom: "",
      yearTo: "",
      location: "",
      field: "",
      skills: [],
      sortCategory: "",
      sortOrder: "asc",
    });
    setFieldSearch("");
    setShowDropdown(false);
    setFilteredFields(defaultFieldOptions);
    onClose();
  };

  const handleApply = () => {
    updateFilters(filters);
    onClose();
  };

  const closeModal = () => {
    setFilters(initialFilters);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("#field-dropdown-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const query = fieldSearch.trim().toLowerCase();
    if (query === "") {
      setFilteredFields(defaultFieldOptions);
    } else {
      const filtered = allFields.filter(field =>
        field.toLowerCase().startsWith(query)
      );
      setFilteredFields(filtered.slice(0, 10)); // limit to 10 rows
    }
  }, [fieldSearch, allFields]);

  return (
    <div className="flex flex-col bg-astrawhite p-6 max-w-screen rounded-2xl shadow-lg space-y-4">
      <div className="flex justify-between items-center">
        <div className="font-h2">Filter by:</div>
        <button className="text-xl text-astradarkgray hover:text-astrablack font-bold" onClick={closeModal}>×</button>
      </div>

      {/* Graduation Year */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="font-rb">Graduation Year</div>
          <button
            onClick={() => setFilters({ ...filters, yearFrom: "", yearTo: "" })}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Oldest"
            value={filters.yearFrom}
            onChange={(e) => setFilters({ ...filters, yearFrom: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
          />
          <input
            type="number"
            placeholder="Latest"
            value={filters.yearTo}
            onChange={(e) => setFilters({ ...filters, yearTo: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="font-rb">Location</div>
          <button
            onClick={() => setFilters({ ...filters, location: "" })}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>
        <input
          type="text"
          placeholder="Type here"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
        />
      </div>

      {/* Field of Work */}
      <div className="relative" id="field-dropdown-container">
        <div className="flex justify-between items-center mb-1">
          <div className="font-rb">Field of Work</div>
          <button
            onClick={() => {
              setFilters({ ...filters, field: "" });
              setFieldSearch("");
            }}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>
        <input
          type="text"
          placeholder="Search field of work"
          value={fieldSearch}
          onChange={(e) => {
            const value = e.target.value;
            setFieldSearch(value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
        />
        {showDropdown && filteredFields.length > 0 && (
          <ul className="absolute z-10 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-xl mt-1 shadow-lg">
            {filteredFields.map((field, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setFieldSearch(field);
                  setFilters({ ...filters, field });
                  setShowDropdown(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {field}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Skills */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="font-rb">Skills</div>
          <button
            onClick={() => setFilters({ ...filters, skills: [] })}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>
        <input
          type="text"
          placeholder="Type and hit enter"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleSkillAdd}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.skills.map((skill, idx) => (
            <span
              key={idx}
              onClick={() => removeSkill(skill)}
              className={"px-3 py-1 rounded-full border text-sm cursor-pointer transition"}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="font-h2">Sort by:</div>
          <button
            onClick={() => setFilters({ ...filters, sortCategory: "", sortOrder: "asc" })}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>

        <div className="flex">
          <select
            value={filters.sortCategory}
            onChange={(e) => setFilters({ ...filters, sortCategory: e.target.value })}
            className="flex-grow px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
          >
            <option value="">Select Category</option>
            <option value="year">Graduation Year</option>
            <option value="name">Alumni Name</option>
            <option value="location">Location</option>
            <option value="field">Field of Work</option>
          </select>

          <div className="flex ml-2">
            {["asc", "desc"].map((order) => (
              <button
                key={order}
                onClick={() => setFilters({ ...filters, sortOrder: order })}
                className={`flex-1 px-2 md:px-4 font-sb transition ${
                  filters.sortOrder === order
                    ? "bg-astraprimary text-white"
                    : "bg-white text-astraprimary border border-astraprimary"
                }`}
              >
                {order === "asc" ? "Ascending" : "Descending"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          className="w-full py-4 rounded-md border border-astraprimary text-astraprimary hover:bg-astralight/20 transition font-rb"
          onClick={handleResetAll}
        >
          Reset All
        </button>
        <button
          className="w-full py-4 rounded-md bg-astraprimary text-white hover:bg-astradark transition font-rb"
          onClick={handleApply}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}