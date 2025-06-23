import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import Navbar from "../../src/components/Navbar";
import PostCard from "../../src/components/PostCard";
import EditButton from "../../src/components/EditButton";
import FollowButton from "../../src/components/FollowButton";
import ImageUploadButton from "../../src/components/ImageUploadButton";
import { AuthContext } from "../../src/context/AuthContext";
import { getProfile, updateProfile, deleteProfile } from "../../src/services/userService";

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user: currentUser } = useContext(AuthContext);

  const [profileData, setProfileData] = useState({ user: null, posts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", bio: "", avatarURL: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { logout } = useContext(AuthContext)


  useEffect(() => {
    if (!router.isReady) return;
    if (!id) {
      setError("Profil introuvable");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { user, posts } = await getProfile(id);
        setProfileData({ user, posts });
        setEditForm({ username: user.username || "", bio: user.bio || "", avatarURL: user.avatarURL || "" });
      } catch (err) {
        setError(err.response?.data?.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, [router.isReady, id]);

  const handleEditChange = (e) =>
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.username.trim()) {
        return alert("Le nom de profil ne peut pas être vide.");
      }
    try {
      let avatarURL = editForm.avatarURL;
      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          return alert("Le fichier dépasse 5 Mo");
        }
        const fd = new FormData();
        fd.append("avatar", selectedFile);
        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile/avatar`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("breezyToken")}`,
            },
            body: fd,
          }
        );
        const json = await uploadRes.json();
        if (json.success) {
          avatarURL = json.data.avatarURL;
        } else {
          return alert(json.message);
        }
      }
      
      const updatedUser = await updateProfile({ username: editForm.username.trim(), bio: editForm.bio, avatarURL });
      setProfileData(prev => ({ ...prev, user: updatedUser }));
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProfile();
      logout();
      localStorage.removeItem("breezyToken");
      router.replace("/");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  if (loading) return <div>Chargement…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const { user, posts } = profileData;
  const isOwn = currentUser && currentUser._id === user._id;

  return (
    <>
      <div className="fixed inset-0 z-0 animate-bg-pan bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-[length:300%_300%]"></div>
      <Navbar />
      <div className="relative max-w-2xl mx-auto mt-8 p-4 min-h-screen pt-20 z-10">
        <div className="relative bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 rounded-3xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-6 mb-6 border border-blue-200/60">
          {isOwn && (
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <EditButton onClick={() => setIsEditing(true)} title="Modifier le profil" />
              
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full bg-red-400 hover:bg-red-500 text-white text-xl shadow transition group"
                onClick={() => setShowDeleteModal(true)}
                title="Supprimer le profil"
                aria-label="Supprimer le profil"
                type="button"
              >
                <span className="group-hover:scale-110 transition-transform">🗑️</span>
              </button>
            </div>
          )}
          <div className="relative flex-shrink-0">
            <img
              src={
                user.avatarURL
                  ? `${process.env.NEXT_PUBLIC_API_URL}${user.avatarURL}`
                  : "/default-avatar.png"
              }
              alt="Avatar"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl bg-white"
            />
          </div>
          <div className="flex-1 flex flex-col items-center sm:items-start min-w-0">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
              {user.username}
              {user.isVerified && (
                <span className="inline-block align-middle text-blue-500" title="Compte vérifié">✔️</span>
              )}
            </h1>
            <p className="text-sm text-gray-600 mb-2">
              Inscrit le {new Date(user.createdAt).toLocaleDateString()}
            </p>
            {user.bio && (
              <div className="bg-white/80 border border-blue-200/60 rounded-xl px-4 py-3 shadow-inner w-full max-w-xl mt-2 overflow-x-auto" style={{maxWidth: '400px'}}>
                <p className="text-gray-800 whitespace-pre-line break-words text-base leading-relaxed max-w-full">
                  {user.bio}
                </p>
              </div>
            )}
          </div>
          {!isOwn && currentUser && (
            <div className="sm:ml-auto mt-4 sm:mt-0 flex flex-col items-center gap-2">
              {!isOwn && currentUser && <FollowButton targetUserId={user._id} />}
            </div>
          )}
        </div>
        {isOwn && isEditing && (
          <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="w-full max-w-md mx-auto">
                <form
                  onSubmit={handleEditSubmit}
                  className="relative bg-white rounded-2xl shadow-2xl p-8 space-y-5 border border-blue-200/60"
                >
                  <button
                    type="button"
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                    }}
                    aria-label="Fermer"
                  >
                  </button>
                  <h2 className="text-lg font-bold text-gray-900 text-center">Éditer votre profil</h2>
                  <div>
                    <label className="block font-medium text-gray-700">
                      Nom de profil :
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleEditChange}
                      maxLength={30}
                      required
                      className="w-full border px-2 py-1 rounded"
                    />
                    <small className="text-gray-600">
                      {editForm.username.length}/30
                    </small>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">Bio :</label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleEditChange}
                      className="w-full border px-2 py-1 rounded"
                      maxLength={100}
                    />
                  <small>{editForm.bio.length}/100</small>
                  </div>
                  <div>
                    <div className="flex flex-col items-center">
                      <ImageUploadButton
                        value={selectedFile}
                        onChange={file => setSelectedFile(file)}
                        accept="image/*"
                      />
                      <span className="text-xs font-semibold text-blue-700 mt-2">Nouvel avatar</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 justify-center">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Sauvegarder
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded"
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedFile(null);
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        <hr className="my-6" />
        <h2 className="text-xl font-semibold mb-4">
          Publications de {user.username}
        </h2>
        {posts.length === 0 ? (
          <p>Aucun post pour le moment.</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} isOwn={isOwn} />)
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-bold mb-2">Supprimer le profil</h2>
              <p className="mb-4 text-gray-700">
                Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est <span className="font-semibold text-red-600">irréversible</span>.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={handleConfirmDelete}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
