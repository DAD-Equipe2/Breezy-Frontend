'use client';

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

import Navbar from "../src/components/Navbar";
import { AuthContext } from "../src/context/AuthContext";
import { login as loginUser } from "../src/services/authService";

export default function Login() {
  const router = useRouter();
  const { login, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      window.location.href = "/feed";    }
  }, [user, router]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await loginUser(formData);
      window.location.href = "/feed";    
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      setError(apiMessage || err.message || "Erreur de connexion");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col text-foreground">
      <div className="absolute inset-0 z-0 animate-bg-pan bg-[linear-gradient(var(--grad-angle),var(--grad-from),var(--grad-to))] bg-[length:300%_300%]"></div>
      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />
        <main className="relative z-10 flex items-center justify-center px-4 min-h-screen pt-20">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/50 dark:border-white/20 rounded-3xl p-10 w-full max-w-sm shadow-2xl space-y-6"
          >
            <h1 className="text-2xl font-extrabold text-center text-white dark:text-gray-100">
              Connexion
            </h1>

            {error && (
              <div className="bg-red-500/80 text-white text-sm p-3 rounded text-center">
                {error}
              </div>
            )}

            <input
              name="emailOrUsername"
              type="text"
              placeholder="Email ou nom d'utilisateur"
              value={formData.emailOrUsername}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white/20 dark:bg-white/10 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white/20 dark:bg-white/10 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl w-full font-semibold transition-transform transform hover:scale-105 disabled:opacity-60"
            >
            </button>
          </motion.form>
        </main>
      </div>
    </div>
  );
}
