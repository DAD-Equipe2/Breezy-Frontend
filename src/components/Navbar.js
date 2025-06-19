import Link from "next/link";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const pathname = usePathname();
  const isOnFeed = pathname === "/feed";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-md p-4 flex items-center justify-between z-30">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link href="/" className="text-xl font-bold">
          Breezy
        </Link>
      </div>

      {/* SearchBar centrée seulement sur /feed */}
      {user && isOnFeed && (
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>
      )}

      {/* Liens à droite */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {user ? (
          <>
            <Link href="/feed" className="hover:underline">
              Fil d’actualités
            </Link>
            <Link href={`/profile/${user._id}`} className="hover:underline">
              Profil
            </Link>
            <button onClick={logout} className="text-red-500 hover:underline">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Connexion
            </Link>
            <Link href="/register" className="hover:underline">
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
