import "../styles/globals.css";
import { AuthProvider } from "../src/context/AuthContext";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/logo-breezy.png" />
        <title>Breezy</title> {/* Tu peux aussi modifier le titre ici */}
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
