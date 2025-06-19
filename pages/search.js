import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../src/components/Navbar";
import PostCard from "../src/components/PostCard";
import { searchPosts } from "../src/services/postService";

export default function SearchPage() {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchPosts(query)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold mb-4">
          Résultats pour « {query} »
        </h2>
        {loading ? (
          <div>Recherche en cours…</div>
        ) : results.length === 0 ? (
          <p>Aucun résultat.</p>
        ) : (
          results.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </>
  );
}