import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="flex items-center p-1 w-96 ml-48 bg-white rounded-lg shadow-md">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        className="w-full p-1 text-lg text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:border-S-Green"
        placeholder="Search for a track..."
      />
    </div>
  );
};

export default SearchBar;
