import { useState, useContext } from "react";
import { useRouter } from "next/router";
import Navbar from "../src/components/Navbar";
import { AuthContext } from "../src/context/AuthContext";
import { login as loginUser } from "../src/services/authService";

export default function Login() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(formData);
      login(data.token);
      router.push("/feed");
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      setError(apiMessage || err.message || "Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Connexion</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">
              Email ou Nom d’utilisateur
            </label>
            <input
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </>
  );
}
