import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchString, setSearchString] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchString(value);
    onSearch(value); // Immediately notify parent
  };

  return (
    <div className="w-full max-w-[1000px] px-4">
      <div className="flex items-stretch w-full border border-astragray bg-astrawhite mb-6">
        <input
          type="text"
          placeholder="Search for a job title"
          className="flex-grow py-4 pl-6 focus:outline-none text-base text-astradark"
          value={searchString}
          onChange={handleChange}
        />
        <button className="px-6 bg-astraprimary hover:bg-astradark text-astrawhite font-semibold transition flex items-center gap-2 cursor-pointer">
          Search
        </button>
      </div>
    </div>
  );
}
