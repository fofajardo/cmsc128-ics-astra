import { useState } from "react";

export default function SearchFilter() {
  const [filters, setFilters] = useState({
    yearFrom: "",
    yearTo: "",
    location: "",
    field: "",
    skills: [],
    sortCategory: "",
    sortOrder: "asc",
  });

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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Filter by:</h2>

      {/* Graduation Year */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="font-medium">Graduation Year</label>
          <button
            onClick={() => setFilters({ ...filters, yearFrom: '', yearTo: '' })}
            className="text-blue-500 text-sm"
          >
            Reset
          </button>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Oldest"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={filters.yearFrom}
            onChange={(e) => setFilters({ ...filters, yearFrom: e.target.value })}
          />
          <input
            type="text"
            placeholder="Latest"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={filters.yearTo}
            onChange={(e) => setFilters({ ...filters, yearTo: e.target.value })}
          />
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="font-medium">Location</label>
          <button onClick={() => setFilters({ ...filters, location: '' })} className="text-blue-500 text-sm">
            Reset
          </button>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
      </div>

      {/* Field of Work */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="font-medium">Field of Work</label>
          <button onClick={() => setFilters({ ...filters, field: '' })} className="text-blue-500 text-sm">
            Reset
          </button>
        </div>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={filters.field}
          onChange={(e) => setFilters({ ...filters, field: e.target.value })}
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
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="font-medium">Skills</label>
          <button onClick={() => setFilters({ ...filters, skills: [] })} className="text-blue-500 text-sm">
            Reset
          </button>
        </div>
        <input
          type="text"
          placeholder="Type and hit enter"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleSkillAdd}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
        />
        <div className="flex flex-wrap gap-2">
          {filters.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-200 text-sm rounded-full cursor-pointer hover:bg-red-100"
              onClick={() => removeSkill(skill)}
            >
              {skill} &times;
            </span>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="font-medium">Sort by</label>
          <button
            onClick={() => setFilters({ ...filters, sortCategory: '', sortOrder: 'asc' })}
            className="text-blue-500 text-sm"
          >
            Reset
          </button>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filters.sortCategory || ''}
            onChange={(e) => setFilters({ ...filters, sortCategory: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
          >
            <option value="">Select a category</option>
            <option value="year">Graduation Year</option>
            <option value="name">Alumni Name</option>
            <option value="location">Location</option>
            <option value="field">Field of Work</option>
          </select>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="sortOrder"
                value="asc"
                checked={filters.sortOrder === 'asc'}
                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                className="accent-blue-600"
              />
              Asc
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="sortOrder"
                value="desc"
                checked={filters.sortOrder === 'desc'}
                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                className="accent-blue-600"
              />
              Desc
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50">
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Apply Filters ({filters.skills.length})
        </button>
      </div>
    </div>
  );
}
