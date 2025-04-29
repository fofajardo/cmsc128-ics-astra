import { useState } from "react";

export default function SearchFilter({ onClose, initialFilters, updateFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const [skillInput, setSkillInput] = useState("");

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
    }); // Update parent state
    onClose(); // Close modal
  };

  const handleApply = () => {
    updateFilters(filters); // Update parent state with current filters
    onClose(); // Close modal
  };

  const closeModal = () => {
    setFilters(initialFilters);
    onClose();
  };

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
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="font-rb">Field of Work</div>
          <button
            onClick={() => setFilters({ ...filters, field: "" })}
            className="text-astraprimary font-sb text-sm"
          >
            Reset
          </button>
        </div>
        <select
          value={filters.field}
          onChange={(e) => setFilters({ ...filters, field: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-r"
        >
          <option value="">Select alumni's field of work</option>
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
          <option>Database Developer</option>
          <option>Game Designer</option>
          <option>Cybersecurity Analyst</option>
          <option>Data Scientist</option>
          <option>DevOps</option>
          <option>Systems Analyst</option>
        </select>
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