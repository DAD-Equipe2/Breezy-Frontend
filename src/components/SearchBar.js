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
      <input
        type="text"
        placeholder="Recherche par #tag ou texte"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="border px-2 py-1 rounded flex-1"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded"
        disabled={false}
      >
        Rechercher
      </button>
    </form>
  );
}

export default SearchBar;