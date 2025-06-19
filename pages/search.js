import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../src/components/Navbar";
import PostCard from "../src/components/PostCard";
import { searchPosts } from "../src/services/postService";
import { searchUsers } from "../src/services/userService";

export default function SearchPage() {
  const router = useRouter();
  const { query } = router.query;
  const [postResults, setPostResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    Promise.all([searchUsers(query), searchPosts(query)])
      .then(([users, posts]) => {
        setUserResults(users);
        setPostResults(posts);
      })
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
        ) : (
          <>
            {/* Affichage des profils */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Profils</h3>
              {userResults.length === 0 ? (
                <p>Aucun profil trouvé.</p>
              ) : (
                <ul>
                  {userResults.map((user) => (
                    <li key={user._id} className="mb-2 flex items-center gap-2">
                      <a
                        href={`/profile/${user.username}`}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        {user.username}
                      </a>
                      <span className="text-xs text-gray-500">
                        {user.followersCount} followers · {user.followingCount} abonnements
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Affichage des posts */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Posts</h3>
              {postResults.length === 0 ? (
                <p>Aucun post trouvé.</p>
              ) : (
                postResults.map((post) => <PostCard key={post._id} post={post} />)
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}