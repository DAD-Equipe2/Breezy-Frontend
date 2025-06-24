import { ThemeProvider } from 'next-themes';
import Head from "next/head";
import "../styles/globals.css";
import { AuthProvider } from "../src/context/AuthContext";
import LeftSidebar from "../src/components/LeftSidebar";
import RightSidebar from "../src/components/RightSidebar";
import { useContext, useState } from "react";
import { AuthContext } from "../src/context/AuthContext";

function AppLayout({ children }) {
  const { user } = useContext(AuthContext);
  const isHome = typeof window !== "undefined" && window.location.pathname === "/";
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* desktop */}
      {user && !isHome && <LeftSidebar />}
      <main className="flex-1">{children}</main>
      {user && !isHome && <RightSidebar />}

      {/* mobile */}
      {user && !isHome && (
        <button
          className="fixed bottom-6 right-6 z-50 md:hidden bg-blue-600 text-white rounded-full p-4 shadow-lg"
          onClick={() => setShowMobileMenu(true)}
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>
      )}

      {/* Drawer mobile */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/40 flex md:hidden">
          <div className="bg-white dark:bg-blue-950 w-4/5 max-w-xs h-full p-4 flex flex-col gap-6 overflow-y-auto">
            <button
              className="self-end text-2xl mb-2"
              onClick={() => setShowMobileMenu(false)}
              aria-label="Fermer le menu"
            >
              ×
            </button>
            <LeftSidebar mobile />
            <RightSidebar mobile />
          </div>
          <div className="flex-1" onClick={() => setShowMobileMenu(false)} />
        </div>
      )}
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/logo-breezy.png" />
        <title>Breezy</title>
      </Head>
      <ThemeProvider attribute="class">
        <AuthProvider>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
