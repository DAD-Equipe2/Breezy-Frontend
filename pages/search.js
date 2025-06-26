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
  const [visibleUsers, setVisibleUsers] = useState(5);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    Promise.all([searchUsers(query), searchPosts(query)])
      .then(([users, posts]) => {
        setUserResults(users);
        setPostResults(posts);
        setVisibleUsers(5);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const handleShowMore = () => {
    setVisibleUsers((prev) => prev + 5);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <div className="absolute inset-0 z-0 animate-bg-pan bg-[linear-gradient(var(--grad-angle),var(--grad-from),var(--grad-to))] bg-[length:300%_300%]"></div>
      <Navbar />
      <main className="relative z-10">
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
                  <>
                    <ul className="space-y-4">
                      {userResults.slice(0, visibleUsers).map((user) => (
                        <li
                          key={user._id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700"
                        >
                          <img
                            src={user.avatarURL ? `${process.env.NEXT_PUBLIC_API_URL}${user.avatarURL}` : "/default-avatar.png"}
                            alt={user.username}
                            className="w-14 h-14 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                          />
                          <div className="flex-1">
                            <a
                              href={`/profile/${user._id}`}
                              className="text-lg font-semibold text-blue-600 dark:text-blue-300 hover:underline"
                            >
                              {user.username}
                            </a>
                            <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600 dark:text-gray-300">
                              <span>
                                <span className="font-bold">{user.followersCount}</span> abonnés
                              </span>
                              <span>
                                <span className="font-bold">{user.followingCount}</span> abonnements
                              </span>
                              <span>
                                <span className="font-bold">{user.postsCount ?? 0}</span> posts
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {visibleUsers < userResults.length && (
                      <div className="flex justify-center mt-4">
                        <button
                          className="px-4 py-2 rounded bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                          onClick={handleShowMore}
                        >
                          Afficher plus
                        </button>
                      </div>
                    )}
                  </>
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
      </main>
    </div>
  );
}
