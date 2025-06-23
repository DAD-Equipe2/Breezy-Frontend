import "../styles/globals.css";
import { AuthProvider } from "../src/context/AuthContext";
import { ThemeProvider } from 'next-themes';
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/logo-breezy.png" />
        <title>Breezy</title>
      </Head>
      <ThemeProvider attribute="class">
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
