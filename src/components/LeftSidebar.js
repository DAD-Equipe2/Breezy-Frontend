import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LeftSidebar({ mobile = false }) {
  const { user, logout } = useContext(AuthContext);
  return (
    <aside
      className={
        mobile
          ? "flex flex-col items-center w-full p-0"
          : "hidden md:flex flex-col items-center fixed left-0 top-0 h-screen w-1/4 max-w-xs p-6 z-20"
      }
    >
      <div className="bg-white/80 dark:bg-blue-950/80 rounded-2xl shadow-xl border border-blue-200/60 dark:border-blue-900/60 w-full p-6 mt-0 md:mt-24">
        <h2 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-4">Menu</h2>
        <nav className="flex flex-col gap-3">
          <Link href="/feed" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition font-medium text-gray-800 dark:text-gray-100">
            <span>🏠</span> Accueil
          </Link>
          {user && (
            <Link href={`/profile/${user._id}`} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition font-medium text-gray-800 dark:text-gray-100">
              <span>👤</span> Profil
            </Link>
          )}
          <Link href="/aboutUs" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition font-medium text-gray-800 dark:text-gray-100">
            <span>ℹ️</span> À propos
          </Link>
          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition font-medium text-red-600 dark:text-red-400 mt-2"
            >
              <span>🚪</span> Déconnexion
            </button>
          )}
        </nav>
      </div>
    </aside>
  );
}
