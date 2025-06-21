import { useEffect } from "react";
import Navbar from "../src/components/Navbar";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">La page que vous recherchez est introuvable.</p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => router.push("/")}
        >
          Retour à l'accueil
        </button>
      </div>
    </>
  );
}
