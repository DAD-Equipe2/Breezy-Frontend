import Link from "next/link";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const pathname = usePathname();
  const isOnFeed = pathname === "/feed" || pathname.startsWith("/profile");

  return (
    <nav className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-md p-4 flex items-center justify-between z-30">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center">
        <Link href="/" className="flex items-center text-blue-500 font-bold text-2xl">
          <img src="/logo-breezy.png" alt="Breezy Logo" className="h-12 w-12 object-contain mr-1" />
          <span className="text-2xl">Breezy</span>
        </Link>
      </div>

      {/* SearchBar */}
      {user && isOnFeed && (
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>
      )}

      {/* Liens */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {user ? (
          <>
            <Link href={`/profile/${user._id}`} className="text-blue-500 font-bold hover:underline">
              Profil
            </Link>
            <button onClick={logout} className="text-red-500 font-bold hover:underline">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-blue-500 font-bold hover:underline">
              Connexion
            </Link>
            <Link href="/register" className="text-blue-500 font-bold hover:underline">
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
