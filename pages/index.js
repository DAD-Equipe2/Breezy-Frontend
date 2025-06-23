'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../src/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  return (
    <>
      <div className="relative min-h-screen overflow-hidden text-foreground">
        <div className="absolute inset-0 z-0 animate-bg-pan bg-[linear-gradient(var(--grad-angle),var(--grad-from),var(--grad-to))] bg-[length:300%_300%]"></div>

        <main className="relative z-10 flex items-center justify-center px-4 min-h-screen">
          <div className="backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/50 dark:border-white/30 rounded-3xl p-10 max-w-lg w-full shadow-2xl text-center">
            <h1 className="text-5xl font-extrabold mb-6 drop-shadow-xl text-white dark:text-gray-100">
              Bienvenue sur <span className="text-blue-700 dark:text-blue-400">Breezy</span>
            </h1>
            <p className="text-white dark:text-gray-300 text-lg mb-10 font-semibold drop-shadow-md">
              Exprime-toi. Inspire. Envole-toi avec <span className="text-blue-600 dark:text-blue-300 font-semibold">Breezy</span>.
            </p>

            {user ? (
              router.push('/feed')
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold transition-transform transform hover:scale-105 shadow-lg"
                >
                  Créer un compte
                </Link>
                <Link
                  href="/login"
                  className="bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 text-blue-900 dark:text-blue-200 px-6 py-3 rounded-full text-sm font-bold transition-transform transform hover:scale-105 border border-white/70"
                >
                  Se connecter
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
