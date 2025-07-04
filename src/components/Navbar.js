import Link from "next/link";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const pathname = usePathname();
  const showSearchBar =
    pathname === "/feed" ||
    pathname === "/search" ||
    pathname.startsWith("/profile");

  return (
    <nav className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-md p-4 flex flex-col md:flex-row md:items-center md:justify-between z-30">
      <div className="flex items-center justify-between w-full">
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center text-blue-500 font-bold text-2xl">
            <img src="/logo-breezy.png" alt="Breezy Logo" className="h-12 w-12 object-contain mr-1" />
            <span className="text-2xl">Breezy</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4 flex-shrink-0 md:ml-4">
          <ThemeToggle />
          {user ? (
            <>
              <Link href={`/profile/${user._id}`} className="flex items-center">
                <img
                  src={user.avatarURL ? `${process.env.NEXT_PUBLIC_API_URL}${user.avatarURL}` : "/default-avatar.png"}
                  alt="Mon profil"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 hover:border-blue-600 transition shadow"
                />
              </Link>
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
      </div>
      {user && showSearchBar && (
        <div className="w-full flex justify-center mt-4 md:mt-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 pointer-events-none">
          <div className="w-full max-w-md pointer-events-auto">
            <SearchBar />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
