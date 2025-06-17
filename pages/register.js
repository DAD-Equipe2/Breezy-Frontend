import { useState, useContext } from "react";
import { useRouter } from "next/router";
import Navbar from "../src/components/Navbar";
import { AuthContext } from "../src/context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "", email: "", password: "", bio: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5*1024*1024) {
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
      if (avatarFile) data.append("avatar", avatarFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          body: data,
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      login(json.data.token);
      router.push("/feed");
    } catch (err) {
      setError(err.message || "Erreur inscription");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Inscription</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Pseudo"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="bio"
            placeholder="Bio (optionnelle)"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <div>
            <label className="block font-medium">Avatar (optionnel)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Inscription..." : "S’inscrire"}
          </button>
        </form>
      </div>
    </>
  );
}
