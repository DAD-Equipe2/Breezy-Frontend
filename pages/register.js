"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Navbar from "../src/components/Navbar";
import ImageUploadButton from "../src/components/ImageUploadButton";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert("5 Mo max");
      return;
    }
    setAvatarFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("bio", formData.bio);

      if (avatarFile) {
        data.append("avatar", avatarFile);
      } else {
        data.append("avatarUrl", "/default-avatar.png");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          body: data,
          credentials: "include"
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      router.push("/feed");
    } catch (err) {
      setError(err.message || "Erreur inscription");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col text-foreground">
      <div className="absolute inset-0 z-0 animate-bg-pan bg-[linear-gradient(var(--grad-angle),var(--grad-from),var(--grad-to))] bg-[length:300%_300%]"></div>

      <Navbar />

      <main className="relative z-10 flex items-center justify-center px-4 min-h-screen pt-20">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/50 dark:border-white/20 rounded-3xl p-10 w-full max-w-sm shadow-2xl space-y-5"
        >
          <h1 className="text-2xl font-extrabold text-center text-white dark:text-gray-100">Inscription</h1>

          {error && (
            <div className="bg-red-500/80 text-white text-sm p-3 rounded text-center">
              {error}
            </div>
          )}

          <input
            name="username"
            placeholder="Pseudo"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 dark:bg-white/10 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 dark:bg-white/10 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 dark:bg-white/10 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="bio"
            placeholder="Bio (optionnelle)"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 dark:bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />

          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <ImageUploadButton onChange={handleFile} id="register-avatar-upload" />
              <span className="text-xs text-white/70 mt-1">Ajouter un avatar</span>
            </div>
            {avatarFile && (
              <span className="text-xs text-white/80">{avatarFile.name}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl w-full font-semibold transition-transform transform hover:scale-105 disabled:opacity-60"
          >
            {loading ? "Inscription..." : "S’inscrire"}
          </button>
        </motion.form>
      </main>
    </div>
  );
}
