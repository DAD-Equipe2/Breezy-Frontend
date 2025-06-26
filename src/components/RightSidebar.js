import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";

export default function RightSidebar({ mobile = false }) {
  const { user } = useContext(AuthContext);
  const [following, setfollowing] = useState([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/follow/following/${user._id}`,
          {
            credentials: "include"
          }
        );
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setfollowing(json.data.slice(0, 10));
        } else {
          setfollowing([]);
        }
      } catch (e) {
        setfollowing([]);
      }
    })();
  }, [user]);

  return (
    <aside
      className={
        mobile
          ? "flex flex-col items-center w-full p-0"
          : "hidden md:flex flex-col items-center fixed right-0 top-0 h-screen w-1/4 max-w-xs p-6 z-20"
      }
    >
      <div className="bg-white/80 dark:bg-blue-950/80 rounded-2xl shadow-xl border border-blue-200/60 dark:border-blue-900/60 w-full p-6 mt-0 md:mt-24">
        <h2 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-4">
          Comptes suivis
        </h2>
        {following.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            Aucun abonné à afficher.
          </p>
        ) : (
          <ul className="space-y-3">
            {following.map((f) => (
              <li key={f._id} className="flex items-center gap-3">
                <Link
                  href={`/profile/${f._id}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <img
                    src={
                      f.avatarURL
                        ? `${process.env.NEXT_PUBLIC_API_URL}${f.avatarURL}`
                        : "/default-avatar.png"
                    }
                    alt={f.username}
                    className="w-8 h-8 rounded-full object-cover border border-blue-200 dark:border-blue-900 bg-white dark:bg-blue-900"
                  />
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {f.username}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
