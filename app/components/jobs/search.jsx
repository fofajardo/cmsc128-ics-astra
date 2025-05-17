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
    <div className="bg-astrawhite max-w-4xl min-w-md w-7/10 h-[55px] rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] py-6 flex items-center justify-between gap-2 mb-4">
      <div className="h-full flex items-center gap-3 ml-3 w-full">
        <Search className="text-[var(--color-astradarkgray)]" size={28} />
        <input
          type="text"
          placeholder="Search for job title"
          value={searchString}
          onChange={handleChange}
          className="font-normal text-sm text-astradarkgray outline-none border-0 border-astraprimary/50 pr-4 w-full transition-all duration-150 ease-in"
        />
      </div>
    </div>
  );
}
