import { useEffect, useState, useContext } from "react";
import Navbar from "../src/components/Navbar";
import { AuthContext } from "../src/context/AuthContext";

export default function AdminPage() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "administrator") return;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          credentials: "include",
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setUsers(json.data);
        } else {
          setError(json.message || "Erreur lors du chargement des utilisateurs");
        }
      } catch (e) {
        setError("Erreur lors du chargement des utilisateurs");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  const handleRoleChange = async (userId, newRole) => {
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("breezyToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        setSuccess("Rôle mis à jour avec succès");
      } else {
        setError(json.message || "Erreur lors de la modification du rôle");
      }
    } catch (e) {
      setError("Erreur lors de la modification du rôle");
    }
  };

  if (!currentUser || currentUser.role !== "administrator") {
    return <div className="text-center mt-20 text-red-600">Accès refusé.</div>;
  }

  return (
    <>
      <div className="fixed inset-0 z-0 animate-bg-pan bg-[linear-gradient(var(--grad-angle),var(--grad-from),var(--grad-to))] bg-[length:300%_300%]"></div>
      <Navbar />
      <main className="relative max-w-2xl mx-auto mt-8 p-6 min-h-screen pt-20 z-10 text-foreground">
        <div className="bg-white/80 dark:bg-blue-950/80 rounded-2xl shadow-xl border border-blue-200/60 dark:border-blue-900/60 p-8">
          <h1 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center">Gestion des rôles utilisateurs</h1>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {success && <div className="text-green-600 mb-4">{success}</div>}
          {loading ? (
            <div>Chargement…</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-200 dark:border-blue-900">
                  <th className="py-2 text-left">Nom d'utilisateur</th>
                  <th className="py-2 text-left">Email</th>
                  <th className="py-2 text-left">Rôle</th>
                  <th className="py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-blue-100 dark:border-blue-900">
                    <td className="py-2">{u.username}</td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2 capitalize">{u.role}</td>
                    <td className="py-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="border rounded px-2 py-1 bg-white dark:bg-blue-900 text-gray-900 dark:text-white"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="moderator">Modérateur</option>
                        <option value="administrator">Administrateur</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
