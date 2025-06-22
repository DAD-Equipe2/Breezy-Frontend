import { useState } from "react";
import { useRouter } from "next/router";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 items-center w-full">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Recherche par #tag ou texte"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border-none px-4 py-2 rounded-full w-full pr-12 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-lg transition-all duration-200 text-gray-800 placeholder-gray-400"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Rechercher"
        >
          {/* Icone recherche */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </form>
  );
}

export default SearchBar;