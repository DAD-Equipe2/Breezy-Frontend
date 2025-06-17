import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Breezy
      </Link>

      <div className="flex items-center space-x-4">
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
