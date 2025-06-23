'use client';

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
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <div className="absolute inset-0 z-0 animate-bg-pan bg-[linear-gradient(var(--grad-angle),var(--grad-from),var(--grad-to))] bg-[length:300%_300%]"></div>
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-2xl mx-auto mt-8 p-4 pt-20">
          <h2 className="text-2xl font-bold mb-4">Résultats pour « {query} »</h2>
          {loading ? (
            <div>Recherche en cours…</div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Profils</h3>
                {userResults.length === 0 ? (
                  <p>Aucun profil trouvé.</p>
                ) : (
                  <ul>
                    {userResults.map((user) => (
                      <li key={user._id} className="mb-2 flex items-center gap-2">
                        <a
                          href={`/profile/${user._id}`}
                          className="text-blue-600 dark:text-blue-300 hover:underline font-semibold"
                        >
                          {user.username}
                        </a>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.followersCount} followers · {user.followingCount} abonnements
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
      </div>
    </div>
  );
}
