import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "../src/context/AuthContext";
import Navbar from "../src/components/Navbar";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur Breezy</h1>
        {user ? (
          <Link href="/feed" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">

              Aller au fil d’actualités
          </Link>
        ) : (
          <div className="space-x-4">
            <Link href="/login" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Connexion

            </Link>
            <Link href="/register" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Inscription
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
